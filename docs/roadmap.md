# Product and operation roadmap

Reviewed: 2026-10-24. Source baseline:
`a79c151c5eaf9be865985c85dcbc64acc29badf5` (fk3).

This roadmap connects the current Svärd Entreprenad website to the longer-term
goal of operating a product with minimal human intervention. Current capabilities
below are source observations, not claims of successful production operation.
Goals are proposed work until their owning issues are delivered and verified.

## Where we are

AlvaLinus delivers a Swedish static React/TypeScript site. The nine declared
routes cover home, services, about, contact and five service detail pages:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/`, and `/tradgardsplanering/`.
[Typed site content](../src/data/siteContent.ts) and
[shared contracts](../src/types/site.ts) describe the route/content model;
[SiteHomePage](../src/pages/SiteHomePage.tsx) renders the public surfaces.
[The loader](../src/lib/site-content.ts) returns imported static data.

The site has no application backend, database, authentication or serverless
runtime. [ADR 0001](adrs/0001-static-react-frontend-foundation.md) and
[ADR 0004](adrs/0004-static-subpage-artifacts.md) establish this boundary.
[Vite](../vite.config.ts) copies the root HTML to each declared subpage directory
so direct subpage requests have physical files in `dist/`; React selects the
page content. This is a deployable artifact design, not proof of the production
host's current configuration.

### What works well in the implementation

- Typed content and reusable UI primitives provide a small, understandable
  change surface. Existing [DOM cases](../src/pages/SiteHomePage.test.tsx) cover
  public content, route links, page states and contact controls.
- Recent June changes added a Tjänster service dropdown, photographic heroes
  and service cards, self-hosted fonts, and updated page metadata. The current
  renderer contains the photo maps and fallback behavior; this supersedes the
  older inventory's shared-logo-only description.
- The October 24 changes (`abe2c8d`, then `a79c151`) establish cross-platform,
  locked-dependency commands, ordinary quality and separate native Istanbul
  coverage. [README](../README.md) and [the runner](../scripts/make.js) define
  Node.js 24+, Windows `make.cmd`, strict TypeScript, static builds, route/visual
  assertions and one Vitest session. Test evidence is produced from that same
  session by [quality-evidence.mjs](../scripts/quality-evidence.mjs).
- The form's limited delivery semantics are explicit in
  [ADR 0006](adrs/0006-static-email-contact-handoff.md): it hands information to
  a configured mail client, with fallback contact links and no operational
  secrets or inquiry storage in the site.

These checks and tests exist in source. This roadmap update has not executed
them or established a current passing receipt; native verification follows the
committed delivery.

### What works less well and what to improve

- The [public route inventory](current-public-route-inventory.md), dated June
  16, still describes shared-logo-only rendering and Dränering as a primary
  navigation item. The renderer now uses photos and a service dropdown, while
  `siteContent.inventory.primaryRoutes` still lists the older primary menu.
  Maintenance decisions must reconcile those sources rather than repeat the
  inventory as current rendered truth. Keep this reconciliation within the
  existing feature-documentation work, not another overlapping follow-up.
- Only four WebP photos are present in `public/page-visuals/`. The renderer
  references five additional paths with deliberate fallbacks. The
  [image requests](image-requests.md) describe those gaps; no new photography
  or approval is inferred here.
- Contact capture cannot prove that an inquiry was sent or received. There is
  no source-backed delivery or conversion signal. Guaranteed delivery would
  require an explicit service/runtime decision under ADR 0006.
- The new evidence adapter maps all non-passed/non-failed statuses to skipped,
  accepts finite negative durations, and labels nonempty observations complete.
  That leaves unsupported reporter inputs insufficiently distinguished from
  valid evidence. The runner separately retains Vitest's nonzero exit; this
  observation does not show that a failing gate currently passes.
- Publishing is documented only as uploading `dist/` to static hosting. No
  tracked release/rollback runbook identifies how to connect the accepted
  revision to the published artifact or recover a prior version. The actual
  production host and retention arrangements remain unknown.

## Short-term priorities and issue ownership

Current task records were checked through Faktorial's owning API on October 24,
before selecting follow-ups. fk5, fk8 and fk9 were all open and active in
Investigation. Their unresolved scope blocks duplicate work; none is treated as
Done, retired or replaced. No earlier roadmap existed, so there are no
Done-derived decisions to reconcile in this update. Recheck owning records
before future reuse, retirement or new follow-up creation.

| Priority | Work and intended result | Ownership and scope boundary |
| --- | --- | --- |
| Existing | Improve one concrete visible frontend workflow; use source-backed findings to select it. Photo completion and menu/content consistency remain candidates, not new assignments here. | [fk5](https://app.faktorial.ai/projects/alvalinus/api/tasks/fk5): frontend performance, accessibility, responsiveness or usability. Do not create another visible-workflow issue before its selected scope is known. |
| Existing | Review dependency drift and choose one safe update or cleanup. | [fk8](https://app.faktorial.ai/projects/alvalinus/api/tasks/fk8): dependency maintenance; this roadmap makes no package upgrade recommendation. |
| Existing | Establish source-backed feature documentation and inventory; reconcile stale route/navigation descriptions with current code. | [fk9](https://app.faktorial.ai/projects/alvalinus/api/tasks/fk9): feature docs/manifests and per-feature roadmaps. The central roadmap does not replace those artifacts. |
| Next 1 | Harden the reporter-to-evidence boundary: distinguish supported terminal states from unknown/malformed input, handle invalid duration evidence explicitly, and protect normalization with deterministic in-memory fixtures. | Newly created [fk10 — quality-evidence normalization](https://app.faktorial.ai/projects/alvalinus/api/tasks/fk10), read back open. Bounded build-tool evidence work; no frontend changes, dependency update or feature manifest. Keep the existing process exit authoritative. |
| Next 2 | Document static release and rollback: connect accepted revision/quality identity to the complete artifact, direct-route/asset checks and recovery prerequisites. | Newly created [fk11 — static release and rollback](https://app.faktorial.ai/projects/alvalinus/api/tasks/fk11), read back open. Operations documentation only; no provider choice, deployment automation, feature-inventory rewrite or publication. |

The links above address the canonical authenticated task records. Exactly two
new issues were created by this roadmap update: fk10 and fk11. Their scope is
distinct from the unresolved work above. They are not completed by this document.
Their task bodies carry concrete acceptance criteria and exclusions.

## Long-term goals

1. **Trustworthy autonomous development.** Use immutable source revisions,
   deterministic owner-boundary proofs and native quality receipts to decide
   whether changes are ready. Treat missing or partial evidence as unknown.
   fk10 strengthens one existing boundary; it does not establish a complete
   autonomous code factory. Track whether proposed changes reach an accepted
   gate, and retain failure/recovery context rather than inferring success from
   an agent's prose.
2. **Repeatable product operation.** Start with fk11's release provenance and
   rollback prerequisites. Once the actual hosting and artifact-retention
   ownership are known, assess bounded deployment automation separately, with
   its required architecture decision and access controls. A useful outcome is
   a published revision that can be traced to accepted evidence and restored
   from an identified prior artifact; that capability is not established today.
3. **Maintainable content and intentional customer outcomes.** Keep the route,
   navigation, feature and asset descriptions aligned through fk9 and later
   source reviews. Assess whether customers can find the appropriate service
   and contact route. If inquiry delivery or conversion becomes a requirement,
   first define the desired signal and privacy/consent needs with the operator;
   make the runtime/service decision explicitly. Do not add a database or
   tracking endpoint to the static site to satisfy an abstract autonomy goal.
4. **Evidence-led cross-product learning.** Compare practices with booking and
   Asynkron.JsEngine only when their actual repositories and operational
   evidence are available. Transfer a demonstrated pattern with clear ownership
   and a bounded issue, rather than extrapolating from this site's architecture.

## Evidence boundaries and update triggers

- Recent commits, README, the named source files, ADRs 0001/0004/0006, the route
  inventory and image requests were reviewed. The latest docs/runner changes
  were checked before editing; `docs/roadmap.md` was still absent at the task
  head. Source review and semantic lookup identify the current renderer; no
  preview or production inspection was performed.
- `/api/logs/fk3/summary` returned `state=ok`, HTTP 200, but explicitly
  `source=issue_fallback` with no raw log file. It is task context, not runtime
  or usage evidence.
- Faktorial's seven-day tool-usage read at 12:36:52 UTC reported 88 calls across
  10 reported native runs, 5 incomplete; capture was partial and
  `window_covered=false`. The top-five response omitted 6 tool keys. This
  describes reported development activity, with unknown unreported history.
- The seven-day API-usage read at 12:36:53 UTC reported 1,769 calls across 32
  endpoints (27 omitted from the top-five response). Task reads and queue
  reads led the returned rows. Retained reliability was partial, truncated,
  had unknown sampling and unavailable revision comparability; its observation
  window began at 12:28:18 UTC. These are hosted Faktorial control-plane
  observations, not this static site's visitors, conversion or reliability.
  Do not combine retained reliability samples with durable request totals.
- No production website traffic, inquiry outcomes or application database
  evidence was available. A static site has no application database to inspect;
  Cloud's own database telemetry would not establish customer behavior here.
- `../booking` and `../Asynkron.JsEngine` were absent relative to this assigned
  checkout. Investigation also recorded their absence in the supplied host
  area. No findings about those products are established, and their absence
  does not block this bounded roadmap delivery.
- Refresh this document when the owning issues change scope/state, a new
  accepted quality receipt or publication record becomes available, the host
  and retention facts are supplied, or the missing adjacent sources become
  available. Check the owning APIs again before marking work Done. Retain a
  visible reason whenever superseding or following up prior work.
