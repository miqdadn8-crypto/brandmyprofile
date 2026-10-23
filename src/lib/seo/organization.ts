import organizationData from "./organization.json";

const SITE_URL = "https://www.brandmyprofile.com";

// Google Business Profile listing (real, user-confirmed) — included in `sameAs` so
// Google can consolidate entity/review signals with this site, and linked from the UI
// (see Footer, Contact, SuccessStories) to drive traffic back to leave reviews.
export const GOOGLE_BUSINESS_PROFILE_URL = organizationData.googleBusinessProfileUrl;

// Lives in organization.json so scripts/generate-static-pages.js can pre-render the
// exact same entity into the static HTML without importing this .ts file.
export const organizationSchema = organizationData.organization;

// Unit 7: was previously typed as "ProfessionalService", a schema.org LocalBusiness
// subtype. BrandMyProfile operates online with no customer-facing physical office (a
// service-area Google Business Profile exists but is deliberately not a LocalBusiness
// entity here - see GOOGLE_BUSINESS_PROFILE_URL above, already linked via Organization's
// sameAs). Re-typed as a plain Service to describe the overall offering without implying
// a physical-location entity; hasMap (a LocalBusiness/Place-oriented property) removed
// accordingly. Organization remains the single authoritative entity for this business.
export const professionalServiceSchema = {
  "@type": "Service",
  "@id": `${SITE_URL}/#professional-service`,
  name: "BrandMyProfile CV Writing and Career Coaching",
  url: SITE_URL,
  image: `${SITE_URL}/brandmyprofile-og.png`,
  description:
    "ATS-optimized CV writing, LinkedIn profile makeovers and one-on-one career coaching for GCC and India job seekers.",
  provider: { "@id": organizationSchema["@id"] },
  areaServed: organizationSchema.areaServed,
  serviceType: [
    "CV writing services",
    "Resume writing services",
    "LinkedIn profile optimization",
    "Career coaching",
    "Interview coaching",
  ],
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/pricing`,
    availability: "https://schema.org/InStock",
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "BrandMyProfile",
  url: SITE_URL,
  publisher: { "@id": organizationSchema["@id"] },
};
