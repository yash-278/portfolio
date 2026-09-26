import createMDX from '@next/mdx'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // REQUIRED: pin the workspace root to this repo. A stray ~/package-lock.json makes
  // Next infer /Users/yash as the root, and the dev server then watches the entire
  // home directory; that once used ~40 GB of memory and crashed the machine.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-frontmatter',
    ],
    rehypePlugins: [
      ['rehype-pretty-code', { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
