# Motion guide -- `decoy-web`

> **Status:** target -- nothing implemented yet. Library not installed; primitives not scaffolded. The animated STORM 3-step diagram in [BRAND_GUIDE.md](BRAND_GUIDE.md) Priority 3 is the first concrete need; this guide describes the target system that will support it.
> **Last reviewed:** 2026-05-11

The motion conventions for the public marketing site. Read this before adding any animation to a page or component. If you find yourself reaching for raw `style.transition` strings or a bespoke `requestAnimationFrame` loop, you've skipped this guide.

---

## 1. Library choice

- **Framer Motion** (`framer-motion`) for any motion driven by React state: entrances, exits, gesture-aware controls, scroll-triggered reveals, layout transitions.
- **Tailwind utilities** (`transition-*`, `animate-pulse`, `hover:scale-105`) for trivial CSS-only transitions on static elements.
- **Skip GSAP** unless we hit a timeline coordination problem Framer can't model cleanly. The bundle cost isn't worth it today.
- **Skip Lottie** until a designer ships actual `.lottie` files. The library is fine; the input doesn't exist yet.
- **Skip the View Transitions API** until Next.js promotes its support out of experimental. Worth re-evaluating per Next.js minor release.

Always ask "can Tailwind do this?" before reaching for Framer Motion. CSS is faster, simpler, and ships zero JS bytes.

---

## 2. Brand-aligned motion language

The site narrates the engine. The engine has three beats: **Storm finds it. Forecast explains it. Report files it.** Motion should reflect that arc.

| Beat | Feel | Framer config |
|---|---|---|
| **STORM** | kinetic, fast, slightly chaotic | `transition={{ type: "spring", stiffness: 800, damping: 14 }}` |
| **FORECAST** | calm, considered, smooth | `transition={{ duration: 0.5, ease: "easeOut" }}` |
| **Report** | filed, settled, final | `transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}` |

Use these as starting points; adjust per element. The spring on STORM should feel snappy, almost twitchy -- it's the data-finding beat, not the polish beat. The Report easing is a custom cubic Bezier (`easeOutQuint`-ish) that decelerates hard at the end, evoking finality.

The CLI side already follows this same arc: the storm scan animation cycles through calm-clouds -> rain -> lightning -> passes; the forecast spinner uses `simpleDotsScrolling` (scrolling drops, calmer). Web should rhyme with that, not redefine it.

---

## 3. Reusable primitives

Live in `components/marketing/motion/`. All client components (`'use client'` at the top) -- Framer Motion needs the browser.

### `<FadeUp>` -- generic entrance

The default reveal: 20px down + invisible -> final position + visible. Use for hero copy, section headers, anything that should feel "arrived".

```tsx
<FadeUp delay={0.1}>
  <h1>Your prod data, unrecognizable.</h1>
</FadeUp>
```

### `<ScrollReveal>` -- on-viewport entrance

`<FadeUp>` triggered when ~30% of the element scrolls into view. `once={true}` so it doesn't replay on scroll-back. Use for below-the-fold sections that should feel discovered.

```tsx
<ScrollReveal>
  <FeatureGrid />
</ScrollReveal>
```

### `<StaggerChildren>` -- sequenced reveal

Wrap a list to fade-up its children on a 60ms stagger. The Disguises grid, FAQ items, pricing rows.

```tsx
<StaggerChildren>
  {disguises.map(d => <DisguiseCard key={d.id} {...d} />)}
</StaggerChildren>
```

### `<SpringButton>` -- interactive primitive

A `motion.button` with `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.97 }}` on a spring transition. Use for CTAs (`Start free trial`, `Talk to sales`). Subtle -- the reaction is the polish, not the show.

### `<ModalShell>` -- `AnimatePresence` wrapper

Wraps Radix dialog content with enter/exit animation. Needed when the per-Disguise detail modal lands (BRAND_GUIDE.md Priority 2 -- currently the rows just link out).

### `<StormBeat>` / `<ForecastBeat>` / `<ReportBeat>` -- the 3-step diagram

For the STORM page hero diagram (BRAND_GUIDE.md Priority 3). Each renders a step card with the beat-appropriate motion: STORM snaps in, FORECAST eases in, Report settles in. Compose as siblings inside a `<StaggerChildren>` for the full sequence.

```tsx
<StaggerChildren>
  <StormBeat icon={<StormIcon />} title="Storm finds it" />
  <ForecastBeat icon={<ForecastIcon />} title="Forecast explains it" />
  <ReportBeat icon={<ReportIcon />} title="Report files it" />
</StaggerChildren>
```

---

## 4. Accessibility -- `prefers-reduced-motion` is non-negotiable

Every primitive must check `useReducedMotion()` from Framer Motion and degrade to instant transitions when the user has set the OS-level reduced-motion preference. The default `<FadeUp>` becomes a no-op visual change; content still renders at its final position.

```tsx
import { motion, useReducedMotion } from 'framer-motion'

export function FadeUp({ children, delay = 0 }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
```

Do not assume `prefers-reduced-motion: no-preference` is the common case. ~15% of users opt in (vestibular concerns, attention focus, low-end hardware). Test by toggling `Settings -> Display -> Reduce motion` on macOS or `Settings -> Ease of access -> Display -> Show animations` on Windows.

---

## 5. Performance budget

- **First-load JS impact:** framer-motion adds ~24kb gz to the bundle. Use `LazyMotion` + `m` instead of `motion` for components rendered on first paint to drop ~16kb.
- **Per-frame cost:** keep page-scoped animations under 50ms total CPU per frame. Most of that is Tailwind's built-in CSS transitions; Framer adds little if you stick to `transform` and `opacity`.
- **No animations on layout-trigger properties** (`width`, `height`, `top`, `left`, `margin`). Use `transform` (`translate`, `scale`) and `opacity` only. Framer Motion respects this if you pass `x`, `y`, `scale`, `rotate` instead of CSS box properties.
- **No infinite-loop animations on hero pages.** They burn battery and distract from copy. The one exception is the STORM page diagram, which loops because it's literally illustrating a continuous engine pipeline -- and even then it pauses on `prefers-reduced-motion`.

---

## 6. SSR and the `'use client'` boundary

Framer Motion is a client library. Any component that imports from `framer-motion` must be a client component (`'use client'` at the top of the file).

The pattern: keep page files (`app/**/page.tsx`) as server components, import small client-component motion wrappers from `components/marketing/motion/`. The static content stays in the server bundle; only the motion wrappers ship JS.

```tsx
// app/page.tsx -- server component, no 'use client'
import { FadeUp } from '@/components/marketing/motion'

export default function Home() {
  return (
    <main>
      <FadeUp>
        <Hero />
      </FadeUp>
    </main>
  )
}
```

---

## 7. Anti-patterns

- **Motion that exists only for show.** If removing the animation makes the experience worse, keep it. If removing it makes no difference, delete it.
- **Long entrance animations on the home page.** Anything over 600ms makes the page feel slow on a fast connection -- the ironic outcome of trying to add polish.
- **Motion gating content visibility for >300ms.** Users on slow networks already wait for Vercel; we shouldn't add more.
- **Parallax for parallax's sake.** It's a 2014 trend that fights with scroll velocity on trackpads. Skip unless there's a specific narrative reason.
- **Animating in/out of forms during input.** Disorienting. Forms get instant transitions only.
- **Spring physics on text.** Springs evoke physical objects. Text isn't an object; it's information. Use `easeOut` durations for copy, springs for elements that look like things (buttons, cards, images).

---

## 8. Implementation roadmap

This document is the standard. Implementation lands in two slices, each ~1 day's work:

**Slice 1 -- primitives.** Install framer-motion. Scaffold `components/marketing/motion/` with `FadeUp`, `ScrollReveal`, `StaggerChildren`, `SpringButton`, `ModalShell`. All respect `useReducedMotion`. Sandbox page at `app/_sandbox/motion/page.tsx` so changes can be eyeballed.

**Slice 2 -- STORM beats.** Build `<StormBeat>` / `<ForecastBeat>` / `<ReportBeat>`. Wire into `app/product/storm/page.tsx` once that page lands per BRAND_GUIDE.md Priority 3.

Tracked in [plans/2026-05-11-motion-primitives.md](plans/2026-05-11-motion-primitives.md).
