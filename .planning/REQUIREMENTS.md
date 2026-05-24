# Requirements: Yash Kadam Portfolio

**Defined:** 2026-05-24
**Core Value:** A first-time visitor (developer, potential client, or collaborator) should leave knowing exactly who Yash is, what he's built, and how to reach him — in under 60 seconds.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Site runs on Next.js 16 + TypeScript + Tailwind v3, deployed on Vercel at yashkadam.com
- [ ] **FOUND-02**: Dark mode FOUC prevented via inline blocking script in root layout
- [ ] **FOUND-03**: Framer Motion configured with `LazyMotion` + `domAnimation` pattern from project start
- [ ] **FOUND-04**: MDX pipeline configured via `@next/mdx` with `rehype-pretty-code` syntax highlighting
- [ ] **FOUND-05**: Shared Navbar and Footer visible on all pages
- [ ] **FOUND-06**: `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` set in Vercel env vars before first build

### Portfolio

- [ ] **PORT-01**: Hero section with name, title (Technical Lead), and one-line pitch — no typewriter animation
- [ ] **PORT-02**: About section with current role at KingsleyGate and brief background
- [ ] **PORT-03**: Work History timeline with companies, titles, and dates
- [ ] **PORT-04**: Projects section with Nekomori and Brew Index cards (tech stack tags, live link, GitHub link)
- [ ] **PORT-05**: Contact section with GitHub, LinkedIn, and Twitter/X links — no contact form

### Blog

- [ ] **BLOG-01**: Blog post list at `/blog` — title, date, description, reading time, newest first
- [ ] **BLOG-02**: Individual post pages at `/blog/[slug]` with MDX, typography styles, and syntax highlighting
- [ ] **BLOG-03**: RSS feed at `/feed.xml`
- [ ] **BLOG-04**: Dynamic OG image per blog post via `next/og`

### SEO & Deployment

- [ ] **SEO-01**: `metadata` with title, description, and OG image on every page (absolute URLs)
- [ ] **SEO-02**: Sitemap at `/sitemap.xml` including all pages and blog posts
- [ ] **SEO-03**: `robots.txt` — allow on prod, disallow on staging
- [ ] **SEO-04**: `middleware.ts` redirecting `blog.yashkadam.com → yashkadam.com/blog` (308 permanent)

### Analytics

- [ ] **ANLYT-01**: Vercel Analytics enabled in root layout (cookieless, no consent banner)

## v2 Requirements

### Content Depth

- **PROJ-01**: Project case study pages at `/projects/[slug]` — detailed write-ups with context, decisions, outcomes
- **PROJ-02**: Crown Clothing or other older projects added back if substantially updated

### Blog Enhancements

- **BLOG-05**: Table of contents for long-form posts (sticky sidebar)
- **BLOG-06**: JSON-LD Article schema on post pages

### SEO Enhancements

- **SEO-05**: JSON-LD `WebSite` + `Person` schema in root layout

### Polish

- **PLSH-01**: Dark mode toggle (system preference detection via `next-themes`)
- **PLSH-02**: Tailwind v4 upgrade (focused standalone sprint)

### Growth

- **GROW-01**: 1-on-1 mentoring booking page (when establishing that offering)
- **GROW-02**: Newsletter signup integration

## Out of Scope

| Feature | Reason |
|---------|--------|
| Animated skill progress bars | Credibility anti-pattern — replaced by tech tags on project cards |
| Typewriter / typing animation in hero | Cliché; slows first impression; static confident text is stronger |
| Contact form with server handling | Requires backend; spam-prone; direct email link converts better |
| CMS / visual editor (Sanity, etc.) | MDX in-repo is sufficient for infrequent, thoughtful posts |
| Preloader / loading screen | Adds perceived latency on a statically generated site |
| Particle.js / tsparticles background | Heavy client JS, destroys Core Web Vitals |
| Custom cursor | Breaks accessibility; invested effort in wrong place |
| Skills grid with 20+ logos sans project context | Reads as junior; skills shown through project tech tags instead |
| YouTube / video content integration | Not committing to video yet; establish written presence first |
| Twitter clone, Crown Clothing (Heroku), India Travel Agency, Jadoo | Older demo work; Heroku links dead; not representative of current level |
| Google Analytics with consent banner | Worse than nothing; Vercel Analytics is the correct choice |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| PORT-01 | Phase 2 | Pending |
| PORT-02 | Phase 2 | Pending |
| PORT-03 | Phase 2 | Pending |
| PORT-04 | Phase 2 | Pending |
| PORT-05 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| BLOG-01 | Phase 3 | Pending |
| BLOG-02 | Phase 3 | Pending |
| BLOG-03 | Phase 4 | Pending |
| BLOG-04 | Phase 4 | Pending |
| SEO-02 | Phase 4 | Pending |
| SEO-03 | Phase 4 | Pending |
| SEO-04 | Phase 4 | Pending |
| ANLYT-01 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-24*
*Last updated: 2026-05-24 — traceability confirmed after roadmap creation*
