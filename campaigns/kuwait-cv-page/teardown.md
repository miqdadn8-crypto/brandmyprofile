## LANDING PAGE TEARDOWN: brandmyprofile.com/kuwait
Nov 17, 2026 · the page your Google profile button and "cv writing kuwait" searches should land on

**Page job:** a local service page that works like a *quote page*. The free CV review is the "estimate visit", WhatsApp is the second path, and visitors are comparing two or three CV writers on a phone. The traffic is warm-ish: they found you on Maps or Google search, saw 4.9★ from 32 reviews, and are deciding whether to send their CV. The page's structure suits that job. What's wrong is mostly **what's hidden and what's in the way**, not the argument.

**Current section order (17 phone screens):**
1. Hero
2. Before/after rewrite example
3. Prices in KWD
4. How the free review works
5. Reviews (renders as a link only)
6. Other services
7. FAQ
8. Closing CTA
9. Career guides
10. Footer (17 links)

---

### 1. First screen: let the visitor see the argument (message hierarchy)
*Principle: the headline, subhead and CTA must carry the whole pitch in 5 seconds on a phone.*

- **The cookie banner covers the subheadline and the CTA**, and the WhatsApp bubble sits on top of the main button. Make the banner a one-line bar pinned to the bottom, and move the bubble above it. (Details in the first-screen check.)
- The subheadline hides your sharpest fact. It should read: **"Human-written, ATS-friendly CVs for Kuwait and GCC employers, from 4 KWD. Start with a free CV review, or send your CV on WhatsApp."**
- Add **one proof line under the headline: "4.9★ from 32 Google reviews"**, read live, with "Read our Google reviews" as the fallback. It repeats what the visitor saw on Maps one tap ago.
- The headline itself passes: "Professional CV Writing for Kuwait & GCC Jobs" says what and where.

### 2. Proof: none of your real proof reaches the page
*Principle: put proof next to the claim it supports, and the strongest proof near the first CTA.*

- **The reviews section is empty on the live site.** It's built to show your Google reviews as cards, but it currently renders only "See what clients say about BrandMyProfile. Read our reviews on Google". The live review feed isn't returning data, which is why the page falls back to the link. Check the `fetch-google-reviews` function's logs in Supabase (an expired API key or a quota problem is the usual cause).
- **Don't depend on the feed.** Add a fixed fallback of 3 real Google review quotes, with the reviewer's first name and the date, for example George: "Very quick and fast response…", Omnia: "A professional and exceptional service center…". Show these whenever the live feed fails.
- **Move the reviews block up**, directly after the before/after example and before pricing, so proof sits beside the price decision.
- **"500+ professionals supported" appears 3 times** (hero badge, trust strip, closing CTA) and is the biggest claim on the page. Keep it only if it's a real count. Otherwise replace it everywhere with the Google rating, which is verified and visible.
- The before/after example is labelled "Illustrative examples, not client data". That's honest and good. Keep it.

### 3. Section selection: cut the exits before the decision
*Principle: one job per section, delete what doesn't serve this page's job, and nav or footer links are exits.*

- **Cut "Career Resources for Kuwait & GCC Professionals"** (three blog links) from this page. A visitor deciding whether to send their CV doesn't need reading material, and every link takes them off the page. The guides stay reachable from the footer and the blog.
- **Shrink "Career Services Built to Get You Noticed"** (LinkedIn, guidance and masterclass cards, each with its own button) to one line placed after the FAQ: *"Also available: LinkedIn makeover from 5 KWD, one-to-one career guidance, masterclasses."* Today it competes with the main CTA at the point of decision.
- **New order:** hero → before/after → reviews → prices → how the free review works → FAQ → closing CTA → other services (one line) → footer. That's about 12 screens instead of 17.

### 4. Pricing: show what each package includes without leaving the page
*Principle: put proof next to the claim, and remove friction from the decision.*

- The cards show only who each package is "for", so the visitor has to tap "Compare what each package includes" and go to another page. Add 3 short bullets per card from your own package list:
  - **Essential, 4 KWD:** CV rewrite, ATS format, LinkedIn headline, 1 revision, delivered in 48h.
  - **Professional, 7 KWD:** adds a full LinkedIn makeover, a cover letter and 2 revisions, delivered in 24h.
  - **Executive, 10 KWD:** adds the executive format, a 30-minute strategy call and unlimited revisions, delivered in 12h.
- Put the one review that mentions speed or value directly under the cards.

### 5. The free review: promise when they'll hear back
*Principle: the next page (or the next minute) must match what the visitor assumes.*

- The "How the free review works" section is clear, but it never says *when* the review arrives. Add one line, for example "Your review notes arrive on WhatsApp within [X hours] during [hours]", once the response hours from the speed-to-lead plan are set. Use the same words on the form's thank-you screen.

### 6. Form friction
*Principle: ask only for what the next step needs.*

- The free review form requires name, WhatsApp, target role, target country and service; email and the CV upload are optional. That's reasonable for a review. Pre-fill **country** from the region (Kuwait on /kuwait) and **service** from the button that opened the form, if it doesn't already, so the visitor types only three things.

### 7. Copy lines
- "Career Services Built to Get You Noticed" is generic and could belong to any competitor. In the one-line version: "Also need LinkedIn or interview help?"
- The closing CTA, "Send your CV today. Get clear feedback, free.", is good. Replace its "500+ professionals supported" with the Google rating.
- **Accessibility bug:** the Saudi Arabia link in the menu is read out as "لا إله إلا الله محمد رسول الله Saudi Arabia", because the flag image's inscription is exposed as link text. Give the flag image `alt=""` (or aria-hidden) so the link reads "Saudi Arabia".

---

**What I'd do first:** items 1 and 2 together, as one session of code changes: the banner, the subheadline, the rating line, the review fallback and moving the reviews block up. They fix the first screen and put real proof next to the decision, using things you already have. Items 3 and 4 are next, and 5 waits on your response hours.

### Sources and assumptions
- I read the live page on Nov 17, 2026 in a phone-size browser (390px), scrolling the full length so every section rendered, and captured the text section by section. Package details, FAQ answers and form fields came from the site's code.
- Traffic is inferred (Google profile, organic search and WhatsApp links), not measured. No ads were assumed. Analytics would show the real split.
- The cause of the empty reviews section is inferred from the page falling back to its no-data state. The function's logs will confirm it.
- The copy was judged against the page-job principles. The full 7-dimension copy score wasn't run, because the rewrite here is a set of small edits, not new copy.
