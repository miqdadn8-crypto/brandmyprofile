import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, DollarSign, ArrowRight, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/contexts/RegionContext";
import { jobsService } from "@/services/jobsService";
import Reveal from "@/components/motion/Reveal";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
}

export default function RecentJobsSection() {
  const { selectedRegion } = useRegion();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await jobsService.fetchJobs(selectedRegion.code);
        setJobs(data.slice(0, 3)); // Get first 3 jobs
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [selectedRegion.code]);

  // No sample jobs exist for this region yet (e.g. Bahrain/Oman) - hide the section
  // entirely rather than showing another region's jobs under the wrong label, or an
  // empty "0 jobs" section.
  if (!loading && jobs.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-semibold">Latest Opportunities</span>
          </div>
          <h2 className="mb-4 font-serif">Recent Jobs in {selectedRegion.name}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the latest job openings tailored for professionals in your region.
          </p>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {jobs.map((job, index) => (
                <Reveal key={job.id} delay={index * 0.08}>
                  <Card className="rounded-[var(--radius-bento)] border-border/80 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
                    <CardHeader>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="text-[13px]">
                          {job.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                      <CardDescription className="text-base line-clamp-1">{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-base text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="line-clamp-1">{job.location}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/${selectedRegion.code}/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>

            <div className="text-center">
              <Button variant="cta" size="lg" asChild>
                <Link to={`/${selectedRegion.code}/jobs`} className="inline-flex items-center gap-2">
                  Explore All Jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
