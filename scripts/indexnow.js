// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Naver, Seznam, ...), so new
// and changed pages are crawled in hours instead of weeks. Bing's index also feeds ChatGPT
// search and Copilot. Run after each deploy: `npm run indexnow`.
//
// The key is public by design: IndexNow verifies ownership by fetching
// https://www.brandmyprofile.com/<key>.txt, served from public/<key>.txt.

const SITE_URL = 'https://www.brandmyprofile.com';
const KEY = 'f57a6fff36205e97868fb2acd4c1ba64';

async function main() {
    const keyResponse = await fetch(`${SITE_URL}/${KEY}.txt`);
    if (!keyResponse.ok || (await keyResponse.text()).trim() !== KEY) {
        console.error(`Key file ${SITE_URL}/${KEY}.txt is not live yet. Deploy first, then rerun.`);
        process.exit(1);
    }

    const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
    const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    if (!urlList.length) {
        console.error('No URLs found in the live sitemap.');
        process.exit(1);
    }

    const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
            host: new URL(SITE_URL).host,
            key: KEY,
            keyLocation: `${SITE_URL}/${KEY}.txt`,
            urlList,
        }),
    });

    // 200 and 202 both mean accepted; anything else is printed so it can be fixed.
    if (response.status === 200 || response.status === 202) {
        console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${response.status}).`);
    } else {
        console.error(`IndexNow rejected the submission: HTTP ${response.status} ${await response.text()}`);
        process.exit(1);
    }
}

main();
