import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { Navigation } from '@/components/marketing/navigation'
import { Footer } from '@/components/marketing/footer'
import { source } from '@/lib/docs/source'
import { isDocsPublished } from '@/lib/docs/publish-gate'

export default function Layout({ children }: { children: ReactNode }) {
  // Single choke point for the whole-tree launch gate (spec Section 6): every
  // /docs route renders through this layout, so one check here is enough to
  // keep the tree unreachable in production until launch.
  if (!isDocsPublished()) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Reuse the marketing chrome instead of Fumadocs' own nav bar, so /docs
          stays visually continuous with the rest of the site (spec Section 1.2). */}
      <Navigation />
      <DocsLayout tree={source.getPageTree()} nav={{ enabled: false }}>
        {children}
      </DocsLayout>
      <Footer />
    </div>
  )
}
