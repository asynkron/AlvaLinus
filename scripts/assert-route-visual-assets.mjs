import fs from "node:fs/promises";
import path from "node:path";

import { siteContent } from "../src/data/siteContent.ts";
import { assertRouteVisualAssets, heroAssetByteBudget } from "./route-artifacts.mjs";

const { visualAssets, heroAssets } = await assertRouteVisualAssets({
  routes: siteContent.routes,
  publicDir: path.resolve("public"),
  access: fs.access,
  stat: fs.stat,
});

console.log(
  `Verified ${visualAssets.length} route visual assets and ${heroAssets.length} route hero assets ` +
    `within the ${heroAssetByteBudget} B preloaded-hero byte budget.`,
);
