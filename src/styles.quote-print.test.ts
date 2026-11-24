import { parse } from "postcss";
import rawQuoteStyles from "./pages/QuotePage.css?raw";

// Checks explicit print declarations, not browser cascade or rendered paper.
function printValue(styles: string, selector: string, property: string): string | undefined {
  let value: string | undefined;
  parse(styles).walkAtRules("media", media => {
    if (media.params.trim() !== "print") return;
    media.walkRules(rule => {
      if (!rule.selectors.includes(selector)) return;
      rule.walkDecls(property, declaration => { value = declaration.value; });
    });
  });
  return value;
}

describe("quote page print hand-off", () => {
  it("hides the hero image and intro decoration from the printed page", () => {
    for (const selector of [".quote-hero-image", ".quote-intro::before"]) {
      expect(printValue(rawQuoteStyles, selector, "display")).toBe("none");
    }
  });

  it("hides the page chrome and every action control from the printed page", () => {
    for (const selector of ["header", "footer", ".quote-intro a", ".quote-send", ".quote-mail-help", ".quote-print", ".quote-reset", ".quote-share", ".quote-share-link", ".quote-share-help", ".quote-back-choice", ".quote-draft-controls"]) {
      expect(printValue(rawQuoteStyles, selector, "display")).toBe("none");
    }
  });

  it("restyles the result column for paper", () => {
    expect(printValue(rawQuoteStyles, ".quote-layout", "display")).toBe("block");
    expect(printValue(rawQuoteStyles, ".quote-result", "position")).toBe("static");
    expect(printValue(rawQuoteStyles, ".quote-result", "box-shadow")).toBe("none");
    expect(printValue(rawQuoteStyles, ".quote-result", "break-inside")).toBe("avoid");
  });

  it("matches each print selector independently of grouping and formatting", () => {
    expect(printValue("@media print { .other, .target { display: none !important; } }", ".target", "display")).toBe("none");
    expect(printValue("@media print { .other { display: none; } }", ".target", "display")).toBeUndefined();
    expect(printValue("@media screen { .target { display: none; } }", ".target", "display")).toBeUndefined();
    expect(printValue("@media print { .target { display: block; } }", ".target", "display")).toBe("block");
  });
});
