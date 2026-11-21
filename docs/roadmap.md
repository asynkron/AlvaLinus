# Product and operation roadmap

Reviewed: 2026-11-21 (fk302). Source baseline:
`803eb10b69b550fa2b09ab34f711ff89cecf09dd`, the prepared task HEAD and
fk300's merge. This identifies source, not an observed deployment.
Workspace preparation installed locked dependencies without running acceptance.

This refresh preserves and supersedes fk290's November 20 generation, read in
full from the prepared checkout (`542a088:docs/roadmap.md`, reviewed head
`bf70bec`, PR #178). Its two pending priorities are now delivered, as reconciled
below. Earlier assessments remain in Git rather than accumulating here.
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
Staffing inquiries likewise discard their draft confirmation and reopen link
after any field or momsstatus edit. Only a fresh valid submit prepares the
current draft; an already opened external email cannot be retracted.

## Recent deliveries and ownership reconciliation

Current owning `get_task` reads at **22:51 UTC on November 21** confirm these
records effectively closed/done, with native quality passed at their listed
reviewed heads and distinct merge receipts. Historical passes do not accept
fk302 or prove deployment. Retained relation labels saying open do not override
the owning records.

| Task | Reviewed head → merge / PR | Delivered outcome and disposition |
| --- | --- | --- |
| [fk290](https://app.faktorial.ai/projects/alvalinus/tasks/fk290) | `bf70bec` → `542a088` / #178 | Newer concise roadmap and two owned priorities. Its assessment is superseded here; both pending items below are consumed. |
| [fk292](https://app.faktorial.ai/projects/alvalinus/tasks/fk292) | `21a7562` → `e1795d7` / #179 | Actual calculator measurement, notes, VAT, asphalt and changed-reset controls prove sharing invalidation and explicit resharing. Retire fk290's second pending item; shared race coverage remains at its owner. |
| [fk291](https://app.faktorial.ai/projects/alvalinus/tasks/fk291) | `c50415c` → `ba090da` / #180 | Release provenance requires positive passed and zero failed counts, rejecting empty/all-skipped reports. Retire fk290's first pending item; revision/full-gate identity remains a separate boundary. |
| [fk296](https://app.faktorial.ai/projects/alvalinus/tasks/fk296) | `f5b67e6` → `ecd3215` / #181 | PostCSS minimum aligns with locked 8.5.33; no new dependency mechanism. |
| [fk298](https://app.faktorial.ai/projects/alvalinus/tasks/fk298) | `c3cd2cf` → `9f3a718` / #182 | Staffing field/momsstatus edits discard outdated confirmation and reopen links without opening another draft. Preserve this protection in future recovery work. |
| [fk300](https://app.faktorial.ai/projects/alvalinus/tasks/fk300) | `54a00a9` → `803eb10` / #183 | F5/F6 prose and story evidence reflect inquiry invalidation, VAT, scope limits and clipboard status. Published identities and the twelve-route inventory remain intact. Closure/quality do not establish independent manifest-proof acceptance. |

The merge order is the table order. Earlier contact, VAT, quote-limit,
footer, image, print, CSS-parser and overlapping-share work retains its
ownership reconciliation at `542a088:docs/roadmap.md` and the preceding
`a962378:docs/roadmap.md`. Those delivered scopes are not reopened here.
Refresh older Done owners before acting on them.

## What works well

- The typed registry centralizes routes, copy, assets, prices and mail templates.
  Shared quote controls keep presentation/action feedback consistent while
  calculations remain page-specific.
- The static artifact gate checks physical route documents, page assets,
  responsive hero preloads, social images and font preloads. Source/build
  assertions do not establish browser timing or production serving behavior.
- In-memory coverage protects calculations, encoding/restoration, validation,
  keyboard flow, shared clipboard lifecycle, actual page edits and print-document
  state. Staffing tests protect current-input draft feedback.
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
  artifact checksums and retained passing test evidence. Failed or all-skipped
  reports are rejected. Publication stays a separate host fact.

## What works less well and what to improve

- The quote share guidance currently mentions measurements and the calculation,
  while [both URL builders](../src/lib/quote-share.ts) also include nonempty
  free-text notes as `anteckning`. Visitors need to know before sharing that
  recipients can read those notes. This is a source-backed disclosure gap,
  not an observed privacy incident or a legal compliance finding.
- The [staffing page](../src/pages/InquiryPage.tsx) offers another `mailto:`
  link when the email program fails to open. That recovery still needs a
  working handler. Values remain in the form, but there is no complete
  selectable draft to copy into webmail. Manual recovery can improve within
  the existing static boundary without promising delivery.
- Retained test evidence has no source-revision stamp or full-gate verdict.
  Rejecting failed counts does not prove that a passing report belongs to
  the released revision. The runbook explicitly requires separately connecting
  canonical acceptance to that revision; composition must not imply otherwise.
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

Exactly two new follow-ups are selected. The complete open inventory checked
before creation on November 21 contains **18 records**: fk302, fourteen delivery
notices (fk275/fk277/fk279/fk283/fk284/fk285/fk287/fk289/fk293/fk294/fk295/
fk297/fk299/fk301), fk266 and fk272/fk273. No unresolved owner holds either new
scope. Unresolved overlapping work would block duplicate creation.

1. **Explain notes in shared quote links — [fk303](https://app.faktorial.ai/projects/alvalinus/tasks/fk303).**
   Use the existing typed Swedish guidance on both calculators to explain,
   before sharing, that the URL carries measurements, options/VAT and any notes,
   readable by recipients. Preserve URL compatibility and explicit sharing.
   This adds disclosure beyond delivered fk292/fk300; it does not repeat
   invalidation, race repair or evidence mapping. Reuse existing behavior
   coverage and avoid tests freezing the entire wording.
2. **Offer a selectable staffing draft — [fk304](https://app.faktorial.ai/projects/alvalinus/tasks/fk304).**
   After valid preparation, expose recipient, subject and the existing labeled
   body for native manual copying into webmail, without requiring a clipboard
   API or email handler. Reuse mail composition and retain validation, optional
   values and VAT basis. Edits must remove old prepared content; only a fresh
   valid preparation restores it. This extends recovery beyond fk298/fk300
   while preserving their delivered invalidation contract. Keep the project
   contact form, persistence and delivery services outside this scope.

Both issues were created through the owning API at **2026-11-21 22:53:21 UTC**
and independently read back open with exact authored titles/bodies and labels
`priority: medium` / `size:small`. Their source evidence was inspected at
`803eb10`, with worker-local LSP state `ok` for shared quote controls and
staffing mail composition at that revision. Implementation belongs to those
issues, not fk302; ordinary native quality/review assess their candidates.
No document-wording tests are needed here.

Existing platform ownership remains separate: fresh owning reads confirm
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
2. **Repeatable product operation.** Connect canonical revision acceptance,
   retained artifacts and real publication identity, then demonstrate restore
   when host/access decisions become available. Avoid speculative infrastructure.
3. **Resilient customer journeys.** Preserve accessible navigation, Swedish copy,
   preliminary-price limits, correct VAT labels and feedback belonging to current
   actions. Make sharing understandable and manual inquiry recovery practical.
   Define useful inquiry outcomes/privacy requirements before promising
   delivery or analytics.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when source/operation are available. Exact `../booking` and
   `../Asynkron.JsEngine` paths remain absent at this build read; findings about
   them remain unknown. The autonomous factory surrounds this static product.

## Evidence boundaries and update triggers

- Source reads: full fk290 roadmap; recent `30f72ae..803eb10` delta and focused
  `542a088..803eb10` changes; calculator/shared controls and URL helpers;
  staffing page; updated F5/F6 feature/story documentation; release composition,
  quality writer and runbook. Tests were inspected as source, not executed.
  Owning task records and the complete open inventory are point-in-time reads.
- Faktorial API usage observed **2026-11-21T22:51:43.477531161Z**: one UTC-day
  durable total **134,701** across **10 endpoints**, none omitted at limit 10.
  Task-record reads (**110,730**) and canvas context checks (**23,437**) dominate.
  These are factory usage patterns, not website traffic.
- Independent retained reliability: **319 selected**, **265 matched**, **54
  conflicting-route unmatched** spans; matched spans report zero errors.
  Volatile capped retention covers **22:48:25.656–22:51:43.417 UTC**, TTL 3,600
  seconds, truncated; sampling is unknown and service-revision comparability
  unavailable. Do not divide by durable counts or infer full-window reliability.
- Serving-process DB telemetry observed **2026-11-21T22:51:43.360515731Z**,
  collector `serving-process:6:2026-11-21T15:11:27.70413707Z:database-otel-sdk:2026-11-21T15:11:27.742632745Z`,
  reset **15:11:27.742632745Z**: cumulative **1,434,741 calls**, **1,198,149 queries**,
  **76 errors**, **1,575,375,013 received PostgreSQL protocol bytes**. Project
  attribution, other-client/cluster totals, billing bytes and external OTLP
  receipt are unavailable. OTLP export is disabled; bytes exclude TLS overhead.
  Do not compare across resets or combine API/DB populations. These show factory
  activity, not product demand or a demonstrated bottleneck. The website has no DB.
- The retained fk302 log summary records Investigation completing and Build
  starting; it supplies no deployment or website operation evidence. Website
  traffic/logs, inquiry delivery and live activation remain unavailable. No new
  privacy/compliance verdict follows from this update.
- No tests, typechecks, builds or quality commands ran in this agent session.
  No runtime or tests changed and no separate code-proof obligation is declared
  for fk302. Ordinary native quality/review assess the committed candidate.
- Refresh when source, ownership, accepted evidence, publication facts or sibling
  availability changes. Re-read older Done owners before consuming scope; retain
  visible supersession/follow-up reasons. Historical reconciliation remains at
  `542a088:docs/roadmap.md`, then `a962378:docs/roadmap.md`,
  `4edaa98:docs/roadmap.md` and earlier pointers. Old observations are not fresh.
