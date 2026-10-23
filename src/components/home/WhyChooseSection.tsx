import { Globe, RefreshCw, ScanSearch, ShieldCheck, UserCheck } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import Reveal from "@/components/motion/Reveal";

// Compact two-column layout: one headline card + a single scannable list, instead of a
// grid of six large tiles. Same trust messages, no unsupported claims (the previous
// "3-5 business days" delivery promise and "beat applicant tracking systems" wording were
// removed because neither is verifiable).
export default function WhyChooseSection() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);

  const points = [
    { title: "Human Written & Reviewed", description: "Written and reviewed by a person, not templated software.", icon: UserCheck },
    { title: "ATS-Optimized", description: "Clear, ATS-friendly structure that is easy for systems and recruiters to read.", icon: ScanSearch },
    { title: content.marketFocus.title, description: content.marketFocus.description, icon: Globe },
    { title: "Revision Support", description: "Revisions are included according to your package.", icon: RefreshCw },
    { title: "Confidential Service", description: "Your details and documents are handled discreetly.", icon: ShieldCheck },
  ];

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden bg-[hsl(var(--surface-teal-soft))] py-14 sm:py-16 lg:py-[4.5rem]"
    >
      <div className="section-container max-w-[1180px]">
        <div className="grid items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col justify-center rounded-[var(--radius-bento)] border border-border/80 bg-card p-7 shadow-[var(--shadow-card)] sm:p-8">
              <h2 id="why-choose-heading" className="heading-section">
                Career documents built for the market you&apos;re targeting.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                We combine GCC market knowledge, human writers and practical support to help your application read clearly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="h-full divide-y divide-border/70 rounded-[var(--radius-bento)] border border-border/80 bg-card shadow-[var(--shadow-card)]">
              {points.map(({ title, description, icon: Icon }) => (
                <li key={title} className="flex items-start gap-4 px-5 py-4 sm:px-6">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-primary/10">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-base font-bold leading-tight">{title}</span>
                    <span className="mt-0.5 block text-[15px] leading-6 text-muted-foreground">{description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
