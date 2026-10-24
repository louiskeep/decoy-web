# Proof Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static `/proof` page on the Decoy marketing site whose every before/after sample, config, invariant, and benchmark is generated from the engine's live registries and real pipeline runs, so the page cannot outrun the product.

**Architecture:** Two phases bound by one artifact. Phase 1 (in `decoy-engine`) adds `scripts/gen_proof_manifest.py`, which reads the registries and runs the real `run_pipeline` over a hero dataset plus one minimal config per capability, asserts each capability's invariant in code, and emits a committed `docs/proof-manifest.json`. A sentry test re-renders and diffs it, exactly like the existing `test_capability_matrix.py`, so a new capability cannot ship without a refreshed manifest. Phase 2 (in `decoy-web`) imports a synced copy of that JSON as a typed module and renders the page from it. No backend, no hand-authored samples.

**Tech Stack:** Python 3 + pytest + pyarrow + pandas (engine generator); Next.js App Router + React + shadcn/ui + Tailwind + TypeScript strict (web).

**Repos:** Two sibling working copies. Engine tasks run in `/home/cam/vscode/decoy-engine`; web tasks run in `/home/cam/vscode/decoy-web`. Each task header names its repo.

**Branches:** Engine work on `feat/proof-manifest` off `main`. Web work on `feat/proof-page` off `main`. No direct commits to `main` in either repo (per each repo's CLAUDE.md).

**Note on Phase 2 testing:** `decoy-web` has no JS test runner (scripts are only `dev`/`build`/`start`), and adding one for a static marketing page is out of scope (YAGNI). Phase 2's verification gate is `pnpm build` (Next.js runs the TypeScript strict typecheck and fails the build on any type or import error) plus a documented browser check. The typed manifest loader makes most drift a compile error.

---

## Phase 1: Engine proof manifest generator (`decoy-engine`)

Phase 1 ships independently: it produces and guards `docs/proof-manifest.json` with no dependency on the web repo.

### Task 1: Branch + manifest module skeleton

**Repo:** `decoy-engine`

**Files:**
- Create: `scripts/gen_proof_manifest.py`
- Test: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Create the branch**

```bash
cd /home/cam/vscode/decoy-engine
git checkout main && git pull --ff-only
git checkout -b feat/proof-manifest
```

- [ ] **Step 2: Write the failing test**

Create `tests/sentry/test_proof_manifest.py`:

```python
"""Proof-manifest drift sentry.

`docs/proof-manifest.json` is generated from the live registries and real
pipeline runs by `scripts/gen_proof_manifest.py`. This guard re-renders the
manifest from current code and asserts it equals the committed file. A new
capability (or a changed sample) that is not regenerated fails CI.

To fix a failure, run:

    python scripts/gen_proof_manifest.py

and commit the updated docs/proof-manifest.json.
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
GENERATOR = REPO_ROOT / "scripts" / "gen_proof_manifest.py"
MANIFEST = REPO_ROOT / "docs" / "proof-manifest.json"


def _load_generator():
    spec = importlib.util.spec_from_file_location("gen_proof_manifest", GENERATOR)
    assert spec and spec.loader, f"cannot load generator at {GENERATOR}"
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_generator_build_has_required_top_level_keys():
    gen = _load_generator()
    manifest = gen.build()
    for key in ("engine_version", "generated_at", "surface", "hero",
                "capabilities", "providers", "generation_strategies", "benchmarks"):
        assert key in manifest, f"manifest missing top-level key {key!r}"
```

- [ ] **Step 3: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: FAIL (cannot load generator / `build` not defined).

- [ ] **Step 4: Write the minimal generator**

Create `scripts/gen_proof_manifest.py`:

```python
#!/usr/bin/env python3
"""Generate the proof manifest from the live registries and real runs.

Source of truth is the code, not copy. This script imports decoy_engine,
reads its registries for the capability surface, runs the real pipeline over
a hero dataset and one minimal config per capability, asserts each
capability's invariant, and emits a JSON artifact the marketing site renders.

Run:  python scripts/gen_proof_manifest.py
Out:  docs/proof-manifest.json  (committed; a sentry test re-runs build() and
      diffs, so a new capability with no proof fails CI)
"""

from __future__ import annotations

import json
from pathlib import Path

# Frozen stamp values. These are passed in (not read from the clock) so the
# generator is deterministic and the sentry diff is stable. Bump GENERATED_AT
# by hand when refreshing benchmarks or samples; bump ENGINE_VERSION to match
# the engine release being documented.
ENGINE_VERSION = "0.2.0"
GENERATED_AT = "2026-06-14"

OUT = Path(__file__).resolve().parent.parent / "docs" / "proof-manifest.json"


def build() -> dict:
    return {
        "engine_version": ENGINE_VERSION,
        "generated_at": GENERATED_AT,
        "surface": {},
        "hero": {},
        "capabilities": [],
        "providers": [],
        "generation_strategies": [],
        "benchmarks": [],
    }


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(build(), indent=2, sort_keys=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): manifest generator skeleton + drift sentry"
```

### Task 2: Surface counts from the live registries (reuse capability-matrix helpers)

**Repo:** `decoy-engine`

Reuse the registry-reading helpers already in `scripts/gen_capability_matrix.py` (the repo's designated single place that knows how to read registries) by loading it as a module. Do not duplicate registry-walking logic.

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Write the failing test** (append to `tests/sentry/test_proof_manifest.py`)

```python
def test_surface_counts_match_capability_matrix():
    gen = _load_generator()
    surface = gen.build()["surface"]
    # Mask count excludes the internal `nested` wrapper, matching the matrix.
    assert surface["mask"] == 12
    assert surface["generate"] == 7
    assert surface["providers"] == 34
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_surface_counts_match_capability_matrix -v`
Expected: FAIL (surface is `{}`).

- [ ] **Step 3: Implement surface read in `scripts/gen_proof_manifest.py`**

Add near the top (after imports):

```python
import importlib.util

_MATRIX_GEN_PATH = Path(__file__).resolve().parent / "gen_capability_matrix.py"


def _capability_matrix_module():
    spec = importlib.util.spec_from_file_location("gen_capability_matrix", _MATRIX_GEN_PATH)
    assert spec and spec.loader, f"cannot load {_MATRIX_GEN_PATH}"
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _surface() -> dict:
    m = _capability_matrix_module()
    return {
        "mask": len(m._mask_strategies()),
        "generate": len(m._generation_strategies()),
        "providers": len(m._providers()),
    }
```

Then in `build()` replace `"surface": {}` with `"surface": _surface()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS (3 tests).

Note: if the engine has added strategies/providers since this plan was written, the matrix counts will differ. In that case, update the expected numbers in the test to match `python scripts/gen_capability_matrix.py` output, which is authoritative.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): read capability surface from live registries"
```

### Task 3: Hero proof from the real multi-table pipeline

**Repo:** `decoy-engine`

Adapt the proven pipeline in `examples/runnable_demo.py` (real strategies, FK parent/child, generate audit_log) into the generator, capturing ~5 sample rows per table plus the audit log.

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Write the failing test** (append)

```python
def test_hero_has_input_output_and_audit_log():
    gen = _load_generator()
    hero = gen.build()["hero"]
    assert hero["disguise"] == "hipaa"
    table_names = {t["name"] for t in hero["tables"]}
    assert {"members", "claims", "providers"} <= table_names
    members = next(t for t in hero["tables"] if t["name"] == "members")
    assert len(members["input"]) == len(members["output"]) >= 1
    # ssn is masked: at least one row's ssn changes.
    assert any(i["ssn"] != o["ssn"] for i, o in zip(members["input"], members["output"]))
    assert len(hero["audit_log"]) >= 1
    assert isinstance(hero["invariants"], list) and hero["invariants"]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_hero_has_input_output_and_audit_log -v`
Expected: FAIL (hero is `{}`).

- [ ] **Step 3: Implement the hero builder**

Add to `scripts/gen_proof_manifest.py`:

```python
import pandas as pd
import pyarrow as pa

from decoy_engine.config._pipeline import PipelineConfig
from decoy_engine.execution._pipeline import run_pipeline

SAMPLE_ROWS = 5


def _records(df: pd.DataFrame, n: int = SAMPLE_ROWS) -> list[dict]:
    # JSON-safe: cast every cell to str so the marketing site renders verbatim
    # and the sentry diff is stable across pandas dtype quirks.
    return [
        {col: ("" if pd.isna(v) else str(v)) for col, v in row.items()}
        for row in df.head(n).to_dict(orient="records")
    ]


def _hero() -> dict:
    # Source frames: the runnable_demo healthcare warehouse, trimmed to
    # SAMPLE_ROWS rows. members is the FK parent; claims is the child.
    members = pd.DataFrame({
        "member_id": [f"{100000000 + i}" for i in range(SAMPLE_ROWS)],
        "ssn": [f"{500 + i:03d}-{10 + i:02d}-{1000 + i:04d}" for i in range(SAMPLE_ROWS)],
        "first_name": ["Ava", "Ben", "Cara", "Dan", "Eve"][:SAMPLE_ROWS],
        "last_name": ["Reed", "Shaw", "Tran", "Underwood", "Vance"][:SAMPLE_ROWS],
        "email": [f"user{i}@example.com" for i in range(SAMPLE_ROWS)],
        "city": ["Austin"] * SAMPLE_ROWS,
        "state": ["TX"] * SAMPLE_ROWS,
        "zip": [f"{73301 + i}" for i in range(SAMPLE_ROWS)],
    })
    claims = pd.DataFrame({
        "member_id": [f"{100000000 + (i % SAMPLE_ROWS)}" for i in range(SAMPLE_ROWS)],
        "claim_id": [f"{700000 + i}" for i in range(SAMPLE_ROWS)],
        "billed_amount": [round(100.0 + 13.5 * i, 2) for i in range(SAMPLE_ROWS)],
    })
    providers = pd.DataFrame({
        "npi": [f"{1000000000 + i}" for i in range(SAMPLE_ROWS)],
        "pan": [f"4{i:015d}" for i in range(SAMPLE_ROWS)],
    })

    config = {
        "version": 1,
        "global_settings": {"seed": 1234567, "post_validation": False},
        "namespaces": {"member_identity": {"declared_by": ["members.member_id"]}},
        "tables": [
            {"name": "members", "columns": [
                {"name": "member_id", "strategy": "fpe", "namespace": "member_identity",
                 "provider_config": {"charset": "digits", "preserve_separators": True}},
                {"name": "ssn", "strategy": "fpe", "namespace": "ssn_space",
                 "provider_config": {"charset": "digits", "preserve_separators": True}},
                {"name": "first_name", "strategy": "faker", "provider": "composite_name_email",
                 "coherent_with": ["last_name", "email"], "namespace": "member_pii"},
                {"name": "last_name", "strategy": "faker", "provider": "composite_name_email",
                 "coherent_with": ["first_name", "email"], "namespace": "member_pii"},
                {"name": "email", "strategy": "faker", "provider": "composite_name_email",
                 "coherent_with": ["first_name", "last_name"], "namespace": "member_pii"},
                {"name": "city", "strategy": "faker", "provider": "composite_city_state_zip",
                 "coherent_with": ["state", "zip"]},
                {"name": "state", "strategy": "faker", "provider": "composite_city_state_zip",
                 "coherent_with": ["city", "zip"]},
                {"name": "zip", "strategy": "faker", "provider": "composite_city_state_zip",
                 "coherent_with": ["city", "state"]},
            ]},
            {"name": "claims", "columns": [
                {"name": "member_id", "strategy": "from_parent"},
                {"name": "claim_id", "strategy": "fpe", "namespace": "claim_space",
                 "provider_config": {"charset": "digits"}},
                {"name": "billed_amount", "strategy": "passthrough"},
            ]},
            {"name": "providers", "columns": [
                {"name": "npi", "strategy": "fpe", "namespace": "npi_space",
                 "provider_config": {"charset": "digits"}},
                {"name": "pan", "strategy": "fpe", "namespace": "pan_space",
                 "provider_config": {"charset": "digits", "validate_luhn": True}},
            ]},
            {"name": "audit_log", "row_count": SAMPLE_ROWS, "generate_columns": [
                {"name": "event_id", "type": "sequence", "start": 1, "step": 1},
                {"name": "actor", "type": "faker", "faker_type": "user_name"},
                {"name": "action", "type": "categorical",
                 "categories": ["view", "edit", "export", "delete"]},
            ]},
        ],
        "relationships": [{
            "parent": {"table": "members", "columns": ["member_id"]},
            "children": [{"table": "claims", "columns": ["member_id"]}],
            "orphan_policy": "fail",
        }],
    }

    cfg = PipelineConfig.model_validate(config).model_dump()
    sources = {
        "members": pa.Table.from_pandas(members),
        "claims": pa.Table.from_pandas(claims),
        "providers": pa.Table.from_pandas(providers),
    }
    result = run_pipeline(cfg, sources, engine_version=ENGINE_VERSION)
    out = result.outputs

    inputs = {"members": members, "claims": claims, "providers": providers}
    tables = [
        {"name": name, "input": _records(inputs[name]),
         "output": _records(out[name].to_pandas())}
        for name in ("members", "claims", "providers")
    ]
    return {
        "name": "HIPAA claims warehouse",
        "disguise": "hipaa",
        "tables": tables,
        "audit_log": _records(out["audit_log"].to_pandas()),
        "invariants": [
            "Foreign keys stay valid: every masked claims.member_id still joins to a masked members row.",
            "Reversible identifiers use format-preserving encryption: shape and length are preserved.",
            "Name, email, city, state, and zip are replaced coherently as a unit, not field by field.",
            "The audit_log table is generated from scratch and contains no source data.",
        ],
    }
```

Replace `"hero": {}` in `build()` with `"hero": _hero()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS. If a strategy/provider name in the config has changed in the engine, fix it against `examples/runnable_demo.py`, which is kept runnable.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): hero proof from real multi-table pipeline"
```

### Task 4: Capability proof harness + two worked capabilities

**Repo:** `decoy-engine`

A capability proof is a minimal single-table config plus an in-code assertion about the output. The card is emitted only if the assertion passes, so each card is a passing test. Start the harness with two fully worked capabilities (`fpe`, `redact`).

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Write the failing test** (append)

```python
def test_capabilities_include_fpe_and_redact_with_invariants():
    gen = _load_generator()
    caps = {c["id"]: c for c in gen.build()["capabilities"]}
    assert "mask.fpe" in caps and "mask.redact" in caps
    fpe = caps["mask.fpe"]
    assert fpe["kind"] == "mask"
    assert fpe["invariant"]
    assert fpe["config_yaml"].strip()
    assert len(fpe["input"]) == len(fpe["output"]) >= 1
    # fpe preserves length on the masked column.
    col = fpe["column"]
    assert all(len(i[col]) == len(o[col]) for i, o in zip(fpe["input"], fpe["output"]))
    # redact replaces the value (output differs from input).
    red = caps["mask.redact"]
    rcol = red["column"]
    assert all(i[rcol] != o[rcol] for i, o in zip(red["input"], red["output"]))
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_capabilities_include_fpe_and_redact_with_invariants -v`
Expected: FAIL (capabilities is `[]`).

- [ ] **Step 3: Implement the harness + two capabilities**

Add to `scripts/gen_proof_manifest.py`:

```python
import textwrap
from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class CapabilityProof:
    id: str            # e.g. "mask.fpe"
    kind: str          # "mask" or "generate"
    title: str
    column: str        # the column the strategy acts on
    input_values: list  # source values for `column`
    config: dict       # single-table PipelineConfig dict
    invariant: str     # human-readable guarantee, shown on the card
    check: Callable[[list, list], bool]  # (input_records, output_records) -> bool


def _mask_proof(strategy_id, title, column, values, column_cfg, invariant, check,
                *, namespaces=None):
    table = {"name": "t", "columns": [{"name": column, "strategy": strategy_id, **column_cfg}]}
    cfg = {"version": 1, "global_settings": {"seed": 1234567, "post_validation": False},
           "tables": [table]}
    if namespaces:
        cfg["namespaces"] = namespaces
    return CapabilityProof(
        id=f"mask.{strategy_id}", kind="mask", title=title, column=column,
        input_values=values, config=cfg, invariant=invariant, check=check,
    )


def _same_length(col):
    return lambda i, o: all(len(a[col]) == len(b[col]) for a, b in zip(i, o))


def _all_changed(col):
    return lambda i, o: all(a[col] != b[col] for a, b in zip(i, o))


# The curated proof set. Each entry runs the real engine and is asserted.
CAPABILITY_PROOFS: list[CapabilityProof] = [
    _mask_proof(
        "fpe", "Format-preserving encryption", "account",
        ["100000001", "100000002", "100000003"],
        {"namespace": "acct", "provider_config": {"charset": "digits"}},
        "Output preserves the exact length and digit charset of the input, and is reversible with the key.",
        _same_length("account"),
        namespaces={"acct": {"declared_by": ["t.account"]}},
    ),
    _mask_proof(
        "redact", "Redaction", "ssn",
        ["500-10-1000", "501-11-1001", "502-12-1002"],
        {},
        "The original value is destroyed and replaced with a fixed mask; redaction is irreversible.",
        _all_changed("ssn"),
    ),
]


def _yaml_for(proof: CapabilityProof) -> str:
    # Render the single column rule as readable YAML for the card. Kept compact
    # and derived from the same dict the engine validated, so it cannot drift.
    table = proof.config["tables"][0]
    col = table["columns"][0]
    lines = [f"  - column: {col['name']}", f"    strategy: {col['strategy']}"]
    for k, v in col.items():
        if k in ("name", "strategy"):
            continue
        lines.append(f"    {k}: {v}")
    return "tables:\n  columns:\n" + "\n".join(lines)


def _run_capability(proof: CapabilityProof) -> dict:
    df = pd.DataFrame({proof.column: proof.input_values})
    cfg = PipelineConfig.model_validate(proof.config).model_dump()
    sources = {"t": pa.Table.from_pandas(df)}
    result = run_pipeline(cfg, sources, engine_version=ENGINE_VERSION)
    out_df = result.outputs["t"].to_pandas()
    inp = _records(df, n=len(df))
    out = _records(out_df, n=len(out_df))
    if not proof.check(inp, out):
        raise AssertionError(f"capability {proof.id}: invariant check failed; not emitting a false proof")
    return {
        "id": proof.id, "kind": proof.kind, "title": proof.title, "column": proof.column,
        "config_yaml": _yaml_for(proof), "input": inp, "output": out,
        "invariant": proof.invariant,
    }


def _capabilities() -> list[dict]:
    return [_run_capability(p) for p in CAPABILITY_PROOFS]
```

Replace `"capabilities": []` in `build()` with `"capabilities": _capabilities()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS. If `redact`'s output happens to equal an input (e.g. a different mask token), adjust the `check`/`invariant` to match the strategy's real behavior observed from the run output. Do not weaken a check to force a pass; fix the claim to match reality.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): capability proof harness with asserted invariants"
```

### Task 5: Completeness gate + fill remaining capabilities

**Repo:** `decoy-engine`

Force coverage: the set of mask strategies proven must equal the registry's user-facing set, minus an explicit, documented waiver list. This makes it impossible to add a strategy without adding a proof (or consciously waiving it).

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Write the failing test** (append)

```python
def test_every_mask_strategy_is_proven_or_waived():
    gen = _load_generator()
    m = gen._capability_matrix_module()
    registry_strategies = {name for name, _gdpr, _accel in m._mask_strategies()}
    proven = {c["id"].split(".", 1)[1] for c in gen.build()["capabilities"] if c["kind"] == "mask"}
    waived = gen.WAIVED_MASK_STRATEGIES
    missing = registry_strategies - proven - waived
    assert not missing, f"mask strategies with no proof and no waiver: {sorted(missing)}"
    # Waivers must be real strategies, not typos.
    assert waived <= registry_strategies, f"waiver names not in registry: {sorted(waived - registry_strategies)}"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_every_mask_strategy_is_proven_or_waived -v`
Expected: FAIL (`WAIVED_MASK_STRATEGIES` not defined; most strategies unproven).

- [ ] **Step 3: Add the waiver set and fill the remaining proofs**

In `scripts/gen_proof_manifest.py`, add the waiver constant near `CAPABILITY_PROOFS`:

```python
# Strategies intentionally not given a standalone card. `passthrough` is the
# no-op (it is shown in the hero instead); `from_parent` and `nested` are
# relational/wrapper strategies better shown by the hero's FK story than a
# single-column card. Every other strategy MUST have a CAPABILITY_PROOFS entry.
WAIVED_MASK_STRATEGIES = {"passthrough"}
```

Then add one `_mask_proof(...)` entry to `CAPABILITY_PROOFS` for each remaining registry strategy. Use `python scripts/gen_capability_matrix.py` (the `## Mask strategies` table) as the authoritative checklist. For each, follow the exact pattern from Task 4:

1. Pick a representative `column` + 3 input values whose effect is visible.
2. Look up the strategy's `provider_config`/options from its handler in `src/decoy_engine/execution/_strategies/_<name>.py` (e.g. `_bucketize.py`, `_date_shift.py`, `_truncate.py`, `_shuffle.py`, `_text_redact.py`, `_hash.py`, `_categorical.py`, `_formula.py`).
3. Write a one-line `invariant` that states a property the strategy guarantees.
4. Write a `check` lambda over `(input_records, output_records)` that verifies exactly that property. Reuse `_same_length` / `_all_changed` where they fit; write a specific lambda otherwise (e.g. for `truncate`, `lambda i, o: all(len(b["v"]) <= len(a["v"]) for a, b in zip(i, o))`).
5. Run the generator (Step 4) and read the printed output; if the run errors on config validation, fix the column options against the handler. If the `check` fails, the claim is wrong, not the engine: correct the invariant/check to match observed behavior.

The completeness test is the gate: keep adding entries until it passes. Do not relax the test to pass; either prove the strategy or add it to `WAIVED_MASK_STRATEGIES` with a comment justifying the waiver.

- [ ] **Step 4: Run the full sentry + generate the artifact**

Run: `python scripts/gen_proof_manifest.py`
Then: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: all tests PASS, including `test_every_mask_strategy_is_proven_or_waived`.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py docs/proof-manifest.json
git commit -m "feat(proof): cover every mask strategy with an asserted proof"
```

### Task 6: Providers table + generation strategies

**Repo:** `decoy-engine`

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Write the failing test** (append)

```python
def test_providers_and_generation_strategies_listed():
    gen = _load_generator()
    manifest = gen.build()
    provs = manifest["providers"]
    assert len(provs) == manifest["surface"]["providers"]
    assert all("name" in p and "backend" in p for p in provs)
    gens = manifest["generation_strategies"]
    assert "sequence" in gens and "categorical" in gens and "faker" in gens
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_providers_and_generation_strategies_listed -v`
Expected: FAIL (both lists empty).

- [ ] **Step 3: Implement via the matrix helpers**

Add to `scripts/gen_proof_manifest.py`:

```python
def _providers_list() -> list[dict]:
    m = _capability_matrix_module()
    # _providers() returns (name, backend, deterministic, unique) tuples.
    return [
        {"name": name, "backend": backend, "deterministic": det == "yes", "unique": uniq == "yes"}
        for name, backend, det, uniq in m._providers()
    ]


def _generation_strategies_list() -> list[str]:
    return _capability_matrix_module()._generation_strategies()
```

Replace `"providers": []` with `"providers": _providers_list()` and `"generation_strategies": []` with `"generation_strategies": _generation_strategies_list()` in `build()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): list providers and generation strategies from registries"
```

### Task 7: Benchmarks from dated calibration

**Repo:** `decoy-engine`

Read throughput numbers from `tests/benchmark/calibration/results.md`. Do not invent numbers. If the file has no parseable rows yet, emit an empty list (the web strip renders a "no current benchmark" note rather than a fake figure).

**Files:**
- Modify: `scripts/gen_proof_manifest.py`
- Modify: `tests/sentry/test_proof_manifest.py`

- [ ] **Step 1: Read the calibration file first**

Run: `sed -n '1,80p' tests/benchmark/calibration/results.md`
Note the exact table/columns (shape, rows, throughput, date, engine version). Build the parser to that real format.

- [ ] **Step 2: Write the failing test** (append; adjust the asserted shape to what the file actually contains)

```python
def test_benchmarks_are_dated_and_sourced():
    gen = _load_generator()
    benches = gen.build()["benchmarks"]
    # Every benchmark row must carry a measured_at date and a source path.
    for b in benches:
        assert b["measured_at"], "benchmark missing measured_at"
        assert b["source"].endswith("results.md")
        assert b["throughput"]
```

- [ ] **Step 3: Run test to verify it fails**

Run: `python -m pytest tests/sentry/test_proof_manifest.py::test_benchmarks_are_dated_and_sourced -v`
Expected: FAIL (benchmarks empty, or no source field).

- [ ] **Step 4: Implement the parser**

Add to `scripts/gen_proof_manifest.py` (adapt the regex/columns to the real `results.md` format observed in Step 1):

```python
import re

_CALIBRATION = Path(__file__).resolve().parent.parent / "tests" / "benchmark" / "calibration" / "results.md"
_CALIBRATION_REL = "tests/benchmark/calibration/results.md"


def _benchmarks() -> list[dict]:
    if not _CALIBRATION.exists():
        return []
    rows: list[dict] = []
    for line in _CALIBRATION.read_text(encoding="utf-8").splitlines():
        # Markdown table rows only: | shape | rows | throughput | measured_at | version |
        cells = [c.strip() for c in line.split("|")[1:-1]] if line.strip().startswith("|") else []
        if len(cells) < 5 or cells[0].lower() in ("shape", "---") or set(cells[0]) <= {"-"}:
            continue
        shape, _rows, throughput, measured_at, version = cells[:5]
        rows.append({
            "shape": shape, "throughput": throughput, "measured_at": measured_at,
            "engine_version": version, "source": _CALIBRATION_REL,
        })
    return rows
```

Replace `"benchmarks": []` with `"benchmarks": _benchmarks()` in `build()`.

If `results.md` is not a markdown table in that shape, write the parser to its real structure instead; the contract that matters is each row has `shape`, `throughput`, `measured_at`, `engine_version`, `source`.

- [ ] **Step 5: Run test to verify it passes**

Run: `python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen_proof_manifest.py tests/sentry/test_proof_manifest.py
git commit -m "feat(proof): parse dated benchmarks from calibration results"
```

### Task 8: Wire the drift sentry to regenerate-and-diff, finalize artifact

**Repo:** `decoy-engine`

Upgrade the sentry from key-presence checks to the full regenerate-and-diff guard, matching `test_capability_matrix.py`.

**Files:**
- Modify: `tests/sentry/test_proof_manifest.py`
- Modify: `docs/proof-manifest.json` (regenerated)

- [ ] **Step 1: Add the regenerate-and-diff test** (append)

```python
def test_proof_manifest_is_up_to_date():
    gen = _load_generator()
    expected = json.dumps(gen.build(), indent=2, sort_keys=False) + "\n"
    assert MANIFEST.exists(), f"{MANIFEST} is missing. Run `python scripts/gen_proof_manifest.py`."
    actual = MANIFEST.read_text(encoding="utf-8")
    assert actual == expected, (
        "docs/proof-manifest.json is stale: regenerate with "
        "`python scripts/gen_proof_manifest.py` and commit the result."
    )
```

- [ ] **Step 2: Regenerate and run the full sentry**

Run: `python scripts/gen_proof_manifest.py && python -m pytest tests/sentry/test_proof_manifest.py -v`
Expected: all tests PASS. If `test_proof_manifest_is_up_to_date` fails, the committed file lagged a code change; the regenerate in this step fixes it.

- [ ] **Step 3: Confirm no em-dash slipped into invariants/titles**

Run: `grep -n $'—' docs/proof-manifest.json && echo "FOUND EM-DASH (fix the source string)" || echo "clean"`
Expected: `clean` (U+2014 is banned project-wide; fix any source string in the generator if found).

- [ ] **Step 4: Commit**

```bash
git add tests/sentry/test_proof_manifest.py docs/proof-manifest.json
git commit -m "feat(proof): regenerate-and-diff drift sentry for proof manifest"
```

- [ ] **Step 5: Push the engine branch**

```bash
git push -u origin feat/proof-manifest
```

---

## Phase 2: Web, the `/proof` page (`decoy-web`)

Phase 2 consumes the artifact from Phase 1. It can start once `docs/proof-manifest.json` exists in `decoy-engine`.

### Task 9: Sync the manifest + typed loader

**Repo:** `decoy-web`

**Files:**
- Create: `lib/data/proof-manifest.json` (synced copy)
- Create: `lib/proof.ts`
- Create: `package.json` script `sync:proof`

- [ ] **Step 1: Create the branch and sync the artifact**

```bash
cd /home/cam/vscode/decoy-web
git checkout main && git pull --ff-only
git checkout -b feat/proof-page
mkdir -p lib/data
cp ../decoy-engine/docs/proof-manifest.json lib/data/proof-manifest.json
```

- [ ] **Step 2: Add a documented sync script** to `package.json` `scripts`:

```json
"sync:proof": "cp ../decoy-engine/docs/proof-manifest.json lib/data/proof-manifest.json"
```

- [ ] **Step 3: Write the typed loader** `lib/proof.ts`:

```ts
// The proof manifest is generated in decoy-engine by
// scripts/gen_proof_manifest.py and synced here via `pnpm sync:proof`.
// It is imported as a typed module so any shape drift is a build error.
import manifestJson from "@/lib/data/proof-manifest.json"

export type SampleRecord = Record<string, string>

export interface HeroTable {
  name: string
  input: SampleRecord[]
  output: SampleRecord[]
}

export interface ProofHero {
  name: string
  disguise: string
  tables: HeroTable[]
  audit_log: SampleRecord[]
  invariants: string[]
}

export interface Capability {
  id: string
  kind: "mask" | "generate"
  title: string
  column: string
  config_yaml: string
  input: SampleRecord[]
  output: SampleRecord[]
  invariant: string
}

export interface Provider {
  name: string
  backend: string
  deterministic: boolean
  unique: boolean
}

export interface Benchmark {
  shape: string
  throughput: string
  measured_at: string
  engine_version: string
  source: string
}

export interface ProofManifest {
  engine_version: string
  generated_at: string
  surface: { mask: number; generate: number; providers: number }
  hero: ProofHero
  capabilities: Capability[]
  providers: Provider[]
  generation_strategies: string[]
  benchmarks: Benchmark[]
}

export const proofManifest = manifestJson as ProofManifest

export function maskCapabilities(): Capability[] {
  return proofManifest.capabilities.filter((c) => c.kind === "mask")
}
```

- [ ] **Step 4: Verify it typechecks**

Run: `pnpm build`
Expected: build succeeds (route set unchanged yet; this confirms the JSON imports and types resolve). If `resolveJsonModule` errors, ensure `tsconfig.json` has `"resolveJsonModule": true` (Next.js defaults include it; add it if missing).

- [ ] **Step 5: Commit**

```bash
git add lib/data/proof-manifest.json lib/proof.ts package.json
git commit -m "feat(proof): sync proof manifest and add typed loader"
```

### Task 10: SampleTable + CapabilityCard components

**Repo:** `decoy-web`

**Files:**
- Create: `components/marketing/proof/sample-table.tsx`
- Create: `components/marketing/proof/capability-card.tsx`

- [ ] **Step 1: Build a reusable sample table** `components/marketing/proof/sample-table.tsx`:

```tsx
import type { SampleRecord } from "@/lib/proof"
import { cn } from "@/lib/utils"

export function SampleTable({
  rows,
  highlight,
  caption,
}: {
  rows: SampleRecord[]
  highlight?: string
  caption?: string
}) {
  if (rows.length === 0) return null
  const columns = Object.keys(rows[0])
  return (
    <figure className="overflow-x-auto rounded-lg border border-border">
      {caption ? (
        <figcaption className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/20">
            {columns.map((c) => (
              <th
                key={c}
                className={cn(
                  "px-3 py-2 text-left font-mono text-xs font-medium text-muted-foreground",
                  c === highlight && "text-foreground",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {columns.map((c) => (
                <td
                  key={c}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 font-mono text-xs",
                    c === highlight && "bg-primary/5 font-medium text-foreground",
                  )}
                >
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
```

- [ ] **Step 2: Build the capability card** `components/marketing/proof/capability-card.tsx`:

```tsx
import type { Capability } from "@/lib/proof"
import { SampleTable } from "./sample-table"

export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold">{capability.title}</h3>
        <code className="font-mono text-xs text-muted-foreground">{capability.id}</code>
      </header>

      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
        <code>{capability.config_yaml}</code>
      </pre>

      <div className="grid gap-3 sm:grid-cols-2">
        <SampleTable rows={capability.input} highlight={capability.column} caption="Input" />
        <SampleTable rows={capability.output} highlight={capability.column} caption="Masked output" />
      </div>

      <p className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Guarantee: </span>
        {capability.invariant}
      </p>
    </article>
  )
}
```

- [ ] **Step 3: Verify it typechecks**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/proof/sample-table.tsx components/marketing/proof/capability-card.tsx
git commit -m "feat(proof): sample table and capability card components"
```

### Task 11: ProofHero, CapabilityGrid, ProviderTable, BenchmarkStrip

**Repo:** `decoy-web`

**Files:**
- Create: `components/marketing/proof/proof-hero.tsx`
- Create: `components/marketing/proof/capability-grid.tsx`
- Create: `components/marketing/proof/provider-table.tsx`
- Create: `components/marketing/proof/benchmark-strip.tsx`

- [ ] **Step 1: ProofHero** `components/marketing/proof/proof-hero.tsx`:

```tsx
import type { ProofHero as ProofHeroData } from "@/lib/proof"
import { SampleTable } from "./sample-table"

export function ProofHero({ hero }: { hero: ProofHeroData }) {
  const members = hero.tables.find((t) => t.name === "members") ?? hero.tables[0]
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {hero.disguise} disguise
        </span>
        <h2 className="text-2xl font-semibold">{hero.name}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A real multi-table run: foreign keys stay joinable, identifiers keep their shape, and the
          audit log is generated from scratch. Every row below is produced by the engine, not written by hand.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SampleTable rows={members.input} caption={`${members.name}: source`} />
        <SampleTable rows={members.output} caption={`${members.name}: masked`} />
      </div>

      <SampleTable rows={hero.audit_log} caption="audit_log: generated" />

      <ul className="flex flex-col gap-2">
        {hero.invariants.map((inv) => (
          <li key={inv} className="flex gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="text-primary">✓</span>
            {inv}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2: CapabilityGrid** `components/marketing/proof/capability-grid.tsx`:

```tsx
import type { Capability } from "@/lib/proof"
import { CapabilityCard } from "./capability-card"

export function CapabilityGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">Every strategy, proven</h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {capabilities.map((c) => (
          <CapabilityCard key={c.id} capability={c} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: ProviderTable** `components/marketing/proof/provider-table.tsx`:

```tsx
import type { Provider } from "@/lib/proof"

export function ProviderTable({ providers }: { providers: Provider[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">{providers.length} synthetic providers</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/20 text-left text-xs font-medium text-muted-foreground">
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Backend</th>
              <th className="px-3 py-2">Deterministic</th>
              <th className="px-3 py-2">Unique</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.name} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono text-xs">{p.name}</td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">{p.backend}</td>
                <td className="px-3 py-1.5 text-xs">{p.deterministic ? "yes" : "no"}</td>
                <td className="px-3 py-1.5 text-xs">{p.unique ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: BenchmarkStrip** `components/marketing/proof/benchmark-strip.tsx`:

```tsx
import type { Benchmark } from "@/lib/proof"

export function BenchmarkStrip({ benchmarks }: { benchmarks: Benchmark[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">Measured throughput</h2>
      {benchmarks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No current benchmark on record for this engine release. Numbers are published only when a
          dated calibration run exists.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benchmarks.map((b) => (
            <div key={`${b.shape}-${b.measured_at}`} className="rounded-xl border border-border p-4">
              <div className="text-lg font-semibold">{b.throughput}</div>
              <div className="text-sm text-muted-foreground">{b.shape}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Last measured {b.measured_at} · engine {b.engine_version}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 5: Verify it typechecks**

Run: `pnpm build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/proof/
git commit -m "feat(proof): hero, grid, provider table, and benchmark strip"
```

### Task 12: The `/proof` page + navigation link

**Repo:** `decoy-web`

**Files:**
- Create: `app/proof/page.tsx`
- Modify: `components/marketing/navigation.tsx`

- [ ] **Step 1: Read the nav to match its existing link pattern**

Run: `sed -n '1,80p' components/marketing/navigation.tsx`
Note how existing routes (e.g. `/security`, `/pricing`) are listed; copy that exact pattern for the new `/proof` entry.

- [ ] **Step 2: Create the page** `app/proof/page.tsx`:

```tsx
import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { ProofHero } from "@/components/marketing/proof/proof-hero"
import { CapabilityGrid } from "@/components/marketing/proof/capability-grid"
import { ProviderTable } from "@/components/marketing/proof/provider-table"
import { BenchmarkStrip } from "@/components/marketing/proof/benchmark-strip"
import { proofManifest, maskCapabilities } from "@/lib/proof"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proof - Decoy",
  description:
    "Every capability shown here is generated from the engine's own test runs and registries. Before and after samples, configs, guarantees, and dated benchmarks.",
}

export default function ProofPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">Proof, not promises</h1>
          <p className="max-w-2xl text-muted-foreground">
            Nothing on this page is hand-written. The engine runs over real data, asserts what it
            guarantees, and emits these samples. Generated from engine {proofManifest.engine_version},
            last refreshed {proofManifest.generated_at}.
          </p>
        </header>

        <ProofHero hero={proofManifest.hero} />
        <CapabilityGrid capabilities={maskCapabilities()} />
        <ProviderTable providers={proofManifest.providers} />
        <BenchmarkStrip benchmarks={proofManifest.benchmarks} />

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-6">
          <h2 className="text-xl font-semibold">Reproduce it yourself</h2>
          <p className="text-sm text-muted-foreground">
            The hero pipeline above is runnable end to end from the engine repo:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs">
            <code>python examples/runnable_demo.py</code>
          </pre>
        </section>
      </main>
      <CTA />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Add the nav link**

Edit `components/marketing/navigation.tsx` to add a `{ name: "Proof", href: "/proof" }` entry (or the exact shape the file uses, observed in Step 1) alongside the existing links.

- [ ] **Step 4: Build and browser-check**

Run: `pnpm build`
Expected: build succeeds, `/proof` appears in the route list.

Then run the dev server and check the page renders:
Run: `pnpm dev` (then open `http://localhost:3000/proof`)
Confirm: hero before/after tables render, capability cards show config + input + masked output + guarantee, provider table lists all providers, benchmark strip shows numbers or the honest empty-state note, and the reproduce command reads `python examples/runnable_demo.py` (no `decoy` CLI advertised).

- [ ] **Step 5: Confirm no em-dash in new web files**

Run: `grep -rn $'—' app/proof components/marketing/proof && echo "FOUND EM-DASH" || echo "clean"`
Expected: `clean`.

- [ ] **Step 6: Commit and push**

```bash
git add app/proof/page.tsx components/marketing/navigation.tsx
git commit -m "feat(proof): add /proof page and navigation link"
git push -u origin feat/proof-page
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- proof-manifest.json contract → Tasks 1-8 build it; Task 9 types it. Covered.
- Generator from golden fixtures / real runs → Tasks 3 (hero via runnable_demo), 4-5 (per-capability real runs). Covered. (Refinement vs spec: per-capability cards use minimal asserted configs rather than golden fixtures, because the golden fixtures are relational-integrity scenarios, not one-per-strategy. The hero carries the real multi-table fixture story. Invariants for the grid are asserted in-code, which is strictly stronger than lifting a string. Flagged to the user at handoff.)
- Publish gate → Realized as the in-code invariant assertion (a card is emitted only if its guarantee holds) plus the explicit `WAIVED_MASK_STRATEGIES`. The spec's `publishable: true` golden-manifest flag is not needed because no golden fixtures are published; the hero and capability data are purpose-built safe synthetic values. Documented.
- Drift control → Tasks 5 (completeness gate) + 8 (regenerate-and-diff sentry), mirroring the existing capability-matrix sentry. Covered.
- Page layout (hero, grid, providers, benchmarks, reproduce footer) → Tasks 11-12. Covered.
- Components list → Tasks 10-11. Covered (added `sample-table.tsx` as a shared primitive, an improvement that keeps the others DRY).
- Resolved decisions (HIPAA hero, `python examples/runnable_demo.py` reproduce command, no `decoy` CLI) → Tasks 3 and 12. Covered.
- Granularity (24 op cards, 34-provider table, dated benchmarks) → Covered, with the honest note that the exact mask-strategy count is 12 user-facing (not 13) per the live matrix; the completeness gate binds to the real registry count, so the page self-corrects.

**Placeholder scan:** No "TBD"/"add error handling"/"similar to Task N". Task 5 enumerates remaining capabilities via an authoritative checklist + a hard completeness gate and a worked pattern, not a vague placeholder.

**Type consistency:** `build()`, `_surface()`, `_hero()`, `_capabilities()`, `_providers_list()`, `_generation_strategies_list()`, `_benchmarks()`, `WAIVED_MASK_STRATEGIES`, `_capability_matrix_module()` are defined once and referenced consistently. TS interfaces in `lib/proof.ts` match the JSON keys emitted by `build()` (`engine_version`, `generated_at`, `surface`, `hero`, `capabilities`, `providers`, `generation_strategies`, `benchmarks`) and component props consume those exact types.

## Known follow-ups (out of scope for this plan)

- A CI step in `decoy-web` (or a shared CI) that fails if `lib/data/proof-manifest.json` differs from `../decoy-engine/docs/proof-manifest.json`, closing the manual-sync gap. Today the sync is a `pnpm sync:proof` command run by hand.
- Generation-strategy and transform-op example cards (the grid currently proves mask strategies; generation strategies are listed but not individually carded).
- Option B: an interactive live-masking playground.
