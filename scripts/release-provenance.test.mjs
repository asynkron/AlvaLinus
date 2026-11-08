// @vitest-environment node
import { createHash } from "node:crypto";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { ARTIFACT_MANIFEST_SCHEMA } from "./artifact-manifest.mjs";
import {
  QUALITY_EVIDENCE_FILENAME,
  RELEASE_PROVENANCE_SCHEMA,
  composeReleaseProvenance,
  resolveQualityEvidenceDirectory,
  serializeReleaseProvenance,
} from "./release-provenance.mjs";

const REVISION = "e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8";
const REPO_ROOT = path.resolve("repo");
const DIST_ROOT = path.join(REPO_ROOT, "dist");
const MANIFEST_PATH = path.join(REPO_ROOT, "artifacts", "release.manifest.json");
const RECORD_PATH = path.join(REPO_ROOT, "artifacts", "release-provenance.json");
const EVIDENCE_DIRECTORY = path.join(REPO_ROOT, ".faktorial", "quality");
const EVIDENCE_PATH = path.join(EVIDENCE_DIRECTORY, QUALITY_EVIDENCE_FILENAME);

const INDEX_BYTES = Buffer.from("<html>index</html>", "utf8");
const BUNDLE_BYTES = Buffer.from("console.log(\"app\");\n", "utf8");
const FONT_BYTES = Buffer.from([0x00, 0x01, 0x02, 0xfe, 0xff, 0x7f, 0x80]);

const DIST_FILES = {
  "index.html": INDEX_BYTES,
  "assets/index-B1oM8pQ2.js": BUNDLE_BYTES,
  "assets/inter-latin-wght.woff2": FONT_BYTES,
  "tjanster/index.html": INDEX_BYTES,
  "tjanster/kontakt/index.html": BUNDLE_BYTES,
};

const ACCEPTED_COUNTS = { total: 4, passed: 4, failed: 0, skipped: 0 };

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function expectedManifestText() {
  const files = Object.keys(DIST_FILES)
    .sort()
    .map((relativePath) => ({ path: relativePath, sha256: sha256(DIST_FILES[relativePath]) }));
  return `${JSON.stringify({ schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: "sha256", files }, null, 2)}\n`;
}

function qualityEvidenceBytes(overrides = {}) {
  return Buffer.from(
    `${JSON.stringify(
      {
        schema_version: "quality-evidence.v1",
        producer_id: "vitest-tests",
        kind: "test-results",
        payload_schema: "test-results.v1",
        status: "complete",
        payload: { counts: { ...ACCEPTED_COUNTS }, failures: [], observations: [] },
        ...overrides,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function expectedRecord({ manifestText = expectedManifestText(), evidenceBytes = qualityEvidenceBytes() } = {}) {
  return {
    schema: RELEASE_PROVENANCE_SCHEMA,
    source_revision: REVISION,
    artifact_manifest: {
      path: "artifacts/release.manifest.json",
      sha256: sha256(manifestText),
    },
    quality_evidence: {
      digest: sha256(evidenceBytes),
      schema_version: "quality-evidence.v1",
      producer_id: "vitest-tests",
      status: "complete",
      counts: { ...ACCEPTED_COUNTS },
    },
    publication: { deployment_id: null, timestamp: null, publisher: null },
  };
}

function enoent(filePath) {
  return Object.assign(new Error(`ENOENT: no such file or directory, ${filePath}`), { code: "ENOENT" });
}

function memoryFileSystem({
  distFiles = DIST_FILES,
  evidenceBytes = qualityEvidenceBytes(),
  evidenceState = "present",
  mutatedAfterFirstRead = null,
} = {}) {
  const files = new Map();
  const directories = new Set([DIST_ROOT]);
  const children = new Map([[DIST_ROOT, []]]);

  for (const [relativePath, content] of Object.entries(distFiles)) {
    const segments = relativePath.split("/");
    let current = DIST_ROOT;
    for (const segment of segments.slice(0, -1)) {
      const siblings = children.get(current) ?? [];
      if (!siblings.includes(segment)) siblings.push(segment);
      children.set(current, siblings);
      current = path.join(current, segment);
      directories.add(current);
    }
    const name = segments[segments.length - 1];
    const siblings = children.get(current) ?? [];
    siblings.push(name);
    children.set(current, siblings);
    files.set(path.join(current, name), content);
  }

  const readCounts = new Map();

  return {
    lstat: vi.fn(async (filePath) => {
      if (filePath === DIST_ROOT) return { isSymbolicLink: () => false, isDirectory: () => true };
      throw enoent(filePath);
    }),
    readdir: vi.fn(async (directoryPath) => {
      const siblings = children.get(directoryPath);
      if (siblings === undefined) throw enoent(directoryPath);
      return siblings.map((name) => ({
        name,
        isSymbolicLink: () => false,
        isDirectory: () => directories.has(path.join(directoryPath, name)),
        isFile: () => files.has(path.join(directoryPath, name)),
      }));
    }),
    readFile: vi.fn(async (filePath) => {
      if (filePath === EVIDENCE_PATH) {
        if (evidenceState === "missing") throw enoent(filePath);
        return evidenceBytes;
      }
      const content = files.get(filePath);
      if (content === undefined) throw enoent(filePath);
      const reads = (readCounts.get(filePath) ?? 0) + 1;
      readCounts.set(filePath, reads);
      if (mutatedAfterFirstRead && reads > 1 && filePath === mutatedAfterFirstRead.path) {
        return mutatedAfterFirstRead.bytes;
      }
      return content;
    }),
  };
}

function gitExecutor({ revision = `${REVISION}\n`, status = "" } = {}) {
  return {
    revParseHead: vi.fn(async () => revision),
    statusPorcelain: vi.fn(async () => status),
  };
}

function compose(options = {}) {
  const { git = gitExecutor(), runBuild = vi.fn(async () => {}), fs = {}, ...composeOptions } = options;
  return composeReleaseProvenance({
    root: REPO_ROOT,
    distRoot: DIST_ROOT,
    manifestPath: MANIFEST_PATH,
    recordPath: RECORD_PATH,
    evidenceDirectory: EVIDENCE_DIRECTORY,
    git,
    runBuild,
    ...memoryFileSystem(fs),
    ...composeOptions,
  });
}

describe("composeReleaseProvenance", () => {
  it("joins the clean revision, verified manifest identity, and accepted quality evidence into one record", async () => {
    const git = gitExecutor();
    const runBuild = vi.fn(async () => {});
    const fs = memoryFileSystem();
    const { manifestBytes, record } = await composeReleaseProvenance({
      root: REPO_ROOT,
      distRoot: DIST_ROOT,
      manifestPath: MANIFEST_PATH,
      recordPath: RECORD_PATH,
      evidenceDirectory: EVIDENCE_DIRECTORY,
      git,
      runBuild,
      ...fs,
    });

    expect(record).toEqual(expectedRecord());
    expect(manifestBytes).toBe(expectedManifestText());
    expect(git.statusPorcelain).toHaveBeenCalledTimes(1);
    expect(git.revParseHead).toHaveBeenCalledTimes(1);
    expect(runBuild).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledWith(EVIDENCE_PATH);
  });

  it("composes byte-identical records across independent runs", async () => {
    const first = await compose();
    const second = await compose();

    expect(serializeReleaseProvenance(second.record)).toBe(serializeReleaseProvenance(first.record));
    expect(serializeReleaseProvenance(first.record)).toBe(`${JSON.stringify(expectedRecord(), null, 2)}\n`);
  });

  it("records the manifest identity with a normalized repository-relative path", async () => {
    const nestedManifest = path.join(REPO_ROOT, "artifacts", "sub", "release.manifest.json");
    const { record } = await compose({ manifestPath: nestedManifest });

    expect(record.artifact_manifest.path).toBe("artifacts/sub/release.manifest.json");
  });

  it("keeps publication identity a null operator placeholder", async () => {
    const { record } = await compose();

    expect(record.publication).toEqual({ deployment_id: null, timestamp: null, publisher: null });
  });
});

describe("composeReleaseProvenance fail-closed preconditions", () => {
  it("refuses a dirty working tree before building", async () => {
    const runBuild = vi.fn(async () => {});
    await expect(
      compose({ git: gitExecutor({ status: " M src/main.ts\n" }), runBuild }),
    ).rejects.toThrow(/dirty/);
    expect(runBuild).not.toHaveBeenCalled();
  });

  it("refuses a missing or truncated git revision before building", async () => {
    for (const revision of ["", "abc123", `${REVISION}zz`]) {
      await expect(compose({ git: gitExecutor({ revision }) })).rejects.toThrow(
        /full hexadecimal commit SHA/,
      );
    }
  });

  it("refuses to compose when the build fails", async () => {
    const runBuild = vi.fn(async () => {
      throw new Error("Build failed (exit 2).");
    });
    await expect(compose({ runBuild })).rejects.toThrow("Build failed (exit 2).");
  });

  it("refuses to compose when the manifest no longer matches the artifact tree", async () => {
    await expect(
      compose({
        fs: {
          mutatedAfterFirstRead: {
            path: path.join(DIST_ROOT, "index.html"),
            bytes: Buffer.from("<html>changed</html>", "utf8"),
          },
        },
      }),
    ).rejects.toThrow(/Artifact manifest verification failed/);
  });

  it("refuses an artifact tree with no regular files", async () => {
    await expect(compose({ fs: { distFiles: {} } })).rejects.toThrow(/contains no regular files/);
  });

  it("refuses to compose without retained quality evidence", async () => {
    await expect(compose({ fs: { evidenceState: "missing" } })).rejects.toThrow(
      /Accepted quality evidence is missing/,
    );
  });

  it("refuses malformed quality evidence JSON", async () => {
    await expect(compose({ fs: { evidenceBytes: Buffer.from("{not json", "utf8") } })).rejects.toThrow(
      /is not valid JSON/,
    );
    await expect(compose({ fs: { evidenceBytes: Buffer.from("[]", "utf8") } })).rejects.toThrow(
      /must be a JSON object/,
    );
  });

  it("refuses quality evidence that is not an accepted complete session", async () => {
    await expect(
      compose({ fs: { evidenceBytes: qualityEvidenceBytes({ status: "partial" }) } }),
    ).rejects.toThrow(/is not an accepted complete quality session/);
    await expect(
      compose({ fs: { evidenceBytes: qualityEvidenceBytes({ schema_version: "quality-evidence.v2" }) } }),
    ).rejects.toThrow(/Unsupported quality evidence schema/);
    await expect(
      compose({ fs: { evidenceBytes: qualityEvidenceBytes({ producer_id: "other-producer" }) } }),
    ).rejects.toThrow(/Unsupported quality evidence producer/);
  });

  it("refuses quality evidence with malformed or inconsistent counts", async () => {
    const inconsistent = qualityEvidenceBytes({
      payload: { counts: { total: 5, passed: 4, failed: 0, skipped: 0 }, failures: [], observations: [] },
    });
    const negative = qualityEvidenceBytes({
      payload: { counts: { total: 4, passed: 4, failed: 0, skipped: -1 }, failures: [], observations: [] },
    });
    const fractional = qualityEvidenceBytes({
      payload: { counts: { total: 4.5, passed: 4.5, failed: 0, skipped: 0 }, failures: [], observations: [] },
    });

    await expect(compose({ fs: { evidenceBytes: inconsistent } })).rejects.toThrow(
      /total must equal passed \+ failed \+ skipped/,
    );
    await expect(compose({ fs: { evidenceBytes: negative } })).rejects.toThrow(
      /must be a non-negative integer/,
    );
    await expect(compose({ fs: { evidenceBytes: fractional } })).rejects.toThrow(
      /must be a non-negative integer/,
    );
  });

  it("refuses record and manifest paths inside the artifact root and colliding paths", async () => {
    await expect(compose({ recordPath: path.join(DIST_ROOT, "release-provenance.json") })).rejects.toThrow(
      /must be written outside the artifact root/,
    );
    await expect(compose({ manifestPath: path.join(DIST_ROOT, "release.manifest.json") })).rejects.toThrow(
      /must be written outside the artifact root/,
    );
    await expect(compose({ recordPath: MANIFEST_PATH })).rejects.toThrow(/must be different files/);
  });
});

describe("resolveQualityEvidenceDirectory", () => {
  it("defaults to .faktorial/quality under the repository root", () => {
    expect(resolveQualityEvidenceDirectory(REPO_ROOT, {})).toBe(path.join(REPO_ROOT, ".faktorial", "quality"));
  });

  it("honors FAKTORIAL_QUALITY_EVIDENCE_DIR exactly like the quality writer", () => {
    expect(resolveQualityEvidenceDirectory(REPO_ROOT, { FAKTORIAL_QUALITY_EVIDENCE_DIR: "retained-evidence" })).toBe(
      path.resolve(REPO_ROOT, "retained-evidence"),
    );
  });

  it("rejects an empty repository root", () => {
    expect(() => resolveQualityEvidenceDirectory("", {})).toThrow(
      "Repository root must be a non-empty directory path.",
    );
  });
});

describe("serializeReleaseProvenance", () => {
  it("serializes with fixed key order and a trailing newline", () => {
    const text = serializeReleaseProvenance(expectedRecord());
    const document = JSON.parse(text);

    expect(text.endsWith("\n")).toBe(true);
    expect(Object.keys(document)).toEqual([
      "schema",
      "source_revision",
      "artifact_manifest",
      "quality_evidence",
      "publication",
    ]);
    expect(Object.keys(document.artifact_manifest)).toEqual(["path", "sha256"]);
    expect(Object.keys(document.quality_evidence)).toEqual([
      "digest",
      "schema_version",
      "producer_id",
      "status",
      "counts",
    ]);
    expect(Object.keys(document.publication)).toEqual(["deployment_id", "timestamp", "publisher"]);
    expect(text).toContain('"release-provenance.v1"');
  });

  it("is canonical regardless of record key insertion order", () => {
    const record = expectedRecord();
    const shuffled = {
      publication: record.publication,
      quality_evidence: record.quality_evidence,
      artifact_manifest: record.artifact_manifest,
      source_revision: record.source_revision,
      schema: record.schema,
    };

    expect(serializeReleaseProvenance(shuffled)).toBe(serializeReleaseProvenance(record));
  });

  it("contains no timestamps or machine paths", async () => {
    const { record } = await compose({ manifestPath: MANIFEST_PATH });
    const text = serializeReleaseProvenance(record);

    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}T/);
    expect(text).not.toContain(REPO_ROOT);
    expect(text).not.toMatch(/[A-Za-z]:\\/);
  });

  it("rejects non-object records and unsupported schemas", () => {
    expect(() => serializeReleaseProvenance(null)).toThrow("Release provenance record must be a JSON object.");
    expect(() =>
      serializeReleaseProvenance({ ...expectedRecord(), schema: "release-provenance.v2" }),
    ).toThrow(/Unsupported release provenance schema/);
  });
});
