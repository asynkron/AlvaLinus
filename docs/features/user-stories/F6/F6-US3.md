# F6-US3: Recover from invalid measurements

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-19

As a project visitor, I want clear Swedish feedback when my measurements are invalid so I can correct them instead of acting on a misleading total.

## Preconditions

- A calculator is selected with an entered measurement.

## Flow

1. Enter an invalid value: a empty, non-numeric, non-finite or non-positive area or drainage length.
2. Read the role="alert" Swedish message and the marked input instead of a total.
3. Correct the value or select "Återställ exempel" to restore the example values and clear the note.

## Variants

- The driveway message is "Ange en yta större än 0." while the area is invalid; the drainage message is "Ange en längd större än 0.".
- While input is invalid, no Beräknad totalsumma is rendered, the input carries aria-invalid, and the email and print controls are disabled or replaced by a disabled "Kontrollera dina uppgifter" button.
- "Återställ exempel" restores the example measurements, the default asphalt choice and an empty note, clearing the alert.

## Expected outcome

The visitor never sees a stale total alongside invalid input and can recover by correcting the named value or resetting the example.

## Failure and recovery

The page performs shape and range checks only; it cannot judge whether the entered measurements fit the real project. The disclaimer keeps scope confirmation with the company.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `blocks invalid quantities without a misleading result and resets the calculator` (direct): Checks the Swedish alert, the absent email link, the disabled result and print controls, the absent total for empty and negative values and the reset behavior.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `blocks the invalid length %s without a misleading result` (direct): Parameterized empty, zero, negative and non-numeric cases check the alert, aria-invalid, the disabled email and print controls and the absent total.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `restores the example and clears the project description` (direct): Checks that reset restores the example length, clears the note and the alert and leaves a valid email handoff.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `degrades invalid shared inputs through the existing invalid-input path` (direct): Checks that an invalid shared yta value renders the existing Swedish alert instead of a total and disables the send, print and share controls, reusing the invalid-input handling instead of a separate shared-error path.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `degrades an invalid shared length through the existing invalid-input path` (direct): Checks that an invalid shared langd value renders the existing Swedish alert instead of a total and disables the send, print and share controls.

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
