# decoy-web

Public marketing and docs site for Decoy. Next.js (App Router) + shadcn/ui + Tailwind + Radix.

## What ships here

- Marketing pages: `/`, `/about`, `/pricing`, `/docs`, `/blog`, `/disguises`, `/security`, `/changelog`
- Product sub-routes: `/product/masking`, `/product/synthetic-data`
- Waitlist form: `/trial` (Web UI early access)

## What this is NOT

- Not the platform application. That lives in the separate `decoy-platform` repo + ships behind the BUSL-licensed Web UI.
- Not the CLI. The CLI lives in the separate `decoy` repo (PyPI distribution name `decoy-cli`, BUSL-1.1).
- Not the engine. The engine lives in the separate `decoy-engine` repo (Apache-2.0).

The site is the public-facing surface for all three.

## Run locally

```
pnpm install
pnpm dev
```

The dev server listens on `http://localhost:3000`.

Build for production:

```
pnpm build
pnpm start
```

## Repo layout

- `app/` Next.js App Router routes. Each route is a `page.tsx` under its segment directory.
- `components/marketing/` page sections (Hero, Pricing, FAQ, etc.).
- `components/ui/` shadcn/ui primitives (button, card, dialog, etc.).
- `lib/` shared helpers + utility code.
- `hooks/` React hooks.
- `docs/` site-specific documentation (audit findings, brand notes).

## Content-accuracy rule

Marketing claims that outrun product capability are the chronic risk on this surface. The capability surface (13 mask strategies, 5 generate column types, 6 transform ops, 34 providers) is documented at `decoy-platform/docs/v2/reference/capability-matrix.md`. Any new claim about strategies, generators, transforms, or providers must check against that doc; performance claims must trace to a dated benchmark in `decoy-engine/tests/benchmark/calibration/`.

## License

Apache-2.0. See `LICENSE`.

The site source itself is open-source even though the CLI is currently BUSL-1.1 and the platform is commercial. The site exists to advertise and document the product family; the site source has no commercial restriction.
