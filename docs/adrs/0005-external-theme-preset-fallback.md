# ADR 0005: External Theme Preset Fallback

## Status

Accepted

## Context

Issue gh18 asked the site to use the AstroVista shadcn/tweakcn theme while
preserving the existing static React and Shadcn-style frontend foundation from
ADR 0001.

During the accepted delivery in PR #20, the direct preset command
`shadcn init --preset https://tweakcn.com/themes/cmlk6zefr000004lbe9jygsqc --force --no-reinstall`
returned HTML instead of preset JSON. The implementation still needed the
theme applied through the local Tailwind CSS variable contract without changing
the app architecture or adding a new runtime dependency.

## Decision

When a remote theme preset URL is not machine-readable from the CLI, the site
may apply the equivalent theme token payload directly into the existing local
Shadcn/Tailwind CSS variable path.

The committed token set remains the source of truth for the application. The
delivery summary should preserve the external theme source and the reason the
direct preset command was not used so future styling work can distinguish an
intentional fallback from an arbitrary hand-authored theme.

## Consequences

- External theme ingestion must not bypass the local token contract in
  `src/styles.css` and `tailwind.config.ts`.
- Future theme refreshes can retry the preset command, but should compare the
  resulting tokens against the committed variables before replacing them.
- If a theme provider changes its public payload format, agents should preserve
  provenance in the delivery summary or a follow-up ADR rather than silently
  mixing generated and manual theme values.
- The static-site baseline remains unchanged; applying a visual theme does not
  justify adding a runtime service, CMS, or client-side theme loader.

## Traceability

- Issue: gh18
- Delivery PR: #20
- Delivery commit: `7f9eb005b5b28fdee35d409b49ce189dafdf67b4`
- Learn branch: `agent-go/task-gh18-learn`
