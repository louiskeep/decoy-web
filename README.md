# decoy-web

Public marketing site and documentation for Decoy.

**Deploys to:** `forge.dev` (Vercel)
**Docs:** `forge.dev/docs` (Mintlify, sourced from `docs/` — added in Phase 2)

## What lives here

- Next.js marketing site (home, pricing, product pages, blog, security, changelog)
- Mintlify docs source (`docs/`) — _not yet added; coming in Phase 2 of migration_
- No Python. No backend. No secrets.

## What does NOT live here

- CLI code → `decoy`
- Platform/SaaS code → `decoy-platform`
- Masking engine → `decoy-engine`

## Dev setup

```bash
pnpm install
pnpm dev
```

## Deployment

Vercel auto-deploys from `main`. Every PR gets a preview URL.
