import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotFound from "@/pages/NotFound";
import { useBlogData } from "@/hooks/useBlogData";
import { useRegion } from "@/contexts/RegionContext";
import { getBlogHub } from "@/lib/data/blogHubs";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Shared component for the 5 approved content hubs (Unit 6) - only real, explicitly
// whitelisted hub slugs render here; App.tsx registers one static route per hub before
// the generic /blog/:slug article route, so an unknown slug never reaches this component.
export default function BlogHub({ hubSlug }: { hubSlug: string }) {
  const hub = getBlogHub(hubSlug);
  const { blogs, isLoading } = useBlogData();
  const { selectedRegion } = useRegion();

  if (!hub) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </>
    );
  }

  const cornerstone = blogs.find((b) => b.slug === hub.cornerstoneSlug);
  const supporting = hub.supportingSlugs.map((slug) => blogs.find((b) => b.slug === slug)).filter(Boolean);
  const canonicalUrl = `https://www.brandmyprofile.com/blog/${hub.slug}`;
  const reviewMessage = "Hello BrandMyProfile, I'd like a free CV review. Please let me know how to send my CV.";

  const allArticleUrls = [cornerstone, ...supporting].filter(Boolean).map((a) => `https://www.brandmyprofile.com/blog/${a!.slug}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#collection`,
        name: hub.h1,
        description: hub.metaDescription,
        url: canonicalUrl,
        isPartOf: { "@id": websiteSchema["@id"] },
        ...(allArticleUrls.length > 0
          ? {
              mainEntity: {
                "@type": "ItemList",
                itemListElement: allArticleUrls.map((url, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url,
                })),
              },
            }
          : {}),
      },
      organizationSchema,
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO title={hub.title} description={hub.metaDescription} path={`/blog/${hub.slug}`} structuredData={structuredData} />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: "Blog", path: "/blog" },
          { label: hub.title },
        ]}
      />
      <main>
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 py-14 sm:py-18">
          <div className="section-container max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary">
              <BookOpen className="h-4 w-4" /> Topic Guide
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{hub.h1}</h1>
            {hub.intro.map((paragraph, idx) => (
              <p key={idx} className="mt-5 text-lg leading-8 text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {cornerstone && (
          <section className="section-padding bg-white">
            <div className="section-container max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Start Here</p>
              <article className="rounded-[1.5rem] border border-primary/15 bg-[hsl(var(--surface-warm))] p-7 md:p-9">
                <h2 className="font-serif text-2xl font-semibold tracking-normal sm:text-3xl">
                  <Link to={`/blog/${cornerstone.slug}`} className="hover:text-primary">
                    {cornerstone.title}
                  </Link>
                </h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{cornerstone.excerpt}</p>
                <Link
                  to={`/blog/${cornerstone.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"
                >
                  Read the Full Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </div>
          </section>
        )}

        {supporting.length > 0 && (
          <section className="section-padding border-y border-border bg-[hsl(var(--surface-warm))]">
            <div className="section-container max-w-4xl">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-accent">More Guides on This Topic</p>
              <div className="grid gap-5 sm:grid-cols-2">
                {supporting.map((article) => (
                  <article key={article!.slug} className="rounded-[1.35rem] border border-border bg-white p-6">
                    <h3 className="text-lg font-semibold tracking-normal">
                      <Link to={`/blog/${article!.slug}`} className="hover:text-primary">
                        {article!.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{article!.excerpt}</p>
                    <Link
                      to={`/blog/${article!.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-white">
          <div className="section-container max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Relevant Services</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-primary">
              {hub.serviceLinks.map((link) => (
                <a key={link.path} href={link.path} className="underline-offset-4 hover:underline">
                  {link.label}
                </a>
              ))}
            </div>
            {hub.relatedHubs.length > 0 && (
              <>
                <p className="mb-4 mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Related Hubs</p>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-primary">
                  {hub.relatedHubs.map((link) => (
                    <a key={link.path} href={link.path} className="underline-offset-4 hover:underline">
                      {link.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Ready to Put This Into Practice?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              Send us your current CV and we'll let you know what could be improved.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="min-h-12 w-full sm:flex-1" asChild>
                <a href={buildWhatsAppUrl(reviewMessage)} target="_blank" rel="noopener noreferrer">
                  Get My Free CV Review
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
