# F3: Prepare an initial project inquiry

Reviewed: 2026-10-24. Runtime: `ui`. Product role: `customer_outcome`.

The current outcome is preparing an addressed inquiry with useful project
details. The website cannot establish that an email was sent, delivered or read.

## Entry points and current behavior

Home `/#kontakt` and `/kontakt/` render the same Contact section.
The dedicated route adds a hero and breadcrumb. The quote/site-visit prompt and
visible email address sit beside the form. Every ready page's footer also shows
the configured email. About, index and service pages use a contact link band.

[F3-US1](user-stories/F3/F3-US1.md) collects:
Namn; Kundtyp (Privatperson, Företag, BRF eller fastighetsägare);
Tjänst (the five services or Annat); and Meddelande, whose placeholder asks for
project, place and desired timing. No phone/email reply field is collected.
Required controls use native browser validation.

The form uses `method="post"`, `encType="text/plain"` and a `mailto:` action
with an encoded subject. It has no custom submit handler, stored draft,
confirmation screen or backend receipt. The visitor must review/send in their
email software. [F3-US2](user-stories/F3/F3-US2.md) covers using the visible
address directly.

## Outcome and support

Observable checks are locating the four controls and inspecting the configured
recipient/subject handoff. An actual send must be confirmed outside the site.
No funnel measurement, delivery tracking or response-time metric is installed.
F4 supplies navigation. Service pages help the visitor choose a service but
do not preselect the contact form from the referring route.

## Source, states and evidence

[Typed contact content](../../src/data/siteContent.ts) owns the recipient,
subject, labels, choices and email items.
[Contact and Footer](../../src/pages/SiteHomePage.tsx) render the form and
address. [ADR 0006](../adrs/0006-static-email-contact-handoff.md) is the accepted
runtime boundary: no server, third-party form endpoint, database, secrets,
authentication or spam-control workflow.

The existing declaration `renders a static email handoff form and footer contact email`
checks the actual form attributes, named controls, submit button and email link.
It does not execute sending, native required-field validation or email software.
The about/contact route declaration checks the dedicated contact heading.

Global load/error/empty states apply here too. A mail handler can fail without
a website error state. Recovery is copying the displayed address and details
into a working email tool. There is no persistent draft recovery or alternate
submission channel. Project details leave through the visitor's external mail
handoff; this catalog makes no privacy-law or compliance assurance claim.

## What Works Less Well

A visitor without a configured compatible email handler can fill the form and
still fail to start an inquiry. The button wording can be read as website
submission, while there is no delivery assurance or site receipt. The visible
fallback address helps, but still requires external email and manual copying.
No reply address is collected in the form; contactability depends on the
external email message and what the visitor includes.

## Roadmap

- Fix: explain the mail-client requirement and lack of a website receipt near
  the form; provide clear instructions for copying the address and project details.
- Expand: assess reliable submission, reply details, spam handling and
  confirmation only in a separately approved runtime/service decision, as
  required by ADR 0006. Stored inquiries or CRM integration are not implemented here.

