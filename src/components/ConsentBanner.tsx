import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONSENT_RESET_EVENT, GA_MEASUREMENT_ID, getConsent, initAnalytics, setConsent } from "@/lib/analyticsConsent";

// Asks once for analytics consent. Renders nothing when no GA4 ID is configured, so the
// site behaves exactly as before until analytics is switched on in Vercel.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    initAnalytics();
    setOpen(getConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_RESET_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen);
  }, []);

  // Marks <body data-consent-open="on"> while the bar is up so the floating WhatsApp bubble
  // steps aside on phones instead of sitting on top of it (see index.css).
  useEffect(() => {
    if (open) document.body.dataset.consentOpen = "on";
    else delete document.body.dataset.consentOpen;
    return () => {
      delete document.body.dataset.consentOpen;
    };
  }, [open]);

  if (!open) return null;

  const choose = (choice: "granted" | "denied") => {
    setConsent(choice);
    setOpen(false);
  };

  // A slim bar on the bottom edge rather than a card over the page: on a phone the old card
  // covered the headline and the main button on the first screen.
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics cookies"
      className="consent-bar fixed inset-x-0 bottom-0 z-[55] border-t border-border bg-card/95 px-3 py-2.5 shadow-[0_-8px_24px_-16px_hsl(var(--foreground)/0.35)] backdrop-blur supports-[backdrop-filter]:bg-card/90 md:inset-x-auto md:bottom-3 md:right-3 md:max-w-md md:rounded-[var(--radius-md)] md:border md:px-4 md:py-3"
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <p className="min-w-0 flex-1 text-xs leading-5 text-foreground sm:text-sm">
          We use analytics cookies to improve the site. No names, phone numbers or CVs are sent.{" "}
          <Link to="/privacy" className="font-semibold text-primary underline underline-offset-2">
            Privacy
          </Link>
        </p>
        <div className="flex shrink-0 gap-1.5">
          <Button size="sm" className="h-9 px-3" onClick={() => choose("granted")}>
            Accept
          </Button>
          <Button size="sm" variant="secondary" className="h-9 px-3" onClick={() => choose("denied")}>
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
