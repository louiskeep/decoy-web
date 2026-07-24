import { defineDocs, defineConfig } from 'fumadocs-mdx/config'
import { pageSchema } from 'fumadocs-core/source/schema'
import { z } from 'zod'

// Frontmatter schema extends the Fumadocs default with `draft`. The source
// adapter (lib/docs/source.ts) reads this flag to drop unpublished pages
// before the nav/search/page tree is built (see Section 5.5 of
// docs/superpowers/specs/2026-07-17-cli-docs-nextra.md: hidden drafts are
// excluded in code, not by convention).
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      draft: z.boolean().default(false),
    }),
    // Exclude underscore-prefixed files and folders from the page set: hand
    // partials composed into a generated page (content/docs/cli/_index-intro.mdx)
    // and vendored source the splitter reads but never renders directly
    // (content/docs/cli/_source/). These have no page frontmatter and are not
    // meant to be routable (spec Section 4.2: composed, never interleaved).
    files: ['**/*.mdx', '**/*.md', '!**/_*/**', '!**/_*.mdx', '!**/_*.md'],
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      // Shiki dual-theme pair; picked for continuity with the site's dark-first
      // GitHub-adjacent palette (see app/globals.css `--color-fd-*` mapping).
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
