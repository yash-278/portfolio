---
phase: 01-foundation
plan: 04
subsystem: smoke-test
tags: [mdx, vercel, e2e, verification]
key-files:
  created:
    - content/blog/test-post.mdx
    - app/blog/[slug]/page.tsx
  modified:
    - app/layout.tsx
metrics:
  duration: "~20 min"
  tasks_completed: 2
  commits: 3
---

# Plan 01-04 Summary — E2E Smoke Test + Vercel Env Vars

## What Was Built

**Task 1 — MDX smoke-test route**
- Created `content/blog/test-post.mdx` — minimal MDX file with H1 heading and TypeScript code block
- Created `app/blog/[slug]/page.tsx` — static-params blog route that imports and renders the MDX file
- `npx next build` exits 0 with `/blog/test-post` listed as SSG route

**Task 2 — Vercel env var + all 5 criteria verified (human checkpoint)**
- `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` set in Vercel project env vars
- All 5 Phase 1 success criteria confirmed by user

## Commits

| Commit | Description |
|--------|-------------|
| `417fbba` | feat(01-04): MDX smoke-test route — /blog/test-post statically generated |
| `1152ca2` | fix(01-04): remove frontmatter from smoke-test MDX, add suppressHydrationWarning for FOUC script |

## Deviations

1. **YAML frontmatter rendered as raw text** — `@next/mdx` does not strip frontmatter without `remark-frontmatter`. Removed frontmatter from smoke-test file. `remark-frontmatter` + gray-matter integration deferred to Phase 3 (blog rendering).
2. **Hydration warning on `<html>`** — the FOUC inline script mutates `className` before React hydrates, triggering a benign className mismatch. Fixed by adding `suppressHydrationWarning` to `<html>` in `app/layout.tsx`. This is the standard pattern for inline dark-mode scripts.

## Phase 1 Success Criteria — Final Verification

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `npx next build` exits 0, zero TypeScript errors, Next.js 16.2.6 | ✓ Verified |
| 2 | No FOUC — dark theme present from first frame in dark-OS browser | ✓ Verified |
| 3 | `mdx-components.tsx` at root + `/blog/test-post` renders HTML (not raw markdown) | ✓ Verified |
| 4 | Zero `import { motion` in app/ or components/ | ✓ Verified |
| 5 | Navbar + Footer on all routes; `NEXT_PUBLIC_SITE_URL` set in Vercel | ✓ Verified |

## Self-Check: PASSED
