import { list, parse } from "postcss";
import rawInquiryStyles from "./pages/InquiryPage.css?raw";
import rawQuoteStyles from "./pages/QuotePage.css?raw";

const fieldBoundaryRules: { readonly stylesheet: string; readonly selector: string }[] = [
  { stylesheet: rawQuoteStyles, selector: ".quote-input" },
  { stylesheet: rawQuoteStyles, selector: ".quote-field select" },
  { stylesheet: rawQuoteStyles, selector: ".quote-field textarea" },
  { stylesheet: rawInquiryStyles, selector: ".inquiry-field input" },
  { stylesheet: rawInquiryStyles, selector: ".inquiry-field textarea" },
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
  let foundRule = false;
  let border = "";
  // Inspect the explicit base boundaries, not focus/validation or media overrides.
  // This is a stylesheet guard for these rules, not a browser cascade evaluator.
  for (const rule of parse(stylesheet).nodes) {
    if (rule.type !== "rule" || !rule.selectors.some((member) => member.trim().replace(/\s+/g, " ") === selector)) {
      continue;
    }
    foundRule = true;
    for (const declaration of rule.nodes) {
      if (declaration.type === "decl" && declaration.prop.toLowerCase() === "border") {
        border = declaration.value;
      }
    }
  }
  if (!foundRule) {
    throw new Error(`Missing form field boundary rule ${selector} in the page stylesheet`);
  }
  const tokens = list.space(border.toLowerCase());
  const color = tokens.find((token) => /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/.test(token));
  const width = tokens.find((token) => /^(?:\d*\.)?\d+px$/.test(token));
  if (tokens.length !== 3 || !tokens.includes("solid") || !width || parseFloat(width) <= 0 || !color) {
    throw new Error(`Missing visible solid hex border on the form field boundary rule ${selector}`);
  }
  return color.length === 4 ? `#${[...color.slice(1)].map((channel) => channel + channel).join("")}` : color;
}

function assertFieldBoundaryContrast(stylesheet: string, selector: string): void {
  const contrast = contrastOnWhite(fieldBoundaryBorder(stylesheet, selector));
  if (contrast < 3) {
    throw new Error(`Field boundary ${selector} has ${contrast.toFixed(2)}:1 contrast on white; requires at least 3:1`);
  }
}

describe("page form field border contrast", () => {
  it("keeps quote and inquiry form field boundaries at WCAG AA non-text contrast on white", () => {
    for (const { stylesheet, selector } of fieldBoundaryRules) {
      assertFieldBoundaryContrast(stylesheet, selector);
    }
  });

  it("accepts equivalent whitespace, selector order and border token order", () => {
    const stylesheet = `
      /* Independent black boundaries have 21:1 contrast on white. */
      .inquiry-field   textarea,
      .quote-field\ttextarea , .quote-input,
      .inquiry-field input , .quote-field select
      {
        background: white;
        border :
          #000   solid
          2px ;
      }
    `;
    for (const { selector } of fieldBoundaryRules) {
      assertFieldBoundaryContrast(stylesheet, selector);
    }
  });

  it.each([
    [".quote-input input{border:1px solid #000}", ".quote-input"],
    [".quote-field select{border:1px solid #000}", ".quote-field textarea"],
    [".inquiry-field input{border:1px solid #000}", ".inquiry-field textarea"],
  ])("rejects a missing boundary rather than borrowing a neighbor: %s", (stylesheet, selector) => {
    expect(() => assertFieldBoundaryContrast(stylesheet, selector)).toThrow(`Missing form field boundary rule ${selector}`);
  });

  it.each(["background:white", "border:0px solid #000", "border:1px none #000"])(
    "rejects an absent or invisible border: %s",
    (declarations) => {
      expect(() => assertFieldBoundaryContrast(`.quote-input{${declarations}}`, ".quote-input"))
        .toThrow("Missing visible solid hex border on the form field boundary rule .quote-input");
    },
  );

  it.each([".quote-field select", ".quote-field textarea"])("rejects below-threshold contrast for %s in a selector list", (selector) => {
    // White against white is independently known to have 1:1 contrast.
    expect(() => assertFieldBoundaryContrast(
      ".quote-field textarea, .quote-field select { border: 1px solid #FFFFFF; }",
      selector,
    )).toThrow(`Field boundary ${selector} has 1.00:1 contrast on white; requires at least 3:1`);
  });
});
