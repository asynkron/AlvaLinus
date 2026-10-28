# F1-US3: Scope groundwork and site preparation

Feature: [F1 — Choose a suitable groundworks service](../../service-selection.md)  
Status: current  
Reviewed: 2026-10-28

As a project visitor, I want to read the Markarbete service page so I can identify a broad groundwork offer for a private, business or municipal project.

## Preconditions

- The matching route and its sourceId service record exist.

## Flow

1. Open /markarbete/.
2. Read the route introduction, service summary and tags: Schakt, Tomt, Anläggning.
3. Read När tjänsten passar and the four process steps.
4. Follow Kontakta oss to /kontakt/?tjanst=markarbete with Markarbete preselected and still changeable in the inquiry form.

## Variants

- The suitability aside and process are shared across service pages.
- The page hero hides a failed photo, keeping its text on the dark background.

## Expected outcome

The visitor can describe how Markarbete relates to the project and reach inquiry preparation.

## Failure and recovery

A route without its service record shows Sidan finns inte; no automatic inquiry or quote is created.

Choose another declared service or contact the company from the footer.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

No existing test declaration directly exercises this dedicated page. Source review supports the current story; executed acceptance coverage remains a gap.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

