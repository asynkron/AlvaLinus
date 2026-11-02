# Product and operation roadmap

Reviewed: 2026-11-02 (fk105), source baseline
`f46ebcc7d85137503ab48f7fa25c5efe3f6db3e8` (HEAD, main tip).

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk96's November 1 assessment (PR #91, merge
`982c850`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105: the previous document was read in full and
reconciled with exact merge receipts and current source. Earlier assessments
remain in Git; their ownership is reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with nine routes:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/` and `/tradgardsplanering/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts),
[the renderer](../src/pages/SiteHomePage.tsx) and
[the local loader](../src/lib/site-content.ts) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 1 review, main advanced from `ee4d635` to `f46ebcc`
(this baseline) with three capability merges on top of the same static
boundary. fk95's home-hero preload merged (PR #92, merge `216eacf`):
[index.html](../index.html) preloads the hero photo with
`fetchpriority="high"`, and the route emission strips that preload link from
the eight subpage documents and `dist/404.html` while requiring it on the
root document — an absence-tolerant strip composed in
[`route-artifacts.mjs`](../scripts/route-artifacts.mjs) and validated by the
static-artifact assertion. fk97's per-service guidance merged (PR #93, merge
`7739c7d`): `ServiceArea` now requires a `guidance` field
([types/site.ts](../src/types/site.ts)), all five service entries declare
their own Swedish "När tjänsten passar" text in
[siteContent.ts](../src/data/siteContent.ts), and the ServicePage aside
renders that field instead of the shared title-interpolated template. fk98's
first-paint boot merged (PR #94, merge `f46ebcc`): the renderer initializes
its default state as ready bundled content
(`initialState ?? { status: "ready", content: siteContent }`),
so visitors see the actual page body on first load instead of a
"Laddar innehåll" skeleton; the injected loading/error contracts and the
loader module remain as fk98's scoped preserve.

The visitor-facing baseline is therefore complete on the goals fk96 linked:
per-route Swedish head and social metadata, the unknown-path recovery
artifact, reduced-motion scrolling, hero fetch priority and photo-failure
resilience, per-service guidance depth, and an immediate-ready first paint.
What remains is dead-weight retirement and registry single-sourcing inside
the delivered surface (fk106/fk107 below), not new visitor capability.

Later-context note recorded once:
[fk104](https://app.faktorial.ai/projects/alvalinus/tasks/fk104) — the
November 2 Persistent Frontend Optimization automation child — is in flight
in its own worktree at this same baseline. It is open parallel platform
work, not part of this baseline.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile Escape/focus, availability-isolation, inquiry-context,
  service-image failure, desktop-dropdown keyboard, per-service guidance and
  first-paint boot coverage; the route-emission plugin and its assertion are
  covered by deterministic in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs), and the
  reduced-motion override has its own focused stylesheet test. This refresh
  inspected source and owning records; it did not execute those tests.
- The typed route/service registry is now the declaration source for every
  page-level Swedish text: per-route `<title>`/description, social card
  values, navigation labels, service summaries, tags and — since fk97 —
  each service's own "När tjänsten passar" guidance, all validated against
  built output at build time without client-side work.
- Every page boots with real content: the bundled registry renders on first
  paint, so the delivered page body replaces the former guaranteed skeleton
  paint; injected loading/error seams stay documented for the deterministic
  tests that exercise them.
- Unknown paths have a deployable recovery artifact: `dist/404.html` carries
  the same SPA document with not-found metadata, so hosts that serve it boot
  the branded Swedish recovery with the visitor's requested URL preserved.
  Whether the eventual production host does so stays a host decision.
- Image loading is layered and prioritized: the home hero preloads at high
  fetch priority on the root document only, above-the-fold heroes request
  their photographs eagerly while service-card images stay lazy, service
  cards try the route SVG after photo failure, and failing heroes hide
  themselves — titles, summaries and links always remain. Reduced-motion
  visitors get instant anchor scrolling instead of the smooth default.
- Header navigation exposes all five services with distinct accessible names
  and a pinned keyboard-reachable dropdown structure, and the
  [route inventory](current-public-route-inventory.md) matches the
  nine-route registry, with drainage inside Tjänster rather than as a
  separate header item.
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
  tasks: this is the seventh consecutive roadmap refresh, each reconciling
  the previous one against owning records before linking new work.

### What works less well and what to improve

- One service-specific conditional remains in the renderer: ServicePage
  renders a hardcoded Dränering-only Swedish paragraph behind
  `service.id === "dranering"`
  ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), and that text exists
  nowhere in the typed registry — the single-declaration-source principle
  fk77/fk88/fk97 established is not yet total.
  [fk106](https://app.faktorial.ai/projects/alvalinus/tasks/fk106) owns
  moving it into the registry.
- The ready-first boot left dead contracts in the delivered surface:
  `loadSiteContent` in [`site-content.ts`](../src/lib/site-content.ts) has
  zero callers in the repository, and the `loading`/`error` branches of
  ContentSurface are reachable only through an injected `initialState` that
  production never passes — tests pin states no visitor can see.
  [fk107](https://app.faktorial.ai/projects/alvalinus/tasks/fk107) owns
  retiring that dead weight explicitly, keeping the empty-services guard.
- Content-error inline retry stays retired as dead code: with the ready-first
  boot the error state is even further from production, and a retry
  affordance would be unreachable UI. A real recovery need would only appear
  with a network-backed loader, which the static boundary excludes.
- Four WebP photographs are present; five requested photographs remain absent
  ([image requests](image-requests.md)): Grävjobb, Trädgårdsplanering and the
  services/about/contact heroes. Acquisition and approval remain editorial
  work, distinct from delivered image-failure resilience.
- Production host, publication access and artifact retention are unestablished.
  A runbook and checksum tools cannot demonstrate rollback or recovery time,
  and whether the host serves `404.html` at unknown paths is unobserved.
- Inquiry conversion, delivery and satisfaction are unmeasured. Telemetry,
  persistence or submission-service proposals need explicit product and
  privacy decisions before changing the static boundary.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, and
again on November 2 during this fk105 refresh. The checkout advanced from
fk96's `ee4d635` baseline to `f46ebcc`: the fk95, fk97 and fk98 merges are
all present, in that order, and `ee4d635` is now reachable from this HEAD
(resolving the open question recorded during investigation). fk95, fk97 and
fk98 are all closed/done with merge receipts: fk95 (PR #92, merge
`216eacf`; native quality pass 137/137 at head `3948fae`), fk97 (PR #93,
merge `7739c7d`; quality 137/137 at head `2b89fe1`) and fk98 (PR #94, merge
`f46ebcc`; quality 138/138 at head `43c23ff`). During the November 2 owning
reads, the open records relevant to this roadmap were this task (fk105),
fk104 (the November 2 automation child, in flight), the two next-step tasks
created during this refresh (fk106 and fk107, below), fk83/fk84/fk103
(platform-owned factory-loop friction, below), fk63/fk64 (the operator
question wait about the stuck live chat session, unchanged since October 28)
and the delivery-notice records (fk69–fk71, fk73, fk74, fk79–fk82,
fk90–fk94, fk99–fk102) — no other open record owned site work at this
baseline.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk54](https://app.faktorial.ai/projects/alvalinus/tasks/fk54), previous roadmap | Closed/done; PR #71, merge `9a2b82e`. Document read in full. | Superseded assessment; its Next 1/Next 2 shipped as fk55/fk56. Its "fk53 unresolved mobile-menu" reservation is resolved by fk53's actual delivery. |
| [fk55](https://app.faktorial.ai/projects/alvalinus/tasks/fk55), availability isolation | Closed/done; PR #72, merge `a9e7bb2`; retained native quality pass at head `0c3464e`. Verified in source: `routeDependsOnServices` gates only home and the services index. | Delivered. No duplicate availability work. |
| [fk56](https://app.faktorial.ai/projects/alvalinus/tasks/fk56), inquiry context | Closed/done; PR #73, merge `eaa1138`; retained native quality pass at head `17713ab`. Verified in source: `inquiry-service.ts` and `App.tsx` wiring. | Delivered. F3 documents the behavior; no duplicate context work. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), accessible service-link names | Closed/done; PR #74, merge `8c9af38`; retained native quality pass at head `917d296`. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk54's "unresolved mobile-menu ownership" description was inaccurate; no menu work is reserved on fk53's behalf. |
| [fk60](https://app.faktorial.ai/projects/alvalinus/tasks/fk60), catalog reconciliation | Closed/done; PR #75, merge `82da699`; retained native quality pass. | Current F3/F4 documentation at that baseline; supersedes stale-gap descriptions. |
| [fk65](https://app.faktorial.ai/projects/alvalinus/tasks/fk65), hero fetch priority | Closed/done; PR #76, merge `0eb2a37`; retained native quality pass. Verified in source: heroes carry high fetch priority without lazy loading; `ServiceCardImage` stays lazy. | Delivered. Mapped once through F4-US1; F1/F4 prose and the route inventory record the priority split. |
| [fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67), home hero photo failure resilience | Closed/done; PR #78, merge `7c11aa4`; retained native quality pass. Verified in source: `Hero` hides the photo on error and F4-US1 maps both hero declarations. | Delivered. F4's state table and the route inventory describe the behavior; fk66's former Next 1 gap is closed. |
| [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68), navigation consolidation | Closed/done; PR #79, merge `7427cff`; retained native quality pass. Verified in source: `PAGE_NAV`/`SERVICE_NAV` filter `siteContent.routes`; header, mobile menu and footer render from them. | Delivered. F4 and the catalog README describe the single declaration source; fk66's former Next 2 gap is closed. |
| [fk72](https://app.faktorial.ai/projects/alvalinus/tasks/fk72), catalog/roadmap reconciliation | Closed/done; PR #80, merge `c513c00`; retained native quality pass; native `validate-features` proof passed at head `5da033f`. Verified in source: the previous document revision and the four feature documents at that merge. | Delivered. Its roadmap text deliberately created no new issue; fk76 supplied the next linked steps. |
| [fk75](https://app.faktorial.ai/projects/alvalinus/tasks/fk75), contact focus ring | Closed/done; PR #81, merge `724e43f`; retained native quality pass at head `9211e86`. Not part of fk76's own baseline; folded into the delivered state here. | Delivered. Visible keyboard focus ring on contact-form fields; no duplicate form work. |
| [fk76](https://app.faktorial.ai/projects/alvalinus/tasks/fk76), previous roadmap | Closed/done; PR #82, merge `964f698`. Document read in full during fk87's refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk77/fk78. |
| [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78), desktop dropdown keyboard coverage | Closed/done; PR #83, merge `a070ee2`; retained native quality pass at head `0823b3c`. Verified in source: the SiteHomePage suite pins the focusable `aria-haspopup` Tjänster trigger and the five-link registry-order panel. | Delivered. Protection of current behavior at the existing DOM boundary; no behavior redesign. |
| [fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77), per-route titles and descriptions | Closed/done; PR #84, merge `3494926`; retained native quality pass at head `190e869`. Verified in source: `applyRouteDocumentMetadata`/`routePageMetadata` derive per-route Swedish `<title>`/description from the registry. | Delivered. The social-card remainder shipped as fk88 below. |
| [fk85](https://app.faktorial.ai/projects/alvalinus/tasks/fk85), React 19.3.x lockfile | Closed/done; PR #85, merge `ce34f3d`. Lockfile-only diff. | Delivered. Routine dependency maintenance; no separate follow-up needed. |
| [fk87](https://app.faktorial.ai/projects/alvalinus/tasks/fk87), previous roadmap | Closed/done; PR #88, merge `0005393`. Document read in full during fk96's refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk88/fk89, and its in-flight fk86 reservation is delivered. |
| [fk86](https://app.faktorial.ai/projects/alvalinus/tasks/fk86), reduced-motion scrolling | Closed/done; PR #86, merge `7025d05`; native quality pass 123/123 at head `0a4eef3`. Verified in source at the ee4d635 baseline: the `prefers-reduced-motion` block sets `html { scroll-behavior: auto; }` in [styles.css](../src/styles.css), pinned by [its focused test](../src/styles.reduced-motion.test.ts). Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk87's "open and unmerged" description is retired; no reduced-motion work remains. |
| [fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89), Swedish 404 artifact | Closed/done; PR #90, merge `b263666`; quality 128/128 at head `45fb98d`. Verified in source at the ee4d635 baseline: `notFoundArtifactPath`/`notFoundPageMetadata` in [route-artifacts.mjs](../scripts/route-artifacts.mjs), emitted by [vite.config.ts](../vite.config.ts) and required by the static-artifact assertion; F4 and the route inventory describe the artifact and its unknown host behavior. | Delivered. The former "no deployable unknown-path recovery" gap is retired; host-serving behavior stays an operator/host fact. |
| [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88), per-route social card metadata | Closed/done; PR #89, merge `ee4d635`; quality 131/131 at head `64d2955`. Now reachable from this HEAD (during fk105's investigation it existed only in the local object store). Verified in source: the emission replaces all four `og:`/`twitter:` head values with the registry-composed title/description, the assertion validates subpages against root-text mismatches, and the root document keeps its global values. | Delivered. The former "home-branded social cards on every subpage" gap is retired. |
| [fk96](https://app.faktorial.ai/projects/alvalinus/tasks/fk96), previous roadmap | Closed/done; PR #91, merge `982c850`. Document read in full during this refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk97/fk98 below, and its in-flight fk95 reservation is delivered. |
| [fk95](https://app.faktorial.ai/projects/alvalinus/tasks/fk95), home-hero preload | Closed/done; PR #92, merge `216eacf`; quality 137/137 at head `3948fae`. Verified in source at this baseline: [index.html](../index.html) line 31 preloads the hero photo with `fetchpriority="high"`; the emission strips that link from the eight subpage documents and `dist/404.html` and requires it on the root document. | Delivered. fk96's "open parallel frontend work" description is retired; fk95's scheduling projection reports `record_state=missing` while the owning record is closed/done. |
| [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97), per-service guidance | Closed/done; PR #93, merge `7739c7d`; quality 137/137 at head `2b89fe1`. Verified in source: `ServiceArea.guidance` is required ([types/site.ts](../src/types/site.ts)), five registry declarations exist, and the aside renders `{service.guidance}`; the shared template sentence is gone. | Delivered. The former "same aside five times" gap is retired; the Dränering leftover is fk106's, below. |
| [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98), first-paint ready boot | Closed/done; PR #94, merge `f46ebcc` (this baseline); quality 138/138 at head `43c23ff`. Verified in source: the default state is `initialState ?? { status: "ready", content: siteContent }`, and the renderer no longer calls the loader; the injected loading/error seams and the uncalled loader remain as fk98's scoped preserve. | Delivered. The former "skeleton paints first" gap is retired; the dead contract remainder is fk107's, below. |
| [fk104](https://app.faktorial.ai/projects/alvalinus/tasks/fk104), automation child (2026-11-02) | Open; the November 2 Persistent Frontend Optimization child, in flight in its own worktree at this same baseline. | In-flight, owned by fk104. Recorded once here; not duplicated as roadmap work. |
| [fk106](https://app.faktorial.ai/projects/alvalinus/tasks/fk106), registry-declared Dränering paragraph | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |
| [fk107](https://app.faktorial.ai/projects/alvalinus/tasks/fk107), dead content-loading contract retirement | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |

The prior roadmap's older Done references were checked against current owning
membership on October 29, and no row above was reopened or recreated by this
refresh: fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23/
fk34 (mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery), fk32
(catalog), fk36/fk37 (route validation/checksums), fk43/fk44 (mobile/roadmap),
fk45/fk46 (skip link/email explanation) and fk51 (catalog) remain closed/done.
fk9's closed-with-build lifecycle note stands. Per-head quality receipts
(90/92/103/109/110/120 passing at the fk55/fk53/fk56/fk75/fk78/fk77 heads,
123/128/131 at the fk86/fk89/fk88 heads, 137/137/138 at the fk95/fk97/fk98
heads) are historical, not current totals, and no acceptance is claimed for
this roadmap candidate, current main or any deployment.

Factory-loop friction is platform-owned and recorded here so no agent
recreates it as site work, rewritten from fresh November 2 owning reads:
[fk83](https://app.faktorial.ai/projects/alvalinus/tasks/fk83) (a recurring
feature-refinement child) is open on `waiting.kind=human` since November 1,
17:08Z — after 134 blocked stage attempts its occurrence escalated to an
explicit operator decision (question comment `1793552887379264500`, carried
by notice [fk103](https://app.faktorial.ai/projects/alvalinus/tasks/fk103)):
repair the automation-run parent record
(`automation-run:local:feature-refinement:1793366910953132005`, absent from
Cloud, which rejects the typed task_completion close) or close fk83 manually;
its product evidence stays green (required `validate-features` proof passing,
digest `3535d7b5…`, fresh November 1) while the close stays rejected.
[fk84](https://app.faktorial.ai/projects/alvalinus/tasks/fk84), the incident
task, parks on `waiting.kind=issue` for fk83's completion — about 117
identical rechecks found zero change, the latest 2026-11-01 22:54Z — after
fk83's human escalation already stopped its 15–20-minute retry loop. The
live-chat operator question is unchanged:
[fk63](https://app.faktorial.ai/projects/alvalinus/tasks/fk63) and notice
[fk64](https://app.faktorial.ai/projects/alvalinus/tasks/fk64) still wait on
the stuck session reset or daemon restart decision, both records' last update
October 28, 17:00Z, re-read unchanged on November 2. The fk83/fk84/fk63 waits
are platform/operator decisions, not agent work; no duplicate record is
created for any of them, and fk103's existing question is not duplicated.

## Short-term priorities and issue ownership

fk96's two short-term priorities both shipped with passed native quality
runs: **Next 1** delivered per-service Swedish "När tjänsten passar"
guidance as [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97)
(PR #93, merge `7739c7d`) and **Next 2** delivered the first-paint ready
boot as [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98)
(PR #94, merge `f46ebcc`, this baseline); fk95's home-hero preload (PR #92,
merge `216eacf`) also merged, closing what fk96 recorded as in-flight.
Their ownership rows above carry the verified source facts.

This refresh creates two new issues, grounded in source inspected at this
`f46ebcc` baseline and verified open by owning read-backs before linking:

1. [fk106](https://app.faktorial.ai/projects/alvalinus/tasks/fk106) —
   declare the Dränering service detail paragraph in the typed registry:
   remove the last renderer-side service conditional
   (`service.id === "dranering"`) so the route/service registry stays the
   single Swedish declaration source.
2. [fk107](https://app.faktorial.ai/projects/alvalinus/tasks/fk107) — retire
   the dead content-loading contracts: delete the uncalled
   `loadSiteContent` loader, remove the production-unreachable
   loading/error branches and their test seams, and update the F4
   documentation, keeping the empty-services guard.

Remaining candidates were judged and dispositioned above: the content-error
inline retry stays retired as dead code; the five missing photographs stay
editorial (`docs/image-requests.md`); hosting, telemetry and
submission-service work still await explicit operator decisions. fk104's
in-flight automation child is recorded once in the ownership table and is
not duplicated here.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 refresh chain shows the working loop:
   reconcile, ship, re-verify, retire. Separate source delivery, task closure
   and acceptance; missing evidence stays unknown, and platform-side friction
   such as the fk83/fk84 parent-record incident is reported with owning
   references instead of being absorbed into site work.
2. **Repeatable product operation.** Use the delivered checksum commands and
   release runbook when actual hosting/access/retention facts are available.
   Target releases traceable to accepted source and restorable prior
   artifacts. Consider host-specific automation only after those facts and
   explicit access decisions; do not add speculative infrastructure.
3. **Resilient customer journeys.** Availability isolation, inquiry context,
   hero failure resilience and fetch priority, navigation consistency,
   keyboard coverage, per-route head and social metadata, the unknown-path
   recovery artifact, reduced-motion scrolling, the contact focus ring,
   per-service guidance and the first-paint ready boot are delivered; the
   remaining visitor-visible work is fk106's registry single-sourcing,
   fk107's dead-contract retirement, the parallel fk104 candidate and
   approved missing imagery. Define useful inquiry signals and privacy needs
   before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 2, this
   checkout's parent holds only the fk104/fk105 worktrees. Transfer
   demonstrated practices with explicit owners. The autonomous factory
   operates around this static product; it is not an application backend to
   install here.

## Evidence boundaries and update triggers

- Reads made on November 2 during this fk105 refresh: the previous roadmap in
  full (fk96's revision, whose committed base text is the `ee4d635` review);
  the `ee4d635..f46ebcc` Git history after fetching origin (the fk95 PR #92,
  fk97 PR #93 and fk98 PR #94 merges, with `982c850` fk96's own docs merge);
  source verification at this HEAD of all three delivered capabilities
  (`index.html` hero preload with `fetchpriority="high"`;
  `scripts/route-artifacts.mjs` preload strip patterns, root-required and
  subpage/404-absent assertions; `src/types/site.ts` required `guidance`
  field; the five `guidance:` declarations in `src/data/siteContent.ts`; the
  aside rendering `service.guidance`; the ready-default boot state and the
  removed loader call in `src/pages/SiteHomePage.tsx`; the surviving
  Dränering conditional and its registry absence; the test assertion at
  `SiteHomePage.test.tsx` pinning the hardcoded paragraph); a fresh
  `public/page-visuals` listing (four WebP photos present, five requested
  absent); and the checkout parent (only the fk104/fk105 worktrees;
  `../booking` and `../Asynkron.JsEngine` still absent). Owning `get_task`
  reads confirmed fk95, fk97 and fk98 closed/done with the receipts above,
  fk83 open on a human wait with the fk103 question unanswered, fk84 open
  issue-waiting on fk83's completion, fk63/fk64 unchanged since October 28,
  and fk104 open in flight. fk106 and fk107 were created during this refresh
  with independent `get_task` read-backs confirming them open with exact
  labels before linking, and the open-record inventory (27 records, listed
  above) came from an authenticated open-task list read. Unchanged
  structural claims carried from the October 28–November 1 reviews keep that
  provenance.
- One-day Faktorial API usage read on November 2 reported 65,268 control-plane
  calls across 11 endpoints, led by canvas context checks (45,510) and task
  reads (19,524). Reliability caveats stand: a volatile one-hour span TTL
  against the one-day window, unknown sampling, truncated retained
  populations, unmatched server spans and unavailable revision comparability.
  The serving-process database telemetry read the same day (cumulative since
  the collector's November 1 reset, about 19.7 hours) covered roughly 3.90
  million calls and 3.48 million queries with 2 errors. Both populations are
  Cloud serving-process scope, not this static site, and none can be combined
  into an error rate or demand estimate.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
- Owning reads and writes made on November 1 (fk96, retained for
  provenance): `get_task` confirming fk86, fk88 and fk89 closed/done with
  receipts, fk83/fk84 in their platform retry waits with November 1
  receipts, fk63/fk64 unchanged, fk95 open in build at the same base, and
  the label inventory; `create_task`/`get_task` confirming fk97 and fk98
  open; source verification of the three ee4d635-baseline capabilities; the
  October 31–November 1 API usage and database telemetry reads under the
  same serving-process caveats.
- Owning reads and writes made on October 31 (fk87, retained for
  provenance): `get_task` confirming fk75, fk76, fk77, fk78 and fk85
  closed/done with receipts, fk86 open with PR #86 unmerged (at that time),
  fk88 and fk89 open, and fk83/fk84 in their platform retry waits; the
  `964f698..ce34f3d` Git history; `index.html`,
  `scripts/route-artifacts.mjs`, F4 and the emitted-artifact inventory; the
  native queue projection; one-day API usage (82,965 calls across 9
  endpoints) and database telemetry (about 5.3 million queries over about 27
  hours with 7 errors); and `create_task`/`get_task` confirming fk88 and
  fk89 open.
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
