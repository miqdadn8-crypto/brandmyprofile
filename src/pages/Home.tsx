import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/home/HeroCinematic";
import ServicesSection from "@/components/home/ServicesSection";
import PackagesPreview from "@/components/home/PackagesPreview";
import RegionsSection from "@/components/home/RegionsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import FreeCvReviewSection from "@/components/home/FreeCvReviewSection";
import WritingExampleSection from "@/components/home/WritingExampleSection";
import BlogSection from "@/components/home/BlogSection";
import StickyMobileCta from "@/components/home/StickyMobileCta";
import { organizationSchema, professionalServiceSchema, websiteSchema } from "@/lib/seo/organization";
import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Plane } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { getRegionContent } from "@/lib/data/regionContent";
import { useHomeFaqs } from "@/hooks/useHomeFaqs";

export default function Home() {
  const { selectedRegion } = useRegion();
  const content = getRegionContent(selectedRegion.code);
  const regionFaqs = useHomeFaqs();

  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      professionalServiceSchema,
      websiteSchema,
      {
        "@type": "FAQPage",
        // Same @id as the pre-rendered page's FAQPage (scripts/generate-static-pages.js), so
        // the two merge into one entity instead of reading as two FAQ blocks on the page.
        "@id": `https://www.brandmyprofile.com/${selectedRegion.code}#faq`,
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
        {/* India-only compact wayfinding (Unit 5) - never shown for other regions, and
            deliberately just two text-forward cards rather than a Bento restructure. */}
        {selectedRegion.code === "india" && (
          <section className="border-y border-border bg-[hsl(var(--surface-warm))] py-10" aria-labelledby="target-market-heading">
            <div className="section-container">
              <h2 id="target-market-heading" className="mb-6 text-center text-2xl md:text-3xl">
                Where Are You Targeting?
              </h2>
              <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
                <Link
                  to="/india/gcc-jobs"
                  className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Globe2 className="h-8 w-8 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block text-lg font-semibold tracking-normal">GCC Jobs</span>
                    <span className="block text-sm text-muted-foreground">CV &amp; career guidance for Kuwait, UAE, Saudi Arabia and Qatar</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/india/europe-jobs"
                  className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <Plane className="h-8 w-8 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block text-lg font-semibold tracking-normal">European / International Jobs</span>
                    <span className="block text-sm text-muted-foreground">CV, Europass and career guidance for international applications</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        )}
        <WritingExampleSection />
        <PackagesPreview />
        <FreeCvReviewSection />
        <TestimonialsSection />
        <ServicesSection />
        <FAQSection />
        <CTASection />
        <BlogSection />
        <RegionsSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileCta />
    </div>
  );
}
