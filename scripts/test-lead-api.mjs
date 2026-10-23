// Local test of api/lead.ts with the Google Apps Script layer MOCKED (global fetch replaced).
// No network call, no Google Sheet write, no email is ever made. Run: node scripts/test-lead-api.mjs
import { buildSync } from "esbuild";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "lead-api-")), "lead.mjs");
buildSync({ entryPoints: [path.join(root, "api/lead.ts")], bundle: true, format: "esm", platform: "node", outfile: out, logLevel: "silent" });

process.env.LEAD_APPS_SCRIPT_URL = "https://mock.invalid/exec";
process.env.LEAD_APPS_SCRIPT_SECRET = "test-secret";
const { default: handler, generateLeadId } = await import(pathToFileURL(out).href);

let failures = 0;
const check = (ok, msg) => { if (!ok) failures++; console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`); };

const sent = [];
let scriptBehaviour = "ok";
globalThis.fetch = async (url, init) => {
  sent.push({ url, body: JSON.parse(init.body) });
  if (scriptBehaviour === "down") throw new Error("network");
  if (scriptBehaviour === "bad") return new Response("<html>oops</html>", { status: 200 });
  if (scriptBehaviour === "fail") return new Response(JSON.stringify({ ok: false }), { status: 200 });
  if (scriptBehaviour === "duplicate") return new Response(JSON.stringify({ ok: true, duplicate: true, leadId: "BMP-20260101-AAAA" }), { status: 200 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

let ipCounter = 0;
const base = () => ({
  name: "Test User", email: "test@example.com", whatsapp: "+965 5000 0000", targetRole: "Project Engineer",
  targetCountry: "Kuwait", service: "ATS CV", region: "kuwait", trigger: "popup_time",
  sourcePage: "https://www.brandmyprofile.com/kuwait", utm_source: "google", utm_medium: "organic", utm_campaign: "", utm_content: "",
  referrer: "", company_website: "", fillMs: "9000",
});
async function post(fields = {}, file = null) {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...base(), ...fields })) if (v !== undefined) form.set(k, v);
  if (file) form.set("cv", file);
  const res = await handler(new Request("https://x.test/api/lead", { method: "POST", body: form, headers: { "x-forwarded-for": `10.0.0.${++ipCounter}` } }));
  return { status: res.status, body: await res.json() };
}
const pdf = (size = 200) => new File([Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(size)])], "cv.pdf", { type: "application/pdf" });

let r = await post();
check(r.status === 200 && r.body.ok && /^BMP-\d{8}-[A-Z2-9]{4}$/.test(r.body.leadId), "valid lead accepted, ID format BMP-YYYYMMDD-XXXX");
check(sent.at(-1).body.secret === "test-secret" && sent.at(-1).body.trigger === "popup_time" && sent.at(-1).body.utmSource === "google", "payload forwarded with secret, trigger and UTM");
check(/^BMP-\d{8}-[A-Z2-9]{4}$/.test(generateLeadId()), "server-side lead ID generator");

r = await post({ name: "" }); check(r.status === 400 && !r.body.ok, "missing name rejected");
r = await post({ whatsapp: "abc" }); check(r.status === 400, "invalid phone rejected");
r = await post({ email: "nope" }); check(r.status === 400, "invalid email rejected");
r = await post({ email: "" }); check(r.status === 200, "email optional");
r = await post({ whatsapp: "+91 98765 43210" }); check(r.status === 200, "international phone accepted");
r = await post({ targetCountry: "Mars" }); check(r.status === 400, "country outside controlled list rejected");
r = await post({ trigger: "made_up" }); check(r.status === 400, "arbitrary trigger string rejected");

const before = sent.length;
r = await post({ company_website: "http://spam.example" });
check(r.status === 200 && r.body.ok && sent.length === before, "honeypot: fake success, NOT forwarded/stored");
r = await post({ fillMs: "500" }); check(r.status === 400 && sent.length === before, "submitted too fast rejected");

r = await post({}, pdf()); check(r.status === 200 && sent.at(-1).body.file?.name.endsWith("cv.pdf"), "PDF upload accepted and forwarded");
r = await post({}, new File([Buffer.from("MZ....exe")], "cv.pdf.exe", { type: "application/octet-stream" })); check(r.status === 400, "executable rejected");
r = await post({}, new File([Buffer.from("hello")], "cv.txt", { type: "text/plain" })); check(r.status === 400, "unsupported type rejected");
r = await post({}, new File([Buffer.from("MZ-not-a-pdf")], "cv.pdf", { type: "application/pdf" })); check(r.status === 400, "fake PDF (bad signature) rejected");
r = await post({}, new File([Buffer.concat([Buffer.from("%PDF-"), Buffer.alloc(4 * 1024 * 1024 + 10)])], "big.pdf", { type: "application/pdf" })); check(r.status === 400, "oversized file rejected");

scriptBehaviour = "down"; r = await post(); check(r.status === 502 && !r.body.ok, "network failure -> error (no false success)");
scriptBehaviour = "bad"; r = await post(); check(r.status === 502 && !r.body.ok, "malformed backend response -> error");
scriptBehaviour = "fail"; r = await post(); check(r.status === 502 && !r.body.ok, "save failure -> error");
scriptBehaviour = "duplicate"; r = await post(); check(r.status === 200 && r.body.leadId === "BMP-20260101-AAAA", "duplicate returns original lead ID");
scriptBehaviour = "ok";

delete process.env.LEAD_APPS_SCRIPT_URL; r = await post(); check(r.status === 503 && !r.body.ok, "missing config -> error");
process.env.LEAD_APPS_SCRIPT_URL = "https://mock.invalid/exec";

const same = { "x-forwarded-for": "9.9.9.9" };
let limited = 0;
for (let i = 0; i < 7; i++) {
  const form = new FormData(); for (const [k, v] of Object.entries(base())) form.set(k, v);
  const res = await handler(new Request("https://x.test/api/lead", { method: "POST", body: form, headers: same }));
  if (res.status === 429) limited++;
}
check(limited === 2, "rate limit: 5 per window per client, extras get 429");
const get = await handler(new Request("https://x.test/api/lead")); check(get.status === 405, "GET rejected");

console.log(failures ? `\n${failures} FAILED` : "\nAll lead API checks passed (Apps Script mocked; no Sheet write, no email)");
process.exit(failures ? 1 : 0);
