import { useLocation } from "react-router-dom";
import { useEffect, type CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import { useRegion } from "@/contexts/RegionContext";

const NotFound = () => {
  const location = useLocation();
  const { selectedRegion } = useRegion();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center bg-background px-4 py-16 sm:px-6 lg:px-8">
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
      <main className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-[clamp(6rem,4rem+10vw,13rem)] font-medium leading-[0.85] tracking-[-0.05em] text-primary">
          404
        </h1>

        {/* The redline again: the pen strikes the address that does not exist. */}
        <p className="mt-8 max-w-full break-all font-serif text-xl text-muted-foreground sm:text-2xl">
          <span className="sr-only">Requested address: </span>
          <del className="redline redline--draw" style={{ "--redline-delay": "250ms" } as CSSProperties}>{location.pathname}</del>
        </p>

        <h2 className="mt-8 text-3xl md:text-5xl">
          Looks like you're lost!
        </h2>
        <p className="mt-4 mb-10 max-w-md text-lg leading-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`/${selectedRegion.code}`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
          >
            Back to Home
          </a>
          <a
            href={`/${selectedRegion.code}/jobs`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-primary/40 px-8 font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Browse Jobs
          </a>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Need help? <a href={`/${selectedRegion.code}/contact`} className="font-medium text-primary underline underline-offset-4">Contact our support team</a>
        </p>
      </main>
    </div>
  );
};

export default NotFound;
