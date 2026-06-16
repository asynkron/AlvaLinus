# Generated Local Artifacts

## Keep Local Captures Out of Product Diffs

Do not commit generated browser captures, local tool logs, screenshots, trace
exports, or temporary report files unless the artifact is intentionally part of
the product or documentation deliverable.

Before committing, check whether newly added files are source assets, fixtures,
or durable documentation. If they are only evidence from local verification,
keep them untracked or ignore the containing output directory.

WHY: gh24 / PR25 had generated Playwright MCP captures tracked in the product
diff. Review had to request a cleanup commit, `da3cb85`, that removed the
`.playwright-mcp/` files and added `.playwright-mcp/` to `.gitignore`. Future
agents should prevent this before review by keeping local verification output
separate from shipped site changes.
