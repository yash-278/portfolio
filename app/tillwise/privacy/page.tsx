// Server Component — no 'use client'
//
// The privacy policy App Store Connect links to. Every statement here describes what
// the app does, checked against the app repo: the privacy manifest (no collected data
// types, no tracking), the rate sources in TillwiseKit's ExchangeRates module, the
// Diagnostics log and Backup/CSV export. Re-check it whenever the app gains a network
// call, an SDK, sync or purchases, and move the effective date.
import type { Metadata } from 'next'

const title = 'Tillwise privacy policy'
const description =
  'Tillwise keeps your ledger on your iPhone. It collects no personal data and has no account, analytics, ads or tracking.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: '/tillwise/privacy', type: 'website' },
  alternates: { canonical: '/tillwise/privacy' },
}

const sections = [
  {
    heading: 'What Tillwise collects',
    body: [
      'Nothing. Tillwise has no account, no sign-in, no analytics, no advertising and no tracking, and it contains no third-party SDKs that collect data. I, the developer, never receive your entries, amounts, payees, notes, accounts or any other information you put into the app.',
    ],
  },
  {
    heading: 'Where your data lives',
    body: [
      "Your ledger is a file inside Tillwise's own storage on your iPhone. The app never uploads it anywhere. If your iPhone backs up to iCloud or to a computer, that device backup can include the ledger, the same as other apps' data; Apple's privacy policy covers those backups.",
      'App lock uses Face ID or your device passcode through iOS. Tillwise only learns whether unlocking succeeded and never sees your face data or passcode.',
    ],
  },
  {
    heading: 'Exchange rates',
    body: [
      "When you use more than one currency, Tillwise downloads public exchange rates at most once a day from Frankfurter (api.frankfurter.dev), falling back to fawazahmed0's Exchange API (served from cdn.jsdelivr.net and currency-api.pages.dev). Every user downloads the same files. The requests contain nothing about you, your currencies or your ledger.",
      'Like any web request, these services can see your IP address, under their own terms. You can turn off Download exchange rates in Settings to stop these requests; the rest of the app keeps working offline.',
    ],
  },
  {
    heading: 'Backups, exports and diagnostics',
    body: [
      'Backups (.tillwise files) and CSV exports are files you create and choose where to save or share, such as Files, iCloud Drive or a message. Once you share a file, the place you send it handles it under its own policy.',
      'Diagnostics keeps an error log on your iPhone: the event, screen, time and error code. It holds no amounts, payees, notes or account names, and it leaves your iPhone only if you share it yourself.',
    ],
  },
  {
    heading: 'Deleting your data',
    body: [
      'Deleting Tillwise from your iPhone deletes its ledger and automatic Backups. Backups or exports you saved elsewhere stay where you put them until you delete them.',
    ],
  },
  {
    heading: 'Children',
    body: [
      'Tillwise does not collect personal information from anyone, including children under 13.',
    ],
  },
  {
    heading: 'Changes',
    body: [
      'If Tillwise ever starts collecting or sending data, this page will say so before that version is released, and the effective date above will change.',
    ],
  },
]

export default function TillwisePrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <h1 className="font-[family-name:var(--font-tl-display)] text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.015em] md:text-[3.4rem]">
        Privacy policy
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--tl-muted)] md:text-xl">
        Tillwise is an expense tracker for iPhone, made by Yash Kadam. It keeps your ledger on your
        phone and collects no personal data.
      </p>
      <p className="mt-4 text-[0.95rem] text-[var(--tl-tertiary)]">
        Effective 28 September 2026
      </p>

      <div className="mt-14 space-y-12 border-t border-[var(--tl-line)] pt-12">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-3 max-w-2xl leading-relaxed text-[var(--tl-muted)]"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[var(--tl-muted)]">
            Questions about this policy or the app go to{' '}
            <a
              href="mailto:yash@yashkadam.com?subject=Tillwise%20privacy"
              className="text-[var(--tl-ink)] underline underline-offset-[5px] transition-colors duration-150 hover:text-[var(--tl-iris)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
            >
              yash@yashkadam.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  )
}
