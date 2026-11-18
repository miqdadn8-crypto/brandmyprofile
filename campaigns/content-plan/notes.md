# Keyword research notes, 2026-11-19

Rung 1, autocomplete (suggest.py, lines format, no gl param; files in campaigns/content-plan/suggest/):
linkedin-profile-optimization 101 · ats-cv 81 · linkedin-makeover 59 · linkedin-profile-writing 47 · cv-for-gulf-jobs 28 · cv-format-kuwait 26 · cv-writing-price 17 · career-guidance-kuwait 10 · cv-writing-kuwait 8 · resume-writing-kuwait 6 · linkedin-profile-kuwait 0 · cover-letter-for-kuwait 0 (0 = no rows returned; treated as unknown)

Validation:
- Kuwait CV format: demand PASS (26, place-specific) · market PASS · competitive PASS (Jobera 2023, builders) · advantage YES (practising CV writer, real template) → NOW
- LinkedIn profile writing: demand PASS (47 service-led) · market PASS · competitive MIXED (Labeeb ~10 pages) · advantage partial (price) → NEXT; naming fix now
- CV for Gulf jobs: demand PASS (28) · market PASS · competitive PASS (thin blogs) · advantage YES → NEXT
- CV writing service Kuwait: demand weak (1 completion each) · market PASS · competitive FAIL-ish (Labeeb) · pages exist → fix route, not content
- ATS CV: demand PASS but global/tool intent (Indonesian "adalah/artinya", checkers/builders) · market PASS · HIGH zero-click → HOLD (unlock ATS checker)
- Career guidance Kuwait: demand weak (10, mixed) → HOLD
- Jobs in Kuwait: not probed; jobs data is mock (CLAUDE.md) → leave out

Rung 2 (live results, WebSearch, 2026-11-19): "kuwait cv format", "linkedin profile writing service kuwait", "how to make cv for gulf jobs format". Results listed in the plan/brief. Existing pages from the 2026-11-17 crawl: kuwait-cv-format-guide 1311w in 2; gcc-cv-format-guide 1352w in 2; ats-cv-guide-kuwait 1258w in 1; india-to-gcc-jobs-guide 1284w in 0. None show visible dates, stats or cited sources. kuwait-cv-format-guide has no mention of nurse/fresher/MOH/driver/pdf (grep of built HTML).
