import { source } from '@/lib/docs/source'
import { createFromSource } from 'fumadocs-core/search/server'

// Built-in Orama search over the (already draft-filtered) source tree. No
// external search service; runs fine in Vercel serverless.
export const { GET } = createFromSource(source, {
  language: 'english',
})
