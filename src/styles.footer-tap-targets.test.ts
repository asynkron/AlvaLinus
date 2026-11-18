import postcss from "postcss";
import tailwindcss from "tailwindcss";

import rawHome from "./pages/SiteHomePage.tsx?raw";

import tailwindConfig from "../tailwind.config";

const homeSource = rawHome.replace(/\r\n/g, "\n");

const footerNavLinkClassName =
  'className="inline-flex items-center py-2 text-background/70 transition-colors hover:text-primary-onDark"';
const footerEmailClassName =
  'className="mt-3 inline-flex items-center gap-2 py-2 text-background/70 transition-colors hover:text-primary-onDark"';
const footerNavListClassName = 'className="mt-3 grid gap-2"';
const footerGridClassName = "md:grid-cols-[1.4fr_1fr_1fr_1fr]";

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

describe("footer navigation and email tap targets", () => {
  it("blockifies every footer nav link and keeps the email link as an inline-flex target", () => {
    requireCount(homeSource, footerNavLinkClassName, 2, "the footer page and services nav link classNames");
    requireExactlyOnce(homeSource, footerEmailClassName, "the footer email link className");
  });

  it("keeps the footer identity, grid and list layout unchanged", () => {
    requireCount(homeSource, footerGridClassName, 1, "the md+ four-column footer grid");
    requireCount(homeSource, footerNavListClassName, 2, "the footer nav list classNames");
    requireExactlyOnce(
      homeSource,
      '<footer className="border-t border-background/10 bg-foreground text-background">',
      "the footer shell element and colors",
    );
    requireCount(
      homeSource,
      "text-background/70 transition-colors hover:text-primary-onDark",
      3,
      "the footer link and hover colors",
    );
  });

  it("reaches at least 36px of tap height for the unchanged text-sm footer links", async () => {
    const css = await compileUtilities("text-sm inline-flex items-center py-2");
    const targetHeight = remPx(css, "line-height") + 2 * remPx(css, "padding-top");

    expect(targetHeight).toBeGreaterThanOrEqual(36);
  });
});
