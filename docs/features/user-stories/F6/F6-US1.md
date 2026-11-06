# F6-US1: Choose the calculator for the project

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-06

As a project visitor, I want to choose between the husdränering and uppfart calculators so my preliminary quote uses the right project type.

## Preconditions

- The /offertberakning/ route document has loaded.

## Flow

1. Open /offertberakning/ from the header Kalkyler Uppfart link, the footer, a not-found shortcut or the drainage calculator's Räkna på uppfart cross-link.
2. Read "Vad gäller din offertförfrågan?" and choose "Räkna på husdränering" or "Räkna på uppfart".
3. On the drainage page, follow "Räkna på uppfart" back to the driveway calculator.

## Variants

- "Räkna på husdränering" links to /draneringsberakning/ and "Räkna på uppfart" links to the #uppfart hash; no calculator fields or result are visible before a choice.
- The #uppfart hash reveals only the driveway calculator; "← Välj annan kalkyl" returns to the choice view and the hash change listener keeps the view in sync.
- The drainage page offers "Räkna på uppfart" as a plain link to /offertberakning/.

## Expected outcome

The visitor works in exactly one calculator whose fields and result match the chosen project type.

## Failure and recovery

Choosing again is always available through the choice view, the Kalkyler disclosure or the cross-links; no calculation is created by visiting the choice view.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `starts with two calculator choice buttons before any calculator fields` (direct): Checks the choice heading, both choice-link destinations and that no quantity fields, asphalt checkbox, result heading or alert exists before choosing.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `reveals only the uppfart calculator after choosing uppfart` (direct): Checks that the choice buttons disappear, the back link targets /offertberakning/ and only the driveway fields appear.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `links visitors with a driveway project back to the quote calculator` (direct): Checks the drainage page's /offertberakning/ cross-link destination.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
