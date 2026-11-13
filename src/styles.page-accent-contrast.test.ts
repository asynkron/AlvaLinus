import rawInquiryStyles from "./pages/InquiryPage.css?raw";
import rawQuoteStyles from "./pages/QuotePage.css?raw";
import rawStyles from "./styles.css?raw";

type HslToken = { readonly hue: number; readonly saturation: number; readonly lightness: number };

const stylesheet = rawStyles.replace(/\r\n/g, "\n");
const quoteStyles = rawQuoteStyles.replace(/\r\n/g, "\n");
const inquiryStyles = rawInquiryStyles.replace(/\r\n/g, "\n");

function parseRootToken(name: string): HslToken {
  const rootStart = stylesheet.indexOf(":root {");
  const rootEnd = stylesheet.indexOf("}", rootStart);
  const rootBlock = stylesheet.slice(rootStart, rootEnd);
  const match = rootBlock.match(new RegExp(`--${name}: (\\d+(?:\\.\\d+)?) (\\d+(?:\\.\\d+)?)% (\\d+(?:\\.\\d+)?)%;`));

  if (!match) {
    throw new Error(`Missing --${name} HSL token in the :root block of styles.css`);
  }

  return { hue: Number(match[1]), saturation: Number(match[2]) / 100, lightness: Number(match[3]) / 100 };
}

function relativeLuminance({ hue, saturation, lightness }: HslToken): number {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = hue / 60;
  const secondary = chroma * (1 - Math.abs((sector % 2) - 1));
  const offset = lightness - chroma / 2;
  const [red, green, blue] =
    sector < 1
      ? [chroma, secondary, 0]
      : sector < 2
        ? [secondary, chroma, 0]
        : sector < 3
          ? [0, chroma, secondary]
          : sector < 4
            ? [0, secondary, chroma]
            : sector < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];
  const channel = (value: number) => (value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4));

  return 0.2126 * channel(red + offset) + 0.7152 * channel(green + offset) + 0.0722 * channel(blue + offset);
}

function contrastRatio(a: HslToken, b: HslToken): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const [lighter, darker] = first >= second ? [first, second] : [second, first];

  return (lighter + 0.05) / (darker + 0.05);
}

function ruleBody(stylesheetText: string, selector: string): string {
  const ruleStart = stylesheetText.indexOf(`${selector}{`);
  if (ruleStart === -1) {
    throw new Error(`Missing ${selector} rule in the page stylesheet`);
  }
  return stylesheetText.slice(ruleStart + selector.length + 1, stylesheetText.indexOf("}", ruleStart));
}

function declaration(body: string, property: string, selector: string): string {
  const match = body.match(new RegExp(`(?:^|;)${property}:([^;]+)`));
  const value = match?.[1];
  if (value === undefined) {
    throw new Error(`Missing ${property} declaration on the ${selector} rule`);
  }
  return value.trim();
}

function accentToken(value: string, context: string): HslToken {
  const name = value.match(/^hsl\(var\(--([\w-]+)\)\)$/)?.[1];
  if (name === undefined) {
    throw new Error(`${context} must reference the --primary token family, found "${value}"`);
  }
  return parseRootToken(name);
}

function outlineAccentToken(rule: string, context: string): HslToken {
  const outline = declaration(rule, "outline", context);
  const color = outline.match(/^3px solid (hsl\(var\(--[\w-]+\)\))$/)?.[1];
  if (color === undefined) {
    throw new Error(`${context} must keep a 3px solid outline through a styles.css token reference, found "${outline}"`);
  }
  return accentToken(color, context);
}

const primary = parseRootToken("primary");
const primaryHover = parseRootToken("primary-hover");
const primaryForeground = parseRootToken("primary-foreground");
const background = parseRootToken("background");

const quoteSendBackground = accentToken(declaration(ruleBody(quoteStyles, ".quote-send"), "background", ".quote-send"), ".quote-send background");
const quoteSendColor = accentToken(declaration(ruleBody(quoteStyles, ".quote-send"), "color", ".quote-send"), ".quote-send color");
const quoteSendHover = accentToken(declaration(ruleBody(quoteStyles, ".quote-send:hover"), "background", ".quote-send:hover"), ".quote-send:hover background");
const choiceHover = accentToken(declaration(ruleBody(quoteStyles, ".choice-buttons a:hover"), "background", ".choice-buttons a:hover"), ".choice-buttons a:hover background");
const backChoiceColor = accentToken(declaration(ruleBody(quoteStyles, ".quote-back-choice"), "color", ".quote-back-choice"), ".quote-back-choice color");
const quoteInputAccent = accentToken(declaration(ruleBody(quoteStyles, ".quote-layout input"), "accent-color", ".quote-layout input"), ".quote-layout input accent-color");
const quoteInputCaret = accentToken(declaration(ruleBody(quoteStyles, ".quote-layout input"), "caret-color", ".quote-layout input"), ".quote-layout input caret-color");
const inquiryInputAccent = accentToken(declaration(ruleBody(inquiryStyles, ".inquiry-field input"), "accent-color", ".inquiry-field input"), ".inquiry-field input accent-color");
const inquiryInputCaret = accentToken(declaration(ruleBody(inquiryStyles, ".inquiry-field input"), "caret-color", ".inquiry-field input"), ".inquiry-field input caret-color");

const quoteFocusRule = ruleBody(quoteStyles, ".quote-layout :is(input,select,textarea,button,a,summary):focus-visible");
const inquiryFocusRule = ruleBody(inquiryStyles, ".inquiry-field input:focus-visible,.inquiry-field textarea:focus-visible,.inquiry-layout :is(button,a):focus-visible");
const inquiryAlertFocusRule = ruleBody(inquiryStyles, ".inquiry-alert:focus-visible");
const quoteSelectionRule = ruleBody(quoteStyles, ".quote-layout ::selection");

const quoteFocusAccent = outlineAccentToken(quoteFocusRule, ".quote-layout :focus-visible outline");
const inquiryFocusAccent = outlineAccentToken(inquiryFocusRule, ".inquiry focus-visible outline");
const inquiryAlertAccent = outlineAccentToken(inquiryAlertFocusRule, ".inquiry-alert :focus-visible outline");
const selectionBackground = accentToken(declaration(quoteSelectionRule, "background", ".quote-layout ::selection"), ".quote-layout ::selection background");
const selectionColor = accentToken(declaration(quoteSelectionRule, "color", ".quote-layout ::selection"), ".quote-layout ::selection color");

describe("page accent token consistency and contrast", () => {
  it("keeps the quote send CTA white label readable on its primary token surface at WCAG AA", () => {
    expect(contrastRatio(quoteSendColor, quoteSendBackground)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps white labels readable on the primary hover shade at WCAG AA", () => {
    expect(contrastRatio(primaryForeground, quoteSendHover)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(primaryForeground, choiceHover)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the back-choice accent link readable on the page background at WCAG AA", () => {
    expect(contrastRatio(backChoiceColor, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps every enumerated quote and inquiry accent role inside the orange brand hue family", () => {
    for (const token of [quoteSendBackground, quoteSendHover, choiceHover, backChoiceColor, quoteInputAccent, quoteInputCaret, inquiryInputAccent, inquiryInputCaret]) {
      expect(token.hue).toBeGreaterThanOrEqual(10);
      expect(token.hue).toBeLessThanOrEqual(25);
    }
  });

  it("keeps the primary and primary-hover tokens in the orange brand hue family", () => {
    for (const token of [primary, primaryHover]) {
      expect(token.hue).toBeGreaterThanOrEqual(10);
      expect(token.hue).toBeLessThanOrEqual(25);
    }
  });
});

describe("quote and inquiry focus and selection accent tokens", () => {
  it("keeps every focus-visible outline on a 3px solid token outline with a 3px offset", () => {
    for (const [accent, rule, label] of [
      [quoteFocusAccent, quoteFocusRule, ".quote-layout focus-visible rule"],
      [inquiryFocusAccent, inquiryFocusRule, ".inquiry-field/.inquiry-layout focus-visible rule"],
      [inquiryAlertAccent, inquiryAlertFocusRule, ".inquiry-alert focus-visible rule"],
    ] as const) {
      expect(declaration(rule, "outline-offset", label)).toBe("3px");
      expect(accent.hue, label).toBeGreaterThanOrEqual(10);
      expect(accent.hue, label).toBeLessThanOrEqual(25);
    }
  });

  it("keeps the quote selection pair an AA-readable declared token pairing", () => {
    expect(contrastRatio(selectionColor, selectionBackground)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the quote selection background in the orange brand hue family", () => {
    expect(selectionBackground.hue).toBeGreaterThanOrEqual(10);
    expect(selectionBackground.hue).toBeLessThanOrEqual(25);
  });
});
