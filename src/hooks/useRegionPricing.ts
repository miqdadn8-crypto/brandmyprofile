import { useState, useEffect } from "react";
import { useRegion } from "@/contexts/RegionContext";

export interface PricingTier {
  price: number;
  currency: string;
}

export interface ServicePricing {
  [key: string]: PricingTier;
}

export function useRegionPricing(serviceId: string) {
  const { selectedRegion } = useRegion();
  const [pricing, setPricing] = useState<ServicePricing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      setIsLoading(true);
      try {
        // Load this region's own pricing only. A region with no real approved pricing
        // file (e.g. Bahrain/Oman) gets `pricing: null` rather than silently falling
        // back to Kuwait's numbers mislabeled under the wrong region/currency - callers
        // already handle null via formatPrice()'s "Price not available" and the
        // `pricing`-truthiness checks in components like CVWriting.tsx.
        const pricingData = await import(`@/lib/data/${selectedRegion.code}/pricing.json`);
        setPricing(pricingData.default[serviceId]);
      } catch {
        setPricing(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPricing();
  }, [selectedRegion.code, serviceId]);

  const formatPrice = (tier: string) => {
    if (!pricing || !pricing[tier]) return "Price not available";
    const { price, currency } = pricing[tier];
    
    // Format based on currency
    if (currency === "INR") {
      return `₹${price.toLocaleString()}`;
    }
    return `${price} ${currency}`;
  };

  return {
    pricing,
    isLoading,
    formatPrice,
    currencySymbol: selectedRegion.currencySymbol,
  };
}
