import { Helmet } from "react-helmet-async";
import { useRegion, regions } from "@/contexts/RegionContext";
import { isRoutedPathAvailable } from "@/contexts/regionAvailability";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  path?: string;
  keywords?: string;
  structuredData?: Record<string, unknown>;
  region?: string; // Optional override for static generation
  // Set true for real-but-not-yet-authoritative content (e.g. illustrative sample
  // data) that should stay reachable to users but not be indexed as a real page.
  noindex?: boolean;
}

const REGION_NAMES: Record<string, string> = {
  kuwait: "Kuwait",
  uae: "UAE",
  saudi: "Saudi Arabia",
  qatar: "Qatar",
  india: "India",
  bahrain: "Bahrain",
  oman: "Oman",
};

// hreflang / og:locale country codes per region (ISO 3166-1 alpha-2)
const REGION_HREFLANG: Record<string, string> = {
  kuwait: "en-KW",
  uae: "en-AE",
  saudi: "en-SA",
  qatar: "en-QA",
  india: "en-IN",
  bahrain: "en-BH",
  oman: "en-OM",
};

const REGION_OG_LOCALE: Record<string, string> = {
  kuwait: "en_KW",
  uae: "en_AE",
  saudi: "en_SA",
  qatar: "en_QA",
  india: "en_IN",
  bahrain: "en_BH",
  oman: "en_OM",
};

const DEFAULT_REGION_CODE = "kuwait";

export default function SEO({
  title,
  description,
  ogImage,
  path = "",
  keywords,
  structuredData,
  region,
  noindex = false,
}: SEOProps) {
  const { selectedRegion } = useRegion();
  const location = useLocation();

  // Prioritize passed region (for static build) -> then context -> then default
  const activeRegionCode = region || selectedRegion.code || "kuwait";
  const regionName = REGION_NAMES[activeRegionCode] || "Kuwait";

  const siteUrl = "https://www.brandmyprofile.com";

  // Construct proper canonical URL
  // If path is provided (e.g. from static generation script), use it.
  // Otherwise, use current location but STRIP query params to avoid duplicate content.
  const cleanPath = path || location.pathname;
  const canonicalUrl = `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`;

  // Pages that already name the active region in their `title` (e.g. "... in Kuwait")
  // skip the auto-appended region suffix below to avoid "... Kuwait | BrandMyProfile Kuwait".
  // Titles that already name the brand (e.g. About) only get the region, never a second brand.
  const titleAlreadyMentionsRegion = title.toLowerCase().includes(regionName.toLowerCase());
  const titleAlreadyMentionsBrand = title.includes("BrandMyProfile");
  const fullTitle = titleAlreadyMentionsBrand
    ? titleAlreadyMentionsRegion ? title : `${title} | ${regionName}`
    : titleAlreadyMentionsRegion
      ? `${title} | BrandMyProfile`
      : `${title} | BrandMyProfile ${regionName}`;
  const defaultImage = `${siteUrl}/brandmyprofile-og.png`;
  const imageUrl = ogImage ? (ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`) : defaultImage;
  const ogLocale = REGION_OG_LOCALE[activeRegionCode] || "en_US";

  // Region-scoped pages (e.g. /kuwait/pricing) have near-duplicate variants for every
  // other region. Build hreflang alternates by swapping the first path segment; skip
  // entirely for non-region routes (e.g. /blog, /blog/:slug).
  const pathSegments = cleanPath.split('/');
  const isRegionPath = pathSegments.length > 1 && regions.some((r) => r.code === pathSegments[1]);
  const routeSuffix = pathSegments.length > 2 ? `/${pathSegments.slice(2).join('/')}` : '';
  const hreflangAlternates = isRegionPath
    ? regions
        // Never claim a hreflang-equivalent page for a region that doesn't actually have
        // this route yet (e.g. Bahrain/Oman only have home/cv-writing/contact so far).
        .filter((r) => isRoutedPathAvailable(r.code, routeSuffix))
        .map((r) => {
          const altSegments = [...pathSegments];
          altSegments[1] = r.code;
          return { hreflang: REGION_HREFLANG[r.code], href: `${siteUrl}${altSegments.join('/')}` };
        })
    : [];
  // The default region (Kuwait) doesn't have every route a more exclusive region does
  // (e.g. /services/europass-cv is India-only) - never point x-default at a path that
  // would actually render NotFound there. Fall back to the current page's own alternate
  // (already filtered to only real alternates above) instead of skipping x-default entirely.
  const xDefaultHref = isRegionPath
    ? isRoutedPathAvailable(DEFAULT_REGION_CODE, routeSuffix)
      ? (() => {
          const defaultSegments = [...pathSegments];
          defaultSegments[1] = DEFAULT_REGION_CODE;
          return `${siteUrl}${defaultSegments.join('/')}`;
        })()
      : hreflangAlternates[0]?.href ?? null
    : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="BrandMyProfile" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional SEO */}
      {/* noindex pages (e.g. sample job listings) stay crawlable (follow) so Google can see
          the directive, and deliberately emit no canonical / hreflang / JSON-LD below. */}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      {noindex && <meta name="googlebot" content="noindex, follow" />}
      <meta name="language" content="English" />
      <meta name="author" content="BrandMyProfile" />
      <meta name="geo.region" content={activeRegionCode.toUpperCase()} />
      <meta name="geo.placename" content={regionName} />
      {!noindex && <link rel="canonical" href={canonicalUrl} />}

      {/* Hreflang alternates for region variants */}
      {!noindex && hreflangAlternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      {!noindex && xDefaultHref && <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />}

      {/* Structured Data */}
      {!noindex && structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
