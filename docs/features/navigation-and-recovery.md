# F4: Home, navigation and route recovery

Reviewed: 2026-10-30. Runtime: `ui`. Product role: `surface`.
Supports **F1, F2, F3**, all active customer-outcome features.

Home and shared route handling make the service, company and inquiry outcomes
reachable. This record is retained as a supporting surface, not promoted into
a separate customer result because it has tests.

## Entry points and current behavior

All nine routes listed in the [index](README.md) share Header. Desktop navigation
links home, services (with five service links), about and contact. The desktop
Tjänster trigger is a focusable link declared with `aria-haspopup`, and its
dropdown panel keeps the five service links in registry order; keyboard focus on
the trigger reveals that panel through the existing `group-focus-within`
styling. The mobile button toggles its menu. Escape from a menu descendant
or the focused toggle closes an open menu and returns focus to the toggle;
the menu can reopen.
Tab/Shift+Tab events are not cancelled; Escape elsewhere in the header leaves
both menu and focus unchanged. Subpages have a Hem breadcrumb.
Footer repeats page and service links and the contact email on ready routes,
including not-found.

Desktop and mobile header navigation and the footer's page and service lists
derive from the typed route registry: each page or service destination's
Swedish label, href and link order is declared once in
[typed content](../../src/data/siteContent.ts), and adding or renaming a route
there updates every header and footer link without parallel markup edits. The
registry order is the link order; the renderer only groups the five service
detail routes under the Tjänster entry.

The decorative hero photographs on home and subpages are requested at high
fetch priority without a lazy-loading attribute, so above-the-fold rendering is
not deferred behind below-the-fold imagery; service-card images stay lazy.

[F4-US1](user-stories/F4/F4-US1.md) covers navigation from the home hero's two
actions, route shortcuts and shared chrome. The inventory's five shortcuts
are not the complete registry. Pool and reference-project pages are not active.
The historical pageCount 58 is not a rendered route count.

[F4-US3](user-stories/F4/F4-US3.md) covers the Swedish Hoppa till innehåll
link before Header. It is visually hidden until focused and targets one
`#content` destination in every rendered state. Ready home, subpage and
not-found bodies use a focusable wrapper (`tabIndex={-1}`) with scroll margin.
Loading/error/empty sections keep the anchor but have no explicit tabIndex.
DOM evidence checks order and destination structure; it does not establish
browser scrolling, anchor focus transfer or focus-only CSS visibility. This
keyboard aid is not a compliance certification.

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
| Empty services | Header plus Inget innehåll ännu | Applies to the service-dependent home and services-index bodies. About and contact keep their own bodies; a service route without its record and an unknown route use not-found recovery. |
| Ready known route | Typed route view plus footer | Missing joined service record goes to not-found. |
| Ready unknown route | Sidan finns inte, route shortcuts and footer | Follow a declared shortcut. A static host may return its own error before React mounts, so this is an in-app guarantee only. |
| Photo error | Service card switches to the route SVG; if that fallback also errors, the card image is removed with no retry loop. Subpage hero and home hero hide their images. | Title, summary and Läs mer link remain. A hidden home hero keeps the navy section, gradient overlay, headline, intro, actions and stats. |

The header stays during loading/error/empty, but the footer does not. Partners
is omitted independently when its list is empty. These are current behaviors,
not new error recovery mechanisms.

## Sources and evidence

[SiteHomePage](../../src/pages/SiteHomePage.tsx) owns Header, ContentSurface,
route normalization, NotFound and Footer; its desktop, mobile and footer
navigation derive page and service links from the typed registry instead of
parallel markup arrays. [Typed content](../../src/data/siteContent.ts) owns the
registry and inventory shortcuts and is the single declaration source for
navigation destinations; [local loader](../../src/lib/site-content.ts) returns
that bundled content asynchronously. [StaticState](../../src/components/StaticState.tsx)
renders availability states. [Vite config](../../vite.config.ts) emits route
artifacts; existing route and visual scripts check deployable paths.

Story documents carry reviewed Vitest declarations for links, loading, error,
empty and not-found feedback. Swedish-character assertions protect representative
UTF-8 text. The route visual test is technical metadata evidence; rendered
service-card image-error behavior, including the terminal fallback failure, and
the home hero photo's success and failure declarations are covered by
deterministic in-memory tests in the home page test file.
F4-US1 maps the deterministic mobile-menu declaration for expanded state,
Escape from a link and the toggle, focus restoration, reopening and click
dismissal, uncancelled Tab/Shift+Tab events and Escape outside the menu/toggle,
plus the decorative home hero photo's success and failure declarations and the
above-the-fold fetch-priority declaration whose about-hero error case also
covers subpage hero image hiding. The home page test file also carries the
deterministic desktop dropdown declaration: the Tjänster trigger keeps its
`aria-haspopup` declaration and takes focus, its Tab/Shift+Tab events stay
uncancelled, and the dropdown panel holds the five service links in registry
order with their distinct Swedish accessible names.
JSDOM does not move focus on Tab, so those event assertions do not establish
actual browser tab order, and DOM evidence does not establish the panel's
focus-only CSS reveal. F4-US3 maps the two skip-link declarations separately
from menu behavior. Neither mapping establishes responsive CSS or browser
anchor activation. Normalization variants and production-host fallback remain
unmapped, not claimed as executed acceptance. F1-US1 owns the service-card
failure mappings; this supporting surface points to F1 rather than duplicating
those story references.

No product background module, API, storage, telemetry or report belongs to this
surface. Outcome measurement stays with F1–F3; there is no standalone conversion
claim for the route inventory.

## What Works Less Well

Error feedback provides no inline retry or contact body.

## Roadmap

- Expand: document the actual production-host unknown-path behavior when known.

