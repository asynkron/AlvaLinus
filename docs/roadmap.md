# Product and operation roadmap

Reviewed: 2026-10-29 (fk66/fk72), source baseline
`7427cffd8d97e6c3f75215e76f9332f62ad2e151` (HEAD).

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk54's October 28 assessment: its two next steps have
shipped. The previous document was read in full and reconciled with exact
merge receipts and current source. Earlier assessments remain in Git; their
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
(PR #79, merge `7427cff`, current HEAD). F4's documentation, the route
inventory and the feature catalog were updated with each delivery.

[Vite](../vite.config.ts) still emits physical subpage HTML from the route
registry under [ADR 0004](adrs/0004-static-subpage-artifacts.md), the route
artifact owner rejects ambiguous paths and collisions before emission, and
[the release runbook](release-runbook.md) names portable checksum commands.
The [Live recipe](../.faktorial/live.json) starts the existing Vite app
locally without secrets or external services. These are implemented source
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
  tasks: this is the third roadmap refresh in three days, each reconciling the
  previous one against owning records before creating new work.

### What works less well and what to improve

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
and again during fk72's catalog reconciliation. fk65, fk67 and fk68 are all
closed/done with merge receipts and passed native quality runs: fk65 (PR #76,
merge `0eb2a37`), fk67 (PR #78, merge `7c11aa4`) and fk68 (PR #79, merge
`7427cff`). The checkout advanced from fk54's `d45ec4b` to `7427cff`: the
fk55, fk56 and fk53 merges, fk60's catalog reconciliation and the three
October 29 deliveries above are all present. During the second read the open
records were this task (fk72), four delivery-notice records (fk69, fk70, fk71
and fk73) and fk63/fk64 (an operator question wait about a live chat session;
platform ownership, not site work) — no open record owns site work from the
previous refresh's list.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk54](https://app.faktorial.ai/projects/alvalinus/tasks/fk54), previous roadmap | Closed/done; PR #71, merge `9a2b82e`. Document read in full. | Superseded assessment; its Next 1/Next 2 shipped as fk55/fk56. Its "fk53 unresolved mobile-menu" reservation is resolved by fk53's actual delivery. |
| [fk55](https://app.faktorial.ai/projects/alvalinus/tasks/fk55), availability isolation | Closed/done; PR #72, merge `a9e7bb2`; retained native quality pass at head `0c3464e`. Verified in source: `routeDependsOnServices` gates only home and the services index. | Delivered. No duplicate availability work. |
| [fk56](https://app.faktorial.ai/projects/alvalinus/tasks/fk56), inquiry context | Closed/done; PR #73, merge `eaa1138`; retained native quality pass at head `17713ab`. Verified in source: `inquiry-service.ts` and `App.tsx` wiring. | Delivered. F3 documents the behavior; no duplicate context work. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), accessible service-link names | Closed/done; PR #74, merge `8c9af38`; retained native quality pass at head `917d296`. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk54's "unresolved mobile-menu ownership" description was inaccurate; no menu work is reserved on fk53's behalf. |
| [fk60](https://app.faktorial.ai/projects/alvalinus/tasks/fk60), catalog reconciliation | Closed/done; PR #75, merge `82da699`; retained native quality pass. | Current F3/F4 documentation at that baseline; supersedes stale-gap descriptions. |
| [fk65](https://app.faktorial.ai/projects/alvalinus/tasks/fk65), hero fetch priority | Closed/done; PR #76, merge `0eb2a37`; retained native quality pass. Verified in source: `Hero` and `PageHero` images carry `fetchPriority="high"` without a lazy-loading attribute; `ServiceCardImage` stays lazy. | Delivered. Mapped once through F4-US1; F1/F4 prose and the route inventory record the priority split. |
| [fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67), home hero photo failure resilience | Closed/done; PR #78, merge `7c11aa4`; retained native quality pass. Verified in source: `Hero` hides the photo on error and F4-US1 maps both hero declarations. | Delivered. F4's state table and the route inventory describe the behavior; the former Next 1 gap is closed. |
| [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68), navigation consolidation | Closed/done; PR #79, merge `7427cff` (current HEAD); retained native quality pass. Verified in source: `PAGE_NAV`/`SERVICE_NAV` filter `siteContent.routes`; header, mobile menu and footer render from them. | Delivered. F4 and the catalog README describe the single declaration source; the former Next 2 gap is closed. |

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

The two short-term priorities created by fk66 both shipped on October 29 with
passed native quality runs: **Next 1** delivered home-hero photo failure
resilience as [fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67)
(PR #78, merge `7c11aa4`) and **Next 2** delivered the typed-registry
navigation consolidation as [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68)
(PR #79, merge `7427cff`). Their ownership rows above carry the verified
source facts. fk65's fetch-priority delivery (PR #76) landed between them and
is mapped through F4-US1, so the shared-file coordination notes from the
previous refresh are resolved. This documentation reconciliation (fk72) creates
no new site-work issue; remaining improvement candidates stay in the feature
roadmaps: content-error retry, service-specific guidance depth and the
approved missing photographs.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 refresh
   chain shows the working loop: reconcile, ship, re-verify, retire. Separate
   source delivery, task closure and acceptance; missing evidence stays
   unknown.
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

- Reads made on October 29: the previous roadmap in full; F3, F4 and the
  feature-catalog README at `82da699`; `docs/image-requests.md`;
  `src/pages/SiteHomePage.tsx`, `src/lib/inquiry-service.ts` and
  `src/App.tsx`; the `d45ec4b..82da699` Git log and diff; the
  `public/page-visuals` listing (four WebP photos present); and the checkout
  parent (only the fk65/fk66 worktrees). Unchanged structural claims carried
  from the October 28 review keep that provenance.
- Reads made during fk72's reconciliation, also on October 29: the
  `0eb2a37..7427cff` Git log and docs/test diff (fk65/fk67/fk68 deliveries,
  including their own F4/README/route-inventory edits); the four feature
  documents, F4-US1 and both feature manifests, and
  `src/pages/SiteHomePage.test.tsx` at HEAD; a fresh `public/page-visuals`
  listing (still four WebP photos present, five requested photographs absent);
  and owning `get_task`/membership reads confirming fk65, fk67 and fk68
  closed/done with PRs #76/#78/#79. fk63/fk64 remain in their operator
  question wait.
- Authenticated owning reads: `get_task` on fk53, fk54, fk55 and fk56 with
  exact merge receipts (PRs #71–#74), fk60 found through a closed-task search
  (PR #75), and an open-membership read (4 open, 58 closed).
  `/api/logs/fk66/summary` returned a bounded worker-log summary of this
  task's investigate run; it describes agent work, not website traffic.
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
