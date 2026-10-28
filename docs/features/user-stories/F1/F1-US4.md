# F1-US4: Locate excavation for foundations, utilities or a pool

Feature: [F1 — Choose a suitable groundworks service](../../service-selection.md)  
Status: current  
Reviewed: 2026-10-28

As a project visitor, I want to read the Grävjobb service page so I can place pool excavation within the excavation service rather than seek a separate pool page.

## Preconditions

- The matching route and its sourceId service record exist.

## Flow

1. Open /gravjobb/.
2. Read the route introduction, service summary and tags: Grävning, Husgrund, Poolgrävning.
3. Read När tjänsten passar and the four process steps.
4. Follow Kontakta oss to /kontakt/?tjanst=gravjobb with Grävjobb preselected and still changeable in the inquiry form.

## Variants

- The suitability aside and process are shared across service pages.
- The page hero hides a failed photo, keeping its text on the dark background.

## Expected outcome

The visitor can describe how Grävjobb relates to the project and reach inquiry preparation.

## Failure and recovery

A route without its service record shows Sidan finns inte; no automatic inquiry or quote is created.

Choose another declared service or contact the company from the footer.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders dedicated Dränering and Grävjobb pages` (direct): Checks the dedicated Grävjobb heading and pool-excavation summary.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders representative service tags including pool digging under Grävjobb` (direct): Checks Poolgrävning on the home service overview; does not exercise every detail-page tag.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

