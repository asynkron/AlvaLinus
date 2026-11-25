# F6-US5: Hand off the quote request by email

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-23

As a project visitor, I want to hand my measurements and the preliminary total to the company by email so the discussion starts from the same numbers.

## Preconditions

- A calculator has valid positive finite measurements (an estimate up to 100, individual scope above 100).
- The visitor has a mail client for mailto, or a working webmail tool for manual copying.

## Flow

1. Optionally add the project note with place, current substrate and desired timing.
2. Select "Begär offert på underlaget".
3. Review and send the prepared draft in the own email program.
4. Read "Öppnar ditt e-postprogram. Inget skickas automatiskt." beside the control.
5. Alternatively select "Visa e-postutkast" and manually copy the labeled recipient, subject and complete message into webmail; preparation does not open mail, copy content or publish a link.

## Variants

- The driveway draft has the subject "Offertförfrågan – uppfart" and a body with Yta, the Asfalt answer, the preliminary sum labeled "Inkl. moms / Exkl. moms" and "Omfattning behöver bekräftas"; unchecking asphalt changes the Asfalt answer.
- The drainage draft has the subject "Offertförfrågan – husdränering" and a body with the length in löpmeter, the preliminary sum and "Omfattning behöver bekräftas".
- Both drafts address linus.svardd@outlook.com and never contain internal unit prices, fixed costs or part amounts.
- Each selectable field retains its visible accessible name and exposes the existing Swedish copy/send help as its accessible description, with a reference to its own draft instance's help. Fresh preparation restores this relationship after edits.

## Expected outcome

The visitor can hand off the current addressed draft through mailto or selectable text: measurements and the selected-VAT preliminary total for estimates, scope and notes without a price above 100. The visitor sends it themselves and delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending. Explicitly select Visa e-postutkast and copy Mottagare, Ämne and Meddelande into webmail without clipboard API support. Every measurement, asphalt, note or VAT edit, changed-value reset and invalidation discards the prepared fields. Returning to earlier values requires fresh preparation, including VAT edits above 100 where the price-free body is unchanged. Invalid inputs cannot prepare a draft. Nothing is persisted or sent by the site; edits cannot retract an external draft.

## Source and evidence

- vitest, [src/pages/QuoteDraft.test.tsx](../../../../src/pages/QuoteDraft.test.tsx), declaration `associates each calculator draft with its own copy guidance` (direct): Two rendered calculator drafts reference their own help without sharing identities. The existing parameterized preparation helper checks all three named fields' accessible descriptions on initial preparation, edits, invalid recovery and scope-only drafts. This is in-memory DOM coverage, not a screen-reader execution or compliance verdict.
- vitest, [src/pages/QuoteDraft.test.tsx](../../../../src/pages/QuoteDraft.test.tsx), declarations `explicitly prepares the complete selectable addressed estimate with literal multiline notes`, `discards drafts on every relevant edit, return, reset and invalidation without copying or publishing`, and `prepares only current scope above 100 and requires preparation after price-free VAT edits` (direct): Both calculator pages, independent complete decoded expectations and amounts, read-only accessible fields without clipboard, edit-away-and-back, asphalt, notes, VAT, reset, invalid recovery and scope-only drafts. Existing share race and math declarations remain their owners.
- vitest, [src/components/QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `keeps draft preparation independent of a pending share attempt` (direct): Preparing a manual draft retains the current shared link and lets the controlled pending clipboard operation announce its result without discarding the prepared fields.

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts)
- [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `keeps the email handoff about the uppfart without internal prices` (direct): Checks the mailto recipient, subject, decoded body values including the Asfalt answer and selected VAT label, the confirmed-scope line and the absence of internal prices.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `calculates $meters löpmeter to $expected kr on the page and in the email` (direct): Parameterized 40/55/60-meter cases check the drainage subject, length line, preliminary sum and the absence of internal prices in the email.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `supports decimal lengths and keeps the same precision in the email` (direct): Checks the decimal length's precision in the email body.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `replaces every known {key} placeholder with its value` and `keeps unknown placeholders untouched` (technical): Helper-level checks pin the draft body template's placeholder substitution, including unknown placeholders staying literal.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `percent-encodes the subject and the filled body in a mailto URL` and `keeps unknown placeholders and encodes their braces in the body` (technical): Helper-level checks pin the mailto URL construction — percent-encoded subject and filled body, with leftover placeholder braces encoded — that the Begär offert control hands to the email program.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps the quote send CTA white label readable on its primary token surface at WCAG AA` (technical): Page-level stylesheet check pins the white label on the token-based Begär offert send button surface at 4.5:1.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps every focus-visible outline on a 3px solid token outline with a 3px offset` (technical): Stylesheet check pins the quote pages' focus-visible rule — the .quote-layout input, select, textarea, button, a and summary outlines — to a 3px solid token outline with a 3px offset whose accent stays in the orange brand hue band; the same declaration also covers the staffing form's inquiry-side rules mapped under F5-US2. It reads the page CSS only and does not render a focus ring or exercise keyboard focus.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps the quote selection pair an AA-readable declared token pairing` (technical): Stylesheet check pins the .quote-layout ::selection background and color declarations to styles.css token references and requires the pairing at 4.5:1. It reads the page CSS only and does not render a text selection.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps the quote selection background in the orange brand hue family` (technical): Stylesheet check pins the .quote-layout ::selection background token's hue to the declared orange brand band. It constrains hue only and does not itself re-check contrast or render a text selection.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

## Individual-quote boundary (fk274, 2026-11-19)

Estimates apply only to positive finite measurements up to and including 100.
Above 100 m² or 100 löpmeter the polite atomic live region shows
Kontakta oss för en individuell offert with the page-specific explanation.
The native contact link is keyboard accessible and opens a scope-and-notes
draft to linus.svardd@outlook.com without a price. Print is disabled, and the
document contains no stale estimate even when the browser prints directly.
Share remains available and restores this state. Lowering the measurement to
at most 100 restores the normal result. Invalid measurements remain a separate
alert state. Old lass parameters are inert.

Direct declarations in [QuoteLimits.test.tsx](../../../../src/pages/QuoteLimits.test.tsx):

- `estimates 99.9 and exactly 100, then replaces the price above 100 and recovers`
- `restores a very large finite shared scope as an individual inquiry without computing a price`
- `keeps invalid shared scope %s separate from an individual quote`

These in-memory declarations cover both calculators and are not execution receipts.

## VAT mode (fk274, Alva 41716/41724)

Both calculators default to Inkl. moms and offer native keyboard-operable,
mutually exclusive Inkl. moms / Exkl. moms radio controls. Existing prices
include 25% VAT. Exclusive totals are derived from the original unrounded
inclusive total divided by 1.25 on every change, with display rounding only.
The selected mode labels the result, email and print document. Reset returns
to inclusive. Exclusive share links carry moms=exkl; older links default to
inclusive. Contact above 100 stays price-free in either mode.

Direct declarations in [QuoteVat.test.tsx](../../../../src/pages/QuoteVat.test.tsx):

- `selects mutually exclusive VAT modes by keyboard and labels the result, draft and print handoff`
- `always recalculates from inclusive prices without accumulated rounding and resets to inclusive`
- `keeps over-100 contact price-free in either VAT mode and restores the selected estimate below the limit`
- `restores and shares an exclusive VAT estimate while old links default to inclusive`

These declarations pin independent 166600/133280 kr driveway and
146900/117520 kr drainage examples and fractional cases. They inspect the
document at the mocked browser-print boundary; they do not render paper.
