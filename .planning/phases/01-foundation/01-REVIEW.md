---
phase: 01-foundation
reviewed: 2026-05-24T13:09:26Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - app/blog/[slug]/page.tsx
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - components/Footer.tsx
  - components/Navbar.tsx
  - content/blog/test-post.mdx
  - lib/utils.ts
  - mdx-components.tsx
  - next.config.mjs
  - tailwind.config.ts
  - tsconfig.json
  - eslint.config.mjs
  - .env.local.example
  - package.json
findings:
  critical: 3
  warning: 5
  info: 4
  total: 12
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-24T13:09:26Z
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

The Phase 1 walking skeleton wires up Next.js 16 + MDX + Tailwind CSS + Framer Motion. The infrastructure is broadly sound for a scaffold, but three blockers exist: the blog slug page ignores the `slug` param entirely (serving a hardcoded import regardless of the URL), the `params` prop type is wrong for Next.js 14+ App Router (must be a Promise), and `rehype-pretty-code`/`shiki` are declared as production dependencies but never wired into `next.config.mjs`, meaning they ship in the production bundle at zero benefit while increasing cold-start time. Additional warnings cover a missing `/blog` index route (Navbar link 404s), an unused `cn` utility, a `LazyMotion` placement that wraps server-rendered children unnecessarily, and an unresolved LinkedIn URL confirmed as a TODO. Info-level items cover the `lucide-react` production dependency that is never used in code, a stale comment citing a non-existent Next.js 16.2.6 docs URL, the `NEXT_PUBLIC_SITE_URL` env var being declared but never consumed, and a `clsx` direct production dependency made redundant by `tailwind-merge` including it as a peer.

---

## Critical Issues

### CR-01: Blog slug page ignores the `slug` param — any URL renders the same hardcoded MDX file

**File:** `app/blog/[slug]/page.tsx:1-13`
**Issue:** The component unconditionally imports `TestPost` from a hardcoded path and renders it regardless of `params.slug`. Any URL under `/blog/*` — including `/blog/nonexistent` — renders the test post instead of a 404 or the correct content. `generateStaticParams` only returns `['test-post']`, but because the component never consults `params.slug`, dynamic routing is completely bypassed. When Phase 3 adds real MDX files, this will silently serve the wrong content for every new slug.

**Fix:**
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

// Map slug → dynamic import; extend as posts are added
const postMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'test-post': () => import('@/content/blog/test-post.mdx'),
}

export function generateStaticParams() {
  return Object.keys(postMap).map((slug) => ({ slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loader = postMap[slug]
  if (!loader) notFound()
  const { default: Post } = await loader()
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Post />
    </article>
  )
}
```

---

### CR-02: `params` prop typed as a plain object — breaks in Next.js 14+ App Router

**File:** `app/blog/[slug]/page.tsx:7`
**Issue:** The component types `params` as `{ params: { slug: string } }`. Since Next.js 14 (and enforced from Next.js 15+), dynamic route params in the App Router are a `Promise<{ slug: string }>` that must be `await`-ed. The installed version is 16.2.6. Passing the synchronous shape compiles but TypeScript will not catch incorrect usage, and Next.js may log a warning or behave incorrectly at runtime depending on the rendering mode.

**Fix:**
```tsx
// Change the function signature to:
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

---

### CR-03: `rehype-pretty-code` and `shiki` bundled as production dependencies but never used

**File:** `package.json:22-23`, cross-reference `next.config.mjs:13-15`
**Issue:** `rehype-pretty-code` (`^0.14.3`) and `shiki` (`^4.1.0`) are listed under `dependencies` (not `devDependencies`). The comment in `next.config.mjs` explicitly states these are "added in Phase 3". Neither package is imported anywhere in the current codebase; `next.config.mjs` passes `options: {}` to `createMDX`. Shiki in particular is a large package (multiple MB of bundled language grammars). Including it in `dependencies` means it is installed in production on Vercel and can be pulled into the server bundle by indirect imports, increasing cold-start time and deployment size with no current benefit.

**Fix:** Move both entries to `devDependencies` until Phase 3 actually wires them in, or remove them entirely and re-add at that phase.
```json
"devDependencies": {
  "rehype-pretty-code": "^0.14.3",
  "shiki": "^4.1.0",
  ...
}
```

---

## Warnings

### WR-01: Navbar `/blog` link has no corresponding route — results in 404

**File:** `components/Navbar.tsx:24-29`, cross-reference `app/blog/` directory
**Issue:** The Navbar renders `<Link href="/blog">Blog</Link>`. There is no `app/blog/page.tsx` or `app/blog/route.ts` file — only `app/blog/[slug]/page.tsx` exists. Clicking "Blog" in the navbar navigates to `/blog` which Next.js will 404. This is a broken navigation link in the deployed product.

**Fix:** Create `app/blog/page.tsx` with at minimum a post listing (or a redirect to the first post as a temporary stub), or remove the Blog link from the Navbar until the index page ships.
```tsx
// app/blog/page.tsx (minimal stub)
export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="mt-4 text-text-muted">Posts coming soon.</p>
    </main>
  )
}
```

---

### WR-02: `cn` utility exported from `lib/utils.ts` but never imported anywhere in the codebase

**File:** `lib/utils.ts:5`
**Issue:** `cn` (the `clsx` + `twMerge` composition helper) is exported but no file in `app/` or `components/` imports or uses it. Dead exports in TypeScript are not flagged by the compiler, and the corresponding production dependencies (`clsx`, `tailwind-merge`) are also pulled in unnecessarily. This is a quality signal that the utility layer was scaffolded but never integrated.

**Fix:** Either consume `cn` inside Navbar/Footer/layout where class composition occurs, or leave it as scaffolding — but ensure `clsx` and `tailwind-merge` are not classified as production `dependencies` if the function is never called (move to `devDependencies` or remove).

---

### WR-03: `LazyMotion` wraps `{children}` (server-rendered content) in the root layout — structural misuse

**File:** `app/layout.tsx:56-59`
**Issue:** `LazyMotion` is a Framer Motion context provider that must be a Client Component subtree boundary. Placing it in the Server Component root layout means it wraps the entire page including the `<main>` tag and all child Server Components. This is a known structural problem: `LazyMotion` in a Server Component will force its entire subtree to be re-rendered client-side if any descendant is a Client Component, defeating the static-rendering goal stated in the project constraints. Additionally, the `strict` prop will cause a runtime throw for any child that uses `motion.*` instead of `m.*` — which is the default when developers add animations in Phase 2 without reading this constraint.

**Fix:** Move `LazyMotion` to a dedicated `'use client'` wrapper component that only wraps sections that actually need animation; do not wrap the root layout children.
```tsx
// components/MotionProvider.tsx
'use client'
import { LazyMotion, domAnimation } from 'framer-motion'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
```
Then use `<MotionProvider>` only around sections that animate, not around `{children}` in the root layout.

---

### WR-04: LinkedIn URL in Footer is unverified — shipped with a TODO comment

**File:** `components/Footer.tsx:32`
**Issue:** The comment `{/* TODO: confirm LinkedIn URL slug */}` immediately precedes the `<a href="https://linkedin.com/in/yashkadam">` link. The TODO is present in production-destined code. If the slug is wrong, the link silently points to a stranger's or a 404 LinkedIn profile, which is a credibility problem for a professional portfolio.

**Fix:** Verify the LinkedIn profile URL and remove the TODO comment before merging. If the URL is unknown at this time, remove the LinkedIn link from the rendered output entirely until confirmed.

---

### WR-05: `darkMode: ['class']` in Tailwind config but only `dark` class is force-added — Tailwind dark-mode utilities are non-functional without the class actually being toggled

**File:** `tailwind.config.ts:5`, cross-reference `app/layout.tsx:40-43`
**Issue:** `darkMode: ['class']` instructs Tailwind to scope `dark:` utilities to the presence of a `.dark` class on the `<html>` element. The FOUC-prevention script in the layout does `classList.add('dark')` permanently. This means `dark:` variants will always be active — but the CSS custom properties in `globals.css` (e.g., `--color-bg`) have no light-mode variant defined at all. The `darkMode: ['class']` selector strategy is wasted configuration; the site is hardcoded dark-only via the CSS vars. If someone later adds `dark:` Tailwind utilities expecting them to toggle with a theme switch, they will always be active regardless of user preference, leading to broken light mode. The comment in `globals.css` acknowledges a light mode is deferred to Phase 5, but the config choice now creates a latent correctness trap.

**Fix:** Until Phase 5 implements the toggle, either change `darkMode` to `'media'` (respects OS preference) or document clearly that `dark:` variants in this codebase mean "always on" — and audit every `dark:` utility added in Phases 2-4 to ensure they function correctly under this constraint.

---

## Info

### IN-01: `lucide-react` listed as a production dependency but never imported

**File:** `package.json:18`
**Issue:** `lucide-react` (`^1.16.0`) is in `dependencies`. The Footer comment states "lucide-react v1.x removed brand icons" as the reason for using inline SVGs instead. No file in `app/` or `components/` imports from `lucide-react`. It is an unused production dependency.

**Fix:** Remove `lucide-react` from `dependencies`. Re-add when/if standard UI icons (chevrons, close buttons, etc.) are needed in Phase 2+.

---

### IN-02: Comment in `app/layout.tsx` cites "Next.js 16.2.6 docs" — no such version exists at time of knowledge cutoff

**File:** `app/layout.tsx:1`
**Issue:** The comment reads `// Source: Next.js 16.2.6 docs + motion.dev + UI-SPEC (2026-05-24)`. The installed Next.js version is indeed pinned to `16.2.6` in `package.json`, but Next.js 16 is beyond the public release timeline known to this reviewer. The comment is likely generated by AI tooling and references a version number that was fabricated or projected. This creates confusion for any human reading it.

**Fix:** Update the comment to reference the actual installed version and real documentation URLs, or remove the version citation.

---

### IN-03: `NEXT_PUBLIC_SITE_URL` defined in `.env.local.example` but never consumed in code

**File:** `.env.local.example:1`
**Issue:** `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` is the only environment variable defined. Searching across `app/`, `components/`, and `lib/` finds no reference to `process.env.NEXT_PUBLIC_SITE_URL`. The variable is declared as part of the project contract but has no consumer yet.

**Fix:** Either consume it in the `metadata` export (e.g., for `metadataBase`) or document in `.env.local.example` which Phase will use it. Low priority but prevents new developers from wondering whether it is required.

---

### IN-04: `clsx` is a direct production dependency that is fully subsumed by `tailwind-merge`

**File:** `package.json` (implicit via `lib/utils.ts:2`)
**Issue:** `clsx` is listed as a direct `dependency` and is imported in `lib/utils.ts`. `tailwind-merge` (also a `dependency`) already re-exports and uses `clsx` internally, and the `cn` utility wraps both. Since `cn` is currently unused (see WR-02), both `clsx` and `tailwind-merge` are dead weight in production. This is low severity but adds unnecessary install surface.

**Fix:** Address by resolving WR-02 (actually using `cn`). If `cn` ships as intended, no change is needed — both packages are justified. If the utility remains unused, both should be moved out of production `dependencies`.

---

_Reviewed: 2026-05-24T13:09:26Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
