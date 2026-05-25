# Phase 3: Blog Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-24
**Phase:** 3-blog-infrastructure
**Areas discussed:** Frontmatter schema, Blog layout & index design, Seed post topic, Syntax highlighting theme

---

## Frontmatter Schema

| Option | Description | Selected |
|--------|-------------|----------|
| Include tags | tags: [typescript, nextjs] — useful for grouping posts later | ✓ |
| No tags | Keep it minimal | |

**User's choice:** Include tags

---

| Option | Description | Selected |
|--------|-------------|----------|
| Add published: true/false | published: false posts skipped by getAllPosts() | ✓ |
| No draft flag | All committed posts are live | |

**User's choice:** Yes, add published flag

---

| Option | Description | Selected |
|--------|-------------|----------|
| That's enough | title, date, description, tags, published | ✓ |
| Add cover image field | coverImage: /images/post-name.jpg | |
| Add canonical URL field | canonical: https://... | |

**User's choice:** Minimal schema — no cover image, no canonical URL

---

## Blog Layout & Index Design

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal list | Title + date + description + reading time, stacked vertically | ✓ |
| Card grid | Each post in a bordered/shadowed card | |

**User's choice:** Minimal list

---

| Option | Description | Selected |
|--------|-------------|----------|
| ← All posts link at the top | Standard navigation affordance | ✓ |
| Navbar is enough | The Navbar already links to /blog | |

**User's choice:** Yes — ← All posts link

---

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal sub-layout | app/blog/layout.tsx sets max-width and prose padding | ✓ |
| No sub-layout | Root layout only, each page handles its own padding | |

**User's choice:** Minimal sub-layout

---

## Seed Post Topic

| Option | Description | Selected |
|--------|-------------|----------|
| Technical post about Nekomori or Brew Index | What you built, why, one interesting decision | ✓ |
| Dev tip or pattern | Short, useful, shareable | |
| You write it, Claude scaffolds | User provides content, Claude formats | |

**User's choice:** Technical post about a project

---

| Option | Description | Selected |
|--------|-------------|----------|
| Nekomori | Anime schedule tracker + watchlist. More feature-complete. | ✓ |
| Brew Index | Searchable Homebrew package frontend. Currently in progress. | |

**User's choice:** Nekomori

---

| Option | Description | Selected |
|--------|-------------|----------|
| Why I built it + one interesting technical decision | ~400-600 words | |
| A specific problem I solved | Walk through one concrete challenge | |
| Let Claude decide the angle | Claude picks the most interesting angle | ✓ |

**User's choice:** Let Claude decide the angle

---

## Syntax Highlighting Theme

| Option | Description | Selected |
|--------|-------------|----------|
| github-dark | Familiar, high contrast, very readable | ✓ |
| tokyo-night | Cooler blue/purple palette, matches indigo accent | |
| one-dark-pro | Warm tones, VS Code classic | |

**User's choice:** github-dark

---

## Claude's Discretion

- Exact prose typography approach (`@tailwindcss/typography` plugin vs custom CSS)
- Nekomori post angle and written content
- Reading time rounding/display format
- Date display format on blog index and post pages
- Nekomori post slug/filename

## Deferred Ideas

- RSS feed (`/feed.xml`) — Phase 4
- Dynamic OG image per post — Phase 4
- Sitemap — Phase 4
- Table of contents — v2 requirement BLOG-05
- Cover image frontmatter field — revisit in Phase 4 if needed for OG images
