import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard,
  Linkedin,
  ListChecks,
  MessageCircle,
  PenLine,
  Search,
  Star,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import RelatedServiceLinks from "@/components/RelatedServiceLinks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { useServiceData } from "@/hooks/useServiceData";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { getServiceSeoDescription } from "@/config/pageSeo";
import { organizationSchema } from "@/lib/seo/organization";
import { buildPackageEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

interface PricingTierData {
  name: string;
  tier: string;
  description: string;
  features: string[];
  featured: boolean;
}

interface LinkedInServiceData {
  title: string;
  seo: {
    title: string;
    keywords: string;
  };
  pricingTiers: PricingTierData[];
}

const trustItems = ["Human Written", "Recruiter-Focused", "Keyword Optimized", "Confidential"];

const transformationRows = [
  {
    label: "Headline",
    before: "Experienced Professional Seeking Opportunities",
    after:
      "Operations & Project Coordination Professional | GCC Experience | Stakeholder Management | Process Improvement",
  },
  {
    label: "About Section",
    before: "Generic paragraph",
    after: "Clear positioning, strengths, role focus and value proposition",
  },
  {
    label: "Experience",
    before: "Task-based descriptions",
    after: "Achievement-focused, keyword-rich content",
  },
  {
    label: "Skills",
    before: "Random skill list",
    after: "Prioritized, role-relevant skills",
  },
];

const reasons = [
  {
    title: "Recruiter-Focused Positioning",
    description: "A clearer professional story built around what recruiters need to understand first.",
    icon: Target,
    className: "lg:col-span-5 lg:row-span-2 bg-primary text-primary-foreground",
    featured: true,
  },
  {
    title: "Stronger Professional Headline",
    description: "Communicate your role, strengths and market focus in one precise first impression.",
    icon: Linkedin,
    className: "lg:col-span-4 bg-[hsl(var(--surface-teal-soft))]",
  },
  {
    title: "Human-Written About Section",
    description: "Natural, credible writing that connects your experience to your next move.",
    icon: PenLine,
    className: "lg:col-span-3 bg-white",
  },
  {
    title: "Achievement-Focused Experience",
    description: "Turn task lists into evidence of scope, contribution and professional value.",
    icon: BadgeCheck,
    className: "lg:col-span-3 bg-white",
  },
  {
    title: "Role-Specific Keywords",
    description: "Use relevant language consistently across the sections recruiters scan.",
    icon: Search,
    className: "lg:col-span-4 bg-[hsl(var(--surface-pink-soft))]",
  },
  {
    title: "Profile Structure & Skills Optimization",
    description: "Organize skills and profile sections so your strongest evidence is easy to find.",
    icon: LayoutDashboard,
    className: "lg:col-span-12 bg-white",
  },
];

const optimizationItems = [
  {
    title: "Headline + About",
    description:
      "The core of your positioning: a focused headline and a human-written About section that make your value easier to understand.",
    icon: Linkedin,
    className: "md:col-span-2 lg:col-span-6 lg:row-span-2 bg-primary text-primary-foreground",
    featured: true,
  },
  {
    title: "Experience",
    description: "Sharper role descriptions built around achievements, scope and contribution.",
    icon: BadgeCheck,
    className: "bg-white lg:col-span-6",
  },
  {
    title: "Skills",
    description: "Prioritized skills aligned with your target role and professional direction.",
    icon: ListChecks,
    className: "lg:col-span-6 bg-[hsl(var(--surface-teal-soft))]",
  },
  {
    title: "Keywords",
    description: "Relevant terminology placed naturally across your profile content.",
    icon: Search,
    className: "lg:col-span-3 bg-[hsl(var(--surface-pink-soft))]",
  },
  {
    title: "Profile Structure",
    description: "A logical section order that brings important information forward.",
    icon: LayoutDashboard,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Featured Section Guidance",
    description: "Practical direction on which work samples, links or documents to feature.",
    icon: Star,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Recommendations Strategy",
    description: "Guidance on requesting relevant, credible recommendations where appropriate.",
    icon: UserRoundCheck,
    className: "lg:col-span-3 bg-[hsl(var(--surface-teal-soft))]",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Profile Audit",
    description: "We review your current profile, identify gaps and understand what is limiting clarity.",
  },
  {
    number: "02",
    title: "Define Your Target Role",
    description: "We align the profile direction with your experience, target role and market.",
  },
  {
    number: "03",
    title: "Rewrite & Optimize",
    description: "A human writer rebuilds your key sections with stronger positioning and relevant keywords.",
  },
  {
    number: "04",
    title: "Review & Launch",
    description: "You review the work, request package-supported refinements and receive implementation guidance.",
  },
];

const packagePositioning: Record<string, string> = {
  basic: "Best for fresh graduates and basic profile cleanup",
  pro: "Best for active job seekers",
  elite: "Best for senior professionals and stronger personal branding",
};

const faqs = [
  {
    question: "Is this just an AI rewrite?",
    answer: "No. Your profile is reviewed and rewritten by a human around your experience, target role and professional voice.",
  },
  {
    question: "Can you optimize for a target role?",
    answer: "Yes. We align your positioning, keywords and experience language with the role and market you want to target.",
  },
  {
    question: "Will this guarantee recruiter messages?",
    answer:
      "No. Profile optimization cannot guarantee recruiter messages, but it can make your experience, relevance and professional direction clearer.",
  },
  {
    question: "Do you rewrite my full experience section?",
    answer: "Full experience-section rewriting is included where specified in your selected package.",
  },
  {
    question: "Can you improve my LinkedIn without changing my CV?",
    answer:
      "Yes. We can optimize LinkedIn as a standalone service, though sharing your CV helps us keep your career story accurate and consistent.",
  },
  {
    question: "How do I share my current profile?",
    answer: "Start a WhatsApp conversation and send your LinkedIn profile link together with your target role.",
  },
];

const marketHeadings: Record<string, string> = {
  kuwait: "LinkedIn Optimization for Kuwait & GCC Opportunities",
  uae: "LinkedIn Optimization for UAE & GCC Opportunities",
  saudi: "LinkedIn Optimization for Saudi & GCC Opportunities",
  qatar: "LinkedIn Optimization for Qatar & GCC Opportunities",
  india: "LinkedIn Optimization for India, GCC & International Opportunities",
};

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.5 },
};

export default function LinkedInMakeover() {
  const { pricing, formatPrice, isLoading: priceLoading } = useRegionPricing("linkedin-makeover");
  const { serviceData: rawServiceData, isLoading: dataLoading } = useServiceData("linkedin-makeover");
  const { selectedRegion } = useRegion();
  const regionCopy = getRegionContent(selectedRegion.code).servicePages["linkedin-makeover"];
  const marketHeading = marketHeadings[selectedRegion.code] ?? marketHeadings.kuwait;
  const reviewMessage = `Hello BrandMyProfile, I’d like my LinkedIn profile reviewed for ${selectedRegion.name}. My target role is [target role]. Please share the process and pricing.`;
  const seoOverride = getRegionContent(selectedRegion.code).serviceSeo?.["linkedin-makeover"];
  const seoDescription = getServiceSeoDescription("linkedin-makeover", selectedRegion.name);

  if (dataLoading || !rawServiceData) {
    return null;
  }

  const serviceData = rawServiceData as LinkedInServiceData;

  const getTierPrice = (tierKey: string) => {
    if (priceLoading) return undefined;
    const price = formatPrice(tierKey);
    return price === "Price not available" ? undefined : price;
  };

  // Unit 7: previously a flat Service object with no stable @id, an inline ad-hoc
  // Organization duplicate, and bare-string areaServed codes region-invariant across all
  // 5 regions - restructured into the same @graph shape used across other service pages.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/linkedin-makeover#service`,
        name: serviceData.seo.title,
        description: seoDescription,
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
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/linkedin-makeover#faq`,
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
        description={seoOverride?.metaDescription ?? seoDescription}
        keywords={serviceData.seo.keywords}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "LinkedIn Makeover" },
        ]}
      />
      <main className="overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_48%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container grid min-h-[760px] items-center gap-12 py-16 lg:min-h-[800px] lg:grid-cols-[1fr_0.88fr] lg:py-20">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm sm:tracking-[0.22em]">
                LinkedIn Profile Makeover for {selectedRegion.name}
              </p>
              <h1 className="font-serif text-[clamp(2.65rem,10vw,5.8rem)] font-semibold leading-[0.98] tracking-normal">
                Build a LinkedIn Profile
                <span className="block text-primary">Recruiters Understand</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Professional LinkedIn optimization that improves your headline, About section, experience, keywords and overall professional positioning for recruiters across Kuwait and the GCC.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-primary">
                {trustItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-5 text-base sm:w-auto sm:px-8" asChild>
                  <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">
                    Get My LinkedIn Profile Reviewed
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-5 text-base sm:w-auto sm:px-8" asChild>
                  <a href="#pricing">View LinkedIn Packages</a>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">No obligation. Share your profile link and target role.</p>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[550px]">
              <div className="absolute -right-8 top-12 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-white shadow-[0_30px_80px_-45px_hsl(var(--primary)/0.6)]">
                <div className="flex items-center justify-between bg-[#0A66C2] px-6 py-4 text-white">
                  <Linkedin className="h-8 w-8 fill-current" />
                  <div className="h-8 w-40 rounded-full bg-white/15" />
                </div>
                <div className="h-28 bg-[hsl(var(--surface-teal-soft))]" />
                <div className="px-6 pb-6">
                  <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary font-serif text-3xl font-semibold text-white shadow-sm">
                    BP
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold">Your Name</p>
                      <p className="mt-2 max-w-sm font-semibold leading-6 text-foreground">
                        Operations & Project Coordination Professional | GCC Experience | Process Improvement
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">Kuwait · Open to GCC opportunities</p>
                    </div>
                    <BadgeCheck className="h-7 w-7 flex-shrink-0 text-[#0A66C2]" />
                  </div>
                  <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-bold">About</p>
                      <PenLine className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      A focused professional story that connects experience, strengths and target direction.
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Headline", "Positioned"],
                      ["Keywords", "Role-aligned"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[hsl(var(--surface-pink-soft))] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">{label}</p>
                        <p className="mt-2 text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
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
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative LinkedIn Transformation Example</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">See What a Stronger LinkedIn Profile Changes</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  Strong optimization replaces vague language with a clear, credible story about your role, strengths and professional value.
                </p>
                <Button variant="cta" size="lg" className="mt-8 w-full sm:w-auto" asChild>
                  <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">Review My Profile</a>
                </Button>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background p-4 shadow-[0_18px_50px_-38px_hsl(var(--primary)/0.55)]">
                <div className="grid gap-3">
                  {transformationRows.map((row) => (
                    <article key={row.label} className="grid min-w-0 gap-3 rounded-2xl border border-border bg-white p-5 md:grid-cols-[0.72fr_auto_1.28fr] md:items-center">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{row.label} · Before</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{row.before}</p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-accent md:block" />
                      <div className="min-w-0 rounded-xl bg-accent/5 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">After</p>
                        <p className="mt-2 text-sm font-semibold leading-6">{row.after}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Why BrandMyProfile</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Your Profile Should Make Your Direction Clear</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">We bring the sections together so recruiters see one consistent professional story.</p>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <article key={reason.title} className={`flex min-w-0 flex-col rounded-[1.35rem] border border-border p-6 shadow-sm md:p-7 ${reason.className}`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${reason.featured ? "bg-white/15" : "bg-primary text-white"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={`mt-7 font-semibold tracking-normal ${reason.featured ? "text-3xl" : "text-2xl"}`}>{reason.title}</h3>
                    <p className={`mt-4 leading-7 ${reason.featured ? "text-white/80" : "text-muted-foreground"}`}>{reason.description}</p>
                    {reason.featured && (
                      <div className="mt-auto pt-8">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-sm leading-6 text-white/85">
                          Built around your real experience, target role and market—not generic profile filler.
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">What We Optimize</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Every Section Has a Job to Do</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                We focus attention where it improves clarity and positioning, with package deliverables confirmed before work begins.
              </p>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {optimizationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className={`min-w-0 rounded-[1.35rem] border border-border p-6 shadow-sm ${item.className}`}>
                    <Icon className={`h-7 w-7 ${item.featured ? "text-white" : "text-primary"}`} />
                    <h3 className={`mt-8 font-semibold tracking-normal ${item.featured ? "text-3xl" : "text-xl"}`}>{item.title}</h3>
                    <p className={`mt-4 leading-7 ${item.featured ? "max-w-xl text-white/80" : "text-muted-foreground"}`}>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section className="section-padding border-y border-border bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How It Works</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">A four-step, human-reviewed process built around your actual career direction.</p>
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

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-[hsl(var(--surface-teal-soft))] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Built for the Market You’re Targeting</p>
                  <h2 className="mt-4 font-serif font-semibold tracking-normal">{marketHeading}</h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-muted-foreground">{regionCopy.intro}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[selectedRegion.name, "Kuwait", "UAE", "Saudi Arabia", "Qatar", "GCC"].filter((tag, index, array) => array.indexOf(tag) === index).map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="pricing" className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">LinkedIn Packages</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choose the Right Level of Profile Support</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Real package pricing for {selectedRegion.name}, with scope matched to where you are in your career.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {serviceData.pricingTiers.map((tier) => {
                const isFeatured = tier.tier === "pro" || tier.featured;
                return (
                  <article key={tier.name} className={`relative flex flex-col rounded-[1.5rem] border bg-white p-6 shadow-sm ${isFeatured ? "border-accent shadow-[0_24px_70px_-45px_hsl(var(--accent)/0.9)] lg:-mt-5 lg:pb-8" : "border-border"}`}>
                    {isFeatured && (
                      <div className="absolute -top-4 left-6 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Most Popular</div>
                    )}
                    <div className="pt-3">
                      <h3 className="text-3xl font-semibold tracking-normal">{tier.name}</h3>
                      <p className="mt-2 font-semibold leading-6 text-primary">{packagePositioning[tier.tier] ?? tier.description}</p>
                      <p className="mt-5 text-4xl font-bold">{priceLoading ? "..." : formatPrice(tier.tier)}</p>
                    </div>
                    <ul className="mt-7 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant={isFeatured ? "cta" : "outline"} size="lg" className="mt-8 w-full" asChild>
                      <a data-track="package_cta_click" data-track-package={tier.name} data-track-service="linkedin-makeover" href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: tier.name, serviceName: serviceData.title, regionName: selectedRegion.name, price: getTierPrice(tier.tier) }))} target="_blank" rel="noopener noreferrer">
                        Enquire About {tier.name}
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
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Begin</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">LinkedIn Makeover FAQs</h2>
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

        {/* Helpful Guides (Unit 6) - contextual resource links only, no page redesign. */}
        <section className="border-y border-border bg-[hsl(var(--surface-warm))] py-8">
          <div className="section-container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-semibold text-primary">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Helpful Guides:</span>
            <a href="/blog/linkedin-headline-gulf-jobs" className="underline-offset-4 hover:underline">
              LinkedIn Headline Guide for Gulf Job Seekers
            </a>
            <a href="/blog/optimize-linkedin-profile-visibility" className="underline-offset-4 hover:underline">
              How to Optimize Your LinkedIn Profile
            </a>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">Want Recruiters to Understand Your Value Faster?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">
                Send us your LinkedIn profile and target role. We’ll review what can be improved and recommend the right package.
              </p>
              <div className="mx-auto mt-7 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full whitespace-normal sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">Get My LinkedIn Profile Reviewed</a>
                </Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full border-white bg-white/10 text-white hover:bg-white hover:text-primary sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl("Hello BrandMyProfile, I’d like to chat about the LinkedIn Profile Makeover service. Please share the next steps.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">Human reviewed. Confidential. No obligation.</p>
            </div>
          </div>
        </section>
      </main>
      <RelatedServiceLinks region={selectedRegion.code} currentSuffix="/services/linkedin-makeover" />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
