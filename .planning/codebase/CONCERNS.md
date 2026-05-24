# Codebase Concerns

**Analysis Date:** 2026-05-24

## Tech Debt

**Monolithic single-file HTML:**
- Issue: All HTML content (1,219 lines) lives in a single `index.html` with no templating, partials, or component separation. SVG assets are inline rather than in external files.
- Files: `index.html`
- Impact: High maintenance friction; updating one section requires navigating ~1,200 lines. Adding projects or skills means editing raw HTML.
- Fix approach: Migrate to a static site generator (Eleventy, Astro) or extract repeated patterns into includes/templates.

**Compiled CSS committed to repository:**
- Issue: `dist/main.css` (1,431 lines of compiled Tailwind output) is tracked in git. There is no `.gitignore` rule for `dist/`.
- Files: `dist/main.css`, `.gitignore`
- Impact: Every CSS change creates large diffs. `dist/` should be a build artifact, not source-controlled.
- Fix approach: Add `dist/` to `.gitignore`; add a build script to `package.json` that compiles CSS as part of CI or deployment.

**No build or start script:**
- Issue: `package.json` only defines a `tailwind` watch script. There is no `build`, `start`, or `deploy` script.
- Files: `package.json`
- Impact: Deployment process is undocumented; contributors cannot build the project without knowing the watch command.
- Fix approach: Add a `"build": "npx tailwindcss -i ./src/index.css -o ./dist/main.css --minify"` script and document the deployment process.

**`sample.txt` is a leaked partial HTML fragment:**
- Issue: `sample.txt` contains a detached HTML contact-form snippet that appears to be leftover from an earlier design pass.
- Files: `sample.txt`
- Impact: Dead file pollutes the repo; the contact form shown in `sample.txt` is not present in `index.html` (actual contact section is just an email link).
- Fix approach: Delete `sample.txt`; implement or discard the form design.

**Outdated dependency range pins:**
- Issue: `tailwindcss: ^3.0.7` (current stable is 3.4.x), `prettier: ^2.6.2` (current is 3.x), `prettier-plugin-tailwindcss: ^0.1.10` (current is 0.6.x). `stylelint-config-recommended: ^6.0.0` is a runtime `dependency` instead of a `devDependency`.
- Files: `package.json`
- Impact: Missing upstream bug fixes, security patches, and improved Tailwind features. `stylelint-config-recommended` in `dependencies` bloats any production install.
- Fix approach: Run `npm outdated`, update each package, move `stylelint-config-recommended` to `devDependencies`.

## Known Bugs

**`target="new-tab"` is not valid HTML — links do not open in new tabs:**
- Symptoms: All 16 external links in the page use `target="new-tab"`. The HTML `target` attribute only has special meanings for `_blank`, `_self`, `_parent`, `_top`; any other value is treated as a named frame. On most browsers this opens all those links into the same named frame rather than separate tabs.
- Files: `index.html` (lines 754, 762, 769, 776, 888, 927, 966, 1004, 1042, 1080, 1115, 1128, 1143, 1158, 1173, 1188)
- Trigger: Clicking any social or project link.
- Workaround: None; the fix is to change all `target="new-tab"` to `target="_blank" rel="noopener noreferrer"`.

**Font mismatch — HTML loads "Source Code Pro", CSS imports "IBM Plex Mono":**
- Symptoms: `index.html` loads `Source Code Pro` from Google Fonts (line 43). `src/index.css` imports `IBM Plex Mono`. The Tailwind config registers `font-source` mapping to `"IBM Plex Mono"`. The `font-source` class is used extensively on the page. Whichever font the browser resolves first may be displayed inconsistently.
- Files: `index.html` (line 43), `src/index.css` (line 2), `tailwind.config.js` (line 6)
- Trigger: Any page load.
- Workaround: None; decide on one font family, remove the other import.

**Scrollspy label is static — never updates on scroll:**
- Symptoms: The mobile navbar contains a `<span>HOME</span>` marked with comment `<!-- SCROLLSPY -->` that is intended to reflect the active section. No JavaScript in `src/index.js` updates this element on scroll, so it always displays "HOME" regardless of the user's scroll position.
- Files: `index.html` (lines 57–62), `src/index.js`
- Trigger: Scroll past the hero section on mobile.
- Workaround: None.

**Contact form in `sample.txt` is non-functional and absent from the page:**
- Symptoms: A multi-field contact form (first name, last name, email, message, submit button) exists in `sample.txt` but is not included in `index.html`. The actual contact section is only a mailto Gmail link. The GSAP scroll animation references `.contact-form` (line 78 of `src/index.js`), but no element with that class exists in the DOM.
- Files: `src/index.js` (line 78), `index.html`, `sample.txt`
- Trigger: Page load — GSAP attempts to animate `.contact-form` which resolves to an empty NodeList.

## Security Considerations

**External links missing `rel="noopener noreferrer"`:**
- Risk: All 16 external `<a>` tags lack `rel="noopener noreferrer"`. When `target="_blank"` (or the incorrectly-named `target="new-tab"`) is used without `noopener`, the opened page can access the opener's `window` object via `window.opener`, enabling reverse tabnapping attacks.
- Files: `index.html` (all external link elements)
- Current mitigation: None.
- Recommendations: Add `rel="noopener noreferrer"` to every external anchor.

**CDN scripts load without Subresource Integrity (SRI):**
- Risk: GSAP (`gsap.min.js`, `ScrollTrigger.min.js`) from cdnjs.cloudflare.com are loaded without `integrity` attributes. If the CDN is compromised or the URL is hijacked, arbitrary JavaScript executes on the page. jQuery has an SRI hash but GSAP does not.
- Files: `index.html` (lines 1214–1215)
- Current mitigation: jQuery has SRI (line 1211); GSAP scripts do not.
- Recommendations: Add `integrity` and `crossorigin="anonymous"` attributes to both GSAP `<script>` tags.

**Meta OG/Twitter URLs reference an expired domain (`yashkadam.cf`):**
- Risk: The `.cf` (Central African Republic) ccTLD no longer provides free registrations. If the domain has expired and been re-registered by a third party, the `og:url` and `twitter:url` meta tags point to a potentially malicious external site, affecting link-preview trust.
- Files: `index.html` (lines 17, 30)
- Current mitigation: None.
- Recommendations: Update to the current live domain.

## Performance Bottlenecks

**Unoptimised profile photo (1.5 MB JPEG):**
- Problem: `img3.jpg` is 1,625,856 bytes (~1.5 MB). It is the only `<img>` on the page and loads without `loading="lazy"` or a `<picture>` srcset.
- Files: `src/assets/img3.jpg`, `index.html` (line 811)
- Cause: No image compression or format conversion pipeline.
- Improvement path: Convert to WebP/AVIF with a build step (e.g., `sharp`); add `loading="lazy"` attribute; provide responsive `srcset`.

**Two Google Fonts requests on every load:**
- Problem: `index.html` requests `Source Code Pro` from Google Fonts; `src/index.css` imports `IBM Plex Mono` via a separate `@import`. Both HTTP requests block rendering. One font is unused.
- Files: `index.html` (lines 39–44), `src/index.css` (line 2)
- Cause: Font mismatch tech debt (see Known Bugs).
- Improvement path: Decide on one font; self-host it or load a single Google Fonts URL with `&display=swap`.

**Scripts load synchronously at bottom of `<body>` in order jQuery → GSAP → app:**
- Problem: All three `<script>` tags are synchronous and must load sequentially. jQuery (30 KB gzipped) is loaded but unused.
- Files: `index.html` (lines 1210–1217)
- Cause: jQuery was likely included early in development and never removed.
- Improvement path: Remove jQuery; add `defer` to GSAP and app scripts.

**Unused SVG assets in `src/assets/`:**
- Problem: `hero.svg`, `hero1.svg`, `hero2.svg`, `hero3.svg` are present in the assets directory but not referenced anywhere in `index.html` or `src/index.js`. Total size: ~176 KB.
- Files: `src/assets/hero.svg`, `src/assets/hero1.svg`, `src/assets/hero2.svg`, `src/assets/hero3.svg`
- Cause: Leftover from earlier design iterations.
- Improvement path: Delete unreferenced assets; if needed, inline SVGs directly in HTML.

**Unminified CSS shipped in development mode:**
- Problem: The only CSS build script runs in `--watch` mode. There is no minification step. `dist/main.css` is 1,431 lines of uncompressed Tailwind output.
- Files: `dist/main.css`, `package.json`
- Cause: No production build script.
- Improvement path: Add `"build": "npx tailwindcss ... --minify"` to `package.json`.

## Fragile Areas

**GSAP animations reference classes that may not exist in DOM:**
- Files: `src/index.js`
- Why fragile: `src/index.js` queries `.contact-form` (line 78) and `.mobile-menu-button` (line 2) via `querySelector`. If those class names are renamed in HTML, GSAP silently fails or throws a null reference error at runtime.
- Safe modification: When renaming HTML classes, grep `src/index.js` for the class name first. Consider adding null-checks before GSAP calls.
- Test coverage: No tests exist.

**Mobile menu toggle relies on undocumented CSS `translate-x-80` initial state:**
- Files: `index.html` (line 92), `src/index.js` (lines 14–21)
- Why fragile: The mobile menu's initial position (`translate-x-80` ≈ 320px off-screen) and GSAP's `x: 300` slide-in value are hardcoded independently. If the Tailwind config or breakpoint changes, the menu may appear partially visible on load.
- Safe modification: Centralise the offset value or use CSS `hidden`/`transform` classes managed exclusively by GSAP.

**`-webkit-animation` offsets are inconsistent with `animation` values:**
- Files: `src/index.css` (lines 33–48, 99–124)
- Why fragile: For elements `#main2`–`#main5` and `#line2`–`#line8`, the `animation` shorthand uses staggered negative delays (`-3.25s`, `-3s`, etc.) to create the typewriter effect. The `-webkit-animation` fallback on each uses a fixed `-3.5s` delay, producing a different (non-staggered) animation on WebKit browsers.
- Safe modification: Align `-webkit-animation` delays with the corresponding `animation` delays, or drop the webkit prefixes (they are unnecessary for modern browsers).

## Scaling Limits

**Single HTML file architecture:**
- Current capacity: Suitable for a personal portfolio of fixed scope.
- Limit: Adding more than a few projects or sections requires hand-editing a 1,200+ line monolithic HTML file. There is no CMS, data layer, or templating system.
- Scaling path: Adopt a static site generator (Astro, Eleventy) with a data file for projects, allowing content updates without touching layout code.

## Missing Critical Features

**No favicon:**
- Problem: No `<link rel="icon">` tag exists in `index.html`. Browsers display a blank tab icon.
- Blocks: Polished appearance in browser tabs and bookmarks.

**No canonical URL meta tag:**
- Problem: No `<link rel="canonical">` is present, only `og:url` pointing to an expired domain.
- Blocks: Search engines may index duplicate or incorrect URLs.

**No `robots.txt` or `sitemap.xml`:**
- Problem: No crawler hints are provided.
- Blocks: Optimal SEO indexing.

**Contact form is not functional:**
- Problem: The contact section only provides a pre-filled Gmail compose link. The form from `sample.txt` is not wired up. There is no backend, Formspree, Netlify Forms, or EmailJS integration.
- Blocks: Visitors cannot submit messages directly; they must open Gmail in a separate tab with a pre-filled compose window that requires the user to have a Google account.

## Test Coverage Gaps

**No tests of any kind:**
- What's not tested: All JavaScript logic (mobile menu toggle, GSAP animation setup, scroll trigger behaviour).
- Files: `src/index.js`
- Risk: Regressions in navigation or animation are invisible until manual visual testing.
- Priority: Low (static portfolio; logic is minimal), but basic smoke tests or Playwright/Cypress end-to-end checks would catch DOM reference breakage.

---

*Concerns audit: 2026-05-24*
