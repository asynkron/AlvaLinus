# F5-US2: Send the prepared staffing draft yourself

Feature: [F5 — Prepare a company staffing inquiry](../../staffing-inquiry.md)  
Status: current  
Reviewed: 2026-11-10

As a company representative, I want the staffing inquiry handed to my own email program as a draft addressed to the company, so I can review and send it myself.

## Preconditions

- All required fields contain valid values.
- A mail client is configured for the handoff.

## Flow

1. Complete the staffing inquiry form with valid values.
2. Select Skicka förfrågan.
3. The page hands a mailto draft to kontakt@svardentreprenad.se with the subject "Förfrågan om inhyrning" and a labeled body of every supplied value to the email program.
4. Read the role="status" confirmation: review the draft and send the email yourself; the website cannot send or confirm delivery.
5. If the email program did not open, follow Öppna utkastet igen or copy the displayed address.

## Variants

- Empty optional fields (Telefon, Organisationsnummer) are marked with a dash in the draft body instead of blocking the handoff.
- The static help line beside the submit button states the draft handoff and the manual send before submitting.
- The fallback link carries the same draft as the handed-off href.

## Expected outcome

The form requests a mailto handoff to kontakt@svardentreprenad.se with the staffing subject and details; the visitor sends the email themselves and delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use the Öppna utkastet igen link, or copy the displayed address and details into working email software; the site offers no persistent draft recovery or alternate transport.

## Source and evidence

- [src/pages/InquiryPage.tsx](../../../../src/pages/InquiryPage.tsx)
- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [ADR 0006 — static email contact handoff](../../../adrs/0006-static-email-contact-handoff.md)

- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `opens a mail draft to the existing contact address with every supplied detail and explains the manual send` (direct): Checks the handed-off mailto recipient, subject and decoded body values, the call into the injected draft opener, the role="status" self-send confirmation with the recipient address and the fallback link carrying the same draft. Uses an injected opener, so it does not exercise a real email program.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `marks empty optional fields with a dash in the mail draft without blocking the handoff` (direct): Checks the dash placeholders for empty optional fields and the absence of an alert on the successful handoff.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
