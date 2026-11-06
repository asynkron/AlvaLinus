import type { SiteQuoteMail } from "../types/site";

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

export function drainageTotal(meters: number): number {
  const firstTier = Math.min(meters, 55);
  const aboveTier = Math.max(meters - 55, 0);
  return firstTier * 3500 + aboveTier * 3000 + 6900;
}

export function drivewayTotal(area: number, loads: number, includeAsphalt: boolean): number {
  return area * 950 + (includeAsphalt ? area * 667 : 0) + 4900 + loads * 2000;
}
