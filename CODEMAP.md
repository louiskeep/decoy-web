# Decoy Web Codemap

## One-Line Project Summary

Public Next.js marketing and documentation site for Decoy, with no backend, customer auth, customer data, or committed secrets.

## Tech Stack

| Area | Stack |
|---|---|
| Framework | Next.js App Router |
| UI | React, shadcn/ui, Radix, Tailwind |
| Package manager | pnpm/npm as configured by repo |
| Deployment | Vercel-style static/frontend deployment |

## Entry Points

| Path | Purpose |
|---|---|
| `app/page.tsx` | Home page |
| `app/layout.tsx` | Root layout |
| `components/marketing/` | Page-level marketing sections |
| `components/ui/` | shadcn/ui primitives |

## Directory Map

| Path | What Lives Here |
|---|---|
| `app/` | Next.js routes: home, pricing, product, security, docs, trial, blog |
| `components/marketing/` | Custom marketing sections |
| `components/ui/` | shadcn/ui primitives; do not hand-edit unless necessary |
| `hooks/` | Shared React hooks |
| `lib/` | Utilities |
| `public/` | Static assets |
| `styles/` | Global styles |
| `.next/`, `node_modules/`, `.pnpm-store/` | Ignore generated/vendor content |

## Where Do I Find...

| Task | Start Here |
|---|---|
| Current product truth | `../decoy-platform/docs/product/capabilities.md` |
| Release cutline | `../decoy-platform/docs/release/release-roadmap.md` |
| Web role guide | `../decoy-platform/docs/guides/web-agent-guide.md` |
| Brand guidance | `../decoy-platform/docs/guides/brand.md` |
| Home page | `app/page.tsx` |
| Pricing page | `app/pricing/page.tsx` |
| Security page | `app/security/page.tsx` |
| Product pages | `app/product/`, `app/disguises/` |
| Marketing components | `components/marketing/` |
| UI primitives | `components/ui/` |

## Conventions

| Situation | Convention |
|---|---|
| Add page | Add under `app/<route>/page.tsx` |
| Add marketing section | Put custom section in `components/marketing/` |
| Add shadcn primitive | Use shadcn CLI when possible |
| Add claim | Verify against Product Capabilities and release cutline |
| Verify | Run lint/build and browser-check changed route |

## Gotchas

| Gotcha | Note |
|---|---|
| Marketing cannot outrun product | Claims need capability/evidence/limitation |
| No backend here | Do not add Python, platform auth, or customer data handling |
| No secrets | Do not commit `.env.local` or keys |
| UI primitives are managed | Avoid hand-editing `components/ui/` |

## Ignore For Navigation

| Path | Reason |
|---|---|
| `.next/`, `node_modules/`, `.pnpm-store/` | Generated/vendor |
| `public/` | Static assets unless visual task |
