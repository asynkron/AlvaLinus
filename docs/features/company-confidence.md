# F2: Assess the company and working approach

Reviewed: 2026-10-24. Runtime: `ui`. Product role: `customer_outcome`.

Prospective customers need to understand the stated approach and decide whether
to discuss a project. This feature presents information; it does not certify
the business or track construction progress.

## Entry points and current behavior

`/om-oss/` has a decorative photo hero, breadcrumb, paragraphs on experience,
equipment, communication and responsibility, a contact link band and footer.
[F2-US1](user-stories/F2/F2-US1.md) covers reading that approach.

Home `/` shows hero quality/trust/sustainability statements, three trust cards
and the four process steps. `/tjanster/` repeats the trust cards; all five
service detail routes repeat the process. [F2-US2](user-stories/F2/F2-US2.md)
covers understanding Första kontakt, Genomgång, Utförande and Slutfört arbete.
These steps describe offline work, not a job scheduler or project-status report.

Partners is conditionally supported on home/index but currently suppressed:
`siteContent.partners` is empty. There is no active collaborator directory,
testimonial view or reference-project route to catalog separately.

## Outcome and support

A visitor can locate the company description, explain the stated four steps
and find the contact route to ask questions. These are proposed observable
usability checks, not installed metrics. F4 supports reaching this information;
F1 supplies service context and F3 prepares the initial inquiry. There are no
background relations, incoming backend ports or compliance verification services.

## Source, states and evidence

[siteContent](../../src/data/siteContent.ts) owns about paragraphs, process,
trust statements, hero values and the empty partner list.
[SiteHomePage](../../src/pages/SiteHomePage.tsx) owns AboutPage, About, Process,
Trust and Partners. About content shares the global error/loading/empty
behavior; empty services currently suppresses even the about page. Reloading
cannot repair a missing deployed record; maintainers must correct the source.

Exact reviewed Vitest mappings are in the story documents and
[identity manifest](user-stories/features.json). The about test checks actual
paragraphs; the partner test checks suppression of unconfigured names.
The home test checks the process heading, not every step or execution of real
work. No assertion verifies certification, guarantees or business performance.

## What Works Less Well

Trust copy mentions guarantees and certifications, but these sections provide
no supporting credential links or concrete project examples. A visitor needing
evidence before selecting a contractor must ask separately. The process
describes stages without specifying what information the customer should bring
to the initial discussion.

## Roadmap

- Fix: have the owner substantiate or qualify certification and guarantee claims;
  publish appropriate supporting details without claiming automated verification.
- Expand: add a short customer preparation checklist to the process and a
  concrete approved example showing the steps in practice.

