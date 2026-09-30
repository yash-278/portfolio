// Server Component — no 'use client'
// Three iPhone apps at three different stages, so they get three different
// treatments rather than one card repeated. Only Tillwise has a shipped UI, and
// it is the only one shown with a screen; the other two are deliberately
// typographic, because inventing a preview for an app with no code is a lie.
import Image from 'next/image'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

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
  {
    name: 'Journal app',
    status: 'In planning',
    description:
      'A private journal built around the day, not the individual entry. It imports from the apps I already keep notes in.',
    decisions: [
      'Tags and people are typed inline, not picked from a list',
      'No save button, and the sync state is always visible',
      'It counts the days you wrote, never streaks',
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
            Three iPhone apps of my own, private by default and with no account to create.
            Tillwise is in public beta. The other two are still being designed.
          </p>
        </SectionReveal>

        {/* Featured: the one with a real app behind it. */}
        <SectionReveal delay={0.08}>
          <article className="mt-12 grid overflow-hidden rounded-[20px] bg-surface md:min-h-[30rem] md:grid-cols-[6fr_6fr]">
            <div className="flex flex-col p-7 md:p-14">
              <h3 className="text-4xl font-semibold leading-none tracking-tight text-text md:text-5xl">
                Tillwise
              </h3>
              <p className="mt-3 text-[0.95rem] text-text-muted">In public beta</p>
              <p className="mt-5 max-w-md leading-relaxed text-text">
                A private expense tracker for iPhone. It&apos;s a double-entry ledger underneath,
                but recording a purchase takes three taps. Match checks an account against a bank
                statement and never edits an entry to make the numbers agree.
              </p>
              <p className="mt-auto pt-8 text-[0.95rem] text-text">
                <span className="block text-text-muted">Built with</span>
                Swift 6, SwiftUI, GRDB
              </p>
              <Link
                href="/tillwise"
                className="mt-5 self-start rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                See Tillwise
              </Link>
            </div>
            {/* A real capture from the app, cropped from the top. */}
            <div className="relative min-h-[22rem] overflow-hidden bg-surface-raised" aria-hidden="true">
              <Image
                src="/tillwise/today.png"
                alt=""
                width={644}
                height={1400}
                sizes="(min-width: 768px) 20rem, 60vw"
                className="absolute left-1/2 top-12 w-[16rem] -translate-x-1/2 rounded-t-[1.75rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] md:w-[20rem]"
              />
            </div>
          </article>
        </SectionReveal>

        {/* The two that are still decisions rather than code. */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
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
