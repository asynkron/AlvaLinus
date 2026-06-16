# ADR 0002: Dependency-Free Documentation Mockups

## Status

Accepted

## Context

Issue gh3 requested a low-fi mockup of the AlvaLinus site. The repository
already had a static React frontend foundation from gh2, but the gh3 delivery
was intentionally an exploration and review artifact rather than production UI.

The accepted PR #5 added a standalone mockup under `docs/mockup/` with plain
HTML/CSS and a rendered PNG. A root `Makefile` addition that only served the
mockup was removed before merge so the main project commands stayed focused on
the production frontend.

## Decision

Low-fi site mockups may live under `docs/mockup/` as dependency-free
documentation artifacts when the issue is about review, structure, content, or
direction rather than production implementation.

These mockups should be directly reviewable without adding repository-level
tooling or changing the production React application. Production UI work should
still happen in the Vite/React surface described by ADR 0001.

## Consequences

- Design-direction work can be reviewed from static files without installing or
  running the app toolchain.
- Mockup-only commands should not be added to root build or quality entry
  points unless a later issue makes them part of the maintained workflow.
- Future agents should treat `docs/mockup/` as a review artifact area, not as a
  source of production UI code to wire into `src/` automatically.
- If a mockup graduates into the live site, that conversion should be handled by
  a separate implementation issue with normal frontend quality checks.

## Traceability

- Issue: gh3
- Delivery PR: #5
- Delivery commit: `4bdf2b70a7084b94fb486412c5b1d3337b9bfa44`
- Learn branch: `agent-go/task-gh3-learn`
