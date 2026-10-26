import react from "@vitejs/plugin-react";
import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vitest/config";

import { siteContent } from "./src/data/siteContent";
import { staticSubpagePaths } from "./scripts/route-artifacts.mjs";

const staticRoutePaths = staticSubpagePaths(siteContent.routes);

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
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.*", "src/test/**", "src/vite-env.d.ts"],
      reporter: ["text", "json"],
      reportsDirectory: path.resolve(process.env.FAKTORIAL_COVERAGE_OUTPUT_DIR || "coverage", "coverage-native"),
    },
  },
});
