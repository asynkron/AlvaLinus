# F4: Home, navigation and route recovery

Reviewed: 2026-10-24. Runtime: `ui`. Product role: `surface`.
Supports **F1, F2, F3**, all active customer-outcome features.

Home and shared route handling make the service, company and inquiry outcomes
reachable. This record is retained as a supporting surface, not promoted into
a separate customer result because it has tests.

## Entry points and current behavior

All nine routes listed in the [index](README.md) share Header. Desktop navigation
links home, services (with five service links), about and contact. The mobile
button toggles its menu; subpages have a Hem breadcrumb. Footer repeats page and
service links and the contact email on ready routes, including not-found.

[F4-US1](user-stories/F4/F4-US1.md) covers navigation from the home hero's two
actions, route shortcuts and shared chrome. The inventory's five shortcuts
are not the complete registry. Pool and reference-project pages are not active.
The historical pageCount 58 is not a rendered route count.

The renderer normalizes query/hash suffixes and trailing slashes before matching
typed routes. Vite emits an HTML entry document per declared subpage; React
then selects the route-specific view. Static artifacts are not separate backend
handlers. See [route inventory](../current-public-route-inventory.md).

## States, failures and recovery

[F4-US2](user-stories/F4/F4-US2.md) covers the shared states:

| State | Visible behavior | Recovery and ceiling |
| --- | --- | --- |
| Loading | Header plus Laddar innehåll skeleton | Await local asynchronous content resolution; no network request is made by the loader. |
| Error | Header plus Innehåll kunde inte laddas alert and error message | No inline retry; reload. A deployed source defect needs a new static deployment. |
| Empty services | Header plus Inget innehåll ännu | Applies to every route kind, including about/contact; route selection cannot bypass this guard. |
| Ready known route | Typed route view plus footer | Missing joined service record goes to not-found. |
| Ready unknown route | Sidan finns inte, route shortcuts and footer | Follow a declared shortcut. A static host may return its own error before React mounts, so this is an in-app guarantee only. |
| Photo error | Service card switches to the route SVG; if that fallback also errors, the card image is removed with no retry loop. Subpage hero hides its image. | Title, summary and Läs mer link remain. Home hero has no equivalent explicit onError handler. |

The header stays during loading/error/empty, but the footer does not. Partners
is omitted independently when its list is empty. These are current behaviors,
not new error recovery mechanisms.

## Sources and evidence

[SiteHomePage](../../src/pages/SiteHomePage.tsx) owns Header, SERVICE_NAV,
ContentSurface, route normalization, NotFound and Footer.
[Typed content](../../src/data/siteContent.ts) owns the registry and inventory
shortcuts; [local loader](../../src/lib/site-content.ts) returns that bundled
content asynchronously. [StaticState](../../src/components/StaticState.tsx)
renders availability states. [Vite config](../../vite.config.ts) emits route
artifacts; existing route and visual scripts check deployable paths.

Story documents carry reviewed Vitest declarations for links, loading, error,
empty and not-found feedback. Swedish-character assertions protect representative
UTF-8 text. The route visual test is technical metadata evidence; rendered
service-card image-error behavior, including the terminal fallback failure, is
covered by deterministic in-memory tests in the home page test file.
Mobile-menu interaction, keyboard dropdown interaction,
normalization variants and production-host fallback are source-reviewed or
unmapped, not claimed as executed acceptance. No new duplicate tests are added.

No product background module, API, storage, telemetry or report belongs to this
surface. Outcome measurement stays with F1–F3; there is no standalone conversion
claim for the route inventory.

## What Works Less Well

The global empty-services guard hides the about and contact bodies even when
their own content is available, removing useful fallback information from those
routes. Navigation destinations are repeated across SERVICE_NAV, header/footer
markup and typed inventory, so route edits can drift. Error feedback provides
no inline retry or contact body.

## Roadmap

- Fix: evaluate route-specific empty states so service-content loss does not
  suppress otherwise valid about/contact content; retain clear service feedback.
- Fix: reconcile repeated navigation declarations through the existing typed
  route model when changing navigation, preserving link order and accessible labels.
- Expand: add deterministic menu/keyboard recovery coverage when those flows
  change, and document the actual production-host unknown-path behavior when known.

