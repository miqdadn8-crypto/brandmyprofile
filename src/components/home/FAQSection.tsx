import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "@/components/motion/Reveal";
import faqs from "@/lib/data/faqs.json";
import { useRegion } from "@/contexts/RegionContext";
import { getFaqsForRegion } from "@/lib/data/regionContent";

export default function FAQSection() {
  const { selectedRegion } = useRegion();
  const regionFaqs = getFaqsForRegion(selectedRegion.code, faqs);

  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <h2 className="mb-4 font-serif">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Can't find what you're looking for? Contact us!
          </p>
        </Reveal>

        <div className="max-w-[820px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {regionFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/80">
                <AccordionTrigger className="py-5 text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
