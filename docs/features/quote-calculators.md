# F6: Calculate a preliminary quote

Reviewed: 2026-11-23. Runtime: `ui`. Product role: `customer_outcome`.

Visitors choose a driveway or husdränering calculator and get a total-only
preliminary estimate for positive finite measurements up to and including 100.
Above 100 m² or 100 löpmeter, they contact the company for an individual
quote instead. Nothing is sent, stored or priced bindingly by the website.

## Entry points and current behavior

`/offertberakning/` starts with the calculator choice. The driveway link
selects `#uppfart`; the drainage link opens `/draneringsberakning/`.
Hash changes synchronize the choice and move focus to the revealed heading.
The back link returns to the choice. Shared navigation and page-specific
responsive hero assets remain owned by the typed route registry.

The driveway inputs are Uppfartens yta, Inkludera asfalt, and an optional
project note. Defaults are 100 m², asphalt included, and no note.
There is no load quantity, load validation, hidden load charge or load entry
in the email. Pricing remains 950 kr/m², optional asphalt 667 kr/m²,
and fixed cost 4900 kr, all inclusive of 25% VAT: 100 m² totals 166600 kr with asphalt or 99900 kr
without it.

Drainage starts at 40 löpmeter and accepts decimals. Its unchanged pricing
uses 3500 kr/m for the first 55 meters, 3000 kr/m above 55, and fixed cost
6900 kr. Exactly 100 still receives an estimate (334400 kr).

For estimates, Din kostnadsbild shows only Beräknad totalsumma, the
Swedish currency total, Inkl. moms / Exkl. moms and the non-binding
disclaimer. Unit prices and part amounts are absent from the customer page,
email and printout. Begär offert på underlaget opens a draft to
linus.svardd@outlook.com with measurements, options, total and notes.
Skriv ut / spara som PDF invokes the browser's own `window.print()`.

## VAT choice

Both calculators use the same native fieldset with mutually exclusive
Inkl. moms / Exkl. moms radio choices. Inclusive is selected by default.
The original inclusive pricing is unchanged; exclusive = inclusive total / 1.25.
Each render derives the selected amount from the original unrounded total,
then formats for display. It never converts a previous displayed result.

The selected label accompanies the result, email draft and the document sent
to the browser print handoff. Reset returns to inclusive. For example, driveway
100 m² with asphalt is 166600/133280 kr inclusive/exclusive; drainage
40 m is 146900/117520 kr. Above 100, either selection keeps the result and
contact email free of any estimated price.

[QuoteVat.test.tsx](../../src/pages/QuoteVat.test.tsx) owns in-memory keyboard
arrow selection, mutual exclusion, independent example amounts, fractional
repeated-toggle precision, reset, result/email/print-handoff labels,
price-free contact in both modes and exclusive-share restoration.
The browser print dialog and rendered paper are outside this proof.

## Individual quotes and validation

Above 100, the existing polite atomic live region replaces the entire
estimate with Kontakta oss för en individuell offert and the page-specific
explanation that the scope needs individual assessment. This is valid scope,
not a validation error. A native keyboard-accessible mailto link to
linus.svardd@outlook.com carries the entered scope, asphalt choice where
applicable, and notes, with no preliminary total or VAT estimate.
No total is calculated in this state, including for very large finite
measurements. The print action is disabled; using browser printing directly
also cannot expose a removed previous total. Lowering the measurement to at
most 100 restores the normal estimate and controls.

Empty, non-numeric, non-finite and non-positive measurements instead show the
Swedish alert and aria-invalid input, remove the total and disable send,
print and share actions. Reset restores each page's defaults and clears notes.

## Selectable email recovery

On either calculator, Visa e-postutkast explicitly reveals native read-only,
selectable Mottagare, Ämne and Meddelande fields. The complete decoded body
comes from the same composed mailto URL as the existing email action, preserving
Swedish characters, literal special characters and multiline project notes.
No mail handler or clipboard permission is needed to prepare and manually copy
the fields into webmail. Preparing does not open mail, copy content or publish
a share URL. Nothing is sent automatically or saved as a persistent draft.

Each prepared field keeps its visible label as its accessible name and exposes
the existing Swedish manual-copy/send help as its accessible description.
The help reference belongs to that draft instance, including after fresh
preparation following an edit. This native HTML/ARIA relationship is covered
in memory; actual screen-reader behavior and compliance are not established.

Estimates retain measurements, asphalt where applicable, selected VAT label and
current total. Above 100 the draft contains only scope and notes, without an
estimated price or VAT estimate. Invalid measurements disable preparation and
leave no usable draft. Every measurement, asphalt, note or VAT edit, changed-value
reset and invalidation discards the prepared fields, including VAT changes above
100 that do not change the scope-only body. Returning to prior values requires
fresh explicit preparation. Sharing retains its independent clipboard lifecycle.
Draft fields and their preparation control are hidden from browser print output.

[QuoteDraft.test.tsx](../../src/pages/QuoteDraft.test.tsx) maps independent full
recipient, subject and body expectations, inclusive/exclusive examples, literal
multiline notes, actual edit/reset/invalidation wiring and scope-only recovery
on both calculators. Every preparation checks all three accessible descriptions;
`associates each calculator draft with its own copy guidance` checks that two
rendered drafts reference their own help. These in-memory declarations are not
execution receipts.

## Share and static architecture

Before either calculator's explicit share action, Swedish help explains that
the link includes measurements, options, VAT mode and any project notes, and
that anyone receiving it can read its contents. The help remains visible with
notes entered. QuoteResultAside.test.tsx owns this pre-action disclosure check;
existing page and URL declarations retain note restoration and edit coverage.

Skapa delbar länk writes `yta`, `asfalt` and optional `anteckning`
for driveway, preserving `#uppfart`, or `langd` and optional `anteckning`
for drainage. Exclusive VAT adds `moms=exkl`; absent or unknown VAT values
default to inclusive, keeping old links compatible. Old `lass` parameters are ignored and never generated.
A share restores the inputs on load and recomputes the estimate or the
individual-contact state. Invalid shared values use normal validation.
Changing measurements, notes or VAT mode, resetting values or making inputs invalid discards the old displayed share link and status. Editing alone does not publish another URL or write to the clipboard; valid inputs require a fresh explicit share action.

An obsolete clipboard resolution or rejection cannot restore discarded feedback, even after returning to the original inputs. Only the latest explicit sharing attempt can announce its result.

A successful clipboard write announces in `role="status"`: Länken har kopierats till urklipp. Rejection or an unavailable clipboard announces: Kopieringen misslyckades. Markera och kopiera länken ovan manuellt. The fallback leaves the current attempt's link available for manual copying.
Nothing persists beyond the URL.

[QuotePage](../../src/pages/QuotePage.tsx) and
[DrainageQuotePage](../../src/pages/DrainageQuotePage.tsx) own input state.
[QuotePageShared](../../src/components/QuotePageShared.tsx) owns the shell,
live result, contact action, print, share, notes and reset controls.
[Typed content](../../src/data/siteContent.ts) and
[types](../../src/types/site.ts) hold Swedish copy, mail templates and prices.
[Quote helpers](../../src/lib/quote.ts) calculate totals and format values;
[share helpers](../../src/lib/quote-share.ts) encode and decode URLs.
[QuotePage.css](../../src/pages/QuotePage.css) preserves responsive layout and
the `@media print` rules hiding decoration, chrome, action controls and drafts.
There is no backend, database, authentication, price feed or serverless runtime.

## Source and evidence

The story records F6-US1 through F6-US5 and
[user-story manifest](user-stories/features.json) map source declarations,
not execution receipts. Existing QuotePage and DrainageQuotePage DOM tests
cover choice/focus, independent totals, email recipient/body, invalid inputs,
reset, share and hero assets. The driveway restore case includes an inert
legacy `lass=invalid` parameter.

[QuoteLimits.test.tsx](../../src/pages/QuoteLimits.test.tsx) covers both
calculators at 99.9, exactly 100 and 100.1, transition back below the limit,
scope-only email, keyboard focus, the live announcement, print disabled,
very large finite share input and invalid non-finite/non-numeric shares.
[quote.test.ts](../../src/lib/quote.test.ts) retains formatting, template,
drainage-tier and injected driveway-price contracts.
[quote-share.test.ts](../../src/lib/quote-share.test.ts) covers remaining URL
parameters and special-character note round-trips.
[QuoteResultAside.test.tsx](../../src/components/QuoteResultAside.test.tsx)
owns the F6-US4 shared-control lifecycle declarations mapped in the story:
confirmation, rejection/unavailable fallback, input-change invalidation, obsolete
completion after returning to original inputs and overlapping attempts in both
completion orders, including an obsolete result while the latest attempt is pending.
These in-memory shared-component declarations use mocked clipboard APIs, controlled promises and rerendered props. They cover shared-control feedback ownership, not page edit-event wiring, full browser/device/clipboard-service execution or actual screen-reader announcements. Source mappings are not execution receipts.

The fk292 page share declarations in QuotePage.test.tsx and
DrainageQuotePage.test.tsx separately exercise actual measurement, note and VAT
edits, driveway asphalt, changed-value reset and invalid-input recovery. With
resolved/unavailable clipboard fixtures, each edit discards existing feedback
without publishing; explicit resharing uses independently expected current URL
fields and clipboard payloads. The F6-US4 mappings name these declarations;
shared races remain solely with QuoteResultAside.test.tsx.

Existing field-border, focus-zoom, accent-contrast and quote-print stylesheet
tests retain their bounded source-level coverage. A real mail client,
screen-reader announcement, print dialog and rendered paper output are not
exercised by these declarations. Canonical native quality owns execution.

## What Works Less Well

A calculation persists only through its share URL. Soil, depth and access
still require assessment by the company. The site cannot confirm email
delivery, a real printout or a binding price. After editing, visitors must
explicitly create a new share link; clipboard restrictions can require manual copying.
Manual webmail recovery requires copying three fields and sending in another tool;
editing the calculator discards its prepared draft and cannot retract an external draft.

## Roadmap

- Add calculator choices when the company defines further project types.
