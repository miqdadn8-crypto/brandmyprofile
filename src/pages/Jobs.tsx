import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, BadgeCheck, BriefcaseBusiness, FileCheck2, Linkedin, MapPinned, RefreshCw, SearchCheck } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JobCard from "@/components/jobs/JobCard";
import JobFilters, { SalaryFilterOption } from "@/components/jobs/JobFilters";
import { useRegion } from "@/contexts/RegionContext";
import { Skeleton } from "@/components/ui/skeleton";
import { jobsService } from "@/services/jobsService";
import { JobData, jobsConfig } from "@/config/jobs";
import { getTemplatedPageSeo } from "@/config/pageSeo";

// The live job source is currently sample/illustrative data (see src/config/jobs.ts),
// not a real-time jobs feed. This page is noindex and emits no job structured data.
const isIllustrativeJobSource = jobsConfig.source === "mock";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SalaryBandConfig {
  midStart: number;
  highStart: number;
  options: SalaryFilterOption[];
}

const salaryBands: Record<string, SalaryBandConfig> = {
  kuwait: {
    midStart: 1000,
    highStart: 1500,
    options: [
      { value: "low", label: "Below 1,000 KWD" },
      { value: "medium", label: "1,000–1,499 KWD" },
      { value: "high", label: "1,500+ KWD" },
    ],
  },
  uae: {
    midStart: 15000,
    highStart: 20000,
    options: [
      { value: "low", label: "Below 15,000 AED" },
      { value: "medium", label: "15,000–19,999 AED" },
      { value: "high", label: "20,000+ AED" },
    ],
  },
  saudi: {
    midStart: 15000,
    highStart: 18000,
    options: [
      { value: "low", label: "Below 15,000 SAR" },
      { value: "medium", label: "15,000–17,999 SAR" },
      { value: "high", label: "18,000+ SAR" },
    ],
  },
  qatar: {
    midStart: 15000,
    highStart: 18000,
    options: [
      { value: "low", label: "Below 15,000 QAR" },
      { value: "medium", label: "15,000–17,999 QAR" },
      { value: "high", label: "18,000+ QAR" },
    ],
  },
  india: {
    midStart: 1000000,
    highStart: 1500000,
    options: [
      { value: "low", label: "Below ₹10 lakh" },
      { value: "medium", label: "₹10–14.9 lakh" },
      { value: "high", label: "₹15 lakh+" },
    ],
  },
};

const getSalaryMinimum = (salary: string) => {
  const firstAmount = salary.match(/[0-9][0-9,]*/)?.[0];
  return firstAmount ? Number(firstAmount.replace(/,/g, "")) : 0;
};

const matchesExperienceBand = (experience: string, band: string) => {
  if (band === "all") return true;
  const years = experience.match(/\d+/g)?.map(Number) ?? [];
  if (years.length === 0) return false;
  const minimum = years[0];
  const maximum = experience.includes("+") ? Number.POSITIVE_INFINITY : (years[1] ?? minimum);
  if (band === "entry") return minimum <= 2;
  if (band === "mid") return minimum <= 5 && maximum >= 3;
  return maximum >= 6;
};

const trustItems = [
  { label: "Region-Specific Examples", icon: MapPinned },
  { label: "Sample Listings", icon: RefreshCw },
  { label: "CV Support Available", icon: FileCheck2 },
  { label: "Application Guidance", icon: SearchCheck },
];

export default function Jobs() {
  const { selectedRegion } = useRegion();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [salaryRange, setSalaryRange] = useState("all");

  const salaryConfig = salaryBands[selectedRegion.code] ?? salaryBands.kuwait;

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      setJobs(await jobsService.fetchJobs(selectedRegion.code));
    } catch (loadError) {
      console.error("Failed to load jobs:", loadError);
      setError("Unable to load jobs at the moment. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
    setSearchQuery("");
    setJobType("all");
    setExperienceLevel("all");
    setSalaryRange("all");
    // loadJobs intentionally follows the active URL region.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion.code]);

  const handleRetry = () => {
    jobsService.clearCache(selectedRegion.code);
    void loadJobs();
  };

  const jobTypes = useMemo(() => Array.from(new Set(jobs.map((job) => job.type))).sort(), [jobs]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [job.title, job.company, job.description, job.location]
      .some((value) => value.toLowerCase().includes(query));
    const matchesJobType = jobType === "all" || job.type === jobType;
    const matchesExperience = matchesExperienceBand(job.experience, experienceLevel);
    const salaryMinimum = getSalaryMinimum(job.salary);
    const matchesSalary = salaryRange === "all"
      || (salaryRange === "low" && salaryMinimum < salaryConfig.midStart)
      || (salaryRange === "medium" && salaryMinimum >= salaryConfig.midStart && salaryMinimum < salaryConfig.highStart)
      || (salaryRange === "high" && salaryMinimum >= salaryConfig.highStart);
    return matchesSearch && matchesJobType && matchesExperience && matchesSalary;
  }), [experienceLevel, jobType, jobs, salaryConfig, salaryRange, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery) || jobType !== "all" || experienceLevel !== "all" || salaryRange !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setJobType("all");
    setExperienceLevel("all");
    setSalaryRange("all");
  };

  const defaultJobsSeo = getTemplatedPageSeo("jobs", selectedRegion.name);
  const seoTitle = useMemo(() => {
    if (searchQuery) return `${searchQuery} Jobs in ${selectedRegion.name} | BrandMyProfile`;
    if (jobType !== "all") return `${jobType} Jobs in ${selectedRegion.name} | BrandMyProfile`;
    return defaultJobsSeo.title;
  }, [jobType, searchQuery, selectedRegion.name, defaultJobsSeo.title]);

  const cvReviewPath = `/${selectedRegion.code}/contact`;
  const linkedInPath = `/${selectedRegion.code}/services/linkedin-makeover`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[hsl(35_33%_97%)]">
      <SEO
        title={seoTitle}
        description={defaultJobsSeo.description}
        keywords={`jobs ${selectedRegion.name}, careers ${selectedRegion.name}, job openings, employment opportunities, ${selectedRegion.name} recruitment, ${searchQuery}`}
        noindex
      />
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-[hsl(var(--surface-teal-soft))] py-16 sm:py-20 lg:py-24">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border-[48px] border-white/40" aria-hidden="true" />
          <div className="section-container relative">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary">
                <BriefcaseBusiness className="h-4 w-4" /> Career Opportunities
              </div>
              <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Latest Jobs in <span className="text-primary">{selectedRegion.name}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground/75 sm:text-xl">
                Explore sample roles in {selectedRegion.name} and make sure your CV is ready before you apply.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                Use search and filters to find roles by job type, experience level and salary range.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-white" aria-label="Jobs page benefits">
          <div className="section-container grid grid-cols-2 divide-x divide-y divide-border/70 md:grid-cols-4 md:divide-y-0">
            {trustItems.map(({ label, icon: Icon }) => (
              <div key={label} className="flex min-h-24 items-center gap-3 px-3 py-5 sm:px-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                <span className="text-sm font-semibold leading-5 text-foreground sm:text-[15px]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container">
            {isIllustrativeJobSource && (
              <p className="mb-8 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                Sample job listings are shown for career exploration and demonstration purposes. Availability is not verified, and BrandMyProfile is not the employer or recruiter for these roles. Contact us on WhatsApp for career guidance.
              </p>
            )}
            {error && !loading && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Jobs could not be loaded</AlertTitle>
                <AlertDescription className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <span>{error}</span><Button onClick={handleRetry} variant="outline" size="sm">Retry</Button>
                </AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <JobFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                jobType={jobType}
                onJobTypeChange={setJobType}
                experienceLevel={experienceLevel}
                onExperienceLevelChange={setExperienceLevel}
                salaryRange={salaryRange}
                onSalaryRangeChange={setSalaryRange}
                jobTypes={jobTypes}
                salaryOptions={salaryConfig.options}
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            {!loading && !error && (
              <div className="mb-8 flex flex-col justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Explore opportunities</p>
                  <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Available Positions</h2>
                </div>
                <p className="text-base font-semibold text-muted-foreground" aria-live="polite">
                  {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} found in {selectedRegion.name}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-[440px] w-full rounded-[var(--radius-bento)]" />)}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredJobs.map((job, index) => {
                  const showConversion = (index + 1) % 4 === 0
                    || (index === filteredJobs.length - 1 && filteredJobs.length % 4 >= 3);
                  return (
                    <Fragment key={job.id}>
                      <JobCard {...job} region={selectedRegion.code} regionName={selectedRegion.name} />
                      {showConversion && (
                        <aside className="overflow-hidden rounded-[var(--radius-bento)] bg-primary px-6 py-8 text-primary-foreground md:col-span-2 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-10">
                          <div className="max-w-2xl">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/65">Application support</p>
                            <h3 className="font-serif text-3xl font-semibold sm:text-4xl">Applying for These Roles?</h3>
                            <p className="mt-3 text-base leading-7 text-primary-foreground/80">Make sure your CV is ATS-ready and tailored to the market before you apply.</p>
                          </div>
                          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
                            <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review <ArrowRight /></Link></Button>
                            <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={linkedInPath}>Improve My LinkedIn</Link></Button>
                          </div>
                        </aside>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[var(--radius-bento)] border border-border bg-white px-5 py-14 text-center shadow-[var(--shadow-card)] sm:px-8">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><BriefcaseBusiness className="h-7 w-7" /></span>
                <h3 className="font-serif text-3xl font-semibold">No matching jobs found</h3>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">Try adjusting your filters or check other opportunities in this region.</p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get a Free CV Review</Link></Button>
                  <Button variant="outline" size="lg" onClick={handleResetFilters}>Browse All Jobs</Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <BadgeCheck className="mx-auto mb-5 h-8 w-8 text-accent" />
            <h2 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Applying for Jobs in {selectedRegion.name}? Make Sure Your CV Is Ready.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/75">
              We help job seekers improve their CV, LinkedIn profile and professional positioning before they apply.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="cta" size="lg" asChild><Link to={cvReviewPath}>Get My Free CV Review <ArrowRight /></Link></Button>
              <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={linkedInPath}><Linkedin /> Improve My LinkedIn</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
