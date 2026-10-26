# Product and operation roadmap

Reviewed: 2026-10-26 (fk35), source baseline
`d8f081d4bf712519f9b1293b26562b6053905536`.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh replaces fk24's October 25 assessment while retaining its history.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with nine routes:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/` and `/tradgardsplanering/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts),
[the renderer](../src/pages/SiteHomePage.tsx) and
[the local loader](../src/lib/site-content.ts) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

[Vite](../vite.config.ts) emits physical subpage HTML from the route registry
under [ADR 0004](adrs/0004-static-subpage-artifacts.md). Both
[HTML](../scripts/assert-static-routes.mjs) and
[visual](../scripts/assert-route-visual-assets.mjs) assertions now consume the
same registry through [their owner](../scripts/route-artifacts.mjs), without
a copied route list, source-text extraction or fixed count. This establishes
source capability, not the behavior of an unobserved production host.

The [feature catalog](features/README.md) maps service selection, company
confidence, project inquiry and supporting navigation to four stable feature
IDs and twelve stories. Active fk32 owns maintenance; existing files do not
establish acceptance or passing proof for that new run.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile-navigation Escape/focus and service-image failure coverage.
  This refresh inspected source; it did not execute those tests.
- Service cards try the route SVG after photo failure and remove the image
  after terminal failure, retaining text and links. fk25's delivery retires
  the previous broken-image finding.
- Header navigation exposes all five services. The approved cleaned SVG logo
  replaced the PNG in `d8f081d` (PR #59); the
  [route inventory](current-public-route-inventory.md) reflects its path.
  Photographs and self-hosted fonts support presentation.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one Vitest
  session. Coverage remains separate. `.nvmrc` now selects Node 24 for Netlify
  builds (`f349429`, PR #57); this does not prove a production deployment.
- [Reporter normalization](../scripts/quality-evidence.mjs) rejects malformed,
  empty and unsupported reports; invalid durations remain unknown. Its
  [tests](../scripts/quality-evidence.test.mjs) mock filesystem I/O. Process
  exit remains the gate authority.
- The [release/rollback runbook](release-runbook.md) connects source, accepted
  quality, artifact and publication identities, direct-route/asset checks and
  conditional rollback without assuming a host.
- [ADR 0006](adrs/0006-static-email-contact-handoff.md) bounds contact to a
  native mail-client handoff with fallback links and no stored inquiries.

### What works less well and what to improve

- Artifact checks now follow the registry, but href validation only requires
  a leading slash. Vite maps hrefs to filesystem directories separately.
  Duplicate paths, dot segments and URL query/fragment forms are not rejected
  as invalid static directory routes. Current authored paths are ordinary
  valid paths; this is a future-change guardrail gap, not an observed incident.
  **Next 1** extends fk26's delivered capability at that boundary.
- The runbook requires an artifact checksum manifest but leaves complete tree
  traversal, portable paths and comparison to ad hoc shell commands. The
  runner's dependency-lock hash does not identify a release artifact.
  **Next 2** makes artifact identity repeatable without hosting credentials.
- Four WebP photos exist; five referenced photos remain absent per
  [image requests](image-requests.md) and the checkout. Terminal recovery is
  delivered, but acquiring/approving suitable photographs remains editorial
  work. Decorative subpage photos hide on failure. Missing content is distinct
  from fk25's completed resilience work.
- Contact handoff cannot prove sent/received inquiries, conversion or customer
  satisfaction. Marketing/certification statements are authored content, not
  measured metrics or verified compliance. Delivery, tracking or persistence
  proposals need explicit product and privacy/consent decisions.
- Production host, publication access and artifact retention are unestablished.
  A runbook and a Netlify Node setting do not establish automated publication,
  measured recovery time or a demonstrated rollback.

## Delivered work and ownership reconciliation

Current owning `get_task` records were read on October 26, together with complete
open `list_tasks` membership (three tasks before this run's two creations).
The assigned checkout advanced from investigation's `a79c151` to the baseline
above, including the previously missing roadmap and later fixes. Missing files
in the old checkout were not treated as grounds to recreate delivered work.

| Work | Current record and source | Disposition |
| --- | --- | --- |
| [fk3](https://app.faktorial.ai/projects/alvalinus/tasks/fk3), first roadmap | Closed/done; merge `0ca6430`, PR #47. | Historical foundation; its fk10/fk11 follow-ups shipped. |
| [fk10](https://app.faktorial.ai/projects/alvalinus/tasks/fk10), reporter hardening | Closed/done; merge `4d630bd`, PR #51; retained quality pass at `5dc3221`. Source/tests present. | Retire old reporter gap; artifact identity is a different owner/contract. |
| [fk11](https://app.faktorial.ai/projects/alvalinus/tasks/fk11), release runbook | Closed/done; merge `1b2a922`, PR #50. Runbook present; revision-bound quality evidence unavailable in its closeout. | Retire missing-runbook gap. Next 2 explicitly extends its manual checksum step; no live-operation claim. |
| [fk5](https://app.faktorial.ai/projects/alvalinus/tasks/fk5), mobile menu | Closed/done; merge `106b46e`, PR #46; retained quality pass at `c8aec6c`. | Delivered; toggle-origin dismissal subsequently completed by fk23. |
| [fk23](https://app.faktorial.ai/projects/alvalinus/tasks/fk23), focused-toggle dismissal | Closed/done; merge `9481400`, PR #53; retained quality pass at `fd86865`. Source/tests present. | Retire old navigation defect; do not replace active fk34's overlapping scope. |
| [fk8](https://app.faktorial.ai/projects/alvalinus/tasks/fk8), dependency maintenance | Closed/done; merge `27af405`, PR #49; retained quality pass at `9d2ca2c`. Further dependency merges appear in current history. | Bounded deliveries, not a general dependency-health or current quality claim. |
| [fk9](https://app.faktorial.ai/projects/alvalinus/tasks/fk9), feature catalog | Record/list closed; lifecycle still active/build with feature-manifest proof-preflight failure. PR #48 merge `d1bd013` and catalog present. | Source delivered; acceptance/lifecycle discrepancy unresolved. Do not replace catalog/platform recovery ownership or infer a clean closeout. |
| [fk24](https://app.faktorial.ai/projects/alvalinus/tasks/fk24), previous roadmap | Closed/done; merge `75c6d6e`, PR #54; previous roadmap read in full. | Refresh assessment; preserve its exactly two historical follow-ups fk25/fk26. |
| [fk25](https://app.faktorial.ai/projects/alvalinus/tasks/fk25), terminal image recovery | List/lifecycle closed/done; merge `fbbf288`, PR #55; retained quality pass at `71cba15`. ServiceCardImage removes failed fallback. | Retire previous Next 1: shipped. Missing photos are separate editorial work. |
| [fk26](https://app.faktorial.ai/projects/alvalinus/tasks/fk26), registry artifact assertions | List/lifecycle closed/done; merge `36d4947`, PR #56; retained quality pass at `4633152`. Scripts and in-memory fixtures present. | Retire previous Next 2: shipped. New href validation explicitly extends it rather than recreating registry adoption. |
| [fk32](https://app.faktorial.ai/projects/alvalinus/tasks/fk32), catalog maintenance | Open/active build; existing catalog present at baseline. | Unresolved ownership blocks overlapping follow-ups. This refresh does not rewrite catalog/manifests or claim acceptance. |
| [fk34](https://app.faktorial.ai/projects/alvalinus/tasks/fk34), frontend maintenance | Open/active build; current Investigation selects mobile Escape/focus behavior from older `a79c151`. | Current source includes fk5/fk23's delivery. Its worker must reassess that stale gap; no replacement UI task is created here. |

fk25/fk26 retain open issue-document fields while list/lifecycle projections
say closed/done. Named merge receipts and source establish delivery; this refresh
reports the discrepancy without editing task policy or acceptance.
Prior quality passes apply only to their named heads, never to this roadmap
candidate, current main or deployment. This run executed no quality commands.

## Short-term priorities and issue ownership

| Priority | Outcome and observable acceptance | Owner and scope |
| --- | --- | --- |
| Next 1 | Reject ambiguous, escaping or colliding hrefs before emitting static files. Share validation between Vite and artifact assertions; retain valid root/nested paths and prove invalid classes deterministically in memory. | Newly created [fk36 — canonical static route paths](https://app.faktorial.ai/projects/alvalinus/tasks/fk36). Extends delivered fk26; build route validation only, preserving current URLs and visual contracts. |
| Next 2 | Produce and verify a deterministic SHA-256 manifest of a complete already-built static tree. Detect added, missing and byte-changed files, keep portable paths and generated evidence outside Git, and document exact cross-platform commands. | Newly created [fk37 — release artifact checksum manifest](https://app.faktorial.ai/projects/alvalinus/tasks/fk37). Extends delivered fk11's manual identity step; no build execution, publication automation or hosting decision. |

Exactly two new tasks were created by **fk35**: fk36 and fk37. Independent
`get_task` readbacks confirmed both open, with exact persisted titles and bodies
matching submitted outcomes, acceptance and exclusions. They remain unimplemented
by this documentation refresh. Complete open membership was rechecked immediately
before creation; fk32/fk34/fk35 were the only open tasks. The new scopes are
distinct from catalog, frontend and platform recovery work, and independently
useful. Refresh owning states/source before execution or another roadmap pass;
unresolved overlap blocks replacement even if older roadmap text says Done.

## Long-term goals

1. **Trustworthy autonomous development.** Tie proposals to current source,
   deterministic owner-boundary proofs and native quality receipts. Reporter
   hardening and registry-driven checks are delivered; reject invalid route
   destinations next. Separate task closure, acceptance and source delivery,
   especially where lifecycle projections conflict. Missing evidence stays unknown.
2. **Repeatable product operation.** Make artifact identity reproducible first.
   Apply the runbook when actual host, access and retention facts are supplied.
   Target a release traceable to accepted source and a restorable prior artifact.
   Consider host-specific deployment automation only after those facts and
   explicit architecture/access decisions; this roadmap does not implement it.
3. **Maintainable content and intentional customer outcomes.** Let fk32 reconcile
   stable stories with current source and fk34 reassess its selected UI scope.
   Acquire approved missing photos separately from delivered failure recovery.
   Define useful inquiry signals and privacy needs before delivery guarantees or
   telemetry. Preserve the static boundary rather than adding a speculative database.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when their repositories and operational evidence are available. Transfer
   demonstrated practices with explicit ownership rather than inferred capabilities.

## Evidence boundaries and update triggers

- Read the previous roadmap in full, recent code/documentation changes, README,
  route inventory, catalog README, runbook, image requests, route emission,
  artifact assertion owners/tests and service-image implementation. Document
  graph refresh imported 34 documents with no errors and returned the roadmap
  without truncation. Worker-local TypeScript lookup of Services returned
  `state=ok` at baseline. JavaScript-language semantic lookup of
  requireRouteRegistry was unsupported; no semantic absence claim follows.
- `/api/logs/fk35/summary` returned HTTP 200, `state=ok`, explicitly
  `source=issue_fallback` with no raw log. This is task context, not traffic.
- At 12:40:35 UTC on October 26, one-day Faktorial API usage reported 47,713
  calls across 23 endpoints; top-three output omitted 20 endpoints. Canvas
  context checks and task reads led. Independent reliability was partial:
  retained spans truncated, route joins incomplete, sampling unknown, revision
  comparability unavailable. Matched spans covered 12:34:06–12:40:31 UTC,
  not the requested day. These are control-plane counts, not website visitors
  or autonomous product outcomes. Do not combine retained spans with durable
  totals into error rates.
- Tool usage at 12:40:35 UTC reported 1,258 calls across 118 reported native
  runs, two incomplete; capture partial, `window_covered=false`. Top-three
  output omitted fourteen keys. Historical/unreported execution stays unknown.
- Worker metrics sampled 12:40:10.397 UTC, observed 12:40:15.006 UTC, were
  fresh (`stale=false`); CPU was platform-unavailable. At most twenty retained
  history points describe the worker runtime, unattributed to this claim.
  They do not measure website speed or establish a resource defect.
- Website traffic, inquiry outcomes and production logs were unavailable.
  The application has no database; Cloud database telemetry would describe
  another system and was not substituted for website evidence. No new
  compliance or privacy verdict is claimed.
- `../booking`, `../Asynkron.JsEngine`, `D:/FaktorialAgent/booking` and
  `D:/FaktorialAgent/Asynkron.JsEngine` remain absent on this worker.
  Investigation also checked AlvaLinus project-root locations. Cross-project
  findings stay unavailable; credentials or platform-state files were not
  sought as substitutes.
- Refresh on changes to source, task scope/state, accepted quality or publication
  records, or when host/retention/adjacent-source facts become available. Preserve
  supersession reasons and ownership. Ordinary native quality and review assess
  this candidate; this document is not a passing receipt.
