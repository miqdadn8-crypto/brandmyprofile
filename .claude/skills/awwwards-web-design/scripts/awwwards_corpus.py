#!/usr/bin/env python3
"""Build an evidence corpus of Awwwards-winning websites.

Stdlib only. Three steps, each resumable through an on-disk HTML cache:

  collect  listing pages -> slugs.json   (slug -> list of listing sources)
  detail   slugs.json    -> corpus.jsonl (one structured record per site)
  stats    corpus.jsonl  -> stats.json + stats.md (tag/tech/palette/score aggregates)

Examples:
  python3 awwwards_corpus.py collect --out data/ --cache /tmp/aw-cache
  python3 awwwards_corpus.py detail  --out data/ --cache /tmp/aw-cache --workers 6
  python3 awwwards_corpus.py stats   --out data/
  python3 awwwards_corpus.py all     --out data/ --cache /tmp/aw-cache

Only public listing and site pages are read. Requests are throttled per worker
and retried with backoff; a failed page is recorded, never fatal.
"""
from __future__ import annotations

import argparse
import colorsys
import concurrent.futures as cf
import hashlib
import html
import json
import re
import sys
import time
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

BASE = "https://www.awwwards.com"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")

# (listing path, pages to read). Award listings are date-ordered; tag listings
# surface the strongest recent work per technique or category.
DEFAULT_LISTINGS = [
    ("websites/sites_of_the_year/", 3),
    ("websites/sites_of_the_month/", 4),
    ("websites/sites_of_the_day/", 6),
    ("websites/3d/", 2), ("websites/webgl/", 2), ("websites/three-js/", 1),
    ("websites/react-three-fiber/", 1), ("websites/blender/", 1), ("websites/spline/", 1),
    ("websites/big-typography/", 1),
    ("websites/gsap/", 1), ("websites/animation/", 1), ("websites/transitions/", 1),
    ("websites/page-transition/", 1), ("websites/scrolling/", 1), ("websites/parallax/", 1),
    ("websites/storytelling/", 1), ("websites/microinteractions/", 1),
    ("websites/interaction-design/", 1), ("websites/typography/", 2),
    ("websites/minimal/", 1), ("websites/colorful/", 1), ("websites/black/", 1),
    ("websites/portfolio/", 2), ("websites/design-agencies/", 1), ("websites/e-commerce/", 2),
    ("websites/architecture/", 1), ("websites/fashion/", 1), ("websites/react/", 1),
    ("websites/framer/", 1), ("websites/webflow/", 1), ("websites/shopify/", 1),
    ("websites/nextjs/", 1), ("websites/nuxt-js/", 1),
]

SLUG_RE = re.compile(r'href="/sites/([a-z0-9][a-z0-9\-]*)"')


def fetch(url: str, cache: Path, retries: int = 3, delay: float = 0.4) -> str | None:
    key = hashlib.sha1(url.encode()).hexdigest()[:20]
    path = cache / f"{key}.html"
    if path.exists() and path.stat().st_size > 2000:
        return path.read_text(errors="replace")
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
            with urllib.request.urlopen(req, timeout=40) as resp:
                body = resp.read().decode("utf-8", errors="replace")
            path.write_text(body)
            time.sleep(delay)
            return body
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None
            time.sleep(2 ** attempt * 2)
        except Exception:  # network hiccup: back off and retry
            time.sleep(2 ** attempt * 2)
    return None


def collect(out: Path, cache: Path, listings) -> dict:
    slugs: dict[str, list[str]] = defaultdict(list)
    failures = []
    for listing, pages in listings:
        for page in range(1, pages + 1):
            url = f"{BASE}/{listing}" + (f"?page={page}" if page > 1 else "")
            body = fetch(url, cache)
            if not body:
                failures.append(url)
                continue
            found = sorted(set(SLUG_RE.findall(body)))
            label = listing.strip("/").split("/")[-1]
            for slug in found:
                if label not in slugs[slug]:
                    slugs[slug].append(label)
            print(f"[collect] {url} -> {len(found)} sites", file=sys.stderr)
    result = {"slugs": dict(sorted(slugs.items())), "failures": failures}
    (out / "slugs.json").write_text(json.dumps(result, indent=1))
    print(f"[collect] {len(slugs)} unique sites, {len(failures)} failed listings", file=sys.stderr)
    return result


def _text(fragment: str) -> str:
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def _num(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def parse_site(slug: str, body: str) -> dict:
    rec: dict = {"slug": slug, "url_awwwards": f"{BASE}/sites/{slug}"}
    m = re.search(r"<title>(.*?)</title>", body, re.S)
    rec["page_title"] = _text(m.group(1)) if m else None

    m = re.search(r'<h2 class="text-default">\s*((?:Site of the (?:Day|Month|Year)|Honorable Mention|'
                  r'Developer Award|Nominee|Mobile Excellence)[^<]*)</h2>', body)
    rec["award_heading"] = _text(m.group(1)) if m else None
    m = re.search(r'<h1 class="heading-1[^"]*">\s*<a href="([^"]+)"[^>]*>(.*?)</a>', body, re.S)
    rec["title"] = _text(m.group(2)) if m else slug
    rec["live_url"] = m.group(1) if m else None
    if not rec["live_url"]:
        m = re.search(r'class="toolbar-bts__item" href="(https?://(?!www\.awwwards)[^"]+)" target="_blank"', body)
        rec["live_url"] = m.group(1) if m else None

    rec["credits"] = sorted(set(re.findall(r'class="avatar-name__link" href="/([^"/]+)/" aria-label="([^"]+)"', body)))
    rec["credits"] = [name for _, name in rec["credits"]]

    # Awards shown as badges near the header (SOTD, SOTM, DEV, MOB, HM ...)
    head = body[:body.find('id="score"')] if 'id="score"' in body else body
    rec["badges"] = sorted(set(re.findall(r'>\s*(SOTY|SOTM|SOTD|HM|DEV|MOB|NOM|Nominee|Honors)\s*<', head)))

    rec["palette"] = re.findall(r'list-palette__name"><strong>HEX</strong>\s*(#[0-9A-Fa-f]{3,8})', body)

    typo = []
    for block in re.findall(r'class="[^"]*typography[^"]*"(.*?)</ul>', body, re.S):
        typo += [_text(x) for x in re.findall(r'<(?:strong|h3|h4|a)[^>]*>(.*?)</(?:strong|h3|h4|a)>', block, re.S)]
    rec["fonts"] = sorted({t for t in typo if t and len(t) < 60 and not t.startswith("#")})

    tags = []
    m = re.search(r"Technologies &(?:amp;)? Tools</h2>(.*?)</ul>", body, re.S)
    if m:
        tags = [(_text(t), p) for p, t in re.findall(r'href="/websites/([^"]+)/" class="button button--tag">(.*?)</a>', m.group(1), re.S)]
    rec["tags"] = [t for t, _ in tags]
    rec["tag_slugs"] = [p for _, p in tags]

    m = re.search(r'<h2 class="text-default">Description</h2>.*?<h3 class="heading-6">(.*?)</h3>', body, re.S)
    rec["description"] = _text(m.group(1)) if m else None

    elements = []
    for raw in re.findall(r'data-collectable-model-value="(\{[^"]*&quot;type&quot;:&quot;element&quot;[^"]*\})"', body):
        try:
            data = json.loads(html.unescape(raw))
        except json.JSONDecodeError:
            continue
        media = data.get("main_image") or data.get("collectableImage")
        elements.append({
            "title": data.get("title") or data.get("collectableTitle"),
            "tags": data.get("tags") or [],
            "media": f"https://assets.awwwards.com/awards/{media}" if media else None,
        })
    seen, uniq = set(), []
    for el in elements:
        k = (el["title"], el["media"])
        if k not in seen:
            seen.add(k)
            uniq.append(el)
    rec["elements"] = uniq
    rec["element_sections"] = sorted(set(re.findall(r'<small>from</small>\s*<a href="/elements/([^"/]+)/"', body)))

    m = re.search(r'&quot;collectableIdentifier&quot;:&quot;' + re.escape(slug) + r'&quot;,&quot;collectableImage&quot;:&quot;([^&]+)&quot;', body)
    rec["thumbnail"] = f"https://assets.awwwards.com/awards/{m.group(1).replace(chr(92), '')}" if m else None

    scores = {}
    m = re.search(r'c-heading-score__note">\s*→\s*([\d.]+)', body)
    scores["overall"] = _num(m.group(1)) if m else None
    m = re.search(r'id="score"(.*?)(?:DEV AWARD|id="dev|</section>|Votes)', body, re.S)
    if m:
        vals = re.findall(r'([\d.]+)\s*/\s*10', _text(m.group(1)))
        vals = [_num(v) for v in vals]
        if len(vals) >= 5:
            scores.update(dict(zip(["design", "usability", "creativity", "content"], vals[1:5])))
    m = re.search(r"DEV AWARD(.*?)Votes", body, re.S)
    if m:
        t = _text(m.group(1))
        dv = [_num(v) for v in re.findall(r'([\d.]+)\s*/\s*10', t)]
        if dv:
            scores["dev_overall"] = dv[0]
            keys = ["semantics_seo", "animations", "accessibility", "wpo", "responsive", "markup"]
            scores["dev"] = dict(zip(keys, dv[1:7]))
    rec["scores"] = scores
    return rec


def detail(out: Path, cache: Path, workers: int, limit: int | None) -> list[dict]:
    slugs = json.loads((out / "slugs.json").read_text())["slugs"]
    items = list(slugs.items())[: limit or None]

    def work(item):
        slug, sources = item
        body = fetch(f"{BASE}/sites/{slug}", cache)
        if not body:
            return {"slug": slug, "sources": sources, "error": "fetch_failed"}
        try:
            rec = parse_site(slug, body)
        except Exception as exc:  # keep going; record the parse failure
            return {"slug": slug, "sources": sources, "error": f"parse:{exc}"}
        rec["sources"] = sources
        return rec

    records = []
    with cf.ThreadPoolExecutor(max_workers=workers) as pool:
        for i, rec in enumerate(pool.map(work, items), 1):
            records.append(rec)
            if i % 25 == 0:
                print(f"[detail] {i}/{len(items)}", file=sys.stderr)
    with (out / "corpus.jsonl").open("w") as fh:
        for rec in records:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
    bad = sum(1 for r in records if r.get("error"))
    print(f"[detail] {len(records)} records, {bad} errors", file=sys.stderr)
    return records


def _hsl(hexcode: str):
    h = hexcode.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hue, light, sat = colorsys.rgb_to_hls(r, g, b)
    return round(hue * 360), round(sat, 3), round(light, 3)


def _hue_family(hexcode: str) -> str:
    hue, sat, light = _hsl(hexcode)
    if light <= 0.12:
        return "near-black"
    if light >= 0.93:
        return "near-white"
    if sat < 0.12:
        return "neutral-gray"
    if light > 0.8 and sat < 0.5:
        return "tint/off-white"
    bands = [(15, "red"), (45, "orange"), (65, "yellow"), (160, "green"), (200, "cyan"),
             (255, "blue"), (290, "violet"), (335, "magenta"), (361, "red")]
    return next(name for edge, name in bands if hue < edge)


def record_year(rec: dict) -> int:
    m = re.search(r"(20\d\d)", rec.get("award_heading") or "")
    if m:
        return int(m.group(1))
    for media in [e.get("media") or "" for e in rec.get("elements", [])] + [rec.get("thumbnail") or ""]:
        m = re.search(r"/(20\d\d)/", media)
        if m:
            return int(m.group(1))
    return 0


def stats(out: Path, recent_from: int = 2024) -> dict:
    recs = [json.loads(l) for l in (out / "corpus.jsonl").read_text().splitlines() if l.strip()]
    ok = [r for r in recs if not r.get("error")]
    result = {"all": summarize(ok, len(recs)),
              f"recent_{recent_from}_plus": summarize([r for r in ok if record_year(r) >= recent_from], None),
              "years": sorted(Counter(record_year(r) for r in ok).items())}
    (out / "stats.json").write_text(json.dumps(result, indent=1, ensure_ascii=False))
    lines = [f"# Awwwards corpus stats", "",
             "Palette presets from the pre-2022 Awwwards picker (#2779A7, #D14836, #ECD06F, #49C5B6, #DF6C4F) skew the all-time cut;",
             f"prefer the recent_{recent_from}_plus cut for current taste.", ""]
    for cut in ["all", f"recent_{recent_from}_plus"]:
        lines += [f"# Cut: {cut} ({result[cut]['sites']} sites)", ""]
        for key, value in result[cut].items():
            if isinstance(value, list):
                lines.append(f"## {key}")
                lines += [f"- {k}: {v}" for k, v in value]
                lines.append("")
            else:
                lines.append(f"- **{key}**: {value}")
        lines.append("")
    lines += ["# Sites per award year", ""] + [f"- {y}: {c}" for y, c in result["years"]]
    (out / "stats.md").write_text("\n".join(lines) + "\n")
    print(f"[stats] {len(ok)} sites summarised -> {out/'stats.json'}", file=sys.stderr)
    return result


def summarize(ok: list, total) -> dict:
    n = len(ok)
    tag_counter = Counter(t for r in ok for t in r.get("tags", []))
    section_counter = Counter(s for r in ok for s in r.get("element_sections", []))
    el_tag_counter = Counter(t for r in ok for e in r.get("elements", []) for t in e.get("tags", []))
    award_counter = Counter((r.get("award_heading") or "none").split(" - ")[0] for r in ok)
    source_counter = Counter(s for r in ok for s in r.get("sources", []))
    palette_sizes = Counter(len(r.get("palette", [])) for r in ok)
    families = Counter(_hue_family(c) for r in ok for c in r.get("palette", []))
    base_bg = Counter()
    for r in ok:
        pal = r.get("palette") or []
        if pal:
            lights = sorted(_hsl(c)[2] for c in pal)
            base_bg["dark-dominant" if lights[0] < 0.15 and lights[-1] < 0.9 else
                    "light-dominant" if lights[-1] > 0.9 and lights[0] > 0.15 else
                    "dark+light (contrast pair)" if lights[0] < 0.15 and lights[-1] > 0.9 else "mid-tone"] += 1
    sat_accents = Counter()
    for r in ok:
        for c in r.get("palette", []):
            _, s, l = _hsl(c)
            if s > 0.55 and 0.25 < l < 0.75:
                sat_accents[c.upper()] += 1

    def mean(key, sub=None):
        vals = [(r["scores"].get(sub) or {}).get(key) if sub else r["scores"].get(key) for r in ok]
        vals = [v for v in vals if isinstance(v, (int, float))]
        return round(sum(vals) / len(vals), 2) if vals else None

    return {
        "sites": n, "errors": (total - n) if total else 0,
        "awards": award_counter.most_common(),
        "listing_sources": source_counter.most_common(),
        "tags_top": tag_counter.most_common(120),
        "element_sections": section_counter.most_common(),
        "element_tags_top": el_tag_counter.most_common(80),
        "palette_size_distribution": sorted(palette_sizes.items()),
        "palette_hue_families": families.most_common(),
        "palette_base": base_bg.most_common(),
        "saturated_accents_top": sat_accents.most_common(30),
        "score_means": {k: mean(k) for k in ["overall", "design", "usability", "creativity", "content", "dev_overall"]},
        "dev_score_means": {k: mean(k, "dev") for k in ["semantics_seo", "animations", "accessibility", "wpo", "responsive", "markup"]},
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("step", choices=["collect", "detail", "stats", "all"])
    ap.add_argument("--out", type=Path, default=Path(__file__).resolve().parent.parent / "data")
    ap.add_argument("--cache", type=Path, default=Path("/tmp/awwwards-cache"))
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--limit", type=int, default=None, help="cap detail pages (testing)")
    ap.add_argument("--listing", action="append", default=None,
                    help="override listings as path:pages, e.g. websites/3d/:3 (repeatable)")
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    args.cache.mkdir(parents=True, exist_ok=True)
    listings = DEFAULT_LISTINGS
    if args.listing:
        listings = [(p.rsplit(":", 1)[0], int(p.rsplit(":", 1)[1]) if ":" in p else 1) for p in args.listing]
    if args.step in ("collect", "all"):
        collect(args.out, args.cache, listings)
    if args.step in ("detail", "all"):
        detail(args.out, args.cache, args.workers, args.limit)
    if args.step in ("stats", "all"):
        stats(args.out)


if __name__ == "__main__":
    main()
