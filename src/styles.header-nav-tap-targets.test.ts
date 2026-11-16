import postcss from "postcss";
import tailwindcss from "tailwindcss";

import rawHome from "./pages/SiteHomePage.tsx?raw";

import tailwindConfig from "../tailwind.config";

const homeSource = rawHome.replace(/\r\n/g, "\n");

const desktopNavClassName = 'className="hidden items-center gap-6 text-sm font-medium md:flex"';
const desktopNavLinkClassName =
  'isActive ? "py-2 text-primary-onDark" : "py-2 text-background/75 transition-colors hover:text-primary-onDark"';
const desktopTriggerClassName = "inline-flex items-center gap-1 py-2";
const mobilePageLinkClassName = "block rounded-md px-3 py-3 text-base font-medium transition-colors";
const mobileSubLinkClassName = "block rounded-md px-3 py-2 text-sm transition-colors";
const mobileCalcSummaryClassName = "flex w-full items-center gap-1 rounded-md px-3 py-3 text-base font-medium";
const mobileToggleClassName = "inline-flex h-10 w-10 items-center justify-center rounded-md";

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

describe("desktop header navigation tap targets", () => {
  it("adds vertical tap-target padding to every md+ header nav target", () => {
    requireExactlyOnce(homeSource, desktopNavClassName, "the md+ desktop nav element");
    requireExactlyOnce(homeSource, desktopNavLinkClassName, "the desktop nav link className");
    requireCount(homeSource, desktopTriggerClassName, 2, "the desktop dropdown trigger classNames");
  });

  it("keeps the mobile menu targets and the sticky header row unchanged", () => {
    requireExactlyOnce(homeSource, mobilePageLinkClassName, "the mobile page link className");
    requireCount(homeSource, mobileSubLinkClassName, 2, "the mobile sub-link classNames");
    requireExactlyOnce(homeSource, mobileCalcSummaryClassName, "the mobile Kalkyler summary className");
    requireExactlyOnce(homeSource, mobileToggleClassName, "the mobile menu toggle className");
    requireExactlyOnce(homeSource, "min-h-16", "the sticky header row height");
  });

  it("reaches at least 32px of tap height inside the unchanged 64px header row", async () => {
    const css = await compileUtilities("text-sm py-2 min-h-16");
    const targetHeight = remPx(css, "line-height") + 2 * remPx(css, "padding-top");

    expect(targetHeight).toBeGreaterThanOrEqual(32);
    expect(targetHeight).toBeLessThanOrEqual(remPx(css, "min-height"));
  });
});
