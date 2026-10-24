'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

// Project key + host come from env so no secrets live in the repo. When the key
// is absent (local dev, CI) the provider is a transparent pass-through.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

// App Router does not fire a pageview on client-side navigation, so we capture
// it ourselves whenever the path or query string changes.
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!posthog.__loaded) return
    let url = window.origin + pathname
    const qs = searchParams.toString()
    if (qs) url += '?' + qs
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !POSTHOG_KEY || posthog.__loaded) return
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Cookieless posture: nothing is written to cookies or localStorage, so the
      // marketing site needs no consent banner (PO Lock 6b, 2026-06-03).
      persistence: 'memory',
      person_profiles: 'identified_only',
      autocapture: true,
      capture_pageview: false, // captured manually in PostHogPageView for SPA navigations
      capture_pageleave: true,
      disable_session_recording: true,
    })
  }, [])

  if (!POSTHOG_KEY) return <>{children}</>

  return (
    <PHProvider client={posthog}>
      {/* useSearchParams needs a Suspense boundary or it opts the whole route into client rendering. */}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
