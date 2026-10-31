# Product and operation roadmap

Reviewed: 2026-10-31 (fk87), source baseline
`ce34f3da00f54b00a043eef477e113c303a1c210` (HEAD).

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk76's October 30 assessment (PR #82, merge
`964f698`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87: the previous document was read in full and reconciled with
exact merge receipts and current source. Earlier assessments remain in Git;
their ownership is reconciled below.

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
feature catalog against those deliveries (PR #80, merge `c513c00`), and
fk76 refreshed this roadmap onto that baseline (PR #82, merge `964f698`).

Four deliveries merged after that refresh, all on the same static boundary.
fk75 gave contact-form fields a visible keyboard focus ring (PR #81, merge
`724e43f`). fk78 pinned the desktop Tjänster dropdown's keyboard-reachable
structure — the focusable `aria-haspopup` trigger and the five-link service
panel — at the existing SiteHomePage DOM boundary (PR #83, merge `a070ee2`),
retiring the last unmapped navigation coverage gap. fk77 replaced the
identical-bytes subpage emission with per-route Swedish `<title>` and meta
descriptions derived from the typed registry, validated by the extended
static-artifact assertions (PR #84, merge `3494926`). fk85 kept the React
family at 19.3.x in a lockfile-only bump that merged during this refresh
(PR #85, merge `ce34f3d`, current main). fk86's prefers-reduced-motion scroll
override (PR #86) is open and unmerged: in-flight work, not part of this
baseline.

[Vite](../vite.config.ts) still emits physical subpage HTML from the route
registry under [ADR 0004](adrs/0004-static-subpage-artifacts.md), now with
per-route titles and descriptions — while the social card tags (`og:` /
`twitter:`) remain home-branded on all eight subpage documents until
[fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88) lands, and no
`404.html` artifact exists for unknown paths until
[fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89) lands. The
route artifact owner rejects ambiguous paths and collisions before emission,
and [the release runbook](release-runbook.md) names portable checksum
commands. The [Live recipe](../.faktorial/live.json) starts the existing Vite
app locally without secrets or external services. These are implemented source
capabilities, not evidence of live publication.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile Escape/focus, availability-isolation, inquiry-context,
  service-image failure and desktop-dropdown keyboard coverage. This refresh
  inspected source and owning records; it did not execute those tests.
- Image failure resilience is layered: service cards try the route SVG after
  photo failure and remove the image after terminal failure; subpage and home
  heroes hide a failing background photo. Titles, summaries and links always
  remain. Above-the-fold heroes request their photographs at high fetch
  priority while service-card images stay lazy.
- Header navigation exposes all five services with distinct accessible names
  and a pinned keyboard-reachable dropdown structure, and the
  [route inventory](current-public-route-inventory.md) matches the
  nine-route registry, with drainage inside Tjänster rather than as a
  separate header item.
- Every route document now serves its own Swedish `<title>` and meta
  description from the typed registry, so browsers and crawlers see
  page-specific head metadata on all nine routes without client-side work.
- Company/contact availability no longer depends on service records, and the
  inquiry form receives the visitor's service choice through a native URL
  parameter without new routes, persistence or personal-data fields. The
  Swedish skip link precedes repeated navigation and targets one `#content`
  destination per rendered state, contact-form fields carry a visible focus
  ring, and the quote form explains the external email-program send step
  with a visible fallback address.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one
  Vitest session. [Reporter normalization](../scripts/quality-evidence.mjs)
  rejects malformed evidence, and invalid durations stay unknown. Process exit
  remains the gate authority.
- The autonomous factory keeps shipping through reviewed, merge-receipted
  tasks: this is the fifth consecutive roadmap refresh, each reconciling the
  previous one against owning records before linking new work.

### What works less well and what to improve

- Social card metadata is still home-branded on every subpage: the delivered
  per-route emission replaces only the `<title>` element and the
  `name="description"` meta, so `index.html`'s global `og:title`,
  `og:description`, `twitter:title` and `twitter:description` values survive
  into all eight emitted subpage documents.
  [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88) owns deriving
  them from the route registry.
- Unknown paths have no deployable recovery artifact: the build emits the SPA
  document only into the nine declared route directories, so a direct visit
  to an undeclared path can return the host's own error page before React
  mounts and the branded Swedish not-found body never shows. F4 records this
  in-app-only ceiling;
  [fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89) owns emitting
  a `404.html` artifact.
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

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, and
again on October 31 during this fk87 refresh. fk75, fk76, fk77, fk78 and
fk85 are all closed/done with merge receipts: fk75 (PR #81, merge `724e43f`;
retained native quality pass at head `9211e86`), fk76 (PR #82, merge
`964f698`), fk78 (PR #83, merge `a070ee2`; retained native quality pass at
head `0823b3c`), fk77 (PR #84, merge `3494926`; retained native quality pass
at head `190e869`) and fk85 (PR #85, merge `ce34f3d`, current main). The
checkout advanced from fk76's `c513c00` baseline to `ce34f3d`: the fk78,
fk77 and fk85 merges are all present. During the October 31 owning reads,
the open records relevant to site work were this task (fk87), fk86 (PR #86
open and unmerged), the two linked next-step tasks created on October 31
(fk88 and fk89, below), fk83 and fk84 (platform-owned factory-loop friction,
below), fk63/fk64 (an operator question wait about a live chat session,
unchanged since October 28) and five delivery-notice records (fk69, fk70,
fk71, fk73 and fk74) — no other open record owned site work at this
baseline.

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
| [fk72](https://app.faktorial.ai/projects/alvalinus/tasks/fk72), catalog/roadmap reconciliation | Closed/done; PR #80, merge `c513c00`; retained native quality pass; native `validate-features` proof passed at head `5da033f`. Verified in source: the previous document revision and the four feature documents at that merge. | Delivered. Its roadmap text deliberately created no new issue; fk76 supplied the next linked steps. |
| [fk75](https://app.faktorial.ai/projects/alvalinus/tasks/fk75), contact focus ring | Closed/done; PR #81, merge `724e43f`; retained native quality pass at head `9211e86`. Not part of fk76's own baseline; folded into the delivered state here. | Delivered. Visible keyboard focus ring on contact-form fields; no duplicate form work. |
| [fk76](https://app.faktorial.ai/projects/alvalinus/tasks/fk76), previous roadmap | Closed/done; PR #82, merge `964f698`. Document read in full during this refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk77/fk78 below. |
| [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78), desktop dropdown keyboard coverage | Closed/done; PR #83, merge `a070ee2`; retained native quality pass at head `0823b3c`. Verified in source: the SiteHomePage suite pins the focusable `aria-haspopup` Tjänster trigger and the five-link registry-order panel; F4's gap text is retired. | Delivered. Protection of current behavior at the existing DOM boundary; no behavior redesign. |
| [fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77), per-route titles and descriptions | Closed/done; PR #84, merge `3494926`; retained native quality pass at head `190e869`. Verified in source: `applyRouteDocumentMetadata`/`routePageMetadata` derive per-route Swedish `<title>`/description from the registry and the static-artifact assertions validate them. | Delivered. The former home-branded head metadata gap is closed for title/description; the social-card remainder is fk88 below. |
| [fk85](https://app.faktorial.ai/projects/alvalinus/tasks/fk85), React 19.3.x lockfile | Closed/done; PR #85, merge `ce34f3d` (current main). Lockfile-only diff. | Delivered. Routine dependency maintenance; no separate follow-up needed. |
| [fk86](https://app.faktorial.ai/projects/alvalinus/tasks/fk86), reduced-motion scrolling | Open; PR #86 exists and is unmerged. | In-flight, not delivered. Recorded once here; fk86 owns its outcome, verification and closeout. |

The prior roadmap's older Done references were checked against current owning
membership on October 29, and no row above was reopened or recreated by this
refresh: fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23/
fk34 (mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery), fk32
(catalog), fk36/fk37 (route validation/checksums), fk43/fk44 (mobile/roadmap),
fk45/fk46 (skip link/email explanation) and fk51 (catalog) remain closed/done.
fk9's closed-with-build lifecycle note stands. Per-head quality receipts
(90/92/103/109/110/120 passing at the fk55/fk53/fk56/fk75/fk78/fk77 heads)
are historical, not current totals, and no acceptance is claimed for this
roadmap candidate, current main or any deployment.

Factory-loop friction is platform-owned and recorded here so no agent
recreates it as site work: [fk83](https://app.faktorial.ai/projects/alvalinus/tasks/fk83)
(a recurring feature-refinement child) sits in an investigate retry wait whose
latest cycle reports "agent result submission missing" while its product
evidence — the required `validate-features` manifest proof — keeps passing;
[fk84](https://app.faktorial.ai/projects/alvalinus/tasks/fk84) actively owns
the diagnosis that fk83's durable automation-run parent record is absent from
Cloud, which is what rejects fk83's typed close; and
[fk63](https://app.faktorial.ai/projects/alvalinus/tasks/fk63)/
[fk64](https://app.faktorial.ai/projects/alvalinus/tasks/fk64) remain the
operator question wait about a live chat session, unchanged since October 28.
None of these is site work; no duplicate record is created for any of them.

## Short-term priorities and issue ownership

fk76's two short-term priorities both shipped on October 30 with passed native
quality runs: **Next 1** delivered the desktop Tjänster dropdown keyboard
coverage as [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78)
(PR #83, merge `a070ee2`) and **Next 2** delivered per-route Swedish titles
and meta descriptions as
[fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77) (PR #84, merge
`3494926`); their ownership rows above carry the verified source facts. The
fk85 lockfile bump (PR #85) merged during this refresh and is folded into the
delivered baseline; fk86's reduced-motion override (PR #86) stays open and
unmerged — in-flight work recorded once above, not duplicated here.

This refresh creates no new issue. The two open next steps, created on
October 31 from source inspected at the `3494926` PR #84 head and verified
open by owning reads before linking, are:

1. [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88) — per-route
   social card metadata: derive each subpage's `og:`/`twitter:` title and
   description from the typed route registry with the same validation
   approach as the delivered title/description emission.
2. [fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89) — a Swedish
   404 artifact: emit `dist/404.html` carrying the SPA document so unknown
   paths boot the existing branded not-found recovery on static hosts.

Remaining improvement candidates stay in the feature roadmaps: content-error
retry, service-specific guidance depth and the approved missing photographs.
Hosting, telemetry and submission-service work still await explicit operator
decisions.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 refresh chain shows the working loop: reconcile, ship,
   re-verify, retire. Separate source delivery, task closure and acceptance;
   missing evidence stays unknown, and platform-side friction such as the
   fk83/fk84 parent-record incident is reported with owning references
   instead of being absorbed into site work.
2. **Repeatable product operation.** Use the delivered checksum commands and
   release runbook when actual hosting/access/retention facts are available.
   Target releases traceable to accepted source and restorable prior
   artifacts. Consider host-specific automation only after those facts and
   explicit access decisions; do not add speculative infrastructure.
3. **Resilient customer journeys.** Availability isolation, inquiry context,
   hero failure resilience, navigation consistency, keyboard coverage,
   per-route head metadata and the contact focus ring are delivered; the
   remaining visitor-facing work is the fk88 social cards, the fk89 unknown-
   path artifact and approved missing imagery. Define useful inquiry signals
   and privacy needs before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent from this checkout's parent. Transfer
   demonstrated practices with explicit owners. The autonomous factory
   operates around this static product; it is not an application backend to
   install here.

## Evidence boundaries and update triggers

- Reads made on October 31 during this fk87 refresh: the previous roadmap in
  full at `ce34f3d`; the `964f698..ce34f3d` Git history (the fk78 PR #83,
  fk77 PR #84 and fk85 PR #85 merges — #85 touches only
  `package-lock.json`); `index.html` (global `og:`/`twitter:` social tags
  still home-branded beside the now per-route title/description);
  `scripts/route-artifacts.mjs` (`applyRouteDocumentMetadata` replaces only
  the title element and the description meta) and its in-memory fixture
  tests; the emitted-artifact inventory (no `404.html`; F4's in-app-only
  unknown-path sentence stands);
  `docs/features/navigation-and-recovery.md` (F4); owning `get_task` reads
  confirming fk75, fk76, fk77, fk78 and fk85 closed/done with the receipts
  above, fk86 open with PR #86 unmerged, fk88 and fk89 open, and fk83/fk84 in
  their platform retry waits; the native queue projection; and the checkout
  parent (`../booking` and `../Asynkron.JsEngine` still absent). fk88 and
  fk89 were created during this refresh with independent `get_task` read-
  backs confirming them open before linking. Unchanged structural claims
  carried from the October 28–30 reviews keep that provenance.
- Owning reads and writes made on October 30 (fk76, retained for
  provenance): `get_task` on fk65, fk67, fk68, fk72 (all closed/done with
  PRs #76/#78/#79/#80), fk63 (open operator wait) and fk64 (open question
  notice); then `create_task` with `get_task` read-backs confirming fk77 and
  fk78 open. The delivery-notice records fk69–fk71, fk73 and fk74 remained
  open by design, and fk75's PR #81 was open and unmerged at the time of
  that read.
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
- One-day Faktorial API usage read on October 31 reported 82,965
  control-plane calls across 9 endpoints; task reads and canvas context
  checks led. Reliability caveats stand: a volatile span TTL against the
  one-day window, unknown sampling and unavailable revision comparability.
  Serving-process database telemetry read the same day covered roughly
  5.3 million queries over about 27 hours with 7 errors — Cloud serving-
  process scope, not this static site. Neither population is website
  traffic, and none can be combined into an error rate or demand estimate.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
