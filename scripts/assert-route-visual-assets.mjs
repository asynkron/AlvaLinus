import fs from "node:fs/promises";
import path from "node:path";

import { siteContent } from "../src/data/siteContent.ts";
import { assertRouteVisualAssets } from "./route-artifacts.mjs";

const { visualAssets, heroAssets } = await assertRouteVisualAssets({
  routes: siteContent.routes,
  publicDir: path.resolve("public"),
  access: fs.access,
});

console.log(`Verified ${visualAssets.length} route visual assets and ${heroAssets.length} route hero assets.`);
