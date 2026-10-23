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

const steps = [
  { title: "Tell us what you're targeting", detail: "Choose CV writing, share your contact details and tell us the role or market you have in mind." },
  { title: "Share your current CV", detail: "Attach a PDF, DOC or DOCX in the request form, or arrange to send it on WhatsApp." },
  { title: "Discuss the next step", detail: "Our team will contact you about your request. The free review helps identify improvements; a full rewrite is a separate service." },
];

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
              <li key={label} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3">
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

          <div className="mt-8 flex flex-col gap-3 xl:flex-row">
            <Button
              variant="cta"
              size="xl"
              onClick={() => openLeadModal({ trigger: "free_review_section" })}
              className="group min-h-14 w-full px-6 text-base xl:w-auto xl:text-lg"
            >
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" asChild className="min-h-14 w-full bg-card/70 px-6 text-base xl:w-auto xl:text-lg">
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
          <div className="rounded-[var(--radius-bento)] border border-primary/15 bg-card p-6 sm:p-8">
            <h3 className="text-2xl">How the free review works</h3>
            <ol className="mt-7 space-y-7">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-primary" aria-hidden="true">{index + 1}</span>
                  <div><h4 className="text-base font-bold">{step.title}</h4><p className="mt-2 text-base leading-7 text-muted-foreground">{step.detail}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
