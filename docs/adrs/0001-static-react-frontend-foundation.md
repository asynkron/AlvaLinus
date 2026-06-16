# ADR 0001: Static React Frontend Foundation

## Status

Accepted

## Context

Issue gh2 created the first implementation surface for AlvaLinus from a minimal
repository. The accepted delivery in PR #4 added a React, TypeScript, Vite, and
Shadcn-style frontend, typed static content, focused page-state tests, and
repo-root quality commands.

The delivery explicitly avoided adding a backend runtime, API server,
serverless functions, database, authentication, or deployment workflow. The
resulting production artifact is static files in `dist/`.

## Decision

AlvaLinus starts as a static React application built with Vite and strict
TypeScript. Content that drives the first page lives in typed TypeScript data
under `src/data/`, with shared contracts under `src/types/`.

Reusable UI primitives follow the committed Shadcn-style component pattern in
`src/components/ui/`, including the `cn` helper and Tailwind CSS variable
configuration. Repository-level quality runs through `make quality`, which
chains type checking, tests, and the production build.

## Consequences

- The site can be deployed by publishing `dist/` to static hosting after
  `npm run build`.
- Future product work should preserve the static-only baseline unless a new
  issue explicitly justifies runtime services.
- Page content should keep flowing through typed data/contracts until there is a
  concrete need for a CMS, API, or database.
- Additional UI should extend the local Shadcn-style primitives instead of
  introducing unrelated component conventions.
- Any backend, auth, database, or deployment automation decision should be
  recorded separately because PR #4 intentionally left those concerns out of
  scope.

## Traceability

- Issue: gh2
- Delivery PR: #4
- Delivery commit: `345e6bca8eb23cc9a754acbbab103b4aa868df1a`
- Learn branch: `agent-go/task-gh2-learn`
