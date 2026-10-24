// Launch gate for the whole /docs tree. The CLI-first tree is built and merged,
// but nothing under /docs is reachable in a real deploy until the PO's Apache
// flip + public launch call sets DOCS_PUBLISHED=true.
//
// Deny by default (fail closed). A production build on ANY host (Cloudflare
// Pages, Vercel, a container, anywhere) keeps the tree hidden unless the build
// explicitly opts in with DOCS_PUBLISHED=true. This replaces the old
// VERCEL_ENV check, which failed open off Vercel: a default Cloudflare build
// would have published the tree. Local `next dev` still renders the full tree
// so it can be reviewed before launch.
//
// DOCS_PUBLISHED=true  forces the tree live (used at launch).
// DOCS_PUBLISHED=false forces it hidden (useful for testing the gate itself).
export function isDocsPublished(): boolean {
  if (process.env.DOCS_PUBLISHED === 'true') return true
  if (process.env.DOCS_PUBLISHED === 'false') return false
  return process.env.NODE_ENV !== 'production'
}
