# Product and operation roadmap

Reviewed: 2026-11-07 (fk153), source baseline
`7d1b3dc324321e68c4d5002369faf11b1c875254` (this task's prepared base, main tip
at review time). The investigation snapshot had named `e3a4eef` — fk144's
merge — as the prepared base; fk135's merge (`718f19e`, PR #112) and fk149's
merge (`7d1b3dc`, PR #113, the tip) landed on main after that snapshot, and
preparation advanced this task's base to the `7d1b3dc` tip before build, so
this refresh reviews the current tip directly instead of re-baselining
affected rows from a fetched-history delta.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk123's November 6 assessment (PR #108, merge
`45105f4`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153: the previous document was
read in full and reconciled with exact merge receipts and current source.
Earlier assessments remain in Git; their ownership is reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 6 review, main advanced from `1bb124a` to `7d1b3dc` (this
baseline) through six merges:

- **fk122** (PR #107, merge `b4afea0`) converted the `/offertberakning/` hero
  from the 3.44 MB full-size `quote-hero.png` — the largest deployed asset —
  to responsive WebP variants (640w/960w/full), moving the registry
  `heroPhotoAssetPath`, the rendered `img` and the emitted high-priority
  preload together; the PNG is gone from the deployment and the full-width
  hero carries ~89% fewer bytes.
- **fk133** (PR #109, merge `4050621`) cataloged both quote calculators as
  feature F6 with five source-evidenced stories, refreshed F1/F4 against the
  current registry, and aligned the
  [route inventory](current-public-route-inventory.md): the calculators are
  no longer described as outside the cataloged feature set.
- **fk140** (PR #110, merge `7d78282`) declared both quote calculators'
  Swedish copy in the typed registry (`content.quote.shared/.uppfart/
  .drainage`, mailto drafts filled through `{area} {loads} {asphalt} {total}
  {vat} {notes}` / `{length} {total} {vat} {notes}` placeholders), with both
  quote test files deriving their pinned strings from the registry.
- **fk144** (PR #111, merge `e3a4eef`) moved the last eight renderer-side
  shared-chrome strings — skip link, desktop/mobile nav aria-labels, menu
  toggle labels, empty-services guard and both lazy-route fallbacks — into
  the registry's chrome section.
- **fk135** (PR #112, merge `718f19e`) consolidated the duplicated quote-page
  structure into [QuotePageShared.tsx](../src/components/QuotePageShared.tsx):
  one result-aside, page shell, notes field, reset button and shared mailto
  composition; each page keeps only its distinct calculator logic and copy.
- **fk149** (PR #113, merge `7d1b3dc`, this baseline) refreshed the lockfile
  within the declared caret ranges (eight packages, lockfile-only diff) and
  documented every major-version jump as deliberately deferred.

The visitor-facing baseline is now a complete self-service surface whose
Swedish text is declared in the typed registry on every delivered surface
except one. What remains inside the delivered surface is the staffing-inquiry
page's renderer-side copy (fk154 below), the missing dedicated unit test for
the quote money logic (fk155 below) and the declared but undelivered About
and Contact hero photography — not new visitor capability.

Two automation children are in flight in their own worktrees at this same
base, recorded once here and owned by their own records:

- [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151) — the
  November 7 Persistent Frontend Optimization child — owns the WCAG AA
  contrast repair of the brand accent (a darkened light-surface primary, a
  lighter dark-surface accent token, reclassified dark-surface usages and a
  deterministic contrast test). Its build delivered commit `283488f` and
  PR #114 is in review at this refresh's owning read.
- [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152) — the
  November 7 Persistent Feature Refinement child, in build — owns the
  docs/features review-stamp refresh after fk140/fk144's registry moves;
  today's feature-catalog refinement is fk152's, not a roadmap scope.

### What works well

- The typed route/service registry is now the declaration source for every
  page-level Swedish text except the inquiry page: per-route
  `<title>`/description and social card values, navigation labels, service
  summaries, tags, guidance and detail, the five home sections' copy and
  service photos (fk114), the shared chrome including the Kalkyler group
  (fk115/fk127/fk144), each route's hero photo path (fk112/fk122) and both
  quote calculators' full copy including their mailto templates (fk140) —
  all validated against built output at build time without client-side work.
  [InquiryPage.tsx](../src/pages/InquiryPage.tsx) is the last renderer-side
  Swedish surface in `src/`.
- The quote pages' structure is owned once: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx)
  (fk135) owns the result-aside, page shell, notes field, reset button and
  mailto composition, so a caption or template fix lands in one file while
  each page keeps its distinct calculator logic.
- The delivered interactive surface is real product capability: both quote
  calculators honor fk120's constraints (preliminary totals only, hidden
  internal prices, no assumed VAT status, safe invalid-input handling, print
  and email handoff), and the staffing inquiry validates required fields in
  Swedish and hands a complete mail draft to the visitor's own email program.
- Existing DOM tests cover the delivered behavior:
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx) pins route and
  content structure, chrome and the registry-owned hero map;
  [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) and
  [DrainageQuotePage.test.tsx](../src/pages/DrainageQuotePage.test.tsx) pin
  both calculators with registry-derived pins;
  [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) pins the staffing
  inquiry; the route-emission plugin and its per-subpage preload stamping are
  covered by deterministic in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs); the
  reduced-motion override has its own focused stylesheet test. This refresh
  inspected source and owning records; it did not execute those tests.
- The feature catalog covers the whole route surface: six features F1–F6
  with the quote calculators documented as F6 (fk133), all three canonical
  manifests natively valid at fk133's head `8af176d`, and the
  [route inventory](current-public-route-inventory.md) (checked 2026-11-04)
  matching the twelve-route registry with no uncataloged-calculator note left.
- Image handling is layered: heroes preload at high priority per emitted
  document (fk112), above-the-fold heroes request eagerly while cards stay
  lazy, the quote hero serves responsive WebP variants (fk122), service cards
  try the route SVG after photo failure, failing heroes hide themselves, and
  reduced-motion visitors get instant anchor scrolling.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift (`npm outdated` wanted == current after
  its refresh), every major-version jump is deferred with a recorded reason,
  and the vitest 5 migration carries its own follow-up prompt on fk149's
  record.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one
  Vitest session. Process exit remains the gate authority.
- The autonomous factory keeps shipping through reviewed, merge-receipted
  tasks: this is the tenth consecutive roadmap refresh, each reconciling the
  previous one against owning records before linking new work. The loop also
  absorbed a stalled delivery without losing work: fk134's partially staged
  worktree branch was salvaged into plan fk139, whose children fk140/fk144
  delivered the scope (see the reconciliation table).

### What works less well and what to improve

- Renderer-side Swedish copy on the staffing-inquiry page is now the main
  single-sourcing debt. Every validation message, mailto subject/body line
  label, field label, placeholder and hint, heading, form note and aside
  string on [InquiryPage.tsx](../src/pages/InquiryPage.tsx) is hardcoded in
  the renderer — the same debt class fk114/fk115 retired on the home surface
  and fk140/fk144 retired on the quote calculators and shared chrome.
  [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154) owns
  declaring this copy in the typed registry.
- The quote calculators' money logic has no dedicated unit test:
  [quote.ts](../src/lib/quote.ts) owns both total formulas, the sv-SE
  formatting and `vatStatusLabel`, but they are exercised only indirectly
  through the two page suites' DOM assertions, so a formula or formatting
  change is caught only at the DOM boundary. fk133's delivery summary
  proposed exactly this follow-up, and
  [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155) owns it.
- Photography remains partially editorial: the three delivered canvas
  photographs and the responsive quote hero sit beside still-outstanding
  requests — a real Trädgårdsplanering photo (the AI-generated
  `tradgard-generated.webp`, ~502 KB, remains), the About and Contact heroes
  (both declared `heroPhotoAssetPath` values still point at absent files, so
  `/om-oss/` and `/kontakt/` each make a guaranteed 404 hero request plus a
  high-priority preload miss) and an optional Inhyrning photo upgrade
  ([image requests](image-requests.md)). Acquisition and approval stay
  editorial work, distinct from delivered image-failure resilience.
- fk120's static-client caveat stands: the calculators' internal prices and
  formulas are readable in the shipped source; truly secret prices cannot be
  kept in a static client, so the totals stay estimates pending a real quote.
- fk151's WCAG AA contrast repair is in flight: the brand accent's
  light-surface contrast and the dark-surface usages are owned — in review —
  by fk151's own record; this refresh creates no duplicate roadmap work for
  that scope.
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
November 2 during fk105's refresh, on November 3 during fk113's refresh, on
November 6 during the fk123 refresh, and again on November 7 during this
fk153 refresh. The checkout advanced from fk123's `1bb124a` baseline to
`7d1b3dc` (this baseline) through the fk122, fk133, fk140, fk144, fk135 and
fk149 merges in that order (PRs #107, #109, #110, #111, #112 and #113). All
six delivery tasks are closed/done with merge receipts and passed native
run-quality runs (receipts below). fk134 — fk123's linked quote-copy task —
closed with no build PR of its own: its partially staged worktree branch was
salvaged into plan fk139, whose children fk140 and fk144 delivered the scope;
the salvage story is recorded once here and not re-created per row. During
the November 7 owning reads, fk151 was open in review (PR #114, native
run-quality pass 184/184 at its head `283488f` recorded 14:03Z) and fk152
open in build; fk154 and fk155, created during this refresh cycle's
investigation, read back open with labels `priority: medium` and
`size:medium`.

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
| [fk113](https://app.faktorial.ai/projects/alvalinus/tasks/fk113), previous roadmap | Closed/done; PR #99, merge `af2d837`. Document read in full during the fk123 refresh. Its scheduling projection reports `record_state=missing` while the owning record is closed/done; the projection does not reopen it. | Superseded assessment; its Next 1/Next 2 shipped as fk114/fk115, and its in-flight fk112 reservation is delivered. Its quote-page copy and duplication observations shipped as fk134/fk135 (via fk140/fk144 and fk135's own delivery, below). |
| [fk114](https://app.faktorial.ai/projects/alvalinus/tasks/fk114), registry-declared home-section copy | Closed/done; PR #100, merge `8a02d80`; native quality pass at head `e7cea44`. Verified in source at this baseline: `sectionHeadings` declares the five sections' eyebrows, headings, summaries and "Läs mer" label plus aria prefix, and services carry `photoSrc` ([siteContent.ts](../src/data/siteContent.ts)); the renderer renders registry fields with no section copy conditionals. | Delivered. The former "renderer-side home-section copy and SERVICE_PHOTOS map" gap is retired. |
| [fk115](https://app.faktorial.ai/projects/alvalinus/tasks/fk115), registry-declared shared chrome strings | Closed/done; PR #101, merge `1620bbd`; native quality pass at head `35d5541`. Verified in source at this baseline: the `chrome` section declares brand, not-found (with `{path}` template), breadcrumb, contact band, footer and service strings ([siteContent.ts](../src/data/siteContent.ts)); Header, Footer, NotFound, PageHero, ServicePage and ContactLinkBand consume them. | Delivered. The former "renderer-side shared chrome" gap is retired; the small leftover set fk134 reserved shipped through fk144, below. |
| [fk112](https://app.faktorial.ai/projects/alvalinus/tasks/fk112), per-subpage hero preloads | Closed/done; PR #102, merge `8e7a8e9`; native quality pass at head `5a3083a` (conflict-resolution run). Verified in source at this baseline: every route declares `heroPhotoAssetPath` ([types/site.ts](../src/types/site.ts)), heroes render from it ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), and `routeHeroPreloadHref` validates and stamps each emitted subpage document's high-priority preload from the same field ([route-artifacts.mjs](../scripts/route-artifacts.mjs)); the renderer-side `PAGE_HERO_PHOTOS` map is gone. Its scheduling projection reports `record_state=missing` while the owning record is closed/done. | Delivered. fk113's "in-flight automation child" description is retired; fk122's quote-hero WebP conversion below completed the hero-asset work. |
| [fk120](https://app.faktorial.ai/projects/alvalinus/tasks/fk120), drainage quote calculator | Closed/done; PR #103, merge `8230760`; native quality pass at head `dbe5498`. Verified in source at this baseline: `/draneringsberakning/` renders the per-meter drainage calculator ([DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx)), `drainageTotal` encodes the 3 500/3 000 kr tiers plus 6 900 kr fixed ([quote.ts](../src/lib/quote.ts)), the Dränering service page carries the registry-declared calculator link band, and the customer view, printout and email show only the preliminary total. | Delivered by operator-authored work. The quote-page copy moved into the registry through fk140 and the structure through fk135, below. |
| [fk121](https://app.faktorial.ai/projects/alvalinus/tasks/fk121), staffing inquiry page | Closed/done; PR #104, merge `4294bb2`; native quality pass at head `7b3ca1a` (conflict-resolution run). Verified in source at this baseline: `/inhyrning/` (route kind `inquiry`) renders the inquiry form with Swedish validation and mail-draft handoff ([InquiryPage.tsx](../src/pages/InquiryPage.tsx)), pinned by [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) and documented in [staffing-inquiry.md](features/staffing-inquiry.md). | Delivered by operator-authored work; its renderer-side Swedish copy is the fk154 next step below. |
| [fk127](https://app.faktorial.ai/projects/alvalinus/tasks/fk127), Kalkyler menu links | Closed/done; PR #105, merge `0ed6ce0`; native quality pass at head `7d8cfa9`. Verified in source at this baseline: `chrome.calcMenu` declares the Kalkyler group — Dränering → `/draneringsberakning/`, Uppfart → `/offertberakning/#uppfart` ([siteContent.ts](../src/data/siteContent.ts)) — and desktop and mobile menus render it. | Delivered by operator-authored work. |
| [fk128](https://app.faktorial.ai/projects/alvalinus/tasks/fk128), Inhyrning menu entry | Closed/done; PR #106, merge `a890c30`; native quality pass at head `2864f86`. Verified in source at this baseline: the header and mobile menu include the Inhyrning route through the registry-derived nav lists ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)). | Delivered by operator-authored work. |
| Operator photo selection (commit `1bb124a`) | No owning task record; a direct operator-authored commit on main (2026-11-04): selected canvas photographs replace the generated placeholders for Stensättning, Markarbete and Grävjobb cards and page heroes; [image-requests.md](image-requests.md) records the canvas-attachment provenance and retires the Grävjobb request. | Delivered. Editorial photography landed outside the task machinery; recorded once here so no agent recreates it. |
| [fk122](https://app.faktorial.ai/projects/alvalinus/tasks/fk122), quote-hero WebP conversion | Closed/done 2026-11-06T13:32Z; PR #107, head `8378d87` → merge `b4afea0`; native run-quality pass at head `8378d87`. Verified in source at this baseline: `quote-hero.png` is absent from `public/page-visuals`, the `quote-hero` 640w/960w/full WebP trio is present, and the quote route's registry path, rendered `srcSet` and stamped preload agree. | Delivered. fk123's "in build" description is retired; the quote-hero bytes work is complete. |
| [fk133](https://app.faktorial.ai/projects/alvalinus/tasks/fk133), quote-calculator feature catalog | Closed/done 2026-11-06T13:50Z; PR #109, head `8af176d` → merge `4050621`; native run-quality pass at head `8af176d`; the native `validate-features` pass recorded at that head stands in the delivery record, while the issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: [features.json](features/features.json) carries six features including F6, and the [route inventory](current-public-route-inventory.md) no longer claims the calculators are outside the catalog. | Delivered. fk123's "in build" description is retired; the quote-route catalog gap is closed. |
| [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134), registry-declared quote-page copy | Closed 2026-11-06T19:00Z with no build PR of its own. Its partially staged worktree branch (`agent-go/task-fk134`) was salvaged into plan fk139, whose children fk140 and fk144 delivered the scope; fk134's record head carries the merged state it was rebased onto. | Delivered via plan fk139. The salvage story is recorded once here; no reopen and no duplicate delivery. |
| [fk139](https://app.faktorial.ai/projects/alvalinus/tasks/fk139), quote-copy delivery plan | Plan closed/done 2026-11-06T19:56Z; all four plan items complete; PR #110. | Delivered through its children fk140 and fk144. fk123's fk134/fk135 "open next step" rows are retired by the deliveries below. |
| [fk140](https://app.faktorial.ai/projects/alvalinus/tasks/fk140), quote calculators on registry copy | Closed/done 2026-11-06T19:28Z; PR #110, head `1a154a1` → merge `7d78282`; native run-quality pass at head `1a154a1`. Verified in source at this baseline: both quote pages render `content.quote.shared/.uppfart/.drainage` with placeholder-filled mailto drafts, and both quote test files derive pinned strings from the registry. | Delivered. The former "renderer-side quote copy" gap is retired. |
| [fk144](https://app.faktorial.ai/projects/alvalinus/tasks/fk144), chrome strings in the registry | Closed/done 2026-11-06T19:50Z; PR #111, head `3ab8bea` → merge `e3a4eef`; native run-quality pass at head `3ab8bea`. Verified in source at this baseline: SiteHomePage renders all eight inventoried chrome strings from the registry and its test pins derive from it. | Delivered. The former "leftover chrome set" gap is retired. |
| [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135), quote-page structure consolidation | Closed/done 2026-11-06T20:15Z; PR #112, head `5dda9b9` → merge `718f19e`; native run-quality pass at head `5dda9b9`. Verified in source at this baseline: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx) exists and both quote pages import and render through its shared shell, aside, notes field, reset button. | Delivered. fk123's "open next step, sequenced after fk134" description is retired; the structural duplication is consolidated. |
| [fk149](https://app.faktorial.ai/projects/alvalinus/tasks/fk149), caret-range lockfile refresh | Closed/done 2026-11-07T12:54Z; PR #113, head `f52b1e1` → merge `7d1b3dc` (this baseline); native run-quality pass at head `f52b1e1`. Lockfile-only diff (eight in-range bumps); every major-version jump deliberately deferred with recorded reasons, and the vitest 5 migration carries fk149's own follow-up prompt. | Delivered. Routine dependency maintenance with documented deferrals; no separate roadmap follow-up created. |
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Open; the November 7 Persistent Frontend Optimization child, in review: PR #114 open at head `283488f`, with a native run-quality pass (184/184) recorded at that head on November 7. Owns the brand-accent contrast repair and its deterministic contrast test. | In flight, owned by fk151. Recorded once here; not duplicated as roadmap work. |
| [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152), feature-catalog stamp refresh | Open; the November 7 Persistent Feature Refinement child, in build. Owns the docs/features review-stamp refresh after the fk140/fk144 registry moves. | In flight, owned by fk152. Recorded once here; no duplicate catalog work. |
| [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154), inquiry-page registry declaration | Open; created during this refresh cycle on 2026-11-07T14:01:41Z and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |
| [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155), quote money-logic unit tests | Open; created during this refresh cycle on 2026-11-07T14:01:47Z and read back open with labels `priority: medium` and `size:medium`. | Open next step, linked from the short-term section below. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 7 one, and no row above was reopened or recreated by this refresh:
fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23/fk34
(mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery), fk32
(catalog), fk36/fk37 (route validation/checksums), fk43/fk44 (mobile/roadmap),
fk45/fk46 (skip link/email explanation) and fk51 (catalog) remain closed/done.
fk9's closed-with-build lifecycle note stands. Per-head quality receipts
(90/92/103/109/110/120 passing at the fk55/fk53/fk56/fk75/fk78/fk77 heads,
123/128/131 at the fk86/fk89/fk88 heads, 137/137/138 at the fk95/fk97/fk98
heads, 138/138/134 at the fk104/fk106/fk107 heads, the passed runs at the
fk114/fk115/fk112/fk120/fk121/fk127/fk128 heads, the passed runs at the
fk122/fk133/fk140/fk144/fk135/fk149 heads above, and the open-PR fk151 run at
`283488f`) are historical, not current totals, and no acceptance is claimed
for this roadmap candidate, current main or any deployment.

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
was never repaired platform-side. No recurrence has been observed: fk133's
November 5 occurrence ran with a fresh parent key and closed delivered
(PR #109), and the November 7 occurrence (fk152) runs with a fresh parent key
(`automation-run:local:feature-refinement:1794059575599886447`). All receipts
above come from fresh November 7 owning reads; no duplicate record is created
for any of them.

## Short-term priorities and issue ownership

fk123's two short-term priorities both shipped with passed native quality
runs: the quote-page Swedish copy and the leftover chrome strings are
declared in the typed registry through plan fk139's children fk140 (PR #110)
and fk144 (PR #111), and the duplicated quote-page structure is consolidated
in fk135's shared components (PR #112). fk122's in-flight hero candidate
merged (PR #107) and fk133's catalog work merged (PR #109), closing what
fk123 recorded as in flight.

The two follow-up issues created during this refresh cycle (the
investigation's `create_task` writes on November 7, read back open before
linking; build creates no new issue) are:

1. [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154) —
   declare the staffing-inquiry page's Swedish copy in the typed registry
   instead of the renderer: move the inquiry validation messages, the mailto
   subject/body line labels with placeholder syntax, the field
   labels/placeholders/hints and the aside strings out of
   [InquiryPage.tsx](../src/pages/InquiryPage.tsx) — the last renderer-side
   Swedish surface in `src/` — so the route/service registry stays the single
   Swedish declaration source for the whole delivered surface.
2. [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155) —
   add a dedicated unit-test file for the quote calculator's money logic:
   pin `drainageTotal`'s tiering including the 55 m boundary, `drivewayTotal`
   with and without the asphalt flag, the sv-SE formatting and
   `vatStatusLabel` in `src/lib/quote.test.ts`, so formula and formatting
   changes are caught directly rather than only through page DOM assertions
   (fk133's delivery summary proposed this exact follow-up).

Remaining candidates were judged and dispositioned above: the missing
photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact heroes, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still
await explicit operator decisions; fk151's contrast repair and fk152's
catalog stamp refresh are in flight and owned there; and fk149's deferred
major-version jumps carry their own recorded follow-ups on fk149's record.
No issue is created for any of them in this refresh.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 refresh chain shows the
   working loop: reconcile, ship, re-verify, retire. Separate source
   delivery, task closure and acceptance; missing evidence stays unknown.
   The loop also absorbs stalled deliveries without losing work: fk134's
   partially staged worktree was salvaged into plan fk139 and delivered by
   its children fk140/fk144, recorded once with receipts instead of being
   redone or reopened.
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
   the first-paint ready boot, registry-declared home sections, shared chrome
   and both quote calculators, the consolidated quote-page structure, the
   responsive WebP quote hero, and the staffing-inquiry self-service surface
   are delivered. The remaining visitor-visible work is fk154's
   inquiry-copy declaration, fk155's quote money-logic tests, fk151's
   in-flight contrast repair and approved missing imagery. Define useful
   inquiry signals and privacy needs before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 7, this checkout's
   parent holds only the fk149/fk151/fk152/fk153/fk154/fk155 worktrees.
   Transfer demonstrated practices with explicit owners. The autonomous
   factory operates around this static product; it is not an application
   backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 7 during this fk153 refresh: the previous roadmap in
  full (fk123's revision, whose committed base text is the `1bb124a` review);
  the `45105f4..7d1b3dc` Git history (fk122 PR #107 merge `b4afea0`, fk133
  PR #109 merge `4050621`, fk140 PR #110 merge `7d78282`, fk144 PR #111 merge
  `e3a4eef`, fk135 PR #112 merge `718f19e`, fk149 PR #113 merge `7d1b3dc`);
  source verification at this HEAD: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx)
  present and imported by both quote pages, the quote and chrome registry
  sections rendered by QuotePage/DrainageQuotePage/SiteHomePage, the
  renderer-side Swedish strings in [InquiryPage.tsx](../src/pages/InquiryPage.tsx)
  re-confirmed (validation messages, mailto subject and line labels, field
  hints, headings), `src/lib/` carrying no `quote.test.ts`, a fresh
  `public/page-visuals` listing (`quote-hero.png` gone, the quote-hero WebP
  trio present, no `about-hero.webp`/`contact-hero.webp`,
  `tradgard-generated.webp` still present), [docs/features/features.json](features/features.json)
  (six features, F6 the quote calculators), the
  [route inventory](current-public-route-inventory.md) (checked 2026-11-04,
  twelve routes, no uncataloged-calculator note left), and
  [image-requests.md](image-requests.md) (tradgard-photo, about-hero and
  contact-hero still unchecked). Owning `get_task` reads confirmed fk122,
  fk133, fk134, fk135, fk139, fk140, fk144 and fk149 closed/done with the
  receipts in the table, fk151 open in review (PR #114, head `283488f`,
  run-quality pass 184/184 at that head recorded 14:03Z), fk152 open in
  build, and fk154/fk155 open with exact labels. The checkout parent holds
  only the six 2026-11-07 worktrees; `../booking` and `../Asynkron.JsEngine`
  are absent. Unchanged structural claims carried from the October 28–
  November 6 reviews keep that provenance.
- One-day Faktorial API usage read on November 7 (14:08Z) reported 108,217
  control-plane calls across 12 endpoints, led by canvas context checks
  (87,729) and task reads (20,278). The same caveats as previous refreshes
  stand and this read is again thinner than its window: the volatile
  in-memory retention covered only 14:06:02Z–14:08:21Z against the one-day
  request, the sampling state is unknown, 232 of 401 retained spans did not
  join to a durable route identity, the retained population was truncated by
  a store cap, and revision comparability is unavailable.
- The serving-process database telemetry read the same day covered a fresh
  collector epoch (reset 07:42:54Z on November 7): at the 14:08Z read its
  cumulative counters span about 6.4 hours — about 788,000 calls, 649,000
  queries and 2 errors, led by credential-identity reads (114,530 calls) and
  the scheduling/command revision reads (91,534 calls each). Cumulative
  counters are not comparable across collector resets. Both populations are
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
- Owning reads and writes made on November 6 (fk123, retained for
  provenance): the previous roadmap in full (fk113's revision, whose
  committed base text is the `00e1ee1` review); the `af2d837..1bb124a` Git
  history (fk114 PR #100 merge `8a02d80`, fk115 PR #101 merge `1620bbd`,
  fk112 PR #102 merge `8e7a8e9`, fk120 PR #103 merge `8230760`, fk121 PR #104
  merge `4294bb2`, fk127 PR #105 merge `0ed6ce0`, fk128 PR #106 merge
  `a890c30`, then the operator commit `1bb124a`); source verification of the
  twelve-route registry, the renderer's remaining hardcoded Swedish strings,
  the quote pages' renderer-side copy and duplicated structure,
  `routeHeroPreloadHref` with no `PAGE_HERO_PHOTOS` map left, a fresh
  `public/page-visuals` listing and the feature catalog at that baseline;
  owning `get_task` reads confirming fk113, fk114, fk115, fk112, fk120,
  fk121, fk127 and fk128 closed/done with receipts; fk63, fk64, fk83, fk84
  and fk103 closed on 2026-11-04 (12:42:01Z, 12:42:07Z, 12:46:40Z,
  12:46:48Z, 12:49:58Z) after the operator's "close this" answers; fk122 and
  fk133 open in build at that time; fk134 and fk135 created with independent
  read-backs confirming them open; the checkout parent holding only the
  fk122/fk123/fk133 worktrees; one-day API usage (104,576 calls across 13
  endpoints, led by canvas context checks 85,255 and task reads 19,012;
  volatile retention covering only 13:08:26Z–13:11:33Z, sampling unknown,
  334 of 415 retained spans unmatched) and database telemetry (serving
  process started 12:39:06Z, so about 32 minutes of counters: about 74,200
  calls, 59,400 queries, 2 errors) under the same serving-process caveats.
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
