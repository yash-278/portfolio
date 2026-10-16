import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Fraunces } from 'next/font/google'
import { ArrowUpRight } from 'lucide-react'
import DeviceFrame from '@/components/these-days/DeviceFrame'
import { APP_STORE_URL } from '@/components/these-days/app-store'
import ScrollStory, { type StoryStep } from '@/components/these-days/ScrollStory'
import todayScreen from '@/public/these-days/today.png'
import journalScreen from '@/public/these-days/journal.png'
import reflectScreen from '@/public/these-days/reflect.png'
import styles from './nightfall.module.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-nightfall-display',
  display: 'swap',
})

const title = 'These Days | A private journal for iPhone'
const description =
  'These Days is a free private journal for iPhone. Write a line or a longer entry, note your mood, and look back on any day. Works offline, with optional iCloud sync.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/these-days' },
  openGraph: { title, description, url: '/these-days', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
  icons: { icon: '/these-days/icon.png', apple: '/these-days/icon.png' },
}

const questions = [
  {
    question: 'Is These Days available now?',
    answer:
      'Yes. It is free on the App Store and needs an iPhone running iOS 26 or later.',
  },
  {
    question: 'Do I need an account or an internet connection?',
    answer:
      'No. There is no account to create, and writing, searching and looking back all work offline. iCloud sync is optional and uses your Apple Account.',
  },
  {
    question: 'Does my journal sync between devices?',
    answer:
      'Yes, if you turn on iCloud sync in Settings. Your entries are stored in your own private iCloud database, with their contents in encrypted fields. You can also save a full JSON backup and restore it later.',
  },
  {
    question: 'Can I get my writing out?',
    answer:
      'Yes. Export your entries as Markdown to read anywhere, or save a JSON backup that includes entries, earlier versions and drafts. You choose where the file goes.',
  },
]

const steps: StoryStep[] = [
  {
    name: 'Write',
    title: 'Start with a line.',
    description:
      'The app opens on Today, ready to write. Each line is saved with its time. When there is more to say, a longer entry is one tap away.',
    sample: 'Coffee by the open window. The street was still quiet.',
    sampleNote: '7:12 AM, tagged #smallthings',
    src: todayScreen,
    alt: 'Today, Sunday 4 October, with three sample entries and a field for writing another line.',
  },
  {
    name: 'Revisit',
    title: 'Every day, kept in order.',
    description:
      'Entries are grouped by day. Tags and people are typed straight into the text, so searching a name or a word brings back the day it belongs to.',
    sample: 'Walked to the bakery with @Maya Chen. Took the long way back through the park.',
    sampleNote: '8:05 AM, a favourite, tagged #outside',
    src: journalScreen,
    alt: 'Journal, with 20 sample entries grouped by day, favourite stars, inline tags and a mention of Maya Chen.',
  },
  {
    name: 'Reflect',
    title: 'Stuck? Start with a question.',
    description:
      'Reflect gives you a question to answer, shows what you wrote on this day in earlier years, and keeps yesterday within reach.',
    sample: 'What will you remember about this week?',
    sampleNote: 'A question to write from',
    src: reflectScreen,
    alt: 'Reflect, with a writing question, an On this day entry from 2025 and entries from yesterday.',
  },
]

const refusals = [
  { line: 'No account.', note: 'Open the app and write.' },
  { line: 'No ads.', note: 'None, anywhere in the app.' },
  { line: 'No analytics.', note: 'The app does not track how you use it.' },
  { line: 'No developer server.', note: 'Nothing you write is sent to me.' },
  { line: 'No required sync.', note: 'Keep it on your iPhone, or turn on private iCloud sync.' },
]

export default function TheseDaysPage() {
  return (
    <div className={`${fraunces.variable} ${styles.site}`}>
      <header className={styles.header} id="top">
        <div className={styles.headerInner}>
          <Link href="/these-days" className={styles.wordmark} aria-label="These Days, top of page">
            <Image src="/these-days/icon.png" alt="" width={32} height={32} />
            <span>These Days</span>
          </Link>
          <nav className={styles.navigation} aria-label="Page sections">
            <a href="#story">The app</a>
            <a href="#privacy">Privacy</a>
            <a href="#questions">Questions</a>
          </nav>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <p className={styles.introduction}>Now on the App Store. Free for iPhone.</p>
        <h1 id="hero-title">Before the day goes, <br />keep a line of it.</h1>
        <p className={styles.heroDescription}>
          These Days is a small journal for iPhone. Write a quick line or a longer entry, and
          find your way back to any day. Everything stays on your phone unless you turn on
          iCloud sync.
        </p>
        <a href={APP_STORE_URL} className={styles.primaryLink}>Download on the App Store</a>
        <div className={styles.rise}>
          <div className={styles.glow} aria-hidden="true" />
          <DeviceFrame
            className={styles.heroPhone}
            src={todayScreen}
            alt="Today, Sunday 4 October. Three sample entries about coffee by the window, a walk with Maya and a slow morning at home."
            sizes="(max-width: 700px) 300px, 360px"
            preload
          />
        </div>
      </section>

      <section id="story" className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.inner}>
          <h2 id="story-title" className={styles.storyTitle}>Three screens.</h2>
          <ScrollStory steps={steps} />
        </div>
      </section>

      <section id="privacy" className={styles.refusals} aria-labelledby="privacy-title">
        <div className={styles.inner}>
          <h2 id="privacy-title">What These Days<br />won&apos;t do.</h2>
          <ul className={styles.refusalList}>
            {refusals.map((item) => (
              <li key={item.line}>
                <span className={styles.refusalLine}>{item.line}</span>
                <span className={styles.refusalNote}>{item.note}</span>
              </li>
            ))}
          </ul>
          <p className={styles.keeps}>
            What it does is keep every entry, along with earlier versions and drafts, on your iPhone.
            You can export a Markdown copy or save a full JSON backup at any time.
          </p>
        </div>
      </section>

      <section id="questions" className={styles.questions} aria-labelledby="questions-title">
        <div className={styles.inner}>
          <h2 id="questions-title">Common questions.</h2>
          <div className={styles.questionList}>
            {questions.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}<span className={styles.plus} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.close} aria-labelledby="close-title">
        <Image src="/these-days/icon.png" alt="" width={56} height={56} className={styles.closeIcon} />
        <h2 id="close-title">Start with<br />one line.</h2>
        <p>These Days is made by Yash Kadam. It is free on the App Store and needs iOS 26 or later.</p>
        <a href={APP_STORE_URL} className={styles.primaryLink}>Download on the App Store</a>
        <p id="support">
          Need help or found a problem? Email{' '}
          <a href="mailto:yashkadam278@gmail.com?subject=These%20Days%20support">yashkadam278@gmail.com</a>.
        </p>
        <Link href="/#about" className={styles.makerLink}>
          About Yash <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <footer className={styles.footer}>
        <Link href="/">Yash Kadam</Link>
        <span>These Days, 2026</span>
        <Link href="/these-days/privacy">Privacy policy</Link>
        <a href="mailto:yashkadam278@gmail.com?subject=These%20Days%20support">Support</a>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}
