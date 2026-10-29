<!--
Authored by Codex (gpt-6-astra) on 2026-10-24 at Cam's request ("get codex to build a plan for the how it works pages ... performance ... what matrix").
Seeded with the verified W3 traceability audit (see CLAIMS-AUDIT.md). Plan only; not yet reviewed or scheduled by Cam.
Roadmap: docs-src/ROADMAP.md Idea 4.
-->

# Implementation plan: Decoy performance matrix

**Status:** Plan only. Do not build or edit the site yet.

**Risk:** R3. The implementation will create consequential public performance claims and may incur GCP cost. Cam is the required approver for claim policy, cloud runs, and each page review.

**Rules consulted:** `/home/cam/dev-rules/00-universal.md`, `risk-and-exceptions.md`, `development-loop.md`, `exploration.md`, `reuse-first.md`, `feature-dev.md`, `performance.md`, `documentation.md`, and `docs-src/CLAUDE.md`.

## 1. Guarantee and non-goals

### Guarantee

The finished section will answer:

1. How long a representative Decoy operation took at 1M, 10M, and 100M rows.
2. What sustained throughput was observed.
3. What peak process RAM was observed, so a reader can compare the run with their box.
4. Which user-facing command and production route produced the result.
5. When, where, and against which engine version the measurement was taken.
6. Whether a result represents the default product route or a separately labeled diagnostic or forthcoming path.

Every displayed performance number will link to a dated committed benchmark record. Missing evidence produces `Not measured`, never an extrapolated or unattributed number.

### Non-goals

- No per-strategy 23-by-3 grid.
- No hardware or column-count axis inside the primary matrix.
- No interactive calculator, chart library, client-side filtering, or JavaScript tabs.
- No claim that one benchmark guarantees a customer's runtime or capacity.
- No Windows, macOS, or ARM64 performance claims without equivalent measurements.
- No page implementation during this plan.
- No 100M or other paid cloud run without Cam's immediate approval.

## 2. Decisions required before benchmarking

### Gate A: Resolve the production route

Before defining headline benchmarks, determine on the release candidate whether default `decoy run` reaches the compiled chunked executor for the canonical mask fixture.

Record, from the actual user-facing command:

- Requested mode and flags.
- Observed execution mode.
- Backend for every measured column.
- Whether `run_native_or_oracle_chunked` was reached.
- Chunk count and thread count.
- Whether any column caused whole-table fallback.
- Engine, CLI, platform, and native companion versions and SHAs.

The September audit is not sufficient to infer the current route. It proves that the fast 1.27-second and historical 100M figures were not representative of the production route at the audited commit.

Cam must choose one of these policies after the route probe:

1. **Default-route-only, recommended:** The primary matrix contains only results reached through the unforced user-facing production command. Forced fast-path results appear only in the secondary comparison.
2. **Default plus clearly separated lab path:** The primary matrix remains default-route-only, while a visibly labeled secondary row reports the forced compiled executor as `Diagnostic fast path, not the default decoy run route`.
3. **Forthcoming path:** If integration is committed but not released, label it `Forthcoming, measured on unreleased commit <SHA>`. Do not place it in the primary matrix or home-page proof tiles.

A direct executor benchmark must never be labeled simply `Decoy performance`.

### Gate B: Reject the proposed guaranteed floor wording

Do not publish “never slower than 20k rows/sec.” A benchmark cannot establish a universal lower bound across strategies, schemas, I/O, hardware, and future versions.

If supported by the new runs, replace it with:

> Slowest sustained rate observed in this benchmark suite: X rows/sec.

That statement must identify the operation, route, fixture, hardware, and measurement date. If the complete suite does not support it, omit the floor entirely.

### Gate C: Choose the benchmark host

Cam must approve:

- The standard local host for 1M and 10M runs.
- The GCP machine type, disk type, region, estimated runtime, and spending ceiling for 50M+ runs.
- Whether local and cloud numbers may coexist in one matrix. Recommended: yes, but every cell must show its host, and no caption may call cloud results “developer-host runs.”

## 3. Exact primary matrix schema

Use one real HTML table with this column structure:

| Column | Meaning |
|---|---|
| **Operation and fixture** | Operation name, command, row denominator, fixture shape, and route-sensitive conditions |
| **1M rows** | Median sustained throughput and median end-to-end wall time |
| **10M rows** | Median sustained throughput and median end-to-end wall time |
| **100M rows** | Median sustained throughput and median end-to-end wall time |
| **Peak RAM** | Maximum observed process RSS across repetitions, with the scale at which it occurred |

Rows:

1. **Mask, four-column mixed fixture**
2. **Generate, canonical pure-generation fixture**
3. **Subset, two-table FK fixture**
4. **Scan, built-in detectors**
5. **DP fit, canonical mixed-type fixture**

### Cell format

Every measured scale cell contains exactly:

```text
238k rows/s
7m 00s wall
Measured 2026-10-24, H2, decoy-engine 0.x.y (abcdef12), default route [record]
```

The final annotation must include:

- ISO measurement date.
- Hardware identifier linked to a full hardware description.
- Engine semantic version and short SHA.
- Route label.
- Link to the dated committed benchmark record.

Use `Not measured` when no qualifying run exists. Use `Not applicable` only where an operation genuinely has no corresponding path. Never render an empty cell, estimate, projected value, or value derived from another scale.

### Metric definitions

- **Wall time:** Monotonic time from spawning the documented user-facing command until its successful exit. It includes config validation, local input read, operation execution, and output write.
- **Throughput:** Row denominator divided by the same end-to-end wall time. It is not kernel-only throughput.
- **Mask:** Input rows processed.
- **Generate:** Output rows created.
- **Subset:** Source rows scanned. The fixture's retained percentage and output row count must be shown in the row annotation.
- **Scan:** Input rows inspected.
- **DP fit:** Input rows used to produce the fitted snapshot.
- **Peak RAM:** Maximum absolute worker-process RSS, measured using one documented Linux mechanism across all runs. Record starting RSS separately, but publish the absolute peak.
- **Published statistic:** Median of per-run wall time and throughput. Publish maximum observed RSS, not median RSS.
- **Variance record:** Preserve every repetition plus min, median, max, and coefficient of variation in the benchmark record. Do not claim p95 from three or five samples.

### Row annotations

Each row must state:

- Exact command and entry point.
- Input and output format.
- Column count and relevant types.
- Strategy or detector mix.
- Thread count.
- Output cardinality where it differs from input.
- Observed route and per-column backend.
- Correctness guard that passed.
- Whether the operation is CPU-bound, RAM-bound, or I/O-dominated in this fixture.

For masking, use three explanatory cost bands in prose, not a grid:

- FPE
- Hash
- Redact, truncate, and passthrough

Do not combine FPE and hash into one “heavy” band. They can take different routes and have materially different cost profiles.

## 4. Secondary “why” view

Use two always-visible semantic tables. Do not use a toggle because the site must work without JavaScript and the comparison is important context, not optional decoration.

### A. Engine-path comparison

| Path | Product status | Entry point | Observed route/backend | 1M | 10M | Peak RAM | Evidence |
|---|---|---|---|---:|---:|---:|---|
| Default | Production | `decoy run` | Captured from evidence | measured | measured | measured | dated record |
| Pandas fallback | Production fallback | `decoy run --no-native` | pandas | measured | measured | measured | dated record |
| Compiled dispatcher | Diagnostic or forthcoming | Exact invocation | Rust plus Arrow/Python | measured | measured | measured | dated record |

Only add a 100M column here if all compared routes have measured 100M results. Otherwise omit it rather than presenting an uneven comparison as complete.

### B. I/O comparison

Use the canonical 1M mask fixture and default route:

| I/O path | Boundary | Wall time | Throughput | Peak RAM | Interpretation | Evidence |
|---|---|---:|---:|---:|---|---|
| Parquet to Parquet | Local NVMe | measured | measured | measured | Baseline for primary matrix | dated record |
| CSV to CSV | Local NVMe | measured | measured | measured | Parse and serialization cost included | dated record |
| Postgres to Postgres | Production platform worker | measured | measured | measured | DB and transport time included | dated platform record |

The current “about one minute” DB roundtrip is not publishable until rerun with database version, topology, network placement, table schema, transaction behavior, and compute-versus-I/O timing recorded.

## 5. Pinned benchmark fixtures and protocol

### Shared protocol

For every operation and scale:

- Pin CLI, engine, platform where applicable, native companion, Python, Rust toolchain, and dependency lock SHAs.
- Record OS, kernel, CPU model, allocated and visible vCPU count, RAM, disk model/type, filesystem, database version, and relevant environment variables.
- Use deterministic fixture generation and commit the fixture specification and digest.
- Record uncompressed logical bytes and on-disk bytes.
- Run in a fresh process each time.
- Perform one unreported warmup at the smallest practical scale.
- Run five measured repetitions at 1M and 10M.
- Run three measured repetitions at 100M unless the approved cloud budget permits five.
- Verify row count, schema, output invariants, and route evidence on every repetition.
- Treat route drift, fallback, correctness failure, OOM, timeout, or incomplete provenance as a failed cell, not a slow measurement.
- Do not mix results from different code SHAs in one row.

### Canonical operation fixtures

#### Mask

- One Parquet input and one Parquet output.
- Four measured columns using hash, redact, truncate, and passthrough.
- Fixed high-cardinality string data, null pattern, mask secret, namespaces, and chunk size.
- Correctness guard: output digest or byte-equivalent logical digest against the oracle, row count, schema, and per-column backend witness.
- Required paths: default production route, pandas production fallback, and forced compiled dispatcher if Cam elects to show it.

#### Generate

- Reuse the committed F4 pure-generation fixture rather than inventing a favorable workload.
- Preserve its date-window bottleneck and exact generated column mix.
- Correctness guard: row count, schema, declared constraints, repeatability contract, and backend witness.
- Required path: default user-facing production route.
- A 100M result requires an owner-approved cloud run. The current two-hour estimate is not a measured cell.

#### Subset

- Two Parquet tables with one declared FK.
- Scale is total source rows.
- Fixed 10% parent seed selection, deterministic child fan-out, null rate, and orphan policy.
- Correctness guard: exact retained row counts, FK closure, orphan-policy result, and output digest.
- Required path: default `decoy subset` production route using the observed Polars implementation.
- Do not conflate “subset then mask” with subset-only performance.

#### Scan

- One Parquet table with a fixed mix of positive and negative values across the built-in detectors.
- Exclude optional spaCy NER from the primary row. It requires a separate named workload if measured.
- Correctness guard: stable finding counts and detector identifiers.
- Required path: default `decoy pre-scan` production route.

#### DP fit

- One Parquet table with a pinned mix of numeric, categorical, and date columns.
- Pin bounds, clipping policy, epsilon, delta, and output snapshot configuration.
- Correctness guard: successful budget accounting, snapshot schema, declared bounds, and operation-specific invariants. Do not require byte identity if the privacy mechanism intentionally uses fresh randomness.
- Required path: default `decoy fit` production route.

## 6. Runs that already exist versus runs still required

| Evidence | What it establishes | Treatment |
|---|---|---|
| `decoy-engine/docs/records/2026-09-30-rust-coverage-evidence-audit.md` | 1M direct-dispatch results, default-route mismatch, and historical 100M provenance | Use for the route warning and historical audit only |
| `decoy-engine/docs/plans/native-throughput-phase1-task1.2-record.md` and `docs/native/supported-matrix.md` | 4M direct-dispatch hash throughput on one dev box, measured 2026-09-10 | Historical fast-path evidence only; not a primary production result |
| `decoy-engine/tests/benchmark/calibration/results.md` | 2026-05-09 mask calibration on an old hybrid path; 25M+ values extrapolated | Do not reuse in the new matrix |
| `decoy-platform/docs/backlog/RECENTLY-SHIPPED.md` F4 entry and its committed validation artifacts | Pure generation and mixed generation/masking evidence at lower tiers; a separate 100M mixed cloud run | Candidate cross-check only; not a complete operation-by-scale matrix |
| Existing 100M direct-dispatch result | About 429.85 seconds and 446.9 MB on a remote host | Do not present as a developer-host or default-route result |

Required new runs:

| Operation | 1M | 10M | 100M | Paths |
|---|---|---|---|---|
| Mask | rerun | rerun | rerun on approved GCP | default, pandas fallback, optional forced compiled |
| Generate | rerun canonical F4 fixture | rerun canonical F4 fixture | new approved GCP run | default |
| Subset | new | new | new approved GCP run | default |
| Scan | new | new | new approved GCP run | default |
| DP fit | new | new | new approved GCP run | default |
| CSV I/O | new | optional validation | not required for secondary view | default mask |
| Postgres roundtrip | new | optional follow-up | not required for secondary view | production platform worker |

All 50M+ runs are budgeted, flagged R3 actions. Immediately before starting them, present Cam with the exact machine, image, region, estimated hours, maximum cost, commands, output destination, and stop conditions.

## 7. Benchmark record and traceability design

### Canonical location

Create one dated suite under the location already required by the site rule:

```text
decoy-engine/tests/benchmark/calibration/site-matrix/YYYY-MM-DD/
  record.md
  results.json
  fixture.yaml
  host.json
  commands.txt
  checksums.txt
```

`record.md` is the human-readable source cited by the site. `results.json` is the machine-readable source for rendering and validation.

For platform-only DB and cloud evidence, keep raw artifacts in:

```text
decoy-platform/docs/product/release-1-validation-runs/YYYY-MM-DD-<run>/
```

The engine calibration record should link the immutable platform commit and raw result path rather than copying raw evidence without provenance.

### Rule amendment

Amend `docs-src/CLAUDE.md` from an engine-directory-only rule to:

> Every performance claim must link to a dated committed benchmark record. Engine and CLI claims use `decoy-engine/tests/benchmark/calibration/`. Platform connector and remote validation claims may use `decoy-platform/docs/product/release-1-validation-runs/`, or a dated engine calibration record that links to the immutable platform evidence. Every record includes fixture, command, route, hardware, version, raw repetitions, and correctness result. Claims older than one engine release are labeled “Last measured on …”.

Do not broadly allow arbitrary engine plans, audit prose, roadmap entries, or shipped logs as primary numeric evidence.

### Site data flow

When page implementation is authorized:

- Add one Eleventy data source for all performance facts, such as `src/_data/performance.json`.
- Store display values and full provenance together.
- Render `/how-it-works`, `/cli`, the CLI hero, and `/index` from that one source.
- Extend `scripts/check-claims.mjs` or add a focused check that rejects a numeric performance entry without date, hardware, version, route, and source.
- Fail the build if an entry is marked measured but its source is missing, undated, extrapolated, or older than one engine release without `Last measured`.
- Do not hand-copy numbers between templates.

## 8. Honesty and labeling rules

1. **Primary means default.** Only an unforced user-facing production route may populate the primary matrix.
2. **Direct executor means diagnostic.** Label it `Direct compiled dispatcher, not the default product route` unless a new route probe proves otherwise.
3. **Unreleased means forthcoming.** Include the unreleased SHA and keep it out of the home-page headline.
4. **Cloud means cloud.** Name the provider, machine type, vCPU, RAM, and storage. Never call it a developer-host run.
5. **Local means exact local hardware.** “One host” is insufficient.
6. **Kernel metrics stay secondary.** Per-column or kernel-only throughput must say that it excludes full command and I/O time.
7. **No silent extrapolation.** A projected 100M duration or RAM value cannot occupy a measured cell.
8. **No capacity guarantee.** Say `peak RAM observed`, not `RAM required`. Direct readers to `decoy preflight` for their actual job.
9. **No mixed denominators.** Each operation row defines whether rows mean input scanned or output produced.
10. **Route evidence is mandatory.** A fast time without proof of the executed route and backends is unusable.
11. **Home-page claims are stricter.** A home stat must come from a current default-route cell. Otherwise replace it with a non-performance product fact.
12. **Hero transcript is a claim.** Replace the current `1,000,000 rows ... 1.9s` line with a qualifying measured default-route result, or remove the duration.

## 9. Accessible static presentation

Follow the semantic structure from the [W3C table tutorial](https://www.w3.org/WAI/tutorials/tables/) and the responsive wrapper pattern documented by [shadcn/ui Table](https://ui.shadcn.com/docs/components/base/table). Keep horizontal scrolling inside the table container, consistent with [WCAG reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

Implementation requirements:

- Use `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`, and `<th scope="row">`.
- Give the scroll container a visible keyboard focus state and an accessible region label.
- Keep the table as a table at phone width. Do not transform rows into visually reordered cards.
- Allow cell text to wrap.
- Keep horizontal overflow within the table container, never the page.
- Provide a short visible hint that the matrix scrolls horizontally on narrow screens.
- Use existing design tokens for dark and light themes.
- Do not communicate route status by color alone.
- Test at 320 CSS pixels and 400% zoom.
- Test keyboard scrolling and screen-reader header announcements.
- Use the existing `.table-wrap` pattern and token system. Do not add a frontend dependency merely to reproduce shadcn styling.
- Use no Radix primitive because the design has no interactive widget requiring one.

## 10. Phased execution and acceptance gates

### Phase 0: Claim quarantine and decisions

- Confirm the release-candidate route from real product entry points.
- Choose default-only versus separated diagnostic fast-path policy.
- Approve the host, cloud budget policy, and traceability-rule amendment.
- Inventory every current numeric claim, including the CLI hero.

**Gate:** Cam approves the claim policy and run matrix. No benchmark or page work proceeds with an unresolved route.

### Phase 1: Benchmark contract and harness

- Freeze fixtures, commands, denominators, statistics, correctness guards, resource ceilings, and result schema.
- Reuse the existing F4 fixture and benchmark infrastructure where they match the contract.
- Add missing operation harnesses only after an independent plan review.
- Prove the harness fails closed on route drift, bad row counts, inconsistent throughput, missing host metadata, and failed correctness checks.

**Gate:** Independent review confirms that every planned cell is comparable and that the harness cannot report a successful value for the wrong route.

### Phase 2: Local 1M and 10M evidence

- Run all required local cells on the pinned host.
- Investigate variance over 10% before publishing.
- Rerun the whole affected row after any code, dependency, fixture, or host change.
- Produce the dated calibration record.

**Gate:** Every local cell has raw repetitions, route evidence, correctness evidence, hardware metadata, and an immutable source link. Unsupported cells read `Not measured`.

### Phase 3: Owner-approved cloud evidence

- Prepare a costed run sheet for all 100M cells.
- Obtain Cam's explicit approval immediately before provisioning or running.
- Run the default route first. Run diagnostic paths only if separately approved and still useful.
- Stop on route drift, correctness failure, RSS ceiling breach, cost ceiling, or timeout.

**Gate:** Cloud artifacts are committed, independently reviewed, and explicitly labeled as cloud-host results. No local/cloud framing ambiguity remains.

### Phase 4: Claim dataset and traceability gate

- Reconcile the engine calibration summary with platform raw artifacts.
- Populate the single site performance data source.
- Add automated provenance and staleness checks.
- Independently review every display value against its raw repetitions.

**Gate:** A generated claim ledger maps every site number to one dated record, one exact result field, one route, and one hardware description.

### Phase 5: Page build, only after Cam starts live review

Do not build the page as part of this plan. Implementation waits for Cam's one-page-at-a-time live review.

Recommended review order:

1. `/how-it-works`: canonical full matrix and secondary tables.
2. `/cli`: reuse the approved component and reconcile the hero transcript.
3. `/index`: replace or remove the current performance stat tiles using only approved default-route facts.

Do not change the next page until Cam accepts the current page in light mode, dark mode, desktop width, and phone width.

**Per-page gate:**

- Cam live review accepted.
- Real HTML table remains usable without JavaScript.
- Keyboard, screen-reader, zoom, contrast, and narrow-width checks pass.
- `npm run check` passes.
- Rendered claims match the approved claim ledger exactly.
- No U+2014 characters are introduced.

### Phase 6: Final public-claim gate

- Review the built `dist/` output, not only Nunjucks source.
- Verify every citation resolves to a committed public-readable record.
- Recheck route labels, dates, versions, hardware, and staleness.
- Confirm the old CLI hero and home-page figures no longer survive elsewhere.
- Obtain independent review and Cam's final approval for the consequential public claims.

**Gate:** Exact rendered artifact approved. No publication or merge before this gate.

## 11. Blockers

### Blocked on Cam

- Default-only versus separately shown diagnostic fast-path policy.
- Approval of the standard benchmark host.
- Approval to amend the traceability rule.
- Approval of the exact GCP machine, budget, and 50M+ run sheet.
- Whether the expensive 100M pure-generation run is worth filling or should remain `Not measured`.
- Each page's live review and final public-claim approval.
- Whether the measured-floor sentence should appear at all.

### Blocked on benchmark work

- All primary matrix numbers.
- Peak-RAM box-sizing values.
- The 1M DB-to-DB claim.
- Any replacement for the CLI hero duration.
- Any performance-oriented home-page stat.
- Current default-versus-pandas comparisons.
- Current FPE, hash, and light-strategy cost-band notes.
- Any 100M cell not reproduced on the pinned release candidate.

### Not blocked

- Finalizing the semantic table schema.
- Finalizing the benchmark result schema and provenance requirements.
- Preparing a non-code wireframe for Cam.
- Drafting the `docs-src/CLAUDE.md` rule amendment for review.
- Removing unverifiable numbers from the proposed content model.
