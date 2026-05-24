import SectionReveal from '@/components/SectionReveal'

export default function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-24 scroll-mt-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Now</p>
          <h2 id="work-heading" className="mt-2 text-3xl font-semibold text-text">
            What I&apos;m doing
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-lg font-semibold text-text">Technical Lead</p>
              <span className="text-text-muted" aria-hidden="true">·</span>
              <p className="text-base text-accent">KingsleyGate</p>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted md:ml-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Since 2022
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
              Lead architecture and delivery of fullstack products across the
              entire stack — React frontends, Node.js APIs, and the deployment
              pipelines that keep everything running in production.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
