import postcss from "postcss";
import tailwindcss from "tailwindcss";

import rawHome from "./pages/SiteHomePage.tsx?raw";

import tailwindConfig from "../tailwind.config";

const homeSource = rawHome.replace(/\r\n/g, "\n");

const inventoryChipClassName =
  'className="inline-flex items-center rounded-full border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary"';
const inventoryChipListClassName = 'className="mt-4 flex flex-wrap gap-2"';

function requireExactlyOnce(haystack: string, needle: string, label: string): void {
  const first = haystack.indexOf(needle);

  if (first === -1) {
    throw new Error(`Missing ${label} in SiteHomePage.tsx`);
  }

  if (haystack.indexOf(needle, first + needle.length) !== -1) {
    throw new Error(`Expected exactly one ${label} in SiteHomePage.tsx`);
  }
}

function requireCount(haystack: string, needle: string, expected: number, label: string): void {
  const actual = haystack.split(needle).length - 1;

  expect(actual, label).toBe(expected);
}

async function compileUtilities(classCandidates: string): Promise<string> {
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: classCandidates, extension: "html" }],
    }),
  ]).process("@tailwind utilities;", { from: undefined });

  return result.css.replace(/\s+/g, " ").trim();
}

function remPx(css: string, declaration: string): number {
  const match = css.match(new RegExp(`${declaration}: ?([\\d.]+)rem`));

  if (!match) {
    throw new Error(`Missing a ${declaration} rem value in the compiled utilities`);
  }

  return Number(match[1]) * 16;
}

describe("inventory route chip tap targets", () => {
  it("blockifies the inventory route chips with vertical tap-target padding", () => {
    requireExactlyOnce(homeSource, inventoryChipClassName, "the inventory route chip className");
  });

  it("keeps the chip identity, chip list layout and NotFound pill container unchanged", () => {
    requireCount(homeSource, "rounded-full border bg-background", 1, "the chip shell element and colors");
    requireCount(homeSource, "px-3 py-2 text-sm text-foreground", 1, "the chip padding and foreground text");
    requireCount(homeSource, inventoryChipListClassName, 2, "the chip and NotFound pill flex-wrap lists");
  });

  it("reaches at least 36px of tap height for the unchanged text-sm chips", async () => {
    const css = await compileUtilities("text-sm inline-flex items-center py-2");
    const targetHeight = remPx(css, "line-height") + 2 * remPx(css, "padding-top");

    expect(targetHeight).toBeGreaterThanOrEqual(36);
  });
});
