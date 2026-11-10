import rawInquiryStyles from "./pages/InquiryPage.css?raw";
import rawQuoteStyles from "./pages/QuotePage.css?raw";

const fieldBoundaryRules: { readonly stylesheet: string; readonly selector: string }[] = [
  { stylesheet: rawQuoteStyles, selector: ".quote-input" },
  { stylesheet: rawQuoteStyles, selector: ".quote-field select,.quote-field textarea" },
  { stylesheet: rawInquiryStyles, selector: ".inquiry-field input,.inquiry-field textarea" },
];

function hexChannel(hex: string, index: number): number {
  const channel = parseInt(hex.slice(index * 2 + 1, index * 2 + 3), 16) / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function contrastOnWhite(hex: string): number {
  const luminance = 0.2126 * hexChannel(hex, 0) + 0.7152 * hexChannel(hex, 1) + 0.0722 * hexChannel(hex, 2);
  return (1 + 0.05) / (luminance + 0.05);
}

function fieldBoundaryBorder(stylesheet: string, selector: string): string {
  const ruleStart = stylesheet.indexOf(`${selector}{`);
  if (ruleStart === -1) {
    throw new Error(`Missing form field boundary rule ${selector} in the page stylesheet`);
  }
  const ruleBody = stylesheet.slice(ruleStart, stylesheet.indexOf("}", ruleStart));
  const border = ruleBody.match(/border:1px solid (#(?:[0-9a-f]{6}))/)?.[1];
  if (!border) {
    throw new Error(`Missing 1px solid hex border color on the form field boundary rule ${selector}`);
  }
  return border;
}

describe("page form field border contrast", () => {
  it("keeps quote and inquiry form field boundaries at WCAG AA non-text contrast on white", () => {
    expect(fieldBoundaryRules).toHaveLength(3);
    for (const { stylesheet, selector } of fieldBoundaryRules) {
      expect(contrastOnWhite(fieldBoundaryBorder(stylesheet, selector)), selector).toBeGreaterThanOrEqual(3);
    }
  });
});
