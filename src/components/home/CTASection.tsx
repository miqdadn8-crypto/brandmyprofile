import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { ArrowRight, Calendar, FileSearch } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";

export default function CTASection() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const content = getRegionContent(selectedRegion.code);
  // Bahrain/Oman have no /schedule page yet (Unit 3A) - fall back to Contact, matching
  // Header.tsx's existing bookConsultationPath pattern (Unit 9 broken-link fix).
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const secondaryCtaPath = `/${selectedRegion.code}${isLimitedFootprint ? "/contact" : "/schedule"}`;

  return (
    <section className="section-padding bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
      <Reveal className="section-container text-center">
        <h2 className="heading-section mb-6">
          Start with a clearer picture of your CV.
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-primary-foreground/90">
          {content.ctaSupportingText}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-5">
          <div className="transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none">
            <Button
              variant="cta"
              size="xl"
              onClick={() => openLeadModal({ trigger: "free_review_section" })}
              className="group min-h-14 w-full px-8 text-base sm:w-auto sm:text-lg"
            >
              <FileSearch className="h-5 w-5" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none">
            <Button
              variant="outline"
              size="xl"
              asChild
              className="min-h-14 w-full border-primary-foreground bg-primary-foreground/10 px-8 text-base text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:w-auto sm:text-lg"
            >
              <Link to={secondaryCtaPath}>
                <Calendar className="h-5 w-5" />
                Book Free Consultation
              </Link>
            </Button>
          </div>
        </div>

        <p className="mt-9 text-base text-primary-foreground/80">
          No obligation • Human written &amp; reviewed • Confidential
        </p>
      </Reveal>
    </section>
  );
}
