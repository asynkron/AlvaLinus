# F5-US1: Prepare a staffing inquiry with company and assignment details

Feature: [F5 — Prepare a company staffing inquiry](../../staffing-inquiry.md)  
Status: current  
Reviewed: 2026-11-10

As a company representative, I want to enter company details, needed help, offered hourly rate, duration and a description in the staffing inquiry form so the company receives a useful basis to reply.

## Preconditions

- The /inhyrning/ route document has loaded.
- The typed Inhyrning route is declared in the registry.

## Flow

1. Open /inhyrning/ from the header Inhyrning link (desktop, mobile or footer) or a not-found shortcut.
2. Read Söker ni en F-skattare? and the En tydlig start aside.
3. Enter Företagets namn, Kontaktperson and E-post; Telefon and Organisationsnummer are optional.
4. Enter what help is needed, the offered hourly rate and how long the assignment runs.
5. Describe the assignment in Beskriv ärendet.

## Variants

- Submitting with missing required fields shows a role="alert" summary and one Swedish message per missing field, marks each field with aria-invalid and aria-describedby, and moves focus to the first invalid field.
- An email without a valid shape gets "Ange en giltig e-postadress, till exempel namn@foretag.se." and correcting the field clears its message.
- A negative, non-numeric or missing rate gets its own Swedish message; the rate input carries min="0" and the VAT note as its description.
- Phone and organization number stay optional and never enter the error set.

## Expected outcome

The visitor can complete every required staffing detail or learn in Swedish exactly which field blocks the handoff; no draft is opened while input is invalid.

## Failure and recovery

The page cannot verify company details beyond shape checks. A visitor stuck on validation reads the messages and corrects the named fields.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/InquiryPage.tsx](../../../../src/pages/InquiryPage.tsx)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `collects the nine fields in mockup order with required and optional marks` (direct): Checks field order, required/optional attributes, autocomplete hints, the rate input minimum, the VAT note association and the handoff note. Does not establish visual layout.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `explains every missing required field in Swedish and focuses the first invalid field` (direct): Checks the alert summary, the seven per-field messages, aria-invalid/aria-describedby wiring, optional fields staying unmarked and focus on the first invalid control.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declarations `explains an invalid email address and clears the error when the address is corrected` and `rejects a negative offered hourly rate with a Swedish message` (direct): Check the specific Swedish messages and that no draft opens for invalid input.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `keeps validation in helper functions so optional fields stay out of the error set` (direct): Checks the validation helper directly, including the error key order and optional fields staying outside the set.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
