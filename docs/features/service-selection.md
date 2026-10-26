# F1: Choose a suitable groundworks service

Reviewed: 2026-10-26. Runtime: `ui`. Product role: `customer_outcome`.

Visitors need to identify which service fits a property or construction project
before asking for a discussion. The current result is service understanding and
a route to inquiry preparation, not an instant price or confirmed booking.

## Entry points and current behavior

Home `/` and `/tjanster/` list the five typed service records with summaries,
tags and Läs mer links. Home also supplies hero actions and route shortcuts.
The index adds trust cards and a contact link band. Its partners section is
currently absent because the list is empty.

| Detail view / story | Distinct job and content |
| --- | --- |
| [F1-US2: Stensättning](user-stories/F1/F1-US2.md), `/stensattning/` | Assess entrances, paths, courtyards, paving and stone walls; tags Marksten Örebro, Stenmurar, Finplanering. |
| [F1-US3: Markarbete](user-stories/F1/F1-US3.md), `/markarbete/` | Scope broad groundworks for private, business or municipal projects; tags Schakt, Tomt, Anläggning. |
| [F1-US4: Grävjobb](user-stories/F1/F1-US4.md), `/gravjobb/` | Locate excavation for foundations, sewage, utilities, plots and pools; tags Grävning, Husgrund, Poolgrävning. Pool has no separate route. |
| [F1-US5: Dränering](user-stories/F1/F1-US5.md), `/dranering/` | Understand moisture protection around foundations, walls and basements; adds a specific paragraph on assessment, excavation and restoration; tags Dränering, Mur, Fuktskydd. |
| [F1-US6: Trädgårdsplanering](user-stories/F1/F1-US6.md), `/tradgardsplanering/` | Connect levels, surfaces, planting and practical outdoor use; tags Tomtplanering, Utemiljö, Finish. |

[F1-US1](user-stories/F1/F1-US1.md) covers comparing these offers on home/index.
Every detail view has a page hero, summary, tags, När tjänsten passar aside,
four-step process, contact link band and footer. Service cards use photographs
with typed route SVG fallback; if the fallback SVG also errors, the card image
is removed with no retry loop while title, summary and Läs mer remain. Page hero
photograph errors hide the image and retain text. These decorative backgrounds
are not project case-study evidence.

## Outcome and support

The visitor can select a matching service for a stated project and reach
`/kontakt/` from that detail page. Those are observable task checks; no
conversion analytics is installed. F4 supplies navigation/recovery. F2 explains
the shared process and company claims; F3 owns inquiry preparation.
There are no service APIs, background jobs, automatic estimates or booking records.

## Source, states and evidence

[Typed content](../../src/data/siteContent.ts) owns routes, sourceId joins,
summaries and tags. [SiteHomePage](../../src/pages/SiteHomePage.tsx) owns
ServicesIndexPage, Services, ServicePage and the route branching.
[Types](../../src/types/site.ts) define the content contract.

A missing service for a known service route renders not-found. An empty
services list blocks every route body. Loading/error/empty/not-found handling
and recovery ceilings are described in [F4](navigation-and-recovery.md).
A content defect requires source correction and static redeployment.

Existing Vitest declarations directly check representative home tags,
Stensättning guidance and Dränering/Grävjobb detail text. The six story documents
and identity manifest carry exact names and the limited assertion scope.
No dedicated Markarbete or Trädgårdsplanering render test is mapped.
The services-index view is source-reviewed, not established by a dedicated
existing rendered test. Metadata tests do not prove displayed image fallbacks;
F1-US1 maps deterministic rendered image-error declarations for the home
service-card photo→SVG fallback, terminal removal with content/link retention,
and isolation from neighboring cards. These mappings do not establish
services-index rendering or subpage hero failure behavior, and are not test
execution receipts.

## What Works Less Well

Except for the drainage paragraph, detail views largely repeat a summary,
generic suitability advice and the same process. Visitors cannot compare
service-specific prerequisites or inspect a completed example here. Grävjobb
covers several very different needs in one short summary, so a pool owner has
little guidance on what to provide before asking for a visit.

## Roadmap

- Fix: add service-specific prerequisites and inquiry preparation guidance,
  starting with excavation/pool needs and drainage assessment; keep claims owner-reviewed.
- Expand: add concrete completed-project examples to the appropriate service
  views when approved media and descriptions exist.
- Coverage: when those pages change, protect the distinct rendered
  Markarbete/Trädgårdsplanering and index contracts at the page boundary.

