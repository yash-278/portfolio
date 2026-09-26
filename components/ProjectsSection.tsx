// Server Component — no 'use client'
// Three iPhone apps at three different stages, so they get three different
// treatments rather than one card repeated. Only Steadyfolio has a shipped UI, and
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
      'A lifting app for two jobs: knowing what to do today, and logging a set without interrupting it.',
    decisions: [
      'iPhone alone, no Apple Watch assumed',
      'A suggested weight is never pre-applied',
      'Rest runs from a stored deadline, so nothing drifts',
    ],
  },
  {
    name: 'Journal app',
    status: 'In planning',
    description:
      'A private journal built around the day rather than the entry, with imports from the apps I already keep notes in.',
    decisions: [
      'Tags and people typed inline, not picked',
      'No save button, and a visible sync state',
      'Days written, never streaks',
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
            Three iPhone apps, private by default and free of accounts. One is on TestFlight; the
            other two are still on paper.
          </p>
        </SectionReveal>

        {/* Featured: the one with a real app behind it. */}
        <SectionReveal delay={0.08}>
          <article className="mt-12 grid overflow-hidden rounded-[20px] bg-surface md:min-h-[30rem] md:grid-cols-[6fr_6fr]">
            <div className="flex flex-col p-7 md:p-14">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-4xl font-semibold leading-none tracking-tight text-text md:text-5xl">
                  Steadyfolio
                </h3>
                <span className="rounded-full border border-border px-3 py-1 text-sm text-text-muted">
                  In TestFlight
                </span>
              </div>
              <p className="mt-5 max-w-md leading-relaxed text-text-muted">
                A private expense ledger for iPhone. Balanced postings underneath, three taps to
                record a purchase on top, and a Match flow that reconciles an account against a
                statement without ever editing an entry to close the gap.
              </p>
              <p className="mt-auto pt-8 text-[0.95rem] text-text">
                <span className="block text-text-muted">Built with</span>
                Swift 6, SwiftUI, GRDB
              </p>
              <Link
                href="/steadyfolio"
                className="mt-5 self-start rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                See Steadyfolio
              </Link>
            </div>
            {/* A real capture from the app, cropped from the top. */}
            <div className="relative min-h-[22rem] overflow-hidden bg-surface-raised" aria-hidden="true">
              <Image
                src="/steadyfolio/today.png"
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
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight text-text md:text-3xl">
                    {project.name}
                  </h3>
                  <span className="rounded-full border border-border px-3 py-1 text-sm text-text-muted">
                    {project.status}
                  </span>
                </div>
                <p className="mt-5 leading-relaxed text-text-muted">{project.description}</p>
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
