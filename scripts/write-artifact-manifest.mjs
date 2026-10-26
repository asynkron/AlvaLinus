import { lstat, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  assertManifestPathOutsideRoot,
  buildArtifactManifest,
  serializeArtifactManifest,
} from "./artifact-manifest.mjs";

const [root, manifestPath] = process.argv.slice(2);

if (typeof root !== "string" || typeof manifestPath !== "string") {
  console.error("Usage: node scripts/write-artifact-manifest.mjs <artifact-root> <manifest-path>");
  process.exitCode = 1;
} else {
  try {
    assertManifestPathOutsideRoot(root, manifestPath);
    const manifest = await buildArtifactManifest({ root, lstat, readdir, readFile });
    await mkdir(path.dirname(path.resolve(manifestPath)), { recursive: true });
    await writeFile(manifestPath, serializeArtifactManifest(manifest));
    console.log(`Artifact manifest written: ${manifest.files.length} files -> ${manifestPath}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
