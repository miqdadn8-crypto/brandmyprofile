import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FilePenLine,
  FileText,
  Globe2,
  Linkedin,
  Mail,
  MessageCircle,
  PenLine,
  ScanSearch,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import RelatedServiceLinks from "@/components/RelatedServiceLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { useServiceData } from "@/hooks/useServiceData";
import { useRegion } from "@/contexts/RegionContext";
import { isRoutedPathAvailable } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";
import { industryContent } from "@/lib/data/industryContent";
import { organizationSchema } from "@/lib/seo/organization";
import { getServiceSeoDescription } from "@/config/pageSeo";
import { buildPackageEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import cvWritingProfessional from "@/assets/cv-writing-professional-v2.jpg";

const trustItems = [
  "ATS-Optimized",
  "Human Written",
  "Kuwait & GCC Focus",
  "Revision Support",
];

const rewriteComparisons = [
  {
    before: "Generic summary",
    after: "Targeted professional summary aligned to role and market",
  },
  {
    before: "Task-based bullets",
    after: "Achievement-focused bullets",
  },
  {
    before: "Weak ATS keywords",
    after: "Role-specific keyword optimization",
  },
];

const choiceReasons = [
  {
    title: "Kuwait & GCC Market Awareness",
    description: "CVs tailored around regional hiring expectations and target roles.",
    icon: Globe2,
  },
  {
    title: "Achievement-Focused Writing",
    description: "We convert responsibilities into stronger professional impact.",
    icon: Target,
  },
  {
    title: "Human Writing & Review",
    description: "No generic AI-only rewrite or automated template output.",
    icon: PenLine,
  },
  {
    title: "ATS-Friendly Structure",
    description: "Clean formatting and keyword strategy designed for applicant tracking systems.",
    icon: ScanSearch,
  },
  {
    title: "Revision Support",
    description: "Refine the draft until it accurately represents your experience.",
    icon: ShieldCheck,
  },
];

const deliverables = [
  "ATS-friendly formatting",
  "Role-specific keywords",
  "Achievement-focused content",
  "Professional summary",
  "Revision support",
  "Editable final document",
  "PDF final version",
];

const processSteps = [
  {
    number: "01",
    title: "Send Your Current CV",
    description: "Share your existing CV, even if it feels incomplete or outdated.",
  },
  {
    number: "02",
    title: "Tell Us Your Target Role",
    description: "We review your background, target market and role before rewriting your CV.",
  },
  {
    number: "03",
    title: "We Rewrite & Optimize",
    description: "A human writer restructures your content for clarity, ATS readability and recruiter review.",
  },
  {
    number: "04",
    title: "Review & Finalize",
    description: "You review the draft and request refinements based on the package revision policy.",
  },
];

const careerDocuments = [
  {
    title: "GCC Format CV",
    badge: "Popular for GCC Job Seekers",
    description:
      "A professionally structured CV tailored for candidates targeting employers across Kuwait, UAE, Saudi Arabia, Qatar, Bahrain and Oman.",
    benefits: [
      "GCC-focused positioning",
      "ATS-friendly structure",
      "Role-specific keywords",
      "Achievement-focused writing",
    ],
    cta: "Get My GCC CV",
    message:
      "Hello BrandMyProfile, I’m interested in a GCC-format CV. I am currently based in [country] and targeting opportunities in [target GCC country/industry]. Please share the process and pricing.",
    icon: Globe2,
    className:
      "lg:col-span-5 lg:row-span-2 bg-primary text-primary-foreground border-primary shadow-[0_22px_55px_-36px_hsl(var(--primary)/0.8)]",
    featured: true,
    servicePath: "services/gcc-cv",
    servicePathLabel: "Explore GCC CV Format",
  },
  {
    title: "ATS Professional CV",
    description:
      "A clean, keyword-optimized CV designed for online applications, recruitment systems and recruiter readability.",
    cta: "Get My ATS CV",
    message:
      "Hello BrandMyProfile, I need an ATS-optimized professional CV. Please share the process and pricing.",
    icon: ScanSearch,
    className: "lg:col-span-4 bg-[hsl(var(--surface-teal-soft))]",
    servicePath: "services/ats-cv",
    servicePathLabel: "Explore ATS CV Writing",
  },
  {
    title: "Professional CV",
    description:
      "A polished professional CV that presents your skills, experience and achievements clearly.",
    cta: "Enquire Now",
    message:
      "Hello BrandMyProfile, I’m interested in a professional CV. Please share the process and pricing.",
    icon: FileText,
    className: "lg:col-span-3 bg-white",
  },
  {
    title: "Europass CV",
    description:
      "A professionally prepared Europass-format CV for applications where the Europass format is requested or preferred.",
    cta: "Create My Europass CV",
    message:
      "Hello BrandMyProfile, I need a Europass CV for applications in Europe. Please share the requirements and pricing.",
    icon: FileCheck2,
    className: "lg:col-span-3 bg-white",
    servicePath: "services/europass-cv",
    servicePathLabel: "Explore Europass CV Writing",
  },
  {
    title: "Professional Cover Letter",
    description:
      "A role-focused cover letter that explains your experience, motivation and fit for the opportunity.",
    cta: "Get My Cover Letter",
    message:
      "Hello BrandMyProfile, I need a professional cover letter tailored to a role. Please share the process and pricing.",
    icon: Mail,
    className: "lg:col-span-4 bg-[hsl(var(--surface-pink-soft))]",
  },
  {
    title: "LinkedIn Profile Makeover",
    description:
      "Strengthen your headline, About section, experience and professional positioning for recruiter visibility.",
    cta: "Improve My LinkedIn",
    message:
      "Hello BrandMyProfile, I’m interested in a LinkedIn Profile Makeover. Please share the process and pricing.",
    icon: Linkedin,
    className: "lg:col-span-6 bg-[hsl(var(--surface-teal-soft))]",
    servicePath: "services/linkedin-makeover",
    servicePathLabel: "View LinkedIn service",
  },
  {
    title: "Professional Resignation Letter",
    description:
      "A clear and professionally written resignation letter appropriate for your situation and workplace.",
    cta: "Request on WhatsApp",
    message:
      "Hello BrandMyProfile, I need help preparing a professional resignation letter. Please share the process and pricing.",
    icon: FilePenLine,
    className: "lg:col-span-3 bg-white",
  },
  {
    title: "Need Something Else?",
    description:
      "Ask us about job application emails, motivation letters, professional bios and other career documents.",
    cta: "Ask on WhatsApp",
    message:
      "Hello BrandMyProfile, I need help with another career document. Please let me know what information you need and share the process and pricing.",
    icon: BriefcaseBusiness,
    className: "lg:col-span-3 bg-white",
  },
];

const packagePositioning: Record<string, string> = {
  basic: "Best for early-career professionals",
  pro: "Best for active job seekers",
  elite: "Best for senior/executive profiles",
};

const packageCtas: Record<string, string> = {
  basic: "Choose Essential",
  pro: "Choose Professional",
  elite: "Choose Executive",
};

interface PricingTierData {
  name: string;
  tier: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

interface CVServiceData {
  title: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  pricingTiers: PricingTierData[];
}

const getRevisionAnswer = (serviceData: CVServiceData) => {
  const revisionNotes = serviceData.pricingTiers
    .map((tier) => {
      const revisionFeature = tier.features.find((feature: string) => feature.toLowerCase().includes("revision"));
      return revisionFeature ? `${tier.name}: ${revisionFeature}` : null;
    })
    .filter(Boolean);

  if (!revisionNotes.length) {
    return "Yes. Revision support depends on the package you choose and is confirmed before work begins.";
  }

  return `Yes. Revision support follows the package policy: ${revisionNotes.join("; ")}.`;
};

const getLeadCountry = (regionName: string) => {
  if (regionName === "Saudi Arabia") return "Saudi";
  return regionName;
};

export default function CVWriting() {
  const { pricing, formatPrice, isLoading: priceLoading } = useRegionPricing("cv-writing");
  const { serviceData: rawServiceData, isLoading: dataLoading } = useServiceData("cv-writing");
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const regionCopy = getRegionContent(selectedRegion.code).servicePages["cv-writing"];
  const seoOverride = getRegionContent(selectedRegion.code).serviceSeo?.["cv-writing"];
  const industriesForRegion = industryContent.filter((entry) => entry.region === selectedRegion.code);
  const leadCountry = getLeadCountry(selectedRegion.name);
  const reviewMessage = `Hello BrandMyProfile, I'd like a free CV review for ${selectedRegion.name}. Please let me know how to send my CV.`;

  if (dataLoading || !rawServiceData) {
    return null;
  }

  const serviceData = rawServiceData as CVServiceData;

  const getTierPrice = (tierKey: string) => {
    if (priceLoading) return undefined;
    const price = formatPrice(tierKey);
    return price === "Price not available" ? undefined : price;
  };

  const faqs = [
    {
      question: "Is this just an AI rewrite?",
      answer: "No. Your CV is professionally reviewed and rewritten by a human.",
    },
    {
      question: "Can you tailor it to a specific role?",
      answer: "Yes. The content can be aligned to your target role, industry and market.",
    },
    {
      question: "Can I request revisions?",
      answer: getRevisionAnswer(serviceData),
    },
    {
      question: "Will this guarantee interviews?",
      answer:
        "No. No CV service can guarantee interviews, but a stronger CV can improve clarity, positioning and ATS compatibility.",
    },
    {
      question: "How do I send my CV?",
      answer: "Start a WhatsApp conversation or request a free review. We will share the next steps for sending your current CV securely.",
    },
  ];

  // Unit 7: was a single flat Service object with no stable @id, an inline ad-hoc
  // Organization duplicate (instead of referencing the one canonical organizationSchema
  // used everywhere else), bare-string areaServed codes region-invariant across all 5
  // regions, and no FAQPage schema despite the real FAQ rendered below. Restructured into
  // the same @graph shape ATSCV.tsx/GCCCV.tsx/EuropassCV.tsx/IndustryCV.tsx already use.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/cv-writing#service`,
        name: serviceData.seo.title,
        description: serviceData.seo.description,
        provider: { "@id": organizationSchema["@id"] },
        areaServed: { "@type": "Country", name: selectedRegion.name },
        offers: serviceData.pricingTiers.map((tier) => {
          const priceData = pricing?.[tier.tier];
          return {
            "@type": "Offer",
            name: tier.name,
            description: tier.description,
            ...(priceData ? { price: priceData.price, priceCurrency: priceData.currency } : {}),
          };
        }),
      },
      organizationSchema,
      {
        "@type": "FAQPage",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/cv-writing#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <SEO
        title={seoOverride?.metaTitle ?? `${serviceData.seo.title} in ${selectedRegion.name}`}
        description={seoOverride?.metaDescription ?? getServiceSeoDescription("cv-writing", selectedRegion.name)}
        keywords={serviceData.seo.keywords}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "CV Writing" },
        ]}
      />
      <main className="overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_46%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container grid min-h-[760px] items-center gap-12 py-16 lg:min-h-[820px] lg:grid-cols-[1fr_0.88fr] lg:py-20">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 max-w-full text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:text-sm sm:tracking-[0.22em]">
                Your experience deserves a CV that gets noticed
              </p>
              {/* Exact-match heading for "CV writing services in {country}" searches. */}
              <h1 className="max-w-full overflow-hidden font-serif text-[clamp(2.35rem,10.4vw,5.95rem)] font-semibold leading-[0.98] tracking-normal text-foreground sm:text-[clamp(3.35rem,7vw,5.95rem)]">
                <span className="block">CV Writing</span>
                <span className="block">Services in</span>
                <span className="block text-primary">{selectedRegion.name}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                We professionally rewrite your CV to highlight achievements, improve ATS compatibility, and position you clearly for {leadCountry} and GCC opportunities.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-primary">
                {["Human Written", "ATS Optimized", "Role-Specific", "Confidential"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full px-4 text-base sm:w-auto sm:px-10 sm:text-lg" onClick={() => openLeadModal({ trigger: "service_page", service: "Professional CV Writing" })}>
                  Get My Free CV Review
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-4 text-base sm:w-auto sm:px-10 sm:text-lg" asChild>
                  <a href="#pricing">View CV Packages</a>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Opens a short request form where you can attach your current CV and get professional feedback. No obligation.
              </p>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[560px] pb-6 sm:pb-8 lg:max-w-none">
              <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="relative h-[510px] overflow-hidden rounded-[2rem] border border-white/80 bg-primary shadow-[0_30px_80px_-42px_hsl(var(--primary)/0.62)] sm:h-[590px]">
                <img
                  src={cvWritingProfessional}
                  alt="Professional reviewing a CV for role positioning and ATS readiness"
                  width="1122"
                  height="1402"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[56%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-bold text-primary shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
                  <PenLine className="h-4 w-4" aria-hidden="true" /> Human Written & Reviewed
                </span>
              </div>

              <div className="absolute bottom-0 left-3 z-10 w-[min(88%,360px)] overflow-hidden rounded-[1.25rem] border border-primary/15 bg-white shadow-[0_22px_54px_-26px_hsl(var(--primary)/0.65)] sm:-left-5">
                <div className="flex items-center justify-between gap-4 bg-primary px-4 py-3.5 text-primary-foreground">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-75">ATS Review</p>
                    <p className="mt-0.5 text-sm font-semibold sm:text-base">Recruiter-ready CV</p>
                  </div>
                  <FileCheck2 className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="space-y-2.5">
                    {["Achievement-focused rewrite", "Role-specific keywords", "Clean ATS formatting"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-semibold text-foreground sm:text-[13px]">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <span className="w-fit rounded-full bg-[hsl(var(--surface-teal-soft))] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary">ATS Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="section-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-4">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative CV Transformation Example</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">See What a Professional Rewrite Changes</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  A strong CV does more than list duties. It clarifies impact, adds context and helps recruiters understand the value behind your experience.
                </p>
                <Button variant="cta" size="lg" className="mt-8 w-full sm:w-auto" asChild>
                  <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">
                    Get My CV Reviewed
                  </a>
                </Button>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-background p-4 shadow-[0_18px_50px_-38px_hsl(var(--primary)/0.55)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-white p-5">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Before</p>
                    <p className="text-xl font-semibold leading-8 text-foreground">
                      Responsible for managing daily operations and preparing reports.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">After</p>
                    <p className="text-xl font-semibold leading-8 text-foreground">
                      Coordinated daily operational reporting across multiple stakeholders, improving visibility, follow-up, and accountability.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {rewriteComparisons.map((item) => (
                    <div key={item.before} className="grid gap-3 rounded-2xl border border-border bg-white p-4 md:grid-cols-[0.82fr_auto_1.18fr] md:items-center">
                      <p className="text-sm font-medium text-muted-foreground">{item.before}</p>
                      <ArrowRight className="hidden h-4 w-4 text-accent md:block" />
                      <p className="text-sm font-semibold text-foreground">{item.after}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">Why Professionals Choose BrandMyProfile</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A premium CV service should understand your market, your target role and the difference between a list of tasks and a persuasive career story.
              </p>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-6">
              {choiceReasons.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <article
                    key={reason.title}
                    className={`rounded-[1.5rem] border border-border bg-white p-6 shadow-sm ${
                      index === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3 xl:col-span-3"
                    }`}
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-normal">{reason.title}</h3>
                    <p className="mt-4 leading-7 text-muted-foreground">{reason.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What You Receive</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">A CV Package Built Around Clearer Positioning</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  Deliverables vary by package, but the work is centered on improving the document recruiters and ATS systems evaluate first.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-primary p-7 text-primary-foreground sm:col-span-2">
                  <FileText className="h-9 w-9" />
                  <h3 className="mt-8 max-w-xl text-3xl font-semibold tracking-normal">Professionally Rewritten CV</h3>
                  <p className="mt-4 max-w-2xl leading-7 text-white/80">
                    A cleaner, sharper CV written around your target role, experience level and market positioning.
                  </p>
                </div>
                {deliverables.map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-background p-5">
                    <CheckCircle2 className="mb-5 h-5 w-5 text-accent" />
                    <p className="font-semibold">{item}</p>
                    {item === "Revision support" && (
                      <p className="mt-2 text-sm text-muted-foreground">Package-dependent revision count.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding border-y border-border bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How It Works</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                The process is personal and review-led. We look at your background before writing, not after a template has already been produced.
              </p>
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

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-[hsl(var(--surface-teal-soft))] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Built for the Market You're Targeting</p>
                  <h2 className="mt-4 font-serif font-semibold tracking-normal">{regionCopy.heading}</h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-muted-foreground">
                    Your CV should reflect the role, industry and market you are targeting. We tailor positioning, terminology and keyword strategy for {leadCountry} and GCC opportunities.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[leadCountry, "UAE", "Saudi Arabia", "Qatar", "GCC"].filter((tag, index, arr) => arr.indexOf(tag) === index).map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CV Support by Industry - only the industries actually approved for this region
            (Unit 4A, section 24). A compact text-link row, deliberately not a full card
            grid, so this never competes visually with the Career Documents Bento below. */}
        {industriesForRegion.length > 0 && (
          <section className="border-y border-border bg-[hsl(var(--surface-warm))] py-8">
            <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">CV Support by Industry</p>
              {industriesForRegion.map((entry) => (
                <Link
                  key={entry.slug}
                  to={`/${selectedRegion.code}/cv-writing/${entry.slug}`}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {entry.serviceName}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* India-only contextual routing to the two intent hubs (Unit 5, section 28) -
            never shown on GCC regional CV Writing pages. */}
        {selectedRegion.code === "india" && (
          <section className="border-y border-border bg-white py-8">
            <div className="section-container flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center">
              <p className="flex flex-col text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                Targeting GCC jobs?
                <Link to="/india/gcc-jobs" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Explore the India → GCC Jobs guide
                </Link>
              </p>
              <p className="flex flex-col text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
                Targeting European roles?
                <Link to="/india/europe-jobs" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Explore the India → European Jobs guide
                </Link>
              </p>
            </div>
          </section>
        )}

        <section aria-labelledby="career-documents-heading" className="section-padding border-t border-border bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Career Documents</p>
              <h2 id="career-documents-heading" className="mt-4 font-serif font-semibold tracking-normal">
                Everything You Need for Your Next Career Move
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Choose the document you need, or send us your current CV on WhatsApp and we’ll recommend the right option.
              </p>
            </div>

            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {careerDocuments.map((document) => {
                const Icon = document.icon;
                return (
                  <article
                    key={document.title}
                    className={`flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-border p-6 shadow-[0_14px_40px_-30px_hsl(var(--primary)/0.35)] md:p-7 ${document.className}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                          document.featured ? "bg-white/12 text-white" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      {document.badge && (
                        <span className="max-w-[14rem] rounded-full bg-accent px-3 py-1.5 text-right text-[0.68rem] font-bold uppercase leading-4 tracking-[0.1em] text-accent-foreground">
                          {document.badge}
                        </span>
                      )}
                    </div>

                    <h3 className={`mt-7 font-semibold tracking-normal ${document.featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                      {document.title}
                    </h3>
                    <p className={`mt-4 leading-7 ${document.featured ? "text-white/80" : "text-muted-foreground"}`}>
                      {document.description}
                    </p>

                    {document.benefits && (
                      <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {document.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2 text-sm font-medium text-white/90">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-7">
                      <Button
                        variant={document.featured ? "cta" : "default"}
                        className="min-h-11 w-full whitespace-normal px-4 py-2 text-center leading-5"
                        asChild
                      >
                        <a href={buildWhatsAppUrl(document.message)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" />
                          {document.cta}
                        </a>
                      </Button>
                      {document.servicePath && isRoutedPathAvailable(selectedRegion.code, `/${document.servicePath}`) && (
                        <Link
                          to={`/${selectedRegion.code}/${document.servicePath}`}
                          className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold underline-offset-4 hover:underline ${
                            document.featured ? "text-white" : "text-primary"
                          }`}
                        >
                          {document.servicePathLabel}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[1.25rem] border border-primary/10 bg-white px-5 py-5 text-center shadow-sm md:flex-row md:text-left">
              <p className="text-sm font-semibold text-primary">
                Serving professionals across Kuwait, UAE, Saudi Arabia, Qatar, Bahrain, Oman and India.
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                {["India → GCC career applications", "India → European career applications"].map((item) => (
                  <span key={item} className="rounded-full bg-[hsl(var(--surface-pink-soft))] px-3 py-2 text-xs font-semibold text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">CV Packages</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choose the Level of CV Support You Need</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Pricing is shown for {selectedRegion.name}. Each package starts with understanding your current CV and target direction.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {serviceData.pricingTiers.map((tier) => {
                const isFeatured = tier.tier === "pro" || tier.featured;
                return (
                  <article
                    key={tier.name}
                    className={`relative flex flex-col rounded-[1.5rem] border bg-white p-6 shadow-sm ${
                      isFeatured ? "border-accent shadow-[0_24px_70px_-45px_hsl(var(--accent)/0.9)] lg:-mt-5 lg:pb-8" : "border-border"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute -top-4 left-6 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground">
                        Most Popular
                      </div>
                    )}
                    <div className="pt-3">
                      <h3 className="text-3xl font-semibold tracking-normal">{tier.name}</h3>
                      <p className="mt-2 font-semibold text-primary">{packagePositioning[tier.tier] ?? tier.description}</p>
                      <p className="mt-5 text-4xl font-bold text-foreground">{priceLoading ? "..." : pricing ? formatPrice(tier.tier) : "Ask for Pricing"}</p>
                    </div>
                    <ul className="mt-7 flex-1 space-y-3">
                      {tier.features.map((feature: string) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant={isFeatured ? "cta" : "outline"} size="lg" className="mt-8 w-full" asChild>
                      <a
                        data-track="package_cta_click"
                        data-track-package={tier.name}
                        data-track-service="cv-writing"
                        href={buildWhatsAppUrl(
                          buildPackageEnquiryMessage({
                            packageName: tier.name,
                            serviceName: serviceData.title,
                            regionName: selectedRegion.name,
                            price: getTierPrice(tier.tier),
                          }),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {packageCtas[tier.tier] ?? `Choose ${tier.name}`}
                      </a>
                    </Button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Still Unsure?</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Questions Before You Send Your CV</h2>
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

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">Not Getting Enough Interview Calls?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">
                Your CV may not be communicating your real value. Send it to us for a professional review and find out what can be improved.
              </p>
              <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">
                    Get My Free CV Review
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-h-12 w-full border-white bg-white/10 text-white hover:bg-white hover:text-primary sm:flex-1"
                  asChild
                >
                  <a
                    href={buildWhatsAppUrl("Hi BrandMyProfile, I'd like to chat about the Professional CV Writing service.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">Confidential. No obligation. Fast response.</p>
            </div>
          </div>
        </section>
      </main>
      <RelatedServiceLinks region={selectedRegion.code} currentSuffix="/services/cv-writing" />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
