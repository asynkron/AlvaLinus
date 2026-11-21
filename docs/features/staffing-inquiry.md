# F5: Prepare a company staffing inquiry

Reviewed: 2026-11-21. Runtime: `ui`. Product role: `customer_outcome`.

Companies that need hired help can prepare a staffing inquiry addressed to the
company. The website cannot establish that an email was sent, delivered or
read; the visitor reviews and sends the prepared draft themselves.

## Entry points and current behavior

`/inhyrning/` renders a dedicated page whose header link (desktop, mobile and
footer) is the typed `Inhyrning` route (id `inhyrning`) declared in
[siteContent](../../src/data/siteContent.ts); unknown routes expose the same
destination through the not-found shortcuts. The page hero carries the
breadcrumb Hem / Inhyrning, the heading "Söker ni en F-skattare?" and an intro
line. The form sits beside a guidance aside ("En tydlig start").

The form collects, in order: Företagets namn; Kontaktperson; E-post;
Telefon (valfritt); Organisationsnummer (valfritt); Vad behöver ni inhyrd
hjälp med?; Erbjudet timpris (with the note "Ange gärna momsstatus för priset
i listan nedan eller i beskrivningen." and an optional "Momsstatus för
timpriset" select offering "inklusive moms" and "exklusive moms"); Hur länge
gäller uppdraget?; and Beskriv ärendet. Phone, organization number and the
rate's momsstatus select are optional; every other field is required. Company,
contact, email and phone inputs carry the matching autocomplete hints.

The form uses custom Swedish validation instead of native bubbles:
`noValidate` plus a submit handler that checks the required values, rejects an
email without a valid shape, and rejects an offered rate that is missing,
non-numeric or negative. Missing or invalid fields get per-field Swedish
error messages associated through `aria-describedby` and `aria-invalid`, an
`role="alert"` summary, and focus moves to the first invalid field. Correcting
a field clears its message.

A valid submit builds a `mailto:` draft to the configured contact address
(`linus.svardd@outlook.com`) with the subject "Förfrågan om inhyrning" and
a labeled body containing every supplied value, with a stated momsstatus added
beside the offered rate; empty phone and organization fields are marked with a dash, and
leaving the select on "Ej angivet" reproduces the earlier draft exactly. The
page hands the draft to the visitor's email program
and shows a `role="status"` confirmation that says the draft is opened in the
visitor's own email program, that the visitor sends the email themselves, that
the website cannot send or confirm delivery, and repeats the draft as an
"Öppna utkastet igen" fallback link. The static help line beside the submit
button states the same handoff before submitting.

Editing any of the nine fields or the optional momsstatus clears the previous
confirmation, selectable preview and reopen link while retaining the current form values. Editing
does not open another draft. A fresh valid submit creates the current draft;
invalid submission or restoring an earlier value cannot revive the old feedback.
This cannot retract a draft already opened in external email software.

## Outcome and support

Observable checks are locating the nine original form fields in mockup order plus the
optional momsstatus select, reading the Swedish validation messages for missing
company details, an invalid email and
a negative rate, and inspecting the drafted recipient, subject and body after a
valid submit. The same composition also renders a read-only selectable textarea
with recipient, subject and labeled body, even when the injected mail opener does
nothing. Swedish characters and internal newlines are preserved. An actual send must be confirmed outside the site. No funnel
measurement, delivery tracking or response-time metric is installed. F4
supplies navigation. Unlike the F3 customer inquiry this form has no backend,
no persistent draft and no confirmation screen; the visitor sends through
their own email tool.

## Source, states and evidence

[Typed routes/content](../../src/data/siteContent.ts) owns the route, its
summary and the shared recipient address. Since fk154 its typed registry
declaration `inquiry` (the `SiteInquiry` shape in
[site types](../../src/types/site.ts)) declares the page's Swedish copy: the
breadcrumb label, heading and intro, the form heading, note and aria label,
the error summary and submit label, the per-field Swedish labels, placeholders
and the rate's VAT hint with the optional mark, the rate's momsstatus select
label, empty option and declared options, every validation message, the
mail subject, the body template with `{placeholder}` substitution, the
momsstatus draft template and the empty-value dash, the `{recipient}`
mail-help and confirmation templates, the reopen prompt and link label, the selectable draft label, help and addressed
text template, and
the aside copy.
[The inquiry page](../../src/pages/InquiryPage.tsx) keeps the runtime
ownership: the input attribute specs in `inquiryFields` (optional flags, input
types, autocomplete tokens, `inputMode`, `min`/`step` and textarea rows), the
field order and email pattern, `validateInquiry` execution,
`composeInquiryDraft` composition using the shared recipient from
`contact.form.recipientEmail`, rendering with `aria-invalid` and
`aria-describedby` wiring, the alert summary and focus management, and the
status confirmation with the reopen fallback, and receives the draft opener
for tests; [SiteHomePage](../../src/pages/SiteHomePage.tsx)
routes `/inhyrning/` to the lazily loaded page inside the shared landmarks.
[ADR 0006](../adrs/0006-static-email-contact-handoff.md) remains the accepted
runtime boundary: no server, third-party form endpoint, database, secrets,
authentication or spam-control workflow.

The dedicated page declaration checks the nav link, heading, breadcrumb and
form presence. The field-order declaration checks labels, required and
optional attributes, autocomplete hints and the VAT note association. The separate
`renders the declared optional momsstatus select after the rate field with registry copy`
declaration maps to F5-US1 and checks the selector's order, optional attribute,
empty default and declared options. The validation
declarations check the Swedish messages, focus movement and that no draft is
opened for invalid input. The mail-draft declaration checks the recipient,
subject, labeled body values, the self-send confirmation and the fallback link;
a separate declaration checks phone and organization dashes in both outputs.
These existing page cases also inspect the selectable textarea against independent
expected recipient, subject and body values, including multiline Swedish text. F5-US2 additionally maps
`carries a stated momsstatus into the mail draft beside the offered rate` and
`keeps the mail draft byte-identical to the declared body when momsstatus is omitted`:
these inspect the decoded draft at an injected opener, including the selected
exklusive moms variant and omission without an invented basis. They do not launch
an email client or prove delivery. The helper declaration checks
the validation function directly, including optional fields staying outside
the error set. These are in-memory DOM assertions; they do not send email or
establish responsive layout in a browser. The 2026-11-11 review additionally
maps two stylesheet-level declarations as technical evidence:
[styles.field-border-contrast.test.ts](../../src/styles.field-border-contrast.test.ts)
pins the inquiry input and textarea boundary borders at WCAG AA non-text
contrast on white (F5-US1), and the token declaration in
[styles.primary-contrast.test.ts](../../src/styles.primary-contrast.test.ts)
pins the white submit-button label against its primary surface at WCAG AA
(F5-US2). The 2026-11-13 `fk208` change (PR #142, `2dddae4`) then tokenized the
form's focus-visible accents, and this 2026-11-14 review maps the declaration
`keeps every focus-visible outline on a 3px solid token outline with a 3px
offset` in
[styles.page-accent-contrast.test.ts](../../src/styles.page-accent-contrast.test.ts)
into F5-US2 as technical evidence: it pins the `.inquiry-field` inputs and
textarea, the `.inquiry-layout` buttons and links and the `.inquiry-alert`
summary to a 3px solid token outline with a 3px offset in the orange brand hue
band, reading the page CSS only. The same declaration's quote-side rules map
under F6-US5 in [quote-calculators.md](quote-calculators.md).

F5-US2 also maps the existing page declarations for editing each of the nine
fields, changing or clearing momsstatus, and invalid submission followed by
restoring the earlier email. They check stale confirmation/link/preview removal,
retained form values, no draft opened by edits, and current details after a
fresh valid submit through the injected opener. They do not control an external
email draft or establish delivery.

A mail handler can fail without a website error state. Recovery is copying the
displayed address and details into a working email tool, or using the
fallback link again. There is no persistent draft recovery or alternate
submission channel. Company details leave through the visitor's external mail
handoff; this catalog makes no privacy-law or compliance assurance claim.

## What Works Less Well

The website cannot confirm delivery or receipt by design. The fallback link
requires an email handler, but Utkast att kopiera contains the recipient,
subject and complete labeled body for manual copying into webmail without
clipboard permissions. The rate's momsstatus select is optional and self-reported:
visitors who leave it on "Ej angivet" still leave the VAT basis to their
description, and the website never assumes or confirms a stated basis.

## Roadmap

- Expand: assess reliable submission, reply details, spam handling and
  confirmation only in a separately approved runtime/service decision, as
  required by ADR 0006. Stored inquiries or CRM integration are not implemented here.
