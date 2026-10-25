# Product and operation roadmap

Reviewed: 2026-10-25 (fk24), source baseline
`9481400d0e0d3a57a79c64ea0c4293f44fe15f54`.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery and
verified production operation are separate evidence. Goals are proposed work,
not implemented capabilities or permission to expand the site's runtime.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with nine routes:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/` and `/tradgardsplanering/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts),
[the renderer](../src/pages/SiteHomePage.tsx) and
[the local loader](../src/lib/site-content.ts) own the product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

[Vite](../vite.config.ts) emits physical subpage HTML from the route registry
under [ADR 0004](adrs/0004-static-subpage-artifacts.md). This supports direct
static URLs; it does not prove how production currently serves them.
The [feature catalog](features/README.md) now maps services, company information,
project inquiry and navigation to visitor outcomes, routes and twelve stories.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) cover content, routes, states,
  contact controls and mobile navigation Escape/focus behavior. Source review
  establishes those declarations, not their current execution.
- The header exposes five services through Tjänster. Photos and self-hosted
  fonts support the presentation. The [route inventory](current-public-route-inventory.md)
  now distinguishes typed SVG metadata from preferred photographs and describes
  the dropdown. The prior roadmap's shared-logo-only/navigation-drift finding
  is superseded by delivered source corrections, not retained as an open defect.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, cross-platform commands, strict TypeScript, static
  artifact checks and one Vitest session. Coverage remains separate.
- [Reporter normalization](../scripts/quality-evidence.mjs) now rejects
  unsupported statuses and malformed/empty reports and treats invalid durations
  as unknown. Its [in-memory tests](../scripts/quality-evidence.test.mjs) mock
  filesystem I/O. Process exit remains the gate authority.
- The [release/rollback runbook](release-runbook.md) connects source, accepted
  quality, artifact and publication identities. It covers direct-route/asset
  checks and conditional rollback without inventing a hosting provider.
- [ADR 0006](adrs/0006-static-email-contact-handoff.md) bounds contact to a
  native mail-client handoff with fallback links and no stored inquiries.

### What works less well and what to improve

- Four WebP photos exist; five referenced photos remain absent per
  [image requests](image-requests.md) and the checkout. Service cards attempt
  SVG fallback on the first image error, but leave the failed image in place
  if that also fails. Subpage decorative heroes instead hide failed images.
  Improve service-card terminal failure under **Next 1**. This is a source
  resilience gap, not a measured production incident. Missing-image acquisition
  and approval remain separate editorial work.
- [HTML assertions](../scripts/assert-static-routes.mjs) copy eight subpage
  paths; [visual assertions](../scripts/assert-route-visual-assets.mjs) scan
  source text and expect exactly nine paths. Vite derives output from typed
  routes. Today's expectations agree, but future changes can drift between
  owners. **Next 2** makes artifact checks follow the registry automatically.
- Contact capture cannot prove sent/received inquiries, conversion or customer
  satisfaction. Marketing/certification statements are authored content, not
  measured metrics or compliance verification. Delivery, tracking or persistence
  requirements need an explicit decision including privacy/consent needs.
- Production host, publishing access and artifact retention remain unknown.
  A runbook is delivered; automated publication, measured recovery time and
  demonstrated rollback are not established.

## Delivered work and ownership reconciliation

Current owning `get_task` records and open/closed `list_tasks` membership were
read on 2026-10-25 before selecting follow-ups. Git history and source at the
baseline above were checked. Investigation began at `a79c151`; later merges
explain why its missing-roadmap/runbook and unhardened-reporter findings no
longer describe this checkout.

| Work | Current record and source | Disposition |
| --- | --- | --- |
| [fk3](https://app.faktorial.ai/projects/alvalinus/tasks/fk3), prior roadmap | Closed, stage done; merge receipt `0ca6430`, PR #47. Roadmap and README link present. | Refresh existing roadmap. Original follow-ups were fk10/fk11; do not recreate them. |
| [fk10](https://app.faktorial.ai/projects/alvalinus/tasks/fk10), reporter hardening | Closed, stage done; merge receipt `4d630bd`, PR #51; retained quality pass for head `5dc3221`. Code/tests present. | Retire old reporter gap because requested behavior shipped. New artifact work concerns different inputs/owners. |
| [fk11](https://app.faktorial.ai/projects/alvalinus/tasks/fk11), release runbook | Closed, stage done; merge receipt `1b2a922`, PR #50. Runbook/README link present; closeout names unavailable revision-bound quality evidence. | Retire missing-runbook gap. Host, publication and retention remain unknown; closure does not prove live operation. |
| [fk5](https://app.faktorial.ai/projects/alvalinus/tasks/fk5), mobile menu | Closed, stage done; merge receipt `106b46e`, PR #46, retained quality pass for head `c8aec6c`. Link-origin Escape/focus coverage present. | Source delivered; focused-toggle dismissal subsequently delivered by fk23 below. |
| [fk23](https://app.faktorial.ai/projects/alvalinus/tasks/fk23), focused-toggle menu dismissal | Closed, stage done; merge receipt `9481400`, PR #53; retained quality pass for head `fd86865`. Toggle-origin Escape, expanded state and reopening coverage present. | Supersedes this run's earlier open-navigation priority: the fix is now in the source baseline. No replacement task needed. |
| [fk8](https://app.faktorial.ai/projects/alvalinus/tasks/fk8), dependency maintenance | Closed, stage done; merge receipt `27af405`, PR #49, retained quality pass for head `9d2ca2c`. Testing Library update present. | Bounded update delivered; no broader dependency-health claim. |
| [fk9](https://app.faktorial.ai/projects/alvalinus/tasks/fk9), feature catalog | Record/list says closed, but lifecycle projection still says active/build with proof-preflight failure. PR #48 merge is baseline `d1bd013`; catalog and route corrections present. | Source delivered, lifecycle closeout inconsistent. Do not infer clean acceptance or replace its catalog/platform recovery work. Neither follow-up takes that ownership. |

Prior quality results apply only to their named heads, not this roadmap
candidate or deployment. This update ran no tests, typechecks or builds.

## Short-term priorities and issue ownership

| Priority | Outcome and observable acceptance | Owner and scope |
| --- | --- | --- |
| Next 1 | Attempt the service SVG fallback once; if that also fails, hide/remove the broken image while retaining title, summary and correct service link. Prove errors deterministically in memory. | Newly created [fk25 — service image failure recovery](https://app.faktorial.ai/projects/alvalinus/tasks/fk25), independently read back open and active in build. Service-card behavior/tests only; no mobile menu, hero redesign, image acquisition or dependencies. |
| Next 2 | Derive HTML/visual artifact expectations from typed routes. Added/removed fixture routes change expectations automatically; missing/mismatched HTML and invalid/missing/duplicate visuals still fail. | Newly created [fk26 — registry-driven artifact checks](https://app.faktorial.ai/projects/alvalinus/tasks/fk26), independently read back open and active in build. Build assertions and in-memory mocked-I/O tests only; no reporter, native orchestration, hosting or catalog rewrite. |

Exactly two new follow-ups were created by **fk24**: fk25 and fk26. Their task
records carry bounded outcomes, exclusions and observable acceptance. They are
distinct from fk23 and the delivered fk3 follow-ups, and remain unimplemented
by this documentation update. Recheck owning records before execution or new
task creation; unresolved overlapping work blocks replacement even when an
older roadmap calls it Done.

## Long-term goals

1. **Trustworthy autonomous development.** Connect proposals to immutable source,
   deterministic behavior proofs and native quality receipts. Reporter hardening
   is delivered; registry-driven assertions are a bounded next step. Distinguish
   task state from acceptance, especially when lifecycle projections conflict.
   Missing/partial evidence stays unknown.
2. **Repeatable product operation.** Apply the runbook once the actual host,
   publishing access and retention facts are supplied. Target a publication
   traceable to accepted source and a restorable prior artifact. Consider
   deployment automation separately after those prerequisites and explicit
   architecture/access decisions; this roadmap does not implement it.
3. **Maintainable content and intentional customer outcomes.** Align feature/story
   docs, typed routes, navigation and assets. First preserve service selection
   despite image failures. Assess usability through explicit checks; define
   inquiry signals and privacy needs before delivery guarantees or telemetry.
   Preserve the static boundary instead of adding a speculative database.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when their repositories and operational evidence are available. Transfer
   demonstrated practices with bounded ownership rather than inferred capabilities.

## Evidence boundaries and update triggers

- Read the previous roadmap in full, recent commits, README, route inventory,
  catalog, runbook, image requests, ADRs 0006/0007, renderer/tests, Vite and
  assertion/reporter scripts. TypeScript semantic lookup returned `state=ok`
  for Services, PageHero and Header at this baseline. Documentation graph refresh
  found the existing roadmap without truncation.
- `/api/logs/fk24/summary` returned HTTP 200, `state=ok`, explicitly an issue
  fallback without raw logs. The fk3 summary returned HTTP 200, `state=ok`, with
  bounded delivery-stage log excerpts. Neither establishes website usage.
- On October 25 at 12:40:42 UTC, one-day Faktorial API usage reported 42,854
  calls across 28 endpoints; top-three output omitted 25 endpoints. Task reads,
  canvas context checks and queue reads led those rows. Reliability was partial
  with incomplete route joins, sampling unknown and revision comparability
  unavailable; the untruncated retained observations covered only
  12:39:16–12:40:41 UTC. These are control-plane counts,
  not visitors. Do not combine retained spans with durable totals into error rates.
- One-day tool usage at 12:40:42 UTC reported 138 calls across fourteen reported
  native runs, seven incomplete; capture was partial, `window_covered=false`.
  Top-three output omitted twelve keys. Historical/unreported execution stays
  unknown. Counts do not measure product usefulness or autonomous completion.
- Native worker metrics sampled at 12:40:41.954 UTC, observed at 12:40:42.824 UTC,
  were fresh (`stale=false`). CPU was platform-unavailable; bounded history was
  worker-runtime scope, not attributable to this claim. This does not measure
  website performance or establish a resource defect.
- No production traffic, inquiry outcomes, hosting logs or application database
  evidence was available. This static site has no application database; Cloud
  database telemetry would describe another system, not customer behavior here.
- `../booking`, `../Asynkron.JsEngine`, `D:/FaktorialAgent/booking` and
  `D:/FaktorialAgent/Asynkron.JsEngine` were absent on this worker. Cross-project
  findings stay unavailable. No credentials or platform-state files were sought
  as substitutes for owning APIs.
- Refresh when task scopes/states, source contracts, accepted quality or
  publication records change, or missing host/retention/adjacent-source facts
  become available. Retain a visible supersession reason; distinguish source
  delivery, accepted verification and observed live activation.
