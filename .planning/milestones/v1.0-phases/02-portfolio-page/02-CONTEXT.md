# Phase 2: Portfolio Page - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete single-page portfolio — Hero, About, Work History, Projects, Contact — statically generated with full SEO metadata (title, description, OG image with absolute URLs), live at yashkadam.com. All five sections must be visible without a page reload. No blog content in this phase.

</domain>

<decisions>
## Implementation Decisions

### Design Direction
- **D-01:** Overall aesthetic is **dark polished** — dark background with visual richness: subtle gradients, glassmorphism cards, glowing accents. Reference energy: leerob.io, brittany.dev.
- **D-02:** Font pairing locked: **Geist + Geist Mono** (via `next/font/google`). Replace the Phase 1 Inter + JetBrains Mono placeholder. Geist is Vercel's typeface — clean, modern, signals Next.js/Vercel deployment.
- **D-03:** Accent color is **Claude's discretion** — pick the accent that best suits the dark polished aesthetic. Recommendation: indigo/violet (distinctive, less common in dev portfolios, signals quality).

### Hero Section
- **D-04:** Hero layout is **split: text left, photo right**. User has a casual travel/lifestyle photo to use — not a professional headshot. The photo should be well-lit and clearly of the user.
- **D-05:** Hero pitch line (verbatim): **"I write code, lead teams, and ship things."**
- **D-06:** Hero shows: name (Yash Kadam), title (Technical Lead), pitch line, and CTA links (GitHub + contact).

### Work History Section
- **D-07:** Each role shows: title + company + dates + **one concise impact sentence**. No bullet points.
- **D-08:** Show current role (KingsleyGate, Technical Lead) + 1-2 previous roles. **Content needed from user at implementation time** — executor should prompt for: previous company names, titles, dates, and one-liner per role.

### Projects Section
- **D-09:** Two projects: **Nekomori** and **Brew Index**. No older demo projects (Twitter clone, Crown Clothing, etc.) — locked by REQUIREMENTS.md.
- **D-10:** Each project card shows: name + 1-line description + tech stack tags + live link + GitHub link.
- **D-11:** Project descriptions (verbatim):
  - Nekomori: "Anime schedule tracker and personal watchlist manager." · TypeScript, React, Node
  - Brew Index: "A searchable frontend for the Homebrew package registry." · React, TypeScript
- **D-12:** Live links and GitHub links must resolve correctly. GitHub: github.com/yash-278.

### About Section
- **D-13:** About covers: current role at KingsleyGate, brief background, shifting focus toward backend/Go. Keep it brief — 2-3 sentences max. Not a full CV.

### Contact Section
- **D-14:** Contact shows GitHub, LinkedIn, Twitter/X links only. **No contact form.** Per REQUIREMENTS.md PORT-05.
  - GitHub: github.com/yash-278
  - Twitter/X: @yashkadam278
  - LinkedIn: user's LinkedIn profile (executor should confirm URL at implementation time)

### What's Explicitly OUT of Scope (Phase 2)
- No typewriter animation in hero (locked by requirements)
- No animated skill progress bars (locked by requirements)
- No dark mode toggle (Phase 5 / PLSH-01)
- No blog list or blog index route (Phase 3)
- No project case study pages (v2 requirement / PROJ-01)
- No mobile hamburger menu (Phase 5)

### Claude's Discretion
- Exact accent color (indigo/violet recommended)
- Subtle background treatment for dark polished look (mesh gradient, noise texture, or glow)
- Card border and shadow style (glassmorphism-influenced but not overdone)
- Section spacing, divider treatment, and scroll behavior
- Whether to add scroll-triggered entrance animations via LazyMotion (keep light — no performance impact)
- Exact photo placement, sizing, and border/shadow treatment in hero

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Portfolio — PORT-01 through PORT-05, SEO-01
- `.planning/ROADMAP.md` §Phase 2 — Success criteria (5 items) that gate Phase 2 completion
- `.planning/PROJECT.md` §Constraints — Stack constraints and out-of-scope items

### Phase 1 Foundation (what exists to build on)
- `.planning/phases/01-foundation/01-CONTEXT.md` — D-04/D-05 dark-only mode, D-06/D-07 Navbar/Footer spec
- `.planning/phases/01-foundation/01-01-SUMMARY.md` — What was scaffolded; deviation notes
- `.planning/phases/01-foundation/01-03-SUMMARY.md` — Navbar/Footer implementation details
- `app/layout.tsx` — Root layout with FOUC script, LazyMotion, Navbar, Footer already in place
- `components/Navbar.tsx` — Existing Navbar (logo + Home + Blog) — do NOT break
- `components/Footer.tsx` — Existing Footer — do NOT break
- `app/globals.css` — Existing dark-only CSS tokens
- `tailwind.config.ts` — Existing Tailwind config with darkMode: ['class'] and color tokens

### Code Review Findings (Phase 1 — address before shipping)
- `.planning/phases/01-foundation/01-REVIEW.md` — CR-01 (blog slug ignores params), CR-02 (params Promise typing), WR-04 (LinkedIn URL TODO). CR-01 and CR-02 will be fixed in Phase 3. WR-04 (LinkedIn URL) should be resolved in Phase 2 when Contact section is built.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge) — use for all conditional Tailwind class merging
- `components/Navbar.tsx` — Server Component pattern to follow for new section components
- `components/Footer.tsx` — Social icon pattern (inline SVG) — reuse for Contact section

### Established Patterns
- All page-level components are Server Components (no `'use client'` unless using Framer Motion `m.*`)
- Framer Motion: use `m.*` (not `motion.*`) inside `'use client'` leaf components; LazyMotion is already in root layout
- `next/font/google` pattern already established — add Geist + Geist Mono following the same pattern
- Dark-only: all styling uses `dark:` utilities (always active via the FOUC script); no light-mode variants needed
- `suppressHydrationWarning` on `<html>` — already in place; do not remove

### Integration Points
- New sections live in `app/page.tsx` (the home route) — currently a minimal stub
- Portfolio content (names, descriptions, dates) is hardcoded in-component — no CMS, no data fetching
- Photo asset goes in `public/` directory

</code_context>

<specifics>
## Specific Ideas

- **Geist fonts:** Available via `next/font/google` as `Geist` and `Geist_Mono`. Update `app/layout.tsx` to replace Inter + JetBrains Mono.
- **Hero photo:** User will provide a casual travel/lifestyle photo. Store in `public/` (e.g., `public/yash.jpg`). Use `next/image` with appropriate `sizes` for responsive display.
- **Work History content:** Previous roles unknown — executor must prompt user for: company name, title, dates, one impact sentence per role (1-2 previous roles beyond KingsleyGate).
- **LinkedIn URL:** Currently has a TODO comment in Footer. Executor must confirm the correct LinkedIn profile URL with the user when building Contact section.
- **Project links:** Nekomori and Brew Index links must be confirmed at implementation time — executor should verify live URL and GitHub repo URL for each.

</specifics>

<deferred>
## Deferred Ideas

- Mobile hamburger nav menu — Phase 5 (PLSH-01 scope)
- Dark mode toggle — Phase 5 (PLSH-01)
- Project case study pages (/projects/[slug]) — v2 requirement PROJ-01, future milestone
- Blog list at /blog — Phase 3
- Any additional projects beyond Nekomori + Brew Index — future phase

</deferred>

---

*Phase: 2-Portfolio Page*
*Context gathered: 2026-05-24*
