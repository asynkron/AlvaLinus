# ADR 0007: Route Visual Inventory Contract

## Status

Accepted

## Context

Issue planitem-gh27-batch-1-page-inventory-and-source-cleanup-batch-2-page-specific-vis-d98e7522d0
cleaned up the public route inventory after generated page-specific visual
metadata and SVG placeholders had already been added for the declared routes.

The inventory still described every route as missing page-specific visual
assets. That made the documentation stale immediately after the route content
contract changed, and it risked sending future visual-refinement work back
toward manual inventory edits instead of the typed route source of truth.

The static site already uses typed site content for declared routes and build
assertions for static route artifacts. Page visual coverage belongs on the same
route contract: a route should declare its visual asset path, alternate text,
and editorial intent in one place, and the build should fail if those declared
asset paths do not resolve.

## Decision

Page-specific route visuals are tracked as typed route metadata in
`src/data/siteContent.ts`, with generated placeholder files under
`public/page-visuals/` until real photography, project media, maps, or diagrams
replace them.

`docs/current-public-route-inventory.md` should report the current visual asset
assigned to each route rather than maintaining a separate "missing assets"
claim. Visual refinement can replace placeholder assets while preserving the
route-content model.

The postbuild pipeline runs `scripts/assert-route-visual-assets.mjs` so every
declared visual asset path must remain under `public/page-visuals/`, use the
expected naming shape, be unique, and resolve on disk.

## Consequences

- The route inventory becomes a snapshot of typed route metadata instead of a
  parallel source of truth.
- New public routes need page visual metadata and a resolvable asset before the
  route contract is complete.
- Placeholder SVGs are acceptable as an explicit interim visual state, but they
  should be replaced in place by later visual-quality work rather than removed
  from the route contract.
- The postbuild asset assertion intentionally duplicates some type-level
  coverage because missing files are filesystem errors, not TypeScript errors.

## Traceability

- Issue:
  planitem-gh27-batch-1-page-inventory-and-source-cleanup-batch-2-page-specific-vis-d98e7522d0
- Delivery PR: #35
- Delivery commit: `d3b7914f9a16a8e084c5b2a1327ed12aca29cc0b`
- Learn branch: `agent-go/task-planitem-gh27-batch-1-50c09bbb45-learn`
