import { source } from '@/lib/docs/source'
import { createFromSource } from 'fumadocs-core/search/server'

// Static Orama search: `staticGET` emits the search index as a static file at
// build time, so the docs run as a static export (no server). The client reads
// it and searches in the browser (configured in app/layout.tsx with
// search.options.type = 'static').
export const revalidate = false
export const { staticGET: GET } = createFromSource(source, {
  language: 'english',
})
