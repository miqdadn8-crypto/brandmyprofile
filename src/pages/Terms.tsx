import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";

const CANONICAL_URL = "https://www.brandmyprofile.com/terms";
const META_TITLE = "Terms of Service";
const META_DESCRIPTION =
  "The terms that apply when you use BrandMyProfile's CV writing, LinkedIn optimization, career coaching and masterclass services.";
const LAST_UPDATED = "10 September 2026";

export default function Terms() {
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
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={META_TITLE} description={META_DESCRIPTION} path="/terms" structuredData={structuredData} noindex={false} />
      <Header />
      <main>
        <section className="border-b border-border bg-[hsl(var(--surface-warm))] py-14">
          <div className="section-container max-w-3xl">
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container max-w-3xl space-y-10 text-[15px] leading-7 text-foreground/90">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Acceptance of Terms</h2>
              <p className="mt-3">
                By using brandmyprofile.com or engaging BrandMyProfile for a service, you agree to these Terms. If you
                don't agree, please don't use the site or our services.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Description of Services</h2>
              <p className="mt-3">
                BrandMyProfile provides online, human-written career-document and career-coaching services, including
                professional CV writing, ATS CV optimization, GCC-format CV preparation, Europass CV writing (India),
                LinkedIn profile optimization, career masterclasses and one-to-one career guidance. All services are
                delivered online - there is no walk-in office.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">No Guarantee of Outcomes</h2>
              <p className="mt-3">
                We help you present your experience clearly and professionally, but we cannot guarantee interviews,
                job offers, employment, LinkedIn connection requests, salary outcomes, or any other outcome. Hiring
                decisions are made by employers and depend on factors outside our control, including your
                qualifications, the job market and each employer's own process.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Revisions &amp; Delivery</h2>
              <p className="mt-3">
                Turnaround times and the number of included revision rounds depend on the specific package you choose
                at the time of booking - these are confirmed with you directly before work begins. We don't offer a
                refund guarantee, but revision support is included with every package as described when you book.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Payment</h2>
              <p className="mt-3">
                Pricing for your region and package is shown on our Pricing page or shared directly during your
                consultation. Payment terms and accepted methods are confirmed with you before work begins.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Your Content &amp; Intellectual Property</h2>
              <p className="mt-3">
                You retain ownership of the CV, LinkedIn content and other career documents we create for you once
                delivered. The BrandMyProfile name, logo and website content remain our property and may not be
                copied or reused without permission.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Acceptable Use</h2>
              <p className="mt-3">
                Please provide accurate information about your own experience and qualifications. We do not write or
                knowingly include fabricated qualifications, employment history or credentials in any document we
                prepare.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Third-Party Links &amp; Communication</h2>
              <p className="mt-3">
                Our booking and consultation flows may direct you to WhatsApp, Calendly or other third-party
                platforms. Your use of those platforms is governed by their own terms, not ours.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Limitation of Liability</h2>
              <p className="mt-3">
                To the fullest extent permitted by law, BrandMyProfile is not liable for indirect, incidental or
                consequential damages arising from your use of our website or services, including any hiring outcome.
                Nothing in these Terms limits liability that cannot be excluded under applicable law.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Governing Law</h2>
              <p className="mt-3">
                These Terms are intended to be interpreted reasonably and in good faith, with reference to the laws
                applicable where BrandMyProfile operates, without prejudice to any mandatory consumer-protection laws
                that may apply in your own country.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Changes to These Terms</h2>
              <p className="mt-3">
                We may update these Terms from time to time as our services evolve. The "Last updated" date at the top
                of this page reflects the most recent revision.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Contact Us</h2>
              <p className="mt-3">
                Questions about these Terms can be sent to{" "}
                <a href="mailto:info@brandmyprofile.com" className="font-semibold text-primary underline-offset-4 hover:underline">
                  info@brandmyprofile.com
                </a>{" "}
                or +965 41103254.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
