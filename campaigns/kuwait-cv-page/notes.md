# Teardown notes, /kuwait, 2026-11-17

Capture: Playwright Chromium, 390x664 isMobile, scrolled 0→15000 in 500px steps to fire Reveal animations; sections = top-level <section> elements. Raw JSON: scratchpad kw-sections.json (session-only).

Page height 11,394px ≈ 17 screens. Forms in DOM: 0 (free review is a modal, LeadModal.tsx). Footer links: 17. Header nav links: logo, Pricing, Jobs, UAE, Saudi Arabia (link text includes the shahada from the flag image), Qatar, India.

Sections (top px, words, CTAs):
- 32 hero (69w): Get My Free CV Review · Chat on WhatsApp · Google reviews/Read them; trust strip: 500+ / Human written / From 4 KWD / Google reviews
- 929 What we change in your CV (79w): tabs Operations/Customer service/Engineering; illustrative before/after; CTA free review
- 2042 Simple prices in KWD (95w): 4/7/10 KWD, bestFor only; Ask about X (WhatsApp) ×3; Compare what each package includes (→/pricing)
- 3684 Not Sure What's Holding Your CV Back? (162w): 4 review areas, how it works 01-03; CTA free review + Continue on WhatsApp
- 5247 reviews (11w): fallback only, "Read our reviews on Google" (TestimonialsSection: !isLive branch)
- 5517 Career Services Built to Get You Noticed (112w): View CV Packages · Improve My LinkedIn · Book Career Guidance · Explore Masterclasses
- 7314 FAQ (138w visible): 9 questions; delivery 48/24/12h (faqs.json) consistent with packages; refund: none, revisions instead
- 8711 closing CTA (47w): free review + WhatsApp; "500+ professionals supported"
- 9301 Career Resources (120w): 3 guides + All career guides

Form required fields (leadValidation.ts): name, whatsapp, targetRole, targetCountry, service. Optional: email, CV file.
Package features: src/pages/Pricing.tsx pricingTiers. Turnaround: faqs.json.
