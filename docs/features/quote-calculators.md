# F6: Calculate a preliminary quote

Reviewed: 2026-11-18. Runtime: `ui`. Product role: `customer_outcome`.

Visitors with a husdränering or driveway project can self-serve a preliminary
cost picture before contacting the company. The calculators produce a
total-only estimate: unit prices, part amounts and margin reasoning stay out of
the page, the printout and the email draft. Nothing is sent, stored or priced
bindingly by the website.

## Entry points and current behavior

`/offertberakning/` opens the calculator choice ("Vad gäller din
offertförfrågan?") with two buttons: "Räkna på husdränering" leads to
`/draneringsberakning/` and "Räkna på uppfart" selects the driveway calculator
through the `#uppfart` hash. The hash is synced on `hashchange`, and every
switch moves keyboard focus to the revealed view's heading — the `tabIndex=-1`
`quote-choice-heading` or `quote-work-heading` heading — while "← Välj annan
kalkyl" returns to the choice view. `/draneringsberakning/` opens the
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
optional asphalt layer, a fixed preparation amount and each load. The parameters themselves are registry-declared content under `content.quote`
since the `fk232` change (PR #153, `326125a`):
`quote.uppfart.pricing` in [typed content](../../src/data/siteContent.ts)
declares perSquareMeter 950, asphaltPerSquareMeter 667, fixedCost 4900 and
perLoad 2000, and `quote.drainage.pricing` declares boundaryMeters 55,
firstTierPerMeter 3500, aboveBoundaryPerMeter 3000 and fixedCost 6900, so a
price change is a registry-content edit rather than a code change; the helpers
compute their totals from those typed
`SiteQuoteUppfartPricing`/`SiteQuoteDrainagePricing` objects without numeric
price literals of their own, and
[quote.test.ts](../../src/lib/quote.test.ts) derives its pinned totals from the
same declarations. The email
bodies carry the entered measurements, the total and "Omfattning behöver
bekräftas", and never internal prices.

While the input is valid, "Skapa delbar länk" writes the measurements into the
page URL — yta, lass and the asphalt choice on `/offertberakning/`, where the
`#uppfart` hash is kept so the recipient lands on the driveway view with the
total visible, and längd on `/draneringsberakning/` — together with the
optional project note whenever one is written, and renders the same
absolute URL as a copyable link below the control, copying it through the
browser clipboard when that API is available and staying usable as a plain
link when it is not. Opening a quote URL that carries those parameters
restores the inputs and the note once on load and recomputes the identical
total; missing
parameters fall back to the example defaults, invalid values go through the
existing invalid-input alert, and the share control is disabled alongside the
email and print controls while the input is invalid. The share URL parameters
(`yta`, `lass`, `asfalt`, `langd`, `anteckning`) are fixed source constants in
[quote-share helpers](../../src/lib/quote-share.ts), and the share copy is
registry-declared in `siteContent.quote.shared`.

Visitors reach the calculators from the header's Kalkyler disclosure and the
footer ([F4](navigation-and-recovery.md) owns that chrome), from the drainage
service page's calculator link band ([F1](service-selection.md) owns that
band), from not-found shortcuts, and from the cross-links inside the
calculators themselves. Both quote pages render lazily inside the shared
landmarks; a calculation survives a reload or being sent onward only through
the share link, while a URL without encoded inputs still returns the example
values because nothing is persisted beyond that link.

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
routes, their summaries, registry-owned responsive hero photo variants and
visual metadata: `/offertberakning/` pairs quote-hero-640.webp 640w and
quote-hero-960.webp 960w with its quote-hero.webp 1672w base, and
`/draneringsberakning/` pairs dranering-photo-400.webp 400w and
dranering-photo-640.webp 640w with its draneringsberakning-hero.webp 900w base,
each route declaring `heroPhotoSrcSet` and `heroPhotoSizes` (`"100vw"`). The
same registry holds the `quoteCalculator` band on the drainage service and the
Swedish calculator copy itself in `quote.shared`, `quote.uppfart` and
`quote.drainage`, including both mail subjects and body templates.
[QuotePageShared](../../src/components/QuotePageShared.tsx) owns the shared
quote page shell — including the hero img that renders each route's declared
`heroPhotoSrcSet` and `heroPhotoSizes` — result aside, notes field and reset
button that both calculators render, [QuotePage](../../src/pages/QuotePage.tsx) owns the choice
view and driveway calculator,
[DrainageQuotePage](../../src/pages/DrainageQuotePage.tsx) owns
the drainage calculator, [quote helpers](../../src/lib/quote.ts) own the tier
totals and Swedish money/number formatting,
[quote-share helpers](../../src/lib/quote-share.ts) own the share URL
parameter names, search encoding, tolerant decoding and absolute href
building, [types](../../src/types/site.ts)
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
declarations check the drainage tier totals at and beyond the registry-declared
boundary, the driveway area, asphalt and load pricing — each deriving its
pinned totals from the declared `quote.uppfart.pricing` and
`quote.drainage.pricing` objects instead of hardcoded amounts, the bound the
`fk232` registry move introduced — the sv-SE money and
number formatting, the VAT-status label constant and the mailto template
filling and encoding; the page declarations above cover the rendered behavior
around them. The 2026-11-11 review maps those helper declarations as
technical evidence into F6-US2 (tier totals, sv-SE formatting and the
VAT-status constant) and F6-US5 (template filling and mailto encoding) in
the story documents and the identity manifest. The same review maps the
stylesheet declaration in
[styles.field-border-contrast.test.ts](../../src/styles.field-border-contrast.test.ts),
which pins the quote field boundaries at WCAG AA non-text contrast on white,
to F6-US2. The 2026-11-11 `fk189` accent change then mapped the page-level
stylesheet declaration in
[styles.page-accent-contrast.test.ts](../../src/styles.page-accent-contrast.test.ts),
which pins the white Begär offert label on its token-based send-button surface
at WCAG AA, into F6-US5. The 2026-11-12 `fk199` repair then pinned the shared
quote stylesheet's text-entry controls at the iOS Safari focus-zoom floor: the
quantity-input rule keeps its explicit 18px font size and the `.quote-field`
select/textarea rule gained an explicit 16px, and the declaration
`keeps quote form text-entry controls at a font size of at least 16px` in
[styles.quote-focus-zoom.test.ts](../../src/styles.quote-focus-zoom.test.ts)
maps into F6-US2 as technical evidence. It reads the stylesheet source only
and does not render the calculators or execute iOS zoom behavior. The
2026-11-13 `fk208` change (PR #142, `2dddae4`) then tokenized the quote and
inquiry focus-visible outlines and the quote text-selection accents while
keeping the existing send-CTA declaration byte-identical, and this 2026-11-14
review maps its three new declarations in
[styles.page-accent-contrast.test.ts](../../src/styles.page-accent-contrast.test.ts)
into F6-US5 as technical evidence: the 3px solid token focus-visible outline
with a 3px offset across the `.quote-layout` input, select, textarea, button,
a and summary rules, the AA-readable declared `::selection` token pairing, and
the selection background's orange brand hue. The inquiry-side focus-visible
rules of that same declaration map under F5-US2 in
[staffing-inquiry.md](staffing-inquiry.md). The 2026-11-14 `fk215` change
(PR #145, `c3f9ede`) then moved keyboard focus to the revealed view's heading
on `/offertberakning/` hash switches, and this 2026-11-15 review maps its new
direct declaration `moves keyboard focus to the revealed view heading on hash
switches` in [QuotePage.test.tsx](../../src/pages/QuotePage.test.tsx) into
F6-US1 in the story document and the identity manifest. The 2026-11-15
`fk233` change then added the share-link behavior above with the declarations
in [quote-share.test.ts](../../src/lib/quote-share.test.ts) (fixed URL
parameter names, driveway and drainage search encoding, tolerant decoding and
absolute href building) and in
[QuotePage.test.tsx](../../src/pages/QuotePage.test.tsx) and
[DrainageQuotePage.test.tsx](../../src/pages/DrainageQuotePage.test.tsx)
(producing the encoded share URL and copyable link from a filled form,
restoring the shared inputs with the recomputed total on load, and the
invalid-shared-input degradation through the existing alert and disabled
controls). The 2026-11-18 `fk253` change (PR #162, `de05fa5`) then carried the
optional project note through the share link under the `anteckning` parameter,
and this review maps its new page declarations `encodes a written note into the
produced share link` and `restores the shared note into the project description
on load` for both calculators plus the note-carrying helper declarations in
[quote-share.test.ts](../../src/lib/quote-share.test.ts) into the F6-US2 and
F6-US4 records.

An invalid measurement keeps the previous total out of view and disables the
email and print controls until corrected; "Återställ exempel" restores the
example values and clears the note. A failed hero photo hides its image while
the text stays on the dark background, like other subpage heroes.

## What Works Less Well

The standing "Momsstatus ej bekräftad" label means visitors cannot tell
whether the preliminary total includes VAT, which weakens the number as a
budgeting input. A calculation only
survives a reload or being sent onward through a share link the visitor
explicitly creates; refreshing without one still starts from the example
values. The drainage calculator prices length only,
so depth, soil and access variations stay invisible to the visitor even though
the disclaimer says scope is assessed later.

## Roadmap

- Fix: confirm the VAT treatment of the preliminary totals and state it in
  the calculator instead of the standing unconfirmed label.
- Expand: add further calculator choices for new offered project types when
  the company defines them.
