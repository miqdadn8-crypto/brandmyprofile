import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { useLeadModal } from "@/components/lead/LeadModalContext";

export default function CvFormatsSection() {
  const { selectedRegion } = useRegion();
  const { openLeadModal } = useLeadModal();
  if (LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code)) return null;
  const formats = [
    { title: "Applying in the GCC", description: "Structure your experience for employers in Kuwait and the wider Gulf region.", path: "gcc-cv", label: "Explore GCC CV writing" },
    { title: "Applying through online portals", description: "Use a clear, single-column layout that recruitment systems and people can read.", path: "ats-cv", label: "Explore ATS-friendly CVs" },
    ...(selectedRegion.code === "india" ? [{ title: "An application asks for Europass", description: "Use the Europass format when an employer or institution requests it.", path: "europass-cv", label: "Explore Europass CVs" }] : []),
  ];
  return (
    <section aria-labelledby="cv-formats-heading" className="bg-[hsl(var(--surface-teal-soft))] py-12 md:py-16">
      <div className="section-container">
        <h2 id="cv-formats-heading" className="heading-section">A CV that fits your application.</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Your target market and application method work together. A GCC CV can also be ATS-friendly; these are not mutually exclusive options.</p>
        <ul className={`mt-8 grid gap-5 ${formats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {formats.map((format) => (
            <li key={format.path} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <FileText className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="text-xl">{format.title}</h3>
              <p className="mb-5 mt-3 text-base leading-7 text-muted-foreground">{format.description}</p>
              <Link to={`/${selectedRegion.code}/services/${format.path}`} className="mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">{format.label}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-7">Not sure which approach fits? <button type="button" onClick={() => openLeadModal({ trigger: "free_review_section" })} className="min-h-11 font-semibold text-primary underline underline-offset-4">Request a free review and ask for a recommendation.</button></p>
      </div>
    </section>
  );
}
