import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Linkedin,
  ListChecks,
  MessageCircle,
  MessagesSquare,
  PenLine,
  Search,
  Target,
  UserRoundCheck,
  Users,
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

interface MasterclassServiceData {
  title: string;
  seo: {
    title: string;
    keywords: string;
  };
  pricingTiers: PricingTierData[];
}

const audiences = [
  {
    title: "Students & Fresh Graduates",
    description: "Build a professional profile that communicates your potential even if you have limited work experience.",
    icon: GraduationCap,
  },
  {
    title: "Working Professionals",
    description: "Position your experience more clearly for better career opportunities.",
    icon: UserRoundCheck,
  },
  {
    title: "Career Switchers",
    description: "Reposition your LinkedIn profile toward the role or industry you want next.",
    icon: ArrowRight,
  },
  {
    title: "GCC / International Job Seekers",
    description:
      "Improve your profile for recruiter visibility across Kuwait, UAE, Saudi Arabia, Qatar, Bahrain, Oman and international markets.",
    icon: Target,
  },
];

const learningTopics = [
  {
    title: "Build a Stronger LinkedIn Headline",
    description: "Write a headline that makes your role, strengths and direction clear at a glance.",
    icon: Linkedin,
    className: "bg-primary text-primary-foreground lg:col-span-6 lg:row-span-2",
    featured: true,
  },
  {
    title: "Write an Effective About Section",
    description: "Turn your background into a focused, human professional story.",
    icon: PenLine,
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-3",
  },
  {
    title: "Turn Experience Into Achievement-Focused Content",
    description: "Replace task lists with clearer examples of contribution and impact.",
    icon: BadgeCheck,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Use Role-Specific Keywords",
    description: "Choose relevant terms and place them naturally across your profile.",
    icon: Search,
    className: "bg-[hsl(var(--surface-pink-soft))] lg:col-span-3",
  },
  {
    title: "Improve Skills & Profile Completeness",
    description: "Prioritize the right skills and complete the sections that support your target role.",
    icon: ListChecks,
    className: "bg-white lg:col-span-3",
  },
  {
    title: "Understand How Recruiters Search",
    description: "Learn how role titles, keywords and profile structure support recruiter discovery.",
    icon: Users,
    className: "bg-white lg:col-span-4",
  },
  {
    title: "Build a Networking Strategy",
    description: "Approach professional connections with a clear, respectful plan.",
    icon: MessagesSquare,
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-4",
  },
  {
    title: "Create Better Professional Posts",
    description: "Plan useful posts that demonstrate your perspective without gimmicks.",
    icon: FileText,
    className: "bg-white lg:col-span-4",
  },
];

const transformations = [
  {
    label: "Headline",
    before: "Experienced Professional Looking for Opportunities",
    after:
      "Project Coordination & Operations Professional | GCC Experience | Stakeholder Management | Process Improvement",
  },
  {
    label: "About",
    before: "Generic self-description",
    after: "Clear positioning, strengths, role focus and career value",
  },
  {
    label: "Experience",
    before: "Task-based bullets",
    after: "Achievement-focused, recruiter-friendly bullets",
  },
];

const workshopSteps = [
  {
    number: "01",
    title: "Register",
    description: "Choose the workshop option that fits your goals and receive the session details.",
  },
  {
    number: "02",
    title: "Attend the Live Workshop",
    description: "Learn through live teaching, practical profile examples and interactive Q&A.",
  },
  {
    number: "03",
    title: "Apply the Framework to Your Profile",
    description: "Use the exercises and templates to improve your own headline, About section and experience.",
  },
  {
    number: "04",
    title: "Review & Improve",
    description: "Implement the framework and use the review support included in your selected package.",
  },
];

const differentiators = [
  {
    title: "Practical, Not Theoretical",
    description: "Real LinkedIn profile examples and actionable exercises.",
    icon: LayoutDashboard,
  },
  {
    title: "GCC Career Context",
    description: "Relevant for professionals targeting Kuwait and GCC opportunities.",
    icon: Target,
  },
  {
    title: "Human Guidance",
    description: "Live instruction and Q&A with room to clarify what applies to you.",
    icon: Users,
  },
  {
    title: "Built for Immediate Implementation",
    description: "Leave knowing which profile sections to change and how to approach them.",
    icon: CheckCircle2,
  },
];

const marketContent: Record<string, { heading: string; description: string }> = {
  kuwait: {
    heading: "LinkedIn Strategy for Kuwait & GCC Opportunities",
    description:
      "Build a profile that communicates your experience clearly to recruiters hiring for Kuwait and across the wider GCC market.",
  },
  uae: {
    heading: "LinkedIn Strategy for UAE & GCC Opportunities",
    description:
      "Learn how to position your profile for professional opportunities across Dubai, Abu Dhabi and the wider GCC market.",
  },
  saudi: {
    heading: "LinkedIn Strategy for Saudi & GCC Opportunities",
    description:
      "Align your profile with the role language, professional context and career opportunities shaping Saudi and GCC hiring.",
  },
  qatar: {
    heading: "LinkedIn Strategy for Qatar & GCC Opportunities",
    description:
      "Present your experience clearly for Qatar’s relationship-driven professional market and opportunities across the GCC.",
  },
  india: {
    heading: "LinkedIn Strategy for Indian Professionals Targeting GCC & International Opportunities",
    description:
      "Learn how to frame Indian experience for recruiters assessing candidates for GCC and international roles.",
  },
};

const packageDisplay: Record<string, { name: string; bestFor: string; cta: string; features: string[] }> = {
  single: {
    name: "Workshop Pass",
    bestFor: "Students and professionals who want the core LinkedIn training",
    cta: "Reserve Workshop Pass",
    features: ["2-hour live workshop", "Interactive Q&A", "Workbook & templates", "Recording access for 7 days", "Certificate of completion"],
  },
  accelerator: {
    name: "Workshop + Profile Review",
    bestFor: "Active job seekers who want personalized feedback",
    cta: "Choose Profile Review Package",
    features: ["Everything in Workshop Pass", "Personalized LinkedIn profile review", "Written improvement recommendations", "Priority Q&A", "Personal action plan"],
  },
  vip: {
    name: "VIP LinkedIn Makeover",
    bestFor: "Professionals who want hands-on profile optimization",
    cta: "Enquire About VIP",
    features: ["Live workshop", "Full LinkedIn profile audit", "1:1 coaching session", "Headline rewrite", "About section rewrite", "Experience optimization", "Keyword strategy", "Implementation guidance"],
  },
};

const faqs = [
  {
    question: "Is this workshop suitable for fresh graduates?",
    answer: "Yes. The workshop includes practical ways to communicate skills, projects and potential when professional experience is limited.",
  },
  {
    question: "Do I need an existing LinkedIn profile?",
    answer: "An existing profile is helpful for applying the exercises, but you can also use the framework while building a new profile.",
  },
  {
    question: "Will you review my personal profile?",
    answer: "Personalized profile review is included in the Workshop + Profile Review and VIP options, not the standard Workshop Pass.",
  },
  {
    question: "Is the workshop live?",
    answer: "Yes. This is a live, expert-led LinkedIn workshop with examples, exercises and Q&A.",
  },
  {
    question: "Will I receive a recording?",
    answer: "The Workshop Pass includes recording access for seven days. Any additional access is confirmed in your selected package.",
  },
  {
    question: "Can I ask questions during the session?",
    answer: "Yes. The live format includes Q&A so participants can clarify how the framework applies to their profile.",
  },
  {
    question: "Is this useful for GCC job seekers?",
    answer: "Yes. Examples and positioning guidance are relevant to professionals targeting Kuwait and the wider GCC market.",
  },
  {
    question: "Does this guarantee recruiter messages?",
    answer: "No. The workshop helps improve profile clarity and positioning, but it cannot guarantee recruiter messages or job outcomes.",
  },
  {
    question: "What happens after I register?",
    answer: "We’ll confirm your package, payment and live-session details through the existing enquiry process.",
  },
];

const reveal = {
  initial: { opacity: 0.96, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45 },
};

export default function Masterclass() {
  const { pricing, formatPrice, isLoading: priceLoading } = useRegionPricing("masterclass");
  const { serviceData: rawServiceData, isLoading: dataLoading } = useServiceData("masterclass");
  const { selectedRegion } = useRegion();
  const market = marketContent[selectedRegion.code] ?? marketContent.kuwait;
  const regionLabel = selectedRegion.code === "saudi" ? "Saudi" : selectedRegion.name;
  const reservationMessage = `Hello BrandMyProfile, I’d like to reserve a seat in the live LinkedIn workshop for ${selectedRegion.name}. Please share the next available session and booking steps.`;
  const profileReviewMessage = `Hello BrandMyProfile, I’d like my LinkedIn profile reviewed for ${selectedRegion.name}. Please share the process and available workshop/profile review options.`;
  const enquiryMessage = `Hello BrandMyProfile, I have a question about the live LinkedIn workshop for ${selectedRegion.name}. Please share the details.`;
  const seoDescription = getServiceSeoDescription("masterclass", selectedRegion.name);

  if (dataLoading || !rawServiceData) {
    return null;
  }

  const serviceData = rawServiceData as MasterclassServiceData;

  const getTierPrice = (tierKey: string) => {
    if (priceLoading) return undefined;
    const price = formatPrice(tierKey);
    return price === "Price not available" ? undefined : price;
  };

  // Unit 7: previously had an inline ad-hoc Organization duplicate as `organizer` and a
  // hardcoded region-less VirtualLocation URL that didn't match this page's actual
  // canonical URL - restructured into the same @graph shape used across other service
  // pages, with a stable @id and a region-correct location URL.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalEvent",
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/masterclass#event`,
        name: serviceData.seo.title,
        description: seoDescription,
        organizer: { "@id": organizationSchema["@id"] },
        location: {
          "@type": "VirtualLocation",
          url: `https://www.brandmyprofile.com/${selectedRegion.code}/services/masterclass`,
        },
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
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}/services/masterclass#faq`,
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
          { label: "Masterclass" },
        ]}
      />
      <main className="overflow-x-hidden bg-background text-foreground">
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_48%,hsl(var(--surface-teal-soft))_100%)]">
          <div className="section-container grid min-h-[760px] items-center gap-12 py-16 lg:min-h-[800px] lg:grid-cols-[1fr_0.88fr] lg:py-20">
            <div className="min-w-0 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:text-sm sm:tracking-[0.2em]">
                Live LinkedIn Workshop for {regionLabel} & GCC Job Seekers
              </p>
              <h1 className="font-serif text-[clamp(2.7rem,10vw,5.8rem)] font-semibold leading-[0.98] tracking-normal">
                Build a LinkedIn Profile
                <span className="block text-primary">Recruiters Notice</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                A practical live workshop for students, job seekers and working professionals who want a stronger LinkedIn presence for GCC and international opportunities.
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Learn how to improve your headline, About section, experience, keywords, networking strategy and recruiter visibility.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-5 text-base sm:w-auto sm:px-8" asChild>
                  <a href={buildWhatsAppUrl(reservationMessage)} target="_blank" rel="noopener noreferrer">
                    Reserve My Workshop Seat
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-5 text-base sm:w-auto sm:px-8" asChild>
                  <a href={buildWhatsAppUrl(enquiryMessage)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Ask on WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-primary">
                Live Expert Session • Practical Exercises • Q&A • Actionable Profile Improvements
              </p>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[550px]">
              <div className="absolute -right-8 top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-white p-4 shadow-[0_30px_80px_-45px_hsl(var(--primary)/0.65)]">
                <div className="rounded-[1.5rem] bg-[#0A66C2] px-5 py-4 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-8 w-8 fill-current" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Live Workshop</p>
                        <p className="mt-1 font-semibold">LinkedIn Profile Framework</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold">LIVE</span>
                  </div>
                </div>
                <div className="grid gap-4 p-2 pt-5 sm:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Profile Exercise</p>
                    <div className="mt-5 flex items-start gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-white">BP</div>
                      <div className="min-w-0">
                        <div className="h-2.5 w-28 rounded-full bg-primary" />
                        <div className="mt-2 h-2 w-full rounded-full bg-muted" />
                        <div className="mt-2 h-2 w-10/12 rounded-full bg-muted" />
                      </div>
                    </div>
                    <div className="mt-5 rounded-xl border-l-4 border-accent bg-accent/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">Headline Focus</p>
                      <p className="mt-2 text-sm font-semibold leading-6">Role + strengths + market direction</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[hsl(var(--surface-teal-soft))] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Session Agenda</p>
                    <ul className="mt-5 space-y-4">
                      {["Live teaching", "Profile examples", "Practical exercises", "Questions & answers"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm font-semibold">
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="section-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Live Expert Session", "Practical Exercises", "Interactive Q&A", "Profile Improvements"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-4">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Built Around Your Career Stage</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Who This Workshop Is For</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {audiences.map((audience) => {
                const Icon = audience.icon;
                return (
                  <article key={audience.title} className="rounded-[1.35rem] border border-border bg-background p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white"><Icon className="h-6 w-6" /></div>
                    <h3 className="mt-7 text-xl font-semibold tracking-normal">{audience.title}</h3>
                    <p className="mt-4 leading-7 text-muted-foreground">{audience.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section {...reveal} className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Practical LinkedIn Training</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">What You’ll Learn in the LinkedIn Workshop</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Concrete profile, search and networking skills you can apply to your own LinkedIn presence.</p>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {learningTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <article key={topic.title} className={`flex min-w-0 flex-col rounded-[1.35rem] border border-border p-6 shadow-sm ${topic.className}`}>
                    <Icon className={`h-7 w-7 ${topic.featured ? "text-white" : "text-primary"}`} />
                    <h3 className={`mt-8 font-semibold tracking-normal ${topic.featured ? "text-3xl" : "text-xl"}`}>{topic.title}</h3>
                    <p className={`mt-4 leading-7 ${topic.featured ? "max-w-lg text-white/80" : "text-muted-foreground"}`}>{topic.description}</p>
                    {topic.featured && (
                      <div className="mt-auto pt-8">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">Workshop framework</p>
                          <p className="mt-2 font-semibold">Role + strengths + keywords + direction</p>
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
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Illustrative LinkedIn Transformation Example</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">See What a Stronger LinkedIn Profile Changes</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">The workshop shows how to replace vague profile content with clearer positioning and recruiter-friendly detail.</p>
                <Button variant="cta" size="lg" className="mt-8 w-full sm:w-auto" asChild>
                  <a href={buildWhatsAppUrl(profileReviewMessage)} target="_blank" rel="noopener noreferrer">Get My Profile Reviewed</a>
                </Button>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background p-4 shadow-[0_18px_50px_-38px_hsl(var(--primary)/0.55)]">
                <div className="grid gap-3">
                  {transformations.map((item) => (
                    <article key={item.label} className="grid min-w-0 gap-3 rounded-2xl border border-border bg-white p-5 md:grid-cols-[0.72fr_auto_1.28fr] md:items-center">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Before {item.label}</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{item.before}</p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-accent md:block" />
                      <div className="min-w-0 rounded-xl bg-accent/5 p-3">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">After {item.label}</p>
                        <p className="mt-2 text-sm font-semibold leading-6">{item.after}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="section-padding border-y border-border bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif font-semibold tracking-normal">How the Workshop Works</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Live teaching, examples, exercises and Q&A—followed by practical implementation on your profile.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {workshopSteps.map((step) => (
                <article key={step.number} className="rounded-[1.35rem] border border-border bg-white p-6">
                  <p className="font-serif text-5xl font-semibold text-primary">{step.number}</p>
                  <h3 className="mt-8 text-xl font-semibold tracking-normal">{step.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">LinkedIn Workshop Packages</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choose How Much Support You Need</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Pricing is shown for {selectedRegion.name}. Every option starts with practical live LinkedIn training.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {serviceData.pricingTiers.map((tier) => {
                const display = packageDisplay[tier.tier];
                const isFeatured = tier.tier === "accelerator" || tier.featured;
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
                      {display.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant={isFeatured ? "cta" : "outline"} size="lg" className="mt-8 h-auto min-h-12 w-full whitespace-normal py-3" asChild>
                      <a data-track="package_cta_click" data-track-package={display.name} data-track-service="masterclass" href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: display.name, serviceName: "Live LinkedIn Workshop", regionName: selectedRegion.name, price: getTierPrice(tier.tier) }))} target="_blank" rel="noopener noreferrer">{display.cta}</a>
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
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Why This Workshop Is Different</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Learn It. Apply It. Improve It.</h2>
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

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="rounded-[1.75rem] border border-primary/15 bg-[hsl(var(--surface-teal-soft))] p-6 md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Built for the Market You’re Targeting</p>
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
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Before You Register</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">LinkedIn Workshop FAQs</h2>
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
              <h2 className="font-serif font-semibold tracking-normal">Ready to Make Your LinkedIn Work Harder for You?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">Join the live workshop and learn exactly how to improve your profile for recruiter visibility, networking and career opportunities.</p>
              <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full whitespace-normal sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl(reservationMessage)} target="_blank" rel="noopener noreferrer">Reserve My Workshop Seat</a>
                </Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full border-white bg-white/10 text-white hover:bg-white hover:text-primary sm:flex-1" asChild>
                  <a href={buildWhatsAppUrl(enquiryMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Ask on WhatsApp</a>
                </Button>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">Live session • Practical guidance • Q&A</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
