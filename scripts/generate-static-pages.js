import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const PUBLIC_DIR = path.join(__dirname, '../public');
const JOBS_PATH = path.join(__dirname, '../src/lib/data/jobs.json');
// Points at the lightweight metadata index, not the per-article content files under
// blogs/content/ (Unit 3D.1) - title/excerpt/date/coverImage are all this script needs
// for static HTML/sitemap generation, so it never needs to load article bodies at all.
const BLOGS_PATH = path.join(__dirname, '../src/lib/data/blogs/index.json');
// The 5 approved content hubs (Unit 6) - the same file src/lib/data/blogHubs.ts imports
// for its title/metaDescription, so the generator and the live app can never drift apart.
const BLOG_HUBS_PATH = path.join(__dirname, '../src/lib/data/blogHubs.json');
const SERVICES_PATH = path.join(__dirname, '../src/lib/data/services.json');
// Shared SEO data - the exact same files src/lib/data/regionContent.ts and
// src/config/pageSeo.ts import on the live/client side (see those files' comments).
// Loading the raw JSON here means the generator and the live app can never drift apart.
const REGION_SEO_PATH = path.join(__dirname, '../src/lib/data/regionSeo.json');
const PAGE_SEO_PATH = path.join(__dirname, '../src/config/pageSeo.json');
// The 8 approved /{region}/cv-writing/{industry} pages (Unit 4A) - the exact same file
// src/lib/data/industryContent.ts imports for its richer client-side copy, so the
// generator and the live app can never drift apart. Controlled programmatic SEO: this
// list is exhaustive, never a pattern to expand automatically.
const INDUSTRY_PAGES_PATH = path.join(__dirname, '../src/lib/data/industryPages.json');
// Same Organization entity src/lib/seo/organization.ts serves client-side.
const ORGANIZATION_PATH = path.join(__dirname, '../src/lib/seo/organization.json');
// Brand and price answers, shared word for word with src/lib/seo/brandFaqs.ts.
const BRAND_FAQS_PATH = path.join(__dirname, '../src/lib/data/brandFaqs.json');
// The pristine Vite shell every page is built from. dist/index.html itself is rewritten as
// the brand homepage at the end of main(), so the shell is kept as dist/app-shell.html (also
// the SPA fallback in vercel.json) and generation stays repeatable.
const APP_SHELL_FILE = 'app-shell.html';
let TEMPLATE_HTML = null;
const SITE_URL = 'https://www.brandmyprofile.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/brandmyprofile-og.png`;

// Mirrors REGION_HREFLANG in src/components/SEO.tsx.
const REGION_HREFLANG = { kuwait: 'en-KW', uae: 'en-AE', saudi: 'en-SA', qatar: 'en-QA', india: 'en-IN', bahrain: 'en-BH', oman: 'en-OM' };
const DEFAULT_REGION_CODE = 'kuwait';

// Region pages listed in each page's crawler fallback, in nav order.
const CRAWLER_LINK_SUFFIXES = [
    { suffix: '/services/cv-writing', label: 'Professional CV Writing' },
    { suffix: '/services/gcc-cv', label: 'GCC Standard CV' },
    { suffix: '/services/ats-cv', label: 'ATS Friendly CV' },
    { suffix: '/services/europass-cv', label: 'Europass CV' },
    { suffix: '/services/linkedin-makeover', label: 'LinkedIn Makeover' },
    { suffix: '/services/masterclass', label: 'Masterclass' },
    { suffix: '/services/career-guidance', label: 'Career Guidance' },
    { suffix: '/pricing', label: 'Pricing' },
    { suffix: '/about', label: 'About BrandMyProfile' },
    { suffix: '/contact', label: 'Contact' },
];

// Regional settings for jobs
const JOB_REGIONS = {
    kuwait: { currency: 'KWD' },
    uae: { currency: 'AED' },
    saudi: { currency: 'SAR' },
    qatar: { currency: 'QAR' },
    india: { currency: 'INR' }
};

// Real region codes used by the /:region route (src/contexts/RegionContext.tsx, src/App.tsx)
const REGION_CODES = Object.keys(JOB_REGIONS);
const REGION_NAMES = { kuwait: 'Kuwait', uae: 'UAE', saudi: 'Saudi Arabia', qatar: 'Qatar', india: 'India', bahrain: 'Bahrain', oman: 'Oman' };

// Bahrain/Oman only have a minimal SEO/conversion footprint live so far (Unit 3A: home,
// CV Writing, and Contact - no pricing page, since no real approved BHD/OMR pricing
// exists yet, and no other service pages). Mirrors LIMITED_FOOTPRINT_REGIONS /
// LIMITED_FOOTPRINT_ALLOWED_SUFFIXES in src/contexts/RegionContext.tsx.
const LIMITED_FOOTPRINT_REGIONS = ['bahrain', 'oman'];

// Real region-scoped route suffixes, matching the nested routes under /:region in src/App.tsx.
// Priority/changefreq values mirror the per-page-type weighting previously used in public/sitemap.xml.
const REGION_ROUTE_SUFFIXES = [
    { suffix: '', changefreq: 'weekly', priority: '1.0' },
    { suffix: '/about', changefreq: 'monthly', priority: '0.8' },
    { suffix: '/pricing', changefreq: 'weekly', priority: '0.9' },
    { suffix: '/contact', changefreq: 'monthly', priority: '0.7' },
    { suffix: '/success-stories', changefreq: 'weekly', priority: '0.8' },
    { suffix: '/schedule', changefreq: 'monthly', priority: '0.8' },
    { suffix: '/jobs', changefreq: 'daily', priority: '0.9' },
    { suffix: '/services/cv-writing', changefreq: 'weekly', priority: '0.95' },
    { suffix: '/services/ats-cv', changefreq: 'weekly', priority: '0.95' },
    { suffix: '/services/gcc-cv', changefreq: 'weekly', priority: '0.95' },
    { suffix: '/services/linkedin-makeover', changefreq: 'weekly', priority: '0.95' },
    { suffix: '/services/masterclass', changefreq: 'weekly', priority: '0.95' },
    { suffix: '/services/career-guidance', changefreq: 'weekly', priority: '0.95' },
];

// The subset of REGION_ROUTE_SUFFIXES that actually exists for limited-footprint regions.
// Real pages kept out of the index (and sitemap) so crawling focuses on service, country and
// guide pages. Mirrors the `noindex` prop on Schedule.tsx and SuccessStories.tsx.
const NOINDEX_SUFFIXES = ['/schedule', '/success-stories'];

const LIMITED_FOOTPRINT_ROUTE_SUFFIXES = REGION_ROUTE_SUFFIXES.filter((entry) =>
    ['', '/contact', '/services/cv-writing'].includes(entry.suffix)
);

// Mirrors the title-suffix rule in src/components/SEO.tsx exactly (skip the auto-appended
// region name when the base title already names it), so these pre-rendered <title> tags
// match what Helmet renders once the client mounts - no separate, divergent title format.
function buildFullTitle(baseTitle, regionCode) {
    const regionName = REGION_NAMES[regionCode] || 'Kuwait';
    const alreadyMentionsRegion = baseTitle.toLowerCase().includes(regionName.toLowerCase());
    if (baseTitle.includes('BrandMyProfile')) return alreadyMentionsRegion ? baseTitle : `${baseTitle} | ${regionName}`;
    return alreadyMentionsRegion ? `${baseTitle} | BrandMyProfile` : `${baseTitle} | BrandMyProfile ${regionName}`;
}

// Fills a "{region}" placeholder - mirrors src/config/pageSeo.ts's getTemplatedPageSeo /
// getServiceSeoDescription helpers exactly, since both read the same template strings.
function fillRegionTemplate(template, regionName) {
    return template.replace('{region}', regionName);
}

function buildPriorityPageMeta(servicesData, regionSeo, pageSeo, industryPages) {
    const pages = [];

    REGION_CODES.forEach((region) => {
        const name = REGION_NAMES[region];
        const home = regionSeo[region];

        pages.push({ urlPath: `/${region}`, title: buildFullTitle(home.seo.title, region), description: home.seo.description });

        // Region override (regionSeo.json serviceSeo.pricing) mirrors Pricing.tsx: the starting
        // price is read from the same per-region pricing.json the live page loads, formatted
        // like Pricing.tsx's formatPrice (never a separately hardcoded number).
        const pricingOverride = home.serviceSeo?.pricing;
        const regionPricing = loadJSON(path.join(__dirname, `../src/lib/data/${region}/pricing.json`));
        const startPrice = regionPricing?.['cv-writing']?.basic;
        const startingPrice = startPrice
            ? (startPrice.currency === 'INR' ? `₹${startPrice.price.toLocaleString('en-US')}` : `${startPrice.price} ${startPrice.currency}`)
            : null;
        pages.push({
            urlPath: `/${region}/pricing`,
            title: buildFullTitle(pricingOverride?.metaTitle ?? `CV Writing & Career Service Pricing in ${name}`, region),
            description: pricingOverride && startingPrice
                ? pricingOverride.metaDescriptionTemplate.replace('{startingPrice}', startingPrice)
                : `${home.pricingIntro} See CV writing, LinkedIn optimization, career coaching and masterclass pricing in ${JOB_REGIONS[region].currency}.`,
        });

        pages.push({
            urlPath: `/${region}/about`,
            title: buildFullTitle(pageSeo.static.about.title, region),
            description: pageSeo.static.about.descriptions[region],
        });

        pages.push({
            urlPath: `/${region}/contact`,
            title: buildFullTitle(fillRegionTemplate(pageSeo.templated.contact.titleTemplate, name), region),
            description: fillRegionTemplate(pageSeo.templated.contact.descriptionTemplate, name),
        });

        // Unit 9.1: was previously missing from this function entirely, so the static shell
        // for /schedule fell back to index.html's generic default title/description. Now
        // sources the exact same per-region copy as the live React page (Schedule.tsx).
        pages.push({
            urlPath: `/${region}/schedule`,
            title: buildFullTitle(pageSeo.static.schedule.title, region),
            description: pageSeo.static.schedule.descriptions[region],
        });

        if (home.atsCv) {
            pages.push({
                urlPath: `/${region}/services/ats-cv`,
                title: buildFullTitle(home.atsCv.metaTitle, region),
                description: home.atsCv.metaDescription,
            });
        }

        if (home.gccCv) {
            pages.push({
                urlPath: `/${region}/services/gcc-cv`,
                title: buildFullTitle(home.gccCv.metaTitle, region),
                description: home.gccCv.metaDescription,
            });
        }

        // Europass CV writing is India-only (Unit 3D) - regionSeo.json only defines
        // `europassCv` for india, so this never fires for kuwait/uae/saudi/qatar.
        if (home.europassCv) {
            pages.push({
                urlPath: `/${region}/services/europass-cv`,
                title: buildFullTitle(home.europassCv.metaTitle, region),
                description: home.europassCv.metaDescription,
            });
        }

        // India->GCC / India->Europe intent hubs (Unit 5) - India-only, same pattern as
        // europassCv above (regionSeo.json only defines these keys for india).
        if (home.gccJobsHub) {
            pages.push({
                urlPath: `/${region}/gcc-jobs`,
                title: buildFullTitle(home.gccJobsHub.metaTitle, region),
                description: home.gccJobsHub.metaDescription,
            });
        }
        if (home.europeJobsHub) {
            pages.push({
                urlPath: `/${region}/europe-jobs`,
                title: buildFullTitle(home.europeJobsHub.metaTitle, region),
                description: home.europeJobsHub.metaDescription,
            });
        }

        pages.push({
            urlPath: `/${region}/success-stories`,
            title: buildFullTitle(pageSeo.static.successStories.title, region),
            description: pageSeo.static.successStories.descriptions[region],
        });

        pages.push({
            urlPath: `/${region}/jobs`,
            title: buildFullTitle(fillRegionTemplate(pageSeo.templated.jobs.titleTemplate, name), region),
            description: fillRegionTemplate(pageSeo.templated.jobs.descriptionTemplate, name),
        });

        if (servicesData) {
            ['cv-writing', 'linkedin-makeover', 'career-guidance', 'masterclass'].forEach((serviceKey) => {
                const service = servicesData[serviceKey];
                if (!service?.seo) return;
                const descriptionTemplate = pageSeo.serviceDescriptionTemplates[serviceKey];
                const override = home.serviceSeo?.[serviceKey];
                const description = override?.metaDescription ?? (descriptionTemplate ? fillRegionTemplate(descriptionTemplate, name) : service.seo.description);
                pages.push({
                    urlPath: `/${region}/services/${serviceKey}`,
                    title: buildFullTitle(override?.metaTitle ?? `${service.seo.title} in ${name}`, region),
                    description,
                });
            });
        }
    });

    // Bahrain/Oman: only home, CV Writing, and Contact exist (Unit 3A) - no pricing,
    // about, success-stories, jobs, or the other 3 service pages yet.
    LIMITED_FOOTPRINT_REGIONS.forEach((region) => {
        const name = REGION_NAMES[region];
        const home = regionSeo[region];
        if (!home) return;

        pages.push({ urlPath: `/${region}`, title: buildFullTitle(home.seo.title, region), description: home.seo.description });

        pages.push({
            urlPath: `/${region}/contact`,
            title: buildFullTitle(fillRegionTemplate(pageSeo.templated.contact.titleTemplate, name), region),
            description: fillRegionTemplate(pageSeo.templated.contact.descriptionTemplate, name),
        });

        const cvWriting = servicesData?.['cv-writing'];
        if (cvWriting?.seo) {
            pages.push({
                urlPath: `/${region}/services/cv-writing`,
                title: buildFullTitle(home.serviceSeo?.['cv-writing']?.metaTitle ?? `${cvWriting.seo.title} in ${name}`, region),
                description: home.serviceSeo?.['cv-writing']?.metaDescription ?? fillRegionTemplate(pageSeo.serviceDescriptionTemplates['cv-writing'], name),
            });
        }
    });

    // The 8 approved industry CV pages (Unit 4A) - an explicit, exhaustive list, never a
    // pattern applied across every region/industry combination.
    if (industryPages) {
        industryPages.forEach(({ region, slug, metaTitle, metaDescription }) => {
            pages.push({
                urlPath: `/${region}/cv-writing/${slug}`,
                title: buildFullTitle(metaTitle, region),
                description: metaDescription,
            });
        });
    }

    return pages;
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function loadJSON(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Data file not found at ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
}

const htmlEscape = (str) => String(str ?? '')
    .replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// The page title without the " | BrandMyProfile ..." suffix, used as the fallback H1.
const headingFromTitle = (title) => title.split(' | ')[0];

// hreflang alternates for a region-scoped page: every region whose equivalent page is
// generated and indexable, plus x-default (Kuwait when it has the page). Mirrors SEO.tsx.
function buildAlternates(urlPath, indexablePaths) {
    const segments = urlPath.split('/');
    if (!REGION_HREFLANG[segments[1]]) return [];
    const suffix = segments.length > 2 ? `/${segments.slice(2).join('/')}` : '';
    const alternates = Object.keys(REGION_HREFLANG)
        .filter((region) => indexablePaths.has(`/${region}${suffix}`))
        .map((region) => ({ hreflang: REGION_HREFLANG[region], href: `${SITE_URL}/${region}${suffix}` }));
    if (alternates.length < 2) return [];
    const xDefault = indexablePaths.has(`/${DEFAULT_REGION_CODE}${suffix}`)
        ? `${SITE_URL}/${DEFAULT_REGION_CODE}${suffix}`
        : alternates[0].href;
    return [...alternates, { hreflang: 'x-default', href: xDefault }];
}

// Page-specific replacement for index.html's generic <noscript><main> block, so crawlers
// that never run JavaScript (GPTBot, PerplexityBot, ...) see a distinct H1, summary and
// links on every URL instead of one identical Kuwait-first text.
// Renders the blog body format (see parseBlogBody in src/pages/BlogPost.tsx) to static HTML
// for crawlers that never run JavaScript. The leading "# Title" line is skipped because the
// fallback already renders the title as its H1.
function blogBodyToHtml(body) {
    const out = [];
    let list = null;
    const flush = () => {
        if (list) out.push(`<${list.type}>${list.items.map((item) => `<li>${htmlEscape(item)}</li>`).join('')}</${list.type}>`);
        list = null;
    };
    body.split('\n').forEach((line) => {
        const ordered = line.match(/^\d+\.\s+(.*)/);
        if (line.startsWith('- ') || ordered) {
            const type = ordered ? 'ol' : 'ul';
            if (!list || list.type !== type) { flush(); list = { type, items: [] }; }
            list.items.push(ordered ? ordered[1] : line.slice(2));
            return;
        }
        flush();
        if (line.startsWith('### ')) out.push(`<h3>${htmlEscape(line.slice(4))}</h3>`);
        else if (line.startsWith('## ')) out.push(`<h2>${htmlEscape(line.slice(3))}</h2>`);
        else if (line.startsWith('# ')) return;
        else if (line.trim()) out.push(`<p>${htmlEscape(line)}</p>`);
    });
    flush();
    return out.map((html) => `        ${html}`).join('\n');
}

// Question/answer pairs from a "## Frequently Asked Questions" section: each "### question"
// followed by its first paragraph. Only real visible FAQs, so FAQPage markup mirrors the page.
function extractBlogFaqs(body) {
    const lines = body.split('\n');
    const start = lines.findIndex((line) => /^## Frequently Asked Questions/i.test(line));
    if (start === -1) return [];
    const faqs = [];
    for (let i = start + 1; i < lines.length; i++) {
        if (lines[i].startsWith('## ')) break;
        if (!lines[i].startsWith('### ')) continue;
        const answer = lines.slice(i + 1).find((line) => line.trim() && !line.startsWith('#'));
        if (answer) faqs.push({ question: lines[i].slice(4), answer });
    }
    return faqs;
}

// regionContent.ts holds the approved per-region page copy but is TypeScript, so bundle it
// with esbuild (already installed as Vite's bundler) instead of keeping a second copy here.
async function loadRegionContent() {
    try {
        const { build } = await import('esbuild');
        const result = await build({
            entryPoints: [path.join(__dirname, '../src/lib/data/regionContent.ts')],
            bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
        });
        const code = result.outputFiles[0].text;
        const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
        return mod.regionContent;
    } catch (err) {
        console.warn('Warning: could not load regionContent.ts for crawler copy:', err.message);
        return null;
    }
}

function buildCrawlerFallback({ title, description, urlPath, indexablePaths, alternates, extraLinks = [], sections = [], bodyHtml = '' }) {
    const region = urlPath.split('/')[1];
    const regionName = REGION_NAMES[region];
    const links = regionName
        ? [{ href: `/${region}`, label: `BrandMyProfile ${regionName}` },
            ...CRAWLER_LINK_SUFFIXES
                .filter(({ suffix }) => indexablePaths.has(`/${region}${suffix}`) && `/${region}${suffix}` !== urlPath)
                .map(({ suffix, label }) => ({ href: `/${region}${suffix}`, label: `${label} - ${regionName}` }))]
        : [{ href: '/kuwait', label: 'BrandMyProfile Kuwait' }, { href: '/blog', label: 'Career guides' }];
    const allLinks = [...links, ...extraLinks].filter((link) => link.href !== urlPath);
    // Region variants of one page share a base title (e.g. About), so name the region in the H1.
    const baseHeading = headingFromTitle(title);
    const heading = regionName && !baseHeading.toLowerCase().includes(regionName.toLowerCase()) ? `${baseHeading} - ${regionName}` : baseHeading;
    const regionLinks = alternates
        .filter((alt) => alt.hreflang !== 'x-default' && alt.href !== `${SITE_URL}${urlPath}`)
        .map((alt) => {
            const code = Object.keys(REGION_HREFLANG).find((key) => REGION_HREFLANG[key] === alt.hreflang);
            return `<li><a href="${alt.href.replace(SITE_URL, '')}">${htmlEscape(REGION_NAMES[code])}</a></li>`;
        });
    return [
        '<noscript>',
        '      <main>',
        `        <h1>${htmlEscape(heading)}</h1>`,
        `        <p>${htmlEscape(description)}</p>`,
        '        <p>BrandMyProfile is an online career-support service: CV writing, ATS and GCC-format CVs, LinkedIn optimization and career coaching. Services are delivered online; there is no walk-in office.</p>',
        ...sections.map(({ heading: sectionHeading, text }) => `        <h2>${htmlEscape(sectionHeading)}</h2>
        <p>${htmlEscape(text)}</p>`),
        bodyHtml,
        allLinks.length ? `        <ul>${allLinks.map((link) => `<li><a href="${link.href}">${htmlEscape(link.label)}</a></li>`).join('')}</ul>` : '',
        regionLinks.length ? `        <h2>This page in other regions</h2>\n        <ul>${regionLinks.join('')}</ul>` : '',
        // Contact details match index.html's fallback and organization.json.
        '        <p>Phone/WhatsApp: +965 41103254 &middot; Email: <a href="mailto:info@brandmyprofile.com">info@brandmyprofile.com</a></p>',
        '      </main>',
        '    </noscript>',
    ].filter(Boolean).join('\n');
}

function generatePage(urlPath, title, description, image, options = {}) {
    const { noindex = false, alternates = [], crawlerHtml = null, jsonLd = null, outputFile = null } = options;
    const templatePath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('Error: dist/index.html not found. Run build first.');
        return;
    }

    let html = TEMPLATE_HTML ?? fs.readFileSync(templatePath, 'utf8');

    // Replace Meta Tags
    const replaceMeta = (name, content) => {
        // Use regex to find existing meta tag by name
        const regex = new RegExp(`<meta name="${name}" content="[^"]*"`, 'g');
        if (regex.test(html)) {
            html = html.replace(regex, `<meta name="${name}" content="${content}"`);
        } else {
            // Append if not found (fallback, though strict replacement expected)
            html = html.replace('</head>', `    <meta name="${name}" content="${content}" />\n</head>`);
        }
    };

    const replaceOg = (property, content) => {
        const regex = new RegExp(`<meta property="${property}" content="[^"]*"`, 'g');
        if (regex.test(html)) {
            html = html.replace(regex, `<meta property="${property}" content="${content}"`);
        } else {
            html = html.replace('</head>', `    <meta property="${property}" content="${content}" />\n</head>`);
        }
    };

    // Safety check for content escaping (basic)
    const safeContent = (str) => str ? str.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/"/g, '&quot;') : '';

    const canonicalUrl = `${SITE_URL}${urlPath}`;

    // Replace Title
    html = html.replace(/<title>.*<\/title>/, () => `<title>${safeContent(title)}</title>`);

    replaceMeta('description', safeContent(description));
    replaceOg('og:title', safeContent(title));
    replaceOg('og:description', safeContent(description));
    replaceOg('og:image', image || DEFAULT_OG_IMAGE);
    replaceOg('og:url', canonicalUrl);

    replaceOg('twitter:title', safeContent(title));
    replaceOg('twitter:description', safeContent(description));
    replaceOg('twitter:image', image || DEFAULT_OG_IMAGE);
    // Note: twitter:url is not standard but harmless, standard is og:url or just canonical

    // Canonical link - mirrors src/components/SEO.tsx's canonical logic (one
    // self-referencing canonical per indexable page, no apex-domain canonicals).
    // Non-indexable pages (sample jobs) get NO canonical at all.
    if (noindex) {
        html = html.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/g, '');
    } else if (html.includes('rel="canonical"')) {
        html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
        html = html.replace('</head>', `    <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    // Real-but-not-yet-authoritative content (e.g. illustrative sample job listings)
    // must stay noindex even for crawlers that never execute the client-side Helmet tags.
    if (noindex) {
        html = html.replace('</head>', `    <meta name="robots" content="noindex,follow" />\n    <meta name="googlebot" content="noindex,follow" />\n</head>`);
    } else {
        alternates.forEach(({ hreflang, href }) => {
            html = html.replace('</head>', `    <link rel="alternate" hreflang="${hreflang}" href="${href}" />\n</head>`);
        });
        if (jsonLd) {
            // "<" escaped so content can never close the script tag early.
            const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
            html = html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n</head>`);
        }
    }

    if (crawlerHtml) {
        html = html.replace(/<noscript>\s*<main>[\s\S]*?<\/main>\s*<\/noscript>/, () => crawlerHtml);
    }

    // Write file
    const outputPath = outputFile ? path.join(DIST_DIR, outputFile) : path.join(DIST_DIR, urlPath, 'index.html');
    try {
        ensureDirectoryExistence(outputPath);
        fs.writeFileSync(outputPath, html);
        console.log(`Generated: ${urlPath}`);
    } catch (err) {
        console.error(`Failed to generate ${urlPath}:`, err);
    }
}

// Escapes a string for safe inclusion inside XML text/attribute content.
function xmlEscape(value) {
    if (!value) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function buildSitemapXml(entries) {
    const body = entries.map(({ loc, lastmod, changefreq, priority }) => {
        let xml = `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n`;
        if (lastmod) xml += `    <lastmod>${xmlEscape(lastmod)}</lastmod>\n`;
        if (changefreq) xml += `    <changefreq>${xmlEscape(changefreq)}</changefreq>\n`;
        if (priority) xml += `    <priority>${xmlEscape(priority)}</priority>\n`;
        xml += '  </url>';
        return xml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

async function main() {
    console.log('Starting Static Page Generation...');

    if (!fs.existsSync(DIST_DIR)) {
        console.error('Error: dist directory does not exist. Please run "npm run build" first.');
        process.exit(1);
    }

    // Capture the untouched Vite shell before anything rewrites dist/index.html.
    {
        const indexPath = path.join(DIST_DIR, 'index.html');
        const shellPath = path.join(DIST_DIR, APP_SHELL_FILE);
        const indexHtml = fs.readFileSync(indexPath, 'utf8');
        const indexIsBrandHome = indexHtml.includes(`<link rel="canonical" href="${SITE_URL}/" />`);
        if (!indexIsBrandHome) fs.writeFileSync(shellPath, indexHtml);
        TEMPLATE_HTML = fs.readFileSync(shellPath, 'utf8');
    }

    // Load Data
    const jobsData = loadJSON(JOBS_PATH);
    const blogsData = loadJSON(BLOGS_PATH);
    const blogHubsData = loadJSON(BLOG_HUBS_PATH);
    const servicesData = loadJSON(SERVICES_PATH);
    const regionSeo = loadJSON(REGION_SEO_PATH);
    const pageSeo = loadJSON(PAGE_SEO_PATH);
    const industryPages = loadJSON(INDUSTRY_PAGES_PATH);

    // Mirrors src/config/jobs.ts's `jobsConfig.source` - the live job listings are
    // currently illustrative sample data, not a real-time feed (see src/pages/Jobs.tsx /
    // JobDetail.tsx for the matching client-side noindex + no-job-structured-data handling).
    // Keep this in sync if that source is ever switched to a real feed.
    const IS_MOCK_JOB_SOURCE = true;

    const urls = [];

    // Sitemap entries are tracked separately from `urls` (which drives static HTML
    // shell generation). The sitemap must only ever contain real, canonical, indexable pages.
    const sitemapEntries = [];
    const seenLocs = new Set();
    const addSitemapEntry = (entry) => {
        if (seenLocs.has(entry.loc)) return;
        seenLocs.add(entry.loc);
        sitemapEntries.push(entry);
    };

    // The domain root is the brand's home page (see the brand homepage block in main()).
    addSitemapEntry({ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' });

    // Region-scoped base/service routes: REGION_CODES x REGION_ROUTE_SUFFIXES
    REGION_CODES.forEach(region => {
        REGION_ROUTE_SUFFIXES.forEach(({ suffix, changefreq, priority }) => {
            // Job listing pages are illustrative sample data for now (see IS_MOCK_JOB_SOURCE)
            // - keep the sitemap free of them until a real feed is wired in.
            if (suffix === '/jobs' && IS_MOCK_JOB_SOURCE) return;
            if (NOINDEX_SUFFIXES.includes(suffix)) return;
            addSitemapEntry({
                loc: `${SITE_URL}/${region}${suffix}`,
                changefreq,
                priority,
            });
        });
    });

    // Europass CV writing is India-only (Unit 3D) - not part of the shared
    // REGION_ROUTE_SUFFIXES list above, which applies uniformly to every full-footprint
    // region. Added as a one-off entry so Kuwait/UAE/Saudi/Qatar never get this URL.
    addSitemapEntry({ loc: `${SITE_URL}/india/services/europass-cv`, changefreq: 'weekly', priority: '0.9' });

    // India->GCC / India->Europe intent hubs (Unit 5) - India-only, one-off entries.
    addSitemapEntry({ loc: `${SITE_URL}/india/gcc-jobs`, changefreq: 'monthly', priority: '0.8' });
    addSitemapEntry({ loc: `${SITE_URL}/india/europe-jobs`, changefreq: 'monthly', priority: '0.8' });

    // Bahrain/Oman: only their 3 real, approved pages (Unit 3A) - see LIMITED_FOOTPRINT_ROUTE_SUFFIXES.
    LIMITED_FOOTPRINT_REGIONS.forEach(region => {
        LIMITED_FOOTPRINT_ROUTE_SUFFIXES.forEach(({ suffix, changefreq, priority }) => {
            addSitemapEntry({
                loc: `${SITE_URL}/${region}${suffix}`,
                changefreq,
                priority,
            });
        });
    });

    // Blog index (real, unprefixed route)
    addSitemapEntry({ loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.9' });

    // The 8 approved industry CV pages (Unit 4A) - exhaustive explicit list, not a
    // region x industry cross-product.
    if (industryPages) {
        industryPages.forEach(({ region, slug }) => {
            addSitemapEntry({ loc: `${SITE_URL}/${region}/cv-writing/${slug}`, changefreq: 'weekly', priority: '0.85' });
        });
    }

    // Pre-render meaningful title/description/canonical/OG for priority pages so non-JS
    // crawlers see real content on first load, not just the generic index.html fallback.
    const organizationData = loadJSON(ORGANIZATION_PATH);
    const organization = organizationData?.organization;
    const siteAlternateName = organizationData?.siteAlternateName || [];
    const brandFaqs = loadJSON(BRAND_FAQS_PATH);
    const brandFaq = brandFaqs?.brand;

    // "How much does CV writing cost in X?" filled from the region's live pricing.json, the
    // same template and formatting as src/lib/seo/brandFaqs.ts's buildPriceFaq.
    const priceFaq = (region) => {
        const cv = loadJSON(path.join(__dirname, `../src/lib/data/${region}/pricing.json`))?.['cv-writing'];
        if (!brandFaqs?.price || !cv?.basic || !cv?.pro || !cv?.elite) return null;
        const fmt = ({ price, currency }) => (currency === 'INR' ? `₹${price.toLocaleString('en-IN')}` : `${price} ${currency}`);
        const place = region === 'uae' ? 'the UAE' : REGION_NAMES[region];
        const fill = (template) => template.replace('{place}', place).replace('{basic}', fmt(cv.basic)).replace('{pro}', fmt(cv.pro)).replace('{elite}', fmt(cv.elite));
        return { question: fill(brandFaqs.price.question), answer: fill(brandFaqs.price.answer) };
    };
    const regionContent = await loadRegionContent();

    // Approved per-region copy for service pages (regionContent.ts), so AI crawlers read the
    // page's real substance. services.json's generic process/benefit text is deliberately not
    // used: its turnaround and revision wording conflicts with the package terms.
    const SERVICE_COPY_KEYS = { 'cv-writing': 'cv-writing', 'linkedin-makeover': 'linkedin-makeover', 'career-guidance': 'career-guidance', masterclass: 'masterclass' };
    const serviceSections = (urlPath) => {
        const match = urlPath.match(/^\/([a-z]+)(?:\/services\/([a-z-]+))?$/);
        const rc = match && regionContent?.[match[1]];
        if (!rc) return [];
        const [, , service] = match;
        if (!service) return rc.marketFaq ? [{ heading: rc.marketFaq.question, text: rc.marketFaq.answer }] : [];
        if (SERVICE_COPY_KEYS[service] && rc.servicePages?.[service]) {
            return [{ heading: rc.servicePages[service].heading, text: rc.servicePages[service].intro }];
        }
        if (service === 'ats-cv' && rc.atsCv) {
            return [
                { heading: rc.atsCv.marketContextHeading, text: `${rc.atsCv.marketContextParagraph} Industries covered: ${rc.atsCv.industries.join(', ')}.` },
                { heading: rc.atsCv.faq.question, text: rc.atsCv.faq.answer },
            ];
        }
        if (service === 'gcc-cv' && rc.gccCv) {
            return [
                { heading: rc.gccCv.heading, text: rc.gccCv.heroSubtext },
                { heading: rc.gccCv.marketContextHeading, text: rc.gccCv.marketContextParagraph },
                ...rc.gccCv.regionFaqs.map((faq) => ({ heading: faq.question, text: faq.answer })),
            ];
        }
        return [];
    };
    const priorityPages = buildPriorityPageMeta(servicesData, regionSeo, pageSeo, industryPages);
    // Sample job listing pages are noindex,follow with no canonical (see IS_MOCK_JOB_SOURCE).
    const isNoindexPage = (urlPath) => (IS_MOCK_JOB_SOURCE && /^\/[a-z]+\/jobs$/.test(urlPath))
        || NOINDEX_SUFFIXES.some((suffix) => urlPath.endsWith(suffix));
    const indexablePaths = new Set(priorityPages.map(({ urlPath }) => urlPath).filter((urlPath) => !isNoindexPage(urlPath)));

    // Organization + WebSite share @ids with the client-side schema in organization.ts,
    // so Google merges them rather than seeing two entities.
    const buildJsonLd = (urlPath, title, description, faqs = []) => {
        const url = `${SITE_URL}${urlPath}`;
        const region = urlPath.split('/')[1];
        return {
            '@context': 'https://schema.org',
            '@graph': [
                ...(organization ? [organization] : []),
                { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'BrandMyProfile', alternateName: siteAlternateName, publisher: { '@id': `${SITE_URL}/#organization` } },
                {
                    '@type': 'WebPage', '@id': `${url}#webpage`, url, name: headingFromTitle(title), description,
                    inLanguage: REGION_HREFLANG[region] || 'en',
                    isPartOf: { '@id': `${SITE_URL}/#website` }, publisher: { '@id': `${SITE_URL}/#organization` },
                },
                ...(faqs.length ? [{
                    '@type': 'FAQPage', '@id': `${url}#faq`,
                    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
                }] : []),
            ],
        };
    };

    // Shared by every indexable static page: hreflang, page-specific crawler text, JSON-LD.
    // Region homes and CV-writing pages also carry the "what's included" answer and the
    // cities served (regionSeo.json), the copy that targets "CV writing services in X".
    const localSections = (urlPath) => {
        const sections = [...serviceSections(urlPath)];
        const match = urlPath.match(/^\/([a-z]+)(\/services\/cv-writing)?$/);
        const local = match && regionSeo[match[1]];
        if (!local) return sections;
        if (local.aeoBlock) sections.push({ heading: local.aeoBlock.question, text: local.aeoBlock.answer });
        if (local.cities?.length) {
            const place = match[1] === 'uae' ? 'the UAE' : REGION_NAMES[match[1]];
            sections.push({
                heading: `CV writing for job seekers across ${place}`,
                text: `BrandMyProfile works online with professionals in ${local.cities.join(', ')} and elsewhere in ${place}.`,
            });
        }
        return sections;
    };

    const generateIndexablePage = (urlPath, title, description, image = null, extraLinks = [], { bodyHtml = '', faqs = [] } = {}) => {
        const alternates = buildAlternates(urlPath, indexablePaths);
        generatePage(urlPath, title, description, image, {
            alternates,
            crawlerHtml: buildCrawlerFallback({ title, description, urlPath, indexablePaths, alternates, extraLinks, sections: localSections(urlPath), bodyHtml }),
            jsonLd: buildJsonLd(urlPath, title, description, faqs),
        });
    };

    const blogHubLinks = (blogHubsData || []).map((hub) => ({ href: `/blog/${hub.slug}`, label: hub.title }));

    // Region homes carry the same FAQ list as the live homepage (src/hooks/useHomeFaqs.ts):
    // brand answer, live-price answer, then the shared FAQs with the region's market FAQ second.
    // Pre-rendered so AI crawlers that never run JavaScript still read and cite them.
    const baseFaqs = loadJSON(path.join(__dirname, '../src/lib/data/faqs.json')) || [];
    const homeFaqs = (region) => {
        const [first, ...rest] = baseFaqs;
        const marketFaq = regionContent?.[region]?.marketFaq;
        const price = priceFaq(region);
        return [brandFaq, price, first, marketFaq, ...rest].filter(Boolean);
    };

    priorityPages.forEach(({ urlPath, title, description }) => {
        urls.push(urlPath);
        const regionHome = urlPath.match(/^\/([a-z]+)$/)?.[1];
        const pricingRegion = urlPath.match(/^\/([a-z]+)\/pricing$/)?.[1];
        if (isNoindexPage(urlPath)) {
            generatePage(urlPath, title, description, null, { noindex: true });
        } else if (regionHome) {
            const faqs = homeFaqs(regionHome);
            // The market FAQ is already in this page's crawler sections (serviceSections).
            const faqHtml = faqs.filter((faq) => faq !== regionContent?.[regionHome]?.marketFaq).map((faq) => `        <h2>${htmlEscape(faq.question)}</h2>\n        <p>${htmlEscape(faq.answer)}</p>`).join('\n');
            generateIndexablePage(urlPath, title, description, null, [], { faqs, bodyHtml: faqHtml });
        } else if (pricingRegion && priceFaq(pricingRegion)) {
            const faq = priceFaq(pricingRegion);
            generateIndexablePage(urlPath, title, description, null, [], {
                bodyHtml: `        <h2>${htmlEscape(faq.question)}</h2>\n        <p>${htmlEscape(faq.answer)}</p>`,
            });
        } else {
            generateIndexablePage(urlPath, title, description);
        }
    });

    // Paid-ads landing pages (src/pages/FreeCvReview.tsx): noindex and kept out of the sitemap,
    // but pre-rendered so ad clicks get a fast first paint and a real 200.
    [...REGION_CODES, ...LIMITED_FOOTPRINT_REGIONS].forEach((region) => {
        const name = REGION_NAMES[region];
        const place = region === 'uae' ? 'the UAE' : name;
        const urlPath = `/${region}/free-cv-review`;
        urls.push(urlPath);
        generatePage(urlPath, `Free CV Review for ${name} Jobs | BrandMyProfile`, `Send your CV for a free review of structure, ATS readability and positioning for jobs in ${place}.`, null, { noindex: true });
    });

    // Blog index (global route). Copy matches src/pages/Blog.tsx's <SEO>.
    {
        const title = 'Career Insights for Kuwait, GCC & International Job Seekers | BrandMyProfile';
        const description = 'Practical advice on CV writing, LinkedIn, interviews, salary negotiation and career moves for professionals across Kuwait, the GCC and India.';
        urls.push('/blog');
        const recentPosts = (blogsData || []).slice(0, 10).map((blog) => ({ href: `/blog/${blog.slug}`, label: blog.title }));
        generateIndexablePage('/blog', title, description, null, [...blogHubLinks, ...recentPosts]);
    }

    // Generate Job Detail Pages.
    // The legacy /jobs/:region/:id redirect-stub route (src/App.tsx JobRedirect) still
    // exists for backward-compatible bookmarks/links, but no longer gets a bespoke static
    // shell - it was never linked internally or in the sitemap, so there is no SEO reason
    // to keep generating duplicate indexable-looking HTML for it (see SEO Unit 1, item 5).
    if (jobsData) {
        Object.keys(jobsData).forEach(region => {
            jobsData[region].forEach(job => {
                if (!JOB_REGIONS[region]) return;

                const regionUrl = `/${region}/jobs/${job.id}`;
                urls.push(regionUrl);
                generatePage(
                    regionUrl,
                    `${job.title} in ${job.location}`,
                    `${job.title} at ${job.company}. ${job.description ? job.description.substring(0, 150) : ''}...`,
                    null,
                    { noindex: IS_MOCK_JOB_SOURCE }
                );

                // Legacy /jobs/:region/:id URLs are already indexed by Google. The SPA rewrite
                // would otherwise serve the bare index.html shell for them, so give them their
                // own noindex,follow, no-canonical shell (the client then redirects users).
                const legacyUrl = `/jobs/${region}/${job.id}`;
                urls.push(legacyUrl);
                generatePage(legacyUrl, `${job.title} in ${job.location}`, `${job.title} at ${job.company}.`, null, { noindex: true });

                // Illustrative sample job listings must not appear in the sitemap
                // (see IS_MOCK_JOB_SOURCE above) until backed by a real jobs feed.
                if (!IS_MOCK_JOB_SOURCE) {
                    addSitemapEntry({
                        loc: `${SITE_URL}${regionUrl}`,
                        changefreq: 'daily',
                        priority: '0.7',
                    });
                }
            });
        });
    }

    // Unit 8: the one flagship linkable asset at /resources/gcc-cv-checklist. Hardcoded
    // (not data-driven) since it's deliberately a single page, not a pattern - see
    // src/App.tsx's comment on why /resources/:slug is never a wildcard route.
    {
        const url = '/resources/gcc-cv-checklist';
        urls.push(url);
        generateIndexablePage(
            url,
            'GCC CV Checklist for Job Seekers',
            "A free, printable checklist covering CV structure, ATS formatting, GCC targeting, personal-details safety, experience writing and proofreading for Gulf job applications.",
            null,
            blogHubLinks
        );
        addSitemapEntry({ loc: `${SITE_URL}${url}`, changefreq: 'monthly', priority: '0.8' });
    }

    // Unit 9: global legal utility pages. Footer.tsx has linked to /privacy and /terms on
    // every page since it was written, but the routes never existed - a real sitewide
    // broken-link defect found in this unit's crawl audit, fixed by adding the 2 pages.
    {
        const legalPages = [
            { url: '/privacy', title: 'Privacy Policy', description: "How BrandMyProfile collects, uses and protects information when you use our website, contact forms and WhatsApp-based consultation process." },
            { url: '/terms', title: 'Terms of Service', description: "The terms that apply when you use BrandMyProfile's CV writing, LinkedIn optimization, career coaching and masterclass services." },
        ];
        legalPages.forEach(({ url, title, description }) => {
            urls.push(url);
            // Legal pages stay reachable but out of the index and sitemap (Privacy.tsx / Terms.tsx noindex).
            generatePage(url, title, description, null, { noindex: true });
        });
    }

    // Generate the 5 approved content hubs (Unit 6) - a fixed, explicit list, never a
    // pattern applied to arbitrary /blog/:slug values.
    if (blogHubsData) {
        blogHubsData.forEach(hub => {
            const url = `/blog/${hub.slug}`;
            urls.push(url);
            generateIndexablePage(url, hub.title, hub.metaDescription, null, blogHubLinks);
            addSitemapEntry({ loc: `${SITE_URL}${url}`, changefreq: 'weekly', priority: '0.85' });
        });
    }

    // Generate Blog Pages
    if (blogsData) {
        blogsData.forEach(blog => {
            const url = `/blog/${blog.slug}`;
            urls.push(url);

            // Fall back to the sitewide default OG image rather than linking a broken
            // image when a post's coverImage file doesn't actually exist under public/.
            const coverImagePath = blog.coverImage ? path.join(PUBLIC_DIR, blog.coverImage) : null;
            const hasCoverImage = coverImagePath ? fs.existsSync(coverImagePath) : false;
            if (blog.coverImage && !hasCoverImage) {
                console.warn(`Warning: blog cover image not found, using default OG image instead: ${blog.coverImage}`);
            }

            const content = loadJSON(path.join(__dirname, `../src/lib/data/blogs/content/${blog.slug}.json`));
            const relatedLinks = (content?.relatedLinks || []).map((link) => ({ href: link.path, label: link.label }));
            generateIndexablePage(
                url,
                blog.title,
                blog.excerpt,
                hasCoverImage ? `${SITE_URL}${blog.coverImage}` : null,
                [...relatedLinks, ...blogHubLinks],
                { bodyHtml: content?.body ? blogBodyToHtml(content.body) : '', faqs: content?.body ? extractBlogFaqs(content.body) : [] }
            );

            // blog.date is real, author-supplied publish-date data - a trustworthy lastmod.
            addSitemapEntry({
                loc: `${SITE_URL}${url}`,
                lastmod: blog.date || undefined,
                changefreq: 'monthly',
                priority: '0.8',
            });
        });
    }

    // 404.html: Vercel serves it with a real 404 status for any path that has no static
    // file, redirect or rewrite (see vercel.json). The SPA still boots and renders NotFound.
    generatePage('/404', 'Page Not Found | BrandMyProfile', 'The page you were looking for does not exist.', null, {
        noindex: true,
        outputFile: '404.html',
        crawlerHtml: buildCrawlerFallback({ title: 'Page Not Found', description: 'The page you were looking for does not exist.', urlPath: '/404', indexablePaths, alternates: [], extraLinks: blogHubLinks }),
    });

    // Brand homepage at the domain root. Searches for "brandmyprofile" resolve to this URL, so
    // its static HTML carries the full brand entity (Organization + WebSite with every name
    // variant), a self canonical, a brand-first title and a "What is BrandMyProfile?" answer.
    // Visitors are still sent to their region by RootRedirect. Written last because it
    // replaces dist/index.html; every other page is built from the app shell captured above.
    {
        const title = 'BrandMyProfile | CV & Resume Writing for GCC & India Jobs';
        const description = 'BrandMyProfile writes human, ATS-friendly CVs and LinkedIn profiles for professionals in Kuwait, UAE, Saudi Arabia, Qatar, Bahrain, Oman and India. Free CV review.';
        const regionLinks = [...REGION_CODES, ...LIMITED_FOOTPRINT_REGIONS].map((region) => ({ href: `/${region}`, label: `CV writing services in ${region === 'uae' ? 'the UAE' : REGION_NAMES[region]}` }));
        const sections = [
            ...(brandFaq ? [{ heading: brandFaq.question, text: brandFaq.answer }] : []),
            ...REGION_CODES.map(priceFaq).filter(Boolean).map((faq) => ({ heading: faq.question, text: faq.answer })),
        ];
        generatePage('/', title, description, null, {
            outputFile: 'index.html',
            crawlerHtml: buildCrawlerFallback({ title, description, urlPath: '/', indexablePaths, alternates: [], extraLinks: [...regionLinks, { href: '/blog', label: 'Career guides' }], sections }),
            jsonLd: buildJsonLd('/', title, description, brandFaq ? [brandFaq] : []),
        });
    }

    // llms.txt = the hand-written public/llms.txt plus sections generated from live data, so
    // prices and guide links can never drift from what the site shows.
    {
        const base = fs.existsSync(path.join(PUBLIC_DIR, 'llms.txt')) ? fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf8').trimEnd() : '# BrandMyProfile';
        const tierNames = { basic: 'Essential', pro: 'Professional', elite: 'Executive' };
        const priceLines = REGION_CODES.map((region) => {
            const cv = loadJSON(path.join(__dirname, `../src/lib/data/${region}/pricing.json`))?.['cv-writing'];
            if (!cv) return null;
            const fmt = (t) => (t.currency === 'INR' ? `INR ${t.price.toLocaleString('en-US')}` : `${t.price} ${t.currency}`);
            const tiers = Object.entries(tierNames).filter(([key]) => cv[key]).map(([key, name]) => `${name} ${fmt(cv[key])}`).join(', ');
            return `- ${REGION_NAMES[region]}: ${tiers} (${SITE_URL}/${region}/pricing)`;
        }).filter(Boolean);
        const guideLines = (blogsData || []).map((blog) => `- [${blog.title}](${SITE_URL}/blog/${blog.slug}): ${blog.excerpt}`);
        const llms = `${base}

## CV writing package prices (generated from the live pricing data)

${priceLines.join('\n')}
- Bahrain and Oman: pricing confirmed after a free CV review (${SITE_URL}/bahrain/contact, ${SITE_URL}/oman/contact)

## Guides (full list)

${guideLines.join('\n')}
`;
        fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llms);
        console.log(`Generated llms.txt (${priceLines.length} price regions, ${guideLines.length} guides)`);
    }

    // Generate Sitemap
    const sitemap = buildSitemapXml(sitemapEntries);
    try {
        fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
        console.log(`Generated sitemap.xml (${sitemapEntries.length} URLs)`);
    } catch (e) {
        console.error('Failed to write sitemap.xml', e);
    }

    // Generate Robots.txt (Optional but good)
    const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
    try {
        fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);
        console.log('Generated robots.txt');
    } catch (e) {
        console.error('Failed to write robots.txt', e);
    }

    console.log('Static Page Generation Complete.');
}

main();
