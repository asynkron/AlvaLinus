# Development

AlvaLinus is a small static React and TypeScript site built with Vite. Keep the
site static: it has no backend, database, authentication, or serverless runtime.
Reuse the existing components, typed content, and route inventory.

- Use Node.js 24 or newer. Prepare each checkout with `make workspace` or
  `make.cmd workspace` on Windows. Dependencies come from `npm ci` and the
  committed lockfile.
- `make quality` is the normal test entrypoint. It checks strict TypeScript,
  builds the site, validates static route assets, and runs one Vitest session.
  Windows uses `make.cmd quality`; neither PowerShell nor GNU make is required.
- `make coverage` is separate from normal quality. It emits native Istanbul
  JSON under `FAKTORIAL_COVERAGE_OUTPUT_DIR/coverage-native` when that variable
  is set, or `coverage/coverage-native` otherwise.
- `.faktorial/main-verify.json` and `coverage-evidence.json` declare the worker
  commands and evidence producers. The quality runner writes test evidence to
  `FAKTORIAL_QUALITY_EVIDENCE_DIR`, or `.faktorial/quality` for local runs.
  Generated evidence and other `.faktorial/` runtime state stay outside Git.
- Keep tests in memory. Mock external I/O; do not add database, network,
  filesystem-write, or process-backed tests.
- `make build` produces deployable static files in `dist/`. `make frontend-dev`
  starts Vite; `make preview` serves a completed build. Both bind the `PORT`
  environment variable, defaulting to 5173.
- `make worktree` installs locked dependencies in `FAKTORIAL_WORKTREE_PATH`.
  Workspace preparation must not run tests or generate coverage.
- Read `docs/rules/README.md` before changing site behavior. Preserve Swedish
  text, static subpage output, and page-specific assets.
