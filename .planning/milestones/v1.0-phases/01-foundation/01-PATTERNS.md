# Phase 1: Foundation - Pattern Map

**Mapped:** 2026-05-24
**Files analyzed:** 9 new/modified files
**Analogs found:** 5 / 9

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/layout.tsx` | layout (root) | request-response | `origin/v2:app/layout.tsx` | role-match (structure reused, contents replaced) |
| `app/globals.css` | config/style | transform | `origin/v2:app/globals.css` | role-match (token strategy differs: hex vars vs HSL Shadcn vars) |
| `app/page.tsx` | component (page) | request-response | `origin/v2:app/page.tsx` | role-match (placeholder shell pattern) |
| `components/Navbar.tsx` | component (UI) | request-response | none — net-new | no analog |
| `components/Footer.tsx` | component (UI) | request-response | none — net-new | no analog |
| `lib/utils.ts` | utility | transform | `origin/v2:lib/utils.ts` | exact (port verbatim) |
| `mdx-components.tsx` | config | transform | none — net-new | no analog |
| `next.config.mjs` | config | transform | `origin/v2:next.config.mjs` | role-match (ESM format reused, MDX options added) |
| `tailwind.config.ts` | config | transform | `origin/v2:tailwind.config.ts` | role-match (TS format reused, Shadcn contents replaced) |

---

## Pattern Assignments

### `app/layout.tsx` (layout, request-response)

**Analog:** `origin/v2:app/layout.tsx`

**What to reuse vs replace:**
- Reuse: `import type { Metadata }` pattern, `next/font/google` loading with CSS variable assignment, `cn()` import, ESM module structure, `metadata` export object shape.
- Replace: All 4 font declarations → 2 fonts only (Inter + JetBrains Mono). Body element → move font variables to `<html>`. Add inline FOUC script, `LazyMotion` wrapper, `Navbar`, `Footer`. Remove Shadcn class names (`bg-background`, `font-sans` from Shadcn context).

**Imports pattern** (v2 lines 1-4 — reuse structure, replace names):
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
```
Note: v2 uses `../lib/utils` relative path. Phase 1 uses `@/` alias from `tsconfig.json` (`"paths": { "@/*": ["./*"] }`).

**Font loading pattern** (v2 lines 6-25 — reuse shape, use 2 fonts only):
```tsx
// v2 analog: origin/v2:app/layout.tsx lines 6-25
// Phase 1 version — 2 fonts, both expose CSS variables, both on <html>
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
});
```
The v2 pattern of assigning `variable` per font and spreading them onto the root element is correct. Do NOT duplicate variable names as v2 does (both `inter` and `fira` used `--font-sans`).

**Metadata export pattern** (v2 lines 27-30 — reuse verbatim shape):
```tsx
// v2 analog: origin/v2:app/layout.tsx lines 27-30
export const metadata: Metadata = {
  title: "Yash Kadam",
  description: "Technical Lead and fullstack developer",
};
```

**Root layout JSX pattern** (v2 lines 32-44 — reuse shape, restructure):
```tsx
// v2 analog: origin/v2:app/layout.tsx lines 32-44
// Phase 1 version — fonts on <html>, FOUC script, Navbar, LazyMotion, Footer
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* FOUC prevention — must be FIRST in <head>, no defer/async */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('dark')",
          }}
        />
      </head>
      <body className="bg-bg text-text font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:text-accent"
        >
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
    </html>
  );
}
```
v2 spread font variables on `<body>` — Phase 1 moves them to `<html>` so CSS variable scope covers the entire document (required for `:root` CSS var inheritance).

---

### `app/globals.css` (config/style, transform)

**Analog:** `origin/v2:app/globals.css`

**What to reuse vs replace:**
- Reuse: `@tailwind base/components/utilities` directive order (v2 lines 1-3). The `@layer base` wrapper pattern.
- Replace: All Shadcn HSL variables → flat hex CSS variables per UI-SPEC. Remove `.dark {}` block — dark is the only mode in Phase 1. Add `--font-*` vars (v2 did not declare these in CSS).

**Tailwind directive pattern** (v2 lines 1-3 — copy verbatim):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Token declaration pattern** (v2 used `@layer base { :root {...} .dark {...} }` — Phase 1 simplification):
```css
/* Phase 1: dark-only, flat hex tokens under :root — no .dark {} block */
/* Source: UI-SPEC 01-UI-SPEC.md */
@layer base {
  :root {
    --color-bg: #0a0a0a;
    --color-surface: #111111;
    --color-text: #e4e4e7;
    --color-text-muted: #71717a;
    --color-border: #27272a;
    --color-accent: #22d3ee;
    --color-accent-hover: #06b6d4;
    --color-destructive: #ef4444;
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  }
}
```
Do NOT use `hsl(var(...))` pattern from v2 — that is Shadcn-specific. Phase 1 uses direct hex values.

---

### `app/page.tsx` (component/page, request-response)

**Analog:** `origin/v2:app/page.tsx`

**What to reuse vs replace:**
- Reuse: Default export function pattern, Server Component (no `'use client'`), minimal JSX shell.
- Replace: Remove `HomeHero` import (dropped in Phase 1). Body is a placeholder — single `<div>` or empty fragment until Phase 2 hero lands.

**Page shell pattern** (v2 lines 1-10 — use shape only):
```tsx
// v2 analog: origin/v2:app/page.tsx lines 1-10
// Phase 1: placeholder only — no hero, no sections
export default function Home() {
  return (
    <div className="min-h-screen" />
  );
}
```
No imports needed in Phase 1 placeholder. Do not import or render `HomeHero` or `BackgroundGradientAnimation` (decision D-02).

---

### `lib/utils.ts` (utility, transform)

**Analog:** `origin/v2:lib/utils.ts`

**Port verbatim — no changes:**
```typescript
// origin/v2:lib/utils.ts — port exactly as-is
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
The only change is the import style can stay as double quotes (matching v2 convention). Both `clsx` and `tailwind-merge` are in the Phase 1 dependency list.

---

### `next.config.mjs` (config, transform)

**Analog:** `origin/v2:next.config.mjs`

**What to reuse vs replace:**
- Reuse: `.mjs` extension (ESM format), `/** @type */` JSDoc annotation pattern, `export default` at end.
- Replace: Empty `nextConfig` → add `pageExtensions` and `experimental.mdxRs: false`. Wrap with `createMDX` + `rehypePrettyCode`.

**ESM config shell pattern** (v2 lines 1-4 — reuse format):
```javascript
// v2 analog: origin/v2:next.config.mjs lines 1-4
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

**Phase 1 expanded version** (RESEARCH.md Pattern 1 — MDX pipeline):
```javascript
// Phase 1 version — MDX + rehype-pretty-code, Turbopack-safe
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false,   // REQUIRED: Turbopack cannot serialize rehype plugin objects
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypePrettyCode, {
        theme: 'github-dark-dimmed',   // string name only — NOT an imported object
        keepBackground: false,
      }],
    ],
  },
})

export default withMDX(nextConfig)
```
Critical: `theme` must be a string. Passing `import theme from 'shiki/themes/...'` will crash Turbopack.

---

### `tailwind.config.ts` (config, transform)

**Analog:** `origin/v2:tailwind.config.ts`

**What to reuse vs replace:**
- Reuse: TypeScript `satisfies Config` pattern (line 1 — `import type { Config }`), `content` glob array structure, `darkMode: ["class"]` declaration, `fontFamily` extension under `theme`, `export default config` at end.
- Replace: Remove all Shadcn color tokens (HSL vars) → flat hex custom property references. Remove Radix/accordion keyframes. Remove `tailwindcss-animate` plugin. Replace multi-font family declarations with 2-font setup. Remove Shadcn `container` config.

**TypeScript config header** (v2 line 1-2 — copy exactly):
```typescript
// v2 analog: origin/v2:tailwind.config.ts lines 1-2
import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");
```

**darkMode declaration** (v2 line 4 — copy exactly):
```typescript
// v2 analog: origin/v2:tailwind.config.ts line 4
darkMode: ["class"],
```
Note: CONTEXT.md discretion section mentions `darkMode: 'class'` (string). v2 uses array form `["class"]`. Both are valid in Tailwind v3. Use v2's array form for consistency.

**content paths** (v2 lines 5-10 — reuse verbatim):
```typescript
// v2 analog: origin/v2:tailwind.config.ts lines 5-10
content: [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
],
```

**Phase 1 full config shape** (replaces Shadcn contents):
```typescript
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        border: "var(--color-border)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        destructive: "var(--color-destructive)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
```
Remove `tailwindcss-animate` plugin (it was a Shadcn dependency). Remove all Radix/accordion keyframes. The `fontFamily.sans/mono` spread from `defaultTheme` provides system fallbacks.

---

### `components/Navbar.tsx` (component/UI, request-response)

**Analog:** None in codebase — net-new.

**Pattern source:** RESEARCH.md code examples + UI-SPEC Navbar Contract.

**Implementation pattern** (derived from RESEARCH.md + UI-SPEC):
```tsx
// No codebase analog — follow RESEARCH.md + UI-SPEC contract
// Server Component — no 'use client'
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-surface backdrop-blur-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-5xl items-center justify-between px-6"
      >
        {/* Logo / site name — left */}
        <Link
          href="/"
          className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent"
        >
          Yash Kadam
        </Link>

        {/* Nav links — right */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
}
```
Key constraints from UI-SPEC: `h-14` height, `bg-surface` + `border-b border-border`, `backdrop-blur-sm`, `max-w-5xl mx-auto px-6` container, `text-sm font-semibold`, `hover:text-accent` with `transition-colors duration-150`, no `motion.*` imports in Phase 1.

Active link state (current page accent + 2px bottom border) requires `usePathname()` from `'next/navigation'` — that makes it a Client Component. Planner may choose to either: (a) add `'use client'` to Navbar for active state tracking, or (b) defer active state to Phase 2 and keep Navbar a Server Component. Decision is left to planner.

---

### `components/Footer.tsx` (component/UI, request-response)

**Analog:** None in codebase — net-new.

**Pattern source:** RESEARCH.md + UI-SPEC Footer Contract.

**Implementation pattern** (derived from RESEARCH.md + UI-SPEC):
```tsx
// No codebase analog — follow RESEARCH.md + UI-SPEC contract
// Server Component — no 'use client', no motion.* imports
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        {/* Name + copyright — left */}
        <div>
          <p className="text-base text-text">Yash Kadam</p>
          <p className="text-sm text-text-muted">© 2025 Yash Kadam</p>
        </div>

        {/* Social icons — right */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/yash-278"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="min-h-11 min-w-11 flex items-center justify-center p-2 text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Github size={20} aria-hidden="true" />
          </a>
          <a
            href="https://linkedin.com/in/yashkadam" /* TODO: confirm LinkedIn URL */
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="min-h-11 min-w-11 flex items-center justify-center p-2 text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Linkedin size={20} aria-hidden="true" />
          </a>
          <a
            href="https://twitter.com/yashkadam278"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) profile"
            className="min-h-11 min-w-11 flex items-center justify-center p-2 text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Twitter size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```
Key constraints from UI-SPEC: `border-t border-border bg-surface`, `py-8 px-6`, `max-w-5xl mx-auto`, `min-h-11 min-w-11` (44px touch target), `target="_blank" rel="noopener noreferrer"` on all social links (tab-napping prevention), `aria-label` on each icon link, `aria-hidden="true"` on SVG icons.

---

### `mdx-components.tsx` (config, transform)

**Analog:** None in codebase — net-new.

**Pattern source:** RESEARCH.md Pattern 5 — port verbatim from official docs pattern.

**Implementation pattern:**
```tsx
// No codebase analog — required by @next/mdx App Router
// Must be at project root (same level as app/) — NOT inside app/
// Source: nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
```
This is the minimum required stub. Phase 3 will expand it with custom `pre`, `code`, `h1`, `h2` etc. components. Do not add custom components in Phase 1.

---

## Shared Patterns

### `cn()` Utility — Used by all component files
**Source:** `origin/v2:lib/utils.ts` (port verbatim to `lib/utils.ts`)
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
**Apply to:** `components/Navbar.tsx`, `components/Footer.tsx`, and any future component with conditional class logic.
**Import pattern:** `import { cn } from "@/lib/utils"` (uses `@/*` alias from tsconfig).

### TypeScript Strict Mode — All `.ts` and `.tsx` files
**Source:** `origin/v2:tsconfig.json` — `"strict": true`
```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./*"] }
  }
}
```
**Apply to:** All files. The `@/*` path alias is available for all imports. Use it for cross-directory imports (`@/components/...`, `@/lib/...`).

### Server Component Default — No `'use client'` unless animated
**Source:** RESEARCH.md Architecture Patterns + Pitfall 6
**Apply to:** `app/layout.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`, `app/page.tsx`, `mdx-components.tsx`
Rule: Do NOT add `'use client'` to any Phase 1 file unless it uses React hooks or browser APIs. `LazyMotion` does not require the layout to be a Client Component.

### `target="_blank"` Security Pattern — All external links
**Source:** UI-SPEC Accessibility Contract + RESEARCH.md security notes
```tsx
<a href="https://..." target="_blank" rel="noopener noreferrer">
```
**Apply to:** All social icon links in `components/Footer.tsx`. Required — prevents tab-napping.

### Focus Visible Ring — All interactive elements
**Source:** UI-SPEC Accessibility Contract
```tsx
className="... focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
```
**Apply to:** All `<Link>` and `<a>` elements in Navbar and Footer.

### ESM Config Format — Config files
**Source:** `origin/v2:next.config.mjs` and `origin/v2:postcss.config.mjs`
```javascript
// Use .mjs extension, not .js or .ts, for config files
export default config;  // ESM export, not module.exports
```
**Apply to:** `next.config.mjs`, `postcss.config.mjs`. The `.mjs` extension signals Node.js ESM mode without needing `"type": "module"` in package.json.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/Navbar.tsx` | component/UI | request-response | No Navbar exists in v2 branch or current codebase — v2 had no navigation component |
| `components/Footer.tsx` | component/UI | request-response | No Footer exists in v2 branch or current codebase |
| `mdx-components.tsx` | config | transform | MDX was not configured in v2 branch — net-new infrastructure |

For these three files, use the implementation patterns documented in the Pattern Assignments section above, which are derived from RESEARCH.md official source patterns and UI-SPEC contracts.

---

## v2 Branch — What to Port vs Discard

| v2 File | Port? | What Changes |
|---------|-------|-------------|
| `app/layout.tsx` | Structure only | Replace 4 fonts with 2; move font vars to `<html>`; add FOUC script, LazyMotion, Navbar, Footer |
| `app/globals.css` | Format only | Replace Shadcn HSL tokens with flat hex tokens per UI-SPEC; remove `.dark {}` block |
| `app/page.tsx` | Shell only | Remove HomeHero; stub placeholder |
| `lib/utils.ts` | Verbatim | No changes — port as-is |
| `next.config.mjs` | Format only | Add MDX pipeline (createMDX + rehypePrettyCode) |
| `tailwind.config.ts` | Format + darkMode | Replace Shadcn colors/plugins with Phase 1 token map; simplify fontFamily |
| `postcss.config.mjs` | Verbatim | No changes needed — standard PostCSS config |
| `tsconfig.json` | Verbatim | Carry forward as-is — `@/*` alias, strict mode, bundler moduleResolution |
| `components/Home/HomeHero.tsx` | Drop | Decision D-02 — BackgroundGradientAnimation dropped |
| `components/ui/background-gradient-animation.tsx` | Drop | Decision D-02 — dropped entirely |

---

## Metadata

**Analog search scope:** `origin/v2` branch (all 8 tracked files)
**Files scanned:** 8 (v2 branch) + current repo root
**Pattern extraction date:** 2026-05-24
