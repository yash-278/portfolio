// Server Component — no 'use client'
import SectionReveal from '@/components/SectionReveal'

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 scroll-mt-14 bg-surface/40"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            About
          </p>
          <h2
            id="about-heading"
            className="mt-2 text-3xl font-semibold text-text"
          >
            Who I am
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-text-muted">
            <p>
              I&apos;m a Technical Lead at KingsleyGate, where I architect and
              ship fullstack products across the entire stack — from React
              frontends to Node APIs to the deployment pipelines that keep
              everything running.
            </p>
            <p>
              I got here through years of building things on my own and
              learning what actually matters when software has to work at
              scale. Lately I&apos;ve been shifting more focus toward backend
              systems and Go, chasing the part of the stack where performance
              and correctness really count.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-3">
            {['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Docker'].map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-border/60 bg-bg px-3 py-1.5 font-mono text-xs text-text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
