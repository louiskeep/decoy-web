# Decoy Web prerelease roadmap

Status: authoritative pre-release roadmap for the web surface only. Created
2026-10-22 on Cam's direction. The product-wide roadmap stays
`decoy-platform/docs/ROADMAP.md`; this file governs the two web repos and does
not duplicate engine, CLI, or platform program state.

Scope: the public web surface, which is two branches of one remote
(`louiskeep/decoy-web`):

- **Marketing site** `decoy-site` (branch `main`): plain static HTML/CSS, served
  at the site root.
- **Docs app** `decoy-web-docs` (branch `feat/cli-docs-fumadocs`): Next.js 16 +
  Fumadocs, static export, served under `/docs`.

Both deploy to `decoystorm.dev` through Cloudflare Pages. No backend, no runtime
API: everything ships as static files.

House rules for this surface (from `decoy-web-docs/CLAUDE.md`): marketing claims
never outrun real product capability; performance claims trace to a dated
benchmark; no em-dashes; cite established component patterns rather than rolling
custom ones. Accuracy is the chronic risk on this surface, so the program below
is built around a single generated source of truth rather than hand-typed
examples.

## Where we stopped and how to resume (paused 2026-10-22)

Cam paused the program here as a clean stopping point. The docs work is finished
and pushed; the three-idea program is planned but not started. Two decisions
pinned at the pause:

- **Leave `decoy-engine` alone for now.** The foundation slice touches the engine
  proof generator; do not start it until Cam reopens the program.
- **Publish the docs**, then stop. See the deploy note below.

### Next action when we resume: the engine refresh (proof manifest v2)

This is the first slice and the piece most likely to be forgotten, so it is
written out here. Full plan:
`docs/plans/2026-10-22-proof-manifest-v2-foundation.md`. In order:

1. `decoy-engine/scripts/gen_proof_manifest.py`: the engine version is a
   deliberately **frozen** stamp (`ENGINE_VERSION = "0.2.0"` near line 58, with
   `GENERATED_AT = "2026-06-14"`), kept manual so the sentry-diff test stays
   deterministic. Nobody re-ran it after the engine moved to 0.7.0, so the
   manifest is stale. Decide one of: (a) bump both stamps by hand to the
   documented release (0.7.0 and today), or (b) change the mechanism to read
   `decoy_engine.__version__` plus the engine git short SHA and pin the engine
   version in CI so the sentry diff stays stable. The v2 design prefers (b) so it
   cannot drift again.
2. Regenerate `decoy-engine/docs/proof-manifest.json`. It runs real pipelines
   through the public `PipelineConfig` + `run_pipeline` path; in the engine
   `.venv` it already produces the full 22 mask / 12 generation / 34 provider
   surface (verified 2026-10-22).
3. Re-vendor the fresh manifest to `decoy-web-docs/lib/data/proof-manifest.json`
   and confirm `/proof` renders the full surface. This fixes the live
   under-selling (currently 11 mask / 7 generation; see the known-issue section).
4. Extend to the v2 schema: per-case input/config/output records, setting-variant
   cases, changed-cell annotations, provenance + fixture/config hashes + seeds,
   synthetic-data safety tests, a Zod build-time consumer (replacing the current
   unsafe TS cast), and a drift gate. This is the shared foundation Ideas 1 and 3
   and the Idea 2 fixture all consume.

Gate: every engine edit runs the engine repo gate chain (ci-mirror, dennis,
Codex final) before merge to engine main; the web consumer changes then run the
web gates. After the foundation lands, resume at execution-order step 2.

Nothing is lost at the pause: all docs work is committed and pushed to
`origin/feat/cli-docs-fumadocs` (33 commits ahead of the merge base).

### Deploy note (how "merge" works for this surface)

`origin/main` is the **live static marketing site** (plain HTML: `index.html`,
`features.html`, and four more, latest commit the teal hero). The docs are a
separate Next.js + Fumadocs app on `feat/cli-docs-fumadocs` that builds to a
static export under `/docs`. The two are different codebases, so a plain
`git merge` of the docs branch into main is NOT the publish path; it would splice
the Next app on top of the live marketing site. Publish the docs by one of:
building the static export and vendoring it into the marketing site under a
`docs/` path on main, or deploying the docs branch as its own Cloudflare Pages
project on the `/docs` route. Cloudflare deploy is Cam's action.

## Current state (done / merge-ready)

- **Docs set**: complete and reviewed. 90-page build, clean `check:docs` lint,
  both review passes (accuracy + final) green with every finding fixed. Guides,
  Concepts, and Reference reordered into deliberate labeled groups. Merge-ready
  on `feat/cli-docs-fumadocs`; the merge itself is Cam's (it triggers deploy).
- **Marketing site**: deploy-ready (canonical URLs, OG image, robots, sitemap,
  headers, 404, homepage hero). Cam connects the repo in Cloudflare Pages.

## Known live issue (fix regardless of program scope)

The marketing `/proof` page vendors a **stale** proof manifest. It renders 11
mask capabilities and 7 generation strategies; the engine's authoritative
manifest has 22 and 12, and the documented current totals are 23 and 12. Both
manifests are pinned at engine `0.2.0` while the live engine is `0.7.0`. So the
proof page currently under-sells the product by roughly half. The program's
shared foundation (below) fixes this as a side effect; if the program is
descoped, fix the manifest on its own.

## The program (three enhancements on one shared foundation)

Source: Codex plan 2026-10-22, reviewed by Cam. The unifying decision is to NOT
build a second example generator. Extend the existing engine proof manifest into
a versioned "proof manifest v2" that is the single source of truth for every
generated example on the web surface.

### Shared foundation: proof manifest v2

Extend the engine proof generator (`decoy-engine/scripts/gen_proof_manifest.py`
producing `decoy-engine/docs/proof-manifest.json`) to carry, per case: a stable
case ID, the input and configuration and output records, setting-variant cases
(one config field changed), changed-cell annotations, engine version and commit,
generator schema version, fixture and config hashes, deterministic seed and
test-secret identifiers, the invariants the generator verified, and
synthetic-data provenance plus safety status.

Rules:
- Every strategy example runs through the **public** `PipelineConfig` plus
  `run_pipeline` path. Remove the `joint_mask` direct-transform shortcut. If a
  strategy genuinely cannot run the public path, it gets an explicit waiver and
  no published generated example until equivalence is proven.
- Reuse and audit the existing healthcare fixture; do not replace it. Add
  executable safety tests: no real-data lineage, reserved example domains,
  clearly fictional identities, no identifier that could plausibly match a real
  person or provider, no production secrets.
- The docs consumer parses the manifest with Zod at build time (replaces the
  current unsafe TypeScript cast). One vendored manifest feeds both the existing
  proof pages and the new strategy examples, with a sync receipt recording
  producer commit, artifact hash, schema version, and sync time.

This foundation reaches into `decoy-engine`, so its slice runs the engine repo's
own gate chain, not just the web gates.

### Idea 1: Intended-workflow A-Z guide

A new page `content/docs/start/workflow.mdx` ("From source data to verified
output"): one end-to-end walkthrough with a visual node view. Nodes are semantic
HTML link-cards; a decorative `aria-hidden` inline SVG draws connector lines on
desktop; on mobile the same nodes reflow into an ordered vertical path. Zero
client JS, no graph library. A JSON manifest is the only topology source and is
lint-gated so node links cannot rot.

Workflow steps: select representative source data, analyze with STORM, review
and confirm findings, choose strategies, author the YAML pipeline, validate and
explain and preflight, run, verify output, automate in CI. Branches shown
explicitly: subset (preparation), generate (alternative mode), unmask
(restricted recovery for FPE and vaulted values only, not general reversal).

Rejected: React Flow (SSG friction, bundle weight for a tiny fixed graph),
runtime Mermaid (theme/link/focus control loss), Fumadocs Graph View (it maps
page links, not a product workflow), raster image (no links, no dark mode, no
accessibility).

Mostly buildable now. Only publishing exact command syntax waits on a selected
launch-candidate CLI commit.

### Idea 2: In-browser demos (marketing site)

A guided, recorded state-machine walkthrough on `decoy-site` (new `demo.html`),
not a live shell and not a browser port of Decoy (Pyodide alone is 200MB-plus
before product deps). Stays plain HTML/CSS/dependency-free JS.

- **CLI walkthrough** (published first): each step carries the exact command,
  stdout, stderr, exit status, created files, and output hashes. Next / Back /
  Restart / full-transcript controls. No editable fake prompt. Full content
  readable with JS disabled. Reduced-motion respected. The transcript is
  machine-recorded from a pinned CLI, never hand-authored.
- **Studio walkthrough** (built but UNPUBLISHED): real Playwright screenshots
  from a pinned platform commit and deterministic fixture, each step mapped to a
  release-candidate browser test and an authoritative capability statement.
  Excludes held or UI-incomplete features. Publishing it is an R3 product-claim
  decision: needs Cam's approval plus the platform sales-ready evidence gate.
  Until then `/demo` exposes the CLI walkthrough only.

### Idea 3: Visual-first strategy examples

Two server-rendered (hydration-free) MDX components generalizing the existing
proof table: `StrategyExample` (one input, one real generated output) and
`SettingDiff` (one shared input, two configs, two real outputs). Rolled out
across all 23 strategy pages from the v2 manifest, and codified as a
strategy-page template plus a lint rule (every non-index strategy page
references exactly one canonical example and either a setting comparison or an
approved not-applicable reason). Canary on redact, hash or fpe, and joint_mask
before the full rollout. MDX references a stable case ID only; pages never
duplicate input, output, or settings values.

### Idea 4: How-it-works performance section (plan first, via Codex)

The `/how-it-works` page needs a performance section that answers "how fast is
Decoy, and will my job fit on my box" with numbers a reader can trust. This item
is a **plan task, not a build task**: get Codex to produce the implementation
plan (engine repo gate chain, since it reaches into benchmarks) before any page
work starts. Added 2026-10-24 on Cam's direction.

What the plan must decide, in order:

1. **Which benchmarks exist vs must be run.** The only committed dated benchmark
   is `decoy-engine/tests/benchmark/calibration/results.md` (2026-05-09, one
   laptop): mask only, 1M to 10M measured, 25M to 100M extrapolated, and framed
   around the old Polars-hybrid path, not the current Rust-first engine. Every
   number on the page traces to a dated benchmark file (repo rule), so the plan
   names the runs that must happen first: per operation, per scale, per engine
   path, on a pinned fixture and hardware. Cloud runs for 50M+ are a separate
   budgeted action (see the GCP bench memory).
2. **The matrix shape** (recommendation to hand Codex as the seed, below).
3. **Honest provenance.** Each row links its dated benchmark file and the exact
   hardware; extrapolated cells are labeled, not presented as measured; numbers
   older than one engine release carry a "last measured on" note.

Recommended matrix (seed for the plan, Codex to confirm or revise):

- **Primary table, operation x scale.** Rows are the operations with distinct
  throughput profiles (mask, generate, subset, scan, DP fit); columns are row
  counts (1M, 10M, 100M). Each cell carries two numbers that answer different
  questions: sustained **throughput** (rows/sec, the hardware-neutral
  comparator) and **wall-clock** (the concrete "how long will it take"). A
  trailing column gives **peak RAM** at a reference scale, because RAM, not CPU,
  is the ceiling that decides what box or instance class a job needs.
- **Secondary view, the "why".** A smaller companion table or toggle for the two
  axes that explain the headline numbers and let a reader map them to their own
  setup: **engine path** (Rust native fast-path vs pandas fallback, by
  operation) and **I/O format** (CSV vs Parquet vs direct DB roundtrip, since
  I/O dominates at a DB boundary: a 1M DB-to-DB roundtrip is roughly a minute,
  almost all of it I/O).
- **One honest floor.** A single stated sustained single-thread floor (about 20k
  rows/sec) as the conservative "never slower than" anchor, so the headline
  bests are not mistaken for guarantees.

Not recommended: a cell per strategy (23 strategies x scales is noise, not
signal; strategy cost collapses into a few bands, keyed as heavy FPE/hash vs
light redact/passthrough, which belongs in a note not a grid), and any
third gridded axis (hardware, column count) that turns a readable 2D table into
an unreadable cube. Keep those as row annotations or a secondary table.

Blocked: publishing any measured number is blocked on the benchmark runs the
plan identifies; the layout and the matrix component are not blocked and can be
built against placeholder data behind a claim-review gate.

## Execution order

Work the slices in this order (web loop):

1. **Foundation**: proof manifest v2 (schema, safe fixture + safety tests, Zod
   consumer, sync receipt, drift gate). Fixes the stale `/proof` manifest.
2. **CLI truth pin**: select the launch-candidate CLI and engine commits; refresh
   the vendored CLI reference. (Coordinates with platform `§CLI-LAUNCH`.)
3. **Idea 1**: ship the workflow page (after route-manifest lint and claim review).
4. **Idea 3 canaries**: redact, hash/fpe, joint_mask.
5. **Idea 3 rollout**: generated examples across all 23 strategy pages.
6. **Idea 2 shell**: accessible static CLI-demo page on the shared fixture.
7. **CLI capture**: record the transcript from the pinned runnable CLI.
8. **Studio capture**: test-backed approved storyboard only.
9. **Studio publication**: R3 product approval before any nav, sitemap, or CTA
   exposure.

## What is blocked on a runnable launch CLI or engine

| Work | Blocked? |
|---|---|
| Workflow layout, graph component, route manifest, mobile design | No |
| Strategy component + manifest schema design | No |
| Demo page shell + accessibility | No |
| Real strategy outputs (Idea 3) | Needs a runnable pinned engine through its public pipeline path |
| Exact CLI transcript + output files (Idea 2) | Yes, needs a runnable pinned CLI |
| Publishing exact workflow command syntax (Idea 1) | Needs the launch-candidate CLI commit selected |
| Studio screenshots | No CLI dependency; needs a pinned runnable platform fixture + product approval |
| Browser-based real Decoy execution | Out of scope; separate feasibility project |

Two docs pages are separately blocked on the launch CLI and are tracked in the
platform roadmap under `§CLI-LAUNCH`: the templates-contents page and the
version-provenance refresh.

## Effort (solid tier per idea, from the plan)

- Foundation: folded into Ideas 2 and 3, not double-counted.
- Idea 1: about 4 to 6 days.
- Idea 2: about 2 to 4 weeks (Studio capture gated separately).
- Idea 3: about 2 to 3 weeks.

## Acceptance gates (every web slice)

`decoy-web-docs`: `pnpm exec tsc --noEmit` (the Next build ignores TS errors, so
check types explicitly), `pnpm run check:docs`, `DOCS_PUBLISHED=true pnpm run
build`, then serve and inspect `out/` (not the dev server); axe + keyboard +
light/dark + mobile on the exported site; prove Ideas 1 and 3 add no client-side
page JS; producer safety tests plus consumer schema/hash/provenance checks.

`decoy-site`: serve as static files; verify no API or backend requests; verify
full content readable without JS; test tabs, controls, focus, reduced motion,
responsive images; update all six page-nav copies, sitemap, canonical, and OG
metadata; apply the banned-character, private-link, and synthetic-data checks to
demo manifests and transcripts.

Risk class R2 for the docs changes, generated examples, CLI demo, and the
unpublished Studio shell. Public Studio promotion is R3.
