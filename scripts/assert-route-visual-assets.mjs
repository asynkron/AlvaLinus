import fs from "node:fs/promises";
import path from "node:path";

const routeContentPath = path.resolve("src/data/siteContent.ts");
const routeContent = await fs.readFile(routeContentPath, "utf8");
const assetPathMatches = [...routeContent.matchAll(/assetPath:\s*"([^"]+)"/g)].map((match) => match[1]);
const missingAssets = [];
const invalidAssets = [];
const duplicateAssets = assetPathMatches.filter((assetPath, index) => assetPathMatches.indexOf(assetPath) !== index);

for (const assetPath of assetPathMatches) {
  if (!assetPath.startsWith("/page-visuals/svard-entreprenad-") || !assetPath.endsWith(".svg")) {
    invalidAssets.push(assetPath);
    continue;
  }

  try {
    await fs.access(path.resolve("public", assetPath.replace(/^\//, "")));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      missingAssets.push(assetPath);
      continue;
    }

    throw error;
  }
}

if (assetPathMatches.length !== 9 || invalidAssets.length > 0 || missingAssets.length > 0 || duplicateAssets.length > 0) {
  const details = [
    assetPathMatches.length !== 9 ? `expected 9 visual asset paths, found ${assetPathMatches.length}` : "",
    invalidAssets.length > 0 ? `invalid: ${invalidAssets.join(", ")}` : "",
    missingAssets.length > 0 ? `missing: ${missingAssets.join(", ")}` : "",
    duplicateAssets.length > 0 ? `duplicate: ${duplicateAssets.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  throw new Error(`Route visual asset check failed (${details}).`);
}

console.log(`Verified ${assetPathMatches.length} route visual assets.`);
