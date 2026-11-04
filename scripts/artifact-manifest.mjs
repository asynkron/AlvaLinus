import { createHash } from "node:crypto";
import path from "node:path";

export const ARTIFACT_MANIFEST_SCHEMA = "artifact-manifest.v1";
export const ARTIFACT_MANIFEST_ALGORITHM = "sha256";

const SHA256_DIGEST_PATTERN = /^[0-9a-f]{64}$/;

function quote(value) {
  return JSON.stringify(value) ?? String(value);
}

function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function assertManifestPathOutsideRoot(root, manifestPath) {
  if (typeof root !== "string" || root.length === 0) {
    throw new Error("Artifact root must be a non-empty directory path.");
  }
  if (typeof manifestPath !== "string" || manifestPath.length === 0) {
    throw new Error("Manifest path must be a non-empty file path.");
  }
  const relative = path.relative(path.resolve(root), path.resolve(manifestPath));
  const firstSegment = relative.split(path.sep)[0];
  if (relative === "" || (firstSegment !== ".." && !path.isAbsolute(relative))) {
    throw new Error(
      `Manifest path ${quote(manifestPath)} must be written outside the artifact root ${quote(root)}.`,
    );
  }
}

function assertSuppliedRoot(root) {
  if (typeof root !== "string" || root.length === 0) {
    throw new Error("Artifact root must be a non-empty directory path.");
  }
}

function joinRelative(parentRelative, name) {
  return parentRelative === "" ? name : `${parentRelative}/${name}`;
}

async function buildInventory({ root, lstat, readdir, readFile }) {
  const absoluteRoot = path.resolve(root);

  let rootStat;
  try {
    rootStat = await lstat(absoluteRoot);
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      throw new Error(`Artifact root ${quote(root)} does not exist.`);
    }
    throw error;
  }
  if (rootStat.isSymbolicLink()) {
    throw new Error(`Artifact root ${quote(root)} is a symlink; supply a real directory.`);
  }
  if (!rootStat.isDirectory()) {
    throw new Error(`Artifact root ${quote(root)} is not a directory.`);
  }

  const inventory = [];

  async function visit(absoluteDirectory, relativeDirectory) {
    const dirents = await readdir(absoluteDirectory, { withFileTypes: true });
    dirents.sort((left, right) => comparePaths(left.name, right.name));
    for (const dirent of dirents) {
      const relativePath = joinRelative(relativeDirectory, dirent.name);
      if (dirent.isSymbolicLink()) {
        throw new Error(
          `Artifact tree entry ${quote(relativePath)} is a symlink; manifests cover real files only.`,
        );
      }
      const absolutePath = path.join(absoluteDirectory, dirent.name);
      if (dirent.isDirectory()) {
        await visit(absolutePath, relativePath);
      } else if (dirent.isFile()) {
        const bytes = await readFile(absolutePath);
        inventory.push({ path: relativePath, sha256: createHash("sha256").update(bytes).digest("hex") });
      } else {
        throw new Error(`Artifact tree entry ${quote(relativePath)} is not a regular file or directory.`);
      }
    }
  }

  await visit(absoluteRoot, "");
  if (inventory.length === 0) {
    throw new Error(`Artifact root ${quote(root)} contains no regular files.`);
  }
  inventory.sort((left, right) => comparePaths(left.path, right.path));
  return inventory;
}

export async function buildArtifactManifest({ root, lstat, readdir, readFile }) {
  assertSuppliedRoot(root);
  const files = await buildInventory({ root, lstat, readdir, readFile });
  return { schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: ARTIFACT_MANIFEST_ALGORITHM, files };
}

export function serializeArtifactManifest(manifest) {
  return `${JSON.stringify(
    {
      schema: ARTIFACT_MANIFEST_SCHEMA,
      algorithm: ARTIFACT_MANIFEST_ALGORITHM,
      files: manifest.files.map((file) => ({ path: file.path, sha256: file.sha256 })),
    },
    null,
    2,
  )}\n`;
}

function requireManifestPath(filePath, index) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    throw new Error(`Artifact manifest entry at index ${index} must declare a non-empty path string.`);
  }
  const label = quote(filePath);
  if (filePath.includes("\\")) {
    throw new Error(`Artifact manifest path ${label} must use "/" separators instead of backslashes.`);
  }
  if (filePath.includes("\0") || filePath.includes(":")) {
    throw new Error(`Artifact manifest path ${label} contains a forbidden character.`);
  }
  if (filePath.startsWith("/")) {
    throw new Error(`Artifact manifest path ${label} must be relative to the artifact root.`);
  }
  for (const segment of filePath.split("/")) {
    if (segment === "" || segment === "." || segment === "..") {
      throw new Error(
        `Artifact manifest path ${label} must be normalized without empty, ".", or ".." segments.`,
      );
    }
  }
}

function requireManifestEntry(entry, index) {
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    throw new Error(`Artifact manifest entry at index ${index} must be a JSON object.`);
  }
  requireManifestPath(entry.path, index);
  if (typeof entry.sha256 !== "string" || !SHA256_DIGEST_PATTERN.test(entry.sha256)) {
    throw new Error(
      `Artifact manifest entry ${quote(entry.path)} must declare a lowercase 64-character sha256 digest.`,
    );
  }
  return { path: entry.path, sha256: entry.sha256 };
}

function requireManifestEntries(manifest) {
  if (typeof manifest !== "object" || manifest === null || Array.isArray(manifest)) {
    throw new Error("Artifact manifest must be a JSON object.");
  }
  if (manifest.schema !== ARTIFACT_MANIFEST_SCHEMA) {
    throw new Error(
      `Unsupported artifact manifest schema ${quote(manifest.schema)}; expected ${quote(ARTIFACT_MANIFEST_SCHEMA)}.`,
    );
  }
  if (manifest.algorithm !== ARTIFACT_MANIFEST_ALGORITHM) {
    throw new Error(
      `Unsupported artifact manifest algorithm ${quote(manifest.algorithm)}; expected ${quote(ARTIFACT_MANIFEST_ALGORITHM)}.`,
    );
  }
  if (!Array.isArray(manifest.files)) {
    throw new Error("Artifact manifest is missing a files array.");
  }
  if (manifest.files.length === 0) {
    throw new Error("Artifact manifest must list at least one file.");
  }
  const files = manifest.files.map((entry, index) => requireManifestEntry(entry, index));
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.path)) {
      throw new Error(`Artifact manifest lists ${quote(file.path)} more than once.`);
    }
    seen.add(file.path);
  }
  return files;
}

export function parseArtifactManifest(text) {
  if (typeof text !== "string") {
    throw new Error("Artifact manifest must be text.");
  }
  let document;
  try {
    document = JSON.parse(text);
  } catch (error) {
    throw new Error(`Artifact manifest is not valid JSON: ${error instanceof Error ? error.message : error}`);
  }
  return {
    schema: ARTIFACT_MANIFEST_SCHEMA,
    algorithm: ARTIFACT_MANIFEST_ALGORITHM,
    files: requireManifestEntries(document),
  };
}

export async function verifyArtifactManifest({ root, manifest, lstat, readdir, readFile }) {
  assertSuppliedRoot(root);
  const expectedFiles = requireManifestEntries(manifest);
  const expected = new Map(expectedFiles.map((file) => [file.path, file.sha256]));
  const actual = await buildInventory({ root, lstat, readdir, readFile });
  const actualByPath = new Map(actual.map((file) => [file.path, file.sha256]));

  const missing = [];
  const changed = [];
  for (const [filePath, manifestDigest] of expected) {
    const artifactDigest = actualByPath.get(filePath);
    if (artifactDigest === undefined) {
      missing.push(filePath);
    } else if (artifactDigest !== manifestDigest) {
      changed.push({ path: filePath, manifestSha256: manifestDigest, artifactSha256: artifactDigest });
    }
  }
  const added = actual.map((file) => file.path).filter((filePath) => !expected.has(filePath));

  return {
    missing: missing.sort(comparePaths),
    added: added.sort(comparePaths),
    changed: changed.sort((left, right) => comparePaths(left.path, right.path)),
  };
}
