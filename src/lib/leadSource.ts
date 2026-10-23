// First-touch source capture for leads. UTM parameters and the external referrer are stored
// in sessionStorage the first time they are seen, so they survive in-app navigation (the
// landing URL's query string is lost as soon as the user clicks a link).
// Everything is wrapped in try/catch: storage can be unavailable (private mode).

const KEY = "bmp_lead_source";

export interface LeadSource {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer: string;
}

const empty: LeadSource = { utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", referrer: "" };

export function captureLeadSource(): void {
  try {
    if (typeof window === "undefined" || sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    let referrer = "";
    if (document.referrer) {
      const ref = new URL(document.referrer);
      // Internal navigation is not a referrer
      if (ref.hostname !== window.location.hostname) referrer = `${ref.origin}${ref.pathname}`.slice(0, 300);
    }
    const source: LeadSource = {
      utm_source: (params.get("utm_source") ?? "").slice(0, 100),
      utm_medium: (params.get("utm_medium") ?? "").slice(0, 100),
      utm_campaign: (params.get("utm_campaign") ?? "").slice(0, 100),
      utm_content: (params.get("utm_content") ?? "").slice(0, 100),
      referrer,
    };
    sessionStorage.setItem(KEY, JSON.stringify(source));
  } catch {
    // ignore
  }
}

export function getLeadSource(): LeadSource {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}
