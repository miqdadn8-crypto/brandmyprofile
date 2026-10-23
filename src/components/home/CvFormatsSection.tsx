import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";

// One drawn page per CV format we actually write (routes: gcc-cv, ats-cv, europass-cv,
// cv-writing). Layouts are skeletons, not sample content: no names, scores or client data.
type Layout = "band" | "plain" | "sidebar" | "timeline";

const line = "block h-1.5 rounded-full bg-foreground/12";
const accent = "block h-1.5 rounded-full bg-primary/55";

function PaperBand() {
  return (
    <>
      <div className="-mx-5 -mt-5 mb-4 h-2 bg-primary" />
      <div className="flex items-center gap-3">
        <span className="h-11 w-11 shrink-0 rounded-full bg-primary/15" />
        <span className="grid flex-1 gap-1.5">
          <i className="block h-2.5 w-3/5 rounded-full bg-foreground/70" />
          <i className={`${line} w-2/5`} />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-y border-border/70 py-3">
        {[0, 1, 2, 3].map((n) => <i key={n} className={`${line} w-full`} />)}
      </div>
      {[0, 1].map((n) => (
        <div key={n} className="mt-4 grid gap-1.5">
          <i className={`${accent} w-1/4`} />
          <i className={`${line} w-full`} />
          <i className={`${line} w-11/12`} />
          <i className={`${line} w-4/5`} />
        </div>
      ))}
    </>
  );
}

function PaperPlain() {
  return (
    <>
      <i className="block h-3 w-1/2 rounded-full bg-foreground/70" />
      <i className={`${line} mt-2 w-2/5`} />
      {[0, 1, 2].map((n) => (
        <div key={n} className="mt-5 grid gap-1.5">
          <i className="block h-2 w-1/3 rounded-full bg-foreground/45" />
          <i className={`${line} w-full`} />
          <i className={`${line} w-full`} />
          <i className={`${line} w-3/4`} />
        </div>
      ))}
    </>
  );
}

function PaperSidebar() {
  return (
    <div className="-m-5 grid min-h-[17rem] grid-cols-[34%_1fr]">
      <div className="grid content-start gap-3 bg-primary/10 p-4">
        <span className="h-10 w-10 rounded-full bg-primary/25" />
        <i className={`${accent} w-full`} />
        <i className={`${line} w-4/5`} />
        <i className={`${line} w-3/5`} />
        <i className={`${accent} mt-2 w-3/4`} />
        <i className={`${line} w-full`} />
        <i className={`${line} w-2/3`} />
      </div>
      <div className="grid content-start gap-4 p-4">
        <i className="block h-2.5 w-3/5 rounded-full bg-foreground/70" />
        {[0, 1, 2].map((n) => (
          <div key={n} className="grid gap-1.5">
            <i className={`${accent} w-1/3`} />
            <i className={`${line} w-full`} />
            <i className={`${line} w-5/6`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PaperTimeline() {
  return (
    <>
      <i className="block h-3 w-1/2 rounded-full bg-foreground/70" />
      <i className={`${accent} mt-2 w-1/3`} />
      <div className="mt-5 grid gap-4 border-l border-primary/30 pl-4">
        {[0, 1, 2].map((n) => (
          <div key={n} className="relative grid gap-1.5">
            <span className="absolute -left-[1.3rem] top-0 h-2.5 w-2.5 rounded-full border-2 border-primary bg-white" />
            <i className="block h-2 w-2/5 rounded-full bg-foreground/45" />
            <i className={`${line} w-full`} />
            <i className={`${line} w-4/5`} />
          </div>
        ))}
      </div>
    </>
  );
}

const PAPERS: Record<Layout, () => JSX.Element> = {
  band: PaperBand,
  plain: PaperPlain,
  sidebar: PaperSidebar,
  timeline: PaperTimeline,
};

export default function CvFormatsSection() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);

  // Bahrain/Oman only have the main CV Writing page live; the format pages would be dead links.
  if (LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code)) return null;

  const formats: { title: string; caption: string; path: string; layout: Layout }[] = [
    { title: "GCC Standard CV", caption: "Structured for GCC job applications.", path: "/services/gcc-cv", layout: "band" },
    { title: "ATS Friendly CV", caption: "A clean single-column structure that is easy for systems and recruiters to read.", path: "/services/ats-cv", layout: "plain" },
    selectedRegion.code === "india"
      ? { title: "Europass CV", caption: "For European and international applications.", path: "/services/europass-cv", layout: "sidebar" }
      : { title: "Professional CV Writing", caption: "Written around your target role and hiring market.", path: "/services/cv-writing", layout: "timeline" },
  ];

  return (
    <section aria-labelledby="cv-formats-heading" className="section-padding bg-[hsl(var(--surface-teal-soft))]">
      <div className="section-container max-w-[1180px]">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <h2 id="cv-formats-heading" className="heading-section mb-4">
            Career documents built for the market you&apos;re targeting.
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">{content.marketFocus.description}</p>
        </Reveal>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {formats.map(({ title, caption, path, layout }, index) => {
            const Paper = PAPERS[layout];
            return (
              <li key={title}>
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    to={`/${selectedRegion.code}${path}`}
                    className="group flex h-full flex-col rounded-[var(--radius-bento)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(var(--surface-teal-soft))]"
                  >
                    <div
                      aria-hidden="true"
                      className="relative mx-auto aspect-[3/4] w-full max-w-[17rem] overflow-hidden rounded-lg border border-border/80 bg-white p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-card-hover)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                    >
                      <Paper />
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-bold leading-tight tracking-tight">{title}</h3>
                      <p className="mx-auto mt-2 max-w-xs text-base leading-6 text-muted-foreground">{caption}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-primary group-hover:underline">
                        See this format
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
