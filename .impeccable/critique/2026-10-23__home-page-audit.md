# Homepage audit — Kuwait

Date: 2026-10-23
Scope: supplied desktop screenshot (1920 × 7371, displayed downscaled), current homepage source, `.impeccable/design.json`, and earlier critiques. This is a screenshot and source audit, not a live browser, accessibility compliance, performance, or mobile certification. Application code was not changed.

## Verdict

Keep the visual direction; improve content reliability, evidence, and the order of decisions. The teal palette, editorial headings, prominent free-review action, and featured CV-writing card establish a coherent career-service brand. The page becomes less persuasive as generic document drawings, region navigation, and resources accumulate without comparable evidence of the delivered work.

Primary visitor: a Kuwait job seeker deciding whether to request a free CV review or buy a CV-writing package. Success means understanding the offer, trusting the provider, and confidently taking one of those actions. Existing React/Tailwind components are adequate; an architectural redesign is unnecessary.

## Prioritized findings

### P1 — Essential content appears incomplete in the supplied capture

Evidence: the third resource card is washed out, the FAQ heading is effectively absent, and the final CTA heading appears partially revealed. `src/components/motion/Reveal.tsx` starts content at opacity 0 and waits for intersection with a negative 80px viewport margin. Blog cards, the FAQ heading, and the final CTA use it.

Impact: a visitor or captured preview can encounter apparently unfinished sections. The code makes animation timing a plausible cause; it does not prove the content stays hidden during normal browsing. Do not diagnose the CTA as CSS clipping without reproduction.

Recommendation: make critical headings and actions visible by default; reserve entrance effects for optional decoration. Verify slow scrolling, fast scrolling, direct page loads, full-page capture, and reduced-motion mode. Pass when all essential text is fully visible after settling and motion is never required to discover an action.

### P1 — Visible credibility is weaker than the promise

Evidence: the hero claims “500+ Professionals Supported,” while the review area in the capture is only a link to Google. `TestimonialsSection.tsx` intentionally falls back to that link when live reviews are unavailable. The CV visuals are schematic drawings, not examples of writing quality.

Impact: visitors are asked to trust a writing service without seeing much of its actual work. A review link is useful but sends them away to establish confidence.

Recommendation: add one consented, anonymized example or an explicitly labeled illustrative before/after that demonstrates stronger writing. Keep the honest review fallback, and verify the basis for the numerical claim. Do not fabricate reviews, results, or sample client identities. Place evidence near the first package decision.

### P2 — The format comparison mixes different kinds of choices

Evidence: `CvFormatsSection.tsx` places “GCC Standard CV,” “ATS Friendly CV,” and “Professional CV Writing” in the same list, each with “See this format.” The third item is a service, not a parallel format; a GCC CV can also be ATS-friendly.

Impact: people must decode the service taxonomy before choosing, and may infer that regional suitability and ATS readability are mutually exclusive.

Recommendation: describe each document by use case and explain overlapping capabilities. Move the general writing service out of the format comparison, or rename the section and use destination-specific action labels. Offer a short “Not sure? We’ll recommend a format” route.

### P2 — Supporting sections dilute the main decision

Evidence: the page moves from hero to a standalone explanatory paragraph, review strip, services, formats, free review, regions, resources, FAQ, and final CTA. The screenshot is 7371px tall at 1920px width. Region navigation receives a full section even though Kuwait is already selected.

Impact: substantial scrolling repeats market positioning and navigation before resolving practical buying questions. Length alone is not a defect; the issue is how little new decision support some sections add.

Recommendation: prioritize hero → credible evidence → services and starting price → how the review/writing process works → useful examples → FAQ → final action. Keep the explanatory paragraph concise and integrate it with relevant service information. Reduce region navigation and resources to secondary sections. Preserve useful content rather than simply shrinking all spacing.

### P2 — The primary next step changes between header and page

Evidence: `Header.tsx` uses “Book Consultation”; the hero and review section emphasize “Get My Free CV Review”; the final CTA offers “Book Free Consultation” as a secondary action. The header and hero both use the pink action treatment for different destinations.

Impact: visitors must determine whether a review and consultation are separate offers, and whether the header consultation is also free. This weakens the design system’s One Action Rule.

Recommendation: make free review the consistently emphasized homepage action, with consultation secondary, or deliberately choose the reverse. Use the same name for the same offer and explain what happens after submission, including a turnaround expectation if the business can support it.

### P2 — Automatic lead capture can interrupt evaluation

Evidence: `LeadPopupTriggers.tsx` can open the form at 60% scroll, after 50 seconds of active interaction, or on desktop exit intent after 10 seconds. It includes once-per-session suppression and avoids another open dialog, which are useful safeguards.

Impact: ordinary reading can trigger a modal despite several existing review buttons and the WhatsApp entry point. This is a source-confirmed behavior, not an interaction observed in the screenshot.

Recommendation: prefer explicit requests or a quiet inline reminder. If automatic prompts remain, measure completed qualified requests and dismissals, and check that keyboard users recover their previous focus and reading position.

### P3 — Fine details and design guidance need reconciliation

Evidence: hero trust labels use 12–14px text and the proof badge uses 11–12px. The CV diagrams contain very faint lines, including `bg-foreground/12`; the Tailwind config does not explicitly extend opacity with 12. `.impeccable/design.json` calls serif typography a rare accent, but `.heading-section` uses serif throughout. The hero also contains a literal background HSL instead of a semantic surface token.

Impact: important reassurance is visually subordinate, the drawings look unfinished, and the stored design rules no longer fully describe the rendered page. The downscaled screenshot cannot establish actual contrast failures or prove which utilities compile.

Recommendation: inspect readability at native size, increase essential fine print where needed, and check generated CSS for the document-line opacity utility (use an explicit arbitrary opacity if needed). Retain the attractive editorial heading system and update its documented role, or selectively reduce serif usage. Consolidate the hero surface into a semantic token.

## What improved since the previous critique

- The Google-review fallback is now compact rather than a large empty area.
- Regions use a quiet pale background instead of a heavy dark panel.
- Resource cards use teal rather than the previously flagged pink decoration.
- Services visibly prioritize CV writing over secondary services.

## Verification still needed

- Live desktop check to distinguish reveal timing from persistent missing or clipped text.
- Mobile checks at 320, 390, and 768px: menu, primary action, article metadata wrapping, region cards, and WhatsApp overlap.
- Keyboard navigation, focus restoration, form validation/error/success states, and actual submission path.
- Computed contrast, 200% zoom/reflow, and reduced-motion behavior, including hero animations.
- Review loading/failure states and layout shifts; no performance score is inferred from the screenshot.

Suggested implementation order: content visibility → evidence and offer clarity → format labels and page order → small typography/token refinements. Retain the current brand direction.
