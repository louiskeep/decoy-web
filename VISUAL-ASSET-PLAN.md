# Decoy website visual asset plan

Status: active inventory, 2026-10-24. This plan covers the public `decoy-web` site only.

## Direction

Decoy should show the work instead of illustrating it abstractly. Prefer, in order:

1. Real Decoy Platform screens from a stable build.
2. Real CLI output, rendered as accessible HTML when the text itself matters and captured as WebP only when the surrounding terminal context adds value.
3. Product-native diagrams: tables, relationships, manifests, checks, and data-flow boundaries.
4. A documented media slot when the real product screen is not stable enough to capture.

Do not publish fake dashboard screenshots or generic security imagery. A planned slot stays in this document until a truthful asset exists; the public page should use an honest diagram or no image rather than a misleading mock.

## Priority inventory

| Priority | Page / section | Visual | Status | Capture or build brief |
|---|---|---|---|---|
| P0 | `/how-it-works/#pipeline` | Seven stage-specific workflow panels | Built | Source map, scan findings, FK-aware subset, before/after mask, integrity checks, evidence + audit, and target map. Keep these as responsive HTML so the examples remain readable and theme-aware. |
| P0 | `/cli/` hero | Real first-run CLI sequence | Planned | Capture `scan → validate config → run → evidence` from one small fixture. Keep the command, timing, row count, and exit code visible. Provide an adjacent transcript if shipped as an image or recording. |
| P0 | `/platform/` Job Studio | Builder and run report | Present | Existing `studio-builder.webp` and `studio-report.webp`. Re-capture before launch from the release candidate so labels and capabilities match the shipped UI. |
| P1 | `/platform/#jobs` | Run history and job detail | Planned | Show a short run list with status, source, duration, and one opened job. Use real seeded demo data; no customer names or credentials. |
| P1 | `/platform/#audit` | Audit integrity screen | Planned | Show the current integrity verdict, one selected audit record, and export action. This should replace or sit beside the current HTML chain once the screen is stable. |
| P1 | `/platform/#access` | Roles and access screen | Planned | Show four roles, an OIDC configuration state, and a scoped API key list with secrets redacted. |
| P1 | `/security/#boundary` | Self-hosted data-boundary diagram | Planned | Draw source → Decoy host → safe target, with the Decoy-hosted control plane explicitly absent. Add credential and masking-key boundaries without depicting raw values. |
| P1 | `/cli/#subsetting` | Relationship-preserving subset example | Partly present | Reuse the visual grammar from the How it works subset panel, expanded to two tables with matching parent and child keys before and after the cut. |
| P1 | `/cli/#ci` | CI failure and success pair | Planned | Two compact terminal captures: exit 0 with evidence written, and exit 4 with a residual-PII finding. The distinction should remain understandable without color. |
| P2 | `/` “One engine, two ways” | CLI / Platform bridge | Planned | Pair a short CLI run artifact with one Platform job-detail crop. Connect them with the same pipeline filename to make “same engine” visible. |
| P2 | `/security/` evidence section | Manifest verification | Planned | Show a redacted evidence manifest beside `decoy report verify` output. Use real field names and hashes from a disposable fixture. |
| P2 | `/pricing/` Platform tier | Deployment footprint | Planned | Small architecture strip: customer host containing Caddy, app/worker, and Postgres. This supports the per-instance price without turning pricing into a product tour. |
| P3 | `/docs/start/*` | Task-specific screenshots | Planned | Add screens only to Platform steps that require spatial guidance. CLI guides should prefer copyable terminal blocks over screenshots of text. |

## Capture standard

- Capture against the release candidate with seeded, non-sensitive demo data.
- Use one browser size for Platform screens: 1600 × 900 source, exported to WebP at the displayed width.
- Crop to the decision being explained. Do not show a full application shell when one panel or report is the subject.
- Record the product commit and capture date in the pull request or asset note, not in the visible image.
- Give every image explicit `width` and `height`, useful alt text, and a caption when the context is not obvious.
- Keep CLI text selectable whenever possible. If animation is useful, ship a still fallback and respect reduced-motion preferences.
- Test each asset in dark and light site themes. A screenshot may remain in the product's native theme, but its frame and caption must work in both.

## Replacement order

1. Capture the CLI sequence because the CLI is the primary product entry point.
2. Re-capture Job Studio and add run history once the Platform release candidate is stable.
3. Add audit and access screens for enterprise evaluation.
4. Add the security boundary and evidence-verification visuals.
5. Use the home-page bridge only after both CLI and Platform assets are current enough to appear together.
