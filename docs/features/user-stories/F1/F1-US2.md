# F1-US2: Assess paving, stone surfaces and walls

Feature: [F1 — Choose a suitable groundworks service](../../service-selection.md)  
Status: current  
Reviewed: 2026-10-28

As a project visitor, I want to read the Stensättning service page so I can plan an entrance, path or courtyard with suitable finish and load-bearing preparation.

## Preconditions

- The matching route and its sourceId service record exist.

## Flow

1. Open /stensattning/.
2. Read the route introduction, service summary and tags: Marksten Örebro, Stenmurar, Finplanering.
3. Read När tjänsten passar and the four process steps.
4. Follow Kontakta oss to /kontakt/?tjanst=stensattning with Stensättning preselected and still changeable in the inquiry form.

## Variants

- The suitability aside and process are shared across service pages.
- The page hero hides a failed photo, keeping its text on the dark background.

## Expected outcome

The visitor can describe how Stensättning relates to the project and reach inquiry preparation.

## Failure and recovery

A route without its service record shows Sidan finns inte; no automatic inquiry or quote is created.

Choose another declared service or contact the company from the footer.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a dedicated service page with customer-facing guidance` (direct): Checks the Stensättning heading, suitability aside and next-step guidance.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

