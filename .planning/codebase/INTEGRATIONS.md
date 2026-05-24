# External Integrations

**Analysis Date:** 2026-05-24

## APIs & External Services

**CDN-delivered JavaScript libraries:**
- GSAP 3.9.1 (GreenSock Animation Platform)
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js`
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/ScrollTrigger.min.js`
  - Auth: None (public CDN)
- jQuery 3.5.1 slim
  - URL: `https://code.jquery.com/jquery-3.5.1.slim.min.js`
  - Auth: None (public CDN)
  - Note: Loaded but no jQuery API calls found in `src/index.js`; may be a leftover dependency

**Typography:**
- Google Fonts CDN
  - `Source Code Pro` — loaded via `<link>` in `index.html` (lines 42-44)
  - `IBM Plex Mono` — loaded via `@import` in `src/index.css` (line 2)
  - Auth: None (public CDN)

## Data Storage

**Databases:**
- None — fully static site with no backend or database

**File Storage:**
- Local filesystem only (`src/assets/` for images and SVGs, `dist/main.css` for compiled CSS)

**Caching:**
- None configured

## Authentication & Identity

**Auth Provider:**
- None — no login, session, or user management

## Contact / Messaging

**Contact mechanism:**
- Gmail Compose link (no form backend)
  - URL: `https://mail.google.com/mail/?view=cm&fs=1&to=yashkadam278@gmail.com&su=SUBJECT&body=BODY`
  - Located in `index.html` contact section (line 1114)
  - No form submission handler; clicking "CONTACT ME" opens Gmail in a new tab
- `sample.txt` contains a commented-out contact form HTML snippet (never included in production `index.html`)

## Social Profile Links

The following external profile URLs are linked from the contact section of `index.html`:
- LinkedIn: `https://www.linkedin.com/in/kadamyash/`
- Twitter: `https://twitter.com/yashkadam278`
- GitHub: `https://github.com/yash-278`
- Frontend Mentor: `https://www.frontendmentor.io/profile/yash-278`
- freeCodeCamp: `https://www.freecodecamp.org/yashkadam`

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- None — browser console only

## CI/CD & Deployment

**Hosting:**
- Static file host (previously `https://www.yashkadam.cf/` per Open Graph meta tags)
- A GitHub Pages URL (`https://yash-278.github.io/tourist-site/`) is linked within a project card in `index.html`, indicating GitHub Pages is used for at least one linked project

**CI Pipeline:**
- None detected — no GitHub Actions, Netlify config, or Vercel config present

## Environment Configuration

**Required env vars:**
- None — no server-side logic, no secrets, no API keys

**Secrets location:**
- Not applicable

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-05-24*
