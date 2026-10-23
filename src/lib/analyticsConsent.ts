// GA4 loader, gated on consent. Nothing is loaded unless VITE_GA_MEASUREMENT_ID is set AND
// the visitor accepted analytics in the consent banner. Once gtag exists, the events in
// src/lib/analytics.ts start flowing; before that they stay no-ops.

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "bmp-analytics-consent";
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
export const CONSENT_RESET_EVENT = "bmp-consent-reset";

export function getConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private mode / blocked storage: the choice simply isn't remembered.
  }
  if (choice === "granted") loadAnalytics();
}

// Clears the stored choice so the banner asks again (footer "Cookie settings").
export function resetConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}

let loaded = false;

export function loadAnalytics(): void {
  if (loaded || !GA_MEASUREMENT_ID || typeof window === "undefined") return;
  loaded = true;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  // GA4 enhanced measurement records SPA page views on history changes.
  w.gtag("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

// Called once at startup: returning visitors who already accepted get analytics immediately.
export function initAnalytics(): void {
  if (getConsent() === "granted") loadAnalytics();
}
