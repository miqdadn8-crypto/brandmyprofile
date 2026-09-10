const SITE_URL = "https://www.brandmyprofile.com";

// Google Business Profile listing (real, user-confirmed) — included in `sameAs` so
// Google can consolidate entity/review signals with this site, and linked from the UI
// (see Footer, Contact, SuccessStories) to drive traffic back to leave reviews.
export const GOOGLE_BUSINESS_PROFILE_URL = "https://share.google/2G466PLGfS085Dtiz";

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "BrandMyProfile",
  url: SITE_URL,
  logo: `${SITE_URL}/brandmyprofile-og.png`,
  description:
    "Professional CV writing, LinkedIn optimization and career coaching for professionals in Kuwait, UAE, Saudi Arabia, Qatar and India.",
  telephone: "+965 41103254",
  email: "info@brandmyprofile.com",
  sameAs: [
    "https://www.linkedin.com/company/brandmyprofile",
    "https://www.instagram.com/brandmyprofile/",
    GOOGLE_BUSINESS_PROFILE_URL,
  ],
  areaServed: [
    { "@type": "Country", name: "Kuwait" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "Qatar" },
    { "@type": "Country", name: "India" },
  ],
};

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
