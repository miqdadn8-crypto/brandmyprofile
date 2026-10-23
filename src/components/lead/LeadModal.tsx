import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Linkedin, Loader2, MessageCircle, Paperclip, ScanSearch, Target, Globe2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegion } from "@/contexts/RegionContext";
import { getPageContext, trackEvent } from "@/lib/analytics";
import { suppressLeadPopup } from "@/lib/leadPopupSession";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { submitLead } from "@/services/leadService";
import {
  CV_MAX_BYTES,
  LEAD_COUNTRIES,
  LEAD_SERVICES,
  validateFile,
  validateLead,
  type LeadService,
  type LeadTrigger,
} from "@/lib/leadValidation";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<LeadService, typeof FileText> = {
  "Professional CV Writing": FileText,
  "ATS CV": ScanSearch,
  "GCC CV": Globe2,
  "LinkedIn Profile": Linkedin,
  "Career Guidance": Target,
};

const fieldClass =
  "flex h-12 w-full rounded-xl border border-input bg-background px-3 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

interface LeadModalProps {
  open: boolean;
  trigger: LeadTrigger;
  initialService?: LeadService;
  onOpenChange: (open: boolean) => void;
  onRestoreFocus: () => void;
}

export default function LeadModal({ open, trigger, initialService, onOpenChange, onRestoreFocus }: LeadModalProps) {
  const { selectedRegion } = useRegion();
  const defaultCountry = (LEAD_COUNTRIES as readonly string[]).includes(selectedRegion.name) ? selectedRegion.name : "Other";

  const [step, setStep] = useState<1 | 2 | 3>(initialService ? 2 : 1);
  const [service, setService] = useState<string>(initialService ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCountry, setTargetCountry] = useState(defaultCountry);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState("");
  const formShownAt = useRef(Date.now());

  useEffect(() => {
    if (step === 2) formShownAt.current = Date.now();
  }, [step]);

  const pageContext = () => ({ ...getPageContext(window.location.pathname), region: selectedRegion.code });

  const chooseService = (value: LeadService) => {
    setService(value);
    setStep(2);
    trackEvent("lead_popup_step_complete", { ...pageContext(), service: value, lead_trigger: trigger });
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      return;
    }
    const problem = validateFile(file);
    if (problem) {
      setError(problem);
      setCvFile(null);
      event.target.value = "";
      return;
    }
    setError(null);
    setCvFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const problem = validateLead({ name, email, whatsapp, targetRole, targetCountry, service });
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setSubmitting(true);
    trackEvent("lead_submit", { ...pageContext(), service, lead_trigger: trigger });
    const result = await submitLead({
      name, email, whatsapp, targetRole, targetCountry, service,
      trigger, region: selectedRegion.code, cvFile, honeypot, formShownAt: formShownAt.current,
    });
    setSubmitting(false);
    if (result.ok) {
      suppressLeadPopup();
      setLeadId((result as { leadId: string }).leadId);
      setStep(3);
      trackEvent("lead_submit_success", { ...pageContext(), service, lead_trigger: trigger });
    } else {
      setError((result as { message: string }).message);
      trackEvent("lead_submit_error", { ...pageContext(), service, lead_trigger: trigger });
    }
  };

  // The WhatsApp message never includes anything the visitor typed into the form.
  const whatsappHref = buildWhatsAppUrl(
    step === 3 && leadId
      ? `Hello BrandMyProfile, I just sent a free CV review request (reference ${leadId}).`
      : `Hello BrandMyProfile, I'd like a free CV review${service ? ` for ${service}` : ""}. Please let me know how to send my CV.`,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => { event.preventDefault(); onRestoreFocus(); }}
        className={cn(
          "fixed bottom-0 left-0 top-auto max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-t-3xl border-0 bg-white p-5 pb-8 sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-h-[90vh] sm:max-w-[520px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8",
        )}
      >
        {step !== 3 && (
          <div className="mb-5 flex items-center gap-2" aria-hidden="true">
            <span className="h-1.5 w-8 rounded-full bg-primary" />
            <span className={cn("h-1.5 w-8 rounded-full", step === 2 ? "bg-primary" : "bg-primary/20")} />
            <span className="ml-1 text-xs font-semibold text-muted-foreground">Step {step} of 2</span>
          </div>
        )}

        {step === 1 && (
          <>
            <DialogTitle className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">What would you like help with?</DialogTitle>
            <DialogDescription className="mt-2 text-base text-muted-foreground">
              Choose one to start your free CV review request.
            </DialogDescription>
            <div className="mt-5 grid gap-2.5">
              {LEAD_SERVICES.map((item) => {
                const Icon = SERVICE_ICONS[item];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => chooseService(item)}
                    className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-background px-4 text-left text-base font-semibold transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="flex-1">{item}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogTitle className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">Request Your Free CV Review</DialogTitle>
            <DialogDescription className="mt-2 text-base text-muted-foreground">
              Service: <strong className="text-foreground">{service}</strong>. We review structure, clarity, ATS readability and positioning. This is not a full rewrite.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="lead-name">Name *</Label>
                <Input id="lead-name" name="name" autoComplete="name" className="h-12 rounded-xl text-base" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-whatsapp">WhatsApp number *</Label>
                <Input id="lead-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="+965 5000 0000" className="h-12 rounded-xl text-base" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Email (optional)</Label>
                <Input id="lead-email" name="email" type="email" autoComplete="email" className="h-12 rounded-xl text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-role">Target role *</Label>
                <Input id="lead-role" name="targetRole" placeholder="e.g. Project Engineer" className="h-12 rounded-xl text-base" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-country">Target country *</Label>
                <select id="lead-country" name="targetCountry" className={fieldClass} value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)}>
                  {LEAD_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-cv">CV upload (optional)</Label>
                <label htmlFor="lead-cv" className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary">
                  <Paperclip className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{cvFile ? cvFile.name : `PDF, DOC or DOCX, up to ${CV_MAX_BYTES / 1024 / 1024} MB`}</span>
                </label>
                <input id="lead-cv" name="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="sr-only" />
              </div>

              {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="lead-company-website">Company website</label>
                <input id="lead-company-website" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <p>{error}</p>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-semibold underline">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Continue on WhatsApp
                  </a>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                {!initialService && (
                  <Button type="button" variant="ghost" onClick={() => { setStep(1); setError(null); }} className="sm:w-auto">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </Button>
                )}
                <Button type="submit" variant="cta" size="lg" disabled={submitting} className="min-h-12 flex-1">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending...</> : "Request My Free CV Review"}
                </Button>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                By submitting, you agree that BrandMyProfile may use the information you provide to respond to your enquiry.{" "}
                <Link to="/privacy" onClick={() => onOpenChange(false)} className="font-semibold text-primary underline">Privacy Policy</Link>
              </p>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
            <DialogTitle className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">Request received</DialogTitle>
            <DialogDescription className="mt-3 text-base leading-7 text-muted-foreground">
              Thank you. We&apos;ve received your enquiry. Our team will contact you.
            </DialogDescription>
            <p className="mt-2 text-xs text-muted-foreground">Reference: {leadId}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button asChild variant="cta">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Continue on WhatsApp</a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
