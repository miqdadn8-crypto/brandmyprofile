import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { captureLeadSource } from "@/lib/leadSource";
import { suppressLeadPopup } from "@/lib/leadPopupSession";
import type { LeadService, LeadTrigger } from "@/lib/leadValidation";

// The modal (Radix dialog + form) is a separate chunk, only downloaded when first opened.
const LeadModal = lazy(() => import("./LeadModal"));

interface OpenOptions {
  trigger: LeadTrigger;
  service?: LeadService;
}

interface LeadModalContextValue {
  openLeadModal: (options: OpenOptions) => void;
}

const LeadModalContext = createContext<LeadModalContextValue>({ openLeadModal: () => undefined });

// Single shared lead modal for the whole app: every "Get My Free CV Review" button and the
// automatic popup triggers go through openLeadModal(), so there is only ever one form.
export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; trigger: LeadTrigger; service?: LeadService }>({
    open: false,
    trigger: "free_review_section",
  });

  const returnFocus = useRef<HTMLElement | null>(null);

  const openLeadModal = useCallback((options: OpenOptions) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    captureLeadSource();
    // Opening it (manually or automatically) means it must never auto-show again this session.
    suppressLeadPopup();
    trackEvent("lead_popup_open", { lead_trigger: options.trigger, cta_location: options.trigger });
    setState({ open: true, trigger: options.trigger, service: options.service });
  }, []);

  const value = useMemo(() => ({ openLeadModal }), [openLeadModal]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      {state.open && (
        <Suspense fallback={null}>
          <LeadModal
            open={state.open}
            trigger={state.trigger}
            initialService={state.service}
            onRestoreFocus={() => {
              const target = returnFocus.current;
              if (target?.isConnected) target.focus();
              else document.querySelector<HTMLButtonElement>('[aria-label="Open menu"]')?.focus();
            }}
            onOpenChange={(open) => setState((current) => ({ ...current, open }))}
          />
        </Suspense>
      )}
    </LeadModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLeadModal = () => useContext(LeadModalContext);
