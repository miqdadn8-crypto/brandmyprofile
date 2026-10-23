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

  if (!open) return null;

  const choose = (choice: "granted" | "denied") => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics cookies"
      className="fixed inset-x-3 bottom-[5.5rem] z-[55] mx-auto max-w-xl rounded-[var(--radius-md)] border border-border bg-card p-4 shadow-[var(--shadow-card-hover)] sm:inset-x-6 sm:p-5 md:bottom-3"
    >
      <p className="text-sm leading-6 text-foreground">
        We'd like to use Google Analytics cookies to see which pages help visitors, so we can improve the site. No
        names, phone numbers or CV details are sent.{" "}
        <Link to="/privacy" className="font-semibold text-primary underline underline-offset-4">
          Privacy Policy
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => choose("granted")}>
          Accept analytics
        </Button>
        <Button size="sm" variant="secondary" onClick={() => choose("denied")}>
          Decline
        </Button>
      </div>
    </div>
  );
}
