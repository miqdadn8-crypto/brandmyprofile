import { Link } from "react-router-dom";
import { BriefcaseBusiness, Clock3, MapPin, MessageCircle, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  link: string;
  region: string;
  regionName: string;
}

const displaySalary = (salary: string) => salary.replace(/\u00e2\u201a\u00b9/g, "₹");

export default function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  experience,
  description,
  region,
  regionName,
}: JobCardProps) {
  // Listings are sample content, so there is no application link - the CTA routes to the
  // CV-review flow for similar roles instead of implying a real vacancy.
  const cvReview = buildWhatsAppUrl(`Hello BrandMyProfile, I'd like a free CV review to prepare for roles like ${title} in ${regionName}. Please let me know how to send my CV.`);

  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-bento)] border border-border/80 bg-white p-5 shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-200 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-primary">
            <BriefcaseBusiness className="h-4 w-4 shrink-0" />
            <span className="truncate">{company}</span>
          </p>
          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">{title}</h3>
        </div>
        <Badge variant="secondary" className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold">{type}</Badge>
      </div>

      <p className="mb-5 line-clamp-2 text-[15px] leading-6 text-muted-foreground">{description}</p>

      <div className="mb-6 grid gap-3 border-y border-border/70 py-4 text-sm sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2.5 text-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2.5 text-foreground">
          <Clock3 className="h-4 w-4 shrink-0 text-primary" />
          <span>{experience} experience</span>
        </div>
        <div className="flex items-center gap-2.5 sm:col-span-2">
          <WalletCards className="h-5 w-5 shrink-0 text-accent" />
          <span className="text-base font-bold text-foreground">{displaySalary(salary)}</span>
        </div>
      </div>

      <div className="mt-auto grid gap-3 sm:grid-cols-2">
        <Button variant="outline" className="min-h-11 w-full" asChild>
          <Link to={`/${region}/jobs/${id}`}>View Details</Link>
        </Button>
        <Button variant="cta" className="min-h-11 w-full" asChild>
          <a href={cvReview} target="_blank" rel="noopener noreferrer">Improve My CV <MessageCircle className="h-4 w-4" /></a>
        </Button>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Need help applying?</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <Link className="text-primary hover:underline" to={`/${region}/contact`}>CV Review</Link>
          <Link className="text-primary hover:underline" to={`/${region}/services/linkedin-makeover`}>LinkedIn</Link>
          <Link className="text-primary hover:underline" to={`/${region}/services/career-guidance`}>Career Guidance</Link>
        </div>
      </div>
    </article>
  );
}
