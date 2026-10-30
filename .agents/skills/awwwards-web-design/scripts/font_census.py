#!/usr/bin/env python3
"""Census of web fonts actually shipped by live award-winning sites.

For each live URL: fetch the HTML, its inline <style> blocks and up to --max-css
linked stylesheets, then collect @font-face family names (normalised: next/font
hashes, "Fallback" aliases and quotes stripped), Google Fonts / Adobe Fonts
usage, and font file hosts. Aggregates by number of SITES using each family.

  python3 font_census.py --corpus data/corpus.jsonl --since 2024 --out data/font_census.json --workers 12
"""
import argparse
import concurrent.futures as cf
import json
import re
import sys
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
FACE_RE = re.compile(r"@font-face\s*\{(.*?)\}", re.S | re.I)
FAMILY_RE = re.compile(r"font-family\s*:\s*([^;}{]+)", re.I)
SRC_RE = re.compile(r"url\(\s*['\"]?([^'\")]+\.(?:woff2?|ttf|otf))", re.I)
LINK_RE = re.compile(r"<link[^>]+rel=[\"']?stylesheet[^>]*>", re.I)
HREF_RE = re.compile(r"href=[\"']([^\"']+)[\"']", re.I)
STYLE_RE = re.compile(r"<style[^>]*>(.*?)</style>", re.S | re.I)
GF_RE = re.compile(r"fonts\.googleapis\.com/css2?\?([^\"'\s>]+)", re.I)
GENERIC = {"serif", "sans-serif", "monospace", "system-ui", "inherit", "initial", "cursive", "fantasy",
           "-apple-system", "blinkmacsystemfont", "arial", "helvetica", "helvetica neue", "times new roman",
           "segoe ui", "roboto", "ui-sans-serif", "ui-monospace", "ui-serif", "georgia", "courier new", "var"}


def get(url, timeout=15, limit=3_000_000):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(limit).decode("utf-8", errors="replace"), r.geturl()


def norm(name: str) -> str:
    n = name.strip().strip("'\"").strip()
    n = re.sub(r"^__", "", n)                       # next/font: __Inter_d65c78
    n = re.sub(r"_[0-9a-f]{5,8}$", "", n)
    n = re.sub(r"\s*Fallback.*$", "", n, flags=re.I)
    n = re.sub(r"[-_ ](Regular|Bold|Medium|Light|Book|Italic|Variable|VF|Web|Semibold|SemiBold|Black|Thin|Roman)$", "", n, flags=re.I)
    n = n.replace("_", " ").strip()
    return n


ICON_FONTS = re.compile(r"icon|awesome|swiper|slick|dashicons|woocommerce|judgeme|^star$|glyph|oke-widget|eicons|material symbols|^mono$|^sans$|^serif$|&quot", re.I)


def canon(name: str) -> str:
    """Merge spelling variants: 'PPNeueMontreal', 'Ppneuemontreal', 'PP Neue Montreal Medium Placeholder'."""
    n = re.sub(r"\s*Placeholder$", "", name, flags=re.I)
    n = re.sub(r"\s+(Regular|Medium|Bold|Light|Book|Variable|Display|Text)(\s+Placeholder)?$", "", n, flags=re.I) if not re.search(r"(Inter|Helvetica Now) Display", n) else n
    return re.sub(r"[^a-z0-9]", "", n.lower())


def aggregate(results: list) -> dict:
    ok = [r for r in results if not r["error"]]
    names: dict = {}
    fam_sites = Counter()
    for r in ok:
        keys = set()
        for f in r["families"]:
            if ICON_FONTS.search(f):
                continue
            k = canon(f)
            if not k:
                continue
            names.setdefault(k, Counter())[re.sub(r"\s*Placeholder$", "", f)] += 1
            keys.add(k)
        fam_sites.update(keys)
    display = {k: c.most_common(1)[0][0] for k, c in names.items()}
    google = Counter(f for r in ok for f in set(r["google"]))
    hosts = Counter(h for r in ok for h in set(r["font_hosts"]))
    framer = sum(1 for r in ok if any("Placeholder" in f for f in r["families"]))
    return {
        "sites_checked": len(results), "sites_ok": len(ok),
        "sites_with_families": sum(1 for r in ok if r["families"]),
        "families_by_site_count": [(display[k], c) for k, c in fam_sites.most_common(160)],
        "google_fonts_by_site_count": google.most_common(40),
        "sites_using_google_fonts": sum(1 for r in ok if r["google"]),
        "sites_using_adobe_fonts": sum(1 for r in ok if r["typekit"]),
        "sites_on_framer_font_pipeline": framer,
        "font_hosts": hosts.most_common(25),
        "families_per_site_distribution": sorted(Counter(len([f for f in r["families"] if not ICON_FONTS.search(f)]) for r in ok).items()),
        "per_site": results,
    }


def census_site(url: str, max_css: int):
    out = {"url": url, "families": [], "google": [], "typekit": False, "font_hosts": [], "error": None}
    try:
        html, final = get(url)
    except Exception as exc:
        out["error"] = str(exc)[:120]
        return out
    css_blobs = STYLE_RE.findall(html)
    hrefs = [HREF_RE.search(l).group(1) for l in LINK_RE.findall(html) if HREF_RE.search(l)]
    for g in GF_RE.findall(html):
        fams = re.findall(r"family=([^&:]+)", urllib.parse.unquote(g))
        out["google"] += [f.replace("+", " ") for f in fams]
    out["typekit"] = "use.typekit.net" in html or "p.typekit.net" in html
    for h in hrefs[:max_css]:
        full = urllib.parse.urljoin(final, h.replace("&amp;", "&"))
        if "fonts.googleapis.com" in full:
            continue
        try:
            css, _ = get(full, timeout=12)
            css_blobs.append(css)
        except Exception:
            continue
    fams, hosts = set(), set()
    for css in css_blobs:
        for face in FACE_RE.findall(css):
            m = FAMILY_RE.search(face)
            if m:
                fam = norm(m.group(1).split(",")[0])
                if fam and fam.lower() not in GENERIC and len(fam) < 50:
                    fams.add(fam)
            for src in SRC_RE.findall(face):
                hosts.add(urllib.parse.urlparse(urllib.parse.urljoin(final, src)).netloc)
    # Framer / Webflow sometimes declare families only in inline font-family usage.
    if not fams:
        for m in FAMILY_RE.findall(" ".join(css_blobs) + html[:400000]):
            fam = norm(m.split(",")[0])
            if fam and fam.lower() not in GENERIC and not fam.lower().startswith("var(") and len(fam) < 40:
                fams.add(fam)
    out["families"] = sorted(fams)
    out["font_hosts"] = sorted(hosts)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--since", type=int, default=2024)
    ap.add_argument("--workers", type=int, default=12)
    ap.add_argument("--max-css", type=int, default=6)
    ap.add_argument("--reaggregate", action="store_true", help="recompute from an existing --out file, no fetching")
    a = ap.parse_args()
    if a.reaggregate:
        summary = aggregate(json.loads(a.out.read_text())["per_site"])
        a.out.write_text(json.dumps(summary, indent=1, ensure_ascii=False))
        print(json.dumps({k: v for k, v in summary.items() if k != "per_site"}, ensure_ascii=False)[:5000])
        return
    sys.path.insert(0, str(Path(__file__).parent))
    from awwwards_corpus import record_year
    recs = [json.loads(l) for l in a.corpus.read_text().splitlines() if l.strip()]
    urls = sorted({r["live_url"] for r in recs if r.get("live_url") and record_year(r) >= a.since})
    results = []
    with cf.ThreadPoolExecutor(max_workers=a.workers) as pool:
        for i, res in enumerate(pool.map(lambda u: census_site(u, a.max_css), urls), 1):
            results.append(res)
            if i % 50 == 0:
                print(f"[fonts] {i}/{len(urls)}", file=sys.stderr)
    summary = aggregate(results)
    a.out.write_text(json.dumps(summary, indent=1, ensure_ascii=False))
    print(json.dumps({k: v for k, v in summary.items() if k != "per_site"}, indent=1)[:6000])


if __name__ == "__main__":
    main()
