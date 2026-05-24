<!-- refreshed: 2026-05-24 -->
# Architecture

**Analysis Date:** 2026-05-24

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    index.html (Entry Point)                  │
│   All page structure, content, and inline SVG assets         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Navbar     │ Hero Section │  About/Skills│  Projects /    │
│  (lines 50)  │  (line 135)  │ (lines 804+) │  Contact       │
│              │              │              │ (lines 862+)   │
└──────┬───────┴──────┬───────┴──────────────┴────────────────┘
       │              │
       ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│                  src/index.js (Behaviour Layer)              │
│   GSAP animations, ScrollTrigger, mobile nav toggle          │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│              src/index.css → dist/main.css (Style Layer)     │
│   Tailwind CSS directives + custom keyframe animations       │
└──────────────────────────────────────────────────────────────┘
       ▲
       │  (compiled by Tailwind CLI)
┌──────────────────────────────────────────────────────────────┐
│              tailwind.config.js (Build Config)               │
└──────────────────────────────────────────────────────────────┘
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

**Overall:** Multi-page single-page application (single HTML file with anchor-scroll navigation)

**Key Characteristics:**
- No JavaScript framework — plain HTML, CSS, and vanilla JS
- All layout and structure live in one HTML file (`index.html`)
- Behaviour is entirely declarative via CSS class names used as GSAP selectors
- Styles are authored in `src/index.css` (Tailwind source) and compiled to `dist/main.css`
- External CDN scripts (jQuery, GSAP, ScrollTrigger) are loaded at the bottom of `index.html`

## Layers

**Structure Layer:**
- Purpose: Page markup, sections, and content
- Location: `index.html`
- Contains: Navbar, hero, about, skills, projects, contact sections; inline SVG animations
- Depends on: `dist/main.css` (styles), `src/index.js` (behaviour)
- Used by: Browser directly as the HTML entry point

**Behaviour Layer:**
- Purpose: All interactivity and animation sequencing
- Location: `src/index.js`
- Contains: Mobile menu toggle, GSAP entrance timeline, scroll-triggered animations per section
- Depends on: jQuery (CDN), GSAP (CDN), ScrollTrigger (CDN); CSS class selectors defined in HTML
- Used by: `index.html` via `<script src="./src/index.js">`

**Style Source Layer:**
- Purpose: Authoring styles using Tailwind utilities + custom CSS animations
- Location: `src/index.css`
- Contains: `@tailwind` directives, custom `.custom-button` class, SVG keyframe animations (`main-slide`, `slide`, `wobble`, `hand-wobble`)
- Depends on: Tailwind CLI compilation step
- Used by: Tailwind CLI to produce `dist/main.css`

**Style Output Layer:**
- Purpose: Compiled CSS served to the browser
- Location: `dist/main.css`
- Contains: Full Tailwind utility output + custom styles from `src/index.css`
- Generated: Yes — do not edit manually
- Committed: Yes (present in repo)

**Build Config:**
- Purpose: Configures Tailwind content scanning, theme extensions
- Location: `tailwind.config.js`
- Contains: Content glob (`"./*.{html,js}"`), custom `font-source` family (IBM Plex Mono), custom `h-custom` height
- Depends on: Nothing at runtime; used only by the Tailwind CLI build

## Data Flow

### Page Load Sequence

1. Browser requests `index.html` — root entry point
2. `index.html` loads `dist/main.css` via `<link href="./dist/main.css">` (line 46)
3. CDN scripts are loaded at page bottom: jQuery slim, GSAP 3.9.1, ScrollTrigger 3.9.1 (lines 1209–1215)
4. `src/index.js` is loaded last (line 1217), after CDN scripts are available
5. GSAP entrance timeline runs immediately, animating `.anime-text`, `.slider`, `.intro`, `.main-animation`, `.navigation`
6. ScrollTrigger instances activate as user scrolls to `.about-container`, `.skills`, `.project-single`, `.contact`

### Mobile Navigation Flow

1. User taps hamburger button (`.mobile-menu-button`) — event registered in `src/index.js` (line 14)
2. GSAP animates `.mobile-menu` to `x: 0` (slide in from right)
3. User taps a menu item (`.menu-list`) — GSAP animates `.mobile-menu` to `x: 300` (slide out), then `toggleHidden()` adds `hidden` class

### CSS Build Flow

1. Developer edits `src/index.css`
2. `npm run tailwind` invokes `npx tailwindcss -i ./src/index.css -o ./dist/main.css --watch`
3. Tailwind scans `index.html` and root JS files for class usage (per `tailwind.config.js` content glob)
4. Compiled output written to `dist/main.css`

**State Management:**
- No application state. All UI state is managed via CSS class toggling (e.g., `hidden`) and GSAP animation properties directly on DOM elements.

## Key Abstractions

**CSS Class Selectors as Animation Targets:**
- Purpose: HTML class names serve as the interface between structure and behaviour — GSAP queries elements by class (`.main-animation`, `.anime-text`, `.about-img`, `.skill-single`, `.project-single`, `.contact-form`, `.contact-email`) rather than IDs
- Examples: `src/index.js` lines 27–78
- Pattern: All animated elements carry a semantic class used exclusively for GSAP targeting

**Section IDs as Navigation Anchors:**
- Purpose: In-page navigation targets used by navbar links
- Examples: `#hero`, `#about`, `#skills`, `#projects`, `#contact` in `index.html`
- Pattern: `scroll-mt-12` Tailwind class offsets section scroll position to account for fixed navbar height

**Inline SVG Hero Illustration:**
- Purpose: Animated hero image with SVG group IDs used as CSS animation targets
- Examples: SVG groups `#main1`–`#main5`, `#line1`–`#line8`, `#Body`, `#hand` in `index.html` lines 147–710
- Pattern: SVG element IDs are targeted by `src/index.css` keyframe animations (`main-slide`, `slide`, `wobble`, `hand-wobble`)

## Entry Points

**Browser Entry Point:**
- Location: `index.html`
- Triggers: Direct browser request / file open
- Responsibilities: Renders full page; loads all styles and scripts

**Animation Entry Point:**
- Location: `src/index.js` (line 25)
- Triggers: Script execution after CDN dependencies load
- Responsibilities: Runs GSAP entrance timeline, registers all ScrollTrigger instances, wires mobile nav events

**CSS Build Entry Point:**
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
**What happens:** jQuery slim (CDN) is loaded on line 1209 but `src/index.js` uses no jQuery selectors — all DOM queries use native `document.querySelector`/`querySelectorAll`.
**Why it's wrong:** Adds ~70KB network request for no functional benefit, increasing page load time.
**Do this instead:** Remove the jQuery `<script>` tag from `index.html` line 1209.

### Compiled CSS committed to version control
**What happens:** `dist/main.css` (1431 lines) is committed to the repository.
**Why it's wrong:** Generated files create merge conflicts and bloat history; source truth is `src/index.css` + Tailwind.
**Do this instead:** Add `dist/` to `.gitignore` and configure a deploy-time build step, or keep it committed with a clear convention documented in README.

### No fallback if CDN scripts are unavailable
**What happens:** All GSAP animations and the mobile nav toggle rely on CDN-delivered scripts with no local fallback.
**Why it's wrong:** If the CDN is unreachable, the page loses all interactive behaviour.
**Do this instead:** Either vendor the GSAP scripts locally under `src/` or `dist/`, or add error handling.

## Error Handling

**Strategy:** None implemented. The project has no explicit error handling — all failures (CDN load errors, DOM query null returns) are silent.

**Patterns:**
- No try/catch blocks in `src/index.js`
- No null checks before calling GSAP methods on queried elements
- `querySelectorAll` result is iterated via `.forEach` without null guard, but this is safe as it returns an empty NodeList

## Cross-Cutting Concerns

**Logging:** None — no `console.log` or logging utility present
**Validation:** Not applicable — no forms or user data input
**Authentication:** Not applicable — static public portfolio site

---

*Architecture analysis: 2026-05-24*
