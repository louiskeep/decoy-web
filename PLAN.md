# Decoy website launch plan

Status: active (2026-10-24). Owner: Cam.
Scope: the public website only (the `decoy-web` repo, served at trydecoy.com).
Not in scope: engine, platform, or CLI product work. Where a website task
depends on product truth (claims, benchmarks, docs), it consumes the product's
own records; it does not change them.

Rules consulted: 00-universal, risk-and-exceptions, development-loop,
workspace-and-vcs, release-and-rollback. Risk: R1 (content and config on a
pre-launch marketing site; the public go-live is a reversible deploy over an
established path). This is the `decoy-web` repo's plan feeding the single
central roadmap (decoy-platform/docs/ROADMAP.md); it is a plan, not a second
roadmap.

## Guarantee and non-goals

Guarantee: one public website at trydecoy.com, built from this repo, whose every
claim and number is traceable to the product, with a how-it-works page that
explains each pipeline stage with a worked example and a visual.

Non-goals: redesigning the brand, rebuilding the docs framework from scratch,
shipping Platform-UI screenshots in the first pass, and any engine/platform code
change. Each is either a separate track below or explicitly out of scope.

## Tracks and tasks

Each task lists what, why, acceptance (how we know it is done), and depends-on.

### Track 1 — One website (foundation)

**W1. Consolidate to a single site rooted in `decoy-web`.**
- What: trydecoy.com is served from this repo only. The docs (today the separate
  `decoy-web-docs` Fumadocs app, vendored into `dist/docs` but stale) serve at
  trydecoy.com/docs from a build folded into this repo's publish. Retire any
  separate docs deployment or domain.
- Why: the user wants one site, one deploy, one URL. Two deployables means two
  places to keep current and two chances to drift.
- Decision to confirm (does not block starting): keep `decoy-web-docs` as the
  docs *source* and vendor its built export into this repo under `/docs`
  (recommended, matches what already happens), versus rebuilding docs natively
  in Eleventy (heavy, not recommended).
- Acceptance: only trydecoy.com serves content; `/docs` resolves there; no second
  live site or domain; a short note in CODEMAP/README records the docs source and
  the vendor step.
- Depends-on: none. Do first; it defines the artifact every later task targets.

### Track 2 — Content truth (gates public go-live)

**W2. Capability-claims audit.**
- What: check every claim on all pages (home, cli, platform, how-it-works,
  pricing, security) and the vendored docs against the engine's
  PRODUCT_CAPABILITIES and the real CLI. Fix or remove anything that outruns the
  product. Produce a claim-by-claim checklist.
- Why: a prior doc/CLI audit found P0 overclaims; we cannot publish claims the
  product does not meet, and the standing rule is to express every real
  capability and no unreal one.
- Acceptance: each claim traced to a capability source or removed; the checklist
  is committed; no "about" number left unsourced.
- Depends-on: W1 (so the audit covers the consolidated site including docs).

**W3. Install benchmark results.**
- What: replace the how-it-works performance figures with authoritative numbers
  from the engine's capacity records and the authorized GCP benchmark runs, each
  with its conditions and platform caveats. Remove any figure without a source.
- Why: the current table says "reproduced from capacity records"; it must match
  the records exactly, and the GCP runs are the authoritative sizing source.
- Acceptance: every number cites a source and states conditions; figures match
  the engine records; platform limits (Linux x86-64 only) stay explicit.
- Depends-on: W2 (same truth pass).

### Track 3 — How-it-works node deep-dive

The page today has a flow diagram and short stage cards for Source, Scan, Subset,
Mask/generate, Validate, Evidence, Target. This track adds a detailed lower
section per stage.

**W4. Design the per-node deep-dive pattern.**
- What: one reusable section layout for a stage = a visual, a "what it does"
  explanation, a "why it matters" line, and one concrete worked example. Decide
  whether all seven stages get the treatment (recommended) or only the transform
  core (Scan, Subset, Mask/generate, Validate).
- Why: the cards are too thin to show what each stage actually does; a worked
  example per stage is what makes the pipeline legible.
- Acceptance: an approved layout (one stage built as the reference) that is
  responsive and consistent with the teal/black/gold theme.
- Depends-on: W1.

**W5. Author per-node content with verified samples.**
- What: copy plus a concrete before/after example per stage (scan findings, an
  FK-intact subset slice, a mask input to output, a validate finding, an evidence
  manifest excerpt, a target write). Use the repo's existing snippet-verification
  system so samples cannot drift from reality.
- Why: examples are the explanation; verified samples keep them honest as the
  product changes.
- Acceptance: every stage has verified copy and at least one sample; snippet
  checks pass.
- Depends-on: W4; consumes W2 truth.

**W6. Build the per-node visuals.**
- What: per-stage visual (CSS/SVG diagram or before/after table) plus CLI
  terminal captures where a stage has terminal output. Theme-consistent,
  responsive, sized to avoid layout shift.
- Why: a visual per stage is the core of the request.
- Acceptance: each stage renders its visual cleanly on phone and desktop; no CLS
  from unsized media; passes a visual review.
- Depends-on: W4, W7 (terminal captures), W5.

### Track 4 — Screenshots and media

**W7. CLI / terminal captures (now).**
- What: capture CLI output (scan, run, validate, evidence) as consistent,
  theme-matched terminal images or recordings for the cli and how-it-works pages.
- Why: screenshots the request calls for; the CLI is stable and screenshottable
  today.
- Acceptance: captures are consistent in style, have alt text, are optimized
  (WebP or equivalent), and carry explicit dimensions.
- Depends-on: W1.

**W8. Platform (Job Studio) screenshots (deferred slice).**
- What: capture real Job Studio screenshots from a stable Platform UI; use
  placeholders until then.
- Why: deferred by decision; the UI is not settled enough to screenshot now.
- Acceptance: deferred; tracked so the placeholders get replaced before the
  Platform page is called finished.
- Depends-on: a stable Platform UI (out of this plan's control).

### Track 5 — Docs currency

**W9. Bring the vendored docs current and linked.**
- What: rebuild the docs export so `/docs` is current, and confirm every
  `/docs/...` link the site points at resolves. Reconcile with
  `decoy-web-docs/ROADMAP.md` and `DOCS-PLAN.md` rather than duplicating them.
- Why: the vendored docs are stale and the how-it-works and surface pages link
  into them.
- Acceptance: no broken `/docs` link from the site; docs reflect current CLI and
  capabilities; the link checker passes.
- Depends-on: W1, W2.

### Track 6 — Publish and SEO

**W10. Publish the website.**
- What: finish the GitHub Pages go-live at trydecoy.com (enable Pages with the
  Actions source, add the DNS records at Squarespace, enforce HTTPS). The repo
  side (CNAME, deploy workflow, rebrand) is already committed.
- Why: the site has to be live.
- Why gated: public go-live waits on W2 (claims audit green) so we do not publish
  claims that outrun the product.
- Acceptance: trydecoy.com serves over HTTPS; the deploy workflow is green; the
  www host redirects to apex.
- Depends-on: W2 green. Content tracks should be presentable, but W2 is the hard
  gate.

**W11. Google Search Console.**
- What: verify trydecoy.com as a property, submit sitemap.xml, confirm indexing;
  set the canonical host. Bing Webmaster optional.
- Why: so the site is discoverable; the sitemap, robots, and llms.txt are already
  in place.
- Acceptance: property verified; sitemap submitted and read without errors; pages
  begin indexing.
- Depends-on: W10 (site live on the custom domain).

### Track 7 — Launch ops (listed, not website content)

**W12. Form the LLC.**
- What: form the business entity.
- Why: the entity should own the domain registrant, the GitHub org, and the
  product IP; this gates the domain-registrant move and the repo-to-org migration
  discussed separately.
- Acceptance: entity formed; follow-on tasks (domain registrant to entity, repo
  migration to an entity-owned GitHub org) can then proceed.
- Depends-on: none. Independent of the website build, included because it was
  asked for and it unblocks clean asset ownership.
- Note: this is ops, not website content; the GitHub-org migration is a related
  follow-on parked until the entity exists.

## Sequencing

1. W1 first (defines the single artifact).
2. W2 and W3 (truth) run next; W2 is the gate for W10.
3. W4 to W6 (how-it-works), W7 (CLI captures), and W9 (docs) proceed in parallel
   after W1, consuming W2 truth.
4. W10 publishes once W2 is green and content is presentable; W11 follows go-live.
5. W12 (LLC) runs independently; it gates the later ownership cleanup, not the
   website launch.

## Open decisions to confirm

- W1 docs strategy: vendor the `decoy-web-docs` export into this repo
  (recommended) versus rebuild docs in Eleventy (heavy).
- W4 scope: all seven stages get the deep-dive (recommended) versus the transform
  core only.
