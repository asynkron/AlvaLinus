import rawStyles from "./styles.css?raw";

const stylesheet = rawStyles.replace(/\r\n/g, "\n");
const mediaIndex = stylesheet.indexOf("@media (prefers-reduced-motion: reduce)");

describe("styles.css reduced motion", () => {
  it("keeps html smooth scrolling as the unconditional default rule", () => {
    expect(stylesheet).toMatch(/html \{\s*scroll-behavior: smooth;\s*\}/);
    expect(mediaIndex).toBeGreaterThan(-1);
    const defaultRules = stylesheet.slice(0, mediaIndex);
    expect(defaultRules).toContain("scroll-behavior: smooth");
    expect(defaultRules).not.toContain("scroll-behavior: auto");
    expect(defaultRules).not.toContain("prefers-reduced-motion");
  });

  it("sets html scroll-behavior to auto only inside the prefers-reduced-motion block", () => {
    expect(stylesheet.slice(mediaIndex)).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*html \{\s*scroll-behavior: auto;\s*\}\s*\}/,
    );
    expect(stylesheet.match(/prefers-reduced-motion/g)).toHaveLength(1);
    expect(stylesheet.match(/scroll-behavior/g)).toHaveLength(2);
    expect(stylesheet.match(/scroll-behavior: auto/g)).toHaveLength(1);
  });
});
