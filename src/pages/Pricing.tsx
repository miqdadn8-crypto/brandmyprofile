import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
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
import RelatedServiceLinks from "@/components/RelatedServiceLinks";
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
  { label: "LinkedIn Profile Makeover", values: ["Headline only", "Full makeover", "Full makeover"] },
  { label: "Cover Letter", values: ["—", "Included", "Included"] },
  { label: "Revision Rounds", values: ["1 round", "2 rounds", "Unlimited"] },
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
      ? `BrandMyProfile CV packages in ${regionName} currently start from ${essentialPrice} for the Essential package, with pricing depending on the level of support and services included. Compare what each package includes above.`
      : `Pricing for ${regionName} depends on the package and level of support you choose. Ask us directly for current pricing, or compare the packages above.`,
  },
  {
    question: "Is LinkedIn optimization included?",
    answer: "LinkedIn headline optimization is included from the Essential package, with a full LinkedIn Profile Makeover included from the Professional package upward. It's also available as a standalone service.",
  },
];

// Priced services first, quote-only services after, so the list reads as a price list.
const orderedServices = [
  ...singleServices.filter((service) => service.serviceKey),
  ...singleServices.filter((service) => !service.serviceKey),
];

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
  // Region override (regionSeo.json) - the starting price comes from the loaded pricing
  // data above, never a separately hardcoded number; falls back to the default copy until
  // pricing has loaded.
  const pricingSeo = content.serviceSeo?.pricing;
  const pricingSeoDescription = pricingSeo && essentialPrice
    ? pricingSeo.metaDescriptionTemplate.replace("{startingPrice}", essentialPrice)
    : undefined;
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
        title={pricingSeo?.metaTitle ?? `CV Writing & Career Service Pricing in ${selectedRegion.name}`}
        description={pricingSeoDescription ?? `${content.pricingIntro} See CV writing, LinkedIn optimization, career coaching and masterclass pricing in ${selectedRegion.currency}.`}
        keywords="career services pricing, CV writing cost, LinkedIn optimization price, career coaching rates"
        structuredData={pricingSchema}
      />
      <Header />
      <main>
        <section id="packages" className="border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-warm))_0%,hsl(var(--background))_50%,hsl(var(--surface-teal-soft))_100%)] pb-16 pt-12 md:pb-20 md:pt-16">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-normal">
                CV Writing &amp; Career Service Prices in {selectedRegion.name}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                Three CV packages, plus single services if you only need one thing. Every price is in {selectedRegion.currency}.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => {
                const price = getTierPrice(tier);
                return (
                  <article key={tier.name} className={`relative flex flex-col rounded-[var(--radius-bento)] border bg-card p-6 shadow-[var(--shadow-card)] ${tier.isFeatured ? "border-2 border-primary shadow-[var(--shadow-card-hover)] lg:-mt-4 lg:pb-8" : "border-border"}`}>
                    {tier.isFeatured && <div className="absolute -top-3.5 left-6 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground">Most popular</div>}
                    <div className="pt-2">
                      <h2 className="text-2xl font-semibold tracking-normal">{tier.name}</h2>
                      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground"><span className="font-semibold text-foreground">Best for:</span> {tier.bestFor}</p>
                      <p className="mt-4 text-4xl font-bold tabular-nums">{isLoading ? "..." : price ?? "Ask for pricing"}</p>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-6 text-foreground/80"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" /><span>{feature}</span></li>
                      ))}
                    </ul>
                    <Button variant={tier.isFeatured ? "cta" : "outline"} size="lg" className="mt-8 min-h-12 w-full" asChild>
                      <a data-track="package_cta_click" data-track-package={tier.name} data-track-service="pricing" href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: tier.name, serviceName: "Career Services", regionName: selectedRegion.name, price }))} target="_blank" rel="noopener noreferrer">{tier.cta}</a>
                    </Button>
                    <a href={buildWhatsAppUrl(`Hello BrandMyProfile, I have a question about the ${tier.name} package for ${selectedRegion.name}. Please help me understand whether it fits my needs.`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />Ask about this package
                    </a>
                  </article>
                );
              })}
            </div>
            <p className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              Prices shown for {selectedRegion.name} in {selectedRegion.currency}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-card py-10">
          <div className="section-container max-w-3xl">
            <h2 className="font-serif text-xl font-semibold tracking-normal sm:text-2xl">
              How much does CV writing cost in {selectedRegion.name}?
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg">{faqs[0].answer}</p>
          </div>
        </section>

        <section className="section-padding bg-card">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="heading-section">Compare What’s Included</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">A direct view of the inclusions currently supported by each package.</p>
            </div>

            <div className="mt-12 hidden overflow-hidden rounded-[var(--radius-bento)] border border-border shadow-sm md:block">
              <table className="w-full table-fixed border-collapse bg-card text-left">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="w-[34%] px-6 py-5 text-sm font-semibold">Feature</th>
                    {pricingTiers.map((tier) => <th key={tier.name} className={`px-4 py-5 text-center text-base font-semibold ${tier.isFeatured ? "bg-primary-hover" : ""}`}>{tier.name}{tier.isFeatured && <span className="block text-xs font-medium text-primary-foreground/75">Most popular</span>}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, rowIndex) => (
                    <tr key={row.label} className={rowIndex % 2 === 0 ? "bg-background" : "bg-card"}>
                      <th className="px-6 py-4 text-sm font-semibold">{row.label}</th>
                      {row.values.map((value, valueIndex) => (
                        <td key={`${row.label}-${pricingTiers[valueIndex].name}`} className="px-4 py-4 text-center text-sm text-muted-foreground">
                          <span className="inline-flex items-center justify-center gap-1.5">
                            {value === "Included" ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : value === "—" ? <X className="h-4 w-4 text-muted-foreground/50" /> : null}
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
                <article key={tier.name} className={`rounded-[var(--radius-lg)] border bg-card p-5 ${tier.isFeatured ? "border-2 border-primary" : "border-border"}`}>
                  <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-semibold tracking-normal">{tier.name}</h3>{tier.isFeatured && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Most popular</span>}</div>
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
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
              Need a GCC-format CV? Ask when you order and we&apos;ll confirm it for your target country and role.
            </p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="heading-section">Only Need One Service?</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Order a single document or session without a full package.</p>
            </div>
            <ul className="mx-auto mt-10 max-w-4xl divide-y divide-border overflow-hidden rounded-[var(--radius-bento)] border border-border bg-card shadow-[var(--shadow-card)]">
              {orderedServices.map((service) => {
                const Icon = service.icon;
                const startingPrice = getSingleServicePrice(service.serviceKey, service.tierKey);
                return (
                  <li key={service.name} className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 sm:px-6">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-primary/10"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{service.name}</span>
                        <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">{service.description}</span>
                      </span>
                    </div>
                    <p className="pl-14 text-base font-bold tabular-nums sm:pl-0 sm:text-right">{startingPrice ? `From ${startingPrice}` : <span className="font-semibold text-muted-foreground">Quote on request</span>}</p>
                    <a href={buildWhatsAppUrl(service.message)} target="_blank" rel="noopener noreferrer" className="ml-14 inline-flex min-h-11 w-fit items-center gap-2 px-1 text-sm font-semibold text-primary hover:underline sm:ml-0">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />{startingPrice ? "Order on WhatsApp" : "Get a quote"}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="section-container grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Human Written", "Region-Specific", "Confidential", "Revision Support"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-background px-4 py-4"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /><span className="font-semibold">{item}</span></div>
            ))}
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <h2 className="heading-section">Pricing &amp; Package FAQs</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-2xl border border-border bg-card p-5">
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
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">Send us your current CV or tell us your career goal. We’ll recommend the right option based on your experience and target market.</p>
              <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
                <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild><a href={buildWhatsAppUrl(generalMessage)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" />Ask on WhatsApp</a></Button>
                <Button variant="outline" size="lg" className="min-h-12 w-full border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:flex-1" asChild><Link to={`/${selectedRegion.code}/schedule`}>Book Free Consultation</Link></Button>
              </div>
              <p className="mt-5 text-sm font-medium text-primary-foreground/70">Confidential • No obligation • Fast response</p>
            </div>
          </div>
        </section>
      </main>
      <RelatedServiceLinks region={selectedRegion.code} currentSuffix="/pricing" />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
