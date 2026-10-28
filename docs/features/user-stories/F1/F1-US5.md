# F1-US5: Understand moisture protection around a foundation

Feature: [F1 — Choose a suitable groundworks service](../../service-selection.md)  
Status: current  
Reviewed: 2026-10-28

As a project visitor, I want to read the Dränering service page so I can recognize drainage work covering assessment, excavation and restoration around a foundation, wall or basement.

## Preconditions

- The matching route and its sourceId service record exist.

## Flow

1. Open /dranering/.
2. Read the route introduction, service summary and tags: Dränering, Mur, Fuktskydd.
3. Read När tjänsten passar and the four process steps.
4. Follow Kontakta oss to /kontakt/?tjanst=dranering with Dränering preselected and still changeable in the inquiry form.

## Variants

- The drainage page adds a paragraph on moisture protection around foundations, walls and basements.
- The page hero hides a failed photo, keeping its text on the dark background.

## Expected outcome

The visitor can describe how Dränering relates to the project and reach inquiry preparation.

## Failure and recovery

A route without its service record shows Sidan finns inte; no automatic inquiry or quote is created.

Choose another declared service or contact the company from the footer.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders dedicated Dränering and Grävjobb pages` (direct): Checks the dedicated Dränering heading and foundation moisture-protection paragraph.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

