import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CheckCircle2, ChevronDown, MessageCircle, ScanSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotFound from "@/pages/NotFound";
import { useRegion } from "@/contexts/RegionContext";
import { getIndustryPage, sharedIndustryFaqs } from "@/lib/data/industryContent";
import { organizationSchema } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const trustItems = ["500+ Professionals Supported", "Human Written & Reviewed", "Confidential Support"];

// Shared template for the 8 approved industry landing pages (Unit 4A). Only the exact
// (region, slug) combinations in INDUSTRY_CV_WHITELIST (src/contexts/regionAvailability.ts)
// resolve here - RegionLayout already renders NotFound for anything else before this
// component even mounts, but the lookup below also defends against that directly.
export default function IndustryCV() {
  const { industry } = useParams<{ industry: string }>();
  const { selectedRegion } = useRegion();
  const page = getIndustryPage(selectedRegion.code, industry ?? "");

  if (!page) {
    return <NotFound />;
  }

  const whatsappUrl = buildWhatsAppUrl(page.whatsappMessage);
  const faqs = [...sharedIndustryFaqs, ...page.industryFaqs];
  const cvWritingHref = `/${page.region}/services/cv-writing`;
  const atsHref = `/${page.region}/services/ats-cv`;
  const gccHref = `/${page.region}/services/gcc-cv`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://www.brandmyprofile.com/${page.region}/cv-writing/${page.slug}#service`,
        name: page.serviceName,
        description: page.metaDescription,
        provider: { "@id": organizationSchema["@id"] },
        areaServed: { "@type": "Country", name: page.regionName },
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": `https://www.brandmyprofile.com/${page.region}/cv-writing/${page.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  const gccCta = (
    <a
      href={gccHref}
      className={
        page.gccEmphasis === "strong"
          ? "inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-accent-foreground shadow-sm hover:opacity-90"
          : "inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      }
    >
      Explore GCC CV Format
      {page.gccEmphasis === "strong" && <ArrowRight className="h-4 w-4" />}
    </a>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={`${page.h1.toLowerCase()}, cv writing for ${page.slug.replace("-", " ")} jobs, ${page.regionName.toLowerCase()} cv writing`}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${page.region}` },
          { label: page.regionName, path: `/${page.region}` },
          { label: "CV Writing", path: cvWritingHref },
          { label: page.industryLabel },
        ]}
      />
      <main>
        {/* Hero - max 2 CTAs */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_48%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                {page.eyebrow}
              </p>
              <h1 className="font-serif text-[clamp(2.35rem,6.5vw,4rem)] font-semibold leading-[1.05] tracking-normal">
                {page.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{page.heroSubtext}</p>
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
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Get My Free CV Review
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href={cvWritingHref}>Professional CV Writing</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Answer - AEO */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">{page.quickAnswer.question}</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{page.quickAnswer.answer}</p>
          </div>
        </motion.section>

        {/* Industry-specific CV priorities */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What Recruiters Need to Understand Quickly</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Industry-Specific CV Priorities</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{page.prioritiesIntro}</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {page.priorities.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Skills / competency positioning */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Skills &amp; Competency Positioning</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What to Bring to the Front of Your CV</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              {page.competencyPoints.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Common mistakes */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Common CV Mistakes</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What to Avoid</h2>
            </div>
            <div className="mx-auto mt-10 max-w-3xl space-y-3">
              {page.mistakes.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/60" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ATS considerations */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[1.5rem] border border-border bg-background p-7 text-center sm:flex-row sm:text-left">
              <ScanSearch className="h-8 w-8 shrink-0 text-primary" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold tracking-normal">ATS Considerations</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.atsNote}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Need deeper ATS optimization?{" "}
                  <a href={atsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
                    Explore ATS CV Writing.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* GCC / regional market considerations */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-white p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Regional Market Considerations</p>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">{page.regionalNote}</p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">Need guidance on GCC-specific CV structure?</p>
                </div>
                <div className="shrink-0">{gccCta}</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Illustrative example */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative Example</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">See What Clearer Positioning Changes</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A generic example showing how achievement-focused rewriting improves a bullet point - not a real client's CV.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                <p className="text-lg leading-8 text-foreground">{page.before}</p>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">After</p>
                <p className="text-lg leading-8 text-foreground">{page.after}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Role examples */}
        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-teal-soft))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Roles We Commonly Help Position</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Examples of Profiles This Guidance Can Apply To</h2>
            </div>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
              {page.roles.map((role) => (
                <span key={role} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* What BrandMyProfile helps with + process */}
        <section className="section-padding border-y border-border bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What BrandMyProfile Helps With</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">How It Works</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { number: "01", title: "Share Your CV & Target Role", description: `Send your current CV and the ${page.regionName} role you're targeting.` },
                { number: "02", title: "Industry Review", description: "We review your CV's current positioning against the priorities relevant to your industry." },
                { number: "03", title: "Rewrite & Structure", description: "Your CV is rewritten with clear structure, relevant terminology and achievement-focused content." },
                { number: "04", title: "Human Review & Delivery", description: "A final human review checks clarity before your finished CV is delivered." },
              ].map((step) => (
                <article key={step.number} className="rounded-[1.35rem] border border-border bg-background p-6">
                  <p className="font-serif text-5xl font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-8 text-xl font-semibold tracking-normal">{step.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / enquiry path */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-border bg-white p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">{page.serviceName} Pricing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Industry-specific CV support is included within our CV writing packages. View current pricing for {page.regionName}, or ask us directly.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild>
                  <a href={`/${page.region}/pricing`}>View CV Packages</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Ask for Pricing
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who this is for (roles reused as badges) */}
        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <BadgeCheck className="mx-auto h-7 w-7 text-accent" />
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                This guidance applies whether you're an early-career professional building your first industry-focused CV or an
                experienced candidate repositioning your CV for a new role in {page.regionName}.
              </p>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Start</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">{page.serviceName} FAQs</h2>
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

        {/* Related services + blog links */}
        <section className="border-y border-border bg-white py-10">
          <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
            <a href={cvWritingHref} className="underline-offset-4 hover:underline">
              Professional CV Writing
            </a>
            <a href={atsHref} className="underline-offset-4 hover:underline">
              ATS CV Writing
            </a>
            <a href={gccHref} className="underline-offset-4 hover:underline">
              GCC Format CV
            </a>
            <a href={`/${page.region}/pricing`} className="underline-offset-4 hover:underline">
              Pricing
            </a>
            <a href={`/${page.region}/contact`} className="underline-offset-4 hover:underline">
              Contact
            </a>
            {page.blogLinks.map((link) => (
              <a key={link.path} href={link.path} className="underline-offset-4 hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready for a Stronger {page.regionName} CV?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send your current CV and target role, and we'll rewrite it with clear structure, relevant terminology and human review.
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
                <a href={cvWritingHref}>Professional CV Writing</a>
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
