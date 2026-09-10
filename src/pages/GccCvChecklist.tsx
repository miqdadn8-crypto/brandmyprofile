import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  Compass,
  FileCheck2,
  Layers,
  MapPin,
  Printer,
  RotateCcw,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegion } from "@/contexts/RegionContext";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";

const CANONICAL_URL = "https://www.brandmyprofile.com/resources/gcc-cv-checklist";
const META_TITLE = "GCC CV Checklist for Job Seekers";
const META_DESCRIPTION =
  "A free, printable checklist covering CV structure, ATS formatting, GCC targeting, personal-details safety, experience writing and proofreading for Gulf job applications.";
const STORAGE_KEY = "bmp-gcc-cv-checklist-v1";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  icon: typeof Layers;
  items: ChecklistItem[];
}

const sections: ChecklistSection[] = [
  {
    id: "structure",
    title: "Structure",
    description: "The overall shape and formatting of the document.",
    icon: Layers,
    items: [
      { id: "structure-1", text: "Contact details (phone with country code, professional email) are accurate and complete" },
      { id: "structure-2", text: "Clean, single-column layout with clear, standard section headings" },
      { id: "structure-3", text: "Reverse-chronological work history with consistent date formatting throughout" },
      { id: "structure-4", text: "Logical section order (e.g. Summary, Experience, Skills, Education, Certifications)" },
      { id: "structure-5", text: "No more than two fonts used, kept consistent throughout the document" },
      { id: "structure-6", text: "Saved as both an editable file and a PDF version for submission" },
      { id: "structure-7", text: "Length appropriate to experience level - typically one to two pages, longer only for senior or highly technical profiles" },
    ],
  },
  {
    id: "ats",
    title: "ATS Formatting",
    description: "Making sure applicant tracking systems can read your CV correctly.",
    icon: ScanSearch,
    items: [
      { id: "ats-1", text: "No text boxes, columns, tables or graphics that could be misread by parsing software" },
      { id: "ats-2", text: "Contact details placed in the main body, not only in a header or footer" },
      { id: "ats-3", text: "Standard section headings used (e.g. \"Work Experience\", not a creative alternative)" },
      { id: "ats-4", text: "Keywords from the job description appear naturally in your experience and skills sections" },
      { id: "ats-5", text: "Job titles and dates typed as plain text, never embedded inside an image" },
      { id: "ats-6", text: "No icons or symbols used in place of section headings or bullet points" },
      { id: "ats-7", text: "File submitted in the format requested by the employer's application system" },
    ],
  },
  {
    id: "gcc-targeting",
    title: "GCC Targeting",
    description: "Positioning your CV for Gulf employers specifically.",
    icon: Compass,
    items: [
      { id: "gcc-1", text: "Current location and relocation readiness stated clearly if applying from outside your target country" },
      { id: "gcc-2", text: "Availability or notice period included where relevant to the employer" },
      { id: "gcc-3", text: "Professional summary positioned for your specific target GCC market and role" },
      { id: "gcc-4", text: "Language skills relevant to the role (e.g. English, Arabic) listed clearly" },
      { id: "gcc-5", text: "Job titles presented in internationally recognizable terms" },
      { id: "gcc-6", text: "Checked your target country's specific expectations rather than assuming one GCC format fits every market" },
    ],
  },
  {
    id: "personal-details",
    title: "Personal Details Safety",
    description: "Protecting sensitive information while applying.",
    icon: ShieldAlert,
    items: [
      { id: "pd-1", text: "Passport number and Civil ID / national ID number left off unless a specific employer explicitly requires them" },
      { id: "pd-2", text: "Full home address omitted - city and country are generally sufficient" },
      { id: "pd-3", text: "No banking, sponsor or visa-file numbers included anywhere on the CV" },
      { id: "pd-4", text: "Religion and marital status omitted unless you've chosen to include them and they're genuinely relevant" },
      { id: "pd-5", text: "Photo, if included, is a plain and professional headshot" },
      { id: "pd-6", text: "Personal documents only shared after verifying the employer or agency is legitimate" },
    ],
  },
  {
    id: "experience",
    title: "Experience Writing",
    description: "Turning your work history into a compelling case.",
    icon: Sparkles,
    items: [
      { id: "exp-1", text: "Each role opens with brief context, followed by achievement-focused bullet points" },
      { id: "exp-2", text: "Bullets describe outcomes and impact, not just a list of duties" },
      { id: "exp-3", text: "Every achievement included is real and something you could explain confidently in an interview" },
      { id: "exp-4", text: "Numbers used only where genuinely accurate and verifiable" },
      { id: "exp-5", text: "Bullet points begin consistently with strong action verbs" },
      { id: "exp-6", text: "Any career gaps are addressed briefly and honestly rather than left unexplained" },
    ],
  },
  {
    id: "project-experience",
    title: "Project Experience",
    description: "Relevant for engineering, construction and technical roles.",
    icon: FileCheck2,
    items: [
      { id: "proj-1", text: "Project name, your role, scope and specific contribution are stated clearly" },
      { id: "proj-2", text: "Project duration and your actual involvement dates are accurate" },
      { id: "proj-3", text: "Technical scope explained in terms both a recruiter and a technical interviewer could follow" },
      { id: "proj-4", text: "Team size or collaboration context included only where accurate and relevant" },
      { id: "proj-5", text: "Confidential client or project names handled according to any confidentiality agreement" },
      { id: "proj-6", text: "Outcomes described factually, without exaggerating scale or impact" },
    ],
  },
  {
    id: "technical-skills",
    title: "Technical Skills",
    description: "Presenting your tools, methods and certifications honestly.",
    icon: Wrench,
    items: [
      { id: "tech-1", text: "Skills list reflects tools, software and methods you've genuinely used" },
      { id: "tech-2", text: "Skills grouped logically if the list is long (e.g. software, methods, certifications)" },
      { id: "tech-3", text: "Most relevant skills to your target role listed first" },
      { id: "tech-4", text: "Proficiency level noted only for skills you could demonstrate or discuss in an interview" },
      { id: "tech-5", text: "Certifications include the issuing body and completion year where available" },
    ],
  },
  {
    id: "proofreading",
    title: "Proofreading",
    description: "The final pass before you submit anything.",
    icon: ClipboardCheck,
    items: [
      { id: "proof-1", text: "Spelling and grammar checked carefully, ideally by a second reader" },
      { id: "proof-2", text: "Verb tense consistent - past roles in past tense, current role in present tense" },
      { id: "proof-3", text: "Dates, job titles and company names match your actual records exactly" },
      { id: "proof-4", text: "Formatting (spacing, bullet style, font size) consistent across every section" },
      { id: "proof-5", text: "Contact details tested to confirm they work" },
      { id: "proof-6", text: "Final CV read once more as if you were the recruiter meeting you for the first time" },
    ],
  },
];

const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);

const countryReminders = [
  { name: "Kuwait", note: "Employers span oil & gas, engineering, construction and finance - check the specific expectations of your target industry and employer type before finalizing your CV." },
  { name: "UAE", note: "A highly international hiring market - keep your CV globally readable while noting any Dubai- or Abu Dhabi-specific requirements from the employer." },
  { name: "Saudi Arabia", note: "Hiring spans engineering, construction, healthcare, technology and large-scale projects - confirm whether your target employer has specific document preferences." },
  { name: "Qatar", note: "Energy, construction, infrastructure and hospitality are common sectors - verify country- and employer-specific requirements directly where possible." },
];

const whatNotToInclude = [
  "Fabricated or exaggerated achievements, skills or qualifications",
  "Personal identity documents (passport number, Civil ID number)",
  "Full home address - city and country is generally sufficient",
  "Religion, marital status or other personal details you haven't chosen to share",
  "Reasons for leaving previous roles, unless specifically asked",
  "References' contact details - \"available on request\" is sufficient",
  "Salary history or expectations, unless the employer specifically requests it",
];

export default function GccCvChecklist() {
  const { selectedRegion } = useRegion();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // Private browsing / storage disabled - checklist still works, just doesn't persist.
    }
    setHydrated(true);
  }, []);

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage failures - in-memory state still reflects the toggle this session.
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setChecked({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage was never writable.
    }
  };

  const completedCount = useMemo(
    () => (hydrated ? Object.values(checked).filter(Boolean).length : 0),
    [checked, hydrated],
  );
  const progressPercent = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANONICAL_URL}#webpage`,
        name: META_TITLE,
        description: META_DESCRIPTION,
        url: CANONICAL_URL,
        isPartOf: { "@id": websiteSchema["@id"] },
      },
      organizationSchema,
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground print:bg-white">
      <SEO
        title={META_TITLE}
        description={META_DESCRIPTION}
        path="/resources/gcc-cv-checklist"
        keywords="gcc cv checklist, cv checklist for gcc jobs, printable cv checklist gulf jobs, cv checklist kuwait, gulf job application checklist"
        structuredData={structuredData}
      />

      <div className="print:hidden">
        <Header />
      </div>
      <div className="print:hidden">
        <Breadcrumbs
          items={[
            { label: "Home", path: `/${selectedRegion.code}` },
            { label: "GCC CV Checklist" },
          ]}
        />
      </div>

      {/* Print-only masthead - the only header that actually renders on paper */}
      <div className="hidden print:block print:px-2 print:py-4">
        <p className="text-lg font-semibold">BrandMyProfile</p>
        <p className="text-sm text-muted-foreground">GCC CV Checklist for Job Seekers - brandmyprofile.com/resources/gcc-cv-checklist</p>
      </div>

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-teal-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)] print:hidden">
          <div className="section-container py-14 lg:py-18">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary">
                <ClipboardList className="h-4 w-4" /> Free Career Resource
              </div>
              <h1 className="font-serif text-[clamp(2.35rem,6.5vw,4rem)] font-semibold leading-[1.05] tracking-normal">
                GCC CV Checklist for Job Seekers
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                A practical, printable checklist covering structure, ATS formatting, GCC targeting, personal-details
                safety, experience writing and proofreading - work through it before you submit your next application.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="xl" className="w-full whitespace-normal px-6 text-base sm:w-auto" onClick={() => window.print()}>
                  <Printer className="h-5 w-5" />
                  Print or Save as PDF
                </Button>
                <Button variant="outline" size="xl" className="w-full bg-white/70 px-6 text-base sm:w-auto" asChild>
                  <a href="/blog/gcc-cv-format-guide">Read the GCC CV Format Guide</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Progress bar - screen only, doesn't mean anything on paper */}
        <section className="border-b border-border bg-white py-5 print:hidden">
          <div className="section-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{hydrated ? `${completedCount} of ${totalItems} checked` : `${totalItems} items`}</span>
                <span className="text-muted-foreground">{hydrated ? `${progressPercent}%` : ""}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-warm))]">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:self-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Reset checklist
              </button>
            )}
          </div>
          <p className="section-container mt-3 text-xs leading-5 text-muted-foreground">
            Your progress is saved in this browser only - it's never sent to us or seen by anyone else.
          </p>
        </section>

        <div className="section-container py-10 lg:grid lg:grid-cols-[0.26fr_0.74fr] lg:items-start lg:gap-10 print:block">
          {/* Desktop table of contents */}
          <nav
            aria-label="Checklist categories"
            className="hidden rounded-[1.25rem] border border-border bg-white p-5 lg:sticky lg:top-24 lg:block print:hidden"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">On This Checklist</p>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--surface-teal-soft))] hover:text-primary"
                  >
                    <section.icon className="h-4 w-4 shrink-0 text-primary" />
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#country-reminders" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--surface-teal-soft))] hover:text-primary">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" /> Country Reminders
                </a>
              </li>
              <li>
                <a href="#what-not-to-include" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--surface-teal-soft))] hover:text-primary">
                  <XCircle className="h-4 w-4 shrink-0 text-primary" /> What Not to Include
                </a>
              </li>
            </ul>
          </nav>

          {/* Checklist sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-[1.5rem] border border-border bg-white p-6 md:p-8 print:break-inside-avoid print:rounded-none print:border-x-0 print:border-t-0 print:px-0 print:pb-6"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground print:hidden">
                    <section.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-normal">{section.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {section.items.map((item) => {
                    const isChecked = !!checked[item.id];
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={item.id}
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary print:accent-black"
                        />
                        <label
                          htmlFor={item.id}
                          className={`cursor-pointer text-sm leading-6 print:cursor-default ${isChecked ? "text-muted-foreground/60 line-through" : "text-foreground"}`}
                        >
                          {item.text}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}

            {/* Country-targeting reminders */}
            <article id="country-reminders" className="scroll-mt-24 rounded-[1.5rem] border border-border bg-[hsl(var(--surface-warm))] p-6 md:p-8 print:break-inside-avoid print:rounded-none print:border-x-0 print:bg-transparent print:px-0">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground print:hidden">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-semibold tracking-normal">Country-Targeting Reminders</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quick reminders, not a substitute for checking the specific employer's requirements.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {countryReminders.map((country) => (
                  <div key={country.name} className="rounded-xl border border-border bg-white p-4 print:border-0 print:p-0">
                    <p className="text-sm font-semibold">{country.name}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{country.note}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* What not to include */}
            <article id="what-not-to-include" className="scroll-mt-24 rounded-[1.5rem] border border-border bg-white p-6 md:p-8 print:break-inside-avoid print:rounded-none print:border-x-0 print:px-0">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground print:hidden">
                  <XCircle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-semibold tracking-normal">What Not to Include</h2>
                  <p className="mt-1 text-sm text-muted-foreground">A quick pre-submission scan for content that's best left off.</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {whatNotToInclude.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* No fake statistics note */}
            <article className="scroll-mt-24 rounded-[1.5rem] border border-accent/25 bg-accent/5 p-6 md:p-8 print:break-inside-avoid print:rounded-none print:border-x-0 print:bg-transparent print:px-0">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-accent" />
                <div>
                  <h2 className="text-lg font-semibold tracking-normal">A Note on Numbers</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Only include statistics you can verify and explain if asked in an interview - don't invent figures
                    (e.g. "increased efficiency by 300%") to make a bullet point sound stronger. A specific, honest
                    example is more convincing than an unverifiable number.
                  </p>
                </div>
              </div>
            </article>

            {/* Internal links - contextual, not styled as CTAs */}
            <div className="rounded-[1.5rem] border border-border bg-[hsl(var(--surface-teal-soft))] p-6 md:p-8 print:hidden">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Go Deeper</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-primary">
                <a href="/blog/gcc-cv-format-guide" className="underline-offset-4 hover:underline">
                  GCC CV Format Guide
                </a>
                <a href="/blog/ats" className="underline-offset-4 hover:underline">
                  ATS CV Guides
                </a>
                <a href={`/${selectedRegion.code}/services/gcc-cv`} className="underline-offset-4 hover:underline">
                  GCC CV Writing (Done For You)
                </a>
                <a href={`/${selectedRegion.code}/services/cv-writing`} className="underline-offset-4 hover:underline">
                  Professional CV Writing
                </a>
                <a href="/india/gcc-jobs" className="underline-offset-4 hover:underline">
                  India to GCC Jobs Pathway
                </a>
              </div>
            </div>

            {/* One soft CTA, near the bottom only */}
            <div className="rounded-[1.5rem] border border-primary/15 bg-white p-7 text-center print:hidden">
              <p className="text-base leading-7 text-muted-foreground">
                Prefer to have this done for you instead of self-checking every line?
              </p>
              <Button variant="cta" size="lg" className="mt-5" asChild>
                <a href={`/${selectedRegion.code}/services/gcc-cv`}>
                  Explore GCC CV Writing
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
      <div className="print:hidden">
        <WhatsAppButton />
      </div>
    </div>
  );
}
