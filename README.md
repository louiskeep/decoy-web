# Decoy website

Marketing site for Decoy (self-hosted data masking and synthetic data generation), served at
https://trydecoy.com. Built with Eleventy from `src/`; the output in `dist/` is plain HTML, CSS,
and JS with no client-side framework.

## Pages

| URL | Source | Purpose |
|---|---|---|
| `/` | `src/index.njk` | Home: positioning, pipeline strip, CLI and Platform doors, proof, pricing teaser |
| `/cli/` | `src/cli.njk` | Developer product page: strategies, generation, subsetting, scan, CI, performance, install |
| `/platform/` | `src/platform.njk` | Team product page: Job Studio, triggers, audit, access, connectors, self-hosting |
| `/how-it-works/` | `src/how-it-works.njk` | Pipeline walkthrough, inside a run, CLI/Platform/Engine, performance |
| `/pricing/` | `src/pricing.njk` | Tiers, support, licences, FAQ (light theme) |
| `/security/` | `src/security.njk` | Data boundary, keys, audit, compliance mapping, disclosure (light theme) |
| `/docs/…` | `docs-src/` (Fumadocs) | Built by `scripts/build-docs.sh` into `dist/docs`; edit docs under `docs-src/content/` |
| `404.html` | `src/404.njk` | Not found |

Old URLs (`/features`, `/deployment`, `/workflow`, `/compliance`, `/resources`, `/support`,
`/changelog`) redirect via `src/_redirects`. The pre-redesign site is in git history before the
Eleventy rebuild if a reference is ever needed.

## Develop

    npm install
    npm run dev        # serves the marketing site on http://localhost:8099 with live reload
    npm run build:all  # marketing site + the docs export, combined into dist/
    npm run check      # build:all, then snippet, link/anchor, and banned-claim checks

## Deploy

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`: it runs `npm run check`
(which builds the combined marketing + docs site into `dist/`) and publishes `dist/`. `src/CNAME`
binds the custom domain (trydecoy.com). Any other static host works with `npm run build:all` and
publish `dist/`. `src/_headers` and `src/_redirects` use the Cloudflare Pages / Netlify format;
translate them if the host differs.

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
- `src/_includes/snippets/`: every code sample on the site, inlined with `{% snippet "file" %}`.
- `src/js/motion.js`: the GSAP motion layer, loaded only on pages with `motion: true`.
  GSAP is vendored from npm into `/js/vendor/` (no third-party requests).
- `scripts/check-snippets.mjs`: YAML samples parse; every `decoy <command>` in a code block is a
  documented command.
- `scripts/check-links.mjs`: every internal link and anchor resolves.
- `scripts/check-claims.mjs`: no banned compliance or readiness claims in built pages.
- `scripts/build-docs.sh`: builds the `docs-src/` Fumadocs export and assembles it into `dist/docs`.
- `docs-src/`: the Fumadocs docs project (content under `docs-src/content/`); `scripts/sync-cli-reference.mjs` syncs the CLI reference from the decoy repo.

## Copy rules

Product facts on the site are checked against the engine, CLI, and platform repositories. Do not
add compliance claims (SOC 2, HIPAA compliant, BAA, FedRAMP, GDPR compliant, PCI certified, FIPS,
"certified FPE", "compliance-ready"); the approved framing is "helps teams preparing for … audits"
and Disguises are "templates, not certifications". Every performance figure carries its conditions.
