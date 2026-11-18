# Product and operation roadmap

Reviewed: 2026-11-18 (fk265), source baseline
`99a6a23704370d2f8d550fdeaee7382c66129313` (this task's prepared base,
which is fk259's merge — origin/main re-read at these build reads via a
fresh fetch and confirmed unchanged at the tip). The prepared checkout
arrived directly at the tip — unlike the investigation's stale `30f72ae`
snapshot, whose warning was resolved by re-preparation before any edit —
and every row below is written from fresh owning reads at the tip rather
than copied from the handoff, continuing the fk187/fk197/fk219/fk231/
fk241/fk251 discipline.

This roadmap connects the Swedish Svärd Entreprenad website to operating a
product with minimal human intervention. Source capability, task delivery,
accepted quality and observed production operation are separate evidence.
Goals are proposed work, not authorization to expand the site's runtime.
This refresh supersedes fk251's November 17 assessment (PR #163, merge
`86fa8e5`), which was read in full from this checkout's committed copy,
and continues the ownership chain fk44 → fk54 → fk66 → fk72 →
fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
fk187 → fk197 → fk219 → fk231 → fk241 → fk251 → fk265: the previous
document was reconciled with exact merge receipts and current source.
Earlier assessments remain in Git; their ownership is reconciled below and
their retained read logs are compressed to pointers (see Evidence
boundaries).

## Where we are

AlvaLinus is a static React/TypeScript/Vite site with twelve routes:
`/`, `/offertberakning/`, `/draneringsberakning/`, `/tjanster/`, `/inhyrning/`,
`/om-oss/`, `/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [contracts](../src/types/site.ts) and
[the renderer](../src/pages/SiteHomePage.tsx) own product behavior.
There is no application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Since the November 17 review, main advanced from `30f72ae` (fk251's
baseline, fk248's merge) to `99a6a23` (this baseline) through five
merges in order:

- **fk253** (PR #162, head `54ead38b` → merge `de05fa5`, closed
  2026-11-17T21:21Z; run-quality pass at head `54ead38b`; 7 files,
  +119/−22) carried the quote calculators' free-text notes through the
  share links — the carry fk233's own scope had deliberately excluded:
  `quoteShareParams` gained the fixed `notes: "anteckning"` parameter,
  both calculators encode the note only when non-empty (note-less links
  stay byte-identical to the old output), the restore-once initial pass
  seeds the notes field from the decoded value, tolerant decoding keeps
  long/special-character text safe, and the fk215 no-focus-stealing and
  fk247 clipboard-feedback contracts stayed untouched — pinned by
  extended quote-share and page tests.
- **fk251** (PR #163, head `2efd6a5` → merge `86fa8e5`, closed
  2026-11-17T21:23Z; run-quality pass at head `2efd6a5`; 1 file,
  +503/−454) was the previous roadmap generation itself: it re-baselined
  the document onto the five-merge `c0e17d2..30f72ae` delta, corrected
  the fk220/fk224 closure story from fresh owning reads (heroes
  re-measured 385,866 / 362,898 / 345,948 B, recompression recorded as
  never landed), and linked fk252 and fk253 — both delivered below.
- **fk252** (PR #164, head `381df35` → merge `6ba9e1c`, closed
  2026-11-17T21:25Z; run-quality pass at head `381df35`; 4 files,
  +4/−4) delivered the three-hero redo fk220's own option-3 wording
  called for: the three sibling full-size WebPs re-encoded in place at
  unchanged dimensions and byte-identical declarations —
   stensattning-photo 385,866 → 252,246 B (−34.6%), quote-hero
   362,898 → 247,578 B (−31.8%), services-hero 345,948 → 230,484 B
   (−33.4%), total 1,094,712 → 730,308 B — and, unlike fk220's bounced
  binaries-only PR #149, it carried the one stale-prose fix the
  recompression made obsolete (the `heroAssetByteBudget` JSDoc example in
  [route-artifacts.mjs](../scripts/route-artifacts.mjs) now citing
  tradgard-generated.webp at 342,786 B), exactly the gate-shaped
  acceptance its record was written for. The text-only diff and the
  re-encoded binaries both landed; the review net-change gate passed it.
- **fk257** (PR #165, head `5b2607c` → merge `0a5964d`, closed
  2026-11-18T18:41Z; run-quality pass 317/317 at head `5b2607c`; 2 files,
  +93/−3) was the frontend-optimization automation's November 18 child:
  the root footer's PAGE_NAV and SERVICE_NAV anchors were blockified
  into `inline-flex items-center py-2` targets and the mailto link gained
  `py-2`, so every footer navigation and email link reaches ≥36px on the
  unchanged `text-sm` text — the blockifying step being load-bearing,
  since inline anchors ignore vertical padding. The new
  [styles.footer-tap-targets.test.ts](../src/styles.footer-tap-targets.test.ts)
  compiles the utilities and asserts the computed height, in fk238's
  header-test style. Its investigation verified the NotFound shortcut
  pills already compliant (`px-4 py-2`) and its delivery summary queued
  the one remaining tap-target class — the Inventory route chips — which
  this refresh linked as
  [fk267](https://app.faktorial.ai/projects/alvalinus/tasks/fk267) (see
  Short-term priorities).
- **fk259** (PR #166, head `1c8dcdc` → merge `99a6a23`, this baseline,
  closed 2026-11-18T19:34Z; run-quality pass 317/317 at head `1c8dcdc`;
  8 files, +145/−32) was the feature-refinement automation's November 18
  child: the feature catalog reconciled with the two product-facing
  commits that landed after its investigate baseline — fk253's
  `anteckning` note carry folded into F6-US4/F6-US2 and the identity
  manifest (eight new declarations mapped with honest direct/technical
  evidence), fk257's three footer tap-target declarations mapped into
  F4-US1 — with F4/F6 and the README re-stamped 2026-11-18, published
  identities F1–F6 and every story ID unchanged. Its required
  `feature-manifest-integrity` proof (native `validate-features`) passed
  valid/complete with zero findings on its committed candidate, and the
  catalog is now reconciled through this delivery; this roadmap references
  it rather than re-deriving catalog state. Its own Build Update records
  that the fk248-queued F6-US4 print-rendering mapping remained
  unconsumed — this refresh linked it as
  [fk268](https://app.faktorial.ai/projects/alvalinus/tasks/fk268) (see
  Short-term priorities).

The chain's longest human gate is now closed end to end. **fk220** (PR
#149, head `140a735`) had closed approved on 2026-11-17T06:09Z **without
a merge receipt**: its branch carried the complete in-place recompression
of the three sibling full-size heroes, canonical quality passed 268/268
at that head, but the review stage's textual-line net-change gate
(`git diff --numstat` prints `-` for the three binaries) had bounced the
binaries-only PR with "zero net changes". Its build-clarification
[fk224](https://app.faktorial.ai/projects/alvalinus/tasks/fk224) closed
at the same moment with no recorded answer timestamp and no comments —
**the chosen resolution text remains invisible in the owning records**
(re-read 2026-11-18: fk224's `answered_at` still carries the zero
timestamp); only the closure outcome was proven. The scope was not lost:
fk251's refresh re-owned it as
[fk252](https://app.faktorial.ai/projects/alvalinus/tasks/fk252) under
fk220's own option-3 wording that "a future task would have to redo the
recompression", with an acceptance written so the PR could not be
binaries-only again (it carried the one stale-prose fix fk220's
clarification itself had described). fk252 delivered within twenty-seven
minutes of its creation: the heroes now measure 252,246 / 247,578 /
230,484 B on main (re-measured 2026-11-18 at this tip), with the
recompression and its prose fix merged as PR #164 — the gate-shaped
acceptance worked exactly as designed, and no reopen of fk220 was ever
needed.

The visitor-facing baseline is a complete self-service surface whose Swedish
text is declared in the typed registry on every delivered surface — including
the calculators' prices and tier amounts (fk232), so a price update is a
content edit — whose accent family is declared entirely through the
token system, whose quote money logic and share-link encoding are
unit-tested, whose calculations survive a reload or onward sharing through a
measurements-bearing link (fk233) that confirms the copy in Swedish or
points to the visible link when the clipboard refuses (fk247) and now
carries the sender's written notes alongside the measurements (fk253),
whose staffing inquiry captures the offered rate's VAT basis when the
visitor states it (fk243), whose desktop header navigation presents
reliably tappable ~36px targets at tablet widths (fk238) and whose footer
navigation and email links hold the same bar on every page (fk257), whose
heaviest hero downloads are the recompressed sibling trio at 252,246 /
247,578 / 230,484 B (fk252), every declared
hero asset exists with the gate keeping it that way, every photo-hero
route's stamped preload describes exactly the candidates its img selects,
every subpage's social card previews that page's own imagery (fk188), no
delivered form control zooms on iOS focus (fk195/fk199), the empty-services
fallback guides visitors to a declared contact surface instead of
dead-ending (fk221), and every emitted document preloads the site fonts at
parse time behind a build-time gate documented in the catalog
(fk228/fk237). What remains inside the delivered surface is the home
page's still-small Inventory route chips (fk267's linked scope), the
declared but undelivered editorial photography — not new visitor
capability.

The open inventory at this refresh's closing read (November 18,
~21:37Z) held exactly **eleven** records: this task, the fk266
worker-monitor incident (the worker's summarize capability returning a
typed configuration error — an operator-side configuration wait, not
site work), and eight delivery notices. The November 17 five-record
inventory emptied out within a day: fk253 and fk252 — fk251's two links —
closed delivered the same evening (21:21Z and 21:25Z), and the November
18 automation children fk257 and fk259 closed delivered at 18:41Z and
19:34Z, each with a passed run-quality run (317/317) and, for fk259, a
passed required `validate-features` proof. After this refresh's two
creations (fk267, fk268, both read back open) the inventory holds
thirteen records, of which only this task and the two new issues are
steering work.

### What works well

- The typed route/service registry is the single declaration source for every
  page-level Swedish string and, since fk232 (PR #153), every calculator money
  figure on the delivered surface: per-route `<title>`/description and social
  card values, navigation labels, service summaries, tags, guidance and
  detail, the five home sections' copy and service photos (fk114), the shared
  chrome including the Kalkyler group (fk115/fk127/fk144), each route's hero
  photo path (fk112/fk122), both quote calculators' full copy including their
  mailto templates (fk140), the staffing-inquiry page's validation messages,
  mailto draft labels, field specs and aside copy (`content.inquiry`, fk154),
   the inquiry's new optional rate-VAT-basis select (fk243's `rateBasis`
   declaration), the quote pages' registry-declared share and clipboard-status
   copy (`quote.shared`, fk233/fk247), the calculators' pricing blocks (`quote.drainage.pricing`,
   `quote.uppfart.pricing`, fk232) with required typed fields
   ([types/site.ts](../src/types/site.ts)) — so tier boundaries, per-unit
   prices, the rate's VAT wording and the share feedback are
   maintainer-editable content, and
   [quote.ts](../src/lib/quote.ts) stays content-agnostic with no numeric
   price literal. Since fk253 the share contract also owns its notes
   parameter: `quoteShareParams.notes` is the fixed `"anteckning"` name,
   encoded only when non-empty so note-less links stay byte-identical,
   with both calculators' encode and tolerant-decode directions living in
   [quote-share.ts](../src/lib/quote-share.ts). Since fk177 (PR #127) and fk185 (PR #130) the registry also
  carries `heroPhotoSrcSet`/`heroPhotoSizes` responsive-hero declarations on
  all nine photo-hero routes, consumed by both the renderer and the preload
  stamper; since fk188 (PR #133) the same field sources every emitted
  subpage's `og:image`/`twitter:image` with the static gate
  existence-checking each emitted path.
- The quote calculators' money logic is pinned at its own boundary, and the
  pin can no longer drift from the declaration:
  [quote.test.ts](../src/lib/quote.test.ts) (fk155, PR #117) covers
  `drainageTotal`'s tiering including the exact 55 m boundary and the
  fixed-cost floor at zero input, `drivewayTotal` with and without the
  asphalt flag, sv-SE `formatMoney`/`formatNumber` output and
  `vatStatusLabel`, plus fk135's `fillTemplate`/`buildQuoteMailto`
  placeholder contract — and since fk232 its expected totals are derived
  from the registry's pricing declarations rather than duplicating the
  numbers. fk233 added
   [quote-share.test.ts](../src/lib/quote-share.test.ts), pinning the fixed
   URL parameter names, driveway and drainage search encoding, tolerant
   decoding and absolute href building, with both page suites pinning the
   produced share URL and the restore-with-recomputed-total on load; fk247
   added [QuoteResultAside.test.tsx](../src/components/QuoteResultAside.test.tsx),
   pinning the announced confirmation on clipboard resolve and the
   manual-copy fallback on reject or absent clipboard; and fk253 extended
   the share pins for the note carry — encode includes a non-empty note
   and omits an empty one, restore fills the notes field, absence restores
   it empty exactly as before, and long/special-character notes
   round-trip through the URL encoding.
- Contrast, form-field sizing, the whole accent family and the desktop
  tap targets are enforced by test rather than by one-off repairs on every
  front they were repaired: fk151 (PR #114) darkened the light-surface
  `--primary` token with a deterministic contrast test; fk171 (PR #125)
  put the quote and inquiry form-field boundaries at `#64748b` (~4.8:1 on
  white) under a focused ≥3:1 stylesheet test; fk189 (PR #132) tokenized
  the quote/inquiry CTA accent; fk195 (PR #135) put the contact form's
  controls on the 16px zoom floor; fk198 (PR #137) pinned the services
  "Läs mer" hover to the AA-enforced `--primary-hover` token; fk199 (PR
  #136) put both quote calculators' select and textarea on the same 16px
  floor; fk205 (PR #140) added the alpha-compositing read-more pairing
  test; fk208 (PR #142) extended the page-accent test to focus-visible
  outlines and selection; fk238 (PR #155) added
   [styles.header-nav-tap-targets.test.ts](../src/styles.header-nav-tap-targets.test.ts),
   which pins the desktop `py-2` padding utilities, the unchanged mobile
   menu classes and the compiled 36px-in-64px math; fk243 (PR #158)
   extended the inquiry's 16px floor to its new rate-basis select with its
   own stylesheet rule; and fk257 (PR #165) put the footer on the same
   enforcement:
   [styles.footer-tap-targets.test.ts](../src/styles.footer-tap-targets.test.ts)
   pins the blockified `inline-flex items-center py-2` footer classNames
   with the requireExactlyOnce/requireCount helpers and asserts the
   compiled line-height + 2×padding ≥36px — the footer and header
   tap-target contracts now holding at two independent boundaries.
   fk183 (PR #129),
  fk203 (PR #139), fk213 (PR #146) and fk227 (PR #150) mapped the
  delivered tests into the feature catalog as technical evidence at their
  strongest owning stories, so the catalog's evidence map names the real
  owning tests.
- The quote pages' structure is owned once: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx)
  (fk135) owns the result-aside, page shell, notes field, reset button and
  mailto composition — and since fk233 the share affordance and since
  fk247 its clipboard-status feedback too, so a caption, template,
  share-copy or feedback fix lands in one file while each page
  keeps its distinct calculator logic.
- The delivered interactive surface is real product capability: both quote
  calculators honor fk120's constraints (preliminary totals only, hidden
  internal prices, no assumed VAT status, safe invalid-input handling, print
  and email handoff), the staffing inquiry validates required fields in
  Swedish and hands a complete mail draft to the visitor's own email
  program — now including the stated VAT basis of the offered rate when the
  visitor provides one (fk243) — since fk215 the `/offertberakning/`
  calculator keeps keyboard and screen-reader users anchored when a view
  switch reveals the driveway form, with the focus-flow contract pinned in
  [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) (initial load moves
  no focus; both switch directions land on the revealed view's heading),
  since fk221 the empty-services fallback carries a registry-declared
  Swedish contact action so the availability notice never dead-ends, pinned
  by the extended empty-services tests in
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx), since fk233 a
  visitor's calculation survives a reload or being sent onward through one
  shareable link with the measurements restored and the total recomputed
   identically, since fk247 that share button announces its outcome in
   Swedish instead of failing silently, since fk253 the shared link also
   carries the sender's written notes so the recipient sees the complete
   context, since fk238 the desktop header
   navigation presents ~36px tap targets at tablet widths without shifting
   the header's 64px height, and since fk257 the footer's navigation and
   email links hold the same ≥36px bar on every page of the site.
- Existing tests cover the delivered behavior:
  [SiteHomePage.test.tsx](../src/pages/SiteHomePage.test.tsx) pins route and
  content structure, chrome, the registry-owned hero map and the fk198
  hover classes; [QuotePage.test.tsx](../src/pages/QuotePage.test.tsx) and
  [DrainageQuotePage.test.tsx](../src/pages/DrainageQuotePage.test.tsx) pin
  both calculators with registry-derived pins — fk185 added the drainage
  page's rendered hero srcset/sizes assertion, fk215 the focus-flow
  contract and fk233 the share encode/restore pins;
  [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) pins the staffing
  inquiry — fk243 extended it with the rate-basis render, draft and
   omission pins; [QuoteResultAside.test.tsx](../src/components/QuoteResultAside.test.tsx)
   pins fk247's clipboard feedback, extended by fk253's note-carry pins;
   the route-emission plugin and its
  per-subpage preload stamping are
  covered by deterministic in-memory fixture tests in
  [`route-artifacts.test.mjs`](../scripts/route-artifacts.test.mjs) (fk164
  extended them for the hero-asset gate, fk161 for the enriched stamping,
  fk177/fk185 for the now-nine-route srcset exclusivity maps and drainage
  preload form, fk188 for the per-route social-image substitution and its
  SVG-hero raster fallback, and fk228 for the font-preload selection, tag
  shape, injection point, no-op and commutation); the release-provenance
  composition, artifact manifest and quality-evidence modules each carry
  their own node-env fixture tests
  ([release-provenance.test.mjs](../scripts/release-provenance.test.mjs),
  [artifact-manifest.test.mjs](../scripts/artifact-manifest.test.mjs),
  [quality-evidence.test.mjs](../scripts/quality-evidence.test.mjs)); the
  reduced-motion override, the primary-contrast tokens, the form-field
  borders, the quote-page CTA accent pairing (fk189), the contact form's
  16px field floor (fk195), the quote pages' 16px floor (fk199), the
  compiled primary-hover utility (fk198), the read-more hover pairing
   (fk205), the focus-visible/selection token declarations (fk208), the
   desktop header tap targets (fk238), the compiled footer tap targets
   (fk257's
   [styles.footer-tap-targets.test.ts](../src/styles.footer-tap-targets.test.ts))
   and the quote lib boundary
   ([quote.test.ts](../src/lib/quote.test.ts)) have their own focused
   tests. This refresh inspected source and owning records; it did not
   execute those tests.
- The feature catalog covers the whole route surface and is reconciled:
  six features F1–F6 with the quote calculators documented as F6 (fk133),
  validate-features passing recorded through fk237's, fk248's and —
  newest — fk259's deliveries (fk259's required `feature-manifest-integrity`
  proof passed valid/complete with zero findings on its committed
  candidate `1c8dcdc`, read from its own record's proof packet; the older
  closed records' issue-level proof projections still report
  `missing_evidence` — the owning records are closed/done and the
  projections do not reopen them). The drifts fk241 linked are retired:
  fk242 (PR #159, merge `27bf18e`) reconciled quote-calculators.md and
  navigation-and-recovery.md with the delivered registry pricing, the
  fk221 contact action and fk238's tap targets, fk248 (PR #161,
  merge `30f72ae`) completed the reconciliation with fk233's share-link
  mappings and `quote-share.ts` as an F6 runtime owner, and fk259
  (PR #166, merge `99a6a23`) folded in fk253's note-carry mappings under
  F6 and fk257's footer tap-target declarations under F4 with the catalog
  re-stamped 2026-11-18 — so this roadmap references the reconciled
  catalog rather than re-deriving its state. The catalog's recorded
  frictions are now the operator-owned VAT-confirmation item and the
  drainage length-only pricing model; the price-constants and
  empty-services-contact items the older records carried are delivered
  work, retired by fk242/fk248's passes. The
  [route inventory](current-public-route-inventory.md) (checked
  2026-11-04) matches the twelve-route registry.
- Image handling is layered and consistent: every photo-hero route
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
   home hero so no emitted social image is an SVG. The full-size byte
   weights are now delivered work: fk209 re-encoded the tradgard hero in
   place to 342,786 B (from 501,858 B) with declarations byte-identical,
   and fk252 (PR #164, merge `6ba9e1c`) completed the sibling trio in
   place — stensattning-photo 252,246 B, quote-hero 247,578 B,
   services-hero 230,484 B at unchanged dimensions (re-measured
   2026-11-18 at this tip) — with every -640/-960/-400 variant and the
   next-largest base (`gravjobb-photo.webp`, 148,896 B) efficiently
   sized, and the gate's `heroAssetByteBudget` prose updated to name the
   actual largest preloaded hero (tradgard-generated at 342,786 B).
- Font delivery starts at parse time, is gate-enforced, and is
  documented in the catalog: since fk228 (PR #151, merge `80eb6bd`) the
  build injects one preload link per emitted woff2 asset — the site's
  76.7 KB of Fontsource-owned display and body fonts — into every
  emitted document head (root, every subpage, `dist/404.html`), each
  single-line tag carrying `as="font"`, `type="font/woff2"`, `crossorigin`
  and the exact hashed href of that build, so the fonts race the
  stylesheet instead of trailing it and Swedish text renders in the real
  fonts sooner on slow connections. The injection is pure-helper based
  ([route-artifacts.mjs](../scripts/route-artifacts.mjs):
  `bundleFontPreloadHrefs`/`distFontPreloadHrefs`/`fontPreloadLinkTag`/
  `injectFontPreloadLinks`), deterministic no-op when a build emits no
  woff2 assets, and
  [assert-static-routes.mjs](../scripts/assert-static-routes.mjs) requires
  exactly those tags byte-for-byte on every emitted document. Since fk237
  (PR #156) the emission has a source-backed F4 catalog passage distinct
  from the hero-preload prose, with six reviewed test mappings and the
  owning script named in the F4 record.
- Dependency hygiene stays continuous and documented: fk149's caret-range
  refresh left zero in-range drift, every major-version jump is deferred
  with a recorded reason, and the November 14 dependency-management child
  (fk214, PR #144) refreshed the Vite toolchain lockfile-only in range
  (vite 8.3.8, @vitejs/plugin-react 6.3.0, postcss 8.5.33) with
  `package.json` byte-identical — re-verified through fk214's owning read
  on November 16 and unchanged since (no dependency child has run; its
  deferral backlog and coordinated vitest-5 prompt stand). The deferral
  backlog covers the
  exactly-pinned vitest/coverage-v8 4.1.9 pair, tailwindcss 4,
  tailwind-merge 3, typescript 7 main swap, lucide-react 1.x, jest-dom 7
  and the @types/node bump.
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
  tasks: this is the twentieth consecutive roadmap refresh, each
  reconciling the previous one against owning records before linking new
  work. The loop's throughput is visible in this baseline: five merges
  landed between fk251's baseline and this tip in about a day
  (fk253 and fk251's own PR the same evening fk251 linked its issues,
  fk252 twenty-seven minutes after its creation the same evening, then
  fk257 and fk259 the next afternoon), and the steering loop stays fast:
  fk252, created 20:58:37Z on November 17, closed delivered at 21:25:35Z
  with fk253 at 21:21Z (~22 and ~27 minutes link-to-close), and the
  November 18 automation children delivered within about seventeen and
  forty-five minutes of creation (fk257 at ~17 minutes, fk259 at ~45).
  This refresh's own links (fk267, fk268) were created and read back open
  with exact labels. The chain also absorbs adverse timing without losing
  accuracy or work: this investigation's snapshot was stale at
  `30f72ae`, the prepared build checkout arrived at the `99a6a23` tip
  instead, and this refresh's rows are reconciled from fresh owning reads
  at that tip rather than the stale handoff — the documented
  fk187/fk197/fk219/fk231/fk241/fk251 re-preparation discipline. It
  closed out its longest-running adverse arc: fk220's finished-but-unmerged
  recompression became fk252's re-owned redo under fk220's own option-3
  wording, and fk252's gate-shaped acceptance — the prose fix carried so
  the PR was not binaries-only — passed review and merged, landing the
  roughly 364 KB of first-paint savings the original PR never delivered.
  The November 18 operational events were absorbed without intervention:
  fk259's investigate stage burned four `submit_stage_result` rejections
  on the template's missing no-change clause before concluding, and the
  follow-up incident record
  ([fk260](https://app.faktorial.ai/projects/alvalinus/tasks/fk260))
  delivered the one-clause template repair on fk6's own record without
  touching the repository; two fk260 learn-stage runs exited unconfirmed
  and self-healed through scheduled retries
  ([fk263](https://app.faktorial.ai/projects/alvalinus/tasks/fk263),
  closed `already_satisfied`); and the worker's summarize capability
  returns a typed configuration error on this worker, parked as
  [fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) on an
  operator-side configuration wait — degraded efficiency, not a blocked
  loop.

### What works less well and what to improve

- The home page's Inventory route chips are the last shared-chrome tap
  targets below the site's 36px bar: the chips under the service
  sections ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):525) still
  carry `px-3 py-1` on non-blockified `text-sm` anchors (~28px computed
  targets, re-verified at this tip), while the desktop header (fk238),
  the footer navigation and email links (fk257) and the NotFound
  shortcut pills (already `px-4 py-2`, verified compliant by fk257's
  investigation at :683) all meet the bar. fk238's queued sweep named
  the chips, fk257 delivered the footer half and queued exactly this
  remainder on its own record (2026-11-18 delivery summary), and this
  refresh converted it to an owned issue:
  [fk267](https://app.faktorial.ai/projects/alvalinus/tasks/fk267)
  (created and read back open 2026-11-18T21:40:30Z with labels
  `priority: medium` and `size:medium`) blockifies the chips to
  `inline-flex items-center py-2` with fk257's compiled-height test
  pattern. Owned by fk267's record; recorded once here, not awaited or
  duplicated.
- The feature catalog's F6-US4 story record still carries the print
  hand-off as an honestly unmapped gap: the delivered "Skriv ut" button
  invokes `window.print()`
  ([QuotePageShared.tsx](../src/components/QuotePageShared.tsx):74) and
  both quote routes' shared stylesheet hides the action controls and
  restyles the layout in `@media print` blocks
  ([QuotePage.css](../src/pages/QuotePage.css):5/:41, re-verified at
  this tip), but no source anchor or test evidence for that path is
  mapped in the F6 records. fk248 recorded the gap and queued exactly
  this mapping on its own record (2026-11-17); fk259's November 18 pass
  mapped fk253/fk257 but again left the print path unmapped; and this
  refresh converted the prompt to an owned issue:
  [fk268](https://app.faktorial.ai/projects/alvalinus/tasks/fk268)
  (created and read back open 2026-11-18T21:40:53Z with the same labels)
  maps the source anchors, adds the smallest deterministic
  print-stylesheet pin in the established `?raw` test pattern, and keeps
  backend-entry-points.json honestly empty — `window.print()` is a
  visitor-invoked browser call, not an incoming port. Owned by fk268's
  record; recorded once here, not awaited or duplicated.
- The quote calculators' standing "Momsstatus ej bekräftad" label still
  means visitors cannot tell whether a preliminary total includes VAT,
  which weakens the number as a budgeting input. Confirming the VAT
  treatment and changing the label is an operator decision; no agent
  carries it (fk243's delivered capture covers the staffing inquiry's
  offered rate, deliberately not the calculators' totals). The drainage
  calculator similarly prices length only, so depth, soil and access
  variations stay invisible to the visitor even though the disclaimer
  says scope is assessed later — owner-defined pricing rules and
  owner-reviewed Swedish claims are editorial work
  (quote-calculators.md's and service-selection.md's own reconciled
  records), not linked issues.
- Photography remains partially editorial: the three delivered canvas
  photographs, the responsive quote hero and the responsive services hero
  sit beside still-outstanding requests — a real Trädgårdsplanering photo
  (the AI-generated `tradgard-generated.webp` remains in place and is now
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
- fk149's and fk214's documented deferrals stand (fk241's fresh fk214
  owning read on November 16 confirmed the backlog; no dependency child
  has run since): the vitest
  5 + coverage-v8 5 migration
  carries fk214's own follow-up prompt (the pair is exactly pinned at
  4.1.9 and must move together), the other major jumps (tailwindcss 4,
  tailwind-merge 3, lucide-react 1.x, jest-dom 7, main typescript 7,
  @types/node 26) keep their recorded deferral reasons, and the 3 moderate
  npm-audit findings remain documented rather than forced. These stay on
  the dependency-management automation's records; this refresh creates no
  duplicate issue for them.
- Four delivery-summary follow-up prompts stay queued on their own
  closed records, none consumed by the intervening automation children
  (each re-read on its own record 2026-11-18): fk171's contrast-test
  hardening against CSS formatting churn (queued 2026-11-10; the five
  intervening frontend-optimization children fk215/fk228/fk238/fk247/
  fk257 delivered other scopes); fk183's F2 re-stamp (its F3 half was
  consumed by fk203; the seven later feature-refinement children through
  fk259 again left F2 untouched); fk195's real-device iOS
  zoom verification (jsdom cannot reproduce it); and fk228's browser
  measurement of the font-preload head start. Two further prompts are no
  longer bare queue items: fk238's small-tap-target sweep was consumed
  by fk257 (footer delivered, NotFound pills verified already compliant)
  with its one remainder — the Inventory route chips — converted to
  fk267's owned issue, and fk248's F6-US4 print-rendering mapping —
  unconsumed by fk259's intervening November 18 pass — was converted to
  fk268's owned issue. This
  static-test environment has no browser automation, rendered inspection
  is not a delivery prerequisite in this lane, and each surviving prompt
  has a
  named owning record — so none is duplicated as an issue here.

## Delivered work and ownership reconciliation

Authenticated owning task reads were made on October 29 (fk66's refresh and
fk72's catalog reconciliation), on October 30 during fk76's refresh, on
October 31 during fk87's refresh, on November 1 during fk96's refresh, on
November 2 during fk105's refresh, on November 3 during fk113's refresh, on
November 6 during the fk123 refresh, on November 7 during the fk153 refresh,
on November 8 during the fk163 refresh, on November 10 during the fk173
refresh, on November 11 during the fk187 refresh, on November 12 during the
fk197 refresh, on November 13 during the fk207 refresh, on November 14
during the fk219 refresh, on November 15 during the fk231 refresh, on
November 16 during the fk241 refresh, on November 17 during the fk251
refresh (both compressed to pointers below),
and again on November 18 during this fk265 refresh. This checkout's
prepared base equals this baseline `99a6a23`: the checkout advanced from
fk251's reviewed `30f72ae` baseline through the fk253, fk251, fk252,
fk257 and fk259 merges in that order (PRs #162–#166). All five are
closed/done with merge receipts and passed native run-quality runs
(receipts below); fk259 declared and passed the required
`feature-manifest-integrity` proof (native `validate-features`,
valid/complete/zero findings) on its committed candidate per its own
record's proof packet, and the other four carry no proof obligations
beyond ordinary quality. The fk220/fk224 closure recorded by the
previous generation is now resolved: fk220 stayed closed without
merging, and its redo fk252 delivered the recompression with the
prose-carry acceptance (row below). During the November 18 owning
reads, fk267 and fk268 — the two follow-up issues this refresh creates —
read back open at 21:40:30Z/21:40:53Z with labels `priority: medium` and
`size:medium`, so both are owned by their own records and recorded once
in the short-term section below.

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
| [fk78](https://app.faktorial.ai/projects/alvalinus/tasks/fk78), desktop dropdown keyboard coverage | Closed/done; PR #83, merge `a070ee2`; retained native quality pass at head `0823b3c`. Verified in source: the SiteHomePage suite pins the focusable `aria-haspopup` Tjänster trigger and the five-link registry-order panel. | Delivered. Protection of current behavior at the existing DOM boundary; no behavior redesign. fk238's tap-target padding leaves the same trigger and panel behavior unchanged. |
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
| [fk120](https://app.faktorial.ai/projects/alvalinus/tasks/fk120), drainage quote calculator | Closed/done; PR #103, merge `8230760`; native quality pass at head `dbe5498`. Verified in source at this baseline: `/draneringsberakning/` renders the per-meter drainage calculator ([DrainageQuotePage.tsx](../src/pages/DrainageQuotePage.tsx)), `drainageTotal` encodes the 3 500/3 000 kr tiers plus 6 900 kr fixed ([quote.ts](../src/lib/quote.ts)), the Dränering service page carries the registry-declared calculator link band, and the customer view, printout and email show only the preliminary total. | Delivered by operator-authored work. The quote-page copy moved into the registry through fk140 and the structure through fk135; the pricing constants moved into the registry through fk232 (receipt below). |
| [fk121](https://app.faktorial.ai/projects/alvalinus/tasks/fk121), staffing inquiry page | Closed/done; PR #104, merge `4294bb2`; native quality pass at head `7b3ca1a` (conflict-resolution run). Verified in source at this baseline: `/inhyrning/` (route kind `inquiry`) renders the inquiry form with Swedish validation and mail-draft handoff ([InquiryPage.tsx](../src/pages/InquiryPage.tsx)), pinned by [InquiryPage.test.tsx](../src/pages/InquiryPage.test.tsx) and documented in [staffing-inquiry.md](features/staffing-inquiry.md). | Delivered by operator-authored work; its renderer-side Swedish copy was declared in the registry by fk154, below. Its rate field's uncaptured VAT basis was fk243's linked scope — delivered (receipt below). |
| [fk127](https://app.faktorial.ai/projects/alvalinus/tasks/fk127), Kalkyler menu links | Closed/done; PR #105, merge `0ed6ce0`; native quality pass at head `7d8cfa9`. Verified in source at this baseline: `chrome.calcMenu` declares the Kalkyler group — Dränering → `/draneringsberakning/`, Uppfart → `/offertberakning/#uppfart` ([siteContent.ts](../src/data/siteContent.ts)) — and desktop and mobile menus render it. | Delivered by operator-authored work. |
| [fk128](https://app.faktorial.ai/projects/alvalinus/tasks/fk128), Inhyrning menu entry | Closed/done; PR #106, merge `a890c30`; native quality pass at head `2864f86`. Verified in source at this baseline: the header and mobile menu include the Inhyrning route through the registry-derived nav lists ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx)). | Delivered by operator-authored work. |
| Operator photo selection (commit `1bb124a`) | No owning task record; a direct operator-authored commit on main (2026-11-04): selected canvas photographs replace the generated placeholders for Stensättning, Markarbete and Grävjobb cards and page heroes; [image-requests.md](image-requests.md) records the canvas-attachment provenance and retires the Grävjobb request. | Delivered. Editorial photography landed outside the task machinery; recorded once here so no agent recreates it. |
| [fk122](https://app.faktorial.ai/projects/alvalinus/tasks/fk122), quote-hero WebP conversion | Closed/done 2026-11-06T13:32Z; PR #107, head `8378d87` → merge `b4afea0`; native run-quality pass at head `8378d87`. Verified in source at this baseline: `quote-hero.png` is absent from `public/page-visuals`, the `quote-hero` 640w/960w/full WebP trio is present, and the quote route's registry path, rendered `srcSet` and stamped preload agree. | Delivered. fk123's "in build" description is retired; the quote-hero bytes work is complete. The full-size base's byte weight became fk220's scope (closed 2026-11-17 without merging; its redo is fk252's linked scope, receipt below). |
| [fk133](https://app.faktorial.ai/projects/alvalinus/tasks/fk133), quote-calculator feature catalog | Closed/done 2026-11-06T13:50Z; PR #109, head `8af176d` → merge `4050621`; native run-quality pass at head `8af176d`; the native `validate-features` pass recorded at that head stands in the delivery record, while the issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: [features.json](features/features.json) carries six features including F6, and the [route inventory](current-public-route-inventory.md) no longer claims the calculators are outside the catalog. | Delivered. fk123's "in build" description is retired; the quote-route catalog gap is closed. |
| [fk134](https://app.faktorial.ai/projects/alvalinus/tasks/fk134), registry-declared quote-page copy | Closed 2026-11-06T19:00Z with no build PR of its own. Its partially staged worktree branch (`agent-go/task-fk134`) was salvaged into plan fk139, whose children fk140 and fk144 delivered the scope; fk134's record head carries the merged state it was rebased onto. | Delivered via plan fk139. The salvage story is recorded once here; no reopen and no duplicate delivery. |
| [fk139](https://app.faktorial.ai/projects/alvalinus/tasks/fk139), quote-copy delivery plan | Plan closed/done 2026-11-06T19:56Z; all four plan items complete; PR #110. | Delivered through its children fk140 and fk144. fk123's fk134/fk135 "open next step" rows are retired by the deliveries below. |
| [fk140](https://app.faktorial.ai/projects/alvalinus/tasks/fk140), quote calculators on registry copy | Closed/done 2026-11-06T19:28Z; PR #110, head `1a154a1` → merge `7d78282`; native run-quality pass at head `1a154a1`. Verified in source at this baseline: both quote pages render `content.quote.shared/.uppfart/.drainage` with placeholder-filled mailto drafts, and both quote test files derive pinned strings from the registry. | Delivered. The former "renderer-side quote copy" gap is retired. |
| [fk144](https://app.faktorial.ai/projects/alvalinus/tasks/fk144), chrome strings in the registry | Closed/done 2026-11-06T19:50Z; PR #111, head `3ab8bea` → merge `e3a4eef`; native run-quality pass at head `3ab8bea`. Verified in source at this baseline: SiteHomePage renders all eight inventoried chrome strings from the registry and its test pins derive from it. | Delivered. The former "leftover chrome set" gap is retired. |
| [fk135](https://app.faktorial.ai/projects/alvalinus/tasks/fk135), quote-page structure consolidation | Closed/done 2026-11-06T20:15Z; PR #112, head `5dda9b9` → merge `718f19e`; native run-quality pass at head `5dda9b9`. Verified in source at this baseline: [QuotePageShared.tsx](../src/components/QuotePageShared.tsx) exists and both quote pages import and render through its shared shell, aside, notes field, reset button. | Delivered. fk123's "open next step, sequenced after fk134" description is retired; the structural duplication is consolidated. fk233's share affordance extends the same shared shell (receipt below). |
| [fk149](https://app.faktorial.ai/projects/alvalinus/tasks/fk149), caret-range lockfile refresh | Closed/done 2026-11-07T12:54Z; PR #113, head `f52b1e1` → merge `7d1b3dc` (fk153's baseline); native run-quality pass at head `f52b1e1` (run `feb68668-448c-4c79-a52d-5b8da2634927-build-dmoznfv2hosg-quality`, re-read November 13). Lockfile-only diff (eight in-range bumps); every major-version jump deliberately deferred with recorded reasons, the vitest 5 migration carries fk149's own follow-up prompt, and its record documents the 3 moderate npm-audit findings left unfixed because `npm audit fix --force` would pull the excluded majors. | Delivered. Routine dependency maintenance with documented deferrals; the deferrals and prompt stay on the dependency-management automation's records — fk214's November 14 child below re-documented the backlog fresh, so fk149's rows are historical provenance. |
| [fk151](https://app.faktorial.ai/projects/alvalinus/tasks/fk151), WCAG AA contrast repair | Closed/done 2026-11-07T14:09Z; PR #114, head `283488f` → merge `ba032ac`; native run-quality pass at head `283488f`. Verified in source at this baseline: the darkened `--primary`, the `--primary-on-dark` token and the deterministic contrast test are in [styles.css](../src/styles.css) and [its test](../src/styles.primary-contrast.test.ts). | Delivered. fk153's "in review" description is retired; the two-shade accent repair and its enforcement test are merged. The "Läs mer" hover follow-up from its delivery summary was delivered by fk198 (receipt below) and double-enforced by fk205's pairing test (also below). |
| [fk152](https://app.faktorial.ai/projects/alvalinus/tasks/fk152), feature-catalog stamp refresh | Closed/done 2026-11-07T14:17Z; PR #115, head `81093b5` → merge `18da5d9`; native run-quality pass at head `81093b5`; its delivery summary records the validate-features pass at that head while the closed record's issue-level proof projection still reports `missing_evidence` (the owning record is closed/done and the projection does not reopen it). Verified in source at this baseline: `features.json` stamps read 2026-11-07 on all six features. | Delivered. fk153's "in build" description is retired; the story-document stamp re-read it deferred was absorbed by the later fk162/fk172/fk183 reconciliations. |
| [fk153](https://app.faktorial.ai/projects/alvalinus/tasks/fk153), previous roadmap | Closed/done 2026-11-07T14:25Z; PR #116, head `89705da` → merge `e2ca438`; native run-quality pass at head `89705da`. Document read in full during the fk163 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk154/fk155, and its in-flight fk151/fk152 reservations are delivered above. |
| [fk155](https://app.faktorial.ai/projects/alvalinus/tasks/fk155), quote money-logic unit tests | Closed/done 2026-11-07T14:35Z; PR #117, head `41dac58` → merge `2fdfc82`; native run-quality pass at head `41dac58`. Verified in source at this baseline: [quote.test.ts](../src/lib/quote.test.ts) pins both totals' tiering and flags, the sv-SE formatting and the template placeholder contract. | Delivered. The former "money logic exercised only through DOM assertions" gap is retired. fk232's registry-derived pins extend the same file (receipt below). |
| [fk154](https://app.faktorial.ai/projects/alvalinus/tasks/fk154), inquiry-page registry declaration | Closed/done 2026-11-07T14:46Z; PR #118, head `8a33f1a` → merge `feef822` (fk163's baseline); native run-quality pass at head `8a33f1a`. Verified in source at this baseline: `content.inquiry` is declared on the typed registry and [InquiryPage.tsx](../src/pages/InquiryPage.tsx) renders registry fields with registry-derived pins. | Delivered. The former "last renderer-side Swedish surface" gap is retired; the route/service registry is now the single Swedish declaration source for the delivered surface. F5's catalog records predated this delivery; fk176's delivery below reconciled them. fk243's delivered VAT-basis select (receipt below) extends the same declaration pattern. |
| [fk161](https://app.faktorial.ai/projects/alvalinus/tasks/fk161), services-hero responsive variants | Closed/done 2026-11-08T15:05Z; PR #119, head `2d28b86` (after a repair commit fixing two strict-null test errors) → merge `7396db5`; native run-quality pass at head `2d28b86`. Verified in source at this baseline: `services-hero-640.webp`/`-960.webp` exist, the services route declares `heroPhotoSrcSet`/`heroPhotoSizes`, the stamper emits `imagesrcset`/`imagesizes` exactly for declaring routes, and the gate existence-checks declared candidates. | Delivered. fk163's "in review" description is retired. Its delivery summary's follow-up prompt — migrating the remaining hero srcsets into registry declarations — was consumed by the linked fk177 below, recorded once so the prompt and the task are not duplicated. The full-size base's byte weight became fk220's scope (closed without merging; fk252's redo is linked below). |
| [fk162](https://app.faktorial.ai/projects/alvalinus/tasks/fk162), feature-catalog reconciliation | Closed/done 2026-11-08T15:23Z; PR #120, head `b81d4e1` → merge `be106db`; native run-quality pass at head `b81d4e1`; its delivery records the validate-features pass on the candidate (digest `dfa2a48a…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6 lists `QuotePageShared.tsx` in both manifests, quote-calculators.md and navigation-and-recovery.md are stamped 2026-11-08, and F4-US1 maps the chrome-rendering test. | Delivered. fk163's "in build" description is retired. Its F5 follow-up shipped as the linked fk176 below. |
| [fk163](https://app.faktorial.ai/projects/alvalinus/tasks/fk163), previous roadmap | Closed/done 2026-11-08T15:27Z; PR #121, head `43c156c` → merge `c084a50`; native run-quality pass at head `43c156c`. Document read in full during the fk173 refresh. | Superseded assessment; its Next 1/Next 2 shipped as fk164/fk165 below, and its in-flight fk161/fk162 reservations are delivered above. |
| [fk164](https://app.faktorial.ai/projects/alvalinus/tasks/fk164), dead-hero re-point and gate extension | Closed/done 2026-11-08T15:35Z; PR #122, head `ade983b` → merge `3b19a91`; native run-quality pass at head `ade983b`. Verified in source at this baseline: `/om-oss/` and `/kontakt/` declare the in-tree `svard-entreprenad-about.svg`/`-contact.svg` heroes ([siteContent.ts](../src/data/siteContent.ts):88/:172), no `about-hero.webp`/`contact-hero.webp` exists or is declared, and the gate rejects any route whose declared hero path is missing. | Delivered. fk163's "open next step" description is retired; the dead-reference class is closed at the declaration and gate level. |
| [fk165](https://app.faktorial.ai/projects/alvalinus/tasks/fk165), release-provenance command | Closed/done 2026-11-08T15:44Z; PR #123, head `063e171` → merge `72af228`; native run-quality pass at head `063e171`. Verified in source at this baseline: [release-provenance.mjs](../scripts/release-provenance.mjs), the `write-release-provenance` CLI and its fixture tests exist, and [release-runbook.md](release-runbook.md) references the composed path with publication identity kept operator-recorded. | Delivered. fk163's "open next step" description is retired; the four-identity sequence is one fail-closed command. |
| [fk172](https://app.faktorial.ai/projects/alvalinus/tasks/fk172), feature-catalog re-verification | Closed/done 2026-11-10T08:02Z; PR #124, head `69d1bec` → merge `7931e16`; native run-quality pass at head `69d1bec`; its delivery records the validate-features pass on the candidate (digest `b7527970…`) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the README reconciliation note and 2026-11-10 stamps on F2/F4/F6, the SVG-hero prose corrections in company-confidence.md and navigation-and-recovery.md, and F5 left at 2026-11-07 on a rationale its own record states ("nothing touched their documented behavior"). | Delivered. The November 9 feature-refinement child, merged November 10. Its F5 rationale did not hold against fk154's post-stamp merge; fk176's delivery corrected the F5 records instead of reopening fk172 work. |
| [fk171](https://app.faktorial.ai/projects/alvalinus/tasks/fk171), WCAG field-border contrast | Closed/done 2026-11-10T14:36Z; PR #125, head `1f6aba4` → merge `ea2d472` (fk173's baseline); native run-quality pass 235/235 at head `1f6aba4`. Verified in source at this baseline: the three field-boundary declarations draw `#64748b` ([QuotePage.css](../src/pages/QuotePage.css):15/:18, [InquiryPage.css](../src/pages/InquiryPage.css):19), [the focused contrast test](../src/styles.field-border-contrast.test.ts) computes the ratio from raw CSS, and `test.css.include` is generalized. | Delivered. The November 9 frontend-optimization child, merged November 10. Its delivery summary's follow-up prompt — hardening the contrast test's selector matching against CSS formatting churn — stays on fk171's record (fk241 re-verified it 2026-11-16; the intervening frontend-optimization children fk205/fk215/fk238/fk247 delivered other hardening instead, so the prompt remains queued there unconsumed). |
| [fk173](https://app.faktorial.ai/projects/alvalinus/tasks/fk173), previous roadmap | Closed/done 2026-11-10T16:04Z; PR #128, head `e51ccf3` → merge `74ef9ae` (on fk177's `719a11e` base); native run-quality pass at head `e51ccf3`. Document read in full during the fk187 refresh. | Superseded assessment; its two linked next steps were both delivered before it closed — fk176 merged at 15:24Z and fk177 at 15:53Z on November 10 (receipts above and below) — and its works-less-well rows are re-baselined onto the `99a6a23` tip. |
| [fk176](https://app.faktorial.ai/projects/alvalinus/tasks/fk176), F5 catalog reconciliation | Closed/done 2026-11-10T15:24Z; PR #126, head `b71a47a` → merge `ab28b45` (fk173's baseline); native run-quality pass 235/235 at head `b71a47a`; the required `validate-features` proof passed on its candidate (aggregate digest `f2589022…`, no findings). Verified in source at this baseline: [staffing-inquiry.md](features/staffing-inquiry.md) stamped 2026-11-10 names the registry-declared `inquiry` copy with InquiryPage.tsx's remaining runtime ownership, the shared inventory's F5 code-path descriptions match the fk154 split, and the README carries the fk176 reconciliation sentence. | Delivered. Created and linked by the fk173 refresh at 14:49:33Z (read back open with labels `priority: medium` and `size:medium`), picked up from the roadmap and merged within roughly half an hour — consuming fk162's dropped F5 follow-up. fk243's later delivery (receipt below) reconciled the same document for the VAT-basis capture. |
| [fk177](https://app.faktorial.ai/projects/alvalinus/tasks/fk177), remaining hero srcset declarations | Closed/done 2026-11-10T15:53Z; PR #127, head `6a1d0f9` → merge `719a11e` (fk173's base); native run-quality pass at head `6a1d0f9` (run `3fb3ed43-7d2f-4ea2-8b2b-5f86efda0797-build-dmrnb0rhdqyc-quality`, re-read November 11). Verified in source at this baseline: the home, four `*-photo` service-detail, `/tradgardsplanering/` and `/offertberakning/` routes declare `heroPhotoSrcSet`/`heroPhotoSizes` byte-identical to the candidates their heroes rendered before, QuotePage.tsx reads the registry declaration instead of the inline literal, and `/draneringsberakning/` was deliberately left undeclared at that point (no variant family existed and its plain preload already matched). Its own investigation corrected fk173's nine-route count to seven mismatching heroes. | Delivered. fk173's linked Next 2, created and linked at 14:49:50Z (read back open with labels `priority: medium` and `size:medium`), delivered about an hour later. This was the last plain-preload mismatch class; fk185's delivery below completed the declaration set by adding the drainage-quote route. |
| [fk183](https://app.faktorial.ai/projects/alvalinus/tasks/fk183), feature-catalog evidence mapping | Closed/done 2026-11-11T08:52Z; PR #129, head `8c50f1b` → merge `74475bb`; native run-quality pass at head `8c50f1b`; the delivery records the validate-features pass at that head (digest `63fd5b48…`, valid with no findings) while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: the identity manifest maps the three styles accessibility tests and `quote.test.ts` as 22 technical references at their strongest owning stories, seven story documents mirror the mappings, F1/F4/F5/F6 and the touched docs carry 2026-11-11 stamps, and the README names all eight mapped test files. | Delivered. The November 11 feature-refinement child. Its documented `.quote-send` token exclusion (delivery-summary comment only) was resolved by fk189's delivery (receipt below). Its follow-up prompt — re-reading F2/F3's source and re-stamping their records — was partially consumed on November 13: fk203 re-stamped F3 (alongside F1/F6) against the fk195/fk198/fk199 deltas, while F2 stays deliberately untouched — fk213's, fk227's, fk242's and fk248's later children again left F2 untouched — so that remainder stays queued on fk183's record for the recurring feature-refinement automation. |
| [fk185](https://app.faktorial.ai/projects/alvalinus/tasks/fk185), drainage-quote hero srcset | Closed/done 2026-11-11T15:05Z; PR #130, head `3392f82` (after a one-array test-expectation repair) → merge `5465b66` (fk187's baseline); native run-quality pass at head `3392f82` (run `4089a89a-f737-451b-8978-57a0a2992125-build-dmsgykgpc8wo-quality`, re-read November 11 during the fk187 refresh). Verified in source at this baseline: the drainage-quote route declares `heroPhotoSrcSet` reusing the byte-identical `dranering-photo-400/-640.webp` variants (SHA-256 `d2c8b5f0…78760`, no new binaries) plus the 900w base, DrainageQuotePage reads the registry through QuotePageShell's hero props, and a focused test pins the rendered srcset/sizes. | Delivered. The November 11 frontend-optimization child; with fk177 it closes the whole preload/srcset mismatch class — all nine photo-hero routes now declare registry variants. **Its delivery summary's follow-up prompt is retired as factually stale**: it claims `/offertberakning/` "still hardcodes its srcset with a preload mismatch", but fk177 (PR #127, merge `719a11e`, closed 2026-11-10) already declared that route's srcset and moved QuotePage.tsx onto the registry — verified at this tip. Recorded once so the frontend-optimization automation does not redo delivered work. |
| [fk189](https://app.faktorial.ai/projects/alvalinus/tasks/fk189), accent palette tokenization | Closed/done 2026-11-11T16:46Z; PR #132, head `7d21a757` → merge `3440d65` (directly on fk185's `5465b66`); native run-quality pass at head `7d21a757` (run `3d615243-ae57-4f41-a194-903ea77a62a5-build-dmsj3iyzdvz4-quality`, re-read November 12). Verified in source at this baseline: the quote/inquiry accent roles declare `hsl(var(--primary))`/`hsl(var(--primary-hover))` ([QuotePage.css](../src/pages/QuotePage.css):21/:28/:29/:35-36, [InquiryPage.css](../src/pages/InquiryPage.css):23), `--primary-hover: 18 84% 33%` joined `:root` ([styles.css](../src/styles.css)), [styles.page-accent-contrast.test.ts](../src/styles.page-accent-contrast.test.ts) pins the `.quote-send` white-on-background pairing at ≥4.5:1, and the F6-US5/F5-US2 story records and identity manifest name the test. | Delivered. fk187's linked Next 2, created 16:20:36Z November 11 and delivered within about half an hour of its link. The fk183-documented F6-US5 exclusion is resolved; the focus/selection hex residue fk189 scoped out was delivered by fk208 (receipt below). |
| [fk187](https://app.faktorial.ai/projects/alvalinus/tasks/fk187), previous roadmap | Closed/done 2026-11-11T16:47Z; PR #131, head `1ec5bac` → merge `7eb567e` (on fk189's `3440d65`); native run-quality pass at head `1ec5bac` (run `179d297e-c222-45f7-8ab5-2f620d1b5770-build-dmsj2litfsvo-quality`, re-read November 12). Document read in full during the fk197 refresh. | Superseded assessment; its two linked next steps shipped around its own merge — fk189 at 16:46Z and fk188 at 16:53Z on November 11 (receipts above and below) — and its works-less-well rows were re-baselined by fk197, fk207, fk219, fk231, fk241, fk251 and again by this refresh onto the `99a6a23` tip. |
| [fk188](https://app.faktorial.ai/projects/alvalinus/tasks/fk188), per-route social-card imagery | Closed/done 2026-11-11T16:53Z; PR #133, head `71f21f79` → merge `36d7cba` (on fk187's `7eb567e`); native run-quality pass at head `71f21f79` (run `511c7c94-5af9-405a-8acf-1c5635c85136-build-dmsj80kgw840-quality`, re-read November 12). Verified in source at this baseline: the emitter substitutes `og:image`/`og:image:alt`/`twitter:image` from each route's registry-declared `heroPhotoAssetPath` with registry-declared Swedish alt text, the three SVG-hero routes carry the shared raster home hero, the root and 404 documents keep their home-branded sets, and the static gate existence-checks every emitted image path (fk164's pattern extended). | Delivered. fk187's linked Next 1, created 16:20:23Z November 11 and closed delivered about half an hour later. The former "home-branded social cards on every subpage" gap is retired for imagery as fk88 retired it for text. |
| [fk193](https://app.faktorial.ai/projects/alvalinus/tasks/fk193), feature-catalog reconciliation | Closed/done 2026-11-12T09:26Z; PR #134, head `802f378b` → merge `c131651` (on fk188's `36d7cba`); native run-quality pass at head `802f378b` (run `64920971-6743-41d2-a965-6d8fabe9d755-build-dmt4btwcgr4g-quality`, re-read November 12); its required `feature-manifest-integrity` proof passed at acceptance. Verified in source at this baseline: navigation-and-recovery.md describes the drainage-hero variant family with the stale no-variant sentence gone, quote-calculators.md names both quote routes' declared srcsets and fk189's accent-test mapping, features.json carries 2026-11-12 stamps on F4/F6 only, and the README review history records the fk185/fk188/fk189 deltas. | Delivered. The November 12 feature-refinement child. F5 keeps its 2026-11-11 stamp because no reviewed task touched its surfaces beyond fk189's own story-record mapping. |
| [fk195](https://app.faktorial.ai/projects/alvalinus/tasks/fk195), 16px contact-form floor | Closed/done 2026-11-12T15:25Z; PR #135, head `636126c` → merge `9e7dd70` (fk197's baseline, on fk193's `c131651`); native run-quality pass at head `636126c` (run `89ffb78b-1e2d-4f93-859d-b85b1511a4ad-build-dmtc0elqw268-quality`, re-read November 12, re-verified 2026-11-16). Verified in source at this baseline: `CONTACT_FIELD_BASE_CLASS` no longer carries the `sm:text-sm` downgrade, and the focused test pins `text-base` with no responsive text-size override on both the home and `/kontakt/` renderings. | Delivered. The November 12 frontend-optimization child; its delivery summary's real-device verification prompt stays on fk195's record (jsdom cannot reproduce iOS focus zoom; the intervening frontend-optimization children delivered other scopes, so it remains queued). The same defect class on the quote pages was delivered by fk199 (receipt below). |
| [fk199](https://app.faktorial.ai/projects/alvalinus/tasks/fk199), quote-page 16px focus-zoom floor | Closed/done 2026-11-12T17:19Z; PR #136, head `b1a3c989` → merge `aa4fdb6` (on fk195's `9e7dd70`, fk197's baseline); native run-quality pass at head `b1a3c989` (run `54a24b2f-f8ad-4fee-9c9a-c39b8b2e178f-build-dmteg2wb9kd4-quality`, re-read November 13). Verified in source at this baseline: the `.quote-field select,.quote-field textarea` rule declares `font-size:16px` ([QuotePage.css](../src/pages/QuotePage.css):18) so neither control inherits the 14px container size, the fk171-asserted border declaration survived the edit, and the new [styles.quote-focus-zoom.test.ts](../src/styles.quote-focus-zoom.test.ts) pins the floor on the shared stylesheet both quote pages render through. | Delivered. fk197's linked Next 2, created 17:03:23Z November 12 and closed sixteen minutes later — the fastest link-to-close in the chain at that point (fk232's sixteen-minute close ties it). The quote-page half of fk195's defect class is closed; both quote routes now hold the 16px floor. |
| [fk198](https://app.faktorial.ai/projects/alvalinus/tasks/fk198), read-more hover on the AA-enforced token | Closed/done 2026-11-12T17:27Z; PR #137, head `35eccacb` → merge `9631338` (on fk199's `aa4fdb6`); native run-quality pass at head `35eccacb` (run `200ceed5-c0b4-4c57-8765-c1fd24fb8f14-build-dmtejrx8n70k-quality`, re-read November 13). Verified in source at this baseline: the anchor carries `text-primary hover:text-primary-hover` ([SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):850), [tailwind.config.ts](../tailwind.config.ts) maps `primary.hover` to `hsl(var(--primary-hover))` (7.10:1 on the white card), [tailwind.primary-hover-utility.test.ts](../src/tailwind.primary-hover-utility.test.ts) proves the utility compiles from the token, SiteHomePage.test.tsx:495 pins the classes, and no `text-primary/<alpha>` hover remains anywhere in src/. | Delivered. fk197's linked Next 1, created 17:03:11Z November 12 and closed twenty-four minutes later. fk151's recorded hover ceiling is closed and — via fk205's pairing test below — enforced against alpha-composited regressions. |
| [fk197](https://app.faktorial.ai/projects/alvalinus/tasks/fk197), previous roadmap | Closed/done 2026-11-12T17:35Z; PR #138, head `55e5d0ff` → merge `6242e9e` (on fk198's `9631338`); native run-quality pass at head `55e5d0ff` (run `6fd58277-32e6-42a5-bb52-ba2299cbd340-build-dmtervedrwyo-quality`, re-read November 13). Document read in full during the fk207 refresh. | Superseded assessment. Its own PR merged after the merges of both tasks it had linked (fk199 and fk198 landed beneath it, as fk187's had), and its works-less-well rows were re-baselined by later refreshes onto this tip: its two links delivered, its recorded hex residue delivered by fk208, and its byte-weight observation delivered by fk209. |
| [fk203](https://app.faktorial.ai/projects/alvalinus/tasks/fk203), feature-catalog reconciliation | Closed/done 2026-11-13T09:56Z; PR #139, head `0e8012cf` → merge `2e3245f` (on fk197's `6242e9e`); native run-quality pass at head `0e8012cf` (run `aa362c0c-b5d2-49a8-8da6-dee27de073d9-build-dmtzn7r88ot0-quality`, re-read November 13); its required `validate-features` proof returned valid/pass/complete with zero findings on its edited candidate, and its delivery records the verifier rerunning the proof independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F3-US1 maps fk195's contact-form 16px declaration, F6-US2 maps fk199's quote ≥16px floor, F1-US1 gains four fk198 hover-token declarations plus the two Tailwind utility-generation checks, the README names both new test files, and F1/F3/F6 plus the README carry 2026-11-13 stamps with F2/F4/F5 deliberately untouched. | Delivered. The November 13 feature-refinement child — its own investigation caught that its branch carried the two newer source commits and extended the reconciliation beyond its original F3-only scope, exactly as its stop-if required. fk183's queued F3 re-stamp was consumed by this delivery; the F2 remainder stays queued on fk183's record. |
| [fk205](https://app.faktorial.ai/projects/alvalinus/tasks/fk205), read-more hover pairing hardening | Closed/done 2026-11-13T15:56Z; PR #140, head `de546201` → merge `eb2711d` (fk207's baseline, on fk203's `2e3245f`); native run-quality pass at head `de546201` (run `82a0525c-2faf-413f-b0ec-51ab51364d35-build-dmu7a1wtz7qs-quality`, re-read November 13) after one strict-typecheck repair commit (`split()` destructuring violates `noUncheckedIndexedAccess`; replaced with `indexOf`/`slice`, no behavior change). Verified in source at this baseline: [styles.read-more-hover-contrast.test.ts](../src/styles.read-more-hover-contrast.test.ts) (187 lines) finds the anchor structurally via its Swedish aria-label marker, resolves its hover utility through a flattened tailwind config map (rejecting any hardcoded color), alpha-composites `/NN` modifiers over the card surface, asserts ≥4.5:1 and that hover stays strictly darker than rest — restoring the retired `hover:text-primary/80` computes 3.96:1 and fails by design. fk198's fix itself was already in its base, so its merge delta is the test alone. | Delivered. The November 13 frontend-optimization child — it targeted the same surface fk198 had just fixed, recognized the fix in its base, and delivered the one missing acceptance piece (the pairing test) instead of redoing delivered work. The "Läs mer" hover contract is now enforced twice over, at two independent boundaries. Its two test declarations were mapped into F1-US1 by fk213's November 14 child (receipt below). |
| [fk207](https://app.faktorial.ai/projects/alvalinus/tasks/fk207), previous roadmap | Closed/done 2026-11-13T18:07Z; PR #141, head `8129295` → merge `c1051ec` (on fk205's `eb2711d`); native run-quality pass at head `8129295` (run `c9a6e41e-a9bd-4cdc-95d3-88bbfa3e0a09-build-dmua328m3qn8-quality`, re-read November 14). Document read in full during the fk219 refresh. | Superseded assessment. Its two linked tasks (fk208, fk209) both shipped the same evening beneath fk214's/fk213's/fk215's November 14 merges, and its works-less-well rows are re-baselined onto this tip: its accent-residue link and tradgard link are delivered below, its dependency-cadence question is answered by fk214, and its catalog-staleness note is resolved by fk213. |
| [fk208](https://app.faktorial.ai/projects/alvalinus/tasks/fk208), focus-visible and selection accent tokenization | Closed/done 2026-11-13T18:08Z; PR #142, head `76432fc7` → merge `2dddae4` (on fk207's `c1051ec`); native run-quality pass at head `76432fc7` (run `dd973e8f-0589-44dd-afe6-a0b77347ec5d-build-dmua4osxkj20-quality`, re-read November 14). Verified in source at this baseline: the three `:focus-visible` outline rules draw `hsl(var(--primary-hover))` with 3px geometry and offset intact ([QuotePage.css](../src/pages/QuotePage.css):20, [InquiryPage.css](../src/pages/InquiryPage.css):22/:27), the quote `::selection` draws the declared `--selection-background`/`--selection-foreground` pair ([styles.css](../src/styles.css):16–17, QuotePage.css:22), a literal search finds no `#bc4a12` or `#f7c5aa` under src/, and the extended page-accent test rejects any hardcoded accent hex. | Delivered. fk207's linked Next 1, created 17:51:33Z November 13 and closed seventeen minutes later. The accent family fk189 started and fk189's scoped-out residue carried now has no undeclared member; fk213's November 14 child mapped the new declarations into F5-US2/F6-US5 (receipt below). |
| [fk209](https://app.faktorial.ai/projects/alvalinus/tasks/fk209), tradgard hero recompression | Closed/done 2026-11-13T18:29Z; PR #143, head `cc6268d` → merge `33e665d` (on fk208's `2dddae4`); native run-quality pass at head `cc6268d` (run `e6cabaf6-fafb-47c5-b028-328d53eb69bc-build-dmuak72fn72o-quality`, re-read November 14). Verified in source at this baseline: `tradgard-generated.webp` measures 342,786 B at the same path (down from 501,858 B, −31.7%, above its ≥30% target), the `-960` (220,062 B) and `-640` (101,718 B) variants are untouched, and the registry declarations stayed byte-identical. | Delivered. fk207's linked Next 2, created 17:51:54Z November 13 and closed thirty-eight minutes later. Its delivery summary's scope note — the sibling full-size heroes stay untouched unless a follow-up run takes them — was consumed by fk219's fk220 link; fk220's delivery closed without merging on 2026-11-17, and the redo now sits on fk252's linked scope (receipt below), recorded once so the pool is not left unowned. |
| [fk214](https://app.faktorial.ai/projects/alvalinus/tasks/fk214), dependency-management lockfile refresh | Closed/done 2026-11-14T16:54Z; PR #144, head `5a8a4a8` → merge `fe88422` (on fk209's `33e665d`); native run-quality pass 267/267 at head `5a8a4a8` (run `db3f4d7b-09a6-4916-be91-2e34abe9f00e-build-dmv2qbbex9gc-quality`, re-read November 14, re-verified 2026-11-16). Verified in source at this baseline: `package.json` is byte-identical to its base and the lockfile pins vite 8.3.8, @vitejs/plugin-react 6.3.0 and postcss 8.5.33 (its diff bounded to the Vite toolchain's own transitives); its Build Update cites the `npm outdated` signal and carries one-line deferral reasons for all eight majors, including the exactly-pinned 4.1.9 vitest/coverage-v8 pair. | Delivered. The dependency-management automation's November 14 child — landing exactly on the cadence fk207 documented as pending. Its coordinated vitest-5 follow-up prompt stays on its own record for the recurring automation (fk241 re-verified it 2026-11-16; no dependency child has run since). |
| [fk213](https://app.faktorial.ai/projects/alvalinus/tasks/fk213), feature-catalog reconciliation | Closed/done 2026-11-14T16:57Z; PR #146, head `536eed7` → merge `c911d1b` (on fk214's `fe88422`); native run-quality pass 267/267 at head `536eed7` (run `a337223a-eb3d-4514-83f8-eed1f7e5b157-build-dmv37cw5ilyw-quality`, re-read November 14); its required `feature-manifest-integrity` proof passed on its candidate and its delivery records the verifier rerunning it independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F1-US1 carries the two fk205 read-more-hover declarations, F5-US2 and F6-US5 carry fk208's focus-visible and quote-selection declarations with matching story-document bullets, F1/F5/F6 carry 2026-11-14 stamps, and F2/F4 records keep their honest older stamps with IDs, routes and the intentionally empty backend mapping unchanged. | Delivered. The feature-refinement automation's November 14 child — a docs-and-manifest reconciliation only, exactly as its own record scopes it. The catalog's evidence map now names the real owning tests through the fk208/fk205 deltas. |
| [fk215](https://app.faktorial.ai/projects/alvalinus/tasks/fk215), quote-view heading focus | Closed/done 2026-11-14T16:58Z; PR #145, head `60bba11` → merge `c3f9ede` (fk219's baseline, on fk213's `c911d1b`); native run-quality pass 268/268 at head `60bba11` (run `3ce18fe1-8605-4609-a514-b27ff5529f7d-build-dmv2s85fckig-quality`, re-read November 14). Verified in source at this baseline: the choice and work headings carry `quote-choice-heading`/`quote-work-heading` ids and `tabIndex={-1}` ([QuotePage.tsx](../src/pages/QuotePage.tsx):60/:69), the kind-transition effect focuses the revealed view's heading via `document.getElementById(...)?.focus()` (QuotePage.tsx:40), a `previousKind` ref skips first renders so initial load and `#uppfart` deep links never steal focus, and the in-memory focus-flow test pins both switch directions plus the untouched initial render. | Delivered. The frontend-optimization automation's November 14 child — the same focus-anchoring pattern fk195's InquiryPage established, applied to the quote calculator's hash-driven view switch. fk233's share links preserve its initial-render contract (receipt below), fk247's feedback extends the same aside, and fk227 mapped the focus test into F6-US1. |
| [fk219](https://app.faktorial.ai/projects/alvalinus/tasks/fk219), previous roadmap | Closed/done 2026-11-14T18:38Z; PR #147, head `a689906` → merge `778998e` (on fk215's `c3f9ede`); native run-quality pass at head `a689906`. Document read in full during the fk231 refresh. | Superseded assessment. Its two linked tasks shipped beneath fk227's/fk228's November 15 merges or stayed blocked: fk221 delivered in seventeen minutes (receipt below), and fk220 — the blocked exception in every assessment from fk219 through fk241 — closed approved without merging on 2026-11-17, its redo re-owned by fk252 (receipt below). |
| [fk221](https://app.faktorial.ai/projects/alvalinus/tasks/fk221), empty-services contact action | Closed/done 2026-11-14T18:40Z; PR #148, head `68d055f` → merge `7dca1af` (on fk219's `778998e`); native run-quality pass at head `68d055f`. Verified in source at this baseline: StaticState extends an optional action affordance rendering a registry-declared Swedish label and destination (no renderer-side copy), the empty-services call site passes the action only from the fallback branch, and the extended SiteHomePage tests pin the accessible name and declared destination. | Delivered. fk219's linked Next 2, created 18:24:10Z November 14 and closed delivered seventeen minutes later — the fastest link-to-close recorded in the chain so far. The F4 catalog friction ("no inline retry or contact body") is retired in behavior; the stale friction sentence that stood in navigation-and-recovery.md was reconciled by fk242's delivered docs-and-manifest pass (receipt below). |
| [fk227](https://app.faktorial.ai/projects/alvalinus/tasks/fk227), feature-catalog reconciliation | Closed/done 2026-11-15T17:17Z; PR #150, head `aa0afe9` → merge `4822524` (on fk221's `7dca1af`); native run-quality pass 268/268 at head `aa0afe9`; its required `validate-features` proof passed on its candidate (valid, complete, no findings) and its delivery records the verifier rerunning it independently on the merged candidate while the closed record's issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: F6-US1 carries the fk215 hash-switch focus declaration with a direct vitest reference to the QuotePage test, F6 and quote-calculators.md carry 2026-11-15 stamps, the README records the reconciliation, and no other feature or story record changed (fk219 roadmap-only and fk221 F4-source touched no docs/features files). | Delivered. The feature-refinement automation's November 15 child — a docs-and-manifest reconciliation only, exactly as its own record scopes it. The catalog's F6 story now names the real owning focus test. |
| [fk228](https://app.faktorial.ai/projects/alvalinus/tasks/fk228), woff2 font preloads in every emitted head | Closed/done 2026-11-15T17:34Z; PR #151, head `283f8f5` → merge `80eb6bd` (fk231's baseline, on fk227's `4822524`); native run-quality pass 285/285 at head `283f8f5`. Verified in source at this baseline: the four pure font-preload helpers exist in [route-artifacts.mjs](../scripts/route-artifacts.mjs), the `transformIndexHtml` handler injects from `ctx.bundle` ([vite.config.ts](../vite.config.ts)), [assert-static-routes.mjs](../scripts/assert-static-routes.mjs) derives the emitted hrefs and requires exactly those tags on every document including `dist/404.html`, and the hero `as="image"` gates are untouched. | Delivered. The frontend-optimization automation's November 15 child; the parse-time font head start and its byte-for-byte gate are recorded in the works-well list, and fk237's delivery below documented the emission in the catalog. Its delivery summary's browser-measurement prompt stays queued on its own record (fk241 re-verified it 2026-11-16; the intervening children delivered other scopes; see What works less well). |
| [fk232](https://app.faktorial.ai/projects/alvalinus/tasks/fk232), calculator prices into the typed registry | Closed/done 2026-11-15T19:10Z; PR #153, head `f593e7ff` → merge `326125a` (on fk231's `5e90bfe`); native run-quality pass at head `f593e7ff` (run `debf5b7b-f51f-4d41-92b9-6ae8c905372b-build-dmw0oybfal7g-quality`, re-read November 16). Verified in source at this baseline: the pricing blocks are declared under `content.quote` with required typed fields ([siteContent.ts](../src/data/siteContent.ts):450/:479, [types/site.ts](../src/types/site.ts)), [quote.ts](../src/lib/quote.ts):24-31 computes both totals from the typed pricing with no numeric price or tier-boundary literal left in the lib, both pages pass the declarations from their content prop, and quote.test.ts derives every expected total from the declarations (fk140's registry-derived-pin pattern). | Delivered. fk231's linked Next 1, created 18:54:22Z November 15 and closed delivered sixteen minutes later. The price-constants claims it retires stood in quote-calculators.md until fk242's delivered reconciliation removed them (receipt below). |
| [fk233](https://app.faktorial.ai/projects/alvalinus/tasks/fk233), measurements-bearing share links | Closed/done 2026-11-15T19:19Z; PR #154, head `5513cec8` → merge `6fd8aa7` (on fk232's `326125a`); native run-quality pass at head `5513cec8` (run `865c22db-d32c-4483-8b39-56db14ff79b5-build-dmw0vgrdmz6s-quality`, re-read November 16). Verified in source at this baseline: [quote-share.ts](../src/lib/quote-share.ts) owns the fixed URL parameter names (`yta`, `lass`, `asfalt`, `langd`), search encoding, tolerant decoding and absolute href building; both quote pages read the encoded inputs once on mount with defaults restored when parameters are absent; driveway share links keep the `#uppfart` hash so the recipient lands on the driveway view; invalid encoded values degrade through the existing invalid-input alert and disabled controls; the share copy is registry-declared in `quote.shared`; and the encode/restore directions are pinned by quote-share.test.ts plus the extended page tests. fk215's hash-driven focus contract is untouched, and the free-text note is deliberately not carried in the link (its mail draft still carries it; fk233's own scope excluded it — the carry is now fk253's linked scope, receipt below). | Delivered. fk231's linked Next 2, created 18:54:39Z November 15 and closed delivered twenty-five minutes later. Its docs edit updated the share behavior prose in quote-calculators.md; the price-constants claims it left stale were reconciled by fk242 (receipt below). |
| [fk238](https://app.faktorial.ai/projects/alvalinus/tasks/fk238), 36px desktop header tap targets | Closed/done 2026-11-16T18:02Z; PR #155, head `f728bae` → merge `eb4dd27` (on fk233's `6fd8aa7`); native run-quality pass at head `f728bae` (run `cb24ae7c-aee1-44cb-be7c-fec2cab32f54-build-dmwttrfb1vk0-quality`, re-read November 16). Verified in source at this baseline: `py-2` vertical padding on the desktop nav link classNames (active and inactive variants), the Tjänster dropdown trigger and the desktop Kalkyler summary in [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx) (targets ≈36px inside the unchanged 64px sticky header; mobile menu ≥44px targets untouched), pinned by [styles.header-nav-tap-targets.test.ts](../src/styles.header-nav-tap-targets.test.ts) in the repo's source-inspection test style. | Delivered. The frontend-optimization automation's November 16 child. Its delivery summary's follow-up prompt — footer navigation links, Inventory route chips and NotFound shortcut pills below 32px — stays queued on its own record (re-read on fk238's own record 2026-11-17; the intervening frontend-optimization child fk247 delivered the share-button feedback instead). No docs/features record covered this delivery until fk242's reconciliation mapped it into F4 (receipt below). |
| [fk237](https://app.faktorial.ai/projects/alvalinus/tasks/fk237), font-preload emission documented under F4 | Closed/done 2026-11-16T18:11Z; PR #156, head `fb74727` → merge `c0e17d2` (fk241's baseline, on fk238's `eb4dd27`); native run-quality pass at head `fb74727` (run `651c53aa-63c8-48f5-933d-7efa3dca111f-build-dmwtygo2yjuk-quality`, re-read November 16); its required `feature-manifest-integrity` proof returned valid/complete with no findings on its candidate and its delivery records the verifier rerunning it independently on the merged candidate while the issue-level proof projection still reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. Verified in source at this baseline: [navigation-and-recovery.md](features/navigation-and-recovery.md) carries a dedicated font-preload passage kept distinct from the hero-preload prose, [features.json](features/features.json) F4 lists the [route-artifacts.mjs](../scripts/route-artifacts.mjs) code path with an updated vite.config.ts description, F4-US1 is extended without new IDs (three source anchors, six reviewed technical vitest references), and the touched records carry 2026-11-16 stamps. | Delivered. The feature-refinement automation's November 16 child — docs-and-manifest reconciliation of fk228's emission, exactly as its record scoped it. The same edit left the document's stale empty-services friction line and the then-missing fk238 coverage in place; fk242's delivered reconciliation retired both (receipt below). |
| [fk220](https://app.faktorial.ai/projects/alvalinus/tasks/fk220), three-hero WebP recompression | Closed approved 2026-11-17T06:09Z **without a merge receipt**: PR #149 (head `140a735`) carried the complete recompression (stensattning-photo 385,866 → 262,640 B, quote-hero 362,898 → 253,714 B, services-hero 345,948 → 241,842 B, dimensions and declarations unchanged) and canonical quality passed 268/268 at that head, but the review stage's textual-line net-change gate returned "zero net changes" for the binaries-only diff and bounced the PR; fk220 then waited on its fk224 build-clarification until both records closed approved on 2026-11-17, with fk224's recorded resolution text not visible in the owning records (no answer timestamp, no comments). The heroes still measured 385,866 / 362,898 / 345,948 B at fk251's tip (re-measured 2026-11-17); fk252's delivered redo has since landed the recompression on main (receipt below). | Closed without delivery, resolved by its redo. fk220's own option-3 wording explicitly anticipated a future redo task, which the fk251 refresh created as fk252 (receipt below) — fk220 stays closed, and fk252 delivered the undelivered scope with fk220's measured numbers as reference targets and the prose-carry acceptance that prevented a second binaries-only PR. No reopen of fk220 and no duplicate record beyond fk252. |
| [fk241](https://app.faktorial.ai/projects/alvalinus/tasks/fk241), previous roadmap | Closed/done 2026-11-16T20:20Z; PR #157, head `0e46ad8` → merge `e3f084a` (on fk237's `c0e17d2`); native run-quality pass at head `0e46ad8` (run `b9c4e572-7b76-4c2d-ab99-8a517cf3532b-build-dmwwq23y21xk-quality`). Document read in full from this checkout's committed copy during this refresh. | Superseded assessment. Its two linked tasks both shipped beneath its own merge — fk243 at 20:31Z and fk242 at 21:00Z on November 16 (receipts below) — its blocked-work record (fk220 on the fk224 decision) closed on 2026-11-17 as recorded above and is resolved by fk252's delivery, and its works-less-well rows were re-baselined onto the `30f72ae` tip by fk251 and again onto this tip by this refresh. |
| [fk243](https://app.faktorial.ai/projects/alvalinus/tasks/fk243), inquiry rate VAT-basis capture | Closed/done 2026-11-16T20:31Z; PR #158, head `cc37e81` → merge `5abbdb1` (on fk241's `e3f084a`); native run-quality pass at head `cc37e81` (run `6e32e091-57e9-4904-96d7-5b610b4cc5de-build-dmwwzdpmook8-quality`). Verified in source at this baseline: the registry-declared optional `rateBasis` select ("Momsstatus för timpriset" with "Ej angivet" and inklusive/exklusive moms options) under `content.inquiry` ([siteContent.ts](../src/data/siteContent.ts)), the rate hint pointing to it, the stated basis composed into the mailto draft only when provided (omission draft unchanged), the select on its own 16px stylesheet rule ([InquiryPage.css](../src/pages/InquiryPage.css)), deterministic render/draft/omission pins in InquiryPage.test.tsx, and staffing-inquiry.md reconciled. | Delivered. fk241's linked Next 2, created 19:55:01Z November 16 and closed delivered thirty-six minutes later. No VAT status is assumed or confirmed anywhere; the quote calculators' standing label stays operator-owned (see What works less well). |
| [fk242](https://app.faktorial.ai/projects/alvalinus/tasks/fk242), feature-catalog reconciliation | Closed/done 2026-11-16T21:00Z; PR #159, head `3831435` → merge `27bf18e` (on fk243's `5abbdb1`); native run-quality pass at head `3831435` (run `f0ae2084-34b7-493b-b9b3-7ba3e9d9ff53-build-dmwwxz057sz8-quality`). Verified in source at this baseline: quote-calculators.md tells the delivered registry-pricing story (the three stale price-constants claims and the completed roadmap item removed, share prose intact), navigation-and-recovery.md retires the stale empty-services friction line and documents fk238's ~36px tap targets under F4 with `styles.header-nav-tap-targets.test.ts` mapped, the F6-US2 records carry the delivered post-fk232 declaration names and the F6 capability limitations no longer claim fixed constants or unshareable state, published IDs untouched, records re-stamped 2026-11-16. Its closed record's issue-level `feature-manifest-integrity` proof projection reports `missing_evidence` with no recorded proof pass on the record; the owning record is closed/done and the projection does not reopen it. | Delivered. fk241's linked Next 1, created 19:54:46Z November 16 and closed delivered sixty-six minutes later, rebased onto fk243's merge. fk248's November 17 pass verified this reconciliation against source and completed the catalog's remaining share/tap-target mappings (receipt below). |
| [fk247](https://app.faktorial.ai/projects/alvalinus/tasks/fk247), Swedish share-button clipboard feedback | Closed/done 2026-11-17T18:24Z; PR #160, head `b749249` → merge `701f0c5` (on fk242's `27bf18e`); native run-quality pass at head `b749249` (run `ad35e950-755a-45c9-9c32-d807a14443ac-build-dmxoym15i88c-quality`). Verified in source at this baseline: `QuoteResultAside.share()` handles the `navigator.clipboard.writeText` outcome — resolve announces the declared "Länken har kopierats till urklipp.", reject or absent clipboard announces the manual-copy fallback — through a persistent `role="status"` element in the shared result aside, both strings new typed readonly fields under `quote.shared`, with the URL replacement, visible link paragraph and invalid-input disabled state untouched, and QuoteResultAside.test.tsx mocking the clipboard for both paths (4 files, +68/−1). | Delivered. The frontend-optimization automation's November 17 child, delivered about nineteen minutes after creation — the fastest automation-child creation-to-close in the chain so far. fk238's footer-sweep prompt stays queued on its own record (this child delivered the share feedback instead). fk253's linked notes-carry extends the same share contract (receipt below). |
| [fk248](https://app.faktorial.ai/projects/alvalinus/tasks/fk248), feature-catalog reconciliation re-stamp | Closed/done 2026-11-17T18:49Z; PR #161, head `79ddaed` → merge `30f72ae` (this baseline, on fk247's `701f0c5`); native run-quality pass at head `79ddaed` (run `55ab20be-fb70-4c49-b297-b7138979329e-build-dmxpfzxo6xq0-quality`). Verified in source at this baseline: the catalog README's reconciliation paragraph names fk232/fk233/fk238/fk237 plus fk242's interim pass and re-stamps 2026-11-17, F6 describes the shareable measurement-bearing link and injected registry pricing, quote-share.ts joined F6's runtime owners, fk233's declarations are mapped into F6-US2/US3/US4 with honest direct/technical evidence types, F4-US1's tap-target mappings were re-verified, all 124 manifest test references resolve in source, and the F1–F6/20-story ID inventory is unchanged (9 files, +162/−34). Its Build Update records an exploratory validate-features pass at `79ddaed` (valid, complete, no findings); its closed record's issue-level proof projection reports `missing_evidence` — the owning record is closed/done and the projection does not reopen it. | Delivered. The feature-refinement automation's November 17 child, delivered about thirty-five minutes after creation, verifying rather than redoing fk242's reconciliation. Its delivery summary queues the F6-US4 print-rendering mapping prompt on its own record (see What works less well). The catalog is now reconciled through this delivery; this roadmap references it instead of re-deriving catalog state. |
| [fk253](https://app.faktorial.ai/projects/alvalinus/tasks/fk253), quote notes through share links | Closed/done 2026-11-17T21:21Z; PR #162, head `54ead38b` → merge `de05fa5` (on fk248's `30f72ae`); native run-quality pass at head `54ead38b`. Verified in source at this baseline: `quoteShareParams` carries the fixed `notes: "anteckning"` parameter, both calculators encode it only when non-empty, the restore-once initial pass seeds the notes field from the decoded value with tolerant decoding, and the fk215 focus and fk247 clipboard contracts are untouched (7 files, +119/−22). | Delivered. fk251's linked Next 2, created 20:58:50Z November 17 and closed delivered about twenty-two minutes later. fk233's deliberately-excluded note carry is retired as a gap; fk259 mapped the eight new declarations into the F6 records (receipt below). |
| [fk251](https://app.faktorial.ai/projects/alvalinus/tasks/fk251), previous roadmap | Closed/done 2026-11-17T21:23Z; PR #163, head `2efd6a5` → merge `86fa8e5` (on fk253's `de05fa5`); native run-quality pass at head `2efd6a5`. Document read in full from this checkout's committed copy during this refresh. | Superseded assessment. Its two linked tasks both shipped beneath its own merge — fk253 at 21:21Z and fk252 at 21:25Z on November 17 (receipts above and below) — its fk220/fk224 blocked-work record is resolved by fk252's delivery, and its works-less-well rows are re-baselined here onto the `99a6a23` tip. |
| [fk252](https://app.faktorial.ai/projects/alvalinus/tasks/fk252), three-hero recompression redo with the gate-prose fix | Closed/done 2026-11-17T21:25Z; PR #164, head `381df35` → merge `6ba9e1c` (on fk251's `86fa8e5`); native run-quality pass at head `381df35`. Verified in source at this baseline: stensattning-photo 252,246 B, quote-hero 247,578 B and services-hero 230,484 B at unchanged dimensions and byte-identical declarations, and the `heroAssetByteBudget` JSDoc example in [route-artifacts.mjs](../scripts/route-artifacts.mjs) now cites tradgard-generated.webp at 342,786 B (4 files, +4/−4). | Delivered. fk251's linked Next 1, created 20:58:37Z November 17 and closed delivered twenty-seven minutes later — resolving fk220's closed-without-merging delivery with exactly the acceptance its record was written for (the prose fix made the PR reviewable; the review net-change gate passed it). fk220 stays closed; no reopen and no duplicate record. |
| [fk257](https://app.faktorial.ai/projects/alvalinus/tasks/fk257), footer nav and email tap targets | Closed/done 2026-11-18T18:41Z; PR #165, head `5b2607c` → merge `0a5964d` (on fk252's `6ba9e1c`); native run-quality pass 317/317 at head `5b2607c`. Verified in source at this baseline: the footer PAGE_NAV/SERVICE_NAV anchors and mailto link carry `inline-flex items-center py-2` (≥36px computed targets), [styles.footer-tap-targets.test.ts](../src/styles.footer-tap-targets.test.ts) pins the classNames and compiled height, and the NotFound pills were verified already compliant at `px-4 py-2` (2 files, +93/−3). | Delivered. The frontend-optimization automation's November 18 child, delivered about seventeen minutes after creation — consuming the footer half of fk238's queued sweep. Its delivery summary queued the one remaining tap-target class, the Inventory route chips, which this refresh linked as fk267 (see Short-term priorities). |
| [fk259](https://app.faktorial.ai/projects/alvalinus/tasks/fk259), feature-catalog reconciliation with fk253/fk257 | Closed/done 2026-11-18T19:34Z; PR #166, head `1c8dcdc` → merge `99a6a23` (this baseline, on fk257's `0a5964d`); native run-quality pass 317/317 at head `1c8dcdc`; its required `feature-manifest-integrity` proof passed valid/complete/zero findings on its committed candidate. Verified in source at this baseline: F4/F6 and the README re-stamped 2026-11-18, fk253's `anteckning` note carry mapped into F6-US4/F6-US2 with eight honest evidence declarations, fk257's three footer tap-target declarations mapped into F4-US1, and the F1–F6/20-story ID inventory unchanged (8 files, +145/−32). | Delivered. The feature-refinement automation's November 18 child, delivered about forty-five minutes after creation, reconciling the catalog with the two product-facing commits that landed after its investigate baseline. Its own Build Update records that fk248's queued F6-US4 print-rendering mapping remained unconsumed — this refresh linked it as fk268 (see Short-term priorities). The catalog is now reconciled through this delivery; this roadmap references it rather than re-deriving catalog state. |

The prior roadmap's older Done references were checked against current owning
membership on October 29 and again during each later refresh through this
November 18 one, and no row above was reopened or recreated by this refresh:
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
fk161/fk162/fk163/fk164/fk165/fk172/fk171/fk176 heads, the passed runs at the
fk177/fk173/fk183/fk185 heads, the passed runs at the
fk189/fk187/fk188/fk193/fk195 heads, the passed runs at the
fk199/fk198/fk197/fk203/fk205/fk207 heads, the passed runs at the
fk208/fk209/fk214/fk213/fk215 heads, the passed runs at the
fk219/fk221/fk227/fk228 heads, the passed runs at the
fk232/fk233/fk238/fk237 heads, the passed runs at the
fk241/fk243/fk242/fk247/fk248 heads, and the passed runs at the
fk253/fk251/fk252/fk257/fk259 heads above) are historical, not
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
frontend-optimization occurrence through fk257/fk259 on November 18 ran
with fresh parent keys and closed delivered (receipts above). The
worker-host maintenance pair from the November 10 monitor incident (fk181
with fk182 as its question notice) read closed on November 13 at
2026-11-12T22:19Z, with fk181's question form showing no recorded answer
— resolved as closed platform records, not site work. The chain's longest
human gate, fk220's binaries-only review bounce, is closed end to end as
of 2026-11-17/18: fk220 and its fk224 clarification closed approved
without a merge receipt (fk224's recorded resolution text still not
visible in the owning records, re-read 2026-11-18), fk251's refresh
re-owned the scope as fk252 under fk220's own option-3 wording, and
fk252's prose-carrying redo passed review and merged — the work landed,
the closure needed no reopen, and the lesson is banked: a delivery whose
diff the gate cannot see needs its acceptance shaped for the gate from
the start. November 18's platform events likewise self-healed without
losing work: fk259's investigate stage absorbed four
`submit_stage_result` rejections (the template's missing no-change
completion clause) before concluding, and
[fk260](https://app.faktorial.ai/projects/alvalinus/tasks/fk260) delivered
the one-clause repair on fk6's own record — a task-record-only change
with no repository diff — while two fk260 learn runs exited unconfirmed
and self-healed through scheduled retries
([fk263](https://app.faktorial.ai/projects/alvalinus/tasks/fk263), closed
`already_satisfied` with delivery notice fk264); the worker's summarize
capability returns a typed configuration error on this worker, parked as
[fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) on an
operator-side configuration wait (its occurrence facts rest on the
monitor snapshot; retained OTel rows had expired). The steering loop
remains the fastest path in the chain: fk221, linked 18:24:10Z on
November 14, closed delivered seventeen minutes later; fk232 and fk233,
linked by fk231 the evening of November 15, closed in sixteen and
twenty-five minutes; fk243 and fk242, linked by fk241 on November 16,
closed in thirty-six and sixty-six minutes; fk252 and fk253, linked by
fk251 on November 17, closed in twenty-seven and twenty-two minutes; and
the November 18 automation children fk257 and fk259 delivered within
about seventeen and forty-five minutes of creation. This refresh's own
two links — fk267 created 21:40:30Z and fk268 21:40:53Z on November 18 —
read back open with exact labels, their owning records carrying the work
forward. The incident receipts come from fk153's November 7 owning reads
and fk260/fk263/fk266's own records, retained for provenance; no
duplicate record is created for any of them.

## Short-term priorities and issue ownership

fk251's two short-term priorities are resolved on this tip's own records:
the three-hero recompression redo landed through fk252 (PR #164, merge
`6ba9e1c`, closed 21:25Z November 17 — twenty-seven minutes after its
creation) and the share-links' notes carry through fk253 (PR #162, merge
`de05fa5`, closed 21:21Z November 17 — twenty-two minutes after its
creation). The one blocked item fk251 inherited — fk220's
complete-but-unmerged recompression with the invisible fk224 answer — is
resolved end to end: fk220 and fk224 stay closed, fk224's recorded
answer remains not visible in the owning records (re-read 2026-11-18),
and the scope landed through fk252's re-owned redo rather than a reopen,
with the gate-shaped acceptance proving out: the prose fix made the PR
reviewable, the review net-change gate passed it, and the heroes now
measure 252,246 / 247,578 / 230,484 B on main.

The two follow-up issues created during this refresh cycle (this roadmap
task's own writes on November 18, read back open before linking) target
the last small shared-chrome tap targets and the catalog's recorded
print-mapping gap, and the just-before-creation inventory read held no
other feature work:

1. [fk267](https://app.faktorial.ai/projects/alvalinus/tasks/fk267) —
   enlarge the home page's Inventory route chips to ≥36px tap targets:
   the chips under the service sections (SiteHomePage.tsx:525) still
   carry `px-3 py-1` on non-blockified `text-sm` anchors (~28px
   computed targets, verified at this tip), while the desktop header
   (fk238), footer nav/email (fk257) and NotFound pills (already
   compliant, verified by fk257) meet the bar. The task blockifies the
   chips to `inline-flex items-center py-2` following fk257's footer
   pattern and pins the compiled height with a focused source-inspection
   test in the `styles.footer-tap-targets.test.ts` style, the same
   guard pattern fk238's header test established. Created and read back
   open at 21:40:30Z with labels `priority: medium` and `size:medium`.
   Owned by fk267's record; recorded once here, not awaited or
   duplicated.
2. [fk268](https://app.faktorial.ai/projects/alvalinus/tasks/fk268) —
   map the F6-US4 print hand-off's source and evidence into the feature
   catalog: the delivered "Skriv ut" path (`window.print()` in
   QuotePageShared.tsx:74 plus the `@media print` blocks at
   QuotePage.css:5/:41) has no mapped source anchor or test evidence in
   the F6 records — the gap fk248 recorded honestly and queued on its
   own record on 2026-11-17, which fk259's November 18 pass again left
   unmapped. The task maps the source anchors, adds the smallest
   deterministic print-stylesheet pin in the established `?raw` test
   pattern where no test exists, keeps backend-entry-points.json
   honestly empty (a visitor-invoked browser call is not an incoming
   port), and preserves every published ID under a zero-findings
   validate-features pass. Created and read back open at 21:40:53Z with
   the same labels. Owned by fk268's record; recorded once here, not
   awaited or duplicated.

Remaining candidates were judged and dispositioned above and below: the
missing photographs stay editorial ([docs/image-requests.md](image-requests.md): a
real Trädgårdsplanering photo, About and Contact photographs, an optional
Inhyrning upgrade); the quote calculators' VAT confirmation, hosting,
telemetry and submission-service work still await explicit operator
decisions (ADR 0006), and the production-host unknown-path behavior stays
an operator/host fact; the drainage calculator's depth/soil/access pricing
and service-selection's prerequisites guidance need owner-defined pricing
rules and owner-reviewed Swedish claims before code can carry them, so
they stay catalog-recorded editorial work rather than linked issues; the
deferred major-version jumps, their assessment prompts and the 3 moderate
audit findings carry their own recorded follow-ups on the
dependency-management automation's records — fk214's delivery being the
newest owner (no dependency child has run since), whose coordinated
vitest-5 prompt stays queued there (no duplicate issue
is created over a queue that demonstrably ran on cadence); fk171's
contrast-test hardening prompt stays on its own record for the recurring
frontend-optimization automation, whose November 14–18 runs (fk215,
fk228, fk238, fk247, fk257) delivered other improvements instead —
re-read on fk171's own record 2026-11-18; fk183's F2 re-stamp prompt
stays queued on its record after fk203 consumed the F3 half and
fk213's/fk227's/fk242's/fk248's/fk259's later children again left F2
untouched — re-read on its own record 2026-11-18; fk195's
real-device verification prompt stays on its own record (jsdom cannot
reproduce iOS focus zoom); fk228's browser-measurement prompt stays
queued on its record because this environment has no browser automation
and rendered inspection is not a delivery prerequisite here; the fk238
sweep's footer half was consumed by fk257 and its chips remainder is now
fk267's owned issue rather than a bare queued prompt; fk248's F6-US4
print-rendering mapping prompt — re-read on its own record 2026-11-18,
unconsumed by fk259's intervening pass — is likewise now fk268's owned
issue; and the feature catalog's earlier drift
was already reconciled by the delivered fk242/fk248/fk259 passes, so no catalog
issue is created. No further issue is created in this
refresh: every remaining candidate is either operator/editorial work,
carries its own recorded owner, or is already delivered — a synthetic
third task would duplicate one of those queues rather than steer new
work.

## Long-term goals

1. **Trustworthy autonomous development.** Ground proposals in current source
   and task ownership, prove behavior at deterministic owner boundaries, and
   let native quality accept each candidate. The fk44 → fk54 → fk66 → fk72 →
   fk76 → fk87 → fk96 → fk105 → fk113 → fk123 → fk153 → fk163 → fk173 →
   fk187 → fk197 → fk207 → fk219 → fk231 → fk241 → fk251 → fk265 refresh chain shows the
   working loop: reconcile, ship, re-verify, retire. Separate source delivery,
   task closure and acceptance; missing evidence stays unknown. The loop also
   absorbs stalled deliveries without losing work (fk134's salvage into
   plan fk139), stale starting points without losing accuracy (fk187's,
   fk197's, fk219's, fk231's, fk241's, fk251's re-baselines and this refresh's
   arrived-at-the-tip preparation), interleaved merges without
   misattributing receipts, and closed-out deliveries without losing scope
   (fk220's unmerged recompression re-owned by fk252 under fk220's own
   option-3 wording — with fk252's delivery then landing the scope and
   proving the closure honest, even though fk224's chosen resolution text
   remains not visible in the owning records).
   Its steering latency keeps tightening — half an
   hour around fk188/fk189, sixteen and twenty-four minutes for
   fk199/fk198, seventeen and thirty-eight minutes for fk208/fk209,
   seventeen minutes link-to-close for fk221, sixteen and twenty-five
   minutes for fk232/fk233, thirty-six and sixty-six minutes for
   fk243/fk242, twenty-two and twenty-seven minutes for fk253/fk252, and
   fk257 delivered about seventeen minutes after creation on November 18 —
   with the owning records carrying the work
   forward. What the loop cannot do alone is equally visible, and its
   fk220 lesson is now banked as delivered proof: the finished-but-gate-
   blocked recompression needed an acceptance shaped for the gate from
   the start, and fk252's prose-carrying redo passed the same review
   net-change gate that bounced the binaries-only original — the gate
   mechanism still exists, but the loop now designs around it.
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
   stop iOS focus zoom, the fully declared accent family with the
   focus-visible and selection pairs tokenized (fk208), the lighter
   tradgard hero (fk209), keyboard-anchored calculator view switches
   (fk215), the registry-declared empty-services contact action so the
   availability fallback never dead-ends (fk221), parse-time woff2 font
   preloads in every emitted document with the byte-for-byte build gate
   (fk228, documented under F4 by fk237), registry-declared calculator
   pricing so a price update is a content edit (fk232), shareable
   measurements-bearing calculation links on both quote pages (fk233),
   ~36px desktop header tap targets at tablet widths (fk238), the
   staffing inquiry's optional declared rate-VAT-basis select carried into
   the mail draft (fk243), announced Swedish clipboard feedback on the
   share button (fk247), note-carrying share links so the recipient sees
   the sender's written context (fk253), ≥36px footer navigation and
   email tap targets on every page (fk257), the recompressed sibling
   heroes at 252,246 / 247,578 / 230,484 B (fk252), existing
   hero assets on every route with the gate keeping it that way, and the
   unit-tested money logic are delivered. The remaining visitor-visible
   work is the home page's ~28px Inventory route chips (owned by fk267)
   and approved missing
   imagery; the maintainer-facing catalog records are truthful and
   reconciled after fk176's, fk183's, fk193's, fk203's, fk213's, fk227's,
   fk237's, fk242's, fk248's and fk259's passes, with the F6-US4
   print-rendering mapping gap now owned by fk268. Define useful inquiry signals and
   privacy needs before promising delivery or telemetry.
4. **Evidence-led cross-product learning.** Compare booking and
   Asynkron.JsEngine when their repositories and operational evidence are
   available; both remain absent — re-verified on November 18: this
   checkout's parent holds exactly this generation's task worktrees
   (fk257/fk259/fk260/fk263/fk265/fk266/fk267/fk268) plus `femma`;
   `D:\git` holds AlvaLinus, asynkron and FaktorialDemo alongside the
   AlexExperimenterar working folders and `.faktorial-agents`; and
   `D:\git\asynkron` holds only femma. Transfer demonstrated practices
   with explicit
   owners. The autonomous factory operates around this static product;
   it is not an application backend to install here.

## Evidence boundaries and update triggers

- Reads made on November 18 during this fk265 refresh: the previous roadmap
  in full (the committed fk251 generation at this checkout's prepared base
  `99a6a23`, the generation this document supersedes); the Git history
  across the `30f72ae..99a6a23` delta — five merges in order: fk253 PR
  #162 head `54ead38b` merge `de05fa5`, fk251 PR #163 head `2efd6a5`
  merge `86fa8e5`, fk252 PR #164 head `381df35` merge `6ba9e1c`, fk257
  PR #165 head `5b2607c` merge `0a5964d`, fk259 PR #166 head `1c8dcdc`
  merge `99a6a23` — and owning
  `get_task` reads confirming fk253, fk251, fk252, fk257 and fk259
  closed/done/approved at the states recorded above, with merge receipts
  and quality receipts read from their own records (fk257 and fk259 at
  317/317; fk259's required `validate-features` proof packet passing
  valid/complete/zero findings on its committed candidate), fk220 closed
  approved without a merge receipt and fk224 closed with `answered_at`
  still the zero timestamp (both re-read from their own records), the
  queued prompts re-read on their own records (fk238's sweep — footer
  half consumed by fk257, chips remainder converted to fk267; fk183's F2
  re-stamp, still queued; fk248's F6-US4 print mapping, unconsumed by
  fk259 and converted to fk268; fk171's contrast-test hardening, still
  queued), the self-healed incident records fk260 (delivered, with its
  fk6 template clause) and fk263 (closed `already_satisfied`), the
  fk266 summarize-configuration wait (operator-side, unsupported
  capability), and the open-inventory read (eleven records at
  ~21:37Z: this task, fk266, eight delivery notices — no other feature
  work).
  Source verification at this HEAD: the hero listing
  (stensattning-photo.webp 252,246 B, quote-hero.webp 247,578 B,
  services-hero.webp 230,484 B — fk252's recompression confirmed on
  main; tradgard-generated.webp 342,786 B now the largest preloaded
  hero; gravjobb-photo 148,896 B; variants unchanged), the
  [quote-share.ts](../src/lib/quote-share.ts) parameter set now carrying
  `notes: "anteckning"` with encode-only-when-non-empty on both share
  builders and tolerant decode on both read sides (fk253's delivered
  carry), the fixed `heroAssetByteBudget` JSDoc example in
  [route-artifacts.mjs](../scripts/route-artifacts.mjs) citing
  tradgard-generated at 342,786 B (fk252's prose fix),
  [styles.footer-tap-targets.test.ts](../src/styles.footer-tap-targets.test.ts)
  present (fk257), the chips at
  [SiteHomePage.tsx](../src/pages/SiteHomePage.tsx):525 still
  `px-3 py-1` and the NotFound pills at :683 already `px-4 py-2`
  (grounding the fk267 link), the print path
  ([QuotePageShared.tsx](../src/components/QuotePageShared.tsx):74
  `window.print()`, [QuotePage.css](../src/pages/QuotePage.css):5/:41
  `@media print` blocks; grounding the fk268 link), and the reconciled
  catalog state via fk259's own record and the 2026-11-18 README stamp
  rather than a re-derivation. The created tasks
  fk267/fk268 read back open at 21:40:30Z/21:40:53Z with exact labels
  `priority: medium` and `size:medium` (verified available in
  /api/tasks/labels); the open-task inventory read just before creation
  held eleven records with no other feature work. This checkout's parent
  holds this generation's worktrees (fk257/fk259/fk260/fk263/fk265/
  fk266/fk267/fk268) plus `femma`, `D:\git` holds AlvaLinus, asynkron
  and FaktorialDemo alongside the AlexExperimenterar working folders and
  `.faktorial-agents`, and `D:\git\asynkron` holds only femma
  (re-verified November 18); `../booking` and `../Asynkron.JsEngine` are
  absent.
  Unchanged structural claims carried from the October 28–November 17
  reviews keep that provenance.
- One-day Faktorial API usage read on November 18 (21:39:22Z) reported
  47,976 calls across 18 endpoints, overwhelmingly task-record reads
  (GET /api/tasks/{issue_ref}, 38,203), with canvas context-checks at
  9,207, worker-settings reads at 127, task-list reads at 106, queue
  reads at 97, attachment reads at 94 and agent-management reads at 90.
  The same caveats as previous refreshes stand and
  this read is again far thinner than its window: the volatile in-memory
  retention covered only 21:37:31Z–21:39:22Z against the one-day request
  (TTL 3600 s), the population was truncated by a store cap, the sampling
  state is unknown, and revision comparability is unavailable; of 382
  selected retained spans, 360 joined exactly to durable route identities
  and 22 were unmatched (all `conflicting_route`), with zero errors in the
  measured population — but that population is a thin window, not a
  demand estimate.
- The serving-process database telemetry read at 21:39:22Z on November 18
  covered the collector epoch reset 2026-11-18T17:04:56Z: at the read its
  cumulative counters span about 4.5 hours — 582,329 calls, 453,702
  queries, 40 errors and ≈645.6 MB received (PostgreSQL protocol bytes,
  excluding TLS overhead and not Supabase billing), led by the DuePage
  agent-run reads (79,361 calls, 79,372 queries, ≈453.4 MB received,
  39 errors), the paired SchedulingRevision/CommandRevision reads
  (65,358 calls each), the Settings reads (32,682), the workerRefresh
  Candidates refreshes (16,463), ListInstalledTemplateIDs (16,343),
  ExecutionSettings (16,341), LoadStateChanged (11,565), the
  ListSchedulingFactsContext reads (8,196) and the TryClaim claim
  attempts (2,659 calls, 10,640 queries); one further error sits in the
  projectarchitecture SourceSync ReadSelection queries. The serving
  process restarted about 4.5 hours before the read. Cumulative counters
  are not comparable across collector resets.
  Both populations are Cloud serving-process scope, not this static site,
  and none can be combined into an error rate or demand estimate.
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
  - fk251 (November 17): the previous roadmap read in full at the
    prepared `30f72ae` tip (fk248's merge, arrived directly at the tip
    unlike its stale investigation snapshot `c0e17d2`), the
    `c0e17d2..30f72ae` delta (fk241/fk243/fk242/fk247/fk248), source
    verification of the sibling-hero listing (then still 385,866 /
    362,898 / 345,948 B), the then-unextended quote-share parameter set
    and the stale `heroAssetByteBudget` JSDoc, owning reads of
    fk241/fk242/fk243/fk247/fk248/fk220/fk224/fk238, the fk252/fk253
    creation read-backs, the three-record open inventory, API usage
    (68,425 calls/18 endpoints) and database telemetry (102,152 calls /
    82,765 queries / 7 errors on the 2026-11-17T20:12:31Z epoch) under
    the serving-process caveats — full text in Git history at merge
    `86fa8e5` (PR #163).
  - fk241 (November 16): the previous roadmap read in full at the
    prepared `c0e17d2` tip (fk237's merge), the `80eb6bd..c0e17d2` delta
    (fk232/fk233/fk238/fk237) plus the unmerged fk220 PR #149, source
    verification of the registry pricing, share-link helpers, tap-target
    utilities, font-preload documentation, sibling-hero listing and
    drifted catalog passages, owning reads of fk232/fk233/fk237/fk238/
    fk231/fk228/fk220/fk224/fk214/fk171/fk183/fk195, the fk242/fk243
    creation read-backs, the sixteen-record open inventory, API usage
    (116,005 calls/10 endpoints) and database telemetry (102,010 calls /
    85,043 queries / 7 errors on the 2026-11-16T19:19:39Z epoch) under
    the serving-process caveats — full text in Git history at merge
    `e3f084a` (PR #157).
  - fk231 (November 15): the previous roadmap read in full at the
    prepared `80eb6bd` tip (fk228's merge), the `c3f9ede..80eb6bd` delta
    (fk219/fk221/fk227/fk228) plus the unmerged fk220 PR #149, source
    verification of the sibling-hero listing, money-logic constants and
    font-preload helpers, owning reads of fk219/fk220/fk221/fk224/fk227/
    fk228/fk214, the fk232/fk233 creation read-backs, the nine-record
    open inventory, API usage (132,854 calls/8 endpoints) and database
    telemetry (4,400,074 calls / 3,742,253 queries / 8 errors on the
    2026-11-14T20:58:45Z epoch) under the serving-process caveats —
    full text in Git history at merge `5e90bfe` (PR #152).
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
