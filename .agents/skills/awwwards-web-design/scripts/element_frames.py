#!/usr/bin/env python3
"""Download an Awwwards element video (or any mp4/webm URL) and extract evenly spaced frames.

  python3 element_frames.py https://assets.awwwards.com/awards/element/....mp4 --out frames/menu --frames 8

Writes <out>/clip.mp4, <out>/f00.jpg ... f07.jpg (960px wide) and <out>/meta.json
(duration, fps, frame timestamps). Review frames one at a time, in order, to read
motion: what moves, direction, stagger, masking, easing feel, and how long it takes.
Needs ffmpeg/ffprobe on PATH.
"""
import argparse
import json
import subprocess
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--frames", type=int, default=8)
    ap.add_argument("--width", type=int, default=960)
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    clip = a.out / ("clip" + (Path(a.url.split("?")[0]).suffix or ".mp4"))
    if not clip.exists():
        req = urllib.request.Request(a.url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            clip.write_bytes(r.read())
    probe = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=r_frame_rate,width,height:format=duration", "-of", "json", str(clip)],
        capture_output=True, text=True, check=True).stdout)
    dur = float(probe["format"]["duration"])
    stamps = [round(dur * (i + 0.5) / a.frames, 3) for i in range(a.frames)]
    for i, t in enumerate(stamps):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(clip), "-frames:v", "1",
                        "-vf", f"scale={a.width}:-2", "-q:v", "4", str(a.out / f"f{i:02d}.jpg")], check=True)
    meta = {"url": a.url, "duration_s": dur, "stream": probe.get("streams", [{}])[0], "timestamps": stamps}
    (a.out / "meta.json").write_text(json.dumps(meta, indent=1))
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
