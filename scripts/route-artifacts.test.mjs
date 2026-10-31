// @vitest-environment node
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { siteContent } from "../src/data/siteContent.ts";
import {
  applyRouteDocumentMetadata,
  assertRouteVisualAssets,
  assertStaticRouteArtifacts,
  notFoundArtifactPath,
  notFoundPageMetadata,
  requireRouteRegistry,
  routePageMetadata,
  routeVisualAssetPaths,
  staticSubpagePaths,
  staticSubpageRoutes,
} from "./route-artifacts.mjs";

function fixtureRoute(id, href, assetPath) {
  return {
    id,
    kind: "service",
    label: id,
    href,
    summary: `${id} summary`,
    visual: { assetPath, alt: `${id} alt`, intent: `${id} intent` },
  };
}

const homeRoute = fixtureRoute("home", "/", "/page-visuals/svard-entreprenad-home.svg");
const servicesRoute = fixtureRoute("services", "/tjanster/", "/page-visuals/svard-entreprenad-services.svg");
const contactRoute = fixtureRoute("contact", "/kontakt/", "/page-visuals/svard-entreprenad-contact.svg");
const addedRoute = fixtureRoute("nyheter", "/nyheter/", "/page-visuals/svard-entreprenad-nyheter.svg");
const fixtureRoutes = [homeRoute, servicesRoute, contactRoute];

const rootTitle = "Svärd Entreprenad – Mark & anläggning i Örebro";
const rootDescription = "Svärd Entreprenad utför professionella mark- och anläggningsarbeten i Örebro.";
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
  return applyRouteDocumentMetadata(rootHtml, routePageMetadata(route));
}

function notFoundArtifactFile(distDir) {
  return path.join(distDir, notFoundArtifactPath);
}

function emittedNotFoundHtml() {
  return applyRouteDocumentMetadata(rootHtml, notFoundPageMetadata());
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
  return Object.fromEntries(
    routes.map((route) => [publicAssetPath("public", route.visual.assetPath), "<svg></svg>"]),
  );
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

  it("fails for a declared route without page metadata fields before reading artifacts", async () => {
    const unlabeledRoute = {
      id: "unlabeled",
      kind: "service",
      href: "/unlabeled/",
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
    expect(emitted).toContain('<meta property="og:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).toContain('<meta property="og:image:width" content="1600">');
    expect(emitted).toContain('<meta property="og:image:height" content="905">');
    expect(emitted).toContain(
      '<meta property="og:image:alt" content="Grävmaskin på en mark- och anläggningsplats i solnedgång">',
    );
    expect(emitted).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(emitted).toContain('<meta name="twitter:image" content="/page-visuals/hero-photo.webp">');
    expect(emitted).toContain("<body>Svard Entreprenad</body>");
    expect(emitted).toMatch(/^<!doctype html>/);
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
    expect(emitted).toContain("<body>Svard Entreprenad</body>");
    expect(emitted).toMatch(/^<!doctype html>/);
  });
});

describe("assertRouteVisualAssets", () => {
  it("requires every declared route visual asset to resolve under public/page-visuals", async () => {
    const fileSystem = memoryFileSystem(publicEntries(fixtureRoutes));

    await expect(
      assertRouteVisualAssets({ routes: fixtureRoutes, publicDir: "public", access: fileSystem.access }),
    ).resolves.toEqual([
      "/page-visuals/svard-entreprenad-home.svg",
      "/page-visuals/svard-entreprenad-services.svg",
      "/page-visuals/svard-entreprenad-contact.svg",
    ]);

    expect(fileSystem.access).toHaveBeenCalledWith(
      publicAssetPath("public", "/page-visuals/svard-entreprenad-contact.svg"),
    );
    expect(fileSystem.access).toHaveBeenCalledTimes(3);
  });

  it("requires the visual of an added fixture route automatically", async () => {
    await expect(
      assertRouteVisualAssets({
        routes: [...fixtureRoutes, addedRoute],
        publicDir: "public",
        access: memoryFileSystem(publicEntries(fixtureRoutes)).access,
      }),
    ).rejects.toThrow("Route visual asset check failed (missing: /page-visuals/svard-entreprenad-nyheter.svg).");
  });

  it("stops requiring the visual of a removed fixture route", async () => {
    const remainingRoutes = fixtureRoutes.filter((route) => route !== contactRoute);
    const fileSystem = memoryFileSystem(publicEntries(fixtureRoutes));

    await expect(
      assertRouteVisualAssets({ routes: remainingRoutes, publicDir: "public", access: fileSystem.access }),
    ).resolves.toEqual([
      "/page-visuals/svard-entreprenad-home.svg",
      "/page-visuals/svard-entreprenad-services.svg",
    ]);
    expect(fileSystem.access).not.toHaveBeenCalledWith(
      publicAssetPath("public", "/page-visuals/svard-entreprenad-contact.svg"),
    );
  });

  it("fails when a declared visual asset path leaves the page-visuals SVG naming contract", async () => {
    const escapeRoute = fixtureRoute("escape", "/escape/", "/page-visuals/svard-entreprenad-../../secret.svg");
    const misplacedRoute = fixtureRoute("misplaced", "/misplaced/", "/images/svard-entreprenad-misplaced.png");

    await expect(
      assertRouteVisualAssets({
        routes: [...fixtureRoutes, escapeRoute, misplacedRoute],
        publicDir: "public",
        access: memoryFileSystem(publicEntries(fixtureRoutes)).access,
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
});

describe("siteContent route registry", () => {
  it("declares nine canonical routes with unique subpage destinations and visuals", () => {
    expect(siteContent.routes).toHaveLength(9);
    expect(staticSubpagePaths(siteContent.routes)).toEqual([
      "/tjanster/",
      "/om-oss/",
      "/stensattning/",
      "/markarbete/",
      "/gravjobb/",
      "/dranering/",
      "/tradgardsplanering/",
      "/kontakt/",
    ]);

    const assetPaths = routeVisualAssetPaths(siteContent.routes);
    expect(assetPaths).toHaveLength(9);
    expect(new Set(assetPaths).size).toBe(assetPaths.length);
  });

  it("derives page metadata from every declared subpage's Swedish label and summary", () => {
    for (const route of staticSubpageRoutes(siteContent.routes)) {
      expect(routePageMetadata(route)).toEqual({
        title: `${route.label} – Svärd Entreprenad`,
        description: route.summary,
      });
    }

    expect(routePageMetadata(siteContent.routes[1])).toEqual({
      title: "Tjänster – Svärd Entreprenad",
      description: siteContent.routes[1].summary,
    });
  });

  it("validates emitted per-route artifacts for the real route inventory and rejects a stale artifact", async () => {
    const entries = {
      [path.join("dist", "index.html")]: rootHtml,
      [notFoundArtifactFile("dist")]: emittedNotFoundHtml(),
    };
    for (const route of staticSubpageRoutes(siteContent.routes)) {
      entries[subpageArtifactPath("dist", route.href)] = applyRouteDocumentMetadata(rootHtml, routePageMetadata(route));
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
      [subpageArtifactPath("dist", "/tjanster/")]: subpageHtmlWithRootSocialTags(siteContent.routes[1]),
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
      entries[subpageArtifactPath("dist", route.href)] = applyRouteDocumentMetadata(rootHtml, routePageMetadata(route));
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
