# Current Public Route Inventory

Checked: 2026-06-16

Source of truth:

- Route registry and page purpose: `src/data/siteContent.ts`
- Visible sections and route branching: `src/pages/SiteHomePage.tsx`
- Static route artifacts: `vite.config.ts` and `scripts/assert-static-routes.mjs`

This inventory covers the current Svard Entreprenad public route surface. The
site currently uses the shared `/svard-entreprenad-logo.png` asset and does not
have route-specific photography, project media, maps, before-and-after images,
or service-detail visual assets for any listed route. Existing Eriksson & Svard
source links in the UI are current cleanup targets, not a desired retained
customer-facing pattern.

## Route Inventory

| Route | Page purpose | Visible sections | Missing page-specific visual assets |
| --- | --- | --- | --- |
| `/` | Startsida with an overview of services, work process, trust signals, partner context, and quote contact. | Header; hero; service overview inventory; services cards; process steps; trust signals; partner section; contact section; footer. | No route-specific hero photo, company/team image, machinery image, project photo, map, or service media beyond the shared logo. |
| `/tjanster/` | Services index for the main mark, building, and construction service areas. | Header; page hero; services cards; trust signals; partner section; contact link band. | No page-specific service overview photography, category imagery, project examples, or service-detail media beyond the shared logo. |
| `/om-oss/` | About page describing work approach, experience, responsibility, and delivery from first dig to finished result. | Header; page hero; about content; contact link band. | No team photo, workplace image, equipment image, owner portrait, certification graphic, or other about-page media beyond the shared logo. |
| `/stensattning/` | Dedicated service page for paving, stone surfaces, and stone walls. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside with current source link; process steps; contact link band. | No paving project photos, material/detail closeups, before-and-after images, stone wall examples, or service-specific media beyond the shared logo. |
| `/markarbete/` | Dedicated service page for groundworks and construction preparation. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside with current source link; process steps; contact link band. | No excavation/site-prep photography, machinery images, ground condition visuals, project examples, or service-specific media beyond the shared logo. |
| `/gravjobb/` | Dedicated service page for machine and excavation work, including foundations, sewage, utilities, plots, and pool excavation. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside with current source link; process steps; contact link band. | No excavator photos, trench/foundation images, pool excavation visuals, project examples, or service-specific media beyond the shared logo. |
| `/dranering/` | Dedicated top-level drainage service page for moisture-safe groundwork around foundations, walls, and basements. | Header; page hero; service detail section; drainage-specific explanatory paragraph; service tags; "Nar tjansten passar" aside with current source link; process steps; contact link band. | No drainage detail photos, foundation/wall images, moisture-protection diagrams, before-and-after images, or service-specific media beyond the shared logo. |
| `/tradgardsplanering/` | Dedicated service page for plot and garden planning that connects levels, surfaces, planting, and practical use. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside with current source link; process steps; contact link band. | No garden planning imagery, plot layout visuals, planting/surface examples, finished outdoor environment photos, or service-specific media beyond the shared logo. |
| `/kontakt/` | Contact page for quote requests, site visits, project details, and next steps. | Header; page hero; contact section with offer prompt, contact items, and mailto quote form; footer. | No location/map visual, contact/person image, vehicle or office image, trust badge graphic, or contact-specific media beyond the shared logo. |

## Follow-up Notes

- `/dranering/` is both a primary navigation route and a `service` route; the
  renderer treats it as a dedicated service page with one drainage-specific
  explanatory paragraph.
- Service pages currently render a "Visa kallsida" link from `sourceHref`, and
  the contact page includes a source contact item. These are recorded as current
  implementation facts and should be removed or replaced by the sibling source
  cleanup task before the site is considered customer-ready.
- Future visual refinement work can use this inventory as the baseline for
  deciding which pages need unique photography, project examples, maps, or
  service-specific diagrams.
