import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogData } from "@/hooks/useBlogData";
import { useRegion } from "@/contexts/RegionContext";

// Best-fit existing guides per region (not simply the newest posts). Slugs must exist in
// blogs/index.json; missing ones are skipped and the list is topped up with the newest posts.
const PRIORITY_SLUGS: Record<string, string[]> = {
  kuwait: ["best-cv-writing-service-kuwait", "kuwait-cv-format-guide", "ats-cv-guide-kuwait"],
  uae: ["best-cv-writing-service-uae", "gcc-cv-format-guide", "how-ats-reads-your-cv"],
  saudi: ["best-cv-writing-service-saudi", "gcc-cv-format-guide", "how-ats-reads-your-cv"],
  qatar: ["best-cv-writing-service-qatar", "gcc-cv-format-guide", "how-ats-reads-your-cv"],
  bahrain: ["best-cv-writing-service-bahrain", "gcc-cv-format-guide", "how-ats-reads-your-cv"],
  oman: ["best-cv-writing-service-oman", "gcc-cv-format-guide", "how-ats-reads-your-cv"],
  india: ["india-to-gcc-jobs-guide", "europass-cv-guide-india", "gcc-cv-format-guide"],
  default: ["gcc-cv-format-guide", "how-ats-reads-your-cv", "gcc-interview-preparation"],
};

const getHeading = (regionCode: string, regionName: string) => {
  if (regionCode === "kuwait") return "Career Resources for Kuwait & GCC Professionals";
  if (regionCode === "india") return "Career Resources for India-to-GCC Job Seekers";
  return `Career Resources for ${regionName} & GCC Professionals`;
};

export default function BlogSection() {
  const { blogs, isLoading } = useBlogData();
  const { selectedRegion } = useRegion();
  const prioritySlugs = PRIORITY_SLUGS[selectedRegion.code] ?? PRIORITY_SLUGS.default;
  const prioritised = prioritySlugs.map((slug) => blogs.find((post) => post.slug === slug)).filter((post): post is NonNullable<typeof post> => Boolean(post));
  const recentBlogs = [...prioritised, ...blogs.filter((post) => !prioritised.includes(post))].slice(0, 3);

  return (
    <section aria-labelledby="resources-heading" className="py-12 md:py-16">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 id="resources-heading" className="font-serif text-2xl md:text-3xl">{getHeading(selectedRegion.code, selectedRegion.name)}</h2>
          <p className="mt-3 text-base text-muted-foreground">Practical reading for your next application.</p></div>
          <Link to="/blog" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">All career guides <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {isLoading ? (
          <p role="status" className="mt-6 text-muted-foreground">Loading career guides...</p>
        ) : recentBlogs.length ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {recentBlogs.map((post) => (
              <li key={post.id} className="border-t border-border pt-5">
                <p className="text-sm font-medium text-primary">{post.tags[0] || "Career guide"}</p>
                <h3 className="mt-2 text-lg leading-7"><Link to={`/blog/${post.slug}`} className="underline-offset-4 hover:text-primary hover:underline">{post.title}</Link></h3>
                <p className="mt-2 text-base leading-7 text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : <p className="mt-6 text-muted-foreground">Explore our career guides for advice on CVs and job applications.</p>}
      </div>
    </section>
  );
}
