# PSEO notes: role CV pattern, 2026-11-19
- Autocomplete: curl suggestqueries client=firefox, 12 stems x {kuwait, for kuwait, for gulf, for dubai}; raw responses in suggest/*.txt. Completions beyond the echoed query: driver 7, teacher 4, nurse 3, sales 3, security guard 3, doctor 2, accountant/civil engineer/electrician/engineer 1, hr/it 0 (all mostly Dubai).
- Existing industry library (dist): india/{engineering,finance,technology}-gcc; kuwait/{construction,engineering,finance,oil-gas}; qatar/{construction,energy,hospitality}; saudi/{construction,engineering,healthcare,technology}; uae/{construction,finance,hospitality,technology} = 18 pages.
- Rendered (Playwright 390px): kw oil-gas 752w (static 100), kw finance 636w (99), kw construction 664w (103), uae construction 653w (102). Shared H2 skeleton: "Industry-Specific CV Priorities", "What to Bring to the Front of Your CV", "What to Avoid", "See What Clearer Positioning Changes", "Examples of Profiles…".
- difflib word-sequence ratio: kw oil-gas vs kw finance 0.59; kw oil-gas vs kw construction 0.62; kw construction vs uae construction 0.74.
- No dataset or pages built (NO verdict).
