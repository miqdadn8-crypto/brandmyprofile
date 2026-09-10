import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileText,
  Layers,
  ListChecks,
  MessageCircle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { organizationSchema } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import atsHeroKuwait from "@/assets/ats-hero-kuwait-v1.jpg";
import atsHeroUae from "@/assets/ats-hero-uae-v1.jpg";
import atsHeroSaudi from "@/assets/ats-hero-saudi-v1.jpg";
import atsHeroQatar from "@/assets/ats-hero-qatar-v1.jpg";
import atsHeroIndia from "@/assets/ats-hero-india-v1.jpg";

const atsHeroImages: Record<string, string> = {
  kuwait: atsHeroKuwait,
  uae: atsHeroUae,
  saudi: atsHeroSaudi,
  qatar: atsHeroQatar,
  india: atsHeroIndia,
};

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const trustItems = [
  { title: "500+", label: "Professionals Supported", icon: UsersRound },
  { title: "Human Written", label: "& Reviewed", icon: UserRoundCheck },
  { title: "ATS-Friendly", label: "Structure", icon: ScanSearch },
  { title: "Confidential", label: "Support", icon: ShieldCheck },
];

const atsCanRead = ["Job titles", "Skills", "Work history", "Education", "Certifications", "Keywords"];

const commonProblems = [
  "Overly complex columns or tables",
  "Text placed inside graphics or images",
  "Image-heavy resumes with little plain text",
  "Unclear or non-standard section headings",
  "Keyword mismatch with the target role",
  "Poor information hierarchy",
  "Excessive decorative design elements",
];

const optimizationItems = [
  { title: "ATS-Friendly Structure", description: "A clean, single-column layout that applicant tracking systems can parse consistently.", icon: Layers },
  { title: "Role-Specific Keywords", description: "Terms drawn from your target job description, reflected naturally where they genuinely apply.", icon: Target },
  { title: "Achievement-Focused Writing", description: "Experience reframed around measurable impact rather than task lists.", icon: Sparkles },
  { title: "Professional Summary", description: "A focused opening statement that positions your experience and target role clearly.", icon: FileText },
  { title: "Skills Alignment", description: "A prioritized skills section matched to what the role and system are scanning for.", icon: ListChecks },
  { title: "Experience Rewriting", description: "Clear, consistent job titles, dates and descriptions throughout your work history.", icon: Compass },
  { title: "Readable Formatting", description: "Standard fonts, headings and spacing that stay readable to both software and people.", icon: ScanSearch },
  { title: "Human Review", description: "Every CV is reviewed by a person, not generated and left unchecked.", icon: UserRoundCheck },
];

const checklistItems = [
  "Clear section headings",
  "Relevant job-specific keywords",
  "Simple document structure",
  "Consistent dates and job titles",
  "Achievement-focused experience",
  "Readable typography",
  "Correct contact information",
  "No unnecessary decorative graphics",
];

const comparisonRows = [
  { label: "Layout", standard: "Multi-column, design-led", ats: "Single-column, structured" },
  { label: "Keywords", standard: "Generic, role-agnostic", ats: "Matched to the target role" },
  { label: "Section headings", standard: "Creative or non-standard", ats: "Clear and conventional" },
  { label: "Graphics", standard: "Icons, photos, charts", ats: "Minimal, text-first" },
  { label: "Role targeting", standard: "One CV for every application", ats: "Tailored to the role applied for" },
  { label: "Human readability", standard: "Can be reduced by heavy design", ats: "Stays clear alongside ATS structure" },
];

const processSteps = [
  { number: "01", title: "Share Your CV & Target Role", description: "Send your current CV and the type of role or job description you're targeting." },
  { number: "02", title: "ATS Review", description: "We review your CV's current structure and identify what an applicant tracking system might struggle to read." },
  { number: "03", title: "Rewrite & Optimize", description: "Your CV is rewritten with ATS-friendly structure, relevant keywords and achievement-focused content." },
  { number: "04", title: "Human Review & Delivery", description: "A final human review checks clarity and readability before your finished CV is delivered." },
];

const audiences = [
  { title: "Active Job Seekers", description: "Applying through job boards and company portals that screen applications automatically." },
  { title: "Career Switchers", description: "Repositioning experience so it's recognized correctly for a new role or industry." },
  { title: "Busy Professionals", description: "Who want a CV that works without manually reformatting it for every application." },
];

const sharedFaqs = [
  {
    question: "Can ATS read tables and columns?",
    answer:
      "Many applicant tracking systems struggle with complex tables, columns and text boxes, since they can scramble the reading order. A simpler, single-column layout is generally safer for consistent parsing.",
  },
  {
    question: "Should I use graphics in an ATS CV?",
    answer:
      "It's best to avoid heavy graphics, icons or photos as the main way of presenting information, since many ATS platforms can't extract text from images. Keep your core content in plain, readable text.",
  },
  {
    question: "How do I choose ATS keywords?",
    answer:
      "Review the job description for the specific skills, tools and qualifications it mentions, and reflect those terms naturally in your CV where they genuinely apply to your experience.",
  },
  {
    question: "Does an ATS CV guarantee interviews?",
    answer:
      "No. An ATS-friendly CV improves the chances your application is read and understood correctly, but no CV format can guarantee interviews or job offers.",
  },
  {
    question: "How long should an ATS CV be?",
    answer:
      "Most professional CVs work well at one to two pages, depending on experience level. What matters most for ATS purposes is clear structure, not exact length.",
  },
];

export default function ATSCV() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const ats = content.atsCv;

  if (!ats) {
    return null;
  }

  const getMyAtsCvUrl = buildWhatsAppUrl(ats.whatsappMessage);
  const faqs = [...sharedFaqs, ats.faq];
  const heroImage = atsHeroImages[selectedRegion.code] ?? atsHeroKuwait;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/ats-cv#service`,
        name: "ATS CV Writing",
        description: ats.metaDescription,
        provider: { "@id": organizationSchema["@id"] },
        areaServed: { "@type": "Country", name: selectedRegion.name },
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/ats-cv#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO
        title={ats.metaTitle}
        description={ats.metaDescription}
        keywords={`ats cv writing ${selectedRegion.name}, ats friendly cv, ats optimized cv, cv optimization ${selectedRegion.name}`}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "ATS CV Writing" },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_48%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container grid items-center gap-12 py-16 lg:min-h-[690px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-16">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                {ats.eyebrow}
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,7vw,4.25rem)] font-semibold leading-[1.03] tracking-normal">
                {ats.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Get a professionally written CV with ATS-friendly structure, clear keywords, achievement-focused content and human review.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" asChild>
                  <a href={getMyAtsCvUrl} target="_blank" rel="noopener noreferrer">
                    Get My ATS CV
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href={`/${selectedRegion.code}/contact`}>Get a Free CV Review</a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] pb-7 lg:mx-0 lg:max-w-none">
              <div className="absolute -right-8 top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="relative h-[470px] overflow-hidden rounded-[2rem] border border-white/80 bg-primary shadow-[0_30px_80px_-42px_hsl(var(--primary)/0.62)] sm:h-[540px]">
                <img
                  src={heroImage}
                  alt={`Professional in ${selectedRegion.name} reviewing a CV for ATS compatibility`}
                  width="1122"
                  height="1402"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[58%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
                  <ScanSearch className="h-4 w-4" aria-hidden="true" /> {selectedRegion.name} ATS Ready
                </span>
              </div>

              <div className="absolute bottom-0 left-3 z-10 w-[min(88%,350px)] overflow-hidden rounded-[1.25rem] border border-primary/15 bg-white shadow-[0_22px_54px_-26px_hsl(var(--primary)/0.65)] sm:-left-5">
                <div className="flex items-center justify-between gap-4 bg-primary px-4 py-3.5 text-primary-foreground">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">ATS Compatibility</p>
                    <p className="mt-0.5 text-sm font-semibold sm:text-base">Application-ready structure</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white/50 text-sm font-bold">92%</span>
                </div>
                <div className="grid gap-2.5 p-4">
                  {["Readable document structure", "Role-specific keywords", "Human written & reviewed"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-semibold text-foreground sm:text-[13px]">
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="section-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ title, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-4">
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-base font-bold leading-tight">{title}</span>
                  <span className="block text-sm text-muted-foreground">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AEO direct answer */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">What is an ATS-friendly CV?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              An ATS-friendly CV is structured so applicant tracking systems can read and categorize its content clearly. It
              typically uses standard section headings, readable formatting, relevant role-specific keywords and
              straightforward document structure while still being written for human recruiters.
            </p>
          </div>
        </motion.section>

        {/* Why it matters + education */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Why ATS-Friendly Structure Matters</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What an ATS Actually Does With Your CV</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Before a recruiter opens your CV, many applicant tracking systems parse it first - extracting your details into
                a structured profile. If the structure is unclear, relevant information can be missed or misread.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-7">
                <h3 className="text-xl font-semibold tracking-normal">What Many ATS Platforms Can Parse</h3>
                <ul className="mt-5 space-y-3">
                  {atsCanRead.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-background p-7">
                <h3 className="text-xl font-semibold tracking-normal">Common ATS Problems</h3>
                <ul className="mt-5 space-y-3">
                  {commonProblems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What we optimize */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What We Optimize</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Every Part of Your CV, Reviewed</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {optimizationItems.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-[1.35rem] border border-border bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-normal">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Before / after */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative Example</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">See the Difference Structure Makes</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A generic example showing how achievement-focused rewriting improves clarity - not a real client's CV.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                <p className="text-lg leading-8 text-foreground">Responsible for handling sales and customers.</p>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">After</p>
                <p className="text-lg leading-8 text-foreground">
                  Managed customer relationships and supported day-to-day sales activities while coordinating enquiries,
                  follow-ups and service requests.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Checklist */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">ATS-Ready CV Checklist</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What a Strong ATS CV Includes</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {checklistItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Comparison table */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Standard CV vs. ATS-Optimized CV</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Where the Real Differences Are</h2>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-x-auto">
              <table className="w-full min-w-[560px] table-fixed border-collapse overflow-hidden rounded-[1.25rem] border border-border text-left">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="w-1/3 px-5 py-4 text-sm font-semibold">Area</th>
                    <th className="px-5 py-4 text-sm font-semibold">Standard CV</th>
                    <th className="px-5 py-4 text-sm font-semibold">ATS-Optimized CV</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={row.label} className={index % 2 === 0 ? "bg-background" : "bg-white"}>
                      <th className="px-5 py-4 text-sm font-semibold">{row.label}</th>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.standard}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.ats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Regional context */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-white p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Regional Market Context</p>
                  <h2 className="mt-4 font-serif font-semibold tracking-normal">{ats.marketContextHeading}</h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-muted-foreground">{ats.marketContextParagraph}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {ats.industries.map((tag) => (
                      <span key={tag} className="rounded-full bg-[hsl(var(--surface-warm))] px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contextual link to GCC CV page - ATS and GCC formatting solve different problems */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[1.5rem] border border-border bg-background p-7 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h3 className="text-lg font-semibold tracking-normal">Need Market-Specific Gulf Formatting as Well?</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  ATS optimization focuses on machine-readable structure. GCC formatting focuses on market relevance and
                  presentation for Gulf employers.
                </p>
              </div>
              <a
                href={`/${selectedRegion.code}/services/gcc-cv`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore GCC CV Format
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* India-only angle */}
        {ats.indiaAngle && (
          <motion.section {...reveal} className="section-padding bg-white">
            <div className="section-container max-w-3xl">
              <h2 className="font-serif font-semibold tracking-normal">{ats.indiaAngle.heading}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{ats.indiaAngle.paragraph}</p>
            </div>
          </motion.section>
        )}

        {/* How it works */}
        <section className="section-padding border-y border-border bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How It Works</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article key={step.number} className="rounded-[1.35rem] border border-border bg-white p-6">
                  <p className="font-serif text-5xl font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-8 text-xl font-semibold tracking-normal">{step.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Who This Is For</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Built for How You're Actually Applying</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {audiences.map(({ title, description }) => (
                <div key={title} className="rounded-[1.35rem] border border-border bg-background p-6">
                  <BadgeCheck className="h-6 w-6 text-accent" />
                  <h3 className="mt-5 text-lg font-semibold tracking-normal">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Pricing / enquiry path */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-border bg-white p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">ATS CV Pricing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                ATS CV writing is included within our CV writing packages. View current pricing for {selectedRegion.name}, or
                ask us directly for a recommendation.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <a href={`/${selectedRegion.code}/pricing`}>View CV Packages</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={getMyAtsCvUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Ask for Pricing
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Start</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">ATS CV Writing FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-border bg-background p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                      {faq.question}
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-primary transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="border-y border-border bg-[hsl(var(--surface-warm))] py-10">
          <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
            <a href={`/${selectedRegion.code}/services/cv-writing`} className="underline-offset-4 hover:underline">
              Professional CV Writing
            </a>
            <a href={`/${selectedRegion.code}/services/gcc-cv`} className="underline-offset-4 hover:underline">
              GCC Format CV
            </a>
            <a href={`/${selectedRegion.code}/services/linkedin-makeover`} className="underline-offset-4 hover:underline">
              LinkedIn Profile Optimization
            </a>
            <a href={`/${selectedRegion.code}/services/career-guidance`} className="underline-offset-4 hover:underline">
              Career Guidance
            </a>
            <a href={`/${selectedRegion.code}/pricing`} className="underline-offset-4 hover:underline">
              Pricing
            </a>
            <a href={`/${selectedRegion.code}/contact`} className="underline-offset-4 hover:underline">
              Contact
            </a>
            <a href="/blog/ats" className="underline-offset-4 hover:underline">
              Helpful Guides: ATS CV Hub
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready for an ATS-Ready CV?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target role, and we'll rewrite it with ATS-friendly structure and human review.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                <a href={getMyAtsCvUrl} target="_blank" rel="noopener noreferrer">
                  Get My ATS CV
                </a>
              </Button>
              <Button
                size="lg"
                className="min-h-12 w-full border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary sm:flex-1"
                asChild
              >
                <a href={`/${selectedRegion.code}/contact`}>Get a Free CV Review</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
