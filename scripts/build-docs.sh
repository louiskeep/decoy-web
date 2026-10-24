#!/usr/bin/env bash
# Build the Fumadocs docs project and assemble its static export into the
# marketing site's dist/, so one publish serves the marketing site at the root
# and the docs under /docs. Run after the Eleventy build (dist/ must exist).
#
# The docs app serves at its own root (docs under /docs, assets at /_next, "/"
# redirecting to /docs). We mirror that layout: docs pages under /docs, the docs
# index at both /docs/ and /docs.html, assets at /_next, the static search route
# at /api. The export's "/" redirect page is left out so it does not shadow the
# marketing home page.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
cd "$here/docs-src"
# Publish the docs tree in this build. The gate (lib/docs/publish-gate.ts) hides
# every /docs route by default under NODE_ENV=production, so without this the
# deploy would ship an empty /docs (all routes 404, empty search index). Default
# to publishing (the combined site exists to serve the docs), but respect an
# explicit DOCS_PUBLISHED from the caller so the gate can still withhold the tree
# on purpose rather than being forced open unconditionally.
export DOCS_PUBLISHED="${DOCS_PUBLISHED:-true}"
pnpm install --frozen-lockfile
pnpm build

cd "$here"
rm -rf dist/docs dist/_next dist/api dist/docs.html
cp -r docs-src/out/docs dist/docs
cp docs-src/out/docs.html dist/docs/index.html
cp docs-src/out/docs.html dist/docs.html
cp -r docs-src/out/_next dist/_next
cp -r docs-src/out/api dist/api
