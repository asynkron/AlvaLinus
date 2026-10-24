# F4-US2: Recognize unavailable content and recover to a known route

Feature: [F4 — Home, navigation and route recovery](../../navigation-and-recovery.md)  
Status: current  
Reviewed: 2026-10-24

As a site visitor, I want to interpret loading, error, empty and unknown-route feedback so I can avoid mistaking missing content for a successful page.

## Preconditions

- React has mounted.
- For not-found, content is ready and services is nonempty.

## Flow

1. Wait while Laddar innehåll is displayed.
2. If loading fails, read the error alert.
3. If services is empty, recognize Inget innehåll ännu.
4. For an unknown ready path, use a Sidan finns inte shortcut to a registered route.

## Variants

- Query/hash suffixes are removed and a missing trailing slash is normalized by the renderer.
- A service route with no matching service record uses not-found.
- Normal content is loaded asynchronously from a bundled module, without network I/O.

## Expected outcome

The rendered state identifies content availability and provides route recovery when ready.

## Failure and recovery

Error and empty states have no inline retry; the empty-services guard applies to all route kinds.

Reload for a fresh load or use header navigation; a content defect needs a corrected static deployment.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `starts with a loading state before static content resolves` (direct): Checks the initial loading label.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `shows an error state` (direct): Checks the error alert text.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `shows an empty state when static data has no services` (direct): Checks the empty-state heading.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `fails unknown paths gracefully` (direct): Checks not-found guidance and a home recovery link.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

