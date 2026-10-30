import { ArrowRight, Check, FileSearch, LayoutList, MessageCircle, Presentation, ScanSearch, Target } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Paid-ads landing page (/:region/free-cv-review): one message, one form (the shared lead
// modal) and WhatsApp. No site header, nav or footer links, so ad visitors have nowhere to
// wander. Kept out of the index (noindex) - it overlaps the homepage and CV writing pages.

const reviewAreas = [
  { label: "Structure", detail: "Order, sections and flow", icon: LayoutList },
  { label: "ATS readability", detail: "Formatting that screening software can read", icon: ScanSearch },
  { label: "Role positioning", detail: "How well it fits the job you want", icon: Target },
  { label: "Presentation", detail: "Clarity, length and polish", icon: Presentation },
];

const steps = [
  { title: "Send your CV", detail: "Use the short form (PDF, DOC or DOCX) or send it on WhatsApp." },
  { title: "A writer reviews it", detail: "A person checks it against the four areas above for your target role." },
  { title: "Get your feedback", detail: "We reply with what to improve. No obligation; the review is not a full rewrite." },
];

export default function FreeCvReview() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const { pricing } = useRegionPricing("cv-writing");
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const startingTier = pricing?.basic;
  const startingPrice = startingTier
    ? startingTier.currency === "INR" ? `₹${startingTier.price.toLocaleString("en-IN")}` : `${startingTier.price} ${startingTier.currency}`
    : null;
  const whatsappUrl = buildWhatsAppUrl(
    `Hello BrandMyProfile, I'd like a free CV review for jobs in ${place}. I'll send my CV here.`,
  );
  const openForm = () => openLeadModal({ trigger: "landing_page", service: "Professional CV Writing" });

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-warm))] pb-24 text-foreground sm:pb-0">
      <SEO
        title={`Free CV Review for ${selectedRegion.name} Jobs`}
        description={`Send your CV for a free review of structure, ATS readability and positioning for jobs in ${place}. A writer replies with what to improve.`}
        noindex
      />

      {/* Logo only: no navigation on an ads landing page. */}
      <div className="section-container flex h-16 items-center justify-between">
        <span className="flex items-center gap-2 text-lg font-bold">
          <img src="/brandmyprofile (20).png" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="text-primary">Brand</span><span className="-ml-2 text-accent">MyProfile</span>
        </span>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp
        </a>
      </div>

      <main>
        <section className="section-container grid gap-10 pb-14 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-12">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.02em]">
              Free CV Review for {selectedRegion.name} Jobs
            </h1>
            <p className="mt-5 text-lg leading-8 text-foreground/75 sm:text-xl">
              Send your CV. A writer checks its structure, ATS readability and positioning for the role you want in {place}, and tells you exactly what to improve.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="xl" className="group min-h-14 w-full px-6 text-base sm:w-auto sm:text-lg" onClick={openForm}>
                <FileSearch className="h-5 w-5" aria-hidden="true" />
                Get My Free CV Review
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="xl" asChild className="min-h-14 w-full bg-card/70 px-6 text-base sm:w-auto sm:text-lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />Send it on WhatsApp
                </a>
              </Button>
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground">
              {["Free, no obligation", "Human reviewed", "Confidential"].map((item) => (
                <li key={item} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-bento)] border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <h2 className="text-xl font-bold tracking-tight">What we check</h2>
            <ul className="mt-5 space-y-4">
              {reviewAreas.map(({ label, detail, icon: Icon }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-primary/10"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span><span className="block font-semibold">{label}</span><span className="block text-sm leading-6 text-muted-foreground">{detail}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-card py-12 sm:py-16">
          <div className="section-container">
            <h2 className="heading-section text-center">How it works</h2>
            <ol className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-base leading-7 text-muted-foreground">{step.detail}</p>
                </li>
              ))}
            </ol>
            <div className="mx-auto mt-10 max-w-2xl text-center">
              {startingPrice && (
                <p className="text-base text-muted-foreground">
                  Want us to rewrite it for you? CV writing packages in {place} start from <span className="font-bold text-foreground">{startingPrice}</span>.
                </p>
              )}
              <Button variant="cta" size="xl" className="mt-6 min-h-14 w-full px-8 text-base sm:w-auto sm:text-lg" onClick={openForm}>
                <FileSearch className="h-5 w-5" aria-hidden="true" />
                Get My Free CV Review
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="section-container py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} BrandMyProfile ·{" "}
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
      </footer>

      {/* Phones: the action stays in reach while scrolling. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur sm:hidden">
        <Button variant="cta" size="lg" className="min-h-12 w-full text-base" onClick={openForm}>
          Get My Free CV Review
        </Button>
      </div>
    </div>
  );
}
