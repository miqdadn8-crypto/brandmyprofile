import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileCheck2,
  FilePenLine,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  MessageCircle,
  ScanSearch,
  X,
} from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { organizationSchema } from "@/lib/seo/organization";
import { buildPackageEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

interface PriceData {
  price: number;
  currency: string;
}

type RegionPricing = Record<string, Record<string, PriceData>>;

interface PricingTier {
  name: string;
  bestFor: string;
  features: string[];
  isFeatured: boolean;
  serviceKey: string;
  tierKey: string;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Essential",
    bestFor: "Fresh graduates or professionals who need a strong CV foundation",
    features: [
      "Professional CV writing",
      "ATS-optimized format",
      "1 revision round",
      "LinkedIn headline optimization",
      "PDF & Word formats",
    ],
    isFeatured: false,
    serviceKey: "cv-writing",
    tierKey: "basic",
    cta: "Choose Essential",
  },
  {
    name: "Professional",
    bestFor: "Active job seekers who want stronger CV + LinkedIn positioning",
    features: [
      "Everything in Essential",
      "Full LinkedIn profile makeover",
      "Professional cover letter",
      "2 revision rounds",
      "Career masterclass access",
      "Networking tips guide",
    ],
    isFeatured: true,
    serviceKey: "cv-writing",
    tierKey: "pro",
    cta: "Choose Professional",
  },
  {
    name: "Executive",
    bestFor: "Managers and senior professionals targeting higher-level roles",
    features: [
      "Everything in Professional",
      "Executive CV format",
      "Personal branding strategy",
      "Unlimited revisions",
      "30-min strategy call",
      "Priority support",
    ],
    isFeatured: false,
    serviceKey: "cv-writing",
    tierKey: "elite",
    cta: "Enquire About Executive",
  },
];

const comparisonRows = [
  { label: "Professional CV Writing", values: ["Included", "Included", "Executive format"] },
  { label: "ATS Optimization", values: ["Included", "Included", "Included"] },
  { label: "GCC Formatting", values: ["Ask us", "Ask us", "Ask us"] },
  { label: "LinkedIn Profile Makeover", values: ["Headline only", "Full makeover", "Full makeover"] },
  { label: "Cover Letter", values: ["—", "Included", "Included"] },
  { label: "Revision Rounds", values: ["1 round", "2 rounds", "Unlimited"] },
  { label: "Interview Preparation", values: ["—", "—", "—"] },
  { label: "Career Guidance", values: ["—", "—", "30-min strategy call"] },
  { label: "Priority Support", values: ["—", "—", "Included"] },
  { label: "Delivery Time", values: ["48 hours", "24 hours", "12 hours"] },
];

const singleServices = [
  {
    name: "ATS Professional CV",
    description: "A clean, keyword-optimized CV for online applications and recruiter review.",
    icon: ScanSearch,
    message: "Hello BrandMyProfile, I’m interested in an ATS Professional CV. I am currently based in [country] and targeting [role/market]. Please share the process and pricing.",
    serviceKey: "cv-writing",
    tierKey: "basic",
    className: "bg-primary text-primary-foreground lg:col-span-5 lg:row-span-2",
    featured: true,
  },
  {
    name: "GCC Format CV",
    description: "A professionally structured CV for opportunities across the GCC.",
    icon: FileCheck2,
    message: "Hello BrandMyProfile, I’m interested in a GCC-format CV for opportunities in [target GCC country]. Please share the process and pricing.",
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-4",
  },
  {
    name: "Professional CV",
    description: "A polished CV that communicates your skills, experience and achievements clearly.",
    icon: FileText,
    message: "Hello BrandMyProfile, I need a Professional CV. Please share the process and pricing.",
    serviceKey: "cv-writing",
    tierKey: "basic",
    className: "bg-white lg:col-span-3",
  },
  {
    name: "Europass CV",
    description: "A prepared Europass-format CV for applications where that format is preferred.",
    icon: FileCheck2,
    message: "Hello BrandMyProfile, I need a Europass CV for applications in Europe. Please share the details and pricing.",
    className: "bg-white lg:col-span-3",
  },
  {
    name: "Professional Cover Letter",
    description: "A role-focused letter explaining your experience, motivation and fit.",
    icon: Mail,
    message: "Hello BrandMyProfile, I need a professional cover letter for a job application. Please share the process and pricing.",
    className: "bg-[hsl(var(--surface-pink-soft))] lg:col-span-4",
  },
  {
    name: "LinkedIn Profile Makeover",
    description: "Professional headline, About, experience, skills and keyword positioning.",
    icon: Linkedin,
    message: "Hello BrandMyProfile, I’m interested in a LinkedIn Profile Makeover. Please share the process and pricing.",
    serviceKey: "linkedin-makeover",
    tierKey: "basic",
    className: "bg-[hsl(var(--surface-teal-soft))] lg:col-span-6",
  },
  {
    name: "Career Guidance",
    description: "One-to-one guidance for career direction, strategy and interview preparation.",
    icon: Compass,
    message: "Hello BrandMyProfile, I’m interested in Career Guidance. Please share the available options and pricing.",
    serviceKey: "career-guidance",
    tierKey: "clarity",
    className: "bg-white lg:col-span-3",
  },
  {
    name: "Career Masterclass",
    description: "Live practical LinkedIn training with exercises and Q&A.",
    icon: GraduationCap,
    message: "Hello BrandMyProfile, I’m interested in the Career Masterclass. Please share the next session and pricing.",
    serviceKey: "masterclass",
    tierKey: "single",
    className: "bg-white lg:col-span-3",
  },
  {
    name: "Professional Resignation Letter",
    description: "A clear, professionally written resignation letter suited to your situation.",
    icon: FilePenLine,
    message: "Hello BrandMyProfile, I need help preparing a professional resignation letter. Please share the process and pricing.",
    className: "bg-white lg:col-span-12",
  },
];

// The first two FAQs are built dynamically from real pricing/comparison data (see
// getFaqs below) so their wording can never drift from what's actually loaded for the
// region - the rest are static, region-agnostic policy answers.
const staticFaqs = [
  {
    question: "Which package is right for me?",
    answer: "Essential suits a strong CV foundation, Professional adds broader CV and LinkedIn positioning, and Executive is designed for senior-level personal branding and priority support.",
  },
  {
    question: "Can I buy only a CV?",
    answer: "Yes. You can enquire about a standalone Professional, ATS, GCC-format or Europass CV without purchasing a full package.",
  },
  {
    question: "Can I buy only LinkedIn optimization?",
    answer: "Yes. LinkedIn Profile Makeover is available as a standalone service with its own region-aware pricing.",
  },
  {
    question: "Do you offer GCC-format CVs?",
    answer: "Yes. GCC-format CV support is available as a standalone enquiry and can be confirmed for your target country and role.",
  },
  {
    question: "Do you prepare Europass CVs?",
    answer: "Yes. We prepare Europass-format CVs for applications where that format is requested or preferred.",
  },
  {
    question: "Are prices different by country?",
    answer: "Yes. The page automatically displays prices and currency for your selected region: Kuwait, UAE, Saudi Arabia, Qatar or India.",
  },
  {
    question: "How many revisions are included?",
    answer: "Essential includes one round, Professional includes two rounds, and Executive includes unlimited revisions under the current package policy.",
  },
  {
    question: "How long does delivery take?",
    answer: "Current package turnaround is 48 hours for Essential, 24 hours for Professional and 12 hours for Executive. Timing is confirmed before work begins.",
  },
  {
    question: "Can I upgrade later?",
    answer: "Ask the team about upgrading. Available options and any price difference depend on your selected package and whether work has started.",
  },
  {
    question: "Do you guarantee interviews?",
    answer: "No. Career documents and coaching cannot guarantee interviews, jobs or recruiter responses, but they can improve clarity, positioning and preparation.",
  },
];

// Builds the two data-driven FAQs from the same tier/comparison data already used
// elsewhere on the page, so the wording can never manually drift out of sync.
const getDynamicFaqs = (regionName: string, essentialPrice: string | undefined) => [
  {
    question: `How much does CV writing cost in ${regionName}?`,
    answer: essentialPrice
      ? `BrandMyProfile CV packages in ${regionName} currently start from ${essentialPrice} for the Essential package, with pricing depending on the level of support and services included. Review the packages below to compare what each option includes.`
      : `Pricing for ${regionName} depends on the package and level of support you choose. Ask us directly for current pricing, or review the packages below.`,
  },
  {
    question: "Is LinkedIn optimization included?",
    answer: "LinkedIn headline optimization is included from the Essential package, with a full LinkedIn Profile Makeover included from the Professional package upward. It's also available as a standalone service.",
  },
];

const reveal = {
  initial: { opacity: 0.96, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45 },
};

const formatPrice = (priceData?: PriceData) => {
  if (!priceData) return undefined;
  if (priceData.currency === "INR") return `₹${priceData.price.toLocaleString()}`;
  return `${priceData.price} ${priceData.currency}`;
};

export default function Pricing() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const [regionPricing, setRegionPricing] = useState<RegionPricing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pricingUnavailable, setPricingUnavailable] = useState(false);
  const generalMessage = `Hello BrandMyProfile, I’m reviewing the career service packages for ${selectedRegion.name} and need help choosing the right option. My career goal is [goal]. Please advise.`;

  useEffect(() => {
    const loadPricing = async () => {
      setIsLoading(true);
      setPricingUnavailable(false);
      try {
        // Load this region's own pricing only - no fallback to another region's numbers.
        // A region with no real approved pricing file yet (e.g. Bahrain/Oman) should
        // never show borrowed prices mislabeled under the wrong region/currency; this
        // page isn't meant to exist for them yet (see Unit 3A), so it redirects home.
        const data = await import(`@/lib/data/${selectedRegion.code}/pricing.json`);
        setRegionPricing(data.default as RegionPricing);
      } catch {
        setRegionPricing(null);
        setPricingUnavailable(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadPricing();
  }, [selectedRegion.code]);

  const getTierPrice = (tier: PricingTier) => formatPrice(regionPricing?.[tier.serviceKey]?.[tier.tierKey]);
  const getSingleServicePrice = (serviceKey?: string, tierKey?: string) => {
    if (!serviceKey || !tierKey) return undefined;
    return formatPrice(regionPricing?.[serviceKey]?.[tierKey]);
  };

  // Essential (cv-writing/basic) is the real lowest-priced CV package - used to build
  // the "how much does CV writing cost" direct-answer block and its matching FAQ from
  // the same loaded pricing data, never a separately hardcoded number.
  const essentialPrice = isLoading ? undefined : getTierPrice(pricingTiers[0]);
  const faqs = useMemo(
    () => [...getDynamicFaqs(selectedRegion.name, essentialPrice), ...staticFaqs],
    [selectedRegion.name, essentialPrice],
  );

  const pricingSchema = useMemo(() => {
    if (!regionPricing) return undefined;

    const offers = pricingTiers
      .map((tier) => {
        const priceData = regionPricing[tier.serviceKey]?.[tier.tierKey];
        if (!priceData) return null;
        return {
          "@type": "Offer",
          name: `${tier.name} - ${tier.bestFor}`,
          price: priceData.price,
          priceCurrency: priceData.currency,
          url: `https://www.brandmyprofile.com/${selectedRegion.code}/pricing`,
          availability: "https://schema.org/InStock",
        };
      })
      .filter(Boolean);

    if (!offers.length) return undefined;

    // FAQPage schema mirrors the exact visible FAQs rendered below - never a separate list.
    const faqSchema = {
      "@type": "FAQPage",
      "@id": "https://www.brandmyprofile.com/pricing#faq",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return {
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema,
        {
          "@type": "Service",
          "@id": "https://www.brandmyprofile.com/pricing#service",
          name: "BrandMyProfile CV Writing Packages",
          provider: { "@id": organizationSchema["@id"] },
          areaServed: { "@type": "Country", name: selectedRegion.name },
          offers,
        },
        faqSchema,
      ],
    };
  }, [regionPricing, selectedRegion.code, selectedRegion.name, faqs]);

  // No real approved pricing data exists for this region yet (e.g. Bahrain/Oman) - this
  // page isn't meant to exist for them yet (Unit 3A), so redirect to the region homepage
  // rather than show borrowed prices under the wrong currency, or an empty pricing page.
  if (!isLoading && pricingUnavailable) {
    return <Navigate to={`/${selectedRegion.code}`} replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO
        title={`CV Writing & Career Service Pricing in ${selectedRegion.name}`}
        description={`${content.pricingIntro} See CV writing, LinkedIn optimization, career coaching and masterclass pricing in ${selectedRegion.currency}.`}
        keywords="career services pricing, CV writing cost, LinkedIn optimization price, career coaching rates"
        structuredData={pricingSchema}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_50%,hsl(var(--surface-teal-soft))_100%)] py-16 md:py-24">
          <div className="section-container">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Career Service Pricing</p>
              <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[clamp(2.65rem,8vw,5.7rem)] font-semibold leading-[1.02] tracking-normal">
                Choose the Right Career Support for Your Next Move
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Flexible packages for CV writing, LinkedIn optimization, career guidance and GCC-focused job-search support.
              </p>
              <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm">
                <BadgeCheck className="h-5 w-5 text-accent" />
                Prices shown for {selectedRegion.name} in {selectedRegion.currency}
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full sm:w-auto" asChild>
                  <a href="#packages">Choose a Package<ArrowRight className="h-5 w-5" /></a>
                </Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full bg-white/70 sm:w-auto" asChild>
                  <a href={buildWhatsAppUrl(generalMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Ask on WhatsApp</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white py-10">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-xl font-semibold tracking-normal sm:text-2xl">
              How much does CV writing cost in {selectedRegion.name}?
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">{faqs[0].answer}</p>
          </div>
        </section>

        <section id="packages" className="section-padding bg-[hsl(var(--surface-warm))]">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Career Packages</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Choose the Level of Support You Need</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Every package is priced for {selectedRegion.name} and uses the currency shown above.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => {
                const price = getTierPrice(tier);
                return (
                  <article key={tier.name} className={`relative flex flex-col rounded-[1.5rem] border bg-white p-6 shadow-sm ${tier.isFeatured ? "border-accent shadow-[0_24px_70px_-45px_hsl(var(--accent)/0.9)] lg:-mt-5 lg:pb-8" : "border-border"}`}>
                    {tier.isFeatured && <div className="absolute -top-4 left-6 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Most Popular</div>}
                    <div className="pt-3">
                      <h3 className="text-3xl font-semibold tracking-normal">{tier.name}</h3>
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-accent">Best for</p>
                      <p className="mt-1 min-h-12 font-semibold leading-6 text-primary">{tier.bestFor}</p>
                      <p className="mt-5 text-4xl font-bold">{isLoading ? "..." : price ?? "Ask for pricing"}</p>
                    </div>
                    <ul className="mt-7 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" /><span>{feature}</span></li>
                      ))}
                    </ul>
                    <Button variant={tier.isFeatured ? "cta" : "outline"} size="lg" className="mt-8 min-h-12 w-full" asChild>
                      <a href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: tier.name, serviceName: "Career Services", regionName: selectedRegion.name, price }))} target="_blank" rel="noopener noreferrer">{tier.cta}</a>
                    </Button>
                    <a href={buildWhatsAppUrl(`Hello BrandMyProfile, I have a question about the ${tier.name} package for ${selectedRegion.name}. Please help me understand whether it fits my needs.`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                      <MessageCircle className="h-4 w-4" />Ask about this package
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <motion.section {...reveal} className="section-padding bg-white">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Package Comparison</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Compare What’s Included</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">A direct view of the inclusions currently supported by each package.</p>
            </div>

            <div className="mt-12 hidden overflow-hidden rounded-[1.5rem] border border-border shadow-sm md:block">
              <table className="w-full table-fixed border-collapse bg-white text-left">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="w-[34%] px-6 py-5 text-sm font-semibold">Feature</th>
                    {pricingTiers.map((tier) => <th key={tier.name} className={`px-4 py-5 text-center text-base font-semibold ${tier.isFeatured ? "bg-accent" : ""}`}>{tier.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, rowIndex) => (
                    <tr key={row.label} className={rowIndex % 2 === 0 ? "bg-background" : "bg-white"}>
                      <th className="px-6 py-4 text-sm font-semibold">{row.label}</th>
                      {row.values.map((value, valueIndex) => (
                        <td key={`${row.label}-${pricingTiers[valueIndex].name}`} className="px-4 py-4 text-center text-sm text-muted-foreground">
                          <span className="inline-flex items-center justify-center gap-1.5">
                            {value === "Included" ? <Check className="h-4 w-4 text-accent" /> : value === "—" ? <X className="h-4 w-4 text-muted-foreground/50" /> : null}
                            {value === "—" ? <span className="sr-only">Not included</span> : value}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid gap-5 md:hidden">
              {pricingTiers.map((tier, tierIndex) => (
                <article key={tier.name} className={`rounded-[1.35rem] border bg-white p-5 ${tier.isFeatured ? "border-accent" : "border-border"}`}>
                  <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-semibold tracking-normal">{tier.name}</h3>{tier.isFeatured && <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">Most Popular</span>}</div>
                  <dl className="mt-5 space-y-3">
                    {comparisonRows.map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                        <dt className="font-medium text-muted-foreground">{row.label}</dt><dd className="max-w-[45%] text-right font-semibold">{row.values[tierIndex] === "—" ? "Not included" : row.values[tierIndex]}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...reveal} className="section-padding bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Standalone Services</p>
              <h2 className="mt-4 font-serif font-semibold tracking-normal">Need Just One Service?</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Choose a standalone career document or service without purchasing a full package.</p>
            </div>
            <div className="mt-12 grid min-w-0 gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-12">
              {singleServices.map((service) => {
                const Icon = service.icon;
                const startingPrice = getSingleServicePrice(service.serviceKey, service.tierKey);
                return (
                  <article key={service.name} className={`flex min-w-0 flex-col rounded-[1.35rem] border border-border p-6 shadow-sm ${service.className}`}>
                    <Icon className={`h-7 w-7 ${service.featured ? "text-white" : "text-primary"}`} />
                    <h3 className={`mt-7 font-semibold tracking-normal ${service.featured ? "text-3xl" : "text-xl"}`}>{service.name}</h3>
                    <p className={`mt-4 leading-7 ${service.featured ? "text-white/80" : "text-muted-foreground"}`}>{service.description}</p>
                    <p className={`mt-5 text-sm font-bold uppercase tracking-[0.12em] ${service.featured ? "text-white/70" : "text-accent"}`}>
                      {startingPrice ? `Starts from ${startingPrice}` : "Ask for pricing"}
                    </p>
                    <div className="mt-auto pt-7">
                      <Button variant={service.featured ? "cta" : "default"} className="min-h-11 w-full whitespace-normal" asChild>
                        <a href={buildWhatsAppUrl(service.message)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />Enquire on WhatsApp</a>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <section className="border-y border-border bg-white">
          <div className="section-container grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Human Written", "Region-Specific", "Confidential", "Revision Support"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-background px-4 py-4"><CheckCircle2 className="h-5 w-5 text-accent" /><span className="font-semibold">{item}</span></div>
            ))}
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Questions Before You Choose</p>
                <h2 className="mt-4 font-serif font-semibold tracking-normal">Pricing & Package FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-border bg-white p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">{faq.question}<ChevronDown className="h-5 w-5 flex-shrink-0 text-primary transition-transform group-open:rotate-180" /></summary>
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
              <h2 className="font-serif font-semibold tracking-normal">Not Sure Which Package You Need?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/80">Send us your current CV or tell us your career goal. We’ll recommend the right option based on your experience and target market.</p>
              <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild><a href={buildWhatsAppUrl(generalMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Ask on WhatsApp</a></Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full border-white bg-white/10 text-white hover:bg-white hover:text-primary sm:flex-1" asChild><Link to={`/${selectedRegion.code}/schedule`}>Book Free Consultation</Link></Button>
              </div>
              <p className="mt-5 text-sm font-medium text-white/70">Confidential • No obligation • Fast response</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
