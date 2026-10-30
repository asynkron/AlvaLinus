import path from "node:path";

const visualAssetPrefix = "/page-visuals/svard-entreprenad-";
const visualAssetSuffix = ".svg";
const percentEscapePattern = /%[0-9a-fA-F]{2}/;

const siteName = "Svärd Entreprenad";
const titleElementPattern = /<title\b[^>]*>([\s\S]*?)<\/title>/i;
const descriptionMetaTagPattern = /<meta\b[^>]*\bname=(["'])description\1[^>]*>/i;
const descriptionContentPattern = /\s+content=(["'])([\s\S]*?)\1/i;

function isMissingEntryError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function escapeHtmlText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unescapeHtmlText(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function extractDocumentMetadata(document) {
  const titleMatch = document.match(titleElementPattern);
  const metaTagMatch = document.match(descriptionMetaTagPattern);
  const contentMatch = metaTagMatch === null ? null : metaTagMatch[0].match(descriptionContentPattern);

  return {
    title: titleMatch === null ? null : unescapeHtmlText(titleMatch[1]),
    description: contentMatch === null ? null : unescapeHtmlText(contentMatch[2]),
  };
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

export function staticSubpageRoutes(routes) {
  return requireRouteRegistry(routes).filter((route) => route.href !== "/");
}

export function staticSubpagePaths(routes) {
  return staticSubpageRoutes(routes).map((route) => route.href);
}

/**
 * Declared page-metadata composition for emitted subpage documents: the title
 * combines the route's Swedish label with the site name, and the description
 * is the route's registry summary verbatim. The registry stays the single
 * owner of the Swedish text; this function only declares how the document
 * strings are composed from it.
 */
export function routePageMetadata(route) {
  const routeName = typeof route?.id === "string" && route.id.length > 0 ? `Route ${route.id}` : "Route";

  if (typeof route?.label !== "string" || route.label.trim().length === 0) {
    throw new Error(`${routeName} must declare a nonempty label string for page metadata.`);
  }

  if (typeof route?.summary !== "string" || route.summary.trim().length === 0) {
    throw new Error(`${routeName} must declare a nonempty summary string for page metadata.`);
  }

  return requirePageMetadata({ title: `${route.label} – ${siteName}`, description: route.summary });
}

function requirePageMetadata(metadata) {
  if (
    typeof metadata?.title !== "string" ||
    metadata.title.length === 0 ||
    typeof metadata?.description !== "string" ||
    metadata.description.length === 0
  ) {
    throw new Error("Route page metadata requires nonempty title and description strings.");
  }

  return metadata;
}

function replaceTitleElement(document, title) {
  if (!titleElementPattern.test(document)) {
    throw new Error("Route document must contain a <title> element to replace.");
  }

  return document.replace(titleElementPattern, () => `<title>${escapeHtmlText(title)}</title>`);
}

function replaceDescriptionMetaTag(document, description) {
  const metaTagMatch = document.match(descriptionMetaTagPattern);

  if (metaTagMatch === null || !descriptionContentPattern.test(metaTagMatch[0])) {
    throw new Error("Route document must contain a description meta tag with a content attribute to replace.");
  }

  return document.replace(descriptionMetaTagPattern, (tag) =>
    tag.replace(descriptionContentPattern, () => ` content="${escapeHtmlText(description)}"`),
  );
}

export function applyRouteDocumentMetadata(document, metadata) {
  if (typeof document !== "string" || document.length === 0) {
    throw new Error("Route document metadata emission requires a nonempty document string.");
  }

  const pageMetadata = requirePageMetadata(metadata);

  return replaceDescriptionMetaTag(replaceTitleElement(document, pageMetadata.title), pageMetadata.description);
}

function documentCarriesRouteMetadata(document, metadata) {
  const extracted = extractDocumentMetadata(document);

  return extracted.title === metadata.title && extracted.description === metadata.description;
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
  const expectedPages = staticSubpageRoutes(routes).map((route) => ({
    href: route.href,
    metadata: routePageMetadata(route),
  }));
  const expectedRoutes = expectedPages.map((page) => page.href);
  const rootHtml = await readFile(path.join(distDir, "index.html"), "utf8");

  const rootMetadata = extractDocumentMetadata(rootHtml);

  if (
    rootMetadata.title === null ||
    rootMetadata.title.length === 0 ||
    rootMetadata.description === null ||
    rootMetadata.description.length === 0
  ) {
    throw new Error(
      "Static route artifact check failed: the root document must keep a <title> element and a nonempty description meta content attribute.",
    );
  }

  const outcomes = await Promise.all(
    expectedPages.map(async (page) => {
      const routeHtmlPath = path.join(distDir, page.href.replace(/^\/+|\/+$/g, ""), "index.html");

      try {
        const routeHtml = await readFile(routeHtmlPath, "utf8");

        return documentCarriesRouteMetadata(routeHtml, page.metadata) ? "matched" : "mismatched";
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
