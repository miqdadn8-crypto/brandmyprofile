import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, GraduationCap, Linkedin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import Reveal from "@/components/motion/Reveal";

const featuredService = {
  id: "cv-writing",
  icon: FileText,
  title: "Professional CV Writing",
  description: "Turn your experience into a clear, ATS-friendly CV tailored to your target role and hiring market.",
  benefits: [
    "ATS-friendly CV rewrite",
    "Role-specific keyword optimization",
    "Achievement-focused content",
    "Revision support",
  ],
  path: "/contact",
  cta: "Get My Free CV Review",
};

const secondaryServices = [
  {
    id: "linkedin-makeover",
    icon: Linkedin,
    title: "LinkedIn Profile Makeover",
    description: "Build a profile that communicates your value and improves recruiter visibility.",
    path: "/services/linkedin-makeover",
    cta: "Improve My LinkedIn",
  },
  {
    id: "career-guidance",
    icon: Target,
    title: "One-to-One Career Guidance",
    description: "Practical support for career direction, job-search strategy and salary discussions.",
    path: "/services/career-guidance",
    cta: "Book Career Guidance",
  },
];

const masterclass = {
  id: "masterclass",
  icon: GraduationCap,
  title: "Career Masterclasses",
  description: "Live sessions on job-search strategy, CV and LinkedIn workshops, and interview preparation.",
  path: "/services/masterclass",
  cta: "Explore Masterclasses",
};

const TILE_RADIUS = "rounded-[21px]";
const TILE_TRANSITION =
  "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function ServicesSection() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  // Bahrain/Oman only have CV Writing live (Unit 3A) - LinkedIn Makeover, Career Guidance
  // and Masterclass links would otherwise leak into dead NotFound pages (Unit 9 finding).
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const { pricing, isLoading } = useRegionPricing("cv-writing");
  const startingTier = pricing?.basic;
  const startingPrice = !isLoading && startingTier
    ? startingTier.currency === "INR"
      ? "₹" + startingTier.price.toLocaleString("en-IN")
      : startingTier.price.toLocaleString() + " " + startingTier.currency
    : null;

  const FeaturedIcon = featuredService.icon;
  const MasterclassIcon = masterclass.icon;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-[hsl(var(--surface-warm))] pb-16 pt-8 md:pb-24 md:pt-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-accent/[0.06] blur-3xl"
      />

      <div className="section-container relative z-10 max-w-[1180px]">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
          <h2
            id="services-heading"
            className="mb-5 font-serif text-[2rem] font-bold leading-tight tracking-tight text-foreground md:text-[2.625rem]"
          >
            Career Services Built to Get You Noticed
          </h2>
          <p className="mx-auto max-w-[760px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {content.homeServicesIntro}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          {/* Featured tile: Professional CV Writing - spans full width when the other
              tiles are hidden for limited-footprint regions, so it never leaves an
              awkward empty gap. */}
          <Reveal className={isLimitedFootprint ? "sm:col-span-2 lg:col-span-12" : "sm:col-span-2 lg:col-span-7 lg:row-span-2"}>
            <div
              className={`flex h-full flex-col overflow-hidden ${TILE_RADIUS} border border-accent/25 bg-[hsl(var(--surface-pink-soft))] p-7 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] sm:p-8 ${TILE_TRANSITION}`}
            >
              <div className="mb-5 flex min-h-11 items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/15">
                  <FeaturedIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-accent/15 bg-accent/10 px-3.5 py-2 text-sm font-semibold leading-none text-accent">
                  Most Popular
                </span>
              </div>

              <h3 className="text-[1.875rem] font-bold leading-tight tracking-tight md:text-[2.125rem]">
                {featuredService.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">
                {featuredService.description}
              </p>

              {startingPrice && (
                <p className="mt-4 w-fit rounded-full border border-accent/15 bg-accent/[0.08] px-3.5 py-2 text-lg font-semibold leading-none text-foreground">
                  From {startingPrice}
                </p>
              )}

              <ul className="mt-5 space-y-3" aria-label={featuredService.title + " includes"}>
                {featuredService.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3.5 text-base leading-7 text-foreground/85">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="cta"
                size="lg"
                className="mt-auto min-w-[220px] max-w-[300px] w-fit self-start h-[50px] rounded-xl px-6 text-base shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 focus-visible:ring-2 focus-visible:ring-offset-2"
                asChild
              >
                <Link to={"/" + selectedRegion.code + featuredService.path}>{featuredService.cta}</Link>
              </Button>
            </div>
          </Reveal>

          {/* Secondary tiles: LinkedIn + Career Guidance - not offered in Bahrain/Oman yet */}
          {!isLimitedFootprint && secondaryServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={0.08 + index * 0.06} className="lg:col-span-5">
                <div
                  className={`flex h-full min-h-[216px] flex-col justify-between ${TILE_RADIUS} border border-border/80 bg-card p-7 shadow-[var(--shadow-card)] hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] sm:p-8 ${TILE_TRANSITION}`}
                >
                  <div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-primary ring-1 ring-primary/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight">{service.title}</h3>
                    <p className="mt-2 text-base leading-6 text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    to={"/" + selectedRegion.code + service.path}
                    className="group mt-4 inline-flex w-fit items-center gap-1.5 text-base font-semibold text-primary transition-colors hover:text-accent"
                  >
                    {service.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            );
          })}

          {/* Masterclasses: full-width - not offered in Bahrain/Oman yet */}
          {!isLimitedFootprint && (
            <Reveal delay={0.2} className="sm:col-span-2 lg:col-span-12">
              <div
                className={`flex min-h-[155px] flex-col justify-center gap-5 ${TILE_RADIUS} border border-border/80 bg-card p-7 shadow-[var(--shadow-card)] hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center sm:justify-between sm:p-8 ${TILE_TRANSITION}`}
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-primary ring-1 ring-primary/10">
                    <MasterclassIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-tight tracking-tight">{masterclass.title}</h3>
                    <p className="mt-1 max-w-md text-base leading-6 text-muted-foreground">{masterclass.description}</p>
                  </div>
                </div>
                <Link
                  to={"/" + selectedRegion.code + masterclass.path}
                  className="group inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-primary transition-colors hover:text-accent"
                >
                  {masterclass.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
