# F3-US1: Prepare a quote or site-visit inquiry

Feature: [F3 — Prepare an initial project inquiry](../../project-inquiry.md)  
Status: current  
Reviewed: 2026-10-27

As a property owner or project representative, I want to enter initial project details in the inquiry form so I can prepare a useful first discussion.

## Preconditions

- Home or /kontakt/ has loaded.
- A mail client is configured for the handoff.

## Flow

1. Find Kontakta oss för offert.
2. Enter Namn, choose Kundtyp and Tjänst, and describe the project, place and desired timing in Meddelande.
3. Read the explanation before the submit button: review and send in your own email program; the website cannot confirm delivery.
4. Select Skicka offertförfrågan.
5. Review and send in the external mail client if it opens.

## Variants

- Customer types are Privatperson, Företag, and BRF eller fastighetsägare.
- Services include the five offered areas and Annat.
- Pool excavation is part of Grävjobb, not a separate Pool option.
- Required fields use browser-native validation; the site has no custom submit handler.
- The same typed explanation and subject-bearing fallback email link appear inside the form on home and /kontakt/; aria-describedby associates the note with the form.

## Expected outcome

The form requests a plain-text mail-client handoff to kontakt@svardentreprenad.se with the configured subject; delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use the address linked in the explanation or copy it into working email software and include project details manually; the fallback link still needs an email handler.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a static email handoff form and footer contact email` (direct): Checks form method, mailto action, text/plain encoding, named controls, submit button, aria-describedby note association, explanation before the button, in-form fallback recipient/subject and absence of a sent confirmation. Does not send mail, exercise native validation or establish a separate home rendering.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
