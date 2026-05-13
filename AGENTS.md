# Agent Operating Guide — decoy-web

You are working inside `forge-web`, the Decoy public marketing site and documentation. Next.js + shadcn/ui + Tailwind. **No Python. No backend. No secrets.**

Read this before touching code. Re-read the relevant section whenever you're unsure what's expected.

## Environment

- **OS:** Windows 11
- **Editor:** VS Code (Claude Code extension)
- **Shell:** PowerShell. Use `;` to chain (not `&&`), `$env:VAR` for env vars, `\` for paths. The Bash tool is available for POSIX scripts.
- **Runtime:** Node.js (LTS).
- **Package manager:** **`npm`** (matches existing `package-lock.json`). Don't introduce `pnpm` / `yarn` / `bun` without an explicit ask.
- **Framework:** Next.js (App Router).
- **UI primitives:** shadcn/ui on top of Radix.
- **Styling:** Tailwind CSS.
- **Linter:** `eslint` via `npm run lint`. Use it.
- **No formal type-check script** beyond what Next provides at build time; if you touch TS, run `npm run build` to verify.
- **No Python tooling.** This is a pure JS/TS repo.

## The Repo Family

- `forge` — Decoy CLI (Python, Typer + Rich).
- `forge-engine` — Pure-Python data engine.
- `forge-platform` — FastAPI backend + React/Vite dashboard. Hosts cross-repo `ROADMAP.md`.
- **`forge-web` (you are here)** — Next.js public marketing + docs site.

## The Workflow

```
spec  ->  plan  ->  execute  ->  verify  ->  commit
```

Don't collapse the loop — verify before claiming done.

## Required Reading Before You Touch Code

1. **`PLAN.md`** (this repo) — current focus + active task.
2. **`CLAUDE.md`** (this repo) — repo orientation.
3. **`../forge-platform/ROADMAP.md`** — cross-repo source of truth. Marketing items live under "SALES + MARKETING" + "Marketing in lock-step."
4. **`../forge-platform/GLOSSARY.md`** — Decoy vocabulary + `forge -> decoy` rename status. Marketing copy MUST conform to glossary terms.
5. **The files you're about to modify** + their immediate callers/callees.

## Your Role: Junior Dev With Good Instincts

- **No unilateral design overhauls.** Propose, then wait. shadcn primitives are the building blocks.
- **No new dependencies on a whim.** The repo already has Radix + Tailwind + react-hook-form + Vercel Analytics. New deps need a strong reason.
- **No refactors you weren't asked to do.** Note them in `PLAN.md`.
- **Verify before claiming done.** Run `npm run dev`, open the page in a browser, check the change rendered correctly.
- **Ask when stuck.** Two failed attempts -> stop and ask.

## Execution Rules

### One task at a time
Pick a single task from `PLAN.md`. Complete end-to-end before starting the next.

### Read before writing
- Search existing pages/components before adding a new one.
- shadcn components should be added via `npx shadcn add` not hand-rolled. Don't fork the primitives.

### Match the existing style
- 2-space indent, TypeScript, Tailwind class utilities.
- Server components by default, client components only when interactive state is needed.
- Comments are short — 1-2 sentences per section per existing `CLAUDE.md` style. Only longer when the block is genuinely complex.

### Lint before commit
- `npm run lint` (eslint).
- `npm run build` if you touched anything that could break TS or build-time imports.

### Commit discipline
- Lowercase prefix + imperative summary. Common: `feat:` / `fix:` / `style:` / `content:` / `docs:`.
- No emojis. No em-dashes (`—`). ASCII in commit messages, branches, PRs.
- Small commits.
- Never `git push --force` without explicit user approval. Never merge to `main` without explicit instruction.

## What "Done" Means

- [ ] Code minimal and renders.
- [ ] `npm run lint` clean (or only warnings the user accepts).
- [ ] `npm run build` clean if structural changes.
- [ ] Manual browser check at the relevant route.
- [ ] Committed with a clear message.
- [ ] `PLAN.md` updated.

## What You Don't Do

- **Don't add dependencies without asking.**
- **Don't introduce Python tooling or scripts here.** This is a JS-only repo.
- **Don't store secrets.** No `.env.local` with API keys committed; nothing real-data adjacent.
- **Don't violate glossary terms.** "Disguise" is capitalized; "STORM" is uppercase; "decoy" is lowercase in product copy unless starting a sentence.
- **Don't write code you didn't render in a browser.**
- **Don't refactor uninstructed.**
- **Don't expand scope.**

## When You're Stuck

1. Re-read `PLAN.md` + the file you're modifying.
2. Run `npm run dev` and look at the actual rendered output.
3. Try one focused alternative.
4. Stop and ask.

## Repo-Specific Notes — decoy-web

- **Stack:** Next.js App Router + shadcn/ui + Tailwind + react-hook-form + Vercel Analytics.
- **Deployment:** Vercel (assumed). No backend; static-ish marketing surface.
- **Content surface:** landing, pricing, 8 Disguise pages (lock-step with `forge-platform`'s Item 31 rollout), comparison sheet, demo video host, source-blind explainer.
- **Marketing items:** see "Item 10·M1 / M2 / M3 / M4" in `../forge-platform/ROADMAP.md`.
- **Glossary discipline:** marketing copy is the highest-visibility surface for Decoy vocabulary. Run any new copy past `../forge-platform/GLOSSARY.md`; flag conflicts before committing.
- **No real data, no real keys, no PII.** Marketing site only.
