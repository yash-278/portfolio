# Phase 1: Foundation - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

A running Next.js 16 app with the full MDX pipeline wired, dark mode FOUC prevented via inline blocking script, Framer Motion correctly scoped with LazyMotion + domAnimation, and the shared Navbar + Footer in place — every subsequent phase builds on top of this without rework.

**What this phase does NOT include:** portfolio sections (Hero, About, Work History, Projects, Contact) — those are Phase 2. No dark mode toggle UI — that is Phase 5 (PLSH-01). No mobile hamburger menu. No blog content — just pipeline wired.

</domain>

<decisions>
## Implementation Decisions

### Migration Approach
- **D-01:** Start from a **fresh `create-next-app` scaffold** targeting Next.js 16.2.6 — do not upgrade the v2 branch in-place. Clean slate avoids upgrade noise, leftover dependencies (CVA, Radix icons, components.json), and inherited font configuration.
- **D-02:** The v2 animated gradient background (`BackgroundGradientAnimation`) is **dropped for Phase 1**. Phase 1 is infrastructure, not visual. Phase 2 will design the hero from scratch.
- **D-03:** Phase 1 work happens on a **new branch** (e.g., `feat/next16-foundation`), not directly on main. Merge to main via PR after Phase 1 success criteria are verified.

### Dark Mode
- **D-04:** Phase 1 delivers **dark-only mode** — an inline blocking script in `app/layout.tsx` adds the `dark` class to `<html>` before the first paint. No system preference detection, no `next-themes` dependency, no toggle UI.
- **D-05:** CSS variables are **dark-only for now**. Light mode CSS vars are introduced when the toggle ships in Polish phase (PLSH-01). `globals.css` defines only dark theme tokens (background, foreground, etc.).

### Navbar and Footer
- **D-06:** The Navbar contains: **site logo/name + two links: "Home" and "Blog"**. No About/Projects anchor links in Phase 1. Mobile hamburger menu is not in scope for Phase 1.
- **D-07:** The Footer contains: **Yash Kadam name + GitHub / LinkedIn / Twitter(X) social icon links + copyright year**. Social link targets: github.com/yash-278, LinkedIn, @yashkadam278.

### Font Strategy
- **D-08:** Use **2 fonts only**: one sans-serif for body/UI text and one monospace for code blocks. Specific typefaces are **placeholder selections for Phase 1** (e.g., Inter + JetBrains Mono from `next/font/google`). Final font pairing is decided during the Phase 2 design pass.
- **D-09:** All 4 v2 fonts (Josefin_Sans, Comfortaa, Fira_Sans, duplicate Inter) are **dropped** — they are not carried forward.

### Claude's Discretion
- Specific placeholder font names (Inter + JetBrains Mono suggested; researcher/planner may adjust if a better pairing aligns with the dark aesthetic).
- Exact inline FOUC script implementation pattern (standard `document.documentElement.classList.add('dark')` or equivalent).
- Exact Tailwind dark mode config (`darkMode: 'class'` in `tailwind.config.ts`).
- Whether to use `next/font/local` or `next/font/google` for the monospace font.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` — Full v1 requirements; Phase 1 implements FOUND-01 through FOUND-06
- `.planning/ROADMAP.md` §Phase 1 — Success criteria (5 items) that gate Phase 1 completion
- `.planning/PROJECT.md` §Constraints — Stack constraints (Next.js 14+/TypeScript/Tailwind/Framer Motion)

### Starting Point (v2 branch)
- `origin/v2` branch (remote) — Starting reference for `app/layout.tsx`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json` patterns. **Do NOT copy as-is** — use as structural reference only; drop fonts, gradient component, Shadcn setup.

### Known Gotchas (from STATE.md)
- `rehype-pretty-code` 0.14.3 + Turbopack: pass Shiki themes as **string names** (not imported objects); set `mdxRs: false`. Use ESM `next.config.mjs` pattern.
- `middleware.ts` subdomain redirect (Phase 4): guard behind `VERCEL_ENV === 'production'` — not relevant to Phase 1 but researcher should note it.
- Dark mode FOUC: inline blocking script must run **synchronously before paint** — cannot be deferred or async.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `origin/v2:lib/utils.ts` — `cn()` utility (clsx + tailwind-merge). Port this; it's the standard Tailwind class merging pattern and will be needed throughout.
- `origin/v2:tailwind.config.ts` — TypeScript Tailwind config structure. Use as the config file format reference (not the contents).
- `origin/v2:tsconfig.json` — TypeScript config with path aliases. Check for `@/*` path alias; carry it forward.

### Established Patterns
- v2 uses `app/` router (Next.js App Router) — continue this; do not use `pages/`.
- v2 uses `next/font/google` for font loading — continue this pattern with the 2-font setup.
- v2 `next.config.mjs` is ESM — keep `.mjs` extension; `@next/mdx` config goes here.

### Integration Points
- `app/layout.tsx` — root layout is where the inline dark mode script, Navbar, and Footer live. All font variables are applied here.
- `mdx-components.tsx` — must exist at project root for `@next/mdx` to work (Next.js App Router requirement).
- `NEXT_PUBLIC_SITE_URL` env var — must be set in Vercel before first build (FOUND-06).

</code_context>

<specifics>
## Specific Ideas

- Phase 2 design direction: show **multiple layout/style variations simultaneously** (side-by-side comparison) before locking a direction — not one at a time. User wants to compare options visually before committing to any aesthetic.

</specifics>

<deferred>
## Deferred Ideas

- **Phase 2:** Design variations for portfolio sections — show all options side-by-side simultaneously before picking a direction. (User explicitly requested this during font discussion.)
- **Phase 5 (PLSH-01):** Dark mode toggle UI + `next-themes` installation. Phase 1 FOUC script is intentionally minimal; full toggle ships later.
- **Phase 5:** Mobile hamburger nav menu — Phase 1 Navbar has desktop links only.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-05-24*
