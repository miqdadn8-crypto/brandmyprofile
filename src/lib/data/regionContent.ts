// Single source of truth for region-aware marketing copy. Components look up
// their own slice by `selectedRegion.code` rather than branching on region
// themselves - this keeps region-specific wording in one place instead of
// scattered conditionals across the codebase. Pricing VALUES live separately
// in src/lib/data/{region}/pricing.json and are not duplicated here.
//
// `seo` and `pricingIntro` below are sourced from regionSeo.json (plain data,
// no TS syntax) rather than inlined here, specifically so scripts/generate-static-pages.js
// - a plain Node script that can't parse this file's TypeScript - can load the exact
// same values via JSON.parse instead of maintaining a separate hardcoded copy.
import regionSeo from "./regionSeo.json";

export interface ServicePageCopy {
  heading: string;
  intro: string;
}

export interface RegionContentEntry {
  displayName: string;
  shortName: string;
  countryCode: string;
  currency: string;
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
  };
  marketFocus: {
    title: string;
    description: string;
  };
  homeServicesIntro: string;
  pricingIntro: string;
  ctaSupportingText: string;
  marketFaq: {
    question: string;
    answer: string;
  };
  seo: {
    title: string;
    description: string;
  };
  contactContext: string;
  servicePages: {
    "cv-writing": ServicePageCopy;
    "linkedin-makeover": ServicePageCopy;
    "career-guidance": ServicePageCopy;
    masterclass: ServicePageCopy;
  };
  // Optional homepage direct-answer (AEO) block, distinct from marketFaq's accordion
  // question - only set for regions that specifically need one (see Home.tsx).
  aeoBlock?: {
    question: string;
    answer: string;
  };
  // ATS CV page content - deliberately optional and only populated for the 5 regions
  // that have this page (Unit 3B). Bahrain/Oman have no `atsCv` entry at all, which
  // ATSCV.tsx and regionAvailability.ts both treat as "this page doesn't exist here".
  atsCv?: AtsCvContent;
  // GCC Format CV page content - same optionality pattern as atsCv (Unit 3C). Bahrain/Oman
  // have no `gccCv` entry, which GCCCV.tsx and regionAvailability.ts both treat as
  // "this page doesn't exist here".
  gccCv?: GccCvContent;
  // Europass CV page content - India-only (Unit 3D). Every other region has no
  // `europassCv` entry, which EuropassCV.tsx and REGION_EXCLUSIVE_SUFFIXES in
  // regionAvailability.ts both treat as "this page doesn't exist here".
  europassCv?: EuropassCvContent;
  // India->GCC / India->Europe intent hub pages (Unit 5) - India-only, same optionality
  // pattern as europassCv. Only metaTitle/metaDescription live here (generator-shared);
  // the rest of each hub's content is India-only and hardcoded directly in its page
  // component, since there is no per-region variation to drive from shared data.
  gccJobsHub?: IntentHubMeta;
  europeJobsHub?: IntentHubMeta;
  // Optional per-region title/description overrides for the money pages (sourced from
  // regionSeo.json so scripts/generate-static-pages.js emits the identical text). Regions
  // without an entry keep the shared services.json / pageSeo.json defaults.
  serviceSeo?: {
    "cv-writing"?: IntentHubMeta;
    "linkedin-makeover"?: IntentHubMeta;
    pricing?: { metaTitle: string; metaDescriptionTemplate: string };
  };
}

export interface IntentHubMeta {
  metaTitle: string;
  metaDescription: string;
}

export interface AtsCvContent {
  eyebrow: string;
  heading: string; // H1
  metaTitle: string;
  metaDescription: string;
  marketContextHeading: string;
  marketContextParagraph: string;
  industries: string[];
  faq: { question: string; answer: string };
  whatsappMessage: string;
  // India-only: the "applying from India to GCC roles" callout (Unit 3B, section 12).
  indiaAngle?: { heading: string; paragraph: string };
}

export interface GccCvContent {
  eyebrow: string;
  heading: string; // H1
  heroSubtext: string;
  metaTitle: string;
  metaDescription: string;
  marketContextHeading: string;
  marketContextParagraph: string;
  industries: string[];
  // 1 region-specific FAQ for Kuwait/UAE/Saudi/Qatar, 2 for India (Unit 3C, section 19).
  regionFaqs: { question: string; answer: string }[];
  whatsappMessage: string;
  // India-only: the "applying from India to GCC jobs" major section (Unit 3C, section 13).
  indiaAngle?: {
    heading: string;
    intro: string;
    guidance: string[];
    countryLinks: { label: string; code: string }[];
  };
}

export interface EuropassCvContent {
  eyebrow: string;
  heading: string; // H1
  heroSubtext: string;
  metaTitle: string;
  metaDescription: string;
  whatsappMessage: string;
}

export const regionContent: Record<string, RegionContentEntry> = {
  kuwait: {
    displayName: "Kuwait",
    shortName: "Kuwait",
    countryCode: "KW",
    currency: "KWD",
    hero: {
      eyebrow: "ATS CV Writing for Kuwait & GCC",
      headline: "Get an ATS-Ready CV Built for Kuwait and GCC Jobs",
      description:
        "Professional CV writing, LinkedIn optimization and career support tailored to your target role and Kuwait/GCC hiring market.",
    },
    marketFocus: {
      title: "Kuwait & GCC Market Focus",
      description: "Deep expertise in Kuwait's hiring practices, plus the wider UAE, Saudi, Qatar and India job markets.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting Kuwait and GCC opportunities.",
    ...regionSeo.kuwait,
    atsCv: {
      ...regionSeo.kuwait.atsCv,
      eyebrow: "ATS CV Writing for Kuwait & GCC",
      heading: "ATS CV Writing for Kuwait Job Seekers",
      marketContextHeading: "ATS CV Writing for Kuwait's Job Market",
      marketContextParagraph:
        "Kuwait's employers across sectors like oil & gas, engineering, construction, finance, healthcare, IT and logistics increasingly rely on applicant tracking systems to manage high volumes of applications. An ATS-optimized CV helps ensure your experience in these sectors is captured clearly and matched to the roles you're targeting.",
      industries: ["Oil & Gas", "Engineering", "Construction", "Finance", "Healthcare", "IT", "Logistics"],
      faq: {
        question: "How should I optimize my CV for Kuwait jobs?",
        answer:
          "Focus on clear, achievement-based descriptions relevant to Kuwait's private and semi-government employers, use consistent formatting, and include keywords specific to your target industry, such as oil & gas, engineering or finance.",
      },
      whatsappMessage: "Hi BrandMyProfile, I need an ATS-optimized CV for Kuwait job applications.",
    },
    gccCv: {
      ...regionSeo.kuwait.gccCv,
      eyebrow: "GCC CV Writing",
      heading: "GCC CV Format for Kuwait Job Applications",
      heroSubtext:
        "Get a professionally structured CV tailored for Kuwait and GCC employers, with clear experience, relevant skills, market-appropriate presentation and human review.",
      marketContextHeading: "GCC CV Format for Kuwait's Job Market",
      marketContextParagraph:
        "Kuwait's employers across oil & gas, engineering, construction, finance, healthcare, IT and logistics often review applications from candidates across the GCC and beyond. Presenting your experience with GCC-appropriate structure, clear availability and role-relevant positioning can help your CV read naturally to Kuwaiti hiring teams.",
      industries: ["Oil & Gas", "Engineering", "Construction", "Finance", "Healthcare", "IT", "Logistics"],
      regionFaqs: [
        {
          question: "What should I include in a CV for Kuwait jobs?",
          answer:
            "Focus on clear, achievement-based experience relevant to Kuwait's private and semi-government employers, note your current location and availability if relevant, and use consistent formatting throughout.",
        },
      ],
      whatsappMessage: "Hi BrandMyProfile, I need a GCC-format CV for Kuwait job applications.",
    },
    ctaSupportingText: "Get feedback tailored to your Kuwait/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Kuwait jobs?",
      answer:
        "Yes. Our writers understand Kuwaiti hiring practices, the ATS systems used by local and multinational employers, and what recruiters in Kuwait look for at every experience level.",
    },
    contactContext: "Reach out for CV writing, LinkedIn optimization or career guidance tailored to the Kuwait job market.",
    servicePages: {
      "cv-writing": {
        heading: "CV Writing for Kuwait Jobs",
        intro:
          "Kuwait's private and semi-government employers routinely screen CVs through ATS software before a human ever sees them. We format and position your experience the way Kuwaiti recruiters and hiring managers expect.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for Kuwait",
        intro:
          "Recruiters in Kuwait increasingly search LinkedIn before reviewing a CV. We optimize your headline, About section and keywords so you surface in the searches Kuwaiti hiring managers actually run.",
      },
      "career-guidance": {
        heading: "Career Guidance for the Kuwait Market",
        intro:
          "One-to-one guidance on navigating Kuwait's job market - from salary benchmarks to interview expectations at Kuwaiti private-sector and government-linked employers.",
      },
      masterclass: {
        heading: "Career Masterclasses for Kuwait Job Seekers",
        intro:
          "Live sessions covering job-search strategy, CV and LinkedIn workshops, and interview preparation specific to Kuwait's hiring market.",
      },
    },
  },
  uae: {
    displayName: "UAE",
    shortName: "UAE",
    countryCode: "AE",
    currency: "AED",
    hero: {
      eyebrow: "ATS CV Writing for UAE & GCC",
      headline: "Get an ATS-Ready CV Built for UAE and GCC Jobs",
      description:
        "Professional CV writing, LinkedIn optimization and career support tailored to your target role and UAE/GCC hiring market.",
    },
    marketFocus: {
      title: "UAE & GCC Market Focus",
      description: "Deep expertise in UAE hiring practices, plus the wider Kuwait, Saudi, Qatar and India job markets.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting UAE and GCC opportunities.",
    ...regionSeo.uae,
    atsCv: {
      ...regionSeo.uae.atsCv,
      eyebrow: "ATS CV Writing for UAE & GCC",
      heading: "ATS CV Writing for UAE Job Seekers",
      marketContextHeading: "ATS CV Writing for the UAE Job Market",
      marketContextParagraph:
        "From multinational employers in Dubai and Abu Dhabi to fast-growing sectors like finance, technology, hospitality and construction, UAE recruiters often screen high volumes of applications through applicant tracking systems. A well-structured, ATS-friendly CV helps your experience get through that first screening stage clearly.",
      industries: ["Multinational Employers", "Finance", "Technology", "Hospitality", "Construction", "Professional Services"],
      faq: {
        question: "How should I optimize my CV for UAE or Dubai jobs?",
        answer:
          "Highlight measurable achievements relevant to multinational or free-zone employers, use clear section headings, and include keywords aligned with the specific role and industry you're targeting in Dubai, Abu Dhabi or elsewhere in the UAE.",
      },
      whatsappMessage: "Hi BrandMyProfile, I need an ATS-optimized CV for UAE job applications.",
    },
    gccCv: {
      ...regionSeo.uae.gccCv,
      eyebrow: "GCC CV Writing",
      heading: "GCC CV Format for UAE Job Applications",
      heroSubtext:
        "Get a professionally structured CV tailored for UAE and GCC employers, with clear experience, relevant skills, market-appropriate presentation and human review.",
      marketContextHeading: "GCC CV Format for the UAE Job Market",
      marketContextParagraph:
        "From multinational employers in Dubai and Abu Dhabi to fast-growing sectors like finance, technology, hospitality, construction and professional services, UAE recruiters review applications from a highly international talent pool. A clearly structured, GCC-appropriate CV helps your experience read naturally within that hiring environment.",
      industries: ["Multinational Employers", "Finance", "Technology", "Hospitality", "Construction", "Professional Services"],
      regionFaqs: [
        {
          question: "Is a Dubai CV different from a standard CV?",
          answer:
            "Not fundamentally, but CVs used in Dubai and the wider UAE often include a location or visa-status line and are structured to read clearly to multinational and free-zone employers. The underlying content principles - clarity, achievements, relevant keywords - stay the same.",
        },
      ],
      whatsappMessage: "Hi BrandMyProfile, I need a GCC-format CV for UAE job applications.",
    },
    ctaSupportingText: "Get feedback tailored to your UAE/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for UAE jobs?",
      answer:
        "Yes. We tailor your CV to how UAE employers hire - from Dubai and Abu Dhabi multinationals to free-zone companies - including the keywords their ATS systems screen for.",
    },
    contactContext: "Reach out for CV writing, LinkedIn optimization or career guidance tailored to the UAE job market.",
    servicePages: {
      "cv-writing": {
        heading: "CV Writing for UAE Jobs",
        intro:
          "From Dubai free-zone startups to Abu Dhabi multinationals, UAE recruiters move fast and expect a CV that gets straight to measurable impact. We write yours to clear ATS filters and stand out in a crowded applicant pool.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for UAE",
        intro:
          "UAE recruiters live on LinkedIn. We rebuild your profile so it reads as a UAE-market-ready professional the moment a Dubai or Abu Dhabi hiring manager lands on it.",
      },
      "career-guidance": {
        heading: "Career Guidance for the UAE Market",
        intro:
          "Get practical, one-to-one direction on UAE career moves, from Dubai vs. Abu Dhabi market differences to negotiating packages with multinational employers.",
      },
      masterclass: {
        heading: "Career Masterclasses for UAE Job Seekers",
        intro:
          "Live training on job-search strategy, CV and LinkedIn workshops, and interview preparation built around how UAE employers actually hire.",
      },
    },
  },
  saudi: {
    displayName: "Saudi Arabia",
    shortName: "Saudi",
    countryCode: "SA",
    currency: "SAR",
    hero: {
      eyebrow: "ATS CV Writing for Saudi Arabia & GCC",
      headline: "Get an ATS-Ready CV Built for Saudi and GCC Jobs",
      description:
        "Professional CV writing, LinkedIn optimization and career support tailored to your target role and Saudi/GCC hiring market.",
    },
    marketFocus: {
      title: "Saudi & GCC Market Focus",
      description: "Deep expertise in Saudi Arabia's hiring practices, plus the wider Kuwait, UAE, Qatar and India job markets.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting Saudi and GCC opportunities.",
    ...regionSeo.saudi,
    atsCv: {
      ...regionSeo.saudi.atsCv,
      eyebrow: "ATS CV Writing for Saudi Arabia & GCC",
      heading: "ATS CV Writing for Saudi Arabia Job Seekers",
      marketContextHeading: "ATS CV Writing for Saudi Arabia's Job Market",
      marketContextParagraph:
        "Saudi Arabia's growth across engineering, construction, healthcare, technology and large-scale giga-projects means employers often rely on applicant tracking systems to manage large applicant pools. An ATS-optimized CV helps ensure your qualifications and experience are read clearly and matched to the right roles.",
      industries: ["Engineering", "Construction", "Healthcare", "Technology", "Large-Scale Projects", "Professional Services"],
      faq: {
        question: "How should I optimize my CV for Saudi Arabia jobs?",
        answer:
          "Structure your CV around clear, industry-relevant keywords - particularly for engineering, construction, healthcare or technology roles - and present your experience in a straightforward format that both ATS software and Saudi employers can review easily.",
      },
      whatsappMessage: "Hi BrandMyProfile, I need an ATS-optimized CV for Saudi Arabia job applications.",
    },
    gccCv: {
      ...regionSeo.saudi.gccCv,
      eyebrow: "GCC CV Writing",
      heading: "GCC CV Format for Saudi Arabia Job Applications",
      heroSubtext:
        "Get a professionally structured CV tailored for Saudi Arabia and GCC employers, with clear experience, relevant skills, market-appropriate presentation and human review.",
      marketContextHeading: "GCC CV Format for Saudi Arabia's Job Market",
      marketContextParagraph:
        "Saudi Arabia's engineering, construction, healthcare, technology and large-scale project sectors continue to hire from a broad regional and international talent pool. A CV structured with clear, role-specific positioning helps ensure your qualifications and experience are read accurately by Saudi employers and their hiring processes.",
      industries: ["Engineering", "Construction", "Healthcare", "Technology", "Large-Scale Projects", "Professional Services"],
      regionFaqs: [
        {
          question: "How should I prepare a CV for Saudi Arabia jobs?",
          answer:
            "Present your experience with clear, industry-relevant keywords - particularly for engineering, construction, healthcare or technology roles - and keep the structure straightforward so both recruiters and any screening systems used by Saudi employers can review it easily.",
        },
      ],
      whatsappMessage: "Hi BrandMyProfile, I need a GCC-format CV for Saudi Arabia job applications.",
    },
    ctaSupportingText: "Get feedback tailored to your Saudi/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Saudi jobs?",
      answer:
        "Yes. We write your CV to match Saudi hiring expectations, including sector-specific keywords relevant to Vision 2030 growth industries and Nitaqat-compliant employers.",
    },
    contactContext: "Reach out for CV writing, LinkedIn optimization or career guidance tailored to the Saudi job market.",
    servicePages: {
      "cv-writing": {
        heading: "CV Writing for Saudi Jobs",
        intro:
          "Saudi Arabia's Vision 2030 sectors and Nitaqat hiring requirements reward CVs that speak directly to local employer priorities. We tailor your CV's structure and language for Saudi recruitment norms.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for Saudi Arabia",
        intro:
          "As Saudi employers expand LinkedIn-first hiring alongside Vision 2030 growth, we position your profile to match the keywords and seniority signals Saudi recruiters search for.",
      },
      "career-guidance": {
        heading: "Career Guidance for the Saudi Market",
        intro:
          "Personalized guidance on building a career in Saudi Arabia's fast-changing job market, including how Vision 2030 sector growth is reshaping in-demand roles.",
      },
      masterclass: {
        heading: "Career Masterclasses for Saudi Job Seekers",
        intro:
          "Live sessions on job-search strategy, CV and LinkedIn workshops, and interview preparation aligned with Saudi Arabia's evolving hiring landscape.",
      },
    },
  },
  qatar: {
    displayName: "Qatar",
    shortName: "Qatar",
    countryCode: "QA",
    currency: "QAR",
    hero: {
      eyebrow: "ATS CV Writing for Qatar & GCC",
      headline: "Get an ATS-Ready CV Built for Qatar and GCC Jobs",
      description:
        "Professional CV writing, LinkedIn optimization and career support tailored to your target role and Qatar/GCC hiring market.",
    },
    marketFocus: {
      title: "Qatar & GCC Market Focus",
      description: "Deep expertise in Qatar's hiring practices, plus the wider Kuwait, UAE, Saudi and India job markets.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting Qatar and GCC opportunities.",
    ...regionSeo.qatar,
    atsCv: {
      ...regionSeo.qatar.atsCv,
      eyebrow: "ATS CV Writing for Qatar & GCC",
      heading: "ATS CV Writing for Qatar Job Seekers",
      marketContextHeading: "ATS CV Writing for Qatar's Job Market",
      marketContextParagraph:
        "Qatar's energy, engineering, infrastructure, hospitality and professional-services sectors continue to hire from a competitive applicant pool, often supported by applicant tracking systems during initial screening. A clearly structured, ATS-friendly CV helps make sure your relevant experience doesn't get lost in that process.",
      industries: ["Energy", "Engineering", "Infrastructure", "Hospitality", "Professional Services"],
      faq: {
        question: "How should I optimize my CV for Qatar jobs?",
        answer:
          "Use clear section headings and keywords relevant to Qatar's energy, engineering, infrastructure or hospitality sectors, and keep the structure simple so both applicant tracking systems and Qatari employers can review your experience easily.",
      },
      whatsappMessage: "Hi BrandMyProfile, I need an ATS-optimized CV for Qatar job applications.",
    },
    gccCv: {
      ...regionSeo.qatar.gccCv,
      eyebrow: "GCC CV Writing",
      heading: "GCC CV Format for Qatar Job Applications",
      heroSubtext:
        "Get a professionally structured CV tailored for Qatar and GCC employers, with clear experience, relevant skills, market-appropriate presentation and human review.",
      marketContextHeading: "GCC CV Format for Qatar's Job Market",
      marketContextParagraph:
        "Qatar's energy, engineering, infrastructure, hospitality and professional-services sectors hire from a competitive, internationally connected talent pool. A clearly structured CV that reflects GCC hiring expectations helps make sure your relevant experience is presented clearly to Qatari employers.",
      industries: ["Energy", "Engineering", "Infrastructure", "Hospitality", "Professional Services"],
      regionFaqs: [
        {
          question: "What CV format works best for Qatar jobs?",
          answer:
            "A clear, well-structured CV that highlights industry-relevant experience - particularly in energy, engineering, infrastructure or hospitality - and states your availability and location, tends to read well to employers hiring in Qatar.",
        },
      ],
      whatsappMessage: "Hi BrandMyProfile, I need a GCC-format CV for Qatar job applications.",
    },
    ctaSupportingText: "Get feedback tailored to your Qatar/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Qatar jobs?",
      answer:
        "Yes. We tailor your CV for Qatar's employer expectations, including the energy, hospitality and infrastructure sectors that drive much of the local hiring market.",
    },
    contactContext: "Reach out for CV writing, LinkedIn optimization or career guidance tailored to the Qatar job market.",
    servicePages: {
      "cv-writing": {
        heading: "CV Writing for Qatar Jobs",
        intro:
          "Qatar's energy, hospitality and infrastructure sectors hire from a small, highly competitive pool. We craft your CV to highlight exactly what Qatari employers screen for first.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for Qatar",
        intro:
          "In Qatar's tight-knit professional network, a strong LinkedIn presence often opens doors before a CV does. We sharpen your profile to get noticed by the right people.",
      },
      "career-guidance": {
        heading: "Career Guidance for the Qatar Market",
        intro:
          "One-to-one support for navigating Qatar's compact but competitive job market, including realistic salary expectations and interview preparation for Qatari employers.",
      },
      masterclass: {
        heading: "Career Masterclasses for Qatar Job Seekers",
        intro:
          "Live training covering job-search strategy, CV and LinkedIn workshops, and interview preparation tailored to Qatar's employer expectations.",
      },
    },
  },
  india: {
    displayName: "India",
    shortName: "India",
    countryCode: "IN",
    currency: "INR",
    hero: {
      eyebrow: "ATS CV Writing for India & GCC Careers",
      headline: "Build an ATS-Ready CV for India and GCC Opportunities",
      description:
        "Professional CV writing, LinkedIn optimization and career support for professionals targeting roles in India and across the GCC.",
    },
    marketFocus: {
      title: "India & GCC Career Focus",
      description: "Deep expertise helping India-based professionals move into Kuwait, UAE, Saudi and Qatar roles.",
    },
    homeServicesIntro: "Career services for professionals targeting Indian and GCC opportunities.",
    ...regionSeo.india,
    atsCv: {
      ...regionSeo.india.atsCv,
      eyebrow: "ATS CV Writing for India & GCC Careers",
      heading: "ATS CV Writing for India, GCC & International Applications",
      marketContextHeading: "ATS CV Writing for India, GCC and International Applications",
      marketContextParagraph:
        "Whether you're applying to roles within India, targeting opportunities across the GCC, or preparing applications for international employers, many recruiters and hiring platforms use applicant tracking systems to manage high application volumes. A well-structured, ATS-friendly CV helps make sure your experience is read clearly, wherever you're applying.",
      industries: ["Domestic Applications", "GCC Applications", "International Applications"],
      faq: {
        question: "Can an ATS CV from India be used for GCC applications?",
        answer:
          "Yes, though it should be adapted for the target market. We tailor keywords, formatting and positioning based on whether you're applying within India, to GCC employers, or to international companies, so your CV reads naturally to the recruiters and systems reviewing it.",
      },
      whatsappMessage: "Hi BrandMyProfile, I need an ATS-optimized CV for my job applications from India.",
      indiaAngle: {
        heading: "Applying from India to GCC Roles?",
        paragraph:
          "If you're based in India and targeting GCC opportunities, your CV should reflect the target role's keywords, clearly state your location and availability, and present your experience in a way that reads naturally to GCC recruiters. Depending on the destination market, some adjustments to format and structure may also be useful.",
      },
    },
    gccCv: {
      ...regionSeo.india.gccCv,
      eyebrow: "GCC CV Writing for Indian Professionals",
      heading: "GCC CV Format for Indian Professionals Targeting Gulf Jobs",
      heroSubtext:
        "Build a professional CV tailored for applications to Kuwait, UAE, Saudi Arabia, Qatar and other GCC markets, with clearer positioning for international employers.",
      marketContextHeading: "GCC CV Format for India-to-Gulf Applications",
      marketContextParagraph:
        "Whether you're applying directly to Gulf employers or through a recruitment agency, presenting your Indian work experience in a way that reads clearly to GCC hiring teams matters. Clear positioning, relevant keywords and a straightforward structure help your CV translate well across markets, whatever industry you're targeting.",
      industries: ["Domestic Applications", "GCC Applications", "International Applications"],
      regionFaqs: [
        {
          question: "Can I use an Indian CV when applying for Gulf jobs?",
          answer:
            "You can start from your existing CV, but it's worth adapting the structure, keywords and positioning for GCC employers, since hiring conventions and expectations can differ between India and Gulf markets.",
        },
        {
          question: "How should I show relocation availability?",
          answer:
            "State your current location, willingness to relocate, and any notice period clearly near the top of your CV, so GCC recruiters can quickly see your availability for the role.",
        },
      ],
      whatsappMessage: "Hi BrandMyProfile, I'm applying from India to GCC jobs and need a GCC-format CV.",
      indiaAngle: {
        heading: "Applying from India to GCC Jobs?",
        intro:
          "A CV that works well for domestic Indian applications isn't always positioned the way GCC employers expect. A few adjustments can make a meaningful difference to how your application reads.",
        guidance: [
          "Specify the target country or countries you're applying to",
          "State your current location and relocation readiness clearly",
          "Include your notice period near the top of the CV",
          "Highlight any GCC or international work experience if you have it",
          "If you don't have GCC experience, emphasize transferable industry experience instead",
          "Use role-specific keywords drawn from the job description",
          "Present job titles in internationally understandable terms",
          "Lead with measurable achievements rather than task lists",
        ],
        countryLinks: [
          { label: "Kuwait", code: "kuwait" },
          { label: "UAE", code: "uae" },
          { label: "Saudi Arabia", code: "saudi" },
          { label: "Qatar", code: "qatar" },
        ],
      },
    },
    europassCv: {
      ...regionSeo.india.europassCv,
      eyebrow: "Europass CV for European Applications",
      heading: "Europass CV Writing for Indian Professionals",
      heroSubtext:
        "Get a clear, professionally prepared Europass CV for European applications where the Europass format is requested or appropriate, with structured experience, skills and qualifications.",
      whatsappMessage: "Hi BrandMyProfile, I'm applying for European opportunities from India and need help preparing a Europass CV.",
    },
    gccJobsHub: { ...regionSeo.india.gccJobsHub },
    europeJobsHub: { ...regionSeo.india.europeJobsHub },
    ctaSupportingText: "Get feedback tailored to your India/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Indian and GCC jobs?",
      answer:
        "Yes. We build CVs for professionals based in India who are targeting roles across the GCC, formatted to read naturally to both Indian and Gulf recruiters.",
    },
    contactContext: "Reach out for CV writing, LinkedIn optimization or career guidance tailored to India-to-GCC career moves.",
    servicePages: {
      "cv-writing": {
        heading: "CV Writing for India & GCC Applicants",
        intro:
          "Targeting a role in the GCC from India means bridging two different CV conventions. We build a CV that reads naturally to GCC recruiters while showcasing your Indian experience clearly.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for India & GCC Careers",
        intro:
          "We optimize your LinkedIn profile to signal GCC-readiness - the keywords, headline framing and experience positioning that catch the attention of recruiters hiring from India into Gulf roles.",
      },
      "career-guidance": {
        heading: "Career Guidance for India-to-GCC Moves",
        intro:
          "Guidance for professionals in India planning a move into GCC roles - from choosing the right target market to preparing for GCC-style interviews.",
      },
      masterclass: {
        heading: "Career Masterclasses for India & GCC Job Seekers",
        intro:
          "Live sessions on job-search strategy, CV and LinkedIn workshops, and interview preparation for professionals preparing to apply for roles across the GCC.",
      },
    },
  },
  bahrain: {
    displayName: "Bahrain",
    shortName: "Bahrain",
    countryCode: "BH",
    currency: "BHD",
    hero: {
      eyebrow: "Professional CV Writing for Bahrain & GCC",
      headline: "Professional CV Support for Bahrain & GCC Opportunities",
      description:
        "Professional CV writing, LinkedIn support and career guidance designed to help professionals present their experience clearly for Bahrain and wider GCC opportunities.",
    },
    marketFocus: {
      title: "Bahrain & GCC Market Focus",
      description:
        "Career support for professionals targeting Bahrain's compact, internationally connected job market, plus wider GCC opportunities.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting Bahrain and GCC opportunities.",
    ...regionSeo.bahrain,
    ctaSupportingText: "Get feedback tailored to your Bahrain/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Bahrain jobs?",
      answer:
        "Yes. We tailor your CV for Bahrain's compact, internationally connected job market, including finance, professional services and other key sectors, using an ATS-friendly structure suited to Bahraini and GCC employers.",
    },
    aeoBlock: {
      question: "What should a professional CV for Bahrain jobs include?",
      answer:
        "A strong CV for Bahrain should include a clear professional summary, achievement-focused experience bullets, relevant skills for your target industry, and a clean, ATS-friendly structure. Given Bahrain's compact, internationally connected job market, tailoring your CV to the specific role and highlighting cross-border or GCC-relevant experience can help you stand out to recruiters.",
    },
    contactContext: "Reach out for CV writing support tailored to the Bahrain job market.",
    servicePages: {
      "cv-writing": {
        heading: "Professional CV Writing for Bahrain Job Seekers",
        intro:
          "Bahrain's compact, internationally connected job market rewards CVs that communicate your value quickly and clearly. We rewrite your CV with achievement-focused content and a clean, ATS-friendly structure so it reads well for both recruiters and applicant tracking systems used by employers in Bahrain and across the GCC.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for Bahrain",
        intro:
          "Recruiters in Bahrain increasingly review LinkedIn profiles alongside a CV. We optimize your headline, About section and keywords so your profile clearly reflects your experience for Bahrain and GCC opportunities.",
      },
      "career-guidance": {
        heading: "Career Guidance for the Bahrain Market",
        intro:
          "One-to-one guidance on navigating Bahrain's job market, from positioning your experience to preparing for interviews with employers across Bahrain and the wider GCC.",
      },
      masterclass: {
        heading: "Career Masterclasses for Bahrain Job Seekers",
        intro:
          "Live sessions covering job-search strategy, CV and LinkedIn workshops, and interview preparation relevant to Bahrain's hiring market.",
      },
    },
  },
  oman: {
    displayName: "Oman",
    shortName: "Oman",
    countryCode: "OM",
    currency: "OMR",
    hero: {
      eyebrow: "Professional CV Writing for Oman & GCC",
      headline: "Professional CV Support for Oman & GCC Opportunities",
      description:
        "Professional CV writing and career-profile support for professionals targeting opportunities in Oman and across the GCC.",
    },
    marketFocus: {
      title: "Oman & GCC Market Focus",
      description:
        "Career support for professionals targeting Oman's growing job market across engineering, energy and logistics, plus wider GCC opportunities.",
    },
    homeServicesIntro: "Career services tailored for professionals targeting Oman and GCC opportunities.",
    ...regionSeo.oman,
    ctaSupportingText: "Get feedback tailored to your Oman/GCC job-search goals.",
    marketFaq: {
      question: "Do you tailor CVs for Oman jobs?",
      answer:
        "Yes. We tailor your CV for Oman's job market, including engineering, energy, construction and logistics sectors, using a clear, ATS-friendly structure suited to employers in Oman and the wider GCC.",
    },
    aeoBlock: {
      question: "What should a professional CV for Oman jobs include?",
      answer:
        "A professional CV for Oman should include a focused summary, clear achievement-based experience, and skills relevant to sectors like engineering, energy, construction or logistics. A well-structured, ATS-friendly format helps your application get noticed, and highlighting any GCC-wide experience can strengthen your positioning for opportunities across Oman's growing job market.",
    },
    contactContext: "Reach out for CV writing support tailored to the Oman job market.",
    servicePages: {
      "cv-writing": {
        heading: "Professional CV Writing for Oman Job Seekers",
        intro:
          "Oman's growing job market spans engineering, energy, construction and logistics, and employers expect a CV that clearly demonstrates relevant experience and impact. We rewrite your CV with achievement-focused content and a clean, ATS-friendly structure so it stands out to recruiters and applicant tracking systems across Oman and the wider GCC.",
      },
      "linkedin-makeover": {
        heading: "LinkedIn Profile Makeover for Oman",
        intro:
          "Recruiters in Oman increasingly review LinkedIn profiles alongside a CV. We optimize your headline, About section and keywords so your profile clearly reflects your experience for Oman and GCC opportunities.",
      },
      "career-guidance": {
        heading: "Career Guidance for the Oman Market",
        intro:
          "One-to-one guidance on navigating Oman's job market, from positioning your experience to preparing for interviews with employers across Oman and the wider GCC.",
      },
      masterclass: {
        heading: "Career Masterclasses for Oman Job Seekers",
        intro:
          "Live sessions covering job-search strategy, CV and LinkedIn workshops, and interview preparation relevant to Oman's hiring market.",
      },
    },
  },
};

export function getRegionContent(code: string): RegionContentEntry {
  return regionContent[code] ?? regionContent.kuwait;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Inserts the one region-dependent FAQ (see marketFaq above) into the shared,
// otherwise-generic FAQ list rather than maintaining five separate FAQ sets.
export function getFaqsForRegion(code: string, baseFaqs: FaqItem[]): FaqItem[] {
  const content = getRegionContent(code);
  const [first, ...rest] = baseFaqs;
  return [first, content.marketFaq, ...rest];
}
