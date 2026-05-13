# PLAN — decoy-web

> Source of truth for **what the agent is working on right now** in `forge-web`.
> Long-horizon "what to build next" lives cross-repo in [`../forge-platform/ROADMAP.md`](../forge-platform/ROADMAP.md). This file is the short-loop companion for marketing-site work.

---

## Status

- **Project:** decoy-web (Next.js marketing + docs site)
- **Stage:** building (pre-customer; no live deployment with users yet)
- **Current focus:** Marketing materials queued for lock-step delivery with `forge-platform` Item 31 (Disguise bundles) and Item 10 (marketing website).
- **Last updated:** 2026-05-12

---

## 1. Spec

**Product:** Decoy's public face. Landing, pricing, 8 Disguise pages (one per regulatory bundle), comparison sheet vs incumbents, demo video, source-blind explainer.

**User:** Compliance + data engineering leads searching "HIPAA data masking" / "synthetic data for analytics" / "PHI tokenization for QA environments." Convert from Google query to `pip install decoy` (or self-hosted form) in under 5 minutes.

**Success criteria:**
- Comparison sheet (Item 10·M1) leads with keyed-determinism + source-blind + canvas-native ETL — three things competitors don't have together.
- Per-Disguise pages (10·M2) ship in lock-step with the platform's Item 31 phases (1+2+3 shipped, pages still pending).
- Demo video (10·M3) — 90-second screen recording of "lose the DB, keep the masked output."
- Source-blind explainer (10·M4) — diagram + doc pitched against IDMC's "AI-powered discovery."

**Non-goals:**
- No application logic. No backend. No PII or real customer data.
- No A/B testing infra or analytics beyond Vercel Analytics until product-market fit signal arrives.

---

## 2. Architecture & Stack

- **Framework:** Next.js (App Router)
- **UI primitives:** shadcn/ui on Radix
- **Styling:** Tailwind CSS
- **Forms:** react-hook-form + Zod (via `@hookform/resolvers`)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel (assumed)
- **Lint:** eslint (`npm run lint`)
- **Build verify:** `npm run build`
- **No Python, no backend, no secrets.**

---

## 3. MVP Scope

Cross-repo marketing items live under "SALES + MARKETING" + "Marketing in lock-step" in `../forge-platform/ROADMAP.md`:

### Active queue
- **10·M1** — Comparison sheet (zero engineering; ship anytime).
- **10·M2** — Per-Disguise pages (lock-step with Item 31; phases 1+2+3 shipped on the platform, pages still pending here).
- **10·M3** — Demo video (zero engineering; record this week).
- **10·M4** — Source-blind explainer (zero engineering; ship before next big procurement push).
- **Item 10** — Marketing website (umbrella for the above).

### Not in scope (today)
- Pricing experiments / paywall logic — pre-customer.
- Logged-in user state — there is no user state.
- Blog / changelog — defer until there's something to changelog publicly.

---

## 4. Milestones

Web work tends to be lock-step with platform features shipping. See `../forge-platform/ROADMAP.md`.

---

## 5. Current Task

**Task:** _(none active)_
**Context:** N/A.
**Acceptance:** N/A.

---

## 6. Decision Log

- 2026-05-12 — Marketing surface stays decoupled from product: no backend, no real data. Only Vercel Analytics for traffic.

---

## 7. Open Questions

- [ ] Hosting: Vercel by default — confirm before adding any region-specific or edge-runtime feature.
- [ ] Glossary enforcement: should this repo grow a lint step that greps against `../forge-platform/TAXONOMY_GUIDE.md` banned strings, or stay manual?

---

## 8. Risks & Trade-offs

- **Risk:** Marketing copy drifts ahead of product reality (e.g. "supports DB connectors" when those are deferred). **Mitigation:** every marketing copy change has to pass against `../forge-platform/PRODUCT_CAPABILITIES.md` — only ship claims the platform can back today.

---

## 9. Backlog / Future

- Per-Disguise pages (8 bundles).
- Customer logo carousel (defer until customers exist).
- Public docs surface (currently `CLAUDE.md` references "Mintlify site at decoy.dev/docs" per the living documentation plan).

---

## Changelog

- 2026-05-12 — initial PLAN.md drafted alongside AGENTS.md.
