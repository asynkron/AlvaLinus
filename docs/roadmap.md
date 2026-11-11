# Product and operation roadmap

Reviewed: 2026-11-11 (fk187), source baseline
`5465b660d17d90341a104c84cd5e4f1d512b4217` (main tip, re-verified by
fetching origin at this refresh's build reads). The investigation snapshot
named `5465b66` while this checkout still held fk163's 2026-11-08 roadmap
(base `ab28b45`, whose committed copy must never be treated as current);
preparation advanced this task's base to `5465b66` before build, so the
committed copy is fk173's 2026-11-10 refresh (PR #128, merge `74ef9ae`) —
the generation this document supersedes. Since fk173's own delivery closed
at 16:04Z on November 10, main advanced through fk177's, fk183's and
fk185's merges, and every affected row below is re-baselined from fresh
owning reads at the `5465b66` tip instead of copying the snapshot.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk173's November 10 assessment (PR #128, merge
`74ef9ae`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
fk187: the previous document was read in full and reconciled with exact
merge receipts and current source. Earlier assessments remain in Git;
their ownership is reconciled below and their retained read logs are now
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

Since the November 10 review, main advanced from `ab28b45` (fk173's
reviewed baseline) to `5465b66` (this baseline) through four merges in
order:

- **fk177** (PR #127, head `6a1d0f9` → merge `719a11e`, closed
  2026-11-10T15:53Z; run-quality pass at head `6a1d0f9`) declared
  registry `heroPhotoSrcSet`/`heroPhotoSizes` for the seven photo-hero
  routes whose stamped preloads did not describe their selected
  candidates — the home hero, the four `*-photo` service-detail heroes,
  `/tradgardsplanering/` and `/offertberakning/` — and moved
  QuotePage.tsx's inline quote-hero srcset literal into the registry, so
  the stamped preload's `imagesrcset`/`imagesizes` describe exactly what
  each img can select. `/draneringsberakning/` was deliberately left
  undeclared at that point (its plain preload already matched; no
  variant family existed). This was fk173's linked Next 2.
- **fk173** (PR #128, head `e51ccf3` → merge `74ef9ae`, on fk177's
  `719a11e` base, closed 2026-11-10T16:04Z; run-quality pass at head
  `e51ccf3`) delivered the previous roadmap refresh that this document
  supersedes.
- **fk183** (PR #129, head `8c50f1b` → merge `74475bb`, closed
  2026-11-11T08:52Z; run-quality pass at head `8c50f1b`) mapped the
  three styles accessibility tests and
  [quote.test.ts](../src/lib/quote.test.ts) into the feature catalog as
  22 technical test references at their strongest owning stories,
  mirrored the mappings in seven story documents, re-stamped the touched
  records and `reviewed_against_source` for F1/F4/F5/F6 to 2026-11-11,
  and updated the catalog README's evidence-contract sentence to name
  all eight mapped test files. Its native `validate-features` pass is
  recorded at head `8c50f1b` (aggregate digest `63fd5b48…`, no
  findings), while the closed record's issue-level proof projection
  still reports `missing_evidence` — the owning record is closed/done
  and the projection does not reopen it. F2/F3 were intentionally left
  untouched, with a re-stamp follow-up prompt queued on fk183's record.
- **fk185** (PR #130, head `3392f82` → merge `5465b66`, this baseline,
  closed 2026-11-11T15:05Z; run-quality pass at head `3392f82`)
  completed the hero-srcset class: the drainage-quote route now declares
  `heroPhotoSrcSet` (reusing the byte-identical `dranering-photo` 400w/
  640w variants, SHA-256 `d2c8b5f0…78760` — no new binaries) and
  DrainageQuotePage reads the registry through QuotePageShell's hero
  props, with a one-array test-expectation repair (`3392f82`) after the
  candidate-path dedupe correctly dropped the reused variants.

The visitor-facing baseline is a complete self-service surface whose Swedish
text is declared in the typed registry on every delivered surface, whose
accent and form-field contrast are test-enforced, whose quote money logic is
unit-tested, and every declared hero asset exists with the gate keeping it
that way. Every photo-hero route's stamped preload now describes exactly
the candidates its img selects (fk177/fk185). What remains inside the
delivered surface is the absent per-route social-card imagery (fk188, in
build at these reads) and the declared but undelivered editorial
photography — not new visitor capability.

No unclaimed feature work is open at this refresh's closing reads (November
11, ~16:28Z): both issues this refresh's investigation created — fk188 and
fk189 — were picked up from the roadmap within minutes of being linked
(fk188 in build by 16:26Z with no PR yet, fk189 in investigate), recorded
once below and owned by their own records. The dependency-management
automation has still not produced a child since fk149 on November 7 — that
automation runs weekly (`task_recurrence` 1w), so the silence is cadence,
not a stall; its vitest-5, major-jump and audit prompts stay on fk149's
record, re-read unconsumed on November 11. The open inventory holds 31
records: this task, fk188, fk189, the operator-owned worker-host
maintenance pair (fk181 waiting on host disk space with fk182 as its
question notice — platform work, not site work) and 26 delivery-notice
records, with no other feature work open or in flight.

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
  undeclared, because no variant families exist for them.
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
  the real owning tests.
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
  preload form); the release-provenance composition, artifact manifest and
  quality-evidence modules each carry their own node-env fixture tests
  ([release-provenance.test.mjs](../scripts/release-provenance.test.mjs),
  [artifact-manifest.test.mjs](../scripts/artifact-manifest.test.mjs),
  [quality-evidence.test.mjs](../scripts/quality-evidence.test.mjs)); the
  reduced-motion override, the primary-contrast tokens and the form-field
  borders have their own focused stylesheet tests, and the quote lib boundary
  is covered by [quote.test.ts](../src/lib/quote.test.ts). This refresh
  inspected source and owning records; it did not execute those tests.
- The feature catalog covers the whole route surface: six features F1–F6
  with the quote calculators documented as F6 (fk133), validate-features
  passes recorded in fk162's, fk172's, fk176's and fk183's deliveries (the
  closed records' issue-level proof projections still report
  `missing_evidence`; the owning records are closed/done and the
  projections do not reopen them), the README reconciliation note covering
  fk135/fk162/fk164/fk176 and fk183's 2026-11-11 evidence-map line, the
  README evidence-contract sentence naming all eight mapped test files
  after fk183, F1/F4/F5/F6 re-stamped 2026-11-11 from fresh reads (F2/F3
  deliberately deferred to fk183's queued follow-up), and the
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
  which have no preload.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift (`npm outdated` wanted == current after
  its refresh), every major-version jump is deferred with a recorded reason,
  and the vitest 5 migration carries its own follow-up prompt on fk149's
  record. The dependency-management automation runs weekly
  (`task_recurrence` 1w), so no child since fk149 on November 7 is its
  cadence, not a stall — re-read on November 11: fk149's record still
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
  tasks: this is the thirteenth consecutive roadmap refresh, each reconciling
  the previous one against owning records before linking new work. The
  loop's throughput is visible in this baseline: four merges landed between
  fk173's review and this tip in about a day (fk177, fk173 itself, fk183
  and fk185), and the steering loop now closes in minutes: fk188 was
  created at 16:20:23Z and was in build by 16:26Z, about six minutes
  later. The loop also absorbs adverse starts without losing accuracy: this
  refresh began in a checkout whose committed roadmap was fk163's
  two-generations-old copy, verified the real tip by fetching origin,
  advanced onto the re-prepared fk173-generation base, and re-baselined
  onto the actual current generation instead of editing the stale text.

### What works less well and what to improve

- Social-card imagery is still home-branded on every subpage: the
  per-subpage emitter replaces exactly the four `og:title`,
  `og:description`, `twitter:title` and `twitter:description` head values
  ([route-artifacts.mjs](../scripts/route-artifacts.mjs):11–14, requirement
  text at :432) and touches no image tags, so all eleven subpage documents
  ship the home page's hero photo — and its home-page Swedish alt text — as
  their `og:image`/`twitter:image`. Sharing `/kontakt/` or
  `/draneringsberakning/` renders a home-branded picture. fk88 delivered
  the title/description half of this class; the image half is fk188's
  linked delivery (in build at these reads), sourcing
  `og:image`/`twitter:image` from each route's registry-declared
  `heroPhotoAssetPath` with the existing gate machinery.
- The quote and inquiry pages hardcode an orange accent palette outside
  fk151's two-shade token system: `accent-color`/`caret-color` `#bf4911`
  ([QuotePage.css](../src/pages/QuotePage.css):21,
  [InquiryPage.css](../src/pages/InquiryPage.css):23), the hover shades
  `#9f390b` (:28, :29, :36), and the send button's `#bc4811`/white (:35) —
  while every other primary surface renders `hsl(var(--primary))`
  ([styles.css](../src/styles.css):12–14). The deterministic
  primary-contrast test pins the shared Button variant but cannot see these
  hexes, so the quote CTA sits outside test-enforced contrast — the exact
  exclusion fk183's delivery documented (verified November 11: it is
  recorded only in fk183's delivery-summary comment, not in catalog prose;
  white on `#bc4811` is ≈5.0:1, so this is consistency and test-coverage
  debt, not a failure). fk189's linked delivery (in investigate at these
  reads) pins the palette to the tokens and adds the CTA pairing test so
  the catalog exclusion becomes resolvable.
- fk151's delivery summary recorded one remaining hover-state contrast
  ceiling — the Services card "Läs mer" link's `hover:text-primary/80`
  pairing (~3.7:1 on its card, still present at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850, re-verified November
  11) — as a follow-up prompt for the recurring frontend-optimization
  automation; this refresh creates no duplicate issue for it.
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
- fk149's documented deferrals stand, re-verified on November 11 with no
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
refresh, and again on November 11 during this fk187 refresh. The checkout
advanced from fk173's `ab28b45` baseline to `5465b66` (this baseline)
through the fk177, fk173, fk183 and fk185 merges in that order (PRs #127,
#128, #129 and #130). All four are closed/done with merge receipts and
passed native run-quality runs (receipts below); fk183's closed record
carries the issue-level proof-projection artifact fk133's, fk152's,
fk162's, fk172's and fk176's did — its `missing_evidence` proof row sits
beside the recorded validate-features pass at its head `8c50f1b` — and the
disposition stays Delivered; the projection does not reopen a closed
record. During the November 11 owning reads, fk188 and fk189, created
during this refresh cycle (16:20:23Z and 16:20:36Z), read back open with
labels `priority: medium` and `size:medium`; fk188 was already in build
(16:26Z read, no PR yet) and fk189 in investigate — the loop consumed both
links within minutes.

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
| [fk88](https://app.faktorial.ai/projects/alvalinus/tasks/fk88), per-route social card metadata | Closed/done; PR #89, merge `ee4d635`; quality 131/131 at head `64d2955`. Now reachable from this HEAD (during fk105's investigation it existed only in the local object store). Verified in source: the emission replaces all four `og:`/`twitter:` head values with the registry-composed title/description, the assertion validates subpages against root-text mismatches, and the root document keeps its global values. | Delivered. The former "home-branded social cards on every subpage" gap is retired for text — the image half of the same class is the linked fk188 below, still open at these reads. |
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
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Closed/done 2026-11-07T14:09Z; PR #114, head `283488f` → merge `ba032ac`; native run-quality pass at head `283488f`. Verified in source at this baseline: the darkened `--primary`, the `--primary-on-dark` token and the deterministic contrast test are in [styles.css](../src/styles.css) and [its test](../src/styles.primary-contrast.test.ts). | Delivered. fk153's "in review" description is retired; the two-shade accent repair and its enforcement test are merged. The "Läs mer" hover follow-up from its delivery summary stays on fk151's record (still present at SiteHomePage.tsx:850, re-verified November 11). |
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
| [fk173](https://app.faktorial.ai/projects/alvalinus/tasks/fk173), previous roadmap | Closed/done 2026-11-10T16:04Z; PR #128, head `e51ccf3` → merge `74ef9ae` (on fk177's `719a11e` base); native run-quality pass at head `e51ccf3`. Document read in full during this fk187 refresh. | Superseded assessment; its two linked next steps were both delivered before it closed — fk176 merged at 15:24Z and fk177 at 15:53Z on November 10 (receipts above and below) — and its works-less-well rows are re-baselined here onto the `5465b66` tip. |
| [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176), F5 catalog reconciliation | Closed/done 2026-11-10T15:24Z; PR #126, head `b71a47a` → merge `ab28b45` (fk173's baseline); native run-quality pass 235/235 at head `b71a47a`; the required `validate-features` proof passed on its candidate (aggregate digest `f2589022…`, no findings). Verified in source at this baseline: [staffing-inquiry.md](features/staffing-inquiry.md) stamped 2026-11-10 names the registry-declared `inquiry` copy with InquiryPage.tsx's remaining runtime ownership, the shared inventory's F5 code-path descriptions match the fk154 split, and the README carries the fk176 reconciliation sentence. | Delivered. Created and linked by the fk173 refresh at 14:49:33Z (read back open with labels `priority: medium` and `size:medium`), picked up from the roadmap and merged within roughly half an hour — consuming fk162's dropped F5 follow-up. |
| [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177), remaining hero srcset declarations | Closed/done 2026-11-10T15:53Z; PR #127, head `6a1d0f9` → merge `719a11e` (fk173's base); native run-quality pass at head `6a1d0f9` (run `3fb3ed43-7d2f-4ea2-8b2b-5f86efda0797-build-dmrnb0rhdqyc-quality`, re-read November 11). Verified in source at this baseline: the home, four `*-photo` service-detail, `/tradgardsplanering/` and `/offertberakning/` routes declare `heroPhotoSrcSet`/`heroPhotoSizes` byte-identical to the candidates their heroes rendered before, QuotePage.tsx reads the registry declaration instead of the inline literal, and `/draneringsberakning/` was deliberately left undeclared at that point (no variant family existed and its plain preload already matched). Its own investigation corrected fk173's nine-route count to seven mismatching heroes. | Delivered. fk173's linked Next 2, created and linked at 14:49:50Z (read back open with labels `priority: medium` and `size:medium`), delivered about an hour later. This was the last plain-preload mismatch class; fk185's delivery below completed the declaration set by adding the drainage-quote route. |
| [fk183](https://app.faktorial.ai/projects/alvalinus/tasks/fk183), feature-catalog evidence mapping | Closed/done 2026-11-11T08:52Z; PR #129, head `8c50f1b` → merge `74475bb`; native run-quality pass at head `8c50f1b`; the delivery records the validate-features pass at that head (digest `63fd5b48…`, valid with no findings) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the identity manifest maps the three styles accessibility tests and `quote.test.ts` as 22 technical references at their strongest owning stories (border-contrast → F6-US2/F5-US1, reduced-motion → F4-US3, primary-contrast per declaration, quote totals/formatting → F6-US2 and template/mailto → F6-US5), seven story documents mirror the mappings, F1/F4/F5/F6 and the touched docs carry 2026-11-11 stamps, and the README names all eight mapped test files. | Delivered. The November 11 feature-refinement child. Its documented `.quote-send` token exclusion (delivery-summary comment only — no catalog prose names it, verified November 11) is resolved by the linked fk189 below. Its follow-up prompt — re-reading F2/F3's source and re-stamping their records to match F1/F4/F5/F6's generation — stays queued on fk183's record. |
| [fk185](https://app.faktorial.ai/projects/alvalinus/tasks/fk185), drainage-quote hero srcset | Closed/done 2026-11-11T15:05Z; PR #130, head `3392f82` (after a one-array test-expectation repair) → merge `5465b66` (this baseline); native run-quality pass at head `3392f82` (run `4089a89a-f737-451b-8978-57a0a2992125-build-dmsgykgpc8wo-quality`, re-read November 11). Verified in source at this baseline: the drainage-quote route declares `heroPhotoSrcSet` reusing the byte-identical `dranering-photo-400/-640.webp` variants (SHA-256 `d2c8b5f0…78760`, no new binaries) plus the 900w base, DrainageQuotePage reads the registry through QuotePageShell's hero props, and a focused test pins the rendered srcset/sizes. | Delivered. The November 11 frontend-optimization child; with fk177 it closes the whole preload/srcset mismatch class — all nine photo-hero routes now declare registry variants. **Its delivery summary's follow-up prompt is retired as factually stale**: it claims `/offertberakning/` "still hardcodes its srcset with a preload mismatch", but fk177 (PR #127, merge `719a11e`, closed 2026-11-10) already declared that route's srcset and moved QuotePage.tsx onto the registry — verified at this tip (siteContent.ts:25–28, QuotePage.tsx:51, no inline literal). Recorded once so the frontend-optimization automation does not redo delivered work. |
| [fk187](https://app.faktorial.ai/projects/alvalinus/tasks/fk187), this roadmap refresh | Open in build at these reads; this document is its candidate. The prepared base advanced from the stale `ab28b45` checkout (fk163's committed text) to the `5465b66` tip before editing — verified against origin by fetching; origin/main read `5465b66` at both the investigation and build reads. | This refresh; supersedes fk173's assessment above. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 11 one, and no row above was reopened or recreated by this refresh:
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
fk161/fk162/fk163/fk164/fk165/fk172/fk171/fk176 heads, and the passed runs at
the fk177/fk173/fk183/fk185 heads above) are historical, not
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
November 10 (fk172 PR #124, fk171 PR #125), and the November 10–11 children
closed delivered the same way (fk183 PR #129 at 08:52Z, fk185 PR #130 at
15:05Z). The steering loop itself is now the fastest path in the chain: fk176,
linked by fk173 at 14:49Z, was picked up and merged within roughly half an
hour, and this refresh's two links — fk188 created 16:20:23Z, fk189
16:20:36Z — were in build and investigate respectively by 16:26Z, about six
minutes after creation. The incident receipts come from
fk153's November 7 owning reads, retained for provenance; no duplicate record
is created for any of them.

## Short-term priorities and issue ownership

fk173's two short-term priorities both shipped with passed native quality
runs: the F5 staffing-inquiry catalog reconciliation landed through fk176
(PR #126, merged 15:24Z November 10, before fk173 itself closed), and the
seven preloaded heroes whose srcsets their preloads did not describe are
registry-declared through fk177 (PR #127, merge `719a11e`, closed 15:53Z)
— with fk185's drainage-quote delivery (PR #130) completing the declaration
set the next morning. Both records are reconciled in the table above.

The two follow-up issues created during this refresh cycle (this roadmap
task's own worker writes on November 11, read back open before linking;
build creates no new issue) were both picked up by the loop within minutes:

1. [fk188](https://app.faktorial.ai/projects/alvalinus/tasks/fk188) —
   declare per-route `og:image` and `twitter:image` from the route
   registry: the emitter replaces only the four `og:title`/
   `og:description`/`twitter:title`/`twitter:description` head values
   ([route-artifacts.mjs](../scripts/route-artifacts.mjs):11–14/:432), so
   all eleven subpage documents ship the home hero — and its home-page
   Swedish alt text — as their social image; fk88 delivered the
   text half of this class, and fk112's registry-declared
   `heroPhotoAssetPath` with fk164's existence-gate pattern supply the
   machinery. **In build at these reads** (16:26Z, no PR yet): created
   and linked at 16:20:23Z, read back open with labels `priority: medium`
   and `size:medium`. Owned by fk188's record; recorded once here, not
   awaited or duplicated.
2. [fk189](https://app.faktorial.ai/projects/alvalinus/tasks/fk189) —
   pin the quote and inquiry accent palette to the test-enforced primary
   tokens: `QuotePage.css` :21/:28/:29/:35-36 and `InquiryPage.css`:23
   hardcode `#bf4911`/`#9f390b`/`#bc4811` outside fk151's token system,
   invisible to the primary-contrast test (white on `#bc4811` is ≈5.0:1,
   so this is consistency and test-coverage debt, not a contrast failure);
   the change replaces the hexes with token-based declarations, adds a
   deterministic CTA-pairing test in the fk151/fk171 raw-CSS pattern, and
   resolves the catalog exclusion fk183 documented for F6-US5. **In
   investigate at these reads**: created and linked at 16:20:36Z, read
   back open with labels `priority: medium` and `size:medium`. Owned by
   fk189's record; recorded once here, not awaited or duplicated.

Remaining candidates were judged and dispositioned above: the missing
photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact photographs, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still
await explicit operator decisions; fk149's deferred major-version jumps,
their vitest-5 assessment prompt and the 3 moderate audit findings carry
their own recorded follow-ups on fk149's record for the weekly
dependency-management automation (no newer dependency child has run as of
these reads — cadence, not a stall); fk151's recorded "Läs mer" hover
follow-up and fk171's recorded contrast-test hardening prompt stay on
their own delivery records for the recurring frontend-optimization
automation — which demonstrably consumes linked work fast, having picked
up fk185 and fk188 within minutes of their links; fk183's F2/F3 re-stamp
prompt stays queued on its record for the recurring feature-refinement
automation; fk161's and fk162's recorded follow-up prompts were consumed
by fk177 (delivered) and fk176 (delivered) rather than duplicated; and
fk185's follow-up prompt is retired above as factually stale. No further
issue is created in this refresh: every remaining candidate is either
operator/editorial work, carries its own recorded owner, or is already
delivered — a synthetic third task would duplicate one of those queues
rather than steer new work.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
   fk187 refresh chain shows the working loop: reconcile, ship, re-verify,
   retire. Separate source delivery, task closure and acceptance; missing
   evidence stays unknown. The loop also absorbs stalled deliveries without
   losing work (fk134's salvage into plan fk139) and stale starting points
   without losing accuracy: this refresh began in a checkout two generations
   behind main and re-baselined onto the re-prepared tip instead of editing
   the stale copy. Its steering latency is now measured in minutes: both
   next steps this refresh linked were picked up from this document within
   about six minutes, with their owning records carrying the work forward.
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
   consolidated quote-page structure, registry-declared responsive WebP
   variants on every photo-hero route with a stamped preload that matches
   the selected candidate (fk161/fk177/fk185), the test-enforced AA
   two-shade accent and AA-contrast form-field boundaries, existing hero
   assets on every route with the gate keeping them that way, and the
   unit-tested money logic are delivered. The remaining visitor-visible
   work is per-route social-card imagery (fk188, in build), the
   token-consistent quote/inquiry accent palette (fk189, in investigate)
   and approved missing imagery; the maintainer-facing catalog records are
   truthful after fk176's and fk183's reconciliations. Define useful
   inquiry signals and privacy needs before promising delivery or
   telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 11, this
   checkout's parent holds only the fk183/fk185/fk187/fk188/fk189
   worktrees. Transfer demonstrated practices with explicit owners. The
   autonomous factory operates around this static product; it is not an
   application backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 11 during this fk187 refresh: the previous roadmap
  in full (fk173's revision at the re-prepared base `5465b66`, the
  generation this document supersedes); Git tip verification (`git
  ls-remote origin refs/heads/main` and a fetch: origin/main read
  `5465b66` at the investigation reads (~16:15Z) and again at this build's
  verification (~16:24Z), matching this task's prepared base, so no
  mid-refresh advance occurred); the `ab28b45..5465b66` history (fk177 PR
  #127 head `6a1d0f9` merge `719a11e`, fk173 PR #128 head `e51ccf3` merge
  `74ef9ae`, fk183 PR #129 head `8c50f1b` merge `74475bb`, fk185 PR #130
  head `3392f82` merge `5465b66`); source verification at this HEAD: the
  quote route's `heroPhotoAssetPath`/`heroPhotoSrcSet`/`heroPhotoSizes`
  declarations at [siteContent.ts](../src/data/siteContent.ts):25–28 and
  the drainage-quote declarations at :34–37 (nine routes declare
  `heroPhotoSrcSet` — :26/:35/:52/:68/:112/:129/:146/:164/:181 — and the
  three SVG-hero routes do not), [QuotePage.tsx](../src/pages/QuotePage.tsx):51
  and [DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx):27 passing
  the registry srcset/sizes through QuotePageShell with no inline literal,
  `responsiveImageSrcSet` surviving only at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):41/:707 (PageHero
  fallback) and :794 (lazy service cards), the emitter's four social
  patterns and requirement text at
  [route-artifacts.mjs](../scripts/route-artifacts.mjs):11–14/:432 with no
  `og:image`/`twitter:image` substitution, the accent hexes at
  [QuotePage.css](../src/pages/QuotePage.css):21/:28/:29/:35–36 and
  [InquiryPage.css](../src/pages/InquiryPage.css):23 with the token
  definitions at [styles.css](../src/styles.css):12–14, the
  `hover:text-primary/80` "Läs mer" pairing at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850, a fresh
  `public/page-visuals` listing (all declared variant families present,
  `draneringsberakning-hero.webp` byte-identical to `dranering-photo.webp`
  at 123 752 bytes each, no `about-hero.webp`/`contact-hero.webp`,
  `tradgard-generated.webp` ~502 KB still present), and no catalog prose
  naming the `.quote-send`/`#bc4811` exclusion (it lives only in fk183's
  delivery-summary comment). Owning `get_task` reads confirmed fk173,
  fk177, fk183, fk185 and fk149 closed/done with the receipts in the
  table (fk183's validate-features pass recorded at head `8c50f1b`, digest
  `63fd5b48…`, with its issue-level proof projection still
  `missing_evidence`; fk149's deferrals, audit findings and vitest-5
  prompt re-read unconsumed), and fk188/fk189 read back open with exact
  labels (fk188 in build by 16:26Z with no PR yet at the 16:28Z read,
  fk189 in investigate at the 16:25Z read). The open-task inventory (read
  November 11, ~16:27Z) held 31 open records: this task, fk188, fk189,
  the worker-host maintenance pair (fk181 waiting with fk182 as its
  question notice — platform work, not site work), and 26 delivery-notice
  records, with no other feature work open or in flight. This checkout's
  parent holds exactly the fk183/fk185/fk187/fk188/fk189 worktrees
  (re-verified November 11); `../booking` and `../Asynkron.JsEngine` are
  absent. Unchanged structural claims carried from the October 28–November
  10 reviews keep that provenance.
- One-day Faktorial API usage read on November 11 (16:30:35Z) reported
  131,753 calls across 13 endpoints, led by canvas context checks (66,884)
  and task reads (64,118). The same caveats as previous refreshes stand
  and this read is again thinner than its window: the volatile in-memory
  retention covered only 16:23:37Z–16:30:34Z against the one-day request
  (TTL 3600 s), the sampling state is unknown, the retained population was
  truncated by a store cap, and revision comparability is unavailable; the
  421 retained spans that joined to durable route identities did so
  exactly (none unmatched), but that population is a thin window, not a
  demand estimate.
- The serving-process database telemetry read at the same minute covered a
  fresh collector epoch (reset 09:58:03Z on November 11): at the 16:30Z
  read its cumulative counters span about 6.5 hours — about 1,481,088
  calls, 1,331,915 queries and 11 errors, led by credential-identity
  reads (350,690 calls, 2 errors), the DuePage agent-run reads (86,834
  calls), task-record reads (68,986 calls) and the scheduling/command
  revision reads (93,531 calls each). Cumulative counters are not
  comparable across collector resets. Both populations are Cloud
  serving-process scope, not this static site, and none can be combined
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
- Bounded-provenance policy, adopted with this refresh: this document
  carries only the current refresh's reads in full. Prior refreshes'
  dated read logs — owning task reads, Git deltas, asset listings,
  API-usage and database-telemetry reads — are compressed to the pointers
  below; each generation's full text stays in Git history at its delivery
  commit (`git log -p -- docs/roadmap.md` from the listed merge).
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
