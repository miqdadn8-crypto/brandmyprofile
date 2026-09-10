import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";
import { Button } from "@/components/ui/button";

export default function RegionBanner() {
  const { selectedRegion } = useRegion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("region-banner-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("region-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-primary/95 px-4 py-1.5 pr-9 text-white">
      <div className="section-container flex min-h-[18px] flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-[13px]">
        <span>
          Prices shown for {selectedRegion.name}.
        </span>

        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-[13px] font-medium text-white underline focus-visible:ring-white"
          onClick={() => {
            Array.from(document.querySelectorAll<HTMLButtonElement>('[data-region-selector]')).find((selector) => selector.offsetParent !== null)?.click();
          }}
        >
          Change region
        </Button>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-white/10 rounded p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
