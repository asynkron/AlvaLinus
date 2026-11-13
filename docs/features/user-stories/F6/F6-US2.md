# F6-US2: See a total-only preliminary total for the entered measurements

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-13

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
- [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts)
- [src/styles.field-border-contrast.test.ts](../../../../src/styles.field-border-contrast.test.ts)
- [src/styles.quote-focus-zoom.test.ts](../../../../src/styles.quote-focus-zoom.test.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `reveals only the uppfart calculator after choosing uppfart` (direct): Checks the example defaults, the checked asphalt box, the result heading, the "Preliminärt underlag" caption, the example total, the VAT-status label and the disclaimer.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `recalculates the reused driveway calculation into a preliminary total` (direct): Checks the recalculated totals for a changed area and an unchecked asphalt box and that no price-breakdown markup exists.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `describes the quantity fields and announces updates in a polite live region` (direct): Checks the shared field-description association and the polite atomic live region announcing the updated total.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `presents the drainage estimate without internal prices or part amounts` (direct): Checks the drainage headings, scope summary, caption, VAT-status label and disclaimer and the absence of internal prices and breakdown markup.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `calculates $meters löpmeter to $expected kr on the page and in the email` (direct): Parameterized 40/55/60-meter cases check the on-page totals.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `supports decimal lengths and keeps the same precision in the email` (direct): Checks a decimal length's total on the page.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `describes the length field and announces updates in a polite live region` (direct): Checks the field description association and the polite atomic live region announcing the updated total.
- vitest, [src/styles.field-border-contrast.test.ts](../../../../src/styles.field-border-contrast.test.ts), declaration `keeps quote and inquiry form field boundaries at WCAG AA non-text contrast on white` (technical): Stylesheet check pins the 1px hex border color of the quote input and select/textarea boundary rules at 3:1 non-text contrast on white, alongside the inquiry-page equivalents. It reads the page CSS only and does not render the calculator.
- vitest, [src/styles.quote-focus-zoom.test.ts](../../../../src/styles.quote-focus-zoom.test.ts), declaration `keeps quote form text-entry controls at a font size of at least 16px` (technical): Stylesheet check pins an explicit px font-size of at least 16 on the quote quantity-input rule and the shared quote-field select/textarea rule in the page CSS, the iOS Safari focus-zoom floor fk199 delivered. It reads the stylesheet source only and does not render the calculator or execute iOS zoom behavior.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `bills the first 55 meters at 3 500 kr per meter plus the fixed cost`, `bills only meters above the 55 meter boundary at 3 000 kr per meter`, `keeps the 6 900 kr fixed cost at zero meters` and `accepts fractional meters like the page input allows` (technical): Helper-level checks pin the drainage tier totals, the fixed establishment amount and fractional-length pricing that the rendered drainage total is built on.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `charges the area at 950 kr per square meter plus fixed and load costs without asphalt`, `adds 667 kr per square meter when asphalt is included` and `adds 2 000 kr per load` (technical): Helper-level checks pin the driveway area, asphalt and load pricing that the rendered driveway total is built on.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `formats money in kronor with non-breaking grouping and a decimal comma` and `formats numbers with grouping and a decimal comma without a currency unit` (technical): Helper-level checks pin the sv-SE money and number formats the rendered total and the email measurements carry.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declaration `exports the exact VAT status label constant` (technical): Helper-level check pins the exact "Momsstatus ej bekräftad" constant that the rendered result aside and the email body carry.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
