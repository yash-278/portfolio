// Server Component — no 'use client'
import SectionReveal from '@/components/SectionReveal'

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="py-20 md:py-28 scroll-mt-14"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129, 140, 248, 0.06) 0%, transparent 70%)',
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 md:flex-row md:items-center md:gap-12">
        {/* Text column */}
        <div className="flex flex-col md:flex-1">
          <SectionReveal animate="mount" delay={0}>
            <h1
              id="hero-heading"
              className="text-5xl font-semibold leading-tight text-text"
            >
              Yash Kadam
            </h1>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.1}>
            <p className="mt-2 text-2xl text-text-muted">Technical Lead</p>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.2}>
            <p className="mt-4 text-2xl text-text">
              I write code, lead teams, and ship things.
            </p>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="text-base font-semibold text-accent transition-colors duration-150 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View my work →
              </a>
              <a
                href="https://github.com/yash-278"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                GitHub
              </a>
            </div>
          </SectionReveal>
        </div>

        {/* Photo column */}
        <SectionReveal animate="mount" delay={0.3}>
          <div className="mx-auto flex-shrink-0">
            {/* TODO: swap with real photo at public/yash.jpg */}
            <div
              className="rounded-2xl ring-1 ring-border bg-surface"
              style={{ width: 320, height: 320 }}
              aria-label="Yash Kadam"
              role="img"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
