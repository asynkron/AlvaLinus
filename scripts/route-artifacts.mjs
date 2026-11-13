import path from "node:path";

const visualAssetPrefix = "/page-visuals/svard-entreprenad-";
const visualAssetSuffix = ".svg";
const percentEscapePattern = /%[0-9a-fA-F]{2}/;

const siteName = "Svärd Entreprenad";
const titleElementPattern = /<title\b[^>]*>([\s\S]*?)<\/title>/i;
const descriptionMetaTagPattern = /<meta\b[^>]*\bname=(["'])description\1[^>]*>/i;
const descriptionContentPattern = /\s+content=(["'])([\s\S]*?)\1/i;
const ogTitleMetaTagPattern = /<meta\b[^>]*\bproperty=(["'])og:title\1[^>]*>/i;
const ogDescriptionMetaTagPattern = /<meta\b[^>]*\bproperty=(["'])og:description\1[^>]*>/i;
const twitterTitleMetaTagPattern = /<meta\b[^>]*\bname=(["'])twitter:title\1[^>]*>/i;
const twitterDescriptionMetaTagPattern = /<meta\b[^>]*\bname=(["'])twitter:description\1[^>]*>/i;
const socialMetaTagPatterns = [
  ogTitleMetaTagPattern,
  ogDescriptionMetaTagPattern,
  twitterTitleMetaTagPattern,
  twitterDescriptionMetaTagPattern,
];
const ogImageMetaTagPattern = /<meta\b[^>]*\bproperty=(["'])og:image\1[^>]*>/i;
const ogImageAltMetaTagPattern = /<meta\b[^>]*\bproperty=(["'])og:image:alt\1[^>]*>/i;
const twitterImageMetaTagPattern = /<meta\b[^>]*\bname=(["'])twitter:image\1[^>]*>/i;
const socialImageMetaTagPatterns = [
  [ogImageMetaTagPattern, "assetPath"],
  [ogImageAltMetaTagPattern, "alt"],
  [twitterImageMetaTagPattern, "assetPath"],
];
const linkTagPattern = /<link\b[^>]*>/gi;
const preloadRelPattern = /\brel=(["'])preload\1/i;
const imagePreloadAsPattern = /\bas=(["'])image\1/i;
const headClosePattern = /<\/head>/i;
const homeHeroPreloadHrefPattern = /\bhref=(["'])\/page-visuals\/hero-photo\.webp\1/i;
const homeHeroPhotoAssetPath = "/page-visuals/hero-photo.webp";

/**
 * Byte budget for each route's preloaded full-size hero asset, the file the
 * stamped preload link fetches before first paint. It sits above the largest
 * current preloaded hero (stensattning-photo.webp at 385,866 B) and below the
 * 501,858 B tradgard-generated.webp baseline that the 2026-11-13 recompression
 * removed, so the gate trips exactly when an oversized preloaded hero
 * reappears instead of policing already-efficient srcset variants.
 */
export const heroAssetByteBudget = 400000;

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

function metaTagContent(document, metaTagPattern) {
  const metaTagMatch = document.match(metaTagPattern);
  const contentMatch = metaTagMatch === null ? null : metaTagMatch[0].match(descriptionContentPattern);

  return contentMatch === null ? null : unescapeHtmlText(contentMatch[2]);
}

function extractDocumentMetadata(document) {
  const titleMatch = document.match(titleElementPattern);

  return {
    title: titleMatch === null ? null : unescapeHtmlText(titleMatch[1]),
    description: metaTagContent(document, descriptionMetaTagPattern),
    ogTitle: metaTagContent(document, ogTitleMetaTagPattern),
    ogDescription: metaTagContent(document, ogDescriptionMetaTagPattern),
    twitterTitle: metaTagContent(document, twitterTitleMetaTagPattern),
    twitterDescription: metaTagContent(document, twitterDescriptionMetaTagPattern),
    ogImage: metaTagContent(document, ogImageMetaTagPattern),
    ogImageAlt: metaTagContent(document, ogImageAltMetaTagPattern),
    twitterImage: metaTagContent(document, twitterImageMetaTagPattern),
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

    const heroViolation = routeHeroPhotoAssetPathViolation(route.heroPhotoAssetPath);

    if (heroViolation !== null) {
      throw new Error(`${routeLabel(route, index)} ${heroViolation}`);
    }

    const imageFieldsViolation = declaredHeroPreloadImageViolation(route);

    if (imageFieldsViolation !== null) {
      throw new Error(`${routeLabel(route, index)} ${imageFieldsViolation}`);
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
 * A route hero photo asset path feeds both the rendered hero <img> and the
 * stamped document's preload link href, so it must be a nonempty
 * root-relative path whose text survives attribute rendering unchanged:
 * no backslashes, whitespace, quotes or angle characters.
 */
function routeHeroPhotoAssetPathViolation(assetPath) {
  if (typeof assetPath !== "string" || assetPath.length === 0) {
    return "must declare a nonempty heroPhotoAssetPath string.";
  }

  if (assetPath.includes("\\")) {
    return 'must use "/" directory separators in heroPhotoAssetPath.';
  }

  if (!assetPath.startsWith("/")) {
    return 'must declare a root-relative heroPhotoAssetPath starting with "/".';
  }

  if (/[\s"'<>]/.test(assetPath)) {
    return "must keep heroPhotoAssetPath free of whitespace and quote or angle characters.";
  }

  return null;
}

export function requireRouteHeroPhotoAssetPath(route, index) {
  const violation = routeHeroPhotoAssetPathViolation(route?.heroPhotoAssetPath);

  if (violation !== null) {
    throw new Error(`${routeLabel(route, index)} ${violation}`);
  }

  return route.heroPhotoAssetPath;
}

/**
 * Validated hero preload href for one route: the declared heroPhotoAssetPath
 * verbatim, so the stamped preload link, the rendered hero image and the
 * artifact assertion all read the same registry-owned string.
 */
export function routeHeroPreloadHref(route) {
  return requireRouteHeroPhotoAssetPath(route, 0);
}

/**
 * A declared responsive hero candidate list is optional per route. When a
 * route declares it, heroPhotoSrcSet and heroPhotoSizes must be declared
 * together so the rendered img srcset/sizes pair and the stamped preload
 * link's imagesrcset/imagesizes pair always describe the same candidates.
 * Each comma-separated srcset candidate must be a root-relative URL with a
 * width or density descriptor, and both values must survive rendering inside
 * quoted link attributes: no backslashes, quotes or angle characters.
 */
function declaredHeroPreloadImageViolation(route) {
  const declaresSrcSet = route?.heroPhotoSrcSet !== undefined;
  const declaresSizes = route?.heroPhotoSizes !== undefined;

  if (declaresSrcSet !== declaresSizes) {
    return "must declare heroPhotoSrcSet and heroPhotoSizes together.";
  }

  if (!declaresSrcSet) return null;

  const srcSet = route.heroPhotoSrcSet;

  if (typeof srcSet !== "string" || srcSet.length === 0) {
    return "must declare a nonempty heroPhotoSrcSet string.";
  }

  if (srcSet.includes("\\")) {
    return 'must use "/" directory separators in heroPhotoSrcSet.';
  }

  if (/["'<>]/.test(srcSet)) {
    return "must keep heroPhotoSrcSet free of quote or angle characters.";
  }

  for (const candidate of srcSet.split(",")) {
    const tokens = candidate.trim().split(/\s+/);
    const assetPath = tokens[0];
    const descriptor = tokens[tokens.length - 1];

    if (tokens.length < 2 || !assetPath.startsWith("/") || !/^\d+[wx]$/.test(descriptor)) {
      return 'must declare heroPhotoSrcSet candidates as root-relative URLs with a width or density descriptor, for example "/page-visuals/hero-640.webp 640w".';
    }
  }

  const sizes = route.heroPhotoSizes;

  if (typeof sizes !== "string" || sizes.length === 0) {
    return "must declare a nonempty heroPhotoSizes string.";
  }

  if (/["'<>]/.test(sizes)) {
    return "must keep heroPhotoSizes free of quote or angle characters.";
  }

  return null;
}

/**
 * Validated declared hero image fields for one route: undefined for routes
 * without responsive variants, or the declared srcset and sizes pair verbatim
 * so the renderer and the stamper consume one declaration.
 */
function requireRouteHeroPreloadImageFields(route) {
  const violation = declaredHeroPreloadImageViolation(route);

  if (violation !== null) {
    throw new Error(`${routeLabel(route, 0)} ${violation}`);
  }

  return { imageSrcSet: route.heroPhotoSrcSet, imageSizes: route.heroPhotoSizes };
}

export function routeHeroPreloadImageSrcSet(route) {
  return requireRouteHeroPreloadImageFields(route).imageSrcSet;
}

export function routeHeroPreloadImageSizes(route) {
  return requireRouteHeroPreloadImageFields(route).imageSizes;
}

function routeHeroPreloadLinkTagText(assetPath, imageSrcSet, imageSizes) {
  const attributes = ['rel="preload"', 'as="image"', `href="${assetPath}"`];

  if (typeof imageSrcSet === "string") {
    attributes.push(`imagesrcset="${imageSrcSet}"`);
  }

  if (typeof imageSizes === "string") {
    attributes.push(`imagesizes="${imageSizes}"`);
  }

  attributes.push('fetchpriority="high"');

  return `<link ${attributes.join(" ")} />`;
}

/**
 * Exact preload link tag required by one stamped subpage document: a plain
 * high-priority link for routes without declared variants, and the same link
 * enriched with imagesrcset/imagesizes when the route declares responsive
 * hero candidates, so the browser preloads exactly the candidate the img
 * srcset selects instead of downloading the base image twice.
 */
export function routeHeroPreloadLinkTag(route) {
  const assetPath = requireRouteHeroPhotoAssetPath(route, 0);
  const { imageSrcSet, imageSizes } = requireRouteHeroPreloadImageFields(route);

  return routeHeroPreloadLinkTagText(assetPath, imageSrcSet, imageSizes);
}

/**
 * Social card image for one emitted subpage document. The route's declared
 * hero photo feeds og:image and twitter:image when social crawlers can render
 * it; a declared SVG hero falls back to the shared raster home hero, because
 * SVG og:image values render unreliably in social crawlers. The alt names the
 * emitted image with registry-owned Swedish text: the route's declared visual
 * alt for its own photo, and the composed page title for the shared home hero.
 */
function routeSocialCardImage(route) {
  const declaredHeroPath = requireRouteHeroPhotoAssetPath(route, 0);

  if (declaredHeroPath.endsWith(".svg")) {
    return { assetPath: homeHeroPhotoAssetPath, alt: `${route.label} – ${siteName}` };
  }

  const alt = route?.visual?.alt;
  const routeName = typeof route?.id === "string" && route.id.length > 0 ? `Route ${route.id}` : "Route";

  if (typeof alt !== "string" || alt.trim().length === 0) {
    throw new Error(`${routeName} must declare a nonempty visual alt string for the social card image.`);
  }

  return { assetPath: declaredHeroPath, alt };
}

/**
 * Emitted social card image paths for the declared subpage routes,
 * deduplicated in route order. Each emitted og:image is either a declared
 * heroPhotoAssetPath or the shared home hero, so the visual asset check must
 * prove the file ships under public/ instead of trusting the composed value.
 */
export function routeSocialCardImagePaths(routes) {
  const assetPaths = [];

  for (const route of staticSubpageRoutes(routes)) {
    const assetPath = routeSocialCardImage(route).assetPath;

    if (!assetPaths.includes(assetPath)) assetPaths.push(assetPath);
  }

  return assetPaths;
}

/**
 * Declared page-metadata composition for emitted subpage documents: the title
 * combines the route's Swedish label with the site name, the description is
 * the route's registry summary verbatim, and the social card image describes
 * the route's own hero photo (the shared raster home hero for SVG-hero
 * routes). The same composed strings feed the title element, the description
 * meta, the og/twitter social card tags and their image tags, so the registry
 * stays the single owner of the Swedish text; this function only declares how
 * the document strings are composed from it.
 */
export function routePageMetadata(route) {
  const routeName = typeof route?.id === "string" && route.id.length > 0 ? `Route ${route.id}` : "Route";

  if (typeof route?.label !== "string" || route.label.trim().length === 0) {
    throw new Error(`${routeName} must declare a nonempty label string for page metadata.`);
  }

  if (typeof route?.summary !== "string" || route.summary.trim().length === 0) {
    throw new Error(`${routeName} must declare a nonempty summary string for page metadata.`);
  }

  return {
    ...requirePageMetadata({ title: `${route.label} – ${siteName}`, description: route.summary }),
    socialImage: routeSocialCardImage(route),
  };
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

function requireSocialCardImage(socialImage) {
  if (
    typeof socialImage?.assetPath !== "string" ||
    socialImage.assetPath.length === 0 ||
    typeof socialImage?.alt !== "string" ||
    socialImage.alt.length === 0
  ) {
    throw new Error("Route page metadata requires a social card image with nonempty assetPath and alt strings.");
  }

  return socialImage;
}

/**
 * The emitted not-found recovery artifact is a dist-root document, not a
 * declared route: it must never enter requireRouteRegistry validation or the
 * route destination map, because registry uniqueness and href semantics
 * describe declared routes only.
 */
export const notFoundArtifactPath = "404.html";

/**
 * Declared Swedish page metadata for the not-found recovery artifact: the
 * title combines the in-app "Sidan finns inte" recovery heading with the site
 * name, and the description mirrors the in-app not-found guidance toward the
 * route shortcuts. It declares no social card image, so the emitted artifact
 * keeps the root document's home-branded og:image and twitter:image set. The
 * site name stays the single brand owner; this function only declares how the
 * document strings are composed from it.
 */
export function notFoundPageMetadata() {
  return requirePageMetadata({
    title: `Sidan finns inte – ${siteName}`,
    description: "Sidan du sökte matchar ingen aktuell sida. Välj en av genvägarna eller kontakta oss för offert.",
  });
}

function replaceTitleElement(document, title) {
  if (!titleElementPattern.test(document)) {
    throw new Error("Route document must contain a <title> element to replace.");
  }

  return document.replace(titleElementPattern, () => `<title>${escapeHtmlText(title)}</title>`);
}

function replaceMetaTagContent(document, metaTagPattern, content, missingDiagnostic) {
  const metaTagMatch = document.match(metaTagPattern);

  if (metaTagMatch === null || !descriptionContentPattern.test(metaTagMatch[0])) {
    throw new Error(missingDiagnostic);
  }

  return document.replace(metaTagPattern, (tag) =>
    tag.replace(descriptionContentPattern, () => ` content="${escapeHtmlText(content)}"`),
  );
}

function replaceDescriptionMetaTag(document, description) {
  return replaceMetaTagContent(
    document,
    descriptionMetaTagPattern,
    description,
    "Route document must contain a description meta tag with a content attribute to replace.",
  );
}

function replaceSocialMetaTags(document, metadata) {
  const documentWithSocialText = socialMetaTagPatterns.reduce(
    (updatedDocument, metaTagPattern) =>
      replaceMetaTagContent(
        updatedDocument,
        metaTagPattern,
        metaTagPattern === ogTitleMetaTagPattern || metaTagPattern === twitterTitleMetaTagPattern
          ? metadata.title
          : metadata.description,
        "Route document must contain og:title, og:description, twitter:title and twitter:description meta tags with content attributes to replace.",
      ),
    document,
  );

  if (metadata.socialImage === undefined) return documentWithSocialText;

  const socialImage = requireSocialCardImage(metadata.socialImage);

  return socialImageMetaTagPatterns.reduce(
    (updatedDocument, [metaTagPattern, socialImageField]) =>
      replaceMetaTagContent(
        updatedDocument,
        metaTagPattern,
        socialImage[socialImageField],
        "Route document must contain og:image, og:image:alt and twitter:image meta tags with content attributes to replace.",
      ),
    documentWithSocialText,
  );
}

export function applyRouteDocumentMetadata(document, metadata) {
  if (typeof document !== "string" || document.length === 0) {
    throw new Error("Route document metadata emission requires a nonempty document string.");
  }

  const pageMetadata = requirePageMetadata(metadata);
  const documentWithHeadText = replaceDescriptionMetaTag(
    replaceTitleElement(document, pageMetadata.title),
    pageMetadata.description,
  );

  return replaceSocialMetaTags(documentWithHeadText, pageMetadata);
}

function isHomeHeroPreloadLinkTag(linkTag) {
  return preloadRelPattern.test(linkTag) && homeHeroPreloadHrefPattern.test(linkTag);
}

function documentCarriesHomeHeroPreload(document) {
  const linkTags = document.match(linkTagPattern);

  return linkTags !== null && linkTags.some(isHomeHeroPreloadLinkTag);
}

/**
 * Absence-tolerant strip for the emitted home-hero preload link: documents
 * without the link are returned unchanged, so the static route emission can
 * apply it uniformly to every non-root document regardless of source shape.
 * Composed separately from applyRouteDocumentMetadata, which owns only the
 * title, description and social card text and image tags.
 */
export function stripHomeHeroPreload(document) {
  if (typeof document !== "string" || document.length === 0) {
    return document;
  }

  return document.replace(linkTagPattern, (linkTag) => (isHomeHeroPreloadLinkTag(linkTag) ? "" : linkTag));
}

/**
 * High-priority preload link for one stamped subpage document, inserted
 * directly before the head-close tag so the browser starts fetching the
 * route's LCP hero photo in parallel with the JavaScript bundle instead of
 * after it executes. A route that declares responsive hero variants passes
 * its registry srcset and sizes so the link's imagesrcset/imagesizes select
 * the same candidate the rendered img picks; routes without declared
 * variants keep the plain href emission byte-for-byte. Composed after
 * stripHomeHeroPreload, which removed the home document's own preload from
 * the stamped source.
 */
export function injectRouteHeroPreload(document, assetPath, imageSrcSet, imageSizes) {
  if (typeof document !== "string" || document.length === 0) {
    throw new Error("Route hero preload injection requires a nonempty document string.");
  }

  const violation = routeHeroPhotoAssetPathViolation(assetPath);

  if (violation !== null) {
    throw new Error(`Route hero preload injection requires a heroPhotoAssetPath that ${violation}`);
  }

  const imageViolation = declaredHeroPreloadImageViolation({ heroPhotoSrcSet: imageSrcSet, heroPhotoSizes: imageSizes });

  if (imageViolation !== null) {
    throw new Error(`Route hero preload injection requires hero image fields that ${imageViolation}`);
  }

  if (!headClosePattern.test(document)) {
    throw new Error("Route document must contain a </head> element to host the injected hero preload link.");
  }

  return document.replace(headClosePattern, () => `${routeHeroPreloadLinkTagText(assetPath, imageSrcSet, imageSizes)}</head>`);
}

/**
 * Image preload link tags carried by a document, in document order with their
 * full attribute text, so the artifact assertion can compare the stamped
 * emission byte-for-byte: a plain href link for routes without declared
 * variants and the imagesrcset/imagesizes-enriched link for routes with them.
 */
function documentImagePreloadLinkTags(document) {
  const linkTags = document.match(linkTagPattern) ?? [];

  return linkTags.filter((linkTag) => preloadRelPattern.test(linkTag) && imagePreloadAsPattern.test(linkTag));
}

function documentCarriesExactlyOwnHeroPreload(document, heroPreloadLinkTag) {
  const imagePreloadLinkTags = documentImagePreloadLinkTags(document);

  return imagePreloadLinkTags.length === 1 && imagePreloadLinkTags[0] === heroPreloadLinkTag;
}

function documentCarriesRouteMetadata(document, metadata) {
  const extracted = extractDocumentMetadata(document);
  const textMatched =
    extracted.title === metadata.title &&
    extracted.description === metadata.description &&
    extracted.ogTitle === metadata.title &&
    extracted.ogDescription === metadata.description &&
    extracted.twitterTitle === metadata.title &&
    extracted.twitterDescription === metadata.description;

  if (metadata.socialImage === undefined) return textMatched;

  return (
    textMatched &&
    extracted.ogImage === metadata.socialImage.assetPath &&
    extracted.ogImageAlt === metadata.socialImage.alt &&
    extracted.twitterImage === metadata.socialImage.assetPath
  );
}

export function routeVisualAssetPaths(routes) {
  return requireRouteRegistry(routes).map((route) => route.visual.assetPath);
}

/**
 * Root-relative hero image paths declared by each route's heroPhotoAssetPath,
 * in route order. The rendered hero <img> and the stamped document's preload
 * href both request this exact file, so the visual asset check must prove the
 * file ships under public/ instead of trusting the format-valid declaration.
 */
export function routeHeroPhotoAssetPaths(routes) {
  return requireRouteRegistry(routes).map((route, index) => requireRouteHeroPhotoAssetPath(route, index));
}

/**
 * Root-relative hero image paths declared through responsive variant srcsets,
 * deduplicated in route order. A srcset candidate the browser can select must
 * exist as a shipped file: a candidate that 404s after selection fires the
 * hero img's onError and hides the whole hero, so the visual asset check
 * validates every declared candidate file, not only the fallback SVGs.
 */
export function routeHeroSrcSetCandidatePaths(routes) {
  const candidates = [];

  for (const route of requireRouteRegistry(routes)) {
    const { imageSrcSet } = requireRouteHeroPreloadImageFields(route);

    if (typeof imageSrcSet !== "string") continue;

    for (const candidate of imageSrcSet.split(",")) {
      const assetPath = candidate.trim().split(/\s+/)[0];

      if (assetPath && !candidates.includes(assetPath)) candidates.push(assetPath);
    }
  }

  return candidates;
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
    heroPreloadLinkTag: routeHeroPreloadLinkTag(route),
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

  if (!documentCarriesHomeHeroPreload(rootHtml)) {
    throw new Error(
      "Static route artifact check failed: the root document must carry the home hero preload link for /page-visuals/hero-photo.webp.",
    );
  }

  const notFoundHtmlPath = path.join(distDir, notFoundArtifactPath);

  let notFoundHtml;

  try {
    notFoundHtml = await readFile(notFoundHtmlPath, "utf8");
  } catch (error) {
    if (isMissingEntryError(error)) {
      throw new Error(
        `Static route artifact check failed: the not-found recovery document dist/${notFoundArtifactPath} is missing.`,
      );
    }

    throw error;
  }

  if (!documentCarriesRouteMetadata(notFoundHtml, notFoundPageMetadata())) {
    throw new Error(
      `Static route artifact check failed: dist/${notFoundArtifactPath} must carry the not-found title and description instead of the root document metadata.`,
    );
  }

  if (documentImagePreloadLinkTags(notFoundHtml).length > 0) {
    throw new Error(
      `Static route artifact check failed: dist/${notFoundArtifactPath} must not carry any image preload link.`,
    );
  }

  const outcomes = await Promise.all(
    expectedPages.map(async (page) => {
      const routeHtmlPath = path.join(distDir, page.href.replace(/^\/+|\/+$/g, ""), "index.html");

      try {
        const routeHtml = await readFile(routeHtmlPath, "utf8");

        return documentCarriesRouteMetadata(routeHtml, page.metadata) &&
          !documentCarriesHomeHeroPreload(routeHtml) &&
          documentCarriesExactlyOwnHeroPreload(routeHtml, page.heroPreloadLinkTag)
          ? "matched"
          : "mismatched";
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

export async function assertRouteVisualAssets({ routes, publicDir, access, stat }) {
  const assetPaths = routeVisualAssetPaths(routes);
  const heroAssetPaths = routeHeroPhotoAssetPaths(routes);
  const heroCandidatePaths = routeHeroSrcSetCandidatePaths(routes);
  const socialCardImagePaths = routeSocialCardImagePaths(routes);
  const invalidAssets = assetPaths.filter((assetPath) => !isDeclaredVisualAssetPath(assetPath));
  const duplicateAssets = assetPaths.filter((assetPath, index) => assetPaths.indexOf(assetPath) !== index);
  const missingAssets = [];
  const missingHeroAssets = [];
  const oversizedHeroAssets = [];

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

  for (const assetPath of heroAssetPaths) {
    try {
      await access(path.join(publicDir, assetPath.replace(/^\//, "")));
    } catch (error) {
      if (isMissingEntryError(error)) {
        missingHeroAssets.push(assetPath);
        continue;
      }

      throw error;
    }
  }

  for (const assetPath of heroCandidatePaths) {
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

  for (const assetPath of socialCardImagePaths) {
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

  if (typeof stat === "function") {
    for (const assetPath of heroAssetPaths) {
      try {
        const stats = await stat(path.join(publicDir, assetPath.replace(/^\//, "")));

        if (stats.size > heroAssetByteBudget) {
          oversizedHeroAssets.push(`${assetPath} (${stats.size} B > ${heroAssetByteBudget} B hero budget)`);
        }
      } catch (error) {
        if (isMissingEntryError(error)) continue;

        throw error;
      }
    }
  }

  if (
    invalidAssets.length > 0 ||
    missingAssets.length > 0 ||
    missingHeroAssets.length > 0 ||
    duplicateAssets.length > 0 ||
    oversizedHeroAssets.length > 0
  ) {
    const details = [
      invalidAssets.length > 0 ? `invalid: ${invalidAssets.join(", ")}` : "",
      missingAssets.length > 0 ? `missing: ${missingAssets.join(", ")}` : "",
      missingHeroAssets.length > 0 ? `missing heroes: ${missingHeroAssets.join(", ")}` : "",
      duplicateAssets.length > 0 ? `duplicate: ${duplicateAssets.join(", ")}` : "",
      oversizedHeroAssets.length > 0 ? `oversized: ${oversizedHeroAssets.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    throw new Error(`Route visual asset check failed (${details}).`);
  }

  return { visualAssets: assetPaths, heroAssets: heroAssetPaths, socialCardImages: socialCardImagePaths };
}
