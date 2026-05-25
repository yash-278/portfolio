# Phase 5: Polish & Analytics - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire Vercel Analytics into the root layout; audit all scroll animations to confirm they meet the "opacity + small Y translate, once per viewport entry" spec; verify all project links resolve; and run Lighthouse on the deployed production URL, fixing anything that fails LCP <2.5s, CLS <0.1, or INP <200ms. The phase is not complete until Lighthouse passes. No new features.

</domain>

<decisions>
## Implementation Decisions

### Vercel Analytics
- **D-01:** Install `@vercel/analytics` and add `<Analytics />` to `app/layout.tsx` root layout. No cookie consent banner — Vercel Analytics is cookieless by design (ANLYT-01).
- **D-02:** No decision on Vercel Speed Insights — user deferred this. Claude's call on whether to add it alongside Analytics. (If added, it must not introduce a consent banner or extra cookies.)

### Core Web Vitals / Lighthouse
- **D-03:** Lighthouse baseline is unknown — the site has not been audited yet. Phase 5 executor must run Lighthouse against the deployed production URL as the first diagnostic step before making any changes.
- **D-04:** If any metric fails (LCP ≥2.5s, CLS ≥0.1, INP ≥200ms), the executor must diagnose the root cause from Lighthouse output and fix it within Phase 5. The phase is gated on passing all three thresholds.
- **D-05:** No pre-specified suspects. Let Lighthouse data drive what gets fixed. Do not pre-emptively optimize things that may already pass.

### Animation Audit
- **D-06:** `SectionReveal` (opacity 0→1, y: 24→0, once: true) is the established pattern and matches the spec. Audit pass = confirm no `layout` prop on scroll-heavy components and no section animates more than once per viewport entry.
- **D-07:** HeroSection uses 6 staggered `SectionReveal` wrappers (delays 0→0.3s) on mount. This is not flagged for change unless it reads as excessive after a fresh look during the audit. Claude's call.

### Link Audit
- **D-08:** Audit scope = all `<a>` tags in `ProjectsSection`, `ContactSection`, `Navbar`, and `Footer` that point to external URLs. Confirm each resolves with a 2xx response.
- **D-09:** `ProjectsSection` currently has GitHub links only (no live demo URLs for Nekomori or Brew Index). The link audit checks what's there — it does not add new URLs unless they are known to exist and work.

### Claude's Discretion
- Whether to add Vercel Speed Insights alongside Analytics (must not add cookies or consent requirement)
- Exact fix strategy for any CWV failures found by Lighthouse (data-driven, not pre-specified)
- Whether to reduce hero stagger count if it reads as excessive

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/ROADMAP.md` §Phase 5 — Goal + 4 Success Criteria gating phase completion (Lighthouse thresholds are hard gates)
- `.planning/REQUIREMENTS.md` §ANLYT-01 — Vercel Analytics requirement (cookieless, no consent banner)
- `.planning/PROJECT.md` §Constraints — Core Web Vitals matter for credibility; static generation preference

### Prior Phase Foundation (do not break)
- `.planning/phases/01-foundation/01-CONTEXT.md` — dark-only mode, LazyMotion + domAnimation pattern
- `.planning/phases/02-portfolio-page/02-CONTEXT.md` — design direction, Geist fonts, accent color (#818cf8), SectionReveal introduced
- `app/layout.tsx` — Root layout where `<Analytics />` must be added; also where LazyMotion provider lives — do NOT break it
- `components/SectionReveal.tsx` — The animation primitive; audit target; do not change behavior unless there's a CWV reason

### Existing Component Inventory (audit targets)
- `components/HeroSection.tsx` — 6 staggered SectionReveal wrappers on mount (delays 0–0.3s)
- `components/AboutSection.tsx` — SectionReveal scroll animations
- `components/WorkSection.tsx` — SectionReveal scroll animations
- `components/ProjectsSection.tsx` — Project cards with GitHub links (live demo links not present yet)
- `components/ContactSection.tsx` — External links (email, social)
- `components/Navbar.tsx` — Navigation links
- `components/Footer.tsx` — Footer links

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/SectionReveal.tsx` — `m.div` with `opacity 0→1`, `y: 24→0`, `viewport: { once: true, margin: '-80px' }`. Supports both `scroll` and `mount` animate modes. Already compliant with Phase 5 animation spec.
- `app/layout.tsx` — Root layout; the correct place to add `<Analytics />` so it runs on every page
- `next/image` with `priority` prop — already used on hero photo (`yash.jpg`) to avoid LCP penalty

### Established Patterns
- All section components use `SectionReveal` with `whileInView` + `once: true` — no repeat triggers
- `m` (from Framer Motion) imported via LazyMotion pattern; no direct `motion.*` imports in Client Components
- Static generation: `/` and `/blog` routes are SSG — no client-side data fetching to cause CWV issues from server round-trips

### Integration Points
- `app/layout.tsx` — Add `<Analytics />` from `@vercel/analytics/next` inside the body (after LazyMotion provider and children)
- Vercel dashboard — Link audit can be done via `curl` or `fetch` in a Node script; no new pages required

</code_context>

<specifics>
## Specific Ideas

- **Lighthouse run:** Use the Lighthouse CLI (`npx lighthouse <url> --output=json`) against the Vercel production URL, or use the Chrome DevTools Lighthouse panel against the live site. Report LCP, CLS, INP in a summary before fixing anything.
- **Link audit approach:** A simple Node script or `curl` loop over the known external URLs is sufficient — no need for a full crawler. Focus on `ProjectsSection`, `ContactSection`, `Navbar`, `Footer` hrefs.
- **Analytics install:** `npm install @vercel/analytics`, then `import { Analytics } from '@vercel/analytics/next'` in `app/layout.tsx`. One component, zero config.

</specifics>

<deferred>
## Deferred Ideas

- Dark mode toggle (`next-themes`) — v2 requirement PLSH-01, explicitly deferred
- Tailwind v4 upgrade — v2 requirement PLSH-02, separate sprint
- JSON-LD `WebSite` + `Person` schema — v2 requirement SEO-05
- JSON-LD `Article` schema on post pages — v2 requirement BLOG-06
- Table of contents for long posts — v2 requirement BLOG-05

</deferred>

---

*Phase: 5-Polish & Analytics*
*Context gathered: 2026-05-25*
