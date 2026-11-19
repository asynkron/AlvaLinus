# F4-US1: Move from home orientation to a useful page

Feature: [F4 — Home, navigation and route recovery](../../navigation-and-recovery.md)  
Status: current  
Reviewed: 2026-11-18

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
- The desktop Tjänster trigger keeps its `aria-haspopup` declaration and reveals its registry-ordered dropdown panel on keyboard focus; the Kalkyler disclosure (desktop details/summary and the nested mobile-menu copy) exposes the two calculator links from `chrome.calcMenu` and marks the active calculator link only on calculator pages.
- Header (desktop and mobile) and footer page and service links derive their Swedish labels, hrefs and order from the typed route registry, so a route edit is one declaration in `src/data/siteContent.ts` instead of parallel markup edits.
- An open mobile menu closes on Escape from a link or the focused toggle, restores focus to the toggle and can reopen; the toggle also closes it by click. Tab and Shift+Tab are not cancelled. Escape elsewhere in the header leaves the menu and focus unchanged.
- inventory.primaryRoutes has six shortcuts; it is not the full twelve-route registry.
- Subpage heroes and the home hero use decorative images requested at high fetch priority (photographs except the staffing, about and contact SVG heroes) while service-card images stay lazy; a failing home hero photo hides its image without a retry loop while the hero content remains. Service-card images have route alt text.
- Every emitted document head (home, every stamped subpage artifact and `dist/404.html`) carries one woff2 font preload link per emitted font asset, injected at build time from that build's bundle via `vite.config.ts` and `scripts/route-artifacts.mjs` so font fetch starts at HTML parse time; the injection is a deterministic no-op when a build emits no woff2 assets, and the static route assertion requires exactly those tags byte-for-byte on every emitted document.
- At md+ widths the desktop nav links, the Tjänster trigger and the desktop Kalkyler summary carry `py-2` vertical tap-target padding that reaches at least 32px of computed tap height (roughly 36px) inside the unchanged `min-h-16` sticky header row, while the mobile menu targets stay unchanged.
- The footer's page and service links and the contact email link are inline-flex tap targets carrying `py-2` vertical padding that reaches at least 36px of computed tap height inside the unchanged footer identity, grid and list layout.

## Expected outcome

A declared static route can be selected for F1, F2, F3, F5 or F6.

## Failure and recovery

A missing host artifact can fail before React mounts; this catalog does not claim host-level fallback.

Use a known route or the home URL; repair/redeploy static route artifacts if missing.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)
- [src/styles.primary-contrast.test.ts](../../../../src/styles.primary-contrast.test.ts)
- [src/styles.header-nav-tap-targets.test.ts](../../../../src/styles.header-nav-tap-targets.test.ts)
- [src/styles.footer-tap-targets.test.ts](../../../../src/styles.footer-tap-targets.test.ts)
- [vite.config.ts](../../../../vite.config.ts)
- [scripts/route-artifacts.mjs](../../../../scripts/route-artifacts.mjs)
- [scripts/assert-static-routes.mjs](../../../../scripts/assert-static-routes.mjs)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `shows the requested primary navigation labels as real route links` (direct): Checks route-link destinations, not mobile-menu or dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `derives header, mobile menu and footer navigation from the typed route registry` (direct): Checks desktop, mobile-menu and footer destinations, Swedish labels and link order against `content.routes` as the single declaration source; does not exercise dropdown interaction or responsive layout.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders the shared page chrome from the typed registry` (direct): Checks the brand link and logo, the not-found heading, eyebrow, path summary and shortcuts label, the breadcrumb navigation name and Hem link, the service hero eyebrow and guidance heading, the contact band eyebrow and CTA destination, and the footer tagline, column headings, navigation names and copyright against `content.chrome`. Registry-attribute evidence only; it does not establish responsive layout or visual styling.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the desktop Tjänster dropdown trigger focusable with its five registry-ordered service links` (direct): Checks the trigger's aria-haspopup declaration, focusability, uncancelled Tab/Shift+Tab events and the panel's five service links in registry order with their Swedish accessible names. JSDOM does not establish browser tab order or the panel's focus-only CSS reveal.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `opens the desktop Kalkyler disclosure straight to the drainage and driveway calculators` (direct): Checks the desktop details/summary disclosure exposes the Dränering and Uppfart calculator links with their registry destinations.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the same Kalkyler calculator links inside the mobile menu disclosure` (direct): Checks the mobile menu nests the same two calculator links with the same destinations.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `marks the active calculator link inside Kalkyler and highlights the group only on calculator pages` (direct): Checks active-link marking inside Kalkyler and that the group highlight applies only on the two calculator pages.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `dismisses mobile navigation with Escape from its %s and allows reopening` (direct): Parameterized link and toggle cases check menu expanded state, Escape dismissal, focus restoration, reopening, click dismissal and uncancelled Tab/Shift+Tab events. JSDOM does not establish actual browser Tab movement, responsive layout or desktop dropdown interaction.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps mobile navigation open and preserves focus when Escape is pressed elsewhere in the header` (direct): Checks that Escape on the brand link outside the menu/toggle leaves the open menu and current focus unchanged.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `links from the home page to active static subpage paths only` (direct): Checks home CTA destinations and excludes retired routes.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `preserves Swedish UTF-8 characters in representative user-facing copy` (direct): Checks representative Swedish labels remain readable.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps every current route aligned with a page-specific visual asset` (technical): Checks twelve declared visual metadata mappings, not rendered photos or onError fallbacks.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `fetches above-the-fold hero images at high priority while service card images stay lazy` (direct): Checks fetchpriority=high, decorative alt/aria-hidden and no lazy-loading attribute on the home and about heroes, lazy service-card images without fetchpriority, and that a failing about-hero image hides via display:none. DOM-attribute evidence only; it does not establish real network scheduling or an LCP improvement.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `keeps the decorative home hero photo on the success path` (direct): Checks the home hero photo's src and its empty decorative alt/aria-hidden treatment.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `hides a failing home hero photo without a retry loop and keeps the hero intact` (direct): Checks display:none hiding across repeated image errors while the headline, intro, actions and stats remain. Does not establish browser image loading or CSS visibility.
- vitest, [src/styles.primary-contrast.test.ts](../../../../src/styles.primary-contrast.test.ts), declaration `keeps the on-dark accent readable on the navy header, hero, and footer surfaces at WCAG AA` (technical): Token-level stylesheet check pins the `--primary-on-dark` accent against the foreground token at 4.5:1, the pairing the shared navy header, hero and footer chrome renders. It reads the root tokens only and does not render chrome or measure a browser.
- vitest, [src/styles.primary-contrast.test.ts](../../../../src/styles.primary-contrast.test.ts), declaration `keeps both accent tokens in the orange brand hue family` (technical): Token-level stylesheet check pins the primary and on-dark accent hues to the declared orange band, the shared brand identity behind the chrome accents. It constrains hue only; it does not itself re-check contrast or any rendered element.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `selects emitted woff2 asset entries as sorted root-relative hrefs` (technical): Checks that font href selection keeps only emitted `.woff2` asset entries, deduplicated and sorted by fileName into root-relative hrefs so the emitted link order stays deterministic regardless of bundler emission order. Fixture-bundle evidence over helper composition; it does not run a real Vite build or observe browser font fetching.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `composes the exact single-line font preload tag with crossorigin and the woff2 type` (technical): Pins the exact single-line `<link rel="preload" as="font" type="font/woff2" crossorigin />` tag shape and rejects hrefs that are not root-relative emitted `.woff2` assets, including whitespace and quote characters. Helper-composition evidence; it does not exercise a browser preload fetch.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `injects exactly the emitted font preload tags before the head-close tag in sorted order` (technical): Checks injection places exactly the composed font preload tags directly before `</head>` in sorted order and returns a document built without emitted font assets unchanged. Fixture-document evidence; it does not run the production build pipeline.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `keeps injected font preloads intact through the home-hero strip and commutes with it` (technical): Checks the font preload injection and the home-hero preload strip commute, so stripping the home image preload leaves every injected font preload intact and the `as="font"` emission stays distinct from the `as="image"` hero gates. Fixture-document evidence only.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `requires exactly the emitted font preloads on every emitted document when the build emitted font assets` (technical): Artifact-gate check that every emitted document fixture (root, subpages and `dist/404.html`) carries exactly the expected font preload tags byte-for-byte, with paired rejections for dropped, partial and diverging tags. In-memory emitted-document text; it does not prove a real dist deployment or browser fetch scheduling.
- vitest, [scripts/route-artifacts.test.mjs](../../../../scripts/route-artifacts.test.mjs), declaration `requires zero font preloads on every emitted document when the build emitted no font assets` (technical): Checks the deterministic no-op direction: a build fixture without emitted font assets passes the artifact gate with zero font preload links on every document. In-memory fixture evidence; it does not prove how a real build inlines fonts.
- vitest, [src/styles.header-nav-tap-targets.test.ts](../../../../src/styles.header-nav-tap-targets.test.ts), declaration `adds vertical tap-target padding to every md+ header nav target` (technical): Source-text check pins the md+ desktop nav element, the desktop nav link className carrying `py-2` and both desktop trigger classNames with `py-2`, the tap-target padding fk238 delivered. It reads the page source only and does not render the header or measure a browser.
- vitest, [src/styles.header-nav-tap-targets.test.ts](../../../../src/styles.header-nav-tap-targets.test.ts), declaration `keeps the mobile menu targets and the sticky header row unchanged` (technical): Source-text check pins the unchanged mobile page-link, sub-link, Kalkyler-summary and toggle classNames plus the single `min-h-16` header row height, so the desktop enlargement leaves the mobile targets and sticky row untouched.
- vitest, [src/styles.header-nav-tap-targets.test.ts](../../../../src/styles.header-nav-tap-targets.test.ts), declaration `reaches at least 32px of tap height inside the unchanged 64px header row` (technical): Compiled-utility check computes the `text-sm py-2` target's line height plus vertical padding at at least 32px and no taller than the `min-h-16` row minimum. Tailwind-compile evidence; it does not render the header in a browser or measure real touch input.
- vitest, [src/styles.footer-tap-targets.test.ts](../../../../src/styles.footer-tap-targets.test.ts), declaration `blockifies every footer nav link and keeps the email link as an inline-flex target` (technical): Source-text check pins the footer page and services nav link classNames and the email link className as inline-flex targets carrying `py-2`, the tap-target padding fk257 delivered. It reads the page source only and does not render the footer or measure a browser.
- vitest, [src/styles.footer-tap-targets.test.ts](../../../../src/styles.footer-tap-targets.test.ts), declaration `keeps the footer identity, grid and list layout unchanged` (technical): Source-text check pins the unchanged four-column footer grid, the two nav list classNames, the footer shell element and colors, so the enlargement leaves the footer structure untouched.
- vitest, [src/styles.footer-tap-targets.test.ts](../../../../src/styles.footer-tap-targets.test.ts), declaration `reaches at least 36px of tap height for the unchanged text-sm footer links` (technical): Compiled-utility check computes the `text-sm inline-flex py-2` target's line height plus vertical padding at at least 36px. Tailwind-compile evidence; it does not render the footer in a browser or measure real touch input.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

## Company telephone contact (fk274, 2026-11-19)

The home contact section, /kontakt/ and shared footer display 070-214 67 83
as a native `tel:+46702146783` link alongside linus.svardd@outlook.com.
The footer derives the telephone item from the same typed contact items as
the contact section. Its link occupies its own row with vertical padding;
existing responsive columns remain in place.

The direct SiteHomePage.test.tsx declaration
`offers the company phone contact with native keyboard access on %s`
checks the home, contact and both calculator footers, literal telephone
href/text, focusability and the retained email; it also checks the contact
section on home and /kontakt/. It does not exercise a phone handler or render
mobile/desktop layout. The footer stylesheet test no longer counts identical
color substrings, which would incorrectly forbid adding another contact link.
Existing source layout checks and compiled tap-height coverage remain.
