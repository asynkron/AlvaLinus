import fs from "node:fs/promises";
import path from "node:path";

const expectedRoutes = [
  "/tjanster/",
  "/om-oss/",
  "/stensattning/",
  "/markarbete/",
  "/gravjobb/",
  "/dranering/",
  "/tradgardsplanering/",
  "/kontakt/",
];

const distDir = path.resolve("dist");
const rootHtmlPath = path.join(distDir, "index.html");
const rootHtml = await fs.readFile(rootHtmlPath, "utf8");
const missingRoutes = [];
const mismatchedRoutes = [];

await Promise.all(
  expectedRoutes.map(async (route) => {
    const routeHtmlPath = path.join(distDir, route.replace(/^\/+|\/+$/g, ""), "index.html");

    try {
      const routeHtml = await fs.readFile(routeHtmlPath, "utf8");

      if (routeHtml !== rootHtml) {
        mismatchedRoutes.push(route);
      }
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        missingRoutes.push(route);
        return;
      }

      throw error;
    }
  }),
);

if (missingRoutes.length > 0 || mismatchedRoutes.length > 0) {
  const details = [
    missingRoutes.length > 0 ? `missing: ${missingRoutes.join(", ")}` : "",
    mismatchedRoutes.length > 0 ? `mismatched: ${mismatchedRoutes.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  throw new Error(`Static route artifact check failed (${details}).`);
}

console.log(`Verified ${expectedRoutes.length} static route artifacts.`);
