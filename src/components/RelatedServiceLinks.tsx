import { Link } from "react-router-dom";
import { isRoutedPathAvailable } from "@/contexts/regionAvailability";

const LINKS = [
  { suffix: "/services/cv-writing", label: "Professional CV Writing" },
  { suffix: "/services/ats-cv", label: "ATS CV Writing" },
  { suffix: "/services/gcc-cv", label: "GCC CV Writing" },
  { suffix: "/services/linkedin-makeover", label: "LinkedIn Optimization" },
  { suffix: "/pricing", label: "CV Packages & Pricing" },
  { suffix: "/contact", label: "Contact Us" },
];

// Compact contextual links between the money pages. Hides the current page and any page
// that doesn't exist for the region (single source: regionAvailability).
export default function RelatedServiceLinks({ region, currentSuffix }: { region: string; currentSuffix: string }) {
  const links = LINKS.filter((l) => l.suffix !== currentSuffix && isRoutedPathAvailable(region, l.suffix));
  return (
    <nav aria-label="Related services" className="border-t border-border bg-white">
      <div className="section-container flex flex-wrap items-center gap-x-6 gap-y-2 py-6 text-sm">
        <span className="font-semibold text-foreground">Related:</span>
        {links.map((l) => (
          <Link key={l.suffix} to={`/${region}${l.suffix}`} className="font-semibold text-primary hover:underline">{l.label}</Link>
        ))}
      </div>
    </nav>
  );
}
