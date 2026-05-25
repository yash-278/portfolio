# Phase 5: Polish & Analytics - Pattern Map

**Mapped:** 2026-05-25
**Files analyzed:** 2 (modified files; no new files created this phase)
**Analogs found:** 2 / 2

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/layout.tsx` | config / provider | request-response (SSR layout) | `app/layout.tsx` itself (additive edit) | exact — file is its own analog |
| `components/ProjectsSection.tsx` | component | request-response (static data → render) | `components/ContactSection.tsx` | exact — same external-link pattern |

---

## Pattern Assignments

### `app/layout.tsx` (config / SSR provider — additive edit)

**Change:** Add two imports and two JSX components inside `<body>`, after `<Footer />`, before `</body>`.

**Existing structure to preserve** (lines 1–69, full file):

```tsx
// NOTE: Do NOT add 'use client' here — root layout must remain a Server Component.
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LazyMotion, domAnimation } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'
```

**Imports to add** (after existing imports, before `'./globals.css'` import or after it — either is fine):

```tsx
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
```

**Placement rule:** Both components go inside `<body>`, after `<Footer />`, NOT inside `<LazyMotion>`. They are independent of Framer Motion.

**Body diff** (lines 49–68 of the existing file — the only region that changes):

```tsx
// BEFORE
<body className="bg-bg text-text font-sans antialiased">
  <a href="#main-content" ...>Skip to main content</a>
  <Navbar />
  <LazyMotion features={domAnimation} strict>
    <main id="main-content" className="pt-14">
      {children}
    </main>
  </LazyMotion>
  <Footer />
</body>

// AFTER — add both components after <Footer />
<body className="bg-bg text-text font-sans antialiased">
  <a href="#main-content" ...>Skip to main content</a>
  <Navbar />
  <LazyMotion features={domAnimation} strict>
    <main id="main-content" className="pt-14">
      {children}
    </main>
  </LazyMotion>
  <Footer />
  <Analytics />
  <SpeedInsights />
</body>
```

**Critical constraints** (from `app/layout.tsx` existing comments and RESEARCH.md):
- Do NOT add `'use client'` to `layout.tsx`
- Do NOT nest `<Analytics />` or `<SpeedInsights />` inside `<LazyMotion>`
- Both components are Server-Component-compatible; no `'use client'` wrapper needed
- Import path must be `@vercel/analytics/next` (not `@vercel/analytics`) and `@vercel/speed-insights/next`

---

### `components/ProjectsSection.tsx` (component — dead link fix)

**Change:** Remove or correct the `github` field on the Brew Index project entry (lines 12–17).

**Existing projects data structure** (lines 3–18):

```tsx
const projects = [
  {
    name: 'Nekomori',
    description: '...',
    tags: ['TypeScript', 'React', 'Node.js'],
    github: 'https://github.com/yash-278/nekomori',  // 200 OK — keep
  },
  {
    name: 'Brew Index',
    description: '...',
    tags: ['React', 'TypeScript'],
    github: 'https://github.com/yash-278/brew-index', // 404 — must fix
  },
]
```

**Link rendering pattern** (lines 43–51 — the `<a>` tag to be affected):

```tsx
<a
  href={project.github}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`View ${project.name} on GitHub`}
  className="shrink-0 font-mono text-xs text-text-muted transition-colors duration-150 hover:text-accent"
>
  GitHub →
</a>
```

**Fix option A — remove the link entirely** (safest default per D-09):
Make the `github` field optional and conditionally render the `<a>` tag:

```tsx
const projects = [
  {
    name: 'Brew Index',
    description: '...',
    tags: ['React', 'TypeScript'],
    // github field omitted
  },
]

// In JSX — wrap the <a> tag in a conditional:
{project.github && (
  <a
    href={project.github}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`View ${project.name} on GitHub`}
    className="shrink-0 font-mono text-xs text-text-muted transition-colors duration-150 hover:text-accent"
  >
    GitHub →
  </a>
)}
```

**Fix option B — update to correct URL** (if the correct repo name is known):

```tsx
github: 'https://github.com/yash-278/<correct-repo-name>',
```

**Type update required for option A** — the `projects` array is inferred; if `github` becomes optional, the downstream `{project.github && ...}` guard handles TypeScript narrowing without an explicit interface change, but adding an explicit type is cleaner:

```tsx
interface Project {
  name: string
  description: string
  tags: string[]
  github?: string  // optional
}
```

**Analog pattern for conditional link rendering:** `components/ContactSection.tsx` (lines 25–30) shows the established `<a>` tag pattern with `target="_blank" rel="noopener noreferrer"` and the accent hover class — copy this style if the link element needs adjustment.

---

## Shared Patterns

### External Link Pattern
**Source:** `components/ContactSection.tsx` lines 35–46 and `components/Footer.tsx` lines 14–31
**Apply to:** Any `<a>` tag pointing to an external URL in this phase
```tsx
// All external links in this codebase follow this shape:
<a
  href="https://..."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Descriptive label"
  className="... text-text-muted ... hover:text-accent"
>
  Link text
</a>
```

### Server Component Import Rule
**Source:** `app/layout.tsx` line 1 comment
**Apply to:** Any import added to `app/layout.tsx`
```tsx
// NOTE: Do NOT add 'use client' here — root layout must remain a Server Component.
// Both @vercel/analytics/next and @vercel/speed-insights/next are
// Server-Component-compatible — they render as <script defer> tags.
```

### LazyMotion Boundary Rule
**Source:** `app/layout.tsx` lines 58–64
**Apply to:** Any new component added to `app/layout.tsx`
```tsx
// Analytics and SpeedInsights must be placed OUTSIDE the LazyMotion boundary.
// Only Framer Motion client components go inside <LazyMotion>.
<LazyMotion features={domAnimation} strict>
  <main id="main-content" className="pt-14">
    {children}
  </main>
</LazyMotion>
<Footer />
<Analytics />       {/* ← outside LazyMotion, after Footer */}
<SpeedInsights />   {/* ← outside LazyMotion, after Footer */}
```

### Animation Audit Baseline (read-only, no changes expected)
**Source:** `components/SectionReveal.tsx` lines 6–9, 22–29
**Apply to:** Audit verification of all section components
```tsx
// This is the spec-compliant pattern — all scroll animations must match this:
const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}
// mount mode: { initial: 'hidden', animate: 'visible' }
// scroll mode: { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' } }
// No `layout` prop. No `motion.*` (only `m.*`). Triggers once per viewport entry.
```

---

## No Analog Found

No files in this phase lack a codebase analog. Both modified files have direct matches.

---

## Audit Targets (read-only verification, no changes unless Lighthouse flags an issue)

| Component | File | Audit Check | Pre-flight Status |
|-----------|------|-------------|-------------------|
| SectionReveal | `components/SectionReveal.tsx` | opacity+y only, once:true, no layout prop | PASS — confirmed in source |
| HeroSection | `components/HeroSection.tsx` | 6 staggered mount-mode SectionReveal, delays 0–0.3s | PASS — matches spec |
| AboutSection | `components/AboutSection.tsx` | SectionReveal with whileInView | Verify during execution |
| WorkSection | `components/WorkSection.tsx` | SectionReveal with whileInView | Verify during execution |
| ProjectsSection | `components/ProjectsSection.tsx` | No layout prop; brew-index link = **404** | FAIL on link — fix required |
| ContactSection | `components/ContactSection.tsx` | External links; LinkedIn/Twitter are bot-blocked (not dead) | PASS — links live |
| Navbar | `components/Navbar.tsx` | Navigation links | Verify during execution |
| Footer | `components/Footer.tsx` | Social links (GitHub 200, LinkedIn bot-blocked, Twitter bot-blocked) | PASS — links live |

---

## Pre-flight Link Audit Summary

| URL | Component | Expected Status | Action |
|-----|-----------|-----------------|--------|
| `https://github.com/yash-278` | HeroSection, ContactSection, Footer | 200 OK | None |
| `https://github.com/yash-278/nekomori` | ProjectsSection | 200 OK | None |
| `https://github.com/yash-278/brew-index` | ProjectsSection | **404** | Fix or remove |
| `https://linkedin.com/in/kadamyash` | ContactSection, Footer | 999 (bot-block) | Verify manually |
| `https://twitter.com/yashkadam278` | ContactSection, Footer | 403 (bot-block) | Verify manually |

---

## Metadata

**Analog search scope:** `app/`, `components/`
**Files read:** 7 (`layout.tsx`, `ProjectsSection.tsx`, `SectionReveal.tsx`, `HeroSection.tsx`, `ContactSection.tsx`, `Footer.tsx`, `Navbar.tsx` — last two cover the shared external-link pattern)
**Pattern extraction date:** 2026-05-25
