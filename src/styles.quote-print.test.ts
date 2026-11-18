import rawQuoteStyles from "./pages/QuotePage.css?raw";

function printBlockBody(stylesheet: string, occurrence: number): string {
  let start = -1;
  for (let found = 0; found <= occurrence; found += 1) {
    start = stylesheet.indexOf("@media print{", start + 1);
    if (start === -1) {
      throw new Error(`Missing @media print block ${occurrence + 1} in the shared quote stylesheet`);
    }
  }
  const bodyStart = start + "@media print{".length;
  let depth = 1;
  let cursor = bodyStart;
  while (depth > 0 && cursor < stylesheet.length) {
    const character = stylesheet[cursor];
    if (character === "{") {
      depth += 1;
    }
    if (character === "}") {
      depth -= 1;
    }
    cursor += 1;
  }
  return stylesheet.slice(bodyStart, cursor - 1);
}

function printRuleBody(block: string, selector: string): string {
  const ruleStart = block.indexOf(`${selector}{`);
  if (ruleStart === -1) {
    throw new Error(`Missing print rule ${selector} in the shared quote stylesheet`);
  }
  return block.slice(ruleStart + selector.length + 1, block.indexOf("}", ruleStart));
}

describe("quote page print hand-off", () => {
  it("hides the hero image and intro decoration from the printed page", () => {
    expect(printRuleBody(printBlockBody(rawQuoteStyles, 0), ".quote-hero-image,.quote-intro::before")).toBe(
      "display:none",
    );
  });

  it("hides the page chrome and every action control from the printed page", () => {
    const paperBlock = printBlockBody(rawQuoteStyles, 1);
    expect(
      printRuleBody(
        paperBlock,
        "header,footer,.quote-intro a,.quote-send,.quote-mail-help,.quote-print,.quote-reset,.quote-share,.quote-share-link,.quote-share-help,.quote-back-choice",
      ),
    ).toBe("display:none!important");
  });

  it("restyles the result column for paper", () => {
    const paperBlock = printBlockBody(rawQuoteStyles, 1);
    expect(printRuleBody(paperBlock, ".quote-layout")).toBe("display:block;padding:20px");
    expect(printRuleBody(paperBlock, ".quote-result")).toBe("position:static;box-shadow:none;break-inside:avoid");
    expect(paperBlock).toContain(".quote-result{padding:20px 0}");
  });
});
