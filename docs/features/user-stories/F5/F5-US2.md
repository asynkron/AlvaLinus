# F5-US2: Send the prepared staffing draft yourself

Feature: [F5 — Prepare a company staffing inquiry](../../staffing-inquiry.md)  
Status: current  
Reviewed: 2026-11-21

As a company representative, I want the staffing inquiry handed to my own email program as a draft addressed to the company, so I can review and send it myself.

## Preconditions

- All required fields contain valid values.
- A mail client is needed for mailto; manual copying into webmail needs no handler or clipboard API.

## Flow

1. Complete the staffing inquiry form with valid values and optionally select the offered rate's momsstatus.
2. Select Skicka förfrågan.
3. The page hands a mailto draft to linus.svardd@outlook.com with the subject "Förfrågan om inhyrning" and a labeled body of every supplied value to the email program.
4. Read the role="status" confirmation: review the draft and send the email yourself; the website cannot send or confirm delivery.
5. Select and manually copy the complete Utkast att kopiera text (recipient, subject and labeled body) into webmail if the email program did not open, or follow Öppna utkastet igen.

## Variants

- Empty optional fields (Telefon, Organisationsnummer) are marked with a dash in the draft body instead of blocking the handoff.
- A selected inklusive moms or exklusive moms basis is appended in parentheses beside the offered rate in the draft. It remains the visitor's statement, not a confirmed VAT basis.
- Leaving Momsstatus för timpriset on Ej angivet preserves the declared draft body without appending a basis or a dash for momsstatus and does not block the handoff.
- The static help line beside the submit button states the draft handoff and the manual send before submitting.
- The fallback link carries the same draft as the handed-off href.
- Editing any field or changing/clearing momsstatus removes the previous confirmation, selectable preview and reopen link without opening another draft or clearing current inputs. A fresh valid submit creates a draft from the current values.

## Expected outcome

The form requests a mailto handoff to linus.svardd@outlook.com with the staffing subject and details; the visitor sends the email themselves and delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use the Öppna utkastet igen link, or copy the complete read-only selectable draft (recipient, subject and labeled body) into working email software; the site offers no persistent draft recovery or alternate transport.

After edits discard the old feedback, submit valid current details again. Invalid submission or restoring an earlier value cannot revive the old confirmation or link. A draft already opened in external email software is outside this reset.

## Source and evidence

- [src/pages/InquiryPage.tsx](../../../../src/pages/InquiryPage.tsx)
- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/styles.primary-contrast.test.ts](../../../../src/styles.primary-contrast.test.ts)
- [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts)
- [ADR 0006 — static email contact handoff](../../../adrs/0006-static-email-contact-handoff.md)

- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `opens a mail draft to the existing contact address with every supplied detail and explains the manual send` (direct): Checks the handed-off mailto recipient, subject and decoded body values, the call into the injected draft opener, the role="status" self-send confirmation with the recipient address and the fallback link carrying the same draft, and the read-only selectable complete draft against independent expected recipient, subject and body values including Swedish multiline text. Uses an injected opener, so it does not exercise a real email program.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `marks empty optional fields with a dash in the mail draft without blocking the handoff` (direct): Checks the dash placeholders for empty optional fields and the absence of an alert on the successful handoff.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `discards the prepared draft after editing $key and resubmits current details` (direct): Nine field-edit cases check removal of the prior status/reopen link and selectable preview, retained current values, no new opener call during edits and current decoded draft details after resubmission. Uses an injected opener, not a real mail client.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `discards the prepared draft when momsstatus changes to '%s'` (direct): Selecting or clearing momsstatus removes the prior status/link/preview without opening a draft or losing field values; resubmission carries the selected basis or omits it. Uses an injected opener.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `keeps discarded feedback hidden through invalid submission and restoring the previous value` (direct): An invalid email blocks the opener, shows Swedish validation and focus, and keeps stale feedback absent even after restoring the email; only valid resubmission opens a fresh draft. Does not establish email delivery.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `carries a stated momsstatus into the mail draft beside the offered rate` (direct): Selects the declared exklusive moms option and checks the decoded rate line received by the injected draft opener. Does not exercise a real email program or verify the stated VAT basis.
- vitest, [src/pages/InquiryPage.test.tsx](../../../../src/pages/InquiryPage.test.tsx), declaration `keeps the mail draft byte-identical to the declared body when momsstatus is omitted` (direct): Checks default versus explicit empty helper input and the form's decoded draft against the declared body, without a momsstatus dash suffix. Uses an injected opener; it does not establish email delivery.
- vitest, [src/styles.primary-contrast.test.ts](../../../../src/styles.primary-contrast.test.ts), declaration `keeps white primary-foreground labels readable on primary buttons at WCAG AA` (technical): Token-level stylesheet check pins the white `--primary-foreground` label against the `--primary` button surface at 4.5:1, the pairing this story's Skicka förfrågan submit button renders through the shared primary button variant. It reads the root tokens only; the quote pages' send button override is pinned separately by the page-accent check below.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps the quote send CTA white label readable on its primary token surface at WCAG AA` (technical): Page-level stylesheet check resolves the quote send button's token-based background and label declarations against the root tokens and pins the white-on-primary pairing at 4.5:1, covering the page override that the shared primary button variant alone did not.
- vitest, [src/styles.page-accent-contrast.test.ts](../../../../src/styles.page-accent-contrast.test.ts), declaration `keeps every focus-visible outline on a 3px solid token outline with a 3px offset` (technical): Stylesheet check pins the staffing form's focus-visible rules — the .inquiry-field inputs and textarea, the .inquiry-layout buttons and links and the .inquiry-alert summary — to a 3px solid token outline with a 3px offset whose accent stays in the orange brand hue band. It reads the page CSS only and does not render a focus ring or exercise keyboard focus.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
