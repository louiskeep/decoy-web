# Decoy website

Marketing site for Decoy (self-hosted data masking and synthetic data generation), served at
https://decoystorm.dev. Built with Eleventy from `src/`; the output in `dist/` is plain HTML, CSS,
and JS with no client-side framework.

## Pages

| URL | Source | Purpose |
|---|---|---|
| `/` | `src/index.njk` | Home: positioning, pipeline strip, CLI and Platform doors, proof, pricing teaser |
| `/cli/` | `src/cli.njk` | Developer product page: strategies, generation, subsetting, STORM, CI, performance, install |
| `/platform/` | `src/platform.njk` | Team product page: Job Studio, triggers, audit, access, connectors, self-hosting |
| `/how-it-works/` | `src/how-it-works.njk` | Pipeline walkthrough, inside a run, CLI/Platform/Engine, performance |
| `/pricing/` | `src/pricing.njk` | Tiers, support, licences, FAQ (light theme) |
| `/security/` | `src/security.njk` | Data boundary, keys, audit, compliance mapping, disclosure (light theme) |
| `/docs/…` | `docs/`, `_next/`, `api/`, `docs.html` | Vendored Fumadocs export; do not edit by hand |
| `404.html` | `src/404.njk` | Not found |

Old URLs (`/features`, `/deployment`, `/workflow`, `/compliance`, `/resources`, `/support`,
`/changelog`) redirect via `src/_redirects`. The pre-redesign pages are kept in `legacy/` for
reference while the remaining phases land; they are not built or published.

## Develop

    npm install
    npm run dev        # serves dist/ on http://localhost:8099 with live reload
    npm run check      # builds, then verifies every internal link and anchor resolves

## Deploy

Build command `npm run build`, publish directory `dist/`. Any static host works (Cloudflare Pages,
Netlify, Vercel, S3 + CDN). `src/_headers` and `src/_redirects` use the Cloudflare Pages / Netlify
format; translate them if the host differs.

## Structure

- `src/_data/site.json`: site-wide facts. `prelaunch: true` renders the launch banner and switches
  every primary CTA to "Get notified"; set it to `false` at release to show download CTAs instead.
- `src/_includes/layouts/base.njk`: the page shell (meta, theme script, header, footer).
- `src/_includes/partials/`: header, footer, banner.
- `src/_includes/icons/`: inline SVG icons, used with `{% icon "name" %}`.
- `src/css/tokens.css`: colors, type, spacing. Dark is the default; pages opt into light with
  `theme: light` in front matter; the toggle in the header overrides both and persists.
- `src/css/site.css`: layout and components.
- `src/js/site.js`: theme toggle, mobile nav, copy buttons, tabs. No dependencies.
- `src/fonts/`: Bricolage Grotesque (display), Geist and Geist Mono (body and code), all OFL.
- `scripts/check-links.mjs`: the link and anchor checker run by `npm run check`.

## Copy rules

Product facts on the site are checked against the engine, CLI, and platform repositories. Do not
add compliance claims (SOC 2, HIPAA compliant, BAA, FedRAMP, GDPR compliant, PCI certified, FIPS,
"certified FPE", "compliance-ready"); the approved framing is "helps teams preparing for … audits"
and Disguises are "templates, not certifications". Every performance figure carries its conditions.
