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
const SITE_URL = 'https://www.brandmyprofile.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/brandmyprofile-og.png`;

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
const LIMITED_FOOTPRINT_ROUTE_SUFFIXES = REGION_ROUTE_SUFFIXES.filter((entry) =>
    ['', '/contact', '/services/cv-writing'].includes(entry.suffix)
);

// Mirrors the title-suffix rule in src/components/SEO.tsx exactly (skip the auto-appended
// region name when the base title already names it), so these pre-rendered <title> tags
// match what Helmet renders once the client mounts - no separate, divergent title format.
function buildFullTitle(baseTitle, regionCode) {
    const regionName = REGION_NAMES[regionCode] || 'Kuwait';
    const alreadyMentionsRegion = baseTitle.toLowerCase().includes(regionName.toLowerCase());
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

        pages.push({
            urlPath: `/${region}/pricing`,
            title: buildFullTitle(`CV Writing & Career Service Pricing in ${name}`, region),
            description: `${home.pricingIntro} See CV writing, LinkedIn optimization, career coaching and masterclass pricing in ${JOB_REGIONS[region].currency}.`,
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
                const description = descriptionTemplate ? fillRegionTemplate(descriptionTemplate, name) : service.seo.description;
                pages.push({
                    urlPath: `/${region}/services/${serviceKey}`,
                    title: buildFullTitle(`${service.seo.title} in ${name}`, region),
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
                title: buildFullTitle(`${cvWriting.seo.title} in ${name}`, region),
                description: cvWriting.seo.description,
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

function generatePage(urlPath, title, description, image, options = {}) {
    const { noindex = false } = options;
    const templatePath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('Error: dist/index.html not found. Run build first.');
        return;
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace Title
    html = html.replace(/<title>.*<\/title>/, `<title>${title}</title>`);

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
    const safeContent = (str) => str ? str.replace(/"/g, '&quot;') : '';

    const canonicalUrl = `${SITE_URL}${urlPath}`;

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
    if (html.includes('rel="canonical"')) {
        html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
        html = html.replace('</head>', `    <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    // Real-but-not-yet-authoritative content (e.g. illustrative sample job listings)
    // must stay noindex even for crawlers that never execute the client-side Helmet tags.
    if (noindex) {
        html = html.replace('</head>', `    <meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />\n</head>`);
    }

    // Write file
    const outputPath = path.join(DIST_DIR, urlPath, 'index.html');
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
    // JobDetail.tsx for the matching client-side noindex + no-JobPosting-schema handling).
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

    // Region-scoped base/service routes: REGION_CODES x REGION_ROUTE_SUFFIXES
    REGION_CODES.forEach(region => {
        REGION_ROUTE_SUFFIXES.forEach(({ suffix, changefreq, priority }) => {
            // Job listing pages are illustrative sample data for now (see IS_MOCK_JOB_SOURCE)
            // - keep the sitemap free of them until a real feed is wired in.
            if (suffix === '/jobs' && IS_MOCK_JOB_SOURCE) return;
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
    buildPriorityPageMeta(servicesData, regionSeo, pageSeo, industryPages).forEach(({ urlPath, title, description }) => {
        urls.push(urlPath);
        generatePage(urlPath, title, description, null);
    });

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
        generatePage(
            url,
            'GCC CV Checklist for Job Seekers',
            "A free, printable checklist covering CV structure, ATS formatting, GCC targeting, personal-details safety, experience writing and proofreading for Gulf job applications.",
            null
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
            generatePage(url, title, description, null);
            addSitemapEntry({ loc: `${SITE_URL}${url}`, changefreq: 'yearly', priority: '0.3' });
        });
    }

    // Generate the 5 approved content hubs (Unit 6) - a fixed, explicit list, never a
    // pattern applied to arbitrary /blog/:slug values.
    if (blogHubsData) {
        blogHubsData.forEach(hub => {
            const url = `/blog/${hub.slug}`;
            urls.push(url);
            generatePage(url, hub.title, hub.metaDescription, null);
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

            generatePage(
                url,
                blog.title,
                blog.excerpt,
                hasCoverImage ? `${SITE_URL}${blog.coverImage}` : null
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
