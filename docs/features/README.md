# Feature catalog

Reviewed against source: 2026-11-13.

The catalog introduced in `f7b481f` already covers the current route inventory.
The maintained catalog retains its published identities, including F4-US3 for
the shipped keyboard bypass. This review also reconciles the distinct Swedish
service-card link names shipped in `8c9af38` with F1-US1 evidence on home and the
services index. F5 was added on 2026-11-04 for the company staffing inquiry
route without changing any retained identity. F6 was added on 2026-11-06 for
the two interactive quote calculators, which previously appeared only as
navigation targets under F4-US1. After the 2026-11-06 13:43 review, `fk140`
(calculator pages) and `fk144` (home chrome) moved Swedish page text into the
typed registry without changing any route, section, job or published identity.
`fk135` then consolidated the quote pages' shared structure into the
[QuotePageShared](../../src/components/QuotePageShared.tsx) shell, and the
2026-11-08 `fk162` reconciliation named that shell and the registry-owned quote
copy in the F6 records. `fk164` re-pointed the about and contact heroes to
in-tree SVGs; this 2026-11-10 review re-verified the F2/F4/F6 records against
that base and corrected the remaining hero wording. The 2026-11-10 `fk176`
reconciliation then re-stamped the F5 staffing-inquiry records from a fresh
source read, naming the registry-declared Swedish inquiry copy in
`content.inquiry` (`fk154`) beside the inquiry page's remaining runtime
ownership. The 2026-11-11 reconciliation then mapped the three source-pinned
styles accessibility tests — the field-border contrast test introduced by
PR #125's WCAG AA form-field repair, the primary-contrast token test and the
reduced-motion test — and the quote helper declarations in `quote.test.ts`
into the touched story records, and re-stamped the F1, F4, F5 and F6 records
from that fresh source read. `fk185` (PR #130) then gave the drainage-calculation
hero the same registry-owned responsive WebP variant family as the other photo
heroes, and `fk189` mapped its new page-accent stylesheet declaration into the
F6-US5 and F5-US2 story records; this 2026-11-12 reconciliation folded that
drainage hero into the F4 variant prose, named both quote routes' declared
`heroPhotoSrcSet`/`heroPhotoSizes` in the F6 record, and re-stamped the F4 and
F6 records from a fresh source read, with `fk188`'s per-route og:image artifact
emission leaving the route table unchanged. `fk195` then kept the contact form
controls at the 16px base size on home and `/kontakt/` by removing `sm:text-sm`
from `CONTACT_FIELD_BASE_CLASS`, and `fk199` pinned the quote pages' select and
textarea at the same 16px iOS focus-zoom floor, while `fk198` pinned the service
cards' Läs mer hover to the AA-enforced `primary-hover` token. This
2026-11-13 reconciliation maps the three new declarations into the F3, F6 and
F1 story records and re-stamps the F1, F3 and F6 records from a fresh source
read, with the route table unchanged.

This catalog maps the static Swedish Svärd Entreprenad site to visitor outcomes.
It is product-development input, not a claim that construction work, email delivery
or analytics runs inside the site.

| Stable ID | Maintained feature | Runtime | Product role | Supports |
| --- | --- | --- | --- | --- |
| F1 | [Choose a suitable groundworks service](service-selection.md) | ui | customer_outcome | — |
| F2 | [Assess the company and working approach](company-confidence.md) | ui | customer_outcome | — |
| F3 | [Prepare an initial project inquiry](project-inquiry.md) | ui | customer_outcome | — |
| F4 | [Home, navigation and route recovery](navigation-and-recovery.md) | ui | surface | F1, F2, F3, F5, F6 |
| F5 | [Prepare a company staffing inquiry](staffing-inquiry.md) | ui | customer_outcome | — |
| F6 | [Calculate a preliminary quote](quote-calculators.md) | ui | customer_outcome | — |

## Route and subsection reconciliation

The route registry has **twelve** active routes. `inventory.pageCount = 58` is a
historical inventory number, not a count of active pages. The
`inventory.primaryRoutes` shortcuts are a subset; header (desktop and mobile)
and footer navigation derive their page and service links from the same typed
registry, so all five service pages and the staffing inquiry page are exposed
there too. The renderer is the authority for visible sections.

| Route/view | Outcome documentation and stories | Relevant sections |
| --- | --- | --- |
| `/` | F1-US1; F2-US1/US2; F3-US1/US2; F4-US1 | Header; decorative photo hero and two actions; quality/trust/sustainability statements; route shortcuts; five service cards; four process steps; trust cards; contact form/address; footer. |
| `/tjanster/` | F1-US1; F2-US1; F4-US1 | Hero and breadcrumb; five service cards; trust cards; conditional partners; contact link band; footer. |
| `/stensattning/` | [F1-US2](user-stories/F1/F1-US2.md) | Hero; service summary; paving/wall tags; suitability aside; process; inquiry band; footer. |
| `/markarbete/` | [F1-US3](user-stories/F1/F1-US3.md) | Hero; broad groundwork summary; excavation/site tags; suitability aside; process; inquiry band; footer. |
| `/gravjobb/` | [F1-US4](user-stories/F1/F1-US4.md) | Hero; foundation/utility/pool excavation summary and tags; suitability aside; process; inquiry band; footer. |
| `/dranering/` | [F1-US5](user-stories/F1/F1-US5.md) | Hero; drainage summary and dedicated moisture-protection paragraph; tags; suitability aside; process; calculator link band to [F6](quote-calculators.md); inquiry band; footer. |
| `/tradgardsplanering/` | [F1-US6](user-stories/F1/F1-US6.md) | Hero; levels/surfaces/planting summary and tags; suitability aside; process; inquiry band; footer. |
| `/om-oss/` | [F2-US1](user-stories/F2/F2-US1.md) | Hero and breadcrumb; company paragraphs; contact link band; footer. |
| `/inhyrning/` | [F5-US1](user-stories/F5/F5-US1.md), [F5-US2](user-stories/F5/F5-US2.md) | Hero and breadcrumb; staffing inquiry form with Swedish validation, VAT note and mail-draft handoff; guidance aside; footer. |
| `/kontakt/` | [F3-US1](user-stories/F3/F3-US1.md), [F3-US2](user-stories/F3/F3-US2.md) | Hero; quote/site-visit prompt; email address; native form; footer. |
| `/offertberakning/` | [F6-US1](user-stories/F6/F6-US1.md), [F6-US2](user-stories/F6/F6-US2.md), [F6-US3](user-stories/F6/F6-US3.md), [F6-US4](user-stories/F6/F6-US4.md), [F6-US5](user-stories/F6/F6-US5.md); [F4-US1](user-stories/F4/F4-US1.md) | Hero; breadcrumb; calculator choice (`#uppfart` selects the driveway calculator) with preliminary total, email handoff and print; footer. |
| `/draneringsberakning/` | [F6-US1](user-stories/F6/F6-US1.md), [F6-US2](user-stories/F6/F6-US2.md), [F6-US3](user-stories/F6/F6-US3.md), [F6-US4](user-stories/F6/F6-US4.md), [F6-US5](user-stories/F6/F6-US5.md); [F4-US1](user-stories/F4/F4-US1.md) | Hero; breadcrumb; drainage length calculator with preliminary total, email handoff and print; footer. |
| Keyboard bypass on all rendered states | [F4-US3](user-stories/F4/F4-US3.md) | Hoppa till innehåll precedes Header and points to one #content target; ready bodies have tabindex=-1, availability sections do not. |
| Shared empty/not-found | [F4-US2](user-stories/F4/F4-US2.md) | Header remains; the empty-services message replaces the service-dependent home/index bodies; ready not-found provides declared-route shortcuts and footer. |

`Partners` is called on home and the services index but currently renders
nothing because `partners` is empty. About copy is on the dedicated about page;
home has process and trust sections instead. No separate Pool or Referensobjekt
route is declared.

## Sources and runtime boundaries

- [Typed routes/content](../../src/data/siteContent.ts), [types](../../src/types/site.ts) and
  [renderer](../../src/pages/SiteHomePage.tsx).
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

All six capabilities are `ui`. Backend slices, ports, feature/story port
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
  F4-US3 was subsequently added without changing those identities. F5 and
  F5-US1/US2 were added on 2026-11-04 for the staffing inquiry route, and
  F6 with F6-US1–US5 was added on 2026-11-06 for the two quote calculators. Retain
  them and
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
  [SiteHomePage.test.tsx](../../src/pages/SiteHomePage.test.tsx),
  [InquiryPage.test.tsx](../../src/pages/InquiryPage.test.tsx), for the
  quote calculators [QuotePage.test.tsx](../../src/pages/QuotePage.test.tsx)
  and [DrainageQuotePage.test.tsx](../../src/pages/DrainageQuotePage.test.tsx),
  the quote helper tests in [quote.test.ts](../../src/lib/quote.test.ts), and
  the stylesheet tests
  [styles.field-border-contrast.test.ts](../../src/styles.field-border-contrast.test.ts),
  [styles.primary-contrast.test.ts](../../src/styles.primary-contrast.test.ts),
  [styles.reduced-motion.test.ts](../../src/styles.reduced-motion.test.ts),
  [styles.page-accent-contrast.test.ts](../../src/styles.page-accent-contrast.test.ts),
  [styles.quote-focus-zoom.test.ts](../../src/styles.quote-focus-zoom.test.ts)
  and [tailwind.primary-hover-utility.test.ts](../../src/tailwind.primary-hover-utility.test.ts).
  `direct` means
  the assertion checks the stated user-visible facet, not every step of a story.
  `technical` checks supporting metadata, including the token-level stylesheet
  and quote-helper declarations mapped in the 2026-11-11 reconciliation. No
  test was executed for this source review. F4-US1 maps the mobile-menu
  declaration for Escape from a link
  or the focused toggle, focus restoration, reopening and click dismissal;
  Tab/Shift+Tab are not cancelled and Escape elsewhere in the header leaves
  the menu and focus unchanged. F4-US1 also maps the decorative home hero
  photo's success and failure declarations; a failing photo hides its image
  without a retry loop while the hero content remains. F4-US1 additionally
  maps the above-the-fold fetch-priority declaration, whose about-hero error
  case covers subpage hero image hiding.
  F4-US3 maps the skip-link order and unique
  destination in ready/empty/not-found states. These DOM checks
  do not establish browser anchor focus, scrolling or focus-only CSS visibility.
  F3-US1/US2 map the explanation's accessible association, position before the
  button, lack of a sent confirmation and subject-bearing in-form fallback.
  F1-US1 maps the home service-card photo/SVG failure and neighboring-card
  isolation declarations. These are source-reviewed mappings, not execution
  receipts or proof of responsive layout in a browser. F1-US1 also maps the
  parameterized home/index check of all five service-card accessible names,
  destinations and visible Läs mer labels. This establishes only that link
  facet of the index. Dedicated Markarbete/Trädgårdsplanering rendering,
  other index sections, desktop dropdown interaction and actual email sending
  remain outside the mapped assertions.
- Required proof: `feature-manifest-integrity`, runner
  `native-feature-validation`, command `validate-features`, terminal `passes`.
  Use Faktorial's native validator for the three manifests; it does not prove
  prose accuracy, test execution, symbols or historic ID non-reuse.
  Ordinary quality and independent candidate proof acceptance belong to
  Faktorial's native verifier.

Each feature ends with a bounded roadmap. Those items are intended future work,
not implemented stories or authorization to add a backend in this documentation change.

