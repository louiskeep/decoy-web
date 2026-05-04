# Marketing site overhaul — `forge-web`

Scope: the Next.js 16 marketing site at decoy.dev (or wherever marketing registers). Adopts the May 2026 brand reference: rename Forge → Decoy, lead with Disguises as the wedge, surface STORM/FORECAST/Report as Business-tier value, and clean up forbidden language.

## Cross-cutting rules

- **HIPAA, never HIPPA.**
- **No per-row pricing language.** Phrases: "flat pricing", "no per-row fees".
- **Banned phrases anywhere on the site:** "Swiss Army knife", "Insights" (as a section), "Analytics" as a top-level product noun (the suite is STORM; the analysis is FORECAST; the artifact is a Report).
- **Mask is fine.** It's the locked term for a single field-level transform inside a Disguise. Do not rename existing "Data Masking" page copy that uses it correctly.

## Priority 1 — Rename + hero rewrite

Replace `pip install forge` in three locations:
- [components/marketing/hero.tsx:10](components/marketing/hero.tsx#L10)
- [components/marketing/cta.tsx:10](components/marketing/cta.tsx#L10)
- [components/marketing/origin-story.tsx:24](components/marketing/origin-story.tsx#L24)

New hero copy verbatim from the brand reference:

> **Your prod data, unrecognizable. Instantly.**
>
> Mask real data or generate synthetic datasets with compliance-ready Disguises for HIPAA, PCI, GDPR, and more.

Update tab title, favicon copy, manifest.json `name` / `short_name`, OG/Twitter meta tags. Don't ship the rest of the overhaul on the same PR — keep this rename PR clean so it can be reviewed and reverted independently.

## Priority 2 — Disguises page (the wedge)

Disguises are the primary differentiator and are currently invisible on the site. This page is the highest-leverage addition.

- New top-nav item **Disguises** between Product and Pricing in [components/marketing/navigation.tsx](components/marketing/navigation.tsx).
- Build `app/product/disguises/page.tsx`.
- Above-the-fold: explain what a Disguise is in one sentence — "A Disguise is a pre-built compliance template that masks the right fields the right way for HIPAA, PCI, GDPR, and more — no configuration from scratch."
- Comparison grid of all 8 launch Disguises: name, regulation, what it covers, primary buyer.
- Each row links to a sub-page or modal with the regulation summary and the field categories handled.
- Lead the page with HIPAA + PCI examples — those are the two highest-conversion buyers per the brand reference.

## Priority 3 — STORM page

Build `app/product/storm/page.tsx`. Replace the dead `/product/analytics` nav link with `/product/storm` in [components/marketing/navigation.tsx](components/marketing/navigation.tsx).

- Lead headline: **"Storm finds it. Forecast explains it. Report files it."**
- Animated 3-step diagram. Match the engine's actual flow (STORM scan → FORECAST recommend → Report file). The animation should mirror the in-product UX: kinetic during STORM, calm during FORECAST, filed at Report.
- Security callout: "FORECAST never touches raw data — it only reads STORM's statistical profile. Your PHI stays where it lives." This is the line that closes healthcare and fintech buyers.
- Below: a feature breakdown of what STORM detects (PII detection, format sniffing, re-id risk scoring) and what FORECAST recommends (Disguise auto-pick, field-level Masks, risk flags, ready-to-edit pipelines).

## Priority 4 — Pricing + comparison table

Edit [components/marketing/pricing.tsx](components/marketing/pricing.tsx) to add explicit feature rows that justify the $499/month upgrade:

| Feature | CLI | Business | Enterprise |
|---|---|---|---|
| 8 compliance Disguises | ✓ | ✓ | ✓ + custom |
| STORM dataset analysis | — | ✓ | ✓ |
| FORECAST recommendations | — | ✓ | ✓ |
| Reports (in-app + PDF export) | — | ✓ | ✓ |
| Audit history | — | ✓ | ✓ |
| Scheduled runs | — | ✓ | ✓ |
| Team access (RBAC) | — | up to 25 | unlimited |
| SSO/SAML, BAA, air-gapped | — | — | ✓ |

Reaffirm the pricing one-liner: **"No per-row fees. No surprise bills. No six-figure quotes."**

## /security strengthening

Edit [app/security/page.tsx](app/security/page.tsx).

- Add a HIPAA Safe Harbor section: name the rule (45 CFR 164.514(b)(2)), list all 18 identifiers, and describe how the HIPAA Disguise handles each.
- BAA-on-Enterprise callout (already there in spirit; make it specific).
- "Data never leaves your network" architecture diagram or text — already a top-3 buyer-anxiety reducer.

## FAQ additions

Add to [components/marketing/faq.tsx](components/marketing/faq.tsx):

- **What's a Disguise?** A pre-built compliance template (HIPAA, PCI, GDPR, GLBA, CCPA, FERPA, SOX, plus a default) that masks the right fields the right way. Apply with one click instead of configuring from scratch.
- **What is STORM?** Decoy's analysis event — it scans your dataset, identifies fields, detects formats, and computes statistics. STORM finds it; FORECAST explains it; Report files it.
- **Does FORECAST replace a data engineer?** No. FORECAST recommends Disguises and per-field Masks; engineers approve, edit, and ship. Think of it as the senior reviewer who's read every compliance regulation, not the engineer who writes the pipeline.
- **Can I export Reports for compliance audits?** Yes. Every Report can be exported as a PDF and shared with a compliance officer via signed link. Reports are immutable once filed.

## About page

Edit [app/about/page.tsx](app/about/page.tsx). Current origin story is the $40K masking-tool quote. Extend it: add the compliance-template moment — "we realized every healthcare team was rebuilding the same HIPAA Safe Harbor logic, every fintech team was rebuilding the same PCI tokenization, and the answer wasn't another configuration UI; it was prebuilt Disguises."

## Forbidden-strings audit

Pre-commit hook (or simple package script):

```
grep -rE "(forge|HIPPA|Insights|Analytics|Swiss Army|per[ -]row)" app components
```

Returns zero. Allow-list the literal text "Forge" only inside `app/changelog/` (historical release notes) if there's a compelling reason; better to update the changelog entries to read "Forge (now Decoy)".

## Sequencing

1. **PR 1**: Priority 1 (rename + hero) — small, reviewable, releasable on its own.
2. **PR 2**: Priority 2 (Disguises page + nav).
3. **PR 3**: Priority 3 (STORM page) — gated on the engine actually shipping STORM/FORECAST so the copy isn't aspirational.
4. **PR 4**: Priority 4 (pricing rows) + /security + FAQ + About — all small content edits, can be one PR.

## Verification

- `pnpm dev`. Click every nav item — no 404s.
- Hero, CTA, origin story all read `pip install decoy`.
- `/product/disguises` and `/product/storm` render. Old `/product/analytics` redirects to `/product/storm` (or returns 404 with a friendly link — pick one and document).
- Pricing page table includes the new rows.
- /security has a HIPAA Safe Harbor section with the 18 identifiers.
- Forbidden-strings grep returns zero.
- Build passes: `pnpm build`. Lighthouse on the homepage stays in the 90s for performance + accessibility.
