import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export. The app serves at its own root: docs under /docs, assets at
  // /_next, "/" redirecting to /docs, search as a static route. The deploy step
  // copies out/docs, out/_next, and out/api into the marketing site's dist so
  // the docs serve under /docs of the single deploy. These asset paths do not
  // collide with the Eleventy site, which uses /css, /js, and /fonts.
  output: 'export',
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
