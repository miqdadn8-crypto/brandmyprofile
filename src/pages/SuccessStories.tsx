import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  Linkedin,
  MessageCircle,
  MessagesSquare,
  Quote,
  ScanSearch,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { organizationSchema, GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { getStaticPageSeo } from "@/config/pageSeo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const credibilityItems = [
  { title: "500+", label: "Professionals Supported", icon: UsersRound, featured: true },
  { title: "Kuwait & GCC", label: "Career Focus", icon: Globe2 },
  { title: "CV, LinkedIn & Career", label: "Services", icon: BriefcaseBusiness },
  { title: "Human Writing", label: "& Support", icon: MessagesSquare },
];

const valueItems = [
  { title: "Clearer Professional Positioning", description: "A career story that makes strengths, direction and professional value easier to understand.", icon: Target, className: "bg-primary text-primary-foreground md:col-span-2 md:row-span-2" },
  { title: "ATS-Friendly CV Structure", description: "Clear, readable document structure prepared for modern application processes.", icon: ScanSearch, className: "bg-white" },
  { title: "Stronger LinkedIn Presence", description: "More focused profile content and professional positioning.", icon: Linkedin, className: "bg-[hsl(var(--surface-pink-soft))]" },
  { title: "Market-Specific Career Guidance", description: "Practical context for the market and roles being targeted.", icon: Compass, className: "bg-[hsl(var(--surface-teal-soft))] md:col-span-2" },
  { title: "Responsive Support", description: "Clear communication throughout the service process.", icon: MessagesSquare, className: "bg-white" },
  { title: "Practical, Actionable Feedback", description: "Specific guidance clients can understand and apply.", icon: CheckCircle2, className: "bg-white" },
];

const services = [
  { label: "Professional CV Writing", icon: FileText },
  { label: "LinkedIn Profile Makeover", icon: Linkedin },
  { label: "Career Guidance", icon: Compass },
  { label: "Career Masterclasses", icon: BookOpenCheck },
  { label: "GCC Career Documents", icon: FileCheck2 },
];

const regionsSupported = ["Kuwait", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "India"];

export default function SuccessStories() {
  const { selectedRegion } = useRegion();
  const seo = getStaticPageSeo("successStories", selectedRegion.code);
  const cvReviewPath = `/${selectedRegion.code}/contact`;
  const pricingPath = `/${selectedRegion.code}/pricing`;
  const whatsAppUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I would like to strengthen my career profile for opportunities in ${selectedRegion.name}. Please recommend the right next step.`);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[hsl(35_33%_97%)]">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="BrandMyProfile feedback, CV writing testimonials, LinkedIn makeover feedback, career guidance Kuwait, GCC career support"
        // No unique content until the live Google reviews feed is on; re-enable indexing then.
        noindex
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            {
              "@type": "CollectionPage",
              "@id": "https://www.brandmyprofile.com/success-stories#page",
              about: { "@id": organizationSchema["@id"] },
            },
          ],
        }}
      />
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-[hsl(var(--surface-teal-soft))] py-16 sm:py-20 lg:py-24">
          <Quote className="absolute -right-10 top-8 h-64 w-64 text-white/50" strokeWidth={0.8} aria-hidden="true" />
          <div className="section-container relative text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary">
              <BadgeCheck className="h-4 w-4" /> Client Feedback
            </div>
            <h1 className="font-serif text-5xl font-semibold leading-none tracking-tight sm:text-6xl lg:text-[68px]">Success Stories</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-foreground/75">
              Real feedback from professionals who used BrandMyProfile for CV writing, LinkedIn optimization, career guidance and career support.
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              See how clients improved their professional positioning, career documents and confidence across Kuwait, GCC and India.
            </p>
            <a
              href={GOOGLE_BUSINESS_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/25 bg-white px-5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Read Reviews on Google <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="border-b border-border/70 bg-white" aria-label="BrandMyProfile credibility">
          <div className="section-container grid grid-cols-2 md:grid-cols-4">
            {credibilityItems.map(({ title, label, icon: Icon, featured }, index) => (
              <div key={title} className={`flex min-h-32 flex-col justify-center border-border/70 px-4 py-6 sm:px-6 ${index % 2 !== 0 ? "border-l" : ""} ${index > 1 ? "border-t md:border-t-0" : ""} ${index > 0 ? "md:border-l" : ""}`}>
                <div className="mb-3 flex items-center gap-2 text-primary"><Icon className={`${featured ? "h-6 w-6" : "h-5 w-5"}`} /><span className={`${featured ? "font-serif text-4xl font-semibold" : "text-base font-bold"}`}>{title}</span></div>
                <p className="text-sm font-semibold leading-5 text-muted-foreground sm:text-[15px]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">The service experience</p>
              <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">What Clients Value Most</h2>
            </div>
            <div className="grid auto-rows-fr gap-4 md:grid-cols-4">
              {valueItems.map(({ title, description, icon: Icon, className }) => (
                <article key={title} className={`flex min-h-52 flex-col rounded-[22px] border border-border/70 p-6 shadow-[var(--shadow-card)] ${className}`}>
                  <Icon className="mb-8 h-7 w-7 text-accent" />
                  <h3 className="mt-auto font-serif text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-6 opacity-75">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white py-12 sm:py-14">
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
              <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Services represented</p><h2 className="font-serif text-4xl font-semibold tracking-tight">Feedback Across Career Support</h2><p className="mt-4 text-base leading-7 text-muted-foreground">Individual testimonials relate to the specific service shown with each client’s feedback.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map(({ label, icon: Icon }, index) => (
                  <div key={label} className={`flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-[hsl(35_33%_97%)] px-4 py-3 ${index === services.length - 1 ? "sm:col-span-2" : ""}`}><span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><span className="text-[15px] font-bold">{label}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="section-container text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Market coverage</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Professionals We Support Across</h2>
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
              {regionsSupported.map((region) => <span key={region} className="rounded-full border border-primary/20 bg-white px-5 py-3 text-[15px] font-bold text-primary shadow-sm">{region}</span>)}
            </div>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <Sparkles className="mx-auto mb-5 h-8 w-8 text-accent" />
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Ready to Strengthen Your Career Profile?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/75">Send us your CV or tell us your career goal. We’ll recommend the right next step for your target market.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review <ArrowRight /></Link></Button>
              <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={pricingPath}>View Career Services</Link></Button>
            </div>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/80 underline-offset-4 hover:text-white hover:underline"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
