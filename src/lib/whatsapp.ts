// Confirmed business WhatsApp number (Kuwait), used across all business-owned WhatsApp CTAs.
export const BUSINESS_WHATSAPP_NUMBER = "96541103254";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Joins message lines, dropping any line that is null/undefined (used to omit
// optional fields cleanly). Pass an empty string "" to keep an intentional blank line.
export function joinMessageLines(lines: Array<string | null | undefined>): string {
  return lines.filter((line): line is string => line !== null && line !== undefined).join("\n");
}

export function buildPackageEnquiryMessage(params: {
  packageName: string;
  serviceName: string;
  regionName: string;
  price?: string;
}): string {
  const { packageName, serviceName, regionName, price } = params;
  const priceClause = price ? `, listed at ${price}` : "";
  return `Hello BrandMyProfile, I'm interested in the ${packageName} package for ${serviceName} in ${regionName}${priceClause}. Please share the next steps.`;
}
