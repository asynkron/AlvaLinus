# Product and operation roadmap

Reviewed: 2026-11-12 (fk197), source baseline
`9e7dd70bec977155d7d043bd3e587e8d0975b9de` (this task's prepared base,
which is fk195's merge — the tip at this refresh's reads). The previous
generation was read in full from this checkout's committed copy, which
holds exactly the fk187 refresh (PR #131, merge `7eb567e`). Since fk187's
own delivery closed at 16:47Z on November 11, main advanced through
fk188's, fk193's and fk195's merges (fk189's had already landed beneath
fk187's own merge), and every affected row below is re-baselined from
fresh owning reads at the `9e7dd70` tip instead of copying the snapshot.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk187's November 11 assessment (PR #131, merge
`7eb567e`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
fk187 → fk197: the previous document was read in full and reconciled with
exact merge receipts and current source. Earlier assessments remain in
Git; their ownership is reconciled below and their retained read logs are
compressed to pointers (see Evidence boundaries).

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 11 review, main advanced from `5465b66` (fk187's
reviewed baseline) to `9e7dd70` (this baseline) through five merges in
order:

- **fk189** (PR #132, head `7d21a757` → merge `3440d65`, closed
  2026-11-11T16:46Z; run-quality pass at head `7d21a757`) pinned the
  quote and inquiry accent palette to the test-enforced primary tokens:
  the hardcoded `#bf4911`/`#9f390b`/`#bc4811` hexes in both page
  stylesheets became `hsl(var(--primary))`/`hsl(var(--primary-hover))`
  declarations (a new `--primary-hover: 18 84% 33%` token joined
  `:root`), and
  [styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts)
  now pins the `.quote-send` white-on-background pairing at ≥4.5:1 with
  a hue-family guard — resolving the F6-US5 catalog exclusion fk183 had
  documented and mapping the test into F6-US5/F5-US2's story records.
- **fk187** (PR #131, head `1ec5bac` → merge `7eb567e`, on fk189's
  `3440d65` base, closed 2026-11-11T16:47Z; run-quality pass at head
  `1ec5bac`) delivered the previous roadmap refresh that this document
  supersedes.
- **fk188** (PR #133, head `71f21f79` → merge `36d7cba`, closed
  2026-11-11T16:53Z; run-quality pass at head `71f21f79`) completed the
  social-card class fk88 started: the per-subpage emitter now
  substitutes `og:image`, `og:image:alt` and `twitter:image` from each
  route's registry-declared `heroPhotoAssetPath` with registry-declared
  Swedish alt text, the three SVG-hero routes (`/inhyrning/`,
  `/om-oss/`, `/kontakt/`) keep the shared raster home hero because
  social crawlers render SVG unreliably, and the static artifact gate
  existence-checks every emitted image path (fk164's pattern extended).
- **fk193** (PR #134, head `802f378b` → merge `c131651`, closed
  2026-11-12T09:26Z; run-quality pass at head `802f378b`; its required
  `validate-features` proof passed at acceptance) reconciled the feature
  catalog with the delivered source: navigation-and-recovery.md's stale
  "drainage hero has no variant family" claim became the registry-owned
  responsive-variants paragraph, quote-calculators.md now names both
  quote routes' declared hero srcsets and fk189's accent-contrast test
  mapping, F4/F6 re-stamped 2026-11-12, and the README review history
  records the fk185/fk188/fk189 deltas.
- **fk195** (PR #135, head `636126c` → merge `9e7dd70`, this baseline,
  closed 2026-11-12T15:25Z; run-quality pass at head `636126c`) removed
  the contact form's ≥640px `sm:text-sm` downgrade so every
  offertförfrågan control holds `text-base` (16px) at all viewport
  widths — eliminating iOS Safari's automatic page zoom on field focus
  for landscape-phone and split-view users — with a focused
  rendered-class regression test covering both the home and `/kontakt/`
  renderings.

The visitor-facing baseline is a complete self-service surface whose Swedish
text is declared in the typed registry on every delivered surface, whose
accent, CTA and form-field contrast are test-enforced, whose quote money
logic is unit-tested, every declared hero asset exists with the gate
keeping it that way, every photo-hero route's stamped preload describes
exactly the candidates its img selects (fk177/fk185), every subpage's
social card now previews that page's own imagery (fk188), and the primary
conversion form no longer zooms on iOS focus (fk195). What remains inside
the delivered surface is the two newly linked debts (the hover-contrast
ceiling fk198 and the quote-page focus-zoom floor fk199, both created
during this refresh), the small hardcoded focus/selection hex residue
fk189 deliberately left out of its enumerated scope, and the declared but
undelivered editorial photography — not new visitor capability.

No unclaimed feature work is open at this refresh's closing reads
(November 12, ~17:04Z): the open inventory holds 36 records — this task,
the two links this refresh created (fk198 and fk199, read back open at
17:03Z with labels `priority: medium` and `size:medium` and not yet
picked up at the inventory read), the operator-owned worker-host
maintenance pair (fk181 waiting on host disk space with fk182 as its
question notice — platform work, not site work) and 31 delivery-notice
records, with no other feature work open or in flight. The
dependency-management automation has still not produced a child since
fk149 on November 7 — that automation runs weekly (`task_recurrence` 1w),
so the silence is cadence, not a stall; its vitest-5, major-jump and
audit prompts stay on fk149's record, re-read unconsumed on November 12.

### What works well

- The typed route/service registry is the single declaration source for every
  page-level Swedish string on the delivered surface: per-route
  `<title>`/description and social card values, navigation labels, service
  summaries, tags, guidance and detail, the five home sections' copy and
  service photos (fk114), the shared chrome including the Kalkyler group
  (fk115/fk127/fk144), each route's hero photo path (fk112/fk122), both
  quote calculators' full copy including their mailto templates (fk140), the
  staffing-inquiry page's validation messages, mailto draft labels, field
  specs and aside copy (`content.inquiry`, fk154) and — since fk177 (PR
  #127) and fk185 (PR #130) — registry-declared `heroPhotoSrcSet`/
  `heroPhotoSizes` responsive-hero declarations on all nine photo-hero
  routes, consumed by both the renderer and the preload stamper: the home
  hero, the five service-detail heroes, `/tradgardsplanering/`, the rental
  quote (siteContent.ts:25–28) and the drainage quote (:34–37 reusing
  byte-identical variants). QuotePage.tsx:51 and DrainageQuotePage.tsx:27
  read their hero srcset/sizes from the registry through the unchanged
  QuotePageShell contract; the former inline literal is gone. Only the
  three SVG-hero routes (`/inhyrning/`, `/om-oss/`, `/kontakt/`) stay
  undeclared, because no variant families exist for them. Since fk188
  (PR #133) the same registry field also sources every emitted subpage
  document's `og:image`/`twitter:image` — with `og:image:alt` drawn from
  registry-declared Swedish text and the static gate existence-checking
  each emitted path — so the social-card head values read from the same
  declaration source as the pages themselves.
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
  requires ≥3:1. fk183 (PR #129) then mapped all three styles tests and the
  quote money-logic test into the feature catalog as technical evidence at
  their strongest owning stories, so the catalog's evidence map now names
  the real owning tests. fk189 (PR #132) extended enforcement to the quote
  pages' own accent: the hardcoded orange hexes became
  `hsl(var(--primary))`/`hsl(var(--primary-hover))` declarations (a new
  `--primary-hover: 18 84% 33%` token joined `:root`), and
  [styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts)
  resolves the `.quote-send` rule's var references against `:root` and
  pins the white-on-background pairing at ≥4.5:1 with a hue-family guard,
  so the CTA joined the test-enforced contrast surface. fk195 (PR #135)
  gave the primary conversion form the same by-construction guarantee on
  the zoom axis: every offertförfrågan control holds the 16px text floor
  at all viewport widths, pinned by a rendered-class assertion on both
  its home and `/kontakt/` renderings.
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
  both calculators with registry-derived pins — fk185 added the drainage
  page's rendered hero srcset/sizes assertion, mirroring QuotePage's;
  [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) pins the staffing
  inquiry; the route-emission plugin and its per-subpage preload stamping are
  covered by deterministic in-memory fixture tests in
   [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs) (fk164
   extended them for the hero-asset gate, fk161 for the enriched stamping,
   fk177/fk185 for the now-nine-route srcset exclusivity maps and drainage
   preload form, fk188 for the per-route social-image substitution and its
   SVG-hero raster fallback); the release-provenance composition, artifact
   manifest and quality-evidence modules each carry their own node-env
   fixture tests
   ([release-provenance.test.mjs](../scripts/release-provenance.test.mjs),
   [artifact-manifest.test.mjs](../scripts/artifact-manifest.test.mjs),
   [quality-evidence.test.mjs](../scripts/quality-evidence.test.mjs)); the
   reduced-motion override, the primary-contrast tokens, the form-field
   borders, the quote-page CTA accent pairing (fk189) and the contact
   form's 16px field floor (fk195) have their own focused tests, and the
   quote lib boundary is covered by
   [quote.test.ts](../src/lib/quote.test.ts). This refresh
   inspected source and owning records; it did not execute those tests.
- The feature catalog covers the whole route surface: six features F1–F6
  with the quote calculators documented as F6 (fk133), validate-features
  passes recorded in fk162's, fk172's, fk176's, fk183's and fk193's
  deliveries (the closed records' issue-level proof projections still
  report `missing_evidence`; the owning records are closed/done and the
  projections do not reopen them), the README reconciliation note covering
  fk135/fk162/fk164/fk176, fk183's 2026-11-11 evidence-map line and
  fk193's 2026-11-12 review history, the README evidence-contract sentence
  naming all eight mapped test files after fk183 (fk193 added the
  accent-contrast test to the named list),
  F1/F4/F5/F6 re-stamped 2026-11-11 from fresh reads (F2/F3
  deliberately deferred to fk183's queued follow-up), F4/F6 re-stamped
  2026-11-12 by fk193 after it folded fk185's drainage-hero variants into
  navigation-and-recovery.md, named both quote routes' declared srcsets
  and fk189's accent-test mapping in quote-calculators.md, and recorded
  that fk188's og:image emission left the route table unchanged, and the
  [route inventory](current-public-route-inventory.md) (checked 2026-11-04)
  matching the twelve-route registry. The catalog's one known open item is
  the decorative-hero WebP test reference, an honestly unmapped gap by
  fk172's recorded disposition.
- Image handling is layered and now consistent: every photo-hero route
  declares its responsive WebP variants in the registry (fk161/fk177/fk185),
  each emitted document preloads its hero at high priority with
  `imagesrcset`/`imagesizes` describing exactly the candidates its img can
  select (fk112/fk161), above-the-fold heroes request eagerly while cards
  stay lazy, service cards try the route SVG after photo failure,
  failing heroes hide themselves, and every declared hero path and srcset
  candidate is existence-checked by the build gate (fk164/fk161) — so no
  route emits a dead hero request, a silently missing variant, or a
  preload/img mismatch. The `responsiveImageSrcSet` helper survives only as
  the PageHero documented fallback and for the lazy service-card images,
  which have no preload. Since fk188 the declared hero paths also become
  every emitted subpage's `og:image`/`twitter:image`, existence-checked by
  the same gate, with the three SVG-hero routes carrying the shared raster
  home hero so no emitted social image is an SVG.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift (`npm outdated` wanted == current after
  its refresh), every major-version jump is deferred with a recorded reason,
  and the vitest 5 migration carries its own follow-up prompt on fk149's
  record. The dependency-management automation runs weekly
  (`task_recurrence` 1w), so no child since fk149 on November 7 is its
  cadence, not a stall — re-read on November 12: fk149's record still
  carries the deferrals, the 3 moderate audit findings and the vitest-5
  prompt unconsumed, and the vitest/coverage-v8 pins still read 4.1.9 at
  this baseline.
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
  tasks: this is the fourteenth consecutive roadmap refresh, each reconciling
  the previous one against owning records before linking new work. The
  loop's throughput is visible in this baseline: five merges landed between
  fk187's review and this tip in about a day (fk189, fk187 itself, fk188,
  fk193 and fk195), and the steering loop closes in minutes-to-hours:
  fk188 was created at 16:20:23Z on November 11 and closed delivered with
  its merge at 16:53Z the same evening (about half an hour), and fk195 was
  created at 15:06Z on November 12 and closed at 15:25Z, about nineteen
  minutes later. The loop also survives adverse timing without losing
  accuracy: fk187's own PR landed between two of the tasks it had linked
  (fk189 merged beneath it, fk188 after it), and this refresh's base is
  exactly the resulting tip, so no re-baselining was needed.

### What works less well and what to improve

- fk189's delivery removed the enumerated accent-role hexes, but a small
  hardcoded-color residue remains deliberately outside its token system:
  the `:focus-visible` outlines draw `#bc4a12`
  ([QuotePage.css](../src/pages/QuotePage.css):20,
  [InquiryPage.css](../src/pages/InquiryPage.css):22 and :27) and the
  quote page's `::selection` draws `#f7c5aa` (:22). fk189's task scoped
  these out explicitly, and outline/selection colors are not AA text
  pairings — this is token-consistency residue, not a contrast failure.
  No task carries it; folding it into a future accent pass stays a
  candidate for the recurring frontend-optimization automation.
- fk151's delivery summary recorded one remaining hover-state contrast
  ceiling — the Services card "Läs mer" link's `hover:text-primary/80`
  pairing, still present at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850 (re-verified
  November 12: the resting `text-primary` pairing computes ≈5.5:1 on its
  white card, but the 80%-alpha hover composites to ≈4.0:1, below the
  4.5:1 AA threshold for 14px normal text; fk151 recorded ≈3.7:1) — and
  this refresh linked it:
  [fk198](https://app.faktorial.ai/projects/alvalinus/tasks/fk198)
  (created and read back open 2026-11-12T17:03Z with labels
  `priority: medium` and `size:medium`) pins the hover state to a
  test-enforced AA-compliant token in the fk151/fk171/fk189 pattern.
  Owned by fk198's record; recorded once here, not awaited or duplicated.
- The quote pages still carry the iOS focus-zoom defect class fk195 fixed
  on the contact form: `.quote-field` sets `font-size:14px` on the field
  container ([QuotePage.css](../src/pages/QuotePage.css):13), the input
  rule raises only `input` to 18px (:16), and the select/textarea rule
  (:18) declares no font-size, so both controls inherit 14px and trigger
  iOS Safari's automatic page zoom on focus on both `/offertberakning/`
  and `/draneringsberakning/`. The inquiry form already enforces 16px
  ([InquiryPage.css](../src/pages/InquiryPage.css):19), making the quote
  pages the remaining sub-16px form surface. This refresh linked it:
  [fk199](https://app.faktorial.ai/projects/alvalinus/tasks/fk199)
  (created and read back open 2026-11-12T17:03Z with labels
  `priority: medium` and `size:medium`) raises the controls to the 16px
  floor and adds an fk195-style deterministic regression test. Owned by
  fk199's record; recorded once here, not awaited or duplicated.
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
- fk149's documented deferrals stand, re-verified on November 12 with no
  newer dependency child having run (weekly cadence): the vitest 5 +
  coverage-v8 5 migration carries fk149's own follow-up prompt, the other
  major jumps (tailwindcss 4, tailwind-merge 3, lucide-react 1.x, jest-dom 7,
  main typescript 7, @types/node 26) keep their recorded deferral reasons,
  and the 3 moderate npm-audit findings remain documented rather than forced
  (`npm audit fix --force` would pull exactly the excluded majors). These
  stay on fk149's record for the recurring automation; this refresh creates
  no duplicate issue for them.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, on
November 2 during fk105's refresh, on November 3 during fk113's refresh, on
November 6 during the fk123 refresh, on November 7 during the fk153 refresh,
on November 8 during the fk163 refresh, on November 10 during the fk173
refresh, on November 11 during the fk187 refresh, and again on November 12
during this fk197 refresh. The checkout advanced from fk187's reviewed
`5465b66` baseline to `9e7dd70` (this baseline) through the fk189, fk187,
fk188, fk193 and fk195 merges in that order (PRs #132, #131, #133, #134
and #135). All five are closed/done with merge receipts and passed native
run-quality runs (receipts below); fk193's required
`feature-manifest-integrity` proof passed at its acceptance, and the other
four carry no proof obligations beyond ordinary quality. During the
November 12 owning reads, fk198 and fk199 — the two follow-up issues this
refresh creates — read back open at 17:03Z with labels `priority: medium`
and `size:medium` and were not yet picked up at the ~17:04Z inventory
read; they are owned by their own records and recorded once in the
short-term section below.

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
| [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88), per-route social card metadata | Closed/done; PR #89, merge `ee4d635`; quality 131/131 at head `64d2955`. Now reachable from this HEAD (during fk105's investigation it existed only in the local object store). Verified in source: the emission replaces all four `og:`/`twitter:` head values with the registry-composed title/description, the assertion validates subpages against root-text mismatches, and the root document keeps its global values. | Delivered. The former "home-branded social cards on every subpage" gap is retired for text — the image half of the same class is delivered by fk188 (receipt below). |
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
| [fk149](https://app.faktorial.ai/projects/alvalinus/tasks/fk149), caret-range lockfile refresh | Closed/done 2026-11-07T12:54Z; PR #113, head `f52b1e1` → merge `7d1b3dc` (fk153's baseline); native run-quality pass at head `f52b1e1` (run `feb68668-448c-4c79-a52d-5b8da2634927-build-dmoznfv2hosg-quality`, re-read November 11). Lockfile-only diff (eight in-range bumps); every major-version jump deliberately deferred with recorded reasons, the vitest 5 migration carries fk149's own follow-up prompt, and its record documents the 3 moderate npm-audit findings left unfixed because `npm audit fix --force` would pull the excluded majors. | Delivered. Routine dependency maintenance with documented deferrals; the deferrals and prompt stay on fk149's record for the weekly dependency-management automation (re-verified unconsumed on November 11). |
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Closed/done 2026-11-07T14:09Z; PR #114, head `283488f` → merge `ba032ac`; native run-quality pass at head `283488f`. Verified in source at this baseline: the darkened `--primary`, the `--primary-on-dark` token and the deterministic contrast test are in [styles.css](../src/styles.css) and [its test](../src/styles.primary-contrast.test.ts). | Delivered. fk153's "in review" description is retired; the two-shade accent repair and its enforcement test are merged. The "Läs mer" hover follow-up from its delivery summary is re-verified November 12 (still at SiteHomePage.tsx:850) and linked as fk198 in the short-term section below. |
| [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152), feature-catalog stamp refresh | Closed/done 2026-11-07T14:17Z; PR #115, head `81093b5` → merge `18da5d9`; native run-quality pass at head `81093b5`; its delivery summary records the validate-features pass at that head while the closed record's issue-level proof projection still reports `missing_evidence` (the owning record is closed/done and the projection does not reopen it). Verified in source at this baseline: `features.json` stamps read 2026-11-07 on all six features. | Delivered. fk153's "in build" description is retired; the story-document stamp re-read it deferred was absorbed by the later fk162/fk172/fk183 reconciliations. |
| [fk153](https://app.faktorial.ai/projects/alvalinus/tasks/fk153), previous roadmap | Closed/done 2026-11-07T14:25Z; PR #116, head `89705da` → merge `e2ca438`; native run-quality pass at head `89705da`. Document read in full during the fk163 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk154/fk155, and its in-flight fk151/fk152 reservations are delivered above. |
| [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155), quote money-logic unit tests | Closed/done 2026-11-07T14:35Z; PR #117, head `41dac58` → merge `2fdfc82`; native run-quality pass at head `41dac58`. Verified in source at this baseline: [quote.test.ts](../src/lib/quote.test.ts) pins both totals' tiering and flags, the sv-SE formatting and the template placeholder contract. | Delivered. The former "money logic exercised only through DOM assertions" gap is retired. |
| [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154), inquiry-page registry declaration | Closed/done 2026-11-07T14:46Z; PR #118, head `8a33f1a` → merge `feef822` (fk163's baseline); native run-quality pass at head `8a33f1a`. Verified in source at this baseline: `content.inquiry` is declared on the typed registry and [InquiryPage.tsx](../src/pages/InquiryPage.tsx) renders registry fields with registry-derived pins. | Delivered. The former "last renderer-side Swedish surface" gap is retired; the route/service registry is now the single Swedish declaration source for the delivered surface. F5's catalog records predated this delivery; fk176's delivery below reconciled them. |
| [fk161](https://app.faktorial.ai/projects/alvalinus/tasks/fk161), services-hero responsive variants | Closed/done 2026-11-08T15:05Z; PR #119, head `2d28b86` (after a repair commit fixing two strict-null test errors) → merge `7396db5`; native run-quality pass at head `2d28b86`. Verified in source at this baseline: `services-hero-640.webp`/`-960.webp` exist, the services route declares `heroPhotoSrcSet`/`heroPhotoSizes`, the stamper emits `imagesrcset`/`imagesizes` exactly for declaring routes, and the gate existence-checks declared candidates. | Delivered. fk163's "in review" description is retired. Its delivery summary's follow-up prompt — migrating the remaining hero srcsets into registry declarations — was consumed by the linked fk177 below, recorded once so the prompt and the task are not duplicated. |
| [fk162](https://app.faktorial.ai/projects/alvalinus/tasks/fk162), feature-catalog reconciliation | Closed/done 2026-11-08T15:23Z; PR #120, head `b81d4e1` → merge `be106db`; native run-quality pass at head `b81d4e1`; its delivery records the validate-features pass on the candidate (digest `dfa2a48a…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6 lists `QuotePageShared.tsx` in both manifests, quote-calculators.md and navigation-and-recovery.md are stamped 2026-11-08, and F4-US1 maps the chrome-rendering test. | Delivered. fk163's "in build" description is retired. Its F5 follow-up shipped as the linked fk176 below. |
| [fk163](https://app.faktorial.ai/projects/alvalinus/tasks/fk163), previous roadmap | Closed/done 2026-11-08T15:27Z; PR #121, head `43c156c` → merge `c084a50`; native run-quality pass at head `43c156c`. Document read in full during the fk173 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk164/fk165 below, and its in-flight fk161/fk162 reservations are delivered above. |
| [fk164](https://app.faktorial.ai/projects/alvalinus/tasks/fk164), dead-hero re-point and gate extension | Closed/done 2026-11-08T15:35Z; PR #122, head `ade983b` → merge `3b19a91`; native run-quality pass at head `ade983b`. Verified in source at this baseline: `/om-oss/` and `/kontakt/` declare the in-tree `svard-entreprenad-about.svg`/`-contact.svg` heroes ([siteContent.ts](../src/data/siteContent.ts):88/:172), no `about-hero.webp`/`contact-hero.webp` exists or is declared, and the gate rejects any route whose declared hero path is missing. | Delivered. fk163's "open next step" description is retired; the dead-reference class is closed at the declaration and gate level. |
| [fk165](https://app.faktorial.ai/projects/alvalinus/tasks/fk165), release-provenance command | Closed/done 2026-11-08T15:44Z; PR #123, head `063e171` → merge `72af228`; native run-quality pass at head `063e171`. Verified in source at this baseline: [release-provenance.mjs](../scripts/release-provenance.mjs), the `write-release-provenance` CLI and its fixture tests exist, and [release-runbook.md](release-runbook.md) references the composed path with publication identity kept operator-recorded. | Delivered. fk163's "open next step" description is retired; the four-identity sequence is one fail-closed command. |
| [fk172](https://app.faktorial.ai/projects/alvalinus/tasks/fk172), feature-catalog re-verification | Closed/done 2026-11-10T08:02Z; PR #124, head `69d1bec` → merge `7931e16`; native run-quality pass at head `69d1bec`; its delivery records the validate-features pass on the candidate (digest `b7527970…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the README reconciliation note and 2026-11-10 stamps on F2/F4/F6, the SVG-hero prose corrections in company-confidence.md and navigation-and-recovery.md, and F5 left at 2026-11-07 on a rationale its own record states ("nothing touched their documented behavior"). | Delivered. The November 9 feature-refinement child, merged November 10. Its F5 rationale did not hold against fk154's post-stamp merge; fk176's delivery corrected the F5 records instead of reopening fk172 work. |
| [fk171](https://app.faktorial.ai/projects/alvalinus/tasks/fk171), WCAG field-border contrast | Closed/done 2026-11-10T14:36Z; PR #125, head `1f6aba4` → merge `ea2d472` (fk173's baseline); native run-quality pass 235/235 at head `1f6aba4`. Verified in source at this baseline: the three field-boundary declarations draw `#64748b` ([QuotePage.css](../src/pages/QuotePage.css):15/:18, [InquiryPage.css](../src/pages/InquiryPage.css):19), [the focused contrast test](../src/styles.field-border-contrast.test.ts) computes the ratio from raw CSS, and `test.css.include` is generalized. | Delivered. The November 9 frontend-optimization child, merged November 10 (after the investigation snapshot recorded it as in build, per the stop-if re-baseline rule). Its delivery summary's follow-up prompt — hardening the contrast test's selector matching against CSS formatting churn — stays on fk171's record; no duplicate issue is created. |
| [fk173](https://app.faktorial.ai/projects/alvalinus/tasks/fk173), previous roadmap | Closed/done 2026-11-10T16:04Z; PR #128, head `e51ccf3` → merge `74ef9ae` (on fk177's `719a11e` base); native run-quality pass at head `e51ccf3`. Document read in full during the fk187 refresh. | Superseded assessment; its two linked next steps were both delivered before it closed — fk176 merged at 15:24Z and fk177 at 15:53Z on November 10 (receipts above and below) — and its works-less-well rows are re-baselined here onto the `9e7dd70` tip. |
| [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176), F5 catalog reconciliation | Closed/done 2026-11-10T15:24Z; PR #126, head `b71a47a` → merge `ab28b45` (fk173's baseline); native run-quality pass 235/235 at head `b71a47a`; the required `validate-features` proof passed on its candidate (aggregate digest `f2589022…`, no findings). Verified in source at this baseline: [staffing-inquiry.md](features/staffing-inquiry.md) stamped 2026-11-10 names the registry-declared `inquiry` copy with InquiryPage.tsx's remaining runtime ownership, the shared inventory's F5 code-path descriptions match the fk154 split, and the README carries the fk176 reconciliation sentence. | Delivered. Created and linked by the fk173 refresh at 14:49:33Z (read back open with labels `priority: medium` and `size:medium`), picked up from the roadmap and merged within roughly half an hour — consuming fk162's dropped F5 follow-up. |
| [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177), remaining hero srcset declarations | Closed/done 2026-11-10T15:53Z; PR #127, head `6a1d0f9` → merge `719a11e` (fk173's base); native run-quality pass at head `6a1d0f9` (run `3fb3ed43-7d2f-4ea2-8b2b-5f86efda0797-build-dmrnb0rhdqyc-quality`, re-read November 11). Verified in source at this baseline: the home, four `*-photo` service-detail, `/tradgardsplanering/` and `/offertberakning/` routes declare `heroPhotoSrcSet`/`heroPhotoSizes` byte-identical to the candidates their heroes rendered before, QuotePage.tsx reads the registry declaration instead of the inline literal, and `/draneringsberakning/` was deliberately left undeclared at that point (no variant family existed and its plain preload already matched). Its own investigation corrected fk173's nine-route count to seven mismatching heroes. | Delivered. fk173's linked Next 2, created and linked at 14:49:50Z (read back open with labels `priority: medium` and `size:medium`), delivered about an hour later. This was the last plain-preload mismatch class; fk185's delivery below completed the declaration set by adding the drainage-quote route. |
| [fk183](https://app.faktorial.ai/projects/alvalinus/tasks/fk183), feature-catalog evidence mapping | Closed/done 2026-11-11T08:52Z; PR #129, head `8c50f1b` → merge `74475bb`; native run-quality pass at head `8c50f1b`; the delivery records the validate-features pass at that head (digest `63fd5b48…`, valid with no findings) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the identity manifest maps the three styles accessibility tests and `quote.test.ts` as 22 technical references at their strongest owning stories (border-contrast → F6-US2/F5-US1, reduced-motion → F4-US3, primary-contrast per declaration, quote totals/formatting → F6-US2 and template/mailto → F6-US5), seven story documents mirror the mappings, F1/F4/F5/F6 and the touched docs carry 2026-11-11 stamps, and the README names all eight mapped test files. | Delivered. The November 11 feature-refinement child. Its documented `.quote-send` token exclusion (delivery-summary comment only — no catalog prose names it, verified November 11) was resolved by fk189's delivery (receipt below). Its follow-up prompt — re-reading F2/F3's source and re-stamping their records to match F1/F4/F5/F6's generation — stays queued on fk183's record. |
| [fk185](https://app.faktorial.ai/projects/alvalinus/tasks/fk185), drainage-quote hero srcset | Closed/done 2026-11-11T15:05Z; PR #130, head `3392f82` (after a one-array test-expectation repair) → merge `5465b66` (fk187's baseline); native run-quality pass at head `3392f82` (run `4089a89a-f737-451b-8978-57a0a2992125-build-dmsgykgpc8wo-quality`, re-read November 11 during the fk187 refresh). Verified in source at this baseline: the drainage-quote route declares `heroPhotoSrcSet` reusing the byte-identical `dranering-photo-400/-640.webp` variants (SHA-256 `d2c8b5f0…78760`, no new binaries) plus the 900w base, DrainageQuotePage reads the registry through QuotePageShell's hero props, and a focused test pins the rendered srcset/sizes. | Delivered. The November 11 frontend-optimization child; with fk177 it closes the whole preload/srcset mismatch class — all nine photo-hero routes now declare registry variants. **Its delivery summary's follow-up prompt is retired as factually stale**: it claims `/offertberakning/` "still hardcodes its srcset with a preload mismatch", but fk177 (PR #127, merge `719a11e`, closed 2026-11-10) already declared that route's srcset and moved QuotePage.tsx onto the registry — verified at this tip (siteContent.ts:25–28, QuotePage.tsx:51, no inline literal). Recorded once so the frontend-optimization automation does not redo delivered work. |
| [fk189](https://app.faktorial.ai/projects/alvalinus/tasks/fk189), accent palette tokenization | Closed/done 2026-11-11T16:46Z; PR #132, head `7d21a757` → merge `3440d65` (directly on fk185's `5465b66`); native run-quality pass at head `7d21a757` (run `3d615243-ae57-4f41-a194-903ea77a62a5-build-dmsj3iyzdvz4-quality`, re-read November 12). Verified in source at this baseline: the quote/inquiry accent roles declare `hsl(var(--primary))`/`hsl(var(--primary-hover))` ([QuotePage.css](../src/pages/QuotePage.css):21/:28/:29/:35-36, [InquiryPage.css](../src/pages/InquiryPage.css):23), `--primary-hover: 18 84% 33%` joined `:root` ([styles.css](../src/styles.css)), [styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts) pins the `.quote-send` white-on-background pairing at ≥4.5:1, and the F6-US5/F5-US2 story records and identity manifest name the test. | Delivered. fk187's linked Next 2, created 16:20:36Z November 11 and delivered within about half an hour of its link. The fk183-documented F6-US5 exclusion is resolved; the focus/selection hex residue fk189 scoped out is recorded under works-less-well above. |
| [fk187](https://app.faktorial.ai/projects/alvalinus/tasks/fk187), previous roadmap | Closed/done 2026-11-11T16:47Z; PR #131, head `1ec5bac` → merge `7eb567e` (on fk189's `3440d65`); native run-quality pass at head `1ec5bac` (run `179d297e-c222-45f7-8ab5-2f620d1b5770-build-dmsj2litfsvo-quality`, re-read November 12). Document read in full during this refresh. | Superseded assessment; its two linked next steps shipped around its own merge — fk189 at 16:46Z and fk188 at 16:53Z on November 11 (receipts above and below) — and its works-less-well rows are re-baselined here onto the `9e7dd70` tip. |
| [fk188](https://app.faktorial.ai/projects/alvalinus/tasks/fk188), per-route social-card imagery | Closed/done 2026-11-11T16:53Z; PR #133, head `71f21f79` → merge `36d7cba` (on fk187's `7eb567e`); native run-quality pass at head `71f21f79` (run `511c7c94-5af9-405a-8acf-1c5635c85136-build-dmsj80kgw840-quality`, re-read November 12). Verified in source at this baseline: the emitter substitutes `og:image`/`og:image:alt`/`twitter:image` from each route's registry-declared `heroPhotoAssetPath` with registry-declared Swedish alt text, the three SVG-hero routes carry the shared raster home hero, the root and 404 documents keep their home-branded sets, and the static gate existence-checks every emitted image path (fk164's pattern extended). | Delivered. fk187's linked Next 1, created 16:20:23Z November 11 and closed delivered about half an hour later. The former "home-branded social cards on every subpage" gap is retired for imagery as fk88 retired it for text. |
| [fk193](https://app.faktorial.ai/projects/alvalinus/tasks/fk193), feature-catalog reconciliation | Closed/done 2026-11-12T09:26Z; PR #134, head `802f378b` → merge `c131651` (on fk188's `36d7cba`); native run-quality pass at head `802f378b` (run `64920971-6743-41d2-a965-6d8fabe9d755-build-dmt4btwcgr4g-quality`, re-read November 12); its required `feature-manifest-integrity` proof passed at acceptance. Verified in source at this baseline: navigation-and-recovery.md describes the drainage-hero variant family with the stale no-variant sentence gone, quote-calculators.md names both quote routes' declared srcsets and fk189's accent-test mapping, features.json carries 2026-11-12 stamps on F4/F6 only, and the README review history records the fk185/fk188/fk189 deltas. | Delivered. The November 12 feature-refinement child. F5 keeps its 2026-11-11 stamp because no reviewed task touched its surfaces beyond fk189's own story-record mapping. |
| [fk195](https://app.faktorial.ai/projects/alvalinus/tasks/fk195), 16px contact-form floor | Closed/done 2026-11-12T15:25Z; PR #135, head `636126c` → merge `9e7dd70` (this baseline, on fk193's `c131651`); native run-quality pass at head `636126c` (run `89ffb78b-1e2d-4f93-859d-b85b1511a4ad-build-dmtc0elqw268-quality`, re-read November 12). Verified in source at this baseline: `CONTACT_FIELD_BASE_CLASS` no longer carries the `sm:text-sm` downgrade, and the focused test pins `text-base` with no responsive text-size override on both the home and `/kontakt/` renderings. | Delivered. The November 12 frontend-optimization child; its delivery summary's real-device verification prompt stays on fk195's record (jsdom cannot reproduce iOS focus zoom). The same defect class on the quote pages is the linked fk199 below. |
| [fk197](https://app.faktorial.ai/projects/alvalinus/tasks/fk197), this roadmap refresh | Open in build at these reads; this document is its candidate. The prepared base is `9e7dd70`, fk195's merge — the exact tip at this refresh's reads, so no re-baselining was needed. | This refresh; supersedes fk187's assessment above. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 12 one, and no row above was reopened or recreated by this refresh:
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
fk151/fk152/fk153/fk155/fk154 heads, the passed runs at the
fk161/fk162/fk163/fk164/fk165/fk172/fk171/fk176 heads, the passed runs at
the fk177/fk173/fk183/fk185 heads, and the passed runs at the
fk189/fk187/fk188/fk193/fk195 heads above) are historical, not
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
its own fresh record (PR #120), the November 9 children closed delivered on
November 10 (fk172 PR #124, fk171 PR #125), the November 10–11 children
closed delivered the same way (fk183 PR #129 at 08:52Z, fk185 PR #130 at
15:05Z), and the November 11–12 children followed the same pattern (fk193
PR #134 at 09:26Z, fk195 PR #135 at 15:25Z on November 12). The steering
loop itself is now the fastest path in the chain: fk176,
linked by fk173 at 14:49Z, was picked up and merged within roughly half an
hour; the previous refresh's two links — fk188 and fk189, both created
16:20Z on November 11 — were closed delivered at 16:53Z and 16:46Z
respectively, about half an hour after creation; and fk195 was created
15:06Z on November 12 and closed at 15:25Z, nineteen minutes later. This
refresh's own two links — fk198 created 17:03:11Z, fk199 17:03:23Z on
November 12 — read back open with exact labels and had not been picked up
at the ~17:04Z inventory read, with their owning records carrying the work
forward. The incident receipts come from
fk153's November 7 owning reads, retained for provenance; no duplicate record
is created for any of them.

## Short-term priorities and issue ownership

fk187's two short-term priorities both shipped with passed native quality
runs, each in about half an hour from link to merge: the per-route
social-card imagery landed through fk188 (PR #133, merge `36d7cba`, closed
16:53Z November 11), and the quote/inquiry accent palette joined the
test-enforced token system through fk189 (PR #132, merge `3440d65`, closed
16:46Z November 11). Both records are reconciled in the table above.

The two follow-up issues created during this refresh cycle (this roadmap
task's own worker writes on November 12, read back open before linking)
target the two concrete recorded debts the delivered work left behind, and
neither had been picked up at the ~17:04Z inventory read:

1. [fk198](https://app.faktorial.ai/projects/alvalinus/tasks/fk198) —
   pin the services "Läs mer" hover contrast to a test-enforced AA token:
   the link at [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850 keeps
   `text-primary` at rest (≈5.5:1 on its white card) but drops the
   `hover:text-primary/80` pairing to ≈4.0:1 (fk151 recorded ≈3.7:1),
   below the 4.5:1 AA threshold for 14px normal text and invisible to the
   token-pinning contrast tests; fk151's delivery summary recorded the
   follow-up on November 7 and no automation child consumed it. The task
   pins the hover state to an AA-compliant token with a deterministic
   test in the fk151/fk171/fk189 pattern. Created and read back open at
   17:03:11Z with labels `priority: medium` and `size:medium`. Owned by
   fk198's record; recorded once here, not awaited or duplicated.
2. [fk199](https://app.faktorial.ai/projects/alvalinus/tasks/fk199) —
   keep the quote-page select and textarea at the 16px iOS focus-zoom
   floor: `.quote-field` sets 14px on the field container
   ([QuotePage.css](../src/pages/QuotePage.css):13) and the
   select/textarea rule (:18) declares no font-size, so both controls
   inherit 14px while inputs render 18px (:16) — the same defect class
   fk195 fixed on the contact form, affecting both `/offertberakning/`
   and `/draneringsberakning/` on iOS Safari. The task raises the
   controls to the 16px floor and adds an fk195-style deterministic
   regression test. Created and read back open at 17:03:23Z with labels
   `priority: medium` and `size:medium`. Owned by fk199's record;
   recorded once here, not awaited or duplicated.

Remaining candidates were judged and dispositioned above: the missing
photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact photographs, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still
await explicit operator decisions; fk149's deferred major-version jumps,
their vitest-5 assessment prompt and the 3 moderate audit findings carry
their own recorded follow-ups on fk149's record for the weekly
dependency-management automation (no newer dependency child has run as of
these reads — cadence, not a stall); fk171's recorded contrast-test
hardening prompt stays on its own delivery record for the recurring
frontend-optimization automation; the factory loop demonstrably consumes
linked work fast, having closed the linked fk188 and fk189 delivered
within about half an hour of their creation; fk183's F2/F3 re-stamp
prompt stays queued on its record for the recurring feature-refinement
automation; fk161's, fk162's and fk176's recorded follow-up prompts were
consumed by delivered work rather than duplicated; and fk185's follow-up
prompt is retired above as factually stale. No further issue is created
in this refresh: every remaining candidate is either operator/editorial
work, carries its own recorded owner, or is already delivered — a
synthetic third task would duplicate one of those queues rather than
steer new work.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
   fk187 → fk197 refresh chain shows the working loop: reconcile, ship,
   re-verify, retire. Separate source delivery, task closure and
   acceptance; missing evidence stays unknown. The loop also absorbs
   stalled deliveries without losing work (fk134's salvage into plan
   fk139), stale starting points without losing accuracy (fk187's
   re-baseline onto the re-prepared tip), and interleaved merges without
   misattributing receipts: fk187's own PR landed between the merges of
   the two tasks it had linked, and this refresh's base is exactly the
   resulting tip. Its steering latency is now measured in minutes to
   hours: fk188 and fk189 were closed delivered about half an hour after
   their links and fk195 nineteen minutes after its automation run
   started, with the owning records carrying the work forward.
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
   keyboard coverage, per-route head and social metadata including
   per-route imagery (fk88/fk188), the unknown-path
   recovery artifact, reduced-motion scrolling, the contact focus ring,
   landmark-complete page structure, per-service guidance and detail depth,
   the first-paint ready boot, registry-declared home sections, shared
   chrome, both quote calculators and the staffing-inquiry page, the
   consolidated quote-page structure, registry-declared responsive WebP
   variants on every photo-hero route with a stamped preload that matches
   the selected candidate (fk161/fk177/fk185), the test-enforced AA
   two-shade accent with the tokenized quote/inquiry CTA palette
   (fk151/fk171/fk189), the 16px field-text floors on the inquiry and
   contact forms (fk195) that stop iOS focus zoom, existing hero
   assets on every route with the gate keeping them that way, and the
   unit-tested money logic are delivered. The remaining visitor-visible
   work is the hover-contrast ceiling (fk198) and the quote-page
   focus-zoom floor (fk199) linked by this refresh, the small hardcoded
   focus/selection hex residue, and approved missing imagery; the
   maintainer-facing catalog records are truthful after fk176's, fk183's
   and fk193's reconciliations. Define useful
   inquiry signals and privacy needs before promising delivery or
   telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 12, this
   checkout's parent holds only the fk193/fk195/fk197 worktrees. Transfer
   demonstrated practices with explicit owners. The autonomous factory
   operates around this static product; it is not an application backend
   to install here.

## Evidence boundaries and update triggers

- Reads made on November 12 during this fk197 refresh: the previous roadmap
  in full (the committed fk187 generation at this checkout's prepared base
  `9e7dd70`, the generation this document supersedes); Git history across
  the `5465b66..9e7dd70` delta — five merges in order: fk189 PR #132 head
  `7d21a757` merge `3440d65`, fk187 PR #131 head `1ec5bac` merge `7eb567e`,
  fk188 PR #133 head `71f21f79` merge `36d7cba`, fk193 PR #134 head
  `802f378b` merge `c131651`, fk195 PR #135 head `636126c` merge `9e7dd70`;
  the prepared base equals fk195's recorded merge commit (its delivery
  receipt names base `c131651` and merge `9e7dd70`), so no re-baselining
  was needed — whether main advanced after these owning reads stays
  unobserved here, not claimed either way. Source verification at this
  HEAD: the `text-primary … hover:text-primary/80` "Läs mer" pairing at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850 with its white
  card surface (`--card: 0 0% 100%`; the resting pairing computes ≈5.5:1
  and the 80%-alpha hover ≈4.0:1, fk151 having recorded ≈3.7:1), the
  quote-page field sizing (`font-size:14px` on `.quote-field` at
  [QuotePage.css](../src/pages/QuotePage.css):13, `input` 18px at :16,
  select/textarea with no font-size at :18), fk189's tokenized accent
  roles at :21/:28/:29/:35-36 and InquiryPage.css:23, the residue
  fk189 deliberately left untouched (`#bc4a12` focus outlines at
  QuotePage.css:20 and InquiryPage.css:22/:27, `#f7c5aa` `::selection` at
  QuotePage.css:22), the 16px inquiry field font at
  [InquiryPage.css](../src/pages/InquiryPage.css):19,
  `--primary-hover: 18 84% 33%` in `:root` of
  [styles.css](../src/styles.css), the vitest/coverage-v8 pins still
  4.1.9 in package.json, and fk189's merged diff (PR #132) covering the
  enumerated accent roles only. Owning `get_task` reads confirmed fk188,
  fk189, fk193, fk195, fk187 and fk149 closed/done with the receipts in
  the table (fk193's validate-features pass recorded at acceptance;
  fk149's deferrals, audit findings and vitest-5 prompt re-read
  unconsumed), the two created tasks fk198/fk199 read back open at
  17:03Z with exact labels, and the open-task inventory (read November
  12, ~17:04Z) held 36 open records: this task, fk198, fk199, the
  worker-host maintenance pair (fk181 waiting with fk182 as its question
  notice — platform work, not site work), and 31 delivery-notice
  records, with no other feature work open or in flight. This checkout's
  parent holds exactly the fk193/fk195/fk197 worktrees (re-verified
  November 12); `../booking` and `../Asynkron.JsEngine` are absent.
  Unchanged structural claims carried from the October 28–November 11
  reviews keep that provenance.
- One-day Faktorial API usage read on November 12 (17:01:24Z) reported
  113,289 calls across 10 endpoints, led by task-record reads
  (GET /api/tasks/{issue_ref}, 112,818), canvas context checks (220) and
  worker-settings reads (92). The same caveats as previous refreshes stand
  and this read is again thinner than its window: the volatile in-memory
  retention covered only 16:58:16Z–17:01:24Z against the one-day request
  (TTL 3600 s), the sampling state is unknown, the retained population was
  truncated by a store cap, and revision comparability is unavailable; the
  364 retained spans that joined to durable route identities did so
  exactly (none unmatched), but that population is a thin window, not a
  demand estimate.
- The serving-process database telemetry read at 17:01:35Z on November 12
  covered a fresh collector epoch (reset 15:55:01Z): at the read its
  cumulative counters span about 1.1 hours — 207,368 calls, 179,879
  queries and 6 errors (2 on architecture source reads, 4 on a
  projected-task upsert), led by the DuePage agent-run reads (15,617
  calls, ≈93.9 MB received), the task-record reads (12,791 calls), the
  claim attempts (9,875 calls driving 39,500 queries) and the paired
  scheduling/command revision reads (15,381 calls each). Cumulative
  counters are not comparable across collector resets. Both populations
  are Cloud serving-process scope, not this static site, and none can be
  combined into an error rate or demand estimate.
- Website traffic, inquiry outcomes and production logs remain unavailable;
  the application has no database. No new privacy or compliance verdict is
  claimed. Exact `../booking` and `../Asynkron.JsEngine` paths are absent in
  this checkout's parent; cross-project operational evidence remains unknown.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Ordinary native quality and review assess the committed candidate; this
  document is not a passing receipt. Refresh when source, task scope/state,
  accepted quality, publication records or adjacent-source availability
  changes; preserve supersession reasons and ownership.
- Bounded-provenance policy, adopted with the fk187 refresh and continued
  by this one: this document
  carries only the current refresh's reads in full. Prior refreshes'
  dated read logs — owning task reads, Git deltas, asset listings,
  API-usage and database-telemetry reads — are compressed to the pointers
  below; each generation's full text stays in Git history at its delivery
  commit (`git log -p -- docs/roadmap.md` from the listed merge).
  - fk187 (November 11): the previous roadmap read in full after
    re-baselining from a stale fk163-generation checkout onto the
    re-prepared `5465b66` tip, the `ab28b45..5465b66` delta
    (fk177/fk173/fk183/fk185), source verification at `5465b66` (registry
    srcset declarations, emitter patterns, accent hexes, hover pairing,
    asset listing), owning reads of fk173/fk177/fk183/fk185/fk149, the
    31-record open inventory, API usage (131,753 calls/13 endpoints) and
    database-telemetry reads under the serving-process caveats — full
    text in Git history at merge `7eb567e` (PR #131).
  - fk173 (November 10): previous-roadmap read in full, the
    `feef822..ea2d472` delta plus the mid-refresh `ab28b45` re-baseline,
    owning reads of fk149/fk161–fk165/fk171–fk173/fk176/fk177, and
    API-usage (125,156 calls/10 endpoints) and database-telemetry reads
    under the serving-process caveats — full text in Git history at merge
    `74ef9ae` (PR #128).
  - fk163 (November 8): fk153-generation read, the `7d1b3dc..feef822`
    delta, source verification and owning reads, API usage (119,640 calls/
    12 endpoints) and telemetry (about 45,483 calls) — merge `c084a50`
    (PR #121).
  - fk153 (November 7): fk123-generation read, the `45105f4..7d1b3dc`
    delta, owning reads and API usage (108,217 calls/12 endpoints) and
    telemetry (about 788,000 calls) — merge `e2ca438` (PR #116).
  - fk123 (November 6): fk113-generation read, the `af2d837..1bb124a`
    delta, owning reads including the 2026-11-04 "close this" closures,
    and the fk134/fk135 creation read-backs — in `docs/roadmap.md`'s Git
    history between the fk113 (`af2d837`, PR #99) and fk153 (`e2ca438`)
    generations.
  - fk113 (November 3), fk105 (November 2), fk96 (November 1), fk87
    (October 31), fk76 (October 30) and the October 29 fk66/fk72 reads:
    owning reads with receipts, Git deltas, asset listings, API-usage and
    database-telemetry reads under the same caveats — full text in
    `docs/roadmap.md`'s Git history before the fk113 generation.
