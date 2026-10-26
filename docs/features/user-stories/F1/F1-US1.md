# F1-US1: Compare the offered service areas

Feature: [F1 — Choose a suitable groundworks service](../../service-selection.md)  
Status: current  
Reviewed: 2026-10-26

As a project visitor, I want to compare service summaries and tags so I can find the relevant area before reading details.

## Preconditions

- Static content has at least one service.

## Flow

1. Open / or /tjanster/.
2. Compare Stensättning, Markarbete, Grävjobb, Dränering and Trädgårdsplanering.
3. Follow Läs mer to the appropriate detail route.

## Variants

- Home adds hero, route shortcuts and process.
- The services index adds trust content and an inquiry link band.
- Service card photos fall back to route SVGs on image error; a failed SVG removes the image while keeping the title, summary and Läs mer link. Neighboring cards retain their own images and content.

## Expected outcome

A matching service route can be selected from the five cards.

## Failure and recovery

No services shows Inget innehåll ännu instead of the route body.

Reload after a content deployment; use the header links to choose a route.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders owner-approved home content, service, process, partner, and contact areas` (direct): Checks the home service and process areas, not the services-index rendering.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders representative service tags including pool digging under Grävjobb` (direct): Checks representative service tags on home.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `falls back to the route SVG on the first photo error and removes the image when the fallback also fails` (direct): Checks the home Stensättning card's photo/SVG failures, retained title, summary and service link, and terminal image removal. Does not render the services index or subpage heroes.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps neighboring service cards and their successful images untouched when one card image fails twice` (direct): Checks that failure of the home Stensättning card leaves Markarbete and Grävjobb images and content available; does not establish dedicated detail-page rendering.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

