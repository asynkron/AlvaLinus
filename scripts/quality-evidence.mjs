import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// Consume the JSON reporter from the same Vitest session shown in the terminal.
export async function writeQualityEvidence(reportFile, directory, root) {
  const report = JSON.parse(await readFile(reportFile, "utf8"));
  const observations = report.testResults.flatMap((suite) =>
    suite.assertionResults.map((test) => ({
      test: test.fullName,
      file: path.relative(root, suite.name).replaceAll("\\", "/"),
      status: test.status === "passed" ? "passed" : test.status === "failed" ? "failed" : "skipped",
      duration_nanos: Number.isFinite(test.duration) ? Math.round(test.duration * 1_000_000) : null,
      ...(test.failureMessages.length ? { message: test.failureMessages.join("\n") } : {}),
    })),
  );
  if (observations.length === 0) throw new Error("Vitest produced no terminal test results.");
  const counts = { total: observations.length, passed: 0, failed: 0, skipped: 0 };
  for (const test of observations) counts[test.status] += 1;
  const failures = observations
    .filter((test) => test.status === "failed")
    .map(({ test, file, message }) => ({ test, file, message }));
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
