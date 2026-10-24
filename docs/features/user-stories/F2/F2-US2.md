# F2-US2: Understand the proposed project sequence

Feature: [F2 — Assess the company and working approach](../../company-confidence.md)  
Status: current  
Reviewed: 2026-10-24

As a prospective customer, I want to read the four process steps so I can know what the company says happens after first contact.

## Preconditions

- Home or a configured service detail route is available.

## Flow

1. Open / or a service detail page.
2. Read Första kontakt, Genomgång, Utförande and Slutfört arbete.
3. Prepare questions for the initial discussion.

## Variants

- The same static process appears on each service detail page.
- No booking, project status or live progress is shown.

## Expected outcome

The stated sequence is available as information; no work order is scheduled.

## Failure and recovery

The site cannot report actual execution status or confirm a site visit.

Discuss project timing and commitments directly with the company.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders owner-approved home content, service, process, partner, and contact areas` (direct): Checks the home process heading only; does not verify business execution or every step.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

