# Typed Route Content

## Keep Page-Owned Metadata on the Route Contract

When a page-specific concern applies to every declared public route, model it on
the typed route contract instead of scattering lookup tables, component
conditionals, or partial defaults through rendering code.

Examples include page visuals, page-level SEO text, per-route source notes, and
other metadata that must stay aligned with `siteContent.routes`.

Before committing a route-content change, check that every declared route has
the required metadata and that future missing entries would fail through the
TypeScript contract, a focused assertion, or the existing build checks.

WHY: planitem-gh27-batch-1-page-inventory-and-source-cleanup-batch-2-page-specific-vis-de8f8b8634
and PR33 found route visual metadata coverage at 0/9. The accepted fix added a
required `SiteRouteVisual` field to `SiteRoute` and populated all 9 declared
routes from the existing `/page-visuals/` assets, moving visual coverage from a
manual inventory gap to a typed content contract.

## Keep Route Inventories Derived From the Route Contract

When route inventory documentation mentions page-specific metadata, refresh it
from `siteContent.routes` and the relevant build assertions. Do not leave a
manual "missing" or "not yet present" claim in an inventory after the metadata
or assets have become part of the typed route contract.

For page visuals specifically, keep the inventory aligned with the route
`visual.assetPath` values and keep `scripts/assert-route-visual-assets.mjs` in
the postbuild chain so filesystem drift is caught by `npm run build`.

WHY:
planitem-gh27-batch-1-page-inventory-and-source-cleanup-batch-2-page-specific-vis-d98e7522d0
and PR35 removed 9 stale visual-inventory claims after typed page-specific
placeholder visuals already existed for every public route. The fix made the
inventory describe current route assets and added a postbuild check for the
asset files, preventing docs from becoming a contradictory parallel inventory.
