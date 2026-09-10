import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, FileCheck2, Globe2, Languages, Linkedin, ScanSearch, ShieldAlert } from "lucide-react";
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
import indiaEuropeCareerPathway from "@/assets/india-europe-career-pathway-v1.jpg";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const WHATSAPP_MESSAGE =
  "Hi BrandMyProfile, I'm in India and targeting European/international opportunities. I need help with my CV and application profile.";

const servicePaths = [
  { label: "Professional CV Writing in India", path: "/india/services/cv-writing" },
  { label: "Europass CV Writing", path: "/india/services/europass-cv" },
  { label: "ATS CV Writing", path: "/india/services/ats-cv" },
  { label: "LinkedIn Profile Optimization", path: "/india/services/linkedin-makeover" },
  { label: "Career Guidance", path: "/india/services/career-guidance" },
];

const scamSafetyPoints = [
  "Verify the employer's or institution's identity through official channels before sharing personal documents",
  "Confirm job or programme listings through the organization's own website where possible",
  "Be cautious of unsolicited offers or opportunities that seem unusually easy to secure",
  "Never pay upfront fees to an agency to \"guarantee\" a placement or visa",
  "Avoid sending sensitive identity documents until you've verified legitimacy",
];

const faqs = [
  {
    question: "Is Europass required for European jobs?",
    answer:
      "No. Europass is not universally required - some employers, institutions or programmes request or prefer it, while many private-sector employers accept standard professional CVs.",
  },
  {
    question: "Can I apply for jobs in Europe from India?",
    answer:
      "Yes, many Indian professionals apply directly to European employers, institutions and programmes from India. Requirements vary by country, role and employer, so it's worth researching the specific application process for your target market.",
  },
  {
    question: "Should I use a Europass CV or professional CV?",
    answer:
      "It depends on what your target employer, institution or programme requests. Use Europass if it's specifically required or preferred; otherwise, a professional CV tailored to the role may present your experience more effectively.",
  },
  {
    question: "How should I show Indian qualifications?",
    answer:
      "Present your degrees, certifications and job titles using internationally readable terms, so they're clearly understood by European recruiters unfamiliar with India-specific naming conventions.",
  },
  {
    question: "Should my CV mention work authorization?",
    answer:
      "You can mention your work-authorization or visa status factually if relevant and known, though we don't provide immigration or legal advice - confirm specific requirements with official authorities or a qualified professional.",
  },
  {
    question: "Can I use one CV for every European country?",
    answer:
      "A strong core CV can be reused, but adjusting language, terminology and format to match each employer's or country's specific expectations tends to produce stronger applications.",
  },
];

export default function IndiaEuropeJobs() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const hub = content.europeJobsHub;

  if (!hub) {
    return null;
  }

  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_MESSAGE);
  const canonicalUrl = "https://www.brandmyprofile.com/india/europe-jobs";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        name: "Preparing for European Jobs from India",
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
        keywords="europe jobs from india, how to apply for jobs in europe from india, european jobs for indian professionals, cv for european jobs from india, europass cv for europe"
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: "/india" },
          { label: "India", path: "/india" },
          { label: "European Jobs" },
        ]}
      />
      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-pink-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)]">
          <div className="section-container grid items-center gap-12 py-16 lg:min-h-[690px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:py-16">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                India → Europe Career Pathway
              </p>
              <h1 className="font-serif text-[clamp(2.35rem,6.5vw,4rem)] font-semibold leading-[1.05] tracking-normal">
                Preparing for European Jobs from India
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Career-application guidance for Indian professionals targeting European and international opportunities,
                including professional CVs, Europass, ATS optimization and LinkedIn positioning.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Get My Free CV Review
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href="/india/services/europass-cv">Explore Europass CV</a>
                </Button>
              </div>
              <p className="mt-5 max-w-2xl border-l-2 border-primary/20 pl-3 text-sm leading-6 text-muted-foreground">
                BrandMyProfile helps with CV writing, Europass CVs, ATS optimization, LinkedIn and career guidance. We are
                not a recruitment, visa or immigration agency and do not place candidates in jobs.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] pb-7 lg:mx-0 lg:max-w-none">
              <div className="absolute -right-8 top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="relative h-[470px] overflow-hidden rounded-[2rem] border border-white/80 bg-primary shadow-[0_30px_80px_-42px_hsl(var(--primary)/0.62)] sm:h-[540px]">
                <img
                  src={indiaEuropeCareerPathway}
                  alt="Indian professional planning applications for European career opportunities"
                  width="1122"
                  height="1402"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[54%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
                  <Globe2 className="h-4 w-4" aria-hidden="true" /> India → Europe Career Plan
                </span>
              </div>

              <div className="absolute bottom-0 left-3 z-10 w-[min(90%,380px)] overflow-hidden rounded-[1.25rem] border border-primary/15 bg-white shadow-[0_22px_54px_-26px_hsl(var(--primary)/0.65)] sm:-left-5">
                <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                    <Languages className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">Example European Markets</p>
                    <p className="mt-0.5 text-sm font-semibold sm:text-base">Prepare a country-focused application</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {["Germany", "Netherlands", "Ireland", "France"].map((country) => (
                      <span key={country} className="rounded-full bg-[hsl(var(--surface-teal-soft))] px-3 py-1.5 text-[11px] font-bold text-primary">
                        {country}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-muted-foreground">Professional CV · Europass · ATS · LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Answer */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">
              How should Indian professionals prepare for European job applications?
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Start by following the specific employer, institution or programme's format instructions - Europass isn't
              required everywhere. Choose the CV format that fits the request, translate your qualifications into
              internationally readable terms, and keep your structure ATS-friendly. Strengthen your LinkedIn profile, and
              state your language skills and relocation or work-authorization status factually where relevant. No service
              can guarantee a job offer.
            </p>
          </div>
        </motion.section>

        {/* Choose country and role + employer instructions */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <Globe2 className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Choose Your Target Country and Role</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                European hiring practices, application portals and expected formats vary by country and sector. Rather than
                applying broadly to "Europe," researching the specific country, role and employer type you're targeting
                tends to produce more focused, effective applications.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <FileCheck2 className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Understand Employer Instructions</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Many applications specify a required or preferred format directly in the job posting or programme
                guidelines. Always follow the explicit instructions given, rather than assuming Europass or a standard CV
                is the default choice.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Europass vs professional CV */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Choose Europass vs. Professional CV</p>
            <h2 className="mt-4 font-serif font-semibold tracking-normal">Neither Format Is Universally Better</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Europass is a standardized format that can be useful when specifically requested - for example by EU
              institutions, academic programmes, or some employers. A professional CV offers more flexibility and stronger
              personal branding for most private-sector applications. Many European private-sector roles may use standard
              professional CV formats rather than Europass.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-primary">
              <a href="/india/services/europass-cv" className="underline-offset-4 hover:underline">
                Explore Europass CV Writing
              </a>
              <a href="/india/services/cv-writing" className="underline-offset-4 hover:underline">
                Explore Professional CV Writing
              </a>
            </div>
          </div>
        </motion.section>

        {/* ATS + LinkedIn */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <ScanSearch className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">ATS Considerations</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                ATS-friendly structure is a separate consideration from Europass or standard CV formatting. Many employers,
                including in Europe, use applicant tracking systems to manage applications, so clean, structured formatting
                matters regardless of which format you ultimately choose. Explore{" "}
                <a href="/india/services/ats-cv" className="font-semibold text-primary underline-offset-4 hover:underline">
                  ATS CV Writing
                </a>
                .
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <Linkedin className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">LinkedIn &amp; Personal Branding</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Many European recruiters and hiring teams review LinkedIn profiles alongside a CV. A clear headline stating
                your role and target market, and consistent keyword use, helps your profile read clearly to an
                international audience. Explore{" "}
                <a href="/india/services/linkedin-makeover" className="font-semibold text-primary underline-offset-4 hover:underline">
                  LinkedIn Profile Optimization
                </a>
                .
              </p>
            </div>
          </div>
        </motion.section>

        {/* Qualifications + language/relocation */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Qualifications, Language &amp; Relocation</p>
            <h2 className="mt-4 font-serif font-semibold tracking-normal">Making Your Application Read Clearly</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Present your Indian degrees, certifications and job titles using internationally readable terms, so they're
              clearly understood by employers unfamiliar with India-specific naming conventions. State your language
              skills clearly, including English and any others you speak. You can also mention relocation readiness and
              work-authorization status factually where relevant and known to you.
            </p>
            <p className="mt-5 rounded-xl border border-border bg-[hsl(var(--surface-warm))] p-4 text-sm leading-6 text-muted-foreground">
              BrandMyProfile provides career-document and application guidance, not immigration or legal advice. Candidates
              should confirm visa and work-authorization requirements with official authorities or qualified professionals.
              Avoid including sensitive personal data such as passport numbers or full home addresses on your CV.
            </p>
          </div>
        </motion.section>

        {/* Application channels + scam awareness */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <Languages className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Application Channels</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Apply through official employer or institution websites, verified recruitment platforms, and established
                programme or scholarship portals, rather than relying only on informal or third-party channels.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-white p-7">
              <ShieldAlert className="h-7 w-7 text-accent" />
              <h3 className="mt-5 text-lg font-semibold tracking-normal">Scam Awareness</h3>
              <ul className="mt-3 space-y-2">
                {scamSafetyPoints.map((point) => (
                  <li key={point} className="text-sm leading-6 text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Service path + blog */}
        <section className="section-padding border-y border-border bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">BrandMyProfile Services</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Get Support at Every Stage</h2>
            </div>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
              {servicePaths.map((item) => (
                <a key={item.path} href={item.path} className="underline-offset-4 hover:underline">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mx-auto mt-8 max-w-2xl rounded-[1.25rem] border border-primary/15 bg-[hsl(var(--surface-pink-soft))] p-6 text-center">
              <p className="text-sm leading-6 text-muted-foreground">
                Want a deeper walkthrough of what Europass is, when it's useful, and how it compares to a professional CV?
              </p>
              <a
                href="/blog/europass-cv-guide-india"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Read the Full Europass CV Guide for Indian Job Seekers
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
                <h2 className="mt-4 font-serif font-semibold tracking-normal">European Jobs from India FAQs</h2>
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
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready to Prepare Your European Application?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target application, and we'll help you choose and prepare the right format.
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
                <a href="/india/services/europass-cv">Explore Europass CV</a>
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
