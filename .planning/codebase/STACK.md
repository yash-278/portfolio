# Technology Stack

**Analysis Date:** 2026-05-24

## Languages

**Primary:**
- HTML5 - Single-page portfolio markup (`index.html`)
- CSS3 / PostCSS - Styles via Tailwind utility classes (`src/index.css`, `dist/main.css`)
- JavaScript (ES6+) - Client-side interactivity and animations (`src/index.js`)

**Secondary:**
- SVG - Inline hero illustrations and social icons embedded in `index.html`

## Runtime

**Environment:**
- Browser (no server-side runtime — fully static site)
- Development served via VSCode Live Server extension (per `README.md`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- None (vanilla HTML/CSS/JS — no frontend framework such as React or Vue)

**CSS Utility:**
- Tailwind CSS `^3.0.7` — utility-first styling, configured via `tailwind.config.js`
  - Input: `src/index.css`
  - Output (compiled): `dist/main.css`
  - Content scan: `./*.{html,js}` (root-level HTML and JS only)

**Animation (CDN):**
- GSAP (GreenSock) `3.9.1` — timeline and scroll-triggered animations, loaded via cdnjs CDN
  - Core: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js`
  - Plugin: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js`

**DOM utility (CDN):**
- jQuery `3.5.1` slim build — loaded via jsDelivr CDN (used minimally; no jQuery calls detected in `src/index.js`, only GSAP calls)
  - `https://code.jquery.com/jquery-3.5.1.slim.min.js`

**Testing:**
- Not applicable — no test framework present

**Build/Dev:**
- Tailwind CLI via npx — `npm run tailwind` compiles `src/index.css` → `dist/main.css` in watch mode
- No bundler (Webpack, Vite, Parcel, etc.)

## Key Dependencies

**Critical:**
- `tailwindcss` `^3.0.7` — entire visual design is Tailwind utility classes; removing it breaks all layout and styling
- `prettier` `^2.6.2` — code formatting (devDependency)
- `prettier-plugin-tailwindcss` `^0.1.10` — Tailwind class sorting in Prettier

**Infrastructure:**
- `stylelint-config-recommended` `^6.0.0` — CSS linting ruleset, extended in `.stylelintrc`

## Configuration

**Environment:**
- No environment variables — fully static site with no server or build secrets
- `.env` files: not present

**Build:**
- `tailwind.config.js` — configures content paths, extends theme with `IBM Plex Mono` font family and `calc(100vh - 2.75rem)` custom height utility
- `.stylelintrc` — stylelint config extending `stylelint-config-recommended`; ignores Tailwind at-rules; restricts units to `em`, `rem`, `s`
- `package.json` — single script: `tailwind` (CSS compilation)

**Font loading:**
- Google Fonts CDN: `Source Code Pro` (HTML `<link>`) and `IBM Plex Mono` (`@import` in `src/index.css`)

## Platform Requirements

**Development:**
- Node.js (version not pinned — no `.nvmrc` or `.node-version`)
- npm for installing devDependencies
- VSCode with Live Server extension (recommended per README)

**Production:**
- Static file hosting (no server required)
- Previously deployed to `https://www.yashkadam.cf/` (custom domain, per Open Graph meta tags)
- All runtime dependencies (GSAP, jQuery, Google Fonts) loaded from CDN at page load

---

*Stack analysis: 2026-05-24*
