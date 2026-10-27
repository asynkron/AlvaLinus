# F4-US3: Bypass repeated navigation with the keyboard

Feature: [F4 — Home, navigation and route recovery](../../navigation-and-recovery.md)  
Status: current  
Reviewed: 2026-10-27

As a keyboard visitor, I want to use Hoppa till innehåll before the header links so I can reach the page body without traversing repeated navigation.

## Preconditions

- React has mounted and the page shell is rendered.

## Flow

1. Reach Hoppa till innehåll before the repeated header navigation.
2. Activate the #content link to bypass the header.
3. Read the routed body or current availability message.

## Variants

- The link is visually hidden until focused, when existing focus styles reveal it.
- Ready home, subpage and in-app not-found views share a focusable #content wrapper with scroll margin.
- Loading, error and empty states retain one #content section but do not give that section tabindex=-1.

## Expected outcome

A stable page-body anchor is available before header navigation on all rendered states; ready content has a programmatically focusable destination.

## Failure and recovery

A host error before React mounts cannot offer the link. Availability-state sections have an anchor but no explicit focusability attribute; browser focus/scroll behavior is not established by DOM assertions.

Use ordinary keyboard navigation if anchor behavior is unavailable; a missing static entry document requires host/artifact repair.

## Source and evidence

- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `offers a Swedish skip link before header navigation that targets the stable page content` (direct): Checks the Swedish link, #content destination, order before header navigation and focusable ready-page target; does not exercise browser anchor activation or CSS visibility.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps exactly one stable content target in the $label state` (direct): Parameterized ready home, subpage, unknown-route, loading, error and empty cases check one matching target; ready targets have tabindex=-1. Does not assert focusability of availability-state sections or browser scrolling.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

