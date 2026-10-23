import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  FileSearch,
  MapPinned,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";
import heroImage from "@/assets/hero-gcc-professional.webp";
import laurelArtwork from "../../../laurel.svg";

const collageDocuments = [
  { type: "ATS CV", tone: "mono", className: "hero-doc--ats" },
  { type: "GCC FORMAT", tone: "teal", className: "hero-doc--gcc" },
  { type: "EXECUTIVE CV", tone: "ink", className: "hero-doc--executive" },
  { type: "EUROPASS", tone: "blue", className: "hero-doc--europass" },
  { type: "COVER LETTER", tone: "rose", className: "hero-doc--cover" },
];

function DocumentMockup({ type, tone, className }: (typeof collageDocuments)[number]) {
  return (
    <div className={`hero-doc hero-doc--${tone} ${className}`}>
      <div className="hero-doc__topline" />
      <div className="hero-doc__identity">
        <span className="hero-doc__avatar" />
        <span className="hero-doc__identity-lines"><i /><i /></span>
      </div>
      <p>{type}</p>
      <span className="hero-doc__rule" />
      <div className="hero-doc__copy"><i /><i /><i /></div>
      <div className="hero-doc__section"><b /><span><i /><i /></span></div>
      <div className="hero-doc__skills"><i /><i /><i /></div>
    </div>
  );
}

function TrustStrip({ market, className = "" }: { market: string; className?: string }) {
  const items = [
    { title: "Career Support", label: "Across GCC", icon: UsersRound },
    { title: "Human Written", label: "& Reviewed", icon: UserRoundCheck },
    { title: market, label: "Focus", icon: MapPinned },
    { title: "Confidential", label: "Service", icon: ShieldCheck },
  ];

  return (
    <div className={`grid max-w-[720px] grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-primary/10 bg-card/80 sm:grid-cols-4 ${className}`}>
      {items.map(({ title, label, icon: Icon }, index) => (
        <div key={title} className={`flex min-h-[90px] flex-col justify-center p-3 ${index % 2 !== 0 ? "border-l border-primary/10" : ""} ${index > 1 ? "border-t border-primary/10 sm:border-t-0" : ""} ${index > 0 ? "sm:border-l sm:border-primary/10" : ""}`}>
          <Icon className="mb-1 h-4 w-4 shrink-0 text-primary/80" aria-hidden="true" />
          <p className="text-sm font-bold leading-5 text-foreground">{title}</p>
          <p className="text-sm font-medium leading-5 text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  // Bahrain/Oman have no pricing page yet (Unit 3A) - linking there would leak into a
  // dead NotFound page (Unit 9 orphan/broken-link audit finding). Point the secondary CTA
  // at Contact instead, matching Header.tsx's existing bookConsultationPath fallback.
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const { openLeadModal } = useLeadModal();
  const secondaryCtaPath = isLimitedFootprint ? `/${selectedRegion.code}/contact` : `/${selectedRegion.code}/pricing`;
  const secondaryCtaLabel = isLimitedFootprint ? "Ask About Pricing" : "View CV Packages";
  const marketLabel = selectedRegion.code === "india" ? "India & GCC" : `${selectedRegion.name} & GCC`;
  const badgeMarketLabel = `${selectedRegion.name.toUpperCase()} · GCC CAREERS`;
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const mobileDescription = selectedRegion.code === "india"
    ? "Professional CV and resume writing in India, plus LinkedIn and career support for GCC and international jobs."
    : `Professional CV and resume writing in ${place}, plus LinkedIn and career support for GCC jobs.`;
  return (
    <section className="relative overflow-hidden border-b border-primary/10 bg-[hsl(var(--surface-warm))] pb-12 pt-[112px] sm:pb-14 sm:pt-[120px] lg:min-h-[720px] lg:pb-12 lg:pt-[112px]">
      <div className="hero-background-wash absolute inset-0" aria-hidden="true" />
      <div className="section-container relative z-10 grid items-center gap-7 lg:grid-cols-[1.28fr_1fr] lg:gap-10 xl:gap-14">
        <div className="min-w-0 max-w-[760px]">
          {/* Phones: one readable line (the laurel's inner gap is too narrow below 640px). */}
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary sm:hidden">
            <Award className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>500+ professionals supported</span>
          </p>
          <div
            className="relative mb-2 hidden aspect-[2553/802] w-[340px] max-w-full sm:block"
          >
            <span className="sr-only">500+ Professionals Supported. {selectedRegion.name} and GCC careers.</span>
            <span
              className="absolute inset-0 bg-primary"
              style={{
                WebkitMaskImage: `url(${laurelArtwork})`,
                maskImage: `url(${laurelArtwork})`,
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
              aria-hidden="true"
            />
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="min-w-0 -translate-y-0.5 text-center leading-none">
                <span className="block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.06em] text-foreground">500+ Professionals Supported</span>
                <span className="mt-1.5 block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.06em] text-primary/80">{badgeMarketLabel}</span>
              </span>
            </span>
          </div>

          <h1
            className="max-w-full break-words font-serif text-[clamp(2.1rem,9.4vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[3.35rem] sm:leading-[1.08] md:text-[3.7rem] lg:text-[2.75rem] xl:text-[3.5rem] 2xl:text-[3.5rem]"
          >
            <span className="block lg:hidden">
              <span className="block ">Your Experience</span>
              <span className="block ">Deserves a CV That</span>
              <span className="block ">Gets Noticed</span>
            </span>
            <span className="hidden lg:block">
              <span className="block">Your Experience Deserves</span>
              <span className="block">a CV That Gets Noticed</span>
            </span>
          </h1>

          {/* Short version on phones keeps both CTAs in the first screen on small devices. */}
          <p className="mt-4 text-lg font-medium leading-7 text-foreground/70 sm:hidden">
            {mobileDescription}
          </p>
          <p
            className="mt-5 hidden max-w-2xl text-xl font-medium leading-8 text-foreground/70 sm:block"
          >
            {content.hero.description}
          </p>

          <div
            className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3 lg:flex-col xl:flex-row"
          >
            <Button variant="cta" size="xl" onClick={() => openLeadModal({ trigger: "hero_cv_review" })} className="group min-h-14 w-full whitespace-normal px-4 text-base sm:w-auto sm:px-6 sm:text-lg lg:w-full lg:text-base xl:w-auto xl:text-lg">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" asChild className="min-h-14 w-full whitespace-normal border-primary/55 bg-card/75 px-6 text-base font-medium text-primary shadow-none transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md focus-visible:bg-primary focus-visible:text-primary-foreground sm:w-auto sm:text-lg lg:w-full lg:text-base xl:w-auto xl:text-lg">
              <Link to={secondaryCtaPath}>{secondaryCtaLabel}</Link>
            </Button>
          </div>

          <p
            className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm font-semibold text-muted-foreground sm:mt-3.5 sm:justify-start sm:text-left"
          >
            <span>No obligation</span><span className="text-primary/50" aria-hidden="true">·</span><span>Free CV review</span>
          </p>

          <div className="mt-5">
            <TrustStrip market={marketLabel} />
          </div>
        </div>

        <div
          className="hero-visual relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none"
        >
          <div className="hero-collage" aria-hidden="true">
            {collageDocuments.map((document) => <DocumentMockup key={document.type} {...document} />)}
          </div>

          <div className="hero-image-frame relative z-10 h-[390px] overflow-hidden rounded-[var(--radius-bento)] border border-white/80 bg-primary shadow-[0_24px_70px_-28px_hsl(var(--primary)/0.55)] sm:h-[470px] lg:h-[570px]">
            <img
              src={heroImage}
              alt="Professional reviewing career opportunities and CV strategy for GCC jobs"
              width="1823"
              height="863"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover object-[84%_center] sm:object-[78%_center] lg:object-[82%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
