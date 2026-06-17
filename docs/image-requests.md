# Image requests — Svärd Entreprenad site

The site uses real photographs in the presentation layer. Four are already in
place; **five more are needed** to finish the photographic look across every
page. The two service photos (Grävjobb, Trädgårdsplanering) are the highest
priority — until they exist, those cards fall back to the abstract SVG
placeholders.

## How to deliver

- **Drop each file into `public/page-visuals/` using the exact filename below.**
  The code already references these paths, so a correctly-named file "just
  works" — no code change needed.
- You can deliver **JPG or PNG** and I will convert + downscale to WebP, or
  deliver **WebP** directly (preferred final format). Target the listed pixel
  size; larger is fine, I'll downscale.
- Keep the look consistent with the existing photos: **real, professional
  construction/landscaping photography**, natural daylight (warm golden-hour
  tone works well), Swedish/Nordic setting, no text overlays, no watermarks,
  no visible brand logos or readable license plates.

## Style anchor (already in place)

| Page use | File | Notes |
|---|---|---|
| Home hero | `hero-photo.webp` | Orange excavator at sunset on a worksite ✓ |
| Stensättning card + page hero | `stensattning-photo.webp` | Paver/cobblestone path ✓ |
| Markarbete card + page hero | `markarbete-photo.webp` | Excavator digging a foundation trench ✓ |
| Dränering card + page hero | `dranering-photo.webp` | Foundation drainage with pipe + gravel ✓ |

---

## Needed images

### 1. `gravjobb-photo.webp` — Grävjobb (excavation) — **priority**
- **Used for:** service card on home + `/tjanster/`, and the `/gravjobb/` page hero.
- **Aspect / size:** 3:2 landscape, ≥ 1536 × 1024 px.
- **Prompt:**
  > Professional photograph of a tracked hydraulic excavator digging a deep
  > trench for a house foundation on a residential building site in Sweden.
  > Fresh excavated earth, the machine's bucket mid-dig, clear daylight with
  > soft shadows. Documentary/commercial construction photography, sharp focus,
  > realistic, no people in frame, no text or logos.

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

---

## Summary checklist

- [ ] `public/page-visuals/gravjobb-photo.webp` (3:2)
- [ ] `public/page-visuals/tradgard-photo.webp` (3:2)
- [ ] `public/page-visuals/services-hero.webp` (16:9)
- [ ] `public/page-visuals/about-hero.webp` (16:9)
- [ ] `public/page-visuals/contact-hero.webp` (16:9)

Once these land in `public/page-visuals/`, the cards and subpage heroes pick
them up automatically. The abstract `svard-entreprenad-*.svg` placeholders stay
as the route-inventory assets and remain the safety fallback.
