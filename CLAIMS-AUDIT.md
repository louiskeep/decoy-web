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
- 25 value detectors -> capability-matrix.md "STORM detectors (25)". The count
  is correct; only the name is a problem (see F1).
- HKDF-SHA256 key derivation -> `decoy/.../context.py` `_hkdf_sha256`.
- Exit code 4 on findings -> `decoy/.../cli/exit_codes.py` `EXIT_FINDINGS=4`,
  raised by `run` and `report integrity`.

## Findings

### F1 (high) - "STORM" naming is stale across the whole site

The CLI was renamed. `storm.py` became `scan.py` (command group `name="scan"`;
the code says "Moved from storm.py with `scan`"), and the integrity check moved
into `report` (`report_app.command(name="integrity")`, folding "the `storm`
integrity check into this one noun"). "storm" is no longer a runnable command.
It survives only as a `decoy explain storm` topic and the engine pipeline config
key `run_storm:`, so it is not being removed everywhere; the user-facing CLI and
marketing use "scan".

Decision (Cam, 2026-10-24): use "scan" on the site and describe what it is and
does; do not coin a new brand name.

The drift spans four layers, not just copy:

1. Copy (concept noun) in `index.njk`, `how-it-works.njk`, `cli.njk`,
   `platform.njk`, `pricing.njk`, `llms.txt`.
2. Broken command examples: `decoy storm analyze` -> `decoy scan`;
   `decoy storm integrity pipeline.yaml out/` -> `decoy report integrity
   <masked.csv> --source <source.csv> --config pipeline.yaml` (name AND argument
   shape were wrong). In `cli.njk` and `src/_includes/snippets/ci.yml`.
3. Vendored CLI reference docs (`docs/reference/cli/`) still ship a `storm/`
   page and have no `scan/` page.
4. The snippet checker (`scripts/check-snippets.mjs`) validates commands against
   those stale docs plus a hardcoded subcommand map where `storm` is valid and
   `report` does not list `integrity`.

Why this is not a quick copy edit: changing copy to `scan`/`report integrity`
fails `npm run check` because the site verifies against the stale vendored docs.
A clean fix regenerates the vendored CLI reference from the current CLI and
updates the checker, which is W9 work and depends on the open W1 docs-source
decision.

Fix plan (one coordinated W2+W9 slice, after W1 is decided):
- Regenerate the vendored CLI reference from the current CLI so `scan` exists
  and `storm` is gone.
- Update `check-snippets.mjs`: drop `storm`, add `scan`, add `integrity` to
  `report`'s subcommands.
- Replace the concept noun with scan-anchored language and fix the command
  examples and the CI snippet.
- Fix docs links on the site that point at `/docs/reference/cli/storm` and
  `/docs/concepts/storm`.
- Run `npm run check` (snippets, links, claims) green.

## Not yet audited

- Home page (`index.njk`) beyond the STORM references.
- Platform page claims: four roles, OIDC SSO, hash-chained audit log, S3/GCS/
  Postgres sources, email/Slack/webhook alerts.
- Security page.
- Pricing specifics beyond the detector count.
- Performance figures on `how-it-works` (owned by W3, benchmark install).
- License claims (Engine Apache-2.0, CLI BUSL-1.1, Platform commercial).
