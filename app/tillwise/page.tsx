// Server Component — no 'use client'
//
// Tillwise product page. Two rules hold it together:
//   Shape:  phone frames 2.25rem, cards 1.5rem (rounded-3xl), controls are pills.
//   Colour: one accent, the app's iris, via var(--tl-iris). Nothing else tints.
//
// Every screen shown is a real capture from the app, never a rebuilt UI. Claims on
// this page are taken from the Tillwise README and its planning record, so they
// should be re-read whenever the app's scope moves.
import type { Metadata } from 'next'
import Link from 'next/link'
import BetaCta from '@/components/tillwise/BetaCta'
import PhoneShot from '@/components/tillwise/PhoneShot'
import SectionReveal from '@/components/SectionReveal'

const title = 'Tillwise, a private expense tracker for iPhone'
const description =
  'Tillwise is a private expense tracker for iPhone. You enter what you spend and it stays on your phone, with no account and no bank login.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: '/tillwise', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
  alternates: { canonical: '/tillwise' },
}

const privacyFacts = [
  {
    heading: 'No bank connection',
    body: 'You type in each expense yourself. Tillwise never connects to your bank.',
  },
  {
    heading: 'Optional app lock',
    body: "Lock Tillwise with Face ID or your passcode, and choose how soon it locks. It's off until you turn it on.",
  },
  {
    heading: 'Backups and export',
    body: 'Save a backup file wherever you like. You can also export every entry as a CSV.',
  },
  {
    heading: 'Exchange rates',
    body: "If you use more than one currency, Tillwise downloads public exchange rates, at most once a day. It's the only thing the app downloads, and you can turn it off.",
  },
]

export default function TillwisePage() {
  return (
    <>
      {/* Hero: asymmetric split. The phone is cropped by the section's bottom edge so
          the headline and the button stay above the fold on a laptop. */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 md:grid-cols-[6fr_4fr] md:gap-16 md:pt-20">
          <SectionReveal animate="mount" className="md:pb-20">
            <h1 className="text-balance font-[family-name:var(--font-tl-display)] text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.015em] md:text-[3.4rem]">
              A private expense tracker for iPhone.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--tl-muted)] md:text-xl">
              You enter what you spend, and Tillwise keeps it on your phone. There&apos;s no
              account to create and no bank login.
            </p>
            <BetaCta className="mt-8" />
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.08}>
            <PhoneShot
              src="/tillwise/today.png"
              alt="Tillwise's Today screen, showing the amount spent today, the day's entries and an account that needs matching."
              priority
              cropped
              className="mx-auto aspect-[644/1080] max-w-[19rem] md:max-w-[21rem]"
              width={336}
            />
          </SectionReveal>
        </div>
      </section>

      {/* Privacy: full-width prose, no asset. Breaks the split rhythm on purpose. */}
      <section
        aria-labelledby="privacy-heading"
        className="border-y border-[var(--tl-line)] bg-[var(--tl-surface)]/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <SectionReveal>
            <div className="max-w-2xl">
              <h2
                id="privacy-heading"
                className="font-[family-name:var(--font-tl-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.6rem]"
              >
                Your data stays on your phone.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--tl-muted)]">
                Everything you enter is saved in one file on your iPhone. Tillwise has no server
                of its own, and the app never uploads that file anywhere.{' '}
                <Link
                  href="/tillwise/privacy"
                  className="text-[var(--tl-ink)] underline underline-offset-[5px] transition-colors duration-150 hover:text-[var(--tl-iris)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
                >
                  Read the privacy policy
                </Link>
                .
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <dl className="mt-14 grid gap-x-12 gap-y-10 border-t border-[var(--tl-line)] pt-10 sm:grid-cols-2">
              {privacyFacts.map((fact) => (
                <div key={fact.heading}>
                  <dt className="font-semibold text-[var(--tl-ink)]">{fact.heading}</dt>
                  <dd className="mt-2 max-w-sm leading-relaxed text-[var(--tl-muted)]">
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
            className="text-balance font-[family-name:var(--font-tl-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.4rem]"
          >
            Record a purchase in three taps.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--tl-muted)]">
            The keypad is a calculator, so you can add things up as you type. Pick a recent payee
            and Tillwise fills in the category, the account and your last note.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <PhoneShot
            src="/tillwise/entry.png"
            alt="Tillwise's new entry sheet, with a large amount, a calculator keypad, and chips for category, account and date."
            className="mx-auto max-w-[17rem] md:max-w-[19rem]"
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
            className="text-balance font-[family-name:var(--font-tl-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.4rem]"
          >
            Check an account against your statement.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--tl-muted)]">
            Match asks whether an account agrees with your statement. If it doesn&apos;t, you see
            the difference, where to look, and a list of entries to tick off. Tillwise never
            changes an entry to make the numbers agree.
          </p>
        </SectionReveal>
        <SectionReveal delay={0.08} className="md:order-1">
          <PhoneShot
            src="/tillwise/match-question.png"
            alt="Tillwise's Match screen, asking whether the statement showed the same balance on a given date, with buttons for yes and no."
            className="mx-auto max-w-[17rem] md:max-w-[19rem]"
            width={304}
          />
        </SectionReveal>
      </section>

      {/* Two screens side by side, then a full-width card for the one with no screen. */}
      <section aria-labelledby="more-heading" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <h2 id="more-heading" className="sr-only">
          More of the app
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SectionReveal>
            <article className="flex h-full flex-col gap-8 overflow-hidden rounded-3xl bg-[var(--tl-surface)] px-7 pt-7 md:px-10 md:pt-10">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Monthly reports</h3>
                <p className="mt-3 leading-relaxed text-[var(--tl-muted)]">
                  Go back to any month and see what came in, what went out and the net. Each
                  category shows its share of the month and your average, and there&apos;s a grid
                  of every day.
                </p>
              </div>
              <PhoneShot
                src="/tillwise/reports.png"
                alt="Tillwise's Reports screen, showing a month strip, In, Out and Net totals, and spending by category with bars."
                cropped
                className="mx-auto mt-auto aspect-[644/880] w-full max-w-[16rem]"
                width={256}
              />
            </article>
          </SectionReveal>

          <SectionReveal delay={0.06}>
            <article className="flex h-full flex-col gap-8 overflow-hidden rounded-3xl bg-[var(--tl-surface)] px-7 pt-7 md:px-10 md:pt-10">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Light and dark mode</h3>
                <p className="mt-3 leading-relaxed text-[var(--tl-muted)]">
                  Tillwise follows your iPhone&apos;s light or dark appearance, and amounts scale
                  with the text size you&apos;ve set.
                </p>
              </div>
              <PhoneShot
                src="/tillwise/today-dark.png"
                alt="The same Today screen in dark appearance."
                cropped
                className="mx-auto mt-auto aspect-[644/880] w-full max-w-[16rem]"
                width={256}
              />
            </article>
          </SectionReveal>

          <SectionReveal delay={0.06} className="md:col-span-2">
            <article className="grid gap-4 rounded-3xl bg-[var(--tl-soft)] p-7 md:grid-cols-[1fr_2fr] md:gap-12 md:p-10">
              <h3 className="text-xl font-semibold tracking-tight">More than one currency</h3>
              <div className="space-y-4 leading-relaxed text-[var(--tl-muted)]">
                <p>
                  Each entry stays in the currency you paid in, and account balances are never
                  converted. When a total adds up more than one currency, Tillwise converts it to
                  your home currency, marks it with{' '}
                  <span className="text-[var(--tl-ink)]">≈</span> and notes the rate date below
                  it.
                </p>
                <p>
                  Past months use that month&apos;s average rate, so an old report doesn&apos;t
                  change when today&apos;s rate does.
                </p>
              </div>
            </article>
          </SectionReveal>
        </div>
      </section>

      {/* Closing band. Same CTA label as the hero: one label per intent. */}
      <section
        aria-labelledby="beta-heading"
        className="border-t border-[var(--tl-line)] bg-[var(--tl-surface)]/40"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <SectionReveal>
            <h2
              id="beta-heading"
              className="max-w-2xl text-balance font-[family-name:var(--font-tl-display)] text-3xl font-semibold leading-tight tracking-[-0.01em] md:text-[2.6rem]"
            >
              Tillwise is in public beta.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--tl-muted)]">
              The beta runs through TestFlight, Apple&apos;s tool for trying apps before release.
              If something looks wrong, you can send feedback with a screenshot from TestFlight.
              The App Store release comes after the beta.
            </p>
            <BetaCta className="mt-8" />
            <p className="mt-6 text-[0.95rem] text-[var(--tl-tertiary)]">
              Requires an iPhone with iOS 26 or later. Free, with no ads.
            </p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
