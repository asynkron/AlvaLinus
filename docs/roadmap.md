# Product and operation roadmap

Reviewed: 2026-11-22 UTC (fk310). Source baseline:
`ed4590c0be4fde7175197ee42af05b170eda6c52`, the prepared task HEAD and
fk303's merge. This identifies source, not an observed deployment.

This refresh preserves and supersedes fk302's November 21 generation, read in
full from the prepared checkout (`9253c4f:docs/roadmap.md`, reviewed head
`d0dbe527`, PR #184). Its two priorities are now delivered, as reconciled below.
Earlier assessments remain in Git rather than accumulating here. Source
delivery, effective closure, accepted quality and live operation are separate
evidence. Goals do not authorize a backend or telemetry.

## Where we are

AlvaLinus is the static Swedish Svärd Entreprenad React/TypeScript/Vite site.
Its twelve routes are `/`, `/offertberakning/`, `/draneringsberakning/`,
`/tjanster/`, `/inhyrning/`, `/om-oss/`, `/stensattning/`, `/markarbete/`,
`/gravjobb/`, `/dranering/`, `/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [types](../src/types/site.ts)
and [the renderer](../src/pages/SiteHomePage.tsx) own routes, Swedish text,
navigation and page assets. There is no backend, database, authentication or
serverless runtime ([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

Visitors can choose services, assess the company, prepare project/staffing
inquiries, and calculate/share preliminary driveway and drainage estimates.
Contact actions hand off to the visitor's email program; they do not establish
submission or delivery. Contact details remain `linus.svardd@outlook.com` and
`070-214 67 83` (`tel:+46702146783`).

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
  Edits, changed-value reset and invalidation discard old sharing feedback.
  Obsolete clipboard results cannot revive it, including after returning to
  original inputs; only the latest attempt announces its result. Editing alone
  does not publish a URL or copy anything.
- Before sharing, Swedish guidance explains that recipients can read the
  measurements, options, VAT mode and any project notes included in the link.

See [quote-calculators.md](features/quote-calculators.md) and the shared
[QuotePageShared.tsx](../src/components/QuotePageShared.tsx) owner.
[Staffing inquiries](features/staffing-inquiry.md) now offer a complete
selectable draft with recipient, subject and labeled body for manual copying
into webmail without clipboard permission or a working mail handler. Any field
or momsstatus edit discards the confirmation, preview and reopen link. Only a
fresh valid submit prepares the current draft; an already opened external
email cannot be retracted. Project contact and calculator email recovery still
have the distinct gaps below.

## Recent deliveries and ownership reconciliation

Current owning `get_task` reads at **23:07–23:08 UTC on November 22** confirm
fk302/fk303/fk304 effectively closed/done with distinct merge receipts. The
prepared source contains those merges. Retained relation labels saying open
do not override owning records. Closure and source delivery do not accept
fk310 or prove deployment.

| Task | Reviewed head → merge / PR | Delivered outcome and disposition |
| --- | --- | --- |
| [fk302](https://app.faktorial.ai/projects/alvalinus/tasks/fk302) | `d0dbe527` → `9253c4f` / #184 | Newer concise roadmap preserved here. Its two priorities below are consumed; older history remains in Git. |
| [fk304](https://app.faktorial.ai/projects/alvalinus/tasks/fk304) | `96997ec` → `1e3beed` / #186 | Complete selectable staffing draft and edit invalidation. Retire the old staffing recovery gap; follow-ups below cover different F3/F6 journeys. |
| [fk303](https://app.faktorial.ai/projects/alvalinus/tasks/fk303) | `5518857` → `ed4590c` / #185 | Pre-share Swedish disclosure includes project notes. Retire the old disclosure gap; URL encoding and sharing lifecycle remain delivered. |

The preceding generation's reconciliation of fk290/fk291/fk292/fk296/fk298/
fk300 remains at `9253c4f:docs/roadmap.md`: passing-report checks, actual-page
sharing invalidation, dependency alignment, staffing feedback invalidation and
catalog updates remain delivered. A fresh owning read also confirms fk291
closed/done (reviewed `c50415c`, merge `ba090da`, PR #180); its bounded count
repair did not add revision/full-gate identity. None of those scopes is reopened.
Earlier contact, VAT, quote-limit, footer, image, print, CSS-parser and
overlapping-share history remains at `542a088:docs/roadmap.md` and preceding
`a962378:docs/roadmap.md`. Refresh older Done owners before acting on them.

## What works well

- The typed registry centralizes routes, copy, assets, prices and mail templates.
  Shared quote controls keep presentation/action feedback consistent while
  calculations remain page-specific.
- The static artifact gate checks physical route documents, page assets,
  responsive hero preloads, social images and font preloads. Source/build
  assertions do not establish browser timing or production serving behavior.
- Existing in-memory coverage protects calculations, encoding/restoration,
  validation, keyboard flow, shared clipboard lifecycle, actual page edits and
  print-document state. Staffing cases inspect the selectable draft and its
  invalidation. Mappings describe maintained source coverage, not execution in
  this run. Field-border checks tolerate equivalent CSS formatting; they check
  base borders, not rendered accessibility
  ([stylesheet rule](rules/stylesheet-behavior-guards.md)).
- F1–F6 retain stable feature/story IDs. Documentation distinguishes shared
  component evidence, page assertions and technical metadata checks. fk309's
  pending reconciliation below remains distinct from accepted catalog state.
- [The runner](../scripts/make.js) and [README](../README.md) define Node 24+,
  locked dependencies, strict TypeScript, production build, static-asset
  validation and one Vitest session through native quality. The factory can
  reconcile interleaved deliveries and assign bounded, nonduplicate work.
- [Release provenance](release-runbook.md) composes clean source, rebuilt
  artifact checksums and retained passing test evidence. Failed or all-skipped
  reports are rejected. Publication stays a separate host fact.

## What works less well and what to improve

- The shared [project Contact form](../src/pages/SiteHomePage.tsx) at home
  `/#kontakt` and `/kontakt/` still has only the native `mailto:` form and
  address fallback. A visitor without a handler must reconstruct recipient,
  subject and details from separate controls. The staffing preview does not
  cover this F3 journey. Preserve native validation and service preselection
  while adding explicit manual preparation.
- [QuoteResultAside](../src/components/QuotePageShared.tsx) offers email only
  through `mailto:`. Its manual-copy fallback recovers a share URL, not an
  addressed email draft. Both calculators already compose the current email;
  expose that same content for webmail, especially above 100 where printing is
  disabled. Keep this distinct from sharing and never revive an old total.
  These are source-backed recovery gaps, not measured lost inquiries.
- Retained test evidence has no source-revision stamp or full-gate verdict.
  Rejecting failed counts does not prove that a passing report belongs to
  the released revision. The runbook requires separately connecting canonical
  acceptance to that revision; composition must not imply otherwise.
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
before creation on November 22 contains **23 records**: fk310, fk308/fk309,
seventeen delivery notices (fk275/fk277/fk279/fk283/fk284/fk285/fk287/fk289/
fk293/fk294/fk295/fk297/fk299/fk301/fk305/fk306/fk307), and fk266/fk272/fk273.
No unresolved owner holds either new scope. Unresolved overlapping work blocks
duplicate creation; open delivery notices do not reopen their delivered source.

1. **Recover a complete project inquiry — [fk311](https://app.faktorial.ai/projects/alvalinus/tasks/fk311).**
   Add explicit manual preparation to the shared Contact form, with selectable
   recipient, subject and labeled current fields, without opening email.
   Preserve the original native email submit, required validation, service
   context and Swedish self-send explanation. Edits discard prepared content;
   only fresh valid preparation restores it. Fresh owning reads confirm fk46
   (explanation, merge `4b60d72`) and fk56 (service context, merge `eaa1138`)
   closed/done. This extends their F3 recovery and the pattern delivered by
   fk304; fk304 explicitly excluded the project contact form.
2. **Recover the calculator email draft — [fk312](https://app.faktorial.ai/projects/alvalinus/tasks/fk312).**
   Use current mail composition to expose selectable recipient, subject and
   body on both calculators without requiring a handler or clipboard. Preserve
   VAT, notes and asphalt in estimates; above 100 retain the existing scope-only
   body without any estimated price. Invalid input exposes no usable draft;
   edits/reset/invalidation discard the old preview until fresh preparation.
   Fresh owning reads confirm fk274 closed/done (merge `a46d676`), preserving
   its recipient, removed loads and 100-unit limit. This extends F6 email
   recovery beyond fk303's disclosure and fk304's staffing-only draft; it does
   not repeat math, URL-sharing or invalidity coverage. fk311 owns only F3.

Both issues were created through the owning API at **2026-11-22 23:09:52–53 UTC**
and independently read back open with exact authored titles/bodies and labels
`priority: medium` / `size:small`. Source evidence at `ed4590c` includes
worker-local TypeScript LSP state `ok` for Contact and QuoteResultAside plus
source reads of both calculator pages. Closed-task contact/draft/handoff
searches were also inspected; they do not replace current ownership checks.
Each issue requires in-memory behavior coverage, preserved static boundaries
and native quality, without wording snapshots or external I/O tests.
Implementation belongs to those issues, not fk310. No document-wording tests
are needed here.

Existing unresolved product ownership remains separate. Fresh owning reads
confirm [fk308](https://app.faktorial.ai/projects/alvalinus/tasks/fk308) open
build/waiting, PR #187 head `c01b64a7`, with driveway accessible-invalidity
coverage committed and native quality reported running. It reassessed the old
two-quantity diagnosis because fk274 removed loads. Likewise
[fk309](https://app.faktorial.ai/projects/alvalinus/tasks/fk309) is open
build/waiting, PR #188 head `253fdbf1`, with catalog recovery/F5 mapping changes
committed and native quality reported running. Neither is accepted or merged
by these observations; preserve their ownership and reconcile their delivery
before follow-ups edit shared tests/catalog files. Neither completion is needed
to write this roadmap.

Existing platform ownership remains separate: fresh owning reads confirm
[fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) open/waiting
on unsupported summary-engine configuration, and
[fk272](https://app.faktorial.ai/projects/alvalinus/tasks/fk272) open/waiting
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
   actions. Extend practical manual recovery to project and calculator email
   journeys while preserving delivered staffing recovery and share disclosure.
   Define useful inquiry outcomes/privacy requirements before promising
   delivery or analytics.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when source/operation are available. Exact `../booking` and
   `../Asynkron.JsEngine` paths remain absent at this build read; findings about
   them remain unknown. The autonomous factory surrounds this static product.

## Evidence boundaries and update triggers

- Source reads: full fk302 roadmap; recent commit history and focused
  `9253c4f..ed4590c` code/docs delta; Contact, shared quote controls and both
  calculator pages; staffing composition/preview; updated F5/F6 documentation
  and F3 project inquiry; release composition, quality writer and runbook.
  Historical capabilities and the twelve-route inventory are retained.
  Owning records and the complete open inventory are point-in-time reads.
- Faktorial API usage observed **2026-11-22T23:08:11.965220241Z**: one UTC-day
  durable total **120,113** across **10 endpoints**, none omitted at limit 10.
  Task-record reads (**95,909**) and canvas context checks (**23,546**) dominate.
  These are factory usage patterns, not website traffic.
- Independent retained reliability: **314 selected**, **242 matched**, **72
  conflicting-route unmatched** spans; matched spans report zero errors.
  Volatile capped retention covers **23:04:01.593–23:08:11.456 UTC**, TTL 3,600
  seconds, truncated; sampling is unknown and service-revision comparability
  unavailable. Do not divide by durable counts or infer full-window reliability.
- Serving-process DB telemetry observed **2026-11-22T23:08:11.916859046Z**,
  collector `serving-process:7:2026-11-22T18:18:42.136932369Z:database-otel-sdk:2026-11-22T18:18:42.167795123Z`,
  reset **18:18:42.167795123Z**: cumulative **779,881 calls**, **746,990 queries**,
  **3 errors**, **577,784,389 received PostgreSQL protocol bytes**. Project
  attribution, other-client/cluster totals, billing bytes and external OTLP
  receipt are unavailable. OTLP export is disabled; bytes exclude TLS overhead.
  Do not compare across resets or combine API/DB populations. These show factory
  activity, not product demand or a demonstrated bottleneck. The website has no DB.
- The retained fk310 log summary records Investigation completing and Build
  starting; it supplies no deployment or website operation evidence. Website
  traffic/logs, inquiry delivery and live activation remain unavailable. No new
  privacy/compliance verdict follows from this update.
- No tests, typechecks, builds or quality commands ran in this agent session.
  No runtime or tests changed and no separate code-proof obligation is declared
  for fk310. Ordinary native quality/review assess the committed candidate.
- Refresh when source, ownership, accepted evidence, publication facts or sibling
  availability changes. Re-read older Done owners before consuming scope; retain
  visible supersession/follow-up reasons. Historical reconciliation remains at
  `9253c4f:docs/roadmap.md`, `542a088:docs/roadmap.md`,
  `a962378:docs/roadmap.md`, `4edaa98:docs/roadmap.md` and earlier pointers.
  Old observations are not fresh.
