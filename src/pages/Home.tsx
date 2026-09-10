import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import RegionsSection from "@/components/home/RegionsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import RecentJobsSection from "@/components/home/RecentJobsSection";
import BlogSection from "@/components/home/BlogSection";
import { organizationSchema, professionalServiceSchema, websiteSchema } from "@/lib/seo/organization";
import faqs from "@/lib/data/faqs.json";
import { ArrowRight, Globe2, Plane } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent, getFaqsForRegion } from "@/lib/data/regionContent";

export default function Home() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const regionFaqs = getFaqsForRegion(selectedRegion.code, faqs);

  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      professionalServiceSchema,
      websiteSchema,
      {
        "@type": "FAQPage",
        "@id": "https://www.brandmyprofile.com/#faq",
        mainEntity: regionFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        keywords="CV writing services Kuwait, resume writing GCC, ATS CV writing, LinkedIn profile optimization Kuwait, career coaching GCC, interview coaching Kuwait, UAE careers, Saudi jobs, Qatar jobs, India jobs"
        structuredData={homePageSchema}
      />
      <Header />
      <main>
        <Hero />
        {content.aeoBlock && (
          <section className="bg-[hsl(var(--surface-warm))] pb-16 pt-8 md:pb-20 md:pt-8" aria-labelledby="aeo-question">
            <div className="section-container max-w-3xl">
              <h2 id="aeo-question" className="mb-3 text-xl font-bold leading-snug sm:text-2xl">
                {content.aeoBlock.question}
              </h2>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{content.aeoBlock.answer}</p>
            </div>
          </section>
        )}
        {/* India-only compact wayfinding (Unit 5) - never shown for other regions, and
            deliberately just two text-forward cards rather than a Bento restructure. */}
        {selectedRegion.code === "india" && (
          <section className="border-y border-border bg-[hsl(var(--surface-warm))] py-10" aria-labelledby="target-market-heading">
            <div className="section-container">
              <p id="target-market-heading" className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Where Are You Targeting?
              </p>
              <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
                <a
                  href="/india/gcc-jobs"
                  className="group flex items-center gap-4 rounded-[1.25rem] border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Globe2 className="h-8 w-8 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block text-lg font-semibold tracking-normal">GCC Jobs</span>
                    <span className="block text-sm text-muted-foreground">CV &amp; career guidance for Kuwait, UAE, Saudi Arabia and Qatar</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/india/europe-jobs"
                  className="group flex items-center gap-4 rounded-[1.25rem] border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Plane className="h-8 w-8 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block text-lg font-semibold tracking-normal">European / International Jobs</span>
                    <span className="block text-sm text-muted-foreground">CV, Europass and career guidance for international applications</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </section>
        )}
        <ServicesSection />
        <WhyChooseSection />
        <RegionsSection />
        <RecentJobsSection />
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
