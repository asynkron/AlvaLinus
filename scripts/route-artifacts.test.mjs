// @vitest-environment node
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { siteContent } from "../src/data/siteContent.ts";
import indexTemplate from "../index.html?raw";
import {
  applyRouteDocumentMetadata,
  assertRouteVisualAssets,
  assertStaticRouteArtifacts,
  heroAssetByteBudget,
  injectRouteHeroPreload,
  notFoundArtifactPath,
  notFoundPageMetadata,
  requireRouteRegistry,
  routeHeroPreloadHref,
  routeHeroPreloadImageSizes,
  routeHeroPreloadImageSrcSet,
  routeHeroPreloadLinkTag,
  routeHeroSrcSetCandidatePaths,
  routePageMetadata,
  routeSocialCardImagePaths,
  routeVisualAssetPaths,
  staticSubpagePaths,
  staticSubpageRoutes,
  stripHomeHeroPreload,
} from "./route-artifacts.mjs";

function fixtureRoute(id, href, assetPath, heroPhotoAssetPath = `/page-visuals/${id}-hero.webp`) {
  return {
    id,
    kind: "service",
    label: id,
    href,
    summary: `${id} summary`,
    heroPhotoAssetPath,
    visual: { assetPath, alt: `${id} alt`, intent: `${id} intent` },
  };
}

const homeRoute = fixtureRoute("home", "/", "/page-visuals/svard-entreprenad-home.svg");
const servicesRoute = fixtureRoute("services", "/tjanster/", "/page-visuals/svard-entreprenad-services.svg");
const contactRoute = fixtureRoute("contact", "/kontakt/", "/page-visuals/svard-entreprenad-contact.svg");
const addedRoute = fixtureRoute("nyheter", "/nyheter/", "/page-visuals/svard-entreprenad-nyheter.svg");
const fixtureRoutes = [homeRoute, servicesRoute, contactRoute];
const svgHeroRoute = fixtureRoute(
  "svghero",
  "/svghero/",
  "/page-visuals/svard-entreprenad-svghero.svg",
  "/page-visuals/inhyrning-hero.svg",
);

const responsiveServicesSrcSet =
  "/page-visuals/services-hero-640.webp 640w, /page-visuals/services-hero-960.webp 960w, /page-visuals/services-hero.webp 1672w";
const responsiveServicesRoute = {
  ...servicesRoute,
  heroPhotoSrcSet: responsiveServicesSrcSet,
  heroPhotoSizes: "100vw",
};

const rootTitle = "Svärd Entreprenad – Mark & anläggning i Örebro";
const rootDescription = "Svärd Entreprenad utför professionella mark- och anläggningsarbeten i Örebro.";
const homeHeroPreloadLink =
  '<link rel="preload" as="image" href="/page-visuals/hero-photo.webp" ' +
  'imagesrcset="/page-visuals/hero-photo-640.webp 640w, /page-visuals/hero-photo-960.webp 960w, /page-visuals/hero-photo.webp 1600w" ' +
  'imagesizes="100vw" fetchpriority="high">';
const rootHtml =
  '<!doctype html><html lang="sv"><head><title>' +
  rootTitle +
  "</title>" +
  '<meta name="description" content="' +
  rootDescription +
  '">' +
  '<meta property="og:type" content="website">' +
  '<meta property="og:locale" content="sv_SE">' +
  '<meta property="og:site_name" content="Svärd Entreprenad">' +
  '<meta property="og:title" content="' +
  rootTitle +
  '">' +
  '<meta\n      property="og:description"\n      content="' +
  rootDescription +
  '"\n    >' +
  '<meta property="og:image" content="/page-visuals/hero-photo.webp">' +
  '<meta property="og:image:width" content="1600">' +
  '<meta property="og:image:height" content="905">' +
  '<meta property="og:image:alt" content="Grävmaskin på en mark- och anläggningsplats i solnedgång">' +
  '<meta name="twitter:card" content="summary_large_image">' +
  '<meta name="twitter:title" content="' +
  rootTitle +
  '">' +
  '<meta\n      name="twitter:description"\n      content="' +
  rootDescription +
  '"\n    >' +
  '<meta name="twitter:image" content="/page-visuals/hero-photo.webp">' +
  homeHeroPreloadLink +
  "</head><body>Svard Entreprenad</body></html>";

const rootHtmlWithoutSocialTags =
  '<!doctype html><html lang="sv"><head><title>' +
  rootTitle +
  "</title>" +
  '<meta name="description" content="' +
  rootDescription +
  '">' +
  "</head><body>Svard Entreprenad</body></html>";

const rootDocumentWithoutMetadata = '<!doctype html><html lang="sv"><body>Svard Entreprenad</body></html>';

function emittedSubpageHtml(route) {
  return injectRouteHeroPreload(
    stripHomeHeroPreload(applyRouteDocumentMetadata(rootHtml, routePageMetadata(route))),
    routeHeroPreloadHref(route),
    routeHeroPreloadImageSrcSet(route),
    routeHeroPreloadImageSizes(route),
  );
}

function notFoundArtifactFile(distDir) {
  return path.join(distDir, notFoundArtifactPath);
}

function emittedNotFoundHtml() {
  return stripHomeHeroPreload(applyRouteDocumentMetadata(rootHtml, notFoundPageMetadata()));
}

function subpageHtmlWithRootSocialTags(route) {
  const metadata = routePageMetadata(route);

  return rootHtml
    .replace(`<title>${rootTitle}</title>`, `<title>${metadata.title}</title>`)
    .replace(`content="${rootDescription}"`, `content="${metadata.description}"`);
}

function subpageHtmlWithoutSocialTags(route) {
  const metadata = routePageMetadata(route);

  return rootHtmlWithoutSocialTags
    .replace(`<title>${rootTitle}</title>`, `<title>${metadata.title}</title>`)
    .replace(`content="${rootDescription}"`, `content="${metadata.description}"`);
}

function subpageArtifactPath(distDir, href) {
  return path.join(distDir, href.replace(/^\/+|\/+$/g, ""), "index.html");
}

function publicAssetPath(publicDir, assetPath) {
  return path.join(publicDir, assetPath.replace(/^\//, ""));
}

function missingEntryError(filePath) {
  return Object.assign(new Error(`ENOENT: no such file or directory, ${filePath}`), { code: "ENOENT" });
}

function memoryFileSystem(entries = {}) {
  return {
    readFile: vi.fn(async (filePath) => {
      if (!Object.hasOwn(entries, filePath)) throw missingEntryError(filePath);
      return entries[filePath];
    }),
    access: vi.fn(async (filePath) => {
      if (!Object.hasOwn(entries, filePath)) throw missingEntryError(filePath);
    }),
    stat: vi.fn(async (filePath) => {
      if (!Object.hasOwn(entries, filePath)) throw missingEntryError(filePath);
      return { size: Buffer.byteLength(entries[filePath], "utf8") };
    }),
  };
}

function distEntries(routes, { omit = [], mismatched = [], notFound = "emitted" } = {}) {
  const entries = { [path.join("dist", "index.html")]: rootHtml };
  for (const route of routes) {
    if (route.href === "/" || omit.includes(route.href)) continue;
    entries[subpageArtifactPath("dist", route.href)] = mismatched.includes(route.href)
      ? rootHtml
      : emittedSubpageHtml(route);
  }

  if (notFound !== "omit") {
    entries[notFoundArtifactFile("dist")] = notFound === "mismatched" ? rootHtml : emittedNotFoundHtml();
  }

  return entries;
}

function publicEntries(routes) {
  return {
    [publicAssetPath("public", "/page-visuals/hero-photo.webp")]: "<home-hero></home-hero>",
    ...Object.fromEntries(
      routes.flatMap((route) => [
        [publicAssetPath("public", route.visual.assetPath), "<svg></svg>"],
        [publicAssetPath("public", route.heroPhotoAssetPath), "<hero></hero>"],
      ]),
    ),
  };
}

describe("requireRouteRegistry", () => {
  it("rejects an empty or missing route inventory instead of passing vacuously", () => {
    expect(() => requireRouteRegistry([])).toThrow(
      "Route registry must be a non-empty array of declared routes.",
    );
    expect(() => requireRouteRegistry(undefined)).toThrow(
      "Route registry must be a non-empty array of declared routes.",
    );
  });

  it("rejects declared routes without a root-relative href or a visual asset path", () => {
    expect(() =>
      requireRouteRegistry([
        { id: "broken", visual: { assetPath: "/page-visuals/svard-entreprenad-broken.svg" } },
      ]),
    ).toThrow('Route broken must declare a root-relative href starting with "/".');
    expect(() => requireRouteRegistry([{ id: "broken", href: "/broken/", visual: {} }])).toThrow(
      "Route broken must declare a visual assetPath string.",
    );
  });

  it("makes both artifact assertions reject an empty route inventory", async () => {
    await expect(
      assertStaticRouteArtifacts({ routes: [], distDir: "dist", readFile: memoryFileSystem().readFile }),
    ).rejects.toThrow("Route registry must be a non-empty array of declared routes.");
    await expect(
      assertRouteVisualAssets({ routes: [], publicDir: "public", access: memoryFileSystem().access }),
    ).rejects.toThrow("Route registry must be a non-empty array of declared routes.");
  });

  it("rejects both artifact assertions before filesystem work for an escaping route href", async () => {
    const escapeRoute = fixtureRoute("escape", "/kontakt/../kontakt/", "/page-visuals/svard-entreprenad-escape.svg");
    const readFile = vi.fn();
    const access = vi.fn();

    await expect(
      assertStaticRouteArtifacts({ routes: [homeRoute, escapeRoute], distDir: "dist", readFile }),
    ).rejects.toThrow('Route escape must not contain "." or ".." path segments.');
    await expect(
      assertRouteVisualAssets({ routes: [homeRoute, escapeRoute], publicDir: "public", access }),
    ).rejects.toThrow('Route escape must not contain "." or ".." path segments.');
    expect(readFile).not.toHaveBeenCalled();
    expect(access).not.toHaveBeenCalled();
  });

  it("accepts a route that declares responsive hero variants and leaves undeclared routes untouched", () => {
    expect(requireRouteRegistry([homeRoute, responsiveServicesRoute, contactRoute])).toEqual([
      homeRoute,
      responsiveServicesRoute,
      contactRoute,
    ]);
  });

  it("rejects hero variant declarations that are not declared together", () => {
    expect(() =>
      requireRouteRegistry([{ ...servicesRoute, heroPhotoSrcSet: "/page-visuals/services-hero-640.webp 640w" }]),
    ).toThrow("Route services must declare heroPhotoSrcSet and heroPhotoSizes together.");
    expect(() => requireRouteRegistry([{ ...servicesRoute, heroPhotoSizes: "100vw" }])).toThrow(
      "Route services must declare heroPhotoSrcSet and heroPhotoSizes together.",
    );
  });

  it("rejects malformed or non-renderable hero srcset declarations", () => {
    expect(() =>
      requireRouteRegistry([{ ...servicesRoute, heroPhotoSrcSet: "/page-visuals/services-hero-640.webp", heroPhotoSizes: "100vw" }]),
    ).toThrow("Route services must declare heroPhotoSrcSet candidates as root-relative URLs");
    expect(() =>
      requireRouteRegistry([
        { ...servicesRoute, heroPhotoSrcSet: "page-visuals/services-hero-640.webp 640w", heroPhotoSizes: "100vw" },
      ]),
    ).toThrow("Route services must declare heroPhotoSrcSet candidates as root-relative URLs");
    expect(() =>
      requireRouteRegistry([{ ...servicesRoute, heroPhotoSrcSet: '"/page-visuals/x.webp" 640w', heroPhotoSizes: "100vw" }]),
    ).toThrow("Route services must keep heroPhotoSrcSet free of quote or angle characters.");
    expect(() =>
      requireRouteRegistry([{ ...servicesRoute, heroPhotoSrcSet: "/page-visuals/x.webp 640w", heroPhotoSizes: '"100vw"' }]),
    ).toThrow("Route services must keep heroPhotoSizes free of quote or angle characters.");
    expect(() =>
      requireRouteRegistry([{ ...servicesRoute, heroPhotoSrcSet: "/page-visuals/x.webp 640w", heroPhotoSizes: "" }]),
    ).toThrow("Route services must declare a nonempty heroPhotoSizes string.");
  });
});

describe("requireRouteRegistry canonical route hrefs", () => {
  it("accepts the site root and valid nested trailing-slash directory routes", () => {
    const nestedRoute = fixtureRoute(
      "nested",
      "/tjanster/stensattning/",
      "/page-visuals/svard-entreprenad-stensattning.svg",
    );

    expect(staticSubpagePaths([homeRoute, nestedRoute, servicesRoute])).toEqual([
      "/tjanster/stensattning/",
      "/tjanster/",
    ]);
    expect(routeVisualAssetPaths([homeRoute, nestedRoute, servicesRoute])).toEqual([
      "/page-visuals/svard-entreprenad-home.svg",
      "/page-visuals/svard-entreprenad-stensattning.svg",
      "/page-visuals/svard-entreprenad-services.svg",
    ]);
  });

  it("rejects dot segments with a diagnostic naming the route", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("escape", "/kontakt/../kontakt/", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow('Route escape must not contain "." or ".." path segments.');
  });

  it("rejects percent-encoded separators and dots", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("encoded", "/kontakt%2fhidden/", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow("Route encoded must avoid percent-encoded sequences that can hide separators or dots.");
    expect(() =>
      requireRouteRegistry([fixtureRoute("encodedDots", "/%2e%2e/secret/", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow("Route encodedDots must avoid percent-encoded sequences that can hide separators or dots.");
  });

  it("rejects backslash separators", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("windows", "/windows\\kontakt/", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow('Route windows must use "/" directory separators; backslashes are not canonical route paths.');
  });

  it("rejects query and fragment forms", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("query", "/kontakt/?from=nav", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow("Route query must be a plain directory path without query or fragment text.");
    expect(() =>
      requireRouteRegistry([fixtureRoute("fragment", "/kontakt/#top", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow("Route fragment must be a plain directory path without query or fragment text.");
  });

  it("rejects repeated separators", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("leading", "//kontakt/", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow('Route leading must use single "/" separators without repeated slashes.');
    expect(() =>
      requireRouteRegistry([fixtureRoute("trailing", "/kontakt//", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow('Route trailing must use single "/" separators without repeated slashes.');
  });

  it("rejects hrefs without the trailing directory slash", () => {
    expect(() =>
      requireRouteRegistry([fixtureRoute("bare", "/kontakt", "/page-visuals/svard-entreprenad-x.svg")]),
    ).toThrow('Route bare must end with "/" so the static build emits a directory index page.');
  });

  it("rejects two declared routes that emit the same subpage destination", () => {
    expect(() =>
      requireRouteRegistry([
        fixtureRoute("contact", "/kontakt/", "/page-visuals/svard-entreprenad-contact.svg"),
        fixtureRoute("contact-copy", "/kontakt/", "/page-visuals/svard-entreprenad-copy.svg"),
      ]),
    ).toThrow(
      "Route contact-copy and Route contact both emit dist/kontakt/index.html; " +
        "routes must declare unique static output destinations.",
    );
  });

  it("rejects a second declared route for the site root", () => {
    expect(() =>
      requireRouteRegistry([
        homeRoute,
        fixtureRoute("home-copy", "/", "/page-visuals/svard-entreprenad-copy.svg"),
      ]),
    ).toThrow(
      "Route home-copy and Route home both emit dist/index.html; " +
        "routes must declare unique static output destinations.",
    );
  });
});

describe("assertStaticRouteArtifacts", () => {
  it("requires every declared non-root route artifact to carry its registry-derived title and description", async () => {
    const fileSystem = memoryFileSystem(distEntries(fixtureRoutes));

    await expect(
      assertStaticRouteArtifacts({ routes: fixtureRoutes, distDir: "dist", readFile: fileSystem.readFile }),
    ).resolves.toEqual(["/tjanster/", "/kontakt/"]);

    expect(fileSystem.readFile).toHaveBeenCalledWith(path.join("dist", "index.html"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledWith(notFoundArtifactFile("dist"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledWith(subpageArtifactPath("dist", "/tjanster/"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledWith(subpageArtifactPath("dist", "/kontakt/"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledTimes(4);
  });

  it("requires the artifact of an added fixture route automatically", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: [...fixtureRoutes, addedRoute],
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(fixtureRoutes)).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (missing: /nyheter/).");
  });

  it("stops requiring the artifact of a removed fixture route", async () => {
    const remainingRoutes = fixtureRoutes.filter((route) => route !== contactRoute);
    const fileSystem = memoryFileSystem(distEntries(fixtureRoutes));

    await expect(
      assertStaticRouteArtifacts({ routes: remainingRoutes, distDir: "dist", readFile: fileSystem.readFile }),
    ).resolves.toEqual(["/tjanster/"]);
    expect(fileSystem.readFile).not.toHaveBeenCalledWith(subpageArtifactPath("dist", "/kontakt/"), "utf8");
  });

  it("fails descriptively when a declared route artifact carries the root title or description instead of the route metadata", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(fixtureRoutes, { mismatched: ["/kontakt/"] })).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");
  });

  it("rejects a subpage artifact whose social card tags still carry the root text", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = subpageHtmlWithRootSocialTags(servicesRoute);

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects a subpage artifact missing its social card meta tags", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/kontakt/")] = subpageHtmlWithoutSocialTags(contactRoute);

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");
  });

  it("rejects a subpage artifact whose og:image still carries the home hero photo", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = emittedSubpageHtml(servicesRoute).replace(
      '<meta property="og:image" content="/page-visuals/services-hero.webp">',
      '<meta property="og:image" content="/page-visuals/hero-photo.webp">',
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects a subpage artifact whose twitter:image diverges from the route's declared hero photo", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/kontakt/")] = emittedSubpageHtml(contactRoute).replace(
      '<meta name="twitter:image" content="/page-visuals/contact-hero.webp">',
      '<meta name="twitter:image" content="/page-visuals/services-hero.webp">',
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");
  });

  it("rejects a subpage artifact whose og:image:alt still carries the home hero text", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = emittedSubpageHtml(servicesRoute).replace(
      '<meta property="og:image:alt" content="services alt">',
      '<meta property="og:image:alt" content="Grävmaskin på en mark- och anläggningsplats i solnedgång">',
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("requires the shared home hero social image for a route with a declared SVG hero", async () => {
    const routes = [homeRoute, svgHeroRoute];
    const entries = distEntries(routes);
    const emitted = await assertStaticRouteArtifacts({ routes, distDir: "dist", readFile: memoryFileSystem(entries).readFile });

    expect(emitted).toEqual(["/svghero/"]);
    expect(entries[subpageArtifactPath("dist", "/svghero/")]).toContain(
      '<meta property="og:image" content="/page-visuals/hero-photo.webp">',
    );
    expect(entries[subpageArtifactPath("dist", "/svghero/")]).toContain(
      '<meta name="twitter:image" content="/page-visuals/hero-photo.webp">',
    );
    expect(entries[subpageArtifactPath("dist", "/svghero/")]).toContain(
      '<meta property="og:image:alt" content="svghero – Svärd Entreprenad">',
    );
  });

  it("fails when an artifact carries the expected title but a stale description", async () => {
    const staleDescription = { ...servicesRoute, summary: "Föråldrad tjänstesammanfattning." };
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = emittedSubpageHtml(staleDescription);

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("validates metadata that required HTML attribute escaping in the emitted document", async () => {
    const specialRoute = {
      ...fixtureRoute("special", "/special/", "/page-visuals/svard-entreprenad-special.svg"),
      label: 'Mark & "tryggt" hantverk',
      summary: 'Sida med & tecken, <huggning> och "citat" i sammanfattningen.',
    };
    const entries = {
      [path.join("dist", "index.html")]: rootHtml,
      [notFoundArtifactFile("dist")]: emittedNotFoundHtml(),
    };
    entries[subpageArtifactPath("dist", specialRoute.href)] = emittedSubpageHtml(specialRoute);

    const emitted = entries[subpageArtifactPath("dist", specialRoute.href)];
    expect(emitted).toContain(
      "<title>Mark &amp; &quot;tryggt&quot; hantverk – Svärd Entreprenad</title>",
    );
    expect(emitted).toContain(
      '<meta name="description" content="Sida med &amp; tecken, &lt;huggning&gt; och &quot;citat&quot; i sammanfattningen.">',
    );
    expect(emitted).toContain(
      '<meta property="og:title" content="Mark &amp; &quot;tryggt&quot; hantverk – Svärd Entreprenad">',
    );
    expect(emitted).toMatch(
      /property="og:description"\s+content="Sida med &amp; tecken, &lt;huggning&gt; och &quot;citat&quot; i sammanfattningen\."/,
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: [homeRoute, specialRoute],
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).resolves.toEqual([specialRoute.href]);
  });

  it("requires the root document to keep a title and a description meta", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem({ [path.join("dist", "index.html")]: rootDocumentWithoutMetadata }).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: the root document must keep a <title> element and a nonempty description meta content attribute.",
    );

    const rootWithoutDescription =
      '<!doctype html><html lang="sv"><head><title>Svärd Entreprenad</title></head><body>Svard Entreprenad</body></html>';

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem({ [path.join("dist", "index.html")]: rootWithoutDescription }).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: the root document must keep a <title> element and a nonempty description meta content attribute.",
    );
  });

  it("requires the not-found recovery artifact at dist/404.html", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(fixtureRoutes, { notFound: "omit" })).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: the not-found recovery document dist/404.html is missing.",
    );
  });

  it("rejects a not-found artifact carrying the root metadata instead of the not-found title and description", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(fixtureRoutes, { notFound: "mismatched" })).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: dist/404.html must carry the not-found title and description instead of the root document metadata.",
    );
  });

  it("requires the root document to carry the home hero preload link", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[path.join("dist", "index.html")] = rootHtml.replace(homeHeroPreloadLink, "");

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: the root document must carry the home hero preload link for /page-visuals/hero-photo.webp.",
    );
  });

  it("rejects a subpage artifact that still carries the home hero preload link", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = applyRouteDocumentMetadata(
      rootHtml,
      routePageMetadata(servicesRoute),
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects a subpage artifact that preloads another route's hero photo instead of its own", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/kontakt/")] = injectRouteHeroPreload(
      stripHomeHeroPreload(applyRouteDocumentMetadata(rootHtml, routePageMetadata(contactRoute))),
      routeHeroPreloadHref(servicesRoute),
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");
  });

  it("requires the imagesrcset/imagesizes-enriched preload link for a route with declared hero variants", async () => {
    const routes = [homeRoute, responsiveServicesRoute, contactRoute];
    const fileSystem = memoryFileSystem(distEntries(routes));
    const emitted = await assertStaticRouteArtifacts({ routes, distDir: "dist", readFile: fileSystem.readFile });

    expect(emitted).toEqual(["/tjanster/", "/kontakt/"]);
    expect(fileSystem.readFile).toHaveBeenCalledWith(subpageArtifactPath("dist", "/tjanster/"), "utf8");
    expect(distEntries(routes)[subpageArtifactPath("dist", "/tjanster/")]).toContain(routeHeroPreloadLinkTag(responsiveServicesRoute));
  });

  it("rejects a plain preload link on a document whose route declares responsive hero variants", async () => {
    const routes = [homeRoute, responsiveServicesRoute, contactRoute];
    const entries = distEntries(routes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = emittedSubpageHtml(servicesRoute);

    await expect(
      assertStaticRouteArtifacts({
        routes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects an enriched preload link whose srcset no longer matches the route declaration", async () => {
    const routes = [homeRoute, responsiveServicesRoute, contactRoute];
    const entries = distEntries(routes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = injectRouteHeroPreload(
      stripHomeHeroPreload(applyRouteDocumentMetadata(rootHtml, routePageMetadata(responsiveServicesRoute))),
      routeHeroPreloadHref(responsiveServicesRoute),
      "/page-visuals/services-hero-640.webp 640w",
      "100vw",
    );

    await expect(
      assertStaticRouteArtifacts({
        routes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects a subpage artifact without any hero preload link", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[subpageArtifactPath("dist", "/tjanster/")] = stripHomeHeroPreload(
      applyRouteDocumentMetadata(rootHtml, routePageMetadata(servicesRoute)),
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("rejects a not-found artifact carrying a non-home image preload link", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[notFoundArtifactFile("dist")] = injectRouteHeroPreload(
      applyRouteDocumentMetadata(rootHtml, notFoundPageMetadata()),
      routeHeroPreloadHref(servicesRoute),
    );

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed: dist/404.html must not carry any image preload link.");
  });

  it("rejects a not-found artifact that still carries the home hero preload link", async () => {
    const entries = distEntries(fixtureRoutes);
    entries[notFoundArtifactFile("dist")] = applyRouteDocumentMetadata(rootHtml, notFoundPageMetadata());

    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed: dist/404.html must not carry any image preload link.");
  });

  it("fails for a declared route without page metadata fields before reading artifacts", async () => {
    const unlabeledRoute = {
      id: "unlabeled",
      kind: "service",
      href: "/unlabeled/",
      heroPhotoAssetPath: "/page-visuals/unlabeled-hero.webp",
      visual: { assetPath: "/page-visuals/svard-entreprenad-unlabeled.svg" },
    };
    const readFile = vi.fn();

    await expect(
      assertStaticRouteArtifacts({
        routes: [homeRoute, unlabeledRoute],
        distDir: "dist",
        readFile,
      }),
    ).rejects.toThrow("Route unlabeled must declare a nonempty label string for page metadata.");
    expect(readFile).not.toHaveBeenCalled();
  });

  it("reports missing and mismatched routes together in declared route order", async () => {
    const routes = [homeRoute, contactRoute, servicesRoute];

    await expect(
      assertStaticRouteArtifacts({
        routes,
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(routes, { omit: ["/kontakt/"], mismatched: ["/tjanster/"] }))
          .readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (missing: /kontakt/; mismatched: /tjanster/).");
  });

  it("propagates filesystem errors other than missing route artifacts", async () => {
    const denied = Object.assign(new Error("EACCES: permission denied, open"), { code: "EACCES" });
    const readFile = vi.fn(async (filePath) => {
      if (filePath === subpageArtifactPath("dist", "/kontakt/")) throw denied;
      if (filePath === notFoundArtifactFile("dist")) return emittedNotFoundHtml();
      return rootHtml;
    });

    await expect(
      assertStaticRouteArtifacts({ routes: fixtureRoutes, distDir: "dist", readFile }),
    ).rejects.toThrow(denied);
  });
});

describe("routePageMetadata", () => {
  it("composes the declared Swedish title and the registry summary verbatim", () => {
    expect(routePageMetadata(servicesRoute)).toEqual({
      title: "services – Svärd Entreprenad",
      description: "services summary",
      socialImage: { assetPath: "/page-visuals/services-hero.webp", alt: "services alt" },
    });
  });

  it("falls back to the shared raster home hero for a route with a declared SVG hero", () => {
    expect(routePageMetadata(svgHeroRoute)).toEqual({
      title: "svghero – Svärd Entreprenad",
      description: "svghero summary",
      socialImage: { assetPath: "/page-visuals/hero-photo.webp", alt: "svghero – Svärd Entreprenad" },
    });
  });

  it("rejects routes without a nonempty label or summary", () => {
    expect(() => routePageMetadata({ id: "broken", href: "/broken/" })).toThrow(
      "Route broken must declare a nonempty label string for page metadata.",
    );
    expect(() => routePageMetadata({ id: "broken", href: "/broken/", label: "Broken" })).toThrow(
      "Route broken must declare a nonempty summary string for page metadata.",
    );
    expect(() => routePageMetadata({ id: "broken", href: "/broken/", label: "  " })).toThrow(
      "Route broken must declare a nonempty label string for page metadata.",
    );
  });

  it("rejects a raster-hero route without a registry-declared visual alt for the social card image", () => {
    expect(() =>
      routePageMetadata({
        id: "altless",
        href: "/altless/",
        label: "Altless",
        summary: "altless summary",
        heroPhotoAssetPath: "/page-visuals/altless-hero.webp",
      }),
    ).toThrow("Route altless must declare a nonempty visual alt string for the social card image.");
    expect(() =>
      routePageMetadata({
        id: "altless",
        href: "/altless/",
        label: "Altless",
        summary: "altless summary",
        heroPhotoAssetPath: "/page-visuals/altless-hero.webp",
        visual: { assetPath: "/page-visuals/svard-entreprenad-altless.svg", alt: "  " },
      }),
    ).toThrow("Route altless must declare a nonempty visual alt string for the social card image.");
  });
});

describe("applyRouteDocumentMetadata", () => {
  it("replaces the root title, description and social card tags while preserving the rest of the document", () => {
    const emitted = applyRouteDocumentMetadata(rootHtml, routePageMetadata(contactRoute));

    expect(emitted).toContain("<title>contact – Svärd Entreprenad</title>");
    expect(emitted).toContain('<meta name="description" content="contact summary">');
    expect(emitted).toContain('<meta property="og:title" content="contact – Svärd Entreprenad">');
    expect(emitted).toMatch(/property="og:description"\s+content="contact summary"/);
    expect(emitted).toContain('<meta name="twitter:title" content="contact – Svärd Entreprenad">');
    expect(emitted).toMatch(/name="twitter:description"\s+content="contact summary"/);
    expect(emitted).not.toContain(rootTitle);
    expect(emitted).not.toContain(rootDescription);
    expect(emitted).toContain('<meta property="og:type" content="website">');
    expect(emitted).toContain('<meta property="og:locale" content="sv_SE">');
    expect(emitted).toContain('<meta property="og:site_name" content="Svärd Entreprenad">');
    expect(emitted).toContain('<meta property="og:image" content="/page-visuals/contact-hero.webp">');
    expect(emitted).toContain('<meta property="og:image:width" content="1600">');
    expect(emitted).toContain('<meta property="og:image:height" content="905">');
    expect(emitted).toContain('<meta property="og:image:alt" content="contact alt">');
    expect(emitted).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(emitted).toContain('<meta name="twitter:image" content="/page-visuals/contact-hero.webp">');
    expect(emitted).toContain(homeHeroPreloadLink);
    expect(emitted).toContain("<body>Svard Entreprenad</body>");
    expect(emitted).toMatch(/^<!doctype html>/);
  });

  it("substitutes the shared home hero photo and page-title alt for a route with a declared SVG hero", () => {
    const emitted = applyRouteDocumentMetadata(rootHtml, routePageMetadata(svgHeroRoute));

    expect(emitted).toContain('<meta property="og:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).toContain('<meta property="og:image:alt" content="svghero – Svärd Entreprenad">');
    expect(emitted).toContain('<meta name="twitter:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).not.toContain("/page-visuals/inhyrning-hero.svg");
  });

  it("rejects a document without a title element or a description meta", () => {
    expect(() =>
      applyRouteDocumentMetadata("<html><body>inga metadatataggar</body></html>", {
        title: "Titel",
        description: "Beskrivning",
      }),
    ).toThrow("Route document must contain a <title> element to replace.");
    expect(() =>
      applyRouteDocumentMetadata("<html><head><title>Titel</title></head></html>", {
        title: "Titel",
        description: "Beskrivning",
      }),
    ).toThrow("Route document must contain a description meta tag with a content attribute to replace.");
  });

  it("rejects a document without the global social card meta tags", () => {
    expect(() =>
      applyRouteDocumentMetadata(rootHtmlWithoutSocialTags, {
        title: "Titel",
        description: "Beskrivning",
      }),
    ).toThrow(
      "Route document must contain og:title, og:description, twitter:title and twitter:description meta tags with content attributes to replace.",
    );
  });

  it("rejects metadata without nonempty title and description strings", () => {
    expect(() => applyRouteDocumentMetadata(rootHtml, { title: "", description: "Beskrivning" })).toThrow(
      "Route page metadata requires nonempty title and description strings.",
    );
    expect(() => applyRouteDocumentMetadata(rootHtml, { title: "Titel", description: "" })).toThrow(
      "Route page metadata requires nonempty title and description strings.",
    );
  });

  it("rejects metadata whose social card image lacks a nonempty path or alt", () => {
    expect(() =>
      applyRouteDocumentMetadata(rootHtml, {
        title: "Titel",
        description: "Beskrivning",
        socialImage: { assetPath: "", alt: "Alttext" },
      }),
    ).toThrow("Route page metadata requires a social card image with nonempty assetPath and alt strings.");
    expect(() =>
      applyRouteDocumentMetadata(rootHtml, {
        title: "Titel",
        description: "Beskrivning",
        socialImage: { assetPath: "/page-visuals/services-hero.webp" },
      }),
    ).toThrow("Route page metadata requires a social card image with nonempty assetPath and alt strings.");
  });
});

describe("stripHomeHeroPreload", () => {
  it("removes the home hero preload link and keeps the rest of the document unchanged", () => {
    const document =
      '<!doctype html><html lang="sv"><head>' +
      homeHeroPreloadLink +
      "<title>Titel</title>" +
      "</head><body>Svard Entreprenad</body></html>";

    expect(stripHomeHeroPreload(document)).toBe(
      '<!doctype html><html lang="sv"><head><title>Titel</title></head><body>Svard Entreprenad</body></html>',
    );
  });

  it("removes the hero preload link regardless of attribute order or extra attributes", () => {
    const document =
      "<html><head>" +
      '<link href="/page-visuals/hero-photo.webp" rel="preload" as="image" fetchpriority="high" media="all">' +
      "</head></html>";

    expect(stripHomeHeroPreload(document)).toBe("<html><head></head></html>");
  });

  it("leaves a document without the home hero preload unchanged, including other preload links", () => {
    const document =
      "<html><head>" +
      '<link rel="preload" as="image" href="/page-visuals/other-photo.webp" fetchpriority="high">' +
      '<link rel="preload" as="font" href="/fonts/inter.woff2">' +
      '<link rel="stylesheet" href="/styles.css">' +
      "</head><body>Svard Entreprenad</body></html>";

    expect(stripHomeHeroPreload(document)).toBe(document);
    expect(stripHomeHeroPreload("")).toBe("");
  });
});

describe("routeHeroPreloadHref", () => {
  it("returns the declared hero photo asset path verbatim for a valid route", () => {
    expect(routeHeroPreloadHref(fixtureRoute("services", "/tjanster/", "/page-visuals/svard-entreprenad-services.svg"))).toBe(
      "/page-visuals/services-hero.webp",
    );
    expect(
      routeHeroPreloadHref(fixtureRoute("custom", "/custom/", "/page-visuals/svard-entreprenad-custom.svg", "/page-visuals/custom-hero.webp")),
    ).toBe("/page-visuals/custom-hero.webp");
  });

  it("rejects routes without a nonempty root-relative heroPhotoAssetPath", () => {
    expect(() => routeHeroPreloadHref({ id: "broken", href: "/broken/" })).toThrow(
      "Route broken must declare a nonempty heroPhotoAssetPath string.",
    );
    expect(() => routeHeroPreloadHref({ id: "broken", heroPhotoAssetPath: "" })).toThrow(
      "Route broken must declare a nonempty heroPhotoAssetPath string.",
    );
    expect(() => routeHeroPreloadHref({ id: "broken", heroPhotoAssetPath: "page-visuals/hero.webp" })).toThrow(
      'Route broken must declare a root-relative heroPhotoAssetPath starting with "/".',
    );
  });

  it("rejects heroPhotoAssetPath values that cannot render inside a quoted href attribute", () => {
    expect(() =>
      routeHeroPreloadHref({ id: "spaced", heroPhotoAssetPath: "/page-visuals/hero photo.webp" }),
    ).toThrow("Route spaced must keep heroPhotoAssetPath free of whitespace and quote or angle characters.");
    expect(() =>
      routeHeroPreloadHref({ id: "quoted", heroPhotoAssetPath: '/page-visuals/hero".webp' }),
    ).toThrow("Route quoted must keep heroPhotoAssetPath free of whitespace and quote or angle characters.");
    expect(() =>
      routeHeroPreloadHref({ id: "windows", heroPhotoAssetPath: "\\page-visuals\\hero.webp" }),
    ).toThrow('Route windows must use "/" directory separators in heroPhotoAssetPath.');
  });

  it("makes the registry validation reject a declared route without hero metadata", () => {
    expect(() =>
      requireRouteRegistry([
        {
          id: "heroless",
          kind: "service",
          label: "Heroless",
          href: "/heroless/",
          summary: "heroless summary",
          visual: { assetPath: "/page-visuals/svard-entreprenad-heroless.svg", alt: "heroless alt", intent: "heroless intent" },
        },
      ]),
    ).toThrow("Route heroless must declare a nonempty heroPhotoAssetPath string.");
  });
});

describe("injectRouteHeroPreload", () => {
  it("injects the route's own high-priority preload link directly before the head-close tag", () => {
    const document =
      '<!doctype html><html lang="sv"><head><title>Titel</title></head><body>Svard Entreprenad</body></html>';

    expect(injectRouteHeroPreload(document, "/page-visuals/services-hero.webp")).toBe(
      '<!doctype html><html lang="sv"><head><title>Titel</title>' +
        '<link rel="preload" as="image" href="/page-visuals/services-hero.webp" fetchpriority="high" /></head>' +
        "<body>Svard Entreprenad</body></html>",
    );
  });

  it("injects after the home preload is stripped without disturbing the rest of the document", () => {
    const document =
      '<html><head><meta charset="UTF-8">' + homeHeroPreloadLink + "</head><body>Svard Entreprenad</body></html>";
    const stamped = injectRouteHeroPreload(stripHomeHeroPreload(document), "/page-visuals/about-hero.webp");

    expect(stamped).toContain(
      '<link rel="preload" as="image" href="/page-visuals/about-hero.webp" fetchpriority="high" />',
    );
    expect(stamped).not.toContain("hero-photo.webp");
    expect(stamped).toContain('<meta charset="UTF-8">');
    expect(stamped).toContain("<body>Svard Entreprenad</body>");
  });

  it("rejects an empty document, a document without </head>, and an invalid asset path", () => {
    expect(() => injectRouteHeroPreload("", "/page-visuals/hero.webp")).toThrow(
      "Route hero preload injection requires a nonempty document string.",
    );
    expect(() => injectRouteHeroPreload("<html><body>inget huvud</body></html>", "/page-visuals/hero.webp")).toThrow(
      "Route document must contain a </head> element to host the injected hero preload link.",
    );
    expect(() => injectRouteHeroPreload("<html><head></head></html>", "relative/hero.webp")).toThrow(
      'Route hero preload injection requires a heroPhotoAssetPath that must declare a root-relative heroPhotoAssetPath starting with "/".',
    );
  });

  it("injects the declared imagesrcset and imagesizes for a route with responsive hero variants", () => {
    const document =
      '<!doctype html><html lang="sv"><head><title>Titel</title></head><body>Svard Entreprenad</body></html>';

    expect(
      injectRouteHeroPreload(
        document,
        "/page-visuals/services-hero.webp",
        responsiveServicesSrcSet,
        "100vw",
      ),
    ).toBe(
      '<!doctype html><html lang="sv"><head><title>Titel</title>' +
        '<link rel="preload" as="image" href="/page-visuals/services-hero.webp" ' +
        `imagesrcset="${responsiveServicesSrcSet}" ` +
        'imagesizes="100vw" fetchpriority="high" /></head>' +
        "<body>Svard Entreprenad</body></html>",
    );
  });

  it("rejects a declared srcset without its matching sizes declaration", () => {
    expect(() =>
      injectRouteHeroPreload("<html><head></head></html>", "/page-visuals/services-hero.webp", "/page-visuals/services-hero-640.webp 640w"),
    ).toThrow(
      "Route hero preload injection requires hero image fields that must declare heroPhotoSrcSet and heroPhotoSizes together.",
    );
    expect(() =>
      injectRouteHeroPreload("<html><head></head></html>", "/page-visuals/services-hero.webp", undefined, "100vw"),
    ).toThrow(
      "Route hero preload injection requires hero image fields that must declare heroPhotoSrcSet and heroPhotoSizes together.",
    );
  });
});

describe("routeHeroPreloadLinkTag", () => {
  it("keeps the plain high-priority link for routes without declared variants", () => {
    expect(routeHeroPreloadLinkTag(servicesRoute)).toBe(
      '<link rel="preload" as="image" href="/page-visuals/services-hero.webp" fetchpriority="high" />',
    );
  });

  it("enriches the link with imagesrcset and imagesizes, byte-identical to the injected emission", () => {
    expect(routeHeroPreloadLinkTag(responsiveServicesRoute)).toBe(
      '<link rel="preload" as="image" href="/page-visuals/services-hero.webp" ' +
        `imagesrcset="${responsiveServicesSrcSet}" imagesizes="100vw" fetchpriority="high" />`,
    );
    expect(
      injectRouteHeroPreload(
        "<html><head></head></html>",
        routeHeroPreloadHref(responsiveServicesRoute),
        routeHeroPreloadImageSrcSet(responsiveServicesRoute),
        routeHeroPreloadImageSizes(responsiveServicesRoute),
      ),
    ).toBe(`<html><head>${routeHeroPreloadLinkTag(responsiveServicesRoute)}</head></html>`);
  });

  it("returns undeclared hero image fields as undefined and declared ones verbatim", () => {
    expect(routeHeroPreloadImageSrcSet(contactRoute)).toBeUndefined();
    expect(routeHeroPreloadImageSizes(contactRoute)).toBeUndefined();
    expect(routeHeroPreloadImageSrcSet(responsiveServicesRoute)).toBe(responsiveServicesSrcSet);
    expect(routeHeroPreloadImageSizes(responsiveServicesRoute)).toBe("100vw");
  });
});

describe("notFoundPageMetadata", () => {
  it("composes the Swedish not-found title and description from the site name", () => {
    expect(notFoundPageMetadata()).toEqual({
      title: "Sidan finns inte – Svärd Entreprenad",
      description: "Sidan du sökte matchar ingen aktuell sida. Välj en av genvägarna eller kontakta oss för offert.",
    });
  });

  it("emits a valid 404.html document carrying the not-found metadata over the root document", () => {
    const emitted = applyRouteDocumentMetadata(rootHtml, notFoundPageMetadata());

    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted).toContain("<title>Sidan finns inte – Svärd Entreprenad</title>");
    expect(emitted).toContain(
      '<meta name="description" content="Sidan du sökte matchar ingen aktuell sida. Välj en av genvägarna eller kontakta oss för offert.">',
    );
    expect(emitted).not.toContain("Svärd Entreprenad – Mark & anläggning i Örebro");
    expect(emitted).toContain('<meta property="og:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).toContain(
      '<meta property="og:image:alt" content="Grävmaskin på en mark- och anläggningsplats i solnedgång">',
    );
    expect(emitted).toContain('<meta name="twitter:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).toContain("<body>Svard Entreprenad</body>");
    expect(emitted).toMatch(/^<!doctype html>/);
  });
});

describe("assertRouteVisualAssets", () => {
  it("requires every declared route visual and hero asset to resolve under public/page-visuals", async () => {
    const fileSystem = memoryFileSystem(publicEntries(fixtureRoutes));

    await expect(
      assertRouteVisualAssets({ routes: fixtureRoutes, publicDir: "public", access: fileSystem.access }),
    ).resolves.toEqual({
      visualAssets: [
        "/page-visuals/svard-entreprenad-home.svg",
        "/page-visuals/svard-entreprenad-services.svg",
        "/page-visuals/svard-entreprenad-contact.svg",
      ],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/services-hero.webp", "/page-visuals/contact-hero.webp"],
      socialCardImages: ["/page-visuals/services-hero.webp", "/page-visuals/contact-hero.webp"],
    });

    expect(fileSystem.access).toHaveBeenCalledWith(
      publicAssetPath("public", "/page-visuals/svard-entreprenad-contact.svg"),
    );
    expect(fileSystem.access).toHaveBeenCalledWith(publicAssetPath("public", "/page-visuals/contact-hero.webp"));
    expect(fileSystem.access).toHaveBeenCalledTimes(8);
  });

  it("rejects a declared route hero asset that is missing under public/ with a clear message", async () => {
    const entries = publicEntries(fixtureRoutes);
    delete entries[publicAssetPath("public", "/page-visuals/contact-hero.webp")];

    await expect(
      assertRouteVisualAssets({ routes: fixtureRoutes, publicDir: "public", access: memoryFileSystem(entries).access }),
    ).rejects.toThrow(
      "Route visual asset check failed " +
        "(missing: /page-visuals/contact-hero.webp; missing heroes: /page-visuals/contact-hero.webp).",
    );
  });

  it("requires the visual of an added fixture route automatically", async () => {
    await expect(
      assertRouteVisualAssets({
        routes: [...fixtureRoutes, addedRoute],
        publicDir: "public",
        access: memoryFileSystem(publicEntries(fixtureRoutes)).access,
      }),
    ).rejects.toThrow(
      "Route visual asset check failed " +
        "(missing: /page-visuals/svard-entreprenad-nyheter.svg, /page-visuals/nyheter-hero.webp; missing heroes: /page-visuals/nyheter-hero.webp).",
    );
  });

  it("requires the shared home hero file when a route's social card image falls back to it", async () => {
    const routes = [homeRoute, svgHeroRoute];
    const entries = publicEntries(routes);
    delete entries[publicAssetPath("public", "/page-visuals/hero-photo.webp")];

    await expect(
      assertRouteVisualAssets({ routes, publicDir: "public", access: memoryFileSystem(entries).access }),
    ).rejects.toThrow("Route visual asset check failed (missing: /page-visuals/hero-photo.webp).");
  });

  it("passes when every emitted social card image exists beside the route visuals", async () => {
    const routes = [homeRoute, svgHeroRoute];

    expect(routeSocialCardImagePaths(routes)).toEqual(["/page-visuals/hero-photo.webp"]);

    await expect(
      assertRouteVisualAssets({ routes, publicDir: "public", access: memoryFileSystem(publicEntries(routes)).access }),
    ).resolves.toEqual({
      visualAssets: ["/page-visuals/svard-entreprenad-home.svg", "/page-visuals/svard-entreprenad-svghero.svg"],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/inhyrning-hero.svg"],
      socialCardImages: ["/page-visuals/hero-photo.webp"],
    });
  });

  it("requires every declared hero srcset candidate file to exist under public/", async () => {
    const routes = [homeRoute, responsiveServicesRoute];

    expect(routeHeroSrcSetCandidatePaths(routes)).toEqual([
      "/page-visuals/services-hero-640.webp",
      "/page-visuals/services-hero-960.webp",
      "/page-visuals/services-hero.webp",
    ]);

    await expect(
      assertRouteVisualAssets({
        routes,
        publicDir: "public",
        access: memoryFileSystem(publicEntries(routes)).access,
      }),
    ).rejects.toThrow(
      "Route visual asset check failed (missing: " +
        "/page-visuals/services-hero-640.webp, /page-visuals/services-hero-960.webp).",
    );
  });

  it("passes when every declared hero srcset candidate exists beside the route visuals", async () => {
    const routes = [homeRoute, responsiveServicesRoute];
    const entries = {
      ...publicEntries(routes),
      [publicAssetPath("public", "/page-visuals/services-hero-640.webp")]: "<webp>",
      [publicAssetPath("public", "/page-visuals/services-hero-960.webp")]: "<webp>",
    };

    await expect(
      assertRouteVisualAssets({ routes, publicDir: "public", access: memoryFileSystem(entries).access }),
    ).resolves.toEqual({
      visualAssets: [
        "/page-visuals/svard-entreprenad-home.svg",
        "/page-visuals/svard-entreprenad-services.svg",
      ],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/services-hero.webp"],
      socialCardImages: ["/page-visuals/services-hero.webp"],
    });
  });

  it("stops requiring the visual of a removed fixture route", async () => {
    const remainingRoutes = fixtureRoutes.filter((route) => route !== contactRoute);
    const fileSystem = memoryFileSystem(publicEntries(fixtureRoutes));

    await expect(
      assertRouteVisualAssets({ routes: remainingRoutes, publicDir: "public", access: fileSystem.access }),
    ).resolves.toEqual({
      visualAssets: [
        "/page-visuals/svard-entreprenad-home.svg",
        "/page-visuals/svard-entreprenad-services.svg",
      ],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/services-hero.webp"],
      socialCardImages: ["/page-visuals/services-hero.webp"],
    });
    expect(fileSystem.access).not.toHaveBeenCalledWith(
      publicAssetPath("public", "/page-visuals/svard-entreprenad-contact.svg"),
    );
    expect(fileSystem.access).not.toHaveBeenCalledWith(
      publicAssetPath("public", "/page-visuals/contact-hero.webp"),
    );
  });

  it("fails when a declared visual asset path leaves the page-visuals SVG naming contract", async () => {
    const escapeRoute = fixtureRoute("escape", "/escape/", "/page-visuals/svard-entreprenad-../../secret.svg");
    const misplacedRoute = fixtureRoute("misplaced", "/misplaced/", "/images/svard-entreprenad-misplaced.png");

    await expect(
      assertRouteVisualAssets({
        routes: [...fixtureRoutes, escapeRoute, misplacedRoute],
        publicDir: "public",
        access: memoryFileSystem(publicEntries([...fixtureRoutes, escapeRoute, misplacedRoute])).access,
      }),
    ).rejects.toThrow(
      "Route visual asset check failed " +
        "(invalid: /page-visuals/svard-entreprenad-../../secret.svg, /images/svard-entreprenad-misplaced.png).",
    );
  });

  it("fails when two declared routes share one visual asset", async () => {
    const sharedRoute = fixtureRoute("shared", "/shared/", "/page-visuals/svard-entreprenad-contact.svg");

    await expect(
      assertRouteVisualAssets({
        routes: [...fixtureRoutes, sharedRoute],
        publicDir: "public",
        access: memoryFileSystem(publicEntries([...fixtureRoutes, sharedRoute])).access,
      }),
    ).rejects.toThrow(
      "Route visual asset check failed (duplicate: /page-visuals/svard-entreprenad-contact.svg).",
    );
  });

  it("propagates filesystem errors other than missing visual assets", async () => {
    const denied = Object.assign(new Error("EACCES: permission denied, access"), { code: "EACCES" });
    const access = vi.fn(async (filePath) => {
      if (filePath === publicAssetPath("public", "/page-visuals/svard-entreprenad-services.svg")) throw denied;
    });

    await expect(
      assertRouteVisualAssets({ routes: fixtureRoutes, publicDir: "public", access }),
    ).rejects.toThrow(denied);
  });

  it("rejects a declared hero asset exceeding the hero byte budget with its measured size", async () => {
    const routes = [homeRoute, servicesRoute];
    const entries = {
      ...publicEntries(routes),
      [publicAssetPath("public", "/page-visuals/services-hero.webp")]: "<hero>" + "x".repeat(heroAssetByteBudget - 5),
    };
    const fileSystem = memoryFileSystem(entries);

    await expect(
      assertRouteVisualAssets({ routes, publicDir: "public", access: fileSystem.access, stat: fileSystem.stat }),
    ).rejects.toThrow(
      `Route visual asset check failed (oversized: /page-visuals/services-hero.webp at ` +
        `${heroAssetByteBudget + 1} B exceeds the ${heroAssetByteBudget} B hero budget).`,
    );
    expect(fileSystem.stat).toHaveBeenCalledWith(publicAssetPath("public", "/page-visuals/services-hero.webp"));
  });

  it("passes declared hero assets sized within the hero byte budget when stat is provided", async () => {
    const fileSystem = memoryFileSystem(publicEntries(fixtureRoutes));

    await expect(
      assertRouteVisualAssets({ routes: fixtureRoutes, publicDir: "public", access: fileSystem.access, stat: fileSystem.stat }),
    ).resolves.toEqual({
      visualAssets: [
        "/page-visuals/svard-entreprenad-home.svg",
        "/page-visuals/svard-entreprenad-services.svg",
        "/page-visuals/svard-entreprenad-contact.svg",
      ],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/services-hero.webp", "/page-visuals/contact-hero.webp"],
      socialCardImages: ["/page-visuals/services-hero.webp", "/page-visuals/contact-hero.webp"],
    });
    expect(fileSystem.stat).toHaveBeenCalledTimes(3);
  });

  it("leaves hero sizes unchecked when no stat function is provided", async () => {
    const routes = [homeRoute, servicesRoute];
    const entries = {
      ...publicEntries(routes),
      [publicAssetPath("public", "/page-visuals/services-hero.webp")]: "<hero>" + "x".repeat(heroAssetByteBudget - 5),
    };
    const fileSystem = memoryFileSystem(entries);

    await expect(
      assertRouteVisualAssets({ routes, publicDir: "public", access: fileSystem.access }),
    ).resolves.toEqual({
      visualAssets: [
        "/page-visuals/svard-entreprenad-home.svg",
        "/page-visuals/svard-entreprenad-services.svg",
      ],
      heroAssets: ["/page-visuals/home-hero.webp", "/page-visuals/services-hero.webp"],
      socialCardImages: ["/page-visuals/services-hero.webp"],
    });
    expect(fileSystem.stat).not.toHaveBeenCalled();
  });
});

describe("siteContent route registry", () => {
  it("declares twelve canonical routes with unique subpage destinations and visuals", () => {
    expect(siteContent.routes).toHaveLength(12);
    expect(staticSubpagePaths(siteContent.routes)).toEqual([
      "/offertberakning/",
      "/draneringsberakning/",
      "/tjanster/",
      "/inhyrning/",
      "/om-oss/",
      "/stensattning/",
      "/markarbete/",
      "/gravjobb/",
      "/dranering/",
      "/tradgardsplanering/",
      "/kontakt/",
    ]);

    const assetPaths = routeVisualAssetPaths(siteContent.routes);
    expect(assetPaths).toHaveLength(12);
    expect(new Set(assetPaths).size).toBe(assetPaths.length);
  });

  it("declares one registry-owned hero photo per route for the rendered hero and the stamped preload", () => {
    const expectedHeroPhotosByRoute = new Map([
      ["quote", "/page-visuals/quote-hero.webp"],
      ["drainage-quote", "/page-visuals/draneringsberakning-hero.webp"],
      ["home", "/page-visuals/hero-photo.webp"],
      ["services", "/page-visuals/services-hero.webp"],
      ["about", "/page-visuals/svard-entreprenad-about.svg"],
      ["inhyrning", "/page-visuals/inhyrning-hero.svg"],
      ["stensattning", "/page-visuals/stensattning-photo.webp"],
      ["markarbete", "/page-visuals/markarbete-photo.webp"],
      ["gravjobb", "/page-visuals/gravjobb-photo.webp"],
      ["dranering", "/page-visuals/dranering-photo.webp"],
      ["tradgard", "/page-visuals/tradgard-generated.webp"],
      ["contact", "/page-visuals/svard-entreprenad-contact.svg"],
    ]);

    expect(new Set(siteContent.routes.map((route) => route.heroPhotoAssetPath)).size).toBe(12);

    for (const route of siteContent.routes) {
      expect(routeHeroPreloadHref(route)).toBe(expectedHeroPhotosByRoute.get(route.id));
    }

    expect(routeHeroPreloadHref(siteContent.routes.find((route) => route.id === "home"))).toBe("/page-visuals/hero-photo.webp");
  });

  it("declares responsive variants on the seven migrated hero routes plus services and drainage-quote and keeps heroPhotoAssetPath the declared base", () => {
    const expectedSrcSetsByRoute = new Map([
      ["quote", "/page-visuals/quote-hero-640.webp 640w, /page-visuals/quote-hero-960.webp 960w, /page-visuals/quote-hero.webp 1672w"],
      ["drainage-quote", "/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/draneringsberakning-hero.webp 900w"],
      ["home", "/page-visuals/hero-photo-640.webp 640w, /page-visuals/hero-photo-960.webp 960w, /page-visuals/hero-photo.webp 1600w"],
      ["services", "/page-visuals/services-hero-640.webp 640w, /page-visuals/services-hero-960.webp 960w, /page-visuals/services-hero.webp 1672w"],
      ["stensattning", "/page-visuals/stensattning-photo-400.webp 400w, /page-visuals/stensattning-photo-640.webp 640w, /page-visuals/stensattning-photo.webp 900w"],
      ["markarbete", "/page-visuals/markarbete-photo-400.webp 400w, /page-visuals/markarbete-photo-640.webp 640w, /page-visuals/markarbete-photo.webp 900w"],
      ["gravjobb", "/page-visuals/gravjobb-photo-400.webp 400w, /page-visuals/gravjobb-photo-640.webp 640w, /page-visuals/gravjobb-photo.webp 900w"],
      ["dranering", "/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/dranering-photo.webp 900w"],
      ["tradgard", "/page-visuals/tradgard-generated-640.webp 640w, /page-visuals/tradgard-generated-960.webp 960w, /page-visuals/tradgard-generated.webp 1568w"],
    ]);

    expect(expectedSrcSetsByRoute.size).toBe(9);

    for (const route of siteContent.routes) {
      const expectedSrcSet = expectedSrcSetsByRoute.get(route.id);

      if (expectedSrcSet === undefined) {
        expect(routeHeroPreloadImageSrcSet(route)).toBeUndefined();
        expect(routeHeroPreloadImageSizes(route)).toBeUndefined();
      } else {
        expect(routeHeroPreloadImageSrcSet(route)).toBe(expectedSrcSet);
        expect(routeHeroPreloadImageSizes(route)).toBe("100vw");
        expect(routeHeroPreloadLinkTag(route)).toBe(
          `<link rel="preload" as="image" href="${route.heroPhotoAssetPath}" ` +
            `imagesrcset="${expectedSrcSet}" ` +
            'imagesizes="100vw" fetchpriority="high" />',
        );
      }
    }

    const drainageQuoteRoute = siteContent.routes.find((route) => route.id === "drainage-quote");

    expect(routeHeroPreloadLinkTag(drainageQuoteRoute)).toBe(
      '<link rel="preload" as="image" href="/page-visuals/draneringsberakning-hero.webp" ' +
        'imagesrcset="/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/draneringsberakning-hero.webp 900w" ' +
        'imagesizes="100vw" fetchpriority="high" />',
    );

    expect(routeHeroSrcSetCandidatePaths(siteContent.routes)).toEqual([
      "/page-visuals/quote-hero-640.webp",
      "/page-visuals/quote-hero-960.webp",
      "/page-visuals/quote-hero.webp",
      "/page-visuals/dranering-photo-400.webp",
      "/page-visuals/dranering-photo-640.webp",
      "/page-visuals/draneringsberakning-hero.webp",
      "/page-visuals/hero-photo-640.webp",
      "/page-visuals/hero-photo-960.webp",
      "/page-visuals/hero-photo.webp",
      "/page-visuals/services-hero-640.webp",
      "/page-visuals/services-hero-960.webp",
      "/page-visuals/services-hero.webp",
      "/page-visuals/stensattning-photo-400.webp",
      "/page-visuals/stensattning-photo-640.webp",
      "/page-visuals/stensattning-photo.webp",
      "/page-visuals/markarbete-photo-400.webp",
      "/page-visuals/markarbete-photo-640.webp",
      "/page-visuals/markarbete-photo.webp",
      "/page-visuals/gravjobb-photo-400.webp",
      "/page-visuals/gravjobb-photo-640.webp",
      "/page-visuals/gravjobb-photo.webp",
      "/page-visuals/dranering-photo.webp",
      "/page-visuals/tradgard-generated-640.webp",
      "/page-visuals/tradgard-generated-960.webp",
      "/page-visuals/tradgard-generated.webp",
    ]);
  });

  it("emits the home document's hero preload from the same registry declaration as the rendered home hero", () => {
    const registryHomeRoute = siteContent.routes.find((route) => route.id === "home");

    expect(indexTemplate.match(/<link rel="preload" as="image"[^>]*>/g)).toEqual([
      routeHeroPreloadLinkTag(registryHomeRoute),
    ]);
  });

  it("derives page metadata from every declared subpage's Swedish label and summary", () => {
    for (const route of staticSubpageRoutes(siteContent.routes)) {
      expect(routePageMetadata(route)).toEqual({
        title: `${route.label} – Svärd Entreprenad`,
        description: route.summary,
        socialImage: route.heroPhotoAssetPath.endsWith(".svg")
          ? { assetPath: "/page-visuals/hero-photo.webp", alt: `${route.label} – Svärd Entreprenad` }
          : { assetPath: route.heroPhotoAssetPath, alt: route.visual.alt },
      });
    }

    expect(routePageMetadata(siteContent.routes.find((route) => route.id === "services"))).toEqual({
      title: "Tjänster – Svärd Entreprenad",
      description: siteContent.routes.find((route) => route.id === "services").summary,
      socialImage: {
        assetPath: "/page-visuals/services-hero.webp",
        alt: "Samlad vy över markarbeten, stensättning och dräneringstjänster",
      },
    });
    expect(routePageMetadata(siteContent.routes.find((route) => route.id === "contact")).socialImage).toEqual({
      assetPath: "/page-visuals/hero-photo.webp",
      alt: "Kontakt – Svärd Entreprenad",
    });
  });

  it("emits each subpage's social card image from its declared hero photo with the shared home hero for SVG heroes", () => {
    expect(routeSocialCardImagePaths(siteContent.routes)).toEqual([
      "/page-visuals/quote-hero.webp",
      "/page-visuals/draneringsberakning-hero.webp",
      "/page-visuals/services-hero.webp",
      "/page-visuals/hero-photo.webp",
      "/page-visuals/stensattning-photo.webp",
      "/page-visuals/markarbete-photo.webp",
      "/page-visuals/gravjobb-photo.webp",
      "/page-visuals/dranering-photo.webp",
      "/page-visuals/tradgard-generated.webp",
    ]);

    for (const routeId of ["inhyrning", "about", "contact"]) {
      const route = siteContent.routes.find((route) => route.id === routeId);

      expect(route.heroPhotoAssetPath.endsWith(".svg")).toBe(true);
      expect(routePageMetadata(route).socialImage.assetPath).toBe("/page-visuals/hero-photo.webp");
    }
  });

  it("validates emitted per-route artifacts for the real route inventory and rejects a stale artifact", async () => {
    const entries = {
      [path.join("dist", "index.html")]: rootHtml,
      [notFoundArtifactFile("dist")]: emittedNotFoundHtml(),
    };
    for (const route of staticSubpageRoutes(siteContent.routes)) {
      entries[subpageArtifactPath("dist", route.href)] = emittedSubpageHtml(route);
    }

    await expect(
      assertStaticRouteArtifacts({
        routes: siteContent.routes,
        distDir: "dist",
        readFile: memoryFileSystem(entries).readFile,
      }),
    ).resolves.toEqual(staticSubpagePaths(siteContent.routes));

    const staleEntries = { ...entries, [subpageArtifactPath("dist", "/kontakt/")]: rootHtml };

    await expect(
      assertStaticRouteArtifacts({
        routes: siteContent.routes,
        distDir: "dist",
        readFile: memoryFileSystem(staleEntries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");

    const staleSocialEntries = {
      ...entries,
      [subpageArtifactPath("dist", "/tjanster/")]: subpageHtmlWithRootSocialTags(siteContent.routes.find((route) => route.id === "services")),
    };

    await expect(
      assertStaticRouteArtifacts({
        routes: siteContent.routes,
        distDir: "dist",
        readFile: memoryFileSystem(staleSocialEntries).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /tjanster/).");
  });

  it("requires the emitted not-found artifact for the real inventory and rejects a stale or missing one", async () => {
    const entries = {
      [path.join("dist", "index.html")]: rootHtml,
      [notFoundArtifactFile("dist")]: emittedNotFoundHtml(),
    };
    for (const route of staticSubpageRoutes(siteContent.routes)) {
      entries[subpageArtifactPath("dist", route.href)] = emittedSubpageHtml(route);
    }

    const staleEntries = { ...entries, [notFoundArtifactFile("dist")]: rootHtml };

    await expect(
      assertStaticRouteArtifacts({
        routes: siteContent.routes,
        distDir: "dist",
        readFile: memoryFileSystem(staleEntries).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: dist/404.html must carry the not-found title and description instead of the root document metadata.",
    );

    const missingEntries = { ...entries };
    delete missingEntries[notFoundArtifactFile("dist")];

    await expect(
      assertStaticRouteArtifacts({
        routes: siteContent.routes,
        distDir: "dist",
        readFile: memoryFileSystem(missingEntries).readFile,
      }),
    ).rejects.toThrow(
      "Static route artifact check failed: the not-found recovery document dist/404.html is missing.",
    );
  });
});
