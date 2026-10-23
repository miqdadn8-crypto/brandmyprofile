# Authority & Digital PR Reference (Unit 8, extended in the Authority + Lead Acquisition unit)

## Start here (current working files)
| File | Purpose |
|---|---|
| [2026-30-day-plan.md](./2026-30-day-plan.md) | Week-by-week plan, asset audit, top 4 assets |
| [prospect-tracker.csv](./prospect-tracker.csv) | Empty tracker (use this; the older `prospect-tracker-template.csv` is superseded) |
| [prospect-scoring.md](./prospect-scoring.md), [prospect-categories.md](./prospect-categories.md) | Scoring model (0-10) and target categories |
| [resource-page-template.md](./resource-page-template.md), [content-mention-template.md](./content-mention-template.md), [partnership-template.md](./partnership-template.md), [broken-resource-template.md](./broken-resource-template.md), [expert-contribution-template.md](./expert-contribution-template.md), [follow-ups.md](./follow-ups.md) | Outreach templates (supersede the short drafts in `outreach-templates.md`) |
| [../growth/](../growth/) | GBP, reviews, leads, KPIs, social plans |

### Backlink quality rules
**Good link:** relevant, editorial, contextual, on a page with a real audience, natural anchor.
**Bad link:** paid bulk placement, PBN, irrelevant directory, spam profile, sitewide footer link spam, exact-match anchor manipulation.

### Anchor text
Preferred: "BrandMyProfile", "GCC CV Checklist", "Kuwait CV Format Guide", "this CV guide", "career resource". Never request or repeat a forced commercial anchor such as "cv writing services kuwait".

### Realistic partnership ideas (none exist yet; each is a proposal)
1. Training center shares the GCC CV Checklist with trainees.
2. Career coach references the GCC CV guide in a resource list.
3. Engineering group shares the Kuwait/engineering CV guide.
4. Alumni group shares the checklist with members heading to the Gulf.
5. Guest Q&A on GCC CV mistakes for a career blog.
6. Online CV/LinkedIn session for a community [owner to confirm format].
7. Career workshop for a university career center [owner to confirm].
8. Short expert quote for an article on ATS or CV length.
9. Inclusion in a "resources for Gulf job seekers" roundup.
10. Newsletter mention of the checklist.

### Community outreach (non-spam)
LinkedIn groups, professional/expat communities and engineering groups: help first. Answer the question fully, share a resource only when it adds something the answer cannot, follow each group's rules, never paste the same link across groups. Fake accounts and automated posting are not allowed.

### Claims
Do not claim "featured in", "trusted by" or "as seen in" unless verified. Never publish invented reviews, awards or partnerships.

Internal working reference for the business owner - not user-facing content, never linked from
the site. Nothing in this folder is a claim about work already done (no outreach has been sent,
no directories submitted to, no links acquired) - it is preparation and a decision framework only.

See also: [outreach-templates.md](./outreach-templates.md), [directory-research-framework.md](./directory-research-framework.md),
[prospect-tracker-template.csv](./prospect-tracker-template.csv), [competitor-gap-worksheet-template.csv](./competitor-gap-worksheet-template.csv).

## 1. Backlink baseline

**External backlink profile could not be measured from repository data alone.** No Search
Console, Bing Webmaster Tools, Ahrefs, Semrush or similar export exists anywhere in this
repository, so no DA/DR/backlink-count/referring-domain/spam-score figure below is invented.

To measure the real baseline later, the business owner should pull:
- Google Search Console → Links report (top linking sites, top linked pages, top linking text)
- Bing Webmaster Tools → Backlinks report
- (Optional, paid) Ahrefs Site Explorer or Semrush Backlink Analytics → Domain Rating/Authority
  Score, total referring domains, new/lost links over time
- Google Search Console → Performance report, filtered to queries containing "brandmyprofile" or
  the brand name, to see existing brand-search volume as a rough authority proxy

## 2. Linkable-content audit

Classification is about *link-worthiness to an external site*, not quality in general - a page
can be a great commercial page and still be a D for outreach purposes if there's no informational
reason for a third party to cite it.

**A - Commercial (own service intent, unlikely outreach targets):**
`/services/cv-writing`, `/services/ats-cv`, `/services/gcc-cv`, `/services/europass-cv`,
`/services/linkedin-makeover`, `/services/masterclass`, `/services/career-guidance`, all 18
`/cv-writing/{industry}` pages, `/pricing`. These convert visitors, they don't attract citations.

**B - Informational (genuine outreach candidates - answer a real question):**
`gcc-cv-format-guide`, `kuwait-cv-format-guide`, `gcc-cv-mistakes`, `how-ats-reads-your-cv`,
`ats-friendly-cv-tips-2025`, `ats-cv-guide-kuwait`, `india-to-gcc-jobs-guide`,
`engineering-cv-kuwait-guide`, `oil-gas-cv-gcc-guide`, `gcc-interview-preparation`,
`cover-letter-gcc-jobs`, `europass-cv-guide-india`, `career-transition-gcc-job-market`,
`linkedin-headline-gulf-jobs`, `optimize-linkedin-profile-visibility`,
`salary-negotiation-gcc-professionals`, `remote-work-skills-2025`,
`personal-branding-job-search`. Plus the 5 content hubs (`/blog/cv-writing`, `/blog/ats`,
`/blog/gcc-careers`, `/blog/career-guidance`, `/blog/india-gcc`) as topic-navigation assets.

**C - Reference-worthy (strongest candidates - genuinely tool-like, not just an article):**
`/resources/gcc-cv-checklist` (new, Unit 8). This is the one asset built specifically to be
citable/shareable/linkable on its own, independent of any purchase intent.

**D - Weak candidates (real content, thin outreach case):**
None of the current articles are assessed as D - all 18 clear the 1,200+ word bar and answer a
real question. If future short articles are added purely to fill a content gap without enough
depth, they'd land here until expanded.

## 3. Citation-readiness audit (existing flagship guides)

Checked `gcc-cv-format-guide`, `kuwait-cv-format-guide`, `how-ats-reads-your-cv`,
`india-to-gcc-jobs-guide`, and the checklist itself against: author attribution (✓ - Organization,
"BrandMyProfile Editorial Team", not a fabricated named "expert"), `datePublished` (✓ - real
dates from `blogs/index.json`), stable canonical (✓ - `SEO.tsx`), clear/specific title (✓),
concise direct-answer opening (✓ - established in Units 6/7's AEO pass), descriptive H2/H3
headings (✓), Organization publisher via `organizationSchema["@id"]` (✓, Unit 7), no unsupported
statistics (✓, verified repeatedly across units). **No changes made here** - `dateModified` was
deliberately NOT bumped on any article, since none received a substantive content update in this
unit (bumping it without a real edit would itself be exactly the superficial-freshness-signal
problem the brief warns against).

## 4. Media / expert-source page - deferred

Evaluated per the brief's instruction to defer rather than fabricate. The repository has no real,
verifiable founder biography, professional credentials, media mentions, or speaking history beyond
what's already stated in `organizationSchema` (name, description, real contact/social links). A
media/expert-source page built from that alone would either be too thin to be useful to a
journalist or would tempt padding with unverifiable claims - both against this project's
anti-fabrication rules. **Decision: defer.** Revisit only once real, checkable credentials, press
mentions, or a named spokesperson bio exist to draw from.

## 24-29. Prospect tracker & outreach templates

The tracker template (fields: domain, siteName, country, category, targetURL, targetContent,
contactURL, contactEmail, prospectType, relevanceScore, status, lastContacted, followUpDate,
response, linkAcquired, liveURL, notes) lives at
[prospect-tracker-template.csv](./prospect-tracker-template.csv), left empty/example-free since no
real contacts exist yet. **Status vocabulary:** Researching → Qualified → Ready to Contact →
Contacted → Follow-up 1 → Follow-up 2 → Replied → Accepted / Declined → Link Live → Not Suitable.

The 5 outreach email templates (A: resource-page suggestion, B: broken/outdated-resource
replacement, C: expert contribution, D: guest-expert-article pitch, E: community-resource
submission) and guest-content rules live in [outreach-templates.md](./outreach-templates.md).

## 17. Digital-PR outreach topic map

| Topic | Angle | Best-fit asset |
|---|---|---|
| A. GCC CV trends | What's changing in how Gulf employers screen CVs | `gcc-cv-format-guide`, checklist |
| B. ATS myths | Common misconceptions about applicant tracking systems | `how-ats-reads-your-cv` |
| C. India → GCC prep | What Indian professionals should do before applying to Gulf roles | `india-to-gcc-jobs-guide` |
| D. CV privacy | What personal data to leave off a CV and why | checklist, `gcc-cv-format-guide` |
| E. Engineering CV positioning | How engineers should structure GCC applications | `engineering-cv-kuwait-guide` |
| F. Oil & Gas CV | Sector-specific CV positioning for energy roles | `oil-gas-cv-gcc-guide` |
| G. Europass misconceptions | When Europass is/isn't the right format | `europass-cv-guide-india` |
| H. LinkedIn positioning for Gulf jobs | Headline/profile strategy for GCC recruiters | `linkedin-headline-gulf-jobs` |
| I. Interview prep | Practical GCC interview preparation | `gcc-interview-preparation` |
| J. Scam awareness | Recognizing fraudulent job/recruitment offers | `india-to-gcc-jobs-guide`, IndiaGccJobs page |

**No fake data studies.** None of the above may ever be pitched as "We analyzed 10,000 CVs and
found..." or similar unless a real underlying dataset is collected and can be shown on request.
Until then, every pitch is framed as practical guidance, not proprietary research.

## 23. Outreach qualification scoring (0-3 scale per factor)

Score each prospect 0-3 on: **Relevance** (does the audience actually care about GCC/India
careers), **Editorial quality** (is content genuinely written/curated, not autogenerated),
**Real audience** (evidence of actual readers/subscribers/engagement, not a dead directory),
**Link opportunity** (is there a plausible, non-forced place a link would add value), **Spam-risk
(inverse)** (3 = no spam signals, 0 = clear spam farm). Relevance + editorial quality + real
audience matter more than raw domain metrics - a small, genuinely relevant Kuwait community blog
outranks a huge generic "business directory" with no real readership.

## 30. Asset-to-audience matching

| Asset | Best-fit audiences |
|---|---|
| GCC CV Checklist | GCC career blogs, community sites |
| Kuwait CV Format Guide | Kuwait career/community resources |
| India→GCC guide | Indian expat/job-prep communities |
| ATS guide | Career/HR education sites |
| Engineering CV Guide | Engineering career/student communities |
| Oil & Gas CV Guide | Energy-career resources |
| Europass Guide | Study/work-abroad career education resources |

## 31. Non-spam community-contribution strategy

For Reddit, Quora, LinkedIn groups, forums and Facebook groups: answer the actual question
first, in full, without assuming a link is needed. Only include a link when it genuinely adds
something the answer text can't (e.g. a checklist to work through, not just "read our blog"). No
fake accounts, no automated posting, no dropping the same canned answer into every thread.

## 32. LinkedIn authority plan (10 post ideas)

1. The GCC CV personal-details myth (what to actually leave off)
2. The single-format ATS myth
3. A before/after example of rewriting project experience
4. When Europass is genuinely the wrong format
5. A GCC interview-prep checklist walkthrough
6. An achievement-writing example (task → outcome)
7. What actually differs between a GCC CV and a standard CV
8. Common CV mistakes seen across GCC applications
9. How to present relocation readiness clearly
10. A short explainer on how ATS parsing actually works

Goal is brand/entity visibility, not artificial backlink generation - link back to the site
sparingly, not on every post.

## 33. Shareable-graphic specifications (specs only - no graphics produced in this unit)

1. **GCC CV anatomy** - an annotated one-page CV layout diagram (sections labeled: summary,
   experience, skills, etc.) derived from `gcc-cv-format-guide`.
2. **ATS parsing checklist** - a simple visual checklist of the "ATS Formatting" items from the
   new resource, styled as a shareable graphic.
3. **India → GCC application workflow** - a simple step diagram (research target country → tailor
   CV → apply via verified channel → interview prep) derived from `india-to-gcc-jobs-guide`.

Only specifications are prepared here; no design assets exist yet, so none are claimed as built.

## 34. Statistic / claim policy for outreach content

Never use: 3x, 5x, 98%, 5000+, "thousands of clients", "#1", "best", "top-rated",
"award-winning", "guaranteed", or any fabricated employer/partnership claim. The one approved,
sparingly-used metric is **"500+ Professionals Supported"** (already live on `GCCCV.tsx`) - reuse
it as-is, don't inflate it, and don't repeat it in every single piece of outreach content.

## 35-36. Business descriptions for directory submissions

**Long (~50 words):** BrandMyProfile is an online career-support service offering professional
CV writing, ATS CV optimization, GCC-format CV preparation, Europass CV writing (India), LinkedIn
profile optimization and one-to-one career coaching for professionals targeting Kuwait, the GCC
and India. All work is human-written and reviewed, with no walk-in office.

**Short (~25 words):** BrandMyProfile provides professional CV writing, ATS optimization, GCC CV
formatting, LinkedIn optimization and career coaching for Kuwait, GCC and India job seekers.
(No "leading/best/award-winning/top-rated/guaranteed" language in either version.)

## 37. Anchor-text policy

Don't attempt to control every backlink's anchor text - that's not realistic or safe to demand.
Preferred, natural outcomes if a publisher asks what to call the link: "BrandMyProfile",
"brandmyprofile.com", "GCC CV checklist", "GCC CV guide", "ATS CV guide". Avoid ever requesting an
exact-match commercial anchor like "best cv writing service kuwait" - that's a spam signal, not a
natural editorial choice.

## 38. Link-target distribution policy

Don't point every acquired link at the homepage. Brand mentions → homepage. GCC CV topic →
`/resources/gcc-cv-checklist` or `gcc-cv-format-guide`. ATS topic → `how-ats-reads-your-cv` or the
ATS hub. Kuwait CV topic → `kuwait-cv-format-guide`. India→GCC topic → `india-to-gcc-jobs-guide`
or `/india/gcc-jobs`. Commercial pages may still receive editorial links where a publisher
genuinely wants to point at the service itself, but informational resources should earn most
outreach links.

## 40. Unlinked-brand-mention workflow

1. Search for existing unlinked mentions of "BrandMyProfile" (Google Alerts, manual search).
2. Verify the page and context are genuine and relevant.
3. Decide whether a link would actually help their readers (not just us).
4. If yes, contact the publisher politely, thank them for the mention, and ask if they'd consider
   linking to the most relevant canonical page.
5. Track the outcome in the prospect tracker. **Never send this automatically** - always a real,
   individually-written message.

## 41. Broken-link workflow

1. Identify a genuinely dead career-resource link on a relevant third-party page.
2. Confirm BrandMyProfile has real, equivalent-or-better content for that exact topic - don't
   force a fit.
3. Contact the publisher, point out the specific dead link (URL and location on their page).
4. Suggest the relevant BrandMyProfile resource neutrally, as one possible replacement, not a
   demand. **Never fabricate a "this link is broken" claim** - verify it's actually broken first.

## 42. Partnership-opportunity categories

Training institutes, career coaches, language/training centers, professional communities, alumni
groups, education consultants (where genuinely relevant), engineering communities, expat
communities. Potential formats: a free webinar, a co-branded checklist, a guest expert Q&A, a
co-authored resource, or a CV workshop. No fake partner logos or claimed partnerships that don't
exist.

## 43. University/.edu link policy

No fake scholarships or manufactured .edu link schemes. A university link is only legitimate if it
comes from genuine activity - a real career-resource contribution, a workshop, student-support
content, or an actual expert contribution a career center chose to link to.

## 44. Paid-link policy

Never recommend buying links purely for ranking manipulation. A legitimate sponsorship or
advertising placement can be evaluated separately by the business owner as a business decision,
but must never be represented as an organic editorial endorsement. No PBNs (private blog
networks).

## 45. Directory-quality policy

Avoid directories with spam signals: thousands of unrelated categories, autogenerated profiles,
casino/adult/pharma outbound spam nearby, mandatory reciprocal links, bulk paid SEO-link packages,
or no real editorial purpose. 20 good, relevant opportunities are worth more than 500 spam
listings.

## 46. Citation-consistency rule

Use identical Brand / Website / Phone / positioning on every legitimate listing: "BrandMyProfile",
"https://www.brandmyprofile.com/", "+965 41103254", "online career-support service." Never vary
business identity to try to target different keywords across listings - that's both a trust risk
and a known spam/manipulation signal to search engines.

## 47. Social sameAs rule

Only ever reference the real, Unit-7-verified profiles already in `organizationSchema.sameAs`
(LinkedIn company page, Instagram, the verified Google Business Profile). Never create new social
accounts purely to expand `sameAs` - that inflates the entity graph with accounts that don't
represent genuine engagement.

## 48. UTM / referral-tracking convention (optional, for the business owner's own use)

If tracking outreach-driven traffic is useful, a simple convention: `utm_source=<publisher-domain>
&utm_medium=referral&utm_campaign=digital-pr`. **Never** place a UTM-tagged URL in the sitemap,
structured data, or any internal link - those must always stay on the clean canonical URL. UTM
parameters belong only in the specific outbound link handed to an external publisher.
