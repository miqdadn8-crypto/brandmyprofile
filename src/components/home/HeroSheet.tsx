import { useState, type CSSProperties } from "react";
import { ArrowRight, Check, FileSearch, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { REWRITE_EXAMPLES } from "@/lib/data/rewriteExamples";

// The CV page is the hero: a centred statement above a sheet of CV paper rising from the bottom
// edge, where the red pen strikes a vague line, notes why in the margin, and the rewrite settles
// in. "Next edit" replays it. At rest (no JS, reduced motion) the finished edit is shown.
export default function HeroSheet() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const { pricing } = useRegionPricing("cv-writing");
  const [index, setIndex] = useState(0);
  const [replayed, setReplayed] = useState(false);
  const example = REWRITE_EXAMPLES[index];
  const timing = (first: string, again: string) => (replayed ? again : first);
  const basic = pricing?.basic;
  const startingPrice = basic ? (basic.currency === "INR" ? `₹${basic.price.toLocaleString("en-IN")}` : `${basic.price} ${basic.currency}`) : null;
  const isIndia = selectedRegion.code === "india";
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const whatsappUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I'd like help with my CV for jobs in ${isIndia ? "the GCC" : place}.`);

  return (
    <section className="relative overflow-hidden border-b border-border bg-[hsl(var(--surface-warm))]">
      <div className="section-container pt-[104px] text-center sm:pt-[116px]">
        <h1 className="mx-auto max-w-[16ch] font-serif text-[clamp(2.6rem,1.5rem+3.2vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.032em] text-balance">
          Professional CV Writing{" "}
          <span className="font-normal italic text-primary">{isIndia ? "for GCC & International Jobs" : `for ${selectedRegion.name} & GCC Jobs`}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-[38rem] text-lg leading-8 text-foreground/85 xl:text-xl xl:leading-9">
          Human-written, ATS-friendly CVs for {isIndia ? "GCC and international employers" : `${place} and GCC employers`}.{" "}
          <span className="text-muted-foreground">Start with a free CV review, or send your CV on WhatsApp.</span>
        </p>

        <div id="hero-cta" className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="cta" size="xl" onClick={() => openLeadModal({ trigger: "hero_cv_review" })} className="group min-h-14 w-full whitespace-normal px-7 text-base shadow-none hover:shadow-none sm:w-auto sm:text-lg">
            <FileSearch className="h-5 w-5" aria-hidden="true" />
            Get My Free CV Review
            <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-micro group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="xl" asChild className="min-h-14 w-full whitespace-normal border-2 border-primary/40 bg-transparent px-6 text-base font-semibold text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground sm:w-auto sm:text-lg">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />Chat on WhatsApp
            </a>
          </Button>
        </div>

        {/* Expectations and proof in one quiet line, so nothing competes with the two actions. */}
        <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-x-5 gap-y-1.5 text-sm font-medium text-muted-foreground" aria-label="What to expect">
          <li className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" aria-hidden="true" />No obligation</li>
          <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />Confidential</li>
          <li><span className="font-semibold text-foreground">500+ professionals</span> supported</li>
          <li><span className="font-semibold text-foreground">Human written</span> &amp; reviewed</li>
          {startingPrice && <li className="tabular-nums"><span className="font-semibold text-foreground">From {startingPrice}</span> CV packages</li>}
          <li>
            <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-200 hover:decoration-primary">
              Google reviews
            </a>
          </li>
        </ul>

        {/* The CV page, rising from the bottom edge of the first screen. */}
        <figure
          className="cv-sheet intro-rise relative mx-auto mt-12 max-w-[58rem] rounded-b-none border-b-0 text-left"
          style={{ "--intro-delay": "200ms" } as CSSProperties}
          aria-label="Example CV edit"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-2 sm:px-10">
            <p className="text-sm font-semibold text-muted-foreground">
              Example edit <span aria-hidden="true">·</span> {example.role}
            </p>
            <button
              type="button"
              onClick={() => {
                setIndex((current) => (current + 1) % REWRITE_EXAMPLES.length);
                setReplayed(true);
              }}
              className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-primary transition-colors duration-200 ease-micro hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Next edit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div key={index} className="grid gap-x-10 px-5 pb-10 pt-5 sm:px-10 sm:pb-14 md:grid-cols-[minmax(0,1fr)_13rem]" aria-live="polite">
            <div>
              <p className="font-serif text-xl font-medium tracking-[-0.01em]">Experience</p>
              <p className="mt-3 font-serif text-lg leading-8 text-muted-foreground sm:text-xl">
                <span className="sr-only">Before: </span>
                <del className="redline redline--draw" style={{ "--redline-delay": timing("800ms", "0ms") } as CSSProperties}>{example.before}</del>
              </p>
              <p
                className="rewrite-in mt-4 font-serif text-[1.375rem] leading-[1.4] tracking-[-0.01em] text-foreground sm:text-[1.75rem] sm:leading-[1.35]"
                style={{ "--rewrite-delay": timing("1150ms", "380ms") } as CSSProperties}
              >
                <span className="sr-only">After: </span>
                <ins className="no-underline">{example.after}</ins>
              </p>
            </div>

            {/* The editor's margin note, in the same red ink as the strike. */}
            <p
              className="rewrite-in mt-6 border-l-2 border-accent/70 pl-4 font-serif text-base italic leading-6 text-accent md:mt-[3.25rem]"
              style={{ "--rewrite-delay": timing("950ms", "200ms") } as CSSProperties}
            >
              Too vague. Say what you did, with which tools, for whom.
            </p>
          </div>
        </figure>
      </div>
    </section>
  );
}
