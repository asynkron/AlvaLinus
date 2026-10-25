// @vitest-environment node
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { siteContent } from "../src/data/siteContent.ts";
import {
  assertRouteVisualAssets,
  assertStaticRouteArtifacts,
  requireRouteRegistry,
  routeVisualAssetPaths,
  staticSubpagePaths,
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

const rootHtml = '<!doctype html><html lang="sv"><body>Svard Entreprenad</body></html>';

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

function distEntries(routes, { omit = [], mismatched = [] } = {}) {
  const entries = { [path.join("dist", "index.html")]: rootHtml };
  for (const route of routes) {
    if (route.href === "/" || omit.includes(route.href)) continue;
    entries[subpageArtifactPath("dist", route.href)] = mismatched.includes(route.href)
      ? `${rootHtml}<!-- stale artifact -->`
      : rootHtml;
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
});

describe("assertStaticRouteArtifacts", () => {
  it("requires every declared non-root route artifact to exist and match the root HTML", async () => {
    const fileSystem = memoryFileSystem(distEntries(fixtureRoutes));

    await expect(
      assertStaticRouteArtifacts({ routes: fixtureRoutes, distDir: "dist", readFile: fileSystem.readFile }),
    ).resolves.toEqual(["/tjanster/", "/kontakt/"]);

    expect(fileSystem.readFile).toHaveBeenCalledWith(path.join("dist", "index.html"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledWith(subpageArtifactPath("dist", "/tjanster/"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledWith(subpageArtifactPath("dist", "/kontakt/"), "utf8");
    expect(fileSystem.readFile).toHaveBeenCalledTimes(3);
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

  it("fails descriptively when a declared route artifact differs from the root HTML", async () => {
    await expect(
      assertStaticRouteArtifacts({
        routes: fixtureRoutes,
        distDir: "dist",
        readFile: memoryFileSystem(distEntries(fixtureRoutes, { mismatched: ["/kontakt/"] })).readFile,
      }),
    ).rejects.toThrow("Static route artifact check failed (mismatched: /kontakt/).");
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
      return rootHtml;
    });

    await expect(
      assertStaticRouteArtifacts({ routes: fixtureRoutes, distDir: "dist", readFile }),
    ).rejects.toThrow(denied);
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
  it("stays within the shared artifact contract with unique visual assets", () => {
    expect(requireRouteRegistry(siteContent.routes)).toBe(siteContent.routes);
    expect(staticSubpagePaths(siteContent.routes)).not.toContain("/");
    const assetPaths = routeVisualAssetPaths(siteContent.routes);
    expect(new Set(assetPaths).size).toBe(assetPaths.length);
  });
});
