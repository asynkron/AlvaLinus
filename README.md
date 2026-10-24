# AlvaLinus

AlvaLinus is a static React, TypeScript, Vite, and Shadcn-style website foundation.
It has no backend runtime, API server, database, authentication, or serverless
functions. The production output is static assets in `dist/`.

## Commands

Use Node.js 24 or newer. The same commands work on macOS/Linux with `make` and
on Windows with `make.cmd`. GNU make and PowerShell are not needed on Windows.
Every target is also available as `node scripts/make.js <target>`.

| Task | macOS / Linux | Windows |
| --- | --- | --- |
| Install locked dependencies | `make workspace` | `make.cmd workspace` |
| Run normal quality checks | `make quality` | `make.cmd quality` |
| Generate separate coverage | `make coverage` | `make.cmd coverage` |
| Build static assets | `make build` | `make.cmd build` |
| Start Vite | `make frontend-dev` | `make.cmd frontend-dev` |
| Serve a completed build | `make preview` | `make.cmd preview` |

`quality` checks strict TypeScript, builds all static routes, validates route
assets, and runs the existing React tests in one Vitest session. Coverage is
collected only by `coverage`. Development and preview use `PORT`, defaulting to
5173, and bind all interfaces so a worker-hosted preview is reachable.

Faktorial reads `.faktorial/main-verify.json` for default-branch quality and
`coverage-evidence.json` for coverage. Test results are emitted as
`quality-evidence.v1` to `FAKTORIAL_QUALITY_EVIDENCE_DIR` (default:
`.faktorial/quality`). Coverage uses `FAKTORIAL_COVERAGE_OUTPUT_DIR` (default:
`coverage`) and writes `coverage-native/coverage-final.json`. Generated reports
and other runtime state are ignored by Git.

For a worker task checkout, `make worktree` / `make.cmd worktree` installs
locked dependencies in `FAKTORIAL_WORKTREE_PATH` without running tests.
The pinned `@asynkron/astwalker-typescript` alias supports Faktorial's analysis
toolchain independently of the application's TypeScript compiler.

## Project Structure

- `src/pages/` contains page-level React components.
- `src/components/` contains reusable components, including Shadcn-compatible UI primitives in `src/components/ui/`.
- `src/data/` contains typed static content used by the first page.
- `src/types/` contains shared TypeScript contracts.

## Static Deployment

Publish the generated `dist/` directory to any static hosting platform. The app
does not require a Node.js process after `npm run build`.
