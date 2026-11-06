# Image requests — Svärd Entreprenad site

The landing page uses the current images from the [Brainstorming canvas](https://app.faktorial.ai/projects/alvalinus/canvases/92cb0d4d-ce02-4eb9-9379-4aecaae33025).
The three selected photographs were recovered from the project's stored
canvas attachments on 4 November 2026. They appear on the home and services cards
and their corresponding service-page heroes:

| Site asset | Canvas file | Canvas element |
| --- | --- | --- |
| `stensattning-photo.webp` | `IMG_6593.PNG` | `caa2791c-219f-4080-9852-90b60f0813be` |
| `markarbete-photo.webp` | `IMG_6597.PNG` | `3154d76c-15f8-4f0e-8ca4-57ff1697ea0a` |
| `gravjobb-photo.webp` | `IMG_6596.PNG` | `0b8ccc17-41d3-4990-9b94-8f315abf8d3e` |

Each photograph has 400, 640 and 900 pixel-wide WebP versions, preserving the
original aspect ratio without upscaling. Cards use the canvas's 16:10 cover crop;
Stensättning and Grävjobb retain its `50% 55%` focal position. The large source
PNGs stay outside the deployable assets. The previous generated Grävjobb image
has been replaced by the selected photograph.

The original home hero and drainage photograph remain unchanged and match the
recovered canvas attachment bytes. The vector logo remains in use.
Trädgårdsplanering still uses the canvas's AI-generated illustration in 640, 960
and 1568 pixel-wide WebP versions. The services hero is also AI-generated. These
illustrations do not depict completed customer projects. About and Contact hero
photographs remain outstanding.

## How to deliver

- **Drop each file into `public/page-visuals/` using the exact filename below.**
  Set any new page hero through its `heroPhotoAssetPath` in
  `src/data/siteContent.ts`, preserving the typed route inventory. About and
  Contact currently use the plain navy hero when their photographs are absent.
- You can deliver **JPG or PNG** and I will convert + downscale to WebP, or
  deliver **WebP** directly (preferred final format). Target the listed pixel
  size; larger is fine, I'll downscale.
- Keep the look consistent with the existing photos: **real, professional
  construction/landscaping photography**, natural daylight (warm golden-hour
  tone works well), Swedish/Nordic setting, no text overlays, no watermarks,
  no visible brand logos or readable license plates.

## Style anchor (already in place)

Offertberäkning uses `public/page-visuals/quote-hero.webp` with 640 and 960
pixel-wide variants, converted from the original PNG created with built-in
imagegen. Prompt: a wide photorealistic Swedish asphalt driveway with granite
edging, a Nordic house and birch trees in warm afternoon light; quiet space on
the left for the heading, no people, vehicles, text or logos. This is an
AI-generated illustration, not a completed customer project.

| Page use | File | Notes |
|---|---|---|
| Home hero | `hero-photo.webp` | Orange excavator at sunset on a worksite ✓ |
| Stensättning card + page hero | `stensattning-photo.webp` | Retaining wall beside a garden ✓ |
| Markarbete card + page hero | `markarbete-photo.webp` | Prepared soil and paved courtyard path ✓ |
| Dränering card + page hero | `dranering-photo.webp` | Foundation drainage with pipe + gravel ✓ |

---

## Needed images

### 1. `gravjobb-photo.webp` — Grävjobb (excavation) — delivered

The canvas's `IMG_6596.PNG` photograph now supplies the home and services cards
and the `/gravjobb/` hero. No replacement image is needed.

### 2. `tradgard-photo.webp` — Trädgårdsplanering (garden/landscape planning) — **priority**
- **Used for:** service card on home + `/tjanster/`, and the `/tradgardsplanering/` page hero.
- **Aspect / size:** 3:2 landscape, ≥ 1536 × 1024 px.
- **Prompt:**
  > Professional photograph of a freshly landscaped private garden in Sweden:
  > neat stone-paved walkway, defined planting beds, a low retaining wall, tidy
  > lawn and level changes. Late-afternoon warm light, lush but recently
  > completed look. Commercial landscaping photography, realistic, sharp,
  > no people, no text or logos.

### 3. `services-hero.webp` — Tjänster index hero
- **Used for:** the `/tjanster/` page hero background (sits behind a dark navy
  overlay, so a slightly busy scene is fine).
- **Aspect / size:** 16:9 landscape, ≥ 1920 × 1080 px.
- **Prompt:**
  > Wide professional photograph of an active groundworks site in Sweden showing
  > the breadth of mark & anläggning work: an excavator, prepared sub-base,
  > stacks of paving stones and drainage pipe in the background. Overcast-to-
  > golden daylight, wide establishing shot with room on the left for text.
  > Realistic commercial construction photography, no people, no text or logos.

### 4. `about-hero.webp` — Om oss hero
- **Used for:** the `/om-oss/` page hero background (behind the navy overlay).
- **Aspect / size:** 16:9 landscape, ≥ 1920 × 1080 px.
- **Prompt:**
  > Wide professional photograph of a completed mark & anläggning project in
  > Sweden — a finished driveway/entrance with paving, drainage and clean
  > level work, a parked excavator resting in the background at the end of the
  > job. Warm late-day light conveying craftsmanship and trust. Realistic
  > commercial photography, wide shot, no people, no text or logos.

### 5. `contact-hero.webp` — Kontakt hero
- **Used for:** the `/kontakt/` page hero background (behind the navy overlay).
- **Aspect / size:** 16:9 landscape, ≥ 1920 × 1080 px.
- **Prompt:**
  > Wide professional photograph of a Swedish groundworks site at the start of a
  > project: an excavator on freshly cleared ground, early-morning soft light,
  > a sense of "ready to begin". Calm, inviting, wide establishing composition
  > with open sky for text overlay. Realistic commercial construction
  > photography, no people, no text or logos.

### 6. `inhyrning-hero.webp` — Inhyrning hero (optional upgrade)
- **Used for:** the `/inhyrning/` page hero background (behind the navy
  overlay). Until delivered, the page uses the decorative
  `inhyrning-hero.svg` illustration.
- **Aspect / size:** 16:9 landscape, ≥ 1920 × 1080 px.
- **Prompt:**
  > Wide professional photograph of a Swedish groundworks site where a company
  > excavator meets a visiting contractor: machine, trailer and cleared ground
  > in calm daylight, suggesting hired help arriving for an assignment.
  > Realistic commercial construction photography, no people, no text or logos.

---

## Summary checklist

- [ ] `public/page-visuals/gravjobb-photo.webp` (3:2)
- [ ] `public/page-visuals/tradgard-photo.webp` (3:2)
- [x] `public/page-visuals/services-hero.webp` (16:9, AI-generated illustration)
- [ ] `public/page-visuals/about-hero.webp` (16:9)
- [ ] `public/page-visuals/contact-hero.webp` (16:9)
- [ ] `public/page-visuals/inhyrning-hero.webp` (16:9, optional upgrade; SVG hero in place)

Once these land in `public/page-visuals/`, update the corresponding photo maps
in `src/pages/SiteHomePage.tsx`. The abstract `svard-entreprenad-*.svg` placeholders stay
as the route-inventory assets and remain the safety fallback.
