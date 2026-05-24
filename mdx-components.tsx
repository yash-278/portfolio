// Source: nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file
// Required by @next/mdx for the App Router. Must be at project root (same level as app/).
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
