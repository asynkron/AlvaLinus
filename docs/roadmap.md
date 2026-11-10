# Product and operation roadmap

Reviewed: 2026-11-10 (fk173), source baseline
`ab28b453c4c10152f30c9b0b689af20d33810a24` (main tip at handoff). The
investigation snapshot named `7931e16` while this checkout still held fk123's
2026-11-06 roadmap (base `7d1b3dc`, two generations stale, whose committed
copy must never be treated as current); fk163's committed 2026-11-08 refresh
(PR #121, merge `c084a50`) is the generation this document supersedes.
Preparation advanced this task's base to `ea2d472` (fk171's merge) before
build; then, mid-refresh, fk176 — one of this document's own linked next
steps — was picked up from the roadmap, delivered and merged (PR #126,
`ab28b45`) within roughly half an hour of being linked, and the worktree was
re-synced onto that tip, so every affected row below is re-baselined from
fresh owning reads at the `ab28b45` tip instead of copying the snapshot.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk163's November 8 assessment (PR #121, merge
`c084a50`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173: the
previous document was read in full and reconciled with exact merge receipts
and current source. Earlier assessments remain in Git; their ownership is
reconciled below.

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 8 review, main advanced from `feef822` (fk163's reviewed
baseline) to `ab28b45` (this baseline) through eight merges in order:

- **fk161** (PR #119, merge `7396db5`) gave the Tjänster hero registry-declared
  responsive WebP variants (`services-hero-640.webp`/`-960.webp`, generated
  without adding a dependency): optional `heroPhotoSrcSet`/`heroPhotoSizes`
  route fields feed both the rendered srcset and the stamped preload's
  `imagesrcset`/`imagesizes`, and the static gate now existence-checks every
  declared srcset candidate. A repair commit fixed the only gate failure (two
  strict-null test errors) without changing production code.
- **fk162** (PR #120, merge `be106db`) reconciled the feature catalog with the
  quote-page deliveries: F6 gained `QuotePageShared.tsx` in its code paths and
  runtime owners, its descriptions now name the registry-declared calculator
  copy, the F4-US1 story maps the chrome-rendering test as direct vitest
  evidence, and quote-calculators.md/navigation-and-recovery.md were
  re-stamped 2026-11-08 (including correcting the stale "no dedicated unit
  test file" sentence after fk155).
- **fk163** (PR #121, merge `c084a50`) delivered the previous roadmap refresh
  that this document supersedes.
- **fk164** (PR #122, merge `3b19a91`) re-pointed the dead `/om-oss/` and
  `/kontakt/` hero declarations at the in-tree
  `svard-entreprenad-about.svg`/`svard-entreprenad-contact.svg` placeholders
  and extended the static artifact gate so every declared `heroPhotoAssetPath`
  must exist under `public/`, with fixture tests pinning the new gate behavior
  and [image-requests.md](image-requests.md)'s closing pointer corrected to
  the registry. No route emits a guaranteed 404 hero request anymore.
- **fk165** (PR #123, merge `72af228`) composed the release-provenance
  sequence into one repo-owned command:
  [scripts/release-provenance.mjs](../scripts/release-provenance.mjs) plus the
  `write-release-provenance` CLI (and a `release-provenance` make target)
  verify a clean checkout, build `dist/`, write and verify the checksum
  manifest, read the retained quality-evidence identity and emit a
  deterministic `release-provenance.v1` record — failing closed on any unmet
  precondition — with in-memory fixture tests and
  [release-runbook.md](release-runbook.md) referencing the composed path.
- **fk172** (PR #124, merge `7931e16`) re-verified the feature catalog against
  the current tree: the README carries a reconciliation note covering fk135's
  shared shell, fk162's reconciliation and fk164's hero re-pointing, the
  F2/F4/F6 records were re-stamped 2026-11-10, and the "photo hero" prose
  left stale by the SVG re-pointing was corrected in three records. F1/F3/F5
  kept their 2026-11-07 stamps — for F5 that rationale does not hold (fk176
  below) — and the decorative-hero WebP test reference remains an honestly
  unmapped gap by fk172's recorded disposition.
- **fk171** (PR #125, merge `ea2d472`) brought the quote
  calculators' and staffing-inquiry form's field boundaries to WCAG 2.1 AA
  non-text contrast: the three `#b5bfcc` declarations (~1.8:1 on white) now
  draw `#64748b` (~4.8:1), guarded by a deterministic test that computes the
  WCAG ratio from the raw stylesheet source and requires ≥3:1.
- **fk176** (PR #126, merge `ab28b45`, this baseline) reconciled the F5
  staffing-inquiry feature catalog with the registry-declared inquiry copy:
  [staffing-inquiry.md](features/staffing-inquiry.md)'s source-ownership
  section now names the registry-declared `inquiry` copy (labels,
  placeholders and hints, validation messages, mail subject and body
  template, confirmation and aside copy) with InquiryPage.tsx's remaining
  runtime ownership stated accurately, the shared inventory's F5 code-path
  descriptions match the fk154 split, the catalog README carries the fk176
  reconciliation sentence, and the F5 story documents were re-stamped
  2026-11-10 — with the native `validate-features` proof passing on its
  candidate and run-quality 235/235 at its head.

The visitor-facing baseline is a complete self-service surface whose Swedish
text is declared in the typed registry on every delivered surface, whose
accent and form-field contrast are test-enforced, whose quote money logic is
unit-tested, and every declared hero asset exists with the gate keeping it
that way. What remains inside the delivered surface is the plain hero
preloads that disagree with seven routes' srcset-selected heroes (fk177's
in-flight delivery below) and the declared but undelivered editorial
photography — not new visitor capability.

No unclaimed feature work is open at this refresh's closing reads (November
10, ~15:45Z): fk176 — this refresh's first linked next step — was picked up
from the roadmap and closed delivered at 15:24Z (PR #126), and fk177 — the
second — is in build with PR #127 open and canonical run-quality running at
its head, recorded once below and owned by its own record. The
dependency-management automation has still not produced a child since fk149
on November 7. Beside delivery-notice records, the open inventory holds only
this roadmap task and fk177.

### What works well

- The typed route/service registry is the single declaration source for every
  page-level Swedish string on the delivered surface: per-route
  `<title>`/description and social card values, navigation labels, service
  summaries, tags, guidance and detail, the five home sections' copy and
  service photos (fk114), the shared chrome including the Kalkyler group
  (fk115/fk127/fk144), each route's hero photo path (fk112/fk122), both
  quote calculators' full copy including their mailto templates (fk140), the
  staffing-inquiry page's validation messages, mailto draft labels, field
  specs and aside copy (`content.inquiry`, fk154) and, since fk161 (PR #119),
  the optional per-route `heroPhotoSrcSet`/`heroPhotoSizes` responsive-hero
  declarations consumed by both the renderer and the preload stamper — all
  validated against built output at build time without client-side work.
- The quote calculators' money logic is pinned at its own boundary:
  [quote.test.ts](../src/lib/quote.test.ts) (fk155, PR #117) covers
  `drainageTotal`'s tiering including the exact 55 m boundary and the
  fixed-cost floor at zero input, `drivewayTotal` with and without the
  asphalt flag, sv-SE `formatMoney`/`formatNumber` output and
  `vatStatusLabel`, plus fk135's `fillTemplate`/`buildQuoteMailto`
  placeholder contract, so formula or formatting changes are caught directly
  rather than only at the DOM boundary.
- Contrast is enforced by test rather than by one-off repairs on both fronts
  it was repaired: fk151 (PR #114) darkened the light-surface `--primary`
  token, added `--primary-on-dark` for the navy surfaces, reclassified every
  dark-surface accent usage, and
  [its deterministic test](../src/styles.primary-contrast.test.ts) parses the
  stylesheet tokens and asserts the ≥4.5:1 pairings with a hue-family guard;
  and since fk171 (PR #125) the quote and inquiry form-field
  boundaries draw `#64748b` (~4.8:1 on white, up from ~1.8:1), guarded by
  [a focused test](../src/styles.field-border-contrast.test.ts) that imports
  both page stylesheets with `?raw`, extracts each boundary declaration by
  selector text, computes the WCAG relative-luminance ratio against white and
  requires ≥3:1 (with `vite.config.ts`'s `test.css.include` generalized so
  raw page-CSS imports return real source rather than Vitest's empty stub).
- The quote pages' structure is owned once: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx)
  (fk135) owns the result-aside, page shell, notes field, reset button and
  mailto composition, so a caption or template fix lands in one file while
  each page keeps its distinct calculator logic.
- The delivered interactive surface is real product capability: both quote
  calculators honor fk120's constraints (preliminary totals only, hidden
  internal prices, no assumed VAT status, safe invalid-input handling, print
  and email handoff), and the staffing inquiry validates required fields in
  Swedish and hands a complete mail draft to the visitor's own email program.
- Existing tests cover the delivered behavior:
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx) pins route and
  content structure, chrome and the registry-owned hero map;
  [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) and
  [DrainageQuotePage.test.tsx](../src/pages/DrainageQuotePage.test.tsx) pin
  both calculators with registry-derived pins;
  [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) pins the staffing
  inquiry; the route-emission plugin and its per-subpage preload stamping are
  covered by deterministic in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs) (fk164
  extended them for the hero-asset gate and fk161 for the enriched stamping);
  the release-provenance composition, artifact manifest and quality-evidence
  modules each carry their own node-env fixture tests
  ([release-provenance.test.mjs](../scripts/release-provenance.test.mjs),
  [artifact-manifest.test.mjs](../scripts/artifact-manifest.test.mjs),
  [quality-evidence.test.mjs](../scripts/quality-evidence.test.mjs)); the
  reduced-motion override, the primary-contrast tokens and the form-field
  borders have their own focused stylesheet tests, and the quote lib boundary
  is covered by [quote.test.ts](../src/lib/quote.test.ts). This refresh
  inspected source and owning records; it did not execute those tests.
- The feature catalog covers the whole route surface: six features F1–F6
  with the quote calculators documented as F6 (fk133), validate-features
  passes recorded in fk162's, fk172's and fk176's deliveries (the closed
  records' issue-level proof projections still report `missing_evidence`;
  the owning records are closed/done and the projections do not reopen
  them), the README reconciliation note re-stamped 2026-11-10 covering
  fk135, fk162, fk164 (fk172, PR #124) and fk176's F5 registry-copy
  reconciliation (PR #126), F2/F4/F6 re-stamped from fresh reads by fk172
  and F5 reconciled and re-stamped by fk176 — the staffing-inquiry records
  now name the registry-declared `inquiry` copy with InquiryPage.tsx's
  remaining runtime ownership — and the
  [route inventory](current-public-route-inventory.md) (checked 2026-11-04)
  matching the twelve-route registry. The catalog's one known open item is
  the decorative-hero WebP test reference, an honestly unmapped gap by
  fk172's recorded disposition.
- Image handling is layered: heroes preload at high priority per emitted
  document (fk112), above-the-fold heroes request eagerly while cards stay
  lazy, the quote hero serves its responsive WebP trio (fk122), the Tjänster
  hero ships registry-declared 640w/960w variants whose stamped preload is
  enriched with `imagesrcset`/`imagesizes` so the preloaded candidate matches
  what the img selects (fk161), service cards try the route SVG after photo
  failure, failing
  heroes hide themselves, and every declared hero path and srcset candidate
  is existence-checked by the build gate (fk164/fk161) — so no route emits a
  dead hero request or a silently missing variant. The seven heroes whose
  srcsets are still helper- or inline-derived rather than registry-declared
  are fk177's in-flight delivery, recorded below.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift (`npm outdated` wanted == current after
  its refresh), every major-version jump is deferred with a recorded reason,
  and the vitest 5 migration carries its own follow-up prompt on fk149's
  record — re-verified on November 10: no newer dependency-management child
  has run, and the vitest/coverage-v8 pins still read 4.1.9 at this baseline.
- [README](../README.md) and [the runner](../scripts/make.js) define Node 24+,
  locked dependencies, strict TypeScript, static artifact checks and one
  Vitest session. Process exit remains the gate authority.
- Release traceability is composed rather than transcribed: fk165's
  `write-release-provenance` command emits a deterministic
  `release-provenance.v1` record joining the source revision, the checksum
  manifest identity and the retained quality-evidence identity, failing
  closed instead of emitting a partial record, with publication identity
  left as an operator-recorded host fact.
- The autonomous factory keeps shipping through reviewed, merge-receipted
  tasks: this is the twelfth consecutive roadmap refresh, each reconciling
  the previous one against owning records before linking new work. The
  loop's throughput is visible in this baseline: eight merges landed between
  fk163's review and this tip in two days, including both linked next steps
  from the previous refresh (fk164/fk165, PRs #122/#123) and both November 10
  recurring children (fk171/fk172, PRs #125/#124) — and the steering loop now
  closes in under an hour: both next steps this refresh linked at 14:49Z were
  consumed before the refresh closed, fk176 merged at 15:24Z (PR #126) and
  fk177 in build by 15:45Z (PR #127). The loop also absorbs
  adverse starts without losing accuracy: this refresh began in a checkout
  whose committed roadmap was fk123's two-generations-old copy, verified the
  real tip by fetching origin, and re-baselined onto the actual current
  generation instead of editing the stale text.

### What works less well and what to improve

- Seven preloaded route heroes select a srcset candidate their document's
  high-priority hero preload does not describe, so narrow viewports download
  the full-size preloaded base plus the selected variant — the exact
  double-download mismatch fk161 fixed for `/tjanster/`. The home hero, the
  five service-detail heroes (the four `*-photo` pages plus
  `/tradgardsplanering/`) and `/offertberakning/` still derive their srcsets
  from the `responsiveImageSrcSet` helper branches
  ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):41/:430/:692/:779) or,
  for the rental quote, QuotePage.tsx's inline string (:50), while only the
  services route declares `heroPhotoSrcSet`; all needed variant files
  already exist in `public/page-visuals/`. (The drainage-quote page's hero
  has no variant family and its plain preload already matches, so it stays
  undeclared — fk177's own investigation corrected this refresh's initial
  nine-route count to seven.)
  [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177) owns
  declaring those srcsets in the registry so every stamped preload describes
  exactly what its img can select; it is in build (PR #127) at these reads.
- Photography remains partially editorial: the three delivered canvas
  photographs, the responsive quote hero and the responsive services hero sit
  beside still-outstanding requests — a real Trädgårdsplanering photo (the
  AI-generated `tradgard-generated.webp`, ~502 KB, remains), the About and
  Contact photographs (the `svard-entreprenad-about.svg`/`-contact.svg`
  placeholders have served as their heroes since fk164) and an optional
  Inhyrning photo upgrade. Acquisition and approval stay editorial work
  ([image requests](image-requests.md)), distinct from delivered
  image-failure resilience.
- Production host, publication access and artifact retention are unestablished.
  fk165's composed provenance command makes a local release traceable to its
  accepted source, but a runbook and checksum tools still cannot demonstrate
  rollback or recovery time, and whether the host serves `404.html` at
  unknown paths is unobserved.
- Inquiry conversion, delivery and satisfaction are unmeasured. Telemetry,
  persistence or submission-service proposals need explicit product and
  privacy decisions before changing the static boundary.
- fk120's static-client caveat stands: the calculators' internal prices and
  formulas are readable in the shipped source; truly secret prices cannot be
  kept in a static client, so the totals stay estimates pending a real quote.
- fk149's documented deferrals stand, verified on November 10: no newer
  dependency-management child has run since fk149 (November 7), the vitest 5
  + coverage-v8 5 migration carries fk149's own follow-up prompt, the other
  major jumps (tailwindcss 4, tailwind-merge 3, lucide-react 1.x, jest-dom 7,
  main typescript 7, @types/node 26) keep their recorded deferral reasons,
  and the 3 moderate npm-audit findings remain documented rather than forced
  (`npm audit fix --force` would pull exactly the excluded majors). These
  stay on fk149's record for the recurring automation; this refresh creates
  no duplicate issue for them.
- fk151's delivery summary recorded one remaining hover-state contrast
  ceiling — the Services card "Läs mer" link's `hover:text-primary/80`
  pairing (~3.7:1 on its card, still present at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):835, re-verified November
  10) — as a follow-up prompt for the recurring frontend-optimization
  automation; this refresh creates no duplicate issue for it.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, on
November 2 during fk105's refresh, on November 3 during fk113's refresh, on
November 6 during the fk123 refresh, on November 7 during the fk153 refresh,
on November 8 during the fk163 refresh, and again on November 10 during this
fk173 refresh. The checkout advanced from fk163's `feef822` baseline to
`ab28b45` (this baseline) through the fk161, fk162, fk163, fk164, fk165,
fk172, fk171 and fk176 merges in that order (PRs #119, #120, #121, #122,
#123, #124, #125 and #126). All seven delivery tasks are closed/done with
merge receipts and passed native run-quality runs (receipts below); fk162's,
fk172's and fk176's closed
records carry the issue-level proof-projection artifact fk133's and fk152's
did — their `missing_evidence` proof rows sit beside recorded
validate-features passes at their heads `b81d4e1`, `69d1bec` and `b71a47a` —
and the disposition stays Delivered; the projection does not reopen a closed
record. During the November 10 owning reads, fk176 and fk177, created during
this refresh cycle (14:49:33Z and 14:49:50Z), read back open with labels
`priority: medium` and `size:medium`; fk176 was then picked up from this
roadmap and delivered at 15:24Z, and fk177 is in build at the closing reads.

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
| [fk121](https://app.faktorial.ai/projects/alvalinus/tasks/fk121), staffing inquiry page | Closed/done; PR #104, merge `4294bb2`; native quality pass at head `7b3ca1a` (conflict-resolution run). Verified in source at this baseline: `/inhyrning/` (route kind `inquiry`) renders the inquiry form with Swedish validation and mail-draft handoff ([InquiryPage.tsx](../src/pages/InquiryPage.tsx)), pinned by [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) and documented in [staffing-inquiry.md](features/staffing-inquiry.md). | Delivered by operator-authored work; its renderer-side Swedish copy was declared in the registry by fk154, above. |
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
| [fk149](https://app.faktorial.ai/projects/alvalinus/tasks/fk149), caret-range lockfile refresh | Closed/done 2026-11-07T12:54Z; PR #113, head `f52b1e1` → merge `7d1b3dc` (fk153's baseline); native run-quality pass at head `f52b1e1` (run `feb68668-448c-4c79-a52d-5b8da2634927-build-dmoznfv2hosg-quality`, re-read November 10). Lockfile-only diff (eight in-range bumps); every major-version jump deliberately deferred with recorded reasons, the vitest 5 migration carries fk149's own follow-up prompt, and its record documents the 3 moderate npm-audit findings left unfixed because `npm audit fix --force` would pull the excluded majors. | Delivered. Routine dependency maintenance with documented deferrals; the deferrals and prompt stay on fk149's record for the dependency-management automation (re-verified unconsumed on November 10). |
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Closed/done 2026-11-07T14:09Z; PR #114, head `283488f` → merge `ba032ac`; native run-quality pass at head `283488f`. Verified in source at this baseline: the darkened `--primary`, the `--primary-on-dark` token and the deterministic contrast test are in [styles.css](../src/styles.css) and [its test](../src/styles.primary-contrast.test.ts). | Delivered. fk153's "in review" description is retired; the two-shade accent repair and its enforcement test are merged. The "Läs mer" hover follow-up from its delivery summary stays on fk151's record. |
| [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152), feature-catalog stamp refresh | Closed/done 2026-11-07T14:17Z; PR #115, head `81093b5` → merge `18da5d9`; native run-quality pass at head `81093b5`; its delivery summary records the validate-features pass at that head while the closed record's issue-level proof projection still reports `missing_evidence` (the owning record is closed/done and the projection does not reopen it). Verified in source at this baseline: `features.json` stamps read 2026-11-07 on all six features. | Delivered. fk153's "in build" description is retired; the story-document stamp re-read it deferred was absorbed by the later fk162/fk172 reconciliations. |
| [fk153](https://app.faktorial.ai/projects/alvalinus/tasks/fk153), previous roadmap | Closed/done 2026-11-07T14:25Z; PR #116, head `89705da` → merge `e2ca438`; native run-quality pass at head `89705da`. Document read in full during the fk163 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk154/fk155, and its in-flight fk151/fk152 reservations are delivered above. |
| [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155), quote money-logic unit tests | Closed/done 2026-11-07T14:35Z; PR #117, head `41dac58` → merge `2fdfc82`; native run-quality pass at head `41dac58`. Verified in source at this baseline: [quote.test.ts](../src/lib/quote.test.ts) pins both totals' tiering and flags, the sv-SE formatting and the template placeholder contract. | Delivered. The former "money logic exercised only through DOM assertions" gap is retired. |
| [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154), inquiry-page registry declaration | Closed/done 2026-11-07T14:46Z; PR #118, head `8a33f1a` → merge `feef822` (fk163's baseline); native run-quality pass at head `8a33f1a`. Verified in source at this baseline: `content.inquiry` is declared on the typed registry and [InquiryPage.tsx](../src/pages/InquiryPage.tsx) renders registry fields with registry-derived pins. | Delivered. The former "last renderer-side Swedish surface" gap is retired; the route/service registry is now the single Swedish declaration source for the delivered surface. F5's catalog records predated this delivery; fk176's delivery below reconciled them. |
| [fk161](https://app.faktorial.ai/projects/alvalinus/tasks/fk161), services-hero responsive variants | Closed/done 2026-11-08T15:05Z; PR #119, head `2d28b86` (after a repair commit fixing two strict-null test errors) → merge `7396db5`; native run-quality pass at head `2d28b86`. Verified in source at this baseline: `services-hero-640.webp`/`-960.webp` exist, the services route declares `heroPhotoSrcSet`/`heroPhotoSizes` ([siteContent.ts](../src/data/siteContent.ts):59–61), the stamper emits `imagesrcset`/`imagesizes` exactly for declaring routes, and the gate existence-checks declared candidates. | Delivered. fk163's "in review" description is retired. Its delivery summary's follow-up prompt — migrating the remaining hero srcsets into registry declarations — is now owned by the linked fk177 below, recorded once so the prompt and the task are not duplicated. |
| [fk162](https://app.faktorial.ai/projects/alvalinus/tasks/fk162), feature-catalog reconciliation | Closed/done 2026-11-08T15:23Z; PR #120, head `b81d4e1` → merge `be106db`; native run-quality pass at head `b81d4e1`; its delivery records the validate-features pass on the candidate (digest `dfa2a48a…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6 lists `QuotePageShared.tsx` in both manifests, quote-calculators.md and navigation-and-recovery.md are stamped 2026-11-08, and F4-US1 maps the chrome-rendering test. | Delivered. fk163's "in build" description is retired. Its F5 follow-up shipped as the linked fk176 below. |
| [fk163](https://app.faktorial.ai/projects/alvalinus/tasks/fk163), previous roadmap | Closed/done 2026-11-08T15:27Z; PR #121, head `43c156c` → merge `c084a50`; native run-quality pass at head `43c156c`. Document read in full during this fk173 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk164/fk165 below, and its in-flight fk161/fk162 reservations are delivered above. |
| [fk164](https://app.faktorial.ai/projects/alvalinus/tasks/fk164), dead-hero re-point and gate extension | Closed/done 2026-11-08T15:35Z; PR #122, head `ade983b` → merge `3b19a91`; native run-quality pass at head `ade983b`. Verified in source at this baseline: `/om-oss/` and `/kontakt/` declare the in-tree `svard-entreprenad-about.svg`/`-contact.svg` heroes ([siteContent.ts](../src/data/siteContent.ts):88/:172), no `about-hero.webp`/`contact-hero.webp` exists or is declared, and the gate rejects any route whose declared hero path is missing. | Delivered. fk163's "open next step" description is retired; the dead-reference class is closed at the declaration and gate level. |
| [fk165](https://app.faktorial.ai/projects/alvalinus/tasks/fk165), release-provenance command | Closed/done 2026-11-08T15:44Z; PR #123, head `063e171` → merge `72af228`; native run-quality pass at head `063e171`. Verified in source at this baseline: [release-provenance.mjs](../scripts/release-provenance.mjs), the `write-release-provenance` CLI and its fixture tests exist, and [release-runbook.md](release-runbook.md) references the composed path with publication identity kept operator-recorded. | Delivered. fk163's "open next step" description is retired; the four-identity sequence is one fail-closed command. |
| [fk172](https://app.faktorial.ai/projects/alvalinus/tasks/fk172), feature-catalog re-verification | Closed/done 2026-11-10T08:02Z; PR #124, head `69d1bec` → merge `7931e16`; native run-quality pass at head `69d1bec`; its delivery records the validate-features pass on the candidate (digest `b7527970…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the README reconciliation note and 2026-11-10 stamps on F2/F4/F6, the SVG-hero prose corrections in company-confidence.md and navigation-and-recovery.md, and F5 left at 2026-11-07 on a rationale its own record states ("nothing touched their documented behavior"). | Delivered. The November 9 feature-refinement child, merged November 10. Its F5 rationale does not hold against fk154's post-stamp merge; fk176's delivery below corrected the F5 records instead of reopening fk172 work. |
| [fk171](https://app.faktorial.ai/projects/alvalinus/tasks/fk171), WCAG field-border contrast | Closed/done 2026-11-10T14:36Z; PR #125, head `1f6aba4` → merge `ea2d472` (this baseline); native run-quality pass 235/235 at head `1f6aba4`. Verified in source at this baseline: the three field-boundary declarations draw `#64748b` ([QuotePage.css](../src/pages/QuotePage.css):15/:18, [InquiryPage.css](../src/pages/InquiryPage.css):19), [the focused contrast test](../src/styles.field-border-contrast.test.ts) computes the ratio from raw CSS, and `test.css.include` is generalized. | Delivered. The November 9 frontend-optimization child, merged November 10 (after the investigation snapshot recorded it as in build, per the stop-if re-baseline rule). Its delivery summary's follow-up prompt — hardening the contrast test's selector matching against CSS formatting churn — stays on fk171's record; no duplicate issue is created. |
| [fk173](https://app.faktorial.ai/projects/alvalinus/tasks/fk173), this roadmap refresh | Open in build at these reads; this document is its candidate. The prepared base advanced from the stale `7d1b3dc` checkout to `ea2d472` before editing, and the worktree was re-synced onto `ab28b45` mid-refresh after fk176's delivery — both verified against origin by fetching. | This refresh; supersedes fk163's assessment above. |
| [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176), F5 catalog reconciliation | Closed/done 2026-11-10T15:24Z; PR #126, head `b71a47a` → merge `ab28b45` (this baseline); native run-quality pass 235/235 at head `b71a47a`; the required `validate-features` proof passed on its candidate (aggregate digest `f2589022…`, no findings). Verified in source at this baseline: [staffing-inquiry.md](features/staffing-inquiry.md) stamped 2026-11-10 names the registry-declared `inquiry` copy with InquiryPage.tsx's remaining runtime ownership, the shared inventory's F5 code-path descriptions match the fk154 split, and the README carries the fk176 reconciliation sentence. | Delivered. Created and linked by this refresh at 14:49:33Z (read back open with labels `priority: medium` and `size:medium`), picked up from the roadmap and merged within roughly half an hour — consuming fk162's dropped F5 follow-up. This refresh re-baselined onto its merge per the stop-if rule. |
| [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177), remaining hero srcset declarations | Open, in build at these reads (observed 2026-11-10T15:45Z): PR #127 open with head `6a1d0f9` on base `ab28b45` and canonical run-quality running at that head; its build reports the registry declarations, renderer threading and in-place pins implemented. Its own investigation corrected this refresh's nine-route count to seven mismatching heroes, with `/draneringsberakning/` deliberately staying undeclared (no variant family exists and its plain preload already matches). | In flight, owned by fk177. Created and linked by this refresh at 14:49:50Z (read back open with labels `priority: medium` and `size:medium`); recorded once here, not awaited or duplicated. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 10 one, and no row above was reopened or recreated by this refresh:
fk3/fk24/fk35 (roadmaps), fk10 (reporter), fk11 (runbook), fk5/fk23/fk34
(mobile), fk8 (dependencies), fk25/fk26 (image/registry recovery), fk32
(catalog), fk36/fk37 (route validation/checksums), fk43/fk44 (mobile/roadmap),
fk45/fk46 (skip link/email explanation) and fk51 (catalog) remain closed/done.
fk9's closed-with-build lifecycle note stands. Per-head quality receipts
(90/92/103/109/110/120 passing at the fk55/fk53/fk56/fk75/fk78/fk77 heads,
123/128/131 at the fk86/fk89/fk88 heads, 137/137/138 at the fk95/fk97/fk98
heads, 138/138/134 at the fk104/fk106/fk107 heads, the passed runs at the
fk114/fk115/fk112/fk120/fk121/fk127/fk128 heads, the passed runs at the
fk122/fk133/fk140/fk144/fk135/fk149 heads, the passed runs at the
fk151/fk152/fk153/fk155/fk154 heads, and the passed runs at the
fk161/fk162/fk163/fk164/fk165/fk172/fk171/fk176 heads above) are historical, not
current totals, and no acceptance is claimed for this roadmap candidate,
current main or any deployment.

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
(PR #109), the November 7 occurrence (fk152) ran with a fresh parent key
(`automation-run:local:feature-refinement:1794059575599886447`) and closed
delivered (PR #115), the November 8 occurrence (fk162) closed delivered with
its own fresh record (PR #120), and the November 9 children closed delivered
on November 10 (fk172 PR #124, fk171 PR #125). The steering loop itself has
become the fastest path in the chain: fk176, linked from this roadmap at
14:49Z, was picked up and merged at 15:24Z (PR #126), and fk177 was linked
and in build with PR #127 by 15:45Z — both before this refresh closed. The
incident receipts come from
fk153's November 7 owning reads, retained for provenance; no duplicate record
is created for any of them.

## Short-term priorities and issue ownership

fk163's two short-term priorities both shipped with passed native quality
runs: the dead `/om-oss/` and `/kontakt/` hero declarations are re-pointed at
in-tree SVGs and the hero-asset existence gate rejects the class through
fk164 (PR #122), and the release-provenance sequence is one repo-owned
fail-closed command through fk165 (PR #123). fk161's services-hero variants
(PR #119) and fk162's catalog reconciliation (PR #120), recorded in flight at
that refresh, merged the same afternoon, and the November 10 children
fk172 (PR #124) and fk171 (PR #125) landed before this refresh's reads.

The two follow-up issues created during this refresh cycle (this roadmap
task's own worker writes on November 10, read back open before linking;
build creates no new issue) were both picked up by the loop before the
refresh closed:

1. [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176) —
   reconcile the staffing-inquiry feature catalog (F5) with the
   registry-declared inquiry copy: the feature document credited
   InquiryPage.tsx with owning field specs and Swedish copy that
   `content.inquiry` has declared since fk154, its stamp predated that
   merge, and the shared inventory's F5 descriptions repeated the pre-fk154
   split — fk162's dropped follow-up, which fk172's stamp pass had left
   behind on a rationale that did not hold. **Delivered 15:24Z as PR #126**
   (merge `ab28b45`, this baseline): the ownership section, F5 descriptions
   and README note are reconciled, re-stamped 2026-11-10, and the
   `validate-features` proof and run-quality passed on its candidate — so
   the catalog now reads the real declaration source.
2. [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177) —
   declare responsive hero srcsets for the remaining preloaded routes in
   the route registry: the home, five service-detail and rental-quote
   heroes select srcset candidates their stamped high-priority preloads do
   not describe, so narrow viewports double-download the hero base plus the
   variant; all variant files already exist, so declaring
   `heroPhotoSrcSet`/`heroPhotoSizes` per route (and moving QuotePage's
   inline literal into the registry) lets fk161's stamper emit matching
   `imagesrcset`/`imagesizes` preloads everywhere. **In build at these
   reads**: PR #127 open with run-quality running at head `6a1d0f9`, its
   own investigation having corrected the mismatching-hero count to seven
   with `/draneringsberakning/` deliberately left undeclared. Owned by
   fk177's record; recorded once here, not awaited or duplicated.

Remaining candidates were judged and dispositioned above: the missing
photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact photographs, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still
await explicit operator decisions; fk149's deferred major-version jumps,
their vitest-5 assessment prompt and the 3 moderate audit findings carry
their own recorded follow-ups on fk149's record for the dependency-management
automation (no newer dependency child has run as of these reads); fk151's
recorded "Läs mer" hover follow-up and fk171's recorded contrast-test
hardening prompt stay on their own delivery records for the recurring
frontend-optimization automation — which demonstrably consumes linked work
fast, having picked up fk177 within minutes of this refresh's link; and
fk161's and fk162's recorded follow-up prompts are consumed by fk177 (in
flight) and fk176 (delivered) rather than duplicated as separate issues. No
further issue is created in this refresh: every remaining candidate is
either operator/editorial work or carries its own recorded owner, and a
synthetic third task would duplicate one of those queues rather than steer
new work.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173
   refresh chain shows the working loop: reconcile, ship, re-verify, retire.
   Separate source delivery, task closure and acceptance; missing evidence
   stays unknown. The loop also absorbs stalled deliveries without losing
   work (fk134's salvage into plan fk139) and stale starting points without
   losing accuracy: this refresh began in a checkout two generations behind
   main and re-baselined onto the fetched tip instead of editing the stale
   copy. Its steering latency is now under an hour: both next steps it
   linked were picked up from this document before the refresh closed, one
   merged and one in build, with this document re-baselining onto the
   advance rather than shipping stale links.
2. **Repeatable product operation.** fk165's composed command delivered the
   local half of this goal: one deterministic `release-provenance.v1` record
   joining the accepted source revision, the checksum manifest identity and
   the retained quality-evidence identity, failing closed on unmet
   preconditions. What remains is the operator-owned half: actual
   hosting/access/retention facts and the recorded publication identity.
   Target releases traceable to accepted source and restorable prior
   artifacts; consider host-specific automation only after those facts and
   explicit access decisions; do not add speculative infrastructure.
3. **Resilient customer journeys.** Availability isolation, inquiry context,
   hero failure resilience and per-route preloads, navigation consistency,
   keyboard coverage, per-route head and social metadata, the unknown-path
   recovery artifact, reduced-motion scrolling, the contact focus ring,
   landmark-complete page structure, per-service guidance and detail depth,
   the first-paint ready boot, registry-declared home sections, shared
   chrome, both quote calculators and the staffing-inquiry page, the
   consolidated quote-page structure, the responsive WebP quote and services
   heroes with a preload that matches the selected candidate on
   `/tjanster/`, the test-enforced AA two-shade accent and AA-contrast
   form-field boundaries, existing hero assets on every route with the gate
   keeping them that way, and the unit-tested money logic are delivered.
   The remaining visitor-visible work is fk177's in-flight preload
   enrichment on the seven not-yet-declared heroes and approved missing
   imagery; the maintainer-facing catalog records are truthful again after
   fk176's F5 reconciliation. Define useful inquiry signals and privacy
   needs before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 10, this
   checkout's parent holds only the fk171/fk172/fk173 worktrees.
   Transfer demonstrated practices with explicit owners. The autonomous
   factory operates around this static product; it is not an application
   backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 10 during this fk173 refresh: the previous roadmap
  in full (fk163's revision, whose committed base text is the `feef822`
  review); Git tip verification (`git ls-remote origin refs/heads/main` and a
  fetch: the initial fetch confirmed origin/main at `ea2d472`, matching this
  task's prepared base, with the local `origin/main` ref stale at `7d1b3dc`
  before the fetch; a second ls-remote/fetch at ~15:44Z showed origin/main
  advanced to `ab28b45` and the re-synced worktree holds that tip); the
  `feef822..ea2d472` history (fk161 PR #119 merge `7396db5`, fk162 PR #120
  merge `be106db`, fk163 PR #121 merge `c084a50`, fk164 PR #122 merge
  `3b19a91`, fk165 PR #123 merge `72af228`, fk172 PR #124 merge `7931e16`,
  fk171 PR #125 merge `ea2d472`) plus the mid-refresh `ea2d472..ab28b45`
  delta (fk176 PR #126, head `b71a47a`, run-quality 235/235 at that head,
  the required `validate-features` proof passing on its candidate with
  aggregate digest `f2589022…` and no findings); source verification at this
  HEAD: the
  re-pointed about/contact hero declarations at
  [siteContent.ts](../src/data/siteContent.ts):88/:172 and the services
  route's `heroPhotoSrcSet`/`heroPhotoSizes` at :59–61, a fresh
  `public/page-visuals` listing (the services-hero 640w/960w variants
  present, no `about-hero.webp`/`contact-hero.webp`, `tradgard-generated.webp`
  ~502 KB still present), the `#64748b` field-boundary declarations in
  [QuotePage.css](../src/pages/QuotePage.css)/[InquiryPage.css](../src/pages/InquiryPage.css)
  with [the contrast test](../src/styles.field-border-contrast.test.ts)
  matching the minified `${selector}{` form its follow-up prompt names,
  [release-provenance.mjs](../scripts/release-provenance.mjs),
  `write-release-provenance.mjs` and
  [release-provenance.test.mjs](../scripts/release-provenance.test.mjs)
  present with [release-runbook.md](release-runbook.md) referencing the
  composed command, [image-requests.md](image-requests.md)'s closing pointer
  corrected to the registry with About/Contact/Trädgårdsplanering/Inhyrning
  photo requests still unchecked, the feature-catalog README reconciliation
  note stamped 2026-11-10 (fk172) with F5's doc (:57–59) and shared-inventory
  descriptions still claiming the pre-fk154 ownership split,
  QuotePage.tsx's inline quote-hero srcSet (:50), the
  `responsiveImageSrcSet` helper branches at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):41/:430/:692/:779, the
  stamper's `imagesrcset` emission sourced only from declared route fields
  ([route-artifacts.mjs](../scripts/route-artifacts.mjs):296–315), and the
  `hover:text-primary/80` "Läs mer" pairing still at :835. Owning `get_task`
  reads confirmed fk161, fk162, fk163, fk164, fk165, fk172 and fk171
  closed/done with the receipts in the table (fk171's run-quality pass 235/235
  at head `1f6aba4`), fk149 closed/done with its deferrals, audit findings
  and vitest-5 prompt re-read unconsumed, and fk176/fk177 read back open with
  exact labels after creation. Mid-refresh re-baseline reads (November 10,
  ~15:44–15:46Z): source reads of the delivered F5 records at this HEAD
  confirmed [staffing-inquiry.md](features/staffing-inquiry.md) stamped
  2026-11-10 naming the registry-declared `inquiry` copy with
  InquiryPage.tsx's remaining runtime ownership (:57/:67), the shared
  inventory's F5 code-path descriptions naming the registry-declared inquiry
  copy, and the README's fk176 reconciliation sentence; owning reads
  confirmed fk176 closed/done with merge receipt `ab28b45` and fk177 open in
  build (PR #127, head `6a1d0f9` on base `ab28b45`, run-quality running at
  that head, its build reporting the seven-route correction and
  `/draneringsberakning/` deliberately left undeclared). The open-task
  inventory (read November 10, ~14:44Z) held 22 open tasks: this task, the
  two new issues, and 19 delivery-notice records; at the closing reads it
  held 24 — this task, fk177 in flight, fk178 (fk176's delivery notice) and
  21 earlier delivery-notice records, with no other feature work open or in
  flight. This checkout's parent holds only the fk171/fk172/fk173 worktrees
  (re-verified November 10); fk176's and fk177's worktrees were created under
  the following day's worktree path;
  `../booking` and
  `../Asynkron.JsEngine` are absent. Unchanged structural claims carried from
  the October 28–November 8 reviews keep that provenance.
- One-day Faktorial API usage read on November 10 (14:47:51Z) reported
  125,156 calls across 10 endpoints, led by canvas context checks (88,389)
  and task reads (36,170). The same caveats as previous refreshes stand and
  this read is again thinner than its window: the volatile in-memory
  retention covered only 14:44:39Z–14:47:51Z against the one-day request,
  the sampling state is unknown, 352 of 428 selected spans did not join to a
  durable route identity (conflicting-route unmatched), the retained
  population was truncated by a store cap, and revision comparability is
  unavailable.
- The serving-process database telemetry read at the same minute covered a
  fresh collector epoch (reset 13:22:52Z on November 10): at the 14:47Z read
  its cumulative counters span about 85 minutes — about 310,884 calls,
  264,201 queries and 15 errors, led by credential-identity reads (71,369
  calls), the DuePage agent-run reads (13,812 calls, 10 of the errors) and
  the scheduling/command revision reads (19,605/19,607 calls). Cumulative
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
- Reads made on November 8 during the fk163 refresh (retained for
  provenance): the previous roadmap in full (fk153's revision, whose
  committed base text is the `7d1b3dc` review); the `7d1b3dc..feef822` Git
  history (fk151 PR #114 merge `ba032ac`, fk152 PR #115 merge `18da5d9`,
  fk153 PR #116 merge `e2ca438`, fk155 PR #117 merge `2fdfc82`, fk154 PR #118
  merge `feef822`); source verification at that HEAD: `content.inquiry`
  declared in [siteContent.ts](../src/data/siteContent.ts) and
  [InquiryPage.tsx](../src/pages/InquiryPage.tsx) rendering registry fields
  only, [quote.test.ts](../src/lib/quote.test.ts) present, the darkened
  `--primary` and new `--primary-on-dark` tokens in
  [styles.css](../src/styles.css) with
  [the contrast test](../src/styles.primary-contrast.test.ts),
  [features.json](features/features.json) stamped 2026-11-07 on six features,
  [QuotePageShared.tsx](../src/components/QuotePageShared.tsx) present and
  imported by both quote pages, a fresh `public/page-visuals` listing (no
  `about-hero.webp`/`contact-hero.webp`, the quote-hero WebP trio present,
  `services-hero.webp` still single-size, `tradgard-generated.webp` still
  present), the dead-hero declarations re-confirmed at
  [siteContent.ts](../src/data/siteContent.ts):85/:169 with
  `routeVisualAssetPaths` ([route-artifacts.mjs](../scripts/route-artifacts.mjs):428)
  still existence-checking only `visual.assetPath`,
  [release-runbook.md](release-runbook.md)'s four-identity provenance
  section, and [image-requests.md](image-requests.md)'s stale closing pointer
  to the photo maps. Owning `get_task` reads confirmed fk151, fk152, fk153,
  fk154 and fk155 closed/done with the receipts in the table, fk161 open in
  review (PR #119, a run-quality pass recorded at its head), fk162 open in
  build, and fk164/fk165 open with exact labels. The checkout parent held
  only the three 2026-11-08 worktrees; `../booking` and
  `../Asynkron.JsEngine` were absent.
- One-day Faktorial API usage read on November 8 (15:02Z) reported 119,640
  calls across 12 endpoints, led by canvas context checks (95,638) and task
  reads (23,769). The same caveats as previous refreshes stand and this read
  is again thinner than its window: the volatile in-memory retention covered
  only 15:00:29Z–15:02:47Z against the one-day request, the sampling state is
  unknown, 221 of 420 retained spans did not join to a durable route
  identity, the retained population was truncated by a store cap, and
  revision comparability is unavailable.
- The serving-process database telemetry read the same day covered a fresh
  collector epoch (reset 14:47:53Z on November 8): at the 15:02Z read its
  cumulative counters span about 15 minutes — about 45,483 calls, 37,912
  queries and 2 errors, led by credential-identity reads (10,089 calls) and
  the scheduling/command revision reads (3,340 calls each). Cumulative
  counters are not comparable across collector resets. Both populations are
  Cloud serving-process scope, not this static site, and none can be combined
  into an error rate or demand estimate.
- Reads made on November 7 (fk153, retained for provenance): the previous roadmap in
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
