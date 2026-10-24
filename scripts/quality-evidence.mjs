import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// The installed Vitest JSON reporter (vitest 4.1.9 StatusMap) emits only these
// assertion statuses; anything else is an unsupported reporter state.
const SUPPORTED_STATUSES = new Set(["passed", "failed", "skipped"]);

function toDurationNanos(duration) {
  // Preserve real timing only: absent, NaN, infinite, and negative durations
  // become null instead of invented evidence.
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0
    ? Math.round(duration * 1_000_000)
    : null;
}

// Pure boundary between the installed Vitest JSON reporter output and the
// published quality-evidence document. Throws deterministic descriptive errors
// for malformed reports, incomplete results, and unsupported statuses.
export function normalizeQualityEvidence(report, root) {
  if (typeof report !== "object" || report === null || Array.isArray(report)) {
    throw new Error("Vitest report must be a JSON object.");
  }
  if (!Array.isArray(report.testResults)) {
    throw new Error("Vitest report is missing a testResults array.");
  }
  const observations = report.testResults.flatMap((suite, suiteIndex) => {
    if (typeof suite?.name !== "string") {
      throw new Error(`Vitest report suite at index ${suiteIndex} has no string name.`);
    }
    if (!Array.isArray(suite.assertionResults)) {
      throw new Error(`Vitest suite ${suite.name} has no assertionResults array.`);
    }
    return suite.assertionResults.map((test) => {
      if (typeof test?.fullName !== "string") {
        throw new Error(`Test in suite ${suite.name} has no string fullName.`);
      }
      if (!Array.isArray(test.failureMessages)) {
        throw new Error(`Test ${test.fullName} has no failureMessages array.`);
      }
      if (!SUPPORTED_STATUSES.has(test.status)) {
        throw new Error(
          `Test ${test.fullName} reported unsupported status ${JSON.stringify(test.status)}; ` +
          "supported statuses are passed, failed, and skipped.",
        );
      }
      return {
        test: test.fullName,
        file: path.relative(root, suite.name).replaceAll("\\", "/"),
        status: test.status,
        duration_nanos: toDurationNanos(test.duration),
        ...(test.failureMessages.length ? { message: test.failureMessages.join("\n") } : {}),
      };
    });
  });
  if (observations.length === 0) throw new Error("Vitest produced no terminal test results.");
  const counts = { total: observations.length, passed: 0, failed: 0, skipped: 0 };
  for (const test of observations) counts[test.status] += 1;
  const failures = observations
    .filter((test) => test.status === "failed")
    .map(({ test, file, message }) => ({ test, file, message }));
  return { counts, failures, observations };
}

// Consume the JSON reporter from the same Vitest session shown in the terminal.
export async function writeQualityEvidence(reportFile, directory, root) {
  let report;
  try {
    report = JSON.parse(await readFile(reportFile, "utf8"));
  } catch (error) {
    throw new Error(`Vitest report ${reportFile} is not valid JSON: ${error.message}`);
  }
  const { counts, failures, observations } = normalizeQualityEvidence(report, root);
  await mkdir(directory, { recursive: true });
  const destination = path.join(directory, "vitest-tests.quality-evidence.json");
  const temporary = `${destination}.tmp`;
  await writeFile(temporary, `${JSON.stringify({
    schema_version: "quality-evidence.v1",
    producer_id: "vitest-tests",
    kind: "test-results",
    payload_schema: "test-results.v1",
    status: "complete",
    payload: { counts, failures, observations },
  }, null, 2)}\n`);
  await rename(temporary, destination);
  console.log(`Quality evidence: ${counts.total} tests, ${counts.failed} failed, ${counts.skipped} skipped.`);
}
