// Shared SEO copy for pages whose title/description are either identical across every
// region (About, Success Stories) or a single-variable template ({region}) rather than
// genuinely different sentences per region (Contact, Jobs listing, and 3 of the 4 service
// pages' descriptions - CV Writing's description is region-specific enough to live in
// regionContent.ts instead). This is the one data source for that copy: both the live
// React pages (via the helpers below) and scripts/generate-static-pages.js (via a direct
// JSON.parse of pageSeo.json, since that plain Node script can't import this .ts file)
// read the exact same file, so the two can never drift apart.
import pageSeoData from "./pageSeo.json";

type StaticPageKey = keyof typeof pageSeoData.static;
type TemplatedPageKey = keyof typeof pageSeoData.templated;
type ServiceDescriptionKey = keyof typeof pageSeoData.serviceDescriptionTemplates;

// Unit 9.1: descriptions for these pages now vary genuinely per region (not a mechanical
// {region}-token swap - see pageSeo.json's `descriptions` map) since Unit 9's full-site audit
// found them byte-identical across all 5 full-footprint regions. Titles are unchanged - the
// region name is still only appended via SEO.tsx's shared buildFullTitle suffix logic.
export function getStaticPageSeo(pageKey: StaticPageKey, regionCode: string): { title: string; description: string } {
  const entry = pageSeoData.static[pageKey];
  return { title: entry.title, description: entry.descriptions[regionCode as keyof typeof entry.descriptions] };
}

export function getTemplatedPageSeo(pageKey: TemplatedPageKey, regionName: string): { title: string; description: string } {
  const entry = pageSeoData.templated[pageKey];
  return {
    title: entry.titleTemplate.replace("{region}", regionName),
    description: entry.descriptionTemplate.replace("{region}", regionName),
  };
}

export function getServiceSeoDescription(serviceKey: ServiceDescriptionKey, regionName: string): string {
  return pageSeoData.serviceDescriptionTemplates[serviceKey].replace("{region}", regionName);
}
