# Yash Kadam — Personal Portfolio

## What This Is

A personal portfolio and content hub for Yash Kadam, Technical Lead and fullstack developer, deployed at yashkadam.com. The site establishes an online presence, showcases selected projects, and serves as the foundation for future income streams including content creation, 1-on-1 developer mentoring, and consulting. Built with Next.js and deployed on Vercel.

## Core Value

A first-time visitor (developer, potential client, or collaborator) should leave knowing exactly who Yash is, what he's built, and how to reach him — in under 60 seconds.

## Requirements

### Validated

- [x] Next.js 16.2.6 + TypeScript + Tailwind v3 scaffold on Vercel (FOUND-01) — Validated in Phase 1: Foundation
- [x] Dark mode FOUC prevented via inline blocking script in root layout (FOUND-02) — Validated in Phase 1: Foundation
- [x] Framer Motion LazyMotion + domAnimation pattern from project start (FOUND-03) — Validated in Phase 1: Foundation
- [x] MDX pipeline configured via @next/mdx; rehype-pretty-code deferred to Phase 3 (FOUND-04) — Validated in Phase 1: Foundation
- [x] Shared Navbar and Footer visible on all pages (FOUND-05) — Validated in Phase 1: Foundation
- [x] NEXT_PUBLIC_SITE_URL=https://yashkadam.com set in Vercel env vars (FOUND-06) — Validated in Phase 1: Foundation

### Active

- [ ] Hero section with name, title, and short pitch
- [ ] About section with current role (Technical Lead at KingsleyGate) and brief career arc
- [ ] Work history timeline (current + previous roles)
- [ ] Projects section showcasing Nekomori and Brew Index (and optionally others)
- [ ] Skills / tech stack section (JS, TS, React, Node, Express, MongoDB, Tailwind, Figma)
- [ ] Blog at /blog with MDX-based authoring (markdown files, git commit, auto-deploy)
- [ ] Contact section with links: email, LinkedIn, GitHub, Twitter
- [ ] Blog subdomain redirect: blog.yashkadam.com → yashkadam.com/blog
- [ ] Vercel deployment with custom domain yashkadam.com

### Out of Scope

- CMS / visual editor — MDX in-repo is sufficient for now
- YouTube integration — not ready to commit to video content
- Consulting booking / payment system — too early; establish presence first
- Twitter clone, Crown Clothing, India Travel Agency, Jadoo on projects page — older work, not representative of current level
- Full-blown design system or component library — not needed for a personal site

## Context

- Existing codebase: vanilla HTML/Tailwind/GSAP single-page portfolio (main branch) — starting fresh, not continuing this
- v2 branch exists: Next.js 14 + Framer Motion + Tailwind, only has a hero component — this is the right stack to continue from
- Old blog exists at blog.yashkadam.com — old stack (React + NestJS + GraphCMS), being superseded
- Current domain: yashkadam.com (already owned)
- Tech Lead at KingsleyGate is the current role
- Active side projects: Nekomori (TypeScript, anime schedules, 5 stars) and Brew Index (frontend to Homebrew registry, in progress)
- Stack: JavaScript (53%), TypeScript (34%), also Bash — shifting toward more backend/Go
- GitHub: github.com/yash-278
- Twitter: @yashkadam278
- Deployed to Vercel

## Constraints

- **Tech stack**: Next.js 14+ with TypeScript, Tailwind CSS, Framer Motion — v2 branch is the starting point
- **Deployment**: Vercel with yashkadam.com custom domain
- **Blog**: MDX files in-repo under `/content/blog` — no external CMS
- **Content**: Projects shown must be ones Yash is actively proud of; no placeholder/demo projects
- **Performance**: Static generation where possible (portfolio content doesn't change often); Core Web Vitals matter for credibility

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over vanilla HTML | Component-based, easy to extend blog/pages, Vercel-native, already started in v2 branch | — Pending |
| MDX in-repo for blog | Zero external dependency, free, git-native workflow suits infrequent thoughtful posts | — Pending |
| blog.yashkadam.com → yashkadam.com/blog | Single destination, single codebase, no subdomain split to maintain | — Pending |
| Design direction: iterate clean-professional vs dark-polished before committing | User wants to see 2-3 variations of each before locking a direction | — Pending |
| Start with presence, not monetization | Establishing credibility first; mentoring/consulting come after content traction | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Current State

Phase 1 complete — Next.js 16.2.6 scaffold running on Vercel with Tailwind v3, MDX pipeline, dark-mode FOUC prevention, LazyMotion, Navbar, and Footer. Build exits 0. /blog/test-post statically generated as proof-of-concept.

---
*Last updated: 2026-05-24 after Phase 1: Foundation*
