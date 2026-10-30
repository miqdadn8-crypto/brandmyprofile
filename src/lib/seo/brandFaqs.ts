import brandFaqs from "@/lib/data/brandFaqs.json";
import type { FaqItem } from "@/lib/data/regionContent";
import type { PricingTier, ServicePricing } from "@/hooks/useRegionPricing";

// Answer-first FAQs for brand and price searches ("what is brandmyprofile", "how much does CV
// writing cost in Kuwait"). The wording lives in brandFaqs.json so the static pre-render
// (scripts/generate-static-pages.js) emits exactly the same text; prices always come from
// the region's pricing.json, never typed into the copy.
export const brandFaq: FaqItem = brandFaqs.brand;

const formatTier = ({ price, currency }: PricingTier) =>
  currency === "INR" ? `₹${price.toLocaleString("en-IN")}` : `${price} ${currency}`;

export function buildPriceFaq(regionCode: string, regionName: string, pricing: ServicePricing | null): FaqItem | null {
  const { basic, pro, elite } = pricing ?? {};
  if (!basic || !pro || !elite) return null;
  const place = regionCode === "uae" ? "the UAE" : regionName;
  const fill = (template: string) =>
    template
      .replace("{place}", place)
      .replace("{basic}", formatTier(basic))
      .replace("{pro}", formatTier(pro))
      .replace("{elite}", formatTier(elite));
  return { question: fill(brandFaqs.price.question), answer: fill(brandFaqs.price.answer) };
}
