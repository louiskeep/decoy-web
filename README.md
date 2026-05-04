# forge-web

Public marketing site and documentation for Forge.

**Deploys to:** `forge.dev` (Vercel)
**Docs:** `forge.dev/docs` (Mintlify, sourced from `docs/`)

## What lives here

- Next.js marketing site (home, pricing, product pages, blog, security, changelog)
- Mintlify docs source (`docs/`)
- No Python. No backend. No secrets.

## What does NOT live here

- CLI code → `forge`
- Platform/SaaS code → `forge-platform`
- Masking engine → `forge-engine`

## Dev setup

```bash
pnpm install
pnpm dev
```

## Deployment

Vercel auto-deploys from `main`. Every PR gets a preview URL.
