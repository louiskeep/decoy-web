import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/docs/source'
import { isDocsPublished } from '@/lib/docs/publish-gate'

// The docs are their own deploy (docs.decoystorm.dev). The chrome links back to
// the marketing site instead of the Next marketing pages, which do not ship here.
const SITE = 'https://decoystorm.dev'

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
        url: SITE,
      }}
      githubUrl="https://github.com/louiskeep/decoy"
      links={[
        { text: 'Features', url: `${SITE}/features` },
        { text: 'Pricing', url: `${SITE}/pricing` },
        { text: 'Security', url: `${SITE}/security` },
      ]}
    >
      {children}
    </DocsLayout>
  )
}
