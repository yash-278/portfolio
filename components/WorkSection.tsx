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
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Experience
          </p>
          <h2 id="work-heading" className="mt-2 text-3xl font-semibold text-text">
            Where I&apos;ve worked
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-border/60 bg-surface/60 p-6 md:p-8">
            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-lg font-semibold text-text">Technical Lead</p>
                <p className="mt-0.5 text-base text-accent">KingsleyGate</p>
              </div>
              <span className="mt-1 shrink-0 rounded-md border border-border/60 bg-bg px-3 py-1 font-mono text-xs text-text-muted md:mt-0">
                2022 — Present
              </span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              Lead architecture and delivery of fullstack products across the
              entire stack — React frontends, Node.js APIs, and the deployment
              pipelines that keep everything running in production.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-bg px-2.5 py-1 font-mono text-xs text-text-muted"
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
