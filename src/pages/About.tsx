import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Linkedin,
  LockKeyhole,
  MessageCircle,
  MessagesSquare,
  RefreshCw,
  Route,
  SearchCheck,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { organizationSchema } from "@/lib/seo/organization";
import { getStaticPageSeo } from "@/config/pageSeo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const credibilityItems = [
  { title: "500+", label: "Professionals Supported", icon: UsersRound, featured: true },
  { title: "GCC & India", label: "Career Focus", icon: Globe2 },
  { title: "CV, LinkedIn & Career", label: "Services", icon: BriefcaseBusiness },
  { title: "Human Writing", label: "& Support", icon: UserRoundCheck },
];

const audiences = [
  { title: "Students & Fresh Graduates", description: "Building a clear foundation for first applications and early career opportunities.", icon: GraduationCap, className: "bg-primary text-primary-foreground md:col-span-2 md:row-span-2" },
  { title: "Working Professionals", description: "Strengthening documents and positioning for the next move.", icon: BriefcaseBusiness, className: "bg-white" },
  { title: "Career Switchers", description: "Connecting transferable experience to a new target role.", icon: Route, className: "bg-[hsl(var(--surface-pink-soft))]" },
  { title: "Managers & Senior Professionals", description: "Presenting leadership scope, achievements and professional direction.", icon: Target, className: "bg-[hsl(var(--surface-teal-soft))] md:col-span-2" },
  { title: "Indian Professionals Targeting GCC", description: "Adapting career documents and positioning for Gulf opportunities.", icon: Compass, className: "bg-white" },
  { title: "Indian Professionals Targeting International Roles", description: "Preparing for European and wider international applications.", icon: Globe2, className: "bg-white" },
];

const markets = [
  { name: "Kuwait", description: "Our core market for CV writing, LinkedIn optimization and practical career support.", featured: true },
  { name: "UAE", description: "Career-document positioning for UAE and wider GCC opportunities." },
  { name: "Saudi Arabia", description: "Market-aware CV and professional positioning for Saudi opportunities." },
  { name: "Qatar", description: "Clear career profiles prepared with Qatar and GCC applications in mind." },
  { name: "Bahrain", description: "Career-document support for professionals targeting Bahrain." },
  { name: "Oman", description: "Professional positioning for people exploring opportunities in Oman." },
  { name: "India", description: "Support for professionals targeting GCC, European and international opportunities.", featured: true },
];

const values = [
  { title: "Human Writing & Review", description: "Career documents and guidance shaped through human understanding and judgment.", icon: UserRoundCheck, className: "bg-primary text-primary-foreground md:col-span-2 md:row-span-2" },
  { title: "Market-Relevant Positioning", description: "Content aligned to the roles and markets a client is targeting.", icon: Target, className: "bg-white" },
  { title: "Personalized Career Support", description: "Recommendations grounded in the client’s experience and goals.", icon: HeartHandshake, className: "bg-[hsl(var(--surface-pink-soft))]" },
  { title: "Clear, Practical Guidance", description: "Straightforward feedback that is easier to understand and apply.", icon: MessagesSquare, className: "bg-[hsl(var(--surface-teal-soft))] md:col-span-2" },
  { title: "Confidential Service", description: "Career information and documents handled with care and discretion.", icon: LockKeyhole, className: "bg-white" },
  { title: "Continuous Improvement", description: "A review-and-refine mindset across documents, profiles and guidance.", icon: RefreshCw, className: "bg-white" },
];

const processSteps = [
  { number: "01", title: "Understand Your Goal", description: "We start with your target role, market and immediate career priorities.", icon: Compass },
  { number: "02", title: "Review Your Current Profile", description: "A human review identifies gaps in clarity, structure and positioning.", icon: SearchCheck },
  { number: "03", title: "Rewrite, Optimize or Guide", description: "The right support is shaped around your documents, profile or career decision.", icon: FileCheck2 },
  { number: "04", title: "Review & Refine", description: "You review the work and provide context so the final result reflects you accurately.", icon: CheckCircle2 },
];

export default function About() {
  const { selectedRegion } = useRegion();
  const seo = getStaticPageSeo("about", selectedRegion.code);
  const cvReviewPath = `/${selectedRegion.code}/contact`;
  const pricingPath = `/${selectedRegion.code}/pricing`;
  const whatsAppUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I would like support with how I present my career for opportunities in ${selectedRegion.name}. Please recommend the right next step.`);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[hsl(35_33%_97%)]">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about BrandMyProfile, CV writing Kuwait, LinkedIn optimization GCC, career guidance India, human career support"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            {
              "@type": "AboutPage",
              "@id": "https://www.brandmyprofile.com/about#page",
              about: { "@id": organizationSchema["@id"] },
            },
          ],
        }}
      />
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-[hsl(var(--surface-teal-soft))] py-16 sm:py-20 lg:py-24">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border-[48px] border-white/45" aria-hidden="true" />
          <div className="section-container relative">
            <div className="max-w-5xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" /> About BrandMyProfile
              </div>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-[68px]">
                Built to Help Professionals <span className="text-primary">Present Their Real Value</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-foreground/75">
                BrandMyProfile is an online career-support service offering professional CV writing, ATS CV optimization, GCC-format CV preparation, LinkedIn profile improvement and one-to-one career guidance for professionals targeting Kuwait, the GCC, India and international opportunities.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                Services are delivered online through WhatsApp, phone and digital consultation - there is no walk-in office, and market focus describes the opportunities clients target, not physical office locations.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Our story</p>
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Why BrandMyProfile Was Created</h2>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Kuwait", "GCC", "India", "International"].map((market) => <Badge key={market} variant="secondary" className="rounded-full px-4 py-2 text-sm">{market}</Badge>)}
              </div>
            </div>
            <div className="rounded-[24px] border border-border/80 bg-white p-7 shadow-[var(--shadow-card)] sm:p-9 lg:p-11">
              <p className="font-serif text-2xl font-semibold leading-9 text-foreground sm:text-3xl sm:leading-10">BrandMyProfile was created around a simple problem:</p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Many capable professionals have strong experience but struggle to communicate it clearly on their CV, LinkedIn profile or job applications.</p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">We help turn that experience into stronger professional positioning—clearer documents, more focused profiles and practical guidance for the next career conversation.</p>
              <div className="my-8 h-px bg-border" />
              <p className="text-base leading-8 text-muted-foreground">Kuwait is a core market. Our work also supports professionals targeting the UAE, Saudi Arabia, Qatar, Bahrain and Oman, alongside Indian professionals preparing for GCC, European and wider international opportunities.</p>
              <p className="mt-4 text-sm font-semibold text-primary">Market focus describes the opportunities clients target; it does not imply physical offices in every country.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white" aria-label="BrandMyProfile credibility">
          <div className="section-container grid grid-cols-2 md:grid-cols-4">
            {credibilityItems.map(({ title, label, icon: Icon, featured }, index) => (
              <div key={title} className={`flex min-h-32 flex-col justify-center border-border/70 px-4 py-6 sm:px-6 ${index % 2 !== 0 ? "border-l" : ""} ${index > 1 ? "border-t md:border-t-0" : ""} ${index > 0 ? "md:border-l" : ""}`}>
                <div className="mb-3 flex items-center gap-2 text-primary"><Icon className={featured ? "h-6 w-6" : "h-5 w-5"} /><span className={featured ? "font-serif text-4xl font-semibold" : "text-base font-bold"}>{title}</span></div>
                <p className="text-sm font-semibold leading-5 text-muted-foreground sm:text-[15px]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Career stages and goals</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Who We Help</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">Support shaped around where someone is now and where they want to go next.</p></div>
            <div className="grid auto-rows-fr gap-4 md:grid-cols-4">
              {audiences.map(({ title, description, icon: Icon, className }) => (
                <article key={title} className={`flex min-h-52 flex-col rounded-[22px] border border-border/70 p-6 shadow-[var(--shadow-card)] ${className}`}>
                  <Icon className="mb-8 h-7 w-7 text-accent" />
                  <h3 className="mt-auto font-serif text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-6 opacity-75">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-[hsl(var(--surface-teal-soft))]/60 py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Market awareness</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Where We Focus</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">Career support informed by the markets clients are preparing to enter.</p></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {markets.map(({ name, description, featured }, index) => (
                <article key={name} className={`flex min-h-48 flex-col rounded-[22px] border p-6 ${featured ? "border-primary bg-primary text-primary-foreground lg:col-span-2" : "border-border/80 bg-white"} ${index === markets.length - 1 ? "sm:col-span-2" : ""}`}>
                  <Globe2 className={`mb-8 h-6 w-6 ${featured ? "text-accent" : "text-primary"}`} />
                  <h3 className="mt-auto font-serif text-2xl font-semibold">{name}</h3>
                  <p className="mt-3 text-[15px] leading-6 opacity-75">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Our principles</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">How We Approach Career Support</h2></div>
            <div className="grid auto-rows-fr gap-4 md:grid-cols-4">
              {values.map(({ title, description, icon: Icon, className }) => (
                <article key={title} className={`flex min-h-52 flex-col rounded-[22px] border border-border/70 p-6 shadow-[var(--shadow-card)] ${className}`}>
                  <Icon className="mb-8 h-7 w-7 text-accent" />
                  <h3 className="mt-auto font-serif text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-6 opacity-75">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[hsl(188_82%_17%)] py-14 text-white sm:py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Human from start to finish</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">How We Work</h2><p className="mt-4 text-lg leading-8 text-white/70">A clear, personalized process that keeps your goals and experience at the center.</p></div>
            <div className="grid gap-px overflow-hidden rounded-[22px] border border-white/15 bg-white/15 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map(({ number, title, description, icon: Icon }) => (
                <article key={number} className="flex min-h-64 flex-col bg-[hsl(188_82%_17%)] p-6 sm:p-7">
                  <div className="flex items-center justify-between"><span className="font-serif text-3xl font-semibold text-accent">{number}</span><Icon className="h-6 w-6 text-white/50" /></div>
                  <h3 className="mt-auto font-serif text-2xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-6 text-white/70">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[24px] border border-border/80 bg-white p-7 shadow-[var(--shadow-card)] sm:p-10 lg:p-12">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">The people behind the work</p>
              <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Career Specialists Focused on Your Next Move</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">Our work combines professional writing, LinkedIn optimization, career strategy and market-aware guidance to help clients communicate their experience more effectively.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[{ label: "Professional writing", icon: FileCheck2 }, { label: "LinkedIn optimization", icon: Linkedin }, { label: "Career strategy", icon: Compass }, { label: "Practical guidance", icon: MessagesSquare }].map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-2xl bg-[hsl(35_33%_97%)] p-4 text-[15px] font-bold"><Icon className="h-5 w-5 text-primary" />{label}</div>)}
              </div>
            </div>
            <blockquote className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[24px] bg-primary p-7 text-primary-foreground sm:p-10 lg:p-12">
              <span className="absolute -right-5 -top-8 font-serif text-[220px] leading-none text-white/5" aria-hidden="true">“</span>
              <p className="relative font-serif text-3xl font-semibold leading-tight sm:text-4xl">Your experience already has value. Our job is to help you communicate it clearly.</p>
              <footer className="relative mt-7 border-t border-white/20 pt-5 text-base font-semibold text-white/70">Clearer positioning. Stronger documents. Better career conversations.</footer>
            </blockquote>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <BadgeCheck className="mx-auto mb-5 h-8 w-8 text-accent" />
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Ready to Strengthen How You Present Your Career?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/75">Send us your CV or tell us your career goal. We’ll help you identify the right next step.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review <ArrowRight /></Link></Button>
              <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={pricingPath}>Explore Our Services</Link></Button>
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
