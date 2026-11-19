import type { SiteQuoteDrainagePricing, SiteQuoteMail, SiteQuoteUppfartPricing } from "../types/site";

const moneyFormat = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 });
const numberFormat = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 2 });

export const vatStatusLabel = "Momsstatus ej bekräftad";

export function formatMoney(value: number): string {
  return moneyFormat.format(value);
}

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
}

export function buildQuoteMailto(mail: SiteQuoteMail, values: Record<string, string>): string {
  return `mailto:${mail.recipientEmail}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(fillTemplate(mail.bodyTemplate, values))}`;
}

export function drainageTotal(meters: number, pricing: SiteQuoteDrainagePricing): number {
  const firstTier = Math.min(meters, pricing.boundaryMeters);
  const aboveTier = Math.max(meters - pricing.boundaryMeters, 0);
  return firstTier * pricing.firstTierPerMeter + aboveTier * pricing.aboveBoundaryPerMeter + pricing.fixedCost;
}

export function drivewayTotal(area: number, includeAsphalt: boolean, pricing: SiteQuoteUppfartPricing): number {
  return area * pricing.perSquareMeter + (includeAsphalt ? area * pricing.asphaltPerSquareMeter : 0) + pricing.fixedCost;
}
