---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [next.js, typescript, tailwindcss, framer-motion, mdx, scaffold]

# Dependency graph
requires: []
provides:
  - "Next.js 16.2.6 scaffold at repo root (branch worktree-agent-a31fc56e57c306a4a for PR to feat/next16-foundation)"
  - "All Phase 1 production and dev dependencies installed (package.json + node_modules)"
  - "tailwind.config.ts with darkMode class strategy and CSS var color/font token mappings"
  - "app/layout.tsx: Inter + JetBrains Mono fonts, FOUC prevention script, LazyMotion wrapper, Navbar, Footer"
  - "components/Navbar.tsx + components/Footer.tsx shells (D-06, D-07)"
  - "lib/utils.ts: cn() utility (clsx + tailwind-merge)"
  - "mdx-components.tsx at project root (required by @next/mdx App Router)"
  - "app/globals.css: dark-only CSS custom properties (8 color tokens)"
  - "next.config.mjs: MDX pipeline stub (rehype-pretty-code wired in 01-02)"
  - "content/blog/ directory created"
  - ".env.local.example documenting NEXT_PUBLIC_SITE_URL"
affects: [01-02, 01-03, 01-04, phase-2, phase-3, phase-4, phase-5]

# Tech tracking
tech-stack:
  added:
    - "next@16.2.6"
    - "react@19.2.4 + react-dom@19.2.4"
    - "typescript@^5"
    - "tailwindcss@^3.4.19 (v3, not v4)"
    - "framer-motion@^12.40.0"
    - "lucide-react@^1.16.0"
    - "clsx@^2.1.1 + tailwind-merge@^3.6.0"
    - "@next/mdx@^16.2.6 + @mdx-js/loader + @mdx-js/react + @types/mdx"
    - "rehype-pretty-code@^0.14.3 + shiki@^4.1.0"
    - "prettier@^3.8.3 + prettier-plugin-tailwindcss@^0.8.0"
    - "autoprefixer@^10.5.0 + postcss@^8.5.15"
  patterns:
    - "App Router (app/) — no pages/ directory"
    - "LazyMotion + domAnimation in root layout (reduces animation bundle ~34kb → ~4.6kb)"
    - "Inline FOUC prevention script as first child of <head> using dangerouslySetInnerHTML"
    - "Inter + JetBrains Mono via next/font/google with CSS variable names --font-sans, --font-mono"
    - "CSS custom properties in :root for design tokens (dark-only in Phase 1)"
    - "cn() utility (clsx + tailwind-merge) for conditional class merging"

key-files:
  created:
    - "app/layout.tsx — root layout with fonts, FOUC script, LazyMotion, Navbar, Footer"
    - "app/page.tsx — Phase 1 placeholder home page"
    - "app/globals.css — dark-only CSS token layer"
    - "components/Navbar.tsx — fixed top nav with Home + Blog links"
    - "components/Footer.tsx — footer with social icons (inline SVG for brand icons)"
    - "lib/utils.ts — cn() utility"
    - "mdx-components.tsx — required by @next/mdx App Router"
    - "next.config.mjs — ESM MDX pipeline config"
    - "tailwind.config.ts — TypeScript Tailwind config with dark mode + design tokens"
    - "postcss.config.mjs — PostCSS with tailwindcss + autoprefixer"
    - "tsconfig.json — @/* path alias, strict: true"
    - "eslint.config.mjs — Next.js ESLint config"
    - ".env.local.example — documents NEXT_PUBLIC_SITE_URL"
    - "content/blog/ — empty directory for future MDX posts"
  modified:
    - "package.json — replaced old vanilla portfolio package.json with Next.js scaffold"
    - "package-lock.json — updated lockfile"
    - ".gitignore — added !.env.local.example exception to env* rule"
    - "tailwind.config.js — deleted (replaced by tailwind.config.ts)"

key-decisions:
  - "Removed Tailwind v4 scaffolded by create-next-app@16.2.6 and pinned to ^3.4.19 per FOUND-01 and RESEARCH.md Pitfall 5"
  - "Used inline SVG brand icons in Footer — lucide-react v1.x removed Github/LinkedIn/Twitter brand icons (breaking change from v0.x)"
  - "next.config.mjs ships without rehype-pretty-code plugin in Plan 01-01 — Turbopack serialization constraint means rehype plugin wiring is Plan 01-02 responsibility"
  - "turbopack.root set to __dirname in next.config.mjs to silence workspace root detection warning from parent repo lockfile"

patterns-established:
  - "Pattern: LazyMotion wrapper in root layout — all animated leaf components import { m } from 'framer-motion', never motion.*"
  - "Pattern: FOUC prevention — dangerouslySetInnerHTML script as first child of <head>, no defer/async"
  - "Pattern: Font CSS variables --font-sans, --font-mono — token names are stable, values change in Phase 2 design pass"
  - "Pattern: ESM config files (.mjs) — next.config.mjs and postcss.config.mjs"

requirements-completed: [FOUND-01]

# Metrics
duration: 40min
completed: 2026-05-24
---

# Phase 1 Plan 01: Next.js 16.2.6 Scaffold + All Dependencies Summary

**Fresh Next.js 16.2.6 scaffold with Tailwind v3, framer-motion LazyMotion wrapper, MDX pipeline deps, and layout shell (Navbar + Footer) — `next build` exits 0 with zero TypeScript errors**

## Performance

- **Duration:** ~40 min
- **Started:** 2026-05-24T12:00:00Z (approx)
- **Completed:** 2026-05-24T12:38:59Z
- **Tasks:** 2 (Task 1: human-verify checkpoint [done], Task 2: scaffold + install)
- **Files modified:** 24 files changed (8431 insertions, 3175 deletions)

## Accomplishments

- Scaffolded fresh Next.js 16.2.6 app from `create-next-app@16.2.6`, moved to repo root
- Replaced scaffolded Tailwind v4 with v3.4.19 (per FOUND-01 constraint and RESEARCH.md Pitfall 5 pre-warning)
- Installed all production and dev deps including framer-motion, @next/mdx, rehype-pretty-code, shiki, prettier
- Built root layout shell with Inter + JetBrains Mono fonts, dark FOUC prevention script, LazyMotion wrapper, Navbar, Footer
- `next build` exits 0 with zero TypeScript errors, all pages static-generated

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify packages (checkpoint:human-verify)** — human confirmed "packages verified" (no commit)
2. **Task 2: Scaffold + install all dependencies** — `49b885d` (feat)

**Plan metadata:** (committed below as SUMMARY commit)

## Files Created/Modified

- `package.json` — Next.js 16.2.6 scaffold with all deps; replaced old vanilla portfolio package.json
- `package-lock.json` — updated lockfile
- `app/layout.tsx` — root layout: Inter + JetBrains Mono fonts, FOUC script, LazyMotion, Navbar, Footer
- `app/page.tsx` — Phase 1 placeholder (portfolio sections in Phase 2)
- `app/globals.css` — dark-only CSS custom properties (8 color tokens: bg, surface, text, text-muted, border, accent, accent-hover, destructive)
- `components/Navbar.tsx` — fixed top nav with logo + Home/Blog links
- `components/Footer.tsx` — footer with name, copyright, social icons (inline SVG: GitHub/LinkedIn/Twitter)
- `lib/utils.ts` — cn() utility (clsx + tailwind-merge)
- `mdx-components.tsx` — required by @next/mdx for App Router
- `next.config.mjs` — MDX pipeline (rehype-pretty-code added in Plan 01-02)
- `tailwind.config.ts` — darkMode: ['class'], CSS var color/font token mappings
- `postcss.config.mjs` — tailwindcss + autoprefixer
- `tsconfig.json` — @/* path alias, strict: true
- `eslint.config.mjs` — Next.js ESLint config
- `.env.local.example` — documents NEXT_PUBLIC_SITE_URL=https://yashkadam.com
- `.gitignore` — added !.env.local.example exception
- `content/blog/` — empty directory for future MDX posts
- `tailwind.config.js` — deleted (replaced by TypeScript version)

## Decisions Made

1. **Tailwind v3 downgrade:** `create-next-app@16.2.6` scaffolds Tailwind v4 by default. Downgraded to `^3.4.19` per FOUND-01 (project requires v3) and RESEARCH.md Pitfall 5 (v4 has incompatible config format).

2. **Inline SVG for brand icons:** `lucide-react` v1.x removed all brand icons (Github, LinkedIn, Twitter). Used minimal inline SVG components in Footer instead of adding a separate icon package. The SVG paths are standard/well-known and match the D-07 social icon requirement.

3. **No rehype-pretty-code in Plan 01-01:** The MDX loader with `rehype-pretty-code` causes Turbopack serialization failure when `process.env.TURBOPACK` is set (which Next.js 16 sets for `next build`). Plan 01-02 owns the `next.config.mjs` MDX pipeline wiring. Plan 01-01 ships a valid but minimal `createMDX({})` config that builds cleanly.

4. **turbopack.root:** Set to `__dirname` in `next.config.mjs` to silence the "multiple lockfiles detected" workspace root warning caused by the parent repo's `package-lock.json` at `Portfolio/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tailwind v4 installed by scaffold — downgraded to v3**
- **Found during:** Task 2 (scaffold verification)
- **Issue:** `create-next-app@16.2.6` installed Tailwind v4 (`^4`) despite project constraint FOUND-01 requiring v3. `tailwind.config.ts` was absent; CSS used `@import "tailwindcss"` (v4 format).
- **Fix:** Ran `npm uninstall tailwindcss @tailwindcss/postcss`, then `npm install -D tailwindcss@"^3.4" postcss autoprefixer`. Ran `npx tailwindcss init -p` to generate v3 config files, then created proper `tailwind.config.ts` (TypeScript).
- **Files modified:** `package.json`, `package-lock.json`, `tailwind.config.ts` (new), `postcss.config.mjs` (replaced)
- **Verification:** `node -e "console.log(require('./node_modules/tailwindcss/package.json').version)"` outputs `3.4.19`
- **Committed in:** 49b885d (Task 2 commit)

**2. [Rule 1 - Bug] lucide-react v1.x has no Github/LinkedIn/Twitter brand icons**
- **Found during:** Task 2 (`npx tsc --noEmit` revealed TS2305 errors)
- **Issue:** TypeScript errors: `Module '"lucide-react"' has no exported member 'Github'/'Linkedin'/'Twitter'`. `lucide-react` removed all brand icons in v1.0 (breaking change from v0.x).
- **Fix:** Replaced icon imports with inline SVG elements in `Footer.tsx`. Used standard SVG paths for GitHub (Octicon), LinkedIn, and Twitter(X) logos.
- **Files modified:** `components/Footer.tsx`
- **Verification:** `npx tsc --noEmit` exits 0 with zero TypeScript errors
- **Committed in:** 49b885d (Task 2 commit)

**3. [Rule 3 - Blocking] rehype-pretty-code in next.config.mjs caused Turbopack build failure**
- **Found during:** Task 2 (`next build` verification)
- **Issue:** `next build` failed: "loader ... does not have serializable options. Ensure that options passed are plain JavaScript objects." When `process.env.TURBOPACK` is set (Next.js 16 default for `next build`), `@next/mdx` creates Turbopack rules — but `rehype-pretty-code` as a loader function is non-serializable even with a string theme.
- **Fix:** Removed `rehype-pretty-code` from `next.config.mjs`. This is deferred to Plan 01-02 which owns the full MDX pipeline wiring.
- **Files modified:** `next.config.mjs`
- **Verification:** `next build` exits 0
- **Committed in:** 49b885d (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 1 bugs, 1 Rule 3 blocking)
**Impact on plan:** All fixes necessary for correct operation. The rehype-pretty-code deferral is consistent with the plan's file ownership (Plan 01-02 owns `next.config.mjs`). No scope creep.

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| Home page placeholder text "Coming soon — Phase 2" | `app/page.tsx` | 4 | Intentional — portfolio sections (Hero, About, Projects, Contact) are Phase 2 scope |
| LinkedIn URL `linkedin.com/in/yashkadam` | `components/Footer.tsx` | 15 | RESEARCH.md Open Question 2 — exact LinkedIn slug unconfirmed; TODO comment present |

## Issues Encountered

- Turbopack's workspace root detection triggered a warning because the git worktree sits inside `Portfolio/` which has its own `package-lock.json`. Resolved by setting `turbopack.root: __dirname` in `next.config.mjs`.

## User Setup Required

None required for Plan 01. `NEXT_PUBLIC_SITE_URL` is documented in `.env.local.example` but its Vercel configuration is Plan 04's responsibility (FOUND-06).

## Next Phase Readiness

- Plan 01-02 can now wire the full `next.config.mjs` MDX pipeline (rehype-pretty-code), complete `tailwind.config.ts`, and build the layout shell (Navbar/Footer final wiring with LazyMotion)
- Branch `worktree-agent-a31fc56e57c306a4a` is the working branch; orchestrator will PR to `feat/next16-foundation` or merge to main after Phase 1 success criteria pass
- The `app/page.tsx` "Coming soon" stub should remain through Phase 1 — it is replaced by Phase 2 portfolio sections
- LinkedIn URL stub (`TODO` comment in Footer.tsx line 5) needs confirmation before PR merge

---
*Phase: 01-foundation*
*Completed: 2026-05-24*
