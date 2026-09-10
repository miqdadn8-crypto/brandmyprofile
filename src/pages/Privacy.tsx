import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { organizationSchema, websiteSchema } from "@/lib/seo/organization";

const CANONICAL_URL = "https://www.brandmyprofile.com/privacy";
const META_TITLE = "Privacy Policy";
const META_DESCRIPTION =
  "How BrandMyProfile collects, uses and protects information when you use our website, contact forms and WhatsApp-based consultation process.";
const LAST_UPDATED = "10 September 2026";

export default function Privacy() {
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
      <SEO title={META_TITLE} description={META_DESCRIPTION} path="/privacy" structuredData={structuredData} noindex={false} />
      <Header />
      <main>
        <section className="border-b border-border bg-[hsl(var(--surface-warm))] py-14">
          <div className="section-container max-w-3xl">
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container max-w-3xl space-y-10 text-[15px] leading-7 text-foreground/90">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Overview</h2>
              <p className="mt-3">
                BrandMyProfile ("we", "us") provides online CV writing, ATS optimization, GCC CV formatting, LinkedIn
                profile optimization, career masterclasses and career coaching. This policy explains what information
                we collect through this website and how we use it. It applies to brandmyprofile.com and does not cover
                third-party sites we link to, such as WhatsApp, Calendly or Google.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Information We Collect</h2>
              <p className="mt-3">When you use our Contact, Schedule or consultation forms, you may provide:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Your name, email address and phone number</li>
                <li>Your current location, target market and target role</li>
                <li>The service you're interested in and any message or career details you choose to share</li>
              </ul>
              <p className="mt-3">
                Our forms are designed to prepare a message that is then sent through WhatsApp or your own email
                client, at your action - the information you enter is not stored in a BrandMyProfile database or
                server as part of that submission. If you separately email us your CV or other documents, we keep
                those only for as long as needed to deliver the service you've requested.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Cookies &amp; Local Storage</h2>
              <p className="mt-3">
                We use your browser's local storage (not third-party tracking cookies) to remember your selected
                region so the site shows the right content on return visits, and, on our GCC CV Checklist page, to
                save your checklist progress on your own device. This information stays in your browser and is not
                sent to us. We do not currently use advertising cookies or third-party analytics trackers on this
                site.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">How We Use Information</h2>
              <p className="mt-3">We use the information you provide to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Respond to your enquiry and provide the service you've requested</li>
                <li>Prepare and deliver CV, LinkedIn, or career-coaching work you've asked for</li>
                <li>Communicate with you about your order or enquiry, including via WhatsApp, email or phone</li>
              </ul>
              <p className="mt-3">We do not sell your personal information to third parties.</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Third-Party Services</h2>
              <p className="mt-3">
                Our consultation and booking flows may direct you to WhatsApp or Calendly, and our reviews link to a
                Google Business Profile. Once you interact with those platforms directly, your information is subject
                to their own privacy policies, not this one. We encourage you to review those policies before sharing
                information there.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Data Retention</h2>
              <p className="mt-3">
                We keep information you've shared with us for as long as reasonably necessary to deliver the service
                you requested and to respond to any follow-up questions, after which it is deleted or anonymized
                where practical.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Your Choices</h2>
              <p className="mt-3">
                You can ask us at any time what information we hold about you, request a correction, or ask us to
                delete it, by contacting us using the details below. You can also clear your browser's local storage
                at any time to remove your saved region preference or checklist progress.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Children's Privacy</h2>
              <p className="mt-3">
                Our services are intended for working professionals, students and job seekers, and are not directed
                at children. We don't knowingly collect information from children.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Changes to This Policy</h2>
              <p className="mt-3">
                We may update this policy from time to time as our services evolve. The "Last updated" date at the top
                of this page reflects the most recent revision.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-normal">Contact Us</h2>
              <p className="mt-3">
                Questions about this policy or your information can be sent to{" "}
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
