import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegion, regions } from "@/contexts/RegionContext";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppUrl, joinMessageLines } from "@/lib/whatsapp";
import { getStaticPageSeo } from "@/config/pageSeo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formats the combined datetime-local value into separate "Preferred Date" / "Preferred Time"
// lines. Falls back to the raw entered value (as a single line) if it can't be parsed.
function formatPreferredDateTimeLines(value: string): string[] {
  if (!value.trim()) return [];
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return [`Preferred Date/Time: ${value.trim()}`];
  }
  const date = parsed.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = parsed.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return [`Preferred Date: ${date}`, `Preferred Time: ${time}`];
}

export default function Schedule() {
  const { selectedRegion } = useRegion();
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: selectedRegion.code,
    message: "",
    preferredTime: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Unit 9.1: description now varies genuinely per region (Unit 9's audit found it
  // byte-identical across all 5 regions) - shared source with the static generator.
  const seo = getStaticPageSeo("schedule", selectedRegion.code);

  // Update form region when global region changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, region: selectedRegion.code }));
  }, [selectedRegion]);

  const validate = (): string | null => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!formData.email.trim() || !EMAIL_PATTERN.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!formData.region.trim()) return "Please select your region.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const validationError = validate();
    if (validationError) {
      toast({
        title: "Please check your details",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const regionName = regions.find((r) => r.code === formData.region)?.name || formData.region;

    const message = joinMessageLines([
      "Hello BrandMyProfile,",
      "",
      "I would like to request a career consultation.",
      "",
      "*Consultation Details*",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Region: ${regionName}`,
      ...formatPreferredDateTimeLines(formData.preferredTime),
      ...(formData.message.trim() ? ["", "Additional Information:", formData.message.trim()] : []),
      "",
      "Source: BrandMyProfile Consultation Form",
      `Page: ${location.pathname}`,
      "",
      "Please confirm the available consultation time and next steps.",
    ]);

    const opened = window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");

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
      title: "WhatsApp opened",
      description: "Please review the enquiry in WhatsApp and press Send to complete your request.",
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="schedule consultation, free career advice, career planning call, job search consultation"
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary/5 to-background">
          <div className="section-container text-center">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's Elevate Your Career
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book a free consultation with our career experts. We'll discuss your goals and create a personalized plan to help you succeed.
            </p>
          </div>
        </section>

        {/* Booking Form */}
        <section className="section-padding">
          <div className="section-container max-w-2xl">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Schedule Your Consultation</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.code} value={region.code}>
                          {region.flag} {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    type="datetime-local"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your career goals and what you'd like to discuss..."
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Opening WhatsApp..." : "Submit Booking Request"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center -mt-2">
                    After submitting, WhatsApp will open with your details. Please review the message and press Send.
                  </p>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <a
                      href="https://calendly.com/brandmyprofile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book via Calendly
                    </a>
                  </Button>
                </div>
              </form>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">30-Minute Call</h3>
                <p className="text-sm text-muted-foreground">
                  Free consultation to discuss your goals
                </p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Personalized Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Custom strategy tailored to your needs
                </p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">No Obligation</h3>
                <p className="text-sm text-muted-foreground">
                  Free advice with no commitment required
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
