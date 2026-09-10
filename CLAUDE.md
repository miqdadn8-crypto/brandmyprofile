# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on localhost:8080
npm run build        # Production build + static page generation
npm run build:dev    # Development mode build
npm run lint         # ESLint with TypeScript support
npm run preview      # Preview production build locally
```

There is no test runner configured.

## Architecture Overview

**BrandMyProfile** is a region-aware career services platform (CV writing, LinkedIn optimization, career coaching, job listings) targeting GCC countries (Kuwait, UAE, Saudi Arabia, Qatar) and India.

**Stack:** React 18 + TypeScript, Vite (SWC), React Router v6, Tailwind CSS, shadcn/ui (Radix UI), Supabase, TanStack Query v5.

### Region-Based Routing

The entire app is structured around a `/:region` URL prefix. The `RegionContext` (`src/contexts/RegionContext.tsx`) handles:
- Region selection persisted to `localStorage`
- IP geolocation fallback for auto-detection
- Forced redirect to region selection at root `/`

Region codes: `kw` (Kuwait/KWD), `ae` (UAE/AED), `sa` (Saudi Arabia/SAR), `qa` (Qatar/QAR), `in` (India/INR)

Route pattern: `/:region/jobs`, `/:region/pricing`, `/:region/services/cv-writing`, etc. Blog routes (`/blog`, `/blog/:slug`) are global (no region prefix).

Region-less top-level paths (`/pricing`, `/jobs`, `/services/cv-writing`, etc., defined in `src/App.tsx`) redirect via `RootRedirect` to the equivalent `/:region/...` path rather than 404ing. Legacy job URLs (`/jobs/:region/:id`) also redirect to the current `/:region/jobs/:id` shape. When adding a new region-scoped page, add both the nested route under `/:region` and, if it should be reachable region-lessly, a matching `RootRedirect` route above it.

### Data Layer

Jobs fetching is abstracted in `src/services/jobsService.ts` with a configurable source in `src/config/jobs.ts`:
- `mock` — reads from `public/data/jobs.json` (current default)
- `adzuna` — external API via Supabase Edge Function at `supabase/functions/fetch-jobs/`
- `supabase` — direct Supabase DB query

The service implements 30-minute in-memory caching with stale-on-error fallback. Region-specific job filtering is handled by `REGION_KEYWORDS` mapping in the config.

Other content (blogs, services, testimonials, pricing) is sourced from `src/lib/data/*.json` static files.

### Component & Page Organization

- `src/pages/` — route-level page components
- `src/components/` — reusable components; `src/components/ui/` contains shadcn/ui primitives (do not edit these manually — use the shadcn CLI)
- `src/components/home/` — sections composing the Home page
- `src/hooks/` — custom hooks including `useRegionPricing`, `useServiceData`, `useBlogData`

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

### Styling

Tailwind with HSL CSS variables for theming (defined in `src/index.css`). Dark mode via `next-themes`. Use the `cn()` utility from `src/lib/utils.ts` for conditional class merging.

### SEO

`src/components/SEO.tsx` wraps pages with `react-helmet-async` for dynamic meta tags. `scripts/generate-static-pages.js` pre-renders region/page combinations post-build for SEO crawlability.

### Supabase

Two Supabase projects are configured via `.env` (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`). Client is initialized in `src/lib/supabase.ts` and `src/integrations/supabase/client.ts`. Generated DB types live in `src/integrations/supabase/types.ts`.
