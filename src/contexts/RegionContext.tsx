import { getRegionChoice } from "./regionChoice";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export interface Region {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export const regions: Region[] = [
  { code: "kuwait", name: "Kuwait", flag: "🇰🇼", currency: "KWD", currencySymbol: "KWD" },
  { code: "uae", name: "UAE", flag: "🇦🇪", currency: "AED", currencySymbol: "AED" },
  { code: "saudi", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", currencySymbol: "SAR" },
  { code: "qatar", name: "Qatar", flag: "🇶🇦", currency: "QAR", currencySymbol: "QAR" },
  { code: "india", name: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹" },
  { code: "bahrain", name: "Bahrain", flag: "🇧🇭", currency: "BHD", currencySymbol: "BHD" },
  { code: "oman", name: "Oman", flag: "🇴🇲", currency: "OMR", currencySymbol: "OMR" },
];

// ISO country code -> region mapping. Anything not listed here falls back to Kuwait.
const countryToRegion: Record<string, string> = {
  KW: "kuwait",
  AE: "uae",
  SA: "saudi",
  QA: "qatar",
  IN: "india",
  BH: "bahrain",
  OM: "oman",
};

const regionToCountry: Record<string, string> = Object.fromEntries(
  Object.entries(countryToRegion).map(([country, code]) => [code, country])
);

const GEO_FETCH_TIMEOUT_MS = 2500;

// Default region (Kuwait) - BrandMyProfile's primary market.
const defaultRegion = regions[0];

function findRegion(code: string | null | undefined): Region | null {
  if (!code) return null;
  return regions.find((r) => r.code === code) ?? null;
}

// Priority 1: explicit region in the URL (e.g. /kuwait, /uae/pricing) always wins.
function getRegionFromPath(pathname: string): Region | null {
  const firstSegment = pathname.split("/")[1]?.toLowerCase();
  return findRegion(firstSegment);
}

// Priority 2: the visitor's own earlier choice in the region selector (see regionChoice.ts).
// Malformed/unsupported values (old region codes, corrupted data, etc.) are ignored.
function getStoredRegion(): Region | null {
  return findRegion(getRegionChoice());
}

// Dev-only QA override: ?geo=KW / ?geo=AE / etc. Never active in production builds,
// never used for anything else (no canonical/nav impact) - purely a local testing aid.
function getDevGeoOverride(): Region | null {
  if (!import.meta.env.DEV) return null;
  const geoParam = new URLSearchParams(window.location.search).get("geo");
  if (!geoParam) return null;
  const regionCode = countryToRegion[geoParam.toUpperCase()];
  return findRegion(regionCode);
}

type RegionSource = "url" | "manual" | "storage" | "geo" | "default";

// Dev-only diagnostic so it's obvious during local QA why a given region was
// chosen, without ever logging anything IP-related. No-ops in production builds.
function logRegionResolution(region: Region, source: RegionSource): void {
  if (!import.meta.env.DEV) return;
  const country = regionToCountry[region.code] ?? "?";
  console.log(`Detected country: ${country}\nResolved region: ${region.code}\nSource: ${source}`);
}

interface InitialRegionResult {
  region: Region;
  needsGeoLookup: boolean;
  source: RegionSource;
}

// Synchronous resolution of Priorities 1 and 2 (plus the dev override), run once
// on mount. Only production visits to a region-less path (e.g. "/") fall through
// to needing an async geo lookup (Priority 3).
function computeInitialRegion(): InitialRegionResult {
  const urlRegion = getRegionFromPath(window.location.pathname);
  if (urlRegion) {
    // URL is explicit - it wins for this page view, but is not saved: following a link
    // to /uae must not override the visitor's own choice or location on later visits.
    return { region: urlRegion, needsGeoLookup: false, source: "url" };
  }

  const storedRegion = getStoredRegion();
  if (storedRegion) {
    return { region: storedRegion, needsGeoLookup: false, source: "storage" };
  }

  const devOverride = getDevGeoOverride();
  if (devOverride) {
    return { region: devOverride, needsGeoLookup: false, source: "geo" };
  }

  // No explicit URL region, no valid stored preference. In development we never
  // pretend a localhost IP lookup is meaningful - just default to Kuwait. Only
  // in production do we attempt a real (server-side) geo lookup.
  if (import.meta.env.DEV) {
    return { region: defaultRegion, needsGeoLookup: false, source: "default" };
  }

  return { region: defaultRegion, needsGeoLookup: true, source: "default" };
}

// Priority 3 (production only): ask our own /api/geo endpoint, which reads
// Vercel's request-geo headers server-side. Never touches navigator.geolocation,
// never requests permission, never handles/stores a raw IP - country code only.
async function resolveGeoRegion(): Promise<Region | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEO_FETCH_TIMEOUT_MS);
    const response = await fetch("/api/geo", { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    const country = typeof data?.country === "string" ? data.country.toUpperCase() : "";
    return findRegion(countryToRegion[country]);
  } catch {
    // Timed out, network error, malformed response, endpoint not deployed yet, etc.
    // Geo detection must never block or break the page - just fall back to Kuwait.
    return null;
  }
}

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  isDetecting: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const initialRef = useRef<InitialRegionResult | null>(null);
  if (!initialRef.current) {
    initialRef.current = computeInitialRegion();
  }
  const initial = initialRef.current;

  const [selectedRegion, setSelectedRegionState] = useState<Region>(initial.region);
  const [isDetecting, setIsDetecting] = useState(initial.needsGeoLookup);

  useEffect(() => {
    if (!initial.needsGeoLookup) {
      logRegionResolution(initial.region, initial.source);
      return;
    }

    let cancelled = false;
    resolveGeoRegion().then((detected) => {
      if (cancelled) return;
      const finalRegion = detected ?? defaultRegion;
      setSelectedRegionState(finalRegion);
      // Not persisted: the visitor's location is re-checked on each region-less visit.
      setIsDetecting(false);
      logRegionResolution(finalRegion, detected ? "geo" : "default");
    });

    return () => {
      cancelled = true;
    };
    // Intentionally run once: this only ever fires for the initial region-less
    // production visit that had no stored preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Syncs the context to the current URL. Remembering a choice is done separately by
  // useChangeRegion, so a visited URL is never saved as the visitor's preference.
  const handleSetRegion = (region: Region) => {
    setSelectedRegionState(region);
    logRegionResolution(region, "url");
  };

  return (
    <RegionContext.Provider value={{ selectedRegion, setSelectedRegion: handleSetRegion, isDetecting }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return context;
}
