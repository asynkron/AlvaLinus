# F6-US5: Hand off the quote request by email

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-11

As a project visitor, I want to hand my measurements and the preliminary total to the company by email so the discussion starts from the same numbers.

## Preconditions

- A calculator shows a valid preliminary total.
- A mail client is configured for the handoff.

## Flow

1. Optionally add the project note with place, current substrate and desired timing.
2. Select "Begär offert på underlaget".
3. Review and send the prepared draft in the own email program.
4. Read "Öppnar ditt e-postprogram. Inget skickas automatiskt." beside the control.

## Variants

- The driveway draft has the subject "Offertförfrågan – uppfart" and a body with Yta, Antal lass, the Asfalt answer, the preliminary sum labeled "momsstatus ej bekräftad" and "Omfattning behöver bekräftas"; unchecking asphalt changes the Asfalt answer.
- The drainage draft has the subject "Offertförfrågan – husdränering" and a body with the length in löpmeter, the preliminary sum and "Omfattning behöver bekräftas".
- Both drafts address kontakt@svardentreprenad.se and never contain internal unit prices, fixed costs or part amounts.

## Expected outcome

The email program receives a draft carrying the entered measurements and the preliminary total; the visitor sends it themselves and delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending. Copy the address and details into a working email tool; the site offers no persistent draft recovery or alternate transport.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `keeps the email handoff about the uppfart without internal prices` (direct): Checks the mailto recipient, subject, decoded body values including the Asfalt answer and unconfirmed VAT label, the confirmed-scope line and the absence of internal prices.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `calculates $meters löpmeter to $expected kr on the page and in the email` (direct): Parameterized 40/55/60-meter cases check the drainage subject, length line, preliminary sum and the absence of internal prices in the email.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `supports decimal lengths and keeps the same precision in the email` (direct): Checks the decimal length's precision in the email body.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `replaces every known {key} placeholder with its value` and `keeps unknown placeholders untouched` (technical): Helper-level checks pin the draft body template's placeholder substitution, including unknown placeholders staying literal.
- vitest, [src/lib/quote.test.ts](../../../../src/lib/quote.test.ts), declarations `percent-encodes the subject and the filled body in a mailto URL` and `keeps unknown placeholders and encodes their braces in the body` (technical): Helper-level checks pin the mailto URL construction — percent-encoded subject and filled body, with leftover placeholder braces encoded — that the Begär offert control hands to the email program.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps the quote send CTA white label readable on its primary token surface at WCAG AA` (technical): Page-level stylesheet check pins the white label on the token-based Begär offert send button surface at 4.5:1.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
