# ADR 0004: Static Subpage Artifacts for Declared Routes

## Status

Accepted

## Context

Issue gh11 asked the production static site to expose the declared sitemap
subpages as addressable URLs. The existing architecture remained a static
Vite/React build, with route data already captured in typed site content.

A static host can serve the root `index.html` for `/`, but direct requests to
subpage paths such as `/kontakt/` need physical artifacts unless the hosting
platform is configured with a rewrite fallback. Relying only on client-side
navigation would leave the sitemap-shaped URLs fragile on hosts that serve files
from `dist/` without SPA rewrites.

## Decision

Declared production subpage routes are represented in the built artifact tree by
emitting the root HTML into each route directory as `index.html`.

The Vite build owns this behavior through a small plugin that derives static
route paths from `siteContent.routes`. The build also runs a postbuild assertion
that verifies every expected subpage artifact exists and matches the root HTML.

## Consequences

- The static-only baseline from ADR 0001 is preserved; no router runtime,
  backend, serverless function, or host-specific rewrite configuration is needed
  to make declared subpage URLs deployable.
- New production routes should be added through typed site content so the build
  and route artifact check stay aligned.
- If the site later moves to a hosting platform with deliberate rewrite rules,
  the team should explicitly decide whether generated subpage artifacts remain
  the deployment contract or become redundant.
- Build verification should keep checking declared route artifacts because the
  failure mode is a deploy-time 404 rather than a TypeScript or component test
  failure.

## Traceability

- Issue: gh11
- Delivery PR: #12
- Delivery commit: `d9c550235ec2ef0e20022f302b5e52e23cd88e7e`
- Learn branch: `agent-go/task-gh11-learn`
