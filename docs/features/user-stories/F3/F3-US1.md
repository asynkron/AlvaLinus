# F3-US1: Prepare a quote or site-visit inquiry

Feature: [F3 — Prepare an initial project inquiry](../../project-inquiry.md)  
Status: current  
Reviewed: 2026-11-23

As a property owner or project representative, I want to enter initial project details in the inquiry form so I can prepare a useful first discussion.

## Preconditions

- Home or /kontakt/ has loaded.
- External email software is needed to send; manual preparation does not require a configured mail handler.

## Flow

1. Find Kontakta oss för offert. From a service page, its inquiry action opens /kontakt/ with that service preselected in Tjänst.
2. Enter Namn, confirm or change Kundtyp and Tjänst, and describe the project, place and desired timing in Meddelande.
3. Read the explanation before the submit button: review and send in your own email program; the website cannot confirm delivery.
4. Select Skicka offertförfrågan for the native email handoff, or Förbered utkast att kopiera for manual recovery without opening email.
5. Review and send in the external mail client, or select and copy the complete prepared draft into webmail and send it yourself.

## Variants

- Customer types are Privatperson, Företag, and BRF eller fastighetsägare.
- Services include the five offered areas and Annat.
- Pool excavation is part of Grävjobb, not a separate Pool option.
- A service-page inquiry action targets /kontakt/?tjanst=<service id> using the typed service record id; contact preselects the matching typed option and keeps manual change available. Direct /kontakt/ and home /#kontakt without context keep the first option; unknown or malformed context retains it and never becomes a new option or form content.
- Required fields use browser-native validation; the site has no custom submit handler.
- Manual preparation also requires native validity. Its labeled read-only textarea includes recipient, subject and all four current values, including selected options and multiline Swedish text. Every control edit discards it; restoring old values cannot revive it without fresh valid preparation. No clipboard permission is required.
- The same typed explanation and subject-bearing fallback email link appear inside the form on home and /kontakt/; aria-describedby associates the note with the form.

## Expected outcome

The visitor can prepare a complete addressed selectable draft or request a plain-text mail-client handoff to linus.svardd@outlook.com with the configured subject and actually selected options; delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use Förbered utkast att kopiera to prepare valid current input without opening email, then manually copy the recipient, subject and labeled details into webmail. The direct address link remains available but needs an email handler. No draft persists across reloads.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)
- [src/lib/inquiry-service.ts](../../../../src/lib/inquiry-service.ts)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a static email handoff form and footer contact email` (direct): Checks form method, mailto action, text/plain encoding, named controls, submit button, aria-describedby note association, explanation before the button, in-form fallback recipient/subject and absence of a sent confirmation. Does not send mail, exercise native validation or establish a separate home rendering.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `carries the stable $id service identity in the $path inquiry action` (direct): Parameterized over the five service pages; checks each rendered band link's `/kontakt/?tjanst=<service id>` destination against the typed service id.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `follows a service page inquiry action into contact, selects that service and preserves a later manual change` (direct): Follows the rendered link's URL into /kontakt/, checks the recognized Dränering preselection in the named service select and a manual change to Annat. Does not send mail.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the typed default service selection on home and direct contact without inquiry context` (direct): Checks the first typed option without context on home and /kontakt/.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declarations `retains the default service selection for unrecognized inquiry context $context` and `retains the default service selection when a recognized service has no matching typed option` (direct): Check default retention and that context text never becomes a new option, element or script content.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps every contact form control at the 16px base text size on home and /kontakt/` (technical): Class-level check pins text-base on the Namn, Kundtyp, Tjänst and Meddelande controls on home and /kontakt/ and rejects responsive sm/md/lg/xl/2xl text-size classes that would shrink them below the iOS Safari 16px focus-zoom floor. It inspects rendered classNames only and does not execute the iOS zoom behavior.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

Manual recovery has direct in-memory coverage in SiteHomePage.test.tsx:
`prepares a complete selectable project inquiry without email on %s` covers both
shared entry points with independently expected recipient, subject, Swedish and
multiline details, actual selections and selectable text.
`blocks manual project preparation until every required control is valid`
isolates each required control's native validity.
`discards the prepared project inquiry on every %s edit until fresh preparation`
covers every control, edit-and-restore and fresh current values. External email
and operating-system clipboard behavior remain outside these proofs.

## Company telephone contact (fk274, 2026-11-19)

The home contact section, /kontakt/ and shared footer display 070-214 67 83
as a native `tel:+46702146783` link alongside linus.svardd@outlook.com.
The footer derives the telephone item from the same typed contact items as
the contact section. Its link occupies its own row with vertical padding;
existing responsive columns remain in place.

The direct SiteHomePage.test.tsx declaration
`offers the company phone contact with native keyboard access on %s`
checks the home, contact and both calculator footers, literal telephone
href/text, focusability and the retained email; it also checks the contact
section on home and /kontakt/. It does not exercise a phone handler or render
mobile/desktop layout. The footer stylesheet test no longer counts identical
color substrings, which would incorrectly forbid adding another contact link.
Existing source layout checks and compiled tap-height coverage remain.
