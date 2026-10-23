import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageContext, trackEvent, type AnalyticsEventName } from "@/lib/analytics";

const SOCIAL_HOSTS = ["linkedin.com", "instagram.com", "facebook.com", "x.com", "twitter.com", "youtube.com", "tiktok.com"];
const TRACKABLE: AnalyticsEventName[] = ["package_cta_click"];
// Shared approved CTA vocabulary - matching on the label keeps every CTA instance covered
// without editing each page.
const LABEL_EVENTS: Array<[string, AnalyticsEventName]> = [
  ["get my free cv review", "cv_review_click"],
  ["book consultation", "consultation_click"],
];

// Single integration point for click/route analytics. Renders nothing; every handler goes
// through trackEvent, which is a no-op while no analytics provider is configured.
// - WhatsApp links (wa.me) -> whatsapp_click
// - social links           -> outbound_social_click
// - CTA labels "Get My Free CV Review" / "Book Consultation" -> cv_review_click / consultation_click
// - elements opting in via data-track="package_cta_click" [data-track-service|-package]
// - /:region/pricing route -> pricing_view (once per navigation)
export default function AnalyticsEvents() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (/^\/[a-z]+\/pricing\/?$/.test(pathname)) {
      trackEvent("pricing_view", getPageContext(pathname));
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      try {
        const target = event.target as Element | null;
        const el = target?.closest?.("a, button, [data-track]") as HTMLElement | null;
        if (!el) return;
        const ctx = getPageContext(window.location.pathname);
        const tracked = el.closest("[data-track]") as HTMLElement | null;
        const eventName = tracked?.dataset.track as AnalyticsEventName | undefined;
        if (tracked && eventName && TRACKABLE.includes(eventName)) {
          trackEvent(eventName, {
            ...ctx,
            service: tracked.dataset.trackService ?? ctx.service,
            cta_location: tracked.dataset.trackLocation,
            package: tracked.dataset.trackPackage,
          });
        }
        const label = (el.textContent ?? "").trim().toLowerCase();
        const labelEvent = LABEL_EVENTS.find(([text]) => label.startsWith(text))?.[1];
        if (labelEvent) trackEvent(labelEvent, { ...ctx, cta_location: el.closest("header") ? "header" : el.closest("footer") ? "footer" : "page" });
        const href = el instanceof HTMLAnchorElement ? el.href : "";
        if (!href) return;
        const host = new URL(href).hostname.replace(/^www\./, "");
        if (host === "wa.me") {
          trackEvent("whatsapp_click", { ...ctx, service: tracked?.dataset.trackService ?? ctx.service, cta_location: tracked?.dataset.trackLocation });
        } else if (SOCIAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
          trackEvent("outbound_social_click", { ...ctx, cta_location: host });
        }
      } catch {
        // never interfere with navigation
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
