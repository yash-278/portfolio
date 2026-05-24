import createMDX from '@next/mdx'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work with Turbopack
    // rehype-pretty-code is wired in Plan 01-02 with full Turbopack-safe configuration
  },
  turbopack: {
    // Set explicit absolute root to silence workspace root detection warning in monorepo/worktree contexts
    root: __dirname,
  },
}

const withMDX = createMDX({
  // rehype-pretty-code plugin is added in Plan 01-02
  // See RESEARCH.md Pattern 1 and Pitfall 1 for Turbopack-safe string-theme pattern
})

export default withMDX(nextConfig)
