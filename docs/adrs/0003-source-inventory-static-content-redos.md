# ADR 0003: Source Inventory for Static Content Redos

## Status

Accepted

## Context

Issue gh7 asked to redo the earlier gh3 direction and turn the site toward the
target service-company content surface. The accepted delivery in PR #9 replaced
the placeholder Vite page with production React content instead of adding a
separate mockup artifact.

The build-stage agent captured the live target site's sitemap and homepage
navigation before editing. The sitemap exposed 58 public page URLs, while the
homepage navigation exposed the major services, pool, references, and contact
paths. The final implementation represented that inventory as one sectioned
static page backed by typed TypeScript content data.

## Decision

For production redo issues that mirror an external static marketing site, first
capture the source inventory that justifies the page content, then encode the
chosen surface in the existing typed React data and page components.

A complete single-page representation is acceptable when the issue asks for the
site content surface but does not ask for routing, CMS behavior, backend
services, or individual URL parity. The source inventory should be summarized in
the delivery notes so reviewers can distinguish deliberate condensation from
missing discovery.

Rendered QA may use the in-app Browser when available, but a Playwright check
against a local preview server is an acceptable fallback when the in-app Browser
is unavailable. The fallback should still confirm a nonblank DOM, expected
content sections, clean console warnings/errors, title metadata, and primary CTA
behavior.

## Consequences

- Future redo work should avoid guessing from placeholder copy when a live
  target can be inventoried first.
- The static-only baseline from ADR 0001 remains intact unless a later issue
  explicitly requests routes, runtime services, or CMS-backed content.
- Content breadth can be represented through typed data and sectioned React UI
  before introducing a router.
- Delivery summaries for source-derived pages should include the source
  inventory signal, the condensation choice, and rendered QA fallback details.
- Browser tooling availability is not a blocker for visual QA when Playwright
  can exercise the built preview locally.

## Traceability

- Issue: gh7
- Delivery PR: #9
- Delivery commit: `3411cc5c5ecd83bb888d63b401c33b9d70877bc1`
- Learn branch: `agent-go/task-gh7-learn`
