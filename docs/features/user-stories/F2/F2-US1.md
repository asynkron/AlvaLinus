# F2-US1: Read the company approach before making contact

Feature: [F2 — Assess the company and working approach](../../company-confidence.md)  
Status: current  
Reviewed: 2026-10-24

As a prospective customer, I want to read the company description so I can decide whether its stated approach fits the project.

## Preconditions

- The /om-oss/ route and about paragraphs are configured.

## Flow

1. Open Om oss.
2. Read the paragraphs on experience, equipment, communication and responsibility.
3. Follow the contact link band.

## Variants

- The home and services-index trust cards summarize breadth, care and experience.
- The current empty partners array suppresses collaborator claims.

## Expected outcome

The visitor can find the stated approach and a contact next step.

## Failure and recovery

Missing content is not evidence of certification; the UI does not verify credentials.

Use the contact email to ask for project-specific evidence.

## Source and evidence

- [src/data/siteContent.ts](../../../../src/data/siteContent.ts)
- [src/pages/SiteHomePage.tsx](../../../../src/pages/SiteHomePage.tsx)

- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `renders dedicated about and contact paths` (direct): Checks the about heading and specific company paragraphs.
- vitest, [src/pages/SiteHomePage.test.tsx](../../../../src/pages/SiteHomePage.test.tsx), declaration `hides partner content when no current collaborator is configured` (direct): Checks that unconfigured collaborator names and section are absent.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

