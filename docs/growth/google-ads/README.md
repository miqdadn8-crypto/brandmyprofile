# Google Ads: GCC CV writing search campaigns

Files in this folder:

| File | What it is |
|---|---|
| `keywords.csv` | 552 keywords for 6 campaigns (Kuwait, UAE, Saudi Arabia, Qatar, Bahrain, Oman), Google Ads Editor format |
| `negative-keywords.csv` | 68 negative phrases that block wasted clicks |

## Campaign structure

One search campaign per country, each geo-targeted to that country only. Every keyword sends people to that country's ads landing page, for example `https://www.brandmyprofile.com/kuwait/free-cv-review`.

| Ad group | Example keywords | Status |
|---|---|---|
| CV Writing | cv writing kuwait, cv writer dubai, cv writing services riyadh | Enabled |
| CV Writing - Cities | cv writing salmiya, cv writer jeddah | Enabled |
| Resume Writing | resume writing services kuwait, resume writer abu dhabi | Enabled |
| ATS CV | ats cv, ats friendly resume, ats cv kuwait | Enabled |
| Best CV Service | best cv writing service kuwait, best cv writer dubai | Enabled |
| Free CV Review | free cv review kuwait, cv review doha | Enabled |
| GCC CV Format | gcc cv format, cv format for kuwait jobs | Enabled |
| LinkedIn (optional) | linkedin profile optimization kuwait | Paused, landing on the LinkedIn page |
| Arabic (optional) | كتابة سيرة ذاتية الكويت | Paused: enable only if you can reply on WhatsApp in Arabic |

Match types: core terms are Exact and Phrase; the rest are Phrase. No Broad match until conversion data exists.

## Importing

1. Install Google Ads Editor and download your account.
2. **Account > Import > From file**, choose `keywords.csv`. Editor creates the campaigns and ad groups. Before posting:
   - set each campaign's **location** to its country, with "Presence: people in or regularly in your targeted locations";
   - set **networks** to Google Search only (untick Display and Search Partners);
   - set a **daily budget** (suggested start: Kuwait 3-5 KWD/day, other countries the local equivalent).
3. Write at least one responsive search ad per ad group (prices: Kuwait from 4 KWD, UAE from 58 AED, Saudi from 41 SAR, Qatar from 55 QAR; Bahrain/Oman: "free CV review").
4. **Negative keywords:** in Google Ads go to **Tools > Shared library > Negative keyword lists**, create "GCC CV - wasted clicks", paste the keywords from `negative-keywords.csv` as phrase match, and apply the list to all six campaigns.
5. **Conversions:** link Google Analytics (G-104GJYGCBH) to Google Ads and import `lead_submit_success`, `whatsapp_click` and `contact_submit` as conversions. Bid on these, not clicks.

## Every week

Open **Search terms**, add anything irrelevant to the negative list, and pause keywords with spend but no conversions after about 100 clicks.

Note: "jobs" and "job" are negatives because they mainly match people looking for CV-writer jobs. If you see relevant searches such as "cv for gulf jobs" in the search terms report, remove "jobs" from the list.
