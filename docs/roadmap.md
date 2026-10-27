# Product and operation roadmap

Reviewed: 2026-10-27 (fk44), source baseline
`f730d4d6da104a84e80ba8f3662e2096801610d9`.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk35's October 26 assessment: its two next steps have
shipped. Earlier assessments remain in Git; their ownership is reconciled below.

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
under [ADR 0004](adrs/0004-static-subpage-artifacts.md).
[The route artifact owner](../scripts/route-artifacts.mjs) now rejects ambiguous
paths and collisions before emission. HTML and visual checks consume that same
registry. The [release runbook](release-runbook.md) now names portable commands
to generate and check a deterministic SHA-256 manifest of a complete built tree.
These are implemented source capabilities, not evidence of live publication.

The [feature catalog](features/README.md) maps service selection, company
confidence, project inquiry and supporting navigation to four stable feature
IDs and twelve stories. fk32's catalog maintenance is now delivered.
The [Live recipe](../.faktorial/live.json) starts the existing Vite app through
[scripts/live.mjs](../scripts/live.mjs), using Faktorial's assigned loopback
host and strict port without secrets or external services. A committed recipe
does not establish a running preview or production deployment.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile Escape/focus and service-image failure coverage.
  This refresh inspected source; it did not execute those tests.
- Service cards try the route SVG after photo failure and remove the image
  after terminal failure, retaining text and links. Decorative subpage photos
  hide on failure. Missing photographs do not require recreating that recovery.
- Header navigation exposes all five services. The cleaned SVG logo,
  photographs and self-hosted fonts support presentation. The
  [route inventory](current-public-route-inventory.md) correctly describes
  drainage within Tjänster, rather than as a separate header item.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one Vitest
  session. Coverage remains separate. The Netlify Node setting does not establish
  which platform actually hosts production.
- [Reporter normalization](../scripts/quality-evidence.mjs) rejects malformed,
  empty and unsupported reports; invalid durations remain unknown. Its tests
  mock filesystem I/O. Process exit remains the gate authority.
- Route validation and checksum tooling now remove the two build/release gaps
  selected by fk35. Artifact integrity, quality acceptance and publication
  identity remain separate contracts.
- [ADR 0006](adrs/0006-static-email-contact-handoff.md) bounds contact to a
  native mail-client handoff with a visible fallback address and no stored inquiries.

### What works less well and what to improve

- Keyboard visitors have no skip link past the repeated header. SiteHomePage
  wraps Header and ContentSurface inside main; ready routes have no stable
  content destination, while loading/error/empty sections alone use
  `id="content"`. **Next 1** provides a consistent keyboard bypass.
  This is separate from mobile-menu dismissal owned by fk43.
- The quote form says “Skicka offertförfrågan” without explaining beside the
  action that it requires compatible email software and that the visitor sends
  the message there. The site cannot confirm sending or receipt.
  [F3's catalog](features/project-inquiry.md) identifies this concrete ambiguity.
  **Next 2** clarifies the existing handoff and direct-email recovery.
- Four WebP photographs are present; five requested photographs remain absent
  ([image requests](image-requests.md)). Acquisition and approval remain editorial
  work, distinct from delivered image-failure resilience.
- [F4's catalog](features/navigation-and-recovery.md) identifies a global
  empty-services guard that also hides available about/contact bodies, and
  repeated navigation declarations that can drift. These are later candidates,
  not additional issues created by this refresh.
- Production host, publication access and artifact retention are unestablished.
  A runbook and checksum tools cannot demonstrate rollback or recovery time.
- Inquiry conversion, delivery and satisfaction are unmeasured. Marketing and
  certification statements are authored copy, not verified compliance evidence.
  Telemetry, persistence or submission-service proposals need explicit product
  and privacy decisions before changing the static boundary.

## Delivered work and ownership reconciliation

Current owning get_task records and complete open/closed list_tasks membership
were read on October 27. Immediately before creating follow-ups, only fk43 and
fk44 were open (2 open, 38 closed). The checkout has advanced from investigation's
`a79c151`: the roadmap and suspected route-inventory repair already exist.
Neither is recreated as missing work.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk35](https://app.faktorial.ai/projects/alvalinus/tasks/fk35), previous roadmap | List/lifecycle closed/done; merge `ac7fc47`, PR #61. Previous document read in full. | Superseded assessment; preserve fk36/fk37 as its historical follow-ups. |
| [fk36](https://app.faktorial.ai/projects/alvalinus/tasks/fk36), route validation | List/lifecycle closed/done; merge `e670adc`, PR #63; retained quality pass at `434ac18`. Shared validator and fixtures present. | Retire previous Next 1 as shipped; no replacement validation issue. |
| [fk37](https://app.faktorial.ai/projects/alvalinus/tasks/fk37), artifact checksums | List/lifecycle closed/done; merge `50e3c35`, PR #64; retained quality pass at `76e2a3c`. Commands and runbook present. | Retire previous Next 2 as shipped; live publication remains unknown. |
| [fk32](https://app.faktorial.ai/projects/alvalinus/tasks/fk32), catalog maintenance | Closed/done; merge `bd770a4`, PR #60; retained quality pass at `a82329c`. | Retire stale active-owner wording. Next 2 implements its documented F3 improvement, not catalog rediscovery. |
| [fk34](https://app.faktorial.ai/projects/alvalinus/tasks/fk34), mobile tests | List/lifecycle closed/done; merge `bf2b27e`, PR #62; retained quality pass at `53f9106`. | Coverage delivered; preserve it. Skip-link work adds a different visitor capability. |
| [fk43](https://app.faktorial.ai/projects/alvalinus/tasks/fk43), current frontend run | Open/active build at refresh; mobile Escape/focus behavior and regression coverage. | Unresolved ownership blocks duplicate menu work. This roadmap does not assess its candidate or replace its scope. |

Earlier roadmap references were also refreshed through owning records: fk3/fk24
(roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23 (mobile dismissal), fk8
(dependencies), and fk25/fk26 (image recovery/registry checks) remain list/lifecycle
closed/done. None is reopened here. fk25/fk26, and now fk36/fk37, retain open
issue-document fields despite closed/done list/lifecycle projections. Named
merge receipts and source support delivery; this refresh reports the discrepancy
without changing task policy.

fk9's record/list is closed; its lifecycle is closed with stage build rather
than a clean done closeout. This is not treated as active catalog ownership or
proof of recovered acceptance. No platform-recovery task is derived from it;
later fk32 maintenance is independently merged. Prior quality passes apply only
to their named heads, never to this roadmap candidate, current main or deployment.

## Short-term priorities and issue ownership

| Priority | Outcome and observable acceptance | Owner and scope |
| --- | --- | --- |
| Next 1 | A Swedish skip link precedes repeated navigation, becomes visible on focus, and reaches a stable focusable page-body target across ready/loading/error/empty/not-found states. Preserve routes, assets and menu behavior; protect the owning DOM behavior deterministically. | Newly created [fk45 — keyboard navigation bypass](https://app.faktorial.ai/projects/alvalinus/tasks/fk45). Native HTML and existing styles; no menu redesign, dependencies or compliance certification. |
| Next 2 | Explain the external mail-client requirement before the form action on home and contact pages, associate the explanation accessibly with the form, and make direct-email fallback identifiable. Preserve native validation, recipient, subject and mailto action; never imply delivery confirmation. | Newly created [fk46 — explain email handoff](https://app.faktorial.ai/projects/alvalinus/tasks/fk46). Reuse typed content; update F3 documentation and shared contact coverage. No backend, new personal-data fields, storage or tracking. |

Exactly two new issues were created by **fk44**: fk45 and fk46. Independent
get_task readbacks confirmed both open, with persisted titles and complete bodies
matching the submitted scope and acceptance. Their links above identify the
owning project tasks. Their capabilities are not implemented in this documentation
change. Each solves distinct source-observed friction; neither duplicates
unresolved fk43. Refresh source and owning states before execution or another
roadmap pass, even if older text says Done.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. Reconcile stale roadmap text before
   creating work. Separate source delivery, task closure and acceptance;
   missing evidence stays unknown.
2. **Repeatable product operation.** Use the delivered checksum commands and
   release runbook when actual hosting/access/retention facts are available.
   Target releases traceable to accepted source and restorable prior artifacts.
   Consider host-specific automation only after those facts and explicit access
   decisions; do not add speculative infrastructure to the site.
3. **Intentional customer outcomes.** Improve keyboard access and explain the
   email handoff first. Later consider independent about/contact recovery,
   route-driven navigation and approved missing imagery. Define useful inquiry
   signals and privacy needs before promising delivery guarantees or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   when their repositories and operational evidence are available. Transfer
   demonstrated practices with explicit owners. The autonomous factory operates
   around this static product; it is not an application backend to install here.

## Evidence boundaries and update triggers

- Read the previous roadmap in full, README, route inventory, rules index,
  F3/F4 catalog documents, image requests, release runbook, recent commit changes,
  renderer, typed content, route validator and relevant DOM declarations.
  TypeScript LSP resolved SiteHomePage and Contact with state=ok at the baseline.
  Focused search in src found no skip/autocomplete/mail-client explanation matches;
  output was untruncated, enrichment suppressed. Source inspection grounds the
  two findings; no runtime defect or compliance assessment is claimed.
- /api/logs/fk44/summary returned HTTP 200, state=ok, explicitly
  source=issue_fallback with no raw log. This is task context, not traffic.
  The queue at 12:42:45 UTC showed fk43/fk44 active and CI signals disabled;
  it did not demonstrate a website or quality failure.
- At 12:42:45 UTC on October 27, one-day Faktorial API usage reported 63,072
  calls across 18 endpoints; top-three output omitted 15 endpoints.
  Canvas context checks and task reads led. Independent reliability was partial:
  truncated retained spans, incomplete route joins, unknown sampling and
  unavailable revision comparability. Matched spans covered 12:37:33–12:42:41 UTC,
  not the requested day. These are control-plane counts, not website visitors or
  autonomous product outcomes. No error rate combines the two populations.
- Worker metrics sampled 12:42:44.296 UTC, observed 12:42:45.655 UTC, were fresh
  (stale=false); CPU was platform-unavailable. Twenty retained history points
  were unattributed to this claim. They do not measure website speed.
- Website traffic, inquiry outcomes and production logs remain unavailable.
  The application has no database; Cloud serving-process database telemetry
  would describe another system and was not substituted for product data.
  No new privacy or compliance verdict is claimed.
- Exact ../booking, ../Asynkron.JsEngine, D:/FaktorialAgent/booking and
  D:/FaktorialAgent/Asynkron.JsEngine paths were checked and are absent on this
  worker. Other locations remain unknown. No cross-repository inspection is
  claimed; credentials and platform-state files were not used as substitutes.
- Refresh when source, task scope/state, accepted quality, publication records
  or adjacent-source availability changes. Preserve supersession reasons and
  ownership. No tests, typechecks, builds or quality commands ran in this agent
  session. Ordinary native quality and review assess the committed candidate;
  this document is not a passing receipt.
