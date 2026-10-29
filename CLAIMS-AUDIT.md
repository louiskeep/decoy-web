# Claims audit (W2)

Status: in progress (2026-10-24). Source of truth: the engine's authoritative
capability record (`decoy-engine/docs/capability-matrix.md`, generated from the
registries) and the current CLI source (`decoy/src/decoy/cli/`).

This records what was checked, what is true, and what must change. It is the W2
deliverable from PLAN.md. Coverage is partial; unaudited areas are listed at the
end so the gaps are explicit.

## Verified true (claim -> source)

- 23 mask strategies -> capability-matrix.md "Mask strategies (23)".
- 12 generation types -> capability-matrix.md "Generation strategies (12)".
- 34 synthetic providers -> capability-matrix.md "Synthetic providers (34)".
- 25 value detectors -> capability-matrix.md "Pre-scan detectors (25)". The count
  is correct; the section was renamed with the three-phase wave (see F1).
- HKDF-SHA256 key derivation -> `decoy/.../context.py` `_hkdf_sha256`.
- Exit code 4 on findings -> `decoy/.../cli/exit_codes.py` `EXIT_FINDINGS=4`,
  raised by `run` and `post-scan integrity`.

## Findings

### F1 (high) - retired concept name and command drift (resolved 2026-10-29)

The site used a retired product name for the profiling step and an old command
surface. The product is now described as three phases: Pre-scan (profile and
detect candidates), Transform (mask or generate), and Post-scan (integrity and
fidelity checks on the output). Decisions recorded:

- The CLI commands are `decoy pre-scan` and `decoy post-scan integrity|fidelity`.
  `decoy report verify` stays for artifact fingerprint verification and is not a
  privacy check.
- The pipeline schema is `version: 2`; the opt-in integrity run is
  `post_scan.integrity` (default `false`, report-only).
- No redirect or alias from the retired concept URL is kept (pre-GA hard rename).
- Copy keeps detection candidates, measured fidelity, integrity findings, and a
  release decision as separate claims. Fidelity is not a privacy guarantee. A
  renamed surface is not described as running a capability that is disabled.
- The vendored CLI reference is regenerated with `pnpm sync:cli-ref`; the
  snippet checker reads its command surface from that file, so a stale vendored
  copy fails `npm run check`.
- `schema.mdx` has no generator in this repo. Its `version` and `post_scan`
  entries were updated by hand from the engine's `PipelineConfig` JSON Schema;
  the rest of that snapshot is unchanged and can lag a newer install.

## W2 completion: Platform, pricing, and security claims (2026-10-24)

Audited every Platform capability, pricing, and security claim on `platform.njk`,
`pricing.njk`, `security.njk`, and the `llms.txt` platform line against the
platform's own docs and code (`decoy-platform`) and the engine capability matrix.
28 claims, 23 confirmed, 0 contradicted, no feature claimed that does not exist.
Platform version 0.1.0, status HELD (pre-launch); the site's launch-vs-prelaunch
gating is correct. Spot-verified directly, not taken on the audit's word:

- Four roles `admin` / `release_manager` / `developer` / `user` ->
  `decoy-platform/docs/security/permission-matrix.md:9-16`.
- Hash-chained append-only audit log is real -> `api/audit/chain.py` (RFC 8785
  JCS canonical bytes, SHA-256 over `prev_hash + canonical(fields)`), plus
  Postgres REVOKE + BEFORE UPDATE/DELETE/TRUNCATE triggers in the obs6a migration.
- SSO is OIDC + local accounts; SAML genuinely unsupported.

Findings (all copy-honesty, not false features; recommended edits held for Cam
per the one-page-at-a-time rule):

- M1 (medium): pricing/security says OIDC is "tested with Okta, Entra ID, Google
  Workspace, Keycloak, Auth0." Real-provider OIDC testing is explicitly deferred
  to the customer at install (`decoy-platform/docs/install/v1-clean-install-smoke
  .md:214`; CI is mock-based). "Tested with" implies live-IdP testing that was
  not done. Soften to "supports OIDC, documented for" those IdPs.
- L1 (low): the audit headline "A log that proves it was not edited" overstates
  the engine's own "tamper-evident" framing (a Postgres superuser can drop the
  trigger; trailing-suffix deletion is not detectable). Use "tamper-evident."
- L2/L3 (low): "runs in air-gapped networks" is defensible with the "after the
  image is pulled" hedge (offline-install bundle is later, an Enterprise add-on);
  two engine specifics ("FF1 refuses domains under one million values", "hipaa
  (21 rules)") were not verifiable from platform/security docs alone.
- Housekeeping (not a site defect): `decoy-platform/docs/product/connector-support
  -matrix.md` is stale (marks PostgreSQL removed) vs the shipped
  `docs/reference/database-input.md` the site correctly matches. Worth reconciling.

## W3: performance-claims traceability (2026-10-24)

Audited every performance number on `cli.njk`, `how-it-works.njk`, and the
`index.njk` stat tiles. The repo rule (`docs-src/CLAUDE.md`) wants each claim
linked to a dated file in the engine's `tests/benchmark/calibration/`, with a
"last measured on" note when stale.

Verified reality (a first automated pass over-alarmed by searching only the
engine repo and mis-matching one source; the following is checked against the
actual files, including `decoy-platform`):

- The numbers largely DO trace to dated sources, just not where the rule names:
  - 1M four-strategy `1.27s / 10.7s pandas` -> engine `docs/records/2026-09-30
    -rust-coverage-evidence-audit.md:12,54` (R074/R075: 1.27s at 4 threads vs
    10.69s pandas, byte-identical). Real and dated.
  - `~1.04M rows/s` hash vs `~235k` pandas -> engine `docs/plans/native
    -throughput-phase1-task1.2-record.md:33` + `docs/native/supported-matrix.md`
    (2026-09-10, measured at 4M rows on one dev-box).
  - 100M `~430s / 447MB` -> the native-throughput program's run (median 429.85s,
    446.9MB, 8 threads), recorded in the same 2026-09-30 evidence audit.
  - 10M pure generation `~14k rows/s / ~227MB` and the mixed 10M job -> platform
    F4 capacity bench, `decoy-platform/docs/backlog/RECENTLY-SHIPPED.md:276`
    (dennis + Codex GO).

- The genuine issues (medium; these, not fabrication, are what the perf section
  must resolve before the speed claims go public):
  - W3-A (the real one): the fast mask numbers (1.27s at 4 threads; the 100M run)
    come from the compiled executor `run_native_or_oracle_chunked`, which the
    engine's own 2026-09-30 audit states "has no production caller" and is off the
    default route (the unified compiled slice takes jobs under 100k rows by
    default; larger jobs need a forced/retained full-frame). So a default
    `decoy run` today may not reach these speeds. The site presents them as
    representative dev-host runs. This is the "claims outrun capability" risk.
  - W3-B: the 100M number ran on a remote/cloud host (platform
    release-validation remote-results), but the `cli.njk` table caption frames
    the whole table as "single-host developer runs, not a marketing benchmark."
    Mislabel; either relabel the 100M row or the caption.
  - W3-C: no site performance number carries a "last measured on" date, and none
    of the sources live in `tests/benchmark/calibration/` (the dir the rule
    names). The traceability rule is literally unmet even though dated sources
    exist. Fix: either add a small committed calibration record the site cites,
    or amend the rule to accept the engine records/platform validation runs.
  - W3-D (low): the hero terminal `1M / 3 strategies / 1.9s` (`cli.njk:31`) has
    no traced source and is inconsistent with the 1.27s four-strategy row; likely
    illustrative. Trace it or mark it illustrative.

This feeds roadmap Idea 4 (the how-it-works performance matrix): the redesign
must publish only numbers that reflect the default production route (or label
the fast-path ones honestly), carry dates, and cite a committed benchmark.

## License claims (2026-10-24)

Verified against the actual LICENSE files. All confirmed:

- Engine Apache-2.0 -> `decoy-engine/LICENSE` (Apache License 2.0). The site also
  calls the engine the shared data-plane both products import; correct.
- CLI BUSL-1.1 -> `decoy/LICENSE.md` (Business Source License 1.1). "Converts to
  Apache-2.0 on its change date" -> Change License = Apache 2.0, Change Date
  2030-05-10. The restriction ("offering Decoy itself as a hosted service") ->
  Additional Use Grant "Competing Use = offering the Licensed Work to third
  parties as a hosted or managed data-masking or synthetic-data service."
- Platform commercial -> `decoy-platform/LICENSE-COMMERCIAL.md` (proprietary,
  per-subscription).

- L (low): `decoy/LICENSE.md` carries `TODO(counsel): Finalize the "Competing
  Use" definition before v1.0.0`. The site states the restriction as settled;
  it is counsel-pending. Expected pre-GA, no change needed now, but the
  license text must be finalized before the CLI's public v1.0.0.

## Still not audited

- Home-page copy beyond the pre-scan references, the stat tiles, and the license line.
