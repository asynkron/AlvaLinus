# Product and operation roadmap

Reviewed: 2026-11-20 (fk290). Source baseline:
`337dcc5d74eb13b1bd021e12d6ddf0a7d9f8fd15`, the prepared task HEAD and
fk288's merge. This identifies source, not an observed deployment.
Workspace preparation installed locked dependencies without running acceptance.

This refresh supersedes fk280's November 19 assessment, read in full from the
prepared checkout (`a962378:docs/roadmap.md`, reviewed head `92c6c82`, PR #173).
It preserves that newer generation and its ownership decisions; the stale
Investigation checkout's fk251 generation must not replace it.
Source delivery, effective closure, accepted quality and live operation are
separate evidence. Goals do not authorize a backend or telemetry.

## Where we are

AlvaLinus is the static Swedish Svärd Entreprenad React/TypeScript/Vite site.
Its twelve routes are `/`, `/offertberakning/`, `/draneringsberakning/`,
`/tjanster/`, `/inhyrning/`, `/om-oss/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/`, `/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [types](../src/types/site.ts)
and [the renderer](../src/pages/SiteHomePage.tsx) own the route inventory,
Swedish text, navigation and page-specific assets. There is no application
backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Visitors can choose services, assess the company, prepare project/staffing
inquiries, and calculate/share preliminary driveway and drainage estimates.
Contact actions prepare drafts in the visitor's email program; they do not
establish submission or delivery. Contact details remain
`linus.svardd@outlook.com` and `070-214 67 83` (`tel:+46702146783`).

The current calculators have these delivered behaviors:

- Driveway pricing uses area, optional asphalt and a fixed cost. Loads are
  absent from fields, prices, mail and generated URLs; legacy `lass` is ignored.
- Native **Inkl. moms / Exkl. moms** radios default to inclusive. Exclusive
  amounts derive from the unrounded inclusive total / 1.25. Result, email and
  print carry the selected label; reset returns to inclusive.
- Positive finite measurements through 100 m² or 100 löpmeter yield an estimate.
  Above 100, **Kontakta oss för en individuell offert** replaces the price;
  email carries scope and notes, print is disabled, and sharing restores that
  state. Invalid input has its own alert state.
- Explicit sharing carries measurements, asphalt where applicable, optional
  `anteckning` and `moms=exkl` for exclusive VAT. Older links default to inclusive.
  Edits, reset to different values and invalidation discard old sharing feedback.
  Obsolete clipboard results cannot revive it, including after returning to
  original inputs; only the latest attempt announces its result. Editing alone
  does not publish a URL or copy anything.

See [quote-calculators.md](features/quote-calculators.md) and the shared
[QuotePageShared.tsx](../src/components/QuotePageShared.tsx) owner.

## Recent deliveries and ownership reconciliation

Current owning `get_task` reads at approximately 22:32 UTC on November 20
confirm these records effectively closed/done, with native quality passed at
their listed reviewed heads and distinct merge receipts. Historical passes do
not accept fk290 or prove deployment. Retained relation labels saying open do
not override the owning records.

| Task | Reviewed head → merge / PR | Delivered outcome and disposition |
| --- | --- | --- |
| [fk280](https://app.faktorial.ai/projects/alvalinus/tasks/fk280) | `92c6c82` → `a962378` / #173 | Newer roadmap and two owned follow-ups. Its assessment is superseded here; both pending items are consumed. |
| [fk281](https://app.faktorial.ai/projects/alvalinus/tasks/fk281) | `b406a66` → `1eba9de` / #174 | Installed PostCSS parsing replaces formatting-sensitive field-border extraction; passing/missing/invisible/low-contrast cases retain the ≥3:1 boundary contract. Retire fk280's first pending item; no repeat hardening task. |
| [fk282](https://app.faktorial.ai/projects/alvalinus/tasks/fk282) | `610d373` → `655a0bb` / #175 | F6/F6-US4 map current-input, obsolete-completion and latest-attempt feedback. Retire fk280's second pending item; no repeat mapping task. |
| [fk286](https://app.faktorial.ai/projects/alvalinus/tasks/fk286) | `220056c` → `5c30796` / #176 | Controlled-promise coverage includes both completion orders, including obsolete success/rejection while the newest attempt is pending. Coverage extension of delivered runtime, not another runtime repair. |
| [fk288](https://app.faktorial.ai/projects/alvalinus/tasks/fk288) | `42bfab2` → `337dcc5` / #177 | F4 covers both calculators in its twelve-route inventory; F6 evidence describes four overlapping-attempt cases; stale feature limitations/index prose are reconciled. Source mapping and exploratory manifest validity do not establish independent proof acceptance. |

The merge order after fk280 is fk282 → fk281 → fk286 → fk288. The current
catalog preserves fk282 and extends its evidence. Earlier contact, VAT,
quote-limit, footer, chip, image and print deliveries retain their historical
ownership reconciliation at `a962378:docs/roadmap.md`; they are not freshly
reclassified or reopened here. Refresh older Done owners before acting.

Two additional owners were read at approximately 22:33 UTC before selecting
follow-ups: [fk165](https://app.faktorial.ai/projects/alvalinus/tasks/fk165)
is closed/done, reviewed head `063e171`, merge `72af228`, PR #123, quality
passed; its composed provenance command is delivered, with the narrower
acceptance defect below still present.
[fk276](https://app.faktorial.ai/projects/alvalinus/tasks/fk276) is closed/done,
reviewed head `2c86d78`, merge `6e12cd0`, PR #171, quality passed; its shared
feedback repair remains delivered. The new page-wiring proof complements
that boundary rather than reopening race handling.

## What works well

- The typed registry centralizes routes, copy, assets, prices and mail templates.
  Shared quote controls keep presentation/action feedback consistent while
  calculations remain page-specific.
- The static artifact gate checks physical route documents, page assets,
  responsive hero preloads, social images and font preloads. Source/build
  assertions do not establish browser timing or production serving behavior.
- In-memory coverage protects calculations, encoding/restoration, validation,
  keyboard flow, shared clipboard lifecycle and print-document state.
  Field-border checks now tolerate equivalent CSS formatting; they check
  explicit base borders, not browser cascade or rendered accessibility
  ([stylesheet rule](rules/stylesheet-behavior-guards.md)).
- F1–F6 retain stable feature/story IDs. Current documentation distinguishes
  shared-component evidence, page assertions and technical metadata checks.
- [The runner](../scripts/make.js) and [README](../README.md) define Node 24+,
  locked dependencies, strict TypeScript, production build, static-asset
  validation and one Vitest session through native quality. The factory can
  reconcile interleaved deliveries and assign bounded, nonduplicate work.
- [Release provenance](release-runbook.md) composes clean source, rebuilt
  artifact checksums and retained test evidence. Publication stays a separate
  host fact; evidence acceptance has the limitation below.

## What works less well and what to improve

- Release composition treats `quality-evidence.v1` status `complete` as accepted
  after validating count shape. But
  [quality-evidence.mjs](../scripts/quality-evidence.mjs) writes `complete` for
  terminal failed tests too, before the runner reports the failed exit.
  [release-provenance.mjs](../scripts/release-provenance.mjs) does not reject
  positive failed counts. A completed failing report can therefore be joined
  into a misleading accepted record. This is source diagnosis, not executed
  reproduction. Evidence has no source-revision stamp or full-gate verdict;
  fixing failed-count acceptance alone cannot prove those identities.
- Shared-control tests rerender props for invalidation/races. The inspected
  [driveway](../src/pages/QuotePage.test.tsx) and
  [drainage](../src/pages/DrainageQuotePage.test.tsx) tests cover initial sharing
  and restoration, but do not drive actual page edits after sharing. Each
  page's wiring of edited values into sharing lacks an independent proof.
  This is a missing proof boundary, not an observed runtime defect.
- Drainage remains a length-only estimate; soil, depth and access need company
  assessment. Prices are inspectable in the static client and non-binding.
- Approved editorial photography remains separate work in
  [image requests](image-requests.md). Existing placeholders/fallbacks do not
  establish approved Trädgårdsplanering, About, Contact or staffing photography.
- Host, access, retention, rollback and unknown-path serving remain unobserved.
  Inquiry delivery, visitor demand and satisfaction are unmeasured. Submission
  services or telemetry require explicit product/privacy decisions first.
  Authored certification/guarantee claims are not compliance verification.

## Short-term priorities and issue ownership

Exactly two new follow-ups are selected. The complete open inventory before
creation contains 12 records: fk290, eight delivery notices
(fk275/fk277/fk279/fk283/fk284/fk285/fk287/fk289), fk266 and fk272/fk273.
None owns overlapping implementation. Unresolved overlapping work would block
duplicate creation; these scopes are additional to delivered work.

1. **Reject failed test evidence in release provenance — [fk291](https://app.faktorial.ai/projects/alvalinus/tasks/fk291).**
   Fail closed on completed evidence with failed tests; preserve deterministic
   composition, evidence format, manifest behavior and publication placeholders.
   Use injected in-memory fixtures for passing, failed and empty sessions,
   preserving allowed skips alongside real passes. Keep the runbook honest about
   test-result evidence versus full-gate/revision acceptance. Do not rerun quality
   inside provenance or add hosting integration.
2. **Prove calculator page edits invalidate sharing — [fk292](https://app.faktorial.ai/projects/alvalinus/tasks/fk292).**
   Drive real measurement, notes, VAT, driveway-asphalt and changed-reset
   controls after sharing on both calculators. Assert stale link/status removal,
   no automatic URL/clipboard publication, disabled sharing for invalid input
   and explicit resharing of current values. Keep controlled-promise race
   permutations at the shared owner; do not duplicate them per page.

Both issues were created through the owning API on November 20 at
22:37:21 UTC and independently read back open with exact authored bodies and
labels `priority: medium` / `size:medium`.
Implementation belongs to those follow-ups, not fk290. Ordinary native quality
and review assess their candidates. No document-wording tests are needed here.

Existing platform ownership remains separate: current owning reads confirm
[fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) is open/waiting
on unsupported summary-engine configuration, and
[fk272](https://app.faktorial.ai/projects/alvalinus/tasks/fk272) is open/waiting
on a human host-capacity decision carried by
[fk273](https://app.faktorial.ai/projects/alvalinus/tasks/fk273).
Their retained observations are November 18 configuration_error/not_started
and November 19 04:17 UTC C: 1.4 GB free of 161.08 GB (D: 74.17 GB free).
These are dated incident facts, not fresh probes. Neither blocks this roadmap
or authorizes host cleanup/configuration repair here.

## Long-term goals

1. **Trustworthy autonomous development.** Reconcile source and current owning
   task state, select useful nonduplicate work, implement at the smallest owner
   boundary, then obtain native quality/review. Keep source, closure, accepted
   evidence and operation distinct; retain concise historical pointers.
2. **Repeatable product operation.** Strengthen local provenance first; join it
   to real publication identity, artifact retention and a demonstrated restore
   path when host/access decisions become available. Avoid speculative infrastructure.
3. **Resilient customer journeys.** Preserve accessible navigation, Swedish copy,
   preliminary-price limits, correct VAT labels and feedback belonging to current
   actions. Define useful inquiry outcomes/privacy requirements before promising
   delivery or analytics.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when source/operation are available. Exact `../booking` and
   `../Asynkron.JsEngine` paths remain absent at this build read; findings about
   them remain unknown. The autonomous factory surrounds this static product.

## Evidence boundaries and update triggers

- Source reads: full fk280 roadmap; `a962378..337dcc5` recent source/docs delta;
  quote page/shared controls and test declarations; feature index/reconciliations;
  stylesheet prevention rule; release runbook, composition and quality writer.
  Owning records and inventory are point-in-time reads, not execution.
- Faktorial API usage observed **2026-11-20T22:33:36.208332138Z**: one UTC-day
  durable total **126,016** across **10 endpoints**, none omitted at limit 10.
  Task-record reads (**102,592**) and canvas context checks (**22,774**) dominate.
  These are factory usage patterns, not website traffic.
- Independent retained reliability: **349 selected**, **289 matched**, **60
  conflicting-route unmatched** spans; matched spans report zero errors.
  Volatile capped retention covers **22:30:16.929–22:33:36.188 UTC**, TTL 3,600
  seconds, truncated; sampling is unknown and service-revision comparability
  unavailable. Do not divide by durable counts or infer full-window reliability.
- Serving-process DB telemetry observed **2026-11-20T22:33:25.630304697Z**,
  collector `serving-process:7:2026-11-20T21:38:25.69568659Z:database-otel-sdk:2026-11-20T21:38:25.725109643Z`,
  reset **21:38:25.725109643Z**: cumulative **172,908 calls**, **144,461 queries**,
  **11 errors**, **189,335,671 received PostgreSQL protocol bytes**. SDK fields
  are supported; project attribution, other-client/cluster totals, billing bytes
  and external OTLP receipt are unavailable. OTLP export is disabled; bytes exclude
  TLS overhead. Do not compare across resets or combine API/DB populations.
  These show factory read/scheduling activity, not product demand or a demonstrated
  bottleneck. The website itself has no database.
- Website traffic/logs, inquiry delivery, deployment and live activation remain
  unavailable. No new privacy/compliance verdict follows from this update.
- No tests, typechecks, builds or quality commands ran in this agent session.
  Tests were inspected as source; none changed. No separate code-proof obligation
  is declared for fk290; ordinary native quality/review assess this commit.
- Refresh when source, ownership, accepted evidence, publication facts or sibling
  availability changes. Re-read older Done owners before consuming scope; retain
  visible supersession/follow-up reasons. Historical reconciliation remains at
  `a962378:docs/roadmap.md`, then `4edaa98:docs/roadmap.md` and its earlier
  pointers, without representing those old observations as fresh.
