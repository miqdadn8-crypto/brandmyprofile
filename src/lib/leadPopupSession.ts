// Session-level suppression for the automatic lead popup. Once any of these happens the popup
// must not auto-show again in this browser session: it was opened (manually or automatically),
// dismissed, the user clicked a WhatsApp link, or a lead was submitted.
// sessionStorage can be unavailable (private mode) - fall back to a module variable.

const KEY = "bmp_lead_popup_suppressed";
let memoryFlag = false;

export function suppressLeadPopup(): void {
  memoryFlag = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // ignore
  }
}

export function isLeadPopupSuppressed(): boolean {
  if (memoryFlag) return true;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
