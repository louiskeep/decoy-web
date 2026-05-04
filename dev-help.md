# forge-web — Developer Reference

## First-time setup

```bash
pnpm install
pnpm dev                 # starts at localhost:3000
```

Requires Node 18+ and pnpm. Install pnpm with `npm i -g pnpm` if needed.

## Daily development loop

```bash
# 1. Branch
git checkout -b feature/my-change    # or content/my-post for copy-only changes

# 2. Edit app/ or components/
# Hot reload is automatic at localhost:3000

# 3. Build check before committing
pnpm build               # catches type errors and broken imports
pnpm lint

# 4. Commit and push
git add -p
git commit -m "feat: describe the change"
git push -u origin feature/my-change
# Vercel auto-creates a preview URL for the PR
# Open PR — do not merge without approval (main = production)
```

## Common tasks

### Adding a new page

Create `app/<route>/page.tsx`. Use existing pages as templates — they all follow the same layout pattern with `<Navigation />` and `<Footer />`.

### Adding a new marketing section component

Create `components/marketing/your-section.tsx`. Import and compose it in the relevant page.

### Adding a shadcn/ui component

```bash
pnpm dlx shadcn@latest add <component-name>
# This writes to components/ui/ — don't hand-edit those files
```

### Updating copy / content

Pages are in `app/*/page.tsx`. Most content is inline JSX — just edit the text directly. For blog posts, `app/blog/` will use MDX files once content structure is set up.

### Adding to the changelog

Edit `app/changelog/page.tsx` — entries are ordered newest-first.

## Deployment

- `main` branch → auto-deploys to `forge.dev` via Vercel
- Feature branches → Vercel creates a unique preview URL per PR (visible in the PR checks)
- Never push directly to `main`

## Docs (Mintlify) — coming Phase 2

`docs/` directory and Mintlify config will be added in Phase 2 of the migration. Once added:
```bash
# Docs are served from forge.dev/docs via a Next.js rewrite
# Mintlify pulls from the docs/ directory on push to main
```

## Troubleshooting

**`pnpm build` fails with type errors:** fix the types before committing — CI will also catch this.

**Component looks broken in dev:** check that the shadcn component was added via `pnpm dlx shadcn@latest add` and not hand-written.

**Styles not applying:** Tailwind classes are purged at build time — make sure class names are complete strings, not dynamically concatenated.
