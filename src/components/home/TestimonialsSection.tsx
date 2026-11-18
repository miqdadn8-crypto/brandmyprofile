import { useEffect, useRef, useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";
import { RATING_SNAPSHOT, REVIEW_SNAPSHOT, REVIEWS_COLLECTED } from "@/lib/data/reviewsSnapshot";

// Genuine Google review data only: the live feed (useGoogleReviews -> googleReviewsService ->
// Supabase edge function "fetch-google-reviews"), or, when the feed is unavailable, a dated
// verbatim snapshot of real reviews (src/lib/data/reviewsSnapshot.ts) labelled with the month
// it was collected. Nothing is invented, edited or truncated. Visual display only - no
// Review/AggregateRating structured data is emitted from this data.

// Defers the reviews request (and its render) until the section is near the viewport,
// so it never competes with the hero for bandwidth or LCP.
function useNearViewport<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);
  return { ref, near };
}

function ReviewsContent() {
  const { isLive, isLoading, rating, totalReviews, mapsUrl, reviews } = useGoogleReviews();
  const googleUrl = mapsUrl || GOOGLE_BUSINESS_PROFILE_URL;

  if (isLoading) {
    return <div className="my-8 h-64 animate-pulse rounded-[var(--radius-bento)] bg-muted/60" aria-hidden="true" />;
  }

  // Live reviews when the feed answers; otherwise the dated verbatim snapshot.
  const list = isLive
    ? reviews.slice(0, 6)
    : REVIEW_SNAPSHOT.map((r) => ({ ...r, authorUrl: undefined, avatar: undefined, relativeTime: REVIEWS_COLLECTED }));
  const shownRating = isLive ? rating : RATING_SNAPSHOT.rating;
  const shownTotal = isLive ? totalReviews : RATING_SNAPSHOT.totalReviews;

  return (
    <div className="py-8 md:py-12">
      <Reveal className="mb-8 text-center">
        <h2 id="reviews-heading" className="heading-section mb-3">What Professionals Say About BrandMyProfile</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {isLive ? "Feedback from Google reviews, shown exactly as posted." : `Feedback from our Google reviews, shown exactly as posted (collected ${REVIEWS_COLLECTED}).`}
        </p>
      </Reveal>
      {shownRating ? (
        <p className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(shownRating) ? "fill-foreground text-foreground" : "text-border"}`} />
            ))}
          </span>
          <span>{shownRating.toFixed(1)} on Google{shownTotal ? ` · ${shownTotal} reviews` : ""}</span>
        </p>
      ) : null}

      {/* Scroll-snap row: swipe on mobile, 3 cards visible on desktop. No auto-scroll. */}
      <ul
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0"
        aria-label="Google reviews"
      >
        {list.map((review) => (
          <li
            key={`${review.author}-${review.time}`}
            className="flex w-[86%] shrink-0 snap-start flex-col rounded-[var(--radius-bento)] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] sm:w-[48%] lg:w-[calc((100%-2rem)/3)]"
          >
            <div className="mb-3 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-foreground text-foreground" : "text-border"}`} aria-hidden="true" />
              ))}
            </div>
            <blockquote className="flex-1 whitespace-pre-line text-base leading-7 text-foreground/90">{review.text}</blockquote>
            <footer className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
              {review.avatar ? (
                <img src={review.avatar} alt="" width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
                  {review.author.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="min-w-0">
                {/* Google requires reviewer attribution: the name links to their Google profile. */}
                {review.authorUrl ? (
                  <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold underline-offset-4 hover:underline">
                    {review.author}
                  </a>
                ) : (
                  <span className="block truncate text-sm font-semibold">{review.author}</span>
                )}
                <span className="block text-xs text-muted-foreground">{review.relativeTime} · Posted on Google</span>
              </span>
            </footer>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Read More Reviews on Google <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { ref, near } = useNearViewport<HTMLDivElement>();

  return (
    <section className="py-10 md:py-14" aria-label="Client reviews">
      <div className="section-container">
        <div ref={ref} className="min-h-[3rem]">
          {near ? <ReviewsContent /> : null}
        </div>
      </div>
    </section>
  );
}
