import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useBlogData } from "@/hooks/useBlogData";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";
import { useRegion } from "@/contexts/RegionContext";

type BlogBodyBlock =
  | { type: "h2" | "h3-lg" | "h3-sm" | "p"; key: string; text: string }
  | { type: "ul" | "ol"; key: string; items: string[] };

// Parses the plain-text/markdown-lite body format used by src/lib/data/blogs/content/*.json
// into render blocks. Line-by-line like the original renderer, but groups consecutive
// "- item" or "1. item" lines into one semantic <ul>/<ol> instead of one <p> per line
// (Unit 3D.1) - a list only closes once a heading, blank line, or plain paragraph appears,
// and switching between "-" and numbered items also closes the previous list. No nested
// lists are supported, matching current article content (none needs them).
function parseBlogBody(body: string): BlogBodyBlock[] {
  const blocks: BlogBodyBlock[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listType && listItems.length > 0) {
      blocks.push({ type: listType, key: `list-${blocks.length}`, items: listItems });
    }
    listItems = [];
    listType = null;
  };

  body.split("\n").forEach((line, idx) => {
    const orderedMatch = line.match(/^\d+\.\s+(.*)/);

    if (line.startsWith("- ")) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(line.slice(2));
      return;
    }

    if (orderedMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList();

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3-sm", key: `line-${idx}`, text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h3-lg", key: `line-${idx}`, text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h2", key: `line-${idx}`, text: line.slice(2) });
    } else if (line.trim()) {
      blocks.push({ type: "p", key: `line-${idx}`, text: line });
    }
    // Blank line: nothing pushed, matching the previous renderer's `return null`.
  });

  flushList();
  return blocks;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentBlog, blogs, isLoading, error } = useBlogData(slug);
  const { selectedRegion } = useRegion();

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!currentBlog) return null;

  // Get related posts (same tags)
  const relatedPosts = blogs
    .filter((post) => 
      post.id !== currentBlog.id && 
      post.tags.some((tag) => currentBlog.tags.includes(tag))
    )
    .slice(0, 3);

  // Unit 7: publisher previously duplicated an ad-hoc Organization definition instead of
  // referencing the one canonical organizationSchema used elsewhere on the site; the
  // WebPage stub now links isPartOf -> the canonical #website entity too.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://www.brandmyprofile.com/blog/${currentBlog.slug}#article`,
        headline: currentBlog.title,
        description: currentBlog.excerpt,
        // currentBlog.author is the site's editorial byline (BrandMyProfile Editorial
        // Team), not an individual contributor - Organization is the correct schema type
        // here, and must always match the visible byline rendered below (see Unit 3A.3).
        author: {
          "@type": "Organization",
          name: currentBlog.author,
        },
        datePublished: currentBlog.date,
        ...(currentBlog.dateModified ? { dateModified: currentBlog.dateModified } : {}),
        publisher: { "@id": organizationSchema["@id"] },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.brandmyprofile.com/blog/${currentBlog.slug}`,
          isPartOf: { "@id": websiteSchema["@id"] },
        },
        keywords: currentBlog.tags.join(", "),
      },
      organizationSchema,
    ],
  };

  return (
    <>
      <SEO
        title={currentBlog.title}
        description={currentBlog.excerpt}
        path={`/blog/${currentBlog.slug}`}
        keywords={currentBlog.tags.join(", ")}
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${selectedRegion.code}` },
          { label: "Blog", path: "/blog" },
          { label: currentBlog.title },
        ]}
      />
      <main>
        {/* Article Header */}
        <article>
          <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="section-container max-w-4xl">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {currentBlog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold">{currentBlog.title}</h1>

                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>{currentBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{new Date(currentBlog.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="section-padding">
            <div className="section-container max-w-4xl">
              <div className="prose prose-slate prose-lg max-w-none">
                {/* The post title above already owns the page's only <h1> - body headings
                    start one level down so the document never gets a second h1. */}
                {parseBlogBody(currentBlog.body).map((block) => {
                  switch (block.type) {
                    case "h3-sm":
                      return <h3 key={block.key} className="text-xl font-bold mt-5 mb-3">{block.text}</h3>;
                    case "h3-lg":
                      return <h3 key={block.key} className="text-2xl font-bold mt-6 mb-3">{block.text}</h3>;
                    case "h2":
                      return <h2 key={block.key} className="text-3xl font-bold mt-8 mb-4">{block.text}</h2>;
                    case "p":
                      return <p key={block.key} className="text-muted-foreground leading-relaxed mb-4">{block.text}</p>;
                    case "ul":
                      return (
                        <ul key={block.key} className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground marker:text-primary">
                          {block.items.map((item, i) => (
                            <li key={i} className="leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      );
                    case "ol":
                      return (
                        <ol key={block.key} className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground marker:font-semibold marker:text-primary">
                          {block.items.map((item, i) => (
                            <li key={i} className="leading-relaxed">{item}</li>
                          ))}
                        </ol>
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              {currentBlog.relatedLinks && currentBlog.relatedLinks.length > 0 && (
                <div className="mt-10 border-t border-border pt-6">
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">Related Pages</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-primary">
                    {currentBlog.relatedLinks.map((link) => (
                      <Link key={link.path} to={link.path} className="underline-offset-4 hover:underline">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
                <h3 className="text-xl font-bold mb-3">Need Professional Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Our expert career services can help you implement these strategies and accelerate your career growth.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="cta" asChild>
                    <Link to={`/${selectedRegion.code}/schedule`}>Book Consultation</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/${selectedRegion.code}/pricing`}>View Services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="section-padding bg-secondary/30">
            <div className="section-container">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex gap-2 mb-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/blog/${post.slug}`}>Read More</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
