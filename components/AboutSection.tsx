// Server Component — no 'use client'
import SectionReveal from '@/components/SectionReveal'

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 scroll-mt-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="about-heading" className="text-2xl font-semibold text-text">
          About
        </h2>
        <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />

        <SectionReveal>
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-text">
              I&apos;m a Technical Lead at KingsleyGate, where I architect and
              ship fullstack products across the entire stack — from React
              frontends to Node APIs to the deployment pipelines that keep
              everything running. I got here through years of building things
              on my own and learning what actually matters when software has to
              work at scale. Lately I&apos;ve been shifting more focus toward
              backend systems and Go, chasing the part of the stack where
              performance and correctness really count.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
