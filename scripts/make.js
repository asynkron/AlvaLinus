import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeQualityEvidence } from "./quality-evidence.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const environment = { ...process.env };
delete environment.NODE_V8_COVERAGE;
const lockReceipt = "node_modules/.faktorial-lock.sha256";

async function exists(filename) {
  try {
    await access(filename);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function run(command, args, { cwd = root, allowFailure = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: environment, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (code === 0 || (allowFailure && code !== null)) resolve(code);
      else {
        const error = new Error(`${path.basename(command)} failed (${signal || `exit ${code}`}).`);
        error.code = code || 1;
        reject(error);
      }
    });
  });
}

function npm(args, cwd = root) {
  return process.platform === "win32"
    ? run(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `npm.cmd ${args.join(" ")}`], { cwd })
    : run("npm", args, { cwd });
}

async function lockHash(directory) {
  const hash = createHash("sha256");
  for (const file of ["package.json", "package-lock.json"]) hash.update(await readFile(path.join(directory, file)));
  return hash.digest("hex");
}

async function install(directory = root) {
  const hash = await lockHash(directory);
  await npm(["ci", "--include=dev", "--include=optional", "--no-audit", "--no-fund"], directory);
  await writeFile(path.join(directory, lockReceipt), hash);
}

async function tools() {
  const receipt = path.join(root, lockReceipt);
  const packages = ["typescript/bin/tsc", "vite/bin/vite.js", "vitest/vitest.mjs", "@vitest/coverage-v8/package.json", "@asynkron/astwalker-typescript/package.json"];
  if (!(await exists(receipt)) || (await readFile(receipt, "utf8")) !== await lockHash(root) ||
    (await Promise.all(packages.map((file) => exists(path.join(root, "node_modules", file))))).some((present) => !present)) {
    await install();
  }
}

async function typecheck() {
  await tools();
  await run(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-b"]);
}

async function frontendBuild() {
  await tools();
  await run(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "build"]);
  await run(process.execPath, ["scripts/assert-static-routes.mjs"]);
  await run(process.execPath, ["scripts/assert-route-visual-assets.mjs"]);
}

async function build() {
  await typecheck();
  await frontendBuild();
}

async function tests(coverage = false) {
  await tools();
  const directory = path.resolve(root, process.env.FAKTORIAL_QUALITY_EVIDENCE_DIR || ".faktorial/quality");
  await mkdir(directory, { recursive: true });
  const report = path.join(directory, "vitest-results.json");
  for (const file of [report, path.join(directory, "vitest-tests.quality-evidence.json")]) {
    await rm(file, { force: true });
  }
  const code = await run(process.execPath, [
    path.join(root, "node_modules/vitest/vitest.mjs"), "run",
    "--reporter=default", "--reporter=json", `--outputFile=${report}`,
    ...(coverage ? ["--coverage"] : []),
  ], { allowFailure: true });
  await writeQualityEvidence(report, directory, root);
  if (code !== 0) {
    const error = new Error(`Vitest failed (exit ${code}).`);
    error.code = code;
    throw error;
  }
}

async function serve(preview = false) {
  await tools();
  const port = process.env.PORT || "5173";
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error("PORT must be between 1 and 65535.");
  await run(process.execPath, [
    path.join(root, "node_modules/vite/bin/vite.js"),
    ...(preview ? ["preview"] : []), "--host", "0.0.0.0", "--port", port, "--strictPort",
  ]);
}

const targets = {
  help: async () => console.log(`AlvaLinus — Node.js 24+\n
Usage: make <target>, make.cmd <target>, or node scripts/make.js <target>

  workspace       Install locked dependencies; no tests
  worktree        Install dependencies in FAKTORIAL_WORKTREE_PATH; no tests
  dependencies    Install locked dependencies; no tests
  tools           Ensure tools match package.json and package-lock.json
  preflight       Check Node.js, npm, and the committed lockfile
  lint            Check strict TypeScript types
  quality         Type-check, build all static routes, and run one test session
  coverage        Run instrumented tests and emit Istanbul coverage separately
  build           Type-check and build deployable static assets in dist/
  frontend-build  Build static assets and verify routes and visuals
  frontend-dev    Start Vite on PORT (default 5173)
  start           Start Vite on PORT (default 5173)
  dev             Start Vite on PORT (default 5173)
  preview         Serve the built dist/ on PORT (default 5173)
  clean           Remove generated dependencies, dist/, and coverage/
  help            Show this help`),
  workspace: () => install(),
  worktree: async () => {
    if (!process.env.FAKTORIAL_WORKTREE_PATH) throw new Error("worktree requires FAKTORIAL_WORKTREE_PATH.");
    await install(path.resolve(root, process.env.FAKTORIAL_WORKTREE_PATH));
  },
  dependencies: () => install(),
  tools,
  preflight: async () => {
    await lockHash(root);
    await npm(["--version"]);
    console.log(`Preflight ready: Node.js ${process.versions.node}, npm, and package-lock.json.`);
  },
  lint: typecheck,
  quality: async () => { await build(); await tests(); },
  coverage: () => tests(true),
  build,
  "frontend-build": frontendBuild,
  "frontend-dev": () => serve(),
  start: () => serve(),
  dev: () => serve(),
  preview: () => serve(true),
  clean: async () => {
    for (const directory of ["node_modules", "dist", "coverage"]) {
      await rm(path.join(root, directory), { recursive: true, force: true });
    }
  },
};

try {
  if (Number(process.versions.node.split(".")[0]) < 24) throw new Error("Node.js 24 or newer is required.");
  const args = process.argv.slice(2);
  const target = args[0]?.toLowerCase() || "help";
  if (args.length > 1 || !Object.hasOwn(targets, target)) throw new Error(`Unknown target or arguments: ${args.join(" ")}. Run make help.`);
  await targets[target]();
} catch (error) {
  console.error(error.message);
  process.exitCode = Number.isInteger(error.code) ? error.code : 1;
}
