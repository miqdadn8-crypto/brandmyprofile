import { trackEvent } from "@/lib/analytics";
import { ArrowRight, BriefcaseBusiness, Car, Download, FileText, GraduationCap, HeartPulse, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useRegion } from "@/contexts/RegionContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";

// Free Kuwait CV Template Pack (lead magnet). The files in public/resources/kuwait-cv-template/
// are generated from one content source (see campaigns/kuwait-cv-template/lead-magnet.md):
// a bracketed Word template and a fictional filled PDF example per role. No email gate -
// the bridge is the free CV review once the template is filled in.
const PATH = "/resources/kuwait-cv-template";
const CANONICAL_URL = `https://www.brandmyprofile.com${PATH}`;
const FILES = `${PATH}/`;
const META_TITLE = "Free Kuwait CV Template (Word & PDF)";
const META_DESCRIPTION =
  "Free Kuwait CV templates in Word, with a filled PDF example for each: general, fresher, nurse and driver. ATS-friendly single-column layout, no sign-up.";

const roles = [
  { key: "general", title: "General", forWho: "Experienced professionals in any field", icon: BriefcaseBusiness },
  { key: "fresher", title: "Fresher / graduate", forWho: "Education first, internships and projects, one page", icon: GraduationCap },
  { key: "nurse", title: "Nurse / healthcare", forWho: "Licence and registration up top, clinical experience, certifications", icon: HeartPulse },
  { key: "driver", title: "Driver", forWho: "Licence, vehicle classes and routes first, one page", icon: Car },
] as const;

const steps = [
  "Download the Word template for your role and open it in Word or Google Docs.",
  "Replace every [bracketed] line with your own details, then delete the guidance box at the top.",
  "Rewrite the summary and key skills for each job you apply to, then save it as a PDF to send.",
];

export default function KuwaitCvTemplate() {
  const { selectedRegion } = useRegion();

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

  const onDownload = (key: string, kind: "word" | "pdf") =>
    trackEvent("resource_download", { page_type: "resource", service: `kuwait-cv-template-${key}`, cta_location: kind });

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SEO
        title={META_TITLE}
        description={META_DESCRIPTION}
        path={PATH}
        keywords="kuwait cv template, kuwait cv format word, kuwait cv format pdf, cv template kuwait, kuwait cv format for freshers, kuwait cv format for nurses"
        structuredData={structuredData}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Home", path: `/${selectedRegion.code}` }, { label: "Kuwait CV Template" }]} />

      <main>
        <section className="border-b border-border bg-[linear-gradient(135deg,hsl(var(--surface-teal-soft))_0%,hsl(var(--background))_48%,hsl(var(--surface-warm))_100%)]">
          <div className="section-container py-14 lg:py-18">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary">
                <FileText className="h-4 w-4" aria-hidden="true" /> Free download · no sign-up
              </div>
              <h1 className="font-serif text-[clamp(2.35rem,6.5vw,4rem)] font-semibold leading-[1.05] tracking-normal">
                Free Kuwait CV Template (Word &amp; PDF)
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                The layout our CV writers use for Kuwait job applications, as an editable Word file, with a filled-in example for each role. Single column, standard headings, ready for applicant tracking systems.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white py-12">
          <div className="section-container">
            <h2 className="text-2xl font-bold tracking-tight">Choose your template</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {roles.map(({ key, title, forWho, icon: Icon }) => (
                <article key={key} className="flex flex-col rounded-[var(--radius-bento)] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-muted-foreground">{forWho}</p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Button asChild className="min-h-11">
                      <a href={`${FILES}kuwait-cv-template-${key}.docx`} download onClick={() => onDownload(key, "word")}>
                        <Download className="h-4 w-4" aria-hidden="true" /> Word template
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="min-h-11">
                      <a href={`${FILES}kuwait-cv-example-${key}.pdf`} target="_blank" rel="noopener" onClick={() => onDownload(key, "pdf")}>
                        <FileText className="h-4 w-4" aria-hidden="true" /> See a filled example (PDF)
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The examples are fictional candidates written to show how a finished CV reads. Every detail in your CV should come from your real experience.
            </p>
          </div>
        </section>

        <section className="border-b border-border py-12">
          <div className="section-container max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight">How to use it</h2>
            <ol className="mt-5 space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-base leading-7">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Not sure what Kuwait employers expect in each section? Read the{" "}
              <a href="/blog/kuwait-cv-format-guide" className="font-semibold text-primary underline">Kuwait CV format guide</a>.
            </p>
          </div>
        </section>

        <section className="bg-[hsl(var(--surface-warm))] py-12">
          <div className="section-container">
            <div className="flex flex-col gap-6 rounded-[var(--radius-bento)] border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight">Filled it in? Get a free review before you apply</h2>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  Send your finished CV to us on WhatsApp and a writer tells you what to change for the jobs you're targeting. Free, no obligation. If you'd rather have it written for you, Kuwait CV packages start from 4 KWD.
                </p>
              </div>
              <div className="flex shrink-0">
                <Button variant="cta" size="lg" className="min-h-12 px-6 text-base" asChild>
                  <a href={buildWhatsAppUrl("Hello BrandMyProfile, I used your Kuwait CV template and would like a free review. I'll send my CV here.")} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />Send my CV on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <p className="mt-6 text-center">
              <a href="/kuwait/pricing" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                See Kuwait CV packages <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
