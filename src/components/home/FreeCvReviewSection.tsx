import { ArrowRight, FileSearch, LayoutList, MessageCircle, Presentation, ScanSearch, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/motion/Reveal";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { useRegion } from "@/contexts/RegionContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const reviewAreas = [
  { label: "Structure", detail: "Order, sections and flow", icon: LayoutList },
  { label: "ATS Readability", detail: "Formatting software can parse", icon: ScanSearch },
  { label: "Role Positioning", detail: "Fit with your target role", icon: Target },
  { label: "Presentation", detail: "Clarity, length and polish", icon: Presentation },
];

// Document-style visual built from plain CSS (no image request, nothing to load, no fake
// scores or client data): skeleton CV lines with the four review areas as margin notes.
function ReviewVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]" aria-hidden="true">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] rounded-[var(--radius-bento)] bg-primary/10" />
      <div className="relative rounded-[var(--radius-bento)] border border-border bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/15" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/5 rounded-full bg-foreground/80" />
            <div className="h-2.5 w-2/5 rounded-full bg-foreground/25" />
          </div>
        </div>
        <div className="mt-6 space-y-5">
          {[0, 1, 2].map((block) => (
            <div key={block} className="space-y-2">
              <div className="h-2.5 w-1/4 rounded-full bg-primary/60" />
              <div className="h-2 w-full rounded-full bg-foreground/10" />
              <div className="h-2 w-11/12 rounded-full bg-foreground/10" />
              <div className="h-2 w-4/5 rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
        <span className="absolute -left-3 top-8 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md sm:-left-5">Structure</span>
        <span className="absolute -right-2 top-1/3 rounded-full bg-primary/80 px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md sm:-right-5">ATS Readability</span>
        <span className="absolute -left-2 bottom-24 rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-background shadow-md sm:-left-5">Role Positioning</span>
        <span className="absolute -right-2 bottom-8 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md sm:-right-5">Presentation</span>
      </div>
    </div>
  );
}

export default function FreeCvReviewSection() {
  const { openLeadModal } = useLeadModal();
  const { selectedRegion } = useRegion();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello BrandMyProfile, I'd like a free CV review for ${selectedRegion.name}. Please let me know how to send my CV.`,
  );

  return (
    <section aria-labelledby="free-review-heading" className="section-padding overflow-hidden bg-[hsl(var(--surface-warm))]">
      <div className="section-container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <h2 id="free-review-heading" className="heading-section max-w-xl">
            Not Sure What&rsquo;s Holding Your CV Back?
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Send us your current CV and we&rsquo;ll review its structure, clarity, ATS readability and positioning for your target role.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="What the free review looks at">
            {reviewAreas.map(({ label, detail, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-primary ring-1 ring-primary/10">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-bold leading-tight">{label}</span>
                  <span className="block text-sm text-muted-foreground">{detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="cta"
              size="xl"
              onClick={() => openLeadModal({ trigger: "free_review_section" })}
              className="group min-h-14 w-full px-6 text-base sm:w-auto sm:text-lg"
            >
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" asChild className="min-h-14 w-full bg-white/70 px-6 text-base sm:w-auto sm:text-lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Continue on WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            A short request form opens; you can attach your CV (PDF, DOC or DOCX) if you wish. No obligation, and this is a review, not a full rewrite.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ReviewVisual />
        </Reveal>
      </div>
    </section>
  );
}
