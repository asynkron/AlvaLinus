# F6-US4: Print or save the preliminary quote as PDF

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-06

As a project visitor, I want to print or save the preliminary quote so I can keep or share the cost picture outside the browser session.

## Preconditions

- A calculator shows a valid preliminary total.

## Flow

1. Enter valid measurements and read the announced total.
2. Select "Skriv ut / spara som PDF" to open the browser's print dialog.
3. Keep or share the printed page; it carries the same total-only content as the view.

## Variants

- Both calculators expose the same print control in the Din kostnadsbild aside; it stays disabled while input is invalid.

## Expected outcome

The visitor can hand the preliminary total to paper or a PDF through the browser's own print path; the website produces no separate document, file or stored quote.

## Failure and recovery

The website cannot confirm that a printout or PDF was produced; browser and printer availability stay outside the site. No print invocation or printed layout is covered by a reviewed declaration, so the printed rendering remains an unmapped gap.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)

No test reference is mapped for this story. The reviewed declarations only check that the print control exists and stays disabled while input is invalid, inside the failure-handling declarations mapped under F6-US3; no declaration exercises an actual print dialog, and the printed layout is unmapped.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
