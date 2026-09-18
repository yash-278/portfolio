// Server Component — no 'use client'
import Image from 'next/image'
import SectionReveal from '@/components/SectionReveal'

const facts = [
  { label: 'Role', value: 'Technical Lead' },
  { label: 'Company', value: 'KingsleyGate, since 2022' },
  { label: 'Works in', value: 'TypeScript, React, Node.js, Go' },
]

export default function HeroSection() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="scroll-mt-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-12 md:grid-cols-[7fr_4fr] md:gap-20 md:pb-20 md:pt-16">
        <div className="flex flex-col justify-between gap-10">
          <SectionReveal animate="mount">
            <h1
              id="hero-heading"
              className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-text md:text-6xl lg:text-7xl"
            >
              Technical lead and fullstack developer.
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug text-text-muted md:mt-7 md:text-2xl">
              I&apos;m Yash Kadam. I build web products end to end, and lead the team that ships
              them.
            </p>
          </SectionReveal>

          <SectionReveal animate="mount" delay={0.1}>
            <dl className="max-w-xl border-t border-border text-[0.95rem]">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3"
                >
                  <dt className="text-text-muted">{fact.label}</dt>
                  <dd className="font-medium text-text">{fact.value}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-3">
                <dt className="text-text-muted">Consulting</dt>
                <dd className="font-medium text-accent">Taking on new work</dd>
              </div>
            </dl>
          </SectionReveal>
        </div>

        {/* Portrait leads on small screens so a face is visible in the first viewport */}
        <div className="order-first md:order-none">
          <SectionReveal animate="mount" delay={0.05}>
            <Image
              src="/yash.jpg"
              alt="Yash Kadam standing on a beach, sea and hills behind him"
              width={800}
              height={800}
              sizes="(min-width: 768px) 26rem, 100vw"
              className="aspect-[4/3] w-full rounded-[20px] object-cover object-[55%_28%] md:aspect-[4/5]"
              priority
            />
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
