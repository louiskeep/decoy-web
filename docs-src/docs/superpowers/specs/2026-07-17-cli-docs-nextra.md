# Decoy public CLI docs: implementation plan

Date: 2026-07-17
Status: PLAN APPROVED (Cam, 2026-07-17). All three Phase 0 decisions resolved
(see Section 9). Ready for P1 build on Cam's go.
Author: planning session (Fable), for Sonnet-tier build execution
Supersedes the tool/topology leanings in
`decoy-platform/docs/guides/public-docs-site-strategy.md` where they conflict;
extends (does not replace) the Diataxis manifest triad
(`decoy-platform/docs/manifest.yaml`, `docs/public/content-map.md`, `docs/public/gaps.md`).

## 0. Recommendation (the headline)

Build the public docs as **Fumadocs mounted inside the existing decoy-web Next.js app,
served at `decoy.dev/docs`** (subpath, same Vercel project). Not Nextra, not a separate
app on `docs.decoy.dev`, not a new repo.

This departs from the current leanings (Nextra + docs.decoy.dev subdomain + the
repo-location question). Why:

1. **Stack identity, not stack adjacency.** decoy-web is Next 16 App Router + React 19 +
   Tailwind v4 + shadcn/ui + next-themes. Fumadocs is built on exactly that stack: it
   mounts as a route group inside an existing App Router app, its UI package is Tailwind
   v4-native and follows shadcn conventions, and it inherits the app's existing CSS
   design tokens. "Brand-token sharing" stops being a workstream and becomes ~20 lines
   of CSS variable mapping in the file that already holds the tokens.
2. **Nextra fights both of our constraints.** Nextra v4 wants to own the app
   (`withNextra` wraps next.config, its own theme CSS variables, Pagefind postbuild
   step); embedding it under an existing marketing app or restyling it to shadcn tokens
   is working against the framework. Its release cadence has also historically lagged
   Next majors, and decoy-web is already on Next 16. Nextra is the right tool when docs
   ARE the app; here they are a section of an app we already own.
3. **Subpath beats subdomain right now.** decoy.dev is a young domain; docs content is
   its best SEO surface, and a subpath consolidates authority instead of splitting it.
   One Vercel project, zero DNS work, shared Navigation/Footer, no brand-token sync, no
   5th repo for barry and the quality gates. The broken `app/docs/page.tsx` gets
   REPLACED by the real docs index instead of redirected. If docs later outgrow the
   marketing app (versioning, auth-gated platform docs), the content is plain MDX in a
   Diataxis tree: extraction to docs.decoy.dev is a day of work plus permanent
   redirects, not a rewrite. Reserve the docs.decoy.dev DNS name now; do not build on it.
4. **The repo-location question dissolves.** No new repo, no new workspace package.
   Docs live at `decoy-web/content/docs/` + a route group. barry already sweeps
   decoy-web.

Fallbacks, in order, if Cam rejects the recommendation:
- **Nextra v4 as its own app on docs.decoy.dev** (the prior leaning): workable; costs a
  second Vercel project, DNS, a token-sync mechanism, and a Next-16-compat risk. If
  chosen, put it in decoy-web's pnpm workspace (`apps/docs`), NOT a new repo: same
  team, shared tokens, one barry surface. That answers the original open item.
- **Mintlify**: rejected. Vendor cost + lock-in, no shared brand tokens, and the org
  already moved to "owned" when it dropped Mintlify from the strategy doc's default.
- **Reviving the engine Sphinx site**: rejected for the public surface. It is
  dev-audience, Python-toolchain, off-brand, and its `cli.md` is stale (references a
  nonexistent `decoy replan`). Its narrative pages are SOURCES to adapt (Section 5),
  not a site to ship.

Scope stays **CLI-first**: fill start/, cli/, how-to/, concepts/ end to end; keep
platform/, connectors/, release/, and reference/yaml-schema as hidden drafts (Section 5).
This matches the "publish only what is true" rule: no visible empty stub pages.

### Hard constraints (external facts, non-negotiable)

- **No links into the private decoy-platform repo** (or any private repo) from public
  pages. All platform-doc content is ADAPTED in, never linked. CI-enforced (Section 8).
- **The `decoy` CLI is BUSL-1.1: "source-available", never "open source"** in any doc
  copy. The Apache-2.0 flip is PO-gated and out of scope. CI-checked (Section 8).

## 1. Architecture

### 1.1 Where things live (all inside decoy-web)

```text
decoy-web/
  app/
    docs/
      [[...slug]]/page.tsx      Fumadocs catch-all page (replaces current page.tsx)
      layout.tsx                DocsLayout: sidebar tree, top nav, search trigger
    api/search/route.ts         Fumadocs search endpoint (Orama, static-exportable)
  content/docs/                 All MDX content (Diataxis tree, Section 5)
    cli/_source/cli-reference.md   Vendored generated reference (committed, Section 4)
  lib/docs/source.ts            Fumadocs content source adapter
  source.config.ts              fumadocs-mdx config (frontmatter schema incl. draft flag)
  scripts/
    sync-cli-reference.mjs      Copies ../decoy/docs/cli-reference.md into _source/
    build-cli-mdx.mjs           Splits _source into per-command MDX (prebuild, gitignored output)
    check-docs-truth.mjs        Private-link + banned-phrase + generated-drift checks (CI)
```

Packages added: `fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx` (pin current stable;
verify Next 16 peer range at scaffold time, it tracks Next releases quickly).
No workspace restructuring; decoy-web stays a single app.

### 1.2 Routing and layout

- `/docs` and everything under it is Fumadocs' catch-all route. The current
  `app/docs/page.tsx` (private-repo link hub, broken for outside visitors) is DELETED
  in the same PR that lands the index page: no redirect needed, the URL keeps working
  and gets better. This closes the decoy-web follow-on item already tracked in
  `decoy-platform/docs/public/gaps.md`.
- Docs pages get their own `layout.tsx` with the Fumadocs `DocsLayout` (sidebar +
  in-page TOC + breadcrumbs), reusing the marketing `Navigation`/`Footer` chrome or a
  slimmed docs variant of it (build-time decision; prefer reuse first per Rule Zero).
- Sidebar tree comes from `meta.json` files per folder (explicit ordering), grouped by
  Diataxis section: Get started / How-to / Concepts / CLI reference.
- Search: Fumadocs built-in (Orama) via the search route; no external service, no
  Pagefind postbuild. Works in Vercel serverless out of the box.
- Dark mode: decoy-web already runs next-themes; Fumadocs UI consumes the same
  provider. No second theme system.

## 2. Phase plan (summary; details in the numbered sections)

| Phase | What | Est (Sonnet build hours) | Depends on |
| --- | --- | --- | --- |
| P0 | Cam sign-off: topology/tool + install-channel truth (Section 9) | 0 (decision) | - |
| P1 | Scaffold: Fumadocs mount, theme/token mapping, layout, nav skeleton, hidden drafts, delete old page.tsx | 3-5 h | P0 |
| P2 | Generated CLI reference pipeline (sync, splitter, prebuild, guards) | 3-4 h | P1 (parallel with P3) |
| P3a | Content: start/ tutorials | 3-4 h | P1 + install-channel answer |
| P3b | Content: how-to/ recipes | 4-6 h | P1 (parallel with P3a/P3c) |
| P3c | Content: concepts/ explanations | 4-6 h | P1 (parallel) |
| P4 | Truth governance: content-map rows, gaps.md closure, barry checklist, CI checks | 2-3 h | P2+P3 |
| P5 | Gate + ship: dennis review, /qa pass, PR, preview deploy; live per launch gate | 2-3 h | P4 |

Total ~21-31 h of Sonnet build time. P2 and P3a/b/c are fully parallelizable after P1
(four agents). P4 needs the content landed. Model tiering per house rules: Sonnet
builds from this plan, dennis (Opus) gates, barry (Haiku) takes over ongoing sync.

## 3. Brand and theme (P1)

- decoy-web's tokens live in `app/globals.css` (Tailwind v4 `@theme` + shadcn CSS
  variables, accent sky `#0ea5e9` light / `#38bdf8` dark, next-themes class switching).
- Fumadocs UI themes via its own `--color-fd-*` CSS variables. The work is a mapping
  block in `globals.css`: `--color-fd-primary: var(--primary)`, `--color-fd-background:
  var(--background)`, etc., for both light and dark scopes, plus importing
  `fumadocs-ui/css/style.css` (or the shadcn preset) into the existing stylesheet.
- Code blocks: Fumadocs ships Shiki; pick one dark-friendly theme pair consistent with
  the site (e.g. github-light/github-dark tinted by the accent). Copy buttons come free.
- Acceptance: docs pages are visually continuous with decoy.dev (fonts, radii, accent,
  dark mode toggling in sync); no second font or color system loaded.

## 4. Generated CLI reference pipeline (P2)

Principle: the reference is generated, never hand-written, and the chain of custody is
guarded at every hop. Chain: CLI code -> `decoy/docs/cli-reference.md` (already
generated by `python -m typer decoy.__main__ utils docs ...` and CI-guarded by
`tests/unit/test_cli_surface.py`; no changes needed in the decoy repo) -> vendored copy
in decoy-web -> per-command MDX at build time.

### 4.1 Vendoring (sync)

- `pnpm sync:cli-ref` runs `scripts/sync-cli-reference.mjs`: copies
  `../decoy/docs/cli-reference.md` (sibling checkout; path overridable via
  `DECOY_CLI_REF` env) to `content/docs/cli/_source/cli-reference.md` and prepends a
  provenance header (source repo, source commit hash via `git -C ../decoy rev-parse`).
- The vendored file IS committed. Rationale: hermetic Vercel builds (no cross-repo
  fetch, decoy repo may be private), and reference changes appear as reviewable diffs
  of one file instead of 28 generated files.
- Drift guard: barry's cross-repo sweep (and the pre-push quality gate) gains a check:
  vendored copy must be byte-identical (below the provenance header) to
  `decoy/docs/cli-reference.md` at decoy main HEAD; on drift, run sync and include the
  refresh in the docs PR. Optional later upgrade, not in this pass: a GitHub Action in
  the decoy repo that opens a decoy-web PR on cli-reference.md change.

### 4.2 Splitting into MDX (build step)

- `scripts/build-cli-mdx.mjs` runs as `prebuild` (and in `dev` via a predev hook):
  - Parses the vendored file on `^## \`decoy <name>\`` headings (27 command groups
    today; subcommands are `###` and stay within their group's page).
  - Emits `content/docs/cli/<name>.mdx` per group (gitignored) with:
    frontmatter (`title: decoy <name>`, `description:` first sentence of the section),
    a "Generated from the decoy CLI, do not edit" banner comment, headings demoted one
    level, and internal anchors preserved.
  - Emits `content/docs/cli/index.mdx` from the root section: the command map, global
    options, plus a hand-maintained partial (`_index-intro.mdx`, committed) that adds
    the exit-code table (0 ok / 1 usage / 2 deprecated-shim / 3 runtime / 4 findings)
    and links to the CI how-to. Hand partial and generated body are composed, never
    interleaved, so regeneration cannot eat hand edits.
  - MDX safety: the Typer output is HTML-entity-escaped (`&lt;`, `&#x27;`) which MDX
    renders correctly; the splitter must additionally escape `{` and stray `<` OUTSIDE
    fenced code blocks, and must fail loudly (build error) on: unparseable structure,
    group count below expectation, or any heading it cannot classify. The heading
    format is an implicit cross-repo contract; guard it, do not paper over it.
- `meta.json` for the cli/ folder is generated too (alphabetical after index), so new
  commands appear in nav without manual edits.
- LOCAL-only commands (`project`, `catalog`, `jobs`) keep whatever the generated text
  says; if the generated help does not flag them as local-only, fix the docstring in
  the decoy repo (root-cause rule), not the splitter.

### 4.3 Acceptance (P2)

- `pnpm build` from a clean checkout produces 27 command pages + index with working
  sidebar, TOC, and search entries.
- Deleting a command from the vendored file changes the page set with no dangling nav.
- Corrupting a heading in the vendored file fails the build with a clear message.
- No hand-written command documentation exists anywhere under `content/docs/cli/`
  except `_index-intro.mdx`.

## 5. Content plan (P3): pages, purposes, sources

House copy rules apply to every page: no em-dashes, no "open source" for the CLI
("source-available under BUSL-1.1"), no links to private repos, no claims beyond
`decoy-platform/docs/product/capabilities.md`, `decoy demo --ref` not advertised
(deferred stub), FORECAST never mentioned, STORM described as suggestions the user
confirms (disguises-as-presets stance; never auto-classification).

### 5.1 Get started (Diataxis: tutorial) - `content/docs/start/`

| Page | Purpose | Adapt from |
| --- | --- | --- |
| `index.mdx` (docs root, `/docs`) | Docs landing: what Decoy is, three entry paths (quickstart, demo, CLI reference) | New copy; framing from `decoy-platform/docs/product/capabilities.md` |
| `start/install.mdx` | Install the CLI, requirements, `decoy doctor`, license note (source-available, BUSL-1.1). Document the REAL current path (source / private index install); public `pip install decoy` is future (pre-launch), so present it as "coming at launch" not as a working command. NO "view source" / public-repo links (repo is not public). | `decoy/README.md` (adapt install to current channel; strip any public-PyPI framing) |
| `start/quickstart.mdx` | Zero to first masked CSV: template or `decoy init` -> `validate config` -> `run` -> inspect | `decoy-engine/docs/quickstart.md`, `decoy/src/decoy/templates/minimal.yaml`, `decoy-platform/docs/guides/cli-yaml-workflows.md` (first sections) |
| `start/demo.mdx` | `decoy demo` walkthrough: scan -> mask on bundled data, what each step shows | `decoy demo` actual output + generated reference section; `guides/cli-ux.md` |

### 5.2 How-to (Diataxis: how-to) - `content/docs/how-to/`

| Page | Purpose | Adapt from |
| --- | --- | --- |
| `mask-a-csv.mdx` | Recipe: mask one CSV with keyed strategies | `decoy-engine/docs/recipes.md`, CLI templates |
| `mask-a-folder-with-foreign-keys.mdx` | Recipe: multi-table folder, FK/RI preserved | `decoy-engine/docs/relationships.md`, `recipes.md`, platform `guides/relationships-reference.md` (adapted) |
| `generate-synthetic-data.mdx` | Recipe: generate a synthetic table; `fit` for statistical generation | `recipes.md`, `decoy fit`/`templates/generate` |
| `scan-for-pii.mdx` | Recipe: `storm analyze` -> review findings -> apply choices (note `storm scan` is deprecated, exit-code 2 shim) | platform `reference/storm.md` + `product/storm-detection-model.md` (adapted) |
| `use-decoy-in-ci.mdx` | Recipe: non-interactive runs, `preflight`/`validate`, exit-code handling (fail on 4), evidence artifacts | `guides/cli-yaml-workflows.md`, exit-code contract |

Every recipe must be RUN before it ships (verification rule): commands executed against
the current CLI, outputs pasted from real runs, versions noted.

### 5.3 Concepts (Diataxis: explanation) - `content/docs/concepts/`

| Page | Purpose | Adapt from |
| --- | --- | --- |
| `keys-and-vault.mdx` | Master secret, key derivation, vault tokens, unmask model | `decoy-engine/docs/security/key-derivation.md`, `security/token-vault.md`, `decoy explain keys` / `explain vault` (public-safe subset only) |
| `storm.mdx` | What STORM is; suggestions-not-classification; how findings become choices | `decoy explain storm`, `product/storm-detection-model.md` (adapted) |
| `disguises.mdx` | Compliance presets (HIPAA/PCI/GDPR...): what a Disguise is and is not | platform `guides/disguises.md` + `reference/disguises.md` (adapted) |
| `determinism.mdx` | Seed protocol, deterministic masking, reproducible runs | `decoy-engine/docs/determinism.md`, `decoy explain substrate` |
| `exit-codes.mdx` | The exit-code contract as a design commitment (why 4=findings matters for CI) | CLI source + `guides/cli-ux.md`; table itself lives on `/docs/cli` |
| `what-we-cannot-prove.mdx` | Honest limits page; ported nearly whole | `decoy-engine/docs/what-we-cannot-prove.md` |

Do NOT use `decoy-engine/docs/cli.md` as a source for anything (stale, references
nonexistent `decoy replan`); the generated reference is the only CLI-surface truth.

### 5.4 CLI reference (Diataxis: reference) - `content/docs/cli/`

Generated per Section 4: `index.mdx` + 27 command-group pages. Zero hand-written pages.

### 5.5 Hidden drafts (scaffolded, NOT published)

Created with `draft: true` frontmatter, excluded from nav, search, and sitemap by the
source adapter (enforced in `source.config.ts`, not by convention): `platform/index.mdx`,
`connectors/index.mdx`, `release/index.mdx`, `reference/yaml-schema.mdx`. Each carries a
one-line internal note pointing at its content-map row. No visible "coming soon" pages;
publish-only-truth beats stub theater.

## 6. Deploy and launch gate (P5)

- **No new infrastructure.** Docs ship inside decoy-web's existing Vercel project;
  every PR gets a preview deploy of the full site including /docs. No DNS work.
  Reserve/hold `docs.decoy.dev` in DNS as a future redirect target only.
- **Launch gate (RESOLVED, Cam 2026-07-17): BUILD NOW, STAY DRAFT.** The full CLI-first
  tree is built and merged, but the ENTIRE `/docs` tree stays unpublished (not just the
  Section 5.5 stubs) until the PO's Apache flip + public launch call. Mechanism: a single
  gate the whole docs route respects (a `DOCS_PUBLISHED` env/flag consumed by the source
  adapter + route, defaulting OFF, OR the docs route group held behind the site's own
  pre-launch gate) so nothing under `/docs` is reachable/indexed in production until one
  flag flips. Preview deploys still render the full tree for review. Merging to decoy-web
  main is gated on dennis + a /qa pass over the preview. BUSL does not block building;
  the wording rule (source-available, never "open source") applies throughout.
- Sitemap/SEO: docs pages join decoy-web's sitemap; stable canonical URLs under
  `/docs/...` from day one (these survive a future subdomain extraction via redirects).

## 7. Old `/docs` page (P1, subsumed)

`app/docs/page.tsx` is deleted when the Fumadocs index lands; its 9 private-GitHub
links disappear with it. Nothing else in decoy-web links to those URLs today, but the
P4 CI check (Section 8) makes that class of regression impossible anyway. This closes
the "decoy-web follow-on" item in `decoy-platform/docs/public/gaps.md`.

## 8. Truth governance: manifest triad, barry, CI (P4)

Extend the existing system; create no parallel tracker.

- **content-map.md** (decoy-platform): add a "Published at" column (or per-row note)
  mapping each shipped row to its `decoy-web/content/docs/...` path for the CLI-first
  rows (quickstart, YAML authoring, STORM profiling, CLI reference, limits pages).
  Rows for unshipped surfaces stay as they are.
- **gaps.md** (decoy-platform): close "Generated CLI command reference ... wired into
  the docs build" and the decoy-web follow-on bullet when P2/P1 land. The other
  launch-blocking gaps (per-connector guides, before/after strategy examples, YAML
  JSON Schema) remain open and map to the hidden drafts.
- **manifest.yaml**: unchanged in role (internal source-of-truth index). Any NEW
  internal doc created as a seed gets a row per its existing schema.
- **barry** (ongoing sync owner): add to barry's Decoy checklist: (1) vendored
  cli-reference drift check (Section 4.1); (2) when a shipped CLI change touches
  behavior documented in start/ how-to/ concepts/, update those pages in the same
  sweep; (3) content-map "Published at" hygiene.
- **CI checks in decoy-web** (`scripts/check-docs-truth.mjs`, run in build/CI):
  1. No occurrence of `github.com/louiskeep/decoy-platform` (or other private-repo
     URL patterns) anywhere under `app/` or `content/` (hard constraint 1).
  2. No case-insensitive "open source" within `content/docs/` (hard constraint 2);
     allowlist mechanism for a deliberate future exception, empty today.
  3. No em-dash (U+2014) in content (existing repo-wide rule, now covering docs).
  4. Internal link check over the built docs tree (dead `/docs/...` hrefs fail).
  5. Generated-pipeline guards from Section 4.3.

## 9. Decisions (resolved by Cam 2026-07-17)

1. **Topology + tool: RESOLVED -> Fumadocs inside decoy-web at `decoy.dev/docs`.**
   Cam accepted the Section 0 recommendation over the Nextra + docs.decoy.dev leaning.
   The subdomain fallback is not taken; no `apps/docs` workspace package, no second
   Vercel project. `docs.decoy.dev` is reserved in DNS as a future redirect target only.
2. **Install-channel: RESOLVED -> not published yet.** `decoy` is NOT on public PyPI
   today (private index / source install); public `pip install decoy` is a future
   (launch) path. The decoy repo is NOT publicly visible, so no "view source" / public
   GitHub links on the install page or anywhere in the tree. `start/install.mdx`
   documents the real current channel and marks public pip as "at launch" (Section 5.1).
3. **Launch gate: RESOLVED -> build now, stay draft.** Whole `/docs` tree is built and
   merged but unpublished behind one gate flag until the PO's Apache flip + launch
   (Section 6). Strict source-available wording throughout; CI-enforced (Section 8).

Still-open (non-blocking, do not hold the build):
4. Do we want the decoy-repo GitHub Action that auto-PRs reference updates to decoy-web
   now, or is barry-sweep sync enough for this pass? (Plan assumes barry is enough.)
5. Versioned docs are deferred until the CLI has divergent public releases; flagged so
   it is a decision, not a drift.

## 10. Risks

- **Fumadocs is younger than Nextra/Docusaurus.** Mitigation: all content is plain MDX
  in a Diataxis tree plus one splitter script; migrating to Nextra/Starlight later is
  roughly a day. The lock-in surface is the layout config, not the content.
- **cli-reference.md heading format is an implicit contract.** Mitigation: splitter
  fails loudly on structure drift (4.2); decoy repo's `test_cli_surface.py` already
  pins the file to the code.
- **MDX escaping edge cases** in Typer output (entities, braces). Mitigation: escape
  pass outside code fences + build-failure guard; verified against all 27 groups in P2
  acceptance.
- **Marketing-app coupling**: a docs typo now triggers a full site deploy and vice
  versa. Accepted for a one-team, one-site org; revisit at subdomain-extraction time.
- **Porting engine/platform docs can smuggle internal links or over-claims.**
  Mitigation: CI checks in Section 8 + dennis gate reviews content against
  capabilities.md, not just code.
- **Stale-copy regression** (the thing that killed the old /docs page). Mitigation:
  barry checklist items + link check make silent drift structurally harder.
