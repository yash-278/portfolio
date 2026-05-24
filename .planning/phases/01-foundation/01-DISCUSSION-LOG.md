# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-24
**Phase:** 1-Foundation
**Areas discussed:** Migration approach, Dark mode wiring, Navbar/Footer scope, Font strategy

---

## Migration approach

| Option | Description | Selected |
|--------|-------------|----------|
| Fresh scaffold | Run `create-next-app` with Next.js 16, manually port v2 assets | ✓ |
| Upgrade v2 in-place | Checkout v2 branch, run `npm install next@16`, fix breakages | |
| You decide | Researcher and planner decide | |

**User's choice:** Fresh scaffold

---

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it for Phase 1 | Plain background for Phase 1 infrastructure; real hero in Phase 2 | ✓ |
| Port it across | Keep animated gradient as placeholder visual | |
| You decide | Researcher / planner pick | |

**User's choice:** Drop the animated gradient background for Phase 1

---

| Option | Description | Selected |
|--------|-------------|----------|
| New branch, merge after | Build Phase 1 on feature branch, PR into main | ✓ |
| Replace main | Create Next.js 16 app directly on main | |

**User's choice:** New branch, merge after PR review

---

## Dark mode wiring

| Option | Description | Selected |
|--------|-------------|----------|
| Default dark, no toggle | Inline blocking script sets dark class; no next-themes | ✓ |
| System preference + no toggle | Inline script reads prefers-color-scheme | |
| Install next-themes now, toggle later | Wire ThemeProvider now, add toggle button in Phase 5 | |

**User's choice:** Default dark, inline blocking script, no toggle

---

| Option | Description | Selected |
|--------|-------------|----------|
| Dark-only for now | CSS only has dark theme tokens | ✓ |
| Both sets of CSS vars now | Define both dark and light CSS vars from Phase 1 | |

**User's choice:** Dark-only CSS vars; light mode vars added when toggle ships (Phase 5)

---

## Navbar/Footer scope

| Option | Description | Selected |
|--------|-------------|----------|
| Logo + real nav links | Site name + Home and Blog links | ✓ |
| Logo only | Placeholder shell, no links | |
| Logo + links, hidden on mobile | Full desktop nav, no mobile hamburger | |

**User's choice:** Logo + real nav links (Home, Blog)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Home, Blog | Two top-level destinations | ✓ |
| Home, About, Projects, Blog | All sections as nav links | |
| You decide | Planner figures out nav structure | |

**User's choice:** Home, Blog only

---

| Option | Description | Selected |
|--------|-------------|----------|
| Name + social links + copyright | Yash Kadam + GitHub/LinkedIn/Twitter + © year | ✓ |
| Copyright line only | Minimal — just © 2025 Yash Kadam | |
| You decide | Planner determines footer contents | |

**User's choice:** Name + social links (github.com/yash-278, LinkedIn, @yashkadam278) + copyright

---

## Font strategy

| Option | Description | Selected |
|--------|-------------|----------|
| 2 fonts: body + mono | One sans-serif + one monospace for code | ✓ |
| 1 font: mono only | Single monospace across entire site | |
| Keep v2's 4 fonts | Preserve Inter + Josefin_Sans + Comfortaa + Fira_Sans | |

**User's choice:** 2 fonts — body sans-serif + monospace for code

---

| Option | Description | Selected |
|--------|-------------|----------|
| Placeholders — decide in Phase 2 | Use conventional defaults now, swap during Phase 2 design pass | ✓ |
| I have preferences | Specific fonts named by user | |

**User's choice:** Placeholder fonts for Phase 1; final pairing decided in Phase 2

---

## Claude's Discretion

- Specific placeholder font names (Inter + JetBrains Mono suggested as sensible defaults)
- Exact inline FOUC script implementation
- Tailwind `darkMode: 'class'` config
- `next/font/google` vs `next/font/local` for monospace

## Deferred Ideas

- **Phase 2 — Design variations:** Show multiple layout/style options simultaneously (side-by-side) before committing. User wants to compare options visually, not sequentially. (Mentioned during font discussion.)
- **Phase 5 — Dark mode toggle + next-themes** (PLSH-01)
- **Phase 5 — Mobile hamburger nav menu**
