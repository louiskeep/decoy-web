# decoy-web — Claude Context

Public marketing site and documentation. Next.js + shadcn/ui + Tailwind. **No Python. No backend. No secrets.**

## Docs in this repo

We use two doc types. Distinguishing them keeps long-term plans aligned and short-term plans from rotting.

- **Guides** are durable specs describing target state. Filename: `*_GUIDE.md`, repo root. Header carries `Status:` (`target` / `partial` / `superseded`) and `Last reviewed:`. When a feature ships, the implementer updates the relevant guide in the same PR.
- **Plans** are transient, scoped to a PR or sprint. Live in `plans/`, dated. Header carries `Status:` (`planning` / `in-progress` / `shipped` / `abandoned`), `Branch:`, and `References:` (the guides being implemented). Once a plan ships, it can be deleted — git history is the archive.

Orientation files (this `CLAUDE.md`, `dev-help.md`, `README.md`) are conventional contributor entry points and stay outside the guide/plan taxonomy.

## Comment style

Comments explain what a section / code block does in good detail, in **1–2 sentences**. Reach for more only when the block is genuinely complex — a state machine, a non-obvious algorithm, security-sensitive math, a workaround for a specific bug. Default mode: terse and to the point.

- **Yes:** `// Hero copy varies by referrer — preserve UTM during the redirect.`
- **No:** silent code with no context.
- **No:** restating what the next ten lines obviously do.

Comments live next to the surprise, not at the top of the file. If the non-obvious thing is the *why*, write that, not the *what*.

### Active guides

- [BRAND_GUIDE.md](BRAND_GUIDE.md) — marketing-site brand standards: hero copy, Disguises wedge, STORM page, pricing/comparison rules, /security depth, FAQ. *(partial)*

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
