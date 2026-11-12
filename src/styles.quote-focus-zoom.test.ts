import rawQuoteStyles from "./pages/QuotePage.css?raw";

const quoteTextEntryRules: readonly string[] = [
  ".quote-input input",
  ".quote-field select,.quote-field textarea",
];

function quoteRuleBody(stylesheet: string, selector: string): string {
  const ruleStart = stylesheet.indexOf(`${selector}{`);
  if (ruleStart === -1) {
    throw new Error(`Missing quote form control rule ${selector} in the shared quote stylesheet`);
  }
  return stylesheet.slice(ruleStart, stylesheet.indexOf("}", ruleStart));
}

describe("quote page iOS focus-zoom floor", () => {
  it("keeps quote form text-entry controls at a font size of at least 16px", () => {
    for (const selector of quoteTextEntryRules) {
      const ruleBody = quoteRuleBody(rawQuoteStyles, selector);
      const fontSize = ruleBody.match(/font-size:(\d+(?:\.\d+)?)px/)?.[1];
      if (fontSize === undefined) {
        throw new Error(`Missing an explicit px font-size on the quote form control rule ${selector}`);
      }
      expect(Number(fontSize), selector).toBeGreaterThanOrEqual(16);
    }
  });
});
