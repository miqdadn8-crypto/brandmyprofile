import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRegion } from "@/contexts/RegionContext";
import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";

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

function RegionFlag({ code, name, size = "sm" }: { code: string; name: string; size?: "lg" | "sm" }) {
  const commonProps = {
    className: `${size === "lg" ? "h-16 w-24" : "h-11 w-16"} shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-border/60`,
    viewBox: "0 0 64 48",
    role: "img",
    "aria-label": `${name} flag`,
  };

  if (code === "uae") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#fff" />
        <rect x="0" y="0" width="18" height="48" fill="#ef3340" />
        <rect x="18" y="0" width="46" height="16" fill="#009739" />
        <rect x="18" y="32" width="46" height="16" fill="#000" />
      </svg>
    );
  }

  if (code === "saudi") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#006c35" />
        <text
          x="32"
          y="21"
          fill="#fff"
          fontFamily="serif"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
          direction="rtl"
        >
          لا إله إلا الله
        </text>
        <text
          x="32"
          y="31"
          fill="#fff"
          fontFamily="serif"
          fontSize="8.5"
          fontWeight="700"
          textAnchor="middle"
          direction="rtl"
        >
          محمد رسول الله
        </text>
        <path d="M18 36h26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M42 36l5-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (code === "qatar") {
    const points = Array.from({ length: 10 }, (_, index) => {
      const y = index * 4.8;
      return `${index % 2 === 0 ? 20 : 12},${y}`;
    }).join(" ");

    return (
      <svg {...commonProps}>
        <rect width="64" height="48" fill="#8a1538" />
        <polygon points={`0,0 20,0 ${points} 20,48 0,48`} fill="#fff" />
      </svg>
    );
  }

  if (code === "kuwait") {
    return (
      <svg {...commonProps}>
        <rect width="64" height="16" fill="#007a3d" />
        <rect y="16" width="64" height="16" fill="#fff" />
        <rect y="32" width="64" height="16" fill="#ce1126" />
        <polygon points="0,0 22,16 22,32 0,48" fill="#000" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect width="64" height="16" fill="#ff9933" />
      <rect y="16" width="64" height="16" fill="#fff" />
      <rect y="32" width="64" height="16" fill="#138808" />
      <circle cx="32" cy="24" r="5.5" fill="none" stroke="#000080" strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * 30 * Math.PI) / 180;
        return (
          <line
            key={index}
            x1="32"
            y1="24"
            x2={32 + Math.cos(angle) * 5.5}
            y2={24 + Math.sin(angle) * 5.5}
            stroke="#000080"
            strokeWidth="0.55"
          />
        );
      })}
    </svg>
  );
}

const TILE_BASE =
  "flex h-full flex-col justify-between rounded-[21px] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] sm:p-7";

export default function RegionsSection() {
  const { selectedRegion } = useRegion();
  const [kuwait, ...secondary] = regions;
  const isActive = (code: string) => code === selectedRegion.code;

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <h2 className="mb-4 font-serif">Regions We Serve</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Specialized career services tailored to the unique job markets across Kuwait, GCC and India.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Featured: Kuwait */}
          <Reveal className="lg:row-span-2">
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Link to={kuwait.link} className="block h-full">
                <div
                  className={`${TILE_BASE} bg-[hsl(var(--surface-teal-soft))] ${
                    isActive(kuwait.code) ? "border-primary ring-2 ring-primary/30" : "border-primary-foreground/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <RegionFlag code={kuwait.code} name={kuwait.name} size="lg" />
                      <span className="text-lg font-bold text-foreground sm:text-xl">{kuwait.name}</span>
                      {isActive(kuwait.code) && (
                        <span className="ml-auto rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          Current Region
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
                      {kuwait.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{kuwait.description}</p>
                  </div>
                  <span className="mt-6 inline-flex w-fit items-center gap-1.5 text-base font-semibold text-primary">
                    {kuwait.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </Reveal>

          {/* Secondary regions */}
          {secondary.map((region, index) => (
            <Reveal key={region.code} delay={0.06 + index * 0.05}>
              <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.98 }} className="h-full">
                <Link to={region.link} className="block h-full">
                  <div className={cn(TILE_BASE, isActive(region.code) && "border-primary ring-2 ring-primary/30")}>
                    <div className="flex items-center gap-4">
                      <RegionFlag code={region.code} name={region.name} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-foreground">{region.name}</p>
                          {isActive(region.code) && (
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                              Current Region
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-base text-muted-foreground">{region.title}</p>
                      </div>
                    </div>
                    <ArrowRight className="mt-4 h-4 w-4 self-end text-primary" aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to={`/${selectedRegion.code}/services/cv-writing`}
            className="inline-flex items-center gap-1.5 text-base font-semibold text-primary-foreground underline-offset-4 hover:underline"
          >
            Explore Career Services by Region
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
