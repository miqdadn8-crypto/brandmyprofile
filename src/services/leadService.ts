import { getLeadSource } from "@/lib/leadSource";
import { CV_MAX_BYTES, validateFile, validateLead, type LeadInput, type LeadTrigger } from "@/lib/leadValidation";

export interface LeadSubmission extends LeadInput {
  trigger: LeadTrigger;
  region: string;
  cvFile: File | null;
  honeypot: string;
  // Timestamp (ms) at which the form was shown - used for the minimum-fill-time spam check.
  formShownAt: number;
}

export type LeadResult = { ok: true; leadId: string } | { ok: false; message: string };

const FAILURE_MESSAGE = "We couldn't submit your request right now. Please try again or contact us on WhatsApp.";
const TIMEOUT_MS = 30000;

// Posts the lead to our own backend endpoint (api/lead.ts). Success is only reported when the
// server confirms the lead was stored - never optimistically.
export async function submitLead(submission: LeadSubmission): Promise<LeadResult> {
  const invalid = validateLead(submission);
  if (invalid) return { ok: false, message: invalid };
  if (submission.cvFile) {
    const fileProblem = validateFile(submission.cvFile);
    if (fileProblem) return { ok: false, message: fileProblem };
    if (submission.cvFile.size > CV_MAX_BYTES) return { ok: false, message: "The file is too large." };
  }

  const source = getLeadSource();
  const body = new FormData();
  body.set("name", submission.name.trim());
  body.set("email", submission.email.trim());
  body.set("whatsapp", submission.whatsapp.trim());
  body.set("targetRole", submission.targetRole.trim());
  body.set("targetCountry", submission.targetCountry);
  body.set("service", submission.service);
  body.set("region", submission.region);
  body.set("trigger", submission.trigger);
  body.set("sourcePage", window.location.href.split("#")[0].slice(0, 500));
  body.set("utm_source", source.utm_source);
  body.set("utm_medium", source.utm_medium);
  body.set("utm_campaign", source.utm_campaign);
  body.set("utm_content", source.utm_content);
  body.set("referrer", source.referrer);
  body.set("company_website", submission.honeypot); // honeypot: real users leave it empty
  body.set("fillMs", String(Date.now() - submission.formShownAt));
  if (submission.cvFile) body.set("cv", submission.cvFile, submission.cvFile.name);

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch("/api/lead", { method: "POST", body, signal: controller.signal });
    let data: { ok?: boolean; leadId?: string; message?: string } | null = null;
    try {
      data = await response.json();
    } catch {
      data = null; // malformed backend response
    }
    if (response.ok && data?.ok === true && typeof data.leadId === "string") {
      return { ok: true, leadId: data.leadId };
    }
    // 4xx validation messages are safe to show; anything else gets the generic message.
    const message = response.status >= 400 && response.status < 500 && data?.message ? data.message : FAILURE_MESSAGE;
    return { ok: false, message };
  } catch {
    return { ok: false, message: FAILURE_MESSAGE };
  } finally {
    window.clearTimeout(timer);
  }
}
