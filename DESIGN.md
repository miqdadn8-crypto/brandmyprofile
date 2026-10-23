---
name: BrandMyProfile
description: Region-aware career services for GCC and India job seekers, with credible teal editorial surfaces and a single red-pink call to action.
colors:
  deep-teal: "hsl(192 100% 20%)"
  deep-teal-hover: "hsl(192 100% 16%)"
  deep-teal-dark-mode: "hsl(192 100% 35%)"
  signal-pink: "hsl(349 95% 50%)"
  signal-pink-hover: "hsl(349 95% 45%)"
  paper: "hsl(0 0% 98%)"
  card-white: "hsl(0 0% 100%)"
  ink: "hsl(0 0% 7%)"
  slate-muted: "hsl(215 16% 47%)"
  mist: "hsl(210 20% 96%)"
  hairline: "hsl(214 32% 91%)"
  teal-wash: "hsl(192 45% 95%)"
  teal-50: "hsl(192 60% 95%)"
  teal-100: "hsl(192 60% 90%)"
  pink-wash: "hsl(349 85% 97%)"
  warm-paper: "hsl(32 38% 96%)"
  danger: "hsl(0 84% 60%)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
  section-title:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "clamp(2rem, 1.5rem + 1.8vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  editorial-accent:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontWeight: 700
rounded:
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
  card: "1rem"
  panel: "1.25rem"
  bento: "1.5rem"
spacing:
  section-y: "4rem"
  section-y-desktop: "6rem"
  gutter: "1rem"
  gutter-desktop: "2rem"
components:
  button-default:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.md}"
    height: "2.5rem"
    padding: "0.5rem 1rem"
  button-default-hover:
    backgroundColor: "{colors.deep-teal-hover}"
  button-cta:
    backgroundColor: "{colors.signal-pink}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.md}"
    height: "2.5rem"
    padding: "0.5rem 1rem"
  button-cta-hover:
    backgroundColor: "{colors.signal-pink-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-teal}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-outline-hover:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.card-white}"
  card-bento:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bento}"
    padding: "1.5rem"
---

# Design System: BrandMyProfile

## Overview

**Creative North Star: "The Trusted Career Atelier"**

The interface behaves like a well-run studio where careers are tailored: calm paper-white surfaces, a single deep teal that signals competence, and one decisive red-pink reserved for the next step. Cards are generous and softly lifted, so content feels crafted and orderly rather than loud. This is a marketing and service surface for people making a high-stakes decision, so it should read as credible first and persuasive second.

Density is moderate and airy. Sections breathe (`py-16` rising to `py-24`), and information is grouped into bento-style cards with large radii. Teal-tinted washes, never grey, tint the page so the whole system feels like one brand. Playful or trend-driven effects are absent; the one decorative flourish is a slow, quiet collage of mini CV documents in the hero.

**Key Characteristics:**
- Deep teal carries trust, with links, headings, surfaces and focus rings all in teal
- Red-pink appears only on primary calls to action
- Large, soft radii and long teal-tinted shadows
- One sans family (Inter) for nearly everything, with Playfair Display held back as an editorial accent
- Light and dark themes share the same hues

## Colors

A restrained two-hue palette on near-white paper: teal for trust, pink for action.

### Primary
- **Deep Teal** (hsl(192 100% 20%)): Brand color. Primary buttons, links, outline buttons, focus ring, heading emphasis, and shadow tint. Hover deepens to hsl(192 100% 16%). In dark mode it lifts to hsl(192 100% 35%) for contrast.

### Secondary
- **Signal Pink** (hsl(349 95% 50%)): The call-to-action color, used for the `cta` button variant and nothing decorative. Hover hsl(349 95% 45%); dark mode hsl(349 95% 55%).

### Neutral
- **Paper** (hsl(0 0% 98%)): Page background.
- **Card White** (hsl(0 0% 100%)): Cards, popovers, document mockups.
- **Ink** (hsl(0 0% 7%)): Body and heading text, also the dark-mode background.
- **Slate Muted** (hsl(215 16% 47%)): Secondary text and captions.
- **Mist** (hsl(210 20% 96%)): Secondary and muted fills.
- **Hairline** (hsl(214 32% 91%)): Borders and input outlines.

### Tints and Washes
- **Teal Wash** (hsl(192 45% 95%)) and Teal 50/100 (hsl(192 60% 95%) / hsl(192 60% 90%)): Section and hero backgrounds, soft panels.
- **Pink Wash** (hsl(349 85% 97%)): Faint counter-glow beside teal washes.
- **Warm Paper** (hsl(32 38% 96%)): Warm alternate section surface.

### Named Rules
**The One Action Rule.** Signal Pink marks the single next step. If a section has no action, it has no pink.

**The Tinted Neutral Rule.** Washes and shadows lean teal. Do not drop in neutral grey shadows or cool-grey panels beside the brand surfaces.

**The Token Rule.** Colors are HSL variables in `src/index.css`. Never hardcode brand hex in components.

## Typography

**Display / Body / Label Font:** Inter (with system-ui, sans-serif)
**Editorial Accent Font:** Playfair Display (with Georgia, serif), available as `font-serif`

**Character:** Clean, neutral and legible, so the content and the teal carry the personality. Playfair is a rare editorial counterpoint, not a default.

### Hierarchy
- **Display** (700, 2.25rem → 3rem → 3.75rem, tight tracking): h1 hero headlines.
- **Headline** (700, 1.875rem → 2.25rem → 3rem): h2 section titles.
- **Section Title** (Playfair 700, `.heading-section`, clamp 2rem to 3rem, 1.1): every homepage section h2, one shared fluid step.
- **Title** (700, 1.5rem → 1.875rem): h3 card and subsection titles.
- **Body** (400, 1rem, 1.5): Paragraphs and descriptions.
- **Label** (500, 0.875rem): Buttons, form labels, nav items.

### Named Rules
**The Tight Heading Rule.** Every heading is bold with tight tracking (`tracking-tight`); headings do not go light-weight.

## Layout

Mobile-first, single centered column system. `.section-container` caps content at `max-w-7xl` with `px-4 / sm:px-6 / lg:px-8`; `.section-padding` is `py-16` rising to `py-24` at `md`. The Tailwind container is centered with 2rem padding and a 1400px cap at `2xl`.

Pages sit under a `/:region` prefix, so layouts must tolerate different currencies and longer regional copy. Grids collapse to a single column on small screens. The hero collage has explicit breakpoints at 1100px, 1023px and 639px where decorative documents drop out progressively.

## Elevation & Depth

Hybrid: surfaces are mostly flat with tonal washes, and cards earn a soft, long, teal-tinted shadow. Depth is ambient rather than structural.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 14px 40px -30px hsl(192 100% 20% / 0.35)`): Resting bento cards.
- **Card Hover** (`box-shadow: 0 20px 50px -30px hsl(192 100% 20% / 0.45)`): Hover lift.
- **Nav** (`box-shadow: 0 8px 24px -18px rgb(0 0 0 / 0.18)`): Sticky header.
- **Standard sm to xl**: Utility tiers (`--shadow-sm` … `--shadow-xl`); the CTA button uses `shadow-lg` rising to `shadow-xl` on hover.

### Named Rules
**The Long Soft Shadow Rule.** Shadows use a large blur with a strongly negative spread so they read as ambient glow, never as hard drop shadows.

## Shapes

Soft and generous. Base radius is 0.75rem; Tailwind `rounded-md` and `rounded-sm` derive from it. Use only the tokens: `--radius-md` (1rem) for small panels, `--radius-lg` (1.25rem) for link cards, `--radius-bento` (1.5rem) for feature panels and hero frames. No literal pixel radii. Hairline 1px borders in a teal-tinted alpha (`border-primary/10`) outline white panels over washes. Hero document mockups are the exception: they are small paper rectangles with a 8px radius.

## Components

### Buttons
- **Shape:** Gently rounded (0.625rem), 2.5rem high by default; `lg` is 3rem, `xl` is 3.5rem with 0.75rem radius.
- **Default:** Deep Teal fill, white text; hover deepens the teal.
- **CTA:** Signal Pink fill, white text, large shadow that grows on hover (200ms).
- **Outline:** 2px Deep Teal border and text; fills teal on hover.
- **Secondary / Ghost / Link:** Mist fill; ghost is transparent; link is teal with an underline on hover.
- **Focus:** 2px teal ring with offset (`focus-visible:ring-2 ring-ring ring-offset-2`).

### Cards / Containers
- **Corner Style:** 1rem to 1.5rem (bento).
- **Background:** Card White, or a teal/pink/warm wash.
- **Shadow Strategy:** Card shadow at rest, Card Hover on hover.
- **Border:** Optional 1px `primary/10` hairline.
- **Internal Padding:** 1.5rem typical.

### Inputs / Fields
- **Style:** Hairline border, Card White fill, radius from the base scale (shadcn defaults).
- **Focus:** Teal ring consistent with buttons.

### Hero Document Collage (signature)
Decorative mini-CV cards (126 × 166px, 8px radius) layered behind the hero. Each has a colored top line and skeleton text lines, tinted by a single `--doc-accent` (mono, teal, ink, blue, rose, sky, sage). They drift on slow 14 to 19 second loops, are `pointer-events: none`, thin out below 1100px, and stop animating under `prefers-reduced-motion`.

### Trust Strip
A bordered, translucent-white grid of 2 or 4 cells with small teal icons and bold 13px captions, divided by `primary/10` hairlines. Used directly under the hero.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`) rather than raw colors.
- **Do** reserve Signal Pink (hsl(349 95% 50%)) for the one primary action in a view.
- **Do** use teal-tinted long shadows and the 1.5rem bento radius for feature cards.
- **Do** keep sections on the `py-16 md:py-24` rhythm inside `.section-container`.
- **Do** provide a `prefers-reduced-motion` fallback for any looping decoration.

### Don't:
- **Don't** add a new brand color without an HSL token in `src/index.css` and a Tailwind mapping.
- **Don't** use pink for decoration, icons, or secondary links.
- **Don't** use hard drop shadows or neutral-grey shadows beside teal surfaces.
- **Don't** edit `src/components/ui/` by hand; use the shadcn CLI.
- **Don't** assume brand and surface tokens change in dark mode; only the core tokens do, so verify dark surfaces explicitly.
