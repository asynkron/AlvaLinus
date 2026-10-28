# F3: Prepare an initial project inquiry

Reviewed: 2026-10-28. Runtime: `ui`. Product role: `customer_outcome`.

The current outcome is preparing an addressed inquiry with useful project
details. The website cannot establish that an email was sent, delivered or read.

## Entry points and current behavior

Home `/#kontakt` and `/kontakt/` render the same Contact section.
The dedicated route adds a hero and breadcrumb. The quote/site-visit prompt and
visible email address sit beside the form. Every ready page's footer also shows
the configured email. About, index and service pages use a contact link band.
On the five service pages the band's inquiry action targets
`/kontakt/?tjanst=<service id>`, where the id is the typed service record id;
about and index keep the generic `/kontakt/` destination. The parameter is the
only inquiry context mechanism: no additional route, router dependency,
persistence or personal-data field is involved.

[F3-US1](user-stories/F3/F3-US1.md) collects:
Namn; Kundtyp (Privatperson, Företag, BRF eller fastighetsägare);
Tjänst (the five services or Annat); and Meddelande, whose placeholder asks for
project, place and desired timing. No phone/email reply field is collected.
Required controls use native browser validation.

The form uses `method="post"`, `encType="text/plain"` and a `mailto:` action
with an encoded subject. It has no custom submit handler, stored draft,
confirmation screen or backend receipt. A typed note beside the submit action
explains that the visitor reviews and sends the inquiry in their own email
software, that the website cannot confirm delivery, and links the configured
address directly from the form for a failed handoff. The note is associated
with the form through `aria-describedby`. [F3-US2](user-stories/F3/F3-US2.md)
covers using the visible address directly.

## Outcome and support

Observable checks are locating the four controls and inspecting the configured
recipient/subject handoff, and explaining the external send step and fallback
before submitting. An actual send must be confirmed outside the site.
No funnel measurement, delivery tracking or response-time metric is installed.
F4 supplies navigation. A service-page inquiry action opens `/kontakt/` with
that service preselected in the existing Tjänst select when the typed service
record's title matches a configured option. The visitor can still choose
another option, and the actually selected option is the named `service` value
of the native mail handoff. Direct `/kontakt/` and home `/#kontakt` without
context keep the first option. Unknown or malformed context safely retains the
default and never becomes a new option or form content.

## Source, states and evidence

[Typed contact content](../../src/data/siteContent.ts) owns the recipient,
subject, labels, choices and email items.
[Contact and Footer](../../src/pages/SiteHomePage.tsx) render the form and
address, resolve the query context against the typed service records and
select options, and build the service-page band destinations.
[ADR 0006](../adrs/0006-static-email-contact-handoff.md) is the accepted
runtime boundary: no server, third-party form endpoint, database, secrets,
authentication or spam-control workflow.

The existing declaration `renders a static email handoff form and footer contact email`
checks the actual form attributes, named controls, submit button, handoff-note
association and in-form fallback link. It does not execute sending, native
required-field validation or email software. The about/contact route
declaration checks the dedicated contact heading. The parameterized
`carries the stable $id service identity in the $path inquiry action`
declaration checks each of the five service-page band destinations.
`follows a service page inquiry action into contact, selects that service and
preserves a later manual change` follows the rendered link's URL into
`/kontakt/`, checks the recognized preselection in the named select and keeps
a manual change. The missing-context, unrecognized-context and
recognized-service-without-option declarations check default retention and
that context text never becomes a new option or form content.

Global load/error/empty states apply here too. A mail handler can fail without
a website error state. Recovery is copying the displayed address and details
into a working email tool. There is no persistent draft recovery or alternate
submission channel. Project details leave through the visitor's external mail
handoff; this catalog makes no privacy-law or compliance assurance claim.

## What Works Less Well

Sending still depends on a configured compatible email handler; the website
cannot confirm delivery or receipt by design. The in-form fallback link and
visible address still require external email and manual copying of project
details when the handoff fails. No reply address is collected in the form;
contactability depends on the external email message and what the visitor
includes.

## Roadmap

- Fix (delivered 2026-10-28): service-page inquiry actions carry the typed
  service id into `/kontakt/` and the form preselects the matching option;
  manual selection and the static boundary are preserved.
- Expand: assess reliable submission, reply details, spam handling and
  confirmation only in a separately approved runtime/service decision, as
  required by ADR 0006. Stored inquiries or CRM integration are not implemented here.

