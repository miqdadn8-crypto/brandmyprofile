import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Linkedin,
  Map,
  MessageCircle,
  MessagesSquare,
  SearchCheck,
  Target,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { useServiceData } from "@/hooks/useServiceData";
import { useRegion } from "@/contexts/RegionContext";
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

interface CareerGuidanceServiceData {
  title: string;
  seo: {
    title: string;
    keywords: string;
  };
  pricingTiers: PricingTierData[];
}

const situations = [
  {
    title: "I’m Not Sure What Role to Target",
    description: "Clarify which roles make sense for your experience, strengths and priorities.",
    icon: Compass,
    className: "bg-primary text-primary-foreground lg:col-span-5 lg:row-span-2",
    featured: true,
  },
  {
    title: "I’m Applying but Not Getting Interviews",
    description: "Identify gaps in targeting, positioning and application strategy.",
    icon: SearchCheck,
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-4",
  },
  {
    title: "I Want to Change Career Direction",
    description: "Translate your existing experience toward a realistic new path.",
    icon: ArrowRight,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "I Want to Move from India to the GCC",
    description: "Build a market-aware plan for positioning and applications across the Gulf.",
    icon: Map,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "I Want a Better Salary or Senior Role",
    description: "Strengthen your positioning for higher responsibility and better-fit opportunities.",
    icon: CircleDollarSign,
    className: "bg-[hsl(var(--surface-pink-soft))] lg:col-span-4",
  },
  {
    title: "I Need Interview Preparation",
    description: "Prepare structured answers for common, behavioral and role-specific questions.",
    icon: MessagesSquare,
    className: "bg-white lg:col-span-4",
  },
  {
    title: "I Feel Stuck in My Current Career",
    description: "Turn a vague sense of being stuck into decisions and practical next steps.",
    icon: Target,
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-4",
  },
  {
    title: "I Want to Move Into Management",
    description: "Plan how to demonstrate leadership readiness and position your next move.",
    icon: TrendingUp,
    className: "bg-white lg:col-span-4",
  },
];

const outcomes = [
  {
    title: "Career Direction",
    description: "A clearer understanding of which roles and career paths fit your experience and goals.",
    icon: Compass,
    className: "bg-primary text-primary-foreground md:col-span-2 lg:col-span-6 lg:row-span-2",
    featured: true,
  },
  {
    title: "Personalized Job-Search Strategy",
    description: "A practical plan for targeting roles, companies and markets more effectively.",
    icon: Target,
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-3",
  },
  {
    title: "CV & LinkedIn Positioning",
    description: "Guidance on how your professional profile should support your target role.",
    icon: Linkedin,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Interview Preparation",
    description: "Structured preparation for common, behavioral and role-specific interviews.",
    icon: MessagesSquare,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Salary & Offer Strategy",
    description: "Guidance on positioning, negotiation and evaluating opportunities.",
    icon: CircleDollarSign,
    className: "bg-[hsl(var(--surface-pink-soft))] lg:col-span-3",
  },
  {
    title: "Action Plan",
    description: "Clear next steps with priorities, timelines and follow-up actions.",
    icon: BadgeCheck,
    className: "bg-white lg:col-span-12",
  },
];

const roadmap = [
  "Current Position",
  "Career Goal",
  "Gap Analysis",
  "CV / LinkedIn Positioning",
  "Target Companies / Roles",
  "Interview Preparation",
  "Offer / Negotiation",
];

const processSteps = [
  {
    number: "01",
    title: "Free Discovery Call",
    description: "Understand your situation, goals and immediate challenges.",
  },
  {
    number: "02",
    title: "Career Assessment",
    description: "Review your experience, strengths, CV, LinkedIn and target market.",
  },
  {
    number: "03",
    title: "Personalized Strategy",
    description: "Build a practical action plan based on your career goals.",
  },
  {
    number: "04",
    title: "Execute, Review & Refine",
    description: "Apply the strategy with coaching support and adjustments where included.",
  },
];

const careerStages = [
  {
    title: "Students & Fresh Graduates",
    description: "Build direction and prepare for your first professional opportunity.",
  },
  {
    title: "Working Professionals",
    description: "Position yourself for a better role, higher responsibility or stronger employer.",
  },
  {
    title: "Career Switchers",
    description: "Translate your experience into a new career direction.",
  },
  {
    title: "Managers & Senior Professionals",
    description: "Plan your next leadership or executive move strategically.",
  },
  {
    title: "Indian Professionals Targeting GCC",
    description: "Prepare your positioning, CV and search strategy for GCC opportunities.",
  },
];

const differentiators = [
  {
    title: "Practical, Not Motivational",
    description: "Focused on decisions, positioning and action.",
    icon: BadgeCheck,
  },
  {
    title: "GCC Market Awareness",
    description: "Guidance shaped around regional opportunities and hiring realities.",
    icon: Map,
  },
  {
    title: "Personalized Strategy",
    description: "No one-size-fits-all advice.",
    icon: Target,
  },
  {
    title: "Human 1-to-1 Support",
    description: "Direct coaching based on your career situation.",
    icon: UserRoundCheck,
  },
];

const marketContent: Record<string, { heading: string; description: string }> = {
  kuwait: {
    heading: "Career Strategy for Kuwait & GCC Opportunities",
    description: "Build a practical plan around Kuwait’s employer expectations while keeping wider GCC opportunities in view.",
  },
  uae: {
    heading: "Career Strategy for UAE & GCC Opportunities",
    description: "Clarify your positioning for Dubai, Abu Dhabi and other GCC markets where competition and hiring pace differ.",
  },
  saudi: {
    heading: "Career Strategy for Saudi & GCC Opportunities",
    description: "Align your next move with Saudi’s evolving sectors, role expectations and the wider GCC employment market.",
  },
  qatar: {
    heading: "Career Strategy for Qatar & GCC Opportunities",
    description: "Plan your search for Qatar’s focused professional market while considering suitable roles across the GCC.",
  },
  india: {
    heading: "Career Strategy for Indian Professionals Targeting GCC & International Opportunities",
    description: "Bridge Indian experience with GCC and international hiring expectations through clearer positioning and market choices.",
  },
};

const packageDisplay: Record<string, { name: string; bestFor: string; cta: string }> = {
  clarity: {
    name: "Career Clarity Session",
    bestFor: "Professionals who feel stuck or unsure what to target next",
    cta: "Book Career Clarity",
  },
  transformation: {
    name: "Career Accelerator",
    bestFor: "Active job seekers who need a complete strategy",
    cta: "Choose Career Accelerator",
  },
  executive: {
    name: "Executive Career Strategy",
    bestFor: "Managers, senior professionals and leadership candidates",
    cta: "Enquire About Executive Strategy",
  },
};

const faqs = [
  {
    question: "Is career guidance right for me?",
    answer: "It can help if you need clearer career direction, a more focused job search, interview preparation or a practical next-step plan.",
  },
  {
    question: "Can you help if I don’t know what role to target?",
    answer: "Yes. Career assessment and role exploration help narrow your options around your experience, strengths and priorities.",
  },
  {
    question: "Can you help me move from India to the GCC?",
    answer: "Yes. We can help you assess target markets and strengthen your positioning, CV, LinkedIn and application approach for GCC roles.",
  },
  {
    question: "Do you review my CV and LinkedIn?",
    answer: "CV and LinkedIn review is included in the Career Accelerator and higher-tier program scope.",
  },
  {
    question: "Do you help with interview preparation?",
    answer: "Yes. Interview preparation is included in the Career Accelerator and Executive Career Strategy programs.",
  },
  {
    question: "Can you help with salary negotiation?",
    answer: "Yes. The Career Accelerator includes salary negotiation guidance, with broader strategy included through its executive-level scope.",
  },
  {
    question: "Is the discovery call free?",
    answer: "Yes. The initial discovery call is free and helps establish your situation before you select a paid program.",
  },
  {
    question: "Does career coaching guarantee a job?",
    answer: "No. Career guidance cannot guarantee employment, but it can improve clarity, positioning, strategy and preparation.",
  },
];

const reveal = {
  initial: { opacity: 0.96, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45 },
};

export default function CareerGuidance() {
  const { pricing, formatPrice, isLoading: priceLoading } = useRegionPricing("career-guidance");
  const { serviceData: rawServiceData, isLoading: dataLoading } = useServiceData("career-guidance");
  const { selectedRegion } = useRegion();
  const market = marketContent[selectedRegion.code] ?? marketContent.kuwait;
  const regionLabel = selectedRegion.code === "saudi" ? "Saudi" : selectedRegion.name;
  const enquiryMessage = `Hello BrandMyProfile, I’d like to discuss career guidance for ${selectedRegion.name}. I am currently [brief situation] and targeting [target role/market]. Please share the next steps.`;
  const seoDescription = getServiceSeoDescription("career-guidance", selectedRegion.name);

  if (dataLoading || !rawServiceData) {
    return null;
  }

  const serviceData = rawServiceData as CareerGuidanceServiceData;

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
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/career-guidance#service`,
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
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/career-guidance#faq`,
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
        title={`${serviceData.seo.title} in ${selectedRegion.name}`}
        description={seoDescription}
        keywords={serviceData.seo.keywords}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: selectedRegion.name, path: `/${selectedRegion.code}` },
          { label: "Career Guidance" },
        ]}
      />
      <main className="overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_48%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container grid min-h-[760px] items-center gap-12 py-16 lg:min-h-[800px] lg:grid-cols-[1fr_0.88fr] lg:py-20">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:text-sm sm:tracking-[0.2em]">
                One-to-One Career Guidance for {regionLabel} & GCC Professionals
              </p>
              <h1 className="font-serif text-[clamp(2.7rem,10vw,5.8rem)] font-semibold leading-[0.98] tracking-normal">
                Get Clear on Your
                <span className="block text-primary">Next Career Move</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Personalized career guidance for professionals who need clarity, a stronger job-search strategy, interview support, or a practical plan for moving into better opportunities across Kuwait and the GCC.
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Whether you are changing careers, targeting a better role, moving into management, or planning a GCC career move, we help you turn uncertainty into a clear action plan.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-5 text-base sm:w-auto sm:px-8" asChild>
                  <Link to={`/${selectedRegion.code}/schedule`}>Book My Free Discovery Call<ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-5 text-base sm:w-auto sm:px-8" asChild>
                  <a href={buildWhatsAppUrl(enquiryMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Chat on WhatsApp</a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-primary">1-to-1 Guidance • Practical Action Plan • GCC Market Focus • Confidential</p>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[550px]">
              <div className="absolute -right-8 top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-white p-5 shadow-[0_30px_80px_-45px_hsl(var(--primary)/0.65)]">
                <div className="flex items-center justify-between rounded-[1.5rem] bg-primary px-5 py-4 text-white">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">Your Career Plan</p>
                    <p className="mt-1 text-lg font-semibold">Clarity before action</p>
                  </div>
                  <Compass className="h-9 w-9" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Where you are</p>
                    <p className="mt-3 font-semibold leading-6">Experience, strengths, challenges and priorities</p>
                  </div>
                  <div className="rounded-2xl bg-[hsl(var(--surface-teal-soft))] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Where you’re going</p>
                    <p className="mt-3 font-semibold leading-6">Target roles, market and practical next steps</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold">Personalized Action Plan</p>
                    <BadgeCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {["Career direction", "Positioning priorities", "Job-search actions"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{index + 1}</span>
                        <span className="text-sm font-semibold">{item}</span>
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
            {["1-to-1 Guidance", "Practical Action Plan", "GCC Market Focus", "Confidential"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-4">
                <CheckCircle2 className="h-5 w-5 text-accent" /><span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Recognize Your Situation</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Is This You?</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Career guidance starts with the real decision or obstacle in front of you.</p>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {situations.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className={`flex min-w-0 flex-col rounded-[1.35rem] border border-border p-6 shadow-sm ${item.className}`}>
                    <Icon className={`h-7 w-7 ${item.featured ? "text-white" : "text-primary"}`} />
                    <h3 className={`mt-7 font-semibold tracking-normal ${item.featured ? "text-3xl" : "text-xl"}`}>{item.title}</h3>
                    <p className={`mt-4 leading-7 ${item.featured ? "text-white/80" : "text-muted-foreground"}`}>{item.description}</p>
                    {item.featured && <div className="mt-auto pt-8"><div className="rounded-2xl border border-white/15 bg-white/10 p-5 font-semibold text-white/85">Clarity → Positioning → Action</div></div>}
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Tangible Outcomes</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What You’ll Walk Away With</h2>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {outcomes.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className={`min-w-0 rounded-[1.35rem] border border-border p-6 shadow-sm ${item.className}`}>
                    <Icon className={`h-7 w-7 ${item.featured ? "text-white" : "text-primary"}`} />
                    <h3 className={`mt-8 font-semibold tracking-normal ${item.featured ? "text-3xl" : "text-xl"}`}>{item.title}</h3>
                    <p className={`mt-4 leading-7 ${item.featured ? "max-w-lg text-white/80" : "text-muted-foreground"}`}>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section className="section-padding border-y border-border bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative Career Guidance Roadmap</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Your Career Roadmap</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">A sample path from your current situation to stronger preparation for the opportunity you want next.</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-md gap-3 lg:max-w-none lg:grid-cols-7 lg:gap-2">
              {roadmap.map((item, index) => (
                <div key={item} className="relative flex flex-col items-center">
                  <div className={`flex min-h-28 w-full items-center justify-center rounded-2xl border p-4 text-center font-semibold ${index === 0 || index === roadmap.length - 1 ? "border-primary bg-primary text-white" : "border-border bg-white"}`}>
                    {item}
                  </div>
                  {index < roadmap.length - 1 && (
                    <>
                      <ArrowDown className="my-2 h-5 w-5 text-accent lg:hidden" />
                      <ArrowRight className="absolute -right-3 top-[2.85rem] z-10 hidden h-5 w-5 rounded-full bg-background text-accent lg:block" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How It Works</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">A structured coaching process focused on assessment, decisions and practical execution.</p>
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

        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-[hsl(var(--surface-teal-soft))] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Career Guidance for the Market You’re Targeting</p>
                  <h2 className="mt-4 font-serif font-semibold tracking-normal">{market.heading}</h2>
                </div>
                <div>
                  <p className="text-lg leading-8 text-muted-foreground">{market.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Kuwait", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman"].map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Guidance for Different Career Stages</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Support That Meets You Where You Are</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {careerStages.map((item, index) => (
                  <article key={item.title} className={`rounded-[1.35rem] border border-border bg-background p-6 ${index === careerStages.length - 1 ? "sm:col-span-2" : ""}`}>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Career stage {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-5 text-xl font-semibold tracking-normal">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Career Guidance Programs</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choose the Support Your Next Move Needs</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Pricing is shown for {selectedRegion.name}. Program scope increases from focused clarity to ongoing executive support.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {serviceData.pricingTiers.map((tier) => {
                const display = packageDisplay[tier.tier];
                const isFeatured = tier.tier === "transformation" || tier.featured;
                return (
                  <article key={tier.tier} className={`relative flex flex-col rounded-[1.5rem] border bg-white p-6 shadow-sm ${isFeatured ? "border-accent shadow-[0_24px_70px_-45px_hsl(var(--accent)/0.9)] lg:-mt-5 lg:pb-8" : "border-border"}`}>
                    {isFeatured && <div className="absolute -top-4 left-6 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Most Popular</div>}
                    <div className="pt-3">
                      <h3 className="text-3xl font-semibold tracking-normal">{display.name}</h3>
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-accent">Best for</p>
                      <p className="mt-1 font-semibold leading-6 text-primary">{display.bestFor}</p>
                      <p className="mt-5 text-4xl font-bold">{priceLoading ? "..." : formatPrice(tier.tier)}</p>
                    </div>
                    <ul className="mt-7 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" /><span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant={isFeatured ? "cta" : "outline"} size="lg" className="mt-8 h-auto min-h-12 w-full whitespace-normal py-3" asChild>
                      <a href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: display.name, serviceName: serviceData.title, regionName: selectedRegion.name, price: getTierPrice(tier.tier) }))} target="_blank" rel="noopener noreferrer">{display.cta}</a>
                    </Button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Why Professionals Choose BrandMyProfile Career Guidance</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Advice Built Around Real Decisions</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {differentiators.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-[1.35rem] border border-border bg-background p-6">
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="mt-6 text-xl font-semibold tracking-normal">{item.title}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Begin</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Career Guidance FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-border bg-background p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                      {faq.question}<ChevronDown className="h-5 w-5 flex-shrink-0 text-primary transition-transform group-open:rotate-180" />
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
            <a href="/blog/career-guidance" className="underline-offset-4 hover:underline">
              Career Guidance Hub
            </a>
            <a href="/blog/gcc-interview-preparation" className="underline-offset-4 hover:underline">
              Interview Preparation for GCC Employers
            </a>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">Still Unsure What Your Next Career Move Should Be?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">Book a free discovery call and tell us where you are now, what you want next, and what’s holding you back. We’ll help you identify the right next step.</p>
              <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full whitespace-normal sm:flex-1" asChild><Link to={`/${selectedRegion.code}/schedule`}>Book My Free Discovery Call</Link></Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full border-white bg-white/10 text-white hover:bg-white hover:text-primary sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl(enquiryMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Chat on WhatsApp</a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">Confidential • No obligation • Practical guidance</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
