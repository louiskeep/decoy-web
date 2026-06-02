# Claude Guide

Site-specific guidance for Claude and other coding agents working in this repo.

Use [README.md](README.md) for the high-level "what ships here" overview, and [CODEMAP.md](CODEMAP.md) for repo navigation before broad searches.

## Engineering best practices

The marketing site has no backend, no auth, no customer data. The rules that matter most here are about content accuracy and design discipline:

- Marketing claims that outrun product capability are the chronic risk on this surface. The capability surface (13 mask strategies, 5 generate column types, 6 transform ops, 34 providers) is the source of truth; new claims must check against it.
- Performance claims trace to dated benchmarks. Any claim ("X rows per second", "Y latency") must link to a dated benchmark file in the engine's `tests/benchmark/calibration/`. Claims older than one engine release get a "last measured on" annotation.
- Comments explain why, not what.
- No em-dashes in repo content (U+2014 banned project-wide).
- Cite established design patterns (shadcn/ui primitives, Radix unstyled, Tailwind utility classes); do not roll custom replacements.

## Content drift to watch for

- Pages or components that name retired features (FORECAST was retired under storm-reframe-C; do not reintroduce as a current capability).
- CLI commands or flags that no longer exist or are deferred (`decoy demo --ref` is currently a deferred-stub; do not advertise as a working invocation).
- Cross-repo links to private platform docs that would 404 for a public reader (only relevant if + when this site goes public-facing).

## Branch convention

Feature branches off main, conventional names (`feat/`, `fix/`, `chore/`). Do not commit directly to main. Push feature branches freely.

---

Broader engineering-best-practices and editorial guidelines live in the commercial platform repo.
