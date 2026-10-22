import { source } from '@/lib/docs/source'
import { createFromSource } from 'fumadocs-core/search/server'
import { isDocsPublished } from '@/lib/docs/publish-gate'

// Static Orama search: `staticGET` emits the search index as a static file at
// build time, so the docs run as a static export (no server). The client reads
// it and searches in the browser (configured in app/layout.tsx).
//
// Gated with the same launch check as the pages: when the tree is not
// published, emit an empty index so the content never leaks through search,
// even if the build is deployed by mistake.
export const revalidate = false
export const dynamic = 'force-static'

async function emptyIndex() {
  return Response.json([])
}

export const GET = isDocsPublished()
  ? createFromSource(source, { language: 'english' }).staticGET
  : emptyIndex
