import { execFile, spawn } from "node:child_process";
import { lstat, mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import {
  DEFAULT_DIST_ROOT,
  DEFAULT_MANIFEST_PATH,
  DEFAULT_RECORD_PATH,
  composeReleaseProvenance,
  serializeReleaseProvenance,
} from "./release-provenance.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const execFileAsync = promisify(execFile);

function runBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, "scripts", "make.js"), "build"], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (code === 0) resolve(code);
      else reject(Object.assign(new Error(`Build failed (${signal || `exit ${code}`}).`), { code: code || 1 }));
    });
  });
}

const git = {
  revParseHead: async () => (await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: root })).stdout,
  statusPorcelain: async () => (await execFileAsync("git", ["status", "--porcelain"], { cwd: root })).stdout,
};

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const [distRootArgument, manifestPathArgument, recordPathArgument] = process.argv.slice(2);

if (distRootArgument === "--help" || distRootArgument === "-h") {
  console.log(
    "Usage: node scripts/write-release-provenance.mjs [dist-root] [manifest-path] [record-path]\n" +
      `Defaults: dist-root=${DEFAULT_DIST_ROOT} manifest-path=${DEFAULT_MANIFEST_PATH} record-path=${DEFAULT_RECORD_PATH}\n` +
      "Composes release-provenance.v1 from a clean checkout: fresh build, verified artifact manifest, accepted quality evidence.\n" +
      "The publication identity stays an operator-recorded placeholder.",
  );
} else {
  try {
    const distRoot = path.resolve(root, distRootArgument ?? DEFAULT_DIST_ROOT);
    const manifestPath = path.resolve(root, manifestPathArgument ?? DEFAULT_MANIFEST_PATH);
    const recordPath = path.resolve(root, recordPathArgument ?? DEFAULT_RECORD_PATH);

    const { manifestBytes, record } = await composeReleaseProvenance({
      root,
      distRoot,
      manifestPath,
      recordPath,
      git,
      runBuild,
      lstat,
      readdir,
      readFile,
    });

    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, manifestBytes);

    const temporary = `${recordPath}.tmp`;
    await writeFile(temporary, serializeReleaseProvenance(record));
    await rename(temporary, recordPath);

    console.log(
      `Release provenance written: ${record.source_revision} -> ${path.relative(root, recordPath)} ` +
        `(manifest ${record.artifact_manifest.path}, ${record.quality_evidence.counts.total} tests accepted).`,
    );
  } catch (error) {
    fail(error instanceof Error ? error.message : error);
  }
}
