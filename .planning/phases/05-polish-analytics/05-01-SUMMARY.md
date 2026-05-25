---
phase: 05-polish-analytics
plan: "01"
subsystem: analytics
tags: [analytics, vercel, dead-links, projects]
dependency_graph:
  requires: []
  provides: [vercel-analytics-wired, speed-insights-wired, brew-index-dead-link-removed]
  affects: [app/layout.tsx, components/ProjectsSection.tsx]
tech_stack:
  added: []
  patterns: [vercel-analytics-server-component, optional-field-conditional-render]
key_files:
  created: []
  modified:
    - app/layout.tsx
    - components/ProjectsSection.tsx
decisions:
  - "Analytics and SpeedInsights placed after Footer, outside LazyMotion boundary, to preserve Server Component compatibility"
  - "Brew Index github field removed entirely (not set to empty string) to use optional interface field pattern"
metrics:
  duration: "~10 minutes"
  completed: "2026-05-25T15:04:18Z"
---

# Phase 5 Plan 1: Analytics + Dead Link Fix Summary

**One-liner:** Cookieless Vercel Analytics and Speed Insights injected into the Server Component root layout via two imports; dead brew-index GitHub 404 link removed with optional-field conditional render guard.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add Analytics and SpeedInsights to root layout | f18e938 | app/layout.tsx |
| 2 | Fix brew-index dead link in ProjectsSection | f67add7 | components/ProjectsSection.tsx |

## What Was Built

### Task 1: Vercel Analytics + Speed Insights

Added two import statements and two self-closing JSX components to `app/layout.tsx`:

- `import { Analytics } from '@vercel/analytics/next'`
- `import { SpeedInsights } from '@vercel/speed-insights/next'`
- Both `<Analytics />` and `<SpeedInsights />` placed after `<Footer />`, before the closing `</body>` tag
- Placement is outside the `LazyMotion` boundary (which wraps only `<main>`)
- Root layout remains a Server Component — no `'use client'` directive added

### Task 2: Dead Link Removal

Applied three coordinated changes to `components/ProjectsSection.tsx`:

1. Added a typed `Project` interface with `github?: string` (optional field)
2. Removed the `github` field from the Brew Index entry (the URL returned HTTP 404)
3. Wrapped the GitHub anchor tag in `{project.github && (...)}` conditional render guard

The Nekomori card continues to display "GitHub →" pointing to `https://github.com/yash-278/nekomori`. The Brew Index card renders with no GitHub link.

## Verification Results

- `npx tsc --noEmit` — exits 0 (no TypeScript errors)
- `npx next build` — exits 0, `/` generates as static (SSG)
- No `'use client'` directive in `app/layout.tsx` (comment noting the rule is not a directive)
- `brew-index` string absent from `components/ProjectsSection.tsx` (grep count: 0)
- `https://github.com/yash-278/nekomori` Nekomori link remains intact

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. Both changes are fully wired: Analytics and SpeedInsights inject real Vercel tracking scripts; the conditional render is driven by actual data (missing `github` field on Brew Index entry).

## Threat Flags

None. No new network endpoints, auth paths, or schema changes introduced beyond what was already specified in the plan's threat model (T-05-01, T-05-02 accepted; T-05-SC pre-verified).

## Self-Check: PASSED

- app/layout.tsx — FOUND
- components/ProjectsSection.tsx — FOUND
- 05-01-SUMMARY.md — FOUND
- Commit f18e938 (Task 1) — FOUND
- Commit f67add7 (Task 2) — FOUND
