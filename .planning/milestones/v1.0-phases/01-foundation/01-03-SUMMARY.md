---
phase: 01-foundation
plan: 03
subsystem: ui/layout
tags: [next.js, layout, navbar, footer, fouc, framer-motion, accessibility]

# Dependency graph
requires:
  - "01-01: Next.js scaffold, all deps installed, app/layout.tsx shell created"
  - "01-02: globals.css @layer base tokens, next.config.mjs MDX pipeline"
provides:
  - "app/layout.tsx: FOUC script (first head child), Inter+JetBrains Mono fonts, LazyMotion strict wrapper, Navbar + Footer imports, skip link"
  - "components/Navbar.tsx: fixed top nav, aria-label=Main navigation, Home + Blog links, hover:text-accent, bg-surface"
  - "components/Footer.tsx: Yash Kadam name + copyright, 3 social icons, noopener noreferrer, min-h-11 min-w-11 touch targets, bg-surface"
  - "app/page.tsx: minimal Phase 1 placeholder, no use client, no imports"
affects: [01-04, phase-2, phase-3, phase-4, phase-5]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline SVG for social brand icons — lucide-react v1.x removed brand icons (Github/LinkedIn/Twitter)"
    - "FOUC prevention: dangerouslySetInnerHTML script as first child of <head>, no defer/async"
    - "LazyMotion strict wraps <main> only — Navbar/Footer render outside animation boundary"
    - "Server Components for both Navbar and Footer — no 'use client', no motion.* imports"
    - "WCAG 2.5.5 touch targets: min-h-11 min-w-11 (44px) on social icon anchors"

key-files:
  created: []
  modified:
    - "app/page.tsx — simplified to minimal <div className='min-h-screen' /> placeholder"
    - "components/Navbar.tsx — corrected bg-surface, hover:text-accent, focus-visible outline pattern, removed ul/li wrapper"
    - "components/Footer.tsx — corrected bg-surface, exact aria-labels per plan, min-h-11 min-w-11 touch targets, Yash Kadam name + copyright structure, hover:text-accent"

key-decisions:
  - "app/layout.tsx was already fully correct from Wave 1 (01-01) — zero changes required"
  - "Inline SVG retained for brand icons; lucide-react v1.x still lacks Github/LinkedIn/Twitter (confirmed Wave 1 finding)"
  - "LinkedIn URL kept as linkedin.com/in/yashkadam with TODO comment — unconfirmed per RESEARCH.md Open Question 2"
  - "Footer uses static year '2025' per plan spec rather than dynamic new Date().getFullYear()"

# Metrics
duration: 15min
completed: 2026-05-24
---

# Phase 1 Plan 03: Layout Shell, Navbar, Footer, FOUC Script Summary

**Root layout with synchronous FOUC prevention script, LazyMotion strict wrapper, and Server Component Navbar + Footer with inline SVG social icons and WCAG touch targets — next build exits 0**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-24 (wave 3 parallel execution)
- **Completed:** 2026-05-24T12:56:16Z
- **Tasks:** 2 (Task 1: layout + page.tsx, Task 2: Navbar + Footer)
- **Files modified:** 3 (`app/page.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`)

## Accomplishments

- Confirmed `app/layout.tsx` was already fully correct from Wave 1 (dangerouslySetInnerHTML FOUC script, LazyMotion strict wrapper, Inter + JetBrains Mono fonts, skip link, body token classes) — zero changes needed
- Simplified `app/page.tsx` to exact minimal placeholder spec (`<div className="min-h-screen" />`)
- Fixed `components/Navbar.tsx`: corrected `bg-surface` (was `bg-bg/80`), corrected `hover:text-accent` on nav links, corrected `focus-visible:outline-2` pattern per UI-SPEC, removed `ul`/`li` wrapper in favor of plain `div` per plan spec
- Fixed `components/Footer.tsx`: corrected `bg-surface` (was `bg-bg`), added "Yash Kadam" name above copyright, corrected aria-label values to "GitHub profile"/"LinkedIn profile"/"X (Twitter) profile", added `min-h-11 min-w-11` WCAG touch targets, fixed `hover:text-accent` (was `hover:text-text`), corrected `focus-visible:outline-2` pattern
- Confirmed `next build` exits 0 with zero TypeScript errors — all pages static-generated

## Task Commits

1. **Task 1: minimal Phase 1 home page stub** — `b07a57c`
2. **Task 2: Navbar and Footer Server Components** — `0ee0c36`

## Files Created/Modified

- `app/page.tsx` — simplified to `<div className="min-h-screen" />` per plan spec; no use client, no imports
- `components/Navbar.tsx` — corrected bg-surface, hover:text-accent, focus-visible outline pattern, aria-label="Main navigation" preserved
- `components/Footer.tsx` — corrected bg-surface, "Yash Kadam" name + copyright structure, exact aria-labels, min-h-11 min-w-11 touch targets, noopener noreferrer on all 3 social links

## Decisions Made

1. **layout.tsx unchanged:** Wave 1 executor built it correctly to spec — dangerouslySetInnerHTML FOUC script as first head child, LazyMotion with features={domAnimation} strict, Inter + JetBrains Mono via next/font/google, skip link, proper body classes.

2. **Inline SVG retained:** lucide-react v1.x confirmed to still lack brand icon exports (Github, LinkedIn, Twitter). Inline SVG is the correct long-term approach for brand icons unless a separate icon package is added.

3. **Static year "2025":** Footer uses static string per plan spec rather than `new Date().getFullYear()`. This avoids server/client hydration mismatch with a static Server Component.

4. **LinkedIn URL stub preserved:** `linkedin.com/in/yashkadam` with `{/* TODO: confirm LinkedIn URL slug */}` per RESEARCH.md Open Question 2. This is an intentional stub pending confirmation before Phase 1 PR merge.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Wave 1 Navbar used bg-bg/80 instead of bg-surface**
- **Found during:** Task 2 (audit against UI-SPEC acceptance criteria)
- **Issue:** Wave 1 set header `bg-bg/80 backdrop-blur-sm` (transparent bg overlay) where plan requires `bg-surface` (solid `#111111`). Also nav links used `hover:text-text` instead of `hover:text-accent`.
- **Fix:** Changed header className to `bg-surface`, nav link hover to `hover:text-accent`, focus pattern to `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`.
- **Files modified:** `components/Navbar.tsx`
- **Commit:** `0ee0c36`

**2. [Rule 1 - Bug] Wave 1 Footer missing multiple acceptance criteria**
- **Found during:** Task 2 (audit against plan acceptance criteria)
- **Issues found:**
  - `bg-bg` instead of `bg-surface`
  - No "Yash Kadam" name (only copyright line)
  - aria-label values were "GitHub", "LinkedIn", "Twitter (X)" — plan requires "GitHub profile", "LinkedIn profile", "X (Twitter) profile"
  - Missing `min-h-11 min-w-11` WCAG 2.5.5 touch targets (44px)
  - `hover:text-text` instead of `hover:text-accent` on social icons
  - Dynamic `new Date().getFullYear()` — plan requires static "2025"
- **Fix:** Rewrote Footer with corrected structure matching plan spec exactly.
- **Files modified:** `components/Footer.tsx`
- **Commit:** `0ee0c36`

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| LinkedIn URL `linkedin.com/in/yashkadam` | `components/Footer.tsx` | RESEARCH.md Open Question 2 — exact slug unconfirmed; TODO comment present; intentional per plan |
| TODO Phase 2 active link state | `components/Navbar.tsx` | Deferred to Phase 2 — requires `usePathname()` Client Component; intentional per plan |

## Threat Flags

None. All external URLs introduced in Footer are properly mitigated per threat model T-03-02:
- All 3 social links have `target="_blank" rel="noopener noreferrer"` — tab-napping prevented
- FOUC script uses static hardcoded string — no user input, no XSS risk (T-03-01: accepted)

## Self-Check

**Created files exist:**
- `app/page.tsx` — FOUND
- `components/Navbar.tsx` — FOUND
- `components/Footer.tsx` — FOUND
- `app/layout.tsx` — FOUND (unchanged, correct from Wave 1)

**Commits exist:**
- `b07a57c` (Task 1) — FOUND
- `0ee0c36` (Task 2) — FOUND

**next build exits 0:** CONFIRMED

## Self-Check: PASSED
