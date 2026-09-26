// Server Component — no 'use client'
//
// Steadyfolio product page. Two rules hold it together:
//   Shape:  phone frames 2.25rem, cards 1.5rem (rounded-3xl), controls are pills.
//   Colour: one accent, the app's iris, via var(--sf-iris). Nothing else tints.
//
// Every screen shown is a real capture from the app, never a rebuilt UI. Claims on
// this page are taken from the Steadyfolio README and its planning record, so they
// should be re-read whenever the app's scope moves.
import type { Metadata } from 'next'
import BetaCta from '@/components/steadyfolio/BetaCta'
import PhoneShot from '@/components/steadyfolio/PhoneShot'
import SectionReveal from '@/components/SectionReveal'

const title = 'Steadyfolio — a private expense ledger for iPhone'
const description =
  'Steadyfolio records what you spend, on iPhone. No account, no bank login, nothing sent to a server.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: '/steadyfolio', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: '/steadyfolio' },
}

const privacyFacts = [
  {
    heading: 'No bank connection',
    body: 'You record what you spend yourself. Nothing logs into your accounts.',
  },
  {
    heading: 'Face ID lock',
    body: 'Off until you turn it on, with a passcode fallback and a choice of when it locks.',
  },
  {
    heading: 'Backups you hold',
    body: 'A file you keep wherever you like, plus a CSV export of one row per entry.',
  },
  {
    heading: 'One network call',
    body: 'Exchange rates, cached outside the ledger, and only while you leave them switched on.',
  },
]

export default function SteadyfolioPage() {
  return (
    <>
      {/* Hero: asymmetric split. Headline stays at two lines on desktop. */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[6fr_4fr] md:gap-16 md:pb-28 md:pt-24">
        <SectionReveal animate="mount">
          <h1 className="text-balance font-[family-name:var(--font-sf-display)] text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.015em] md:text-[3.4rem]">
            An expense ledger that never leaves your phone.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--sf-muted)] md:text-xl">
            Steadyfolio records what you spend, on iPhone. No account, no bank login, nothing sent
            to a server.
          </p>
          <BetaCta className="mt-8" />
        </SectionReveal>

        <SectionReveal animate="mount" delay={0.08}>
          <PhoneShot
            src="/steadyfolio/today.png"
            alt="Steadyfolio's Today screen, showing the amount spent today, the day's entries, an account that needs matching, and a chart of the month so far."
            priority
            fade
            className="mx-auto max-w-[19rem] md:max-w-none"
          />
        </SectionReveal>
      </section>

      {/* Privacy: full-width prose, no asset. Breaks the split rhythm on purpose. */}
      <section
        aria-labelledby="privacy-heading"
        className="border-y border-[var(--sf-line)] bg-[var(--sf-surface)]/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <SectionReveal>
            <div className="max-w-2xl">
              <h2
                id="privacy-heading"
                className="font-[family-name:var(--font-sf-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.6rem]"
              >
                Nothing leaves your phone.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--sf-muted)]">
                The whole ledger is one SQLite file in Steadyfolio&apos;s own folder. There is no
                account to create and no server to sync it to.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <dl className="mt-14 grid gap-x-12 gap-y-10 border-t border-[var(--sf-line)] pt-10 sm:grid-cols-2">
              {privacyFacts.map((fact) => (
                <div key={fact.heading}>
                  <dt className="font-semibold text-[var(--sf-ink)]">{fact.heading}</dt>
                  <dd className="mt-2 max-w-sm leading-relaxed text-[var(--sf-muted)]">
                    {fact.body}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionReveal>
        </div>
      </section>

      {/* Two splits, mirrored. Capped at two in a row. */}
      <section
        aria-labelledby="entry-heading"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-20 md:py-28"
      >
        <SectionReveal>
          <h2
            id="entry-heading"
            className="font-[family-name:var(--font-sf-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.4rem]"
          >
            Three taps to record what you spent.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--sf-muted)]">
            The amount gets a calculator keypad instead of a text field. Recent payees fill in the
            category, the account and the last note.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <PhoneShot
            src="/steadyfolio/entry.png"
            alt="Steadyfolio's new entry sheet, with a large amount, a calculator keypad, and chips for category, account and date."
            className="mx-auto max-w-[17rem] md:ml-auto md:mr-0 md:max-w-[19rem]"
            width={304}
          />
        </SectionReveal>
      </section>

      <section
        aria-labelledby="match-heading"
        className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 md:grid-cols-2 md:gap-20 md:pb-28"
      >
        <SectionReveal className="md:order-2">
          <h2
            id="match-heading"
            className="font-[family-name:var(--font-sf-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.4rem]"
          >
            It shows you the difference. It never quietly fixes it.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--sf-muted)]">
            Match asks whether an account agrees with your statement. If it does not, it names the
            difference and where to look, and never edits an entry itself.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.08} className="md:order-1">
          <PhoneShot
            src="/steadyfolio/match.png"
            alt="Steadyfolio's Match screen, showing the difference against a statement, a list of places to look, and a tick-off list of entries."
            className="mx-auto max-w-[17rem] md:max-w-[19rem]"
            width={304}
          />
        </SectionReveal>
      </section>

      {/* Trio: exactly three cells for three things, two of them carrying a screen. */}
      <section aria-labelledby="more-heading" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <h2 id="more-heading" className="sr-only">
          More of the app
        </h2>
        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr_1fr]">
          <SectionReveal>
            <article className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-[var(--sf-surface)] p-7">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Reports that show the sum</h3>
                <p className="mt-3 leading-relaxed text-[var(--sf-muted)]">
                  A month strip back to your first month, In, Out and Net, where it went with shares
                  and averages, and a grid of every day.
                </p>
              </div>
              <PhoneShot
                src="/steadyfolio/reports.png"
                alt="Steadyfolio's Reports screen, showing a month strip, In, Out and Net totals, and spending by category with bars."
                className="mx-auto w-full max-w-[15rem]"
                width={240}
              />
            </article>
          </SectionReveal>

          <SectionReveal delay={0.06}>
            <article className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-[var(--sf-surface)] p-7">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Light and dark, both real</h3>
                <p className="mt-3 leading-relaxed text-[var(--sf-muted)]">
                  It follows the phone&apos;s appearance, and every amount scales with Dynamic Type.
                </p>
              </div>
              <PhoneShot
                src="/steadyfolio/today-dark.png"
                alt="The same Today screen in dark appearance."
                className="mx-auto w-full max-w-[13rem]"
                width={208}
              />
            </article>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <article className="flex h-full flex-col gap-4 rounded-3xl bg-[var(--sf-soft)] p-7">
              <h3 className="text-xl font-semibold tracking-tight">More than one currency</h3>
              <p className="leading-relaxed text-[var(--sf-muted)]">
                Entries keep the currency they were made in, and balances are never converted. A
                total that adds up two currencies converts into your home currency, marks itself
                with <span className="text-[var(--sf-ink)]">≈</span>, and footnotes the rate it used
                and when.
              </p>
              <p className="mt-auto pt-4 leading-relaxed text-[var(--sf-muted)]">
                Past months use that month&apos;s average rate, so an old report does not change
                when today&apos;s rate does.
              </p>
            </article>
          </SectionReveal>
        </div>
      </section>

      {/* Closing band. Same CTA label as the hero: one label per intent. */}
      <section
        aria-labelledby="beta-heading"
        className="border-t border-[var(--sf-line)] bg-[var(--sf-surface)]/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <SectionReveal>
            <h2
              id="beta-heading"
              className="max-w-2xl text-balance font-[family-name:var(--font-sf-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.6rem]"
            >
              Steadyfolio is in internal testing.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--sf-muted)]">
              It is my daily expense tracker while the ledger earns its trust. A public App Store
              release comes after that.
            </p>
            <BetaCta className="mt-8" />
            <p className="mt-6 text-[0.95rem] text-[var(--sf-tertiary)]">
              iPhone, iOS 26 or later. Free, with no ads.
            </p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
