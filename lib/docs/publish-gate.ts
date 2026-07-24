// Launch gate for the whole /docs tree (spec Section 6, resolved by Cam
// 2026-07-17: "build now, stay draft"). The CLI-first tree is built and
// merged, but nothing under /docs is reachable in a real production deploy
// until the PO's Apache-1.1 flip + public launch call flips DOCS_PUBLISHED.
//
// Vercel sets NODE_ENV=production for BOTH production and preview builds, so
// this checks VERCEL_ENV instead: gated only on the actual production
// deploy, and only when DOCS_PUBLISHED has not been explicitly turned on.
// Local dev, local `next build && next start`, and Vercel preview deploys
// all render the full tree so it can be reviewed pre-launch.
//
// DOCS_PUBLISHED=true forces the tree live (used at launch).
// DOCS_PUBLISHED=false forces it hidden (useful for testing the gate itself
// on a preview deploy).
export function isDocsPublished(): boolean {
  if (process.env.DOCS_PUBLISHED === 'true') return true
  if (process.env.DOCS_PUBLISHED === 'false') return false
  return process.env.VERCEL_ENV !== 'production'
}
