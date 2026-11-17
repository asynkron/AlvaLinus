# F6-US4: Keep or share the preliminary quote outside the browser session

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-17

As a project visitor, I want to print or save the preliminary quote, or share it through a measurements-bearing link, so I can keep or share the cost picture outside the browser session.

## Preconditions

- A calculator shows a valid preliminary total.

## Flow

1. Enter valid measurements and read the announced total.
2. Select "Skriv ut / spara som PDF" to open the browser's print dialog.
3. Keep or share the printed page; it carries the same total-only content as the view.
4. Or select "Skapa delbar länk" to write the measurements into the page URL and copy or send the displayed share link onward.

## Variants

- Both calculators expose the same print control in the Din kostnadsbild aside; it stays disabled while input is invalid.
- The share link encodes yta, lass and the asphalt choice on /offertberakning/ while keeping the #uppfart hash, and längd on /draneringsberakning/; the control copies through the browser clipboard when that API is available and stays usable as a plain link when it is not.
- Opening a share link restores the shared inputs once on load and recomputes the identical total; missing parameters fall back to the example defaults and invalid shared values go through the existing invalid-input alert with the share control disabled alongside the email and print controls.

## Expected outcome

The visitor hands the preliminary total to paper or a PDF through the browser's own print path, or carries the exact calculation onward through a measurements-bearing share link whose recipient sees the same recomputed total; the website stores nothing beyond that link.

## Failure and recovery

The website cannot confirm that a printout or PDF was produced; browser and printer availability stay outside the site. The share control is disabled alongside the email and print controls while input is invalid. A recipient without the exact link URL starts from the example values.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/lib/quote-share.ts](../../../../src/lib/quote-share.ts)

The 2026-11-17 reconciliation maps the `fk233` share-link declarations into this story:

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `produces a share link that encodes the driveway inputs and lands on the uppfart view` (direct): Checks that "Skapa delbar länk" writes the yta, lass and asfalt values into the page URL while keeping the #uppfart hash so the recipient lands on the driveway view, and renders the same absolute URL as the copyable link's href.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `produces a share link that encodes the drainage length` (direct): Checks that "Skapa delbar länk" writes the langd length into the page URL and renders the same absolute URL as the copyable link's href.
- vitest, [src/lib/quote-share.test.ts](../../../../src/lib/quote-share.test.ts), declarations `declares the fixed Swedish URL parameter names`, `builds driveway search params for area, loads and the asphalt choice`, `builds the drainage search param from the entered length` and `builds an absolute share href from the current page location` (technical): Helper-level checks pin the fixed yta/lass/asfalt/langd parameter names, the driveway and drainage search encodings with the 1/0 asphalt flag, and the absolute href construction behind the page share-link declarations.

No print invocation or printed layout is covered by a reviewed declaration, so the printed rendering remains an unmapped gap.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
