# Coding Conventions

**Analysis Date:** 2026-05-24

## Overview

This is a static HTML/CSS/JS portfolio site. There is no TypeScript, no framework, and no bundler beyond Tailwind CSS compilation. All conventions are vanilla web standards.

## Naming Patterns

**Files:**
- Lowercase, single-word names: `index.html`, `index.js`, `index.css`
- Output CSS compiled to `dist/main.css`
- Assets use descriptive names: `hero.svg`, `hero1.svg`, `img1.jpg`

**JavaScript Variables:**
- `const` preferred for all top-level declarations (no `let` or `var` observed)
- camelCase for all variable names: `btn`, `menu`, `menuBtn`, `toggleHidden`, `tl`, `scrollAboutTl`, `scrollSkillTl`, `scrollContactTl`
- Animation timeline variables use descriptive suffixes: `scrollAboutTl`, `scrollSkillTl`, `scrollContactTl`

**CSS Classes (HTML):**
- Tailwind utility classes used inline on all elements
- Custom semantic class names use kebab-case: `.mobile-menu-button`, `.mobile-menu`, `.menu-list`, `.anime-text`, `.main-animation`, `.about-container`, `.about-img`, `.about-text`, `.skill-title`, `.skill-single`, `.project-single`, `.contact-form`, `.contact-email`
- IDs use camelCase for SVG animation targets: `#main1`, `#main2`, `#line1`, `#Body`, `#hand`

**CSS Custom Classes:**
- Defined in `src/index.css` using kebab-case: `.custom-button`
- Keyframe animation names use kebab-case: `main-slide`, `slide`, `wobble`, `hand-wobble`

**HTML IDs (sections):**
- kebab-case section IDs for anchor links: `#hero`, `#about`, `#skills`, `#projects`, `#contact`, `#navigation`

## Code Style

**Formatting:**
- Prettier is configured (devDependency: `prettier@^2.6.2`)
- `prettier-plugin-tailwindcss@^0.1.10` is installed to auto-sort Tailwind class order
- HTML is indented with 2 spaces
- JS uses 2-space indentation with arrow function parentheses always present

**CSS Linting:**
- Stylelint configured via `.stylelintrc`
- Extends `stylelint-config-recommended`
- `block-no-empty` rule is disabled (null)
- `unit-allowed-list` restricts units to: `em`, `rem`, `s` — exceptions require `/* stylelint-disable unit-allowed-list */` comment (see top of `src/index.css`)
- Unknown at-rules `@extends` and `@tailwind` are explicitly allowed

**Tailwind Config (`tailwind.config.js`):**
- Content scanning covers `*.{html,js}` at root only
- Custom font family: `"IBM Plex Mono"` aliased as `font-source`
- Custom height: `custom` = `calc(100vh - 2.75rem)`
- No Tailwind plugins used

## Import Organization

No module imports are used. All JavaScript dependencies (GSAP, ScrollTrigger) are loaded via CDN `<script>` tags in `index.html`. No ES module `import`/`require` statements exist.

**External script load order in `index.html`:**
1. GSAP core (CDN)
2. ScrollTrigger plugin (CDN)
3. `./src/index.js` (deferred or at end of body)

## Error Handling

No explicit error handling is present in `src/index.js`. DOM query results (`document.querySelector`) are used directly without null checks. If targeted elements are absent from the DOM, runtime errors will occur silently or throw.

## Logging

No `console.log`, `console.error`, or any logging calls are present in source files. There is no logging convention.

## Comments

**Section Markers in JS (`src/index.js`):**
- Sections are delimited using `// !` prefix comments (uppercase, exclamation mark pattern):
  ```js
  //  ! Mobile Navbar
  // ! Initial Animation
  // ! Scroll Animation for About
  // ! Scroll Animation for Skills
  // ! Scroll Animation for Projects
  // ! Scroll Animation for Contact
  ```

**Section Markers in CSS (`src/index.css`):**
- Block comments use `/** ... */` for category headers: `/** Animations */`
- Section markers use `/*! SECTION NAME */` (uppercase, exclamation prefix) or `/* ! Section Name */`:
  ```css
  /*! MAIN SLIDE */
  /* ! Laptop Slide */
  /* ! Body Wobble */
  ```

**HTML Comments:**
- Section start markers use `<!-- ! SECTION NAME -->` pattern (uppercase, exclamation):
  ```html
  <!-- ! NAVBAR -->
  <!-- ! HERO SECTION -->
  ```
- Descriptive inline comments label sub-components: `<!-- LOGO -->`, `<!-- Desktop MEnu -->`, `<!-- Mobile Menu -->`

**JSDoc/TSDoc:**
- Not used. No TypeScript, no JSDoc annotations.

## Function Design

**Style:**
- Arrow functions used for callbacks and simple utilities: `const toggleHidden = () => { ... }`
- Inline arrow functions for event listeners and GSAP callbacks
- No named function declarations (`function foo() {}`) observed

**Size:**
- Functions are kept small (1-4 lines each)
- Animation configuration is inline within GSAP method calls rather than extracted to variables

**Parameters:**
- Event parameters are named `event` (even when unused): `(event) => { ... }`
- Batch parameters named `batch` in ScrollTrigger callbacks

## Module Design

**Exports:**
- No module exports. The project is not modularized — all JS lives in `src/index.js` as a single script.

**Barrel Files:**
- Not applicable. Single JS file.

## HTML Conventions

- `lang="en"` set on `<html>`
- `scroll-smooth` Tailwind class applied to `<html>` for native smooth scrolling
- Semantic section structure uses `<div>` with id-based anchors (not `<section>` or `<article>`)
- SVGs are inlined directly into HTML for animation targeting (not linked as `<img>`)
- All navigation links use hash anchors (`href="#about"`, etc.)
- `overflow-x-hidden` applied to `<body>` to prevent horizontal scroll from off-screen animations

---

*Convention analysis: 2026-05-24*
