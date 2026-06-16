# ADR 0006: Static Email Contact Handoff

## Status

Accepted

## Context

Issue gh19 added a contact form to the static `/kontakt/` route. The existing
architecture from ADR 0001 keeps AlvaLinus as a static Vite/React site with
typed content data and no backend runtime, while ADR 0004 keeps declared routes
deployable as static artifacts.

A contact form can easily pull the project toward a server, serverless function,
third-party form endpoint, database, spam-control workflow, or operational
secrets. None of those services were part of the accepted delivery scope for
gh19. The useful product step was to collect the visitor's first inquiry fields
on the contact page while preserving static hosting.

## Decision

Contact capture remains a static mail-client handoff for now. The `/kontakt/`
form is configured through typed site content, renders normal form controls, and
submits through a `mailto:` action using `method="post"` and
`encType="text/plain"`.

The form keeps fallback contact links visible alongside the static handoff. It
does not introduce a backend API, serverless function, third-party form service,
database, authentication, CAPTCHA, or deployment-time secret.

## Consequences

- The contact route can continue to ship as static files with the rest of the
  site.
- Form labels, field names, select options, recipient, and subject stay in typed
  site content instead of being scattered through component literals.
- The handoff depends on the visitor's configured mail client and is not a
  reliable submission pipeline.
- A future issue that needs guaranteed delivery, spam handling, analytics,
  CRM integration, stored inquiries, or custom confirmation states should make a
  new runtime/service decision explicitly instead of expanding this static
  handoff by accident.

## Traceability

- Issue: gh19
- Delivery PR: #22
- Delivery commit: `d9dd5dd17d90f0143162b7b5a0bbe146b3fe9d7d`
- Learn branch: `agent-go/task-gh19-learn`
