---
target: one home page
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\ADMIN\\Desktop\\Mywebsite\\brandmyprofile\\src\\pages\\Home.tsx"
target_fingerprint: "sha256:70ff04f8eb1c22488a933522d567bfe2ff1162fe052cc45925075a2ca931f5b5"
target_path: "C:\\Users\\ADMIN\\Desktop\\Mywebsite\\brandmyprofile\\src\\pages\\Home.tsx"
timestamp: 2026-10-20T20-33-56Z
slug: src-pages-home-tsx
---
# Critique: Home page (Persuade)
Method: degraded single-context (no sub-agents permitted this session); no browser inspection.
Score 22/32 (n/a: 7, 10). Detector: 29 advisory design-system-font-size findings, no anti-patterns.
Priority issues:
- [P1] Hardcoded "500+ Professionals Supported" and five static stars in Hero.tsx badge (unverified claim). -> clarify
- [P1] Hero overloaded (~10 elements; "human reviewed" repeated ~4x). -> distill
- [P1] Pink used decoratively on featured service tile and hero stars/checks (One Action Rule). -> colorize
- [P2] Ad hoc radii (21px/26px/16px/1.25rem/bento) and literal type sizes. -> typeset
- [P2] Flat section rhythm; reviews mid-page. -> layout
