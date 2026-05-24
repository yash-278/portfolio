---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [next.js, mdx, tailwindcss, design-tokens, configuration]

# Dependency graph
requires:
  - "01-01: Next.js 16.2.6 scaffold with @next/mdx, rehype-pretty-code, clsx, tailwind-merge installed"
provides:
  - "next.config.mjs: full MDX pipeline with rehype-pretty-code wired (Turbopack-safe string theme)"
  - "app/globals.css: all 8 color tokens + 2 font tokens under @layer base :root"
  - "tailwind.config.ts: darkMode class + all 8 CSS var color tokens + 2 font tokens (already from 01-01)"
  - "lib/utils.ts: cn() utility (already complete from 01-01)"
  - "mdx-components.tsx: useMDXComponents stub at project root (already complete from 01-01)"
  - "tsconfig.json: @/* alias + strict: true + moduleResolution bundler (already complete from 01-01)"
affects: [01-03, 01-04, phase-2, phase-3, phase-4, phase-5]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "rehype-pretty-code wired via createMDX options.rehypePlugins with string theme (Turbopack-safe)"
    - "CSS custom properties in @layer base :root — Tailwind cascade ordering ensured"
    - "Font fallback stacks via --font-sans/--font-mono CSS vars in globals.css"

key-files:
  created: []
  modified:
    - "next.config.mjs — added rehypePrettyCode to createMDX rehypePlugins; retained mdxRs: false + turbopack.root"
    - "app/globals.css — wrapped :root in @layer base; added --font-sans and --font-mono token declarations"

key-decisions:
  - "Retained turbopack.root: __dirname in next.config.mjs (from 01-01 deviation fix) — silences workspace root warning"
  - "globals.css uses @layer base wrapper for correct Tailwind cascade ordering (pattern from PATTERNS.md)"
  - "tailwind.config.ts, lib/utils.ts, mdx-components.tsx, tsconfig.json already correct from 01-01 — no changes needed"
  - "Font tokens in globals.css serve as fallbacks; actual fonts loaded via next/font/google CSS vars in layout.tsx"

patterns-established:
  - "Pattern: rehype-pretty-code uses string theme name 'github-dark-dimmed' — never import theme objects"
  - "Pattern: CSS tokens in @layer base :root — ensures Tailwind reset does not override custom properties"

requirements-completed: [FOUND-04]

# Metrics
duration: 15min
completed: 2026-05-24
---

# Phase 1 Plan 02: Configuration Layer Summary

**MDX pipeline fully wired with rehype-pretty-code (Turbopack-safe), all 10 design tokens declared in globals.css under @layer base, and config layer confirmed complete**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-24 (wave 2 parallel execution)
- **Completed:** 2026-05-24
- **Tasks:** 2 (Task 1: next.config.mjs, Task 2: multi-file config layer)
- **Files modified:** 2 (`next.config.mjs`, `app/globals.css`)

## Accomplishments

- Added `rehype-pretty-code` import and plugin configuration to `next.config.mjs` with the required Turbopack-safe string theme `'github-dark-dimmed'`
- Set `keepBackground: false` for clean dark token rendering in code blocks
- Wrapped `:root` CSS custom properties in `@layer base` for correct Tailwind cascade ordering
- Added `--font-sans` and `--font-mono` font fallback stack tokens to `globals.css`
- Confirmed `tailwind.config.ts`, `lib/utils.ts`, `mdx-components.tsx`, and `tsconfig.json` were all already correct from Plan 01-01 — zero changes needed

## Task Commits

1. **Task 1: next.config.mjs MDX pipeline** — `684da61`
2. **Task 2: globals.css token declarations** — `6e2adf5`

## Files Created/Modified

- `next.config.mjs` — added `rehypePrettyCode` import and plugin config in `createMDX({ options: { rehypePlugins: [...] } })`
- `app/globals.css` — added `@layer base` wrapper around `:root` block, added `--font-sans` and `--font-mono` CSS custom properties

## Decisions Made

1. **Retained `turbopack.root`:** The `turbopack: { root: __dirname }` setting added by Plan 01-01 as a bug fix was retained — it silences the multi-lockfile workspace detection warning. PATTERNS.md pattern for `next.config.mjs` does not include this, but removing it would re-introduce a known warning.

2. **No changes to tailwind.config.ts:** The file already uses `import defaultTheme from 'tailwindcss/defaultTheme'` (ESM) rather than `const { fontFamily } = require(...)` (CJS) as the plan specified. Both produce identical output; the ESM form is more consistent with the `.mjs` module context. The file had all 8 color tokens, `darkMode: ["class"]`, and the 2 font families already wired — no changes needed.

3. **@layer base wrapper added to globals.css:** Plan 01-01 omitted the `@layer base` wrapper around `:root`. This is required for correct Tailwind cascade ordering (Tailwind's `base` layer must run first; custom properties inside `@layer base` are ordered correctly relative to Tailwind resets).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] globals.css missing @layer base wrapper and font tokens**
- **Found during:** Task 2 (file inspection before modification)
- **Issue:** Plan 01-01 created `globals.css` with `:root {}` directly (outside any layer), missing the `@layer base` wrapper specified in PATTERNS.md. Also missing `--font-sans` and `--font-mono` CSS custom property declarations.
- **Fix:** Wrapped `:root` in `@layer base { }` and added the two font token declarations. This matches the PATTERNS.md canonical pattern exactly.
- **Files modified:** `app/globals.css`
- **Committed in:** `6e2adf5`

### No-op files (already correct from Plan 01-01)

The following files required no changes — Plan 01-01 had already built them correctly:
- `tailwind.config.ts` — all 8 CSS var color tokens, `darkMode: ["class"]`, 2 font families, no forbidden patterns
- `lib/utils.ts` — `cn()` with clsx + tailwind-merge
- `mdx-components.tsx` — `useMDXComponents` stub at project root
- `tsconfig.json` — `@/*` alias, `strict: true`, `moduleResolution: "bundler"`

## Known Stubs

None — all configuration files are complete and functional. The `mdx-components.tsx` stub returning `{ ...components }` is intentionally minimal per the plan; it will be expanded with custom prose components in Phase 3. This is an explicit deferral, not a blocking stub.

## Threat Flags

None — this plan modifies only configuration files. No new network endpoints, auth paths, file access patterns, or schema changes introduced. The `theme: 'github-dark-dimmed'` in `rehype-pretty-code` is a static string with no user input (T-02-01: accepted).

## Next Phase Readiness

- Plan 01-03 can now use all design tokens (`bg-bg`, `text-text`, `text-text-muted`, `bg-surface`, `border-border`, `text-accent`) in Tailwind utility classes
- MDX pipeline is fully operational — `.mdx` files in `content/blog/` will be syntax-highlighted via `rehype-pretty-code` at build time
- The `cn()` utility is available at `@/lib/utils` for all components
- The `@/*` path alias is active for all imports
