import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PostHogProvider } from '@/components/posthog-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Decoy - Data Masking & Synthetic Data Generation',
  description: 'Developer-focused data masking and synthetic data tooling for local files, YAML pipelines, STORM profiles, and self-hosted team workflows.',
  generator: 'v0.app',
  keywords: ['data masking', 'synthetic data', 'test data', 'data privacy', 'GDPR', 'PII masking', 'dev test data', 'CLI tool'],
  authors: [{ name: 'Decoy' }],
  openGraph: {
    title: 'Decoy - Data Masking & Synthetic Data Generation',
    description: 'Profile data, review masking recommendations, and build safer test datasets with explicit YAML and self-hosted workflows.',
    type: 'website',
    siteName: 'Decoy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Decoy - Data Masking & Synthetic Data Generation',
    description: 'Data masking and synthetic generation tooling for teams that need realistic test data without broad compliance promises.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
