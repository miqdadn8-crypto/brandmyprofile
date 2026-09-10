import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, DollarSign, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { jobsService } from "@/services/jobsService";
import { regions } from "@/contexts/RegionContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { jobsConfig } from "@/config/jobs";

// The live job source is currently sample/illustrative data (see src/config/jobs.ts),
// not a real-time jobs feed. Structured data and indexing must not present it as real.
const isIllustrativeJobSource = jobsConfig.source === "mock";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description?: string;
  posted?: string;
  link?: string;
}

const hasRealApplicationUrl = (link?: string) => {
  if (!link) return false;
  try {
    const url = new URL(link);
    return ["http:", "https:"].includes(url.protocol)
      && url.hostname.length > 0
      && !url.pathname.toLowerCase().includes("/jobs/example");
  } catch {
    return false;
  }
};

export default function JobDetail() {
  const { region, id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true);
        const jobs = await jobsService.fetchJobs(region || "kuwait");
        const currentJob = jobs.find((j) => j.id === id);
        
        if (!currentJob) {
          navigate("/404");
          return;
        }

        setJob(currentJob);
        
        // Get 3 related jobs from same region
        const related = jobs
          .filter((j) => j.id !== id)
          .slice(0, 3);
        setRelatedJobs(related);
      } catch (error) {
        console.error("Error loading job:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [id, region, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!job) return null;

  const regionName = regions.find((item) => item.code === region)?.name ?? "this region";
  const canApplyExternally = hasRealApplicationUrl(job.link);
  const roleEnquiryUrl = buildWhatsAppUrl(`Hello BrandMyProfile, I would like to ask about the ${job.title} role at ${job.company} in ${regionName}. Please share any available application guidance.`);

  const datePosted = job.posted || new Date().toISOString();
  const validThrough = new Date(datePosted);
  validThrough.setDate(validThrough.getDate() + 30);

  // Region currency comes from the single shared `regions` list (RegionContext) rather
  // than a repeated per-page conditional, so it can't drift out of sync region-by-region.
  const currency = regions.find((item) => item.code === region)?.currency ?? "KWD";

  const structuredData = isIllustrativeJobSource ? undefined : {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || `${job.title} position at ${job.company}`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: region?.toUpperCase() || "KW",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency,
      value: {
        "@type": "QuantitativeValue",
        value: job.salary,
      },
    },
    employmentType: job.type?.toUpperCase() || "FULL_TIME",
    datePosted: datePosted,
    validThrough: validThrough.toISOString(),
  };

  return (
    <>
      <SEO
        title={`${job.title} at ${job.company} - ${regionName}`}
        description={job.description || `Apply now for ${job.title} position at ${job.company} in ${job.location}. ${job.type} role with competitive salary.`}
        keywords={`${job.title}, ${job.company}, ${job.location}, ${region} jobs, ${job.type}`}
        structuredData={structuredData}
        noindex={isIllustrativeJobSource}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: `/${region}` },
          { label: regionName, path: `/${region}` },
          { label: "Jobs", path: `/${region}/jobs` },
          { label: job.title },
        ]}
      />
      <main>
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="section-container max-w-4xl">
            <Link
              to={`/${region}/jobs`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs in {regionName}
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.type}</Badge>
                <Badge variant="outline">{job.experience}</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{job.title}</h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.posted && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{job.posted}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="cta" size="lg" asChild>
                  <a
                    href={canApplyExternally ? job.link : roleEnquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {canApplyExternally ? "Apply Now" : "Ask About This Role"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/${region}/services/career-guidance`}>Get Career Help</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Job Description */}
        <section className="section-padding">
          <div className="section-container max-w-4xl">
            {isIllustrativeJobSource && (
              <p className="mb-6 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                This listing is a sample shown for illustration while we connect a live jobs feed. For current openings, ask us directly via WhatsApp.
              </p>
            )}
            <Card>
              <CardHeader>
                <CardTitle>About This Role</CardTitle>
                <CardDescription>
                  {job.company} is looking for a talented {job.title} to join their team in {job.location}.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {job.description || 
                    `We are seeking an experienced ${job.title} to join our growing team. This is a ${job.type.toLowerCase()} position requiring ${job.experience.toLowerCase()} level experience. The ideal candidate will have a strong background in their field and be passionate about contributing to our company's success.`
                  }
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">What We Offer</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Competitive salary package</li>
                  <li>Professional development opportunities</li>
                  <li>Collaborative work environment</li>
                  <li>Career growth potential</li>
                </ul>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    Need help with your application? Our CV writing and career guidance services can help you stand out.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" asChild><Link to={`/${region}/contact`}>Get CV Review</Link></Button>
                    <Button variant="outline" asChild><Link to={`/${region}/services/linkedin-makeover`}>Improve LinkedIn</Link></Button>
                    <Button variant="outline" asChild><Link to={`/${region}/services/career-guidance`}>Career Guidance</Link></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="section-padding bg-secondary/30">
            <div className="section-container">
              <h2 className="text-3xl font-bold mb-8">More Jobs in {regionName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedJobs.map((relatedJob) => (
                  <Card key={relatedJob.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{relatedJob.type}</Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{relatedJob.title}</CardTitle>
                      <CardDescription className="line-clamp-1">{relatedJob.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{relatedJob.location}</span>
                        </div>
                        {relatedJob.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{relatedJob.salary}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/${region}/jobs/${relatedJob.id}`}>View Details</Link>
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
