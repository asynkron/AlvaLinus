# Product and operation roadmap

Reviewed: 2026-11-01 (fk96), source baseline
`ee4d6354e01a94ec2399ad712d82c042ff4d0d17` (HEAD).

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk87's October 31 assessment (PR #88, merge
`0005393`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96: the previous document was read in full and reconciled
with exact merge receipts and current source. Earlier assessments remain in
Git; their ownership is reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with nine routes:
`/`, `/tjanster/`, `/om-oss/`, `/kontakt/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/` and `/tradgardsplanering/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts),
[the renderer](../src/pages/SiteHomePage.tsx) and
[the local loader](../src/lib/site-content.ts) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the October 31 review, three capabilities shipped on top of the same
static boundary, and all three are verified in this checkout's source at the
`ee4d635` baseline. fk86's `prefers-reduced-motion` scroll override merged
(PR #86, merge `7025d05`): inside
[`styles.css`](../src/styles.css)'s reduced-motion block, `html` scrolls with
`scroll-behavior: auto` while the smooth default applies to everyone else, and
[`styles.reduced-motion.test.ts`](../src/styles.reduced-motion.test.ts) pins
that the override exists only inside the media query. fk89's Swedish not-found
artifact merged (PR #90, merge `b263666`): the build now also emits
`dist/404.html` — the SPA document with the `Sidan finns inte` title and
description composed beside the site name
([`notFoundPageMetadata`](../scripts/route-artifacts.mjs), emitted by
[vite.config.ts](../vite.config.ts)) — so a static host that serves it at
unknown paths boots the existing branded in-app recovery. fk88's per-route
social card metadata merged (PR #89, merge `ee4d635`, this baseline): the
emission now replaces `og:title`, `og:description`, `twitter:title` and
`twitter:description` in every subpage and not-found document with the same
registry-composed title and description used for the visible head, and
[`assert-static-routes.mjs`](../scripts/assert-static-routes.mjs) validates
all of it against the built output.

The head-metadata story is therefore complete for every emitted document:
nine route directories plus `dist/404.html` all carry their own Swedish
`<title>`, description and social card values derived from the typed route
registry, with the root document keeping its global home values. This closes
the two gaps the previous refresh linked as fk88 and fk89, and it lands the
fk86 reduced-motion work that was in flight at the last review.

Later-context note recorded once:
[fk95](https://app.faktorial.ai/projects/alvalinus/tasks/fk95) — the November 1
Persistent Frontend Optimization child — is building at this same `ee4d635`
baseline, currently a home-hero preload hint with per-document stripping in
the route emission. It is open parallel frontend work, not part of this
baseline.

### What works well

- Typed content and shared components keep changes bounded. Existing
  [DOM tests](../src/pages/SiteHomePage.test.tsx) declare route/content,
  contact, mobile Escape/focus, availability-isolation, inquiry-context,
  service-image failure and desktop-dropdown keyboard coverage; the
  route-emission plugin and its assertion are covered by deterministic
  in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs), and the
  reduced-motion override has its own focused stylesheet test. This refresh
  inspected source and owning records; it did not execute those tests.
- Every emitted document now serves complete page-specific Swedish head
  metadata — title, description and `og:`/`twitter:` social card values —
  from the typed registry, validated at build time, without client-side work
  and without changing the root document's global values.
- Unknown paths have a deployable recovery artifact: `dist/404.html` carries
  the same SPA document with not-found metadata, so hosts that serve it boot
  the branded Swedish recovery with the visitor's requested URL preserved.
  Whether the eventual production host does so stays a host decision.
- Image failure resilience is layered: service cards try the route SVG after
  photo failure and remove the image after terminal failure; subpage and home
  heroes hide a failing background photo. Titles, summaries and links always
  remain. Above-the-fold heroes request their photographs at high fetch
  priority while service-card images stay lazy, and reduced-motion visitors
  get instant anchor scrolling instead of the smooth default.
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
  tasks: this is the sixth consecutive roadmap refresh, each reconciling the
  previous one against owning records before linking new work.

### What works less well and what to improve

- The five service pages' guidance is generic: the "När tjänsten passar"
  aside renders one shared template sentence with only the service title
  interpolated ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), and the
  typed service entries carry a summary plus three tags — so a visitor
  comparing services reads the same aside five times.
  [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97) owns giving
  each service its own declared guidance.
- Every page boot paints the "Laddar innehåll" skeleton first even though the
  loader returns bundled content synchronously and the component already
  imports that content at module scope; the ready page replaces the skeleton
  after mount.
  [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98) owns rendering
  bundled content on first paint while keeping the injected-state contracts.
- Content-error feedback has no inline retry — and this refresh judged that
  gap as not worth an issue: the local loader is a synchronous passthrough of
  bundled content, so the error state is a defensive contract that cannot
  trigger in production, and a retry affordance would be dead code. F4's
  "no inline retry" note stands as the deliberate ceiling; a real recovery
  need would only appear with a network-backed loader, which the static
  boundary excludes.
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
October 31 during fk87's refresh, and again on November 1 during this fk96
refresh. fk86, fk88 and fk89 are all closed/done with merge receipts: fk86
(PR #86, merge `7025d05`; native quality pass 123/123 at head `0a4eef3`),
fk88 (PR #89, merge `ee4d635`; quality 131/131 at head `64d2955`) and fk89
(PR #90, merge `b263666`; quality 128/128 at head `45fb98d`). The checkout
advanced from fk87's `ce34f3d` baseline to `ee4d635`: the fk86, fk89 and fk88
merges are all present, in that order. During the November 1 owning reads,
the open records relevant to this roadmap were this task (fk96), fk95
(active build at this same baseline), fk83 and fk84 (platform-owned
factory-loop friction, below), fk63/fk64 (an operator question wait about a
live chat session, unchanged since October 28), the two next-step tasks
created during this refresh (fk97 and fk98, below) and fourteen
delivery-notice records (fk69–fk71, fk73, fk74, fk79–fk82, fk90–fk94) — no
other open record owned site work at this baseline.

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
| [fk76](https://app.faktorial.ai/projects/alvalinus/tasks/fk76), previous roadmap | Closed/done; PR #82, merge `964f698`. Document read in full during fk87's refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk77/fk78. |
| [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78), desktop dropdown keyboard coverage | Closed/done; PR #83, merge `a070ee2`; retained native quality pass at head `0823b3c`. Verified in source: the SiteHomePage suite pins the focusable `aria-haspopup` Tjänster trigger and the five-link registry-order panel. | Delivered. Protection of current behavior at the existing DOM boundary; no behavior redesign. |
| [fk77](https://app.faktorial.ai/projects/alvalinus/tasks/fk77), per-route titles and descriptions | Closed/done; PR #84, merge `3494926`; retained native quality pass at head `190e869`. Verified in source: `applyRouteDocumentMetadata`/`routePageMetadata` derive per-route Swedish `<title>`/description from the registry. | Delivered. The social-card remainder shipped as fk88 below. |
| [fk85](https://app.faktorial.ai/projects/alvalinus/tasks/fk85), React 19.3.x lockfile | Closed/done; PR #85, merge `ce34f3d`. Lockfile-only diff. | Delivered. Routine dependency maintenance; no separate follow-up needed. |
| [fk87](https://app.faktorial.ai/projects/alvalinus/tasks/fk87), previous roadmap | Closed/done; PR #88, merge `0005393`. Document read in full during this refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk88/fk89 below, and its in-flight fk86 reservation is delivered. |
| [fk86](https://app.faktorial.ai/projects/alvalinus/tasks/fk86), reduced-motion scrolling | Closed/done; PR #86, merge `7025d05`; native quality pass 123/123 at head `0a4eef3`. Verified in source at this baseline: the `prefers-reduced-motion` block sets `html { scroll-behavior: auto; }` in [styles.css](../src/styles.css), pinned by [its focused test](../src/styles.reduced-motion.test.ts). fk86's scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk87's "open and unmerged" description is retired; no reduced-motion work remains. |
| [fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89), Swedish 404 artifact | Closed/done; PR #90, merge `b263666`; quality 128/128 at head `45fb98d`. Verified in source: `notFoundArtifactPath`/`notFoundPageMetadata` in [route-artifacts.mjs](../scripts/route-artifacts.mjs), emitted by [vite.config.ts](../vite.config.ts) and required by the static-artifact assertion; F4 and the route inventory describe the artifact and its unknown host behavior. | Delivered. The former "no deployable unknown-path recovery" gap is retired; host-serving behavior stays an operator/host fact. |
| [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88), per-route social card metadata | Closed/done; PR #89, merge `ee4d635` (this baseline); quality 131/131 at head `64d2955`. Verified in source: the emission replaces all four `og:`/`twitter:` head values with the registry-composed title/description, the assertion validates subpages against root-text mismatches, and the root document keeps its global values. | Delivered. The former "home-branded social cards on every subpage" gap is retired. |
| [fk95](https://app.faktorial.ai/projects/alvalinus/tasks/fk95), frontend optimization child (2026-11-01) | Open; build active at this same `ee4d635` baseline (home-hero preload hint with per-document stripping in the route emission). | In-flight, owned by fk95. Recorded once here; not duplicated as roadmap work. |
| [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97), per-service guidance | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |
| [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98), first-paint ready boot | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |

The prior roadmap's older Done references were checked against current owning
membership on October 29, and no row above was reopened or recreated by this
refresh: fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23/
fk34 (mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery), fk32
(catalog), fk36/fk37 (route validation/checksums), fk43/fk44 (mobile/roadmap),
fk45/fk46 (skip link/email explanation) and fk51 (catalog) remain closed/done.
fk9's closed-with-build lifecycle note stands. Per-head quality receipts
(90/92/103/109/110/120 passing at the fk55/fk53/fk56/fk75/fk78/fk77 heads,
123/128/131 at the fk86/fk89/fk88 heads) are historical, not current totals,
and no acceptance is claimed for this roadmap candidate, current main or any
deployment.

Factory-loop friction is platform-owned and recorded here so no agent
recreates it as site work: [fk83](https://app.faktorial.ai/projects/alvalinus/tasks/fk83)
(a recurring feature-refinement child) sits in an investigate retry wait
(attempt 124 as of November 1) whose latest cycles report the typed
task_completion close rejected while its product evidence — the required
`validate-features` manifest proof — keeps passing (fresh proof November 1,
12:37Z, run `5f069301-…-dmjvmhunqweg`, digest `3535d7b5…`);
[fk84](https://app.faktorial.ai/projects/alvalinus/tasks/fk84) actively owns
the diagnosis that fk83's durable automation-run parent record
(`automation-run:local:feature-refinement:1793366910953132005`) is absent
from Cloud, which is what rejects fk83's typed close (fk84's recheck the same
hour read zero feature-refinement records in both views); and
[fk63](https://app.faktorial.ai/projects/alvalinus/tasks/fk63)/
[fk64](https://app.faktorial.ai/projects/alvalinus/tasks/fk64) remain the
operator question wait about a live chat session — both records' last update
is October 28, 17:00Z, re-read unchanged on November 1. None of these is
site work; no duplicate record is created for any of them.

## Short-term priorities and issue ownership

fk87's two short-term priorities both shipped with passed native quality
runs: **Next 1** delivered per-route social card metadata as
[fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88) (PR #89,
merge `ee4d635`, this baseline) and **Next 2** delivered the Swedish 404
artifact as [fk89](https://app.faktorial.ai/projects/alvalinus/tasks/fk89)
(PR #90, merge `b263666`); their ownership rows above carry the verified
source facts. fk86's reduced-motion override (PR #86, merge `7025d05`) also
merged, closing what fk87 recorded as in-flight. fk95's home-hero preload
stays fk95's in-flight work, recorded once above and not duplicated here.

This refresh creates two new issues, grounded in source inspected at this
`ee4d635` baseline and verified open by owning read-backs before linking:

1. [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97) —
   per-service Swedish "När tjänsten passar" guidance: replace the shared
   template aside with guidance declared per service in the typed registry,
   so the five service pages actually help a visitor choose.
2. [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98) — first-
   paint ready content: boot from the bundled registry instead of painting
   the "Laddar innehåll" skeleton first, keeping the injected-state
   contracts.

Remaining candidates were judged and dispositioned above: the content-error
inline retry is retired as dead code for a synchronous local loader; the five
missing photographs stay editorial (`docs/image-requests.md`); hosting,
telemetry and submission-service work still await explicit operator
decisions.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 refresh chain shows the working loop: reconcile, ship,
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
   per-route head and social metadata, the unknown-path recovery artifact,
   reduced-motion scrolling and the contact focus ring are delivered; the
   remaining visitor-facing work is fk97's service guidance depth, fk98's
   first-paint boot, the parallel fk95 preload candidate and approved missing
   imagery. Define useful inquiry signals and privacy needs before promising
   delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 1, this
   checkout's parent holds only the fk95/fk96 worktrees and the machine's
   asynkron checkout folder holds only `femma`. Transfer demonstrated
   practices with explicit owners. The autonomous factory operates around
   this static product; it is not an application backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 1 during this fk96 refresh: the previous roadmap in
  full at `ee4d635`; the `ce34f3d..ee4d635` Git history (the fk86 PR #86,
  fk89 PR #90 and fk88 PR #89 merges); source verification of all three
  delivered capabilities (`styles.css` reduced-motion block plus its focused
  test; `route-artifacts.mjs` social patterns, `notFoundArtifactPath`,
  `notFoundPageMetadata`, `replaceSocialMetaTags` and
  `applyRouteDocumentMetadata`; `vite.config.ts` not-found emission;
  `assert-static-routes.mjs` wiring; the emitted-artifact F4/inventory
  text); `index.html` (global `og:`/`twitter:` home values retained on the
  root document); the renderer's shared "När tjänsten passar" aside and the
  loading-first boot chain (`SiteHomePage.tsx`, `site-content.ts`); the typed
  service entries in `src/data/siteContent.ts`; `docs/image-requests.md`
  (still four photos present, five requested absent); and the checkout
  parent plus the machine's asynkron folder (`../booking` and
  `../Asynkron.JsEngine` still absent). Owning `get_task` reads confirmed
  fk86, fk88 and fk89 closed/done with the receipts above, fk83/fk84 in
  their platform retry waits with November 1 receipts, fk63/fk64 unchanged
  since October 28, fk95 open in build at this same base, and the label
  inventory. fk97 and fk98 were created during this refresh with independent
  `get_task` read-backs confirming them open with exact labels before
  linking. Unchanged structural claims carried from the October 28–31
  reviews keep that provenance.
- One-day Faktorial API usage read on November 1 reported 37,558
  control-plane calls across 10 endpoints, led by canvas context checks
  (22,637) and task reads (14,690). Reliability caveats stand: a volatile
  one-hour span TTL against the one-day window, unknown sampling, truncated
  retained populations and unavailable revision comparability. The
  serving-process database telemetry read the same day (cumulative since the
  collector's October 30 start, about 50 hours) covered roughly 9.41 million
  calls and 8.39 million queries with 11 errors. Both populations are Cloud
  serving-process scope, not this static site, and none can be combined into
  an error rate or demand estimate.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
- Owning reads and writes made on October 31 (fk87, retained for
  provenance): `get_task` confirming fk75, fk76, fk77, fk78 and fk85
  closed/done with the receipts above, fk86 open with PR #86 unmerged (at
  that time), fk88 and fk89 open, and fk83/fk84 in their platform retry
  waits; the `964f698..ce34f3d` Git history; `index.html`,
  `scripts/route-artifacts.mjs`, F4 and the emitted-artifact inventory; the
  native queue projection; one-day API usage (82,965 calls across 9
  endpoints) and database telemetry (about 5.3 million queries over about 27
  hours with 7 errors) under the same serving-process caveats as above; and
  `create_task`/`get_task` confirming fk88 and fk89 open.
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
