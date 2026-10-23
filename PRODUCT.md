# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Job seekers across career levels, from fresh graduates to mid-career professionals, in the GCC (Kuwait, UAE, Saudi Arabia, Qatar) and India. They are preparing to apply for jobs and need a CV, LinkedIn profile and guidance that fit their target market.

## Product Purpose
BrandMyProfile is a region-aware career services platform: CV writing, LinkedIn optimization, career coaching and a jobs board. Success is a visitor who books a service or contacts the team to start.

## Positioning
An all-in-one career stack: CV, LinkedIn, coaching and job listings in one place, with content and pricing adapted per region (KWD, AED, SAR, QAR, INR).

## Operating Context
- Every page lives under a `/:region` prefix; region is chosen on first visit and drives currency, content and job filtering.
- Leads come through forms and WhatsApp; WhatsApp is the main contact channel.
- Pricing tiers: Basic, Pro, Elite.

## Capabilities and Constraints
- Stack: React 18, TypeScript, Vite, Tailwind, shadcn/ui, Supabase.
- English only for now; Arabic (RTL) is a later phase and is undecided.
- Jobs data currently comes from a mock JSON source, with Adzuna and Supabase as other configured sources.

## Brand Commitments
- Existing identity: deep teal primary with a red-pink CTA accent (see DESIGN.md).
- Tone: professional and credible.

## Evidence on Hand
- Service and pricing copy in `src/lib/data/*.json`.
- Testimonials component exists in `src/components/home/`.
- Do not invent testimonials, customer counts or statistics. Use only real, supplied proof.

## Product Principles
1. Region fit first: content, currency and norms reflect the visitor's market.
2. Credibility over hype: no unverifiable claims.
3. One path to contact: WhatsApp and the lead form stay prominent and easy.
4. One platform, many needs: services and jobs reinforce each other.
