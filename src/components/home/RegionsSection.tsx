import { Link } from "react-router-dom";
import { useRegion } from "@/contexts/RegionContext";
import RegionFlag from "@/components/RegionFlag";

const regions = [
  {
    code: "kuwait",
    name: "Kuwait",
    title: "CV Writing for Kuwait Jobs",
    description: "ATS-ready CVs tailored for Kuwait hiring and GCC opportunities.",
    cta: "Explore Kuwait",
    link: "/kuwait/services/cv-writing",
    featured: true,
  },
  {
    code: "uae",
    name: "UAE",
    title: "CV Writing for UAE Jobs",
    link: "/uae/services/cv-writing",
  },
  {
    code: "saudi",
    name: "Saudi Arabia",
    title: "CV Writing for Saudi Jobs",
    link: "/saudi/services/cv-writing",
  },
  {
    code: "qatar",
    name: "Qatar",
    title: "CV Writing for Qatar Jobs",
    link: "/qatar/services/cv-writing",
  },
  {
    code: "india",
    name: "India",
    title: "CV Writing for GCC Applicants from India",
    link: "/india/services/cv-writing",
  },
];

export default function RegionsSection() {
  const { selectedRegion } = useRegion();
  return (
    <nav aria-label="Career services by market" className="border-t border-border bg-[hsl(var(--surface-teal-soft))] py-8">
      <div className="section-container">
        <p className="text-base font-semibold">Exploring another job market?</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {regions.filter((region) => region.code !== selectedRegion.code).map((region) => (
            <li key={region.code}><Link to={region.link} className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline-offset-4 hover:underline"><RegionFlag code={region.code} name={region.name} />{region.name}</Link></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
