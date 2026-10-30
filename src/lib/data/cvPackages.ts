// The three CV packages as shown everywhere (Pricing page, homepage). Prices come from
// src/lib/data/{region}/pricing.json under "cv-writing" by tierKey; inclusions live on the
// Pricing page only, so this list never repeats them.
export interface CvPackage {
  tierKey: "basic" | "pro" | "elite";
  name: string;
  bestFor: string;
  isFeatured: boolean;
}

export const CV_PACKAGES: CvPackage[] = [
  { tierKey: "basic", name: "Essential", bestFor: "Fresh graduates or professionals who need a strong CV foundation", isFeatured: false },
  { tierKey: "pro", name: "Professional", bestFor: "Active job seekers who want stronger CV + LinkedIn positioning", isFeatured: true },
  { tierKey: "elite", name: "Executive", bestFor: "Managers and senior professionals targeting higher-level roles", isFeatured: false },
];
