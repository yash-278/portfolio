---
phase: 03-blog-infrastructure
reviewed: 2026-05-25T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - lib/posts.ts
  - app/blog/layout.tsx
  - next.config.mjs
  - tailwind.config.ts
  - content/blog/test-post.mdx
  - content/blog/building-nekomori.mdx
  - app/blog/page.tsx
  - app/blog/[slug]/page.tsx
findings:
  critical: 0
  warning: 4
  info: 2
  total: 6
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-25T00:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the full blog infrastructure: the post-listing utility (`lib/posts.ts`), the blog list page, the dynamic slug page, the MDX layout, Next.js config, Tailwind config, and the two MDX content files. The implementation is structurally sound — static generation, `dynamicParams = false`, MDX pipeline, and typography rendering are all correctly wired. Four warnings require attention before this ships; two informational items are noted below.

The most user-visible defect is the date display bug: date-only frontmatter strings (e.g. `"2026-05-20"`) are parsed as UTC midnight and formatted in the visitor's local timezone, causing the wrong date to be shown for any visitor west of UTC. The two filesystem calls in `lib/posts.ts` that lack error handling will crash the build if `content/blog` is missing, and the missing frontmatter validation silently produces `undefined` values in the `PostMeta` struct.

---

## Warnings

### WR-01: Date-only strings display wrong day for timezones west of UTC

**File:** `app/blog/page.tsx:16`
**Issue:** `new Date(isoDate)` called with a date-only string (e.g. `"2026-05-20"`) parses per the ECMA-262 spec as UTC midnight (`2026-05-20T00:00:00.000Z`). `Intl.DateTimeFormat` without an explicit `timeZone` option then renders the date in the visitor's local timezone. On any timezone with a negative UTC offset (US/Eastern = UTC-4, US/Pacific = UTC-7, etc.) this shifts the time to the previous day, displaying `May 19, 2026` instead of `May 20, 2026`. Confirmed via Node.js:

```
TZ=America/New_York node -e "console.log(new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',day:'numeric'}).format(new Date('2026-05-20')))"
// => May 19, 2026
```

This affects every post date on the blog index page.

**Fix:** Force UTC rendering by passing `timeZone: 'UTC'` to the formatter:
```typescript
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',  // date-only strings are UTC midnight; force display in UTC
  }).format(new Date(isoDate))
}
```

---

### WR-02: `getAllPosts` crashes the build if `content/blog` directory is missing

**File:** `lib/posts.ts:18`
**Issue:** `fs.readdirSync(BLOG_DIR)` throws `ENOENT` if the `content/blog` directory does not exist. This will crash `next build` with an uninformative Node.js exception rather than a clear error. In CI or a fresh clone where the directory has not yet been created, this produces a confusing failure.

**Fix:** Guard the directory read:
```typescript
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  // ... rest of function
}
```

---

### WR-03: Missing frontmatter validation — `undefined` silently poisons `PostMeta`

**File:** `lib/posts.ts:33-36`
**Issue:** Required frontmatter fields (`title`, `date`, `description`) are cast directly with `as string` without checking if they exist. If a post is missing a required field (author forgets `title:` in a draft), the returned object has `title: undefined` typed as `string`. This breaks rendering in `app/blog/page.tsx` (the title renders as empty and the sort at line 42 produces `NaN`, causing non-deterministic ordering) without any error at build time.

The `date` field is especially risky: `new Date(undefined).getTime()` returns `NaN`, and `NaN - NaN === 0`, so sorting produces a random stable order silently.

**Fix:** Validate required fields and skip malformed posts:
```typescript
const requiredFields = ['title', 'date', 'description'] as const
const missing = requiredFields.filter((f) => !data[f])
if (missing.length > 0) {
  console.warn(`Skipping ${filename}: missing frontmatter fields: ${missing.join(', ')}`)
  return null
}
```
Add this check after line 27 (the `published` guard), before building the return object.

---

### WR-04: `matter(raw)` parsed twice for every post

**File:** `lib/posts.ts:24,30`
**Issue:** `matter(raw)` is called once on line 24 to extract `data`, then called again on line 30 (`matter(raw).content`) to get the body for reading-time calculation. Every post file is parsed twice by gray-matter. This is wasteful and introduces a subtle inconsistency risk: if gray-matter's output were ever non-deterministic, the two calls could diverge.

**Fix:** Destructure both `data` and `content` from the single parse on line 24:
```typescript
const { data, content } = matter(raw)
// ...
if (!data.published) return null

const { text } = readingTime(content)
```

---

## Info

### IN-01: `React` is referenced as a type namespace without an import

**File:** `app/blog/[slug]/page.tsx:38`
**Issue:** `React.ComponentType<any>` is used as a type on line 38 but there is no `import React from 'react'` or `import type React from 'react'`. This works because Next.js 16 / React 19 with `jsx: "react-jsx"` in tsconfig.json provides automatic JSX transform, and `React` types are in scope globally via `@types/react`. However, the explicit namespace reference (`React.ComponentType`) is an implicit dependency on the ambient global type being present, which could break if tsconfig or type definitions change. Using an explicit type import is more robust.

**Fix:**
```typescript
import type { ComponentType } from 'react'
// ...
let Post: ComponentType<any>
```

---

### IN-02: `test-post.mdx` is `published: false` — intentional smoke-test file committed to main

**File:** `content/blog/test-post.mdx`
**Issue:** The file is correctly guarded by `published: false` and will not appear in the blog listing. However, committing a file whose title is literally "Test Post" with description "Smoke test for MDX pipeline" sets a precedent of test artifacts in the content directory. If the `published` guard is ever accidentally changed to `true`, or if the listing logic changes, a "Test Post" entry appears live on yashkadam.com.

**Fix:** Either delete the file once the MDX pipeline is confirmed working, or rename it to `_smoke-test.mdx` (the leading underscore signals it is not real content, while `.mdx` keeps it parseable).

---

_Reviewed: 2026-05-25T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
