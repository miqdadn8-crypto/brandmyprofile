import { ArrowRight, FileSearch, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/motion/Reveal";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { CV_PACKAGES } from "@/lib/data/cvPackages";
import { buildPackageEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Answers "how much?" on the homepage: package names, who each is for and the local price.
// Inclusions stay on the Pricing page. Renders nothing for regions without published prices.
export default function PackagesPreview() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const { pricing, isLoading } = useRegionPricing("cv-writing");
  if (isLoading || !pricing?.basic) return null;

  const format = (tierKey: string) => {
    const tier = pricing[tierKey as keyof typeof pricing];
    if (!tier) return null;
    return tier.currency === "INR" ? `₹${tier.price.toLocaleString("en-IN")}` : `${tier.price} ${tier.currency}`;
  };

  return (
    <section aria-labelledby="packages-heading" className="section-padding bg-background">
      <div className="section-container">
        <Reveal className="mb-10 grid gap-5 md:mb-14 lg:grid-cols-12 lg:items-end">
          <h2 id="packages-heading" className="heading-section lg:col-span-7">Simple prices in {selectedRegion.currency}</h2>
          <p className="max-w-md text-lg leading-8 text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Three CV packages. Not sure which fits? Start with the free review and we&apos;ll recommend one.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 md:gap-0 md:overflow-hidden md:rounded-[var(--radius-bento)] md:border md:border-border">
          {CV_PACKAGES.map((pkg, index) => {
            const price = format(pkg.tierKey);
            if (!price) return null;
            const featured = pkg.isFeatured;
            return (
              <Reveal
                key={pkg.tierKey}
                delay={index * 0.08}
                className={cn(
                  "relative flex flex-col rounded-[var(--radius-bento)] border p-7 md:rounded-none md:border-0 lg:p-9",
                  featured ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  index > 0 && !featured && "md:border-l md:border-border",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  {featured && <span className="text-sm font-semibold text-primary-foreground/85">Most popular</span>}
                </div>
                <p className={cn("mt-8 font-serif text-5xl font-medium tabular-nums tracking-[-0.03em] lg:text-6xl", featured ? "text-primary-foreground" : "text-foreground")}>
                  {price}
                </p>
                <p className={cn("mt-5 flex-1 text-base leading-7", featured ? "text-primary-foreground/85" : "text-muted-foreground")}>{pkg.bestFor}</p>
                <a
                  href={buildWhatsAppUrl(buildPackageEnquiryMessage({ packageName: pkg.name, serviceName: "CV Writing", regionName: selectedRegion.name, price }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="package_cta_click"
                  data-track-package={pkg.name}
                  data-track-service="home"
                  className={cn(
                    "mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 px-5 font-semibold transition-colors duration-200 ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    featured
                      ? "border-primary-foreground bg-primary-foreground text-primary hover:bg-transparent hover:text-primary-foreground focus-visible:ring-primary-foreground focus-visible:ring-offset-primary"
                      : "border-primary/40 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring",
                  )}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />Ask about {pkg.name}
                </a>
              </Reveal>
            );
          })}
        </div>
        {/* Undecided visitors get the free review, not a dead end. */}
        <div className="mt-8 flex flex-col gap-4 rounded-[var(--radius-bento)] bg-[hsl(var(--surface-warm))] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="font-serif text-2xl leading-tight tracking-[-0.015em]">Not sure which package fits?</p>
            <p className="mt-1 text-base text-muted-foreground">Send your CV for a free review and we&apos;ll recommend one. No obligation.</p>
          </div>
          <button
            type="button"
            onClick={() => openLeadModal({ trigger: "pricing" })}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-accent-foreground transition-colors duration-200 ease-micro hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <FileSearch className="h-5 w-5" aria-hidden="true" />
            Get My Free CV Review
          </button>
        </div>
        <p className="mt-6">
          <Link to={`/${selectedRegion.code}/pricing`} className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline decoration-primary/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-primary">
            Compare what each package includes
            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-micro group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
