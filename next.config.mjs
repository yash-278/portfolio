import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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
