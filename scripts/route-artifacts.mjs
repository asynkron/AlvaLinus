import path from "node:path";

const visualAssetPrefix = "/page-visuals/svard-entreprenad-";
const visualAssetSuffix = ".svg";
const percentEscapePattern = /%[0-9a-fA-F]{2}/;

function isMissingEntryError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function routeLabel(route, index) {
  return typeof route?.id === "string" && route.id.length > 0 ? `Route ${route.id}` : `Route at index ${index}`;
}

/**
 * A canonical public route href is the site root "/" or a root-relative
 * directory path that starts and ends with "/" and uses single "/" separators
 * between nonempty segments. Backslashes, dot segments ("." and ".."), query or
 * fragment text, and percent-encoded sequences that could hide separators or
 * dots are rejected so a declared href always maps to one unambiguous static
 * output directory.
 */
function canonicalHrefViolation(href) {
  if (typeof href !== "string" || !href.startsWith("/")) {
    return 'must declare a root-relative href starting with "/".';
  }

  if (href === "/") return null;

  if (href.includes("\\")) {
    return 'must use "/" directory separators; backslashes are not canonical route paths.';
  }

  if (href.includes("?") || href.includes("#")) {
    return "must be a plain directory path without query or fragment text.";
  }

  if (percentEscapePattern.test(href)) {
    return "must avoid percent-encoded sequences that can hide separators or dots.";
  }

  if (href.includes("//")) {
    return 'must use single "/" separators without repeated slashes.';
  }

  const segments = href.slice(1).split("/");
  const dotSegment = segments.find((segment) => segment === "." || segment === "..");

  if (dotSegment !== undefined) {
    return 'must not contain "." or ".." path segments.';
  }

  if (segments[segments.length - 1] !== "") {
    return 'must end with "/" so the static build emits a directory index page.';
  }

  return null;
}

function outputDestination(href) {
  return href.replace(/^\/+|\/+$/g, "");
}

function describeOutputDestination(destination) {
  return destination.length === 0 ? "dist/index.html" : `dist/${destination}/index.html`;
}

export function requireRouteRegistry(routes) {
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("Route registry must be a non-empty array of declared routes.");
  }

  const destinations = new Map();

  routes.forEach((route, index) => {
    if (typeof route?.href !== "string" || !route.href.startsWith("/")) {
      throw new Error(`${routeLabel(route, index)} must declare a root-relative href starting with "/".`);
    }

    const hrefViolation = canonicalHrefViolation(route.href);

    if (hrefViolation !== null) {
      throw new Error(`${routeLabel(route, index)} ${hrefViolation}`);
    }

    if (typeof route?.visual?.assetPath !== "string" || route.visual.assetPath.length === 0) {
      throw new Error(`${routeLabel(route, index)} must declare a visual assetPath string.`);
    }

    const destination = outputDestination(route.href);

    if (destinations.has(destination)) {
      const otherIndex = destinations.get(destination);

      throw new Error(
        `${routeLabel(route, index)} and ${routeLabel(routes[otherIndex], otherIndex)} both emit ` +
          `${describeOutputDestination(destination)}; routes must declare unique static output destinations.`,
      );
    }

    destinations.set(destination, index);
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
