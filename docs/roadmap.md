# Product and operation roadmap

Reviewed: 2026-11-25 UTC (fk322). Source baseline:
`daeb7a7886ff6432be272044640c503fcaaaaf44`, the prepared task HEAD and
fk309's merge. This identifies source, not an observed deployment.

This refresh preserves and supersedes fk310's November 22 generation, read in
full from the prepared checkout (`5678d385:docs/roadmap.md`, reviewed head
`74810b5c`, PR #189). Its two priorities are now delivered, as reconciled below.
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
email cannot be retracted. The shared project Contact form now also offers
explicit native-validity-checked preparation of one complete selectable draft
on home and `/kontakt/`, preserving service context and discarding it on edits.
Both calculators offer selectable recipient, subject and body from the same
mailto composition. Estimates retain VAT and notes; above 100 the draft is
scope-only. Input/VAT edits, reset and invalidation discard it even if the
visitor returns to old values. These recovery paths require neither a mail
handler nor clipboard permission, but the visitor must still send externally.

## Recent deliveries and ownership reconciliation

Current owning `get_task` reads at **07:46–07:48 UTC on November 25** confirm
fk310/fk311/fk312/fk308/fk309 closed/done with distinct merge receipts. The
prepared source contains those merges. Retained relation labels saying open
do not override owning records. Closure, source delivery, accepted quality and
deployment remain separate facts; these receipts do not accept fk322.

| Task | Reviewed head → merge / PR | Delivered outcome and disposition |
| --- | --- | --- |
| [fk310](https://app.faktorial.ai/projects/alvalinus/tasks/fk310) | `74810b5c` → `5678d385` / #189 | Concise roadmap preserved here; both selected recovery priorities are delivered and retired below. |
| [fk311](https://app.faktorial.ai/projects/alvalinus/tasks/fk311) | `c76514f` → `72b925f` / #190 | Complete selectable project draft on both Contact entry points. Retire the F3 manual-recovery gap. |
| [fk312](https://app.faktorial.ai/projects/alvalinus/tasks/fk312) | `1f848e5` → `eb72074` / #191 | Current selectable calculator email, including price-free individual quotes and edit invalidation. Retire the F6 manual-recovery gap; the accessibility follow-up below extends it. |
| [fk308](https://app.faktorial.ai/projects/alvalinus/tasks/fk308) | `c01b64a7` → `5d124f4` / #187 | Accessible driveway invalidity/recovery coverage for the current single-area calculator. Retire pending ownership; removed loads stay removed. |
| [fk309](https://app.faktorial.ai/projects/alvalinus/tasks/fk309) | `794e805` → `daeb7a7` / #188 | F4 bundled-static recovery and F5 selectable-draft catalog reconciliation, preserving newer F6 review. Retire pending catalog ownership. |

[fk320](https://app.faktorial.ai/projects/alvalinus/tasks/fk320) is also
closed/done. Its Build Update and Delivery Summary confirm no new source was
needed: existing `9f3a718`/`1e3beed` already invalidate staffing drafts on field
and momsstatus edits. Its recorded native quality passed at `daeb7a7`;
no matching immutable merge/publication receipt is available. Treat this as
revalidation of existing source, not another merge or evidence of deployment.

The preceding generations' reconciliation of fk290/fk291/fk292/fk296/fk298/
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
  print-document state. Project, staffing and calculator cases inspect selectable
  drafts and their invalidation. Mappings describe maintained source coverage,
  not execution in this run. Field-border checks tolerate equivalent CSS formatting; they check
  base borders, not rendered accessibility
  ([stylesheet rule](rules/stylesheet-behavior-guards.md)).
- F1–F6 retain stable feature/story IDs. Documentation distinguishes shared
  component evidence, page assertions and technical metadata checks. The
  delivered catalog now describes bundled-static recovery and manual drafts.
- [The runner](../scripts/make.js) and [README](../README.md) define Node 24+,
  locked dependencies, strict TypeScript, production build, static-asset
  validation and one Vitest session through native quality. The factory can
  reconcile interleaved deliveries and assign bounded, nonduplicate work.
- [Release provenance](release-runbook.md) composes clean source, rebuilt
  artifact checksums and retained passing test evidence. Failed or all-skipped
  reports are rejected. Publication stays a separate host fact.

## What works less well and what to improve

- Manual recovery now covers project, staffing and calculator inquiries, but
  visitors still copy/send in external software. The calculator draft's three
  labeled textareas have no accessible-description association with the
  adjacent copy/send guidance. Associate that existing help at the shared
  [QuoteDraftControls](../src/components/QuotePageShared.tsx) boundary; preserve
  names, selectable fields and the delivered freshness lifecycle. This is a
  source-backed refinement, not measured inquiry loss or screen-reader failure.
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
before creation on November 25 contains **29 records**, one page: fk322,
twenty-three delivery notices (fk275/fk277/fk279/fk283/fk284/fk285/fk287/fk289/
fk293/fk294/fk295/fk297/fk299/fk301/fk305/fk306/fk307/fk315/fk316/fk317/
fk318/fk319/fk321), incidents fk266/fk272/fk313 and question notices
fk273/fk314. No unresolved owner holds either new scope. Unresolved overlapping
work blocks duplicate creation; delivery notices do not reopen delivered source.

1. **Bind test evidence to source — [fk323](https://app.faktorial.ai/projects/alvalinus/tasks/fk323).**
   Capture the actual full checkout revision at test-evidence production and
   require release composition to match it against its clean checkout revision.
   Reject missing, malformed or different identities without a new provenance
   record. Preserve deterministic output, passing-count rejection and raw
   evidence digest. Fresh owning reads confirm fk165 closed/done (composition,
   merge `72af228`, PR #123) and fk291 closed/done (count rejection, merge
   `ba090da`, PR #180). This extends their explicitly excluded source-identity
   gap; neither scope is repeated. A source-stamped passing test report still
   does not establish full canonical-gate acceptance or publication.
2. **Describe calculator draft fields accessibly — [fk324](https://app.faktorial.ai/projects/alvalinus/tasks/fk324).**
   Associate the existing manual-copy/send help with each selectable recipient,
   subject and body using unique native description references. Preserve their
   labels, explicit preparation, current contents, invalidation, independent
   sharing and print exclusions. This extends fk312's delivered F6 recovery;
   it does not reopen F3 contact or F5 staffing work. Keep expected descriptions
   at the existing deterministic DOM boundary, without generated-ID snapshots,
   forced focus or claims of real screen-reader execution.

Both issues were created through the owning API at **2026-11-25 07:49:01 UTC**
and independently read back open with exact authored titles/bodies and labels:
`priority: medium`, with `size:medium` for fk323 and `size:small` for fk324.
Worker-local TypeScript LSP returned `state=ok` for composeReleaseProvenance
and QuoteDraftControls at `daeb7a7`; source reads confirm the writer, runner,
consumer and draft markup contracts. Complete bounded closed-task searches for
provenance/draft/print supplemented the current open inventory and owner reads;
they are not proof of all historical work. Each issue requires in-memory
behavior coverage and ordinary native quality. Implementation belongs to those
issues, not fk322; this documentation refresh adds no wording/shape tests.

Existing platform ownership remains separate: fresh owning reads confirm
[fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) open/waiting
on unsupported summary-engine configuration, and
[fk272](https://app.faktorial.ai/projects/alvalinus/tasks/fk272) open/waiting
on a human host-capacity decision carried by
[fk273](https://app.faktorial.ai/projects/alvalinus/tasks/fk273).
Fresh owning reads also retain
[fk313](https://app.faktorial.ai/projects/alvalinus/tasks/fk313) open/waiting
for canonical native append-contract source/routing, with question notice
[fk314](https://app.faktorial.ai/projects/alvalinus/tasks/fk314). Its copied
November 24 `discarded` response-decoding failures remain dated incident
evidence. Later fk311/fk309 delivery receipts do not establish that the generic
decoder incident was repaired; do not duplicate it or reset its hold here.
The other retained observations are November 18 configuration_error/not_started
and November 19 04:17 UTC C: 1.4 GB free of 161.08 GB (D: 74.17 GB free).
These are dated incident facts, not fresh probes. None blocks this roadmap
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
   actions. Preserve delivered manual recovery across project, staffing and
   calculator email journeys and refine accessible guidance at their owners.
   Define useful inquiry outcomes/privacy requirements before promising
   delivery or analytics.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when source/operation are available. Exact `../booking` and
   `../Asynkron.JsEngine` paths remain absent at this build read; findings about
   them remain unknown. The autonomous factory surrounds this static product.

## Evidence boundaries and update triggers

- Source reads: full fk310 roadmap; recent commit history through `daeb7a7`,
  including project/calculator draft deliveries and F4/F5 catalog reconciliation;
  Contact and shared quote draft source; updated F3/F6 and catalog documentation;
  existing calculator draft DOM cases; release composition, quality writer,
  runner and runbook. Successful live TypeScript symbol reads ground the two
  follow-ups. Exact sibling-path checks returned false for both repositories.
  Historical capabilities and the twelve-route inventory are retained.
  Owning records and the complete open inventory are point-in-time reads.
- Supplied Investigation evidence observed **2026-11-25 07:44:22 UTC** reports
  **20,245 durable API calls across 8 endpoints**, top five returned and three
  omitted. These are factory usage patterns, not website traffic. This build
  retains that bounded handoff rather than presenting it as a new probe.
- Independent capped reliability in that handoff has **330 selected**, **210
  matched**, **120 conflicting-route unmatched** spans; sampling is unknown and
  revision unavailable. Exact retained window and error counts were not supplied
  in the handoff. Do not divide by durable counts or infer full-window reliability.
- Serving-process DB telemetry from the same **07:44:22 UTC** handoff, since
  reset **2026-11-24T23:55:04.100748398Z**: cumulative **1,018,820 calls**,
  **943,665 queries**, **18 errors**, **711,047,011 received PostgreSQL protocol
  bytes**. Collector identity was not retained in this bounded handoff. Project
  attribution, other-client/cluster totals, billing and external OTLP receipt
  remain unavailable here.
  Do not compare across resets or combine API/DB populations. These show factory
  activity, not product demand or a demonstrated bottleneck. The website has no DB.
- The retained fk322 log summary records Investigation completing and Build
  starting; it supplies no deployment or website operation evidence. Website
  traffic/logs, inquiry delivery and live activation remain unavailable. No new
  privacy/compliance verdict follows from this update.
- No tests, typechecks, builds or quality commands ran in this agent session.
  No runtime or tests changed and no separate code-proof obligation is declared
  for fk322. No task-specific Runtime Notes section is present. Ordinary native
  quality/review assess the committed candidate; no passing result is claimed.
- Refresh when source, ownership, accepted evidence, publication facts or sibling
  availability changes. Re-read older Done owners before consuming scope; retain
  visible supersession/follow-up reasons. Historical reconciliation remains at
  `5678d385:docs/roadmap.md`, `9253c4f:docs/roadmap.md`, `542a088:docs/roadmap.md`,
  `a962378:docs/roadmap.md`, `4edaa98:docs/roadmap.md` and earlier pointers.
  Old observations are not fresh.
