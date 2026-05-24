# Phase 2: Portfolio Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-24
**Phase:** 2-Portfolio Page
**Areas discussed:** Design direction, Hero design, Work History format, Projects section

---

## Design Direction

| Option | Description | Selected |
|--------|-------------|----------|
| Dark minimal | Near-black, white text, single accent, no decorations (linear.app style) | |
| Dark polished | Dark background with gradients, glassmorphism, glowing accents (leerob.io style) | ✓ |
| You decide | Claude picks what suits the brand | |

**User's choice:** Dark polished

---

### Accent Color

| Option | Description | Selected |
|--------|-------------|----------|
| Cyan / teal | Electric, popular in dev portfolios | |
| Indigo / violet | Refined, distinctive, signals quality | |
| Emerald / green | Unconventional, terminal feel | |
| You decide | Claude picks the accent | ✓ |

**User's choice:** You decide (Claude's discretion — indigo/violet recommended)

---

### Font Pairing

| Option | Description | Selected |
|--------|-------------|----------|
| Geist + Geist Mono | Vercel's typeface, clean and modern | ✓ |
| Cal Sans + JetBrains Mono | Punchy headings, distinctive pairing | |
| Inter + JetBrains Mono | Reliable, keep Phase 1 placeholder | |
| You decide | Claude picks | |

**User's choice:** Geist + Geist Mono (locked for Phase 2)

---

## Hero Design

### Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Centered text, full viewport | No photo, clean gradient background | |
| Split: text left, photo right | Personal, requires headshot/photo | ✓ |
| Left-aligned with accent line | Minimal, no photo | |

**Notes:** User asked whether a professional headshot was required — confirmed casual travel photos work well. User confirmed they have a suitable casual photo.

---

### Pitch Line

| Option | Description | Selected |
|--------|-------------|----------|
| Building products people actually use. | Outcome-focused | |
| I write code, lead teams, and ship things. | Active and punchy | ✓ |
| Technical Lead by day. Side projects by night. | Relatable, memorable | |
| Write your own | Free-text | |

**User's choice:** "I write code, lead teams, and ship things."

---

## Work History Format

| Option | Description | Selected |
|--------|-------------|----------|
| Title + company + dates only | Clean, scannable | |
| Title + company + dates + 1 impact line | Substance without clutter | ✓ |
| Full bullets per role | 2-3 bullet points, detailed | |

**User's choice:** One impact line per role

### Roles to Include

| Option | Description | Selected |
|--------|-------------|----------|
| Current role only | KingsleyGate only | |
| Current + 1-2 previous roles | Shows progression | ✓ |
| I'll provide the list | Free-text | |

**Notes:** Previous role details (company, title, dates, impact line) to be gathered at implementation time by executor.

---

## Projects Section

### Card Content

| Option | Description | Selected |
|--------|-------------|----------|
| Name + 1-line description + tech tags + links | Concise and scannable | ✓ |
| Name + 2-3 line description + tech tags + links | More context | |
| Name + tech tags + links only | Ultra-minimal | |

**User's choice:** Name + 1-line description + tech tags + links

### Descriptions

| Option | Description | Selected |
|--------|-------------|----------|
| Use Claude's drafts | Nekomori: "Anime schedule tracker..." / Brew Index: "A searchable frontend..." | ✓ |
| I'll give you better descriptions | Free-text | |
| You decide | Claude drafts | |

**User's choice:** Accepted Claude's drafted descriptions as-is

---

## Claude's Discretion

- Exact accent color (indigo/violet recommended)
- Background treatment (mesh gradient, noise texture, or glow)
- Card border and shadow style
- Section spacing and scroll behavior
- Scroll-triggered entrance animations (LazyMotion, keep light)
- Hero photo placement, sizing, and border/shadow

## Deferred Ideas

- Mobile hamburger nav menu → Phase 5
- Dark mode toggle → Phase 5 (PLSH-01)
- Project case study pages → future milestone (PROJ-01)
- Blog list → Phase 3
