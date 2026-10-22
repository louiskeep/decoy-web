# Decoy docs: capability audit and build plan

Status: active plan. Last updated 2026-10-22.

The documentation plan for decoystorm.dev/docs. Covers the CLI/engine docs
(publishable at the Apache flip) and the Decoy Studio platform docs (held until
platform launch). Built from a three-part capability audit (engine, current
docs, platform) run 2026-10-22.

## Decisions (confirmed with Cam 2026-10-22)

1. Information architecture follows the platform's existing content map
   (`decoy-platform/docs/public/content-map.md`), which is Diataxis-organized.
   Do not invent a new structure.
2. Page style follows DuckDB: terse, example-forward. Template below.
3. Sequence: fill the CLI/engine gaps and restyle first (publishable now), then
   build the Studio section as a held draft.
4. This document is the durable plan. Keep it current as pages land.

## Page template (the standard for every page)

```
# <Name>

<One line: what it does.>

<One or two sentences: how it works. No filler.>

## Settings
| Option | Type | Default | Description |
| --- | --- | --- | --- |

## Examples
<runnable YAML and/or CLI, with before/after output where it helps>
```

Reference pages (strategies, providers, config keys, connectors) use the full
template. Recipe/how-to pages use: goal, the config that does it, the run
command, the result. No long English explanations.

Rules:
- The frontmatter `description` is the one-line tagline (it renders as the page
  subtitle). Do NOT repeat it as the first body line. The body opens with "how
  it works".
- Prefer visual input/output examples for every setting: show a before/after
  table or a sample dataset transformation, not just prose.
- Strategy reference is one page per strategy (DuckDB-granular), best for search
  and AI retrieval.

## Information architecture (final, Codex-reviewed 2026-10-22)

Four top-level sections (Diataxis: learn, do, understand, look up):

```
Get started    install, quickstart, demo
Guides         the recipe cookbook (task-oriented how-tos)
Concepts       determinism, keys & vault, STORM, disguises, DP, limits
Reference      Configuration (yaml-schema -> folder, post-reorg)
               Masking strategies   (one page per strategy)
               Synthetic data providers  (catalog, post-reorg)
               Connectors and formats
               Relationships
               CLI reference        (generated per-command)
               Feature support and limits   (renamed from Capabilities)
llms.txt       AI-parseable index, generated from frontmatter
```

Connectors and CLI reference are nested UNDER Reference (they are lookup
material), not top-level. Chrome links back to the marketing site at the root.
Docs mount at /docs.

When Studio docs arrive, split the nav by surface and centralize shared material:
`Get started / Command line (Guides+Reference) / Decoy Studio (Guides+Reference) /
Concepts / Engine reference`. Shared strategies, providers, config, connectors,
relationships live in Engine reference, not under a single implicit surface.

## Sources of truth

- Capability counts and lists: `decoy-engine/docs/capability-matrix.md`
  (generated, drift-guarded). Current: 23 mask strategies, 12 generation
  strategies, 34 providers, 25 STORM detectors, 10 disguises, 6 connectors.
- Platform "what works today": `decoy-platform/docs/product/capabilities.md`
  (Shipped / Engine-API / Legacy / Placeholder labels).
- What to document, per surface: `decoy-platform/docs/public/content-map.md`
  (Diataxis), `manifest.yaml` (page list), `gaps.md` (launch-blocking gaps).
- CLI commands: the generated reference at
  `content/docs/cli/_source/cli-reference.md` (vendored from the real CLI). This
  is authoritative for CLI verbs; the engine repo's `docs/cli.md` is stale.

## CLI / engine gaps (do first, publishable now)

Everything below is shipped in engine 0.7.0. These are documentation holes, not
product gaps.

| Capability | State in docs | Action |
| --- | --- | --- |
| Install, Quickstart, Demo | good | keep |
| Generation, DP, STORM, disguises | good, has examples | keep |
| S3 / GCS connectors | good, has examples | keep (SFTP stays "not wired"; DB is V2) |
| Mask strategies | reference is prose-heavy | restyle to template; add per-strategy settings |
| FK / relationships | only single-column 1:N shown | add 1:1, composite-key, self-referential, multi-parent YAML examples |
| Subset | `decoy subset` command documented; no runnable `subset:` YAML | add a subset recipe: seeds (sample/filter/keys), budget, edge_directions, allow_dangling; note Parquet-only |
| Parquet | named in format enums only | add one end-to-end Parquet read/write example |
| Templates | `init` / `templates` documented | add a page showing actual `decoy templates show <name>` contents. BLOCKED: needs real CLI output (no decoy-cli repo or template files locally; do not fabricate) |
| `reference/yaml-schema.mdx` | raw JSON-Schema dump | restyle to settings tables + examples per config object |
| `reference/capabilities.mdx` | prose/tables, no examples | restyle, or repurpose as a "what's supported today" index |
| Version skew | capabilities.mdx says 0.7.0; how-to/CLI pages say CLI 0.1.0 / engine 0.4.0 | PARTIAL. Fixed the stale `0.2.0` removal claim in scan-for-pii. The "captured against CLI 0.1.0 / engine 0.4.0" tags are honest provenance on real output; bumping them without re-running would falsify the claim (CLI-blocked, needs a re-capture). The generated CLI-reference `0.2.0` removal targets come from the vendored CLI help (CLI-side fix). |

FK shapes to show (all supported, deterministic, byte-stable):
1:1, 1:N, composite keys (`columns: [a, b]`), self-referential
(`employees.manager_id -> employees.id`), multi-parent / multi-child, multi-hop
chains (A->B->C). Null FK passes through. `orphan_policy`: preserve, remap,
warn, fail. Keys bound by shared `namespace` on parent, child, and relationship.

Subset facts to show: `subset:` block, `seeds` with modes sample/filter/keys,
predicate ops (eq/ne/lt/le/gt/ge/in/is_null/is_not_null), `budget`
(max_total_rows, max_table_seed_multiple), `edge_directions`
(both/downward/upward/none), `allow_dangling`. Parquet-only; runs before masking.

## Platform / Studio (build as held draft, publish at platform launch)

The platform is pre-GA. Document only shipped surfaces. The platform content-map
and manifest already list the intended pages; follow them.

Publish-worthy (shipped and wired today):
- Job Studio (default editor, partial YAML parity) and the HiFi graph builder (legacy)
- Connectors UI: files, S3, GCS, SFTP (saved connectors, test, browse/import)
- Jobs: run, stream (SSE), cancel, history, lineage, fidelity, quarantine records
- STORM UI + FORECAST (disguise recommendations, create pipeline from scan)
- Notifications: email, Slack, webhook; alert rules; test-fire
- Auth: first-user setup, login, sessions, invites, API keys; OIDC SSO; 4-role RBAC (admin, release_manager, developer, user)
- Data-access grants (allow/mask/forbid by user/role/connector/schema/table)
- Reporting: runs, masking reports, compliance HTML, audit trail, operations panel
- Reviews (flag_gate approve/reject), Mirrors, Triggers (+ HMAC webhook)
- Runtime secrets (`${env.name}`), fixed-width layouts
- MCP server at /mcp (5 tools: list/get pipelines, list/get jobs, create job)
- REST API + generated OpenAPI; licensing (tier/seats/expiry); key backup/recovery

Do NOT document as GA (in-dev / disabled / deferred):
- Group -> Project RBAC (dormant models only, not wired)
- Projects/Groups management UI
- Generation API (proposal, "do not build until re-gated")
- Signed tamper-evidence (hash-sealing only; signing reserved for R4)
- ML advisory column classification (merged but off, no UI)
- Workflow execution (disabled this release)
- In-platform schedule creation (410'd; external cron calls POST /api/jobs)
- Cloud STORM scan (V2), platform database connectors (V2)
- Reversible tokenization vault (V2)
- Admission-control enforcement (measurement-only, default off)
- Studio FK add/edit and the fixed-width layout picker (read-only / not wired)
- The broader OBS observability program (in flight)

Platform pages from content-map (Diataxis):
- Tutorials: quickstart (install to first masked file); self-host the platform
- How-tos: author a YAML pipeline; mask with the right strategy; preserve FK/relationships; apply a compliance disguise; profile with STORM; back up/restore keys; deploy/run/operate; verify an SFTP host key
- Reference: CLI command ref (generated), YAML JSON-schema, platform API ref (generated OpenAPI), connectors and formats, "what Decoy supports today", known limits and support, glossary; per-surface: admin, alerts, auth, capabilities, cloud-target lifecycle, composites, data-tables, disguises, files, fixed-width-layouts, folders, health, jobs, pipeline-variables, pipelines, profile, storm, strategies, text-redact, tokenization
- Explanation: how Decoy works; disguises and regulations; deterministic masking and keys; security architecture; why vs adjacent tools

gaps.md launch-blocking (author before launch): per-connector setup guides
(S3/GCS/SFTP auth + IAM), before/after example per masking strategy, YAML
JSON-schema for IDE, generated CLI command reference. High value: performance and
sizing guide, key management + rotation runbook, compliance audit-prep checklist,
troubleshooting/FAQ.

## Publish gates

- CLI/engine docs: publish at the engine Apache flip. All content is shipped today.
- Studio docs: stay behind the `DOCS_PUBLISHED` draft gate until platform launch.
  The gate is fail-closed (deny by default) on any host.

## Build sequence

1. DONE: sample pages signed off; FK-shapes reference, subset recipe, Parquet
   page shipped.
2. Per-strategy pages, one page each under `reference/strategies/`. DONE (23/23,
   all user-facing mask strategies). Params verified from the engine handlers;
   each page points to `decoy strategies inspect <name>` for the complete set.
   Follow-up (CLI-blocked): add verified before/after output for the pages that
   currently show config-only examples (needs a real CLI run).
3. Restyle `yaml-schema.mdx` and `reference/capabilities.mdx` to the template.
4. DONE: `llms.txt` generated from frontmatter by scripts/build-llms-txt.mjs
   (prebuild), serves at the docs deploy root. Deploy detail: in the unified
   /docs model it lands at decoystorm.dev/llms.txt listing the /docs pages.
5. Templates-contents page (BLOCKED on CLI) and version-provenance refresh
   (BLOCKED on CLI).
6. Build the Studio section as held drafts, shipped surfaces only, from the
   content-map.

## Review log

- 2026-10-22, Codex final pre-merge review. Verdict FIX-FIRST, 3 blockers, all
  fixed: (1) a reorg bug, sync-cli-reference.mjs still wrote the old
  content/docs/cli/_source path; (2) connector claims contradicted themselves
  (capabilities said S3/GCS/SFTP read-write and claimed fixed-width output, vs
  the connectors page saying the CLI moves only type:file and fixed-width is
  input-only) -- reconciled to the CLI reality; (3) the DP concept page
  overstated the guarantee and had two factual errors (person-level direction,
  epsilon/noise direction) that contradicted the limits page -- fixed and
  aligned to the engine's honest-limits position. Nav was otherwise coherent.

- 2026-10-22, dennis factual-accuracy cold-read of the 23 strategy pages +
  providers + relationships + subset + parquet against the engine handlers:
  11 P1 / 4 P2 / 3 P3. All remediated with the engine evidence (the grep-extracted
  DSL/NER/geo/code_set/joint_mask pages had guessed semantics; fixed). The simple
  number/date pages held up. Final Codex gate + Cam review still pending before
  merge.

## Within-section ordering (Codex review 2026-10-22)

Applied Codex's within-section ordering so sections read as a progression, not
authoring order:
- Guides grouped by outcome (Discover and mask / Build safer test datasets /
  Handle specialized data / Operationalize).
- Concepts ordered foundational-first (determinism, keys, storm, disguises, DP).
- Reference ordered capabilities, configuration, strategies, providers,
  relationships, connectors, cli, exit-codes, limits.
- Strategies grouped (Common masking, Categories/generalization, Dates/geography,
  Free text/domain codes, Derived values, Grouped/multicolumn).
- Moved high-cardinality from Concepts to Guides ("Handle high-cardinality
  categorical data"); it was config/examples, not a concept.

Codex new-guide suggestions: DONE `choose-a-masking-strategy` (decision table
bridging STORM findings to the strategy pages) and `unmask-data` (FPE reverses
from the config; vault:true columns reverse with the vault file; everything else
one-way, verified against the generated unmask CLI reference). TODO: refactor
`strategies/index` (before/after gallery) into a concise categorized index.

## Post-reorg backlog (Codex IA review 2026-10-22)

The reorg is done (4 sections; connectors + CLI nested under Reference; order +
rename). These follow-ups came out of the Codex review, deferred by Cam to after
the reorg:

1. DONE (folder): Configuration is now a folder with a clean overview index
   (top-level keys table linking out), a Global settings page, and the full
   field-by-field JSON schema as a sub-page. Sources/targets, tables, generation,
   validation detail link to the existing connectors/strategies/providers pages
   rather than being re-derived (avoids the guessed-param risk dennis flagged);
   dedicated sources-and-targets and tables pages can follow if wanted.
2. DONE: Providers catalog at reference/providers (the 34 providers grouped by
   family: people, addresses, composites, identifiers, generic), distinct from
   the `decoy providers` CLI page. Could split into per-family pages later.
3. Finish the remaining ~12 per-strategy pages (see item 2 in the sequence).
4. Connectors and formats: give CSV, Parquet, and other formats their own lookup
   pages alongside the file/S3/GCS/SFTP connector pages.
5. DONE: `exit-codes` moved from Concepts to reference/exit-codes (after CLI
   reference); the two inbound links repointed.
6. Split `high-cardinality-categories`: keep rationale in Concepts, move settings
   and failure cases into Configuration/reference.
7. DONE: `what-we-cannot-prove` -> reference/limits "Security, privacy, and
   compliance limits", under Feature support; the 4 inbound links updated.
8. Replace the Feature-support page body with a concise support matrix that links
   to the authoritative strategy/provider/connector/validation/limits pages.
9. DONE (partial): docs landing now has task-based entry points to the four
   sections. A Command line / Studio surface chooser comes when Studio ships.

## Later (after the core docs ship)

Captured from Cam 2026-10-22, not for this pass:

1. "Intended workflow" guide (own page, top-level). An end-to-end A-Z that walks
   each tool/step in order and says where it is meant to be used and what it does:
   pre-STORM scan the files, configure the YAML (optionally from STORM output),
   configure a generate job off a mask table, compile the job, run it, post-check.
   Include a visual node-based view of the flow so a user can learn to run Decoy
   without reading everything. The goal: give context up front so users see the
   simple path and know which advanced features they can ignore.
2. In-browser demo on the marketing site: a playable Decoy CLI walkthrough and a
   platform walkthrough, both running a basic A-Z workflow on a sample healthcare
   dataset.
3. Visual-first examples everywhere: basic input plus output for a given setting,
   or what a setting does to a dataset. (Now a standing rule in the page template
   above; listed here as the origin.)

## Open questions for Cam

- Version string to standardize on across docs (engine 0.7.0 confirmed; CLI
  version to confirm).
- Whether an in-app license renewal reminder UI is expected (audit found expiry
  and staleness state, no dedicated reminder surface).
- Production serve mechanism for the unified site (merge the two static builds
  into one Cloudflare Pages deploy at decoystorm.dev, docs owning /docs).
