# These Days landing page

2026-10-04. Yash requested a landing page in this portfolio, compared three designs by Fable, then selected Nightfall and authorized deployment to the existing Vercel portfolio project.

The route is `/these-days`. The home page links to it in the projects section. App implementation and product decisions belong in `/Users/yash/Personal/journal`.

## Selected design

Nightfall is now the page at `/these-days`. It uses a deep indigo canvas, Fraunces display type, a centered headline, and an upright Today capture emerging from the first section. The Write, Revisit, and Reflect walkthrough changes one pinned phone as the reader scrolls. Narrow or short windows show a separate capture for each step. Reduced motion removes the cross-fade.

The portfolio card and generated share image use the same dark palette. The share image embeds a 300-weight Fraunces font from Google Fonts, with its SIL Open Font License in `public/these-days/fonts/OFL.txt`. Canonical metadata, app icons, and the sitemap retain `/these-days`.

The comparison routes remain available locally. `.vercelignore` excludes the design study, unrelated local prototypes, documentation, and local environment files from the CLI upload. The selected page and its scroll component have no dependency on the study directories.

The [design study](./these-days-designs.md) records the references and comparison. The initial design below is retained as history.

## Initial design

- Canvas `#FAFAF7`, blue `#2D5BCF`, ink `#242923`, muted text `#62685F`, pale blue `#E8EDFB`, and gallery background `#EEF1E9`.
- Newsreader for large display and sample writing, Albert Sans for body copy and controls. The iPhone app's serif reading and blue accent guide the choice.
- A left-aligned headline and real phone capture open the page. A short centered introduction leads to a screen gallery. A blue privacy section, native disclosures, and a project note follow.
- The large blue headline is the main visual emphasis. The date ribbon, writing samples, and current app icon make it specific to this journal. No unselected icon study is used.
- All three screens use the same upright device frame, with a slim dark bezel and a hardware island over the status bar's empty center. The screenshot itself is unchanged. The hero circle and phone share a center, and the portfolio card uses the same frame.

```text
brand                         app / privacy / status

Keep a little                 real Today screen
of today.                     on a pale blue circle
description / explore

              one-line writing introduction

section heading               short description
[ Write | Revisit | Reflect ]
screen explanation            selected native capture
sample writing

blue privacy section          local storage / exports / pace
questions                     expandable answers
              development status / maker link
```

An initial thought of layered sample cards around the phone was dropped. One native screen keeps the hero readable and avoids inventing app controls. Each gallery button changes both the explanation and the screenshot, with keyboard tab navigation and a matching tab panel.

## References

Inspected on 2026-10-04:

- [Journalistic](https://www.journalisticapp.com/): straightforward micro-journaling introduction and prominent product screen.
- [Craft](https://www.craft.do/): large serif typography and generous space around the introduction. These Days uses its own palette and existing app imagery.
- [Day One](https://dayoneapp.com/): a product narrative connecting capture, revisiting, and ownership of entries.
- The existing `/tillwise` route: portfolio integration, isolated product navigation, and route metadata.

## Content and assets

Claims come from the journal's current `README.md`, `docs/design.md`, and app implementation. Writing, exact tag/person search, reflection questions, local storage, Markdown export, and JSON backups exist. Public availability and iCloud sync are not claimed. The website retains the portfolio's existing analytics; statements about no analytics explicitly describe the iPhone app.

All native captures were refreshed on 2026-10-04 from the current Debug build, version 0.1.0 (23), on one dedicated iPhone 18 Pro simulator. Each image is 1206 × 2622 pixels, in light appearance with a consistent 9:41 status bar. They are development captures, not device acceptance evidence. Sources in `/Users/yash/Personal/journal`:

| Asset | Source |
| --- | --- |
| `public/these-days/today.png` | `output/website-captures-2026-10-04/today.png` |
| `public/these-days/journal.png` | `output/website-captures-2026-10-04/journal.png` |
| `public/these-days/reflect.png` | `output/website-captures-2026-10-04/reflect.png` |
| `public/these-days/icon.png` | `App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`, existing app icon |

The journal's `scripts/website-fixture` creates 20 invented entries through the real `JournalCore` repository. The set includes three entries today, two yesterday, an entry on this day last year, favorites, confirmed people mentions, tags, and answers to built-in questions. Today, Journal, and Reflect show the same data. The page's sample quotations match these captures. No private journal, phone database, or imported archive was used.

## Local commands

```sh
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run lint
npm run build
```

Open `http://127.0.0.1:3000/these-days`. No new dependencies or app environment variables are required. The source changes are uncommitted.

For the optimized local preview, run `npm run start -- --hostname 127.0.0.1 --port 3001` after building, then open `http://127.0.0.1:3001/these-days`.

## Deployment

The checkout is linked to the existing `portfolio` project in the `kadam-yash-projects` Vercel scope. Deploy with:

```sh
vercel deploy --prod --yes --scope kadam-yash-projects
```

The first attempt on 2026-10-04 was rejected because the project's Node 20 runtime was discontinued. `package.json` and its lockfile now declare Node `24.x`, which overrides that setting. Dependency versions are unchanged. The local production build passed before upload, and Vercel's Node 24 build passed on the second attempt.

Deployed on 2026-10-04 to [www.yashkadam.com/these-days](https://www.yashkadam.com/these-days). Vercel reports the production deployment [portfolio-jtmurozln-kadam-yash-projects.vercel.app](https://portfolio-jtmurozln-kadam-yash-projects.vercel.app) as `READY`, aliased to `www.yashkadam.com`.

Live verification:

- Desktop at 1280x800 and mobile at 390x844 show Nightfall without horizontal overflow, broken screenshot images, or comparison controls. The canonical URL and both social image tags use `https://www.yashkadam.com/these-days`.
- The portfolio's Explore These Days link opens the new page with one header and one footer. See the app reaches the walkthrough; scrolling to Revisit selects the Journal capture. The FAQ opens by click and closes with Enter.
- The landing page, home page, Tillwise, blog, all three native screenshots, share image, and sitemap return HTTP 200. The sitemap includes `/these-days`. The excluded comparison route returns HTTP 404 in production.
- Local lint passed with only the two existing warnings in `src/index.js`. The screenshots and shared device frame are unchanged from the approved comparison.
- A separate check of the bare `https://yashkadam.com` host fails TLS hostname verification. The `www` host is verified and is the public link used here. This deployment did not change DNS or certificate settings.

## Initial local verification

2026-10-04:

- `npm run build` passes, including TypeScript and static generation of the landing page and share image.
- `npm run lint` reports no errors. Its two existing unused-variable warnings are in the untouched legacy `src/index.js`.
- `git diff --check` passes. The pre-existing untracked `prototypes/` directory is untouched.
- Browser checks at widths 320, 390, 768, 1024, and 1440 pixels found no horizontal overflow or clipped text. The tablet headline was adjusted to keep its two-line layout.
- The three gallery tabs change the native image and description. Arrow-key and End-key selection move focus with the selected tab, and only one panel is exposed at a time.
- The download FAQ opens with a click and closes with Enter. The app, privacy, and back-to-top anchors reach their sections.
- Clicking Explore These Days on the portfolio home page opens the new route with one header and one footer. Both existing `/` and `/tillwise` routes return HTTP 200.
- The page, all four local image assets, share image, and sitemap return HTTP 200. The sitemap includes `/these-days`.

The imagery refresh also passes the production build and lint with the same two pre-existing warnings. At widths 320, 390, 768, 1024, and 1440, the phone has equal 8-pixel screen insets, no rotation, and the same center as its hero stage. The gallery stays within the viewport; changing tabs preserves its device dimensions. All three new captures load in the optimized preview.

These checks validated the initial website locally and did not establish native iPhone acceptance.

## Privacy policy

2026-10-05. At Yash's request, `/these-days/privacy` was added for TestFlight external testing and linked from the These Days footer. It follows the Tillwise policy's structure in the Nightfall styling. Each statement was checked against the journal repo: no network code besides optional CloudKit sync to the private database with an encrypted payload, on-device dictation and tidy, write-only Health Mindful Minutes, widget excerpts off by default, and file-based exports. The comment at the top of the page lists what to re-check when the app changes.

The local production build and ESLint passed, and desktop and 390-point layouts were checked locally. `.vercelignore` now also excludes `app/portfolio-designs` and `public/portfolio-designs`, so the local portfolio design study was not uploaded; `/portfolio-designs` returns 404 in production. Deployed with `vercel deploy --prod --yes --scope kadam-yash-projects` as [portfolio-3j8991lxc-kadam-yash-projects.vercel.app](https://portfolio-3j8991lxc-kadam-yash-projects.vercel.app), `READY` and aliased to `www.yashkadam.com`. [www.yashkadam.com/these-days/privacy](https://www.yashkadam.com/these-days/privacy) returns 200.

At that point, the main page still said there was no sync and that entries never left the iPhone. The App Store launch update below corrects that copy.

## Support contact, 2026-10-06

For the App Store support URL, the page now has a support paragraph (`#support`) and a footer Support link, both emailing yashkadam278@gmail.com. ESLint and the production build passed. Deployed with `vercel deploy --prod --yes --scope kadam-yash-projects` as portfolio-74d3yx4w4-kadam-yash-projects.vercel.app; the live page contains the support link.

## App Store launch, 2026-10-16

The portfolio card and landing page now link to [These Days on the App Store](https://apps.apple.com/us/app/these-days-journal/id6817871191). Apple's US lookup API confirms version 1.0, a free download, iOS 26.0 minimum, and a release date of 15 October 2026. The URL is shared through `components/these-days/app-store.ts`.

The portfolio introduction, project status, landing-page hero, closing section, download FAQ, and search/social description now describe the released app. The landing page has download links in its hero and closing section. The portfolio card has a download button and retains its link to the product page. Offline and optional iCloud sync copy now matches the App Store description and the existing privacy policy. The selected design and screenshots are unchanged.

Local verification passed:

- `npm run build`, including TypeScript and static generation.
- `npm run lint`, with only the two existing warnings in `src/index.js`.
- `git diff --check`.
- The optimized preview serves both pages. At 1280 and 320 CSS pixels, neither page has horizontal overflow, and all three download links point to the supplied App Store URL. Mobile buttons fit within the viewport. The landing-page metadata contains the release description.

Deployed after Yash's approval with `vercel deploy --prod --yes --scope kadam-yash-projects`. Vercel reports [portfolio-pbz7sdyj3-kadam-yash-projects.vercel.app](https://portfolio-pbz7sdyj3-kadam-yash-projects.vercel.app) as `READY`, aliased to `www.yashkadam.com`. The production build passed. Live HTTP checks confirm that the home page, `/these-days`, and `/these-days/privacy` return 200. The home page has one App Store download link and the landing page has two, all pointing to the supplied listing. The live landing-page metadata contains the release description, and the old unavailable/no-sync statements are absent. Changes remain uncommitted.
