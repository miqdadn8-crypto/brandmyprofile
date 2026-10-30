import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileSearch,
  MessageCircle,
  ShieldCheck,
  Star,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { REWRITE_EXAMPLES } from "@/lib/data/rewriteExamples";
import heroImage from "@/assets/hero-gcc-professional.webp";

// The signature: a sheet of CV paper where the editor's red pen strikes a vague line and the
// rewrite settles beneath it. "Next edit" replays it on another example. Both lines are fully
// drawn at rest, so no-JS, reduced motion and screen readers get the finished edit.
function RedlineSheet() {
  const [index, setIndex] = useState(0);
  const [replayed, setReplayed] = useState(false);
  const example = REWRITE_EXAMPLES[index];
  const timing = (first: string, again: string) => (replayed ? again : first);

  return (
    <figure
      className="cv-sheet intro-rise overflow-hidden"
      style={{ "--intro-delay": "150ms" } as CSSProperties}
      aria-label="Example CV edit"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-2">
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

      <div key={index} className="px-5 pb-5 pt-4" aria-live="polite">
        <p className="font-serif text-lg leading-7 text-muted-foreground">
          <span className="sr-only">Before: </span>
          <del className="redline redline--draw" style={{ "--redline-delay": timing("700ms", "0ms") } as CSSProperties}>
            {example.before}
          </del>
        </p>
        <p
          className="rewrite-in mt-3 font-serif text-[1.1875rem] leading-[1.45] text-foreground"
          style={{ "--rewrite-delay": timing("1000ms", "320ms") } as CSSProperties}
        >
          <span className="sr-only">After: </span>
          <ins className="no-underline">{example.after}</ins>
        </p>
      </div>

      {/* What the free review covers: ties the edit to the primary action. No scores or outcomes. */}
      <figcaption className="flex gap-2.5 border-t border-border bg-secondary/70 px-5 py-3.5 text-sm leading-6 text-foreground/80">
        <FileSearch className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          <span className="font-semibold text-foreground">Your free CV review covers</span> structure and clarity, ATS readability and fit with your target role.
        </p>
      </figcaption>
    </figure>
  );
}

// Proof a stranger can check at a glance: real client count, how the work is done, the
// starting price, and the Google reviews (linked, as the live feed is not set up yet).
// A hairline row rather than boxes, so it supports the CTAs instead of competing with them.
function ProofRow({ startingPrice }: { startingPrice: string | null }) {
  const cell = "flex flex-col gap-0.5 py-4 pr-4";
  return (
    <div className="grid grid-cols-2 border-t border-foreground/15 sm:grid-cols-4 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-foreground/10 sm:[&>*:nth-child(n+3)]:border-t-0">
      <div className={cell}>
        <UsersRound className="mb-1.5 h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-bold leading-5">500+ professionals</p>
        <p className="text-sm leading-5 text-muted-foreground">supported</p>
      </div>
      <div className={cell}>
        <UserRoundCheck className="mb-1.5 h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-bold leading-5">Human written</p>
        <p className="text-sm leading-5 text-muted-foreground">&amp; reviewed</p>
      </div>
      <div className={cell}>
        <BadgeCheck className="mb-1.5 h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-bold leading-5 tabular-nums">{startingPrice ? `From ${startingPrice}` : "Free CV review"}</p>
        <p className="text-sm leading-5 text-muted-foreground">{startingPrice ? "CV packages" : "no obligation"}</p>
      </div>
      <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={`${cell} group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}>
        <Star className="mb-1.5 h-4 w-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-bold leading-5">Google reviews</p>
        <p className="text-sm leading-5 text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary">Read them</p>
      </a>
    </div>
  );
}

export default function Hero() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const { pricing } = useRegionPricing("cv-writing");
  const basic = pricing?.basic;
  const startingPrice = basic ? (basic.currency === "INR" ? `₹${basic.price.toLocaleString("en-IN")}` : `${basic.price} ${basic.currency}`) : null;
  const isIndia = selectedRegion.code === "india";
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const whatsappUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I'd like help with my CV for jobs in ${isIndia ? "the GCC" : place}.`);

  // Split screen: the left half holds the statement and actions, aligned to the site container's
  // left edge (max-w-7xl + its padding) so it lines up with the header and every section below;
  // the right half is the photo, full height and bleeding off the right edge of the viewport.
  return (
    <section className="relative border-b border-border bg-background lg:grid lg:min-h-[clamp(640px,calc(100svh-2rem),920px)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col justify-center px-4 pb-12 pt-[104px] sm:px-6 sm:pt-[120px] lg:py-0 lg:pb-14 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-14 lg:pt-[112px] xl:pr-20">
        {/* One statement owns the first screen; the region phrase is the single italic turn. */}
        <h1 className="font-serif text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
          Professional CV Writing{" "}
          <span className="font-normal italic text-primary">{isIndia ? "for GCC & International Jobs" : `for ${selectedRegion.name} & GCC Jobs`}</span>
        </h1>

        <p className="mt-6 max-w-[34rem] text-lg leading-8 text-foreground/85 xl:text-xl xl:leading-9">
          Human-written, ATS-friendly CVs for {isIndia ? "GCC and international employers" : `${place} and GCC employers`}.{" "}
          <span className="text-muted-foreground">Start with a free CV review, or send your CV on WhatsApp.</span>
        </p>

        <div id="hero-cta" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-semibold text-muted-foreground" aria-label="What to expect">
          <li className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" aria-hidden="true" />No obligation</li>
          <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />Confidential</li>
        </ul>

        <div className="mt-10 max-w-[40rem] xl:mt-12">
          <ProofRow startingPrice={startingPrice} />
        </div>
      </div>

      <div className="relative min-w-0 pb-10 lg:pb-0 lg:pt-16">
        <div className="relative h-[360px] overflow-hidden bg-primary sm:h-[460px] lg:absolute lg:inset-0 lg:top-16 lg:h-auto">
          <img
            src={heroImage}
            alt="Professional reviewing career opportunities and CV strategy for GCC jobs"
            width="1823"
            height="863"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="hero-photo h-full w-full object-cover object-[80%_center] sm:object-[76%_center] lg:object-[80%_center]"
          />
          {/* One-hue grade so the photo sits in the teal palette and the card reads against it. */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/5 to-transparent" aria-hidden="true" />
        </div>

        {/* The redline card straddles the seam; its overhang stays inside the left column's right padding (pr-14 / pr-20) so it never covers the CTAs or proof. */}
        <div className="relative z-10 -mt-24 mx-4 sm:mx-auto sm:w-[400px] lg:absolute lg:bottom-12 lg:-left-10 lg:mx-0 lg:mt-0 lg:w-[340px] xl:-left-14 xl:w-[370px]">
          <RedlineSheet />
        </div>
      </div>
    </section>
  );
}
