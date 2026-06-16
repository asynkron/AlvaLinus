# Current Public Route Inventory

Checked: 2026-06-16

Source of truth:

- Route registry and page purpose: `src/data/siteContent.ts`
- Visible sections and route branching: `src/pages/SiteHomePage.tsx`
- Static route artifacts: `vite.config.ts` and `scripts/assert-static-routes.mjs`

This inventory covers the current Svard Entreprenad public route surface. The
site now has typed page-specific placeholder visual metadata for every listed
route in `src/data/siteContent.ts`, with matching generated SVG assets under
`public/page-visuals/`. The renderer still uses the shared
`/svard-entreprenad-logo.png` asset in the current UI; the route-specific
visuals are ready for a later UI wiring pass. Previous external source links
have been removed from the public UI and are not a desired retained
customer-facing pattern.

## Route Inventory

| Route | Page purpose | Visible sections | Current page-specific visual asset |
| --- | --- | --- | --- |
| `/` | Startsida with an overview of services, work process, trust signals, and quote contact. | Header; hero; service overview inventory; services cards; process steps; trust signals; contact section; footer. | `/page-visuals/svard-entreprenad-home.svg` for the overall mark and construction first impression. |
| `/tjanster/` | Services index for the main mark, building, and construction service areas. | Header; page hero; services cards; trust signals; contact link band. | `/page-visuals/svard-entreprenad-services.svg` for the combined services overview. |
| `/om-oss/` | About page describing work approach, experience, responsibility, and delivery from first dig to finished result. | Header; page hero; about content; contact link band. | `/page-visuals/svard-entreprenad-about.svg` for work planning, responsibility, and process context. |
| `/stensattning/` | Dedicated service page for paving, stone surfaces, and stone walls. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside; process steps; contact link band. | `/page-visuals/svard-entreprenad-stensattning.svg` for paving, stone surfaces, and finish. |
| `/markarbete/` | Dedicated service page for groundworks and construction preparation. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside; process steps; contact link band. | `/page-visuals/svard-entreprenad-markarbete.svg` for excavation, site preparation, and ground beds. |
| `/gravjobb/` | Dedicated service page for machine and excavation work, including foundations, sewage, utilities, plots, and pool excavation. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside; process steps; contact link band. | `/page-visuals/svard-entreprenad-gravjobb.svg` for machine capacity and excavation work. |
| `/dranering/` | Dedicated top-level drainage service page for moisture-safe groundwork around foundations, walls, and basements. | Header; page hero; service detail section; drainage-specific explanatory paragraph; service tags; "Nar tjansten passar" aside; process steps; contact link band. | `/page-visuals/svard-entreprenad-dranering.svg` for drainage trench, pipe, and foundation moisture protection. |
| `/tradgardsplanering/` | Dedicated service page for plot and garden planning that connects levels, surfaces, planting, and practical use. | Header; page hero; service detail section; service tags; "Nar tjansten passar" aside; process steps; contact link band. | `/page-visuals/svard-entreprenad-tradgardsplanering.svg` for planned outdoor surfaces, levels, and garden use. |
| `/kontakt/` | Contact page for quote requests, site visits, project details, and next steps. | Header; page hero; contact section with offer prompt, contact items, and mailto quote form; footer. | `/page-visuals/svard-entreprenad-contact.svg` for quote and site-visit handoff context. |

## Follow-up Notes

- `/dranering/` is both a primary navigation route and a `service` route; the
  renderer treats it as a dedicated service page with one drainage-specific
  explanatory paragraph.
- Service pages no longer render external source links, and the contact page no
  longer includes a dedicated source-only contact entry. Future source
  references should stay in documentation or editorial tooling rather than
  customer-facing page chrome.
- Future visual refinement work can use this inventory as the baseline for
  replacing generated placeholders with unique photography, project examples,
  maps, or service-specific diagrams without changing the route-content model.
