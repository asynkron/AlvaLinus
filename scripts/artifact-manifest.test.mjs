// @vitest-environment node
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  ARTIFACT_MANIFEST_ALGORITHM,
  ARTIFACT_MANIFEST_SCHEMA,
  assertManifestPathOutsideRoot,
  buildArtifactManifest,
  parseArtifactManifest,
  serializeArtifactManifest,
  verifyArtifactManifest,
} from "./artifact-manifest.mjs";

const ROOT_NAME = "dist";

const HELLO_BYTES = Buffer.from("hello", "utf8");
const HELLO_SHA256 = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
const ABC_BYTES = Buffer.from("abc", "utf8");
const ABC_SHA256 = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
const FONT_BYTES = Uint8Array.from([0x00, 0x01, 0x02, 0xfe, 0xff, 0x7f, 0x80]);

const EXPECTED_SORTED_PATHS = [
  "assets/index-B1oM8pQ2.js",
  "assets/inter-latin-wght.woff2",
  "index.html",
  "page-visuals/logo.svg",
  "page-visuals/svard-entreprenad-home.svg",
  "tjanster/index.html",
  "tjanster/kontakt/index.html",
];

function artifactFixture() {
  return {
    "index.html": HELLO_BYTES,
    "assets/index-B1oM8pQ2.js": ABC_BYTES,
    "assets/inter-latin-wght.woff2": FONT_BYTES,
    "page-visuals/logo.svg": ABC_BYTES,
    "page-visuals/svard-entreprenad-home.svg": HELLO_BYTES,
    "tjanster/index.html": HELLO_BYTES,
    "tjanster/kontakt/index.html": ABC_BYTES,
  };
}

function isMarker(value, kind) {
  return typeof value === "object" && value !== null && value[kind] === true;
}

function memoryArtifactFileSystem(files, { rootState = "directory" } = {}) {
  const root = path.resolve(ROOT_NAME);
  const regularFiles = new Map();
  const symlinks = new Set();
  const directories = new Set([root]);
  const directoryChildren = new Map([[root, []]]);

  for (const [relative, content] of Object.entries(files)) {
    const segments = relative.split("/");
    let current = root;
    for (const segment of segments.slice(0, -1)) {
      const children = directoryChildren.get(current) ?? [];
      if (!children.includes(segment)) children.push(segment);
      directoryChildren.set(current, children);
      current = path.join(current, segment);
      directories.add(current);
    }
    const name = segments[segments.length - 1];
    const children = directoryChildren.get(current) ?? [];
    children.push(name);
    directoryChildren.set(current, children);
    const absolutePath = path.join(current, name);
    if (isMarker(content, "symlink")) symlinks.add(absolutePath);
    else if (!isMarker(content, "socket")) regularFiles.set(absolutePath, content);
  }

  const missingError = (filePath) =>
    Object.assign(new Error(`ENOENT: no such file or directory, ${filePath}`), { code: "ENOENT" });

  const rootDirent = () => {
    if (rootState === "symlink") return { isSymbolicLink: () => true, isDirectory: () => false };
    if (rootState === "file") return { isSymbolicLink: () => false, isDirectory: () => false };
    return { isSymbolicLink: () => false, isDirectory: () => true };
  };

  const childDirent = (name, childPath) => {
    if (symlinks.has(childPath)) {
      return { name, isSymbolicLink: () => true, isDirectory: () => false, isFile: () => false };
    }
    if (regularFiles.has(childPath)) {
      return { name, isSymbolicLink: () => false, isDirectory: () => false, isFile: () => true };
    }
    if (directories.has(childPath)) {
      return { name, isSymbolicLink: () => false, isDirectory: () => true, isFile: () => false };
    }
    return { name, isSymbolicLink: () => false, isDirectory: () => false, isFile: () => false };
  };

  return {
    lstat: vi.fn(async (filePath) => {
      if (rootState === "missing") throw missingError(filePath);
      return rootDirent();
    }),
    readdir: vi.fn(async (directoryPath) => {
      const children = directoryChildren.get(directoryPath);
      if (children === undefined) throw missingError(directoryPath);
      return children.map((name) => childDirent(name, path.join(directoryPath, name)));
    }),
    readFile: vi.fn(async (filePath) => {
      const bytes = regularFiles.get(filePath);
      if (bytes === undefined) throw missingError(filePath);
      return bytes;
    }),
  };
}

function buildManifestFrom(files, options = {}) {
  return buildArtifactManifest({ root: ROOT_NAME, ...memoryArtifactFileSystem(files, options) });
}

function manifestWith(files) {
  return { schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: ARTIFACT_MANIFEST_ALGORITHM, files };
}

function manifestTextWith(files) {
  return JSON.stringify(manifestWith(files));
}

describe("buildArtifactManifest", () => {
  it("inventories every regular file in sorted normalized order with raw-byte SHA-256 digests", async () => {
    const manifest = await buildManifestFrom(artifactFixture());

    expect(manifest.schema).toBe("artifact-manifest.v1");
    expect(manifest.algorithm).toBe("sha256");
    expect(manifest.files.map((file) => file.path)).toEqual(EXPECTED_SORTED_PATHS);
    for (const file of manifest.files) expect(file.path).not.toContain("\\");
    expect(manifest.files.find((file) => file.path === "index.html")?.sha256).toBe(HELLO_SHA256);
    expect(manifest.files.find((file) => file.path === "assets/index-B1oM8pQ2.js")?.sha256).toBe(ABC_SHA256);
  });

  it("produces byte-identical serialization regardless of filesystem iteration order", async () => {
    const forward = await buildManifestFrom(artifactFixture());
    const backward = await buildManifestFrom(
      Object.fromEntries(Object.entries(artifactFixture()).reverse()),
    );

    expect(serializeArtifactManifest(backward)).toBe(serializeArtifactManifest(forward));
  });

  it("reflects a binary byte change in exactly one entry", async () => {
    const before = await buildManifestFrom(artifactFixture());
    const flipped = Uint8Array.from(FONT_BYTES);
    flipped[2] = 0x03;
    const after = await buildManifestFrom({
      ...artifactFixture(),
      "assets/inter-latin-wght.woff2": flipped,
    });

    const beforeEntry = before.files.find((file) => file.path === "assets/inter-latin-wght.woff2");
    const afterEntry = after.files.find((file) => file.path === "assets/inter-latin-wght.woff2");
    expect(afterEntry?.sha256).not.toBe(beforeEntry?.sha256);
    expect(after.files.filter((file) => file.path !== "assets/inter-latin-wght.woff2")).toEqual(
      before.files.filter((file) => file.path !== "assets/inter-latin-wght.woff2"),
    );
  });

  it("rejects missing, non-directory, and symlinked artifact roots", async () => {
    await expect(buildManifestFrom(artifactFixture(), { rootState: "missing" })).rejects.toThrow(
      'Artifact root "dist" does not exist.',
    );
    await expect(buildManifestFrom(artifactFixture(), { rootState: "file" })).rejects.toThrow(
      'Artifact root "dist" is not a directory.',
    );
    await expect(buildManifestFrom(artifactFixture(), { rootState: "symlink" })).rejects.toThrow(
      'Artifact root "dist" is a symlink; supply a real directory.',
    );
  });

  it("rejects an empty artifact tree and an empty root path", async () => {
    await expect(buildManifestFrom({})).rejects.toThrow('Artifact root "dist" contains no regular files.');
    await expect(
      buildArtifactManifest({ root: "", ...memoryArtifactFileSystem(artifactFixture()) }),
    ).rejects.toThrow("Artifact root must be a non-empty directory path.");
  });

  it("rejects symlinks anywhere inside the artifact tree", async () => {
    await expect(
      buildManifestFrom({ ...artifactFixture(), "assets/latest.png": { symlink: true } }),
    ).rejects.toThrow(
      'Artifact tree entry "assets/latest.png" is a symlink; manifests cover real files only.',
    );
  });

  it("rejects entries that are neither regular files nor directories", async () => {
    await expect(
      buildManifestFrom({ ...artifactFixture(), "assets/cache.sock": { socket: true } }),
    ).rejects.toThrow('Artifact tree entry "assets/cache.sock" is not a regular file or directory.');
  });
});

describe("verifyArtifactManifest", () => {
  it("reports no differences when the tree matches the manifest", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    const report = await verifyArtifactManifest({
      root: ROOT_NAME,
      manifest,
      ...memoryArtifactFileSystem(artifactFixture()),
    });

    expect(report).toEqual({ missing: [], added: [], changed: [] });
  });

  it("reports a missing file", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    const tree = artifactFixture();
    delete tree["assets/index-B1oM8pQ2.js"];
    const report = await verifyArtifactManifest({
      root: ROOT_NAME,
      manifest,
      ...memoryArtifactFileSystem(tree),
    });

    expect(report.missing).toEqual(["assets/index-B1oM8pQ2.js"]);
    expect(report.added).toEqual([]);
    expect(report.changed).toEqual([]);
  });

  it("reports an added file", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    const report = await verifyArtifactManifest({
      root: ROOT_NAME,
      manifest,
      ...memoryArtifactFileSystem({ ...artifactFixture(), "kontakt/index.html": HELLO_BYTES }),
    });

    expect(report.added).toEqual(["kontakt/index.html"]);
    expect(report.missing).toEqual([]);
    expect(report.changed).toEqual([]);
  });

  it("reports a byte-changed file with both digests", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    const report = await verifyArtifactManifest({
      root: ROOT_NAME,
      manifest,
      ...memoryArtifactFileSystem({ ...artifactFixture(), "index.html": ABC_BYTES }),
    });

    expect(report.changed).toEqual([
      { path: "index.html", manifestSha256: HELLO_SHA256, artifactSha256: ABC_SHA256 },
    ]);
    expect(report.missing).toEqual([]);
    expect(report.added).toEqual([]);
  });

  it("reports missing, added, and changed files together in sorted order", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    const tree = artifactFixture();
    delete tree["assets/index-B1oM8pQ2.js"];
    tree["index.html"] = ABC_BYTES;
    tree["kontakt/index.html"] = HELLO_BYTES;
    const report = await verifyArtifactManifest({
      root: ROOT_NAME,
      manifest,
      ...memoryArtifactFileSystem(tree),
    });

    expect(report.missing).toEqual(["assets/index-B1oM8pQ2.js"]);
    expect(report.added).toEqual(["kontakt/index.html"]);
    expect(report.changed).toEqual([
      { path: "index.html", manifestSha256: HELLO_SHA256, artifactSha256: ABC_SHA256 },
    ]);
  });

  it("fails on duplicate manifest entries", async () => {
    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest: manifestWith([
          { path: "index.html", sha256: HELLO_SHA256 },
          { path: "index.html", sha256: ABC_SHA256 },
        ]),
        ...memoryArtifactFileSystem(artifactFixture()),
      }),
    ).rejects.toThrow('Artifact manifest lists "index.html" more than once.');
  });

  it("fails on malformed manifest entries and unsupported formats", async () => {
    const shortDigest = manifestWith([{ path: "index.html", sha256: HELLO_SHA256.slice(0, 63) }]);
    const escapingPath = manifestWith([{ path: "../secrets.txt", sha256: HELLO_SHA256 }]);
    const wrongSchema = {
      schema: "artifact-manifest.v2",
      algorithm: ARTIFACT_MANIFEST_ALGORITHM,
      files: [{ path: "index.html", sha256: HELLO_SHA256 }],
    };
    const wrongAlgorithm = {
      schema: ARTIFACT_MANIFEST_SCHEMA,
      algorithm: "md5",
      files: [{ path: "index.html", sha256: HELLO_SHA256 }],
    };

    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest: shortDigest,
        ...memoryArtifactFileSystem(artifactFixture()),
      }),
    ).rejects.toThrow(
      'Artifact manifest entry "index.html" must declare a lowercase 64-character sha256 digest.',
    );
    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest: escapingPath,
        ...memoryArtifactFileSystem(artifactFixture()),
      }),
    ).rejects.toThrow(
      'Artifact manifest path "../secrets.txt" must be normalized without empty, ".", or ".." segments.',
    );
    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest: wrongSchema,
        ...memoryArtifactFileSystem(artifactFixture()),
      }),
    ).rejects.toThrow(
      'Unsupported artifact manifest schema "artifact-manifest.v2"; expected "artifact-manifest.v1".',
    );
    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest: wrongAlgorithm,
        ...memoryArtifactFileSystem(artifactFixture()),
      }),
    ).rejects.toThrow('Unsupported artifact manifest algorithm "md5"; expected "sha256".');
  });

  it("rejects an artifact tree with no regular files", async () => {
    const manifest = await buildManifestFrom(artifactFixture());
    await expect(
      verifyArtifactManifest({
        root: ROOT_NAME,
        manifest,
        ...memoryArtifactFileSystem({}),
      }),
    ).rejects.toThrow('Artifact root "dist" contains no regular files.');
  });
});

describe("parseArtifactManifest", () => {
  it("round-trips canonical serialization", () => {
    const text = serializeArtifactManifest(manifestWith([{ path: "index.html", sha256: HELLO_SHA256 }]));
    const manifest = parseArtifactManifest(text);

    expect(manifest).toEqual(manifestWith([{ path: "index.html", sha256: HELLO_SHA256 }]));
    expect(serializeArtifactManifest(manifest)).toBe(text);
  });

  it("rejects invalid JSON and non-object documents", () => {
    expect(() => parseArtifactManifest("{not json")).toThrow(/not valid JSON/);
    expect(() => parseArtifactManifest("[]")).toThrow("Artifact manifest must be a JSON object.");
    expect(() => parseArtifactManifest("null")).toThrow("Artifact manifest must be a JSON object.");
    expect(() => parseArtifactManifest(42)).toThrow("Artifact manifest must be text.");
  });

  it("rejects missing, non-array, and empty files inventories", () => {
    expect(() => parseArtifactManifest("{}")).toThrow(
      'Unsupported artifact manifest schema undefined; expected "artifact-manifest.v1".',
    );
    expect(() =>
      parseArtifactManifest(
        JSON.stringify({ schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: ARTIFACT_MANIFEST_ALGORITHM }),
      ),
    ).toThrow("Artifact manifest is missing a files array.");
    expect(() =>
      parseArtifactManifest(
        JSON.stringify({ schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: ARTIFACT_MANIFEST_ALGORITHM, files: {} }),
      ),
    ).toThrow("Artifact manifest is missing a files array.");
    expect(() =>
      parseArtifactManifest(
        JSON.stringify({ schema: ARTIFACT_MANIFEST_SCHEMA, algorithm: ARTIFACT_MANIFEST_ALGORITHM, files: [] }),
      ),
    ).toThrow("Artifact manifest must list at least one file.");
  });

  it("rejects malformed digests", () => {
    const malformed = [
      "A".repeat(64),
      "a".repeat(63),
      "g".repeat(64),
      HELLO_SHA256.toUpperCase(),
      undefined,
    ];
    for (const digest of malformed) {
      expect(() =>
        parseArtifactManifest(manifestTextWith([{ path: "index.html", sha256: digest }])),
      ).toThrow(
        'Artifact manifest entry "index.html" must declare a lowercase 64-character sha256 digest.',
      );
    }
  });

  it("rejects non-normalized, absolute, and escaping paths", () => {
    const invalidPaths = [
      "../secrets.txt",
      "/index.html",
      "assets\\index.js",
      "C:/index.html",
      "./index.html",
      "assets//double.js",
      "assets/./dot.js",
      "assets/trailing/",
      "nul\u0000byte",
    ];
    for (const invalidPath of invalidPaths) {
      expect(() =>
        parseArtifactManifest(manifestTextWith([{ path: invalidPath, sha256: HELLO_SHA256 }])),
      ).toThrow();
      expect(() =>
        parseArtifactManifest(manifestTextWith([{ path: invalidPath, sha256: HELLO_SHA256 }])),
      ).toThrow(/Artifact manifest path/);
    }
  });
});

describe("serializeArtifactManifest", () => {
  it("emits a stable canonical document without timestamps or machine paths", () => {
    const text = serializeArtifactManifest(manifestWith([{ path: "index.html", sha256: HELLO_SHA256 }]));
    const document = JSON.parse(text);

    expect(text.endsWith("\n")).toBe(true);
    expect(Object.keys(document)).toEqual(["schema", "algorithm", "files"]);
    expect(Object.keys(document.files[0])).toEqual(["path", "sha256"]);
    expect(text).toContain('"artifact-manifest.v1"');
    expect(text).toContain('"sha256"');
    expect(text).not.toMatch(/timestamp|generated|Date|artifactRoot|root:/i);
  });
});

describe("assertManifestPathOutsideRoot", () => {
  it("accepts manifest locations outside the artifact root", () => {
    expect(() => assertManifestPathOutsideRoot("dist", "dist.manifest.json")).not.toThrow();
    expect(() =>
      assertManifestPathOutsideRoot("dist", path.join("release", "dist.manifest.json")),
    ).not.toThrow();
  });

  it("rejects manifest paths inside the artifact root", () => {
    expect(() => assertManifestPathOutsideRoot("dist", path.join("dist", "manifest.json"))).toThrow(
      /must be written outside the artifact root/,
    );
    expect(() =>
      assertManifestPathOutsideRoot("dist", path.join("dist", "assets", "nested.json")),
    ).toThrow(/must be written outside the artifact root/);
    expect(() => assertManifestPathOutsideRoot("dist", "dist")).toThrow(
      /must be written outside the artifact root/,
    );
  });

  it("rejects empty inputs", () => {
    expect(() => assertManifestPathOutsideRoot("", "x.json")).toThrow(
      "Artifact root must be a non-empty directory path.",
    );
    expect(() => assertManifestPathOutsideRoot("dist", "")).toThrow(
      "Manifest path must be a non-empty file path.",
    );
  });
});
