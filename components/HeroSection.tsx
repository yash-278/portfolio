// Server Component — no 'use client'
import Image from 'next/image'
import SectionReveal from '@/components/SectionReveal'

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-24 md:py-36 scroll-mt-14"
    >
      {/* Background: strong top glow + subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 60% at 50% -5%, rgba(129,140,248,0.18) 0%, transparent 65%),
            linear-gradient(rgba(39,39,42,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(39,39,42,0.35) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 48px 48px, 48px 48px',
        }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 md:flex-row md:items-center md:gap-16">
        {/* Text column */}
        <div className="flex flex-col md:flex-1">
          <SectionReveal animate="mount" delay={0}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Available for consulting
            </span>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.1}>
            <h1
              id="hero-heading"
              className="text-5xl font-semibold leading-tight tracking-tight text-text md:text-6xl"
            >
              Yash Kadam
            </h1>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.15}>
            <p className="mt-2 text-xl font-medium text-accent">Technical Lead</p>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.2}>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-text-muted">
              I write code, lead teams, and ship things.
            </p>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                View my work
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="https://github.com/yash-278"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-muted transition-colors duration-150 hover:border-accent/50 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                GitHub
              </a>
            </div>
          </SectionReveal>
        </div>

        {/* Photo column */}
        <SectionReveal animate="mount" delay={0.25}>
          <div className="relative mx-auto flex-shrink-0">
            {/* Glow ring behind the photo */}
            <div
              className="absolute -inset-3 rounded-3xl opacity-40 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.5) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            <Image
              src="/yash.jpg"
              alt="Yash Kadam"
              width={320}
              height={320}
              className="relative rounded-2xl ring-1 ring-accent/20 object-cover"
              priority
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
