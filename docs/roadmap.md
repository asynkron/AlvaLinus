# Product and operation roadmap

Reviewed: 2026-10-30 (fk76), source baseline
`c513c00b2d9837ad73a79150cf40aa9ee2d6dfc9` (HEAD).

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk66's October 29 assessment and edits fk72's
October 29 reconciliation in full (PR #80, merge `c513c00`, current main):
the previous document was read in full and reconciled with exact merge
receipts and current source. Earlier assessments remain in Git; their
ownership is reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with nine routes:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/` and `/tradgardsplanering/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts),
[the renderer](../src/pages/SiteHomePage.tsx) and
[the local loader](../src/lib/site-content.ts) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the October 28 review, three capabilities shipped on top of the same
static boundary. Empty-service availability is isolated to the routes that
actually depend on services: home and the services index show the Swedish
empty-state feedback, while about, contact, resolved subpages and unknown
routes keep their own bodies and recovery (`ContentSurface` and
`routeDependsOnServices` in [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)).
Each service page's inquiry action now targets `/kontakt/?tjanst=<service id>`
([inquiry-service.ts](../src/lib/inquiry-service.ts), read in
[App.tsx](../src/App.tsx)); the contact form preselects the matching typed
option, keeps the visitor's manual choice, and safely retains defaults for
missing or malformed context, inside
[ADR 0006](adrs/0006-static-email-contact-handoff.md)'s native mail handoff.
Service links carry distinct Swedish accessible names. F3 and F4 were
reconciled to these delivered behaviors (fk60, PR #75), so the
catalog — four features, thirteen stories — no longer lists the carried
inquiry context or the availability gap as open work.

Later on October 29, three more deliveries landed on the same static boundary.
fk65 requested the above-the-fold hero photographs on home and subpages at high
fetch priority while service-card images stay lazy (PR #76, merge `0eb2a37`).
fk67 gave the home hero photo the same failure resilience as the other site
imagery: a failing photo hides without a retry loop while the navy section,
gradient, headline, actions and stats remain (PR #78, merge `7c11aa4`). fk68
consolidated desktop, mobile and footer navigation onto the typed route
registry, so a route edit is one declaration instead of parallel markup
(PR #79, merge `7427cff`). fk72 then reconciled this roadmap, F4 and the
feature catalog against those deliveries (PR #80, merge `c513c00`, current
HEAD). F4's documentation, the route inventory and the feature catalog were
updated with each delivery.

[Vite](../vite.config.ts) still emits physical subpage HTML from the route
registry under [ADR 0004](adrs/0004-static-subpage-artifacts.md) — today by
copying one identical root `index.html` into every subpage directory, so each
subpage serves the home document's title and description until
[fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77) lands — the
route artifact owner rejects ambiguous paths and collisions before emission,
and [the release runbook](release-runbook.md) names portable checksum
commands. The [Live recipe](../.faktorial/live.json) starts the existing Vite
app locally without secrets or external services. These are implemented source
capabilities, not evidence of live publication.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile Escape/focus, availability-isolation, inquiry-context and
  service-image failure coverage. This refresh inspected source; it did not
  execute those tests.
- Image failure resilience is layered: service cards try the route SVG after
  photo failure and remove the image after terminal failure; subpage and home
  heroes hide a failing background photo. Titles, summaries and links always
  remain. Above-the-fold heroes request their photographs at high fetch
  priority while service-card images stay lazy.
- Header navigation exposes all five services with distinct accessible names,
  and the [route inventory](current-public-route-inventory.md) matches the
  nine-route registry, with drainage inside Tjänster rather than as a separate
  header item.
- Company/contact availability no longer depends on service records, and the
  inquiry form receives the visitor's service choice through a native URL
  parameter without new routes, persistence or personal-data fields.
- The Swedish skip link precedes repeated navigation and targets one
  `#content` destination per rendered state. The quote form explains the
  external email-program send step and keeps a visible fallback address.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one
  Vitest session. [Reporter normalization](../scripts/quality-evidence.mjs)
  rejects malformed evidence, and invalid durations stay unknown. Process exit
  remains the gate authority.
- The autonomous factory keeps shipping through reviewed, merge-receipted
  tasks: this is the fourth consecutive roadmap refresh, each reconciling the
  previous one against owning records before creating new work.

### What works less well and what to improve

- Every static subpage serves the home document's global title and meta
  description: `emitStaticRoutePages` copies identical bytes into all eight
  subpage directories and the route-artifact assertion enforces that
  byte-equality. [fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77)
  will derive per-route Swedish titles and descriptions from the typed
  registry and extend the assertions to validate them.
- The desktop services dropdown's keyboard interaction is unmapped in tests
  while the mobile menu has full Escape/focus coverage (F4 records the gap).
  [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78) will pin the
  focusable Tjänster trigger and the service-link structure at the existing
  DOM boundary.
- Content-error feedback has no inline retry; the loader is local, so a source
  defect needs a corrected static deployment.
- Four WebP photographs are present; five requested photographs remain absent
  ([image requests](image-requests.md)): Grävjobb, Trädgårdsplanering and the
  services/about/contact heroes. Acquisition and approval remain editorial
  work, distinct from delivered image-failure resilience.
- Production host, publication access and artifact retention are unestablished.
  A runbook and checksum tools cannot demonstrate rollback or recovery time.
- Inquiry conversion, delivery and satisfaction are unmeasured. Telemetry,
  persistence or submission-service proposals need explicit product and
  privacy decisions before changing the static boundary.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29, during fk66's refresh
and fk72's catalog reconciliation, and again on October 30 during this fk76
refresh. fk65, fk67, fk68 and fk72 are all closed/done with merge receipts and
passed native quality runs: fk65 (PR #76, merge `0eb2a37`), fk67 (PR #78,
merge `7c11aa4`), fk68 (PR #79, merge `7427cff`) and fk72 (PR #80, merge
`c513c00`, current main). The checkout advanced from fk54's `d45ec4b` to
`c513c00`: the fk55, fk56 and fk53 merges, fk60's catalog reconciliation, the
three October 29 deliveries and fk72's documentation reconciliation are all
present. During the October 30 read the open records were this task (fk76),
fk75 (a recurring frontend-optimization child in its learn stage whose PR #81
is not merged and therefore not part of this baseline), the two next-step
tasks created below (fk77 and fk78), five delivery-notice records (fk69,
fk70, fk71, fk73 and fk74) and fk63/fk64 (an operator question wait about a
live chat session; platform ownership, not site work) — no other open record
owns site work at this baseline.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk54](https://app.faktorial.ai/projects/alvalinus/tasks/fk54), previous roadmap | Closed/done; PR #71, merge `9a2b82e`. Document read in full. | Superseded assessment; its Next 1/Next 2 shipped as fk55/fk56. Its "fk53 unresolved mobile-menu" reservation is resolved by fk53's actual delivery. |
| [fk55](https://app.faktorial.ai/projects/alvalinus/tasks/fk55), availability isolation | Closed/done; PR #72, merge `a9e7bb2`; retained native quality pass at head `0c3464e`. Verified in source: `routeDependsOnServices` gates only home and the services index. | Delivered. No duplicate availability work. |
| [fk56](https://app.faktorial.ai/projects/alvalinus/tasks/fk56), inquiry context | Closed/done; PR #73, merge `eaa1138`; retained native quality pass at head `17713ab`. Verified in source: `inquiry-service.ts` and `App.tsx` wiring. | Delivered. F3 documents the behavior; no duplicate context work. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), accessible service-link names | Closed/done; PR #74, merge `8c9af38`; retained native quality pass at head `917d296`. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk54's "unresolved mobile-menu ownership" description was inaccurate; no menu work is reserved on fk53's behalf. |
| [fk60](https://app.faktorial.ai/projects/alvalinus/tasks/fk60), catalog reconciliation | Closed/done; PR #75, merge `82da699`; retained native quality pass. | Current F3/F4 documentation at that baseline; supersedes stale-gap descriptions. |
| [fk65](https://app.faktorial.ai/projects/alvalinus/tasks/fk65), hero fetch priority | Closed/done; PR #76, merge `0eb2a37`; retained native quality pass. Verified in source: `Hero` and `PageHero` images carry `fetchPriority="high"` without a lazy-loading attribute; `ServiceCardImage` stays lazy. | Delivered. Mapped once through F4-US1; F1/F4 prose and the route inventory record the priority split. |
| [fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67), home hero photo failure resilience | Closed/done; PR #78, merge `7c11aa4`; retained native quality pass. Verified in source: `Hero` hides the photo on error and F4-US1 maps both hero declarations. | Delivered. F4's state table and the route inventory describe the behavior; fk66's former Next 1 gap is closed. |
| [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68), navigation consolidation | Closed/done; PR #79, merge `7427cff`; retained native quality pass. Verified in source: `PAGE_NAV`/`SERVICE_NAV` filter `siteContent.routes`; header, mobile menu and footer render from them. | Delivered. F4 and the catalog README describe the single declaration source; fk66's former Next 2 gap is closed. |
| [fk72](https://app.faktorial.ai/projects/alvalinus/tasks/fk72), catalog/roadmap reconciliation | Closed/done; PR #80, merge `c513c00` (current main); retained native quality pass; native `validate-features` proof passed at head `5da033f`. Verified in source: this document's previous revision and the four feature documents at that merge. | Delivered. Its roadmap text deliberately created no new issue; fk76 supplies the two linked next steps below. |

The prior roadmap's older Done references were checked against current owning
membership on October 29: fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11
(runbook), fk5/fk23/fk34 (mobile), fk8 (dependencies), fk25/fk26
(image/registry recovery), fk32 (catalog), fk36/fk37 (route
validation/checksums), fk43/fk44 (mobile/roadmap), fk45/fk46 (skip link/email
explanation) and fk51 (catalog) remain closed/done. None is reopened or
recreated; fk9's closed-with-build lifecycle note stands. Per-head quality
receipts (90/92/103 passing at the fk55/fk53/fk56 heads) are historical, not
current totals, and no acceptance is claimed for this roadmap candidate,
current main or any deployment.

## Short-term priorities and issue ownership

fk66's two short-term priorities both shipped on October 29 with passed native
quality runs: **Next 1** delivered home-hero photo failure resilience as
[fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67) (PR #78, merge
`7c11aa4`) and **Next 2** delivered the typed-registry navigation
consolidation as [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68)
(PR #79, merge `7427cff`); their ownership rows above carry the verified
source facts. This refresh creates exactly two new open issues, both grounded
in source inspected at `c513c00` on October 30:

1. [fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77) — per-route
   Swedish titles and meta descriptions: the emission plugin currently copies
   the home document's global `<title>` and description into all eight
   subpage artifacts and the artifact assertion enforces that equality. fk77
   derives each subpage's title and description from its typed registry entry
   and extends the static-artifact assertions to validate them, with no
   canonical URLs or sitemap (the production origin is unknown) and no new
   dependencies or runtime.
2. [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78) — desktop
   dropdown keyboard coverage: deterministic in-memory DOM coverage at the
   existing SiteHomePage boundary pinning the focusable Tjänster trigger
   (`aria-haspopup="true"`) and the five-link service structure in registry
   order, reusing the mobile menu's declaration patterns and updating F4's
   mappings. Protection of current behavior, no behavior redesign.

Remaining improvement candidates stay in the feature roadmaps:
content-error retry, service-specific guidance depth and the approved missing
photographs. Hosting, telemetry and submission-service work still await
explicit operator decisions.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 refresh chain shows the working loop: reconcile, ship, re-verify,
   retire. Separate source delivery, task closure and acceptance; missing
   evidence stays unknown.
2. **Repeatable product operation.** Use the delivered checksum commands and
   release runbook when actual hosting/access/retention facts are available.
   Target releases traceable to accepted source and restorable prior
   artifacts. Consider host-specific automation only after those facts and
   explicit access decisions; do not add speculative infrastructure.
3. **Resilient customer journeys.** Availability isolation, inquiry context,
   hero failure resilience and navigation consistency are delivered; remaining
   work is approved missing imagery. Define
   useful inquiry signals and privacy needs before promising delivery or
   telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent from this checkout's parent. Transfer
   demonstrated practices with explicit owners. The autonomous factory
   operates around this static product; it is not an application backend to
   install here.

## Evidence boundaries and update triggers

- Reads made on October 30 during fk76's refresh: the previous roadmap in
  full at `c513c00`; the `0eb2a37..c513c00` Git history (fk72's
  documentation reconciliation is the only commit beyond the three October 29
  deliveries); `index.html` (one global title and meta description);
  `vite.config.ts` (`emitStaticRoutePages` copying identical bytes into every
  subpage directory); `scripts/route-artifacts.mjs` and its in-memory fixture
  tests (byte-equality assertion); `src/data/siteContent.ts` (per-route
  Swedish `label` and `summary` fields); `src/pages/SiteHomePage.tsx`
  (desktop dropdown markup, lines 144–200) and
  `src/pages/SiteHomePage.test.tsx` (mobile-menu Escape/focus patterns);
  `docs/features/navigation-and-recovery.md` (F4's "Desktop dropdown keyboard
  interaction remains unmapped" coverage and roadmap entries); and an open
  membership read. Unchanged structural claims carried from the October 28–29
  reviews keep that provenance.
- Owning reads and writes made on October 30: `get_task` on fk65 (closed/
  done, PR #76, merge `0eb2a37`), fk67 (closed/done, PR #78, merge
  `7c11aa4`), fk68 (closed/done, PR #79, merge `7427cff`), fk72 (closed/
  done, PR #80, merge `c513c00`), fk63 (open, investigate human wait for a
  live-session reset or daemon restart) and fk64 (open question-notice for
  fk63); then `create_task` with independent `get_task` read-backs confirming
  fk77 and fk78 open with the submitted observed-gap/outcome/acceptance/scope
  bodies. The delivery-notice records fk69–fk71, fk73 and fk74 remain open by
  design; fk75's PR #81 was open and unmerged during the read.
- Reads made on October 29, retained for provenance: the previous roadmap in
  full; F3, F4 and the feature-catalog README at `82da699`;
  `docs/image-requests.md`; `src/pages/SiteHomePage.tsx`,
  `src/lib/inquiry-service.ts` and `src/App.tsx`; the `d45ec4b..82da699` Git
  log and diff; the `public/page-visuals` listing (four WebP photos present);
  and the checkout parent (only the fk65/fk66 worktrees). During fk72's
  reconciliation the same day: the `0eb2a37..7427cff` Git log and docs/test
  diff; the four feature documents, F4-US1 and both feature manifests; a
  fresh `public/page-visuals` listing (still four WebP photos present, five
  requested photographs absent); and owning `get_task`/membership reads
  confirming fk65, fk67 and fk68 closed/done with PRs #76/#78/#79.
- Authenticated owning reads from October 29: `get_task` on fk53, fk54, fk55
  and fk56 with exact merge receipts (PRs #71–#74), fk60 found through a
  closed-task search (PR #75), and an open-membership read (4 open, 58
  closed). `/api/logs/fk66/summary` returned a bounded worker-log summary of
  that task's investigate run; it describes agent work, not website traffic.
- One-day Faktorial API usage at 12:49:24 UTC on October 29 reported 90,731
  control-plane calls across 13 endpoints (12 shown, one route omitted); task
  reads and canvas context checks led. Reliability was partial: a one-hour
  volatile span TTL against the one-day window, a truncated store, unknown
  sampling and unavailable revision comparability; matched spans covered only
  12:46:14–12:49:24 UTC. These populations cannot be combined into a website
  error rate or demand estimate. Database telemetry would describe the Cloud
  serving process, not this static site, and was not re-read.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
