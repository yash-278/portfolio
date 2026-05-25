---
phase: 03-blog-infrastructure
fixed_at: 2026-05-25T00:00:00Z
review_path: .planning/phases/03-blog-infrastructure/03-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 03: Code Review Fix Report

**Fixed at:** 2026-05-25T00:00:00Z
**Source review:** .planning/phases/03-blog-infrastructure/03-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4
- Fixed: 4
- Skipped: 0

## Fixed Issues

### WR-01: Date-only strings display wrong day for timezones west of UTC

**Files modified:** `app/blog/page.tsx`
**Commit:** 6f6e93f
**Applied fix:** Added `timeZone: 'UTC'` to the `Intl.DateTimeFormat` options object in `formatDate`. Date-only frontmatter strings (e.g. `"2026-05-20"`) parse as UTC midnight; without this option, visitors on negative-offset timezones (US/Eastern, US/Pacific) see the previous day.

---

### WR-04: `matter(raw)` parsed twice for every post

**Files modified:** `lib/posts.ts`
**Commit:** a8b09f8
**Applied fix:** Changed `const { data } = matter(raw)` on line 24 to `const { data, content } = matter(raw)`, then replaced the second `matter(raw).content` call on line 30 with the already-destructured `content` variable. Each post file is now parsed exactly once.

---

### WR-03: Missing frontmatter validation — `undefined` silently poisons `PostMeta`

**Files modified:** `lib/posts.ts`
**Commit:** ba81c84
**Applied fix:** Added a required-fields validation block after the `published` guard. Checks `['title', 'date', 'description']` and calls `console.warn` then returns `null` for any post missing one or more of those fields. This prevents `undefined` from being typed as `string` in `PostMeta` and prevents `NaN`-based sort instability.

---

### WR-02: `getAllPosts` crashes the build if `content/blog` directory is missing

**Files modified:** `lib/posts.ts`
**Commit:** 7da4413
**Applied fix:** Added `if (!fs.existsSync(BLOG_DIR)) return []` as the first line of `getAllPosts`, before the `readdirSync` call. Prevents an `ENOENT` crash in CI or a fresh clone where the content directory has not yet been created.

---

_Fixed: 2026-05-25T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
