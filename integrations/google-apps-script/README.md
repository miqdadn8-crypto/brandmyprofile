# Lead intake - setup (not yet done)

Pipeline: browser form -> `POST /api/lead` (Vercel Edge, `api/lead.ts`) -> this Apps Script web app -> private Drive folder (CV) + private Google Sheet row + email to the owner.

## One-time setup (owner)
1. Create a **private** Google Sheet (any name) and a **private** Drive folder for CVs. Note both IDs. Do not share either.
2. Go to script.google.com, create a project, paste `lead-intake.gs`.
3. Project Settings > Script properties: `LEAD_SECRET` (long random string), `SHEET_ID`, `DRIVE_FOLDER_ID`, optional `NOTIFY_EMAIL` (defaults to miqdadn2@gmail.com).
4. Deploy > New deployment > Web app: Execute as **Me**, access **Anyone** (the secret protects it). Authorize Drive/Sheets/Mail scopes. Copy the `/exec` URL.
5. Vercel project > Environment Variables (server-side, not `VITE_`): `LEAD_APPS_SCRIPT_URL` = the `/exec` URL, `LEAD_APPS_SCRIPT_SECRET` = the same secret as `LEAD_SECRET`.
6. Redeploy, then send ONE real test lead and confirm the Sheet row, the Drive file and the email.

## Sheet columns
Timestamp, Lead ID, Name, Email, WhatsApp, Target Role, Target Country, Service Interest, Region, Source Page, Lead Trigger, UTM Source, UTM Medium, UTM Campaign, Referrer, CV File URL, Status, Notes, UTM Content (the extra last column keeps the requested order intact).

## Rules implemented
- Duplicate: same normalized WhatsApp **or** same email, AND same service, within 10 minutes -> the original Lead ID is returned and no second row/email is created. A genuine returning customer after 10 minutes, or asking about a different service, is saved normally.
- A saved lead whose email notification fails is still reported as success (the lead is safe in the Sheet); failures are logged in Apps Script executions.
- Values starting with `=`, `+`, `-`, `@` are prefixed to prevent formula injection.
- CV files are stored privately (owner only); the Sheet holds only the Drive URL.

## Known limits
- Apps Script quotas apply (about 100 emails/day on a free Google account; 6 min execution).
- Uploads are capped at 4 MB because Vercel rejects request bodies above ~4.5 MB. For larger CVs, switch to direct-to-storage signed uploads later.
- PDF/DOC metadata inside uploaded files is not stripped (no safe dependency-free way); only the file name is sanitised.
- The in-memory rate limit in `api/lead.ts` is per serverless instance (best effort).
