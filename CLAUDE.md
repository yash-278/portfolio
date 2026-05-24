<!-- GSD:project-start source:PROJECT.md -->
## Project

**Yash Kadam — Personal Portfolio**

A personal portfolio and content hub for Yash Kadam, Technical Lead and fullstack developer, deployed at yashkadam.com. The site establishes an online presence, showcases selected projects, and serves as the foundation for future income streams including content creation, 1-on-1 developer mentoring, and consulting. Built with Next.js and deployed on Vercel.

**Core Value:** A first-time visitor (developer, potential client, or collaborator) should leave knowing exactly who Yash is, what he's built, and how to reach him — in under 60 seconds.

### Constraints

- **Tech stack**: Next.js 14+ with TypeScript, Tailwind CSS, Framer Motion — v2 branch is the starting point
- **Deployment**: Vercel with yashkadam.com custom domain
- **Blog**: MDX files in-repo under `/content/blog` — no external CMS
- **Content**: Projects shown must be ones Yash is actively proud of; no placeholder/demo projects
- **Performance**: Static generation where possible (portfolio content doesn't change often); Core Web Vitals matter for credibility
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 - Single-page portfolio markup (`index.html`)
- CSS3 / PostCSS - Styles via Tailwind utility classes (`src/index.css`, `dist/main.css`)
- JavaScript (ES6+) - Client-side interactivity and animations (`src/index.js`)
- SVG - Inline hero illustrations and social icons embedded in `index.html`
## Runtime
- Browser (no server-side runtime — fully static site)
- Development served via VSCode Live Server extension (per `README.md`)
- npm
- Lockfile: `package-lock.json` present
## Frameworks
- None (vanilla HTML/CSS/JS — no frontend framework such as React or Vue)
- Tailwind CSS `^3.0.7` — utility-first styling, configured via `tailwind.config.js`
- GSAP (GreenSock) `3.9.1` — timeline and scroll-triggered animations, loaded via cdnjs CDN
- jQuery `3.5.1` slim build — loaded via jsDelivr CDN (used minimally; no jQuery calls detected in `src/index.js`, only GSAP calls)
- Not applicable — no test framework present
- Tailwind CLI via npx — `npm run tailwind` compiles `src/index.css` → `dist/main.css` in watch mode
- No bundler (Webpack, Vite, Parcel, etc.)
## Key Dependencies
- `tailwindcss` `^3.0.7` — entire visual design is Tailwind utility classes; removing it breaks all layout and styling
- `prettier` `^2.6.2` — code formatting (devDependency)
- `prettier-plugin-tailwindcss` `^0.1.10` — Tailwind class sorting in Prettier
- `stylelint-config-recommended` `^6.0.0` — CSS linting ruleset, extended in `.stylelintrc`
## Configuration
- No environment variables — fully static site with no server or build secrets
- `.env` files: not present
- `tailwind.config.js` — configures content paths, extends theme with `IBM Plex Mono` font family and `calc(100vh - 2.75rem)` custom height utility
- `.stylelintrc` — stylelint config extending `stylelint-config-recommended`; ignores Tailwind at-rules; restricts units to `em`, `rem`, `s`
- `package.json` — single script: `tailwind` (CSS compilation)
- Google Fonts CDN: `Source Code Pro` (HTML `<link>`) and `IBM Plex Mono` (`@import` in `src/index.css`)
## Platform Requirements
- Node.js (version not pinned — no `.nvmrc` or `.node-version`)
- npm for installing devDependencies
- VSCode with Live Server extension (recommended per README)
- Static file hosting (no server required)
- Previously deployed to `https://www.yashkadam.cf/` (custom domain, per Open Graph meta tags)
- All runtime dependencies (GSAP, jQuery, Google Fonts) loaded from CDN at page load
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Overview
## Naming Patterns
- Lowercase, single-word names: `index.html`, `index.js`, `index.css`
- Output CSS compiled to `dist/main.css`
- Assets use descriptive names: `hero.svg`, `hero1.svg`, `img1.jpg`
- `const` preferred for all top-level declarations (no `let` or `var` observed)
- camelCase for all variable names: `btn`, `menu`, `menuBtn`, `toggleHidden`, `tl`, `scrollAboutTl`, `scrollSkillTl`, `scrollContactTl`
- Animation timeline variables use descriptive suffixes: `scrollAboutTl`, `scrollSkillTl`, `scrollContactTl`
- Tailwind utility classes used inline on all elements
- Custom semantic class names use kebab-case: `.mobile-menu-button`, `.mobile-menu`, `.menu-list`, `.anime-text`, `.main-animation`, `.about-container`, `.about-img`, `.about-text`, `.skill-title`, `.skill-single`, `.project-single`, `.contact-form`, `.contact-email`
- IDs use camelCase for SVG animation targets: `#main1`, `#main2`, `#line1`, `#Body`, `#hand`
- Defined in `src/index.css` using kebab-case: `.custom-button`
- Keyframe animation names use kebab-case: `main-slide`, `slide`, `wobble`, `hand-wobble`
- kebab-case section IDs for anchor links: `#hero`, `#about`, `#skills`, `#projects`, `#contact`, `#navigation`
## Code Style
- Prettier is configured (devDependency: `prettier@^2.6.2`)
- `prettier-plugin-tailwindcss@^0.1.10` is installed to auto-sort Tailwind class order
- HTML is indented with 2 spaces
- JS uses 2-space indentation with arrow function parentheses always present
- Stylelint configured via `.stylelintrc`
- Extends `stylelint-config-recommended`
- `block-no-empty` rule is disabled (null)
- `unit-allowed-list` restricts units to: `em`, `rem`, `s` — exceptions require `/* stylelint-disable unit-allowed-list */` comment (see top of `src/index.css`)
- Unknown at-rules `@extends` and `@tailwind` are explicitly allowed
- Content scanning covers `*.{html,js}` at root only
- Custom font family: `"IBM Plex Mono"` aliased as `font-source`
- Custom height: `custom` = `calc(100vh - 2.75rem)`
- No Tailwind plugins used
## Import Organization
## Error Handling
## Logging
## Comments
- Sections are delimited using `// !` prefix comments (uppercase, exclamation mark pattern):
- Block comments use `/** ... */` for category headers: `/** Animations */`
- Section markers use `/*! SECTION NAME */` (uppercase, exclamation prefix) or `/* ! Section Name */`:
- Section start markers use `<!-- ! SECTION NAME -->` pattern (uppercase, exclamation):
- Descriptive inline comments label sub-components: `<!-- LOGO -->`, `<!-- Desktop MEnu -->`, `<!-- Mobile Menu -->`
- Not used. No TypeScript, no JSDoc annotations.
## Function Design
- Arrow functions used for callbacks and simple utilities: `const toggleHidden = () => { ... }`
- Inline arrow functions for event listeners and GSAP callbacks
- No named function declarations (`function foo() {}`) observed
- Functions are kept small (1-4 lines each)
- Animation configuration is inline within GSAP method calls rather than extracted to variables
- Event parameters are named `event` (even when unused): `(event) => { ... }`
- Batch parameters named `batch` in ScrollTrigger callbacks
## Module Design
- No module exports. The project is not modularized — all JS lives in `src/index.js` as a single script.
- Not applicable. Single JS file.
## HTML Conventions
- `lang="en"` set on `<html>`
- `scroll-smooth` Tailwind class applied to `<html>` for native smooth scrolling
- Semantic section structure uses `<div>` with id-based anchors (not `<section>` or `<article>`)
- SVGs are inlined directly into HTML for animation targeting (not linked as `<img>`)
- All navigation links use hash anchors (`href="#about"`, etc.)
- `overflow-x-hidden` applied to `<body>` to prevent horizontal scroll from off-screen animations
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
```
## Component Responsibilities
| Component | Responsibility | File |
|-----------|----------------|------|
| HTML document | All page structure, sections, inline SVGs, and content | `index.html` |
| Behaviour layer | GSAP timeline animations, ScrollTrigger callbacks, mobile nav | `src/index.js` |
| Style source | Tailwind directives + custom CSS keyframe animations | `src/index.css` |
| Style output | Compiled Tailwind CSS served to browser | `dist/main.css` |
| Build config | Tailwind content paths, font/height theme extensions | `tailwind.config.js` |
| Static assets | SVG hero illustrations and photographic images | `src/assets/` |
## Pattern Overview
- No JavaScript framework — plain HTML, CSS, and vanilla JS
- All layout and structure live in one HTML file (`index.html`)
- Behaviour is entirely declarative via CSS class names used as GSAP selectors
- Styles are authored in `src/index.css` (Tailwind source) and compiled to `dist/main.css`
- External CDN scripts (jQuery, GSAP, ScrollTrigger) are loaded at the bottom of `index.html`
## Layers
- Purpose: Page markup, sections, and content
- Location: `index.html`
- Contains: Navbar, hero, about, skills, projects, contact sections; inline SVG animations
- Depends on: `dist/main.css` (styles), `src/index.js` (behaviour)
- Used by: Browser directly as the HTML entry point
- Purpose: All interactivity and animation sequencing
- Location: `src/index.js`
- Contains: Mobile menu toggle, GSAP entrance timeline, scroll-triggered animations per section
- Depends on: jQuery (CDN), GSAP (CDN), ScrollTrigger (CDN); CSS class selectors defined in HTML
- Used by: `index.html` via `<script src="./src/index.js">`
- Purpose: Authoring styles using Tailwind utilities + custom CSS animations
- Location: `src/index.css`
- Contains: `@tailwind` directives, custom `.custom-button` class, SVG keyframe animations (`main-slide`, `slide`, `wobble`, `hand-wobble`)
- Depends on: Tailwind CLI compilation step
- Used by: Tailwind CLI to produce `dist/main.css`
- Purpose: Compiled CSS served to the browser
- Location: `dist/main.css`
- Contains: Full Tailwind utility output + custom styles from `src/index.css`
- Generated: Yes — do not edit manually
- Committed: Yes (present in repo)
- Purpose: Configures Tailwind content scanning, theme extensions
- Location: `tailwind.config.js`
- Contains: Content glob (`"./*.{html,js}"`), custom `font-source` family (IBM Plex Mono), custom `h-custom` height
- Depends on: Nothing at runtime; used only by the Tailwind CLI build
## Data Flow
### Page Load Sequence
### Mobile Navigation Flow
### CSS Build Flow
- No application state. All UI state is managed via CSS class toggling (e.g., `hidden`) and GSAP animation properties directly on DOM elements.
## Key Abstractions
- Purpose: HTML class names serve as the interface between structure and behaviour — GSAP queries elements by class (`.main-animation`, `.anime-text`, `.about-img`, `.skill-single`, `.project-single`, `.contact-form`, `.contact-email`) rather than IDs
- Examples: `src/index.js` lines 27–78
- Pattern: All animated elements carry a semantic class used exclusively for GSAP targeting
- Purpose: In-page navigation targets used by navbar links
- Examples: `#hero`, `#about`, `#skills`, `#projects`, `#contact` in `index.html`
- Pattern: `scroll-mt-12` Tailwind class offsets section scroll position to account for fixed navbar height
- Purpose: Animated hero image with SVG group IDs used as CSS animation targets
- Examples: SVG groups `#main1`–`#main5`, `#line1`–`#line8`, `#Body`, `#hand` in `index.html` lines 147–710
- Pattern: SVG element IDs are targeted by `src/index.css` keyframe animations (`main-slide`, `slide`, `wobble`, `hand-wobble`)
## Entry Points
- Location: `index.html`
- Triggers: Direct browser request / file open
- Responsibilities: Renders full page; loads all styles and scripts
- Location: `src/index.js` (line 25)
- Triggers: Script execution after CDN dependencies load
- Responsibilities: Runs GSAP entrance timeline, registers all ScrollTrigger instances, wires mobile nav events
- Location: `src/index.css`
- Triggers: `npm run tailwind` command
- Responsibilities: Source for compiled `dist/main.css`
## Architectural Constraints
- **Threading:** Single-threaded browser JS; no workers used
- **Global state:** GSAP and ScrollTrigger are globals from CDN scripts; `btn`, `menu`, `menuBtn`, `tl`, `scrollAboutTl`, `scrollSkillTl`, `scrollContactTl` are module-level `const`/`let` in `src/index.js`
- **Script load order:** `src/index.js` depends on `gsap` and `ScrollTrigger` globals being present — if CDN scripts fail to load, all animations silently break
- **Circular imports:** None — no module system is used
- **No build pipeline for JS/HTML:** Only CSS has a build step; HTML and JS are used directly by the browser without bundling or transpilation
## Anti-Patterns
### jQuery included but unused in behaviour
### Compiled CSS committed to version control
### No fallback if CDN scripts are unavailable
## Error Handling
- No try/catch blocks in `src/index.js`
- No null checks before calling GSAP methods on queried elements
- `querySelectorAll` result is iterated via `.forEach` without null guard, but this is safe as it returns an empty NodeList
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
