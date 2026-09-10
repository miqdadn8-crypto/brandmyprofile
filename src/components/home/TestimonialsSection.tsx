import { Star, ExternalLink, UsersRound, UserRoundCheck, Globe2, ShieldCheck } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import ReviewCard, { type ReviewCardData } from "@/components/reviews/ReviewCard";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo/organization";

// Shown only when the real Google Reviews feed isn't available (see useGoogleReviews) -
// approved, factual trust points rather than invented testimonials or review counts
// (SEO Unit 3A.2: the previous static fallback reused unverified mock testimonial data).
const trustFacts = [
  { title: "500+", label: "Professionals Supported", icon: UsersRound },
  { title: "Human Writing", label: "& Review", icon: UserRoundCheck },
  { title: "Kuwait & GCC", label: "Career Focus", icon: Globe2 },
  { title: "Confidential", label: "Support", icon: ShieldCheck },
];

export default function TestimonialsSection() {
  const { isLive, rating, totalReviews, mapsUrl, reviews } = useGoogleReviews();

  const displayItems: ReviewCardData[] = isLive
    ? reviews.slice(0, 3).map((r) => ({
        name: r.author,
        subtitle: r.relativeTime,
        avatarUrl: r.avatar,
        rating: r.rating,
        quote: r.text,
      }))
    : [];

  return (
    <section className="section-padding">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <h2 className="mb-4 font-serif">{isLive ? "Success Stories" : "What Clients Value About Our Support"}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isLive
              ? "Join hundreds of professionals who've accelerated their careers with BrandMyProfile."
              : "Practical, human-reviewed career support for professionals across Kuwait and the GCC."}
          </p>
          {isLive && rating ? (
            <a
              href={mapsUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              <Star className="h-4 w-4 fill-accent text-accent" />
              {rating.toFixed(1)} on Google{totalReviews ? ` · ${totalReviews} reviews` : ""}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <a
              href={GOOGLE_BUSINESS_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              Read verified reviews on Google
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </Reveal>

        {isLive ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {displayItems.map((item, index) => (
              <ReviewCard key={index} {...item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustFacts.map(({ title, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-bento)] border border-border/80 bg-card p-6 text-center shadow-[var(--shadow-card)]"
              >
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <p className="font-serif text-2xl font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
