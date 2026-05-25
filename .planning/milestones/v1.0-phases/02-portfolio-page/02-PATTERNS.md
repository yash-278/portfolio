# Phase 2: Portfolio Page - Pattern Map

**Mapped:** 2026-05-24
**Files analyzed:** 13 new/modified files
**Analogs found:** 11 / 13

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/page.tsx` | component (page) | request-response | `app/page.tsx` (Phase 1 stub) | exact (replace body, keep shell) |
| `app/layout.tsx` | layout (root) | request-response | `app/layout.tsx` (Phase 1 current) | exact (2-line font swap only) |
| `app/globals.css` | config/style | transform | `app/globals.css` (Phase 1 current) | exact (2-line accent swap only) |
| `components/SectionReveal.tsx` | component (animation wrapper) | request-response | `app/layout.tsx` (LazyMotion usage) | partial (LazyMotion consumer pattern) |
| `components/HeroSection.tsx` | component (section) | request-response | `components/Navbar.tsx` + `components/Footer.tsx` | role-match (Server Component structure, Tailwind tokens) |
| `components/AboutSection.tsx` | component (section) | request-response | `components/Footer.tsx` | role-match (Server Component, prose layout) |
| `components/WorkSection.tsx` | component (section) | request-response | `components/Footer.tsx` | role-match (Server Component, structured list) |
| `components/ProjectsSection.tsx` | component (section) | request-response | `components/Footer.tsx` | role-match (Server Component, card/grid pattern) |
| `components/ContactSection.tsx` | component (section) | request-response | `components/Footer.tsx` | exact (inline SVG social icon pattern is reused verbatim) |
| `components/Navbar.tsx` | component (UI, nav) | request-response | `components/Navbar.tsx` (Phase 1 current) | exact (minor change: add `'use client'` + `usePathname`) |
| `components/Footer.tsx` | component (UI, footer) | request-response | `components/Footer.tsx` (Phase 1 current) | exact (1-line change: resolve LinkedIn TODO) |
| `app/blog/page.tsx` | component (stub page) | request-response | `app/page.tsx` (Phase 1 stub) | role-match (minimal stub pattern) |
| `public/og.png` | static asset | — | — | no analog (binary asset) |

---

## Pattern Assignments

### `app/layout.tsx` (layout, font swap)

**Analog:** `app/layout.tsx` (current — lines 1–65)

**What changes:** Lines 5–22 only. Replace the two font imports and their configuration objects. Everything else (FOUC script, LazyMotion, Navbar, Footer, suppressHydrationWarning, metadata shape) is unchanged.

**Current font block to replace** (lines 5–22):
```tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})
```

**Replacement font block:**
```tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})
```

**HTML className spread** (line 35 — update variable references, keep everything else):
```tsx
// Before:
<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
// After:
<html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
```

**Metadata export** (lines 24–27 — update to Phase 2 values):
```tsx
export const metadata: Metadata = {
  title: 'Yash Kadam — Technical Lead',
  description: 'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
}
```

**Critical preservation — do NOT touch these** (lines 36–65):
```tsx
// Keep exactly as-is:
<head>
  <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('dark')" }} />
</head>
<body className="bg-bg text-text font-sans antialiased">
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:text-accent">
    Skip to main content
  </a>
  <Navbar />
  <LazyMotion features={domAnimation} strict>
    <main id="main-content" className="pt-14">
      {children}
    </main>
  </LazyMotion>
  <Footer />
</body>
```

---

### `app/globals.css` (config/style, accent swap)

**Analog:** `app/globals.css` (current — lines 1–20)

**What changes:** Lines 14–18 only. Two color values and two font fallback strings change.

**Current lines 9–19 (for reference):**
```css
@layer base {
  :root {
    --color-bg: #0a0a0a;
    --color-surface: #111111;
    --color-text: #e4e4e7;
    --color-text-muted: #71717a;
    --color-border: #27272a;
    --color-accent: #22d3ee;       /* ← CHANGE THIS */
    --color-accent-hover: #06b6d4; /* ← CHANGE THIS */
    --color-destructive: #ef4444;
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;     /* ← CHANGE THIS */
    --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace; /* ← CHANGE THIS */
  }
}
```

**Replacement values (lines 14–18):**
```css
--color-accent: #818cf8;        /* indigo-400 — replaces #22d3ee (cyan-400) */
--color-accent-hover: #6366f1;  /* indigo-500 — replaces #06b6d4 */
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', ui-monospace, monospace;
```

**Unchanged lines 1–13 and 19–20 — keep verbatim.**

---

### `components/SectionReveal.tsx` (component, animation wrapper — NEW)

**Analog:** `app/layout.tsx` lines 6, 56 (LazyMotion consumer — establishes the `m.*` pattern)

**No direct file analog exists.** Pattern is derived from the `LazyMotion` + `domAnimation` setup already in `app/layout.tsx` and the UI-SPEC Animation Contract.

**Key constraint from `app/layout.tsx` line 56:**
```tsx
// LazyMotion wraps <main> — all m.* children inside page routes have access
<LazyMotion features={domAnimation} strict>
  <main id="main-content" className="pt-14">
    {children}
  </main>
</LazyMotion>
```
SectionReveal renders inside `<main>` — it is within the LazyMotion boundary. DO NOT use `motion.*` (only `m.*` from `'framer-motion'`). The `strict` prop on LazyMotion will throw at runtime if `motion.*` is used.

**Full implementation (copy verbatim):**
```tsx
'use client'
import { m } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  animate?: 'scroll' | 'mount'
}

export default function SectionReveal({
  children,
  delay = 0,
  animate = 'scroll',
}: SectionRevealProps) {
  const motionProps =
    animate === 'mount'
      ? { initial: 'hidden', animate: 'visible' }
      : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' } }

  return (
    <m.div
      variants={variants}
      {...motionProps}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </m.div>
  )
}
```

**Usage notes:**
- `animate="mount"` for Hero elements (fires on load, not scroll)
- Default `animate="scroll"` for all other sections (fires when scrolled into view)
- `delay={index * 0.1}` for staggered list items (max 0.3s — never exceed 3 items × 0.1s)
- Only `opacity` + `y` allowed — no scale, rotate, blur (per ROADMAP Phase 5 hard constraint)

---

### `app/page.tsx` (component/page, home route — REPLACE)

**Analog:** `app/page.tsx` (Phase 1 stub — entire file is the template, but all content is replaced)

**Current file (lines 1–5) — replace entirely:**
```tsx
// Home page — Phase 1 infrastructure placeholder.
// Portfolio sections (Hero, About, Work History, Projects, Contact) ship in Phase 2.
export default function Home() {
  return <div className="min-h-screen" />
}
```

**Replacement — full Phase 2 structure:**
```tsx
import type { Metadata } from 'next'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import WorkSection from '@/components/WorkSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Yash Kadam — Technical Lead',
  description: 'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
  openGraph: {
    title: 'Yash Kadam — Technical Lead',
    description: 'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
    url: 'https://yashkadam.com',
    siteName: 'Yash Kadam',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Kadam — Technical Lead',
    description: 'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og.png`],
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}
```

**Import pattern:** `@/` alias (from `tsconfig.json` `paths`) — matches Navbar/Footer import style in `app/layout.tsx` lines 7–8.

**Static generation:** No `async`, no `fetch()`, no `getServerSideProps`. All content is hardcoded in-component. This keeps the `/` route as `○` (static) in `next build`.

---

### `components/HeroSection.tsx` (component/section, Server Component — NEW)

**Analog:** `components/Navbar.tsx` (Server Component structure, Tailwind token usage, Link/external-link pattern)

**Server Component marker:** No `'use client'` at top. Follows `components/Navbar.tsx` pattern.

**Imports pattern** (modeled on Navbar.tsx lines 1, 3–4 + adds Image/SectionReveal):
```tsx
import Image from 'next/image'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
```

**Section wrapper pattern** (copy from UI-SPEC / RESEARCH.md — no codebase analog):
```tsx
<section
  id="hero"
  aria-labelledby="hero-heading"
  className="py-20 md:py-28 scroll-mt-14"
  style={{
    backgroundImage:
      'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129, 140, 248, 0.06) 0%, transparent 70%)',
  }}
>
  <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 md:flex-row md:items-center md:gap-12">
```

**Text column with mount animations** (use `animate="mount"` on each SectionReveal):
```tsx
<div className="flex flex-col md:flex-1">
  <SectionReveal animate="mount" delay={0}>
    <h1 id="hero-heading" className="text-5xl font-semibold leading-tight text-text">
      Yash Kadam
    </h1>
  </SectionReveal>
  <SectionReveal animate="mount" delay={0.1}>
    <p className="mt-2 text-2xl text-text-muted">Technical Lead</p>
  </SectionReveal>
  <SectionReveal animate="mount" delay={0.2}>
    <p className="mt-4 text-2xl text-text">I write code, lead teams, and ship things.</p>
  </SectionReveal>
  <SectionReveal animate="mount" delay={0.3}>
    <div className="mt-8 flex flex-wrap gap-4">
      <a
        href="#projects"
        className="text-base font-semibold text-accent transition-colors duration-150 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View my work →
      </a>
      <a
        href="https://github.com/yash-278"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        GitHub
      </a>
    </div>
  </SectionReveal>
</div>
```

**Photo column** (next/image pattern — `priority` required for LCP):
```tsx
<SectionReveal animate="mount" delay={0.3}>
  <div className="flex-shrink-0">
    <Image
      src="/yash.jpg"
      alt="Yash Kadam"
      width={320}
      height={320}
      priority
      sizes="(max-width: 768px) 200px, 320px"
      className="rounded-2xl object-cover ring-1 ring-border"
    />
  </div>
</SectionReveal>
```

**External link pattern** (copy from `components/Footer.tsx` lines 14–19):
```tsx
target="_blank"
rel="noopener noreferrer"
```

**Focus ring pattern** (copy from `components/Navbar.tsx` lines 12–15):
```tsx
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

---

### `components/AboutSection.tsx` (component/section, Server Component — NEW)

**Analog:** `components/Footer.tsx` (Server Component, `max-w-5xl mx-auto px-6` container pattern)

**Server Component marker:** No `'use client'`.

**Imports pattern:**
```tsx
import SectionReveal from '@/components/SectionReveal'
```

**Section container pattern** (copy container from Footer.tsx line 8):
```tsx
<section
  id="about"
  aria-labelledby="about-heading"
  className="py-24 scroll-mt-14"
>
  <div className="mx-auto max-w-5xl px-6">
```

**Section heading pattern** (consistent across all sections — copy verbatim):
```tsx
<h2 id="about-heading" className="text-2xl font-semibold text-text">
  About
</h2>
<div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
```

**Prose block (narrower container for readability):**
```tsx
<SectionReveal>
  <div className="max-w-2xl">
    <p className="text-base leading-relaxed text-text">
      {/* executor fills: 2-3 sentences covering KingsleyGate role, background, Go focus */}
    </p>
  </div>
</SectionReveal>
```

---

### `components/WorkSection.tsx` (component/section, Server Component — NEW)

**Analog:** `components/Footer.tsx` (Server Component, list-of-items pattern) + Navbar.tsx (token usage)

**Server Component marker:** No `'use client'`.

**Imports pattern:**
```tsx
import SectionReveal from '@/components/SectionReveal'
```

**Timeline list container pattern:**
```tsx
<section
  id="work"
  aria-labelledby="work-heading"
  className="py-24 scroll-mt-14"
>
  <div className="mx-auto max-w-5xl px-6">
    <h2 id="work-heading" className="text-2xl font-semibold text-text">Work</h2>
    <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
    <div className="border-l-2 border-accent/30 pl-6">
      <div className="flex flex-col gap-8">
```

**Individual role row pattern** (staggered with `delay={index * 0.1}`):
```tsx
<SectionReveal delay={0}>
  <div>
    <p className="text-base font-semibold text-text">Technical Lead</p>
    <p className="text-sm text-text-muted">
      <span className="text-accent">KingsleyGate</span>
      {' · '}
      <span>2023 – Present</span>
    </p>
    <p className="mt-1 text-base text-text">
      {/* executor fills one impact sentence */}
    </p>
  </div>
</SectionReveal>
```

**Token usage:** `text-accent` for company name (matches UI-SPEC Work History Contract). `text-text-muted` for dates. `text-text` for title and impact sentence.

**Content note:** Executor must prompt user for previous company names, titles, dates, and one impact sentence per role before implementing. KingsleyGate / Technical Lead is the only known role.

---

### `components/ProjectsSection.tsx` (component/section, Server Component — NEW)

**Analog:** `components/Footer.tsx` (Server Component, multi-item layout) — card style is net-new glassmorphism pattern

**Server Component marker:** No `'use client'`.

**Imports pattern:**
```tsx
import SectionReveal from '@/components/SectionReveal'
```

**Grid wrapper pattern:**
```tsx
<section
  id="projects"
  aria-labelledby="projects-heading"
  className="py-24 scroll-mt-14"
>
  <div className="mx-auto max-w-5xl px-6">
    <h2 id="projects-heading" className="text-2xl font-semibold text-text">Projects</h2>
    <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
```

**Project card pattern** (glassmorphism — no codebase analog, copy from UI-SPEC Card Style Contract):
```tsx
<SectionReveal delay={index * 0.1}>
  <article className="rounded-2xl border border-border/60 bg-surface/60 p-6 backdrop-blur-md transition-colors duration-200 hover:border-border hover:bg-surface/80">
    <h3 className="text-2xl font-semibold text-text">Nekomori</h3>
    <p className="mt-1 text-sm text-text-muted">
      Anime schedule tracker and personal watchlist manager.
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
      {['TypeScript', 'React', 'Node'].map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-border/80 bg-bg px-2 py-1 font-mono text-sm text-accent"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="mt-4 flex gap-4">
      <a
        href="https://nekomori.app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Nekomori live site"
        className="text-sm font-semibold text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Live ↗
      </a>
      <a
        href="https://github.com/yash-278/nekomori"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Nekomori on GitHub"
        className="text-sm font-semibold text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        GitHub ↗
      </a>
    </div>
  </article>
</SectionReveal>
```

**External link pattern** — copy from `components/Footer.tsx` lines 14–19:
```tsx
target="_blank"
rel="noopener noreferrer"
```

**Content note:** Executor must confirm live URLs and exact GitHub repo slugs for Nekomori and Brew Index before hardcoding links.

---

### `components/ContactSection.tsx` (component/section, Server Component — NEW)

**Analog:** `components/Footer.tsx` — EXACT reuse of inline SVG social icon pattern (lines 13–68)

**Server Component marker:** No `'use client'`.

**Imports pattern:** None needed (no imports beyond section metadata — SVGs are inline, no SectionReveal import needed unless animating).

**Social icon link pattern** (copy directly from `components/Footer.tsx` lines 14–19, 33–38, 51–57):
```tsx
<a
  href="https://github.com/yash-278"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub profile"
  className="flex min-h-11 min-w-11 items-center gap-2 p-2 text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={24} height={24}>
    {/* GitHub SVG path — copy verbatim from Footer.tsx line 29 */}
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385..." />
  </svg>
  <span className="text-sm">GitHub</span>
</a>
```

**Contact section structure:**
```tsx
<section
  id="contact"
  aria-labelledby="contact-heading"
  className="py-24 scroll-mt-14"
>
  <div className="mx-auto max-w-5xl px-6">
    <h2 id="contact-heading" className="text-2xl font-semibold text-text">Contact</h2>
    <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
    <SectionReveal>
      <p className="text-base text-text-muted">Find me on the internet.</p>
      <div className="mt-6 flex flex-wrap gap-4">
        {/* GitHub, LinkedIn, X/Twitter icon links */}
      </div>
    </SectionReveal>
  </div>
</section>
```

**SVG paths:** Copy all three SVG paths verbatim from `components/Footer.tsx` lines 29, 47–48, 65–66. These are the exact same icons — no need to re-source them.

**Content note:** Executor must confirm LinkedIn URL with user. Currently `linkedin.com/in/yashkadam` in Footer.tsx — verify this is the correct slug before using.

---

### `components/Navbar.tsx` (component/nav, minor update)

**Analog:** `components/Navbar.tsx` (current — lines 1–34)

**What changes:** Add `'use client'` directive at top, add `usePathname` import and hook call, add active link conditional classes. All layout, Tailwind classes, and JSX structure are preserved.

**Minimal diff — only these lines change:**

Add at top (before line 1):
```tsx
'use client'
```

Change import (line 1):
```tsx
// Before:
import Link from 'next/link'
// After:
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
```

Add hook call (inside function body, before return):
```tsx
const pathname = usePathname()
```

Replace nav link className (lines 19–22 and lines 24–28) with conditional pattern:
```tsx
<Link
  href="/"
  aria-current={pathname === '/' ? 'page' : undefined}
  className={cn(
    'text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    pathname === '/'
      ? 'text-accent border-b-2 border-accent pb-0.5'
      : 'text-text hover:text-accent'
  )}
>
  Home
</Link>
<Link
  href="/blog"
  aria-current={pathname === '/blog' ? 'page' : undefined}
  className={cn(
    'text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    pathname === '/blog'
      ? 'text-accent border-b-2 border-accent pb-0.5'
      : 'text-text hover:text-accent'
  )}
>
  Blog
</Link>
```

**`cn()` import pattern** — matches `lib/utils.ts` exactly:
```tsx
import { cn } from '@/lib/utils'
```

**Critical:** `'use client'` on Navbar is safe — Navbar renders OUTSIDE the `<LazyMotion>` boundary in `app/layout.tsx` (Navbar is above `<main>`, LazyMotion only wraps `<main>`). No `m.*` usage in Navbar — no `motion.*` conflict.

---

### `components/Footer.tsx` (component/footer, minor fix)

**Analog:** `components/Footer.tsx` (current — lines 1–73)

**What changes:** Line 32 only. Remove TODO comment, confirm LinkedIn href.

**Current line 32:**
```tsx
{/* TODO: confirm LinkedIn URL slug */}
```

**Fix:** Remove the TODO comment entirely. Executor must confirm LinkedIn URL slug with user and update `href` on line 34 if the slug is different from `yashkadam`.

**All other lines unchanged** — SVG paths, classes, aria-labels, Twitter/X link all stay as-is.

---

### `app/blog/page.tsx` (component/stub, Server Component — NEW)

**Analog:** `app/page.tsx` (Phase 1 stub — minimal placeholder pattern)

**Pattern from Phase 1 stub (lines 1–5):**
```tsx
// Home page — Phase 1 infrastructure placeholder.
export default function Home() {
  return <div className="min-h-screen" />
}
```

**Phase 2 blog stub (prevents WR-01 404 while Blog ships in Phase 3):**
```tsx
// Blog — coming in Phase 3.
// Stub prevents 404 while Navbar links to /blog.
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-text-muted text-base">Blog posts coming soon.</p>
    </div>
  )
}
```

**Token usage:** `text-text-muted`, `text-base`, `max-w-5xl`, `px-6`, `py-24` — all match the section container pattern established across section components.

---

## Shared Patterns

### Server Component Default
**Source:** `components/Navbar.tsx` (lines 1–34), `components/Footer.tsx` (lines 1–73)
**Apply to:** `HeroSection`, `AboutSection`, `WorkSection`, `ProjectsSection`, `ContactSection`, `app/blog/page.tsx`
```tsx
// NO 'use client' at top of file
// NO React hooks (useState, useEffect, useRef)
// NO framer-motion m.* or motion.* imports
// Framer Motion animations are delegated to SectionReveal client leaf
```

### Container/Layout Pattern
**Source:** `components/Navbar.tsx` line 8, `components/Footer.tsx` line 8
**Apply to:** All section components
```tsx
<div className="mx-auto max-w-5xl px-6">
```

### Section Heading + Accent Line
**Source:** UI-SPEC Section Layout Contract (no existing codebase analog — copy from spec)
**Apply to:** `AboutSection`, `WorkSection`, `ProjectsSection`, `ContactSection`
```tsx
<h2 id="{section}-heading" className="text-2xl font-semibold text-text">
  {Section Name}
</h2>
<div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
```

### External Link Security
**Source:** `components/Footer.tsx` lines 14–19
**Apply to:** All external `<a>` elements in HeroSection, ProjectsSection, ContactSection
```tsx
target="_blank"
rel="noopener noreferrer"
```

### Focus Ring
**Source:** `components/Navbar.tsx` lines 12–15, `components/Footer.tsx` lines 19, 38, 56
**Apply to:** All interactive elements in all new components
```tsx
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

### Touch Target
**Source:** `components/Footer.tsx` lines 19, 38, 56
**Apply to:** Icon-only interactive elements (ContactSection social icons)
```tsx
flex min-h-11 min-w-11 items-center justify-center p-2
```

### Transition Pattern
**Source:** `components/Navbar.tsx` lines 13, 20, 26, `components/Footer.tsx` lines 19, 38, 56
**Apply to:** All hover-state interactive elements
```tsx
transition-colors duration-150
```

### `cn()` for Conditional Classes
**Source:** `lib/utils.ts` lines 1–7
**Apply to:** `components/Navbar.tsx` (active state), any component with conditional Tailwind classes
```tsx
import { cn } from '@/lib/utils'
// Usage:
className={cn('base-classes', condition ? 'active-classes' : 'inactive-classes')}
```

### Inline SVG Icon Pattern
**Source:** `components/Footer.tsx` lines 20–30 (GitHub), 40–49 (LinkedIn), 58–67 (X/Twitter)
**Apply to:** `components/ContactSection.tsx` — copy all three SVG `<path>` elements verbatim from Footer.tsx
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
  width={24}
  height={24}
>
  <path d="..." /> {/* copy verbatim from Footer.tsx */}
</svg>
```

### Scroll Anchor + Offset
**Source:** UI-SPEC Accessibility Contract (no codebase analog yet — establish this pattern)
**Apply to:** All five section elements (`id="hero"`, `id="about"`, `id="work"`, `id="projects"`, `id="contact"`)
```tsx
<section id="{name}" aria-labelledby="{name}-heading" className="... scroll-mt-14">
```
`scroll-mt-14` = 56px offset = Navbar height (`h-14`). Without this, the fixed Navbar covers section headings on anchor jump.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `public/og.png` | static asset | — | Binary asset — no code pattern applies. Create a 1200×630px dark PNG with name + title text. Executor may use a canvas script, screenshot tool, or design app. |
| `components/SectionReveal.tsx` | component (animation) | request-response | No Client animation component exists in the codebase yet — pattern is fully derived from UI-SPEC Animation Contract and `app/layout.tsx` LazyMotion setup |

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `.planning/phases/01-foundation/`
**Files scanned:** 7 (app/layout.tsx, app/globals.css, app/page.tsx, components/Navbar.tsx, components/Footer.tsx, lib/utils.ts, .planning/phases/01-foundation/01-PATTERNS.md)
**Pattern extraction date:** 2026-05-24
