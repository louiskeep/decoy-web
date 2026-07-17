import { docs } from 'collections/server'
import { loader } from 'fumadocs-core/source'
import type { LoaderPlugin } from 'fumadocs-core/source'

// Hidden drafts (spec Section 5.5): any page with `draft: true` in frontmatter is
// removed from content storage before the page tree, page list, and search index
// are built. Enforced here in code (not by hand-editing meta.json `pages` arrays)
// so a draft page can never leak into nav/search/sitemap by omission.
const dropDrafts: LoaderPlugin = {
  name: 'drop-drafts',
  transformStorage({ storage }) {
    for (const path of storage.getFiles()) {
      const file = storage.read(path)
      if (file?.format === 'page' && (file.data as { draft?: boolean }).draft) {
        storage.delete(path)
      }
    }
  },
}

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [dropDrafts],
})
