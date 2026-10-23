import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRegion } from "@/contexts/RegionContext";
import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
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

const TILE_BASE =
  "flex h-full flex-col justify-between rounded-[var(--radius-bento)] border border-border/80 bg-card p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] sm:p-7";

export default function RegionsSection() {
  const { selectedRegion } = useRegion();
  const [kuwait, ...secondary] = regions;
  const isActive = (code: string) => code === selectedRegion.code;

  return (
    <section className="section-padding bg-[hsl(var(--surface-teal-soft))]">
      <div className="section-container">
        <Reveal className="text-center mb-12">
          <h2 className="heading-section mb-4">Regions We Serve</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                  className={`${TILE_BASE} border-primary/25 ${
                    isActive(kuwait.code) ? "border-primary ring-2 ring-primary/30" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <RegionFlag code={kuwait.code} name={kuwait.name} size="lg" />
                      <span className="text-lg font-bold text-foreground sm:text-xl">{kuwait.name}</span>
                      {isActive(kuwait.code) && (
                        <span className="ml-auto rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Current Region
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
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
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
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
            className="inline-flex items-center gap-1.5 text-base font-semibold text-primary underline-offset-4 hover:underline"
          >
            Explore Career Services by Region
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
