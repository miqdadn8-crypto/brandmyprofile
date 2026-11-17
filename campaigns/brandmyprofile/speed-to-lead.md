## SPEED TO LEAD: BrandMyProfile
2026-11-17 · no call or WhatsApp log yet, so this is the setup plus a first measurement to run; leaks inferred from how the site routes leads

### The leak

**Not measured yet: no call log or WhatsApp export was provided, so there's no scorecard.** The site's code shows where leads can wait, in likely order of size:

1. **Free CV review form leads land in an email inbox, and the person gets no timeframe.** Each submission goes to a Google Sheet and sends a notification email to your personal Gmail. The person sees only *"Our team will contact you."* There's no time promise, and nothing reaches their WhatsApp until someone reads the email. These are people who just uploaded their CV, the warmest leads you get. A notification email read in the evening is a lead that's already messaged CV Gulf or Labeeb. The "Continue on WhatsApp" button (which carries their reference number) helps, but only the people who tap it are covered.
2. **WhatsApp enquiries outside the hours someone is watching.** WhatsApp is your main channel, and the Google profile says "Open 24 hours". If a message at 1am waits until noon, the profile promised something you didn't deliver.
3. **Price enquiries that go quiet.** The site's package buttons open WhatsApp with *"I'm interested in the Professional package… listed at 7 KWD. Please share the next steps."* Each one is a priced quote. If the client doesn't pay after your reply, nobody owns chasing it.
4. **Missed phone calls to +965 41103254.** Size unknown. Ordinary calls to a mobile get no automatic reply.
5. **The Google Maps "Message" button.** Where it routes, and who answers, is unconfirmed (from the Google profile audit).

One related point to check: the site's service data says *"Receive your professionally crafted CV within 2-3 business days"*, while the packages promise 48 / 24 / 12 hours. If clients see both, expect "where is my CV?" messages tying up the chat.

### Messages (drafts, approve the exact words before turning any on)

Fill in **[name]** with a real person and **[hours]** with the hours you will genuinely answer (for example 9am–10pm).

**WhatsApp Business → Greeting message** (sent automatically to a new contact's first message):
> Hi, thanks for messaging BrandMyProfile. This is [name]. Send me your current CV (PDF or Word) and the job or country you're targeting, and I'll reply within 15 minutes during [hours] Kuwait time.

**WhatsApp Business → Away message** (outside [hours]):
> Thanks for your message. BrandMyProfile is offline right now, and [name] will reply by [10am] Kuwait time. To save time, send your CV and the role you're targeting, and we'll start with that.

**First WhatsApp to a free CV review form lead** (sent by a person, saved as quick reply `/form`):
> Hi [first name], this is [name] from BrandMyProfile. We got your free CV review request (ref [BMP-…]) for [target role] in [country]. I'm reviewing your CV now and will send my notes here by [time]. Anything specific you want me to look at?

**Missed phone call, sent from WhatsApp on the same number** (quick reply `/missed`):
> Hi, this is [name] at BrandMyProfile. Sorry we missed your call. How can I help? You can reply here, or I'll call you back within [15 minutes / by 10am].

**Price-enquiry follow-up** (one owner per enquiry; stop at a yes or a no):

| When | Message |
|---|---|
| Day 0 | Your normal reply with the package details and how to pay |
| Day 1 | "Hi [first name], did you get a chance to look at the [package] details? Happy to answer anything, or I can start with a free review of your current CV first." |
| Day 3 | "One thing that helps people decide: the free CV review shows exactly what we'd change before you pay anything. Want me to do that with the CV you have now?" |
| Day 7 | "Hi [first name], are you still applying for [role]? If the timing has changed, no problem." |
| Day 14 | "Should I close this out for now? If you start applying again later, just message here." |

These go only to people who asked for a price, and only about their enquiry. Add someone to promotions (offers, newsletters) only with their explicit consent.

### Who does what

| Situation | Who | Limit |
|---|---|---|
| WhatsApp message during [hours] | [name] (backup: [name]) | Human reply within 15 minutes |
| WhatsApp message after hours | Away message, then [name] | First reply by 30 minutes after opening, before new work |
| Free CV review form lead | [name] | First WhatsApp within 15 minutes in hours, then review notes by the promised time |
| Missed phone call | Whoever holds the phone | WhatsApp `/missed` within 5 minutes and a call back within 15 |
| Google Maps Message button | [name] | Same as WhatsApp |
| Price enquiries | [name] | Follow the cadence above, and log the next touch date |
| Daily sweep | [name] | At 10am, 2pm and 8pm, check the Sheet, missed calls and unread chats, and clear them before close |

### Setup checklist

- [ ] **Get form leads to buzz a phone.** In Gmail, create a filter for subject "New BrandMyProfile Lead" → *Mark as important* and apply the label "Leads". In the Gmail app on the duty phone, turn notifications on for that label only. (Better still, set the `NOTIFY_EMAIL` script property in the Apps Script to an inbox the duty person watches on their phone.)
- [ ] **Change the form's thank-you text** from "Our team will contact you." to a real promise such as *"We'll message you on WhatsApp within 15 minutes during [hours] Kuwait time."* Do this only after the promise can be kept. It's a one-line change in `src/components/lead/LeadModal.tsx`, and I can make it once you confirm the hours.
- [ ] Turn on WhatsApp Business **Greeting message** and **Away message** with the approved text (Business tools → Greeting / Away message). Set the away schedule to "outside business hours" and fill in the business hours.
- [ ] Save quick replies: `/form`, `/missed`, and the follow-up messages `/f1`, `/f3`, `/f7`, `/f14`.
- [ ] Add labels in WhatsApp Business: *New lead*, *Quoted*, *Paid*, *Closed*. Every price enquiry gets *Quoted* plus a next-touch date (a column in the leads Sheet works).
- [ ] Confirm where the Google Maps Message button routes. Then fix the profile's "Open 24 hours" to your real hours, or staff it.
- [ ] Align the delivery promise: remove "2-3 business days" or make it match the package timings.
- [ ] **Test:**
  - Submit the form from a personal phone, and time the notification and the first WhatsApp.
  - Message WhatsApp during and after hours, and check that the greeting and away texts arrive.
  - Call the number and let it ring out, then time the `/missed` reply.

### Measure again on: Monday 15 December 2026

To get a real scorecard, export these and share them (they stay in this workspace):
- **Form leads:** the leads Sheet already has a timestamp per lead. Add a "first reply at" column and fill it in for each lead from today. That gives median and worst first-reply time with no new tools.
- **WhatsApp:** for a sample of 20 new chats, note the first message time and your first reply time (WhatsApp Business has no response-time report).
- **Calls:** the call history from your carrier or phone, 30 days.

### Sources and assumptions
- No call log, WhatsApp export or leads-Sheet data was provided, so no answer rates or reply times are claimed.
- Lead routing was read from the site's code today: the form posts to `api/lead`, which sends it to a Google Apps Script that writes the Sheet, stores the CV and emails a notification. The success screen and the WhatsApp links were read from the same code.
- A2P 10DLC registration is a US texting rule and doesn't apply to replies from your Kuwait WhatsApp number. WhatsApp Business app automations (greeting, away, quick replies, labels) are built-in and free.
- The 15-minute limits are this plan's defaults for web and chat leads. Change them to what your team can actually keep, and promise customers only what you keep.
- To confirm: your real hours, the names to put in the table, how many people answer WhatsApp, and whether the "2-3 business days" text appears on any live page.
