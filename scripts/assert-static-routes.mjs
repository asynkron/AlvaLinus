import fs from "node:fs/promises";
import path from "node:path";

import { siteContent } from "../src/data/siteContent.ts";
import { assertStaticRouteArtifacts, distFontPreloadHrefs } from "./route-artifacts.mjs";

const distDir = path.resolve("dist");

let assetFileNames = [];

try {
  assetFileNames = await fs.readdir(path.join(distDir, "assets"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const fontPreloadHrefs = distFontPreloadHrefs(assetFileNames.map((fileName) => `assets/${fileName}`));

const checkedRoutes = await assertStaticRouteArtifacts({
  routes: siteContent.routes,
  distDir,
  readFile: fs.readFile,
  fontPreloadHrefs,
});

console.log(
  `Verified ${checkedRoutes.length} static route artifacts, the not-found recovery artifact, and ` +
    `${fontPreloadHrefs.length} emitted font preload links per document.`,
);
