import { Globe, RefreshCw, ScanSearch, ShieldCheck, UserCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import Reveal from "@/components/motion/Reveal";

const smallTiles = [
  {
    title: "Fast Delivery",
    description: "Get your professionally crafted CV within 3-5 business days.",
    icon: Zap,
  },
  {
    title: "Revision Support",
    description: "We work with you through multiple rounds of revisions until you're happy.",
    icon: RefreshCw,
  },
  {
    title: "Confidential Service",
    description: "Your details and documents are always handled discreetly and securely.",
    icon: ShieldCheck,
  },
];

const tileClass =
  "flex h-full flex-col rounded-[var(--radius-bento)] border border-border/80 bg-card shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[3px] hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function WhyChooseSection() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);

  const mediumTiles = [
    {
      title: "ATS-Optimized",
      description: "Beat applicant tracking systems and get your resume in front of real humans.",
      icon: ScanSearch,
    },
    {
      title: content.marketFocus.title,
      description: content.marketFocus.description,
      icon: Globe,
    },
  ];

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="section-padding relative overflow-hidden bg-[hsl(var(--surface-teal-soft))]"
    >
      <div className="section-container max-w-[1180px]">
        <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.16em] text-primary md:text-left">
          The BrandMyProfile difference
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {/* Large tile: headline */}
          <Reveal className="sm:col-span-2 lg:col-span-3 lg:row-span-2">
            <div className={cn(tileClass, "justify-between p-8 sm:p-9")}>
              <h2
                id="why-choose-heading"
                className="max-w-md font-serif text-[2rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[2.75rem]"
              >
                Career documents built for the market you&apos;re targeting.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                We combine GCC hiring expertise, experienced writers and practical support to help your application
                earn a closer look.
              </p>
            </div>
          </Reveal>

          {/* Medium tiles */}
          {mediumTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <Reveal key={tile.title} delay={0.06 + index * 0.06} className="lg:col-span-3">
                <div className={cn(tileClass, "p-7 sm:p-8")}>
                  <div className="mb-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-primary ring-1 ring-primary/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold leading-tight tracking-tight">{tile.title}</h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">{tile.description}</p>
                </div>
              </Reveal>
            );
          })}

          {/* Wide tile: Human Writing & Review */}
          <Reveal delay={0.18} className="sm:col-span-2 lg:col-span-6">
            <div className={cn(tileClass, "flex-row items-center gap-6 p-7 sm:p-8")}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-primary ring-1 ring-primary/10">
                <UserCheck className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight tracking-tight">Human Writing &amp; Review</h3>
                <p className="mt-1.5 text-base leading-7 text-muted-foreground">
                  Every CV is written and reviewed by an experienced career writer, not templated software.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Small tiles */}
          {smallTiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <Reveal key={tile.title} delay={0.24 + index * 0.06} className="lg:col-span-2">
                <div className={cn(tileClass, "p-6 sm:p-7")}>
                  <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-primary/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold leading-tight tracking-tight">{tile.title}</h3>
                  <p className="mt-1.5 text-base leading-6 text-muted-foreground">{tile.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
