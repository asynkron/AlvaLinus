import rawHome from "./pages/SiteHomePage.tsx?raw";
import rawStyles from "./styles.css?raw";

import tailwindConfig from "../tailwind.config";

type HslToken = { readonly hue: number; readonly saturation: number; readonly lightness: number };
type GammaRgb = readonly [number, number, number];

const stylesheet = rawStyles.replace(/\r\n/g, "\n");
const homeSource = rawHome.replace(/\r\n/g, "\n");

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

function hslToGammaRgb({ hue, saturation, lightness }: HslToken): GammaRgb {
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

  return [red + offset, green + offset, blue + offset];
}

function gammaDecode(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb: GammaRgb): number {
  return 0.2126 * gammaDecode(rgb[0]) + 0.7152 * gammaDecode(rgb[1]) + 0.0722 * gammaDecode(rgb[2]);
}

function compositedOver(base: GammaRgb, overlay: GammaRgb, alpha: number): GammaRgb {
  return [
    alpha * overlay[0] + (1 - alpha) * base[0],
    alpha * overlay[1] + (1 - alpha) * base[1],
    alpha * overlay[2] + (1 - alpha) * base[2],
  ];
}

function contrastRatio(a: GammaRgb, b: GammaRgb): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const [lighter, darker] = first >= second ? [first, second] : [second, first];

  return (lighter + 0.05) / (darker + 0.05);
}

function flattenColors(colors: Record<string, unknown>, prefix = ""): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    const name = key === "DEFAULT" && prefix !== "" ? prefix : prefix === "" ? key : `${prefix}-${key}`;
    if (typeof value === "string") {
      flattened[name] = value;
    } else if (value !== null && typeof value === "object") {
      Object.assign(flattened, flattenColors(value as Record<string, unknown>, name));
    }
  }

  return flattened;
}

const tailwindColors = flattenColors(tailwindConfig.theme.extend.colors as Record<string, unknown>);

function resolveTextToken(colorName: string): { readonly token: HslToken; readonly alpha: number } {
  const slashIndex = colorName.indexOf("/");
  const baseName = slashIndex === -1 ? colorName : colorName.slice(0, slashIndex);
  const modifier = slashIndex === -1 ? undefined : colorName.slice(slashIndex + 1);
  const value = tailwindColors[baseName];

  if (value === undefined) {
    throw new Error(`The read-more color text-${baseName} has no color mapping in tailwind.config.ts`);
  }

  const tokenReference = value.match(/^hsl\(var\(--([a-z][a-z0-9-]*)\)(?:\s*\/\s*(\d+(?:\.\d+)?))?\)$/);
  const tokenName = tokenReference?.[1];

  if (tokenName === undefined) {
    throw new Error(`The read-more color text-${baseName} resolves to "${value}" instead of a styles.css token reference`);
  }

  const configAlpha = tokenReference?.[2];
  const alpha = modifier !== undefined ? Number(modifier) / 100 : configAlpha !== undefined ? Number(configAlpha) : 1;

  return { token: parseRootToken(tokenName), alpha };
}

function resolvedRgb(colorName: string, surface: GammaRgb): GammaRgb {
  const { token, alpha } = resolveTextToken(colorName);

  return alpha < 1 ? compositedOver(surface, hslToGammaRgb(token), alpha) : hslToGammaRgb(token);
}

function readMoreAnchorClassName(source: string): string {
  const marker = "section.readMoreAriaPrefix";
  const markerStart = source.indexOf(marker);

  if (markerStart === -1) {
    throw new Error("No read-more anchor (section.readMoreAriaPrefix) found in SiteHomePage.tsx");
  }

  if (source.indexOf(marker, markerStart + marker.length) !== -1) {
    throw new Error("Expected exactly one read-more anchor in SiteHomePage.tsx");
  }

  const anchorStart = source.lastIndexOf("<a", markerStart);
  const tagEnd = source.indexOf(">", markerStart);

  if (anchorStart === -1 || tagEnd === -1) {
    throw new Error("Could not delimit the read-more anchor opening tag in SiteHomePage.tsx");
  }

  const openingTag = source.slice(anchorStart, tagEnd + 1);
  const className = openingTag.match(/className="([^"]*)"/)?.[1];

  if (className === undefined) {
    throw new Error("The read-more anchor opening tag has no static className attribute in SiteHomePage.tsx");
  }

  return className;
}

function hoverColorName(className: string): string {
  const utilities = className.split(/\s+/).filter((utility) => utility.startsWith("hover:text-"));
  const utility = utilities[0];

  if (utilities.length !== 1 || utility === undefined) {
    throw new Error(`Expected exactly one hover:text-* utility on the read-more anchor, found "${className}"`);
  }

  return utility.slice("hover:text-".length);
}

function restingColorName(className: string): string {
  const utilities = className
    .split(/\s+/)
    .filter((utility) => /^text-/.test(utility))
    .map((utility) => utility.slice("text-".length))
    .filter((name) => tailwindColors[name] !== undefined);
  const utility = utilities[0];

  if (utilities.length !== 1 || utility === undefined) {
    throw new Error(`Expected exactly one resting text color utility on the read-more anchor, found "${className}"`);
  }

  return utility;
}

const cardRgb = hslToGammaRgb(parseRootToken("card"));

describe("home services read-more hover contrast", () => {
  it("keeps the read-more hover pairing an AA-readable styles.css token color on the white card", () => {
    const hoverRgb = resolvedRgb(hoverColorName(readMoreAnchorClassName(homeSource)), cardRgb);

    expect(contrastRatio(hoverRgb, cardRgb)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the hovered read-more color visibly darker than its resting color", () => {
    const className = readMoreAnchorClassName(homeSource);
    const hoverRgb = resolvedRgb(hoverColorName(className), cardRgb);
    const restingRgb = resolvedRgb(restingColorName(className), cardRgb);

    expect(relativeLuminance(hoverRgb)).toBeLessThan(relativeLuminance(restingRgb));
  });
});
