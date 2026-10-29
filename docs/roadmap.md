# Product and operation roadmap

Reviewed: 2026-10-29 (fk66), source baseline
`82da6992144b0696be9c70f28f764df558ea56fa` (HEAD).

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
reconciled to these delivered behaviors (fk60, PR #75, current HEAD), so the
catalog — four features, thirteen stories — no longer lists the carried
inquiry context or the availability gap as open work.

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
  photo failure and remove the image after terminal failure; subpage heroes
  hide a failing background photo. Titles, summaries and links always remain.
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

- The home hero photo has no error fallback. `Hero` renders
  `/page-visuals/hero-photo.webp` without an `onError` handler, unlike
  subpage heroes and service cards; [F4's](features/navigation-and-recovery.md)
  state table records the gap. The photo exists today, so this is resilience
  against asset loss, not a current rendering bug. **Next 1** extends the
  existing pattern.
- Navigation destinations are declared repeatedly: `SERVICE_NAV`, hard-coded
  desktop and mobile header anchors, the footer page-link array and the typed
  inventory can drift on route edits. **Next 2** consolidates them through the
  existing typed route model.
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

Authenticated owning task reads and open/closed membership reads were made on
October 29. Before this refresh there were four open records: fk65 (in build,
hero-image fetch priority), fk66 (this task) and fk63/fk64 (an operator
question wait about a live chat session; platform ownership, not site work) —
and 58 closed. The checkout advanced from fk54's `d45ec4b` to `82da699`: the
fk55, fk56 and fk53 merges plus fk60's catalog reconciliation are all present.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk54](https://app.faktorial.ai/projects/alvalinus/tasks/fk54), previous roadmap | Closed/done; PR #71, merge `9a2b82e`. Document read in full. | Superseded assessment; its Next 1/Next 2 shipped as fk55/fk56. Its "fk53 unresolved mobile-menu" reservation is resolved by fk53's actual delivery. |
| [fk55](https://app.faktorial.ai/projects/alvalinus/tasks/fk55), availability isolation | Closed/done; PR #72, merge `a9e7bb2`; retained native quality pass at head `0c3464e`. Verified in source: `routeDependsOnServices` gates only home and the services index. | Delivered. No duplicate availability work. |
| [fk56](https://app.faktorial.ai/projects/alvalinus/tasks/fk56), inquiry context | Closed/done; PR #73, merge `eaa1138`; retained native quality pass at head `17713ab`. Verified in source: `inquiry-service.ts` and `App.tsx` wiring. | Delivered. F3 documents the behavior; no duplicate context work. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), accessible service-link names | Closed/done; PR #74, merge `8c9af38`; retained native quality pass at head `917d296`. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk54's "unresolved mobile-menu ownership" description was inaccurate; no menu work is reserved on fk53's behalf. |
| [fk60](https://app.faktorial.ai/projects/alvalinus/tasks/fk60), catalog reconciliation | Closed/done; PR #75, merge `82da699` (current HEAD); retained native quality pass. | Current F3/F4 documentation; supersedes stale-gap descriptions. |
| [fk65](https://app.faktorial.ai/projects/alvalinus/tasks/fk65), hero fetch priority | Open, in build (2026-10-29 recurring child). | Shared-file neighbor of Next 1 in SiteHomePage.tsx; a coordination note, not an ownership conflict. |

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

| Priority | Outcome and observable acceptance | Owner and scope |
| --- | --- | --- |
| Next 1 | A failing home hero photo removes the image without a retry loop, preserving the navy hero, gradient, headline, actions and stats; a working photo renders exactly as today. Deterministic in-memory coverage at the existing page boundary; update F4. | Newly created [fk67 — home hero photo failure resilience](https://app.faktorial.ai/projects/alvalinus/tasks/fk67). Existing `Hero` and image-error patterns in SiteHomePage.tsx; no new dependencies, routes or runtime; coordinate with fk65's fetch-priority edit of the same file. |
| Next 2 | Header (desktop and mobile) and footer navigation derive destinations from the existing typed route model with today's Swedish labels, order and active states, so a route edit is one declaration instead of parallel markup. | Newly created [fk68 — consolidate navigation declarations](https://app.faktorial.ai/projects/alvalinus/tasks/fk68). Renderer/typed-content consolidation only; no new routes, router dependency or URLs; preserve the fk45 skip link and fk53 accessible names. |

Exactly two new issues were created by **fk66**: fk67 and fk68. Independent
get_task readbacks confirmed both open, with persisted titles and full bodies
matching the submitted scope and acceptance. They can ship independently but
share SiteHomePage.tsx; refresh source and owning states before editing and
keep fk65's fetch-priority change separate. Neither duplicates fk65's
performance scope.

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
3. **Resilient customer journeys.** Availability isolation and inquiry
   context are delivered; remaining work is the hero failure fallback (Next
   1), navigation consistency (Next 2) and approved missing imagery. Define
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
