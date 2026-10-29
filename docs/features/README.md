# Feature catalog

Reviewed against source: 2026-10-28.

The catalog introduced in `f7b481f` already covers the current route inventory.
The maintained catalog retains its published identities, including F4-US3 for
the shipped keyboard bypass. This review also reconciles the distinct Swedish
service-card link names shipped in `8c9af38` with F1-US1 evidence on home and the
services index.

This catalog maps the static Swedish Svärd Entreprenad site to visitor outcomes.
It is product-development input, not a claim that construction work, email delivery
or analytics runs inside the site.

| Stable ID | Maintained feature | Runtime | Product role | Supports |
| --- | --- | --- | --- | --- |
| F1 | [Choose a suitable groundworks service](service-selection.md) | ui | customer_outcome | — |
| F2 | [Assess the company and working approach](company-confidence.md) | ui | customer_outcome | — |
| F3 | [Prepare an initial project inquiry](project-inquiry.md) | ui | customer_outcome | — |
| F4 | [Home, navigation and route recovery](navigation-and-recovery.md) | ui | surface | F1, F2, F3 |

## Route and subsection reconciliation

The route registry has **nine** active routes. `inventory.pageCount = 58` is a
historical inventory number, not a count of active pages. The five
`inventory.primaryRoutes` shortcuts are a subset; Header's `SERVICE_NAV` also
exposes all five service pages. The renderer is the authority for visible sections.

| Route/view | Outcome documentation and stories | Relevant sections |
| --- | --- | --- |
| `/` | F1-US1; F2-US1/US2; F3-US1/US2; F4-US1 | Header; decorative photo hero and two actions; quality/trust/sustainability statements; route shortcuts; five service cards; four process steps; trust cards; contact form/address; footer. |
| `/tjanster/` | F1-US1; F2-US1; F4-US1 | Hero and breadcrumb; five service cards; trust cards; conditional partners; contact link band; footer. |
| `/stensattning/` | [F1-US2](user-stories/F1/F1-US2.md) | Hero; service summary; paving/wall tags; suitability aside; process; inquiry band; footer. |
| `/markarbete/` | [F1-US3](user-stories/F1/F1-US3.md) | Hero; broad groundwork summary; excavation/site tags; suitability aside; process; inquiry band; footer. |
| `/gravjobb/` | [F1-US4](user-stories/F1/F1-US4.md) | Hero; foundation/utility/pool excavation summary and tags; suitability aside; process; inquiry band; footer. |
| `/dranering/` | [F1-US5](user-stories/F1/F1-US5.md) | Hero; drainage summary and dedicated moisture-protection paragraph; tags; suitability aside; process; inquiry band; footer. |
| `/tradgardsplanering/` | [F1-US6](user-stories/F1/F1-US6.md) | Hero; levels/surfaces/planting summary and tags; suitability aside; process; inquiry band; footer. |
| `/om-oss/` | [F2-US1](user-stories/F2/F2-US1.md) | Hero and breadcrumb; company paragraphs; contact link band; footer. |
| `/kontakt/` | [F3-US1](user-stories/F3/F3-US1.md), [F3-US2](user-stories/F3/F3-US2.md) | Hero; quote/site-visit prompt; email address; native form; footer. |
| Keyboard bypass on all rendered states | [F4-US3](user-stories/F4/F4-US3.md) | Hoppa till innehåll precedes Header and points to one #content target; ready bodies have tabindex=-1, availability sections do not. |
| Shared loading/error/empty/not-found | [F4-US2](user-stories/F4/F4-US2.md) | Header remains; loading label, error alert or empty-services message replaces the service-dependent home/index bodies; ready not-found provides declared-route shortcuts and footer. |

`Partners` is called on home and the services index but currently renders
nothing because `partners` is empty. About copy is on the dedicated about page;
home has process and trust sections instead. No separate Pool or Referensobjekt
route is declared.

## Sources and runtime boundaries

- [Typed routes/content](../../src/data/siteContent.ts), [types](../../src/types/site.ts),
  [renderer](../../src/pages/SiteHomePage.tsx) and [local loader](../../src/lib/site-content.ts).
- [Route inventory](../current-public-route-inventory.md),
  [static route emission](../../vite.config.ts),
  [static route assertion](../../scripts/assert-static-routes.mjs) and
  [visual asset assertion](../../scripts/assert-route-visual-assets.mjs).
- [Static email decision](../adrs/0006-static-email-contact-handoff.md) and
  [visual metadata decision](../adrs/0007-route-visual-inventory-contract.md).

There is no product backend, database, authentication, worker, scheduler,
persistent recurrence, stored inquiry, CRM integration, report or live metric.
The mailto handoff delegates to the visitor's email software. Process steps
describe real-world business work; they are not background components.
Hero values are marketing statements, not measured operational statistics.
Build/quality scripts produce static artifacts and development evidence; they
are not hidden customer features or public incoming ports.

All four capabilities are `ui`. Backend slices, ports, feature/story port
references and background relations are explicitly empty. Frontend paths belong
in `routes` and capability `entry_points`, not the backend-port registry.

Outcome signals are proposed observable acceptance/usability checks. No
telemetry collector or conversion measurement is installed or implied.
Certification, guarantees and sustainability statements are authored claims;
the site does not perform compliance verification. Names and project details
go to external email only when the visitor completes that handoff; the site
does not provide persistence, delivery assurance or a privacy/compliance verdict.

## Maintenance and evidence contract

- [Shared inventory](features.json) keeps routes and source ownership separate
  from [stable feature/story identity data](user-stories/features.json).
  [Backend entry points](backend-entry-points.json) records the intentionally
  empty backend boundary.
- IDs F1–F4 and their original twelve story IDs were allocated in `f7b481f`.
  F4-US3 was subsequently added without changing those identities. Retain them and
  the feature-document joins on future edits; leave removed IDs
  absent forever. No earlier IDs were found in the available checkout/history;
  that initial search is not proof of historical non-reuse outside that evidence.
- These are maintained Markdown and JSON files. No existing feature generator
  was found in the inspected scripts/package commands; no generator or duplicate
  validator is introduced. Edit corresponding prose and structured data together.
- When routes, sections or jobs change, reconcile this table, feature documents,
  story files and both feature manifests against the renderer and typed registry.
  Record source review date; do not treat schema validity as product accuracy.
- Test references name reviewed declarations in
  [SiteHomePage.test.tsx](../../src/pages/SiteHomePage.test.tsx). `direct` means
  the assertion checks the stated user-visible facet, not every step of a story.
  `technical` checks supporting metadata. No test was executed for this source
  review. F4-US1 now maps the mobile-menu declaration for Escape from a link
  or the focused toggle, focus restoration, reopening and click dismissal;
  Tab/Shift+Tab are not cancelled and Escape elsewhere in the header leaves
  the menu and focus unchanged. F4-US1 also maps the decorative home hero
  photo's success and failure declarations; a failing photo hides its image
  without a retry loop while the hero content remains.
  F4-US3 maps the skip-link order and unique
  destination in ready/loading/error/empty/not-found states. These DOM checks
  do not establish browser anchor focus, scrolling or focus-only CSS visibility.
  F3-US1/US2 map the explanation's accessible association, position before the
  button, lack of a sent confirmation and subject-bearing in-form fallback.
  F1-US1 maps the home service-card photo/SVG failure and neighboring-card
  isolation declarations. These are source-reviewed mappings, not execution
  receipts or proof of responsive layout in a browser. F1-US1 also maps the
  parameterized home/index check of all five service-card accessible names,
  destinations and visible Läs mer labels. This establishes only that link
  facet of the index. Dedicated Markarbete/Trädgårdsplanering rendering,
  other index sections, desktop dropdown
  interaction, subpage hero image failure and actual email sending remain
  outside the mapped assertions.
- Required proof: `feature-manifest-integrity`, runner
  `native-feature-validation`, command `validate-features`, terminal `passes`.
  Use Faktorial's native validator for the three manifests; it does not prove
  prose accuracy, test execution, symbols or historic ID non-reuse.
  Ordinary quality and independent candidate proof acceptance belong to
  Faktorial's native verifier.

Each feature ends with a bounded roadmap. Those items are intended future work,
not implemented stories or authorization to add a backend in this documentation change.

