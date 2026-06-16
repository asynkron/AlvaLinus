import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vitest/config";

import { siteContent } from "./src/data/siteContent";

const staticRoutePaths = siteContent.routes
  .map((route) => route.href)
  .filter((href) => href !== "/" && href.startsWith("/"));

function emitStaticRoutePages(): Plugin {
  let outDir = "dist";

  return {
    name: "emit-static-route-pages",
    configResolved(config: ResolvedConfig) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const sourceHtml = path.join(outDir, "index.html");
      const html = await fs.readFile(sourceHtml, "utf8");

      await Promise.all(
        staticRoutePaths.map(async (routePath) => {
          const routeDir = path.join(outDir, routePath.replace(/^\/+|\/+$/g, ""));

          await fs.mkdir(routeDir, { recursive: true });
          await fs.writeFile(path.join(routeDir, "index.html"), html);
        }),
      );
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), emitStaticRoutePages()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
