// Vercel Edge Function: receives Free CV Review leads from the website and forwards them to a
// private Google Apps Script web app, which (1) stores the CV in a private Google Drive folder,
// (2) appends a row to a private Google Sheet and (3) emails the notification.
//
// Why this shape: no credentials, Sheet/Drive IDs or email secrets ever reach the browser, and
// no new paid service is needed - everything lives in the owner's Google account.
//
// Environment variables (Vercel project settings; NOT VITE_-prefixed so they stay server-side):
//   LEAD_APPS_SCRIPT_URL     the deployed Apps Script web-app URL
//   LEAD_APPS_SCRIPT_SECRET  shared secret, must match the Script Property LEAD_SECRET
//
// Spam protection: honeypot (silently accepted, never stored), minimum fill time, per-IP rate
// limit (in-memory, best-effort per instance; the IP is never stored or forwarded), strict
// validation, and duplicate detection in the Apps Script (see integrations/google-apps-script).

import {
  CV_MAX_BYTES,
  DUPLICATE_WINDOW_MS,
  LEAD_TRIGGERS,
  MIN_FILL_MS,
  normalizePhone,
  validateFile,
  validateLead,
} from "../src/lib/leadValidation";

export const config = { runtime: "edge" };

const MAX_REQUEST_BYTES = CV_MAX_BYTES + 256 * 1024;
const RATE_LIMIT = 5; // submissions
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

function rateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

// Format: BMP-YYYYMMDD-XXXX (4 unambiguous characters, generated server-side).
export function generateLeadId(now = new Date()): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `BMP-${date}-${suffix}`;
}

// Magic-byte check so a renamed executable cannot pass as a PDF/DOC/DOCX.
function hasExpectedSignature(extension: string, bytes: Uint8Array): boolean {
  const startsWith = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (extension === "pdf") return startsWith([0x25, 0x50, 0x44, 0x46]); // %PDF
  if (extension === "docx") return startsWith([0x50, 0x4b, 0x03, 0x04]); // PK zip
  if (extension === "doc") return startsWith([0xd0, 0xcf, 0x11, 0xe0]); // OLE2
  return false;
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

const safeFileName = (name: string) =>
  name.replace(/[^A-Za-z0-9._-]/g, "_").replace(/_{2,}/g, "_").slice(-80) || "cv";

const field = (form: FormData, key: string, max = 300) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false, message: "Method not allowed." });

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_REQUEST_BYTES) return json(413, { ok: false, message: "The upload is too large." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, message: "Invalid request." });
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (field(form, "company_website")) return json(200, { ok: true, leadId: generateLeadId() });

  const now = Date.now();
  const clientKey = (request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  if (rateLimited(clientKey, now)) {
    return json(429, { ok: false, message: "Too many requests. Please wait a few minutes or contact us on WhatsApp." });
  }

  const fillMs = Number(field(form, "fillMs", 12));
  if (!Number.isFinite(fillMs) || fillMs < MIN_FILL_MS) {
    return json(400, { ok: false, message: "Please review your details and submit again." });
  }

  const input = {
    name: field(form, "name", 120),
    email: field(form, "email", 200),
    whatsapp: field(form, "whatsapp", 40),
    targetRole: field(form, "targetRole", 140),
    targetCountry: field(form, "targetCountry", 40),
    service: field(form, "service", 60),
  };
  const invalid = validateLead(input);
  if (invalid) return json(400, { ok: false, message: invalid });

  const trigger = field(form, "trigger", 40);
  if (!(LEAD_TRIGGERS as readonly string[]).includes(trigger)) {
    return json(400, { ok: false, message: "Invalid request." });
  }

  let file: { name: string; mime: string; base64: string } | null = null;
  const upload = form.get("cv");
  if (upload instanceof File && upload.size > 0) {
    const problem = validateFile({ name: upload.name, size: upload.size, type: upload.type });
    if (problem) return json(400, { ok: false, message: problem });
    const bytes = new Uint8Array(await upload.arrayBuffer());
    const extension = upload.name.split(".").pop()?.toLowerCase() ?? "";
    if (!hasExpectedSignature(extension, bytes)) {
      return json(400, { ok: false, message: "The file content does not match its type. Please upload a valid PDF, DOC or DOCX file." });
    }
    // Only a sanitised name is forwarded; original metadata inside the document is not altered.
    file = { name: safeFileName(upload.name), mime: upload.type || "application/octet-stream", base64: toBase64(bytes) };
  }

  const scriptUrl = process.env.LEAD_APPS_SCRIPT_URL;
  const scriptSecret = process.env.LEAD_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !scriptSecret) {
    console.error("Lead endpoint is not configured (LEAD_APPS_SCRIPT_URL / LEAD_APPS_SCRIPT_SECRET missing).");
    return json(503, { ok: false, message: "We couldn't submit your request right now." });
  }

  const leadId = generateLeadId();
  const payload = {
    secret: scriptSecret,
    leadId,
    timestamp: new Date(now).toISOString(),
    duplicateWindowMs: DUPLICATE_WINDOW_MS,
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    whatsappNormalized: normalizePhone(input.whatsapp),
    targetRole: input.targetRole,
    targetCountry: input.targetCountry,
    service: input.service,
    region: field(form, "region", 20),
    sourcePage: field(form, "sourcePage", 500),
    trigger,
    utmSource: field(form, "utm_source", 100),
    utmMedium: field(form, "utm_medium", 100),
    utmCampaign: field(form, "utm_campaign", 100),
    utmContent: field(form, "utm_content", 100),
    referrer: field(form, "referrer", 300),
    file,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" }, // avoids a CORS-style preflight on Apps Script
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "follow",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || result.ok !== true) {
      console.error("Lead storage failed", response.status);
      return json(502, { ok: false, message: "We couldn't submit your request right now." });
    }
    return json(200, { ok: true, leadId: typeof result.leadId === "string" ? result.leadId : leadId });
  } catch (error) {
    console.error("Lead forwarding error", error instanceof Error ? error.name : "unknown");
    return json(502, { ok: false, message: "We couldn't submit your request right now." });
  } finally {
    clearTimeout(timer);
  }
}
