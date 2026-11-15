# Product and operation roadmap

Reviewed: 2026-11-15 (fk231), source baseline
`80eb6bd3943da14bc29ea2bcf9e63a8ae8a45cf0` (this task's prepared base,
which is fk228's merge — the origin/main tip re-read at these build
reads). The previous generation was read in full from this checkout's
committed copy, which holds exactly the fk219 refresh (PR #147, merge
`778998e`). fk231's own investigate base was stale — its November 15
handoff was written from the pre-fk219 `c3f9ede` checkout before the
four deliveries it reconciles below merged — so the coordinator
re-prepared this worktree onto the resulting tip, and every affected
row below is re-baselined from fresh owning reads at the `80eb6bd` tip
instead of copying the snapshot, continuing the fk187/fk197/fk219
precedent.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk219's November 14 assessment (PR #147, merge
`778998e`) and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
fk187 → fk197 → fk207 → fk219 → fk231: the previous document was read in
full and reconciled with exact merge receipts and current source. Earlier
assessments remain in Git; their ownership is reconciled below and their
retained read logs are compressed to pointers (see Evidence boundaries).

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 14 review, main advanced from `c3f9ede` (fk219's
reviewed baseline, fk215's merge) to `80eb6bd` (this baseline) through
four merges in order:

- **fk219** (PR #147, head `a689906` → merge `778998e`, closed
  2026-11-14T18:38Z; run-quality pass at head `a689906`) delivered the
  previous roadmap refresh that this document supersedes, reconciling
  the post-fk215 tip and linking the two follow-ups below it.
- **fk221** (PR #148, head `68d055f` → merge `7dca1af`, closed
  2026-11-14T18:40Z, seventeen minutes after fk219 linked it; run-quality
  pass at head `68d055f`) gave the empty-services fallback a
  registry-declared Swedish contact action: the availability notice now
  renders one keyboard-reachable action whose label and destination
  resolve from the typed chrome registry
  ([StaticState.tsx](../src/components/StaticState.tsx) extended with an
  optional action prop, pinned by the extended empty-services tests in
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx)), exactly
  the F4 friction fk219 had linked — a visitor who hits the fallback no
  longer dead-ends.
- **fk227** (PR #150, head `aa0afe9` → merge `4822524`, closed
  2026-11-15T17:17Z; run-quality pass 268/268 at head `aa0afe9`; its
  required `validate-features` proof passed on its candidate and its
  delivery records the verifier rerunning it independently on the merged
  candidate) was the feature-refinement automation's November 15 child:
  it mapped fk215's hash-switch keyboard-focus behavior and its
  QuotePage test declaration into the F6-US1 story records, re-stamped
  F6 and the touched docs 2026-11-15 from a fresh source read, and left
  the route table and every other feature record unchanged.
- **fk228** (PR #151, head `283f8f5` → merge `80eb6bd`, this baseline,
  closed 2026-11-15T17:34Z; run-quality pass 285/285 at head `283f8f5`)
  was the frontend-optimization automation's November 15 child: the
  build now injects preload links for the emitted woff2 font assets
  (76.7 KB) into every emitted document head — root, every subpage and
  `dist/404.html` — each tag carrying `as="font"`, `type="font/woff2"`,
  `crossorigin` and the exact hashed href of that build, so font fetch
  starts at HTML parse time instead of after the CSS bundle; the
  static gate now requires exactly those tags byte-for-byte, and 17 new
  fixture tests took the suite from 268 to 285 checks.

In parallel, **fk220** (PR #149, head `140a735` on branch
`agent-go/task-fk220`, opened against base `7dca1af`) remains **open and
unmerged**: its branch carries the complete in-place recompression of
the three sibling full-size heroes (stensattning-photo 385,866 →
262,640 B, quote-hero 362,898 → 253,714 B, services-hero 345,948 →
241,842 B, dimensions and declarations unchanged), canonical quality
passed 268/268 at that head, and the push landed before review ran —
but the review stage's net-change gate counts only textual diff lines
(`git diff --numstat` prints `-` for the three binaries), so it
returned "zero net changes" and bounced the binaries-only PR. The task
now waits on the operator's decision recorded as build-clarification
[fk224](https://app.faktorial.ai/projects/alvalinus/tasks/fk224) (open
since 2026-11-14T19:27Z, unanswered at these reads). The savings are
**not on main**: the three heroes still measure 385,866 / 362,898 /
345,948 B at this tip (re-measured 2026-11-15), so the roadmap treats
fk220 as unresolved blocking work, records its measured per-file
numbers from its owning record, and creates no duplicate recompression
task (see What works less well and Factory friction).

The visitor-facing baseline is a complete self-service surface whose Swedish
text is declared in the typed registry on every delivered surface, whose
accent family is declared entirely through the token system — CTA, hover,
focus-visible outlines and text selection included, each test-enforced —
whose quote money logic is unit-tested, every declared hero asset exists with
the gate keeping it that way, every photo-hero route's stamped preload
describes exactly the candidates its img selects (fk177/fk185), every
subpage's social card previews that page's own imagery (fk188), no delivered
form control zooms on iOS focus (fk195 on the contact form, fk199 on both
quote pages), the heaviest single hero download shrank by about a third
(fk209), the empty-services fallback guides visitors to a declared contact
surface instead of dead-ending (fk221), and every emitted document now
preloads the site fonts at parse time behind a build-time gate (fk228).
What remains inside the delivered surface is the unmerged sibling-hero
recompression (fk220's PR #149, blocked on the fk224 operator decision),
the two newly linked calculator debts (fk232 and fk233, below) and the
declared but undelivered editorial photography, not new visitor capability.

The open inventory at this refresh's closing reads (November 15,
~18:52Z) held exactly eleven records: this task; fk220 waiting on the
fk224 human decision; fk224 itself (the build-clarification record);
fk225 (the worker-host C: free-space watch, a platform record with no
project impact); the fk226–fk230 and fk216–fk218 delivery notices; and
the two follow-up issues this refresh creates (fk232, fk233). The
recurring automations stayed on cadence: the feature-refinement stream
delivered fk227 and the frontend-optimization stream delivered fk228 on
November 15, each closing delivered with a passed run-quality run and —
for fk227 — an independently rerun validate-features proof.

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
  routes, consumed by both the renderer and the preload stamper. Only the
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
- Contrast, form-field sizing and now the whole accent family are enforced
  by test rather than by one-off repairs on every front they were repaired:
  fk151 (PR #114) darkened the light-surface `--primary` token, added
  `--primary-on-dark` for the navy surfaces, reclassified every dark-surface
  accent usage, and [its deterministic test](../src/styles.primary-contrast.test.ts)
  parses the stylesheet tokens and asserts the ≥4.5:1 pairings with a
  hue-family guard; since fk171 (PR #125) the quote and inquiry form-field
  boundaries draw `#64748b` (~4.8:1 on white, up from ~1.8:1), guarded by
  [a focused test](../src/styles.field-border-contrast.test.ts) that imports
  both page stylesheets with `?raw` and requires ≥3:1; fk189 (PR #132)
  tokenized the quote/inquiry CTA accent and pinned the `.quote-send`
  pairing at ≥4.5:1
  ([styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts));
  fk195 (PR #135) put the contact form's controls on the 16px zoom floor
  with a rendered-class assertion on both its home and `/kontakt/`
  renderings; fk198 (PR #137) pinned the services "Läs mer" hover to the
  AA-enforced `--primary-hover` token with a compiled-utility test proving
  the Tailwind mapping actually generates the token's CSS; fk199 (PR #136)
  put both quote calculators' select and textarea on the same 16px floor
  under a focused stylesheet test; fk205 (PR #140) added the read-more
  pairing test that alpha-composites any opacity modifier over the card,
  so a wash like the retired `/80` hover (≈3.96:1) fails by construction;
  and fk208 (PR #142) extended the page-accent test to the focus-visible
  outlines and selection pair, so the accent family has no undeclared
  member left. fk183 (PR #129), fk203 (PR #139) and fk213 (PR #146) mapped
  the delivered tests into the feature catalog as technical evidence at
  their strongest owning stories, so the catalog's evidence map names the
  real owning tests.
- The quote pages' structure is owned once: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx)
  (fk135) owns the result-aside, page shell, notes field, reset button and
  mailto composition, so a caption or template fix lands in one file while
  each page keeps its distinct calculator logic.
- The delivered interactive surface is real product capability: both quote
  calculators honor fk120's constraints (preliminary totals only, hidden
  internal prices, no assumed VAT status, safe invalid-input handling, print
  and email handoff), the staffing inquiry validates required fields in
  Swedish and hands a complete mail draft to the visitor's own email
  program, since fk215 the `/offertberakning/` calculator keeps
  keyboard and screen-reader users anchored when a view switch reveals the
  driveway form, with the focus-flow contract pinned in
  [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) (initial load moves
  no focus; both switch directions land on the revealed view's heading),
  and since fk221 the empty-services fallback carries a registry-declared
  Swedish contact action so the availability notice never dead-ends, pinned
  by the extended empty-services tests in
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx).
- Existing tests cover the delivered behavior:
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx) pins route and
  content structure, chrome, the registry-owned hero map and the fk198
  hover classes; [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) and
  [DrainageQuotePage.test.tsx](../src/pages/DrainageQuotePage.test.tsx) pin
  both calculators with registry-derived pins — fk185 added the drainage
  page's rendered hero srcset/sizes assertion and fk215 the focus-flow
  contract;
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
    borders, the quote-page CTA accent pairing (fk189), the contact form's
    16px field floor (fk195), the quote pages' 16px floor (fk199), the
    compiled primary-hover utility (fk198), the read-more hover pairing
    (fk205), the focus-visible/selection token declarations (fk208) and the
    quote lib boundary ([quote.test.ts](../src/lib/quote.test.ts)) have
    their own focused tests. This refresh inspected source and owning
    records; it did not execute those tests.
- The feature catalog covers the whole route surface: six features F1–F6
   with the quote calculators documented as F6 (fk133), validate-features
   passes recorded in fk162's, fk172's, fk176's, fk183's, fk193's, fk203's,
   fk213's and fk227's deliveries (the closed records' issue-level proof
   projections still report `missing_evidence`; the owning records are
   closed/done and the projections do not reopen them), the README
   reconciliation note covering fk135/fk162/fk164/fk176, fk183's
   2026-11-11 evidence-map line,
   fk193's 2026-11-12 review history, fk203's 2026-11-13 reconciliation
   paragraph, fk213's 2026-11-14 paragraph naming fk205 (PR #140,
   `eb2711d`), the fk207 roadmap baseline (PR #141, `c1051ec`) and fk208
   (PR #142, `2dddae4`) — and fk227's 2026-11-15 reconciliation mapping
   fk215's hash-switch keyboard-focus declaration into F6-US1 (PR #150,
   `4822524`), with F6 re-stamped from a fresh source read and the route
   table unchanged — with F1/F5/F6 stamped 2026-11-14 and F6 2026-11-15,
   and F2/F4 kept at their honest older stamps, the
    [route inventory](current-public-route-inventory.md) (checked
   2026-11-04) matching the twelve-route registry, and the catalog's
   recorded friction items being the F6 calculator debts this refresh
   links below (fk232's source-constant prices and fk233's lost
   measurements, both quoted from quote-calculators.md's own
   Works-Less-Well text) and the operator-owned production-host
   unknown-path documentation item — the empty-services contact-body gap
   the F4 record carried was delivered by fk221 and is no longer catalog
   friction.
- Image handling is layered and now consistent: every photo-hero route
  declares its responsive WebP variants in the registry (fk161/fk177/fk185),
  each emitted document preloads its hero at high priority with
  `imagesrcset`/`imagesizes` describing exactly the candidates its img can
  select (fk112/fk161), above-the-fold heroes request eagerly while cards
  stay lazy, service cards try the route SVG after photo failure,
  failing heroes hide themselves, and every declared hero path and srcset
  candidate is existence-checked by the build gate (fk164/fk161) — so no
  route emits a dead hero request, a silently missing variant, or a
  preload/img mismatch. Since fk188 the declared hero paths also become
  every emitted subpage's `og:image`/`twitter:image`, existence-checked by
   the same gate, with the three SVG-hero routes carrying the shared raster
   home hero so no emitted social image is an SVG. Since fk209 the one
   oversized full-size asset is fixed: the tradgard hero re-encoded in place
   to 342,786 B (from 501,858 B) with declarations byte-identical — and the
   largest remaining shipped assets are still the three sibling full-size
   heroes (stensattning-photo 385,866 B, quote-hero 362,898 B,
   services-hero 345,948 B, re-measured 2026-11-15 at this tip), whose
   complete recompression sits finished but unmerged on fk220's PR #149
   pending the fk224 operator decision (see What works less well), with
   every -640/-960 variant and the next-largest base
   (`gravjobb-photo.webp`, 148,896 B) efficiently sized.
- Font delivery starts at parse time and is gate-enforced: since fk228
  (PR #151, merge `80eb6bd`) the build injects one preload link per
  emitted woff2 asset — the site's 76.7 KB of Fontsource-owned display
  and body fonts — into every emitted document head (root, every
  subpage, `dist/404.html`), each single-line tag carrying
  `as="font"`, `type="font/woff2"`, `crossorigin` (font requests are
  CORS-mode even same-origin, so omitting it would make the preload
  fetch unused) and the exact hashed href that build emitted, so the
  fonts race the stylesheet instead of trailing it and Swedish text
  renders in the real fonts sooner on slow connections. The injection
  is pure-helper based
  ([route-artifacts.mjs](../scripts/route-artifacts.mjs):
  `bundleFontPreloadHrefs`/`distFontPreloadHrefs`/`fontPreloadLinkTag`/
  `injectFontPreloadLinks`), deterministic no-op when a build emits no
  woff2 assets, and
  [assert-static-routes.mjs](../scripts/assert-static-routes.mjs) now
  requires exactly those tags byte-for-byte on every emitted document,
  with 17 new fixture tests pinning selection, tag shape, injection
  point, the no-op and the commutation with the untouched `as="image"`
  hero-preload gates.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift, every major-version jump is deferred
  with a recorded reason, and the November 14 dependency-management child
  (fk214, PR #144) refreshed the Vite toolchain lockfile-only in range
  (vite 8.3.8, @vitejs/plugin-react 6.3.0, postcss 8.5.33) with
  `package.json` byte-identical — closing the cadence question from the
  previous refresh, which had seen no dependency child since November 7.
  The deferral backlog was re-documented fresh on fk214's record (the
  exactly-pinned vitest/coverage-v8 4.1.9 pair, tailwindcss 4, tailwind-merge
  3, typescript 7 main swap, lucide-react 1.x, jest-dom 7 and the
  @types/node bump), and the coordinated vitest-5 bump carries fk214's own
  follow-up prompt for the recurring automation.
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
   tasks: this is the seventeenth consecutive roadmap refresh, each
   reconciling the previous one against owning records before linking new
   work. The loop's throughput is visible in this baseline: five merges
   landed between fk219's review and this tip in about a day (fk219 itself,
   fk221, fk227 and fk228, with fk220's fifth PR unmerged on the human
   decision), and the steering loop stays fast: fk221, linked by fk219 at
   18:24:10Z on November 14, closed delivered at 18:40:47Z — seventeen
   minutes link-to-close — and the November 15 automation children both
   delivered within about forty minutes of their 16:58Z creation (fk227 at
   17:17Z, fk228 at 17:34Z). This refresh's own links were picked up
   immediately (fk232's planning completed about seven seconds after
   creation at the read-back; fk233 read back open in planning). The loop
   also survives adverse timing without losing accuracy: fk231's
   investigate stage read a base that four deliveries had already passed,
   the coordinator re-prepared this worktree onto the resulting tip before
   build, and this refresh's rows are reconciled from fresh owning reads at
   that tip rather than the stale snapshot.

### What works less well and what to improve

- The three largest shipped assets are the full-size heroes whose sibling
  fk209 just fixed, and their complete recompression is **finished but
  unmerged**: on main, `stensattning-photo.webp` still measures 385,866 B
  and serves `/stensattning/` first paint, `quote-hero.webp` 362,898 B
  serves `/offertberakning/`, and `services-hero.webp` 345,948 B serves
  `/tjanster/` (re-measured 2026-11-15 at this tip, unchanged from fk219's
  listing). [fk220](https://app.faktorial.ai/projects/alvalinus/tasks/fk220)
  (linked by fk219 on 2026-11-14, labels `priority: medium` and
  `size:medium`) delivered the work on PR #149 — stensattning-photo
  385,866 → 262,640 B (−31.9%), quote-hero 362,898 → 253,714 B (−30.1%),
  services-hero 345,948 → 241,842 B (−30.1%), total 1,094,712 → 758,196 B,
  dimensions and every declaration unchanged — and canonical quality passed
  268/268 at its head before review ran, but the review stage's net-change
  gate counts only textual diff lines (`git diff --numstat` prints `-` for
  binaries), returned "zero net changes" for the three-binary diff, and
  bounced the PR. fk220 now waits on the operator's answer to
  build-clarification
  [fk224](https://app.faktorial.ai/projects/alvalinus/tasks/fk224) (open
  since 2026-11-14T19:27Z, unanswered at these reads: bounded gate-prose
  fix, a binary-aware review gate, or close without merging). Until that
  decision lands, the 336,516-byte total saving stays off main and this
  roadmap records fk220 as unresolved blocking work — owned by its own
  record, never duplicated by a new task.
- The quote calculators carry two catalog-recorded debts with no owner
  between fk219's refresh and this one. First, every price and tier amount
  is a fixed source constant — `drainageTotal`'s 3 500/3 000 kr tiers,
  55 m boundary and 6 900 kr fixed cost plus `drivewayTotal`'s
  950/667 kr/m², 4 900 kr and 2 000 kr/load all live in
  [quote.ts](../src/lib/quote.ts):24-31 — so quote-calculators.md's own
  Works-Less-Well text states "a price change is a code change rather than
  a content edit"; no task carried it, so this refresh linked it:
  [fk232](https://app.faktorial.ai/projects/alvalinus/tasks/fk232)
  (created and read back open 2026-11-15T18:54Z with labels
  `priority: medium` and `size:medium`; planning completed about seven
  seconds after creation at the read-back) moves the parameters into the
  typed registry with byte-identical rendered totals and registry-derived
  test pins. Second, refreshing or leaving a calculator loses the entered
  measurements and the total ("there is no save or share-a-calculation
  link", same catalog record); no task carried it either, so this refresh
  linked it:
  [fk233](https://app.faktorial.ai/projects/alvalinus/tasks/fk233)
  (created and read back open 2026-11-15T18:54Z with the same labels)
  adds a client-side shareable link that carries the form inputs and
  restores them on load, extending fk215's hash-state pattern. Each is
  owned by its own record; recorded once here, not awaited or duplicated.
- Photography remains partially editorial: the three delivered canvas
  photographs, the responsive quote hero and the responsive services hero sit
  beside still-outstanding requests — a real Trädgårdsplanering photo (the
  AI-generated `tradgard-generated.webp` remains in place and is now
  efficiently sized at 342,786 B after fk209; replacing the image itself
  stays editorial), the About and Contact photographs (the
  `svard-entreprenad-about.svg`/`-contact.svg`
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
- fk149's and fk214's documented deferrals stand, re-verified on November 15
   through a fresh fk214 owning read (closed/done, PR #144, its deferral
   backlog and coordinated-bump prompt unchanged on the record): the vitest
   5 + coverage-v8 5 migration
   carries fk214's own follow-up prompt (the pair is exactly pinned at
   4.1.9 and must move together), the other major jumps (tailwindcss 4,
   tailwind-merge 3, lucide-react 1.x, jest-dom 7, main typescript 7,
   @types/node 26) keep their recorded deferral reasons, and the 3 moderate
   npm-audit findings remain documented rather than forced. These stay on
   the dependency-management automation's records; this refresh creates no
   duplicate issue for them.
- fk228's delivery summary left an unconsumed browser-measurement follow-up
  prompt: quantify the font-preload head start with a DevTools/Lighthouse
  waterfall (and HAR) comparing delivered head `80eb6bd` against the
  pre-change base `4822524`. This static-test environment has no browser
  automation set up, and rendered inspection and screenshots are not
  delivery prerequisites in this lane, so the prompt stays queued on
  fk228's own record for a future run that can execute it; this refresh
  records the improvement's mechanism and its build-time gate instead of
  asserting a measured waterfall.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, on
November 2 during fk105's refresh, on November 3 during fk113's refresh, on
November 6 during the fk123 refresh, on November 7 during the fk153 refresh,
on November 8 during the fk163 refresh, on November 10 during the fk173
refresh, on November 11 during the fk187 refresh, on November 12 during the
fk197 refresh, on November 13 during the fk207 refresh, on November 14
during the fk219 refresh (whose own reads fk231's investigate stage
carried out and whose log is compressed below), and again on November 15
during this fk231 refresh. The checkout advanced from fk219's reviewed
`c3f9ede` baseline to `80eb6bd` (this baseline) through the fk219, fk221,
fk227 and fk228 merges in that order (PRs #147, #148, #150 and #151).
All four are closed/done with merge receipts and passed native
run-quality runs (receipts below); fk227's required `validate-features`
proof passed on its candidate and was independently re-run on the merged
candidate, and the other three carry no proof obligations beyond
ordinary quality. The fifth PR in the window, fk220's #149, is open and
unmerged: fk220 reads back open in build, waiting on the operator's
unanswered fk224 build-clarification decision, with its complete
recompression recorded on its own branch (numbers below) and quality
passed 268/268 at its head — unresolved blocking work, recorded once,
not duplicated. During the November 15 owning reads, fk232 and fk233 —
the two follow-up issues this refresh creates — read back open at
18:54Z with labels `priority: medium` and `size:medium`, so both are
owned by their own records and recorded once in the short-term section
below.

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
| [fk76](https://app.faktorial.ai/projects/alvalinus/tasks/fk76), previous roadmap | Closed/done; PR #82, merge `964f698`. Document read in full during fk87's refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk88/fk89. |
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
| [fk115](https://app.faktorial.ai/projects/alvalinus/tasks/fk115), registry-declared shared chrome strings | Closed/done; PR #101, merge `1620bbd`; native quality pass at head `35d5541`. Verified in source at this baseline: the `chrome` section declares brand, not-found (with `{path}` template), breadcrumb, contact band, footer and service strings ([siteContent.ts](../src/data/siteContent.ts)); Header, Footer, NotFound, PageHero, ServicePage and ContactLinkBand consume them. | Delivered. The former "renderer-side shared chrome" gap is retired; the small leftover set fk134 reserved shipped through fk144, below. fk221 delivered the same chrome section's empty-state contact action (receipt below). |
| [fk112](https://app.faktorial.ai/projects/alvalinus/tasks/fk112), per-subpage hero preloads | Closed/done; PR #102, merge `8e7a8e9`; native quality pass at head `5a3083a` (conflict-resolution run). Verified in source at this baseline: every route declares `heroPhotoAssetPath` ([types/site.ts](../src/types/site.ts)), heroes render from it ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)), and `routeHeroPreloadHref` validates and stamps each emitted subpage document's high-priority preload from the same field ([route-artifacts.mjs](../scripts/route-artifacts.mjs)); the renderer-side `PAGE_HERO_PHOTOS` map is gone. Its scheduling projection reports `record_state=missing` while the owning record is closed/done. | Delivered. fk113's "in-flight automation child" description is retired; fk122's quote-hero WebP conversion below completed the hero-asset work. |
| [fk120](https://app.faktorial.ai/projects/alvalinus/tasks/fk120), drainage quote calculator | Closed/done; PR #103, merge `8230760`; native quality pass at head `dbe5498`. Verified in source at this baseline: `/draneringsberakning/` renders the per-meter drainage calculator ([DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx)), `drainageTotal` encodes the 3 500/3 000 kr tiers plus 6 900 kr fixed ([quote.ts](../src/lib/quote.ts)), the Dränering service page carries the registry-declared calculator link band, and the customer view, printout and email show only the preliminary total. | Delivered by operator-authored work. The quote-page copy moved into the registry through fk140 and the structure through fk135, below. |
| [fk121](https://app.faktorial.ai/projects/alvalinus/tasks/fk121), staffing inquiry page | Closed/done; PR #104, merge `4294bb2`; native quality pass at head `7b3ca1a` (conflict-resolution run). Verified in source at this baseline: `/inhyrning/` (route kind `inquiry`) renders the inquiry form with Swedish validation and mail-draft handoff ([InquiryPage.tsx](../src/pages/InquiryPage.tsx)), pinned by [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) and documented in [staffing-inquiry.md](features/staffing-inquiry.md). | Delivered by operator-authored work; its renderer-side Swedish copy was declared in the registry by fk154, above. |
| [fk127](https://app.faktorial.ai/projects/alvalinus/tasks/fk127), Kalkyler menu links | Closed/done; PR #105, merge `0ed6ce0`; native quality pass at head `7d8cfa9`. Verified in source at this baseline: `chrome.calcMenu` declares the Kalkyler group — Dränering → `/draneringsberakning/`, Uppfart → `/offertberakning/#uppfart` ([siteContent.ts](../src/data/siteContent.ts)) — and desktop and mobile menus render it. | Delivered by operator-authored work. |
| [fk128](https://app.faktorial.ai/projects/alvalinus/tasks/fk128), Inhyrning menu entry | Closed/done; PR #106, merge `a890c30`; native quality pass at head `2864f86`. Verified in source at this baseline: the header and mobile menu include the Inhyrning route through the registry-derived nav lists ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)). | Delivered by operator-authored work. |
| Operator photo selection (commit `1bb124a`) | No owning task record; a direct operator-authored commit on main (2026-11-04): selected canvas photographs replace the generated placeholders for Stensättning, Markarbete and Grävjobb cards and page heroes; [image-requests.md](image-requests.md) records the canvas-attachment provenance and retires the Grävjobb request. | Delivered. Editorial photography landed outside the task machinery; recorded once here so no agent recreates it. |
| [fk122](https://app.faktorial.ai/projects/alvalinus/tasks/fk122), quote-hero WebP conversion | Closed/done 2026-11-06T13:32Z; PR #107, head `8378d87` → merge `b4afea0`; native run-quality pass at head `8378d87`. Verified in source at this baseline: `quote-hero.png` is absent from `public/page-visuals`, the `quote-hero` 640w/960w/full WebP trio is present, and the quote route's registry path, rendered `srcSet` and stamped preload agree. | Delivered. fk123's "in build" description is retired; the quote-hero bytes work is complete. The full-size base's byte weight is now fk220's linked scope below. |
| [fk133](https://app.faktorial.ai/projects/alvalinus/tasks/fk133), quote-calculator feature catalog | Closed/done 2026-11-06T13:50Z; PR #109, head `8af176d` → merge `4050621`; native run-quality pass at head `8af176d`; the native `validate-features` pass recorded at that head stands in the delivery record, while the issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: [features.json](features/features.json) carries six features including F6, and the [route inventory](current-public-route-inventory.md) no longer claims the calculators are outside the catalog. | Delivered. fk123's "in build" description is retired; the quote-route catalog gap is closed. |
| [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134), registry-declared quote-page copy | Closed 2026-11-06T19:00Z with no build PR of its own. Its partially staged worktree branch (`agent-go/task-fk134`) was salvaged into plan fk139, whose children fk140 and fk144 delivered the scope; fk134's record head carries the merged state it was rebased onto. | Delivered via plan fk139. The salvage story is recorded once here; no reopen and no duplicate delivery. |
| [fk139](https://app.faktorial.ai/projects/alvalinus/tasks/fk139), quote-copy delivery plan | Plan closed/done 2026-11-06T19:56Z; all four plan items complete; PR #110. | Delivered through its children fk140 and fk144. fk123's fk134/fk135 "open next step" rows are retired by the deliveries below. |
| [fk140](https://app.faktorial.ai/projects/alvalinus/tasks/fk140), quote calculators on registry copy | Closed/done 2026-11-06T19:28Z; PR #110, head `1a154a1` → merge `7d78282`; native run-quality pass at head `1a154a1`. Verified in source at this baseline: both quote pages render `content.quote.shared/.uppfart/.drainage` with placeholder-filled mailto drafts, and both quote test files derive pinned strings from the registry. | Delivered. The former "renderer-side quote copy" gap is retired. |
| [fk144](https://app.faktorial.ai/projects/alvalinus/tasks/fk144), chrome strings in the registry | Closed/done 2026-11-06T19:50Z; PR #111, head `3ab8bea` → merge `e3a4eef`; native run-quality pass at head `3ab8bea`. Verified in source at this baseline: SiteHomePage renders all eight inventoried chrome strings from the registry and its test pins derive from it. | Delivered. The former "leftover chrome set" gap is retired. |
| [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135), quote-page structure consolidation | Closed/done 2026-11-06T20:15Z; PR #112, head `5dda9b9` → merge `718f19e`; native run-quality pass at head `5dda9b9`. Verified in source at this baseline: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx) exists and both quote pages import and render through its shared shell, aside, notes field, reset button. | Delivered. fk123's "open next step, sequenced after fk134" description is retired; the structural duplication is consolidated. |
| [fk149](https://app.faktorial.ai/projects/alvalinus/tasks/fk149), caret-range lockfile refresh | Closed/done 2026-11-07T12:54Z; PR #113, head `f52b1e1` → merge `7d1b3dc` (fk153's baseline); native run-quality pass at head `f52b1e1` (run `feb68668-448c-4c79-a52d-5b8da2634927-build-dmoznfv2hosg-quality`, re-read November 13). Lockfile-only diff (eight in-range bumps); every major-version jump deliberately deferred with recorded reasons, the vitest 5 migration carries fk149's own follow-up prompt, and its record documents the 3 moderate npm-audit findings left unfixed because `npm audit fix --force` would pull the excluded majors. | Delivered. Routine dependency maintenance with documented deferrals; the deferrals and prompt stay on the dependency-management automation's records — fk214's November 14 child below re-documented the backlog fresh, so fk149's rows are historical provenance. |
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Closed/done 2026-11-07T14:09Z; PR #114, head `283488f` → merge `ba032ac`; native run-quality pass at head `283488f`. Verified in source at this baseline: the darkened `--primary`, the `--primary-on-dark` token and the deterministic contrast test are in [styles.css](../src/styles.css) and [its test](../src/styles.primary-contrast.test.ts). | Delivered. fk153's "in review" description is retired; the two-shade accent repair and its enforcement test are merged. The "Läs mer" hover follow-up from its delivery summary was delivered by fk198 (receipt below) and double-enforced by fk205's pairing test (also below). |
| [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152), feature-catalog stamp refresh | Closed/done 2026-11-07T14:17Z; PR #115, head `81093b5` → merge `18da5d9`; native run-quality pass at head `81093b5`; its delivery summary records the validate-features pass at that head while the closed record's issue-level proof projection still reports `missing_evidence` (the owning record is closed/done and the projection does not reopen it). Verified in source at this baseline: `features.json` stamps read 2026-11-07 on all six features. | Delivered. fk153's "in build" description is retired; the story-document stamp re-read it deferred was absorbed by the later fk162/fk172/fk183 reconciliations. |
| [fk153](https://app.faktorial.ai/projects/alvalinus/tasks/fk153), previous roadmap | Closed/done 2026-11-07T14:25Z; PR #116, head `89705da` → merge `e2ca438`; native run-quality pass at head `89705da`. Document read in full during the fk163 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk154/fk155, and its in-flight fk151/fk152 reservations are delivered above. |
| [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155), quote money-logic unit tests | Closed/done 2026-11-07T14:35Z; PR #117, head `41dac58` → merge `2fdfc82`; native run-quality pass at head `41dac58`. Verified in source at this baseline: [quote.test.ts](../src/lib/quote.test.ts) pins both totals' tiering and flags, the sv-SE formatting and the template placeholder contract. | Delivered. The former "money logic exercised only through DOM assertions" gap is retired. |
| [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154), inquiry-page registry declaration | Closed/done 2026-11-07T14:46Z; PR #118, head `8a33f1a` → merge `feef822` (fk163's baseline); native run-quality pass at head `8a33f1a`. Verified in source at this baseline: `content.inquiry` is declared on the typed registry and [InquiryPage.tsx](../src/pages/InquiryPage.tsx) renders registry fields with registry-derived pins. | Delivered. The former "last renderer-side Swedish surface" gap is retired; the route/service registry is now the single Swedish declaration source for the delivered surface. F5's catalog records predated this delivery; fk176's delivery below reconciled them. |
| [fk161](https://app.faktorial.ai/projects/alvalinus/tasks/fk161), services-hero responsive variants | Closed/done 2026-11-08T15:05Z; PR #119, head `2d28b86` (after a repair commit fixing two strict-null test errors) → merge `7396db5`; native run-quality pass at head `2d28b86`. Verified in source at this baseline: `services-hero-640.webp`/`-960.webp` exist, the services route declares `heroPhotoSrcSet`/`heroPhotoSizes`, the stamper emits `imagesrcset`/`imagesizes` exactly for declaring routes, and the gate existence-checks declared candidates. | Delivered. fk163's "in review" description is retired. Its delivery summary's follow-up prompt — migrating the remaining hero srcsets into registry declarations — was consumed by the linked fk177 below, recorded once so the prompt and the task are not duplicated. The full-size base's byte weight is now fk220's linked scope below. |
| [fk162](https://app.faktorial.ai/projects/alvalinus/tasks/fk162), feature-catalog reconciliation | Closed/done 2026-11-08T15:23Z; PR #120, head `b81d4e1` → merge `be106db`; native run-quality pass at head `b81d4e1`; its delivery records the validate-features pass on the candidate (digest `dfa2a48a…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6 lists `QuotePageShared.tsx` in both manifests, quote-calculators.md and navigation-and-recovery.md are stamped 2026-11-08, and F4-US1 maps the chrome-rendering test. | Delivered. fk163's "in build" description is retired. Its F5 follow-up shipped as the linked fk176 below. |
| [fk163](https://app.faktorial.ai/projects/alvalinus/tasks/fk163), previous roadmap | Closed/done 2026-11-08T15:27Z; PR #121, head `43c156c` → merge `c084a50`; native run-quality pass at head `43c156c`. Document read in full during the fk173 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk164/fk165 below, and its in-flight fk161/fk162 reservations are delivered above. |
| [fk164](https://app.faktorial.ai/projects/alvalinus/tasks/fk164), dead-hero re-point and gate extension | Closed/done 2026-11-08T15:35Z; PR #122, head `ade983b` → merge `3b19a91`; native run-quality pass at head `ade983b`. Verified in source at this baseline: `/om-oss/` and `/kontakt/` declare the in-tree `svard-entreprenad-about.svg`/`-contact.svg` heroes ([siteContent.ts](../src/data/siteContent.ts):88/:172), no `about-hero.webp`/`contact-hero.webp` exists or is declared, and the gate rejects any route whose declared hero path is missing. | Delivered. fk163's "open next step" description is retired; the dead-reference class is closed at the declaration and gate level. |
| [fk165](https://app.faktorial.ai/projects/alvalinus/tasks/fk165), release-provenance command | Closed/done 2026-11-08T15:44Z; PR #123, head `063e171` → merge `72af228`; native run-quality pass at head `063e171`. Verified in source at this baseline: [release-provenance.mjs](../scripts/release-provenance.mjs), the `write-release-provenance` CLI and its fixture tests exist, and [release-runbook.md](release-runbook.md) references the composed path with publication identity kept operator-recorded. | Delivered. fk163's "open next step" description is retired; the four-identity sequence is one fail-closed command. |
| [fk172](https://app.faktorial.ai/projects/alvalinus/tasks/fk172), feature-catalog re-verification | Closed/done 2026-11-10T08:02Z; PR #124, head `69d1bec` → merge `7931e16`; native run-quality pass at head `69d1bec`; its delivery records the validate-features pass on the candidate (digest `b7527970…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the README reconciliation note and 2026-11-10 stamps on F2/F4/F6, the SVG-hero prose corrections in company-confidence.md and navigation-and-recovery.md, and F5 left at 2026-11-07 on a rationale its own record states ("nothing touched their documented behavior"). | Delivered. The November 9 feature-refinement child, merged November 10. Its F5 rationale did not hold against fk154's post-stamp merge; fk176's delivery corrected the F5 records instead of reopening fk172 work. |
| [fk171](https://app.faktorial.ai/projects/alvalinus/tasks/fk171), WCAG field-border contrast | Closed/done 2026-11-10T14:36Z; PR #125, head `1f6aba4` → merge `ea2d472` (fk173's baseline); native run-quality pass 235/235 at head `1f6aba4`. Verified in source at this baseline: the three field-boundary declarations draw `#64748b` ([QuotePage.css](../src/pages/QuotePage.css):15/:18, [InquiryPage.css](../src/pages/InquiryPage.css):19), [the focused contrast test](../src/styles.field-border-contrast.test.ts) computes the ratio from raw CSS, and `test.css.include` is generalized. | Delivered. The November 9 frontend-optimization child, merged November 10 (after the investigation snapshot recorded it as in build, per the stop-if re-baseline rule). Its delivery summary's follow-up prompt — hardening the contrast test's selector matching against CSS formatting churn — stays on fk171's record; the recurring frontend-optimization automation's November 13 and 14 runs (fk205, fk215) delivered other hardening instead, so the prompt remains queued there unconsumed. |
| [fk173](https://app.faktorial.ai/projects/alvalinus/tasks/fk173), previous roadmap | Closed/done 2026-11-10T16:04Z; PR #128, head `e51ccf3` → merge `74ef9ae` (on fk177's `719a11e` base); native run-quality pass at head `e51ccf3`. Document read in full during the fk187 refresh. | Superseded assessment; its two linked next steps were both delivered before it closed — fk176 merged at 15:24Z and fk177 at 15:53Z on November 10 (receipts above and below) — and its works-less-well rows are re-baselined here onto the `c3f9ede` tip. |
| [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176), F5 catalog reconciliation | Closed/done 2026-11-10T15:24Z; PR #126, head `b71a47a` → merge `ab28b45` (fk173's baseline); native run-quality pass 235/235 at head `b71a47a`; the required `validate-features` proof passed on its candidate (aggregate digest `f2589022…`, no findings). Verified in source at this baseline: [staffing-inquiry.md](features/staffing-inquiry.md) stamped 2026-11-10 names the registry-declared `inquiry` copy with InquiryPage.tsx's remaining runtime ownership, the shared inventory's F5 code-path descriptions match the fk154 split, and the README carries the fk176 reconciliation sentence. | Delivered. Created and linked by the fk173 refresh at 14:49:33Z (read back open with labels `priority: medium` and `size:medium`), picked up from the roadmap and merged within roughly half an hour — consuming fk162's dropped F5 follow-up. |
| [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177), remaining hero srcset declarations | Closed/done 2026-11-10T15:53Z; PR #127, head `6a1d0f9` → merge `719a11e` (fk173's base); native run-quality pass at head `6a1d0f9` (run `3fb3ed43-7d2f-4ea2-8b2b-5f86efda0797-build-dmrnb0rhdqyc-quality`, re-read November 11). Verified in source at this baseline: the home, four `*-photo` service-detail, `/tradgardsplanering/` and `/offertberakning/` routes declare `heroPhotoSrcSet`/`heroPhotoSizes` byte-identical to the candidates their heroes rendered before, QuotePage.tsx reads the registry declaration instead of the inline literal, and `/draneringsberakning/` was deliberately left undeclared at that point (no variant family existed and its plain preload already matched). Its own investigation corrected fk173's nine-route count to seven mismatching heroes. | Delivered. fk173's linked Next 2, created and linked at 14:49:50Z (read back open with labels `priority: medium` and `size:medium`), delivered about an hour later. This was the last plain-preload mismatch class; fk185's delivery below completed the declaration set by adding the drainage-quote route. |
| [fk183](https://app.faktorial.ai/projects/alvalinus/tasks/fk183), feature-catalog evidence mapping | Closed/done 2026-11-11T08:52Z; PR #129, head `8c50f1b` → merge `74475bb`; native run-quality pass at head `8c50f1b`; the delivery records the validate-features pass at that head (digest `63fd5b48…`, valid with no findings) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the identity manifest maps the three styles accessibility tests and `quote.test.ts` as 22 technical references at their strongest owning stories (border-contrast → F6-US2/F5-US1, reduced-motion → F4-US3, primary-contrast per declaration, quote totals/formatting → F6-US2 and template/mailto → F6-US5), seven story documents mirror the mappings, F1/F4/F5/F6 and the touched docs carry 2026-11-11 stamps, and the README names all eight mapped test files. | Delivered. The November 11 feature-refinement child. Its documented `.quote-send` token exclusion (delivery-summary comment only — no catalog prose names it, verified November 11) was resolved by fk189's delivery (receipt below). Its follow-up prompt — re-reading F2/F3's source and re-stamping their records — was partially consumed on November 13: fk203 re-stamped F3 (alongside F1/F6) against the fk195/fk198/fk199 deltas, while F2 stays deliberately untouched and that remainder stays queued on fk183's record for the recurring feature-refinement automation; fk213's November 14 child (receipt below) re-stamped F1/F5/F6 and again left F2 untouched. |
| [fk185](https://app.faktorial.ai/projects/alvalinus/tasks/fk185), drainage-quote hero srcset | Closed/done 2026-11-11T15:05Z; PR #130, head `3392f82` (after a one-array test-expectation repair) → merge `5465b66` (fk187's baseline); native run-quality pass at head `3392f82` (run `4089a89a-f737-451b-8978-57a0a2992125-build-dmsgykgpc8wo-quality`, re-read November 11 during the fk187 refresh). Verified in source at this baseline: the drainage-quote route declares `heroPhotoSrcSet` reusing the byte-identical `dranering-photo-400/-640.webp` variants (SHA-256 `d2c8b5f0…78760`, no new binaries) plus the 900w base, DrainageQuotePage reads the registry through QuotePageShell's hero props, and a focused test pins the rendered srcset/sizes. | Delivered. The November 11 frontend-optimization child; with fk177 it closes the whole preload/srcset mismatch class — all nine photo-hero routes now declare registry variants. **Its delivery summary's follow-up prompt is retired as factually stale**: it claims `/offertberakning/` "still hardcodes its srcset with a preload mismatch", but fk177 (PR #127, merge `719a11e`, closed 2026-11-10) already declared that route's srcset and moved QuotePage.tsx onto the registry — verified at this tip (siteContent.ts:25–28, QuotePage.tsx:51, no inline literal). Recorded once so the frontend-optimization automation does not redo delivered work. |
| [fk189](https://app.faktorial.ai/projects/alvalinus/tasks/fk189), accent palette tokenization | Closed/done 2026-11-11T16:46Z; PR #132, head `7d21a757` → merge `3440d65` (directly on fk185's `5465b66`); native run-quality pass at head `7d21a757` (run `3d615243-ae57-4f41-a194-903ea77a62a5-build-dmsj3iyzdvz4-quality`, re-read November 12). Verified in source at this baseline: the quote/inquiry accent roles declare `hsl(var(--primary))`/`hsl(var(--primary-hover))` ([QuotePage.css](../src/pages/QuotePage.css):21/:28/:29/:35-36, [InquiryPage.css](../src/pages/InquiryPage.css):23), `--primary-hover: 18 84% 33%` joined `:root` ([styles.css](../src/styles.css)), [styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts) pins the `.quote-send` white-on-background pairing at ≥4.5:1, and the F6-US5/F5-US2 story records and identity manifest name the test. | Delivered. fk187's linked Next 2, created 16:20:36Z November 11 and delivered within about half an hour of its link. The fk183-documented F6-US5 exclusion is resolved; the focus/selection hex residue fk189 scoped out was delivered by fk208 (receipt below). |
| [fk187](https://app.faktorial.ai/projects/alvalinus/tasks/fk187), previous roadmap | Closed/done 2026-11-11T16:47Z; PR #131, head `1ec5bac` → merge `7eb567e` (on fk189's `3440d65`); native run-quality pass at head `1ec5bac` (run `179d297e-c222-45f7-8ab5-2f620d1b5770-build-dmsj2litfsvo-quality`, re-read November 12). Document read in full during the fk197 refresh. | Superseded assessment; its two linked next steps shipped around its own merge — fk189 at 16:46Z and fk188 at 16:53Z on November 11 (receipts above and below) — and its works-less-well rows were re-baselined by fk197, fk207 and again by this refresh onto the `c3f9ede` tip. |
| [fk188](https://app.faktorial.ai/projects/alvalinus/tasks/fk188), per-route social-card imagery | Closed/done 2026-11-11T16:53Z; PR #133, head `71f21f79` → merge `36d7cba` (on fk187's `7eb567e`); native run-quality pass at head `71f21f79` (run `511c7c94-5af9-405a-8acf-1c5635c85136-build-dmsj80kgw840-quality`, re-read November 12). Verified in source at this baseline: the emitter substitutes `og:image`/`og:image:alt`/`twitter:image` from each route's registry-declared `heroPhotoAssetPath` with registry-declared Swedish alt text, the three SVG-hero routes carry the shared raster home hero, the root and 404 documents keep their home-branded sets, and the static gate existence-checks every emitted image path (fk164's pattern extended). | Delivered. fk187's linked Next 1, created 16:20:23Z November 11 and closed delivered about half an hour later. The former "home-branded social cards on every subpage" gap is retired for imagery as fk88 retired it for text. |
| [fk193](https://app.faktorial.ai/projects/alvalinus/tasks/fk193), feature-catalog reconciliation | Closed/done 2026-11-12T09:26Z; PR #134, head `802f378b` → merge `c131651` (on fk188's `36d7cba`); native run-quality pass at head `802f378b` (run `64920971-6743-41d2-a965-6d8fabe9d755-build-dmt4btwcgr4g-quality`, re-read November 12); its required `feature-manifest-integrity` proof passed at acceptance. Verified in source at this baseline: navigation-and-recovery.md describes the drainage-hero variant family with the stale no-variant sentence gone, quote-calculators.md names both quote routes' declared srcsets and fk189's accent-test mapping, features.json carries 2026-11-12 stamps on F4/F6 only, and the README review history records the fk185/fk188/fk189 deltas. | Delivered. The November 12 feature-refinement child. F5 keeps its 2026-11-11 stamp because no reviewed task touched its surfaces beyond fk189's own story-record mapping. |
| [fk195](https://app.faktorial.ai/projects/alvalinus/tasks/fk195), 16px contact-form floor | Closed/done 2026-11-12T15:25Z; PR #135, head `636126c` → merge `9e7dd70` (fk197's baseline, on fk193's `c131651`); native run-quality pass at head `636126c` (run `89ffb78b-1e2d-4f93-859d-b85b1511a4ad-build-dmtc0elqw268-quality`, re-read November 12). Verified in source at this baseline: `CONTACT_FIELD_BASE_CLASS` no longer carries the `sm:text-sm` downgrade, and the focused test pins `text-base` with no responsive text-size override on both the home and `/kontakt/` renderings. | Delivered. The November 12 frontend-optimization child; its delivery summary's real-device verification prompt stays on fk195's record (jsdom cannot reproduce iOS focus zoom). The same defect class on the quote pages was delivered by fk199 (receipt below). |
| [fk199](https://app.faktorial.ai/projects/alvalinus/tasks/fk199), quote-page 16px focus-zoom floor | Closed/done 2026-11-12T17:19Z; PR #136, head `b1a3c989` → merge `aa4fdb6` (on fk195's `9e7dd70`, fk197's baseline); native run-quality pass at head `b1a3c989` (run `54a24b2f-f8ad-4fee-9c9a-c39b8b2e178f-build-dmteg2wb9kd4-quality`, re-read November 13). Verified in source at this baseline: the `.quote-field select,.quote-field textarea` rule declares `font-size:16px` ([QuotePage.css](../src/pages/QuotePage.css):18) so neither control inherits the 14px container size, the fk171-asserted border declaration survived the edit, and the new [styles.quote-focus-zoom.test.ts](../src/styles.quote-focus-zoom.test.ts) pins the floor on the shared stylesheet both quote pages render through. | Delivered. fk197's linked Next 2, created 17:03:23Z November 12 and closed sixteen minutes later — the fastest link-to-close in the chain at that point. The quote-page half of fk195's defect class is closed; both quote routes now hold the 16px floor. |
| [fk198](https://app.faktorial.ai/projects/alvalinus/tasks/fk198), read-more hover on the AA-enforced token | Closed/done 2026-11-12T17:27Z; PR #137, head `35eccacb` → merge `9631338` (on fk199's `aa4fdb6`); native run-quality pass at head `35eccacb` (run `200ceed5-c0b4-4c57-8765-c1fd24fb8f14-build-dmtejrx8n70k-quality`, re-read November 13). Verified in source at this baseline: the anchor carries `text-primary hover:text-primary-hover` ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850), [tailwind.config.ts](../tailwind.config.ts) maps `primary.hover` to `hsl(var(--primary-hover))` (7.10:1 on the white card), [tailwind.primary-hover-utility.test.ts](../src/tailwind.primary-hover-utility.test.ts) proves the utility compiles from the token, SiteHomePage.test.tsx:495 pins the classes, and no `text-primary/<alpha>` hover remains anywhere in src/. | Delivered. fk197's linked Next 1, created 17:03:11Z November 12 and closed twenty-four minutes later. fk151's recorded hover ceiling is closed and — via fk205's pairing test below — enforced against alpha-composited regressions. |
| [fk197](https://app.faktorial.ai/projects/alvalinus/tasks/fk197), previous roadmap | Closed/done 2026-11-12T17:35Z; PR #138, head `55e5d0ff` → merge `6242e9e` (on fk198's `9631338`); native run-quality pass at head `55e5d0ff` (run `6fd58277-32e6-42a5-bb52-ba2299cbd340-build-dmtervedrwyo-quality`, re-read November 13). Document read in full during the fk207 refresh. | Superseded assessment. Its own PR merged after the merges of both tasks it had linked (fk199 and fk198 landed beneath it, as fk187's had), and its works-less-well rows were re-baselined by fk207 and again by this refresh onto the `c3f9ede` tip: its two links delivered, its recorded hex residue delivered by fk208, and its byte-weight observation delivered by fk209. |
| [fk203](https://app.faktorial.ai/projects/alvalinus/tasks/fk203), feature-catalog reconciliation | Closed/done 2026-11-13T09:56Z; PR #139, head `0e8012cf` → merge `2e3245f` (on fk197's `6242e9e`); native run-quality pass at head `0e8012cf` (run `aa362c0c-b5d2-49a8-8da6-dee27de073d9-build-dmtzn7r88ot0-quality`, re-read November 13); its required `validate-features` proof returned valid/pass/complete with zero findings on its edited candidate, and its delivery records the verifier rerunning the proof independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F3-US1 maps fk195's contact-form 16px declaration, F6-US2 maps fk199's quote ≥16px floor, F1-US1 gains four fk198 hover-token declarations plus the two Tailwind utility-generation checks, the README names both new test files, and F1/F3/F6 plus the README carry 2026-11-13 stamps with F2/F4/F5 deliberately untouched. | Delivered. The November 13 feature-refinement child — its own investigation caught that its branch carried the two newer source commits and extended the reconciliation beyond its original F3-only scope, exactly as its stop-if required. fk183's queued F3 re-stamp was consumed by this delivery; the F2 remainder stays queued on fk183's record. |
| [fk205](https://app.faktorial.ai/projects/alvalinus/tasks/fk205), read-more hover pairing hardening | Closed/done 2026-11-13T15:56Z; PR #140, head `de546201` → merge `eb2711d` (fk207's baseline, on fk203's `2e3245f`); native run-quality pass at head `de546201` (run `82a0525c-2faf-413f-b0ec-51ab51364d35-build-dmu7a1wtz7qs-quality`, re-read November 13) after one strict-typecheck repair commit (`split()` destructuring violates `noUncheckedIndexedAccess`; replaced with `indexOf`/`slice`, no behavior change). Verified in source at this baseline: [styles.read-more-hover-contrast.test.ts](../src/styles.read-more-hover-contrast.test.ts) (187 lines) finds the anchor structurally via its Swedish aria-label marker, resolves its hover utility through a flattened tailwind config map (rejecting any hardcoded color), alpha-composites `/NN` modifiers over the card surface, asserts ≥4.5:1 and that hover stays strictly darker than rest — restoring the retired `hover:text-primary/80` computes 3.96:1 and fails by design. fk198's fix itself was already in its base, so its merge delta is the test alone. | Delivered. The November 13 frontend-optimization child — it targeted the same surface fk198 had just fixed, recognized the fix in its base, and delivered the one missing acceptance piece (the pairing test) instead of redoing delivered work. The "Läs mer" hover contract is now enforced twice over, at two independent boundaries. Its two test declarations were mapped into F1-US1 by fk213's November 14 child (receipt below). |
| [fk207](https://app.faktorial.ai/projects/alvalinus/tasks/fk207), previous roadmap | Closed/done 2026-11-13T18:07Z; PR #141, head `8129295` → merge `c1051ec` (on fk205's `eb2711d`); native run-quality pass at head `8129295` (run `c9a6e41e-a9bd-4cdc-95d3-88bbfa3e0a09-build-dmua328m3qn8-quality`, re-read November 14). Document read in full during this refresh. | Superseded assessment — the generation this refresh supersedes. Its two linked tasks (fk208, fk209) both shipped the same evening beneath fk214's/fk213's/fk215's November 14 merges, and its works-less-well rows are re-baselined here onto the `c3f9ede` tip: its accent-residue link and tradgard link are delivered below, its dependency-cadence question is answered by fk214, and its catalog-staleness note is resolved by fk213. |
| [fk208](https://app.faktorial.ai/projects/alvalinus/tasks/fk208), focus-visible and selection accent tokenization | Closed/done 2026-11-13T18:08Z; PR #142, head `76432fc7` → merge `2dddae4` (on fk207's `c1051ec`); native run-quality pass at head `76432fc7` (run `dd973e8f-0589-44dd-afe6-a0b77347ec5d-build-dmua4osxkj20-quality`, re-read November 14). Verified in source at this baseline: the three `:focus-visible` outline rules draw `hsl(var(--primary-hover))` with 3px geometry and offset intact ([QuotePage.css](../src/pages/QuotePage.css):20, [InquiryPage.css](../src/pages/InquiryPage.css):22/:27), the quote `::selection` draws the declared `--selection-background`/`--selection-foreground` pair ([styles.css](../src/styles.css):16–17, QuotePage.css:22), a literal search finds no `#bc4a12` or `#f7c5aa` under src/, and the extended page-accent test rejects any hardcoded accent hex. | Delivered. fk207's linked Next 1, created 17:51:33Z November 13 and closed seventeen minutes later. The accent family fk189 started and fk189's scoped-out residue carried now has no undeclared member; fk213's November 14 child mapped the new declarations into F5-US2/F6-US5 (receipt below). |
| [fk209](https://app.faktorial.ai/projects/alvalinus/tasks/fk209), tradgard hero recompression | Closed/done 2026-11-13T18:29Z; PR #143, head `cc6268d` → merge `33e665d` (on fk208's `2dddae4`); native run-quality pass at head `cc6268d` (run `e6cabaf6-fafb-47c5-b028-328d53eb69bc-build-dmuak72fn72o-quality`, re-read November 14). Verified in source at this baseline: `tradgard-generated.webp` measures 342,786 B at the same path (down from 501,858 B, −31.7%, above its ≥30% target), the `-960` (220,062 B) and `-640` (101,718 B) variants are untouched, and the registry declarations stayed byte-identical. | Delivered. fk207's linked Next 2, created 17:51:54Z November 13 and closed thirty-eight minutes later. Its delivery summary's scope note — the sibling full-size heroes stay untouched unless a follow-up run takes them — was consumed by fk219's fk220 link below, recorded once so the pool is not left unowned. |
| [fk214](https://app.faktorial.ai/projects/alvalinus/tasks/fk214), dependency-management lockfile refresh | Closed/done 2026-11-14T16:54Z; PR #144, head `5a8a4a8` → merge `fe88422` (on fk209's `33e665d`); native run-quality pass 267/267 at head `5a8a4a8` (run `db3f4d7b-09a6-4916-be91-2e34abe9f00e-build-dmv2qbbex9gc-quality`, re-read November 14). Verified in source at this baseline: `package.json` is byte-identical to its base and the lockfile pins vite 8.3.8, @vitejs/plugin-react 6.3.0 and postcss 8.5.33 (its diff bounded to the Vite toolchain's own transitives); its Build Update cites the `npm outdated` signal and carries one-line deferral reasons for all eight majors, including the exactly-pinned 4.1.9 vitest/coverage-v8 pair. | Delivered. The dependency-management automation's November 14 child — landing exactly on the cadence fk207 documented as pending, ending the November 7–13 silence as cadence rather than a stall. Its coordinated vitest-5 follow-up prompt stays on its own record for the recurring automation. |
| [fk213](https://app.faktorial.ai/projects/alvalinus/tasks/fk213), feature-catalog reconciliation | Closed/done 2026-11-14T16:57Z; PR #146, head `536eed7` → merge `c911d1b` (on fk214's `fe88422`); native run-quality pass 267/267 at head `536eed7` (run `a337223a-eb3d-4514-83f8-eed1f7e5b157-build-dmv37cw5ilyw-quality`, re-read November 14); its required `feature-manifest-integrity` proof passed on its candidate and its delivery records the verifier rerunning it independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F1-US1 carries the two fk205 read-more-hover declarations, F5-US2 and F6-US5 carry fk208's focus-visible and quote-selection declarations with matching story-document bullets, F1/F5/F6 carry 2026-11-14 stamps, and F2/F4 records keep their honest older stamps with IDs, routes and the intentionally empty backend mapping unchanged. | Delivered. The feature-refinement automation's November 14 child — a docs-and-manifest reconciliation only, exactly as its own record scopes it. The catalog's evidence map now names the real owning tests through the fk208/fk205 deltas. |
| [fk215](https://app.faktorial.ai/projects/alvalinus/tasks/fk215), quote-view heading focus | Closed/done 2026-11-14T16:58Z; PR #145, head `60bba11` → merge `c3f9ede` (this baseline, on fk213's `c911d1b`); native run-quality pass 268/268 at head `60bba11` (run `3ce18fe1-8605-4609-a514-b27ff5529f7d-build-dmv2s85fckig-quality`, re-read November 14). Verified in source at this baseline: the choice and work headings carry `quote-choice-heading`/`quote-work-heading` ids and `tabIndex={-1}` ([QuotePage.tsx](../src/pages/QuotePage.tsx):60/:69), the kind-transition effect focuses the revealed view's heading via `document.getElementById(...)?.focus()` (QuotePage.tsx:40), a `previousKind` ref skips first renders so initial load and `#uppfart` deep links never steal focus, and the in-memory focus-flow test pins both switch directions plus the untouched initial render. | Delivered. The frontend-optimization automation's November 14 child — the same focus-anchoring pattern fk195's InquiryPage established, applied to the quote calculator's hash-driven view switch. |
| [fk219](https://app.faktorial.ai/projects/alvalinus/tasks/fk219), previous roadmap | Closed/done 2026-11-14T18:38Z; PR #147, head `a689906` → merge `778998e` (on fk215's `c3f9ede`); native run-quality pass at head `a689906`. Document read in full during this refresh. | Superseded assessment — the generation this refresh supersedes. Its two linked tasks shipped beneath fk227's/fk228's November 15 merges or stayed blocked: fk221 delivered in seventeen minutes (receipt below), and fk220 remains open on the fk224 human decision with its PR #149 unmerged (recorded above and in What works less well). |
| [fk221](https://app.faktorial.ai/projects/alvalinus/tasks/fk221), empty-services contact action | Closed/done 2026-11-14T18:40Z; PR #148, head `68d055f` → merge `7dca1af` (on fk219's `778998e`); native run-quality pass at head `68d055f`. Verified in source at this baseline: StaticState extends an optional action affordance rendering a registry-declared Swedish label and destination (no renderer-side copy), the empty-services call site passes the action only from the fallback branch, and the extended SiteHomePage tests pin the accessible name and declared destination. | Delivered. fk219's linked Next 2, created 18:24:10Z November 14 and closed delivered seventeen minutes later — the fastest link-to-close recorded in the chain so far. The F4 catalog friction ("no inline retry or contact body") is retired; the delivered action is recorded in the works-well list. |
| [fk227](https://app.faktorial.ai/projects/alvalinus/tasks/fk227), feature-catalog reconciliation | Closed/done 2026-11-15T17:17Z; PR #150, head `aa0afe9` → merge `4822524` (on fk221's `7dca1af`); native run-quality pass 268/268 at head `aa0afe9`; its required `validate-features` proof passed on its candidate (valid, complete, no findings) and its delivery records the verifier rerunning it independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6-US1 carries the fk215 hash-switch focus declaration with a direct vitest reference to the QuotePage test, F6 and quote-calculators.md carry 2026-11-15 stamps, the README records the reconciliation, and no other feature or story record changed (fk219 roadmap-only and fk221 F4-source touched no docs/features files). | Delivered. The feature-refinement automation's November 15 child — a docs-and-manifest reconciliation only, exactly as its own record scopes it. The catalog's F6 story now names the real owning focus test. |
| [fk228](https://app.faktorial.ai/projects/alvalinus/tasks/fk228), woff2 font preloads in every emitted head | Closed/done 2026-11-15T17:34Z; PR #151, head `283f8f5` → merge `80eb6bd` (this baseline, on fk227's `4822524`); native run-quality pass 285/285 at head `283f8f5`. Verified in source at this baseline: the four pure font-preload helpers exist in [route-artifacts.mjs](../scripts/route-artifacts.mjs), the `transformIndexHtml` handler injects from `ctx.bundle` ([vite.config.ts](../vite.config.ts)), [assert-static-routes.mjs](../scripts/assert-static-routes.mjs) derives the emitted hrefs and requires exactly those tags on every document including `dist/404.html`, and the hero `as="image"` gates are untouched. | Delivered. The frontend-optimization automation's November 15 child; the parse-time font head start and its byte-for-byte gate are recorded in the works-well list. Its delivery summary's browser-measurement prompt stays queued on its own record (see What works less well). |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 15 one, and no row above was reopened or recreated by this refresh:
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
the fk177/fk173/fk183/fk185 heads, the passed runs at the
fk189/fk187/fk188/fk193/fk195 heads, the passed runs at the
fk199/fk198/fk197/fk203/fk205/fk207 heads, the passed runs at the
fk208/fk209/fk214/fk213/fk215 heads, and the passed runs at the
fk219/fk221/fk227/fk228 heads above) are historical, not
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
was never repaired platform-side. No recurrence has been observed: every
subsequent feature-refinement, dependency-management and
frontend-optimization occurrence through fk227/fk228 on November 15 (and
fk213/fk214/fk215 on November 14) ran with fresh parent keys and closed
delivered (receipts above). The worker-host maintenance pair from the
November 10 monitor incident (fk181 with fk182 as its question notice)
read closed on November 13 at 2026-11-12T22:19Z, with fk181's question
form showing no recorded answer — resolved as closed platform records,
not site work. The steering loop remains the fastest path in the chain:
fk221, linked 18:24:10Z on November 14, closed delivered seventeen
minutes later; the November 15 automation children both delivered within
about forty minutes of creation; and this refresh's own two links —
fk232 created 18:54:22Z and fk233 18:54:39Z on November 15 — read back
open with exact labels, fk232's planning having completed about seven
seconds after creation at the read-back, with their owning records
carrying the work forward. The chain's current open friction is human,
not machine: fk220's complete, quality-passed recompression sits on
unmerged PR #149 because the review stage's textual-line net-change gate
cannot see a binaries-only diff, and the operator's answer to the
fk224 build-clarification (open since 2026-11-14T19:27Z, unanswered at
these reads) is the single decision that releases it — bounded gate-prose
fix, binary-aware review gate, or close without merging. That decision
is orchestrator/owner territory; no agent may satisfy it by editing the
task or duplicating the work. The incident receipts come from fk153's
November 7 owning reads, retained for provenance; no duplicate record is
created for any of them.

## Short-term priorities and issue ownership

fk219's two short-term priorities are resolved on this tip's own records:
the empty-services contact action landed through fk221 (PR #148, merge
`7dca1af`, closed 18:40Z November 14, seventeen minutes after being
linked), and the sibling-hero recompression is complete on fk220's
unmerged PR #149 (1,094,712 → 758,196 B total, quality 268/268 at head
`140a735`) but cannot reach main until the operator answers the fk224
build-clarification — the one blocked item, recorded above and in the
friction paragraph, and never duplicated.

The two follow-up issues created during this refresh cycle (this roadmap
task's own writes on November 15, read back open before linking) target
the two concrete F6 debts the delivered work left behind, and the
just-before-creation inventory read held no other feature work:

1. [fk232](https://app.faktorial.ai/projects/alvalinus/tasks/fk232) —
   move the quote calculators' prices and tier amounts into the typed
   content registry: all money figures live as source constants in
   [quote.ts](../src/lib/quote.ts):24-31 (`drainageTotal`'s 3 500/3 000
   kr tiers, 55 m boundary, 6 900 kr fixed; `drivewayTotal`'s 950/667
   kr/m², 4 900 kr, 2 000 kr/load), and quote-calculators.md's
   Works-Less-Well record states "a price change is a code change rather
   than a content edit". The task declares the parameters under
   `content.quote` with byte-identical rendered totals and registry-
   derived test pins (the fk140 pattern), so a price update becomes a
   content edit while the money-logic tests keep proving the totals.
   Created and read back open at 18:54:22Z with labels
   `priority: medium` and `size:medium`; fk232's planning completed
   about seven seconds after creation at the read-back. Owned by
   fk232's record; recorded once here, not awaited or duplicated.
2. [fk233](https://app.faktorial.ai/projects/alvalinus/tasks/fk233) —
   let the quote calculators save and share a calculation through a
   link: refreshing or leaving `/offertberakning/` or
   `/draneringsberakning/` loses the entered measurements and the total
   (quote-calculators.md: "there is no save or share-a-calculation
   link"), and the fk215 hash-state pattern proves the route tolerates
   URL-carried state with no backend. The task adds one registry-
   declared Swedish share affordance per page that encodes the form
   inputs into the URL and restores them on load with the recomputed
   total, pinned in both directions by deterministic in-memory tests,
   keeping fk215's no-focus-stealing initial-render contract intact.
   Created and read back open at 18:54:39Z with the same labels. Owned
   by fk233's record; recorded once here, not awaited or duplicated.

Remaining candidates were judged and dispositioned above and below: the
missing photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact photographs, an optional
Inhyrning upgrade); hosting, telemetry and submission-service work still
await explicit operator decisions (ADR 0006), and the production-host
unknown-path behavior stays an operator/host fact; service-selection's
prerequisites-and-preparation guidance and company-confidence's
certification substantiation need owner-reviewed Swedish claims before
code can carry them, so they stay catalog-recorded editorial work rather
than linked issues; the deferred major-version jumps, their assessment
prompts and the 3 moderate audit findings carry their own recorded
follow-ups on the dependency-management automation's records — fk214's
delivery being the newest owner (fresh-verified 2026-11-15), whose
coordinated vitest-5 prompt stays queued there (no duplicate issue is
created over a queue that demonstrably ran on cadence); fk171's
contrast-test hardening prompt stays on its own record for the recurring
frontend-optimization automation, whose November 14 and 15 runs (fk215,
fk228) delivered other improvements instead; fk183's F2 re-stamp prompt
stays queued on its record after fk203 consumed the F3 half and
fk213's/fk227's November 14/15 children again left F2 untouched;
fk195's real-device verification prompt stays on its own record (jsdom
cannot reproduce iOS focus zoom); fk228's browser-measurement prompt
stays queued on its record because this environment has no browser
automation and rendered inspection is not a delivery prerequisite here;
fk161's, fk162's, fk176's and fk185's recorded follow-up prompts were
consumed or retired by delivered work rather than duplicated; and the
empty-services catalog friction is resolved — fk221 delivered the action
fk219 linked. No further issue is created in this refresh: every
remaining candidate is either operator/editorial work, carries its own
recorded owner, or is already delivered — a synthetic third task would
duplicate one of those queues rather than steer new work.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
   fk187 → fk197 → fk207 → fk219 → fk231 refresh chain shows the working
   loop: reconcile, ship, re-verify, retire. Separate source delivery, task
   closure and acceptance; missing evidence stays unknown. The loop also
   absorbs stalled deliveries without losing work (fk134's salvage into
   plan fk139), stale starting points without losing accuracy (fk187's,
   fk197's, fk219's and this refresh's re-baselines onto re-prepared tips),
   and interleaved merges without misattributing receipts. Its steering
   latency keeps tightening — half an hour around fk188/fk189, sixteen and
   twenty-four minutes for fk199/fk198, seventeen and thirty-eight minutes
   for fk208/fk209, seventeen minutes link-to-close for fk221, and this
   refresh's fk232 planned within seconds of creation — with the owning
   records carrying the work forward. What the loop cannot do alone is
   equally visible: fk220's finished delivery waits on one human decision
   (fk224) because a gate mechanism, not the work, blocks it.
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
   (fk151/fk171/fk189), the "Läs mer" hover pinned to the AA-enforced
   hover token with double enforcement (fk198/fk205), the 16px field-text
   floors on the inquiry, contact and both quote forms (fk195/fk199) that
   stop iOS focus zoom,    the fully declared accent family with the
   focus-visible and selection pairs tokenized (fk208), the lighter
   tradgard hero (fk209), keyboard-anchored calculator view switches
   (fk215), the registry-declared empty-services contact action so the
   availability fallback never dead-ends (fk221), parse-time woff2 font
   preloads in every emitted document with the byte-for-byte build gate
   (fk228), existing hero assets on every route with the gate keeping them
   that way, and the unit-tested money logic are delivered. The remaining
   visitor-visible work is the sibling full-size hero byte weights —
   delivered on fk220's unmerged PR #149, waiting on the fk224 operator
   decision — the two calculator debts linked by this refresh (fk232's
   registry-declared price parameters and fk233's save/share link), and
   approved missing imagery; the maintainer-facing catalog records are
   truthful after fk176's, fk183's, fk193's, fk203's, fk213's and
   fk227's reconciliations. Define useful inquiry signals and privacy needs
   before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 15, this
   checkout's parent holds exactly the fk225/fk227/fk228/fk231 worktrees,
   `D:\git` holds AlvaLinus, asynkron and FaktorialDemo, and
   `D:\git\asynkron` holds only femma. Transfer demonstrated practices
   with explicit owners. The autonomous factory operates around this static
   product; it is not an application backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 15 during this fk231 refresh: the previous roadmap
  in full (the committed fk219 generation at this checkout's prepared base
  `80eb6bd`, the generation this document supersedes); the Git history
  across the `c3f9ede..80eb6bd` delta — four merges in order: fk219 PR #147
  head `a689906` merge `778998e`, fk221 PR #148 head `68d055f` merge
  `7dca1af`, fk227 PR #150 head `aa0afe9` merge `4822524`, fk228 PR #151
  head `283f8f5` merge `80eb6bd` — plus the unmerged fifth PR (fk220 #149,
  head `140a735` on `agent-go/task-fk220`), with owning `get_task` reads
  confirming fk219, fk221, fk227, fk228 closed/done/approved at the states
  recorded above (fk227's validate-features pass recorded on its candidate
  and independently re-run on the merged candidate; fk228's 285/285 and
  fk227's 268/268 vitest counts from their run-quality receipts), fk220
  open in build waiting on the human decision and fk224 open with no
  recorded answer, and a fresh fk214 owning read confirming its deferral
  backlog and vitest-5 prompt before reusing that text.
  Source verification at this HEAD: the sibling-hero listing
  (stensattning-photo.webp 385,866 B, quote-hero.webp 362,898 B,
  services-hero.webp 345,948 B — fk220's savings confirmed absent from
  main; tradgard-generated.webp 342,786 B after fk209; gravjobb-photo
  148,896 B; `-960`/`-640` variants unchanged), the money-logic constants
  in [quote.ts](../src/lib/quote.ts):24-31 (3 500/3 000 kr tiers, 55 m
  boundary, 6 900 kr fixed; 950/667 kr/m², 4 900 kr, 2 000 kr/load) and
  the standing `vatStatusLabel` ("Momsstatus ej bekräftad", quote.ts:6)
  grounding the fk232/fk233 links, and fk221's registry-declared action
  plus fk228's font-preload helpers and gate in place. The created tasks
  fk232/fk233 read back open at 18:54Z with exact labels `priority: medium`
  and `size:medium` (fk232's planning completed about seven seconds after
  creation at the read-back); the open-task inventory read just before
  creation held nine records (this task, fk220, fk224, fk225, the fk216–
  fk218/fk222/fk223/fk226/fk229/fk230 delivery notices) with no other
  feature work. This checkout's parent holds exactly the
  fk225/fk227/fk228/fk231 worktrees, `D:\git` holds AlvaLinus, asynkron
  and FaktorialDemo, and `D:\git\asynkron` holds only femma
  (re-verified November 15); `../booking` and `../Asynkron.JsEngine` are
  absent. Unchanged structural claims carried from the October 28–November
  14 reviews keep that provenance.
- One-day Faktorial API usage read on November 15 (18:52:15Z) reported
  132,854 calls across 8 endpoints, overwhelmingly task-record reads
  (GET /api/tasks/{issue_ref}, 132,590), with queue, worker-settings and
  agent-management reads at 75 each. The same caveats as previous
  refreshes stand and this read is again far thinner than its window:
  the volatile in-memory retention covered only
  18:49:06Z–18:52:14Z against the one-day request (TTL 3600 s), the
  population was truncated by a store cap, the sampling state is unknown,
  and revision comparability is unavailable; the 361 retained spans that
  joined to durable route identities did so exactly (none unmatched, zero
  errors in the measured population), but that population is a thin
  window, not a demand estimate.
- The serving-process database telemetry read at 18:52:26Z on November 15
  covered the collector epoch reset 2026-11-14T20:58:45Z: at the read its
  cumulative counters span about 21.9 hours — 4,400,074 calls,
  3,742,253 queries, 8 errors and ≈5.0 GB received, led by the DuePage
  agent-run reads (393,400 calls, ≈2.1 GB received), the task-data Read
  operation (256,036 calls), the paired SchedulingRevision/CommandRevision
  reads (~314,700 calls each) and the TryClaim claim attempts (202,601
  calls, 810,410 queries); the 8 errors scatter across DuePage (3),
  agent-run Commit (2) and the projectarchitecture SourceSync
  read-selection queries (2), plus one claim Release. Cumulative counters
  are not comparable across collector resets. Both populations are Cloud
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
- Bounded-provenance policy, adopted with the fk187 refresh and continued
   by this one: this document
   carries only the current refresh's reads in full. Prior refreshes'
   dated read logs — owning task reads, Git deltas, asset listings,
   API-usage and database-telemetry reads — are compressed to the pointers
   below; each generation's full text stays in Git history at its delivery
   commit (`git log -p -- docs/roadmap.md` from the listed merge).
   - fk219 (November 14): the previous roadmap read in full at the
     re-prepared `c3f9ede` tip (fk215's merge), the `eb2711d..c3f9ede`
     delta (fk207/fk208/fk209/fk214/fk213/fk215), source verification of
     the accent tokens, quote-heading focus effect, asset listing,
     vitest pins and empty-state surface, owning reads of
     fk207/fk208/fk209/fk213/fk214/fk215, the fk220/fk221 creation
     read-backs, the 4-record open inventory, API usage (43,966 calls/
     14 endpoints) and database telemetry (238,493 calls / 199,401
     queries / 2 errors on the 2026-11-14T16:36:54Z epoch) under the
     serving-process caveats — full text in Git history at merge
     `778998e` (PR #147).
   - fk207 (November 13): the previous roadmap read in full at the
     prepared `eb2711d` tip (fk205's merge), the `9e7dd70..eb2711d` delta
     (fk199/fk198/fk197/fk203/fk205), source verification of the hover
     pairing, quote-page field sizing, accent hexes and asset listing,
     owning reads of fk199/fk198/fk197/fk203/fk205/fk149/fk181/fk182, the
     fk208/fk209 creation read-backs, the 3-record open inventory, API
     usage (26,323 calls/9 endpoints) and database telemetry (1,946,564
     calls / 1,533,758 queries / 3 errors on the 2026-11-12T22:55:26Z
     epoch) under the serving-process caveats — full text in Git history
     at merge `c1051ec` (PR #141).
  - fk197 (November 12): the previous roadmap read in full at the
    prepared `9e7dd70` tip (fk195's merge), the `5465b66..9e7dd70` delta
    (fk189/fk187/fk188/fk193/fk195), source verification of the hover
    pairing, quote-page field sizing and tokenized accent roles, owning
    reads of fk188/fk189/fk193/fk195/fk187/fk149, the fk198/fk199
    creation read-backs, the 36-record open inventory, API usage
    (113,289 calls/10 endpoints) and database telemetry (207,368 calls /
    179,879 queries / 6 errors on a fresh 15:55:01Z epoch) under the
    serving-process caveats — full text in Git history at merge `6242e9e`
    (PR #138).
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
