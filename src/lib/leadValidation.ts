// Shared lead-form rules. Imported by BOTH the browser form (src/components/lead) and the
// server endpoint (api/lead.ts), so client and server validation can never drift apart.
// The server is always the authority - client checks are only for fast feedback.

export const LEAD_SERVICES = [
  "Professional CV Writing",
  "ATS CV",
  "GCC CV",
  "LinkedIn Profile",
  "Career Guidance",
] as const;

export const LEAD_COUNTRIES = ["Kuwait", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "India", "Other"] as const;

// Controlled values for where a lead came from (never arbitrary strings).
export const LEAD_TRIGGERS = [
  "hero_cv_review",
  "free_review_section",
  "popup_time",
  "popup_scroll",
  "popup_exit_intent",
  "pricing",
  "service_page",
  "contact",
  "footer",
  "whatsapp",
] as const;

export type LeadService = (typeof LEAD_SERVICES)[number];
export type LeadCountry = (typeof LEAD_COUNTRIES)[number];
export type LeadTrigger = (typeof LEAD_TRIGGERS)[number];

// 4 MB: Vercel Functions reject request bodies above ~4.5 MB, so a larger CV could never arrive.
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ALLOWED_EXTENSIONS = ["pdf", "doc", "docx"] as const;
export const CV_ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
// A real human needs more than this to fill the form; faster submissions are treated as bots.
export const MIN_FILL_MS = 3000;
// Same normalized WhatsApp/email + same service inside this window is a duplicate.
export const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export interface LeadInput {
  name: string;
  email: string;
  whatsapp: string;
  targetRole: string;
  targetCountry: string;
  service: string;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Keeps a leading "+" and digits only. Accepts international formats (spaces, dashes, brackets).
export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") || trimmed.startsWith("00") ? `+${digits.replace(/^00/, "")}` : digits;
}

export function isValidPhone(value: string): boolean {
  if (!/^[+\d\s().-]+$/.test(value.trim())) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function validateFile(file: { name: string; size: number; type?: string }): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  // Reject double extensions that hide executables, e.g. "cv.pdf.exe"
  if (/\.(exe|js|sh|bat|cmd|msi|scr|com|vbs|jar|html?|svg)(\.|$)/i.test(file.name)) {
    return "Unsupported file type. Please upload a PDF, DOC or DOCX file.";
  }
  if (!(CV_ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return "Unsupported file type. Please upload a PDF, DOC or DOCX file.";
  }
  if (file.type && !CV_ALLOWED_MIME.includes(file.type)) {
    return "Unsupported file type. Please upload a PDF, DOC or DOCX file.";
  }
  if (file.size <= 0) return "The selected file is empty.";
  if (file.size > CV_MAX_BYTES) return `The file is too large. Maximum size is ${CV_MAX_BYTES / 1024 / 1024} MB.`;
  return null;
}

// Returns the first problem found, or null when the lead is valid.
export function validateLead(input: LeadInput): string | null {
  if (input.name.trim().length < 2 || input.name.trim().length > 100) return "Please enter your name.";
  if (input.email.trim() && !EMAIL_PATTERN.test(input.email.trim())) return "Please enter a valid email address or leave it blank.";
  if (!isValidPhone(input.whatsapp)) return "Please enter a valid WhatsApp number, including the country code if outside Kuwait.";
  if (input.targetRole.trim().length < 2 || input.targetRole.trim().length > 120) return "Please enter your target role.";
  if (!(LEAD_COUNTRIES as readonly string[]).includes(input.targetCountry)) return "Please select your target country.";
  if (!(LEAD_SERVICES as readonly string[]).includes(input.service)) return "Please choose the service you need help with.";
  return null;
}
