# forge-web — Claude Context

Public marketing site and documentation. Next.js + shadcn/ui + Tailwind. **No Python. No backend. No secrets.**

## Repo structure

```
app/                     ← Next.js App Router pages
├── page.tsx             ← home
├── pricing/page.tsx
├── product/
│   ├── masking/page.tsx
│   └── synthetic-data/page.tsx
├── about/page.tsx
├── blog/page.tsx
├── changelog/page.tsx
├── security/page.tsx
├── trial/page.tsx
└── docs/page.tsx        ← docs landing (links to /docs/* Mintlify routes)
components/
├── marketing/           ← page-level sections (hero, nav, footer, pricing, etc.)
└── ui/                  ← shadcn/ui primitives (do not hand-edit — use shadcn CLI)
hooks/                   ← use-mobile.ts, use-toast.ts (canonical location)
docs/                    ← Mintlify source — COMING PHASE 2 (not yet present)
```

## What is NOT in this repo

- Engine, CLI, or platform Python code → other repos
- Customer auth or data → `forge-platform`
- Anything requiring a secret at runtime → use Vercel env vars, never commit secrets

## shadcn/ui rule

Components in `components/ui/` are managed by the shadcn CLI. Don't hand-edit them. Add new shadcn components with:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Custom marketing components go in `components/marketing/`.

## Setup

```bash
pnpm install
```

## Dev server

```bash
pnpm dev                 # localhost:3000
```

## Build check (run before opening a PR)

```bash
pnpm build               # must pass with zero errors
pnpm lint                # must pass
```

## Branch workflow

**Never commit directly to `main`.** Vercel deploys `main` automatically to production.

```bash
git checkout -b feature/your-change
# work, commit
# open PR → Vercel creates a preview URL automatically
# wait for approval before merging to main (which triggers prod deploy)
```

Branch naming: `feature/`, `fix/`, `content/` (for copy/blog changes), `chore/`
