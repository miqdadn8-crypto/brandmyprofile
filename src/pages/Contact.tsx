import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  Compass,
  FileCheck2,
  Globe2,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRegion } from "@/contexts/RegionContext";
import { LIMITED_FOOTPRINT_REGIONS } from "@/contexts/regionAvailability";
import { buildWhatsAppUrl, joinMessageLines } from "@/lib/whatsapp";
import { organizationSchema } from "@/lib/seo/organization";
import { getTemplatedPageSeo } from "@/config/pageSeo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const services = [
  "ATS Professional CV",
  "GCC Format CV",
  "Standard Professional CV",
  "LinkedIn Profile Makeover",
  "Career Guidance",
  "Career Masterclass",
  "Cover Letter",
  "Europass CV",
  "Resignation Letter",
  "Other",
];

const targetMarkets = [
  "Kuwait",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Bahrain",
  "Oman",
  "GCC General",
  "India",
  "Europe / International",
];

const careerStages = [
  "Student / Fresh Graduate",
  "Working Professional",
  "Career Switcher",
  "Manager / Senior Professional",
];

const supportRegions = ["Kuwait", "UAE", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "India"];

const trustItems = [
  { title: "500+", label: "Professionals Supported", icon: UsersRound },
  { title: "Confidential", label: "Service", icon: ShieldCheck },
  { title: "Human Writing", label: "& Guidance", icon: UserRoundCheck },
  { title: "Kuwait & GCC", label: "Focus", icon: Globe2 },
];

export default function Contact() {
  const { toast } = useToast();
  const { selectedRegion } = useRegion();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentCountry: "",
    targetMarket: "",
    service: "",
    careerStage: "",
    targetRole: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generalWhatsAppMessage = `Hello BrandMyProfile, I need help choosing a career service for ${selectedRegion.name}. My career goal is [goal]. Please advise.`;
  const generalWhatsAppUrl = buildWhatsAppUrl(generalWhatsAppMessage);
  const schedulePath = `/${selectedRegion.code}/schedule`;
  // Bahrain/Oman only have Home, CV Writing and Contact live (Unit 3A) - LinkedIn Makeover,
  // Career Guidance and /schedule would otherwise leak into dead NotFound pages (Unit 9 finding).
  const isLimitedFootprint = LIMITED_FOOTPRINT_REGIONS.has(selectedRegion.code);
  const seo = getTemplatedPageSeo("contact", selectedRegion.name);

  const validate = (): string | null => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim() || !EMAIL_PATTERN.test(formData.email.trim())) return "Please enter a valid email address.";
    if (!formData.phone.trim()) return "Please enter your phone or WhatsApp number.";
    if (!formData.currentCountry.trim()) return "Please enter your current country.";
    if (!formData.targetMarket) return "Please select your target market.";
    if (!formData.service) return "Please select the service you need.";
    if (!formData.message.trim()) return "Please tell us briefly what you need help with.";
    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationError = validate();
    if (validationError) {
      toast({ title: "Please check your details", description: validationError, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const message = joinMessageLines([
      "Hello BrandMyProfile,",
      "",
      "I would like help with:",
      `Service: ${formData.service}`,
      `Current Country: ${formData.currentCountry.trim()}`,
      `Target Market: ${formData.targetMarket}`,
      formData.careerStage ? `Career Stage: ${formData.careerStage}` : null,
      formData.targetRole.trim() ? `Target Role / Industry: ${formData.targetRole.trim()}` : null,
      "",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Phone / WhatsApp: ${formData.phone.trim()}`,
      "",
      "Message:",
      formData.message.trim(),
      "",
      `Website Region: ${selectedRegion.name}`,
      `Page: ${location.pathname}`,
      "",
      "Please share the process and pricing.",
    ]);

    const opened = window.open(buildWhatsAppUrl(message), "_blank");
    if (opened) opened.opener = null;
    window.setTimeout(() => setIsSubmitting(false), 600);

    if (!opened) {
      toast({
        title: "Unable to open WhatsApp",
        description: "Please allow pop-ups and try again, or contact us directly on +965 41103254.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "WhatsApp draft opened",
      description: "Review your enquiry and press Send in WhatsApp to complete it.",
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const selectService = (service: string) => {
    setFormData((current) => ({ ...current, service }));
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[hsl(35_33%_97%)]">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={`contact BrandMyProfile, CV review ${selectedRegion.name}, LinkedIn makeover, career guidance enquiry, GCC CV support`}
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            {
              "@type": "ContactPage",
              "@id": "https://www.brandmyprofile.com/contact#page",
              about: { "@id": organizationSchema["@id"] },
            },
          ],
        }}
      />
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-[hsl(var(--surface-teal-soft))] py-16 sm:py-20 lg:py-24">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border-[48px] border-white/45" aria-hidden="true" />
          <div className="section-container relative">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary"><MessageCircle className="h-4 w-4" /> Career Enquiries</div>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-[68px]">Tell Us What You <span className="text-primary">Need Help With</span></h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-foreground/75">Whether you need a stronger CV, LinkedIn profile, career guidance or help preparing for GCC opportunities, tell us your goal and we’ll recommend the right next step.</p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">Serving professionals across Kuwait, GCC and India through online, WhatsApp and phone support.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="cta" size="lg" asChild><a href="#enquiry-form">Start My Career Enquiry <ArrowRight /></a></Button>
                <Button variant="outline" size="lg" asChild><a href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Chat on WhatsApp</a></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-white" aria-label="Contact page trust indicators">
          <div className="section-container grid grid-cols-2 md:grid-cols-4">
            {trustItems.map(({ title, label, icon: Icon }, index) => (
              <div key={title} className={`flex min-h-28 flex-col justify-center border-border/70 px-4 py-5 sm:px-6 ${index % 2 !== 0 ? "border-l" : ""} ${index > 1 ? "border-t md:border-t-0" : ""} ${index > 0 ? "md:border-l" : ""}`}>
                <div className="mb-2 flex items-center gap-2 text-primary"><Icon className="h-5 w-5" /><span className={`${index === 0 ? "font-serif text-3xl font-semibold" : "text-base font-bold"}`}>{title}</span></div>
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-16 lg:py-20">
          <div className="section-container grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <article className="order-1 rounded-[22px] bg-primary p-6 text-primary-foreground shadow-[var(--shadow-card)] lg:col-start-1 lg:row-start-1 sm:p-7">
              <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"><MessageCircle className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/60">Fastest way to enquire</p><h2 className="mt-2 font-serif text-3xl font-semibold">Chat on WhatsApp</h2></div></div>
              <p className="mt-5 text-base leading-7 text-primary-foreground/75">Best for quick service enquiries and sending your current CV.</p>
              <p className="mt-3 text-lg font-bold">+965 41103254</p>
              <Button variant="cta" size="lg" className="mt-6 w-full" asChild><a href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer">Start WhatsApp Chat <ArrowRight /></a></Button>
            </article>

            <article id="enquiry-form" className="order-2 scroll-mt-28 rounded-[24px] border border-border/80 bg-white p-5 shadow-[var(--shadow-card)] lg:col-start-2 lg:row-span-5 lg:row-start-1 sm:p-8 lg:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Career service enquiry</p>
              <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Tell Us About Your Goal</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">Share the essentials below. We’ll prepare a structured WhatsApp draft for you to review and send.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="name" className="mb-2 block text-[15px] font-semibold">Full Name *</label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="h-12 text-base" autoComplete="name" /></div>
                  <div><label htmlFor="email" className="mb-2 block text-[15px] font-semibold">Email Address *</label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="h-12 text-base" autoComplete="email" /></div>
                  <div><label htmlFor="phone" className="mb-2 block text-[15px] font-semibold">Phone / WhatsApp Number *</label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Include country code" className="h-12 text-base" autoComplete="tel" /></div>
                  <div><label htmlFor="currentCountry" className="mb-2 block text-[15px] font-semibold">Current Country *</label><Input id="currentCountry" name="currentCountry" value={formData.currentCountry} onChange={handleChange} placeholder="Where are you based?" className="h-12 text-base" autoComplete="country-name" /></div>

                  <div>
                    <label id="target-market-label" className="mb-2 block text-[15px] font-semibold">Target Market *</label>
                    <Select value={formData.targetMarket} onValueChange={(value) => setFormData((current) => ({ ...current, targetMarket: value }))}>
                      <SelectTrigger className="h-12 text-base" aria-labelledby="target-market-label"><SelectValue placeholder="Select target market" /></SelectTrigger>
                      <SelectContent className="z-50 bg-background">{targetMarkets.map((market) => <SelectItem key={market} value={market}>{market}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label id="service-label" className="mb-2 block text-[15px] font-semibold">Service Needed *</label>
                    <Select value={formData.service} onValueChange={(value) => setFormData((current) => ({ ...current, service: value }))}>
                      <SelectTrigger className="h-12 text-base" aria-labelledby="service-label"><SelectValue placeholder="Select a service" /></SelectTrigger>
                      <SelectContent className="z-50 bg-background">{services.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label id="career-stage-label" className="mb-2 block text-[15px] font-semibold">Career Stage</label>
                    <Select value={formData.careerStage} onValueChange={(value) => setFormData((current) => ({ ...current, careerStage: value }))}>
                      <SelectTrigger className="h-12 text-base" aria-labelledby="career-stage-label"><SelectValue placeholder="Select career stage" /></SelectTrigger>
                      <SelectContent className="z-50 bg-background">{careerStages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><label htmlFor="targetRole" className="mb-2 block text-[15px] font-semibold">Target Role / Industry</label><Input id="targetRole" name="targetRole" value={formData.targetRole} onChange={handleChange} placeholder="Senior Accountant / Oil & Gas" className="h-12 text-base" /></div>
                </div>

                <div><label htmlFor="message" className="mb-2 block text-[15px] font-semibold">Message *</label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Briefly describe your current situation and what you need help with." rows={5} maxLength={1200} className="min-h-36 resize-y text-base" /></div>

                <Button type="submit" variant="cta" size="lg" className="min-h-12 w-full" disabled={isSubmitting}><Send className="h-5 w-5" />{isSubmitting ? "Opening WhatsApp…" : "Start My Career Enquiry"}</Button>
                <p className="text-center text-sm leading-6 text-muted-foreground">Submitting opens a WhatsApp draft. Review it and press <strong>Send</strong> in WhatsApp to complete your enquiry.</p>
              </form>
            </article>

            <article className="order-3 rounded-[22px] border border-border/80 bg-white p-6 shadow-[var(--shadow-card)] lg:col-start-1 lg:row-start-2">
              <h2 className="font-serif text-2xl font-semibold">Contact Details</h2>
              <div className="mt-5 space-y-4">
                <a href="mailto:info@brandmyprofile.com" className="flex min-w-0 items-start gap-3 rounded-2xl bg-[hsl(35_33%_97%)] p-4 hover:text-primary"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span className="min-w-0"><strong className="block text-[15px]">Email Us</strong><span className="mt-1 block break-all text-sm text-muted-foreground">info@brandmyprofile.com</span></span></a>
                <a href="tel:+96541103254" className="flex items-start gap-3 rounded-2xl bg-[hsl(35_33%_97%)] p-4 hover:text-primary"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span><strong className="block text-[15px]">Call Us</strong><span className="mt-1 block text-sm text-muted-foreground">+965 41103254</span></span></a>
              </div>
            </article>

            <article className="order-4 rounded-[22px] border border-border/80 bg-white p-6 shadow-[var(--shadow-card)] lg:col-start-1 lg:row-start-3">
              <div className="flex items-center gap-3"><Globe2 className="h-6 w-6 text-primary" /><h2 className="font-serif text-2xl font-semibold">Where We Support Clients</h2></div>
              <p className="mt-4 text-[15px] leading-6 text-muted-foreground">Online career services delivered through WhatsApp, phone and digital consultation.</p>
              <div className="mt-5 flex flex-wrap gap-2">{supportRegions.map((region) => <span key={region} className="rounded-full bg-[hsl(var(--surface-teal-soft))] px-3 py-2 text-sm font-semibold text-primary">{region}</span>)}</div>
            </article>

            <article className="order-5 rounded-[22px] border border-border/80 bg-white p-6 shadow-[var(--shadow-card)] lg:col-start-1 lg:row-start-4">
              <div className="flex items-center gap-3"><Clock3 className="h-6 w-6 text-primary" /><h2 className="font-serif text-2xl font-semibold">Response Hours</h2></div>
              <p className="mt-4 text-[15px] leading-6 text-muted-foreground">WhatsApp enquiries can be sent anytime. Replies are handled during support hours.</p>
              <p className="mt-3 text-sm font-semibold text-primary">Support timing can be confirmed when you enquire.</p>
            </article>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white py-14 sm:py-16">
          <div className="section-container">
            <div className="mb-9 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Quick paths</p><h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Not Sure Where to Start?</h2></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="flex min-h-56 flex-col rounded-[22px] bg-primary p-6 text-primary-foreground"><FileCheck2 className="h-7 w-7 text-accent" /><h3 className="mt-auto font-serif text-2xl font-semibold">Need a Better CV?</h3><button type="button" onClick={() => selectService("Standard Professional CV")} className="mt-5 inline-flex min-h-11 items-center gap-2 text-left text-sm font-bold text-white hover:underline">Get a Free CV Review <ArrowRight className="h-4 w-4" /></button></article>
              {!isLimitedFootprint && (
                <>
                  <article className="flex min-h-56 flex-col rounded-[22px] border border-border bg-[hsl(var(--surface-pink-soft))] p-6"><Linkedin className="h-7 w-7 text-accent" /><h3 className="mt-auto font-serif text-2xl font-semibold">Want to Improve LinkedIn?</h3><Link to={`/${selectedRegion.code}/services/linkedin-makeover`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline">LinkedIn Makeover <ArrowRight className="h-4 w-4" /></Link></article>
                  <article className="flex min-h-56 flex-col rounded-[22px] border border-border bg-[hsl(var(--surface-teal-soft))] p-6"><Compass className="h-7 w-7 text-primary" /><h3 className="mt-auto font-serif text-2xl font-semibold">Need Career Direction?</h3><Link to={`/${selectedRegion.code}/services/career-guidance`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline">Book Career Guidance <ArrowRight className="h-4 w-4" /></Link></article>
                </>
              )}
              <article className="flex min-h-56 flex-col rounded-[22px] border border-border bg-white p-6"><BriefcaseBusiness className="h-7 w-7 text-primary" /><h3 className="mt-auto font-serif text-2xl font-semibold">Targeting GCC Jobs?</h3><a href={buildWhatsAppUrl("Hello BrandMyProfile, I am targeting GCC jobs and would like to ask about GCC CV support. Please share the process and pricing.")} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary hover:underline">Ask About GCC CV Support <ArrowRight className="h-4 w-4" /></a></article>
            </div>
          </div>
        </section>

        <section className="bg-primary py-14 text-primary-foreground sm:py-16">
          <div className="section-container text-center">
            <Sparkles className="mx-auto mb-5 h-8 w-8 text-accent" />
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Not Sure Which Service You Need?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/75">Send us your current CV or tell us your career goal. We’ll help you choose the right option for your target market.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="cta" size="lg" asChild><a href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Chat on WhatsApp</a></Button>{!isLimitedFootprint && <Button size="lg" className="border border-white/35 bg-transparent text-white hover:bg-white hover:text-primary" asChild><Link to={schedulePath}>Book Free Consultation</Link></Button>}</div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
