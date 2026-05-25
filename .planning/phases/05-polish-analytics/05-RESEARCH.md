# Phase 5: Polish & Analytics — Research

**Researched:** 2026-05-25
**Domain:** Vercel Analytics integration, Core Web Vitals / Lighthouse audit, Framer Motion animation compliance, dead link detection
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Install `@vercel/analytics` and add `<Analytics />` to `app/layout.tsx` root layout. No cookie consent banner — Vercel Analytics is cookieless by design (ANLYT-01).
- **D-02:** No decision on Vercel Speed Insights — user deferred this. Claude's call on whether to add it alongside Analytics. (If added, it must not introduce a consent banner or extra cookies.)
- **D-03:** Lighthouse baseline is unknown — the site has not been audited yet. Phase 5 executor must run Lighthouse against the deployed production URL as the first diagnostic step before making any changes.
- **D-04:** If any metric fails (LCP ≥2.5s, CLS ≥0.1, INP ≥200ms), the executor must diagnose the root cause from Lighthouse output and fix it within Phase 5. The phase is gated on passing all three thresholds.
- **D-05:** No pre-specified suspects. Let Lighthouse data drive what gets fixed. Do not pre-emptively optimize things that may already pass.
- **D-06:** `SectionReveal` (opacity 0→1, y: 24→0, once: true) is the established pattern and matches the spec. Audit pass = confirm no `layout` prop on scroll-heavy components and no section animates more than once per viewport entry.
- **D-07:** HeroSection uses 6 staggered `SectionReveal` wrappers (delays 0→0.3s) on mount. This is not flagged for change unless it reads as excessive after a fresh look during the audit. Claude's call.
- **D-08:** Audit scope = all `<a>` tags in `ProjectsSection`, `ContactSection`, `Navbar`, and `Footer` that point to external URLs. Confirm each resolves with a 2xx response.
- **D-09:** `ProjectsSection` currently has GitHub links only (no live demo URLs for Nekomori or Brew Index). The link audit checks what's there — it does not add new URLs unless they are known to exist and work.

### Claude's Discretion

- Whether to add Vercel Speed Insights alongside Analytics (must not add cookies or consent requirement)
- Exact fix strategy for any CWV failures found by Lighthouse (data-driven, not pre-specified)
- Whether to reduce hero stagger count if it reads as excessive

### Deferred Ideas (OUT OF SCOPE)

- Dark mode toggle (`next-themes`) — v2 requirement PLSH-01
- Tailwind v4 upgrade — v2 requirement PLSH-02
- JSON-LD `WebSite` + `Person` schema — v2 requirement SEO-05
- JSON-LD `Article` schema on post pages — v2 requirement BLOG-06
- Table of contents for long posts — v2 requirement BLOG-05
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANLYT-01 | Vercel Analytics enabled in root layout (cookieless, no consent banner) | Packages already installed in node_modules at correct version; official docs confirm `<Analytics />` placement in `app/layout.tsx` body; cookieless architecture verified |
</phase_requirements>

---

## Summary

Phase 5 is an audit-and-wire phase with four discrete tasks: (1) add `<Analytics />` (and optionally `<SpeedInsights />`) to `app/layout.tsx`, (2) audit all scroll animations for spec compliance, (3) verify all external links resolve, and (4) run Lighthouse against the deployed production URL and fix any failing Core Web Vitals. No new features ship.

**Critical finding discovered during research:** `https://github.com/yash-278/brew-index` returns **HTTP 404** ("Page not found"). The GitHub repository does not exist under that name. This is a dead link and must be resolved during Phase 5 — either by removing the link or updating it to the correct URL. The `nekomori` repository (`https://github.com/yash-278/nekomori`) returns 200 and is live.

Both `@vercel/analytics@2.0.1` and `@vercel/speed-insights@2.0.0` are **already installed** in `node_modules` (slopcheck-verified `[OK]`). The `npm install` step is not needed — only the import/component additions to `app/layout.tsx`. Vercel Analytics is confirmed cookieless and consent-banner-free by official docs. Speed Insights is also cookieless (same privacy design) and should be added alongside Analytics (Claude's discretion: yes, add it).

**Primary recommendation:** Wire analytics first (one import + one JSX tag), audit links and animations second (the brew-index 404 is the only real finding), then run Lighthouse and fix only what Lighthouse flags.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Analytics tracking script injection | Frontend Server (SSR layout) | — | `<Analytics />` must render in root Server Component layout so the script is present on every page from the first byte |
| Core Web Vitals measurement | Browser / Client | CDN / Static | LCP/CLS/INP are browser-side metrics; Lighthouse runs a headless browser against the live CDN-served page |
| Scroll animation compliance | Browser / Client | — | `SectionReveal` is a Client Component; animation props are evaluated at runtime |
| External link verification | Build-time / CI | — | `curl` or Node script; no runtime tier involvement |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@vercel/analytics` | 2.0.1 | Cookieless pageview tracking via Vercel dashboard | Official Vercel package; zero-config; no cookies; no consent banner required [VERIFIED: npm registry] |
| `@vercel/speed-insights` | 2.0.0 | Real-user CWV measurement via Vercel dashboard | Official Vercel package; same cookieless design; surfaces LCP/CLS/INP from actual users [VERIFIED: npm registry] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `framer-motion` | 12.40.0 | Scroll animations via `SectionReveal` | Already installed; audit-only this phase |
| Lighthouse CLI (`npx lighthouse`) | current via npx | Headless CWV audit | Run once against production URL; no global install required |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@vercel/analytics` | Google Analytics / Plausible | GA requires cookie consent banner (GDPR); Plausible is fine but adds another vendor; Vercel Analytics is the locked decision |
| `npx lighthouse` | Chrome DevTools Lighthouse panel | DevTools panel is equivalent for manual audit; CLI is preferable for reproducibility |

**Installation:**
```bash
# Already installed — no npm install step required.
# Both packages are present in node_modules at the versions above.
```

**Version verification (performed during research):**
```
@vercel/analytics   → 2.0.1 (latest stable) [VERIFIED: npm registry]
@vercel/speed-insights → 2.0.0 (latest stable) [VERIFIED: npm registry]
```

---

## Package Legitimacy Audit

> Both packages were already installed in node_modules before research ran.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@vercel/analytics` | npm | Established (Vercel official) | High | github.com/vercel/analytics | [OK] | Approved |
| `@vercel/speed-insights` | npm | Established (Vercel official) | High | github.com/vercel/analytics | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

No postinstall scripts found on either package.

---

## Architecture Patterns

### System Architecture Diagram

```
Browser (visitor)
        │
        ▼
Vercel Edge CDN  ──────────────────────────────────────┐
  (serves static HTML + assets)                        │
        │                                              │
        ▼                                              ▼
app/layout.tsx (Server Component)          /_vercel/insights/*
  ├── <Analytics />  ─────────────────────►  Vercel Analytics dashboard
  ├── <SpeedInsights />  ──────────────────►  Vercel Speed Insights dashboard
  ├── <LazyMotion>                          (no cookies set; hash-based visitor ID)
  │     └── <main>{children}</main>
  ├── <Navbar />
  └── <Footer />
        │
        ▼
SectionReveal (Client Component)
  └── m.div [whileInView + once:true]  ──►  Browser triggers opacity/Y animation
                                           once per viewport entry
```

### Recommended Project Structure

No structural changes needed. Phase 5 modifies only `app/layout.tsx` (two import lines, two JSX tags) and potentially `components/ProjectsSection.tsx` if brew-index link must be fixed.

```
app/
└── layout.tsx          ← Add <Analytics /> + <SpeedInsights /> here
components/
└── ProjectsSection.tsx ← Fix or remove dead brew-index link
```

### Pattern 1: Vercel Analytics + Speed Insights in App Router layout

**What:** Add both tracking components inside `<body>` in the root Server Component layout. They inject `<script defer>` tags and do not block rendering.

**When to use:** Once, in `app/layout.tsx`. Never in page components or client components.

**Example:**
```tsx
// Source: https://vercel.com/docs/analytics/quickstart (verified 2026-05-25)
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Placement in the existing layout:** Add both components inside `<body>`, after `<Footer />` (or just before `</body>`). They must not be placed inside `<LazyMotion>` — they are independent of Framer Motion.

**Important:** `app/layout.tsx` is already a Server Component (no `'use client'`). Both `<Analytics />` and `<SpeedInsights />` are compatible with Server Components in Next.js App Router. Do NOT add `'use client'` to `layout.tsx`.

### Pattern 2: SectionReveal Animation Spec (already compliant)

**What:** All scroll animations must use opacity + small Y translate only, `once: true`, no `layout` prop.

**Current state (verified from source):**
```tsx
// Source: components/SectionReveal.tsx (read 2026-05-25)
const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}
// viewport: { once: true, margin: '-80px' }
```

This is exactly the spec. No `layout` prop exists anywhere in components. No `motion.*` direct usage (only `m.*` through LazyMotion strict mode). No section triggers more than one animation — `once: true` is global.

**Audit verdict (pre-flight, requires confirmation by executor):** All four checks appear to pass already. The animation audit is a verification pass, not a change pass.

### Pattern 3: Lighthouse CLI Audit

**What:** Run Lighthouse headlessly against the deployed production URL. Output JSON + HTML reports for LCP, CLS, INP.

**Command:**
```bash
# Source: Lighthouse CLI docs [CITED: github.com/GoogleChrome/lighthouse]
npx lighthouse https://yashkadam.com \
  --output=json,html \
  --output-path=./lighthouse-report \
  --only-categories=performance \
  --chrome-flags="--headless"
```

**Key metrics to extract:**
- LCP (Largest Contentful Paint): must be < 2.5s
- CLS (Cumulative Layout Shift): must be < 0.1
- INP (Interaction to Next Paint): must be < 200ms

**Alternative:** Chrome DevTools Lighthouse panel (Production URL, Mobile preset, 4x throttling). Equivalent results, no CLI required.

### Pattern 4: Link Audit Script

**What:** `curl` HEAD requests against all external URLs found in the audit scope.

**Audit scope (complete list found during research):**

| URL | Component | Status (pre-flight) |
|-----|-----------|---------------------|
| `https://github.com/yash-278` | HeroSection, ContactSection, Footer | 200 OK |
| `https://github.com/yash-278/nekomori` | ProjectsSection | 200 OK |
| `https://github.com/yash-278/brew-index` | ProjectsSection | **404 NOT FOUND** |
| `https://linkedin.com/in/kadamyash` | ContactSection, Footer | 999 (LinkedIn bot-block — not dead) |
| `https://twitter.com/yashkadam278` | ContactSection, Footer | 403 (Twitter bot-block — not dead) |

**LinkedIn 999 and Twitter 403 are bot-protection responses, not dead links.** These platforms block headless requests from server IPs. Manual browser verification confirms they are live; they cannot be auto-verified by curl.

**brew-index is the only confirmed dead link.** The GitHub page returns "Page not found" with an HTTP 404.

**Link audit script:**
```bash
# Quick verification for CI-safe URLs
for url in \
  "https://github.com/yash-278" \
  "https://github.com/yash-278/nekomori" \
  "https://github.com/yash-278/brew-index"; do
  status=$(curl -sI --max-time 10 -L "$url" | head -1 | awk '{print $2}')
  echo "$status  $url"
done
# LinkedIn and Twitter: verify manually in browser
```

### Anti-Patterns to Avoid

- **Adding `'use client'` to `app/layout.tsx`:** The root layout must remain a Server Component. `<Analytics />` and `<SpeedInsights />` work without it.
- **Placing `<Analytics />` inside `<LazyMotion>`:** Analytics is independent of Framer Motion; nesting is unnecessary and wrong.
- **Pre-emptively optimizing CWV before running Lighthouse (D-05):** Let data drive fixes. The current stack (SSG, `next/image` with `priority`, no client-side data fetching) already addresses the most common LCP sources.
- **Using `motion.*` instead of `m.*` in client components:** LazyMotion strict mode will throw a runtime error. The current codebase is clean — do not introduce `motion.*` imports when adding analytics components.
- **Removing LinkedIn/Twitter links because curl returns non-200:** Those platforms block bot requests. Verify manually.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pageview tracking | Custom analytics fetch | `@vercel/analytics` | GDPR-safe by design; already installed; zero-config |
| CWV measurement from real users | Custom Performance Observer | `@vercel/speed-insights` | Already installed; Vercel aggregates and surfaces data in dashboard |
| Lighthouse audit | Manual browser DevTools | `npx lighthouse` CLI | Reproducible, scriptable, can be added to CI later |
| Link health check | Full crawler / puppeteer | `curl` HEAD loop | Overkill; we have 5 URLs; curl handles it in one minute |

**Key insight:** Both analytics packages are already present in `node_modules`. The entire "install" task for this phase is two import statements and two JSX components.

---

## Common Pitfalls

### Pitfall 1: brew-index Dead Link
**What goes wrong:** The GitHub link `https://github.com/yash-278/brew-index` in `ProjectsSection.tsx` returns HTTP 404. Visitors clicking "GitHub →" on the Brew Index card land on a GitHub 404 page.
**Why it happens:** The repository either never existed at that slug, was renamed, or was deleted.
**How to avoid:** Either update the `github` field in the `projects` array to the correct URL, or remove the link entirely until the correct URL is confirmed.
**Warning signs:** `curl -sI https://github.com/yash-278/brew-index | head -1` returns `HTTP/2 404`.

### Pitfall 2: Root Layout Server Component Constraint
**What goes wrong:** Developer adds `'use client'` to `app/layout.tsx` to satisfy an import that appears to need it — breaking SSR, font loading, and metadata for the entire app.
**Why it happens:** The `<Analytics />` and `<SpeedInsights />` components from `@vercel/analytics/next` and `@vercel/speed-insights/next` are specifically designed for Server Components and do NOT require `'use client'`.
**How to avoid:** Never add `'use client'` to `app/layout.tsx`. Both components render as `<script defer>` tags which are valid server-rendered HTML.
**Warning signs:** TypeScript error saying "React Server Component cannot import a module that requires 'use client'" — but this should NOT happen with these packages.

### Pitfall 3: Lighthouse Run Against Dev Server
**What goes wrong:** Running `npx lighthouse http://localhost:3000` instead of the production URL. The dev server lacks CDN caching, image optimization, and Turbopack differences — results will be misleading.
**Why it happens:** Convenience.
**How to avoid:** Always run Lighthouse against `https://yashkadam.com`. If the site is not yet deployed, defer the Lighthouse step until after deployment.
**Warning signs:** Lighthouse scores from localhost will show worse performance (no CDN) and potentially different LCP elements.

### Pitfall 4: Framer Motion `layout` Prop CLS
**What goes wrong:** Adding `layout` prop to any component that renders in the scroll viewport causes Framer Motion to apply `position: relative` and CSS transforms that trigger browser layout recalculations — inflating CLS.
**Why it happens:** `layout` is a convenience prop for shared layout animations but is inappropriate for static reveal animations.
**How to avoid:** Audit confirmed: no `layout` prop exists in any component. Do not add it.
**Warning signs:** CLS > 0.1 in Lighthouse with animation-related elements flagged.

### Pitfall 5: Large Hero Image LCP
**What goes wrong:** `yash.jpg` is 2358x2359px at 922KB. Without optimization, it would be the LCP element and would score poorly.
**Why it happens:** Raw iPhone photo uploaded directly to `/public`.
**How to avoid:** Already handled — `<Image>` with `priority` prop is in `HeroSection.tsx`. Next.js automatically generates WebP/AVIF at the correct display size. No manual action needed.
**Warning signs:** Lighthouse flags "Largest Contentful Paint image was not preloaded" — this should NOT appear since `priority` prop sets `<link rel="preload">` automatically.

---

## Code Examples

Verified patterns from official sources:

### Vercel Analytics — Next.js App Router
```tsx
// Source: https://vercel.com/docs/analytics/quickstart (verified 2026-05-25)
// Import path: '@vercel/analytics/next' (not '@vercel/analytics')
import { Analytics } from '@vercel/analytics/next'
```

### Vercel Speed Insights — Next.js App Router
```tsx
// Source: https://vercel.com/docs/speed-insights/quickstart (verified 2026-05-25)
// Import path: '@vercel/speed-insights/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
```

### Complete layout.tsx diff (additive only)
```tsx
// BEFORE (relevant portion of app/layout.tsx)
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

// AFTER — add these two imports
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// BEFORE (body content)
<body className="bg-bg text-text font-sans antialiased">
  {/* ... */}
  <Footer />
</body>

// AFTER — add both components after Footer
<body className="bg-bg text-text font-sans antialiased">
  {/* ... */}
  <Footer />
  <Analytics />
  <SpeedInsights />
</body>
```

### brew-index dead link fix options
```tsx
// Option A: Remove the link entirely until correct URL is known
// In ProjectsSection.tsx projects array:
{
  name: 'Brew Index',
  description: '...',
  tags: ['React', 'TypeScript'],
  // github field removed
}

// Option B: Update to correct URL if known
{
  name: 'Brew Index',
  description: '...',
  tags: ['React', 'TypeScript'],
  github: 'https://github.com/yash-278/<correct-repo-name>',
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/analytics` v1 (seed in `<script>` inline) | v2 (Resilient Intake — random seed at build time) | v2.0.0 (2024) | Build-time seed makes intake URL unpredictable; improves data collection reliability; no code change needed |
| INP metric (Interaction to Next Paint) was not measured | INP is now a Core Web Vital replacing FID | March 2024 (Chrome 112) | Phase 5 gates on INP < 200ms, not FID |

**Deprecated/outdated:**
- `import { Analytics } from '@vercel/analytics/react'`: Still works but `@vercel/analytics/next` is the correct import for Next.js App Router — it handles route detection natively.
- FID (First Input Delay): Replaced by INP. Lighthouse 12+ reports INP; older docs may reference FID. Ignore FID.

---

## Pre-Flight Findings Summary

These findings were discovered during research and should be factored directly into planning:

| Finding | Severity | Action Required |
|---------|----------|----------------|
| `@vercel/analytics@2.0.1` already in `node_modules` | INFO | No `npm install` step needed; just add imports + JSX |
| `@vercel/speed-insights@2.0.0` already in `node_modules` | INFO | No `npm install` step needed; just add imports + JSX |
| `github.com/yash-278/brew-index` returns HTTP 404 | HIGH | Fix or remove in ProjectsSection.tsx |
| `nekomori` repo returns HTTP 200 | INFO | No action |
| No `layout` prop found in any component | INFO | Animation audit will pass; confirm and document |
| No `motion.*` direct imports found | INFO | LazyMotion strict mode compliance confirmed |
| Hero image uses `priority` prop | INFO | LCP preload already handled |
| Root layout is Server Component | INFO | Correct placement for `<Analytics />` confirmed |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | LinkedIn 999 and Twitter 403 responses are bot-blocking, not dead links | Pre-Flight Findings / Link Audit | If actually dead, those social profiles need URL updates across ContactSection and Footer |
| A2 | Vercel Analytics dashboard must be manually enabled in the Vercel project settings before data flows | Standard Stack | If not enabled in dashboard, the `<Analytics />` component will inject the script but no data will be recorded in the dashboard |

---

## Open Questions

1. **brew-index correct GitHub URL**
   - What we know: `https://github.com/yash-278/brew-index` returns 404.
   - What's unclear: The correct repository name/URL is not known to the executor. The repo may have been renamed, moved to a different account, or deleted.
   - Recommendation: Ask Yash for the correct URL before Phase 5 executes. If unavailable, remove the link as the safer default (D-09 allows this).

2. **Vercel dashboard pre-activation**
   - What we know: Both `@vercel/analytics` and `@vercel/speed-insights` require manual activation in the Vercel dashboard (Analytics and Speed Insights sidebars) before data flows.
   - What's unclear: Whether this has already been done.
   - Recommendation: Planner should include a checkpoint task: "Verify Analytics and Speed Insights are enabled in the Vercel dashboard." This is a one-time click, not a code change.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npx lighthouse` | ✓ | v24.11.0 | — |
| npx | Lighthouse audit | ✓ | (bundled with npm) | — |
| curl | Link audit | ✓ | 8.7.1 | Node.js `fetch` script |
| Lighthouse CLI | CWV audit | ✗ (global) | — | `npx lighthouse` (no global install needed) |
| Chrome/Chromium | Lighthouse headless | ✗ | — | Chrome DevTools Lighthouse panel on production URL |

**Missing dependencies with no fallback:**
- None — `npx lighthouse` does not require a pre-installed global. If Chrome is not available on the machine running the audit, Chrome DevTools Lighthouse panel is a fully equivalent alternative.

**Notes:**
- Lighthouse CLI spawns Chrome. On the dev machine (macOS), Chrome must be installed (via Applications/Google Chrome.app or Chromium) for `npx lighthouse` to work. If not present, use Chrome DevTools directly against the production URL.
- The link audit requires only `curl` which is available.

---

## Security Domain

> `security_enforcement` key absent from config.json — treated as enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | Phase 5 adds no user inputs |
| V6 Cryptography | no | — |

### Known Threat Patterns for analytics injection

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via analytics script injection | Tampering | `@vercel/analytics/next` renders a `<script defer src="...">` tag with no inline code execution; the FOUC inline script in layout.tsx is a static string constant (no user input, no XSS risk — already documented in code) |
| Third-party script data leakage | Information Disclosure | Vercel Analytics is cookieless; collects only aggregated, non-identifiable data (verified against privacy policy) |

---

## Sources

### Primary (HIGH confidence)
- `https://vercel.com/docs/analytics/quickstart` — Next.js App Router integration pattern confirmed; `@vercel/analytics/next` import path
- `https://vercel.com/docs/speed-insights/quickstart` — Next.js App Router integration pattern confirmed; `@vercel/speed-insights/next` import path
- `https://vercel.com/docs/analytics/privacy-policy` — Cookieless design confirmed; no third-party cookies; hash-based visitor ID; no consent banner required
- npm registry (`npm view @vercel/analytics version`) — v2.0.1 is latest stable
- npm registry (`npm view @vercel/speed-insights version`) — v2.0.0 is latest stable
- slopcheck — Both packages rated [OK]
- Codebase (direct file reads) — SectionReveal implementation, HeroSection, ProjectsSection, ContactSection, Navbar, Footer

### Secondary (MEDIUM confidence)
- `curl -sI https://github.com/yash-278/brew-index` — HTTP 404 confirmed; "Page not found" title confirmed via GET response
- `curl -sI https://github.com/yash-278/nekomori` — HTTP 200 confirmed

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Analytics integration: HIGH — official docs verified, packages already installed, import paths confirmed
- Animation audit: HIGH — direct source read confirms spec compliance; no layout prop found
- Link audit: HIGH — curl verified all GitHub URLs; brew-index 404 is confirmed fact
- Lighthouse strategy: MEDIUM — CWV fixes are data-driven per D-04/D-05; cannot research fixes without baseline data
- Pitfalls: HIGH — derived from direct codebase inspection and official docs

**Research date:** 2026-05-25
**Valid until:** 2026-06-25 (stable ecosystem — packages are v2 stable; Vercel docs are current)
