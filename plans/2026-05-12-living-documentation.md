# Living documentation — `decoy-web` stub

> **Status:** planning
> **Branch:** `claude/living-documentation-plan-WxN92`
> **References:** [`decoy-platform/plans/2026-05-12-living-documentation.md`](https://github.com/louiskeep/decoy-platform/blob/claude/living-documentation-plan-WxN92/plans/2026-05-12-living-documentation.md) (master), [`README.md`](../README.md), [`BRAND_GUIDE.md`](../BRAND_GUIDE.md), [`MOTION_GUIDE.md`](../MOTION_GUIDE.md), [`decoy-platform/plans/2026-05-06-marketing-website.md`](https://github.com/louiskeep/decoy-platform/blob/main/plans/2026-05-06-marketing-website.md)
> **Last reviewed:** 2026-05-12

## Why this stub exists

The cross-repo plan lives in `decoy-platform/`. **This repo is the one with the most concrete work**: it owns the Mintlify deploy, the IA tree on disk, and the Vercel routing. This stub records the repo-local deliverables.

## What `decoy-web` already provides

- Next.js marketing site (Vercel, auto-deploys from `main`).
- Reserved `decoy.dev/docs` path for Mintlify (per `README.md`).
- [`BRAND_GUIDE.md`](../BRAND_GUIDE.md) and [`MOTION_GUIDE.md`](../MOTION_GUIDE.md) for visual consistency between marketing and docs.

What it doesn't have yet: any `docs/` directory, any `mint.json`, any Mintlify integration. Phase A creates them all.

## What `decoy-web` owes the plan

### Phase A (foundations) — almost all owned here

- **A1. Scaffold `docs/` per the master plan's IA tree.** One mdx stub per top-level section (`intro/`, `cli/`, `platform/`, `disguises/`, `engine/`, `concepts/`, `security/`, `reference/`). Each stub has a 1-paragraph placeholder + a `Status: stub` frontmatter so the freshness CI can find them.
- **A2. `mint.json` config.** Top-level navigation matching the IA; brand colors lifted from `BRAND_GUIDE.md`; logo from `public/`. Mintlify auto-deploys PRs to `*.mintlify.app` preview URLs.
- **A2b. Vercel route.** `next.config.mjs` adds a rewrite for `/docs` → Mintlify deploy target so the URL `decoy.dev/docs` resolves to the docs site. Verify the rewrite doesn't break the marketing site's own routes.
- **A2c. Crawler hints.** Add `/docs/sitemap.xml` to the marketing site's robots.txt and the canonical-host configuration. Search visibility on day one.

### Phase B (generated reference) — receiving end

- **B1–B3.** Sibling repos generate mdx and commit it to this repo under `docs/cli/reference/`, `docs/platform/reference/api/`, and `docs/cli/reference/pipeline-yaml.mdx`. Three options for the write path:
  1. **Cross-repo PR bot** (recommended): a GitHub App opens a PR from each sibling repo on every push to `main`. Simple, auditable, reviewable.
  2. **Workflow dispatch + push**: each sibling's CI pushes to a `docs-bot` branch here, then opens a PR.
  3. **Submodule pulls**: this repo pulls each sibling at build-time. Avoids commits but loses the audit trail.
- Pick (1). Configure the bot in `.github/` with restricted-scope deploy keys.
- **B4.** This repo owns `engine/public-api.mdx` — the curated landing page that links into Sphinx anchor by anchor.

### Phase C (tutorials)

The 10 tutorials in the master plan are authored in this repo by the engineer-of-the-week who shipped the matching feature. Each tutorial mdx pins a literal version of `decoy` (and platform tag) and embeds runnable shell blocks. Where the tutorial references a fixture, it links to the fixture's location in the sibling repo's `examples/` directory.

### Phase D (Disguise pages + concepts)

- **D1.** Auto-render bot from `decoy-engine` writes `docs/disguises/*.mdx`. Hand-written intro paragraphs live in `docs/disguises/*.intro.mdx` so engine regenerations never clobber marketing prose. The two are stitched together at Mintlify build time via an mdx import.
- **D2. Source-blind explainer.** Diagram + ~200-word explainer at `docs/concepts/source-blind.mdx`. Pairs with `decoy-platform/ROADMAP.md` Item 10·M4.
- **D3. Concept pages.** Hand-written in this repo.
- **D4. Glossary page.** Build step transforms `decoy-platform/GLOSSARY.md` (via the cross-repo bot or a submodule fetch) into `docs/reference/glossary.mdx`. The terms become anchors; the `<Concept slug="..."/>` shortcode in other pages links here.

### Phase E (operator docs)

Authored mostly in `decoy-platform` (the engineers shipping the infra know the surface), landing on Mintlify in this repo. No special tooling needed — same mdx authoring flow as Phase C.

### Phase F (living loop) — three repo-local checks

- **F2. Glossary coverage check.** New script `scripts/check_glossary_coverage.js` in this repo. Loads `decoy-platform/GLOSSARY.md` (fetched via the bot or submodule), extracts the locked-taxonomy terms, asserts each appears ≥1× under `docs/`. CI fails on miss.
- **F2b. Taxonomy grep gate extension.** The `decoy-platform/TAXONOMY_GUIDE.md` CI grep gate is extended to scan `decoy-web/docs/` for banned strings (`HIPPA`, `Insights`, `Analytics`, `Swiss Army`, `per row`, etc.). Implementation: this repo adds a workflow step that pulls the banned-strings list from the platform repo and runs the same grep.
- **F2c. Broken-link check.** Mintlify supports a link checker out of the box; enable it in CI.
- **F4. CODEOWNERS.** `docs/` gets a named human (or rotating reviewer team) as CODEOWNER so doc PRs route to the right reviewer.

## Mintlify config notes

- **Versioning**: skip until engine v1.0 per master plan §Risks.
- **Search**: Mintlify's built-in first; revisit Algolia DocSearch in Phase F.
- **Analytics**: Vercel Analytics on the marketing site + Mintlify's own analytics for docs. No PostHog tracking on docs pages (would imply we read what people search for, which conflicts with our source-blind brand promise).
- **Theme**: align colors with `BRAND_GUIDE.md`; same font stack so the marketing→docs handoff feels seamless. `MOTION_GUIDE.md` doesn't apply (docs site is mostly static).

## File layout in this repo (Phase A output)

```
decoy-web/
├── app/                              ← unchanged (Next.js marketing site)
├── components/                       ← unchanged
├── docs/                             ← NEW (Mintlify root)
│   ├── mint.json                     ← Mintlify config
│   ├── intro/
│   ├── cli/
│   ├── platform/
│   ├── disguises/
│   ├── engine/
│   ├── concepts/
│   ├── security/
│   ├── reference/
│   └── snippets/                     ← reusable mdx fragments
├── scripts/
│   ├── check_glossary_coverage.js    ← Phase F2
│   └── pull_sibling_docs.js          ← cross-repo bot helper
├── next.config.mjs                   ← updated for /docs rewrite
└── .github/
    └── workflows/
        └── docs-checks.yml           ← F2 + F2b + F2c
```

## What stays in-repo, not on Mintlify

Per the master plan's stay-in-repo policy:
- [`CLAUDE.md`](../CLAUDE.md), [`dev-help.md`](../dev-help.md), [`LICENSE`](../LICENSE)
- [`BRAND_GUIDE.md`](../BRAND_GUIDE.md), [`MOTION_GUIDE.md`](../MOTION_GUIDE.md) (designer-facing)
- `plans/*.md`
- Everything under `app/`, `components/`, `hooks/`, `lib/`, `public/`, `styles/` (the marketing site itself)

## Open questions specific to this repo

- **Cross-repo write mechanism (Phase B).** Bot PR vs workflow push vs submodule pull. Recommend bot PR. Decide before Phase B1 ships.
- **Sphinx embedding strategy (Phase B4).** Iframe the engine Sphinx site, or just link out? Recommend link out — iframes interact poorly with Mintlify navigation and break search. Reconfirm.
- **Versioned docs default.** Master plan says skip until v1.0. Confirm Mintlify's `mint.json` is configured for an un-versioned site initially; switching on versioning later is a one-line config change but breaks URLs if not planned.
- **i18n.** Not in scope for v1; flag in IDEAS.md for after first paying customer.
