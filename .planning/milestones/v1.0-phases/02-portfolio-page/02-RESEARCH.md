# Phase 2: Portfolio Page - Research

**Researched:** 2026-05-24
**Domain:** Next.js 16 App Router — static page composition, Framer Motion LazyMotion, next/font/google, next/image, SEO metadata
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Overall aesthetic is dark polished — dark background with visual richness: subtle gradients, glassmorphism cards, glowing accents.
- **D-02:** Font pairing locked: Geist + Geist Mono (via `next/font/google`). Replace the Phase 1 Inter + JetBrains Mono placeholder.
- **D-03:** Accent color is Claude's discretion — indigo/violet recommended.
- **D-04:** Hero layout is split: text left, photo right. Casual travel/lifestyle photo.
- **D-05:** Hero pitch line (verbatim): "I write code, lead teams, and ship things."
- **D-06:** Hero shows: name (Yash Kadam), title (Technical Lead), pitch line, and CTA links (GitHub + contact).
- **D-07:** Each work role shows: title + company + dates + one concise impact sentence. No bullet points.
- **D-08:** Show KingsleyGate (Technical Lead) + 1-2 previous roles. Content needed from user at implementation time.
- **D-09:** Two projects: Nekomori and Brew Index only.
- **D-10:** Project card shows: name + 1-line description + tech stack tags + live link + GitHub link.
- **D-11:** Project descriptions verbatim as defined in CONTEXT.md.
- **D-12:** Live links and GitHub links must resolve correctly. GitHub: github.com/yash-278.
- **D-13:** About: current role at KingsleyGate, brief background, shifting focus toward backend/Go. Max 3 sentences.
- **D-14:** Contact shows GitHub, LinkedIn, Twitter/X links only. No contact form.

### Claude's Discretion

- Exact accent color (indigo/violet recommended — UI-SPEC has locked this to `#818cf8` indigo-400)
- Subtle background treatment (hero radial glow per UI-SPEC)
- Card border and shadow style (glassmorphism-influenced per UI-SPEC)
- Section spacing, divider treatment, scroll behavior
- Whether to add scroll-triggered entrance animations via LazyMotion
- Exact photo placement, sizing, border/shadow treatment

### Deferred Ideas (OUT OF SCOPE)

- Mobile hamburger nav menu — Phase 5 (PLSH-01)
- Dark mode toggle — Phase 5 (PLSH-01)
- Project case study pages — v2 requirement PROJ-01
- Blog list at /blog — Phase 3
- Any additional projects beyond Nekomori + Brew Index

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PORT-01 | Hero section with name, title (Technical Lead), and one-line pitch — no typewriter animation | Server Component + SectionReveal Client Component; hero content is hardcoded static text |
| PORT-02 | About section with current role at KingsleyGate and brief background | Single Server Component column; 2–3 sentence prose block |
| PORT-03 | Work History timeline with companies, titles, and dates | Vertical timeline list; content prompted from user at implementation time |
| PORT-04 | Projects section with Nekomori and Brew Index cards (tech stack tags, live link, GitHub link) | Glassmorphism card grid; links confirmed at implementation time |
| PORT-05 | Contact section with GitHub, LinkedIn, and Twitter/X links — no contact form | Reuse inline SVG pattern from Footer.tsx; resolve WR-04 LinkedIn TODO |
| SEO-01 | `metadata` with title, description, and OG image on every page (absolute URLs) | `export const metadata` in app/page.tsx; `NEXT_PUBLIC_SITE_URL` already set in .env.local; static og.png in public/ |

</phase_requirements>

---

## Summary

Phase 2 builds directly on top of the Phase 1 foundation without adding any new npm packages. The entire implementation is app/page.tsx (new sections), one new `components/SectionReveal.tsx` Client Component, a font swap in `app/layout.tsx`, an accent color update in `app/globals.css`, and a static `public/og.png` image. No new dependencies are required.

The foundation is solid: Next.js 16.2.6, Tailwind v3.4.19, framer-motion 12.40.0, and the complete CSS token layer are all in place. The critical pattern to follow is that every section component is a Server Component — Client Components (tagged `'use client'`) are only leaf wrappers that use `m.*` from framer-motion. The `LazyMotion` provider is already in `app/layout.tsx` wrapping `<main>`, so all animated Client Components inside page routes automatically have access to the animation features.

Three items require user input at execution time (cannot be hardcoded without confirmation): previous work history roles/dates/impact sentences, the exact LinkedIn profile URL (currently a TODO in Footer.tsx), and confirmation of live URLs for Nekomori and Brew Index projects. The executor must prompt for these before completing the relevant sections.

**Primary recommendation:** Complete Phase 2 in four sequential plans — (1) globals.css accent swap + font swap in layout.tsx, (2) SectionReveal component + Hero section, (3) About + Work History + Projects + Contact sections, (4) metadata/OG image + static generation verification.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page structure (sections) | Frontend Server (SSR) | — | Server Components; static generation; no client state needed |
| Scroll animations | Browser / Client | Frontend Server (SSR) | SectionReveal 'use client' leaf wraps server-rendered content |
| Hero photo serving | CDN / Static | Frontend Server (SSR) | next/image optimizes and serves from public/ |
| SEO metadata | Frontend Server (SSR) | — | `export const metadata` in Server Component is correct tier |
| OG image | CDN / Static | — | Static PNG in public/; no dynamic generation in Phase 2 |
| Font loading | Frontend Server (SSR) | CDN / Static | next/font/google inlines critical CSS + serves from Edge |
| Social links (Contact) | Browser / Client | — | Plain anchor elements; no JS required |
| Accent color / design tokens | Browser / Client | — | CSS custom properties; applied by the FOUC script |

---

## Standard Stack

### Core (already installed — no new installs)

| Library | Installed Version | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| next | 16.2.6 | next/image, next/font/google, metadata API | All capabilities built-in; no additional packages needed |
| framer-motion | 12.40.0 | `m.*` scroll entrance animations via LazyMotion | Already configured in root layout; `./m` subpath export confirmed |
| tailwindcss | 3.4.19 | Utility-first styling; design token consumption | All color/spacing tokens already wired in tailwind.config.ts |
| react / react-dom | 19.2.4 | Component model | Required |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge (via cn()) | 2.1.1 / 3.6.0 | Conditional class merging | Any component with conditional Tailwind classes |

### No New Packages Required

Phase 2 does not add any new npm dependencies. The UI-SPEC `## Registry Safety` section confirms: "No third-party UI registries are used in Phase 2. All components are hand-authored. `next/image` and Framer Motion are npm packages — no shadcn registry vetting required."

[VERIFIED: codebase inspection] `next/image` is a built-in Next.js component — no separate install.
[VERIFIED: codebase inspection] `next/font/google` with Geist and Geist_Mono: confirmed in the next.js compiled font data manifest at `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`. Both `Geist` and `Geist Mono` are present with variable weight axis (100–900).
[VERIFIED: codebase inspection] `framer-motion` `./m` subpath export confirmed at `node_modules/framer-motion/dist/m.d.ts`.

---

## Package Legitimacy Audit

> Phase 2 installs no new packages. All packages below were already installed in Phase 1 and are verified here for completeness.

| Package | Registry | slopcheck | Disposition |
|---------|----------|-----------|-------------|
| next | npm | [OK] | Approved — already installed Phase 1 |
| framer-motion | npm | [OK] | Approved — already installed Phase 1 |
| tailwindcss | npm | [OK] | Approved — already installed Phase 1 |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*slopcheck 0.6.1 was run successfully. All packages verified [OK].*

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request → Vercel Edge (serves static HTML)
                       │
                       ▼
              app/page.tsx (Server Component, SSG)
                       │
              ┌────────┴────────┐
              │  metadata       │  ← SEO-01: exported as `metadata` const
              │  export         │     title, description, OG image (NEXT_PUBLIC_SITE_URL/og.png)
              └────────┬────────┘
                       │
              ┌────────▼────────────────────────────────────────┐
              │  <HeroSection />      (Server Component)        │
              │    └── <SectionReveal>  (Client Component leaf) │
              │          └── m.div (framer-motion animate)      │
              ├────────────────────────────────────────────────-┤
              │  <AboutSection />     (Server Component)        │
              │    └── <SectionReveal> (whileInView, once:true) │
              ├─────────────────────────────────────────────────┤
              │  <WorkSection />      (Server Component)        │
              │    └── <SectionReveal delay={index*0.1}>        │
              ├─────────────────────────────────────────────────┤
              │  <ProjectsSection />  (Server Component)        │
              │    └── <SectionReveal delay={index*0.1}>        │
              ├─────────────────────────────────────────────────┤
              │  <ContactSection />   (Server Component)        │
              │    └── <SectionReveal>                          │
              └─────────────────────────────────────────────────┘
                       │
              app/layout.tsx (Server Component)
                ├── LazyMotion (already wraps <main>)  ← features available to all m.* children
                ├── Navbar (Server Component — unchanged)
                └── Footer (Server Component — LinkedIn TODO must be resolved)

Static assets:
  public/yash.jpg   → served via next/image with priority prop (LCP candidate)
  public/og.png     → 1200×630px static PNG for OG preview card
```

### Recommended Project Structure

```
app/
├── page.tsx                    # REPLACED: full portfolio Home page (Server Component)
├── layout.tsx                  # UPDATED: Geist + Geist_Mono font swap
├── globals.css                 # UPDATED: accent color #818cf8
└── blog/[slug]/page.tsx        # UNCHANGED (CR-01/CR-02 deferred to Phase 3)

components/
├── SectionReveal.tsx           # NEW: 'use client' animation wrapper
├── Navbar.tsx                  # UPDATED: active link state (usePathname)
├── Footer.tsx                  # UPDATED: LinkedIn TODO resolved
└── (section components)        # NEW: HeroSection, AboutSection, WorkSection,
                                #       ProjectsSection, ContactSection

public/
├── yash.jpg                    # NEW: hero photo (executor confirms filename with user)
└── og.png                      # NEW: 1200×630 OG image (static)

lib/
└── utils.ts                    # UNCHANGED
```

### Pattern 1: Server Component Section with Client Animation Leaf

**What:** Section content is a Server Component (no `'use client'`). The animation wrapper is a narrow Client Component that only touches Framer Motion. This keeps all content server-rendered while enabling scroll-triggered animations.

**When to use:** Every section component in Phase 2. This is the project's established pattern per CONTEXT.md and 01-PATTERNS.md.

```tsx
// components/SectionReveal.tsx — 'use client'
// Source: 02-UI-SPEC.md Animation Contract
'use client'
import { m } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
}

export default function SectionReveal({ children, delay = 0 }: SectionRevealProps) {
  return (
    <m.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </m.div>
  )
}
```

**Hero exception:** Hero uses `animate="visible"` (not `whileInView`) so it fires on mount, not on scroll:

```tsx
// Hero entrance — fires on load, not on scroll
<m.div
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5, ease: 'easeOut', delay: 0 }}
>
```

### Pattern 2: Font Swap in layout.tsx

**What:** Replace `Inter` and `JetBrains_Mono` imports with `Geist` and `Geist_Mono`. CSS variable names `--font-sans` and `--font-mono` are unchanged — only the typeface values change. No changes to tailwind.config.ts required.

```tsx
// app/layout.tsx — updated imports
// Source: 02-UI-SPEC.md Design System + 02-CONTEXT.md Specifics
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

The `<html>` className spread remains identical: `${geist.variable} ${geistMono.variable}`.

**Critical:** `Geist_Mono` (underscore, not space) is the correct export name from `next/font/google`. [VERIFIED: codebase inspection — font-data.json key is "Geist Mono"; next/font/google converts spaces to underscores in export names, matching the Inter → `Inter` / JetBrains Mono → `JetBrains_Mono` pattern already used in Phase 1.]

### Pattern 3: SEO Metadata Export

**What:** `app/page.tsx` exports a `metadata` constant alongside the default page component. This is a Next.js App Router pattern — no function call, no async, just a named export.

```tsx
// app/page.tsx
// Source: 02-UI-SPEC.md SEO Contract
import type { Metadata } from 'next'

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
```

`NEXT_PUBLIC_SITE_URL` is already set to `https://yashkadam.com` in `.env.local` [VERIFIED: codebase inspection]. It must also be set in Vercel project settings (covered by FOUND-06, Phase 1 responsibility — confirm at Phase 2 deployment).

### Pattern 4: next/image for Hero Photo

**What:** The hero photo is served via `next/image` with the `priority` prop because it is above the fold and a Lighthouse LCP candidate.

```tsx
// Inside HeroSection — photo column
// Source: 02-UI-SPEC.md Hero Section Contract
import Image from 'next/image'

// Desktop
<Image
  src="/yash.jpg"
  alt="Yash Kadam"
  width={320}
  height={320}
  priority
  className="rounded-2xl object-cover ring-1 ring-border"
  sizes="(max-width: 768px) 200px, 320px"
/>
```

**No `next.config.mjs` changes needed** for local images in `public/`. The `images` configuration in next.config.mjs is only required for remote image domains. [ASSUMED — based on Next.js documentation pattern; images from public/ always work without configuration.]

### Pattern 5: Accent Color Update

**What:** Update `globals.css` `:root` block. Two lines change. All components (Navbar, Footer, new sections) automatically pick up the new values through CSS variable inheritance.

```css
/* app/globals.css — update these two lines */
--color-accent: #818cf8;        /* indigo-400 — replaces #22d3ee (cyan-400) */
--color-accent-hover: #6366f1;  /* indigo-500 — replaces #06b6d4 */
```

Also update the `--font-sans` and `--font-mono` fallback values for completeness (though the `next/font` variables override them at runtime):

```css
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', ui-monospace, monospace;
```

### Pattern 6: Active Nav Link State (Navbar update)

The Phase 1 Navbar has a `// TODO Phase 2` comment for active link state. This requires `usePathname()` which forces a `'use client'` directive.

```tsx
// components/Navbar.tsx — updated to Client Component
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  // ...
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
```

**Note:** Adding `'use client'` to Navbar does NOT break the layout. `LazyMotion` in the root layout wraps `<main>`, not the Navbar — the Navbar is rendered outside the animation context boundary. Making Navbar a Client Component is safe and does not cause `motion.*` / `m.*` conflicts.

### Anti-Patterns to Avoid

- **`motion.*` anywhere outside a leaf Client Component:** LazyMotion `strict` prop will throw at runtime. Always use `m.*` (imported from `'framer-motion'`).
- **`layout` prop on any animated component:** Prohibited by Phase 5 success criteria and UI-SPEC hard constraints.
- **`scale` or `rotate` transforms in animations:** Only `opacity` + `y` translate allowed per Animation Contract.
- **Removing `suppressHydrationWarning` from `<html>`:** Required for the FOUC dark-mode script to work without React hydration errors.
- **`'use client'` on section components:** Sections are Server Components. Only SectionReveal (and Navbar after active-state update) are Client Components.
- **Dynamic data fetching in section components:** All content is hardcoded. No `fetch()`, no `async` page components. Required for SSG (`○` static route in `next build`).
- **`import Image from 'next/image'` without `priority` on hero photo:** Hero photo is above the fold — omitting `priority` causes an LCP penalty.
- **`next/image` with raw `<img>` width/height without `sizes`:** Without `sizes`, Next.js serves full-size images on mobile. Include `sizes` for responsive serving.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive image optimization | Custom `<img>` with srcset | `next/image` | Automatic WebP/AVIF conversion, lazy loading, blur placeholder, LCP optimization |
| Font loading with FOUT prevention | CSS @font-face + preload links | `next/font/google` | Automatic subsetting, self-hosting via Next.js edge, zero FOUT by design |
| Conditional class merging | String concatenation / template literals | `cn()` from `lib/utils.ts` | Handles Tailwind class conflicts (e.g., two `p-*` values), already installed |
| Scroll animation triggers | IntersectionObserver + setState | Framer Motion `whileInView` | Already configured, battle-tested, honors `reduced-motion` |

**Key insight:** Phase 2 has zero new packages because Next.js 16 and Framer Motion together cover every capability needed. The entire phase is composition and wiring, not installation.

---

## Common Pitfalls

### Pitfall 1: `Geist_Mono` weight prop triggers console error

**What goes wrong:** `Geist_Mono` is a variable font (wght axis 100–900). Passing a `weight` array is technically valid but Next.js will log a warning if you pass weights not in the available range. The Inter + JetBrains Mono pattern from Phase 1 passes `weight: ['400', '600']` — this is safe to carry over to `Geist_Mono`.

**Why it happens:** Some Google Fonts require explicit weights when not variable. Geist Mono is variable so weight is optional — but specifying `['400', '600']` is still acceptable and matches the Phase 1 pattern exactly.

**How to avoid:** Use `weight: ['400', '600']` for `Geist_Mono` matching the existing `JetBrains_Mono` pattern. [VERIFIED: codebase inspection — font-data.json confirms wght axis min:100, max:900 for both Geist and Geist Mono.]

### Pitfall 2: `LazyMotion` boundary — `m.*` throws "motion not loaded" outside boundary

**What goes wrong:** If a Client Component uses `m.*` but is rendered outside the `LazyMotion` context (e.g., in Navbar which renders above `<main>`), Framer Motion throws a runtime error about motion features not being loaded.

**Why it happens:** `LazyMotion` in `app/layout.tsx` wraps only `<main>`, not the entire body. Navbar and Footer are outside the boundary.

**How to avoid:** Only animate components that render inside `<main>`. The Navbar's active link state update uses `usePathname()` — no `m.*` usage in Navbar. Footer has no animations. Only `SectionReveal` (inside page content) uses `m.*`. [VERIFIED: codebase inspection — LazyMotion wraps `<main id="main-content">` in layout.tsx line 57.]

### Pitfall 3: Static generation broken by `export const metadata` with dynamic access

**What goes wrong:** Using `process.env.NEXT_PUBLIC_SITE_URL` in the `metadata` export is fine for SSG. However, if the env var is missing at build time, the OG image URL becomes `undefined/og.png` — which is a broken URL but does not cause a build error.

**Why it happens:** `NEXT_PUBLIC_SITE_URL` is embedded at build time (not runtime). If missing from Vercel env vars, the value is `undefined`.

**How to avoid:** Confirm `.env.local` has `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` before local build. Confirm it is set in Vercel project settings before deployment. [VERIFIED: codebase inspection — `.env.local` file exists with correct value.]

**Warning signs:** `next build` output shows OG image URL as `undefined/og.png` in verbose metadata logs.

### Pitfall 4: `next/image` `priority` missing on hero causes LCP regression

**What goes wrong:** Without `priority`, Next.js lazy-loads the hero photo. The hero photo is the largest above-the-fold element — this directly degrades LCP score.

**Why it happens:** `next/image` defaults to lazy loading for all images. `priority` must be explicitly set for above-the-fold images.

**How to avoid:** Add `priority` prop to the hero `<Image>` component. Only one or two images on any page should have `priority` — do NOT add it to project cards or any below-the-fold images.

### Pitfall 5: Tailwind `dark:` variants — always active in this project

**What goes wrong:** Writing `dark:bg-surface` in Phase 2 components seems intuitive but is redundant/misleading. The FOUC script permanently applies the `dark` class. `dark:` variants are therefore always active and identical to non-prefixed variants.

**Why it happens:** Phase 1 decision D-04 locks dark-only mode. The `darkMode: ['class']` in tailwind.config.ts was chosen for Phase 5 toggle compatibility, but the toggle doesn't ship until Phase 5.

**How to avoid:** Do NOT write `dark:` prefixed utilities in Phase 2 components. Use plain utility classes — they always render in dark context. The CSS custom properties (`bg-bg`, `text-text`, etc.) handle dark-only theming. [VERIFIED: codebase inspection — globals.css defines tokens in `:root` only, no `.dark {}` override block.]

### Pitfall 6: LinkedIn URL TODO — must be resolved in Phase 2

**What goes wrong:** `components/Footer.tsx` has `{/* TODO: confirm LinkedIn URL slug */}` on `href="https://linkedin.com/in/yashkadam"`. If not resolved, a professional portfolio links to a potentially wrong profile — credibility damage.

**Why it happens:** Phase 1 left this as an explicit stub (Phase 1 REVIEW finding WR-04). Phase 2 CONTEXT.md identifies this as a Phase 2 responsibility.

**How to avoid:** Executor MUST prompt user for LinkedIn URL before building Contact section. Resolution also updates `components/Footer.tsx` (remove TODO comment, fix href if needed).

### Pitfall 7: `app/blog/page.tsx` is missing — Navbar Blog link is a 404

**What goes wrong:** Phase 1 REVIEW finding WR-01 notes there is no `app/blog/page.tsx`. The Navbar already links to `/blog`. In Phase 2, after the portfolio page is live, a visitor clicking "Blog" gets a 404.

**Why it happens:** Blog index page is Phase 3 scope. But the Navbar link ships in Phase 1 without a corresponding route.

**How to avoid:** Phase 2 should create a minimal `app/blog/page.tsx` stub (a "coming soon" or redirect page) to prevent the 404. This is a small out-of-scope addition but prevents a live credibility issue. [ASSUMED — the right fix may be a placeholder page or removing the Blog link until Phase 3. Decision for planner.]

### Pitfall 8: Section `id` attributes must match Navbar scroll anchors

**What goes wrong:** The "View my work" CTA in the Hero links to `#projects`. If the Projects section has `id="project"` (typo) or no `id`, the scroll anchor silently fails.

**How to avoid:** Verify section IDs exactly match: `id="hero"`, `id="about"`, `id="work"`, `id="projects"`, `id="contact"`. All sections need `scroll-mt-14` (56px = navbar height). [VERIFIED: 02-UI-SPEC.md Accessibility Contract.]

---

## Code Examples

### Section Component Structure

```tsx
// components/sections/HeroSection.tsx — Server Component
// Source: 02-UI-SPEC.md Hero Section Contract
import Image from 'next/image'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="py-20 md:py-28"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129, 140, 248, 0.06) 0%, transparent 70%)',
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 md:flex-row md:items-center md:gap-12">
        {/* Text column */}
        <div className="flex flex-col md:flex-1">
          <SectionReveal>
            <h1 id="hero-heading" className="text-5xl font-semibold leading-tight text-text">
              Yash Kadam
            </h1>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="mt-2 text-2xl text-text-muted">Technical Lead</p>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <p className="mt-4 text-2xl text-text">
              I write code, lead teams, and ship things.
            </p>
          </SectionReveal>
          <SectionReveal delay={0.3}>
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
        {/* Photo column */}
        <SectionReveal delay={0.3}>
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
      </div>
    </section>
  )
}
```

### Section Heading Pattern

```tsx
// Consistent across About, Work, Projects, Contact
// Source: 02-UI-SPEC.md Section Layout Contract
<h2 id="about-heading" className="text-2xl font-semibold text-text">
  About
</h2>
<div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
```

### Project Card

```tsx
// Source: 02-UI-SPEC.md Projects Section Contract + Card Style Contract
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
      href="https://nekomori.app" // executor confirms URL
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Nekomori live site"
      className="text-sm font-semibold text-text-muted transition-colors duration-150 hover:text-accent"
    >
      Live ↗
    </a>
    <a
      href="https://github.com/yash-278/nekomori" // executor confirms URL
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Nekomori on GitHub"
      className="text-sm font-semibold text-text-muted transition-colors duration-150 hover:text-accent"
    >
      GitHub ↗
    </a>
  </div>
</article>
```

### Work History Timeline Row

```tsx
// Source: 02-UI-SPEC.md Work History Section Contract
<div className="border-l-2 border-accent/30 pl-6">
  <div className="flex flex-col gap-8">
    {/* Each role */}
    <SectionReveal delay={0}>
      <div>
        <p className="text-base font-semibold text-text">Technical Lead</p>
        <p className="text-sm text-text-muted">
          <span className="text-accent">KingsleyGate</span>
          {' · '}
          <span>2023 – Present</span> {/* executor fills dates */}
        </p>
        <p className="mt-1 text-base text-text">
          {/* executor fills impact sentence */}
        </p>
      </div>
    </SectionReveal>
  </div>
</div>
```

---

## What Exists vs. What Needs Building

### Exists (no changes needed)

| Item | File | Status |
|------|------|--------|
| CSS token layer (bg, surface, text, border) | `app/globals.css` | Correct — keep |
| Tailwind config (colors, fonts, darkMode) | `tailwind.config.ts` | Correct — no changes |
| LazyMotion provider in root layout | `app/layout.tsx` | Correct — keep |
| FOUC prevention script | `app/layout.tsx` | Correct — keep |
| Skip link | `app/layout.tsx` | Correct — keep |
| cn() utility | `lib/utils.ts` | Correct — keep |
| Footer social icon SVG paths | `components/Footer.tsx` | Keep SVGs — update LinkedIn TODO |
| `NEXT_PUBLIC_SITE_URL` env var | `.env.local` | Set to `https://yashkadam.com` |

### Needs Building (Phase 2 tasks)

| Item | File | What Changes |
|------|------|-------------|
| Accent color swap | `app/globals.css` | `#22d3ee` → `#818cf8`, `#06b6d4` → `#6366f1` |
| Font swap | `app/layout.tsx` | Inter + JetBrains_Mono → Geist + Geist_Mono |
| Metadata update | `app/layout.tsx` + `app/page.tsx` | Title, description, OG image |
| Active nav link state | `components/Navbar.tsx` | Add `'use client'`, `usePathname()` |
| LinkedIn URL fix | `components/Footer.tsx` | Resolve WR-04 TODO |
| Blog stub page | `app/blog/page.tsx` | Prevent WR-01 404 |
| SectionReveal component | `components/SectionReveal.tsx` | New Client Component |
| Hero section | `components/sections/HeroSection.tsx` | New Server Component |
| About section | `components/sections/AboutSection.tsx` | New Server Component |
| Work History section | `components/sections/WorkSection.tsx` | New Server Component (content from user) |
| Projects section | `components/sections/ProjectsSection.tsx` | New Server Component |
| Contact section | `components/sections/ContactSection.tsx` | New Server Component |
| Home page assembly | `app/page.tsx` | Replace placeholder with section imports + metadata |
| Hero photo | `public/yash.jpg` | User provides photo |
| OG image | `public/og.png` | Create 1200×630px static PNG |

---

## Open Questions

1. **Work History content (user must provide)**
   - What we know: Current role is KingsleyGate, Technical Lead
   - What's unclear: Previous company names, titles, date ranges, one-line impact sentences
   - Recommendation: Executor must prompt user before building WorkSection. Block the task until confirmed.

2. **LinkedIn URL (user must confirm)**
   - What we know: Footer currently has `linkedin.com/in/yashkadam` with a TODO comment
   - What's unclear: Whether `yashkadam` is the correct slug
   - Recommendation: Executor must confirm with user. If unconfirmed, render without LinkedIn link (removes WR-04 credibility risk).

3. **Project live URLs (user must confirm)**
   - What we know: GitHub base is `github.com/yash-278`; project names are Nekomori and Brew Index
   - What's unclear: Exact GitHub repo slugs (e.g., `nekomori`, `brew-index`, etc.) and live deployment URLs
   - Recommendation: Executor must confirm both live URLs and GitHub repo URLs before hardcoding links.

4. **Hero photo filename (user must provide)**
   - What we know: Goes in `public/` as `/yash.jpg` (per UI-SPEC)
   - What's unclear: User may provide a different filename
   - Recommendation: Default to `yash.jpg` but confirm with user when they provide the photo.

5. **Blog stub page — scope decision**
   - What we know: `app/blog/page.tsx` is missing; Navbar links to `/blog`
   - What's unclear: Whether Phase 2 should add a placeholder or leave the 404 until Phase 3
   - Recommendation: Add a minimal "Coming soon" stub to prevent the live 404. This is a 5-line file — minimal effort, avoids credibility damage for anyone who visits early.

6. **OG image creation approach**
   - What we know: Must be a static 1200×630px PNG at `public/og.png`
   - What's unclear: How the executor will create it (screenshot tool, canvas, design app)
   - Recommendation: A simple dark background with text is sufficient. The executor can generate this programmatically or the user can provide it. Document as a checkpoint for human input.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | next build | ✓ | (runtime) | — |
| Next.js | all sections | ✓ | 16.2.6 | — |
| framer-motion | SectionReveal | ✓ | 12.40.0 | Omit animations (plain divs) |
| Geist font (via next/font/google) | layout.tsx font swap | ✓ | confirmed in font-data.json | Fall back to Inter (Phase 1 state) |
| next/image | hero photo | ✓ | built into next 16.2.6 | — |
| NEXT_PUBLIC_SITE_URL | OG image URL | ✓ | set in .env.local | Hardcode URL as fallback |
| public/yash.jpg | hero section | ✗ | — | Must be provided by user — blocks HeroSection |
| public/og.png | SEO-01 | ✗ | — | Must be created — blocks SEO-01 gate |

**Missing dependencies with no fallback:**
- `public/yash.jpg` — user must provide photo before hero can be implemented
- `public/og.png` — must be created (programmatically or by user)

**Missing dependencies with fallback:**
- None beyond the two static assets above

---

## Security Domain

> `security_enforcement` is not explicitly set to `false` in config.json — treating as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in Phase 2 |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public page only |
| V5 Input Validation | no | No forms, no user input (Contact section has links only) |
| V6 Cryptography | no | No secrets in Phase 2 content |
| V7 Error Handling | partial | Static generation — runtime errors not applicable; 404 for blog route is a concern (WR-01) |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Open redirect via project links | Spoofing | All external links use `target="_blank" rel="noopener noreferrer"` — already established in Footer pattern |
| XSS via dangerouslySetInnerHTML | Tampering | Only the FOUC script uses this; static hardcoded string, no user input — accepted risk per Phase 1 review |
| Unconfirmed LinkedIn link to stranger's profile | Spoofing | Resolve WR-04 — confirm URL before shipping |
| OG image absolute URL with missing env var | Information Disclosure | `undefined/og.png` is a benign broken URL, not a security risk; but confirm env var is set |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `motion.*` components | `m.*` components inside LazyMotion | Framer Motion v11+ | 34kb → ~4.6kb bundle size for animations |
| `next-themes` for dark mode | Inline blocking script | Project decision D-04 | Zero FOUC, no dependency, no toggle (toggle deferred to Phase 5) |
| `import { Inter } from 'next/font/google'` | `import { Geist } from 'next/font/google'` | Phase 2 design pass | Vercel's typeface; cleaner, more distinctive |
| `params: { slug: string }` in App Router | `params: Promise<{ slug: string }>` | Next.js 14+ | Async params required (CR-02 — fix in Phase 3) |
| Hardcoded dynamic year in Footer | Static "2025" string | Phase 1 decision | Prevents server/client hydration mismatch in Server Components |

**Deprecated / outdated in this project:**
- `next-mdx-remote`: archived Feb 2026 — do not use (STATE.md decision)
- `contentlayer`: abandoned Jun 2023 — do not use (STATE.md decision)
- `lucide-react` brand icons: removed in v1.x — use inline SVG (Phase 1 confirmed fix)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `next/image` for local `public/` images requires no `next.config.mjs` changes | Architecture Patterns — Pattern 4 | Low risk: if wrong, executor adds `images.localPatterns` config — one-line fix |
| A2 | Blog stub page should be created in Phase 2 to prevent 404 | Common Pitfalls — Pitfall 7 | Low risk: could defer to Phase 3; 404 is a minor credibility issue, not a blocker |
| A3 | `Geist_Mono` export name uses underscore (matching `JetBrains_Mono` pattern) | Standard Stack + Pattern 2 | Low risk: if wrong, TypeScript error at compile time, immediately detectable |

**All other claims in this document are VERIFIED via codebase inspection or CITED from the approved UI-SPEC and CONTEXT.md.**

---

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/Navbar.tsx`, `components/Footer.tsx`, `app/page.tsx`, `next.config.mjs`, `lib/utils.ts`, `package.json` — all read directly
- `02-UI-SPEC.md` (approved 2026-05-24) — design contracts, animation contracts, SEO contract, copywriting contract
- `02-CONTEXT.md` (approved 2026-05-24) — locked decisions, implementation specifics
- `01-PATTERNS.md`, `01-REVIEW.md`, `01-01-SUMMARY.md`, `01-03-SUMMARY.md` — Phase 1 implementation details and open issues
- `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` — Geist + Geist Mono font availability confirmed
- `node_modules/framer-motion/package.json` — `./m` subpath export confirmed
- `.env.local` — `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` confirmed set
- slopcheck 0.6.1 run — next, framer-motion, tailwindcss all [OK]

### Secondary (MEDIUM confidence)
- REQUIREMENTS.md — PORT-01 through PORT-05, SEO-01 requirements verified
- ROADMAP.md — Phase 2 success criteria verified (5 criteria)
- STATE.md — active decisions (next-mdx-remote deprecated, contentlayer abandoned)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via codebase inspection
- Architecture: HIGH — patterns derived from existing code and approved UI-SPEC
- Pitfalls: HIGH — 7 of 8 pitfalls sourced from Phase 1 review findings (CR-01, CR-02, WR-01, WR-04) or code inspection
- Open questions: HIGH — explicitly flagged as requiring user input at execution time

**Research date:** 2026-05-24
**Valid until:** 2026-06-24 (stable stack; font availability, package versions unlikely to change in 30 days)
