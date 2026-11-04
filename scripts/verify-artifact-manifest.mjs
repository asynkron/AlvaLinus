import { lstat, readdir, readFile } from "node:fs/promises";

import { parseArtifactManifest, verifyArtifactManifest } from "./artifact-manifest.mjs";

const [root, manifestPath] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (typeof root !== "string" || typeof manifestPath !== "string") {
  fail("Usage: node scripts/verify-artifact-manifest.mjs <artifact-root> <manifest-path>");
} else {
  try {
    let text;
    try {
      text = await readFile(manifestPath, "utf8");
    } catch (error) {
      if (error instanceof Error && error.code === "ENOENT") {
        throw new Error(`Artifact manifest ${JSON.stringify(manifestPath)} does not exist.`);
      }
      throw error;
    }
    const manifest = parseArtifactManifest(text);
    const report = await verifyArtifactManifest({
      root,
      manifest,
      lstat,
      readdir,
      readFile,
    });
    if (report.missing.length === 0 && report.added.length === 0 && report.changed.length === 0) {
      console.log(`Artifact manifest verified: ${manifest.files.length} files match the artifact tree.`);
    } else {
      fail(
        `Artifact manifest verification failed ` +
          `(missing: ${report.missing.length}, added: ${report.added.length}, changed: ${report.changed.length}).`,
      );
      for (const filePath of report.missing) fail(`  missing: ${filePath}`);
      for (const filePath of report.added) fail(`  added: ${filePath}`);
      for (const change of report.changed) {
        fail(`  changed: ${change.path} (manifest ${change.manifestSha256}, artifact ${change.artifactSha256})`);
      }
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : error);
  }
}
