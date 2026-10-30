#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright==1.63.0"]
# ///
"""Run site_probe.py and element_frames.py over a sample.json, in parallel, resumably.

  python3 gather_evidence.py --sample data/sample.json --out evidence --jobs 4

Layout: <out>/probes/<slug>/ (screenshots + probe.json), <out>/frames/<slug>/<n>/ (element frames).
Existing outputs are skipped, failures are listed in <out>/evidence_status.json.
"""
import argparse
import concurrent.futures as cf
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def run_site(site, out: Path, frames: int):
    slug, status = site["slug"], {"slug": site["slug"]}
    probe_dir = out / "probes" / slug
    if not (probe_dir / "probe.json").exists():
        proc = subprocess.run([sys.executable, str(HERE / "site_probe.py"), site["live_url"], "--out", str(out / "probes"),
                               "--name", slug, "--steps", "7"], capture_output=True, text=True, timeout=420)
        status["probe_rc"] = proc.returncode
        if proc.returncode:
            status["probe_err"] = proc.stderr.strip().splitlines()[-1:] if proc.stderr else None
    status["probe"] = (probe_dir / "probe.json").exists()
    status["shots"] = len(list(probe_dir.glob("*.jpg"))) if probe_dir.exists() else 0
    status["elements"] = []
    for i, el in enumerate(site.get("elements", [])):
        fdir = out / "frames" / slug / f"{i}"
        if not (fdir / "meta.json").exists():
            proc = subprocess.run([sys.executable, str(HERE / "element_frames.py"), el["media"], "--out", str(fdir),
                                   "--frames", str(frames)], capture_output=True, text=True, timeout=240)
            if proc.returncode:
                status["elements"].append({"i": i, "title": el.get("title"), "ok": False})
                continue
        (fdir / "element.json").write_text(json.dumps(el))
        status["elements"].append({"i": i, "title": el.get("title"), "tags": el.get("tags"), "ok": True})
    return status


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--frames", type=int, default=8)
    a = ap.parse_args()
    sites = json.loads(a.sample.read_text())
    a.out.mkdir(parents=True, exist_ok=True)
    results = []
    with cf.ThreadPoolExecutor(max_workers=a.jobs) as pool:
        futs = {pool.submit(run_site, s, a.out, a.frames): s["slug"] for s in sites}
        for fut in cf.as_completed(futs):
            try:
                res = fut.result()
            except Exception as exc:
                res = {"slug": futs[fut], "error": str(exc)[:200]}
            results.append(res)
            print(json.dumps(res), flush=True)
    (a.out / "evidence_status.json").write_text(json.dumps(sorted(results, key=lambda r: r["slug"]), indent=1))
    ok = sum(1 for r in results if r.get("probe"))
    print(f"{ok}/{len(results)} probes ok", file=sys.stderr)


if __name__ == "__main__":
    main()
