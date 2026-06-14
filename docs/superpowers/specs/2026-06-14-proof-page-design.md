# Proof Page Design

Date: 2026-06-14
Status: Approved (design), pending implementation plan
Route: `app/proof/page.tsx`

## Problem

The marketing site needs a page that proves engine capabilities rather than
asserting them. The chronic risk on this surface (per `CLAUDE.md`) is marketing
claims that outrun product capability. A proof page that is hand-authored would
drift the moment a strategy changes. The design eliminates that class of drift
by deriving every shown artifact from the engine's own test fixtures and dated
benchmarks.

## Core idea

Proof is a test artifact, not copy. The engine already produces everything the
page needs:

- `examples/in/*.csv` to `examples/out/*.csv`, including `audit_log.csv` (mask provenance)
- `examples/complex_healthcare_claims.yaml` and `examples/runnable_demo.py` (a runnable, real-strategy pipeline)
- `tests/fixtures/golden/*/manifest.yaml`, each carrying an `invariants_post_mask:` block (the engine asserting what holds after masking, machine-checked by the suite)
- `tests/benchmark/calibration/results.md` (dated throughput numbers)
- builtin disguise packs (`hipaa`, `ferpa`, `sox`, `gdpr`, `ccpa`, `glba`, `pci`, `default`)
- capability surface: 13 mask strategies, 5 generate column types, 6 transform ops, 34 providers

The seam between the two repos is one generated file, `proof-manifest.json`.
The engine produces it; the web app consumes it as a typed module.

## Scope

This spec covers a fully static, prebaked proof page (option A). An interactive
playground where a visitor pastes their own data and sees it masked live
(option B) is explicitly out of scope here. It would require the platform API or
a WASM build of the engine and is a separate future project. The page layout
should not be contorted to anticipate it.

## The contract: `proof-manifest.json`

```jsonc
{
  "engine_version": "0.2.0",
  "generated_at": "2026-06-14",
  "surface": { "mask": 13, "generate": 5, "transform": 6, "providers": 34 },
  "hero": {
    "name": "HIPAA claims warehouse",
    "disguise": "hipaa",
    "tables": [
      { "name": "members", "input": [ /* ~5 rows */ ], "output": [ /* ~5 rows */ ] }
    ],
    "audit_log": [ /* ~5 rows */ ],
    "invariants": [ /* strings */ ]
  },
  "capabilities": [
    {
      "id": "mask.fpe",
      "kind": "mask",
      "title": "Format-preserving encryption",
      "config_yaml": "...",
      "input": [ /* rows */ ],
      "output": [ /* rows */ ],
      "invariant": "<one string lifted from invariants_post_mask>",
      "source_fixture": "tests/fixtures/golden/<name>"
    }
  ],
  "providers": [ { "name": "ssn", "example": "412-55-0199" } ],
  "benchmarks": [
    {
      "shape": "1 table, 1M rows",
      "throughput": "X rows/s",
      "measured_at": "2026-..",
      "engine_version": "0.2.0",
      "source": "tests/benchmark/calibration/results.md"
    }
  ]
}
```

Every string in the manifest traces to a fixture, an `invariants_post_mask`
line, or a dated calibration file. Nothing is hand-written.

## Generator (engine side)

`scripts/export_proof_manifest.py`, which doubles as a pytest so CI keeps it
current:

- Runs the engine over `examples/` (via the `run_pipeline` API used by
  `examples/runnable_demo.py`) to build the hero before/after plus the audit log.
- Runs the engine over each selected golden fixture to build per-capability IO.
- Truncates every table sample to about 5 rows.
- Lifts each `invariant` directly from the fixture's `invariants_post_mask`.
- Publish gate: only emits a fixture if its `manifest.yaml` carries
  `publishable: true` (a new opt-in flag, default false). Nothing reaches a
  public page by accident.
- Stamps `engine_version` and `generated_at`.

Input samples are already synthetic fixture data, so they are safe to publish;
the publish gate is a second, explicit guard.

## Drift control

The freshness check lives in the engine repo, where capabilities actually
change. Engine CI regenerates the manifest and runs `git diff --exit-code` on
it. Add or change a strategy without regenerating, and engine CI fails. The web
repo imports the committed JSON as a typed module, so a missing or malformed
manifest also fails the web build.

## Page layout (web side), route `app/proof/page.tsx`

Top to bottom:

1. Hero proof. The HIPAA claims scenario: an input table to its masked output
   table, then a few `audit_log` rows, with the guaranteed invariants listed
   beneath. The "it works on real-shaped, multi-table data" moment.
2. Capability grid. One card per op (24 total), grouped mask / generate /
   transform. Each card shows the config YAML (with copy), input rows, masked
   output rows, the guaranteed invariant, and a link to the source fixture.
3. Provider reference. A compact table, 34 rows, one example value each. Not
   cards.
4. Benchmarks strip. Two or three representative table shapes, each dated,
   each linking to `results.md`, with a "last measured, engine vX" stamp. Per
   `CLAUDE.md`, any number older than one engine release carries a "last
   measured on" annotation.
5. Reproduce-it footer. The engine version plus the one real command to rerun
   these locally: `python examples/runnable_demo.py`. There is no `decoy` CLI
   console script today, so the page must not advertise one (and must not
   reference `decoy demo --ref`, a deferred stub).

## Components

- `components/marketing/proof/proof-hero.tsx`
- `components/marketing/proof/capability-card.tsx`
- `components/marketing/proof/capability-grid.tsx`
- `components/marketing/proof/provider-table.tsx`
- `components/marketing/proof/benchmark-strip.tsx`
- `lib/proof.ts` (loads and types the manifest)

All built on existing shadcn/ui primitives and Tailwind utilities. No custom
replacements for primitives that already exist.

## Resolved decisions

- Hero disguise: HIPAA. It is the richest pack (240 lines, multi-table claims
  with an audit log) and the strongest single proof.
- Reproduce command: `python examples/runnable_demo.py`. Verified that the
  engine exposes no `decoy` console script in `pyproject.toml`.

## Granularity calls

- Mask, generate, transform (24 ops): one card each.
- 34 providers: one compact table row each, not cards.
- Benchmarks: whole-pipeline plus two or three representative shapes, dated. Do
  not fabricate a per-strategy number for all 24 ops.
- Disguise packs: HIPAA leads as the hero; the rest are not given individual
  cards in v1.

## Out of scope

- Interactive live-masking playground (option B).
- Per-disguise pages beyond the HIPAA hero.
- Any backend, auth, or customer data handling on the web repo.
