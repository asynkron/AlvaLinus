# Product and operation roadmap

Reviewed: 2026-11-19 (fk280). Source baseline:
`94f45aa5535e071494401fc2e71ae39fb0d79771`, the prepared task HEAD
and fk278's merge. The checkout is clean at that baseline before editing.
Investigation saw an older checkout; build preparation supplied the six newer
merges listed below. This is a source baseline, not an observed deployment.

This refresh supersedes fk265's November 18 assessment (PR #169,
`4edaa98`), whose roadmap was read in full from this checkout before editing.
It preserves that generation's ownership reconciliation while compressing its
historical receipt catalog to Git-history pointers. The earlier fk251
generation must not replace fk265's newer assessment.
Source capability, task closure, accepted quality and observed production
operation are separate evidence. Goals do not authorize a backend or telemetry.

## Where we are

AlvaLinus is the static Swedish Svärd Entreprenad React/TypeScript/Vite site.
Its twelve routes are `/`, `/offertberakning/`,
`/draneringsberakning/`, `/tjanster/`, `/inhyrning/`, `/om-oss/`,
`/stensattning/`, `/markarbete/`, `/gravjobb/`, `/dranering/`,
`/tradgardsplanering/` and `/kontakt/`.
[Typed content](../src/data/siteContent.ts), [types](../src/types/site.ts)
and [the renderer](../src/pages/SiteHomePage.tsx) own the page inventory,
Swedish text, shared navigation and page-specific assets. There is no
application backend, database, authentication or serverless runtime
([ADR 0001](adrs/0001-static-react-frontend-foundation.md)).

The current product lets visitors choose services, assess the company, prepare
a project or staffing inquiry, and calculate and share preliminary driveway
and drainage estimates. Contact and inquiry actions prepare drafts in the
visitor's own email program; they do not establish submission or delivery.
Current contact details are `linus.svardd@outlook.com` and
`070-214 67 83` (`tel:+46702146783`), including the shared footer.

The calculator behavior now differs materially from the previous roadmap:

- Driveway pricing uses area, optional asphalt and the fixed cost. Loads are
  absent from fields, validation, prices, email and generated share URLs;
  legacy `lass` parameters are ignored.
- Both calculators default to **Inkl. moms** and offer native, mutually
  exclusive **Inkl. moms / Exkl. moms** radio choices. Exclusive amounts derive
  from the original inclusive total / 1.25, with display rounding only.
  Reset returns to inclusive; the chosen label accompanies the result, email
  and print handoff. The former “Momsstatus ej bekräftad” work is delivered.
- Estimates apply to positive finite measurements up to and including
  100 m² or 100 löpmeter. Above 100 the result becomes **Kontakta oss för en
  individuell offert**, with a scope-and-notes email and no stale price.
  Print is disabled there; sharing restores that state. Invalid input remains
  a separate alert state.
- Explicit sharing carries measurements, asphalt where applicable, optional
  `anteckning`, and `moms=exkl` for exclusive VAT. Old links default to
  inclusive. Editing measurements/notes, resetting to different values or
  invalidating input discards the old link and feedback. Delayed clipboard
  success/failure cannot revive them, even after returning to the original
  inputs; overlapping attempts allow only the newest feedback.
  Edits alone never publish a URL or copy to the clipboard.

See [quote-calculators.md](features/quote-calculators.md) and the shared
[QuotePageShared.tsx](../src/components/QuotePageShared.tsx) owner.
The product implementation is delivered; the feedback catalog mapping is the
bounded documentation follow-up below.

## Recent deliveries and ownership reconciliation

Owning `get_task` reads on November 19 at approximately 22:13–22:14 UTC
confirm each row below closed/done, with the listed merge receipt and a
passed native `run-quality` at its reviewed head. These historical passes
do not accept fk280 or demonstrate production operation.

| Task | Reviewed head → merge / PR | Delivered outcome and disposition |
| --- | --- | --- |
| [fk267](https://app.faktorial.ai/projects/alvalinus/tasks/fk267) | `6e540a1` → `bbcf6fe` / #167 | Home Inventory route chips use inline-flex alignment and py-2 padding, with compiled-height coverage for ≥36px targets. fk265's first linked issue is delivered; no remaining chip-size issue. |
| [fk268](https://app.faktorial.ai/projects/alvalinus/tasks/fk268) | `f0e96be` → `bc77093` / #168 | F6-US4 maps the shared print control and stylesheet with bounded technical evidence. fk265's second linked issue is delivered; no remaining print-mapping gap. A real print dialog/output remains unexercised. |
| [fk265](https://app.faktorial.ai/projects/alvalinus/tasks/fk265) | `76af163` → `4edaa98` / #169 | Newer roadmap generation, based on `99a6a23`, linked fk267/fk268. Superseded assessment, preserved as the starting document and historical ownership source. |
| [fk274](https://app.faktorial.ai/projects/alvalinus/tasks/fk274) | `2a32332` → `a46d676` / #170 | Approved contact updates, removal of driveway loads, over-100 individual quotes and calculator VAT choices. Supersedes the old unconfirmed-VAT and load-based descriptions. Its earlier review bounce is resolved by this final reviewed head. |
| [fk276](https://app.faktorial.ai/projects/alvalinus/tasks/fk276) | `2c86d78` → `6e12cd0` / #171 | Sharing feedback belongs to current inputs and the latest attempt, protected by deterministic rendered component cases. No runtime reimplementation is needed; only F6 mapping remains below. |
| [fk278](https://app.faktorial.ai/projects/alvalinus/tasks/fk278) | `e6bb826` → `94f45aa` / #172 | F5 and F5-US1/US2 reconcile optional staffing-rate momsstatus and stated/omitted email variants, with three existing declarations mapped. This was a bounded F5 review, not an F6 feedback reconciliation. |

The first two rows landed before fk265 itself. The six-merge delta from
`99a6a23` is therefore fk267 → fk268 → fk265 → fk274 → fk276 → fk278.
There is no reason to recreate fk265's two follow-ups from stale Done text.

The preceding generation's deliveries were also re-read before carrying their
resolved scope forward:

| Task | Current owning state and receipt | Disposition |
| --- | --- | --- |
| [fk253](https://app.faktorial.ai/projects/alvalinus/tasks/fk253) | Closed/done; head `54ead38b`, merge `de05fa5`, PR #162; quality passed. | Notes carry through share links is delivered. |
| [fk251](https://app.faktorial.ai/projects/alvalinus/tasks/fk251) | Closed/done; head `2efd6a5`, merge `86fa8e5`, PR #163; quality passed. | Historical roadmap; its two linked tasks fk252/fk253 delivered. |
| [fk252](https://app.faktorial.ai/projects/alvalinus/tasks/fk252) | Closed/done; head `381df35`, merge `6ba9e1c`, PR #164; quality passed. | Three-hero recompression plus related budget prose landed. No repeat recompression task. |
| [fk257](https://app.faktorial.ai/projects/alvalinus/tasks/fk257) | Closed/done; head `5b2607c`, merge `0a5964d`, PR #165; quality passed. | Footer navigation/email targets delivered; fk267 subsequently consumed the chip remainder. |
| [fk259](https://app.faktorial.ai/projects/alvalinus/tasks/fk259) | Closed/done; head `1c8dcdc`, merge `99a6a23`, PR #166; quality passed. | Notes/footer catalog reconciliation delivered; print remainder subsequently consumed by fk268. |

[fk220](https://app.faktorial.ai/projects/alvalinus/tasks/fk220) remains
effectively closed without a merge receipt, despite its retained historical
build/human-wait projection. Its clarification
[fk224](https://app.faktorial.ai/projects/alvalinus/tasks/fk224) is also closed.
The chosen answer is not established by these reads. The undelivered binary
scope was explicitly re-owned and delivered by fk252, so neither record is
reopened. Whether the platform review gate now understands binary-only changes
remains unknown; fk265's delivery summary retains that platform follow-up.
Do not turn that unknown into another site recompression task.

Older deliveries and supersession reasons remain at `4edaa98:docs/roadmap.md`;
they are historical provenance, not newly read owning records. Before acting
on any older Done row or queued prompt, refresh its owner and current task
membership. This refresh neither reopens nor creates work from those rows.

## What works well

- The typed registry centralizes route copy, navigation, service guidance,
  hero declarations, calculator prices, mail templates and Swedish feedback.
  Shared quote structure keeps calculations page-specific while sharing
  presentation, notes, reset, VAT, print and sharing controls.
- The static artifact gate checks route documents, page-specific assets,
  responsive hero preload candidates, social images and font preloads.
  The earlier hero-size reductions remain delivered; source asset existence
  and build checks do not prove browser timing or hosting behavior.
- Existing in-memory owner-boundary coverage protects money logic, URL
  encoding/restoration, validation, VAT selection and limits, keyboard flow,
  sharing lifecycle and print-handoff document state. Stylesheet checks have
  narrower contrast/layout contracts; they do not prove real-device behavior.
- F1–F6 retain stable catalog/story identities. Recent reconciliations document
  actual source and distinguish direct behavior evidence from technical checks.
  fk278's F5 review preserves the external-email limitation.
- [The runner](../scripts/make.js) and [README](../README.md) define Node 24+,
  locked dependencies, strict TypeScript, a production build, static route
  validation and one Vitest session through native quality.
  [Release provenance](release-runbook.md) joins accepted source, artifact
  checksum identity and retained quality identity; publication remains a
  separate host fact.
- The factory can reconcile interleaved deliveries and create bounded work
  without duplicating completed issues. This refresh uses prepared source and
  owning receipts, rather than the stale investigation checkout.

## What works less well and what to improve

- The field-border contrast guard still requires exact minified selectors and
  `border:1px solid #...` bytes. CSS whitespace changes can fail a correct
  accessible design. Preserve the ≥3:1 contract while removing formatting
  dependence; fk171's delivered fix remains intact.
- The F6 prose currently says the clipboard has a copyable-link fallback but
  does not describe fk276's current-input/obsolete-completion guarantees.
  F6-US4 and the structured story map omit its QuoteResultAside lifecycle
  declarations. Maintainers should find the delivered behavior at that owner.
- Drainage still uses a length-only estimate: soil, depth and access need
  company assessment. Prices/formulas remain inspectable in the static client.
  A chosen VAT mode is implemented, but estimates are still non-binding.
- Editorial photography remains separate work in [image requests](image-requests.md):
  a real Trädgårdsplanering image, About/Contact photos and optional staffing
  imagery require selection/approval. Existing placeholders and resilient
  image fallbacks do not establish approved editorial completion.
- Production host, access, retention, rollback and unknown-path serving are
  unobserved. Inquiry delivery, visitor demand and satisfaction are unmeasured.
  Any telemetry or submission-service proposal needs explicit product/privacy
  decisions before changing the static boundary.
- Older dependency-major deferrals, F2 review prompts and optional device/font
  observations remain historical pointers in fk265's roadmap. They were not
  reassessed here and are not new tasks. Refresh those owners before acting.

## Short-term priorities and issue ownership

Exactly two follow-up issues are selected for this refresh. The complete
open-task inventory just before creation contained seven records: fk280,
delivery notices fk275/fk277/fk279, incident fk266, incident fk272 and its
question notice fk273. No open implementation task overlaps either item.

1. **Format-tolerant field-border contrast proof — [fk281](https://app.faktorial.ai/projects/alvalinus/tasks/fk281).**
   Harden [styles.field-border-contrast.test.ts](../src/styles.field-border-contrast.test.ts)
   using the installed CSS tooling before adding dependencies. Retain coverage
   of quote number-input wrappers, quote select/textarea and inquiry
   input/textarea boundaries at ≥3:1 on white, fail for missing/low-contrast
   boundaries, and accept equivalent whitespace/selector formatting.
   This consumes fk171's still-open follow-up prompt, not its delivered color
   repair (PR #125, `ea2d472`, owner re-read closed/done on November 19).
   Use meaningful deterministic in-memory cases and ordinary native quality.
2. **Map delivered quote-sharing feedback under F6 — [fk282](https://app.faktorial.ai/projects/alvalinus/tasks/fk282).**
   Reconcile F6 capability/story prose and structured evidence with fk276's
   current-input, obsolete-completion and latest-attempt guarantees.
   Map the existing
   [QuoteResultAside.test.tsx](../src/components/QuoteResultAside.test.tsx)
   declarations with their actual parameterized scope. Retain existing URL,
   VAT, individual-quote and print mappings; preserve all feature/story IDs and
   the empty backend entry-point map. No new runtime behavior or duplicate
   tests are needed. Request native manifest proof and ordinary quality.

Both were created through the owning API and independently read back open on
November 19: fk281 created at 22:17:06.979 UTC and fk282 at 22:17:23.721 UTC,
with labels `priority: medium` and `size:medium`. The read-back bodies match
the authored outcome, constraints and verification requirements.
The two issues own their respective scope. Do not
implement them inside fk280 or let a recurring automation duplicate them.

Existing platform ownership stays separate:

- [fk266](https://app.faktorial.ai/projects/alvalinus/tasks/fk266) remains open,
  waiting on unsupported summary-engine configuration. Its retained minimal
  probe failed with configuration_error/not_started on November 18; this read
  confirms the persisted wait, not a fresh capability probe.
- [fk272](https://app.faktorial.ai/projects/alvalinus/tasks/fk272) remains open
  on a human decision about worker host C: capacity; question
  [fk273](https://app.faktorial.ai/projects/alvalinus/tasks/fk273) carries it.
  Its last retained re-probe was 1.4 GB free of 161.08 GB at November 19
  04:17 UTC, with repository drive D: at 74.17 GB free. These are dated
  incident facts, not current host measurements.
- Neither incident blocks roadmap source work or authorizes host cleanup or
  worker configuration changes here. Their existing owners remain responsible.

## Long-term goals

1. **Trustworthy autonomous development.** Reconcile current source and owning
   task state, select useful nonduplicate work, implement at the smallest owner
   boundary, then let native quality and review assess the committed candidate.
   Keep closure, merged delivery and live operation distinct. Prefer a short
   current roadmap plus durable history pointers over repeating old receipts.
2. **Repeatable product operation.** Connect release provenance to actual
   hosting, publication identity, retained artifacts and a demonstrated restore
   path once the operator supplies those facts and access decisions. Do not
   install speculative infrastructure into this static site.
3. **Resilient customer journeys.** Preserve accessible navigation, Swedish
   content, clear preliminary-price limits, correct VAT labels and feedback
   belonging to the visitor's current action. Define useful inquiry outcomes
   and privacy requirements before promising delivery or analytics.
4. **Evidence-led cross-product learning.** Compare booking and Asynkron.JsEngine
   only when their source and operation are available. The exact sibling paths
   `../booking` and `../Asynkron.JsEngine` are absent at this build read.
   Cross-product findings therefore remain unknown. The autonomous factory
   operates around this product; it is not a backend to add to it.

## Evidence boundaries and update triggers

- Source reads: fk265's roadmap in full; the `99a6a23..94f45aa` Git delta;
  current quote helpers/share controls, component and contrast test declarations;
  F6/F6-US4 and structured story mapping; F5 catalog index; repository rules.
  Owning API reads confirm the delivery/state rows above and fk171's follow-up.
  Inventory and issue read-backs are bounded point-in-time observations.
- Faktorial API usage, observed 2026-11-19T22:14:20.725975802Z: one-day durable
  total **164,516** across **21 endpoints**, none omitted at limit 30.
  Task-record reads dominate (**141,151**), followed by canvas context checks
  (**22,540**). This is factory API use, not website traffic.
- Independent reliability evidence selected **335** retained spans, matched
  **281**, with **54** conflicting-route unmatched spans. The matched
  population reports zero errors, but coverage is partial: volatile in-memory
  retention covers only **22:11:07.122–22:14:20.484 UTC**, TTL 3,600 seconds,
  truncated by the store cap; sampling is unknown and service revisions are
  unavailable. Do not divide these observations by durable counts or infer
  production reliability, absence of demand or a comparable baseline.
- Serving-process database telemetry, observed
  **2026-11-19T22:14:20.882422536Z**, collector
  `serving-process:7:2026-11-19T19:27:17.780230034Z:database-otel-sdk:2026-11-19T19:27:17.799833588Z`,
  reset **2026-11-19T19:27:17.799833588Z**: cumulative **540,057 calls**,
  **452,373 queries**, **19 errors**, **582,056,664 received PostgreSQL
  protocol bytes**. SDK fields are supported; project-exclusive totals,
  other clients/cluster totals, billing bytes and external OTLP receipt are
  unavailable. Bytes exclude TLS overhead. Counters cannot be compared across
  resets or combined with API populations. The static website has no database.
- Website logs/traffic, inquiry delivery, deployment and live activation are
  unavailable. No new privacy/compliance verdict or external delivery claim
  follows from this documentation update.
- No tests, typechecks, builds or canonical quality commands ran in this agent
  session. Existing tests were inspected as source; none were changed or
  duplicated. No separate code-proof obligation is declared for fk280.
  Native ordinary quality and review assess the committed roadmap candidate.
- Historical provenance: fk265's full receipt reconciliation is preserved at
  `4edaa98:docs/roadmap.md` (PR #169); fk251 at `86fa8e5` (PR #163);
  fk241 at `e3f084a` (PR #157); fk231 at `5e90bfe` (PR #152);
  fk219 at `778998e` (PR #147). Earlier refreshes and their ownership chain
  remain reachable through those documents and `git log -p -- docs/roadmap.md`.
  These pointers retain historical supersession reasons without representing
  old task/API/device reads as fresh.
- Refresh when source, task scope/state, quality, publication facts or adjacent
  repository availability changes. Re-read owning records before consuming
  Done scope, and preserve explicit supersession/follow-up reasons.

