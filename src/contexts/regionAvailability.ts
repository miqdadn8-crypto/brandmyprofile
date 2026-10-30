// Bahrain/Oman only have a minimal SEO/conversion footprint live so far (Unit 3A: home,
// CV Writing, and Contact - no pricing page, since no real approved BHD/OMR pricing exists
// yet, and no other service pages). Nav/footer links, region-switch navigation, and
// hreflang alternates all consult this so nothing ever points at a page that doesn't
// have genuine, approved content behind it yet. Kept in its own module (rather than
// RegionContext.tsx, which also exports the RegionProvider component) purely to avoid
// growing that file's non-component export surface for react-refresh's sake.
export const LIMITED_FOOTPRINT_REGIONS = new Set(["bahrain", "oman"]);
export const LIMITED_FOOTPRINT_ALLOWED_SUFFIXES = ["", "/services/cv-writing", "/contact", "/free-cv-review"];

// Routes that only exist for one specific region regardless of footprint status - e.g.
// Europass CV writing is only offered for India (Unit 3D), never for Kuwait/UAE/Saudi/
// Qatar (full-footprint regions that would otherwise pass the check below) or Bahrain/Oman.
// Keyed by path suffix -> the single region code allowed to serve it.
export const REGION_EXCLUSIVE_SUFFIXES: Record<string, string> = {
  "/services/europass-cv": "india",
  // India->GCC / India->Europe intent hubs (Unit 5) - navigation/guidance pages that
  // only make sense for India, never a real page for any other region.
  "/gcc-jobs": "india",
  "/europe-jobs": "india",
};

// Approved (region, industry-slug) combinations for /{region}/cv-writing/{industry}
// pages (Unit 4A) - controlled programmatic SEO, never a generator for arbitrary
// industry slugs. Consulted by isRoutedPathAvailable below, which in turn gates
// RegionLayout rendering, SEO.tsx's hreflang alternates (so e.g. Kuwait's oil-gas page
// never manufactures a fake hreflang alternate to a UAE oil-gas page that doesn't
// exist), and Header/CVWriting internal-link visibility - all from this one list.
export const INDUSTRY_CV_WHITELIST: Record<string, string[]> = {
  // Unit 4B additions share a slug with another region on purpose where the pages are
  // genuine same-topic equivalents (e.g. "construction" across kuwait/uae/saudi/qatar,
  // "finance" across kuwait/uae, "technology" across uae/saudi) - isRoutedPathAvailable's
  // industry-slug check below uses exact slug matches to build hreflang alternates, so
  // shared slugs automatically produce correct cross-region alternates and distinct
  // slugs (e.g. the "-gcc" suffixed India pages) automatically stay self-referencing only.
  kuwait: ["oil-gas", "engineering", "construction", "finance"],
  uae: ["finance", "technology", "construction", "hospitality"],
  saudi: ["engineering", "construction", "healthcare", "technology"],
  qatar: ["energy", "construction", "hospitality"],
  india: ["engineering-gcc", "technology-gcc", "finance-gcc"],
};

export function isIndustryCvSlugValid(regionCode: string, industrySlug: string): boolean {
  return INDUSTRY_CV_WHITELIST[regionCode]?.includes(industrySlug) ?? false;
}

// Given a region code and a path suffix (e.g. "" for the region home, "/pricing",
// "/services/cv-writing"), returns whether that page is actually meant to exist for
// that region right now. Region-exclusive suffixes are checked first, then industry CV
// suffixes against the whitelist above; otherwise full-footprint regions are always
// available, and limited-footprint regions are restricted to LIMITED_FOOTPRINT_ALLOWED_SUFFIXES.
export function isRoutedPathAvailable(regionCode: string, pathSuffix: string): boolean {
  const exclusiveRegion = REGION_EXCLUSIVE_SUFFIXES[pathSuffix];
  if (exclusiveRegion) return regionCode === exclusiveRegion;

  const industryMatch = pathSuffix.match(/^\/cv-writing\/([a-z0-9-]+)$/);
  if (industryMatch) return isIndustryCvSlugValid(regionCode, industryMatch[1]);

  if (!LIMITED_FOOTPRINT_REGIONS.has(regionCode)) return true;
  return LIMITED_FOOTPRINT_ALLOWED_SUFFIXES.includes(pathSuffix);
}
