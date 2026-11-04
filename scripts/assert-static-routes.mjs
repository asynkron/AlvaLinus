import fs from "node:fs/promises";
import path from "node:path";

import { siteContent } from "../src/data/siteContent.ts";
import { assertStaticRouteArtifacts } from "./route-artifacts.mjs";

const checkedRoutes = await assertStaticRouteArtifacts({
  routes: siteContent.routes,
  distDir: path.resolve("dist"),
  readFile: fs.readFile,
});

console.log(`Verified ${checkedRoutes.length} static route artifacts and the not-found recovery artifact.`);
