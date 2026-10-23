# Analytics readiness (NOT active)

**Status:** no analytics provider (GA4/GTM) is installed. `src/lib/analytics.ts` is a no-op
until `window.gtag` exists. Nothing is sent today.

## Integration points
| Concern | Location |
|---|---|
| App root / single click + route hook | `src/components/AnalyticsEvents.tsx`, mounted inside `<BrowserRouter>` in `src/App.tsx` |
| Event helper (allow-listed params, never throws) | `src/lib/analytics.ts` -> `trackEvent()` |
| WhatsApp clicks | any `https://wa.me/...` link, caught by the delegated listener (floating button is now an `<a>`) |
| `cv_review_click` / `consultation_click` | detected from CTA labels "Get My Free CV Review" / "Book Consultation" (keep this vocabulary stable) |
| `package_cta_click` | `data-track="package_cta_click" data-track-package=... data-track-service=...` on package enquiry links (CV Writing, LinkedIn, Pricing, Career Guidance, Masterclass) |
| `pricing_view` | route effect in `AnalyticsEvents` (fires once per navigation to `/:region/pricing`) |
| `contact_submit` | `Contact.tsx` and `Schedule.tsx`, only after WhatsApp actually opened (not on validation failure) |
| `resource_print` | print button in `GccCvChecklist.tsx` |
| `outbound_social_click` | delegated listener (LinkedIn/Instagram/etc. links in the footer) |

## Privacy rules for payloads
Allowed keys only: `page_type`, `region`, `service`, `cta_location`, `package`. The helper drops
every other key. Never send name, email, phone, CV text, job history, file names, message bodies.

## Future activation (choose ONE: GA4)
Use `VITE_GA_MEASUREMENT_ID` (do not add GTM as well). Activation work, in order:
1. **Privacy Policy review/update** - it currently states there are no analytics trackers; this must be
   changed *before or at* activation (disclose analytics, what is collected, retention, provider).
2. **Cookie/consent requirements** reviewed for the target regions (Kuwait/GCC/India, and any EU visitors);
   load the gtag script only after consent where required.
3. Add a loader that injects gtag only when `import.meta.env.VITE_GA_MEASUREMENT_ID` is set (and consent given).
4. Verify events in GA4 DebugView.

## Lead-capture events (added with the homepage lead popup)
`lead_popup_open`, `lead_popup_step_complete`, `lead_submit`, `lead_submit_success`, `lead_submit_error` - fired from
`src/components/lead/LeadModalContext.tsx` and `LeadModal.tsx`. Allowed params only: `region`, `service`, `page_type`,
`cta_location`, `lead_trigger` (added to the allow-list in `src/lib/analytics.ts`). Name, email, phone, target role,
CV file name/URL and any form value are never sent. Still a no-op until a provider exists.
