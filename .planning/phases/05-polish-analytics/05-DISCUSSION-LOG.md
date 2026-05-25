# Phase 5: Polish & Analytics - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-25
**Phase:** 5-Polish & Analytics
**Areas discussed:** Lighthouse baseline

---

## Gray Area Selection

| Area | Description | Selected |
|------|-------------|----------|
| Analytics scope | @vercel/analytics vs also adding Speed Insights | |
| Live demo links | Whether Nekomori/Brew Index have live URLs to add | |
| Hero animation stagger | Whether 6 sequential entrance animations is too many | |
| Lighthouse baseline | Whether site is ready to pass or needs work first | ✓ |

---

## Lighthouse Baseline

### Q1: Starting point for Core Web Vitals

| Option | Description | Selected |
|--------|-------------|----------|
| Unknown — hasn't been run yet | Phase 5 plan should include run-and-diagnose step first | ✓ |
| Looks fast, should pass as-is | Mostly confirming numbers | |
| Known issues to fix | Specific things to address | |

**User's choice:** Unknown — hasn't been run yet
**Notes:** No prior Lighthouse audit exists. Executor must run it as the first step before any changes.

### Q2: What to do if a metric fails

| Option | Description | Selected |
|--------|-------------|----------|
| Fix in Phase 5 — the phase isn't done until it passes | Open-ended but correct per success criteria | ✓ |
| Diagnose in Phase 5, fix in follow-on phase | Keeps scope tight but defers the gate | |
| Fix known suspects only | Address likely culprits, document rest | |

**User's choice:** Fix in Phase 5
**Notes:** Phase 5 success criteria is hard gated on LCP <2.5s, CLS <0.1, INP <200ms. Executor owns fixing whatever Lighthouse surfaces.

### Q3: Pre-specified suspects

| Option | Description | Selected |
|--------|-------------|----------|
| No idea — let Lighthouse tell us | Data-driven, no pre-specified targets | ✓ |
| Image loading (yash.jpg hero photo) | next/image with priority already used | |
| Framer Motion bundle size | LazyMotion already in place | |

**User's choice:** Let Lighthouse tell us
**Notes:** No pre-emptive optimization. Executor diagnoses from Lighthouse data only.

---

## Claude's Discretion

- Whether to add Vercel Speed Insights alongside Analytics (user didn't select this area for discussion)
- Exact CWV fix strategy — data-driven based on Lighthouse output
- Whether to reduce hero stagger count (not discussed; Claude's call if it reads as excessive)
- Live demo URL handling — Nekomori/Brew Index links not discussed; executor should check what's in code and verify what exists

## Deferred Ideas

- Dark mode toggle — v2 PLSH-01
- Tailwind v4 upgrade — v2 PLSH-02
- JSON-LD schemas — v2 SEO-05, BLOG-06
- Table of contents — v2 BLOG-05
