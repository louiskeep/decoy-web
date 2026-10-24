# Slice 1 plan: proof manifest v2 foundation

Rules consulted: 00-universal, risk-and-exceptions, development-loop,
autonomous-operation, feature-dev, testing, data-and-migrations, reuse-first,
api-and-compatibility, security, verification.

Status: plan (pre-build). Part of the Decoy Web prerelease program (see
`ROADMAP.md`, execution-order step 1). Cross-repo: changes land in
`decoy-engine` (the generator and its sentry test) and `decoy-web-docs` (the
build-time consumer, the re-vendored manifest, the drift gate).

## Why

The web surface's generated examples must come from one real source of truth, so
the site never claims a capability the engine lacks. Two live defects prove the
need: the docs-vendored proof manifest renders 11 mask capabilities and 7
generation strategies against the engine's real 22 and 12, and the generator
hardcodes `ENGINE_VERSION = "0.2.0"` while the installed engine is 0.7.0. This
slice makes the existing generator honest and extends it to carry everything
Ideas 2 and 3 will consume, without building a second generator.

## Scope

Split into two sub-slices so the live fix ships before the larger schema work.

### 1a: make the existing generator honest (low risk, ship first)

- `gen_proof_manifest.py`: read the engine version from the installed package
  (`decoy_engine.__version__`, falling back to pyproject only if needed) instead
  of the hardcoded `ENGINE_VERSION` constant. Thread the real version through the
  manifest and the `run_pipeline(..., engine_version=...)` calls.
- Record the generating commit alongside the version (git short SHA of the engine
  repo at generation time; omit cleanly if not in a git tree).
- Regenerate `decoy-engine/docs/proof-manifest.json`.
- Re-vendor the fresh manifest to `decoy-web-docs/lib/data/proof-manifest.json`
  and confirm the `/proof` marketing page renders the full 22 / 12 / 34 surface.

### 1b: extend to proof manifest v2 (the foundation Ideas 2 and 3 consume)

- Per-case records under a new, versioned schema (`schema_version`): stable
  `case_id`, strategy id, input record, configuration record, output record,
  and changed-cell annotations.
- Setting-variant cases: for settings that materially change behavior, a shared
  input with two configurations and two outputs. A documented
  `not_applicable_reason` where a strategy has no meaningful setting comparison.
- Provenance per artifact: engine version and commit, generator schema version,
  fixture hash, config hash, deterministic seed, test-secret identifier, and the
  invariants the generator asserted.
- Public-path rule: every published example runs through `PipelineConfig` plus
  `run_pipeline`. Remove the `joint_mask` direct-transform shortcut if present in
  the generator; any strategy that cannot run the public path gets an explicit
  waiver and no published example.
- Synthetic-data safety: audit the existing healthcare fixture (do not replace
  it) and add the safety tests below.
- Docs consumer: a Zod schema parses the manifest at build time, replacing the
  current unsafe TypeScript cast in the proof renderer. A sync receipt records
  producer commit, artifact hash, schema version, and sync time.

Out of scope for slice 1: the `StrategyExample` / `SettingDiff` components
(Idea 3 slice), the workflow page (Idea 1), the demo (Idea 2). This slice only
produces and validates the data they will consume.

## Acceptance tests

1. `decoy-engine` sentry test (existing `test_proof_manifest*`) re-runs `build()`
   and diffs against the committed artifact: passes, and now asserts
   `engine_version == decoy_engine.__version__` (so a stale hardcode fails CI).
2. Regenerated manifest reports `engine_version == "0.7.0"` and a non-empty
   commit, with capabilities 22, generation_strategies 12, providers 34.
3. v2: every entry in the engine mask-strategy registry has exactly one canonical
   example case or an explicit waiver; a new registry strategy with neither fails
   the sentry test.
4. v2: every generated output was produced through `run_pipeline` (asserted by
   provenance on each case); no case is hand-authored.
5. Synthetic-data safety tests pass: no real-data lineage, reserved example
   domains only, clearly fictional identities, no plausibly-real identifiers, no
   production secrets.
6. `decoy-web-docs`: the Zod consumer parses the vendored manifest at build with
   no cast; a malformed manifest fails the build with a clear error.
7. `decoy-web-docs` drift gate: CI fails if the vendored manifest's hash or
   schema version does not match the recorded sync receipt.
8. Full web gates green: `pnpm exec tsc --noEmit`, `pnpm run check:docs`,
   `DOCS_PUBLISHED=true pnpm run build`, and the `/proof` page renders the full
   surface in light and dark on the exported `out/`.

## Gates

Engine changes run the engine repo gate chain (ci-mirror, dennis, Codex final)
before merge to engine main. Web changes run the web acceptance gates above plus
dennis and Codex final. Merge each repo's part on its own green gate.
