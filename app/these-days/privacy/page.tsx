// Server Component — no 'use client'
//
// The privacy policy App Store Connect links to. Every statement here describes what
// the app does, checked against the journal repo on 5 October 2026: no network code
// besides optional CloudKit sync to the private database with an encrypted payload,
// on-device dictation (SpeechAnalyzer) and tidying (Foundation Models), write-only
// HealthKit Mindful Minutes, widgets that read a local snapshot with excerpts off by
// default, and file-based backups and exports. Re-check it whenever the app gains a
// network call, an SDK, analytics or purchases, and move the effective date.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Fraunces } from 'next/font/google'
import styles from '../nightfall.module.css'
import privacy from './privacy.module.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-nightfall-display',
  display: 'swap',
})

const title = 'These Days privacy policy'
const description =
  'These Days keeps your journal on your iPhone. It has no account, analytics, ads or tracking, and the developer never receives your writing.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/these-days/privacy' },
  openGraph: { title, description, url: '/these-days/privacy', type: 'website' },
  icons: { icon: '/these-days/icon.png', apple: '/these-days/icon.png' },
}

const sections = [
  {
    heading: 'What These Days collects',
    body: [
      'Nothing. These Days has no account, no sign-in, no analytics, no advertising and no tracking, and it contains no third-party SDKs. I, the developer, never receive your entries, moods, questions, tags, people or anything else you write. There is no developer server.',
    ],
  },
  {
    heading: 'Where your journal lives',
    body: [
      "Your journal is a database inside the app's own storage on your iPhone. If your iPhone backs up to iCloud or to a computer, that device backup can include the journal, the same as other apps' data. Apple's privacy policy covers those backups.",
      'App lock uses Face ID or your device passcode through iOS. The app only learns whether unlocking succeeded and never sees your face data or passcode.',
    ],
  },
  {
    heading: 'iCloud sync',
    body: [
      'Sync is optional and stays off until you turn it on in Settings. When it is on, your entries, moods, dates, questions and formatting are stored in your own private iCloud database under your Apple Account, inside a field that Apple encrypts. With Advanced Data Protection turned on for your Apple Account, that field is end-to-end encrypted. I cannot read your private iCloud database. Unsent drafts stay on the phone.',
      'Turning sync off stops it. Removing an entry moves it to Recently Deleted on your devices; the app does not permanently erase records from iCloud. To delete the iCloud copy, go to Settings, then your name, then iCloud, and manage the storage for These Days.',
    ],
  },
  {
    heading: 'Apple Health',
    body: [
      'Saving writing time to Apple Health is optional and starts off. When you turn it on, These Days saves the time you spend writing as Mindful Minutes. It never reads Health data, and your journal text and moods are not sent to Health.',
    ],
  },
  {
    heading: 'Dictation and tidying',
    body: [
      "Dictation turns speech into text with the transcriber built into iOS, on your iPhone. The microphone is used only while you dictate, and no audio is saved. The tidy button uses the language model on your iPhone. A long press on it opens Apple's Writing Tools, which Apple's own privacy terms cover. None of these send your words to me.",
    ],
  },
  {
    heading: 'Widgets',
    body: [
      'Widgets read a small summary that the app keeps on your iPhone, not the journal itself. Entry excerpts in widgets start off, private mode hides personal content, and app lock keeps widgets private.',
    ],
  },
  {
    heading: 'Links, backups and exports',
    body: [
      'A link you add to an entry opens in your browser only when you tap it. The app does not fetch it.',
      'JSON backups and Markdown exports are files you create and choose where to save or share, such as Files, iCloud Drive or a message. Once you share a file, the place you send it handles it under its own policy.',
    ],
  },
  {
    heading: 'Deleting your data',
    body: [
      "Deleting These Days from your iPhone deletes the journal stored on that phone. An iCloud copy, device backups and files you exported stay where they are until you delete them.",
    ],
  },
  {
    heading: 'Testing',
    body: [
      "If you test These Days through TestFlight, Apple shares crash reports and any feedback you choose to send, under Apple's TestFlight terms. That information does not include your journal.",
    ],
  },
  {
    heading: 'Children',
    body: ['These Days does not collect personal information from anyone, including children under 13.'],
  },
  {
    heading: 'Changes',
    body: [
      'If These Days ever starts collecting or sending data, this page will say so before that version is released, and the effective date above will change.',
    ],
  },
]

export default function TheseDaysPrivacyPage() {
  return (
    <div className={`${fraunces.variable} ${styles.site}`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/these-days" className={styles.wordmark} aria-label="These Days home">
            <Image src="/these-days/icon.png" alt="" width={32} height={32} />
            <span>These Days</span>
          </Link>
        </div>
      </header>

      <article className={privacy.article}>
        <h1>Privacy policy</h1>
        <p className={privacy.lead}>
          These Days is a journal for iPhone, made by Yash Kadam. It keeps your writing on your phone
          and collects no personal data.
        </p>
        <p className={privacy.effective}>Effective 5 October 2026</p>

        <div className={privacy.sections}>
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </section>
          ))}
          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy or the app go to{' '}
              <a href="mailto:yashkadam278@gmail.com?subject=These%20Days%20privacy">yashkadam278@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>

      <footer className={styles.footer}>
        <Link href="/">Yash Kadam</Link>
        <span>These Days, 2026</span>
        <Link href="/these-days">About the app</Link>
      </footer>
    </div>
  )
}
