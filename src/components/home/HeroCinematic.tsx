import { ArrowRight, Check, FileSearch, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import heroImage from "@/assets/hero-gcc-professional.webp";
import laurelArtwork from "../../../laurel.svg";

// Cinematic hero: the photo owns the whole first screen. It was shot wide (2.1:1) with the
// subject on the right and dark space on the left, so the statement sits in that space over a
// one-hue ink grade. The proof runs along the bottom like a credit line. The photo starts below
// the header bar (the home header overlaps the hero by 4rem), so the bar sits on paper.
export default function HeroCinematic() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const { pricing } = useRegionPricing("cv-writing");
  const basic = pricing?.basic;
  const startingPrice = basic ? (basic.currency === "INR" ? `₹${basic.price.toLocaleString("en-IN")}` : `${basic.price} ${basic.currency}`) : null;
  const isIndia = selectedRegion.code === "india";
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const whatsappUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I'd like help with my CV for jobs in ${isIndia ? "the GCC" : place}.`);

  const proof = [
    { strong: "500+ professionals", rest: "supported" },
    { strong: "Human written", rest: "& reviewed" },
    { strong: startingPrice ? `From ${startingPrice}` : "Free CV review", rest: startingPrice ? "CV packages" : "no obligation" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(hsl(var(--background))_0_4rem,hsl(var(--surface-ink))_4rem)] text-white">
      <img
        src={heroImage}
        alt="Professional reviewing career opportunities and CV strategy for GCC jobs"
        width="1823"
        height="863"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="hero-photo absolute inset-x-0 bottom-0 top-16 -z-10 h-[calc(100%-4rem)] w-full object-cover object-[72%_center] md:object-[70%_center]"
      />
      {/* One-hue ink grade: dense where the type sits, clear over the subject. Phones grade
          from the bottom, where the type sits once the layout stacks. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-16 -z-10 bg-[linear-gradient(to_top,hsl(var(--surface-ink))_0%,hsl(var(--surface-ink)/0.9)_45%,hsl(var(--surface-ink)/0.35)_75%,hsl(var(--surface-ink)/0.15)_100%)] md:bg-[linear-gradient(to_right,hsl(var(--surface-ink)/0.94)_0%,hsl(var(--surface-ink)/0.84)_38%,hsl(var(--surface-ink)/0.25)_68%,transparent_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 hidden h-48 bg-gradient-to-t from-[hsl(var(--surface-ink)/0.85)] to-transparent md:block" />

      <div className="section-container flex min-h-[clamp(640px,calc(100svh-2rem),900px)] flex-col pb-8 pt-[88px] sm:pt-[96px] md:justify-center md:pb-10 md:pt-[136px]">
        {/* Phones only: the original laurel badge, set as a compact award in the open photo area at
            top left (between the header, the headline and the subject). Sized to stay clear of the
            subject's face; the wreath is tinted through a mask to take the hero's white ink. */}
        <div className="w-[min(64%,15rem)] md:hidden">
          <span className="sr-only">500+ Professionals Supported. {selectedRegion.name} and GCC careers.</span>
          <div className="relative aspect-[2553/802] w-full" aria-hidden="true">
            <span
              className="absolute inset-0 bg-white/90"
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
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center text-center text-white [text-shadow:0_1px_10px_hsl(var(--surface-ink)/0.9)]">
              <span className="font-serif text-[1.625rem] font-medium leading-none tracking-[-0.02em]">500+</span>
              <span className="mt-1 text-[10px] font-bold uppercase leading-[1.15] tracking-[0.08em]">Professionals<br />Supported</span>
            </span>
          </div>
          <p aria-hidden="true" className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(192_70%_80%)] [text-shadow:0_1px_10px_hsl(var(--surface-ink)/0.9)]">
            {selectedRegion.name} · GCC Careers
          </p>
        </div>

        <div className="mt-auto max-w-[40rem] pt-8 md:my-auto md:pt-0">
          <h1 className="font-serif text-[clamp(2.75rem,1.6rem+3.6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.032em] text-white text-balance">
            Professional CV Writing{" "}
            <span className="font-normal italic text-[hsl(192_70%_78%)]">{isIndia ? "for GCC & International Jobs" : `for ${selectedRegion.name} & GCC Jobs`}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg leading-8 text-white/90 xl:text-xl xl:leading-9">
            Human-written, ATS-friendly CVs for {isIndia ? "GCC and international employers" : `${place} and GCC employers`}.{" "}
            <span className="text-white/70">Start with a free CV review, or send your CV on WhatsApp.</span>
          </p>

          <div id="hero-cta" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="cta" size="xl" onClick={() => openLeadModal({ trigger: "hero_cv_review" })} className="group min-h-14 w-full whitespace-normal px-7 text-base shadow-none hover:shadow-none focus-visible:ring-white focus-visible:ring-offset-[hsl(var(--surface-ink))] sm:w-auto sm:text-lg">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-micro group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" asChild className="min-h-14 w-full whitespace-normal border-2 border-white/60 bg-transparent px-6 text-base font-semibold text-white hover:border-white hover:bg-white hover:text-[hsl(var(--surface-ink))] focus-visible:ring-white focus-visible:ring-offset-[hsl(var(--surface-ink))] sm:w-auto sm:text-lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />Chat on WhatsApp
              </a>
            </Button>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-semibold text-white/75" aria-label="What to expect">
            <li className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" aria-hidden="true" />No obligation</li>
            <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Confidential</li>
          </ul>
        </div>

        {/* Proof as a credit line along the bottom edge. */}
        <div className="mt-12 grid grid-cols-2 gap-y-4 border-t border-white/20 pt-5 text-sm sm:grid-cols-4">
          {proof.map((item) => (
            <p key={item.strong} className="pr-4 leading-5">
              <span className="block font-bold text-white">{item.strong}</span>
              <span className="block text-white/70">{item.rest}</span>
            </p>
          ))}
          <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="group w-fit rounded-sm pr-4 leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <span className="block font-bold text-white">Google reviews</span>
            <span className="block text-white/80 underline decoration-white/40 underline-offset-4 transition-colors duration-200 group-hover:decoration-white">Read them</span>
          </a>
        </div>
      </div>
    </section>
  );
}
