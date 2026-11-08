import { createHash } from "node:crypto";
import path from "node:path";

import {
  assertManifestPathOutsideRoot,
  buildArtifactManifest,
  serializeArtifactManifest,
  verifyArtifactManifest,
} from "./artifact-manifest.mjs";

export const RELEASE_PROVENANCE_SCHEMA = "release-provenance.v1";
export const DEFAULT_DIST_ROOT = "dist";
export const DEFAULT_MANIFEST_PATH = "artifacts/release.manifest.json";
export const DEFAULT_RECORD_PATH = "artifacts/release-provenance.json";
export const DEFAULT_QUALITY_EVIDENCE_DIRECTORY = ".faktorial/quality";
export const QUALITY_EVIDENCE_FILENAME = "vitest-tests.quality-evidence.json";
export const QUALITY_EVIDENCE_SCHEMA = "quality-evidence.v1";
export const QUALITY_EVIDENCE_PRODUCER_ID = "vitest-tests";

// Full commit SHAs: classic SHA-1 repositories (40) and SHA-256 repositories (64).
const FULL_REVISION_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/;

function quote(value) {
  return JSON.stringify(value) ?? String(value);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// Resolve the retained quality-evidence directory exactly like
// scripts/make.js tests(): FAKTORIAL_QUALITY_EVIDENCE_DIR or .faktorial/quality.
export function resolveQualityEvidenceDirectory(root, environment = process.env) {
  if (typeof root !== "string" || root.length === 0) {
    throw new Error("Repository root must be a non-empty directory path.");
  }
  return path.resolve(root, environment.FAKTORIAL_QUALITY_EVIDENCE_DIR || DEFAULT_QUALITY_EVIDENCE_DIRECTORY);
}

function requireNonEmpty(label, value) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
}

function requireExecutor(label, value) {
  if (typeof value !== "function") {
    throw new Error(`${label} executor must be a function.`);
  }
  return value;
}

function toRepositoryRelative(root, filePath, label) {
  const relative = path.relative(path.resolve(root), path.resolve(filePath));
  const firstSegment = relative.split(path.sep)[0];
  if (relative === "" || (firstSegment !== ".." && !path.isAbsolute(relative))) {
    return relative.split(path.sep).join("/");
  }
  throw new Error(`${label} ${quote(filePath)} must resolve inside the repository root.`);
}

async function requireCleanCheckoutRevision(git) {
  const status = (await git.statusPorcelain()).trim();
  if (status.length !== 0) {
    throw new Error(
      "The working tree is dirty; release provenance requires a clean checkout. " +
        `git status --porcelain reports:\n${status}`,
    );
  }
  const revision = (await git.revParseHead()).trim();
  if (!FULL_REVISION_PATTERN.test(revision)) {
    throw new Error(
      `Git revision ${quote(revision)} is not a full hexadecimal commit SHA (40 or 64 characters); ` +
        "refusing to compose release provenance.",
    );
  }
  return revision;
}

function requireTestCounts(counts) {
  if (typeof counts !== "object" || counts === null || Array.isArray(counts)) {
    throw new Error("Quality evidence payload counts must be a JSON object.");
  }
  const normalized = {};
  for (const field of ["total", "passed", "failed", "skipped"]) {
    const value = counts[field];
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new Error(`Quality evidence counts ${quote(field)} must be a non-negative integer.`);
    }
    normalized[field] = value;
  }
  if (normalized.total !== normalized.passed + normalized.failed + normalized.skipped) {
    throw new Error("Quality evidence counts total must equal passed + failed + skipped.");
  }
  return normalized;
}

function requireAcceptedQualityEvidence(bytes) {
  let document;
  try {
    document = JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    throw new Error(
      `Quality evidence ${QUALITY_EVIDENCE_FILENAME} is not valid JSON: ` +
        `${error instanceof Error ? error.message : error}`,
    );
  }
  if (typeof document !== "object" || document === null || Array.isArray(document)) {
    throw new Error(`Quality evidence ${QUALITY_EVIDENCE_FILENAME} must be a JSON object.`);
  }
  if (document.schema_version !== QUALITY_EVIDENCE_SCHEMA) {
    throw new Error(
      `Unsupported quality evidence schema ${quote(document.schema_version)}; ` +
        `expected ${quote(QUALITY_EVIDENCE_SCHEMA)}.`,
    );
  }
  if (document.producer_id !== QUALITY_EVIDENCE_PRODUCER_ID) {
    throw new Error(
      `Unsupported quality evidence producer ${quote(document.producer_id)}; ` +
        `expected ${quote(QUALITY_EVIDENCE_PRODUCER_ID)}.`,
    );
  }
  if (document.status !== "complete") {
    throw new Error(
      `Quality evidence status ${quote(document.status)} is not an accepted complete quality session.`,
    );
  }
  return {
    digest: sha256(bytes),
    schema_version: document.schema_version,
    producer_id: document.producer_id,
    status: document.status,
    counts: requireTestCounts(document.payload?.counts),
  };
}

// Compose the release-provenance record from a prepared checkout. Pure
// composition: git, build, and filesystem behavior arrive injected, so tests
// pin every branch in memory. The caller writes manifestBytes and record.
export async function composeReleaseProvenance({
  root,
  distRoot = DEFAULT_DIST_ROOT,
  manifestPath = DEFAULT_MANIFEST_PATH,
  recordPath = DEFAULT_RECORD_PATH,
  evidenceDirectory = resolveQualityEvidenceDirectory(root),
  git,
  runBuild,
  lstat,
  readdir,
  readFile,
}) {
  requireNonEmpty("Repository root", root);
  requireNonEmpty("Artifact root", distRoot);
  requireNonEmpty("Manifest path", manifestPath);
  requireNonEmpty("Record path", recordPath);
  requireNonEmpty("Quality evidence directory", evidenceDirectory);
  requireExecutor("Git rev-parse", git?.revParseHead);
  requireExecutor("Git status", git?.statusPorcelain);
  requireExecutor("Build", runBuild);
  requireExecutor("Filesystem lstat", lstat);
  requireExecutor("Filesystem readdir", readdir);
  requireExecutor("Filesystem readFile", readFile);

  assertManifestPathOutsideRoot(distRoot, manifestPath);
  assertManifestPathOutsideRoot(distRoot, recordPath);
  if (path.resolve(manifestPath) === path.resolve(recordPath)) {
    throw new Error(
      `Manifest path ${quote(manifestPath)} and record path ${quote(recordPath)} must be different files.`,
    );
  }
  const manifestIdentityPath = toRepositoryRelative(root, manifestPath, "Artifact manifest path");

  const revision = await requireCleanCheckoutRevision(git);
  await runBuild();

  const manifest = await buildArtifactManifest({ root: distRoot, lstat, readdir, readFile });
  const manifestBytes = serializeArtifactManifest(manifest);
  const verification = await verifyArtifactManifest({ root: distRoot, manifest, lstat, readdir, readFile });
  if (verification.missing.length !== 0 || verification.added.length !== 0 || verification.changed.length !== 0) {
    const details = [];
    for (const filePath of verification.missing) details.push(`  missing: ${filePath}`);
    for (const filePath of verification.added) details.push(`  added: ${filePath}`);
    for (const change of verification.changed) details.push(`  changed: ${change.path}`);
    throw new Error(
      `Artifact manifest verification failed against artifact root ${quote(distRoot)}:\n${details.join("\n")}`,
    );
  }

  const evidencePath = path.join(evidenceDirectory, QUALITY_EVIDENCE_FILENAME);
  let evidenceBytes;
  try {
    evidenceBytes = await readFile(evidencePath);
  } catch (error) {
    if (error instanceof Error && error.code === "ENOENT") {
      throw new Error(
        `Accepted quality evidence is missing: no ${QUALITY_EVIDENCE_FILENAME} under ${quote(evidenceDirectory)}. ` +
          "Run make quality before composing release provenance.",
      );
    }
    throw error;
  }
  const qualityEvidence = requireAcceptedQualityEvidence(evidenceBytes);

  return {
    manifestBytes,
    record: {
      schema: RELEASE_PROVENANCE_SCHEMA,
      source_revision: revision,
      artifact_manifest: {
        path: manifestIdentityPath,
        sha256: sha256(manifestBytes),
      },
      quality_evidence: qualityEvidence,
      publication: {
        deployment_id: null,
        timestamp: null,
        publisher: null,
      },
    },
  };
}

// Canonical serialization: fixed key order regardless of the record object's
// insertion order, no timestamps, no machine paths.
export function serializeReleaseProvenance(record) {
  if (typeof record !== "object" || record === null || Array.isArray(record)) {
    throw new Error("Release provenance record must be a JSON object.");
  }
  if (record.schema !== RELEASE_PROVENANCE_SCHEMA) {
    throw new Error(
      `Unsupported release provenance schema ${quote(record.schema)}; expected ${quote(RELEASE_PROVENANCE_SCHEMA)}.`,
    );
  }
  if (typeof record.source_revision !== "string" || record.source_revision.length === 0) {
    throw new Error("Release provenance record must declare a source revision.");
  }
  return `${JSON.stringify(
    {
      schema: record.schema,
      source_revision: record.source_revision,
      artifact_manifest: {
        path: record.artifact_manifest.path,
        sha256: record.artifact_manifest.sha256,
      },
      quality_evidence: {
        digest: record.quality_evidence.digest,
        schema_version: record.quality_evidence.schema_version,
        producer_id: record.quality_evidence.producer_id,
        status: record.quality_evidence.status,
        counts: {
          total: record.quality_evidence.counts.total,
          passed: record.quality_evidence.counts.passed,
          failed: record.quality_evidence.counts.failed,
          skipped: record.quality_evidence.counts.skipped,
        },
      },
      publication: {
        deployment_id: record.publication.deployment_id,
        timestamp: record.publication.timestamp,
        publisher: record.publication.publisher,
      },
    },
    null,
    2,
  )}\n`;
}
