import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import Reveal from "@/components/motion/Reveal";
import { useRegion } from "@/contexts/RegionContext";
import { useHomeFaqs } from "@/hooks/useHomeFaqs";

export default function FAQSection() {
  const { selectedRegion } = useRegion();
  const regionFaqs = useHomeFaqs();

  return (
    <section className="section-padding bg-background">
      <div className="section-container grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="heading-section mb-5">Frequently Asked Questions</h2>
            <p className="max-w-sm text-lg leading-8 text-muted-foreground">
              Find out what to expect before you get started. Still unsure?{" "}
              <Link to={`/${selectedRegion.code}/contact`} className="font-semibold text-primary underline underline-offset-4">Contact us</Link>.
            </p>
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full border-t border-foreground/15">
            {regionFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-foreground/15">
                <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:no-underline hover:text-primary [&[data-state=open]]:text-primary">
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
