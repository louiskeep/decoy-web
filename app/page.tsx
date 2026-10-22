'use client'

import { useEffect } from 'react'

// This deploy serves only the docs. The root sends people to /docs. Cloudflare
// also does this at the edge (public/_redirects); this is the in-page fallback.
export default function Home() {
  useEffect(() => {
    window.location.replace('/docs')
  }, [])
  return (
    <main style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
      <p>
        Redirecting to the <a href="/docs">documentation</a>.
      </p>
    </main>
  )
}
