import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  FileCheck2,
  FileText,
  Laptop2,
  Linkedin,
  Quote,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BlogPostMeta, useBlogData } from "@/hooks/useBlogData";
import { blogHubs } from "@/lib/data/blogHubs";
import { organizationSchema } from "@/lib/seo/organization";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";

interface CategoryFilter {
  label: string;
  matches: (post: BlogPostMeta) => boolean;
}

const categoryFilters: CategoryFilter[] = [
  { label: "All Insights", matches: () => true },
  { label: "CV Writing", matches: (post) => post.tags.includes("CV Writing") },
  { label: "ATS", matches: (post) => post.tags.includes("ATS") },
  { label: "LinkedIn", matches: (post) => post.tags.includes("LinkedIn") },
  { label: "GCC Careers", matches: (post) => post.tags.includes("GCC") },
  { label: "International Careers", matches: (post) => post.tags.includes("International Careers") },
  { label: "Career Guidance", matches: (post) => post.tags.includes("Career Guidance") },
  { label: "Personal Branding", matches: (post) => post.tags.includes("Personal Branding") },
  { label: "Remote Work", matches: (post) => post.tags.includes("Remote Work") },
  { label: "Salary & Offers", matches: (post) => post.tags.includes("Salary Negotiation") },
];

const formatDate = (date: string) => new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(date));

const getArticleStyle = (post: BlogPostMeta) => {
  if (post.tags.includes("ATS") || post.tags.includes("CV Writing")) {
    return { label: "CV Strategy", title: "Build for people. Structure for systems.", icon: FileText, tone: "teal" as const };
  }
  if (post.tags.includes("LinkedIn")) {
    return { label: "LinkedIn", title: "Position your value before the first conversation.", icon: Linkedin, tone: "pink" as const };
  }
  if (post.tags.includes("GCC")) {
    return { label: "GCC Careers", title: "Understand the market before making the move.", icon: Compass, tone: "ink" as const };
  }
  if (post.tags.includes("International Careers")) {
    return { label: "International Careers", title: "Prepare applications that travel across borders.", icon: FileCheck2, tone: "teal" as const };
  }
  if (post.tags.includes("Personal Branding")) {
    return { label: "Personal Brand", title: "Make your professional story easier to recognise.", icon: UserRound, tone: "pink" as const };
  }
  if (post.tags.includes("Remote Work")) {
    return { label: "Future of Work", title: "Skills for effective work across places and teams.", icon: Laptop2, tone: "teal" as const };
  }
  return { label: "Salary & Offers", title: "Evaluate the whole offer—not only the number.", icon: WalletCards, tone: "ink" as const };
};

const getReadLabel = (post: BlogPostMeta) => {
  if (post.tags.includes("ATS") || post.tags.includes("CV Writing") || post.tags.includes("GCC") || post.tags.includes("International Careers")) return "Read Guide";
  if (post.tags.includes("LinkedIn") || post.tags.includes("Remote Work")) return "Explore Tips";
  return "Read Article";
};

const getServiceLink = (post: BlogPostMeta, region: string) => {
  // Europass CV writing is India-only (Unit 3D) - always point this CTA at the India
  // service page regardless of the viewer's selected region, since it's the only region
  // where the route actually exists.
  if (post.tags.includes("International Careers")) {
    return { label: "Explore Europass CV Writing", path: "/india/services/europass-cv" };
  }
  if (post.tags.includes("ATS") || post.tags.includes("CV Writing")) {
    return { label: "Get a Free CV Review", path: `/${region}/contact` };
  }
  // Bahrain/Oman only have CV Writing live (Unit 3A) - LinkedIn Makeover and Career
  // Guidance don't exist there yet, so fall back to Contact (Unit 9 broken-link fix).
  if (LIMITED_FOOTPRINT_REGIONS.has(region)) {
    return { label: "Get a Free CV Review", path: `/${region}/contact` };
  }
  if (post.tags.includes("LinkedIn") || post.tags.includes("Personal Branding")) {
    return { label: "LinkedIn Profile Makeover", path: `/${region}/services/linkedin-makeover` };
  }
  return { label: "Career Guidance", path: `/${region}/services/career-guidance` };
};

function EditorialCover({ post, featured = false }: { post: BlogPostMeta; featured?: boolean }) {
  const style = getArticleStyle(post);
  const Icon = style.icon;
  const tone = style.tone === "pink"
    ? "bg-accent text-accent-foreground"
    : style.tone === "ink"
      ? "bg-[hsl(188_82%_17%)] text-white"
      : "bg-primary text-primary-foreground";

  return (
    <div className={`relative flex h-full min-h-52 overflow-hidden rounded-[18px] ${tone} p-6 sm:p-7 ${featured ? "lg:min-h-[470px] lg:p-9" : "lg:min-h-60"}`}>
      <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full border-[34px] border-white/10" aria-hidden="true" />
      <div className="absolute bottom-8 right-8 grid grid-cols-3 gap-2 opacity-20" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => <span key={index} className="h-1.5 w-1.5 rounded-full bg-current" />)}
      </div>
      <Icon className={`absolute bottom-5 right-5 text-white/10 ${featured ? "h-44 w-44" : "h-28 w-28"}`} strokeWidth={1.2} aria-hidden="true" />
      <div className="relative z-10 flex max-w-md flex-col justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-current/75">
          <span className="h-px w-8 bg-current/60" /> BrandMyProfile Editorial
        </div>
        <div className="mt-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-current/70">{style.label}</p>
          <p className={`font-serif font-semibold leading-[1.02] tracking-tight ${featured ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{style.title}</p>
        </div>
      </div>
    </div>
  );
}

function ArticleMeta({ post }: { post: BlogPostMeta }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4 text-primary" />{post.author}</span>
      <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" />Published {formatDate(post.date)}</span>
    </div>
  );
}

function StandardArticleCard({ post, region, wide = false }: { post: BlogPostMeta; region: string; wide?: boolean }) {
  const service = getServiceLink(post, region);
  return (
    <article className={`group grid overflow-hidden rounded-[22px] border border-border/80 bg-white p-3 shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-200 hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)] ${wide ? "lg:grid-cols-[0.9fr_1.1fr]" : ""}`}>
      <EditorialCover post={post} />
      <div className="flex flex-col p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="rounded-full text-xs">{tag}</Badge>)}
        </div>
        <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-6 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5"><ArticleMeta post={post} /></div>
        <div className="mt-auto flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center">
          <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent">
            {getReadLabel(post)} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to={service.path} className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{service.label}</Link>
        </div>
      </div>
    </article>
  );
}

function CompactArticle({ post }: { post: BlogPostMeta }) {
  const style = getArticleStyle(post);
  const Icon = style.icon;
  return (
    <article className="group flex flex-1 flex-col rounded-[22px] border border-border/80 bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{post.tags[0]}</span>
      </div>
      <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight group-hover:text-primary">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="mt-3 line-clamp-2 text-[15px] leading-6 text-muted-foreground">{post.excerpt}</p>
      <div className="mt-auto pt-5"><ArticleMeta post={post} /></div>
      <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 border-t border-border/70 pt-4 text-sm font-bold text-primary hover:text-accent">
        {getReadLabel(post)} <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default function Blog() {
  const { blogs, isLoading, error } = useBlogData();
  const { selectedRegion } = useRegion();
  const [activeCategory, setActiveCategory] = useState("All Insights");

  const filteredBlogs = useMemo(() => {
    const filter = categoryFilters.find((category) => category.label === activeCategory) ?? categoryFilters[0];
    return blogs.filter(filter.matches);
  }, [activeCategory, blogs]);

  const featuredPost = blogs[0];
  const compactPosts = blogs.slice(1, 3);
  const remainingPosts = blogs.slice(3);
  // Bahrain/Oman only have CV Writing live (Unit 3A) - LinkedIn Makeover and Pricing
  // don't exist there yet, so fall back to Contact (Unit 9 broken-link fix).
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const cvReviewPath = `/${selectedRegion.code}/contact`;
  const linkedInPath = isLimitedFootprint ? cvReviewPath : `/${selectedRegion.code}/services/linkedin-makeover`;
  const pricingPath = isLimitedFootprint ? cvReviewPath : `/${selectedRegion.code}/pricing`;

  // Unit 7: publisher previously duplicated an ad-hoc Organization definition instead of
  // referencing the one canonical organizationSchema used elsewhere on the site.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://www.brandmyprofile.com/blog#blog",
        name: "BrandMyProfile Career Blog",
        description: "Practical career advice for professionals targeting Kuwait, the GCC, India and international opportunities.",
        url: "https://www.brandmyprofile.com/blog",
        publisher: { "@id": organizationSchema["@id"] },
      },
      organizationSchema,
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[hsl(35_33%_97%)]">
      <SEO
        title="Career Insights for Kuwait, GCC & International Job Seekers"
        description="Practical advice on CV writing, LinkedIn, interviews, salary negotiation and career moves for professionals across Kuwait, the GCC and India."
        path="/blog"
        keywords="career insights, CV writing advice, ATS CV, LinkedIn tips, GCC careers, salary negotiation, career guidance"
        structuredData={structuredData}
      />
      <Header />
      <main>
        <section className="border-b border-border/70 bg-white py-16 sm:py-20 lg:py-24">
          <div className="section-container">
            <div className="max-w-5xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[hsl(var(--surface-teal-soft))] px-4 py-2 text-sm font-semibold text-primary">
                <BookOpen className="h-4 w-4" /> Career Insights
              </div>
              <h1 className="max-w-5xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Career Insights for <span className="text-primary">Kuwait, GCC & International</span> Job Seekers
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Practical advice on CV writing, LinkedIn, interviews, salary negotiation and career moves for professionals across Kuwait, the GCC and India.
              </p>
            </div>
          </div>
        </section>

        {/* Real, navigable topic hubs (Unit 6) - distinct from the client-side category
            filter buttons below, which only re-sort this same page's article list. */}
        <section className="border-b border-border/70 bg-white py-6" aria-label="Explore topic guides">
          <div className="section-container">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Explore by Topic</p>
            <div className="flex flex-wrap items-center gap-2">
              {blogHubs.map((hub) => (
                <Link
                  key={hub.slug}
                  to={`/blog/${hub.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {hub.h1}
                </Link>
              ))}
              <Link
                to="/resources/gcc-cv-checklist"
                className="ml-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Free GCC CV Checklist →
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-[hsl(var(--surface-teal-soft))]/50 py-5" aria-label="Filter career insights">
          <div className="section-container">
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categoryFilters.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  aria-pressed={activeCategory === category.label}
                  onClick={() => setActiveCategory(category.label)}
                  className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold transition-colors ${activeCategory === category.label ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary"}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            {isLoading ? (
              <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-[620px] rounded-[22px]" /><Skeleton className="h-[620px] rounded-[22px]" /></div>
            ) : error ? (
              <div className="rounded-[22px] border border-border bg-white p-10 text-center"><h2 className="font-serif text-3xl font-semibold">Career insights are temporarily unavailable</h2><p className="mt-3 text-muted-foreground">Please refresh the page and try again.</p></div>
            ) : activeCategory === "All Insights" && featuredPost ? (
              <>
                <div className="mb-8 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                  <article className="group grid rounded-[22px] border border-border/80 bg-white p-3 shadow-[var(--shadow-card)] lg:grid-cols-[1.05fr_0.95fr]">
                    <EditorialCover post={featuredPost} featured />
                    <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                      <div className="mb-5 flex flex-wrap gap-2">{featuredPost.tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>)}</div>
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Featured guide</p>
                      <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight group-hover:text-primary sm:text-4xl"><Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
                      <p className="mt-4 text-base leading-7 text-muted-foreground">{featuredPost.excerpt}</p>
                      <div className="mt-6"><ArticleMeta post={featuredPost} /></div>
                      <Button variant="cta" size="lg" className="mt-auto w-full sm:w-fit" asChild><Link to={`/blog/${featuredPost.slug}`}>Read the Full Guide <ArrowRight /></Link></Button>
                    </div>
                  </article>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {compactPosts.map((post) => <CompactArticle key={post.id} post={post} />)}
                  </div>
                </div>

                <aside className="mb-12 overflow-hidden rounded-[22px] bg-primary px-6 py-8 text-primary-foreground sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-10">
                  <div className="max-w-2xl">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">Put insight into action</p>
                    <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Applying for Jobs in the GCC?</h2>
                    <p className="mt-3 text-base leading-7 text-primary-foreground/75">Make sure your CV and LinkedIn profile communicate your value before you apply.</p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
                    <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review <ArrowRight /></Link></Button>
                    <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={linkedInPath}>Improve My LinkedIn</Link></Button>
                  </div>
                </aside>

                <div className="mb-8 flex items-end justify-between gap-5 border-b border-border pb-5">
                  <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">More from the editorial desk</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Latest Career Articles</h2></div>
                  <Sparkles className="hidden h-8 w-8 text-primary sm:block" />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {remainingPosts.map((post, index) => <StandardArticleCard key={post.id} post={post} region={selectedRegion.code} wide={index === 0} />)}
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 flex flex-col justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-end">
                  <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Filtered insights</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{activeCategory}</h2></div>
                  <p className="font-semibold text-muted-foreground">{filteredBlogs.length} article{filteredBlogs.length === 1 ? "" : "s"}</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">{filteredBlogs.map((post, index) => <StandardArticleCard key={post.id} post={post} region={selectedRegion.code} wide={index % 3 === 0} />)}</div>
              </>
            )}
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <Quote className="mx-auto mb-5 h-8 w-8 text-accent" />
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Need Help Applying What You’ve Learned?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/75">Get professional support with your CV, LinkedIn profile or career strategy for your target market.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review <ArrowRight /></Link></Button>
              <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={pricingPath}><BriefcaseBusiness /> Explore Career Services</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
