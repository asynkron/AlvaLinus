import postcss from "postcss";
import tailwindcss from "tailwindcss";

import tailwindConfig from "../tailwind.config";

function normalize(css: string): string {
  return css.replace(/\s+/g, " ").trim();
}

async function compileUtilities(classCandidates: string): Promise<string> {
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: classCandidates, extension: "html" }],
    }),
  ]).process("@tailwind utilities;", { from: undefined });

  return result.css;
}

describe("tailwind primary hover utility", () => {
  it("generates the read-more hover utility from the AA-pinned --primary-hover token", async () => {
    const css = await compileUtilities("hover:text-primary-hover");

    expect(normalize(css)).toContain(`.hover\\:text-primary-hover:hover { color: hsl(var(--primary-hover)) }`);
  });

  it("generates the resting read-more utility from the AA-pinned --primary token", async () => {
    const css = await compileUtilities("text-primary");

    expect(normalize(css)).toContain(`.text-primary { color: hsl(var(--primary)) }`);
  });
});
