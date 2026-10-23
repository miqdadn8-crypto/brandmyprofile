import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileCheck2,
  FileText,
  Layers,
  ListChecks,
  MessageCircle,
  ScanSearch,
  Sparkles,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { organizationSchema } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const trustItems = [
  "500+ Professionals Supported",
  "Human Written & Reviewed",
  "GCC Market Focus",
  "Confidential Support",
];

const comparisonRows = [
  { label: "Personal Details", standard: "Name and contact details only", gcc: "May include a few extra details (location, visa status) depending on relevance" },
  { label: "Professional Summary", standard: "General career summary", gcc: "Summary positioned for GCC hiring expectations and target market" },
  { label: "Photo", standard: "Often optional", gcc: "May be included depending on employer or industry preference" },
  { label: "Nationality & Visa Status", standard: "Rarely included", gcc: "Sometimes included where relevant to availability" },
  { label: "Availability & Notice Period", standard: "Not always stated", gcc: "Often stated clearly, especially for relocating candidates" },
  { label: "Language Skills", standard: "Optional section", gcc: "Often highlighted, particularly English/Arabic where relevant" },
  { label: "Length", standard: "Typically 1-2 pages", gcc: "1-2 pages for most profiles; longer for senior or technical roles" },
  { label: "ATS Readability", standard: "Varies by design", gcc: "Best kept clean and ATS-friendly regardless of format" },
];

const includeChecklist = [
  "Clear professional summary aligned to your target role",
  "Consistent job titles and dates",
  "Achievement-focused experience bullets",
  "Role-specific keywords for your target market",
  "Straightforward, ATS-friendly structure",
  "Relevant skills and certifications",
  "Availability or notice period where relevant",
  "Accurate contact details and current location",
];

const mayIncludeDetails = ["Nationality", "Current location", "Visa / residency status", "Notice period", "Driving licence (where relevant to the role)", "Languages"];
const avoidUnlessNecessary = ["Passport number", "Civil ID number", "Full home address", "Religion", "Marital status"];

const positioningPoints = [
  "Lead with measurable achievements rather than task lists",
  "Use role-specific keywords drawn from the job description",
  "Present job titles in internationally recognizable terms",
  "Highlight cross-border, multinational or GCC-relevant experience where genuine",
];

const deliverItems = [
  { title: "GCC-Targeted Structure", description: "A CV structure positioned for how GCC employers actually review applications.", icon: Layers },
  { title: "Achievement-Focused Writing", description: "Experience reframed around measurable impact rather than task lists.", icon: Sparkles },
  { title: "Market-Relevant Positioning", description: "Your background presented in terms that make sense to your target GCC market.", icon: Target },
  { title: "Professional Summary", description: "A focused opening statement that positions your experience and target role clearly.", icon: FileText },
  { title: "Role-Specific Skills", description: "A prioritized skills section matched to your target role and industry.", icon: ListChecks },
  { title: "Experience Rewriting", description: "Clear, consistent job titles, dates and descriptions throughout your work history.", icon: Compass },
  { title: "ATS-Friendly Formatting", description: "Clean, standard formatting that stays readable to both recruiters and screening software.", icon: ScanSearch },
  { title: "Human Review", description: "Every CV is reviewed by a person, not generated and left unchecked.", icon: UserRoundCheck },
];

const processSteps = [
  { number: "01", title: "Share Your CV & Target Market", description: "Send your current CV and the GCC country or role you're targeting." },
  { number: "02", title: "GCC Positioning Review", description: "We review your CV's current positioning against GCC hiring expectations for your target market." },
  { number: "03", title: "Rewrite & Structure", description: "Your CV is rewritten with GCC-appropriate structure, relevant keywords and achievement-focused content." },
  { number: "04", title: "Human Review & Delivery", description: "A final human review checks clarity and positioning before your finished CV is delivered." },
];

const audiences = [
  { title: "GCC Job Seekers", description: "Currently applying to roles across Kuwait, UAE, Saudi Arabia or Qatar." },
  { title: "Relocating Professionals", description: "Moving into the GCC from another market and adapting to new hiring expectations." },
  { title: "International & Remote Applicants", description: "Applying to GCC employers from outside the region, including India." },
];

const sharedFaqs = [
  {
    question: "What is a GCC-format CV?",
    answer:
      "A GCC-format CV is a professional CV adapted for job applications in Gulf markets such as Kuwait, the UAE, Saudi Arabia and Qatar. It typically presents experience, skills, qualifications and availability clearly while considering regional hiring expectations. The exact format can vary by employer, industry and country, so there is no single mandatory GCC template.",
  },
  {
    question: "Should I include a photo on a GCC CV?",
    answer:
      "A professional photo may still appear on some CVs used in GCC markets, but it is not universally required. Employer expectations vary by country, industry and organization. Candidates applying to multinational companies or through recruitment systems that screen CVs automatically may prefer a cleaner, photo-free format unless the employer specifically requests one.",
  },
  {
    question: "How long should a GCC CV be?",
    answer:
      "One to two pages may suit early-career candidates. Two pages is common for experienced professionals. Longer CVs can be appropriate for highly technical, project-heavy or senior profiles where relevant experience needs documenting in more detail. There's no single universal rule - clarity matters more than an exact page count.",
  },
  {
    question: "Should I include nationality or visa status?",
    answer:
      "Some GCC applicants choose to include details like nationality, current location, visa or residency status, and notice period, since these can be relevant to employers assessing availability. These aren't universally required, though, so include only what's relevant to the specific application and that you're comfortable sharing.",
  },
  {
    question: "Can I use the same CV for all GCC countries?",
    answer:
      "A strong core CV can be reused, but your final application should be adjusted for the target country, role and employer. Keywords, professional summary, availability details and the balance of highlighted experience may change between Kuwait, UAE, Saudi Arabia and Qatar opportunities.",
  },
  {
    question: "Is a GCC CV ATS-friendly?",
    answer:
      "It can be. GCC positioning and ATS optimization solve different problems - GCC formatting focuses on market relevance and presentation, while ATS optimization focuses on machine-readable structure. We build GCC CVs using clean, ATS-friendly formatting as standard, and offer deeper ATS optimization as a separate, more technical service.",
  },
  {
    question: "Can I get a GCC job without previous GCC experience?",
    answer:
      "GCC experience can be valuable to some employers, but it isn't the only path in. Candidates without it can still strengthen their application by clearly showing relevant industry experience, transferable skills, measurable achievements, certifications, language skills and availability or relocation readiness. We can't guarantee interviews or job offers, but clear, well-positioned experience improves how an application reads.",
  },
];

export default function GCCCV() {
  const { openLeadModal } = useLeadModal();
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const gcc = content.gccCv;

  if (!gcc) {
    return null;
  }

  const getMyGccCvUrl = buildWhatsAppUrl(gcc.whatsappMessage);
  const faqs = [...sharedFaqs, ...gcc.regionFaqs];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/gcc-cv#service`,
        name: "GCC CV Writing",
        description: gcc.metaDescription,
        provider: { "@id": organizationSchema["@id"] },
        areaServed: { "@type": "Country", name: selectedRegion.name },
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/gcc-cv#faq`,
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
        title={gcc.metaTitle}
        description={gcc.metaDescription}
        keywords={`gcc cv format ${selectedRegion.name}, gulf cv format, cv for gulf jobs, gcc format cv, cv structure for gcc employers`}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "GCC CV Format" },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-teal-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)]">
          <div className="section-container py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                {gcc.eyebrow}
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,7vw,4.25rem)] font-semibold leading-[1.03] tracking-normal">
                {gcc.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{gcc.heroSubtext}</p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-primary">
                {trustItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" onClick={() => openLeadModal({ trigger: "service_page", service: "GCC CV" })}>
                    Get My Free CV Review
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href={`/${selectedRegion.code}/pricing`}>View CV Packages</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AEO direct answer: What is a GCC-format CV? */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">What is a GCC-format CV?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{sharedFaqs[0].answer}</p>
          </div>
        </motion.section>

        {/* GCC vs Standard CV comparison */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">GCC CV vs. Standard CV</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Where a GCC CV Genuinely Differs</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Differences are mostly about emphasis and a few optional details, not a completely different document.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-x-auto">
              <table className="w-full min-w-[620px] table-fixed border-collapse overflow-hidden rounded-[1.25rem] border border-border text-left">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="w-1/4 px-5 py-4 text-sm font-semibold">Area</th>
                    <th className="px-5 py-4 text-sm font-semibold">Standard Professional CV</th>
                    <th className="px-5 py-4 text-sm font-semibold">GCC-Targeted CV</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-background"}>
                      <th className="px-5 py-4 text-sm font-semibold">{row.label}</th>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.standard}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.gcc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* What a GCC CV should include */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What a GCC CV Should Include</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Core Elements of a Strong GCC CV</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {includeChecklist.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Regional market context */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-white p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Regional Market Context</p>
                  <h2 className="mt-4 font-serif font-semibold tracking-normal">{gcc.marketContextHeading}</h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-muted-foreground">{gcc.marketContextParagraph}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {gcc.industries.map((tag) => (
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

        {/* India-only: Applying from India to GCC jobs */}
        {gcc.indiaAngle && (
          <motion.section {...reveal} className="section-padding bg-white">
            <div className="section-container">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif font-semibold tracking-normal">{gcc.indiaAngle.heading}</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{gcc.indiaAngle.intro}</p>
              </div>
              <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
                {gcc.indiaAngle.guidance.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm font-semibold text-primary">
                <span className="text-muted-foreground">Explore GCC CV formatting for:</span>
                {gcc.indiaAngle.countryLinks.map((link) => (
                  <a key={link.code} href={`/${link.code}/services/gcc-cv`} className="underline-offset-4 hover:underline">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Personal details guidance */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Personal Details Guidance</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What Personal Details Should I Include?</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                GCC applicants sometimes include a few additional details beyond what's typical on a standard CV. What's relevant
                depends on the employer, role and your own comfort with sharing personal information - none of the items below
                are universally required.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-white p-7">
                <h3 className="text-xl font-semibold tracking-normal">May Be Relevant to Include</h3>
                <ul className="mt-5 space-y-3">
                  {mayIncludeDetails.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-white p-7">
                <h3 className="text-xl font-semibold tracking-normal">Avoid Unless Genuinely Necessary</h3>
                <ul className="mt-5 space-y-3">
                  {avoidUnlessNecessary.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground/60">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Length / structure + photo guidance */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Length &amp; Structure</p>
              <h2 className="mt-4 text-xl font-semibold tracking-normal sm:text-2xl">How long should a GCC CV be?</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{sharedFaqs[2].answer}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Photo Guidance</p>
              <h2 className="mt-4 text-xl font-semibold tracking-normal sm:text-2xl">Should I include a photo?</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{sharedFaqs[1].answer}</p>
            </div>
          </div>
        </motion.section>

        {/* Skills / experience positioning */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Skills &amp; Experience Positioning</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Positioning Your Experience for GCC Employers</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {positioningPoints.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Before / after example */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative Example</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">See What GCC Positioning Changes</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A generic example showing how clearer, achievement-focused positioning improves a bullet point - not a real
                client's CV.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                <p className="text-lg leading-8 text-foreground">Worked on many construction projects and handled site work.</p>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">After</p>
                <p className="text-lg leading-8 text-foreground">
                  Supported site execution across construction projects, coordinating daily activities, subcontractor
                  follow-ups, progress reporting and site documentation in line with project requirements.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What we deliver */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What We Deliver</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">A CV Built Around GCC Hiring Expectations</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deliverItems.map(({ title, description, icon: Icon }) => (
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

        {/* How it works */}
        <section className="section-padding border-y border-border bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How It Works</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article key={step.number} className="rounded-[1.35rem] border border-border bg-background p-6">
                  <p className="font-serif text-5xl font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-8 text-xl font-semibold tracking-normal">{step.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Who This Is For</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Built for How You're Applying to the GCC</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {audiences.map(({ title, description }) => (
                <div key={title} className="rounded-[1.35rem] border border-border bg-white p-6">
                  <BadgeCheck className="h-6 w-6 text-accent" />
                  <h3 className="mt-5 text-lg font-semibold tracking-normal">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Related services: ATS + Professional CV relationship */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <ScanSearch className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-xl font-semibold tracking-normal">Need Deeper ATS Optimization?</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                GCC positioning focuses on market relevance and presentation. ATS optimization focuses on machine-readable
                structure and keyword alignment for applicant tracking systems. If you need both, we can combine them.
              </p>
              <a
                href={`/${selectedRegion.code}/services/ats-cv`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore ATS CV Writing
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <FileCheck2 className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-xl font-semibold tracking-normal">Need a Broader Professional CV Rewrite?</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                If you want a complete professional CV rewrite rather than GCC-specific positioning, our Professional CV
                Writing service covers a full rewrite from the ground up.
              </p>
              <a
                href={`/${selectedRegion.code}/services/cv-writing`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore Professional CV Writing
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* Pricing / enquiry path */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-border bg-white p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">GCC CV Pricing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                GCC-format CV writing is included within our CV writing packages. View current pricing for {selectedRegion.name},
                or ask us directly for a recommendation.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <a href={`/${selectedRegion.code}/pricing`}>View CV Packages</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={getMyGccCvUrl} target="_blank" rel="noopener noreferrer">
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
                <h2 className="mt-4 font-serif font-semibold tracking-normal">GCC CV Format FAQs</h2>
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
        <section className="border-y border-border bg-[hsl(var(--surface-teal-soft))] py-10">
          <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
            <a href={`/${selectedRegion.code}/services/cv-writing`} className="underline-offset-4 hover:underline">
              Professional CV Writing
            </a>
            <a href={`/${selectedRegion.code}/services/ats-cv`} className="underline-offset-4 hover:underline">
              ATS CV Writing
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
            <a href="/blog/gcc-careers" className="underline-offset-4 hover:underline">
              Helpful Guides: GCC Careers Hub
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready for a GCC-Ready CV?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target market, and we'll rewrite it with GCC-appropriate structure and human review.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                <a href={getMyGccCvUrl} target="_blank" rel="noopener noreferrer">
                  Get My GCC CV
                </a>
              </Button>
              <Button
                size="lg"
                className="min-h-12 w-full border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary sm:flex-1"
                asChild
              >
                <a href={`/${selectedRegion.code}/contact`}>Get My Free CV Review</a>
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
