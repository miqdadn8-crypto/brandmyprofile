import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RegionProvider } from "./contexts/RegionContext";
import RegionBanner from "@/components/RegionBanner";
import RegionLayout from "@/components/RegionLayout";
import RootRedirect from "@/components/RootRedirect";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
// Home stays eager - it's the de-facto landing page for every region visit (via
// RootRedirect), so lazy-loading it would add a chunk round-trip to the single most
// common first paint on the site. Every other route is code-split below; none of them
// affect generate-static-pages.js, which post-processes the built HTML via string
// replacement and never executes React.
import Home from "./pages/Home";
// NotFound also stays eager: src/components/RegionLayout.tsx renders it directly
// (statically imported) for the invalid-single-segment-path case from Unit 1's soft-404
// fix, so lazy-loading it here would just force it back into the eager graph anyway
// while adding an unnecessary Suspense boundary for a component this small.
import NotFound from "./pages/NotFound";
import AnalyticsEvents from "./components/AnalyticsEvents";
import { LeadModalProvider } from "./components/lead/LeadModalContext";

const CVWriting = lazy(() => import("./pages/CVWriting"));
const ATSCV = lazy(() => import("./pages/ATSCV"));
const GCCCV = lazy(() => import("./pages/GCCCV"));
const EuropassCV = lazy(() => import("./pages/EuropassCV"));
const IndustryCV = lazy(() => import("./pages/IndustryCV"));
const IndiaGccJobs = lazy(() => import("./pages/IndiaGccJobs"));
const IndiaEuropeJobs = lazy(() => import("./pages/IndiaEuropeJobs"));
const LinkedInMakeover = lazy(() => import("./pages/LinkedInMakeover"));
const Masterclass = lazy(() => import("./pages/Masterclass"));
const CareerGuidance = lazy(() => import("./pages/CareerGuidance"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogHub = lazy(() => import("./pages/BlogHub"));
const GccCvChecklist = lazy(() => import("./pages/GccCvChecklist"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

const queryClient = new QueryClient();

// Neutral min-height placeholder - not a spinner or skeleton, so it never introduces
// animation cost, and it reduces (without eliminating) layout shift versus rendering
// nothing while a route chunk loads.
const RouteFallback = () => <div className="min-h-[60vh]" />;

// Legacy redirect helper for old job URLs structure /jobs/:region/:id
const JobRedirect = () => {
  const { region, id } = useParams();
  return <Navigate to={`/${region}/jobs/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <RegionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LeadModalProvider>
            <AnalyticsEvents />
            <RegionBanner />
            <RouteErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Global Redirects (Force / -> /:region) */}
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/pricing" element={<RootRedirect to="pricing" />} />
                  <Route path="/about" element={<RootRedirect to="about" />} />
                  <Route path="/contact" element={<RootRedirect to="contact" />} />
                  <Route path="/success-stories" element={<RootRedirect to="success-stories" />} />
                  <Route path="/schedule" element={<RootRedirect to="schedule" />} />
                  <Route path="/jobs" element={<RootRedirect to="jobs" />} />

                  {/* Service Redirects */}
                  <Route path="/services/cv-writing" element={<RootRedirect to="services/cv-writing" />} />
                  <Route path="/services/ats-cv" element={<RootRedirect to="services/ats-cv" />} />
                  <Route path="/services/gcc-cv" element={<RootRedirect to="services/gcc-cv" />} />
                  <Route path="/services/europass-cv" element={<RootRedirect to="services/europass-cv" />} />
                  <Route path="/gcc-jobs" element={<RootRedirect to="gcc-jobs" />} />
                  <Route path="/europe-jobs" element={<RootRedirect to="europe-jobs" />} />
                  <Route path="/services/linkedin-makeover" element={<RootRedirect to="services/linkedin-makeover" />} />
                  <Route path="/services/masterclass" element={<RootRedirect to="services/masterclass" />} />
                  <Route path="/services/career-guidance" element={<RootRedirect to="services/career-guidance" />} />

                  {/* Legacy Job Route Support: /jobs/uae/123 -> /uae/jobs/123 */}
                  <Route path="/jobs/:region/:id" element={<JobRedirect />} />

                  {/* Global Content (No Region) */}
                  <Route path="/blog" element={<Blog />} />
                  {/* Unit 6: explicit whitelist of real content hubs, registered before the
                      generic article route below so these 5 exact slugs never fall through
                      to the article lookup. Any other /blog/:slug value is a real article
                      or a genuine 404 - see BlogPost.tsx / useBlogData.ts. */}
                  <Route path="/blog/cv-writing" element={<BlogHub hubSlug="cv-writing" />} />
                  <Route path="/blog/ats" element={<BlogHub hubSlug="ats" />} />
                  <Route path="/blog/gcc-careers" element={<BlogHub hubSlug="gcc-careers" />} />
                  <Route path="/blog/career-guidance" element={<BlogHub hubSlug="career-guidance" />} />
                  <Route path="/blog/india-gcc" element={<BlogHub hubSlug="india-gcc" />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />

                  {/* Unit 8: single flagship linkable asset. Deliberately NOT a
                      /resources/:slug wildcard - only this one exact path is a real page,
                      so any other /resources/* URL falls through to the catch-all 404 below
                      instead of being auto-accepted. */}
                  <Route path="/resources/gcc-cv-checklist" element={<GccCvChecklist />} />

                  {/* Unit 9: global legal utility pages - Footer.tsx has linked to these on
                      every page since it was written, but the routes never existed (a real
                      sitewide broken-link defect found in this unit's crawl audit). */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />

                  {/* SEO Region Routes (/uae/..., /kuwait/...) */}
                  <Route path="/:region" element={<RegionLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="success-stories" element={<SuccessStories />} />
                    <Route path="schedule" element={<Schedule />} />

                    <Route path="jobs" element={<Jobs />} />
                    <Route path="jobs/:id" element={<JobDetail />} />

                    <Route path="services/cv-writing" element={<CVWriting />} />
                    <Route path="services/ats-cv" element={<ATSCV />} />
                    <Route path="services/gcc-cv" element={<GCCCV />} />
                    <Route path="services/europass-cv" element={<EuropassCV />} />
                    {/* Unit 4A: /{region}/cv-writing/{industry} - deliberately a sibling of
                        services/*, not nested under it, to distinguish industry-intent
                        landing pages from service-product pages (see regionAvailability.ts's
                        INDUSTRY_CV_WHITELIST for the only approved region+industry combos). */}
                    <Route path="cv-writing/:industry" element={<IndustryCV />} />
                    {/* Unit 5: India-only intent hubs, gated via REGION_EXCLUSIVE_SUFFIXES
                        in regionAvailability.ts (NotFound for every other region). */}
                    <Route path="gcc-jobs" element={<IndiaGccJobs />} />
                    <Route path="europe-jobs" element={<IndiaEuropeJobs />} />
                    <Route path="services/linkedin-makeover" element={<LinkedInMakeover />} />
                    <Route path="services/masterclass" element={<Masterclass />} />
                    <Route path="services/career-guidance" element={<CareerGuidance />} />
                  </Route>

                  {/* 404 & Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </RouteErrorBoundary>
            </LeadModalProvider>
          </BrowserRouter>
        </RegionProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
