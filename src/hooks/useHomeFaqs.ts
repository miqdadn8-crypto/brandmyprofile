import faqs from "@/lib/data/faqs.json";
import { useRegion } from "@/contexts/RegionContext";
import { useRegionPricing } from "@/hooks/useRegionPricing";
import { getFaqsForRegion, type FaqItem } from "@/lib/data/regionContent";
import { brandFaq, buildPriceFaq } from "@/lib/seo/brandFaqs";

// The homepage FAQ list, shared by the visible FAQ section and the FAQPage schema so the two
// never differ: the brand answer first, the live-price answer second, then the region FAQs.
export function useHomeFaqs(): FaqItem[] {
  const { selectedRegion } = useRegion();
  const { pricing } = useRegionPricing("cv-writing");
  const priceFaq = buildPriceFaq(selectedRegion.code, selectedRegion.name, pricing);
  return [brandFaq, ...(priceFaq ? [priceFaq] : []), ...getFaqsForRegion(selectedRegion.code, faqs)];
}
