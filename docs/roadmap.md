# Product and operation roadmap

Reviewed: 2026-10-28 (fk54), source baseline
`d45ec4b788da36340c897e753416015e7f7fb708`.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk44's October 27 assessment: its two next steps have
shipped. The previous document was read in full and reconciled with its exact
merge and current source. Earlier assessments remain in Git; their ownership
is reconciled below.

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
IDs and thirteen stories, including F4-US3 for keyboard bypass. fk51 reconciled
the shipped keyboard and email behavior with the catalog.
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
- The Swedish skip link now precedes repeated navigation and targets one
  `#content` destination per rendered state. Ready bodies are explicitly
  focusable; availability sections retain anchors without explicit tabIndex.
  DOM declarations do not establish browser scrolling, anchor focus transfer
  or focus-only CSS visibility; see [F4](features/navigation-and-recovery.md).
- The quote form now explains the external email-program send step and lack
  of website delivery confirmation. Its accessible description and in-form
  direct-email fallback preserve the native handoff without storing inquiries.

### What works less well and what to improve

- `ContentSurface` returns the global empty state whenever services are empty,
  before routing. This hides otherwise valid about/contact content and
  unknown-route recovery. **Next 1** isolates that unrelated dependency.
- `ServicePage` renders the generic `ContactLinkBand` pointing to `/kontakt/`.
  The inquiry form has no initial service context, so visitors must choose
  again. [F3](features/project-inquiry.md) records this limitation.
  **Next 2** carries the service choice while preserving manual selection.
- Four WebP photographs are present; five requested photographs remain absent
  ([image requests](image-requests.md)). Acquisition and approval remain editorial
  work, distinct from delivered image-failure resilience.
- [F4's catalog](features/navigation-and-recovery.md) also identifies repeated
  navigation declarations that can drift. Reconcile them when navigation changes;
  no third issue is created here. Error feedback has no inline retry; the loader
  is local, so a source defect needs a corrected static deployment.
- Production host, publication access and artifact retention are unestablished.
  A runbook and checksum tools cannot demonstrate rollback or recovery time.
- Inquiry conversion, delivery and satisfaction are unmeasured. Marketing and
  certification statements are authored copy, not verified compliance evidence.
  Telemetry, persistence or submission-service proposals need explicit product
  and privacy decisions before changing the static boundary.

## Delivered work and ownership reconciliation

Authenticated owning task reads and complete one-page open/closed membership
reads were made on October 28. Before creating follow-ups, only fk53/fk54 were
open (2 open, 48 closed). The checkout advanced from Investigation's `a79c151`
to `d45ec4b`: the prior roadmap and its follow-ups are present. Exact Git history
and current owning records reconcile the apparent missing-roadmap concern.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk44](https://app.faktorial.ai/projects/alvalinus/tasks/fk44), previous roadmap | Closed/done; PR #67, merge `a813d149`, candidate `277ed6e`. Document read in full. | Superseded assessment; preserve fk45/fk46 as delivered history. |
| [fk45](https://app.faktorial.ai/projects/alvalinus/tasks/fk45), keyboard bypass | Closed/done; PR #69, merge `5f7d797`; retained native quality pass at `ab82ea8`. Link and targets present. | Previous Next 1 shipped; no duplicate skip-link issue. |
| [fk46](https://app.faktorial.ai/projects/alvalinus/tasks/fk46), email explanation | Closed/done; PR #68, merge `4b60d72`; retained native quality pass at `86815f8`. Explanation and fallback present. | Previous Next 2 shipped. New Next 2 extends service context, not mail delivery or explanation. |
| [fk43](https://app.faktorial.ai/projects/alvalinus/tasks/fk43), mobile preservation | Closed/done; PR #66, merge `4aac7aa`; retained native quality pass at `6003b87`. | Preserve delivered menu coverage; no replacement menu task. |
| [fk51](https://app.faktorial.ai/projects/alvalinus/tasks/fk51), catalog reconciliation | Closed/done; PR #70, merge `d45ec4b`; retained native quality pass at `e014249`. | Current catalog supersedes twelve-story and unexplained-handoff descriptions. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), current frontend run | Open; queue at 12:40:31 UTC shows return to Investigation because the selected mobile capability already exists. Revised scope not yet observed. | Unresolved ownership remains reserved. Recheck revised scope before implementing the two priorities below. |

The prior roadmap's older Done references were checked against current owning
list membership: fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook),
fk5/fk23/fk34 (mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery),
fk32 (catalog), and fk36/fk37 (route validation/checksums) remain closed/done.
None is reopened or recreated. Their earlier merge details remain in fk44's
Git version; this refresh invents no new acceptance receipts. Historical
issue-field inconsistencies do not authorize platform recovery or policy changes.

fk9's record/list is closed; its lifecycle is closed with stage build rather
than a clean done closeout. This is not treated as active catalog ownership or
proof of recovered acceptance. No platform-recovery task is derived from it;
later fk32 maintenance is independently merged. Prior quality passes apply only
to their named heads, never to this roadmap candidate, current main or deployment.

## Short-term priorities and issue ownership

| Priority | Outcome and observable acceptance | Owner and scope |
| --- | --- | --- |
| Next 1 | With empty service records, about/contact retain their valid body, form and fallback email; home/services retain clear empty feedback and unknown paths retain meaningful recovery. Preserve skip-link destinations and loading/error behavior; cover the rendered boundary in memory. | Newly created [fk55 — independent about/contact availability](https://app.faktorial.ai/projects/alvalinus/tasks/fk55). Existing typed routes and renderer; no loader, menu or runtime redesign. Update F4's availability contract. |
| Next 2 | Each service-page inquiry action carries recognized service context into the existing contact select. Visitors can change it; missing/invalid context retains safe defaults. Preserve native mailto semantics, explanation and fallback; cover the link-to-form flow in memory. | Newly created [fk56 — carry service choice into inquiry](https://app.faktorial.ai/projects/alvalinus/tasks/fk56). Native URL mechanism and typed options; no new routes, persistence, personal-data fields or dependencies. Update F3 and affected service stories. |

Exactly two new issues were created by **fk54**: fk55 and fk56. Independent
get_task readbacks confirmed both open, with persisted titles and full bodies
matching the submitted scope and acceptance. These are owner assignments, not
implemented capabilities. They can ship independently but share a renderer file;
refresh source and owning states before editing. Neither duplicates fk53's
retained menu scope; its reassessment must respect these reserved priorities.

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
3. **Resilient customer journeys.** Keep company/contact content available
   independently of services and preserve service intent into inquiry preparation.
   Improve navigation consistency and approved missing imagery. Define useful
   inquiry signals and privacy needs before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   when their repositories and operational evidence are available. Transfer
   demonstrated practices with explicit owners. The autonomous factory operates
   around this static product; it is not an application backend to install here.

## Evidence boundaries and update triggers

- Read the previous roadmap in full, README, rules index, F3/F4 catalog,
  image requests, release runbook, ADR 0006 and recent Git changes. Current
  TypeScript LSP resolved ContentSurface, ServicePage and Contact with state=ok
  at the baseline. Source establishes the two gaps; no production defect,
  conversion loss or compliance assessment is claimed.
- Authenticated /api/logs/fk54/summary returned HTTP 200/state=ok with a bounded
  worker log summary containing truncation. It describes agent work, not traffic.
  Queue reads are execution projections; disabled CI signals do not establish
  a website or quality failure.
- One-day Faktorial API usage at 12:40:42 UTC on October 28 reported 61,601
  control-plane calls across 12 endpoints; the top-three response omitted nine.
  Canvas checks and task reads led. Independent reliability was partial:
  capped retained spans, incomplete joins, unknown sampling and unavailable
  revision comparability; matched spans covered only 12:36:34–12:40:40 UTC.
  These populations cannot be combined into a website error rate or demand
  estimate. Worker resources likewise do not measure website speed.
- Website traffic, inquiry outcomes and production logs remain unavailable.
  The application has no database; Cloud serving-process database telemetry
  would describe another system and was not substituted for product data.
  No new privacy or compliance verdict is claimed.
- Exact ../booking and ../Asynkron.JsEngine paths are absent in this checkout's
  parent. Other locations and cross-project operational evidence remain unknown.
  No sibling source inspection or changes are claimed; credentials and
  platform-state files were not used as substitutes.
- Refresh when source, task scope/state, accepted quality, publication records
  or adjacent-source availability changes. Preserve supersession reasons and
  ownership. No tests, typechecks, builds or quality commands ran in this agent
  session. Ordinary native quality and review assess the committed candidate;
  this document is not a passing receipt.
