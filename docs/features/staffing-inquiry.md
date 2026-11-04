# F5: Prepare a company staffing inquiry

Reviewed: 2026-11-04. Runtime: `ui`. Product role: `customer_outcome`.

Companies that need hired help can prepare a staffing inquiry addressed to the
company. The website cannot establish that an email was sent, delivered or
read; the visitor reviews and sends the prepared draft themselves.

## Entry points and current behavior

`/inhyrning/` renders a dedicated page whose header link (desktop, mobile and
footer) is the typed `För företag` route (id `inhyrning`) declared in
[siteContent](../../src/data/siteContent.ts); unknown routes expose the same
destination through the not-found shortcuts. The page hero carries the
breadcrumb Hem / För företag, the heading "Söker ni en F-skattare?" and an intro
line. The form sits beside a guidance aside ("En tydlig start").

The form collects, in order: Företagets namn; Kontaktperson; E-post;
Telefon (valfritt); Organisationsnummer (valfritt); Vad behöver ni inhyrd
hjälp med?; Erbjudet timpris (with the note "Ange gärna i beskrivningen om
priset är inklusive eller exklusive moms."); Hur länge gäller uppdraget?; and
Beskriv ärendet. Phone and organization number are optional; every other field
is required. Company, contact, email and phone inputs carry the matching
autocomplete hints.

The form uses custom Swedish validation instead of native bubbles:
`noValidate` plus a submit handler that checks the required values, rejects an
email without a valid shape, and rejects an offered rate that is missing,
non-numeric or negative. Missing or invalid fields get per-field Swedish
error messages associated through `aria-describedby` and `aria-invalid`, an
`role="alert"` summary, and focus moves to the first invalid field. Correcting
a field clears its message.

A valid submit builds a `mailto:` draft to the configured contact address
(`kontakt@svardentreprenad.se`) with the subject "Förfrågan om inhyrning" and
a labeled body containing every supplied value; empty optional fields are
marked with a dash. The page hands the draft to the visitor's email program
and shows a `role="status"` confirmation that says the draft is opened in the
visitor's own email program, that the visitor sends the email themselves, that
the website cannot send or confirm delivery, and repeats the draft as an
"Öppna utkastet igen" fallback link. The static help line beside the submit
button states the same handoff before submitting.

## Outcome and support

Observable checks are locating the nine controls in mockup order, reading the
Swedish validation messages for missing company details, an invalid email and
a negative rate, and inspecting the drafted recipient, subject and body after a
valid submit. An actual send must be confirmed outside the site. No funnel
measurement, delivery tracking or response-time metric is installed. F4
supplies navigation. Unlike the F3 customer inquiry this form has no backend,
no select options, no stored draft and no confirmation screen; the handoff is
the page's single submission channel.

## Source, states and evidence

[Typed routes/content](../../src/data/siteContent.ts) owns the route, its
summary and the shared recipient address. [The inquiry page](../../src/pages/InquiryPage.tsx)
owns the field specs, validation, mailto composition and confirmation, and
receives the draft opener for tests; [SiteHomePage](../../src/pages/SiteHomePage.tsx)
routes `/inhyrning/` to the lazily loaded page inside the shared landmarks.
[ADR 0006](../adrs/0006-static-email-contact-handoff.md) remains the accepted
runtime boundary: no server, third-party form endpoint, database, secrets,
authentication or spam-control workflow.

The dedicated page declaration checks the nav link, heading, breadcrumb and
form presence. The field-order declaration checks labels, required and
optional attributes, autocomplete hints and the VAT note association. The
validation declarations check the Swedish messages, focus movement and that no
draft is opened for invalid input. The mail-draft declaration checks the
recipient, subject, labeled body values, optional-field dashes, the
self-send confirmation and the fallback link. The helper declaration checks
the validation function directly, including optional fields staying outside
the error set. These are in-memory DOM assertions; they do not send email or
establish responsive layout in a browser.

A mail handler can fail without a website error state. Recovery is copying the
displayed address and details into a working email tool, or using the
fallback link again. There is no persistent draft recovery or alternate
submission channel. Company details leave through the visitor's external mail
handoff; this catalog makes no privacy-law or compliance assurance claim.

## What Works Less Well

Sending still depends on a configured compatible email handler; the website
cannot confirm delivery or receipt by design. The fallback link still requires
an email handler. The rate is collected as a single number, so the VAT basis
relies on the visitor's description.

## Roadmap

- Expand: assess reliable submission, reply details, spam handling and
  confirmation only in a separately approved runtime/service decision, as
  required by ADR 0006. Stored inquiries or CRM integration are not implemented here.
