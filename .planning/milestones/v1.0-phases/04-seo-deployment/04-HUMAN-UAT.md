---
status: partial
phase: 04-seo-deployment
source: [04-VERIFICATION.md]
started: 2026-05-25T09:44:00Z
updated: 2026-05-25T09:44:00Z
---

## Current Test

Human verification for deployed OG image and subdomain redirect.

## Tests

### 1. OG image social card display
expected: Sharing a blog post URL renders the post's branded dark-background OG image in social previews (WhatsApp, Twitter/X, LinkedIn, opengraph.xyz)
result: PASSED — confirmed working on opengraph.xyz after setting NEXT_PUBLIC_SITE_URL=https://www.yashkadam.com in Vercel env vars

### 2. blog.yashkadam.com 308 redirect on production
expected: Any request to blog.yashkadam.com receives a 308 redirect to https://yashkadam.com/blog when VERCEL_ENV=production
result: [pending] — requires blog.yashkadam.com added as a domain alias in Vercel project settings and DNS configured

## Summary

total: 2
passed: 1
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
