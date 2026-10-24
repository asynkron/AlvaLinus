# Static Release and Rollback Runbook

This runbook describes how an operator publishes a revision-traceable release
of the static site and restores a previously accepted artifact. It is
host-neutral: it names no provider, no credentials, and no deployment tooling.
Publication itself always happens through whatever procedure the current
hosting owner supports.

The static-only baseline (ADR 0001) means there is no runtime to restart: a
release is the complete `dist/` artifact tree, and a rollback is publishing a
previously accepted artifact the same way.

## Known unknowns

The following operational facts are unknown today. The steps below are written
so these facts can be filled in later without changing the procedure:

- **Production host.** No hosting platform is selected or recorded, so this
  runbook cannot name a console, CLI, API, or deploy hook.
- **Publishing access.** Who can publish, from which machine, and with what
  credentials is not recorded.
- **Retention capability.** Whether the host keeps previous artifacts, for how
  long, and how they can be restored is unknown. Rollback therefore depends on
  artifacts that someone retained deliberately, not on the host (see
  [Rollback](#rollback)).

## Release provenance

Every release must stay traceable to four identities. Record them as you go
(a ticket note or text file kept outside the artifact is enough):

| Identity | What to record | Where it comes from |
| --- | --- | --- |
| Source revision | Full commit SHA of the released checkout | `git rev-parse HEAD` in the prepared checkout |
| Accepted quality identity | Identifier of the canonical `make quality` session that accepted the revision, plus its `quality-evidence.v1` output written under `FAKTORIAL_QUALITY_EVIDENCE_DIR` (default `.faktorial/quality`, outside Git) | The quality gate that accepted the revision |
| Artifact identity | A checksum manifest of the exact `dist/` tree that was published | Standard tooling such as `sha256sum` (macOS/Linux) or `Get-FileHash` (Windows) over the published files |
| Publication identity | Deployment ID, timestamp, and publisher as the host records them | The hosting owner's supported publication procedure |

Without all four identities, a live artifact cannot be connected back to the
source that produced it and a rollback cannot prove what it restored.

## 1. Connect an accepted revision to an artifact

1. Check out the exact commit the quality gate accepted (`git checkout
   <full-sha>`) and confirm `git status` is clean.
2. Install the locked dependencies with `make workspace` (macOS/Linux) or
   `make.cmd workspace` (Windows). Node.js 24 or newer is required.
3. Build the artifact with `make build` / `make.cmd build`. This type-checks,
   runs the Vite production build into `dist/`, emits the physical subpage
   `index.html` files (ADR 0004), and asserts that every declared route
   artifact and page visual exists before it succeeds.
4. Never publish a leftover `dist/` from an unrelated working state. A stale
   folder may not match the accepted revision. Either capture `dist/`
   directly from the accepted `make quality` session — it builds and
   route-validates the same artifact in one session — or rebuild from the
   accepted commit as above, and record that artifact's checksum manifest as
   the artifact identity.

Faktorial task agents do not run quality themselves; they request verification
and Faktorial's canonical gate executes `make quality`. Human operators run the
commands above themselves. The acceptance requirement is the same gate either
way; do not bypass it to publish.

## 2. Publish

Publish the complete `dist/` tree using the actual hosting owner's supported
procedure. Replace the whole artifact; do not merge a new `dist/` over an old
one, because removed hashed files from the previous release would otherwise
linger or go missing inconsistently.

The complete tree is the deployment contract. Per ADR 0004 every declared
subpage route is emitted as a physical `index.html` inside its route directory
alongside all hashed bundles, fonts, and page visuals, and the deployment
contract does not assume host rewrite rules. A root-only upload — publishing
just the root `index.html` or only the `assets/` folder — leaves direct
subpage URLs such as `/tjanster/` returning 404 even though in-browser
navigation from the home page still appears to work.

## 3. Post-publication checks

Verify the live site with direct requests, not only by clicking through the
home page:

- **Declared routes.** For every route declared in `src/data/siteContent.ts`
  (`routes[].href`, for example `/tjanster/` and `/kontakt/`), request the
  published URL directly and expect HTTP 200 with HTML. ADR 0004 ships each
  subpage as a physical `index.html` inside its route directory; the deployment
  contract does not assume host rewrite rules, so any missing route file shows
  up as a direct-request 404 even though client-side navigation from the home
  page still works.
- **Page visuals.** Request at least the `visual.assetPath` for each published
  route (for example `/page-visuals/svard-entreprenad-home.svg`) and the photo
  and logo files under `public/page-visuals/` that the routes reference. Expect
  HTTP 200.
- **Hashed bundles and fonts.** From the live HTML of a subpage, request the
  hashed JavaScript and CSS bundle names under `/assets/` that the page
  references, plus one bundled webfont file (the site self-hosts variable
  fonts, emitted with hashed names into `dist/assets/`). Expect HTTP 200.

Record the check results together with the publication identity.

**The contact form is not a release check.** Per ADR 0006 the `/kontakt/` form
hands off to the visitor's mail client through a `mailto:` action, so a
submission proves nothing about inquiry delivery. Never use production form
submissions as a release or rollback acceptance signal.

## Rollback

Rollback means republishing a previously accepted artifact through the same
host-supported procedure, then rechecking it like a new release.

Prerequisites:

- A previously accepted artifact is still available. Today that can only be an
  artifact someone retained deliberately outside the host, because the host's
  own retention capability is unknown.
- The artifact's provenance is recorded: source revision, accepted quality
  identity, and checksum manifest.
- Working publication access exists (currently an unknown).

Procedure:

1. Select the most recent artifact whose provenance shows it was accepted by
   the quality gate and whose post-publication checks passed when it was
   released. Never restore an artifact without provenance; an unverifiable
   memory of "what was live before" is not a rollback candidate.
2. Republish that artifact completely, using the same supported procedure and
   the same whole-artifact replacement as a forward release.
3. Rerun the full [post-publication checks](#3-post-publication-checks)
   against the restored release: every declared route by direct URL, page
   visuals, and hashed bundles and fonts.
4. Record a new publication identity that references the restored artifact's
   identity and the rollback reason.

What cannot be promised until the host, access, and retention facts are known:
how far back a rollback can reach, whether the host can serve a prior artifact
at all, and how quickly restoration completes. These stay open operational
facts; fill them in here once a hosting owner is chosen.
