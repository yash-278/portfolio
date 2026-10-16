// Server Component — no 'use client'
// Product links and screenshots reflect each app's current development stage.
import Image from 'next/image'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import DeviceFrame from '@/components/these-days/DeviceFrame'
import { APP_STORE_URL } from '@/components/these-days/app-store'
import todayScreen from '@/public/these-days/today.png'

interface Planned {
  name: string
  status: string
  description: string
  decisions: string[]
}

const planned: Planned[] = [
  {
    name: 'Workout app',
    status: 'In design',
    description:
      'A lifting app that tells you what to do today and lets you log a set without interrupting your workout.',
    decisions: [
      'Works on iPhone alone, with no Apple Watch needed',
      'Suggests a weight but never fills it in for you',
      "The rest timer runs to a saved end time, so it can't drift",
    ],
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <h2
            id="projects-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-text md:text-4xl"
          >
            What I&apos;m building
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-text-muted">
            Side projects I build on my own time. Each one keeps your data on your phone and
            needs no account. These Days is on the App Store, Tillwise is in public beta, and
            a workout app is in design.
          </p>
        </SectionReveal>

        {/* These Days is on the App Store, so it leads. */}
        <SectionReveal delay={0.08}>
          <article className="mt-12 grid overflow-hidden rounded-[20px] bg-surface md:min-h-[30rem] md:grid-cols-[6fr_6fr]">
            <div className="flex flex-col p-7 md:p-14">
              <div className="flex items-center gap-4">
                <Image src="/these-days/icon.png" alt="" width={48} height={48} className="rounded-xl" />
                <h3 className="text-4xl font-semibold leading-none tracking-tight text-text md:text-5xl">
                  These Days
                </h3>
              </div>
              <p className="mt-3 text-[0.95rem] text-text-muted">On the App Store</p>
              <p className="mt-5 max-w-md leading-relaxed text-text">
                A private journal for iPhone. Write a line or a longer entry, and come back to
                any day later. Tags, people and questions make old entries easy to find. Works
                offline, with optional iCloud sync.
              </p>
              <p className="mt-auto pt-8 text-[0.95rem] text-text">
                <span className="block text-text-muted">Built with</span>
                Swift 6, SwiftUI, SQLite, CloudKit
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={APP_STORE_URL}
                  className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Download on the App Store
                </a>
                <Link
                  href="/these-days"
                  className="inline-flex min-h-11 items-center text-[0.95rem] font-semibold text-accent underline underline-offset-[5px] hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  More about These Days
                </Link>
              </div>
            </div>
            <div className="relative min-h-[22rem] overflow-hidden bg-[#0e1a3c]" aria-hidden="true">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#2b4bb5_0%,transparent_70%)] opacity-50" />
              <div className="absolute inset-x-0 top-12 flex justify-center px-4">
                <DeviceFrame src={todayScreen} alt="" sizes="(min-width: 768px) 300px, 260px" className="[--device-width:260px] md:[--device-width:300px]" />
              </div>
            </div>
          </article>
        </SectionReveal>

        {/* Tillwise is in public beta. */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <SectionReveal>
            <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-surface">
              <div className="flex flex-1 flex-col p-7 md:p-10">
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-text md:text-3xl">
                  Tillwise
                </h3>
                <p className="mt-3 text-[0.95rem] text-text-muted">In public beta</p>
                <p className="mt-5 leading-relaxed text-text">
                  A private expense tracker for iPhone. Underneath it is a double-entry ledger, but
                  recording a purchase takes three taps. Match checks an account against a bank
                  statement and never edits an entry to make the numbers agree.
                </p>
                <Link
                  href="/tillwise"
                  className="mt-6 inline-flex min-h-11 items-center self-start rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  See Tillwise
                </Link>
              </div>
              {/* A real capture from the app, cropped from the top. */}
              <div className="relative h-64 overflow-hidden bg-surface-raised" aria-hidden="true">
                <Image
                  src="/tillwise/today.png"
                  alt=""
                  width={644}
                  height={1400}
                  sizes="260px"
                  className="absolute left-1/2 top-7 w-[14rem] -translate-x-1/2 rounded-t-[1.5rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
                />
              </div>
            </article>
          </SectionReveal>
          {planned.map((project, i) => (
            <SectionReveal key={project.name} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-[20px] bg-surface p-7 md:p-10">
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-text md:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-3 text-[0.95rem] text-text-muted">{project.status}</p>
                <p className="mt-5 leading-relaxed text-text">{project.description}</p>
                <dl className="mt-auto pt-8">
                  <dt className="text-[0.95rem] text-text-muted">Decided so far</dt>
                  <dd className="mt-3 space-y-2.5">
                    {project.decisions.map((decision) => (
                      <p key={decision} className="text-[0.95rem] leading-snug text-text">
                        {decision}
                      </p>
                    ))}
                  </dd>
                </dl>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
