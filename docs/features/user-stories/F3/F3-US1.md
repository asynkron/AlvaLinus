# F3-US1: Prepare a quote or site-visit inquiry

Feature: [F3 — Prepare an initial project inquiry](../../project-inquiry.md)  
Status: current  
Reviewed: 2026-10-24

As a property owner or project representative, I want to enter initial project details in the inquiry form so I can prepare a useful first discussion.

## Preconditions

- Home or /kontakt/ has loaded.
- A mail client is configured for the handoff.

## Flow

1. Find Kontakta oss för offert.
2. Enter Namn, choose Kundtyp and Tjänst, and describe the project, place and desired timing in Meddelande.
3. Select Skicka offertförfrågan.
4. Review and send in the external mail client if it opens.

## Variants

- Customer types are Privatperson, Företag, and BRF eller fastighetsägare.
- Services include the five offered areas and Annat.
- Pool excavation is part of Grävjobb, not a separate Pool option.
- Required fields use browser-native validation; the site has no custom submit handler.

## Expected outcome

The form requests a plain-text mail-client handoff to kontakt@svardentreprenad.se with the configured subject; delivery is not established.

## Failure and recovery

The mail handler may fail to open; the page cannot confirm acceptance or sending.

Use the visible email address and include project details manually.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a static email handoff form and footer contact email` (direct): Checks form method, mailto action, text/plain encoding, named controls, submit button and email link; does not send mail or exercise native validation.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

