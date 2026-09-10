import { useEffect, useState } from "react";
import blogIndex from "@/lib/data/blogs/index.json";

// Lightweight per-article fields needed everywhere articles are LISTED (Blog.tsx,
// BlogSection.tsx, and BlogPost.tsx's related-posts sidebar) - deliberately excludes
// `body`/`relatedLinks` so listing this data never pulls every article's full content
// into the bundle (Unit 3D.1 - see src/lib/data/blogs/index.json).
export interface BlogPostMeta {
  id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  dateModified?: string;
  tags: string[];
  coverImage?: string;
  excerpt: string;
}

// The full single-article shape BlogPost.tsx renders - metadata plus the fields that
// only live in the per-slug content file (src/lib/data/blogs/content/<slug>.json).
export interface BlogPostDetail extends BlogPostMeta {
  body: string;
  // Optional real, working destinations this article should link to (Unit 3D's internal-
  // link architecture) - rendered by BlogPost.tsx as actual anchors, since body content
  // is plain text/headings only and can't carry real inline links. Absent on older posts.
  relatedLinks?: { label: string; path: string }[];
}

// Kept as an alias so existing call sites that imported the single `BlogPost` type
// (from before the metadata/body split) keep resolving to the full article shape.
export type BlogPost = BlogPostDetail;

type BlogContent = { body: string; relatedLinks?: { label: string; path: string }[] };

// Vite-native lazy loading (no CMS, no markdown runtime) - each entry is a dynamic
// import function, so a given article's body is only fetched when actually requested,
// instead of every body being statically bundled into the app's main chunk.
const bodyLoaders = import.meta.glob("../lib/data/blogs/content/*.json") as Record<
  string,
  () => Promise<{ default: BlogContent }>
>;

async function loadBody(slug: string): Promise<BlogContent | null> {
  const entry = Object.entries(bodyLoaders).find(([filePath]) => filePath.endsWith(`/${slug}.json`));
  if (!entry) return null;
  const mod = await entry[1]();
  return mod.default;
}

export function useBlogData(slug?: string) {
  const [blogs] = useState<BlogPostMeta[]>(blogIndex as BlogPostMeta[]);
  const [currentBlog, setCurrentBlog] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      setIsLoading(true);
      setError(null);
      setCurrentBlog(null);

      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        const meta = blogs.find((b) => b.slug === slug);
        if (!meta) {
          if (!cancelled) setError("Blog post not found");
          return;
        }

        const content = await loadBody(slug);
        if (!content) {
          if (!cancelled) setError("Blog post not found");
          return;
        }

        if (!cancelled) setCurrentBlog({ ...meta, ...content });
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading blog data:", err);
          setError(err instanceof Error ? err.message : "Failed to load blogs");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, [slug, blogs]);

  return { blogs, currentBlog, isLoading, error };
}
