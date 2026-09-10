import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileText,
  GraduationCap,
  Languages,
  MessageCircle,
  ShieldCheck,
  UserRoundCheck,
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

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const trustItems = [
  "500+ Professionals Supported",
  "Human Written & Reviewed",
  "International Application Support",
  "Confidential Service",
];

const useEuropassWhen = [
  "An employer, institution or programme specifically requests it",
  "You're applying to an EU institution, agency or public-sector role",
  "You're applying for an academic programme, scholarship or exchange (e.g. Erasmus+)",
  "An application portal is built around the Europass format",
];

const useProfessionalCvWhen = [
  "The employer hasn't requested a specific format",
  "You're applying to most private-sector roles",
  "You want more flexibility to highlight specific achievements",
  "A recruiter is sourcing or submitting your application directly",
];

const comparisonRows = [
  { label: "Structure", europass: "Fixed, standardized sections defined by the Europass platform", professional: "Flexible structure tailored to the role and industry" },
  { label: "Customization", europass: "Limited - fields and order are largely fixed", professional: "Highly customizable to highlight specific strengths" },
  { label: "Visual flexibility", europass: "Minimal - a consistent, plain template", professional: "Can be designed for visual clarity and impact" },
  { label: "Best use case", europass: "Institutions, programmes or employers that specifically request it", professional: "Most private-sector roles and recruiter-led applications" },
  { label: "Target applications", europass: "EU-facing academic, public-sector or programme applications", professional: "Broad range of national and international employers" },
  { label: "Length flexibility", europass: "Structured, and can run longer due to fixed sections", professional: "Adjustable, typically one to two pages" },
  { label: "ATS considerations", europass: "Parsing depends on how the exported file is formatted", professional: "Can be built with ATS-friendly formatting as standard" },
  { label: "Personal branding", europass: "Limited room for personal positioning", professional: "Stronger opportunity to communicate personal brand and achievements" },
];

const includeChecklist = [
  "Personal details and contact information",
  "Work experience in reverse chronological order",
  "Education and training history",
  "Self-assessed language proficiency levels",
  "Digital skills",
  "Certifications and qualifications",
  "Optional sections (driving licence, volunteering, publications) where relevant",
  "A personal statement or profile section",
];

const commonMistakes = [
  "Treating Europass as mandatory when the employer never requested it",
  "Leaving sections generic instead of tailoring content to the target role",
  "Overstating language-proficiency self-assessment levels",
  "Submitting a Europass CV to an employer who has explicitly asked for another format",
  "Not checking the exported PDF's formatting before submitting it",
];

const indiaToEuropePoints = [
  "Specify the target country and role you're applying for",
  "Follow the employer or programme's stated format instructions",
  "Translate Indian qualification and degree names into internationally readable terms",
  "Present job titles in a way that reads clearly to European employers",
  "State your language skills clearly, including English and any others",
  "Mention relocation or work-authorization intentions factually, without legal claims",
  "Lead with measurable achievements rather than task lists",
  "Choose Europass or a professional CV based on what's actually requested",
];

const deliverItems = [
  { title: "Structured Europass Sections", description: "Your experience, education and skills organized into the standard Europass structure.", icon: FileCheck2 },
  { title: "Language Skills Guidance", description: "Support in describing your language proficiency levels accurately.", icon: Languages },
  { title: "Qualification Mapping", description: "Indian degrees and certifications presented in internationally readable terms.", icon: GraduationCap },
  { title: "Achievement-Focused Content", description: "Work experience written around measurable outcomes, not just responsibilities.", icon: FileText },
  { title: "Accurate Formatting", description: "Personal details and sections formatted cleanly for export and submission.", icon: ShieldCheck },
  { title: "Human Review", description: "Every CV is reviewed by a person before it's delivered to you.", icon: UserRoundCheck },
];

const processSteps = [
  { number: "01", title: "Share Your CV & Target", description: "Send your current CV and the programme, institution or employer you're applying to." },
  { number: "02", title: "Europass Structure Review", description: "We review your background against the standard Europass sections and requirements." },
  { number: "03", title: "Prepare & Structure", description: "Your Europass CV is prepared with accurate, achievement-focused content." },
  { number: "04", title: "Human Review & Delivery", description: "A final human review checks clarity and formatting before delivery." },
];

const audiences = [
  { title: "Institution & Programme Applicants", description: "Applying to EU-affiliated institutions, agencies or exchange programmes." },
  { title: "Academic & Scholarship Applicants", description: "Preparing applications where Europass is requested or expected." },
  { title: "Employer-Requested Format", description: "Your target employer has specifically asked for a Europass CV." },
];

const faqs = [
  {
    question: "What is a Europass CV?",
    answer:
      "A Europass CV is a standardized CV format supported by the European Union's Europass platform. It provides a structured way to present work experience, education, skills and qualifications. It can be useful when an employer, institution or programme requests Europass, but it is not a universal requirement for all jobs in Europe.",
  },
  {
    question: "Is Europass required for European jobs?",
    answer:
      "No. Europass is not universally required for jobs across Europe. Some employers, public institutions, educational programmes or application processes may request or prefer it, while many private-sector employers accept or prefer other professional CV formats.",
  },
  {
    question: "Should I use Europass or a professional CV?",
    answer:
      "It depends on what your target employer, institution or programme requests. If Europass is specifically required or preferred, use it; otherwise, a professional CV tailored to the role may present your experience more effectively.",
  },
  {
    question: "Can BrandMyProfile help me choose the right format?",
    answer:
      "Yes. We can help you decide whether Europass or a professional CV format is more appropriate for your specific target application, based on what's actually requested.",
  },
  {
    question: "Do you provide visa or immigration assistance?",
    answer:
      "No. We prepare Europass and professional CVs. We do not provide visa, immigration or legal services, and we cannot guarantee application or employment outcomes.",
  },
];

export default function EuropassCV() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const europass = content.europassCv;

  if (!europass) {
    return null;
  }

  const createMyEuropassCvUrl = buildWhatsAppUrl(europass.whatsappMessage);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://www.brandmyprofile.com/india/services/europass-cv#service",
        name: "Europass CV Writing",
        description: europass.metaDescription,
        provider: { "@id": organizationSchema["@id"] },
        areaServed: { "@type": "Country", name: "India" },
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": "https://www.brandmyprofile.com/india/services/europass-cv#faq",
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
        title={europass.metaTitle}
        description={europass.metaDescription}
        keywords="europass cv writing india, europass cv india, europass cv for indian professionals, european cv format india, cv for european jobs from india"
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "Europass CV Writing" },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-pink-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)]">
          <div className="section-container py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                {europass.eyebrow}
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,7vw,4.25rem)] font-semibold leading-[1.03] tracking-normal">
                {europass.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{europass.heroSubtext}</p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-primary">
                {trustItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" asChild>
                  <a href={createMyEuropassCvUrl} target="_blank" rel="noopener noreferrer">
                    Create My Europass CV
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href={`/${selectedRegion.code}/contact`}>Get a Free CV Review</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AEO: What is a Europass CV? */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">What is a Europass CV?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{faqs[0].answer}</p>
          </div>
        </motion.section>

        {/* AEO: Is Europass required? */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">Is Europass required for European jobs?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{faqs[1].answer}</p>
          </div>
        </motion.section>

        {/* When to use Europass vs professional CV */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">When Should You Use Europass?</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choosing the Right Format for Your Application</h2>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border bg-background p-7">
                <h3 className="text-xl font-semibold tracking-normal">Europass May Be a Good Fit When...</h3>
                <ul className="mt-5 space-y-3">
                  {useEuropassWhen.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-background p-7">
                <h3 className="text-xl font-semibold tracking-normal">A Professional CV May Work Better When...</h3>
                <ul className="mt-5 space-y-3">
                  {useProfessionalCvWhen.map((item) => (
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

        {/* Europass vs Professional CV comparison */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Europass CV vs. Professional CV</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Neither Format Is Universally Better</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">The right choice depends on what your target application actually requires.</p>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-x-auto">
              <table className="w-full min-w-[620px] table-fixed border-collapse overflow-hidden rounded-[1.25rem] border border-border text-left">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="w-1/4 px-5 py-4 text-sm font-semibold">Area</th>
                    <th className="px-5 py-4 text-sm font-semibold">Europass CV</th>
                    <th className="px-5 py-4 text-sm font-semibold">Professional CV</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-background"}>
                      <th className="px-5 py-4 text-sm font-semibold">{row.label}</th>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.europass}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{row.professional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* What a Europass CV includes */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What a Europass CV Includes</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">The Standard Europass Sections</h2>
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

        {/* Common mistakes */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Common Europass Mistakes</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What to Avoid When Preparing Yours</h2>
            </div>
            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {commonMistakes.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Applying from India to Europe */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">Applying from India to European Opportunities?</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A few adjustments help your application read clearly to European employers, institutions or programmes. This is
                general CV guidance only - we don't provide visa, immigration or legal advice.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {indiaToEuropePoints.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* What we help you prepare */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What We Help You Prepare</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">A Europass CV Built Around Your Background</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Illustrative transformation */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative Example</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">See What Clearer Structuring Changes</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A generic example showing how clearer, achievement-focused wording improves a work-experience entry - not a
                real client's CV.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                <p className="text-lg leading-8 text-foreground">Worked at a software company handling different projects.</p>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">After</p>
                <p className="text-lg leading-8 text-foreground">
                  Contributed to software development projects as part of a cross-functional team, supporting design,
                  testing and delivery activities across the project lifecycle.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Process */}
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
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Built for Europass-Specific Applications</h2>
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

        {/* Related service: broader professional CV rewrite */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[1.5rem] border border-border bg-white p-7 text-center sm:flex-row sm:text-left">
              <div className="flex-1">
                <h3 className="text-lg font-semibold tracking-normal">Not Sure Europass Is the Right Format?</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  If your target employer hasn't requested Europass specifically, a professional CV rewrite may present your
                  experience more effectively.
                </p>
              </div>
              <a
                href={`/${selectedRegion.code}/services/cv-writing`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore Professional CV Writing
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* Pricing / enquiry path */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-border bg-[hsl(var(--surface-warm))] p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">Europass CV Pricing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Ask us for current Europass CV pricing, or view our CV packages for related professional CV support.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <a href={`/${selectedRegion.code}/pricing`}>View CV Packages</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={createMyEuropassCvUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Ask for Pricing
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Start</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Europass CV FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-border bg-white p-5">
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
        <section className="border-y border-border bg-white py-10">
          <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
            <a href={`/${selectedRegion.code}/services/cv-writing`} className="underline-offset-4 hover:underline">
              Professional CV Writing
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
            <a href="/blog/europass-cv-guide-india" className="underline-offset-4 hover:underline">
              Europass CV Guide for Indian Job Seekers
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready to Prepare Your Europass CV?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target application, and we'll help you prepare a clear, structured Europass CV.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                <a href={createMyEuropassCvUrl} target="_blank" rel="noopener noreferrer">
                  Create My Europass CV
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
