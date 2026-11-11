# F6: Calculate a preliminary quote

Reviewed: 2026-11-11. Runtime: `ui`. Product role: `customer_outcome`.

Visitors with a husdränering or driveway project can self-serve a preliminary
cost picture before contacting the company. The calculators produce a
total-only estimate: unit prices, part amounts and margin reasoning stay out of
the page, the printout and the email draft. Nothing is sent, stored or priced
bindingly by the website.

## Entry points and current behavior

`/offertberakning/` opens the calculator choice ("Vad gäller din
offertförfrågan?") with two buttons: "Räkna på husdränering" leads to
`/draneringsberakning/` and "Räkna på uppfart" selects the driveway calculator
through the `#uppfart` hash. The hash is synced on `hashchange`, and "← Välj
annan kalkyl" returns to the choice view. `/draneringsberakning/` opens the
drainage length calculator directly.

The driveway calculator takes Uppfartens yta (m²) and Antal lass (st) with the
defaults 100 m² and 1 lass, an "Inkludera asfalt" checkbox that is checked by
default, and an optional project note. The drainage calculator takes
Dräneringens längd in löpmeter with the default 40 and supports decimals. Both
pages offer "Återställ exempel" to restore the example values.

Both calculators share the result aside "Din kostnadsbild": a
`aria-live="polite"` region announces "Beräknad totalsumma" with the Swedish
currency total and the standing label "Momsstatus ej bekräftad", followed by
the disclaimer that this is an estimate, not a binding quote, and that ROT
deduction and payment terms are specified in the real quote. While input is
valid, "Begär offert på underlaget" hands a `mailto:` draft to the configured
contact address with the measurements and the preliminary total,
"Skriv ut / spara som PDF" opens the browser print dialog, and the help line
states "Öppnar ditt e-postprogram. Inget skickas automatiskt." Both calculators
render inside the same shared quote shell from
[QuotePageShared](../../src/components/QuotePageShared.tsx), and every Swedish
label above is registry-declared: `siteContent.quote.shared` holds the shared
result-aside copy while `quote.uppfart` and `quote.drainage` hold each
calculator's fields, errors and email draft.

The totals are computed in [quote helpers](../../src/lib/quote.ts): the
drainage total prices the first 55 löpmeter at a higher tier, a lower tier
above 55 and a fixed establishment amount; the driveway total prices area, an
optional asphalt layer, a fixed preparation amount and each load. These
parameters are source constants, not maintainer-editable content. The email
bodies carry the entered measurements, the total and "Omfattning behöver
bekräftas", and never internal prices.

Visitors reach the calculators from the header's Kalkyler disclosure and the
footer ([F4](navigation-and-recovery.md) owns that chrome), from the drainage
service page's calculator link band ([F1](service-selection.md) owns that
band), from not-found shortcuts, and from the cross-links inside the
calculators themselves. Both quote pages render lazily inside the shared
landmarks; refresh returns the example values because no calculation state is
persisted or shareable.

## Outcome and support

Observable checks: a visitor picks husdränering or uppfart, enters
measurements and sees exactly one preliminary total; a valid calculation
exposes the email handoff with the total and a print/PDF path; invalid input
blocks the handoff with a Swedish message instead of a misleading result. The
website cannot confirm an email send, a real printout or a binding price.
[F4](navigation-and-recovery.md) supplies navigation to the calculators and
[F1](service-selection.md) links the drainage page to its calculator.

## Source, states and evidence

[Typed routes/content](../../src/data/siteContent.ts) declares both `quote`
routes, their summaries, hero photos and visual metadata, the registry
`quoteCalculator` band on the drainage service, and the Swedish calculator
copy itself in `quote.shared`, `quote.uppfart` and `quote.drainage`, including
both mail subjects and body templates.
[QuotePageShared](../../src/components/QuotePageShared.tsx) owns the shared
quote page shell, result aside, notes field and reset button that both
calculators render, [QuotePage](../../src/pages/QuotePage.tsx) owns the choice
view and driveway calculator,
[DrainageQuotePage](../../src/pages/DrainageQuotePage.tsx) owns
the drainage calculator, [quote helpers](../../src/lib/quote.ts) own the tier
totals and Swedish money/number formatting, [types](../../src/types/site.ts)
declare the route kinds, the `SiteQuote` copy contracts and the calculator
band contract, and [SiteHomePage](../../src/pages/SiteHomePage.tsx) lazily
routes the two quote paths and renders the calculator band. There is no
backend, storage, scheduled recalculation or price feed behind these pages.

The reviewed Vitest declarations in
[QuotePage.test.tsx](../../src/pages/QuotePage.test.tsx) and
[DrainageQuotePage.test.tsx](../../src/pages/DrainageQuotePage.test.tsx) check
the choice view, the recalculated totals, the decimal length handling, the
polite live region, the field descriptions, the invalid-input alerts and
disabled controls, the reset behavior, the total-only discipline in the page
and the email draft, and the cross-links. The story documents and the identity
manifest carry the exact names and their bounded scope. No declaration
exercises a real print dialog or an actual email program. The
[quote helpers](../../src/lib/quote.ts) also carry a dedicated money-logic
unit-test file, [quote.test.ts](../../src/lib/quote.test.ts), whose
declarations check the drainage tier totals at and beyond the 55-meter
boundary, the driveway area, asphalt and load pricing, the sv-SE money and
number formatting, the VAT-status label constant and the mailto template
filling and encoding; the page declarations above cover the rendered behavior
around them. The 2026-11-11 review maps those helper declarations as
technical evidence into F6-US2 (tier totals, sv-SE formatting and the
VAT-status constant) and F6-US5 (template filling and mailto encoding) in
the story documents and the identity manifest. The same review maps the
stylesheet declaration in
[styles.field-border-contrast.test.ts](../../src/styles.field-border-contrast.test.ts),
which pins the quote field boundaries at WCAG AA non-text contrast on white,
to F6-US2.

An invalid measurement keeps the previous total out of view and disables the
email and print controls until corrected; "Återställ exempel" restores the
example values and clears the note. A failed hero photo hides its image while
the text stays on the dark background, like other subpage heroes.

## What Works Less Well

The standing "Momsstatus ej bekräftad" label means visitors cannot tell
whether the preliminary total includes VAT, which weakens the number as a
budgeting input. The calculation parameters are fixed source constants, so a
price change is a code change rather than a content edit. Refreshing or
leaving the page loses the entered measurements and the total; there is no
save or share-a-calculation link. The drainage calculator prices length only,
so depth, soil and access variations stay invisible to the visitor even though
the disclaimer says scope is assessed later.

## Roadmap

- Fix: confirm the VAT treatment of the preliminary totals and state it in
  the calculator instead of the standing unconfirmed label.
- Fix: move the tier prices and fixed amounts behind maintainer-editable
  content so price updates no longer require source changes.
- Expand: let visitors save or share a calculation (for example a link that
  carries the measurements) so the estimate survives a page reload.
- Expand: add further calculator choices for new offered project types when
  the company defines them.
