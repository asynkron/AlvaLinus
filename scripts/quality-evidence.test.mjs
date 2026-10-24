// @vitest-environment node
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { normalizeQualityEvidence, writeQualityEvidence } from "./quality-evidence.mjs";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(),
  readFile: vi.fn(),
  rename: vi.fn(),
  writeFile: vi.fn(),
}));

const root = path.resolve("evidence-root");
const suitePath = path.join(root, "src", "app.test.tsx");
const reportPath = path.join(root, ".faktorial", "quality", "vitest-results.json");
const evidenceDirectory = path.join(root, ".faktorial", "quality");
const destinationPath = path.join(evidenceDirectory, "vitest-tests.quality-evidence.json");

function assertionResult(fullName, status, duration, failureMessages = []) {
  const titles = fullName.split(" ");
  return {
    ancestorTitles: titles.slice(0, -1),
    fullName,
    status,
    title: titles.at(-1) ?? fullName,
    duration,
    failureMessages,
    location: null,
    meta: {},
    tags: [],
  };
}

function suite(name, assertionResults) {
  return { name, status: "passed", message: "", startTime: 0, endTime: 0, assertionResults };
}

function reportWith(...suites) {
  return JSON.stringify({ numTotalTests: 0, success: true, testResults: suites });
}

function observation(fullName, status, durationNanos, message) {
  return {
    test: fullName,
    file: "src/app.test.tsx",
    status,
    duration_nanos: durationNanos,
    ...(message === undefined ? {} : { message }),
  };
}

describe("normalizeQualityEvidence", () => {
  it("preserves supported statuses, counts, joined failure messages, and forward-slash relative paths", () => {
    const report = {
      testResults: [
        suite(suitePath, [
          assertionResult("adapter keeps passed tests", "passed", 1.5),
          assertionResult("adapter reports failures", "failed", 2, [
            "AssertionError: expected 1 to be 2",
            "    at src/app.test.tsx:10:5",
          ]),
          assertionResult("adapter keeps skipped tests", "skipped", undefined),
        ]),
      ],
    };

    const { counts, failures, observations } = normalizeQualityEvidence(report, root);

    expect(observations).toEqual([
      observation("adapter keeps passed tests", "passed", 1_500_000),
      observation(
        "adapter reports failures",
        "failed",
        2_000_000,
        "AssertionError: expected 1 to be 2\n    at src/app.test.tsx:10:5",
      ),
      observation("adapter keeps skipped tests", "skipped", null),
    ]);
    expect(counts).toEqual({ total: 3, passed: 1, failed: 1, skipped: 1 });
    expect(failures).toEqual([
      {
        test: "adapter reports failures",
        file: "src/app.test.tsx",
        message: "AssertionError: expected 1 to be 2\n    at src/app.test.tsx:10:5",
      },
    ]);
  });

  it("normalizes absent, NaN, infinite, and negative durations to null without inventing timing data", () => {
    const report = {
      testResults: [
        suite(suitePath, [
          assertionResult("zero duration", "passed", 0),
          assertionResult("fractional duration", "passed", 12.34),
          assertionResult("absent duration", "passed", undefined),
          assertionResult("NaN duration", "passed", Number.NaN),
          assertionResult("infinite duration", "passed", Number.POSITIVE_INFINITY),
          assertionResult("negative infinite duration", "passed", Number.NEGATIVE_INFINITY),
          assertionResult("negative duration", "passed", -5),
        ]),
      ],
    };

    const { observations } = normalizeQualityEvidence(report, root);

    expect(observations.map((entry) => entry.duration_nanos)).toEqual([
      0, 12_340_000, null, null, null, null, null,
    ]);
  });

  it("rejects todo, pending, and unknown statuses naming the test and raw status", () => {
    for (const status of ["todo", "pending", "disabled", "queued", "", undefined]) {
      const report = {
        testResults: [suite(suitePath, [assertionResult(`adapter sees ${status}`, status)])],
      };

      expect(() => normalizeQualityEvidence(report, root)).toThrow(
        `Test adapter sees ${status} reported unsupported status ${JSON.stringify(status)}; ` +
        "supported statuses are passed, failed, and skipped.",
      );
    }
  });

  it("rejects malformed report structures with deterministic errors", () => {
    expect(() => normalizeQualityEvidence(null, root)).toThrow("Vitest report must be a JSON object.");
    expect(() => normalizeQualityEvidence("report", root)).toThrow("Vitest report must be a JSON object.");
    expect(() => normalizeQualityEvidence(42, root)).toThrow("Vitest report must be a JSON object.");
    expect(() => normalizeQualityEvidence([], root)).toThrow("Vitest report must be a JSON object.");
    expect(() => normalizeQualityEvidence({}, root)).toThrow("Vitest report is missing a testResults array.");
    expect(() => normalizeQualityEvidence({ testResults: "none" }, root)).toThrow(
      "Vitest report is missing a testResults array.",
    );
    expect(() => normalizeQualityEvidence({ testResults: [{ assertionResults: [] }] }, root)).toThrow(
      "Vitest report suite at index 0 has no string name.",
    );
    expect(() => normalizeQualityEvidence({ testResults: [suite(7, [])] }, root)).toThrow(
      "Vitest report suite at index 0 has no string name.",
    );
    expect(() => normalizeQualityEvidence({ testResults: [suite(suitePath)] }, root)).toThrow(
      `Vitest suite ${suitePath} has no assertionResults array.`,
    );
    expect(() => normalizeQualityEvidence({ testResults: [suite(suitePath, [{ status: "passed" }])] }, root)).toThrow(
      `Test in suite ${suitePath} has no string fullName.`,
    );
    expect(() =>
      normalizeQualityEvidence({ testResults: [suite(suitePath, [assertionResult("no messages", "passed", 1, "boom")])] }, root),
    ).toThrow(`Test no messages has no failureMessages array.`);
  });

  it("rejects reports with no terminal test results", () => {
    expect(() => normalizeQualityEvidence({ testResults: [] }, root)).toThrow(
      "Vitest produced no terminal test results.",
    );
    expect(() => normalizeQualityEvidence({ testResults: [suite(suitePath, [])] }, root)).toThrow(
      "Vitest produced no terminal test results.",
    );
  });
});

describe("writeQualityEvidence", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("publishes evidence atomically with preserved schema identity", async () => {
    readFile.mockResolvedValue(reportWith(
      suite(suitePath, [
        assertionResult("publishing keeps counts", "passed", 3),
        assertionResult("publishing keeps failures", "failed", 1, ["AssertionError: boom"]),
      ]),
    ));

    await writeQualityEvidence(reportPath, evidenceDirectory, root);

    expect(mkdir).toHaveBeenCalledWith(evidenceDirectory, { recursive: true });
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile.mock.calls[0][0]).toBe(`${destinationPath}.tmp`);
    const document = JSON.parse(writeFile.mock.calls[0][1]);
    expect(document).toEqual({
      schema_version: "quality-evidence.v1",
      producer_id: "vitest-tests",
      kind: "test-results",
      payload_schema: "test-results.v1",
      status: "complete",
      payload: {
        counts: { total: 2, passed: 1, failed: 1, skipped: 0 },
        failures: [{ test: "publishing keeps failures", file: "src/app.test.tsx", message: "AssertionError: boom" }],
        observations: [
          observation("publishing keeps counts", "passed", 3_000_000),
          observation("publishing keeps failures", "failed", 1_000_000, "AssertionError: boom"),
        ],
      },
    });
    expect(writeFile.mock.calls[0][1].endsWith("\n")).toBe(true);
    expect(rename).toHaveBeenCalledTimes(1);
    expect(rename).toHaveBeenCalledWith(`${destinationPath}.tmp`, destinationPath);
    expect(writeFile.mock.invocationCallOrder[0]).toBeLessThan(rename.mock.invocationCallOrder[0]);
  });

  it("publishes no evidence file for unparseable JSON", async () => {
    readFile.mockResolvedValue("{ not json");

    await expect(writeQualityEvidence(reportPath, evidenceDirectory, root)).rejects.toThrow(
      `Vitest report ${reportPath} is not valid JSON:`,
    );
    expect(mkdir).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(rename).not.toHaveBeenCalled();
  });

  it("publishes no evidence file when a test reports an unsupported status", async () => {
    readFile.mockResolvedValue(reportWith(
      suite(suitePath, [assertionResult("queued internal state", "pending")]),
    ));

    await expect(writeQualityEvidence(reportPath, evidenceDirectory, root)).rejects.toThrow(
      'Test queued internal state reported unsupported status "pending"',
    );
    expect(mkdir).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(rename).not.toHaveBeenCalled();
  });

  it("publishes no evidence file when the report has no terminal results", async () => {
    readFile.mockResolvedValue(reportWith());

    await expect(writeQualityEvidence(reportPath, evidenceDirectory, root)).rejects.toThrow(
      "Vitest produced no terminal test results.",
    );
    expect(mkdir).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(rename).not.toHaveBeenCalled();
  });
});
