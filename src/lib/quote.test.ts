import { siteContent } from "../data/siteContent";
import type { SiteQuoteDrainagePricing, SiteQuoteMail } from "../types/site";
import {
  buildQuoteMailto,
  drainageTotal,
  drivewayTotal,
  fillTemplate,
  formatMoney,
  formatNumber,
} from "./quote";

const drainagePricing: SiteQuoteDrainagePricing = siteContent.quote.drainage.pricing;

const svNonBreakingSpace = /[\u00a0\u202f]/g;

function plainSpaces(value: string): string {
  return value.replace(svNonBreakingSpace, " ");
}

describe("quote lib money logic", () => {
  describe("drainageTotal", () => {
    it("bills meters up to the declared boundary at the declared first-tier price plus the declared fixed cost", () => {
      expect(drainageTotal(drainagePricing.boundaryMeters - 15, drainagePricing)).toBe(
        (drainagePricing.boundaryMeters - 15) * drainagePricing.firstTierPerMeter + drainagePricing.fixedCost,
      );
      expect(drainageTotal(drainagePricing.boundaryMeters, drainagePricing)).toBe(
        drainagePricing.boundaryMeters * drainagePricing.firstTierPerMeter + drainagePricing.fixedCost,
      );
    });

    it("bills only meters above the declared boundary at the declared above-boundary price", () => {
      expect(drainageTotal(drainagePricing.boundaryMeters + 1, drainagePricing)).toBe(
        drainagePricing.boundaryMeters * drainagePricing.firstTierPerMeter + 1 * drainagePricing.aboveBoundaryPerMeter + drainagePricing.fixedCost,
      );
      expect(drainageTotal(drainagePricing.boundaryMeters + 45, drainagePricing)).toBe(
        drainagePricing.boundaryMeters * drainagePricing.firstTierPerMeter + 45 * drainagePricing.aboveBoundaryPerMeter + drainagePricing.fixedCost,
      );
      expect(drainageTotal(drainagePricing.boundaryMeters + 0.5, drainagePricing)).toBe(
        drainagePricing.boundaryMeters * drainagePricing.firstTierPerMeter + 0.5 * drainagePricing.aboveBoundaryPerMeter + drainagePricing.fixedCost,
      );
    });

    it("keeps the declared fixed cost at zero meters", () => {
      expect(drainageTotal(0, drainagePricing)).toBe(drainagePricing.fixedCost);
    });

    it("accepts fractional meters like the page input allows", () => {
      expect(drainageTotal(drainagePricing.boundaryMeters - 42.5, drainagePricing)).toBe(
        (drainagePricing.boundaryMeters - 42.5) * drainagePricing.firstTierPerMeter + drainagePricing.fixedCost,
      );
    });
  });

  it("uses the supplied driveway area, asphalt and fixed prices", () => {
    const pricing = { perSquareMeter: 10, asphaltPerSquareMeter: 3, fixedCost: 7 };
    expect(drivewayTotal(2.5, false, pricing)).toBe(32);
    expect(drivewayTotal(2.5, true, pricing)).toBe(39.5);
  });

  describe("sv-SE formatting", () => {
    it("formats money in kronor with non-breaking grouping and a decimal comma", () => {
      expect(formatMoney(199200)).toMatch(/^199[\u00a0\u202f]200[\u00a0\u202f]kr$/);
      expect(plainSpaces(formatMoney(199200))).toBe("199 200 kr");
      expect(plainSpaces(formatMoney(50650.5))).toBe("50 650,5 kr");
      expect(plainSpaces(formatMoney(101900.25))).toBe("101 900,25 kr");
      expect(plainSpaces(formatMoney(0))).toBe("0 kr");
    });

    it("formats numbers with grouping and a decimal comma without a currency unit", () => {
      expect(plainSpaces(formatNumber(40))).toBe("40");
      expect(plainSpaces(formatNumber(55.5))).toBe("55,5");
      expect(plainSpaces(formatNumber(1234.25))).toBe("1 234,25");
    });
  });

  describe("fillTemplate", () => {
    it("replaces every known {key} placeholder with its value", () => {
      expect(fillTemplate("Längd: {length} m ({length})", { length: "55" })).toBe("Längd: 55 m (55)");
      expect(fillTemplate("Total {total}, {length} m", { total: "199 200 kr", length: "55" })).toBe("Total 199 200 kr, 55 m");
    });

    it("keeps unknown placeholders untouched", () => {
      expect(fillTemplate("{known} och {unknown}", { known: "55" })).toBe("55 och {unknown}");
      expect(fillTemplate("inga platshållare", {})).toBe("inga platshållare");
    });
  });

  describe("buildQuoteMailto", () => {
    const mail: SiteQuoteMail = {
      recipientEmail: "info@example.se",
      subject: "Offertförfrågan",
      bodyTemplate: "Längd: {length} m\nTotal: {total}\n{vat}\n\n{notes}",
    };

    it("percent-encodes the subject and the filled body in a mailto URL", () => {
      expect(buildQuoteMailto(mail, { length: "55", total: "199 200 kr", vat: "inkl. moms", notes: "" })).toBe(
        `mailto:info@example.se?subject=${encodeURIComponent("Offertförfrågan")}&body=${encodeURIComponent("Längd: 55 m\nTotal: 199 200 kr\ninkl. moms\n\n")}`,
      );
    });

    it("keeps unknown placeholders and encodes their braces in the body", () => {
      const href = buildQuoteMailto(mail, { length: "40" });

      expect(href).toContain(encodeURIComponent("40 m"));
      expect(href).not.toContain(encodeURIComponent("{length}"));
      expect(href).toContain(encodeURIComponent("{total}"));
    });
  });
});
