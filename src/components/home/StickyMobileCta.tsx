import { useEffect, useRef, useState } from "react";
import { FileSearch, MessageCircle } from "lucide-react";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Phones only. Once the hero buttons (#hero-cta) scroll off the top, both actions stay one tap
// away; the bar steps aside again wherever the page already shows them
// ([data-sticky-cta-stop]: the closing CTA band and the footer). While it is up it marks
// <body data-sticky-cta="on"> so the floating WhatsApp bubble hides instead of overlapping it.
export default function StickyMobileCta() {
  const { openLeadModal } = useLeadModal();
  const { selectedRegion } = useRegion();
  const barRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [atStop, setAtStop] = useState(false);
  const visible = pastHero && !atStop;
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.getElementById("hero-cta");
    const stops = Array.from(document.querySelectorAll("[data-sticky-cta-stop]"));
    const inStop = new Set<Element>();

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const stopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? inStop.add(entry.target) : inStop.delete(entry.target)));
      setAtStop(inStop.size > 0);
    });

    if (hero) heroObserver.observe(hero);
    stops.forEach((node) => stopObserver.observe(node));
    return () => {
      heroObserver.disconnect();
      stopObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // Off-screen controls must not be reachable by Tab or a screen reader.
    if (barRef.current) barRef.current.inert = !visible;
    if (visible) document.body.dataset.stickyCta = "on";
    else delete document.body.dataset.stickyCta;
    return () => {
      delete document.body.dataset.stickyCta;
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_hsl(var(--foreground)/0.35)] backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:hidden",
        "transition-transform duration-300 ease-enter motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openLeadModal({ trigger: "hero_cv_review" })}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-base font-semibold text-accent-foreground transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <FileSearch className="h-5 w-5" aria-hidden="true" />
          Free CV Review
        </button>
        <a
          href={buildWhatsAppUrl(`Hello BrandMyProfile, I'd like help with my CV for jobs in ${place}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-primary/40 px-4 text-base font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
