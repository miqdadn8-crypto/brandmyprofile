// Tiny, provider-agnostic analytics layer. It does NOTHING until a provider (a global
// `window.gtag`, i.e. GA4) is present - no provider is installed or configured today, so
// every call is a silent no-op. It never throws, never blocks navigation and never logs.
// See docs/analytics-readiness.md for the activation checklist (privacy policy + consent
// review is REQUIRED before a provider is added).

export type AnalyticsEventName =
  | "whatsapp_click"
  | "cv_review_click"
  | "pricing_view"
  | "package_cta_click"
  | "consultation_click"
  | "contact_submit"
  | "resource_print"
  | "outbound_social_click"
  | "lead_popup_open"
  | "lead_popup_step_complete"
  | "lead_submit"
  | "lead_submit_success"
  | "lead_submit_error";

// Privacy allow-list: only these non-personal keys can ever leave the app. Anything else
// (names, emails, phones, CV text, WhatsApp message bodies, file names...) is dropped.
const ALLOWED_PARAMS = ["page_type", "region", "service", "cta_location", "package", "lead_trigger"] as const;
export type AnalyticsParams = Partial<Record<(typeof ALLOWED_PARAMS)[number], string>>;

type GtagFn = (command: "event", name: string, params?: Record<string, string>) => void;

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  try {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
    if (typeof gtag !== "function") return;
    const safe: Record<string, string> = {};
    for (const key of ALLOWED_PARAMS) {
      const value = params[key];
      if (typeof value === "string" && value) safe[key] = value.slice(0, 80);
    }
    gtag("event", name, safe);
  } catch {
    // Analytics must never affect the page.
  }
}

// Derives the non-personal page context from a pathname such as /kuwait/services/ats-cv.
export function getPageContext(pathname: string): { region?: string; page_type: string; service?: string } {
  const [first, second, third] = pathname.split("/").filter(Boolean);
  const regionCodes = ["kuwait", "uae", "saudi", "qatar", "india", "bahrain", "oman"];
  const region = regionCodes.includes(first ?? "") ? first : undefined;
  const rest = region ? [second, third] : [first, second];
  if (!rest[0]) return { region, page_type: "home" };
  if (rest[0] === "services" && rest[1]) return { region, page_type: "service", service: rest[1] };
  return { region, page_type: rest[0] };
}
