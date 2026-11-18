# Lead magnet research, 2026-11-19

Searches (live, web search, 2026-11-19):
- "free kuwait cv template word download": generic free Word templates (standout-cv.com, resumelab.com, myperfectcv.co.uk, livecareer, freesumes, wps.com); SignNow Kuwait form; VisualCV Kuwait page; paid "GCC CV template" $5 on selar.com (marine/oil&gas/engineering). No free Kuwait-specific template found.
- "free ATS CV checker GCC Dubai Kuwait": free checkers: AutoApplyMax (in-browser, 0-100 score), JobXDubai (3 scans/day), ATS Verification (UAE), HireFlow, MenaJobs (GCC, lists Kuwait), RemoteDXB AI CV Reviewer, Labeeb "Free ATS Resume Checker & Optimizer" (via WhatsApp). None Kuwait-specific. Saturated in UAE.
- Ad libraries not checked (Meta Ad Library needs a browser session; not run).

Existing BMP magnets: human free CV review (/<region>/free-cv-review, form + WhatsApp); /resources/gcc-cv-checklist (printable, no email).
Demand evidence (keyword plan 2026-11-19): "kuwait cv format in word / pdf / pdf free download", "cv template kuwait", "free cv template for gulf jobs 2025"; "ats cv checker free" (global, huge).

## Build QA, 2026-11-19
- 4 .docx validated (zip ok, real Word bullets, bracketed guidance + removable guidance box); 4 PDFs read back (text + layout), banner label fixed.
- npm run build: /resources/kuwait-cv-template prerendered; sitemap 109 URLs. tsc + eslint clean.
- vite preview (port 4317), Playwright 390px: all 8 file links 200 (PDF application/pdf; .docx had no content-type from vite preview, confirm Vercel serves application/vnd.openxmlformats-officedocument.wordprocessingml.document after deploy), guide link 200, WhatsApp prefill correct, "Upload my CV instead" opens the lead modal (trigger template_magnet), no page errors. Screenshot: page-phone.png.

## 2026-11-19 change: WhatsApp-only
Owner will not monitor the Sheet. Template page: upload button removed, WhatsApp only. Site-wide LeadModal step 3 now "One last step: send it on WhatsApp" with the message pre-filled (reference, service, target role, country; never name/email/phone). Form still posts to /api/lead as a silent backup (Sheet + Drive CV + email). QA: mocked /api/lead in Playwright, form submitted on /kuwait at 390px, step 3 renders, wa.me text correct, no page errors (modal-step3.png).
