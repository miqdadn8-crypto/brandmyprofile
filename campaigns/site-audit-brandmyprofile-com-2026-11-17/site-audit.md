## SITE AUDIT: brandmyprofile.com
Nov 17, 2026 · 102 pages crawled, for getting found on Google and in AI answers

**Fix first: every page's text is hidden inside a `<noscript>` block.** The HTML your server sends has an empty `<div id="root"></div>`, and the real page (the H1, the Quick Answer, prices, guides and links) sits below it inside `<noscript><main>…</main></noscript>`. All 102 crawled pages are built this way. On /blog/best-cv-writing-service-kuwait, for example, 979 words live inside `<noscript>` and none outside it.

Why it matters here: `<noscript>` means "show this only when JavaScript is off". Google runs JavaScript, so it reads the page React draws, not this block. That works, but it's slower, and Google gives no weight to noscript text. Crawlers and tools that don't run JavaScript often throw away noscript content when they turn HTML into text. Two separate page fetches during this audit returned only the page title for /blog/best-cv-writing-service-kuwait and /kuwait/pricing, although the text is in the file. That fits the AI search audit, where none of your pages appeared in 12 buyer questions while competitors with ordinary HTML did.

The fix is one change in `scripts/generate-static-pages.js`: write the same page content *inside* `<div id="root">…</div>` instead of inside `<noscript>`. Your app mounts with `createRoot(...).render()`, which replaces whatever is in `#root` once JavaScript loads. Search engines and AI crawlers then get real HTML text, and visitors get the full app a moment later. The one trade-off is that a visitor on a slow connection may briefly see the plain text before the styled page appears. Don't hide it with `display:none`, because hidden text defeats the purpose. Check the layout-shift score after the change. A developer needs about 1–2 hours, including that check.

**Then, in this order:**

1. **Twelve money pages have no links pointing to them.** They're in the sitemap, but none of the 102 crawled pages link to them in the HTML crawlers read. Examples: /kuwait/cv-writing/oil-gas, /india/gcc-jobs, /india/europe-jobs. Google may still find them through the sitemap or the JavaScript menu, but unlinked pages get crawled less and rank weaker. Fix: link the industry pages from each region's CV-writing service page, and link the India hubs from /india. Include those links in the static HTML from the first fix too. About 1 hour.
2. **The bare domain takes two redirects.** http://brandmyprofile.com/ goes to https://brandmyprofile.com/ and then to https://www.brandmyprofile.com/. Fix: in Vercel's domain settings, redirect the http apex straight to `https://www.` in one hop. 5 minutes.

**Also worth doing:**
- Shorten 15 titles that run past 60 characters, mostly on the Saudi pages (for example /saudi/services/cv-writing and /saudi/pricing), so Google doesn't cut them off. Lengthen the 5 short ones such as "CV Writing Guides".
- Link /blog/cover-letter-gcc-jobs from a hub page. It currently sits 4 clicks from the homepage.
- Run `npm run indexnow` after the next deploy.

**Checked and fine:**
- HTTPS works, and robots.txt allows Google, Bing and every AI search and assistant crawler (OpenAI, Anthropic, Perplexity). No CDN blocks were found.
- The sitemap is valid and contains no noindexed or broken URLs.
- There are no noindex tags, canonical errors, broken internal links, server errors or soft 404s.
- Titles and H1s are present and unique, with no duplicate or thin pages.
- Organization schema, the mobile viewport, social tags, hreflang and llms.txt are all in place.

**Sources and assumptions:**
- The crawl covered 102 pages on Nov 17, 2026, which is the whole linked site (the sitemap lists 108 URLs). I opened the Kuwait guide's live HTML myself to confirm the noscript structure.
- The CDN check sends each crawler's name from this machine, not from their own networks. It found no blocks.
- Not checked:
  - **Core Web Vitals.** Google's free quota was used up. Set a free `PAGESPEED_API_KEY` and re-run.
  - **Which pages Google has actually indexed.** This needs Search Console.
  - **Exactly how each AI engine treats noscript text.** No vendor documents it. The evidence is the two title-only fetches above, so treat the fix as removing a likely barrier, not as a guaranteed source of citations.
