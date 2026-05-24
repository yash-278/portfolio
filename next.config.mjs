import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work with Turbopack
  },
  turbopack: {
    // Set explicit absolute root to silence workspace root detection warning in monorepo/worktree contexts
    root: __dirname,
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark-dimmed', // string name only — NOT an imported object (Turbopack serialization safe)
          keepBackground: false,
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
