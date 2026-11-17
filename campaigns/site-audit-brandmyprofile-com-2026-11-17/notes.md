# Site audit notes, brandmyprofile.com, 2026-11-17

Run: crawl_audit.py full, max 200 → 102 URLs (102 HTML, 102 indexable), 128 requests, 36.9 s. Not truncated (sitemap has 108 URLs; the 6 others are presumably reachable only via sitemap and fall under orphan_pages).

## Verified by hand
- js_rendered_content: curl of /blog/best-cv-writing-service-kuwait → `<body> <div id="root"></div> <!-- Static fallback ... --> <noscript> <main> <h1>...`. root at byte 6782 (empty), noscript 7039–14453, main inside it. Crawler row: word_count 979 (main), body_words 0 (body text minus noscript), js_shell true. Source: scripts/generate-static-pages.js builds `crawlerHtml` wrapped in `<noscript>` (~line 409) and swaps it into index.html's noscript block (~line 503). App mounts via createRoot().render in src/main.tsx (no hydrateRoot), so pre-filled #root content is replaced on mount.
- The finding name "JS rendered" overstates it: content IS in the HTML, but only in noscript. Report words it as "hidden in noscript".
- Corroboration: two WebFetch runs (2026-11-17) on /kuwait, /, /blog/best-cv-writing-service-kuwait, /kuwait/pricing returned title only, although curl shows 8–14 KB with full text. Consistent with HTML-to-text converters dropping <noscript>.
- Correction to campaigns/ai-search/notes-2026-11-17.md "Server-rendered: OK": the text is in the HTML but inside noscript; see this file.

## Other findings
- orphan_pages ×12: examples /india/gcc-jobs, /india/europe-jobs, /kuwait/cv-writing/oil-gas. Crawler follows links in the static (noscript) HTML; the React nav may link them for JS renderers. Kept at medium.
- host_variants: http://brandmyprofile.com/ → 2 hops; https apex 1 hop; http www 1 hop.
- title_length ×20 (15 long, 5 short), deep_pages ×1 (/blog/cover-letter-gcc-jobs): also-worth-doing.
- Soft 404 probe: 404 correctly. Edge/CDN bot check: no differences reported.
- Homepage: 460 words in main, body_words 0 (same noscript pattern), 1 H1, canonical self.

## Core Web Vitals
Not checked: PageSpeed keyless quota exhausted.

## For the developer
Change in generate-static-pages.js: emit `<div id="root">${mainHtml}</div>` instead of `<div id="root"></div>` + `<noscript>${mainHtml}</noscript>` (and the same in index.html's default block). Keep a lightweight style so the fallback is readable. Measure CLS before/after with Lighthouse on /kuwait and one blog post. Do not hide the fallback with display:none / visibility:hidden.
