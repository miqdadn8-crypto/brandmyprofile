# Notes: LinkedIn pages audit, 2026-11-18

Scope requested: "about linkedin services". Base data: campaigns/site-audit-brandmyprofile-com-2026-11-17/pages.jsonl (full crawl, 102 pages). No new crawl run; targeted re-fetch instead.

From the crawl (all 200, indexable, h1=1, self-canonical, depth 2):
- /kuwait/services/linkedin-makeover: words 135 (main), inbound 17, title 66 chars
- /uae: 125 w, in 17, 49 chars · /saudi: 133 w, in 17, 58 · /qatar: 124 w, in 16, 51 · /india: 129 w, in 19, 51
- /blog/optimize-linkedin-profile-visibility: 226 w, inbound 1
- /blog/linkedin-headline-gulf-jobs: in the sitemap, not reached by the crawl from links (one of the orphan_pages)

Targeted re-fetch (scratchpad li.cjs, Playwright 390px, scrolled):
| page | static (noscript) words | rendered words | rendered H1 |
|---|---|---|---|
| /kuwait/services/linkedin-makeover | 142 | 771 | Build a LinkedIn Profile Recruiters Understand |
| /uae/... | 131 | 770 | same |
| /india/... | 138 | 769 | same |
| /blog/linkedin-headline-gulf-jobs | 1265 | 1361 | LinkedIn Headline Guide for Gulf Job Seekers |
| /blog/optimize-linkedin-profile-visibility | 224 | 233 | How to Optimize Your LinkedIn Profile for Maximum Visibility |

Static H1 on /kuwait LinkedIn: "LinkedIn Profile Writing & Optimization in Kuwait" (differs from the rendered H1).
Rendered H2s are identical across regions except "LinkedIn Optimization for <Region> & GCC Opportunities".
difflib word-sequence ratio: kw–uae 0.95, kw–india 0.96.
Rendered prices: KW 5/7/10 KWD; UAE 72/101/144 AED; IN ₹699/₹999/₹1,699.
