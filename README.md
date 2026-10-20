# Decoy website

Marketing site for Decoy (self-hosted data masking and synthetic data generation).
Static HTML/CSS/JS, no build step. The visual system is adapted from the
MIT-licensed DuckDB website (https://github.com/duckdb/duckdb-web, (c) Stichting
DuckDB Foundation), re-skinned to Decoy's own identity (teal + Bricolage, mallard
mark). DuckDB name/logo/mascot are not used.

## Pages
- `index.html` — home
- `features.html` — capabilities (anchored: #masking #generation #subsetting #detection #observability #disguises)
- `deployment.html` — CLI vs Decoy Studio, self-host, connectors
- `pricing.html` — CLI free / Studio $499 mo / Custom
- `security.html` — self-hosted data plane, licensing, disclosure
- `docs.html` — docs landing (links out to the Fumadocs docs site)

## Run locally
Any static server, bound to all interfaces for LAN review:

    python3 -m http.server 8099 --bind 0.0.0.0

Then open http://<host>:8099/ . Light/dark mode follows the OS and persists.

## Deploy
The repository root is the publish directory. Deploy to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CDN) with no build command
and the output/publish directory set to the repo root.

## Structure
- `css/main.css` — the re-skinned base stylesheet
- `decoy-skin.css` — Decoy token overrides (teal ramp), font aliasing, small additions
- `fonts/` — Bricolage Grotesque (headings), Inter (body), IBM Plex Mono (code)
- `js/` — shared chrome behavior (nav, dark toggle, search), from the base
- `images/decoy/` — logo mark + favicons

Internal design notes and logo source live outside this repo in `../decoy-site-internal/`.
