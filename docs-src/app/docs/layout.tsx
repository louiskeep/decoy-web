import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/docs/source'
import { isDocsPublished } from '@/lib/docs/publish-gate'

// The docs mount under /docs on the marketing site. The chrome links back with
// relative paths so it stays on one site (the marketing pages live at the root,
// not in this Next app).
const SITE = ''

export default function Layout({ children }: { children: ReactNode }) {
  // Single choke point for the whole-tree launch gate: every /docs route renders
  // through this layout, so one check keeps the tree unreachable until launch.
  if (!isDocsPublished()) {
    notFound()
  }

  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <img src="/decoy-mark.png" alt="" width={22} height={22} />
            Decoy
          </span>
        ),
        url: '/docs',
      }}
      githubUrl="https://github.com/louiskeep/decoy"
      links={[
        { text: 'Features', url: `${SITE}/cli/`, external: true },
        { text: 'Pricing', url: `${SITE}/pricing`, external: true },
        { text: 'Security', url: `${SITE}/security`, external: true },
      ]}
    >
      {children}
    </DocsLayout>
  )
}
