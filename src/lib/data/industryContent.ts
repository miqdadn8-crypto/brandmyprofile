// Rich, client-only content for the controlled Unit 4A industry CV landing pages
// (/{region}/cv-writing/{industry}). Mirrors the atsCv/gccCv/europassCv pattern: the two
// fields the Node static generator also needs (metaTitle/metaDescription) live in the
// plain industryPages.json so the generator and this file can never drift apart; every
// other field is client-rendering-only and lives here.
//
// The (region, slug) pairs below are the ONLY approved combinations - this is controlled
// programmatic SEO, not a generator for arbitrary industry slugs. See
// INDUSTRY_CV_WHITELIST in src/contexts/regionAvailability.ts, which every unlisted
// combination is routed through to render NotFound instead of this content.
import industryPages from "./industryPages.json";

export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface IndustryPageContent {
  region: string;
  regionName: string;
  slug: string;
  industryLabel: string; // short breadcrumb/badge label, e.g. "Oil & Gas"
  serviceName: string; // Service schema name, e.g. "Oil & Gas CV Writing"
  eyebrow: string;
  h1: string;
  heroSubtext: string;
  metaTitle: string;
  metaDescription: string;
  quickAnswer: IndustryFaq;
  prioritiesIntro: string;
  priorities: string[];
  competencyPoints: string[];
  mistakes: string[];
  atsNote: string;
  regionalNote: string;
  before: string;
  after: string;
  roles: string[];
  whatsappMessage: string;
  industryFaqs: IndustryFaq[]; // exactly 2, combined with the 5 shared FAQs at render time
  // India's engineering-GCC page gets a stronger, more prominent GCC CV CTA since that
  // visitor is explicitly targeting Gulf roles (Unit 4A, section 12) - every other page
  // still links to GCC CV, just as a lower-emphasis contextual mention.
  gccEmphasis: "standard" | "strong";
  blogLinks: { label: string; path: string }[];
}

function findMeta(region: string, slug: string) {
  const meta = (industryPages as { region: string; slug: string; metaTitle: string; metaDescription: string }[]).find(
    (p) => p.region === region && p.slug === slug,
  );
  if (!meta) throw new Error(`Missing industryPages.json entry for ${region}/${slug}`);
  return meta;
}

export const industryContent: IndustryPageContent[] = [
  {
    region: "kuwait",
    regionName: "Kuwait",
    slug: "oil-gas",
    industryLabel: "Oil & Gas",
    serviceName: "Oil & Gas CV Writing",
    eyebrow: "Oil & Gas Career CV Support",
    h1: "CV Writing for Oil & Gas Jobs in Kuwait",
    heroSubtext:
      "Present your technical experience, projects, responsibilities and achievements clearly for oil & gas opportunities in Kuwait and the wider GCC market.",
    ...findMeta("kuwait", "oil-gas"),
    quickAnswer: {
      question: "What should an oil & gas CV for Kuwait jobs include?",
      answer:
        "A strong oil & gas CV for Kuwait typically presents your role specialization, project or plant exposure, technical skills and systems you've worked with, safety and compliance responsibilities, and measurable results from your projects. Relevant certifications and your current availability or location can also help, though the exact mix depends on your specific role and experience level.",
    },
    prioritiesIntro:
      "Kuwait's oil & gas sector spans upstream exploration, downstream processing, engineering contractors and maintenance service providers, each reviewing CVs with a slightly different lens depending on the role.",
    priorities: [
      "Clarify whether your background is upstream, downstream, or project/engineering-services focused",
      "Highlight maintenance, shutdown or turnaround exposure where relevant to your role",
      "Note operations experience if your role involved running or monitoring plant systems",
      "List relevant HSE (health, safety, environment) responsibilities and certifications",
      "Name the specific equipment, systems or platforms you've worked with",
      "Describe the scale and environment of the projects you've supported",
    ],
    competencyPoints: [
      "Technical certifications relevant to your discipline, where genuinely held",
      "Specific equipment, systems or software used in your role",
      "Safety and compliance standards you've worked within",
      "Project types and scale you've been involved with",
    ],
    mistakes: [
      "Listing job duties without describing the scale or outcome of the work",
      "Omitting HSE certifications that are directly relevant to the role",
      "Using overly technical jargon without context for a recruiter unfamiliar with a specific process",
      "Failing to clarify whether experience is upstream, downstream, or engineering-services based",
    ],
    atsNote:
      "Many larger oil & gas employers and contractors in Kuwait screen applications through recruitment platforms or applicant tracking systems, so a clear, single-column CV structure with standard headings and role-specific keywords helps ensure your experience is read correctly before a recruiter reviews it.",
    regionalNote:
      "Kuwait's oil & gas employers range from national and semi-government operators to international contractors, so tailoring your CV's terminology and emphasis to the specific type of employer you're targeting can make a meaningful difference.",
    before: "Responsible for maintenance activities and reporting on plant equipment.",
    after:
      "Led maintenance activities across plant equipment during scheduled and shutdown periods, coordinating with cross-functional teams and reporting on equipment condition to support operational reliability.",
    roles: ["Process Engineer", "Maintenance Engineer", "HSE Officer", "Operations Supervisor", "Project Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my CV for oil & gas jobs in Kuwait.",
    industryFaqs: [
      {
        question: "How should I present shutdown or maintenance experience?",
        answer:
          "Describe the scope of the shutdown or maintenance work, your specific role within it, the systems or equipment involved, and any measurable outcomes such as schedule adherence or safety performance, rather than just listing \"maintenance\" as a duty.",
      },
      {
        question: "Should I list HSE certifications on my oil & gas CV?",
        answer:
          "Yes, where genuinely held and relevant to the role - HSE certifications are often relevant to oil & gas hiring and are worth listing clearly alongside your technical qualifications.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [
      { label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" },
      { label: "Oil & Gas CV Guide for GCC Jobs", path: "/blog/oil-gas-cv-gcc-guide" },
    ],
  },
  {
    region: "kuwait",
    regionName: "Kuwait",
    slug: "engineering",
    industryLabel: "Engineering",
    serviceName: "Engineering CV Writing",
    eyebrow: "Engineering Career CV Support",
    h1: "Engineering CV Writing for Kuwait Jobs",
    heroSubtext:
      "Present your engineering discipline, project scope and technical execution clearly for employers hiring across Kuwait and the wider GCC market.",
    ...findMeta("kuwait", "engineering"),
    quickAnswer: {
      question: "What should an engineering CV for Kuwait jobs include?",
      answer:
        "A strong engineering CV for Kuwait usually clarifies your specific discipline (mechanical, civil, electrical or otherwise), the scope and scale of projects you've worked on, the technical tools or design software you use, and measurable outcomes from your work. Relevant certifications and coordination or stakeholder experience can also strengthen your application, depending on your seniority level.",
    },
    prioritiesIntro:
      "Kuwait's engineering hiring spans oil & gas, construction, utilities and industrial sectors, so clarity about your specific discipline and project context matters more than a generic \"engineer\" label.",
    priorities: [
      "State your specific engineering discipline clearly (mechanical, civil, electrical, etc.)",
      "Describe the scope and scale of projects you've contributed to",
      "List technical tools, design or calculation software you use",
      "Highlight execution, commissioning or maintenance experience where relevant",
      "Note stakeholder or cross-team coordination responsibilities",
      "Reference quality or safety standards you've worked within",
    ],
    competencyPoints: [
      "Discipline-specific technical tools (e.g. AutoCAD, ETABS, or equivalent where genuinely used)",
      "Project types and scale relevant to your target role",
      "Codes, standards or regulations you design or work within",
      "Coordination experience across contractors, clients or internal teams",
    ],
    mistakes: [
      "Using a generic \"engineer\" title without specifying your actual discipline",
      "Listing responsibilities without describing project scale or outcomes",
      "Omitting the specific tools or software genuinely used day-to-day",
      "Not distinguishing between design, execution and maintenance experience",
    ],
    atsNote:
      "Larger engineering employers and contractors in Kuwait often use recruitment platforms that screen CVs automatically, so keeping your structure clean and your discipline and tools clearly stated helps your CV surface correctly in keyword searches.",
    regionalNote:
      "Engineering hiring in Kuwait spans national companies, semi-government entities and international contractors - adjusting your CV's emphasis for the specific employer type you're targeting tends to read more naturally to the recruiter reviewing it.",
    before: "Responsible for project coordination and site activities.",
    after:
      "Coordinated site activities, technical follow-ups and progress reporting across assigned project scopes while supporting quality, safety and schedule requirements.",
    roles: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Project Engineer", "Maintenance Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my engineering CV for Kuwait jobs.",
    industryFaqs: [
      {
        question: "How should engineers present project experience?",
        answer:
          "Describe your specific role on each project, its scale or budget where relevant, the technical work you were responsible for, and the outcome - rather than only naming the project or client.",
      },
      {
        question: "Should I include every project I've worked on?",
        answer:
          "Focus on your most relevant and substantial projects rather than listing every assignment - depth and relevance tend to read better than an exhaustive list.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [
      { label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" },
      { label: "ATS CV Guide", path: "/blog/ats-cv-guide-kuwait" },
      { label: "Engineering CV Guide for Kuwait", path: "/blog/engineering-cv-kuwait-guide" },
    ],
  },
  {
    region: "uae",
    regionName: "UAE",
    slug: "finance",
    industryLabel: "Finance",
    serviceName: "Finance CV Writing",
    eyebrow: "Finance Career CV Support",
    h1: "Finance CV Writing for UAE Job Applications",
    heroSubtext:
      "Present your reporting, analysis and financial systems experience clearly for finance and accounting roles across the UAE's multinational hiring market.",
    ...findMeta("uae", "finance"),
    quickAnswer: {
      question: "What should a finance CV for UAE jobs include?",
      answer:
        "A strong finance CV for UAE roles typically presents your area of specialization (reporting, budgeting, audit, or financial analysis), the ERP or accounting systems you've used, relevant compliance or controls experience, and measurable outcomes such as process improvements or reporting accuracy. Professional qualifications and stakeholder-reporting experience can also strengthen your application.",
    },
    prioritiesIntro:
      "The UAE's finance sector spans multinational corporates, banks and free-zone companies, each with slightly different expectations for how financial experience should be presented.",
    priorities: [
      "Clarify your specialization: reporting, budgeting, forecasting, audit or financial analysis",
      "Name the ERP or accounting systems you've used (e.g. SAP, Oracle, or equivalent)",
      "Highlight compliance, controls or audit experience where relevant",
      "Describe stakeholder reporting responsibilities and to whom you reported",
      "Note any process improvements or efficiency gains you contributed to",
      "Include relevant professional qualifications clearly",
    ],
    competencyPoints: [
      "ERP/accounting systems experience (e.g. SAP, Oracle, QuickBooks)",
      "Reporting, budgeting or forecasting responsibilities",
      "Audit, compliance or internal-controls experience",
      "Professional qualifications relevant to finance/accounting",
    ],
    mistakes: [
      "Listing generic finance duties without naming systems or tools used",
      "Not clarifying your specific area of specialization within finance",
      "Omitting measurable outcomes from reporting or process improvements",
      "Leaving out relevant professional qualifications",
    ],
    atsNote:
      "Many multinational finance employers in the UAE screen applications through applicant tracking systems, so clearly naming your systems experience, qualifications and specialization in a simple, well-structured CV helps it get matched to the right roles.",
    regionalNote:
      "The UAE's finance hiring market is highly international, with multinational corporates, banks and free-zone companies all recruiting from a broad talent pool - presenting your experience in internationally recognizable financial terms tends to help it read clearly to a diverse set of employers.",
    before: "Responsible for preparing monthly financial reports.",
    after:
      "Prepared monthly financial reports for senior stakeholders, reconciling data across ERP systems and identifying variances to support timely, accurate decision-making.",
    roles: ["Financial Analyst", "Accountant", "Finance Manager", "Internal Auditor", "Financial Controller"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my finance CV for UAE job applications.",
    industryFaqs: [
      {
        question: "How should I show ERP and financial systems experience?",
        answer:
          "Name the specific systems you've used (such as SAP, Oracle or equivalent), describe what you used them for, and mention any reporting or process improvements that resulted from that experience.",
      },
      {
        question: "Should I include every finance tool I've used?",
        answer:
          "Focus on the systems and tools most relevant to your target role, rather than listing every piece of software you've ever touched.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "uae",
    regionName: "UAE",
    slug: "technology",
    industryLabel: "Technology",
    serviceName: "Technology CV Writing",
    eyebrow: "Technology Career CV Support",
    h1: "Technology CV Writing for UAE Jobs",
    heroSubtext:
      "Present your technology stack, project delivery and measurable impact clearly for IT and technology roles across the UAE's competitive hiring market.",
    ...findMeta("uae", "technology"),
    quickAnswer: {
      question: "What should a technology CV for UAE jobs include?",
      answer:
        "A strong technology CV for UAE roles typically presents your core technology stack, the systems or products you've delivered, your role within cross-functional teams, and measurable outcomes such as performance or reliability improvements. Cloud, DevOps or security experience is worth including where genuinely relevant to your background.",
    },
    prioritiesIntro:
      "The UAE's technology hiring market includes multinational tech companies, financial-services technology teams and fast-growing startups, each looking for slightly different signals in a CV.",
    priorities: [
      "Lead with your core technology stack and areas of specialization",
      "Describe the systems, products or platforms you've delivered or maintained",
      "Clarify your role within the development or delivery lifecycle",
      "Include cloud, DevOps or security experience where genuinely relevant",
      "Highlight measurable outcomes such as performance, reliability or scale improvements",
      "Note collaboration with cross-functional or distributed teams",
    ],
    competencyPoints: [
      "Core programming languages, frameworks or platforms",
      "Cloud, DevOps or infrastructure experience where relevant",
      "Systems or products delivered, with your specific role clarified",
      "Collaboration and delivery-methodology experience (e.g. Agile)",
    ],
    mistakes: [
      "Listing every technology ever used instead of your genuine areas of strength",
      "Describing tasks without the outcome or impact of the work",
      "Not clarifying your specific role within a team or project",
      "Omitting measurable results like performance or scale improvements",
    ],
    atsNote:
      "Technology employers in the UAE frequently use applicant tracking systems and keyword-based searches to shortlist candidates, so clearly naming your core stack and tools in a clean, well-structured CV helps ensure it surfaces in relevant searches.",
    regionalNote:
      "The UAE's technology sector draws talent from across the world, with many multinational and regional tech employers hiring through competitive, keyword-driven recruitment processes - being specific and current about your technical skills tends to matter more here than general descriptions.",
    before: "Worked on backend development for company applications.",
    after:
      "Built and maintained backend services for customer-facing applications, improving API response times and collaborating with cross-functional teams to support product delivery.",
    roles: ["Software Engineer", "DevOps Engineer", "Data Engineer", "Technical Product Manager", "QA/Test Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my technology/IT CV for UAE jobs.",
    industryFaqs: [
      {
        question: "Should I list every technology I have used?",
        answer:
          "No - focus on the technologies most relevant to your target role and where you have genuine depth, rather than listing every tool you've briefly touched.",
      },
      {
        question: "How do I show impact in a technology CV?",
        answer:
          "Describe specific outcomes such as performance improvements, reliability gains, or successful delivery of a system or feature, rather than only listing responsibilities.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "ATS CV Guide", path: "/blog/ats-cv-guide-kuwait" }],
  },
  {
    region: "saudi",
    regionName: "Saudi Arabia",
    slug: "engineering",
    industryLabel: "Engineering",
    serviceName: "Engineering CV Writing",
    eyebrow: "Engineering Career CV Support",
    h1: "Engineering CV Writing for Saudi Arabia Jobs",
    heroSubtext:
      "Present your engineering discipline, project scope and technical execution clearly for employers hiring across Saudi Arabia's growing project sectors.",
    ...findMeta("saudi", "engineering"),
    quickAnswer: {
      question: "What should an engineering CV for Saudi Arabia jobs include?",
      answer:
        "A strong engineering CV for Saudi Arabia typically clarifies your specific discipline, the scope and scale of projects you've contributed to, technical tools or design software you use, and measurable outcomes from your work. Relevant certifications and experience coordinating with contractors or stakeholders can also strengthen your application, depending on your role.",
    },
    prioritiesIntro:
      "Saudi Arabia's engineering hiring spans large-scale infrastructure, industrial and construction-linked projects, so being specific about your discipline and the scale of work you've handled matters.",
    priorities: [
      "State your specific engineering discipline clearly",
      "Describe the scope and scale of projects you've contributed to, including any large-scale project exposure",
      "List technical tools, design or calculation software you use",
      "Highlight execution, commissioning or maintenance experience where relevant",
      "Note coordination experience across contractors, consultants or clients",
      "Reference relevant codes, standards or safety requirements",
    ],
    competencyPoints: [
      "Discipline-specific technical tools and design software",
      "Project types and scale relevant to your target role",
      "Codes, standards or regulations you design or work within",
      "Contractor/consultant/client coordination experience",
    ],
    mistakes: [
      "Using a generic \"engineer\" title without specifying your actual discipline",
      "Listing responsibilities without describing project scale or outcomes",
      "Omitting large-scale or complex project exposure that's genuinely relevant",
      "Not distinguishing between design, execution and maintenance experience",
    ],
    atsNote:
      "Larger engineering employers and contractors in Saudi Arabia often screen applications through recruitment systems, so a clean CV structure with your discipline, tools and project scale clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Saudi Arabia's engineering sector includes large-scale national projects, industrial employers and international contractors - positioning your CV around the specific project types and scale relevant to your target employer tends to produce a stronger application, without relying on generic references to national growth programmes.",
    before: "Responsible for project coordination and site activities.",
    after:
      "Coordinated site activities, technical follow-ups and progress reporting across assigned project scopes while supporting quality, safety and schedule requirements.",
    roles: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Project Engineer", "Site Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my engineering CV for Saudi Arabia jobs.",
    industryFaqs: [
      {
        question: "How should I present large-scale project experience?",
        answer:
          "Describe the project's scale, your specific role and responsibilities, the technical work involved, and any measurable outcomes - rather than only naming the project.",
      },
      {
        question: "Should I mention Vision 2030 or specific national programmes?",
        answer:
          "Only if genuinely and specifically relevant to your actual project experience - we don't add generic references to national programmes without a real, sourced connection to your background.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "saudi",
    regionName: "Saudi Arabia",
    slug: "construction",
    industryLabel: "Construction",
    serviceName: "Construction CV Writing",
    eyebrow: "Construction Career CV Support",
    h1: "Construction CV Writing for Saudi Arabia Jobs",
    heroSubtext:
      "Present your project type, site execution and coordination experience clearly for construction roles across Saudi Arabia's active project market.",
    ...findMeta("saudi", "construction"),
    quickAnswer: {
      question: "What should a construction CV for Saudi Arabia jobs include?",
      answer:
        "A strong construction CV for Saudi Arabia typically presents the project type and size you've worked on, your site execution or planning responsibilities, coordination with subcontractors or consultants, and safety and quality practices you've followed. Measurable progress or handover outcomes can also strengthen your application, depending on your role.",
    },
    prioritiesIntro:
      "Saudi Arabia's construction sector spans residential, commercial, infrastructure and industrial projects, so clarifying the project type and your specific role within it helps your CV read clearly.",
    priorities: [
      "Clarify the project type and approximate scale you've worked on",
      "Describe your site execution or planning responsibilities",
      "Highlight subcontractor or consultant coordination experience",
      "Note quantity or progress monitoring responsibilities where relevant",
      "Reference safety and quality practices you've followed",
      "Mention project documentation or handover experience",
    ],
    competencyPoints: [
      "Project types and approximate scale relevant to your target role",
      "Site execution, planning or supervision responsibilities",
      "Safety and quality standards you've worked within",
      "Subcontractor/consultant coordination experience",
    ],
    mistakes: [
      "Not specifying the type or scale of projects you've worked on",
      "Listing site duties without describing outcomes or progress achieved",
      "Omitting safety or quality practices genuinely followed",
      "Leaving out coordination or stakeholder-management experience",
    ],
    atsNote:
      "Larger construction employers and contractors in Saudi Arabia may screen applications through recruitment platforms, so a clear CV structure with your project type, role and responsibilities clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Saudi Arabia's construction market includes large national developers, international contractors and specialized subcontractors - tailoring your CV's emphasis to the type of employer and project scale you're targeting tends to produce a stronger application.",
    before: "Worked on many construction projects and handled site work.",
    after:
      "Supported site execution across construction projects, coordinating daily activities, subcontractor follow-ups, progress reporting and site documentation in line with project requirements.",
    roles: ["Project Engineer", "Site Engineer", "Construction Manager", "Planning Engineer", "Quantity Surveyor"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my construction CV for Saudi Arabia jobs.",
    industryFaqs: [
      {
        question: "How should I present project and site experience?",
        answer:
          "Describe the project type and scale, your specific responsibilities on site, and measurable outcomes such as progress milestones or successful handovers, rather than a general description of \"site work.\"",
      },
      {
        question: "Should I include subcontractor coordination experience?",
        answer:
          "Yes, where genuinely part of your role - coordination experience is often relevant to how construction employers assess a candidate's readiness for site-management responsibility.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "qatar",
    regionName: "Qatar",
    slug: "energy",
    industryLabel: "Energy",
    serviceName: "Energy CV Writing",
    eyebrow: "Energy Career CV Support",
    h1: "Energy CV Writing for Qatar Jobs",
    heroSubtext:
      "Present your technical, operations and project experience clearly for energy-sector roles across Qatar's competitive hiring market.",
    ...findMeta("qatar", "energy"),
    quickAnswer: {
      question: "What should an energy-sector CV for Qatar jobs include?",
      answer:
        "A strong energy-sector CV for Qatar typically presents your specific domain (engineering, operations or maintenance), the technical systems you've worked with, safety and performance responsibilities, and measurable outcomes from your projects. Relevant certifications and project-lifecycle experience can also strengthen your application, depending on your role.",
    },
    prioritiesIntro:
      "Qatar's energy sector spans engineering, operations, maintenance and project-delivery roles across a competitive, internationally connected job market.",
    priorities: [
      "Clarify your specific domain: engineering, operations, or maintenance",
      "Name the technical systems or equipment you've worked with",
      "Highlight asset or project-lifecycle experience where relevant",
      "Note safety and performance responsibilities you've held",
      "Describe project delivery experience and your specific role in it",
      "Reference relevant technical certifications",
    ],
    competencyPoints: [
      "Technical systems, equipment or platforms relevant to your domain",
      "Safety and performance standards you've worked within",
      "Project or asset-lifecycle experience",
      "Relevant technical certifications",
    ],
    mistakes: [
      "Not clarifying whether your background is engineering, operations or maintenance-focused",
      "Listing responsibilities without measurable outcomes",
      "Omitting relevant technical certifications",
      "Using generic \"energy sector\" language without specifying your actual systems or domain",
    ],
    atsNote:
      "Many larger energy employers and contractors in Qatar use recruitment platforms that screen applications automatically, so a clear, well-structured CV with your domain, systems and certifications clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Qatar's energy sector hires from a competitive, internationally connected talent pool - presenting your experience with clear, internationally recognizable terminology tends to help your CV read well to both local and international employers.",
    before: "Responsible for handling technical systems and reporting issues.",
    after:
      "Monitored and maintained technical systems across assigned operations, identifying and reporting issues promptly to support consistent performance and safety compliance.",
    roles: ["Process Engineer", "Maintenance Engineer", "Operations Engineer", "HSE Officer", "Project Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my CV for energy-sector roles in Qatar.",
    industryFaqs: [
      {
        question: "How should I show energy-sector technical experience?",
        answer:
          "Name the specific systems or equipment you've worked with, describe your role in maintaining or operating them, and include any measurable performance or safety outcomes.",
      },
      {
        question: "Should I include every certification I hold?",
        answer:
          "Include certifications that are genuinely relevant to your target role rather than every certification you've ever completed, so the most important ones stand out clearly.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "india",
    regionName: "India",
    slug: "engineering-gcc",
    industryLabel: "Engineering for GCC",
    serviceName: "Engineering CV Writing for GCC Applications",
    eyebrow: "Engineering CV Support for GCC Applications",
    h1: "Engineering CV for GCC Jobs from India",
    heroSubtext:
      "Position your engineering experience clearly for Gulf employers, whether you're targeting Kuwait, UAE, Saudi Arabia, Qatar or other GCC markets.",
    ...findMeta("india", "engineering-gcc"),
    quickAnswer: {
      question: "What should an engineering CV for GCC jobs from India include?",
      answer:
        "A strong engineering CV for GCC applications from India typically presents your discipline and project scope in internationally readable terms, technical tools or software used, measurable project outcomes, and your relocation readiness or target market. Certifications and any prior international or cross-border project exposure can also strengthen your application.",
    },
    prioritiesIntro:
      "Engineers applying from India to GCC markets benefit from presenting their experience in terms that read clearly to Gulf employers, while still showcasing the depth of Indian project experience.",
    priorities: [
      "State your specific engineering discipline clearly in internationally recognizable terms",
      "Describe the scope and scale of projects you've contributed to",
      "List technical tools, design or calculation software you use",
      "Highlight any prior international, multinational or cross-border project exposure",
      "State your target GCC market, relocation readiness and notice period",
      "Reference relevant certifications recognized internationally",
    ],
    competencyPoints: [
      "Discipline-specific technical tools and design software",
      "Project types and scale, described in internationally readable terms",
      "Certifications with international recognition where applicable",
      "Relocation readiness, notice period and target market clarity",
    ],
    mistakes: [
      "Using India-specific job titles or terms that don't translate clearly for GCC recruiters",
      "Not stating a clear target country or relocation readiness",
      "Listing responsibilities without measurable project outcomes",
      "Omitting internationally recognized certifications you do hold",
    ],
    atsNote:
      "Many GCC employers, particularly multinationals, screen applications through recruitment platforms, so presenting your discipline, tools and project scope with clear, standard terminology helps your CV get matched to the right roles.",
    regionalNote:
      "Since you're applying from India into GCC markets, clearly stating your target country, availability and relocation readiness - alongside internationally readable job titles - helps your CV read naturally to Gulf recruiters, whichever specific market you're targeting.",
    before: "Worked on various engineering projects handling design and execution.",
    after:
      "Delivered engineering design and execution support across multiple projects, coordinating with cross-functional teams and contributing to on-time delivery within technical specifications.",
    roles: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Project Engineer", "Design Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I'm applying from India for GCC engineering jobs and need help with my CV.",
    industryFaqs: [
      {
        question: "How should Indian engineers position experience for GCC applications?",
        answer:
          "Present your discipline and project experience using internationally readable terms, clarify your target GCC market and relocation readiness, and highlight any international or multinational project exposure you have.",
      },
      {
        question: "Which GCC country should I target first?",
        answer:
          "This depends on your discipline, experience level and personal preferences - our GCC CV Format guide covers how Kuwait, UAE, Saudi Arabia and Qatar differ, which can help you decide where to focus your applications.",
      },
    ],
    gccEmphasis: "strong",
    blogLinks: [{ label: "India to GCC Jobs Guide", path: "/blog/india-to-gcc-jobs-guide" }],
  },
  // ---- Unit 4B: second-wave industry pages ----
  {
    region: "kuwait",
    regionName: "Kuwait",
    slug: "construction",
    industryLabel: "Construction",
    serviceName: "Construction CV Writing",
    eyebrow: "Construction Career CV Support",
    h1: "CV Writing for Construction Jobs in Kuwait",
    heroSubtext:
      "Present your project execution, site coordination and technical documentation experience clearly for construction roles across Kuwait and the wider GCC market.",
    ...findMeta("kuwait", "construction"),
    quickAnswer: {
      question: "What should a construction CV for Kuwait jobs include?",
      answer:
        "A strong construction CV for Kuwait typically presents the project type and scale you've worked on, your site coordination or planning responsibilities, subcontractor management experience, and quality and safety practices you've followed. Technical documentation and progress-tracking experience can also strengthen your application, depending on your role.",
    },
    prioritiesIntro:
      "Kuwait's construction sector spans residential, commercial and infrastructure projects, so clarifying the project type and your specific role within it helps your CV read clearly.",
    priorities: [
      "Clarify the project type and approximate scale you've worked on",
      "Describe your site coordination or planning responsibilities",
      "Highlight subcontractor management experience where relevant",
      "Note technical documentation or drawing-review responsibilities",
      "Reference quality and safety practices you've followed",
      "Mention progress or quantity-tracking and handover experience",
    ],
    competencyPoints: [
      "Project types and approximate scale relevant to your target role",
      "Site coordination, planning or supervision responsibilities",
      "Quality and safety standards you've worked within",
      "Subcontractor coordination and technical documentation experience",
    ],
    mistakes: [
      "Not specifying the type or scale of projects you've worked on",
      "Listing site duties without describing outcomes or progress achieved",
      "Omitting safety or quality practices genuinely followed",
      "Leaving out subcontractor coordination or documentation experience",
    ],
    atsNote:
      "Larger construction employers and contractors in Kuwait may screen applications through recruitment platforms, so a clear CV structure with your project type, role and responsibilities clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Kuwait's construction market includes national developers, semi-government entities and international contractors - tailoring your CV's emphasis to the type of employer and project scale you're targeting tends to produce a stronger application.",
    before: "Worked on construction sites handling coordination tasks.",
    after:
      "Coordinated daily site activities across assigned construction projects, liaising with subcontractors, tracking progress against schedule, and maintaining technical documentation in line with project requirements.",
    roles: ["Project Engineer", "Site Engineer", "Construction Manager", "Planning Engineer", "QA/QC Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my CV for construction jobs in Kuwait.",
    industryFaqs: [
      {
        question: "How should I present subcontractor coordination experience?",
        answer:
          "Describe the scope of subcontractor coordination you handled, the type of work involved, and any measurable outcomes such as schedule adherence, rather than simply stating \"coordinated subcontractors.\"",
      },
      {
        question: "Should I include quantity or progress-tracking experience?",
        answer:
          "Yes, where genuinely part of your role - documenting how you tracked progress or quantities helps demonstrate the practical, day-to-day responsibility recruiters look for in construction roles.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "kuwait",
    regionName: "Kuwait",
    slug: "finance",
    industryLabel: "Finance",
    serviceName: "Finance CV Writing",
    eyebrow: "Finance Career CV Support",
    h1: "Finance CV Writing for Kuwait Jobs",
    heroSubtext:
      "Present your reporting, budgeting and financial systems experience clearly for finance and accounting roles across Kuwait's private and semi-government sectors.",
    ...findMeta("kuwait", "finance"),
    quickAnswer: {
      question: "What should a finance CV for Kuwait jobs highlight?",
      answer:
        "A strong finance CV for Kuwait typically highlights your area of specialization (budgeting, forecasting, reporting, or audit), the ERP or accounting systems you've used, internal-controls or compliance experience, and measurable outcomes such as improved reporting accuracy. Relevant professional qualifications can also strengthen your application.",
    },
    prioritiesIntro:
      "Kuwait's finance hiring spans private companies, semi-government entities and multinational branches, each expecting a slightly different presentation of financial experience.",
    priorities: [
      "Clarify your specialization: budgeting, forecasting, reporting or audit",
      "Name the ERP or accounting systems you've used",
      "Highlight internal-controls or compliance experience where relevant",
      "Describe reconciliation or management-reporting responsibilities",
      "Note stakeholder communication and to whom you reported",
      "Include relevant professional qualifications clearly",
    ],
    competencyPoints: [
      "ERP/accounting systems experience",
      "Budgeting, forecasting or reporting responsibilities",
      "Audit, compliance or internal-controls experience",
      "Professional qualifications relevant to finance or accounting",
    ],
    mistakes: [
      "Listing generic finance duties without naming systems or tools used",
      "Not clarifying your specific area of specialization within finance",
      "Omitting measurable outcomes from reporting or reconciliation work",
      "Leaving out relevant professional qualifications",
    ],
    atsNote:
      "Larger finance employers in Kuwait may screen applications through recruitment platforms, so clearly naming your systems experience, qualifications and specialization in a simple, well-structured CV helps it get matched to the right roles.",
    regionalNote:
      "Kuwait's finance sector includes private-sector companies, semi-government entities and multinational branches - adjusting your CV's terminology and emphasis for the type of employer you're targeting tends to produce a stronger application.",
    before: "Responsible for preparing financial reports and reconciliations.",
    after:
      "Prepared monthly financial reports and reconciliations across ERP systems, identifying variances and supporting management with timely, accurate financial information.",
    roles: ["Accountant", "Financial Analyst", "Finance Manager", "Auditor", "Cost Controller"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my finance CV for Kuwait job applications.",
    industryFaqs: [
      {
        question: "How should I show ERP/accounting software experience?",
        answer:
          "Name the specific systems you've used, describe what you used them for, and mention any reporting or reconciliation improvements that resulted from that experience.",
      },
      {
        question: "Should finance professionals list audit and compliance responsibilities?",
        answer:
          "Yes, where genuinely part of your role - audit and compliance experience is often relevant to how finance employers assess a candidate's reliability and attention to detail.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "uae",
    regionName: "UAE",
    slug: "construction",
    industryLabel: "Construction",
    serviceName: "Construction CV Writing",
    eyebrow: "Construction Career CV Support",
    h1: "Construction CV Writing for UAE Jobs",
    heroSubtext:
      "Present your project execution, contractor coordination and quality/safety experience clearly for construction roles across the UAE's multi-project market.",
    ...findMeta("uae", "construction"),
    quickAnswer: {
      question: "What should a construction CV for UAE jobs include?",
      answer:
        "A strong construction CV for UAE roles typically presents the project type and scale you've worked on, your coordination experience across contractors and consultants, QA/QC and safety responsibilities, and project documentation or handover experience. Working within multinational project teams is worth mentioning where genuinely relevant.",
    },
    prioritiesIntro:
      "The UAE's construction sector often involves multi-project environments and multinational project teams, so clarity about coordination scope and your specific role helps your CV read well.",
    priorities: [
      "Clarify the project type and scale, including any multi-project exposure",
      "Describe contractor and consultant coordination responsibilities",
      "Highlight experience working within multinational project teams",
      "Note QA/QC and safety responsibilities you've held",
      "Reference project documentation and handover experience",
      "Describe progress-reporting responsibilities and to whom you reported",
    ],
    competencyPoints: [
      "Project types and scale, including multi-project coordination",
      "QA/QC and safety standards you've worked within",
      "Contractor and consultant coordination experience",
      "Project documentation and handover experience",
    ],
    mistakes: [
      "Not specifying the scale or number of concurrent projects you've handled",
      "Listing site duties without describing coordination or outcomes",
      "Omitting QA/QC or safety practices genuinely followed",
      "Claiming knowledge of specific employer requirements without support",
    ],
    atsNote:
      "Larger construction employers and contractors in the UAE may screen applications through recruitment platforms, so a clear CV structure with your project type, role and responsibilities clearly stated helps ensure it's read correctly.",
    regionalNote:
      "The UAE's construction market includes large developers, international contractors and multinational project teams - presenting your coordination and QA/QC experience clearly tends to read well across this varied employer base.",
    before: "Worked on multiple construction projects handling coordination.",
    after:
      "Coordinated activities across multiple concurrent construction projects, liaising with contractors and consultants, tracking QA/QC compliance, and supporting timely handover documentation.",
    roles: ["Project Engineer", "Site Engineer", "Construction Manager", "QA/QC Engineer", "Planning Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my construction CV for UAE jobs.",
    industryFaqs: [
      {
        question: "How should I present multi-project coordination experience?",
        answer:
          "Describe how many projects you coordinated concurrently, your specific responsibilities across them, and how you managed competing priorities - rather than simply listing project names.",
      },
      {
        question: "Should I mention QA/QC responsibilities separately from site duties?",
        answer:
          "Yes, where genuinely part of your role - QA/QC is often assessed distinctly from general site coordination, so calling it out clearly helps recruiters see the full scope of your responsibilities.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "uae",
    regionName: "UAE",
    slug: "hospitality",
    industryLabel: "Hospitality",
    serviceName: "Hospitality CV Writing",
    eyebrow: "Hospitality Career CV Support",
    h1: "Hospitality CV Writing for UAE Jobs",
    heroSubtext:
      "Present your guest service, operations and team leadership experience clearly for hospitality roles across the UAE's diverse hotel and F&B market.",
    ...findMeta("uae", "hospitality"),
    quickAnswer: {
      question: "What should a hospitality CV for UAE jobs include?",
      answer:
        "A strong hospitality CV for UAE roles typically presents your area of specialization (front office, F&B, or operations), guest-service responsibilities and outcomes, team leadership experience, and any property or restaurant systems you've used. Language skills and experience working in multicultural teams are worth including where genuinely relevant.",
    },
    prioritiesIntro:
      "The UAE's hospitality sector spans hotels, restaurants and guest-service operations with highly multicultural teams and guest bases, so clarity about your specific role and environment matters.",
    priorities: [
      "Clarify your specialization: front office, F&B, guest relations or operations",
      "Describe guest-service responsibilities and how you resolved guest needs",
      "Highlight team leadership or supervision experience",
      "Name property or restaurant systems you've used (e.g. PMS, POS)",
      "Mention language skills relevant to a multicultural guest base",
      "Note operational or revenue-support responsibilities where relevant",
    ],
    competencyPoints: [
      "Property or restaurant systems experience (e.g. PMS, POS)",
      "Guest-service and guest-relations responsibilities",
      "Team leadership or supervisory experience",
      "Language skills relevant to a multicultural environment",
    ],
    mistakes: [
      "Using vague \"customer service\" language instead of specific guest-service responsibilities",
      "Omitting property or restaurant systems experience genuinely used",
      "Not clarifying your specific department or specialization",
      "Making generic \"luxury hospitality\" claims without role-specific detail",
    ],
    atsNote:
      "Larger hotel groups and hospitality employers in the UAE may screen applications through recruitment platforms, so clearly naming your specialization, systems experience and languages in a simple, well-structured CV helps it get matched to the right roles.",
    regionalNote:
      "The UAE's hospitality sector serves a highly international guest base across hotels, restaurants and leisure operators - presenting your language skills and experience working in multicultural teams clearly tends to help your CV stand out.",
    before: "Responsible for handling guests and daily hotel operations.",
    after:
      "Managed daily guest interactions and front-desk operations, resolving service issues promptly and coordinating with housekeeping and F&B teams to maintain consistent guest experience standards.",
    roles: ["Front Office Manager", "Restaurant Manager", "F&B Supervisor", "Guest Relations Executive", "Hotel Operations Manager"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my hospitality CV for UAE job applications.",
    industryFaqs: [
      {
        question: "How should I present guest-service achievements?",
        answer:
          "Describe specific situations where you resolved guest issues or improved guest experience, rather than only stating that you provided \"good customer service.\"",
      },
      {
        question: "Should hospitality CVs list hotel/property systems?",
        answer:
          "Yes, where genuinely used - naming systems like a property management system (PMS) or point-of-sale (POS) platform helps demonstrate practical operational readiness.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "saudi",
    regionName: "Saudi Arabia",
    slug: "healthcare",
    industryLabel: "Healthcare",
    serviceName: "Healthcare CV Writing",
    eyebrow: "Healthcare Career CV Support",
    h1: "Healthcare CV Writing for Saudi Arabia Jobs",
    heroSubtext:
      "Present your clinical or professional healthcare experience clearly for roles across Saudi Arabia's growing healthcare sector.",
    ...findMeta("saudi", "healthcare"),
    quickAnswer: {
      question: "How should healthcare professionals structure a CV for Saudi applications?",
      answer:
        "A strong healthcare CV for Saudi Arabia typically clarifies your specific clinical or professional role, relevant qualifications and licenses you hold, patient-care or procedural responsibilities, and documentation or compliance practices you've followed. We don't provide licensing or legal advice - always confirm specific registration requirements with the relevant licensing authority.",
    },
    prioritiesIntro:
      "Saudi Arabia's healthcare sector includes hospitals, clinics and healthcare administration roles, so clarity about your specific clinical or professional role helps your CV read accurately.",
    priorities: [
      "Clarify your specific clinical or professional role and specialization",
      "List relevant qualifications and licenses/certifications you hold",
      "Describe patient-care or procedural responsibilities where applicable",
      "Reference documentation and compliance practices you've followed",
      "Note team or department coordination experience",
      "Highlight relevant systems (e.g. electronic health records) you've used",
    ],
    competencyPoints: [
      "Relevant qualifications, licenses and certifications",
      "Clinical or procedural responsibilities specific to your role",
      "Documentation, compliance and reporting practices",
      "Healthcare systems (e.g. EHR/EMR) experience where relevant",
    ],
    mistakes: [
      "Not clearly stating your specific clinical or professional role",
      "Omitting relevant qualifications or licenses genuinely held",
      "Describing patient care generically without procedural or role-specific detail",
      "Making claims about licensing requirements without confirming with the relevant authority",
    ],
    atsNote:
      "Larger healthcare employers in Saudi Arabia may screen applications through recruitment platforms, so a clear CV structure with your role, qualifications and licenses clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Saudi Arabia's healthcare sector spans public and private hospitals, clinics and specialized centers - presenting your qualifications and licensing status accurately is important, and we recommend confirming specific registration requirements directly with the relevant Saudi healthcare licensing authority rather than relying on general guidance.",
    before: "Responsible for patient care and documentation on the ward.",
    after:
      "Provided patient care across an assigned ward caseload, maintaining accurate clinical documentation and coordinating with the multidisciplinary team to support consistent care standards.",
    roles: ["Nurse", "Healthcare Administrator", "Clinical Specialist", "Medical Technologist", "Healthcare Operations Professional"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my healthcare CV for Saudi Arabia applications.",
    industryFaqs: [
      {
        question: "How should I present licenses and certifications?",
        answer:
          "List your licenses and certifications clearly with issuing body and status, and confirm current registration/licensing requirements directly with the relevant Saudi healthcare authority, since we don't provide licensing or legal advice.",
      },
      {
        question: "Should clinical responsibilities be described in detail?",
        answer:
          "Yes, within the bounds of confidentiality - describing your specific clinical responsibilities and patient-care scope helps recruiters understand your actual role, without including identifiable patient information.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "saudi",
    regionName: "Saudi Arabia",
    slug: "technology",
    industryLabel: "Technology",
    serviceName: "Technology CV Writing",
    eyebrow: "Technology Career CV Support",
    h1: "Technology CV Writing for Saudi Arabia Jobs",
    heroSubtext:
      "Present your technology stack, delivery experience and measurable impact clearly for IT and technology roles across Saudi Arabia's growing tech sector.",
    ...findMeta("saudi", "technology"),
    quickAnswer: {
      question: "What should a technology CV for Saudi Arabia jobs include?",
      answer:
        "A strong technology CV for Saudi Arabia typically presents your core technology stack, the systems or products you've delivered, your role within development or delivery teams, and measurable outcomes such as performance or reliability improvements. Cloud, DevOps or cybersecurity experience is worth including where genuinely relevant to your background.",
    },
    prioritiesIntro:
      "Saudi Arabia's technology sector spans government-linked digital initiatives, private-sector companies and growing local tech employers, each looking for clear, current technical skills.",
    priorities: [
      "Lead with your core technology stack and areas of specialization",
      "Describe the systems, products or platforms you've delivered or maintained",
      "Clarify your role within the development or delivery lifecycle",
      "Include cloud, DevOps or cybersecurity experience where genuinely relevant",
      "Highlight measurable outcomes such as performance, reliability or automation improvements",
      "Note collaboration with cross-functional or distributed teams",
    ],
    competencyPoints: [
      "Core programming languages, frameworks or platforms",
      "Cloud, DevOps or cybersecurity experience where relevant",
      "Systems or products delivered, with your specific role clarified",
      "Automation or reliability improvements you've contributed to",
    ],
    mistakes: [
      "Listing every technology ever used instead of genuine areas of strength",
      "Describing tasks without the outcome or impact of the work",
      "Not clarifying your specific role within a team or project",
      "Turning the CV into a generic list of tools without project context",
    ],
    atsNote:
      "Technology employers in Saudi Arabia increasingly use applicant tracking systems and keyword-based searches to shortlist candidates, so clearly naming your core stack and tools in a clean, well-structured CV helps ensure it surfaces in relevant searches.",
    regionalNote:
      "Saudi Arabia's technology sector is expanding across both government-linked digital initiatives and private-sector companies - being specific and current about your technical skills, rather than relying on generic descriptions, tends to matter more here.",
    before: "Worked on software development tasks for internal systems.",
    after:
      "Developed and maintained internal software systems, improving deployment reliability and collaborating with cross-functional teams to support automation of manual processes.",
    roles: ["Software Engineer", "Cloud Engineer", "DevOps Engineer", "Cybersecurity Specialist", "IT Manager"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my technology CV for Saudi Arabia jobs.",
    industryFaqs: [
      {
        question: "Should I list every technology I have used?",
        answer:
          "No - focus on the technologies most relevant to your target role and where you have genuine depth, rather than listing every tool you've briefly touched.",
      },
      {
        question: "How should I show project impact without revealing confidential data?",
        answer:
          "Describe outcomes in general, non-confidential terms - such as percentage or directional improvements you're able to share, or the scale and type of system involved - without disclosing proprietary details or figures you're not authorized to share.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "ATS CV Guide", path: "/blog/ats-cv-guide-kuwait" }],
  },
  {
    region: "qatar",
    regionName: "Qatar",
    slug: "construction",
    industryLabel: "Construction",
    serviceName: "Construction CV Writing",
    eyebrow: "Construction Career CV Support",
    h1: "Construction CV Writing for Qatar Jobs",
    heroSubtext:
      "Present your project execution, site coordination and technical documentation experience clearly for construction roles across Qatar's active project market.",
    ...findMeta("qatar", "construction"),
    quickAnswer: {
      question: "What should a construction CV for Qatar jobs include?",
      answer:
        "A strong construction CV for Qatar typically presents the project type and scale you've worked on, your site coordination or planning responsibilities, QA/QC and safety practices, and technical documentation experience. Subcontractor coordination and handover experience can also strengthen your application, depending on your role.",
    },
    prioritiesIntro:
      "Qatar's construction sector spans infrastructure, commercial and residential projects, so clarifying the project type and your specific role within it helps your CV read clearly.",
    priorities: [
      "Clarify the project type and approximate scale you've worked on",
      "Describe your site coordination or planning responsibilities",
      "Highlight QA/QC and safety practices you've followed",
      "Note technical documentation responsibilities",
      "Reference subcontractor coordination experience where relevant",
      "Mention handover and close-out experience",
    ],
    competencyPoints: [
      "Project types and approximate scale relevant to your target role",
      "Site coordination, planning or supervision responsibilities",
      "QA/QC and safety standards you've worked within",
      "Technical documentation and handover experience",
    ],
    mistakes: [
      "Not specifying the type or scale of projects you've worked on",
      "Listing site duties without describing outcomes or progress achieved",
      "Omitting QA/QC or safety practices genuinely followed",
      "Leaving out technical documentation or handover experience",
    ],
    atsNote:
      "Larger construction employers and contractors in Qatar may screen applications through recruitment platforms, so a clear CV structure with your project type, role and responsibilities clearly stated helps ensure it's read correctly.",
    regionalNote:
      "Qatar's construction market includes national developers, international contractors and specialized subcontractors working on a competitive, internationally connected set of projects - tailoring your CV's emphasis to the project scale and employer type you're targeting tends to produce a stronger application.",
    before: "Worked on-site handling construction coordination and reporting.",
    after:
      "Coordinated site activities across assigned construction projects in Qatar, tracking QA/QC compliance, maintaining technical documentation, and supporting timely progress reporting to project stakeholders.",
    roles: ["Project Engineer", "Site Engineer", "Construction Manager", "Civil Engineer", "QA/QC Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my construction CV for Qatar jobs.",
    industryFaqs: [
      {
        question: "How should I present technical documentation experience?",
        answer:
          "Describe the type of documentation you were responsible for (drawings, inspection reports, or handover documents, for example) and how it supported the project, rather than only stating \"documentation\" as a duty.",
      },
      {
        question: "Should I include QA/QC experience separately from general site duties?",
        answer:
          "Yes, where genuinely part of your role - QA/QC responsibilities are often assessed distinctly, so listing them clearly helps recruiters see the full scope of your technical involvement.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "qatar",
    regionName: "Qatar",
    slug: "hospitality",
    industryLabel: "Hospitality",
    serviceName: "Hospitality CV Writing",
    eyebrow: "Hospitality Career CV Support",
    h1: "Hospitality CV Writing for Qatar Jobs",
    heroSubtext:
      "Present your guest experience, operations and team supervision experience clearly for hospitality roles across Qatar's hotel and F&B market.",
    ...findMeta("qatar", "hospitality"),
    quickAnswer: {
      question: "What should a hospitality CV for Qatar jobs include?",
      answer:
        "A strong hospitality CV for Qatar typically presents your area of specialization (front office, F&B, or guest relations), guest-experience responsibilities and outcomes, team supervision experience, and any reservation, POS or property systems you've used. Multilingual ability is worth including where genuinely relevant to your target role.",
    },
    prioritiesIntro:
      "Qatar's hospitality sector spans hotels, restaurants and guest-service operations serving an internationally connected guest base, so clarity about your specific role and environment matters.",
    priorities: [
      "Clarify your specialization: front office, F&B, guest relations or operations",
      "Describe guest-experience responsibilities and how you resolved guest needs",
      "Highlight team supervision or leadership experience",
      "Name reservation, POS or property systems you've used",
      "Mention multilingual ability relevant to an international guest base",
      "Note service-standard or operational-coordination responsibilities",
    ],
    competencyPoints: [
      "Reservation, POS or property systems experience",
      "Guest-experience and service-standard responsibilities",
      "Team supervision or leadership experience",
      "Multilingual ability relevant to an international guest base",
    ],
    mistakes: [
      "Using vague \"customer service\" language instead of specific guest-experience responsibilities",
      "Omitting reservation or property systems experience genuinely used",
      "Not clarifying your specific department or specialization",
      "Making unsupported claims about current hiring demand levels",
    ],
    atsNote:
      "Larger hotel groups and hospitality employers in Qatar may screen applications through recruitment platforms, so clearly naming your specialization, systems experience and languages in a simple, well-structured CV helps it get matched to the right roles.",
    regionalNote:
      "Qatar's hospitality sector serves an internationally connected guest base across hotels, restaurants and leisure operators - presenting your language skills and multicultural team experience clearly tends to help your CV stand out, without relying on unverified claims about current hiring demand.",
    before: "Responsible for guest interactions and daily restaurant operations.",
    after:
      "Managed guest interactions and daily restaurant operations, resolving service issues promptly and coordinating with kitchen and front-of-house teams to maintain consistent service standards.",
    roles: ["Front Office Manager", "Restaurant Manager", "F&B Supervisor", "Guest Relations Executive", "Hotel Operations Manager"],
    whatsappMessage: "Hi BrandMyProfile, I need help improving my hospitality CV for Qatar job applications.",
    industryFaqs: [
      {
        question: "How should I present guest-experience achievements?",
        answer:
          "Describe specific situations where you resolved guest issues or improved the guest experience, rather than only stating that you provided \"good customer service.\"",
      },
      {
        question: "Should I include reservation or POS systems experience?",
        answer:
          "Yes, where genuinely used - naming the specific reservation, POS or property systems you've worked with helps demonstrate practical, role-ready operational experience.",
      },
    ],
    gccEmphasis: "standard",
    blogLinks: [{ label: "GCC CV Format Guide", path: "/blog/gcc-cv-format-guide" }],
  },
  {
    region: "india",
    regionName: "India",
    slug: "technology-gcc",
    industryLabel: "Technology for GCC",
    serviceName: "Technology CV Writing for GCC Applications",
    eyebrow: "Technology CV Support for GCC Applications",
    h1: "Technology CV for GCC Jobs from India",
    heroSubtext:
      "Position your technology experience clearly for Gulf employers, whether you're targeting Kuwait, UAE, Saudi Arabia, Qatar or other GCC markets.",
    ...findMeta("india", "technology-gcc"),
    quickAnswer: {
      question: "How should Indian technology professionals prepare a CV for GCC jobs?",
      answer:
        "A strong technology CV for GCC applications from India typically presents your technology stack and project impact in internationally readable terms, your specific role within delivery teams, measurable outcomes, and your target GCC market and relocation readiness. Certifications with international recognition and any prior multinational project exposure can also strengthen your application.",
    },
    prioritiesIntro:
      "Technology professionals applying from India to GCC markets benefit from presenting their stack and delivery experience in terms that read clearly to Gulf employers and recruiters.",
    priorities: [
      "Lead with your core technology stack in internationally recognizable terms",
      "Describe the systems, products or platforms you've delivered",
      "Clarify your specific role within development or delivery teams",
      "Highlight measurable business or technical impact from your work",
      "State your target GCC market, relocation readiness and notice period",
      "Reference internationally recognized certifications where applicable",
    ],
    competencyPoints: [
      "Core technology stack described in internationally readable terms",
      "Systems or products delivered, with your specific role clarified",
      "Certifications with international recognition where applicable",
      "Relocation readiness, notice period and target market clarity",
    ],
    mistakes: [
      "Using India-specific job titles or internal terms that don't translate clearly for GCC recruiters",
      "Not stating a clear target country or relocation readiness",
      "Listing technologies without describing project or business impact",
      "Omitting internationally recognized certifications you do hold",
    ],
    atsNote:
      "Many GCC employers, particularly multinationals, screen applications through recruitment platforms, so presenting your stack, role and project impact with clear, standard terminology helps your CV get matched to the right roles.",
    regionalNote:
      "Since you're applying from India into GCC markets, clearly stating your target country, availability and relocation readiness - alongside internationally readable job titles and technology terms - helps your CV read naturally to Gulf recruiters, whichever specific market you're targeting.",
    before: "Worked on software projects handling development tasks.",
    after:
      "Developed and delivered software features across multiple projects, collaborating with cross-functional teams and contributing to improved system reliability within agreed delivery timelines.",
    roles: ["Software Engineer", "Full-Stack Developer", "DevOps Engineer", "Cloud Engineer", "Data Engineer"],
    whatsappMessage: "Hi BrandMyProfile, I'm applying from India for GCC technology roles and need help with my CV.",
    industryFaqs: [
      {
        question: "How should Indian technology professionals position experience for GCC applications?",
        answer:
          "Present your stack and project experience using internationally readable terms, clarify your target GCC market and relocation readiness, and highlight any international or multinational project exposure you have.",
      },
      {
        question: "Should I list every framework or tool I've used?",
        answer:
          "Focus on the technologies most relevant to your target role and where you have genuine depth, rather than listing every tool you've briefly touched.",
      },
    ],
    gccEmphasis: "strong",
    blogLinks: [{ label: "India to GCC Jobs Guide", path: "/blog/india-to-gcc-jobs-guide" }],
  },
  {
    region: "india",
    regionName: "India",
    slug: "finance-gcc",
    industryLabel: "Finance for GCC",
    serviceName: "Finance CV Writing for GCC Applications",
    eyebrow: "Finance CV Support for GCC Applications",
    h1: "Finance CV for GCC Jobs from India",
    heroSubtext:
      "Position your finance and accounting experience clearly for Gulf employers, whether you're targeting Kuwait, UAE, Saudi Arabia, Qatar or other GCC markets.",
    ...findMeta("india", "finance-gcc"),
    quickAnswer: {
      question: "What should a finance CV for GCC jobs from India include?",
      answer:
        "A strong finance CV for GCC applications from India typically presents your area of specialization, the ERP or accounting systems you've used, audit or compliance experience described in internationally understandable terms, and your target GCC market and relocation readiness. Professional qualifications with international recognition can also strengthen your application.",
    },
    prioritiesIntro:
      "Finance professionals applying from India to GCC markets benefit from presenting their reporting, systems and compliance experience in terms that read clearly to Gulf employers.",
    priorities: [
      "Clarify your specialization: reporting, budgeting, audit or financial analysis",
      "Name the ERP or accounting systems you've used, in terms GCC recruiters recognize",
      "Describe compliance or internal-controls experience clearly",
      "State your target GCC market, relocation readiness and notice period",
      "Reference professional qualifications with international recognition",
      "Highlight measurable outcomes such as reporting accuracy or process improvements",
    ],
    competencyPoints: [
      "ERP/accounting systems experience described in internationally recognizable terms",
      "Reporting, budgeting or audit responsibilities",
      "Professional qualifications with international recognition",
      "Relocation readiness, notice period and target market clarity",
    ],
    mistakes: [
      "Using India-specific terminology that doesn't translate clearly for GCC recruiters",
      "Not stating a clear target country or relocation readiness",
      "Listing finance duties without measurable outcomes",
      "Omitting internationally recognized qualifications you do hold",
    ],
    atsNote:
      "Many GCC finance employers, particularly multinationals, screen applications through recruitment platforms, so presenting your systems experience, qualifications and specialization with clear, standard terminology helps your CV get matched to the right roles.",
    regionalNote:
      "Since you're applying from India into GCC markets, clearly stating your target country, availability and relocation readiness - alongside internationally readable financial terminology - helps your CV read naturally to Gulf recruiters, whichever specific market you're targeting.",
    before: "Worked in the finance department handling reporting tasks.",
    after:
      "Prepared financial reports and reconciliations for a multinational finance function, supporting month-end close processes and coordinating with cross-border stakeholders on reporting accuracy.",
    roles: ["Accountant", "Financial Analyst", "Finance Manager", "Internal Auditor", "Cost Controller"],
    whatsappMessage: "Hi BrandMyProfile, I'm applying from India for GCC finance roles and need help with my CV.",
    industryFaqs: [
      {
        question: "How should Indian finance professionals position experience for GCC applications?",
        answer:
          "Present your specialization and systems experience using internationally readable terms, clarify your target GCC market and relocation readiness, and highlight any cross-border or multinational finance exposure you have.",
      },
      {
        question: "Should I mention Indian regulatory or tax experience?",
        answer:
          "You can mention it briefly for context, but focus most of your CV on transferable finance skills - reporting, systems, compliance and analysis - that read clearly to GCC employers, since Indian-specific regulatory detail may not be directly relevant there.",
      },
    ],
    gccEmphasis: "strong",
    blogLinks: [{ label: "India to GCC Jobs Guide", path: "/blog/india-to-gcc-jobs-guide" }],
  },
];

export function getIndustryPage(region: string, slug: string): IndustryPageContent | undefined {
  return industryContent.find((entry) => entry.region === region && entry.slug === slug);
}

// The 5 structural FAQs shared across every industry page (Unit 4A, section 16) -
// combined with each page's 2 industry-specific FAQs at render time.
export const sharedIndustryFaqs: IndustryFaq[] = [
  {
    question: "How should I structure an industry CV?",
    answer:
      "Lead with a professional summary aligned to your target role, followed by a clearly listed skills section, then achievement-focused work experience in reverse chronological order, and education or certifications - keeping the structure consistent and easy to scan.",
  },
  {
    question: "Should technical skills appear near the top?",
    answer:
      "Yes, typically. Placing a concise skills or technical-competency section near the top of your CV helps both recruiters and any screening software quickly identify your core strengths.",
  },
  {
    question: "How do I show achievements instead of duties?",
    answer:
      "Focus on the outcome of your work - what changed, improved, or was delivered - rather than only describing your day-to-day responsibilities.",
  },
  {
    question: "How does ATS affect an industry CV?",
    answer:
      "Many employers use applicant tracking systems to screen applications, so a clean, single-column structure with standard headings and role-specific keywords helps ensure your CV is read correctly before a recruiter reviews it.",
  },
  {
    question: "Will this guarantee interviews or job offers?",
    answer:
      "No. No CV service can guarantee interviews or job offers, but clear, well-structured, achievement-focused content can improve how your application is understood and considered.",
  },
];
