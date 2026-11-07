import type { SiteQuoteMail } from "../types/site";
import {
  buildQuoteMailto,
  drainageTotal,
  drivewayTotal,
  fillTemplate,
  formatMoney,
  formatNumber,
  vatStatusLabel,
} from "./quote";

const svNonBreakingSpace = /[\u00a0\u202f]/g;

function plainSpaces(value: string): string {
  return value.replace(svNonBreakingSpace, " ");
}

describe("quote lib money logic", () => {
  describe("drainageTotal", () => {
    it("bills the first 55 meters at 3 500 kr per meter plus the fixed cost", () => {
      expect(drainageTotal(40)).toBe(40 * 3500 + 6900);
      expect(drainageTotal(55)).toBe(55 * 3500 + 6900);
    });

    it("bills only meters above the 55 meter boundary at 3 000 kr per meter", () => {
      expect(drainageTotal(56)).toBe(55 * 3500 + 1 * 3000 + 6900);
      expect(drainageTotal(100)).toBe(55 * 3500 + 45 * 3000 + 6900);
      expect(drainageTotal(55.5)).toBe(55 * 3500 + 0.5 * 3000 + 6900);
    });

    it("keeps the 6 900 kr fixed cost at zero meters", () => {
      expect(drainageTotal(0)).toBe(6900);
    });

    it("accepts fractional meters like the page input allows", () => {
      expect(drainageTotal(12.5)).toBe(12.5 * 3500 + 6900);
    });
  });

  describe("drivewayTotal", () => {
    it("charges the area at 950 kr per square meter plus fixed and load costs without asphalt", () => {
      expect(drivewayTotal(75, 0, false)).toBe(75 * 950 + 4900);
      expect(drivewayTotal(100, 1, false)).toBe(100 * 950 + 4900 + 2000);
    });

    it("adds 667 kr per square meter when asphalt is included", () => {
      expect(drivewayTotal(100, 1, true)).toBe(100 * 950 + 100 * 667 + 4900 + 2000);
      expect(drivewayTotal(75, 0, true) - drivewayTotal(75, 0, false)).toBe(75 * 667);
    });

    it("adds 2 000 kr per load", () => {
      expect(drivewayTotal(75, 3, false)).toBe(75 * 950 + 4900 + 3 * 2000);
      expect(drivewayTotal(75, 4, false) - drivewayTotal(75, 3, false)).toBe(2000);
    });
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

  it("exports the exact VAT status label constant", () => {
    expect(vatStatusLabel).toBe("Momsstatus ej bekräftad");
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
      expect(buildQuoteMailto(mail, { length: "55", total: "199 200 kr", vat: "momsstatus ej bekräftad", notes: "" })).toBe(
        `mailto:info@example.se?subject=${encodeURIComponent("Offertförfrågan")}&body=${encodeURIComponent("Längd: 55 m\nTotal: 199 200 kr\nmomsstatus ej bekräftad\n\n")}`,
      );
    });

    it("keeps unknown placeholders and encodes their braces in the body", () => {
      const href = buildQuoteMailto(mail, { length: "40" });

      expect(href).toContain(encodeURIComponent("{length} m"));
      expect(href).toContain(encodeURIComponent("{total}"));
    });
  });
});
