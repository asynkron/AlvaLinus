# F3-US1: Prepare a quote or site-visit inquiry

Feature: [F3 — Prepare an initial project inquiry](../../project-inquiry.md)  
Status: current  
Reviewed: 2026-10-28

As a property owner or project representative, I want to enter initial project details in the inquiry form so I can prepare a useful first discussion.

## Preconditions

- Home or /kontakt/ has loaded.
- A mail client is configured for the handoff.

## Flow

1. Find Kontakta oss för offert. From a service page, its inquiry action opens /kontakt/ with that service preselected in Tjänst.
2. Enter Namn, confirm or change Kundtyp and Tjänst, and describe the project, place and desired timing in Meddelande.
3. Read the explanation before the submit button: review and send in your own email program; the website cannot confirm delivery.
4. Select Skicka offertförfrågan.
5. Review and send in the external mail client if it opens.

## Variants

- Customer types are Privatperson, Företag, and BRF eller fastighetsägare.
- Services include the five offered areas and Annat.
- Pool excavation is part of Grävjobb, not a separate Pool option.
- A service-page inquiry action targets /kontakt/?tjanst=<service id> using the typed service record id; contact preselects the matching typed option and keeps manual change available. Direct /kontakt/ and home /#kontakt without context keep the first option; unknown or malformed context retains it and never becomes a new option or form content.
- Required fields use browser-native validation; the site has no custom submit handler.
- The same typed explanation and subject-bearing fallback email link appear inside the form on home and /kontakt/; aria-describedby associates the note with the form.

## Expected outcome

The form requests a plain-text mail-client handoff to kontakt@svardentreprenad.se with the configured subject and the actually selected Tjänst option; delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use the address linked in the explanation or copy it into working email software and include project details manually; the fallback link still needs an email handler.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)
- [src/lib/inquiry-service.ts](../../../../src/lib/inquiry-service.ts)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a static email handoff form and footer contact email` (direct): Checks form method, mailto action, text/plain encoding, named controls, submit button, aria-describedby note association, explanation before the button, in-form fallback recipient/subject and absence of a sent confirmation. Does not send mail, exercise native validation or establish a separate home rendering.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `carries the stable $id service identity in the $path inquiry action` (direct): Parameterized over the five service pages; checks each rendered band link's `/kontakt/?tjanst=<service id>` destination against the typed service id.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `follows a service page inquiry action into contact, selects that service and preserves a later manual change` (direct): Follows the rendered link's URL into /kontakt/, checks the recognized Dränering preselection in the named service select and a manual change to Annat. Does not send mail.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the typed default service selection on home and direct contact without inquiry context` (direct): Checks the first typed option without context on home and /kontakt/.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declarations `retains the default service selection for unrecognized inquiry context $context` and `retains the default service selection when a recognized service has no matching typed option` (direct): Check default retention and that context text never becomes a new option, element or script content.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
