# F3-US2: Use the contact address without the form

Feature: [F3 — Prepare an initial project inquiry](../../project-inquiry.md)  
Status: current  
Reviewed: 2026-10-24

As a project visitor, I want to find the visible company email address so I can make contact with a working email tool.

## Preconditions

- The page has loaded enough to render the contact section or footer.

## Flow

1. Read kontakt@svardentreprenad.se in the contact section or footer.
2. Use its email link or copy the address into an email tool.
3. Describe the project and a way to reply.

## Variants

- Footer contact is available on every ready routed page and not-found.
- ContactLinkBand on about, index and service pages leads to /kontakt/ rather than embedding another form.

## Expected outcome

The visitor has the company email address; no website receipt is implied.

## Failure and recovery

The mailto link still depends on the user's email handler.

Copy the address into a working client or webmail; the site supplies no alternative transport.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders a static email handoff form and footer contact email` (direct): Checks the visible contact-address link points to the configured mailto address.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

