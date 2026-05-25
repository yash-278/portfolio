# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v1.0 — MVP

**Shipped:** 2026-05-25
**Phases:** 5 | **Plans:** 15 | **Sessions:** ~3

### What Was Built

- Next.js 16 + TypeScript + Tailwind v3 scaffold with dark-mode FOUC prevention and LazyMotion pattern (Phase 1)
- Complete five-section portfolio as statically generated page with SectionReveal scroll animations (Phase 2)
- MDX blog pipeline via @next/mdx + rehype-pretty-code; Nekomori seed post with syntax highlighting (Phase 3)
- Dynamic OG images per post, sitemap, robots.txt (env-aware), RSS feed, blog subdomain redirect (Phase 4)
- Vercel Analytics + SpeedInsights; animation spec audit; Lighthouse 97/100 (LCP 2509ms, CLS 0, TBT 0ms) (Phase 5)

### What Worked

- **Wave-based parallel execution** — Plans 05-01 and 05-02 ran in parallel worktrees cleanly; merge was straightforward
- **SectionReveal abstraction** — Centralizing animation config in one primitive made the Phase 5 audit trivial (read-only pass, zero failures)
- **Constraint decisions upfront** — Committing to LazyMotion + @next/mdx in Phase 1 eliminated entire classes of retrofitting risk
- **Static generation default** — All pages statically generated; no runtime complexity or Vercel compute costs
- **Incremental vertical slices** — Each plan delivered a shippable slice (Phase 2 plans 02-02, 02-03 are a good template)

### What Was Inefficient

- **Context exhaustion mid-execution** — Session ran out of context during Phase 5, requiring a cold restart from summary; LCP fix analysis was duplicated
- **Worktree `gsd-sdk query worktree.cleanup-wave` failures** — SDK fallback doesn't support this command; manual git cleanup was needed
- **REQUIREMENTS.md traceability table** — All 20 entries stayed "Pending" through all 5 phases; the table wasn't updated incrementally and required a bulk update at milestone close
- **Verification files as human_needed** — 4/5 phase verification files ended at `human_needed`; a pattern for async human sign-off would help close these cleanly

### Patterns Established

- `SectionReveal` as the single animation primitive — all scroll animations go through it; spec compliance is enforceable via grep
- `proxy.ts` middleware production-gated via `VERCEL_ENV === 'production'` — safe pattern for all production-only behaviors
- Template literal types for URL fields: `` `https://${string}` `` on any field that must be an absolute URL
- Vercel Analytics placed after `<Footer />` and outside `<LazyMotion>` — root layout stays a Server Component

### Key Lessons

1. **Commit traceability tables incrementally** — updating REQUIREMENTS.md after each phase avoids a bulk audit at close
2. **Lighthouse variability is real** — a 9ms LCP overage is noise, not a failure; document the measurement context, not just the number
3. **Dead links decay fast** — brew-index GitHub was a 404 by Phase 5; a link audit pass early in each milestone prevents last-minute removals
4. **One animation primitive is worth the upfront investment** — SectionReveal made Phase 5 audit a 15-minute read-only pass

### Cost Observations

- Model: Claude Sonnet 4.6 throughout
- Sessions: ~3 (context exhaustion on session 3 required compaction)
- Notable: Context exhaustion during Phase 5 was a significant interruption; keeping phase plans tighter (fewer tasks per plan) would reduce session length

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Sessions | Key Risk | Key Win |
|-----------|--------|-------|----------|----------|---------|
| v1.0 MVP | 5 | 15 | ~3 | Context exhaustion mid-phase | SectionReveal pattern |
