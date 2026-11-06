# F6-US2: See a total-only preliminary total for the entered measurements

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-06

As a project visitor, I want to enter my measurements and see one preliminary total so I can gauge the cost before making contact.

## Preconditions

- A calculator is selected (uppfart via the #uppfart hash, husdränering via /draneringsberakning/).

## Flow

1. Enter Uppfartens yta and Antal lass, or Dräneringens längd in löpmeter.
2. Read the help text under the fields and the "Det här ingår" scope summary on the drainage page.
3. Read the announced "Beräknad totalsumma", the currency total and "Momsstatus ej bekräftad" in the Din kostnadsbild aside.
4. Read the disclaimer that this is an estimate, not a binding quote, and that ROT deduction and payment terms are specified in the real quote.

## Variants

- The driveway calculator starts from the example values 100 m², 1 lass and the checked "Inkludera asfalt" checkbox; unchecking asphalt recalculates the total.
- The drainage calculator starts from the example 40 löpmeter and accepts decimal lengths with the same precision on the page and in the email.
- Totals recalculate on every change and are announced through an aria-live="polite", aria-atomic region.
- Only the total is shown: no unit prices, part amounts or price-breakdown sections exist in the customer view.

## Expected outcome

The visitor sees exactly one preliminary total for the entered measurements, clearly labeled as unconfirmed regarding VAT and non-binding.

## Failure and recovery

The website cannot confirm a binding price; the disclaimer directs scope confirmation to the real quote discussion.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/lib/quote.ts](../../../../src/lib/quote.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `reveals only the uppfart calculator after choosing uppfart` (direct): Checks the example defaults, the checked asphalt box, the result heading, the "Preliminärt underlag" caption, the example total, the VAT-status label and the disclaimer.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `recalculates the reused driveway calculation into a preliminary total` (direct): Checks the recalculated totals for a changed area and an unchecked asphalt box and that no price-breakdown markup exists.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `describes the quantity fields and announces updates in a polite live region` (direct): Checks the shared field-description association and the polite atomic live region announcing the updated total.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `presents the drainage estimate without internal prices or part amounts` (direct): Checks the drainage headings, scope summary, caption, VAT-status label and disclaimer and the absence of internal prices and breakdown markup.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `calculates $meters löpmeter to $expected kr on the page and in the email` (direct): Parameterized 40/55/60-meter cases check the on-page totals.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `supports decimal lengths and keeps the same precision in the email` (direct): Checks a decimal length's total on the page.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `describes the length field and announces updates in a polite live region` (direct): Checks the field description association and the polite atomic live region announcing the updated total.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
