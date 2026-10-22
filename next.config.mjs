import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the docs ship as plain files to Cloudflare Pages, like the
  // marketing site. Needs the search route as staticGET and no server routes.
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
