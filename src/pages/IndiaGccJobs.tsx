import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Compass, FileCheck2, Linkedin, MapPin, ScanSearch, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import indiaGccCareerPathway from "@/assets/india-gcc-career-pathway-v1.jpg";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const WHATSAPP_MESSAGE = "Hi BrandMyProfile, I'm in India and targeting GCC jobs. I need help preparing my CV and career profile.";

const countryPathways = [
  {
    name: "Kuwait",
    note: "Kuwait's hiring spans oil & gas, engineering, construction, finance, healthcare, IT and logistics, across private, semi-government and multinational employers.",
    cvPath: "/kuwait/services/cv-writing",
    gccPath: "/kuwait/services/gcc-cv",
  },
  {
    name: "UAE",
    note: "The UAE's job market is highly international, with multinational employers concentrated in finance, technology, hospitality and professional services across Dubai and Abu Dhabi.",
    cvPath: "/uae/services/cv-writing",
    gccPath: "/uae/services/gcc-cv",
  },
  {
    name: "Saudi Arabia",
    note: "Saudi Arabia's hiring spans engineering, construction, healthcare, technology and large-scale project sectors, with a growing mix of national and international employers.",
    cvPath: "/saudi/services/cv-writing",
    gccPath: "/saudi/services/gcc-cv",
  },
  {
    name: "Qatar",
    note: "Qatar's market centers on energy, engineering, infrastructure, hospitality and professional services, drawing from a competitive, internationally connected talent pool.",
    cvPath: "/qatar/services/cv-writing",
    gccPath: "/qatar/services/gcc-cv",
  },
];

const industryPathways = [
  { label: "Engineering CV for GCC Jobs", path: "/india/cv-writing/engineering-gcc" },
  { label: "Technology CV for GCC Jobs", path: "/india/cv-writing/technology-gcc" },
  { label: "Finance CV for GCC Jobs", path: "/india/cv-writing/finance-gcc" },
];

const servicePaths = [
  { label: "Professional CV Writing in India", path: "/india/services/cv-writing" },
  { label: "ATS CV Writing", path: "/india/services/ats-cv" },
  { label: "GCC CV Writing", path: "/india/services/gcc-cv" },
  { label: "LinkedIn Profile Optimization", path: "/india/services/linkedin-makeover" },
  { label: "Career Guidance", path: "/india/services/career-guidance" },
];

const scamSafetyPoints = [
  "Verify the employer's identity and official channels before sharing personal documents",
  "Confirm the job posting through the company's own careers page where possible",
  "Be cautious of unsolicited offers or roles that seem unusually easy to secure",
  "Never pay upfront fees to a recruiter or agency to \"process\" an application or visa",
  "Avoid sending sensitive identity documents until you've verified the employer or agency is legitimate",
];

const faqs = [
  {
    question: "How can I apply for GCC jobs from India?",
    answer:
      "Start by choosing a target country and role, tailor your CV and LinkedIn profile for that market, and apply through verified company career pages or licensed recruitment agencies. The steps above walk through this in more detail.",
  },
  {
    question: "Do I need GCC experience?",
    answer:
      "Not necessarily. GCC experience can be valuable to some employers, but candidates without it can still strengthen their application by showing relevant industry experience, transferable skills and measurable achievements.",
  },
  {
    question: "Should my CV mention relocation readiness?",
    answer:
      "Yes. Stating your relocation readiness, notice period and target country clearly helps GCC recruiters quickly assess your availability.",
  },
  {
    question: "Can I use the same CV for all Gulf countries?",
    answer:
      "A strong core CV can be reused, but adjusting keywords, emphasis and availability details for each specific country tends to produce stronger results than sending one identical CV everywhere.",
  },
  {
    question: "How should I show my current location?",
    answer:
      "State your city and country clearly in your contact details, and mention your relocation readiness in your summary if you're applying from outside the target country.",
  },
  {
    question: "What is the difference between ATS CV and GCC CV?",
    answer:
      "ATS optimization focuses on machine-readable structure and keyword alignment, while GCC formatting focuses on presentation and market relevance for Gulf employers. Many CVs benefit from both.",
  },
];

export default function IndiaGccJobs() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const hub = content.gccJobsHub;

  if (!hub) {
    return null;
  }

  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGE);
  const canonicalUrl = "https://www.brandmyprofile.com/india/gcc-jobs";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        name: "How to Prepare for GCC Jobs from India",
        description: hub.metaDescription,
        url: canonicalUrl,
        isPartOf: { "@id": websiteSchema["@id"] },
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
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
        title={hub.metaTitle}
        description={hub.metaDescription}
        keywords="gcc jobs from india, gulf jobs from india, how to get a job in gcc from india, apply for gulf jobs from india, cv for gcc jobs from india"
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: "/india" },
          { label: "India", path: "/india" },
          { label: "GCC Jobs" },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-teal-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)]">
          <div className="section-container grid items-center gap-12 py-16 lg:min-h-[690px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-16">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                India → GCC Career Pathway
              </p>
              <h1 className="font-serif text-[clamp(2.35rem,6.5vw,4rem)] font-semibold leading-[1.05] tracking-normal">
                How to Prepare for GCC Jobs from India
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                A practical career-application guide for Indian professionals targeting Kuwait, UAE, Saudi Arabia, Qatar and
                other Gulf markets - covering CV positioning, ATS readiness, LinkedIn and application strategy.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Get My Free CV Review
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href="/india/services/gcc-cv">Explore GCC CV Writing</a>
                </Button>
              </div>
              <p className="mt-5 max-w-2xl border-l-2 border-primary/20 pl-3 text-sm leading-6 text-muted-foreground">
                BrandMyProfile helps with CV writing, ATS optimization, GCC-format CVs, LinkedIn and career guidance. We are
                not a recruitment, visa or immigration agency and do not place candidates in jobs.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] pb-7 lg:mx-0 lg:max-w-none">
              <div className="absolute -right-8 top-10 h-44 w-44 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="relative h-[470px] overflow-hidden rounded-[2rem] border border-white/80 bg-primary shadow-[0_30px_80px_-42px_hsl(var(--primary)/0.62)] sm:h-[540px]">
                <img
                  src={indiaGccCareerPathway}
                  alt="Indian professional planning applications for GCC career opportunities"
                  width="1122"
                  height="1402"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[48%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
                  <Compass className="h-4 w-4" aria-hidden="true" /> India → GCC Career Plan
                </span>
              </div>

              <div className="absolute bottom-0 left-3 z-10 w-[min(90%,380px)] overflow-hidden rounded-[1.25rem] border border-primary/15 bg-white shadow-[0_22px_54px_-26px_hsl(var(--primary)/0.65)] sm:-left-5">
                <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">Target GCC Markets</p>
                    <p className="mt-0.5 text-sm font-semibold sm:text-base">Build a focused application pathway</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {["Kuwait", "UAE", "Saudi Arabia", "Qatar"].map((country) => (
                      <span key={country} className="rounded-full bg-[hsl(var(--surface-teal-soft))] px-3 py-1.5 text-[11px] font-bold text-primary">
                        {country}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-muted-foreground">CV positioning · ATS readiness · LinkedIn · Applications</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Answer */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">How can I prepare for GCC jobs from India?</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Start by choosing your target GCC country and role, then tailor your CV with role-specific keywords and a clear
              structure that reads well to both recruiters and applicant tracking systems. State your current location and
              relocation readiness clearly, strengthen your LinkedIn profile, and apply through verified company and
              recruiter channels. Prepare for interviews with specific, measurable examples - no service can guarantee a job
              offer.
            </p>
          </div>
        </motion.section>

        {/* Is GCC the right target market */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Is GCC the Right Target Market?</p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              The GCC includes Kuwait, the UAE, Saudi Arabia, Qatar, Bahrain and Oman, each with different industries,
              employer types and hiring practices. Many Indian professionals successfully build careers across these
              markets, particularly in engineering, technology, finance, construction, healthcare and hospitality. Outcomes
              always depend on your specific experience, target role and the current hiring environment - we don't guarantee
              placement, interviews or job offers.
            </p>
          </div>
        </motion.section>

        {/* Country pathways */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Choose Your Target Country</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">GCC Country Pathways</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A quick starting point for each market - explore the relevant CV service for more detail.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {countryPathways.map((country) => (
                <article key={country.name} className="rounded-[1.35rem] border border-border bg-background p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold tracking-normal">{country.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{country.note}</p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-primary">
                    <a href={country.cvPath} className="underline-offset-4 hover:underline">
                      CV Writing in {country.name}
                    </a>
                    <a href={country.gccPath} className="underline-offset-4 hover:underline">
                      GCC CV Format for {country.name}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Prepare your CV + ATS */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <FileCheck2 className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Prepare Your CV</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Present your experience using internationally readable job titles, lead with measurable achievements rather
                than task lists, and state your target market clearly. Our{" "}
                <a href="/india/services/cv-writing" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Professional CV Writing in India
                </a>{" "}
                service can help you build this from the ground up.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <ScanSearch className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">ATS Considerations</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Many GCC employers, particularly multinationals, use applicant tracking systems to screen high volumes of
                applications. A clean, single-column structure with role-specific keywords helps ensure your CV is read
                correctly before a recruiter reviews it. Need deeper ATS optimization?{" "}
                <a href="/india/services/ats-cv" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Explore ATS CV Writing.
                </a>
              </p>
            </div>
          </div>
        </motion.section>

        {/* LinkedIn + where to search */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <Linkedin className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">LinkedIn Positioning</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Recruiters sourcing candidates from India for GCC roles often search LinkedIn directly. A clear headline
                stating your target role and market, and consistent keyword use across your experience section, helps you
                surface in relevant searches. Explore{" "}
                <a href="/india/services/linkedin-makeover" className="font-semibold text-primary underline-offset-4 hover:underline">
                  LinkedIn Profile Optimization
                </a>
                .
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background p-7">
              <Compass className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Where to Search for Roles</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Look for opportunities through official company career pages, established recruitment platforms, and
                licensed recruitment agencies with a verifiable track record, rather than relying only on informal channels.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Relocation / location + interview prep */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Location, Relocation &amp; Interviews</p>
            <h2 className="mt-4 font-serif font-semibold tracking-normal">Presenting Your Availability Clearly</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              State your current location, notice period and relocation readiness clearly near the top of your CV. Include
              your work-authorization status only if genuinely relevant and known to you - never include sensitive personal
              data such as your passport number, civil ID number or full home address. When you reach the interview stage,
              prepare specific, measurable examples from your experience and be ready to discuss your availability and
              relocation timeline factually.
            </p>
            <p className="mt-5 rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted-foreground">
              BrandMyProfile provides career-document and application guidance, not immigration or legal advice. Candidates
              should confirm visa and work-authorization requirements with official authorities or qualified professionals.
            </p>
          </div>
        </motion.section>

        {/* Scam awareness */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-[1.5rem] border border-border bg-background p-7">
              <ShieldAlert className="mt-1 h-7 w-7 shrink-0 text-accent" />
              <div>
                <h3 className="text-lg font-semibold tracking-normal">Avoiding Job Scams</h3>
                <ul className="mt-4 space-y-2">
                  {scamSafetyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Industry pathways */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Industry Paths</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">CV Support for Your Target Industry</h2>
            </div>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4">
              {industryPathways.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm underline-offset-4 hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Service path + blog */}
        <section className="section-padding border-y border-border bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Relevant BrandMyProfile Services</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Get Support at Every Stage</h2>
            </div>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
              {servicePaths.map((item) => (
                <a key={item.path} href={item.path} className="underline-offset-4 hover:underline">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mx-auto mt-8 max-w-2xl rounded-[1.25rem] border border-primary/15 bg-[hsl(var(--surface-warm))] p-6 text-center">
              <p className="text-sm leading-6 text-muted-foreground">
                Want deeper, step-by-step guides - target country research, industry positioning, ATS and interview
                preparation?
              </p>
              <a
                href="/blog/india-gcc"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Explore the India to GCC Careers Guide Hub
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Start</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">GCC Jobs from India FAQs</h2>
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

        {/* Final CTA */}
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready to Prepare Your GCC Application?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target country, and we'll help you rewrite it with clear, GCC-ready positioning.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Get My Free CV Review
                </a>
              </Button>
              <Button
                size="lg"
                className="min-h-12 w-full border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary sm:flex-1"
                asChild
              >
                <a href="/india/services/gcc-cv">Explore GCC CV Writing</a>
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
