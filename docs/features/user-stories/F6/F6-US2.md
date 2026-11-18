# F6-US2: See a total-only preliminary total for the entered measurements

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-18

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
- [src/lib/quote-share.ts](../../../../src/lib/quote-share.ts)
- [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts)
- [src/lib/quote-share.test.ts](../../../../src/lib/quote-share.test.ts)
- [src/styles.field-border-contrast.test.ts](../../../../src/styles.field-border-contrast.test.ts)
- [src/styles.quote-focus-zoom.test.ts](../../../../src/styles.quote-focus-zoom.test.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `reveals only the uppfart calculator after choosing uppfart` (direct): Checks the example defaults, the checked asphalt box, the result heading, the "Preliminärt underlag" caption, the example total, the VAT-status label and the disclaimer.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `recalculates the reused driveway calculation into a preliminary total` (direct): Checks the recalculated totals for a changed area and an unchecked asphalt box and that no price-breakdown markup exists.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `describes the quantity fields and announces updates in a polite live region` (direct): Checks the shared field-description association and the polite atomic live region announcing the updated total.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `presents the drainage estimate without internal prices or part amounts` (direct): Checks the drainage headings, scope summary, caption, VAT-status label and disclaimer and the absence of internal prices and breakdown markup.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `calculates $meters löpmeter to $expected kr on the page and in the email` (direct): Parameterized 40/55/60-meter cases check the on-page totals.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `supports decimal lengths and keeps the same precision in the email` (direct): Checks a decimal length's total on the page.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `restores the shared driveway inputs and recomputes the same total on load` (direct): Checks that loading /offertberakning/ with the yta, lass and asfalt share parameters restores the three inputs without an alert and recomputes the identical driveway total. It does not open the link in a second browser session.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `restores the shared length and recomputes the same total on load` (direct): Checks that loading /draneringsberakning/ with the langd share parameter restores the length without an alert and recomputes the identical drainage total.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `restores the shared note into the project description on load` (direct): Checks that loading /offertberakning/ with an anteckning share parameter restores the written note into the project description field alongside the restored measurements, the recomputed total and no alert.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `restores the shared note into the project description on load` (direct): Checks the same note restore on /draneringsberakning/ with the restored length, the recomputed total and no alert.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `describes the length field and announces updates in a polite live region` (direct): Checks the field description association and the polite atomic live region announcing the updated total.
- vitest, [src/styles.field-border-contrast.test.ts](../../../../src/styles.field-border-contrast.test.ts), declaration `keeps quote and inquiry form field boundaries at WCAG AA non-text contrast on white` (technical): Stylesheet check pins the 1px hex border color of the quote input and select/textarea boundary rules at 3:1 non-text contrast on white, alongside the inquiry-page equivalents. It reads the page CSS only and does not render the calculator.
- vitest, [src/styles.quote-focus-zoom.test.ts](../../../../src/styles.quote-focus-zoom.test.ts), declaration `keeps quote form text-entry controls at a font size of at least 16px` (technical): Stylesheet check pins an explicit px font-size of at least 16 on the quote quantity-input rule and the shared quote-field select/textarea rule in the page CSS, the iOS Safari focus-zoom floor fk199 delivered. It reads the stylesheet source only and does not render the calculator or execute iOS zoom behavior.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `bills meters up to the declared boundary at the declared first-tier price plus the declared fixed cost`, `bills only meters above the declared boundary at the declared above-boundary price`, `keeps the declared fixed cost at zero meters` and `accepts fractional meters like the page input allows` (technical): Helper-level checks pin the drainage tier totals, the declared fixed establishment amount and fractional-length pricing, deriving their pins from the quote.drainage.pricing declaration; the rendered drainage total is built on it.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `charges the area at the declared per-square-meter price plus declared fixed and load costs without asphalt`, `adds the declared per-square-meter asphalt price when asphalt is included` and `adds the declared per-load cost per load` (technical): Helper-level checks pin the driveway area, asphalt and load pricing, deriving their pins from the quote.uppfart.pricing declaration; the rendered driveway total is built on it.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `formats money in kronor with non-breaking grouping and a decimal comma` and `formats numbers with grouping and a decimal comma without a currency unit` (technical): Helper-level checks pin the sv-SE money and number formats the rendered total and the email measurements carry.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declaration `exports the exact VAT status label constant` (technical): Helper-level check pins the exact "Momsstatus ej bekräftad" constant that the rendered result aside and the email body carry.
- vitest, [src/lib/quote-share.test.ts](../../../../src/lib/quote-share.test.ts), declarations `reads driveway share values and leaves missing params undefined`, `reads the drainage length only when present` and `reads the shared note only when present` (technical): Helper-level checks pin the tolerant decoding of the yta, lass, asfalt, langd and anteckning search parameters, leaving missing or malformed values undefined so the page keeps its own input handling; the page declarations above check the rendered restore built on it.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
