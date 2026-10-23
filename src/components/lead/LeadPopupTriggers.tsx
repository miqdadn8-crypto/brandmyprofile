import { useEffect } from "react";
import { useLeadModal } from "./LeadModalContext";
import { isLeadPopupSuppressed, suppressLeadPopup } from "@/lib/leadPopupSession";

// Engagement-based automatic popup for the homepage only. Opens at most once per session
// (see leadPopupSession) on whichever happens first:
//   - ~50s of visible, interacted time on the page          -> popup_time
//   - ~60% of the page scrolled                             -> popup_scroll
//   - desktop exit intent (mouse leaves through the top)    -> popup_exit_intent (never on touch devices)
// Never fires after: the popup was opened/dismissed, a WhatsApp link was clicked, or a lead was submitted.
const ACTIVE_MS = 50_000;
const SCROLL_RATIO = 0.6;
const EXIT_INTENT_MIN_MS = 10_000;

export default function LeadPopupTriggers() {
  const { openLeadModal } = useLeadModal();

  useEffect(() => {
    if (isLeadPopupSuppressed()) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let activeMs = 0;
    let interacted = false;
    let fired = false;
    const startedAt = Date.now();

    const fire = (trigger: "popup_time" | "popup_scroll" | "popup_exit_intent") => {
      if (fired || isLeadPopupSuppressed()) return;
      // Do not interrupt another open dialog (e.g. the mobile menu or the form itself).
      if (document.querySelector('[role="dialog"]')) return;
      fired = true;
      cleanup();
      openLeadModal({ trigger });
    };

    const markInteraction = () => { interacted = true; };

    const onScroll = () => {
      markInteraction();
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_RATIO) fire("popup_scroll");
    };

    const onMouseOut = (event: MouseEvent) => {
      if (!canHover || event.relatedTarget !== null || event.clientY > 0) return;
      if (Date.now() - startedAt < EXIT_INTENT_MIN_MS) return;
      fire("popup_exit_intent");
    };

    // Any WhatsApp click means the visitor already chose a contact route.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (anchor && /(^|\.)wa\.me$/.test(anchor.hostname)) {
        suppressLeadPopup();
        cleanup();
      }
    };

    // Count only time the tab is visible AND the visitor has interacted.
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && interacted) {
        activeMs += 1000;
        if (activeMs >= ACTIVE_MS) fire("popup_time");
      }
    }, 1000);

    function cleanup() {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick, true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick, true);
    return cleanup;
  }, [openLeadModal]);

  return null;
}
