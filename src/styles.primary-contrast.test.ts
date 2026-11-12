import rawStyles from "./styles.css?raw";

type HslToken = { readonly hue: number; readonly saturation: number; readonly lightness: number };

const stylesheet = rawStyles.replace(/\r\n/g, "\n");

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

const primary = parseRootToken("primary");
const primaryForeground = parseRootToken("primary-foreground");
const primaryOnDark = parseRootToken("primary-on-dark");
const primaryHover = parseRootToken("primary-hover");
const card = parseRootToken("card");
const foreground = parseRootToken("foreground");

describe("styles.css primary accent contrast", () => {
  it("keeps the primary accent readable on white card surfaces at WCAG AA", () => {
    expect(contrastRatio(primary, card)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the primary hover shade readable on white card surfaces at WCAG AA", () => {
    expect(contrastRatio(primaryHover, card)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps white primary-foreground labels readable on primary buttons at WCAG AA", () => {
    expect(contrastRatio(primaryForeground, primary)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the on-dark accent readable on the navy header, hero, and footer surfaces at WCAG AA", () => {
    expect(contrastRatio(primaryOnDark, foreground)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps both accent tokens in the orange brand hue family", () => {
    for (const token of [primary, primaryOnDark]) {
      expect(token.hue).toBeGreaterThanOrEqual(10);
      expect(token.hue).toBeLessThanOrEqual(25);
    }
  });
});
