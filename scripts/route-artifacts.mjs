import path from "node:path";

const visualAssetPrefix = "/page-visuals/svard-entreprenad-";
const visualAssetSuffix = ".svg";

function isMissingEntryError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function routeLabel(route, index) {
  return typeof route?.id === "string" && route.id.length > 0 ? `Route ${route.id}` : `Route at index ${index}`;
}

export function requireRouteRegistry(routes) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("Route registry must be a non-empty array of declared routes.");
  }

  routes.forEach((route, index) => {
    if (typeof route?.href !== "string" || !route.href.startsWith("/")) {
      throw new Error(`${routeLabel(route, index)} must declare a root-relative href starting with "/".`);
    }

    if (typeof route?.visual?.assetPath !== "string" || route.visual.assetPath.length === 0) {
      throw new Error(`${routeLabel(route, index)} must declare a visual assetPath string.`);
    }
  });

  return routes;
}

export function staticSubpagePaths(routes) {
  return requireRouteRegistry(routes)
    .map((route) => route.href)
    .filter((href) => href !== "/");
}

export function routeVisualAssetPaths(routes) {
  return requireRouteRegistry(routes).map((route) => route.visual.assetPath);
}

function isDeclaredVisualAssetPath(assetPath) {
  return (
    assetPath.startsWith(visualAssetPrefix) &&
    assetPath.endsWith(visualAssetSuffix) &&
    path.posix.dirname(assetPath) === "/page-visuals"
  );
}

export async function assertStaticRouteArtifacts({ routes, distDir, readFile }) {
  const expectedRoutes = staticSubpagePaths(routes);
  const rootHtml = await readFile(path.join(distDir, "index.html"), "utf8");

  const outcomes = await Promise.all(
    expectedRoutes.map(async (route) => {
      const routeHtmlPath = path.join(distDir, route.replace(/^\/+|\/+$/g, ""), "index.html");

      try {
        return (await readFile(routeHtmlPath, "utf8")) === rootHtml ? "matched" : "mismatched";
      } catch (error) {
        if (isMissingEntryError(error)) return "missing";

        throw error;
      }
    }),
  );

  const missingRoutes = expectedRoutes.filter((_, index) => outcomes[index] === "missing");
  const mismatchedRoutes = expectedRoutes.filter((_, index) => outcomes[index] === "mismatched");

  if (missingRoutes.length > 0 || mismatchedRoutes.length > 0) {
    const details = [
      missingRoutes.length > 0 ? `missing: ${missingRoutes.join(", ")}` : "",
      mismatchedRoutes.length > 0 ? `mismatched: ${mismatchedRoutes.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    throw new Error(`Static route artifact check failed (${details}).`);
  }

  return expectedRoutes;
}

export async function assertRouteVisualAssets({ routes, publicDir, access }) {
  const assetPaths = routeVisualAssetPaths(routes);
  const invalidAssets = assetPaths.filter((assetPath) => !isDeclaredVisualAssetPath(assetPath));
  const duplicateAssets = assetPaths.filter((assetPath, index) => assetPaths.indexOf(assetPath) !== index);
  const missingAssets = [];

  for (const assetPath of assetPaths) {
    if (!isDeclaredVisualAssetPath(assetPath)) continue;

    try {
      await access(path.join(publicDir, assetPath.replace(/^\//, "")));
    } catch (error) {
      if (isMissingEntryError(error)) {
        missingAssets.push(assetPath);
        continue;
      }

      throw error;
    }
  }

  if (invalidAssets.length > 0 || missingAssets.length > 0 || duplicateAssets.length > 0) {
    const details = [
      invalidAssets.length > 0 ? `invalid: ${invalidAssets.join(", ")}` : "",
      missingAssets.length > 0 ? `missing: ${missingAssets.join(", ")}` : "",
      duplicateAssets.length > 0 ? `duplicate: ${duplicateAssets.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    throw new Error(`Route visual asset check failed (${details}).`);
  }

  return assetPaths;
}
