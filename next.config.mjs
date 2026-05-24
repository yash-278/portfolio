import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work
  },
}

// rehype-pretty-code added in Phase 3 (blog rendering) — Turbopack serialization
// constraint prevents passing function references in loader options at build time.
const withMDX = createMDX({
  options: {},
})

export default withMDX(nextConfig)
