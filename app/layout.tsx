import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Forge - Data Masking & Synthetic Data Generation',
  description: 'Free CLI plus paid Business platform for data masking and synthetic data generation. Self-hosted, sanely priced. Start in 5 minutes from the command line.',
  generator: 'v0.app',
  keywords: ['data masking', 'synthetic data', 'test data', 'data privacy', 'GDPR', 'PII masking', 'dev test data', 'CLI tool'],
  authors: [{ name: 'Forge' }],
  openGraph: {
    title: 'Forge - Data Masking & Synthetic Data Generation',
    description: 'We got quoted $40K to mask 3 tables. So we built this.',
    type: 'website',
    siteName: 'Forge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forge - Data Masking & Synthetic Data Generation',
    description: 'We got quoted $40K to mask 3 tables. So we built this.',
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
