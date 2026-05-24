import SectionReveal from '@/components/SectionReveal'

export default function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-24 scroll-mt-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="work-heading" className="text-2xl font-semibold text-text">
          Work
        </h2>
        <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
        <div className="border-l-2 border-accent/30 pl-6">
          <div className="flex flex-col gap-8">
            <SectionReveal delay={0}>
              <div>
                <p className="text-base font-semibold text-text">
                  Technical Lead
                </p>
                <p className="text-sm text-text-muted">
                  <span className="text-accent">KingsleyGate</span>
                  {' · '}
                  <span>2022 — Current</span>
                </p>
                <p className="mt-1 text-base text-text">
                  Ship production features across the full stack as the tech
                  lead.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
