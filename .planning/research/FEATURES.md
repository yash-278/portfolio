# Feature Landscape

**Domain:** Personal developer portfolio + blog
**Project:** Yash Kadam — yashkadam.com
**Researched:** 2026-05-24
**Overall confidence:** HIGH (verified against brittanychiang.com, leerob.com, delba.dev, joshwcomeau.com, kentcdodds.com, taniarascia.com, official Next.js docs)

---

## Table Stakes

Features that, if missing, cause visitors to leave or not take you seriously. A recruiter, potential client, or developer peer lands on your site expecting these. Absence signals neglect.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Name + title + one-line pitch in the hero | Visitors decide in 3 seconds whether to stay | Low | "Yash Kadam — Technical Lead & Fullstack Developer" + one sentence on what he does |
| Responsive layout (mobile-first) | >50% of portfolio visits come from mobile; broken mobile = unprofessional | Low–Medium | Tailwind's responsive utilities make this straightforward |
| Projects section with 2–4 showcased works | What you've built is the proof of ability | Medium | Cards with title, description, tech stack tags, live + source links; show only work you're proud of (Nekomori, Brew Index) |
| Work history with current role visible | Recruiters and clients want to instantly see your seniority and employer | Low | Timeline or list; current role (Technical Lead, KingsleyGate) must be prominent |
| Contact section with social links | Site without contact info is a dead end | Low | Email, LinkedIn, GitHub, Twitter/X; simple row of icons + email is enough |
| Blog post list at /blog | A developer who writes signals expertise | Low | Date, title, optional short description; newest first |
| Blog individual post with readable typography | Unreadable posts drive readers away immediately | Low–Medium | @tailwindcss/typography `prose` classes; min 16px body, adequate line-height |
| Syntax highlighting for code blocks | Technical blog without code highlighting is jarring | Low | rehype-pretty-code (powered by shiki); VS Code themes; zero default styles so you control the look |
| Meta title + description on every page | Basic SEO hygiene; missing it signals "hobby project" | Low | Next.js App Router `metadata` export; static on portfolio, dynamic (`generateMetadata`) on blog posts |
| Open Graph image for social sharing | Links shared on Twitter/LinkedIn without an OG image look broken | Low–Medium | `next/og` `ImageResponse` generates dynamic OG images at build time per blog post; static OG image for homepage |
| Canonical URLs | Prevents search engines treating the same content as duplicates | Low | Handled automatically by Next.js metadata API |
| Favicon | Without one, browser tab shows a blank page icon | Low | `favicon.ico` in `app/` root is auto-detected by Next.js |
| Fast initial load (< 3s on 3G) | Core Web Vitals score affects credibility; slow = bad first impression | Medium | Static generation (`generateStaticParams`), Next.js Image optimization, no heavy client bundles on initial load |
| Clean URLs | `/blog/post-title` not `/blog?id=123` | Low | File-based routing in Next.js App Router handles this |
| HTTPS at custom domain | Non-HTTPS domain causes browser security warnings | Low | Vercel handles TLS automatically |

---

## Differentiators

Features that are not expected but create a memorable, standout experience. These are what get a portfolio linked on Twitter or remembered by a hiring manager who saw 20 portfolios that week.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Reading time estimate on blog posts | Sets expectation; shows reader respect; highly visible on respected dev blogs (Kent C. Dodds, Tania Rascia) | Low | `reading-time` npm package; calculate in `generateStaticParams` or a utils function at build time; add to frontmatter processing |
| Table of contents for long posts | Signals that posts are substantial and well-organized; navigability for technical deep dives | Medium | `remark-toc` or `rehype-slug` + manual extraction; sticky sidebar TOC is most elegant; only worth adding for posts > 1000 words |
| RSS feed | Discovery mechanism for developer audiences who use RSS readers (Feedly, NetNewsWire, Reeder); a feed signals a "real" blog | Low | Next.js route handler at `/feed.xml` or `/rss.xml`; generate from MDX frontmatter at build time; Vercel's Portfolio Starter Kit includes this pattern |
| Dynamic OG images per blog post | Each post shared on social looks unique and branded vs. a generic static image | Medium | `next/og` + `ImageResponse`; include post title, author name, optional tag |
| Per-post syntax highlighting theme matching site color scheme | Looks intentional and cohesive; most devs use default VS Code Dark — a custom or matched theme stands out | Low | rehype-pretty-code supports any Shiki theme; pick one that complements the site palette |
| Subtle scroll-driven animations | Adds polish without being distracting; signals Framer Motion competence (relevant since Framer Motion is in the stack) | Medium | Framer Motion `whileInView` / `initial`+`animate` on section entry; keep subtle — opacity + Y translate; no parallax, no letter-by-letter typing |
| "Built with" footer transparency | Shows technical honesty; resonates with dev audience; Brittany Chiang does this ("Built with Next.js, Tailwind, Vercel") | Low | Simple footer line; reinforces the stack |
| Project write-ups / case studies | Turns a project card into a story; most portfolios stop at bullet points | High | Even 2–3 paragraphs per project explaining the problem, decision, and outcome is rare and memorable; `/projects/[slug]` route |
| Skills shown through work, not a list | Implicit proof is more credible than "Proficiency: 85% React" | Low | Remove skills bar chart; instead put tech stack tags on project cards and experience entries — the tags are the skills section |
| Smooth page transitions | Creates a cohesive single-app feel between portfolio and blog | Medium | Framer Motion `AnimatePresence` on route changes; keep duration under 300ms |
| Sitemap.xml | Better Google indexing; matters most once you have 5+ blog posts | Low | Next.js App Router: create `app/sitemap.ts` returning a `MetadataRoute.Sitemap` array — it auto-generates at build |
| robots.txt | Controls crawlers correctly; signals you know what you're doing | Low | `app/robots.ts` in Next.js; allow all, disallow nothing on a public portfolio |
| JSON-LD schema | Rich results in Google search (author byline, article dates); used by Vercel's Portfolio Starter Kit | Low | Add `WebSite` and `Person` schema to root layout; add `Article` schema on blog post pages |

---

## Anti-Features

Features to deliberately NOT build. These are overused, technically tacky, or actively harm the impression you make on senior developers and technical clients.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Animated skill progress bars ("React: 90%") | Meaningless numbers — who decides you're 90%? Signals junior thinking. Every experienced developer who sees this rolls their eyes | Show tech stack tags on projects and work history; let the work speak |
| Typing/typewriter animation in the hero | Overused to the point of cliché; slows down the 3-second read window; seen on every Themeforest template since 2015 | Static hero text with good typography and a confident one-liner |
| Full-screen particle.js or tsparticles background | Heavy JavaScript, degrades Core Web Vitals, distracts from content; the hallmark of a beginner portfolio template | Use a clean background color or subtle grid/gradient via pure CSS |
| Preloader / loading screen animation | Adds perceived latency; visitors abandon before it finishes; it's your own site, not a game | Static generation means instant load — there's nothing to "load" |
| Contact form with server-side handling | Requires backend; spam-prone without CAPTCHA; overkill for a personal site; adds maintenance burden | Direct email link + social profiles; optionally Formspree/Web3Forms if a form is truly needed |
| Dark/light mode toggle (built yourself) | This has flipped to table stakes in 2025, but building a custom toggle from scratch wastes time vs. using the CSS `prefers-color-scheme` system default; the anti-feature is "building it wrong" — no flash of wrong theme | Use `next-themes` library; respect OS preference; eliminate FOUC with an inline script in `<head>` |
| "Available for freelance" blinking badge | Looks desperate; undermines authority positioning | If seeking clients, state it clearly in a professional About section one-liner |
| Testimonials section | Unverifiable claims feel like marketing copy; no one reads them on a personal dev portfolio | Let GitHub stars, live project links, and employer names provide social proof |
| YouTube video embed in hero | Heavy iframe embed degrades LCP; YouTube privacy concern; not ready for video per PROJECT.md | Skip until video content is actually ready |
| Visitor counter | Vanity metric that backfires if low; looks dated (1990s web) | Use Vercel Analytics internally for your own data |
| Full list of every side project and toy project | Dilutes the signal; "Crown Clothing" and "India Travel Agency" are explicitly out of scope per PROJECT.md | Curate ruthlessly: Nekomori, Brew Index, plus 1–2 others maximum |
| Newsletter signup popup | Interrupts reading; feels aggressive for a portfolio that has zero subscribers yet | Add a subtle inline "subscribe" link in the blog footer once you have consistent posts |
| Google Analytics with full cookie consent banner | Privacy theatre that degrades UX; technically complex to get right; consent banner kills first impression | Vercel Web Analytics (cookieless, no consent required) or Umami Cloud free tier |
| Custom cursor | Overused; breaks accessibility (relying on CSS custom cursor for UX); often janky on track pads | Use default cursor; invest time in better content |

---

## Feature Dependencies

```
Blog post list (/blog) → Blog individual post (/blog/[slug])
Blog individual post → Syntax highlighting (rehype-pretty-code)
Blog individual post → Reading time (calculate at build time from MDX source)
Blog individual post → Dynamic OG image (next/og per slug)
Blog individual post → Table of contents (only for posts > 1000 words; rehype-slug required first)
Dynamic OG images → Sitemap (sitemap should link canonical post URLs)
RSS feed → Blog post list (RSS is a structured version of the same content)
Work history → Projects section (projects gain context from role timeline)
Projects section → Skills-via-tags (tech stack tags on projects = implicit skills section)
Dark mode → next-themes (system-default; avoid building from scratch)
Sitemap → robots.txt (robots.txt should reference the sitemap URL)
```

---

## MVP Recommendation

The minimum coherent product that achieves "visitor leaves knowing exactly who Yash is, what he's built, and how to reach him in under 60 seconds":

**Build in Phase 1 (presence):**
1. Hero — name, title, one-line pitch
2. About — current role + short career arc (3–4 sentences)
3. Work history — current role prominent, 2–3 previous roles
4. Projects section — Nekomori + Brew Index with tech tags, live link, source link
5. Contact section — email + GitHub + LinkedIn + Twitter icons
6. Navigation — sticky top nav with anchor links (single-page) or persistent header (multi-page)
7. SEO basics — `metadata` on all pages, static OG image, favicon, robots.txt, sitemap

**Build in Phase 2 (blog):**
8. /blog post list — dates, titles, reading time
9. /blog/[slug] individual post — prose typography, syntax highlighting, OG image per post
10. RSS feed at /feed.xml
11. Vercel Analytics enabled (one-liner)

**Defer until traction exists:**
- Table of contents (only valuable with 3+ long-form posts)
- JSON-LD schema (nice-to-have; add after blog has posts)
- Dark mode (medium complexity; do system-preference detection only; skip toggle until design is locked)
- Project case study write-ups (/projects/[slug]) — add after projects are more mature

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Table stakes list | HIGH | Cross-validated across 6+ live developer portfolios and official docs |
| Anti-features list | HIGH | Consistent across developer community; specific items confirmed against known patterns |
| Blog features (MDX, rehype, RSS) | HIGH | Verified against official Next.js docs (lastUpdated: 2026-05-19) |
| Analytics recommendations | HIGH | Verified Vercel Analytics docs (lastUpdated: 2026-03-10) and Plausible/Umami official sources |
| Dark mode classification | MEDIUM | Table stakes in 2025 for developer portfolios is supported by community consensus, but the implementation advice (next-themes + system preference) is HIGH confidence |
| Reading time / TOC as differentiators | MEDIUM | Observed on high-traffic developer blogs; absence of reading time is not fatal, but presence is visibly differentiating |

---

## Sources

- brittanychiang.com — live portfolio (verified 2026-05-24)
- leerob.com — live portfolio (verified 2026-05-24)
- delba.dev — live portfolio (verified 2026-05-24)
- joshwcomeau.com — live portfolio/blog (verified 2026-05-24)
- kentcdodds.com — live portfolio/blog (verified 2026-05-24)
- taniarascia.com — live portfolio/blog (verified 2026-05-24)
- https://nextjs.org/docs/app/guides/mdx — Next.js MDX guide (version 16.2.6, lastUpdated 2026-05-19)
- https://nextjs.org/docs/app/getting-started/metadata-and-og-images — Next.js Metadata API (version 16.2.6, lastUpdated 2026-05-19)
- https://vercel.com/docs/analytics — Vercel Web Analytics (lastUpdated 2026-03-10)
- https://docs.umami.is/docs/about — Umami Analytics official docs
- https://plausible.io/privacy-focused-web-analytics — Plausible Analytics official
- https://rehype-pretty.pages.dev/ — rehype-pretty-code documentation
- Vercel Portfolio Starter Kit (vercel/examples) — feature set verified via Vercel Templates page
