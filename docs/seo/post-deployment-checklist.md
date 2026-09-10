# Post-Deployment Checklist (Unit 9)

Internal reference for the business owner. Nothing here has been executed - deployment,
Search Console setup and monitoring all happen after this repository is actually deployed and
pushed, which this unit explicitly does not do.

## Day 0 - deploy

- [ ] Deploy to production (Vercel)
- [ ] Verify the live site resolves at `https://www.brandmyprofile.com/` over HTTPS with no
      certificate warnings
- [ ] Confirm a non-www or http request redirects to the canonical www/https host (check your
      Vercel domain configuration - this repo's canonical tags all assume `www.brandmyprofile.com`)
- [ ] Open `/robots.txt` and confirm it matches `dist/robots.txt` (correct sitemap URL, no
      accidental `Disallow`)
- [ ] Open `/sitemap.xml` and spot-check a handful of URLs load correctly
- [ ] Test the canonical tag on the homepage and 2-3 other page types (view source or dev tools)
- [ ] Submit the Contact form and the Schedule form once each; confirm WhatsApp opens with the
      expected pre-filled message and no console errors
- [ ] Confirm analytics is either intentionally still absent, or newly installed and firing (see
      "Analytics status" in the Unit 9 report - as of this unit, no GA4/GTM is installed)

## Day 1-3

- [ ] Add/verify the Domain property in Google Search Console (or the URL-prefix property for
      `https://www.brandmyprofile.com/` if a Domain property isn't practical)
- [ ] Submit `sitemap.xml` under Search Console → Sitemaps
- [ ] Use URL Inspection on the homepage; request indexing if it isn't already indexed
- [ ] Use URL Inspection on the Tier 1 priority URLs (see list below); request indexing only
      where genuinely useful, not all 114 URLs at once
- [ ] Check the Page Indexing report for early crawl errors
- [ ] Spot-check structured data on 3-4 page types using Search Console's Rich Results
      test/URL Inspection panel
- [ ] Monitor the Vercel deployment logs for any runtime errors in the first 48 hours

## Week 1

- [ ] Review Search Console → Page Indexing (indexed vs. excluded counts)
- [ ] Review Search Console → Performance report as an early baseline (impressions will be low -
      that's expected in week 1)
- [ ] Review Core Web Vitals report (field data needs real traffic to populate - it may show
      "not enough data" this early, which is normal, not a failure)
- [ ] Review Search Console → Crawl stats for errors
- [ ] Note early query impressions, CTR, and any country/device patterns worth tracking

## Week 2-4

- [ ] Track indexed-page count trend (should approach the 114-URL sitemap total over time, not
      instantly)
- [ ] Track impressions for the priority keyword set established in Units 1-8
- [ ] Track commercial-page clicks (CV Writing, ATS, GCC CV, Pricing pages) in Performance report
- [ ] Track WhatsApp/consultation conversions if any measurement is added (see the Unit 8/9
      conversion-event plan)
- [ ] Track authority-outreach progress against `docs/authority-outreach/`
- [ ] Identify pages with impressions but weak CTR (title/description candidates for review)
- [ ] Identify pages already ranking positions 8-20 (near-term optimization opportunities)

## Month 2+

- [ ] Refresh content based on **actual** Search Console query data, not assumptions
- [ ] Improve pages sitting in positions 5-20 for their target queries
- [ ] Consolidate any pages showing real cannibalization in Search Console data (two URLs
      competing for the same query) - the site currently has no known cannibalization by design
      (see Unit 6/8's cannibalization audits), so this is about catching drift, not a known issue
- [ ] Expand content only where real query demand justifies it - don't add pages speculatively
- [ ] Continue authority outreach per `docs/authority-outreach/README.md`

## No first-page guarantee

Technical SEO improves crawlability, relevance and performance, but no implementation can
guarantee first-page Google rankings. Ranking also depends on competition, content quality,
authority/backlinks, user behavior signals, search intent match, Google's own ranking systems, and
time. This is stated here for internal planning only - it is not meant to appear as a visible
disclaimer on any marketing page.

## Tier 1 priority-indexing list (request indexing manually, don't blanket-request all 114)

- Homepage: `/kuwait`, `/uae`, `/saudi`, `/qatar`, `/india`
- Kuwait Professional CV, ATS CV, GCC CV: `/kuwait/services/cv-writing`, `/kuwait/services/ats-cv`, `/kuwait/services/gcc-cv`
- Kuwait Pricing: `/kuwait/pricing`
- UAE/Saudi/Qatar equivalents: `/uae/services/cv-writing`, `/saudi/services/cv-writing`, `/qatar/services/cv-writing`
- India Professional CV, GCC CV, Europass CV: `/india/services/cv-writing`, `/india/services/gcc-cv`, `/india/services/europass-cv`
- India GCC/Europe intent hubs: `/india/gcc-jobs`, `/india/europe-jobs`
- GCC CV Checklist: `/resources/gcc-cv-checklist`
- Top authority guides: `/blog/gcc-cv-format-guide`, `/blog/how-ats-reads-your-cv`, `/blog/india-to-gcc-jobs-guide`

## Search Console monitoring framework

- **Performance → Search results** - dimensions: query, page, country, device
- **Page Indexing** - indexed vs. excluded breakdown and reasons
- **Sitemaps** - submission status and last-read date
- **Core Web Vitals** - field data (LCP/CLS/INP), grouped URL if applicable
- **HTTPS** report
- **Enhancements** - structured-data reports Search Console happens to surface (not every
  schema.org type gets its own dedicated enhancement report - that's normal, not a defect)

## Optional: Bing Webmaster Tools

Not set up as part of this unit. If desired later: verify the domain in Bing Webmaster Tools and
submit the same `sitemap.xml` URL. No code change is required for this.

## IndexNow - evaluated, not implemented

IndexNow was evaluated per the Unit 9 brief and intentionally not added. It provides value mainly
for high-frequency content changes; this site's content changes in deliberate, infrequent units,
and adding IndexNow would mean maintaining an API key and a push step with no clear corresponding
benefit today. Revisit only if publishing frequency increases materially.

## Google Search Console verification

No `google-site-verification` meta tag exists in `index.html` as of this unit (checked directly -
confirmed absent). Add the real verification value through the Google Search Console account once
a property is created; do not invent or guess a token here.
