import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useRegion } from "@/contexts/RegionContext";

const NotFound = () => {
  const location = useLocation();
  const { selectedRegion } = useRegion();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4">
      {/* Deliberately not using the shared <SEO> component: this page must never emit a
          canonical or og:url tag, since the hosting SPA fallback returns HTTP 200 for any
          nonexistent path and we don't want it treated as indexable or as a real page URL. */}
      <Helmet>
        <title>Page Not Found | BrandMyProfile</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta
          name="description"
          content="The page you requested could not be found. Return to BrandMyProfile to explore professional career services."
        />
      </Helmet>
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-[120px] md:text-[180px] font-bold text-primary leading-none mb-2">
            404
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
          Looks like you're lost!
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto animate-fade-in">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <a
            href={`/${selectedRegion.code}`}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-hover text-primary-foreground px-8 py-3 font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
          >
            Back to Home
          </a>
          <a
            href={`/${selectedRegion.code}/jobs`}
            className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary px-8 py-3 font-semibold hover:bg-primary/5 hover:scale-105 transition-all"
          >
            Browse Jobs
          </a>
        </div>

        <p className="mt-8 text-sm text-muted-foreground animate-fade-in">
          Need help? <a href={`/${selectedRegion.code}/contact`} className="text-primary hover:underline font-medium">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
