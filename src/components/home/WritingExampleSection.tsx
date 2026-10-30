import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { cn } from "@/lib/utils";
import { REWRITE_EXAMPLES as examples } from "@/lib/data/rewriteExamples";

// The redline at full size: pick a role and the pen strikes the vague line, then the rewrite
// settles beneath it. The panel remounts per pick so the edit replays; at rest (no JS, reduced
// motion) both lines are fully drawn.
export default function WritingExampleSection() {
  const { openLeadModal } = useLeadModal();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  // The first edit plays when the sheet is actually on screen, not off-screen at page load.
  const [inView, setInView] = useState(false);
  const example = examples[active];

  useEffect(() => {
    const node = panelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Roving focus for the tablist (WAI-ARIA tabs pattern): arrows move, Home/End jump.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = examples.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-labelledby="writing-example-heading" className="section-padding bg-[hsl(var(--surface-warm))]">
      <div className="section-container grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 id="writing-example-heading" className="heading-section">What we change in your CV</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
            Recruiters skim. We turn vague duties into clear statements of what you did, with which tools, for whom.
          </p>

          <div role="tablist" aria-label="Example roles" aria-orientation="vertical" className="mt-8 flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-foreground/15">
            {examples.map((item, index) => (
              <button
                key={item.role}
                ref={(node) => { tabRefs.current[index] = node; }}
                type="button"
                role="tab"
                id={`example-tab-${index}`}
                aria-selected={active === index}
                aria-controls="example-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  "group flex min-h-11 items-center gap-3 rounded-full border px-5 text-left text-sm font-semibold transition-colors duration-200 ease-micro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "lg:min-h-[60px] lg:rounded-none lg:border-0 lg:border-b lg:border-foreground/15 lg:px-0 lg:text-lg",
                  active === index
                    ? "border-primary bg-primary text-primary-foreground lg:bg-transparent lg:text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40 lg:bg-transparent lg:text-muted-foreground lg:hover:text-foreground",
                )}
              >
                <span className="hidden font-serif text-sm tabular-nums text-muted-foreground lg:inline" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{item.role}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-[2px] w-8 origin-left bg-accent transition-transform duration-200 ease-micro lg:block",
                    active === index ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div ref={panelRef} id="example-panel" role="tabpanel" aria-labelledby={`example-tab-${active}`} className="cv-sheet">
            <div key={`${active}-${inView}`} className="px-6 py-8 sm:px-10 sm:py-12">
              <p className="text-sm font-semibold text-muted-foreground">Before</p>
              <p className="mt-3 font-serif text-[1.375rem] leading-[1.35] text-muted-foreground sm:text-[1.75rem]">
                <del className={cn("redline", inView && "redline--draw")}>“{example.before}”</del>
              </p>

              <p className="mt-10 text-sm font-semibold text-primary">After</p>
              <p
                className={cn(
                  inView && "rewrite-in",
                  "mt-3 font-serif text-[1.5rem] leading-[1.3] tracking-[-0.012em] text-foreground sm:text-[2.125rem] sm:leading-[1.22]",
                )}
                style={{ "--rewrite-delay": "380ms" } as CSSProperties}
              >
                <ins className="no-underline">“{example.after}”</ins>
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Illustrative examples, not client data. Every detail in your CV comes from your real experience.
          </p>

          {/* Ask at the moment the value is clearest: right after the edit. */}
          <div className="mt-8 flex flex-col gap-4 border-t border-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-2xl leading-tight tracking-[-0.015em]">Want to see what we&rsquo;d change in yours?</p>
            <Button
              variant="cta"
              size="lg"
              onClick={() => openLeadModal({ trigger: "free_review_section" })}
              className="group min-h-12 shrink-0 px-6 shadow-none hover:shadow-none"
            >
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Get My Free CV Review
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-micro group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
