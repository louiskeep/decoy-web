# Plan: motion primitives for the marketing site

> **Status:** planning  
> **Branch:** `claude/add-stormy-animation-991GF`  
> **References:** [MOTION_GUIDE.md](../MOTION_GUIDE.md), [BRAND_GUIDE.md](../BRAND_GUIDE.md) Priority 3 (STORM page)

## Why

The marketing site has zero motion today. The hero copy snaps in, the (planned) Disguises grid will be flat, and BRAND_GUIDE.md Priority 3 explicitly calls for an animated STORM 3-step diagram ("kinetic during STORM, calm during FORECAST, filed at Report"). Need the primitive layer in place before any of that can be built without one-off animation code spreading across components.

## Scope

**In:** install framer-motion, scaffold `components/marketing/motion/`, ship the five primitives the guide describes (`FadeUp`, `ScrollReveal`, `StaggerChildren`, `SpringButton`, `ModalShell`), wire `useReducedMotion` into all of them, smoke-test on a sandbox page.

**Out:** STORM 3-step beats, hero rewiring, any user-visible page changes. Those land in follow-up PRs once the primitives are in.

## Steps

1. `pnpm add framer-motion` -- updates `package.json` + `pnpm-lock.yaml`. Confirm `pnpm build` still passes.
2. Create `components/marketing/motion/` with one file per primitive:
   - `fade-up.tsx`
   - `scroll-reveal.tsx`
   - `stagger-children.tsx`
   - `spring-button.tsx`
   - `modal-shell.tsx`

   Each starts with `'use client'`. Each imports `useReducedMotion` and degrades correctly.
3. Add `components/marketing/motion/index.ts` barrel export so consumers import from `@/components/marketing/motion`, not deep paths.
4. Build `app/_sandbox/motion/page.tsx` -- a developer-only page demoing each primitive. The leading underscore keeps it out of the marketing nav; exclude from `sitemap.xml` separately.
5. Adopt `LazyMotion` + `m` (instead of full `motion`) inside `FadeUp` and `ScrollReveal` since they'll appear above the fold.
6. Hand-test on a fast machine and a throttled "Slow 3G" Network tab to confirm nothing janks.
7. Toggle macOS Reduce Motion + reload sandbox page -- every animation should resolve instantly to its end state.

## Definition of done

- `pnpm build` passes with zero errors.
- `pnpm lint` passes.
- All five primitives render at `/_sandbox/motion`.
- `prefers-reduced-motion` honored across all five.
- `LazyMotion` adopted on the two home-page-impacting primitives (`FadeUp`, `ScrollReveal`).
- MOTION_GUIDE.md status flipped from `target` to `partial` with the slice-1 line struck through.

## Out of scope (future PRs)

- STORM 3-step diagram (`<StormBeat>` / `<ForecastBeat>` / `<ReportBeat>`) -- waits on `app/product/storm/page.tsx` (BRAND_GUIDE.md Priority 3).
- Per-Disguise detail modal -- waits on Disguises page (BRAND_GUIDE.md Priority 2).
- Hero entrance wiring -- safe to do now but lower leverage than getting the STORM page right first.

## Risk

- **Bundle size**: framer-motion adds ~24kb gz to first-load JS. Mitigate with `LazyMotion` on the home page. Re-measure with Vercel Analytics after merge.
- **SSR boundary slip**: easy to import a motion primitive into a server component by mistake; that throws at runtime. Catch in a follow-up by adding the `react-server-components` ESLint plugin.
- **Tailwind 4 + framer-motion compatibility**: the project is on Tailwind 4 (very new). framer-motion doesn't depend on Tailwind, so no direct conflict expected, but verify `tw-animate-css` doesn't fight Framer's internal styles on the first integration.
