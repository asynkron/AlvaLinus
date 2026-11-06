# Product and operation roadmap

Reviewed: 2026-11-06 (fk123), source baseline
`1bb124acf49820b17498d10853ac33c08598184f` (this task's prepared base, main tip
at review time). fk123's investigation snapshot had named
`823076077bd5595ea0269d4542e57820315bb171` — fk120's merge — as the tip;
before build started, preparation advanced main through the fk121, fk127 and
fk128 merges plus one operator photo commit, so this refresh reviews the
prepared `1bb124a` baseline and re-baselined the affected rows from fresh
owning reads instead of copying the older snapshot.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk113's November 3 assessment (PR #99, merge
`af2d837`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123: the previous document was read in
full and reconciled with exact merge receipts and current source. Earlier
assessments remain in Git; their ownership is reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 3 review, main advanced from `00e1ee1` to `1bb124a` (this
baseline) through fk113's own docs merge (PR #99, merge `af2d837`) and then:

- **fk114** (PR #100, merge `8a02d80`) declared the five home sections'
  eyebrows, headings, summaries and "Läs mer" labels plus the
  `SERVICE_PHOTOS` map in the typed registry (`sectionHeadings`, per-service
  `photoSrc`), completing the home surface's single-sourcing.
- **fk115** (PR #101, merge `1620bbd`) declared the shared chrome — brand
  name/logo, not-found page, breadcrumb, service hero eyebrow and aside
  heading, contact band, footer — in the registry's `chrome` section, so the
  text every page shares is declared once.
- **fk112** (PR #102, merge `8e7a8e9`) stamped each emitted subpage document
  with its own high-priority hero preload: every route now declares
  `heroPhotoAssetPath` once, the renderer's heroes read that field, and
  `routeHeroPreloadHref` in
  [route-artifacts.mjs](../scripts/route-artifacts.mjs) validates and stamps
  the emitted preload from the same declaration. The renderer-side
  `PAGE_HERO_PHOTOS` map is gone.
- **fk120** (PR #103, merge `8230760`) delivered the drainage quote
  calculator: `/draneringsberakning/` computes a preliminary total per
  löpmeter (3 500 kr/m for the first 55 meters, 3 000 kr/m above, 6 900 kr
  fixed), presents only the total to the customer — internal prices, unit
  prices and part amounts stay out of the customer view, printout and email —
  handles empty/invalid/negative input without misleading results, and offers
  print/PDF and an email handoff. VAT status is not assumed
  (`vatStatusLabel`). The Dränering service page carries a registry-declared
  calculator link band. fk120's own record acknowledges the static-client
  caveat: these values are readable in the shipped source, so truly secret
  prices cannot be kept in a static client.
- **fk121** (PR #104, merge `4294bb2`) replayed the staffing inquiry onto
  main: `/inhyrning/` (route kind `inquiry`) renders an inquiry form where
  companies request hired F-skattad help — company details, needed help,
  offered hourly rate, duration and a free description — with Swedish
  validation feedback and a mail-draft handoff to the site's contact address,
  pinned by its own test suite and documented in the feature catalog
  ([staffing-inquiry.md](features/staffing-inquiry.md)).
- **fk127** (PR #105, merge `0ed6ce0`) linked the Kalkyler menu group:
  `chrome.calcMenu` declares Dränering → `/draneringsberakning/` and Uppfart →
  `/offertberakning/#uppfart` (the hash selects the driveway calculator), and
  both desktop and mobile menus render it.
- **fk128** (PR #106, merge `a890c30`) added the Inhyrning entry to the
  header and mobile menu, derived from the same registry-driven nav lists.
- A direct operator commit (`1bb124a`, this baseline, 2026-11-04) replaced the
  generated placeholders for Stensättning, Markarbete and Grävjobb with the
  selected canvas photographs; [image-requests.md](image-requests.md) records
  the canvas-attachment provenance.

The visitor-facing baseline is now a complete self-service surface: two quote
calculators (a driveway calculator with husdränering/uppfart choice on
`/offertberakning/` and the dedicated drainage calculator), a staffing inquiry
flow, per-route Swedish head and social metadata, the unknown-path recovery
artifact, reduced-motion scrolling, per-route hero preloads and photo-failure
resilience, per-service guidance and detail depth, registry-declared home
sections and shared chrome, a landmark-complete page structure and an
immediate-ready first paint. What remains inside the delivered surface is
registry single-sourcing of the quote pages' copy and the quote pages'
structural duplication (fk134/fk135 below) — not new visitor capability.

Later-context notes recorded once, both in flight in their own worktrees at
this same base:

- [fk122](https://app.faktorial.ai/projects/alvalinus/tasks/fk122) — the
  November 4 Persistent Frontend Optimization child, in build — owns
  converting the `/offertberakning/` hero from the 3.44 MB full-size
  `quote-hero.png` (the largest deployed asset) to responsive WebP variants,
  moving the registry `heroPhotoAssetPath`, the rendered `img` and the emitted
  preload together.
- [fk133](https://app.faktorial.ai/projects/alvalinus/tasks/fk133) — the
  November 5 Persistent Feature Refinement child, in build — owns adding the
  quote-calculator feature to docs/features and refreshing F1–F4 against this
  source; the two quote routes are the only active routes outside the
  cataloged feature set
  ([route inventory](current-public-route-inventory.md) follow-up note).

### What works well

- The typed route/service registry is now the declaration source for nearly
  every page-level Swedish text: per-route `<title>`/description and social
  card values, navigation labels, service summaries, tags, guidance and
  detail, the five home sections' copy and service photos (fk114), the shared
  chrome including the Kalkyler group (fk115/fk127), and each route's hero
  photo path (fk112) — all validated against built output at build time
  without client-side work. The remaining renderer-side Swedish text is the
  quote pages plus a small leftover-chrome set, dispositioned below.
- The delivered interactive surface is real product capability: both quote
  calculators honor fk120's constraints (preliminary totals only, hidden
  internal prices, no assumed VAT status, safe invalid-input handling, print
  and email handoff), and the staffing inquiry validates required fields in
  Swedish and hands a complete mail draft to the visitor's own email program.
- Existing DOM tests cover the delivered behavior:
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx) pins route and
  content structure, chrome, keyboard coverage and the registry-owned hero
  map; [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) and
  [DrainageQuotePage.test.tsx](../src/pages/DrainageQuotePage.test.tsx) pin
  both calculators; [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx)
  pins the staffing inquiry; the route-emission plugin and its per-subpage
  preload stamping are covered by deterministic in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs); the
  reduced-motion override has its own focused stylesheet test. This refresh
  inspected source and owning records; it did not execute those tests.
- Navigation exposes the whole surface from one declaration source: the
  header's page routes, the Tjänster service group, the Kalkyler disclosure
  group, the Inhyrning entry and the footer's full page list all derive from
  the registry, and the
  [route inventory](current-public-route-inventory.md) (checked 2026-11-04)
  matches the twelve-route registry.
- Unknown paths still have a deployable recovery artifact (`dist/404.html`
  carries the same SPA document with not-found metadata); whether the
  eventual production host serves it stays a host decision.
- Image handling is layered: heroes preload at high priority per emitted
  document (fk112), above-the-fold heroes request eagerly while cards stay
  lazy, service cards try the route SVG after photo failure, failing heroes
  hide themselves, and reduced-motion visitors get instant anchor scrolling.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one
  Vitest session. Process exit remains the gate authority.
- The autonomous factory keeps shipping through reviewed, merge-receipted
  tasks: this is the ninth consecutive roadmap refresh, each reconciling the
  previous one against owning records before linking new work — and this
  refresh also received operator-delivered capability (fk120/fk121/fk127/
  fk128, PRs #103–#106) between its own investigate and build stages without
  agent-created duplication.

### What works less well and what to improve

- Renderer-side Swedish copy on the quote pages is now the main
  single-sourcing debt. Every heading, help text, error message, disclaimer,
  aria-label and mailto template on
  [QuotePage.tsx](../src/pages/QuotePage.tsx) and
  [DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx) is hardcoded in
  the renderer; [quote.ts](../src/lib/quote.ts) owns only the two total
  formulas and the VAT status label.
  [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134) owns
  declaring this copy in the typed registry, including the leftover
  shared-chrome strings in
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx): the skip link "Hoppa till
  innehåll" (line 74), the desktop and mobile nav `aria-label`s "Huvud-
  navigation"/"Mobilnavigation" (lines 126/~201), the mobile menu toggle
  labels "Stäng meny"/"Öppna meny" (line 190), the empty-services guard
  title/message (line 319) and the two Suspense fallbacks (lines 377/384, the
  second added with fk121).
- The two quote pages also duplicate their structure: identical result-aside
  captions and disclaimer, mail help, send/print buttons, reset pattern,
  validation-error presentation, page scaffolding and mailto composition, so
  a copy or template fix must be made twice and can drift silently.
  [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135) owns
  consolidating that structure into shared components, sequenced after
  fk134 because both edit the same two files.
- The two quote-calculator routes remain outside the feature catalog: the
  [route inventory](current-public-route-inventory.md) states both interactive
  calculators are outside the cataloged feature set while the ten non-quote
  routes are mapped. The in-flight fk133 investigation owns adding that
  feature and refreshing F1–F4 against this source; this refresh records it
  as owned there rather than creating duplicate roadmap work.
- Photography remains partially editorial: the three delivered canvas
  photographs (Stensättning, Markarbete, Grävjobb, November 4) sit beside
  still-outstanding requests — a real Trädgårdsplanering photo (the
  AI-generated `tradgard-generated.webp` remains), the About and Contact
  heroes (both declared `heroPhotoAssetPath` values point at files that are
  absent, so those pages fall back to the plain navy hero) and an optional
  Inhyrning photo upgrade ([image requests](image-requests.md), refreshed
  2026-11-04). Acquisition and approval stay editorial work, distinct from
  delivered image-failure resilience.
- fk120's static-client caveat stands: the calculators' internal prices and
  formulas are readable in the shipped source; truly secret prices cannot be
  kept in a static client, so the totals stay estimates pending a real quote.
- Production host, publication access and artifact retention are unestablished.
  A runbook and checksum tools cannot demonstrate rollback or recovery time,
  and whether the host serves `404.html` at unknown paths is unobserved.
- Inquiry conversion, delivery and satisfaction are unmeasured. Telemetry,
  persistence or submission-service proposals need explicit product and
  privacy decisions before changing the static boundary.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, on
November 2 during fk105's refresh, on November 3 during fk113's refresh, and
again on November 6 during this fk123 refresh. The checkout advanced from
fk113's `00e1ee1` baseline to `1bb124a` (this baseline): fk113's own docs
merge (PR #99, merge `af2d837`), then the fk114, fk115, fk112 and fk120
merges in that order (PRs #100–#103, ending at fk123's investigate-referenced
`8230760`), then the fk121, fk127 and fk128 merges (PRs #104–#106) and the
operator photo commit `1bb124a` — the last four arrived between fk123's
investigation snapshot and this build's prepared base, so their rows below
were re-baselined from fresh owning reads rather than copied from investigate
facts. fk113, fk114, fk115, fk112, fk120, fk121, fk127 and fk128 are all
closed/done with merge receipts and passed native quality runs (receipts
below). During the November 6 owning reads, the authenticated open-task list
returned exactly fk123 (this task), fk122 and fk133 (both in build);
fk120, fk121, fk127 and fk128's owning records showed stage done with merge
receipts while their issue-level fields still carried open-state snapshots
with unset closed-at timestamps — the same stale-projection artifact earlier
refreshes recorded for closed records — and the open inventory excludes all
four.

| Work | Current owning evidence | Disposition |
| --- | --- | --- |
| [fk54](https://app.faktorial.ai/projects/alvalinus/tasks/fk54), previous roadmap | Closed/done; PR #71, merge `9a2b82e`. Document read in full. | Superseded assessment; its Next 1/Next 2 shipped as fk55/fk56. Its "fk53 unresolved mobile-menu" reservation is resolved by fk53's actual delivery. |
| [fk55](https://app.faktorial.ai/projects/alvalinus/tasks/fk55), availability isolation | Closed/done; PR #72, merge `a9e7bb2`; retained native quality pass at head `0c3464e`. Verified in source: `routeDependsOnServices` gates only home and the services index. | Delivered. No duplicate availability work. |
| [fk56](https://app.faktorial.ai/projects/alvalinus/tasks/fk56), inquiry context | Closed/done; PR #73, merge `eaa1138`; retained native quality pass at head `17713ab`. Verified in source: `inquiry-service.ts` and `App.tsx` wiring. | Delivered. F3 documents the behavior; no duplicate context work. |
| [fk53](https://app.faktorial.ai/projects/alvalinus/tasks/fk53), accessible service-link names | Closed/done; PR #74, merge `8c9af38`; retained native quality pass at head `917d296`. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk54's "unresolved mobile-menu ownership" description was inaccurate; no menu work is reserved on fk53's behalf. |
| [fk60](https://app.faktorial.ai/projects/alvalinus/tasks/fk60), catalog reconciliation | Closed/done; PR #75, merge `82da699`; retained native quality pass. | Current F3/F4 documentation at that baseline; supersedes stale-gap descriptions. |
| [fk65](https://app.faktorial.ai/projects/alvalinus/tasks/fk65), hero fetch priority | Closed/done; PR #76, merge `0eb2a37`; retained native quality pass. Verified in source: heroes carry high fetch priority without lazy loading; `ServiceCardImage` stays lazy. | Delivered. Mapped once through F4-US1; F1/F4 prose and the route inventory record the priority split. |
| [fk67](https://app.faktorial.ai/projects/alvalinus/tasks/fk67), home hero photo failure resilience | Closed/done; PR #78, merge `7c11aa4`; retained native quality pass. Verified in source: `Hero` hides the photo on error and F4-US1 maps both hero declarations. | Delivered. F4's state table and the route inventory describe the behavior; fk66's former Next 1 gap is closed. |
| [fk68](https://app.faktorial.ai/projects/alvalinus/tasks/fk68), navigation consolidation | Closed/done; PR #79, merge `7427cff`; retained native quality pass. Verified in source: `PAGE_NAV`/`SERVICE_NAV` filter `siteContent.routes`; header, mobile menu and footer render from them. | Delivered. F4 and the catalog README describe the single declaration source; fk66's former Next 2 gap is closed. The fk127/fk128 menu additions extend the same derived lists. |
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
| [fk96](https://app.faktorial.ai/projects/alvalinus/tasks/fk96), previous roadmap | Closed/done; PR #91, merge `982c850`. Document read in full during fk105's refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk97/fk98, and its in-flight fk95 reservation is delivered. |
| [fk95](https://app.faktorial.ai/projects/alvalinus/tasks/fk95), home-hero preload | Closed/done; PR #92, merge `216eacf`; quality 137/137 at head `3948fae`. Verified in source at the f46ebcc baseline: [index.html](../index.html) preloads the hero photo with `fetchpriority="high"`; the emission strips that link from the eight subpage documents and `dist/404.html` and requires it on the root document. Its scheduling projection reports `record_state=missing` while the owning record is closed/done. | Delivered. fk96's "open parallel frontend work" description is retired; fk112's per-subpage stamping below superseded the single-root-only split. |
| [fk97](https://app.faktorial.ai/projects/alvalinus/tasks/fk97), per-service guidance | Closed/done; PR #93, merge `7739c7d`; quality 137/137 at head `2b89fe1`. Verified in source: `ServiceArea.guidance` is required ([types/site.ts](../src/types/site.ts)), five registry declarations exist, and the aside renders `{service.guidance}`; the shared template sentence is gone. | Delivered. The former "same aside five times" gap is retired; the Dränering leftover shipped as fk106, below. |
| [fk98](https://app.faktorial.ai/projects/alvalinus/tasks/fk98), first-paint ready boot | Closed/done; PR #94, merge `f46ebcc`; quality 138/138 at head `43c23ff`. Verified in source at the f46ebcc baseline: the default state is `initialState ?? { status: "ready", content: siteContent }`, and the renderer no longer calls the loader. | Delivered. The former "skeleton paints first" gap is retired; the dead contract remainder shipped as fk107, below. |
| [fk104](https://app.faktorial.ai/projects/alvalinus/tasks/fk104), landmark restoration | Closed/done; PR #95, merge `c286f5b`; quality 138/138 at head `064b28b`. Verified in source at this baseline: the skip link, sticky `<header>` banner and root `<footer>` contentinfo are siblings around the content `<main>` element ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), preserving both landmark roles against main-descendant suppression. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Delivered. fk105's "in-flight automation child" description is retired; no landmark work remains. |
| [fk105](https://app.faktorial.ai/projects/alvalinus/tasks/fk105), previous roadmap | Closed/done; PR #96, merge `9ce4989`. Document read in full during fk113's refresh. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Superseded assessment; its Next 1/Next 2 shipped as fk106/fk107 below, and its in-flight fk104 reservation is delivered. |
| [fk106](https://app.faktorial.ai/projects/alvalinus/tasks/fk106), registry-declared service detail | Closed/done; PR #97, merge `24a140b`; quality 138/138 at head `5f87a15`. Verified in source at this baseline: the optional `detail` field on `ServiceArea` ([types/site.ts](../src/types/site.ts)), the Dränering paragraph declared on its registry entry ([siteContent.ts](../src/data/siteContent.ts)), and the generic `{service.detail ? …}` rendering in the same slot — no `service.id === "dranering"` conditional remains. | Delivered. The former "last renderer-side service conditional" gap is retired. |
| [fk107](https://app.faktorial.ai/projects/alvalinus/tasks/fk107), dead content-loading contract retirement | Closed/done; PR #98, merge `00e1ee1` (fk113's baseline); quality 134/134 at head `9e416cb`. Verified in source at this baseline: `src/lib/site-content.ts` is absent, no `loadSiteContent` reference remains in `src/` or `scripts/`, the renderer's state surface carries only the ready and empty-services contracts. | Delivered. The former "dead content-loading contracts" gap is retired. |
| [fk113](https://app.faktorial.ai/projects/alvalinus/tasks/fk113), previous roadmap | Closed/done; PR #99, merge `af2d837`. Document read in full during this refresh. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Superseded assessment; its Next 1/Next 2 shipped as fk114/fk115 below, and its in-flight fk112 reservation is delivered. Its quote-page copy and duplication observations carry forward as fk134/fk135. |
| [fk114](https://app.faktorial.ai/projects/alvalinus/tasks/fk114), registry-declared home-section copy | Closed/done; PR #100, merge `8a02d80`; native quality pass at head `e7cea44`. Verified in source at this baseline: `sectionHeadings` declares the five sections' eyebrows, headings, summaries and "Läs mer" label plus aria prefix, and services carry `photoSrc` ([siteContent.ts](../src/data/siteContent.ts)); the renderer renders registry fields with no section copy conditionals. | Delivered. The former "renderer-side home-section copy and SERVICE_PHOTOS map" gap is retired. |
| [fk115](https://app.faktorial.ai/projects/alvalinus/tasks/fk115), registry-declared shared chrome strings | Closed/done; PR #101, merge `1620bbd`; native quality pass at head `35d5541`. Verified in source at this baseline: the `chrome` section declares brand, not-found (with `{path}` template), breadcrumb, contact band, footer and service strings ([siteContent.ts](../src/data/siteContent.ts)); Header, Footer, NotFound, PageHero, ServicePage and ContactLinkBand consume them. | Delivered. The former "renderer-side shared chrome" gap is retired, except the small leftover set fk134 owns below. |
| [fk112](https://app.faktorial.ai/projects/alvalinus/tasks/fk112), per-subpage hero preloads | Closed/done; PR #102, merge `8e7a8e9`; native quality pass at head `5a3083a` (conflict-resolution run). Verified in source at this baseline: every route declares `heroPhotoAssetPath` ([types/site.ts](../src/types/site.ts)), heroes render from it ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), and `routeHeroPreloadHref` validates and stamps each emitted subpage document's high-priority preload from the same field ([route-artifacts.mjs](../scripts/route-artifacts.mjs)); the renderer-side `PAGE_HERO_PHOTOS` map is gone. Its scheduling projection reports `record_state=missing` while the owning record is closed/done. | Delivered. fk113's "in-flight automation child" description is retired; fk122's quote-hero WebP conversion is the remaining hero-asset work and is fk122's. |
| [fk120](https://app.faktorial.ai/projects/alvalinus/tasks/fk120), drainage quote calculator | Closed/done; PR #103, merge `8230760` (fk123's investigate-referenced baseline); native quality pass at head `dbe5498`. Verified in source at this baseline: `/draneringsberakning/` renders the per-meter drainage calculator ([DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx)), `drainageTotal` encodes the 3 500/3 000 kr tiers plus 6 900 kr fixed ([quote.ts](../src/lib/quote.ts)), the Dränering service page carries the registry-declared calculator link band, and the customer view, printout and email show only the preliminary total. The record's issue-level projection still carried an open-state snapshot with unset closed-at at build's read time; the open inventory excludes it. | Delivered by operator-authored work. fk113's renderer-side observations about the quote pages carry forward as fk134/fk135; fk122 owns the quote-hero asset conversion. |
| [fk121](https://app.faktorial.ai/projects/alvalinus/tasks/fk121), staffing inquiry page | Closed/done; PR #104, merge `4294bb2`; native quality pass at head `7b3ca1a` (conflict-resolution run). Verified in source at this baseline: `/inhyrning/` (route kind `inquiry`) renders the inquiry form with Swedish validation and mail-draft handoff ([InquiryPage.tsx](../src/pages/InquiryPage.tsx)), pinned by [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) and documented in [staffing-inquiry.md](features/staffing-inquiry.md) (reviewed 2026-11-04). The record's issue-level projection still carried an open-state snapshot at build's read time; the open inventory excludes it. | Delivered by operator-authored work; replayed onto main together with the drainage quote and route-registry conflict resolution. |
| [fk127](https://app.faktorial.ai/projects/alvalinus/tasks/fk127), Kalkyler menu links | Closed/done; PR #105, merge `0ed6ce0`; native quality pass at head `7d8cfa9`. Verified in source at this baseline: `chrome.calcMenu` declares the Kalkyler group — Dränering → `/draneringsberakning/`, Uppfart → `/offertberakning/#uppfart` ([siteContent.ts](../src/data/siteContent.ts)) — and desktop and mobile menus render it. The record's issue-level projection still carried an open-state snapshot at build's read time. | Delivered by operator-authored work. |
| [fk128](https://app.faktorial.ai/projects/alvalinus/tasks/fk128), Inhyrning menu entry | Closed/done; PR #106, merge `a890c30`; native quality pass at head `2864f86`. Verified in source at this baseline: the header and mobile menu include the Inhyrning route through the registry-derived nav lists ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)). The record's issue-level projection still carried an open-state snapshot at build's read time. | Delivered by operator-authored work. |
| Operator photo selection (commit `1bb124a`, this baseline) | No owning task record; a direct operator-authored commit on main (2026-11-04): selected canvas photographs replace the generated placeholders for Stensättning, Markarbete and Grävjobb cards and page heroes; [image-requests.md](image-requests.md) records the canvas-attachment provenance and retires the Grävjobb request. | Delivered. Editorial photography landed outside the task machinery; recorded once here so no agent recreates it. |
| [fk122](https://app.faktorial.ai/projects/alvalinus/tasks/fk122), automation child (2026-11-04) | Open; the November 4 Persistent Frontend Optimization child, in build in its own worktree at this same base. Its investigation owns converting the `/offertberakning/` hero from the 3.44 MB `quote-hero.png` to responsive WebP variants, moving the registry `heroPhotoAssetPath`, the rendered `img` and the emitted preload together. | In-flight, owned by fk122. Recorded once here; not duplicated as roadmap work; fk134/fk135 sequence or rebase around it. |
| [fk133](https://app.faktorial.ai/projects/alvalinus/tasks/fk133), automation child (2026-11-05) | Open; the November 5 Persistent Feature Refinement child, in build in its own worktree at this same base. Its standing mandate owns reconciling docs/features against the actual routes, including adding the uncataloged quote calculators. | In-flight, owned by fk133. The quote-route catalog gap is fk133's; no duplicate roadmap work. |
| [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134), registry-declared quote-page copy | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below; sequenced before fk135. |
| [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135), quote-page structure consolidation | Open; created during this refresh and read back open with labels `priority: medium` and `size:medium`; carries a depends_on relation to fk134. | Open next step, linked from the short-term section below; rebases onto fk134's delivered state. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh, and no row above
was reopened or recreated by this refresh: fk3/fk24/fk35 (roadmaps), fk10
(reporter), fk11 (runbook), fk5/fk23/fk34 (mobile), fk8 (dependencies),
fk25/fk26 (image/registry recovery), fk32 (catalog), fk36/fk37 (route
validation/checksums), fk43/fk44 (mobile/roadmap), fk45/fk46 (skip link/email
explanation) and fk51 (catalog) remain closed/done. fk9's closed-with-build
lifecycle note stands. Per-head quality receipts (90/92/103/109/110/120 passing
at the fk55/fk53/fk56/fk75/fk78/fk77 heads, 123/128/131 at the fk86/fk89/fk88
heads, 137/137/138 at the fk95/fk97/fk98 heads, 138/138/134 at the fk104/
fk106/fk107 heads, and the passed runs at the fk114/fk115/fk112/fk120/fk121/
fk127/fk128 heads above) are historical, not current totals, and no acceptance
is claimed for this roadmap candidate, current main or any deployment.

Factory-loop friction is platform-owned and recorded here so no agent recreates
it as site work. The November 3 block is **resolved**: the operator answered
both escalated questions with "close this" on 2026-11-04 —
[fk103](https://app.faktorial.ai/projects/alvalinus/tasks/fk103) (fk83's close
question) and [fk64](https://app.faktorial.ai/projects/alvalinus/tasks/fk64)
(fk63's live-chat question) closed at 12:42Z, [fk63](https://app.faktorial.ai/
projects/alvalinus/tasks/fk63) followed at 12:46:40Z, the [fk84](https://
app.faktorial.ai/projects/alvalinus/tasks/fk84) incident at 12:46:48Z and
[fk83](https://app.faktorial.ai/projects/alvalinus/tasks/fk83) at 12:49:58Z.
fk83 closed through the manual-close option, so the missing automation-run
parent record (`automation-run:local:feature-refinement:1793366910953132005`)
was never repaired platform-side. No recurrence has been observed:
fk133's November 5 occurrence runs with a fresh parent key
(`automation-run:local:feature-refinement:1793883207221442816`). All receipts
above come from fresh November 6 owning reads; no duplicate record is created
for any of them.

## Short-term priorities and issue ownership

fk113's two short-term priorities both shipped with passed native quality
runs: **Next 1** delivered the registry-declared home-section copy as
[fk114](https://app.faktorial.ai/projects/alvalinus/tasks/fk114) (PR #100,
merge `8a02d80`) and **Next 2** the shared chrome strings as
[fk115](https://app.faktorial.ai/projects/alvalinus/tasks/fk115) (PR #101,
merge `1620bbd`); fk112's in-flight hero-preload candidate also merged
(PR #102, merge `8e7a8e9`), closing what fk113 recorded as in flight.
Operator-delivered work added the drainage quote calculator (fk120, PR #103),
the staffing inquiry (fk121, PR #104) and the Kalkyler/Inhyrning navigation
(fk127/fk128, PRs #105/#106). Their ownership rows above carry the verified
source facts.

This refresh creates two new issues, grounded in the renderer scan at this
`1bb124a` baseline and verified open by owning read-backs before linking
(fk134 read back open 2026-11-06 13:15:46Z and fk135 at 13:16:10Z, both with
labels `priority: medium` and `size:medium`; fk135 carries a depends_on
relation to fk134):

1. [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134) —
   declare the quote-page Swedish copy in the typed registry: move both
   calculators' headings, help texts, errors, disclaimers, aria-labels and
   mailto templates out of the renderer, plus the leftover shared-chrome
   strings (skip link, nav aria-labels, menu toggle labels, empty-services
   guard, both Suspense fallbacks), so the route/service registry stays the
   single Swedish declaration source for the whole delivered surface.
2. [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135) —
   consolidate the duplicated quote-page structure into shared components:
   one result-aside, page scaffolding, notes/reset pattern and mailto
   composition owned once, with each calculator declaring only its distinct
   content. fk135 lands after fk134 because both edit the same two page
   files.

Remaining candidates were judged and dispositioned above: the quote-route
feature-catalog gap is in-flight fk133's; the missing photographs stay
editorial ([docs/image-requests.md](image-requests.md), refreshed 2026-11-04:
a real Trädgårdsplanering photo, About and Contact heroes, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still await
explicit operator decisions. fk122's in-flight child is recorded once in the
ownership table and is not duplicated here; fk134/fk135 deliberately exclude
its quote-hero asset scope.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 refresh chain shows the working
   loop: reconcile, ship, re-verify, retire. Separate source delivery, task
   closure and acceptance; missing evidence stays unknown. This refresh also
   demonstrated the loop absorbing operator-delivered capability (fk120/
   fk121/fk127/fk128) and a resolved platform incident (the November 4
   operator closes above) without agent-created duplication: platform-side
   friction is reported with owning references instead of being absorbed into
   site work.
2. **Repeatable product operation.** Use the delivered checksum commands and
   release runbook when actual hosting/access/retention facts are available.
   Target releases traceable to accepted source and restorable prior
   artifacts. Consider host-specific automation only after those facts and
   explicit access decisions; do not add speculative infrastructure.
3. **Resilient customer journeys.** Availability isolation, inquiry context,
   hero failure resilience and per-route preloads, navigation consistency,
   keyboard coverage, per-route head and social metadata, the unknown-path
   recovery artifact, reduced-motion scrolling, the contact focus ring,
   landmark-complete page structure, per-service guidance and detail depth,
   the first-paint ready boot, registry-declared home sections and shared
   chrome, and the quote-calculator and staffing-inquiry self-service surface
   are delivered. The remaining visitor-visible work is fk134/fk135's
   registry single-sourcing and structural consolidation on the quote pages,
   the in-flight fk122 (quote-hero bytes) and fk133 (catalog) candidates, and
   approved missing imagery. Define useful inquiry signals and privacy needs
   before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 6, this checkout's
   parent holds only the fk122/fk123/fk133 worktrees. Transfer demonstrated
   practices with explicit owners. The autonomous factory operates around
   this static product; it is not an application backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 6 during this fk123 refresh: the previous roadmap in
  full (fk113's revision, whose committed base text is the `00e1ee1` review);
  the `af2d837..1bb124a` Git history (fk114 PR #100 merge `8a02d80`, fk115
  PR #101 merge `1620bbd`, fk112 PR #102 merge `8e7a8e9`, fk120 PR #103 merge
  `8230760`, fk121 PR #104 merge `4294bb2`, fk127 PR #105 merge `0ed6ce0`,
  fk128 PR #106 merge `a890c30`, then the operator commit `1bb124a`); source
  verification at this HEAD: the twelve-route registry including both
  `quote` routes and the `inquiry` route, the `sectionHeadings` and `chrome`
  declarations with `calcMenu`, the renderer's remaining hardcoded Swedish
  strings (skip link line 74, nav aria-labels, menu toggle labels, the
  empty-services guard line 319, both Suspense fallbacks lines 377/384), the
  quote pages' renderer-side copy and duplicated structure,
  [quote.ts](../src/lib/quote.ts) owning only formulas and the VAT label,
  `routeHeroPreloadHref` and the `heroPhotoAssetPath` validation in
  [route-artifacts.mjs](../scripts/route-artifacts.mjs) with no
  `PAGE_HERO_PHOTOS` map left, a fresh `public/page-visuals` listing
  (quote-hero.png still the quote route's hero, the three delivered canvas
  photos in three widths, tradgard-generated and services-hero illustrations,
  no about-hero.webp/contact-hero.webp files),
  [current-public-route-inventory.md](current-public-route-inventory.md)
  (checked 2026-11-04, twelve routes, stating both quote calculators are
  outside the cataloged feature set), and
  [docs/features/features.json](features/features.json) (five features
  covering the ten non-quote routes, staffing-inquiry reviewed 2026-11-04).
  Owning `get_task` reads confirmed fk113 closed/done (PR #99, merge
  `af2d837`), fk114 closed/done (PR #100, merge `8a02d80`; quality pass at
  head `e7cea44`), fk115 closed/done (PR #101, merge `1620bbd`; quality pass
  at head `35d5541`), fk112 closed/done (PR #102, merge `8e7a8e9`; quality
  pass at head `5a3083a`), fk120 closed/done (PR #103, merge `8230760`;
  quality pass at head `dbe5498`), fk121 closed/done (PR #104, merge
  `4294bb2`; quality pass at head `7b3ca1a`), fk127 closed/done (PR #105,
  merge `0ed6ce0`; quality pass at head `7d8cfa9`) and fk128 closed/done
  (PR #106, merge `a890c30`; quality pass at head `2864f86`); fk63, fk64,
  fk83, fk84 and fk103 closed on 2026-11-04 (12:42:01Z, 12:42:07Z,
  12:46:40Z, 12:46:48Z, 12:49:58Z) after the operator's "close this" answers;
  and fk122/fk133 open in build. An authenticated open-task list read
  returned exactly fk123, fk122 and fk133. fk134 and fk135 were created
  during this refresh with independent `get_task` read-backs confirming them
  open with exact labels before linking. The checkout parent holds only the
  fk122/fk123/fk133 worktrees; `../booking` and `../Asynkron.JsEngine` are
  absent. Unchanged structural claims carried from the October 28–November 3
  reviews keep that provenance.
- One-day Faktorial API usage read on November 6 (13:11Z) reported 104,576
  control-plane calls across 13 endpoints, led by canvas context checks
  (85,255) and task reads (19,012). The same caveats as previous refreshes
  stand and this read is again thinner than its window: the volatile
  one-hour in-memory retention covered only 13:08:26Z–13:11:33Z against the
  one-day request, the sampling state is unknown, 334 of 415 retained spans
  did not join to a durable route identity, the retained population was
  truncated by a store cap, and revision comparability is unavailable.
- The serving-process database telemetry read the same day covered a fresh
  collector: the serving process started at 12:39:06Z on November 6, so its
  cumulative counters span only about 32 minutes at the 13:11Z read — about
  74,200 calls and 59,400 queries with 2 errors, led by credential-identity
  reads (13,226 calls) and the scheduling/command revision reads (7,453 calls
  each). That window is far shorter than any earlier refresh's read, and
  cumulative counters are not comparable across collector resets. Both
  populations are Cloud serving-process scope, not this static site, and
  none can be combined into an error rate or demand estimate.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
- Owning reads and writes made on November 3 (fk113, retained for
  provenance): `get_task` confirming fk104, fk105, fk106 and fk107
  closed/done with receipts, fk112 open in flight (at that time), fk83 open
  on its human wait with the fk103 question unanswered, fk84 open
  issue-waiting on fk83's completion, and fk63/fk64 unchanged since
  October 28; `create_task`/`get_task` confirming fk114 and fk115 open; the
  `f46ebcc..00e1ee1` Git history; source verification of the three delivered
  capabilities at that baseline; a bounded renderer scan naming the remaining
  section-copy and chrome strings; a fresh `public/page-visuals` listing
  (four WebP photos present, five requested absent); the checkout parent
  (only the fk112/fk113 worktrees); and the November 3 API usage and database
  telemetry reads under the same serving-process caveats.
- Owning reads and writes made on November 2 (fk105, retained for
  provenance): `get_task` confirming fk95, fk97 and fk98 closed/done with
  receipts, fk83 open on a human wait with the fk103 question unanswered,
  fk84 open issue-waiting on fk83's completion, fk63/fk64 unchanged since
  October 28, and fk104 open in flight (at that time); the
  `ee4d635..f46ebcc` Git history after fetching origin; source verification
  of the three f46ebcc-baseline capabilities; a fresh `public/page-visuals`
  listing; the checkout parent (then only the fk104/fk105 worktrees);
  `create_task`/`get_task` confirming fk106 and fk107 open; and the
  October 31–November 2 API usage and database telemetry reads under the
  same serving-process caveats.
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
