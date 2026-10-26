# F4-US1: Move from home orientation to a useful page

Feature: [F4 — Home, navigation and route recovery](../../navigation-and-recovery.md)  
Status: current  
Reviewed: 2026-10-26

As a site visitor, I want to use route navigation so I can reach service selection, company information or inquiry preparation.

## Preconditions

- The static entry document is served.

## Flow

1. Open /.
2. Read the hero's service and quote actions and Tydliga vägar för rätt uppdrag shortcuts.
3. Use the desktop services dropdown, mobile menu or footer links.
4. On subpages use the Hem breadcrumb to return.

## Variants

- Header services links expose all five detail routes.
- An open mobile menu closes on Escape from a link or the focused toggle, restores focus to the toggle and can reopen; the toggle also closes it by click. Other keys do not dismiss it.
- inventory.primaryRoutes has five shortcuts; it is not the full nine-route registry.
- Subpage heroes and the home hero use decorative photos; service-card images have route alt text.

## Expected outcome

A declared static route can be selected for F1, F2 or F3.

## Failure and recovery

A missing host artifact can fail before React mounts; this catalog does not claim host-level fallback.

Use a known route or the home URL; repair/redeploy static route artifacts if missing.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `shows the requested primary navigation labels as real route links` (direct): Checks route-link destinations, not mobile-menu or dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `dismisses mobile navigation with Escape, restores focus, and allows reopening` (direct): Checks menu expanded state, Escape from a link and the focused toggle, focus restoration, reopening, click dismissal and a non-dismissal key. Does not establish responsive layout or desktop dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `links from the home page to active static subpage paths only` (direct): Checks home CTA destinations and excludes retired routes.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `preserves Swedish UTF-8 characters in representative user-facing copy` (direct): Checks representative Swedish labels remain readable.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps every current route aligned with a page-specific visual asset` (technical): Checks nine declared visual metadata mappings, not rendered photos or onError fallbacks.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

