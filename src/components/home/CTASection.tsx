import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileSearch } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { getRegionContent } from "@/lib/data/regionContent";

export default function CTASection() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  // Bahrain/Oman have no /schedule page yet (Unit 3A) - fall back to Contact, matching
  // Header.tsx's existing bookConsultationPath pattern (Unit 9 broken-link fix).
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const secondaryCtaPath = `/${selectedRegion.code}${isLimitedFootprint ? "/contact" : "/schedule"}`;

  return (
    <section className="section-padding bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
      <Reveal className="section-container text-center">
        <h2 className="mb-6 font-serif text-[2.25rem] leading-tight sm:text-[2.75rem] lg:text-[3.25rem]">
          Ready to Transform Your Career?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-primary-foreground/90">
          {content.ctaSupportingText}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-5">
          <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="cta"
              size="xl"
              asChild
              className="group min-h-14 w-full px-8 text-base sm:w-auto sm:text-lg"
            >
              <Link to={`/${selectedRegion.code}/contact`}>
                <FileSearch className="h-5 w-5" />
                Get My Free CV Review
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="min-h-14 w-full border-white bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white hover:text-primary sm:w-auto sm:text-lg"
            >
              <Link to={secondaryCtaPath}>
                <Calendar className="h-5 w-5" />
                Book Free Consultation
              </Link>
            </Button>
          </motion.div>
        </div>

        <p className="mt-9 text-base text-primary-foreground/80">
          Free consultation • Human written &amp; reviewed • Confidential
        </p>
      </Reveal>
    </section>
  );
}
