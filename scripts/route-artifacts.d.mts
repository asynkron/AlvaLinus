export type RouteRegistryRoute = {
  readonly href: string;
  readonly label: string;
  readonly summary: string;
  readonly heroPhotoAssetPath: string;
  readonly heroPhotoSrcSet?: string;
  readonly heroPhotoSizes?: string;
  readonly visual?: { readonly assetPath: string };
};

export type RoutePageMetadata = {
  readonly title: string;
  readonly description: string;
};

export declare function requireRouteRegistry(routes: readonly RouteRegistryRoute[]): readonly RouteRegistryRoute[];

export declare function staticSubpageRoutes(routes: readonly RouteRegistryRoute[]): RouteRegistryRoute[];

export declare function staticSubpagePaths(routes: readonly RouteRegistryRoute[]): string[];

export declare function requireRouteHeroPhotoAssetPath(route: RouteRegistryRoute, index: number): string;

export declare function routeHeroPreloadHref(route: RouteRegistryRoute): string;

export declare function routeHeroPreloadImageSrcSet(route: RouteRegistryRoute): string | undefined;

export declare function routeHeroPreloadImageSizes(route: RouteRegistryRoute): string | undefined;

export declare function routeHeroPreloadLinkTag(route: RouteRegistryRoute): string;

export declare function routeHeroSrcSetCandidatePaths(routes: readonly RouteRegistryRoute[]): string[];

export declare function routePageMetadata(route: RouteRegistryRoute): RoutePageMetadata;

export declare const notFoundArtifactPath: "404.html";

export declare function notFoundPageMetadata(): RoutePageMetadata;

export declare function applyRouteDocumentMetadata(document: string, metadata: RoutePageMetadata): string;

export declare function stripHomeHeroPreload(document: string): string;

export declare function injectRouteHeroPreload(
  document: string,
  assetPath: string,
  imageSrcSet?: string,
  imageSizes?: string,
): string;

export declare function routeVisualAssetPaths(routes: readonly RouteRegistryRoute[]): string[];

export declare function routeHeroPhotoAssetPaths(routes: readonly RouteRegistryRoute[]): string[];

export declare function assertStaticRouteArtifacts(options: {
  routes: readonly RouteRegistryRoute[];
  distDir: string;
  readFile: (filePath: string, encoding: "utf8") => Promise<string>;
}): Promise<string[]>;

export declare function assertRouteVisualAssets(options: {
  routes: readonly RouteRegistryRoute[];
  publicDir: string;
  access: (filePath: string) => Promise<void>;
}): Promise<{ visualAssets: string[]; heroAssets: string[] }>;
