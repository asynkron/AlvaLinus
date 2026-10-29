# F4-US1: Move from home orientation to a useful page

Feature: [F4 — Home, navigation and route recovery](../../navigation-and-recovery.md)  
Status: current  
Reviewed: 2026-10-29

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
- Header (desktop and mobile) and footer page and service links derive their Swedish labels, hrefs and order from the typed route registry, so a route edit is one declaration in `src/data/siteContent.ts` instead of parallel markup edits.
- An open mobile menu closes on Escape from a link or the focused toggle, restores focus to the toggle and can reopen; the toggle also closes it by click. Tab and Shift+Tab are not cancelled. Escape elsewhere in the header leaves the menu and focus unchanged.
- inventory.primaryRoutes has five shortcuts; it is not the full nine-route registry.
- Subpage heroes and the home hero use decorative photos; a failing home hero photo hides its image without a retry loop while the hero content remains. Service-card images have route alt text.

## Expected outcome

A declared static route can be selected for F1, F2 or F3.

## Failure and recovery

A missing host artifact can fail before React mounts; this catalog does not claim host-level fallback.

Use a known route or the home URL; repair/redeploy static route artifacts if missing.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `shows the requested primary navigation labels as real route links` (direct): Checks route-link destinations, not mobile-menu or dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `derives header, mobile menu and footer navigation from the typed route registry` (direct): Checks desktop, mobile-menu and footer destinations, Swedish labels and link order against `content.routes` as the single declaration source; does not exercise dropdown interaction or responsive layout.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `dismisses mobile navigation with Escape from its %s and allows reopening` (direct): Parameterized link and toggle cases check menu expanded state, Escape dismissal, focus restoration, reopening, click dismissal and uncancelled Tab/Shift+Tab events. JSDOM does not establish actual browser Tab movement, responsive layout or desktop dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps mobile navigation open and preserves focus when Escape is pressed elsewhere in the header` (direct): Checks that Escape on the brand link outside the menu/toggle leaves the open menu and current focus unchanged.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `links from the home page to active static subpage paths only` (direct): Checks home CTA destinations and excludes retired routes.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `preserves Swedish UTF-8 characters in representative user-facing copy` (direct): Checks representative Swedish labels remain readable.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps every current route aligned with a page-specific visual asset` (technical): Checks nine declared visual metadata mappings, not rendered photos or onError fallbacks.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the decorative home hero photo on the success path` (direct): Checks the home hero photo's src and its empty decorative alt/aria-hidden treatment.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `hides a failing home hero photo without a retry loop and keeps the hero intact` (direct): Checks display:none hiding across repeated image errors while the headline, intro, actions and stats remain. Does not establish browser image loading or CSS visibility.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
