import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalContext";
import { ArrowRight, FileSearch, MessageCircle } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useRegion } from "@/contexts/RegionContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function CTASection() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  const place = selectedRegion.code === "uae" ? "the UAE" : selectedRegion.name;
  const whatsappUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I'd like help with my CV for jobs in ${place}.`);

  return (
    <section data-sticky-cta-stop className="section-padding bg-primary text-primary-foreground">
      <Reveal className="section-container grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h2 className="heading-section">
            Send your CV today. <span className="font-normal italic">Get clear feedback, free.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90 sm:text-xl sm:leading-9">
            Use the short form or WhatsApp. A person reviews your CV for jobs in {place} and tells you what to improve.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              variant="cta"
              size="xl"
              onClick={() => openLeadModal({ trigger: "free_review_section" })}
              className="group min-h-14 w-full px-8 text-base shadow-none hover:shadow-none sm:w-auto sm:text-lg lg:w-full"
            >
              <FileSearch className="h-5 w-5" />
              Get My Free CV Review
              <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-micro group-hover:translate-x-1 motion-reduce:transition-none" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              asChild
              className="min-h-14 w-full border-primary-foreground/70 bg-transparent px-8 text-base text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary focus-visible:ring-primary-foreground focus-visible:ring-offset-primary sm:w-auto sm:text-lg lg:w-full"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-6 text-base text-primary-foreground/85">
            500+ professionals supported · Human written &amp; reviewed · Confidential
          </p>
        </div>
      </Reveal>
    </section>
  );
}
