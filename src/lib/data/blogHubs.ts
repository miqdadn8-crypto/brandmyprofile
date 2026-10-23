// Content hubs (Unit 6) - a small, explicit whitelist of real topic-authority pages, not
// a generic category-filter system. Only the 5 slugs below exist; every other /blog/:slug
// value falls through to the regular BlogPost article lookup (see App.tsx route order).
// metaDescription/title mirror src/lib/data/blogHubs.json exactly (the plain file the
// Node static generator also reads), so the two can never drift apart.
import blogHubsMeta from "./blogHubs.json";

export interface BlogHubConfig {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string[];
  cornerstoneSlug: string;
  supportingSlugs: string[];
  serviceLinks: { label: string; path: string }[];
  relatedHubs: { label: string; path: string }[];
}

function findMeta(slug: string) {
  const meta = (blogHubsMeta as { slug: string; title: string; metaDescription: string }[]).find((h) => h.slug === slug);
  if (!meta) throw new Error(`Missing blogHubs.json entry for ${slug}`);
  return meta;
}

export const blogHubs: BlogHubConfig[] = [
  {
    ...findMeta("cv-writing"),
    h1: "CV Writing Guides",
    intro: [
      "A strong CV presents your experience clearly, with achievement-focused writing, a structure that's easy to scan, and content genuinely tailored to your target role. There's no single universal format, but consistent structure and specific, achievement-focused writing consistently outperform generic, duty-based CVs.",
      "The guides below cover the practical side of CV writing - from foundational structure and regional formatting considerations to the mistakes that most commonly weaken an application, and how applicant tracking systems fit into the picture.",
      "CV writing and ATS optimization are related but distinct: writing focuses on how your experience is presented and argued, while ATS optimization focuses on machine-readable structure. Regional adaptation - GCC formatting conventions, industry-specific positioning - sits on top of both.",
    ],
    cornerstoneSlug: "gcc-cv-format-guide",
    supportingSlugs: ["best-cv-writing-service-kuwait", "best-cv-writing-service-uae", "best-cv-writing-service-saudi", "best-cv-writing-service-qatar", "best-cv-writing-service-bahrain", "best-cv-writing-service-oman", "kuwait-cv-format-guide", "gcc-cv-mistakes", "cover-letter-gcc-jobs", "engineering-cv-kuwait-guide", "oil-gas-cv-gcc-guide", "ats-friendly-cv-tips-2025"],
    serviceLinks: [
      { label: "Professional CV Writing in Kuwait", path: "/kuwait/services/cv-writing" },
      { label: "GCC CV Writing", path: "/kuwait/services/gcc-cv" },
      { label: "ATS CV Writing", path: "/kuwait/services/ats-cv" },
      { label: "Free GCC CV Checklist", path: "/resources/gcc-cv-checklist" },
    ],
    relatedHubs: [
      { label: "ATS Hub", path: "/blog/ats" },
      { label: "GCC Careers Hub", path: "/blog/gcc-careers" },
    ],
  },
  {
    ...findMeta("ats"),
    h1: "ATS CV Guides",
    intro: [
      "An applicant tracking system (ATS) is software many employers use to collect, sort and search job applications before a recruiter reviews them. Building a CV with clean, single-column structure and relevant keywords helps ensure your experience is read correctly - not every employer uses an ATS, but treating clean structure as a default habit is a safe approach either way.",
      "The guides below cover how ATS parsing actually works, practical formatting checklists, and common myths worth being aware of.",
      "A common myth is that all ATS platforms work identically, or that every employer uses one - neither is accurate. Many different ATS providers exist, each with its own parsing logic, and plenty of employers, especially smaller ones, don't use one at all.",
    ],
    cornerstoneSlug: "how-ats-reads-your-cv",
    supportingSlugs: ["ats-friendly-cv-tips-2025", "ats-cv-guide-kuwait"],
    serviceLinks: [{ label: "ATS CV Writing", path: "/kuwait/services/ats-cv" }],
    relatedHubs: [{ label: "CV Writing Hub", path: "/blog/cv-writing" }],
  },
  {
    ...findMeta("gcc-careers"),
    h1: "GCC Careers Guides",
    intro: [
      "Building a career in the GCC - Kuwait, the UAE, Saudi Arabia, Qatar and neighboring markets - involves more than just applying for roles. CV format, positioning, interview preparation and application safety all play a part, and expectations vary by country, industry and employer.",
      "The guides below cover GCC CV format and common mistakes, industry-specific positioning, interview preparation, and safe job-search practices.",
      "These guides focus on CV writing, application positioning and interview preparation - not visa, immigration or legal advice. Confirm any visa or work-authorization requirements with official authorities or a qualified professional.",
    ],
    cornerstoneSlug: "gcc-cv-format-guide",
    supportingSlugs: ["best-cv-writing-service-kuwait", "best-cv-writing-service-uae", "best-cv-writing-service-saudi", "best-cv-writing-service-qatar", "best-cv-writing-service-bahrain", "best-cv-writing-service-oman", "kuwait-cv-format-guide", "gcc-cv-mistakes", "engineering-cv-kuwait-guide", "oil-gas-cv-gcc-guide", "gcc-interview-preparation", "career-transition-gcc-job-market"],
    serviceLinks: [
      { label: "GCC CV Writing", path: "/kuwait/services/gcc-cv" },
      { label: "Career Guidance", path: "/kuwait/services/career-guidance" },
      { label: "Free GCC CV Checklist", path: "/resources/gcc-cv-checklist" },
    ],
    relatedHubs: [
      { label: "India to GCC Careers Hub", path: "/blog/india-gcc" },
      { label: "Career Guidance Hub", path: "/blog/career-guidance" },
    ],
  },
  {
    ...findMeta("career-guidance"),
    h1: "Career Guidance",
    intro: [
      "Career guidance covers the decisions and preparation around a job search that go beyond the CV itself - choosing a target role, preparing for interviews, and planning a career transition. No amount of guidance can guarantee a specific job outcome, but clear preparation improves how confidently you present yourself.",
      "The guides below cover interview preparation for GCC employers and career-transition considerations for professionals moving into new markets.",
    ],
    cornerstoneSlug: "gcc-interview-preparation",
    supportingSlugs: ["career-transition-gcc-job-market", "india-to-gcc-jobs-guide"],
    serviceLinks: [{ label: "Career Guidance", path: "/kuwait/services/career-guidance" }],
    relatedHubs: [{ label: "GCC Careers Hub", path: "/blog/gcc-careers" }],
  },
  {
    ...findMeta("india-gcc"),
    h1: "India to GCC Careers",
    intro: [
      "For professionals based in India targeting GCC opportunities, the job search involves some adjustments beyond a standard domestic application - CV positioning, target-market research, and application safety all matter. This hub gathers our informational guides relevant to that specific journey.",
      "This page is an informational guide hub. If you're ready to start your application, our India to GCC Jobs pathway covers the commercial next steps - CV services, industry paths and service links - in one place.",
    ],
    cornerstoneSlug: "india-to-gcc-jobs-guide",
    supportingSlugs: ["gcc-cv-format-guide", "career-transition-gcc-job-market", "engineering-cv-kuwait-guide", "oil-gas-cv-gcc-guide"],
    serviceLinks: [
      { label: "India GCC CV Writing", path: "/india/services/gcc-cv" },
      { label: "India ATS CV Writing", path: "/india/services/ats-cv" },
    ],
    relatedHubs: [
      { label: "GCC Careers Hub", path: "/blog/gcc-careers" },
      { label: "India to GCC Jobs (commercial pathway)", path: "/india/gcc-jobs" },
    ],
  },
];

export function getBlogHub(slug: string): BlogHubConfig | undefined {
  return blogHubs.find((hub) => hub.slug === slug);
}
