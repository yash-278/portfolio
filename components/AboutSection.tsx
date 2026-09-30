// Server Component — no 'use client'
import SectionReveal from "@/components/SectionReveal";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20">
      <SectionReveal>
        <h2
          id="about-heading"
          className="text-2xl font-semibold leading-tight tracking-tight text-text md:text-3xl"
        >
          About
        </h2>
        <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed md:text-xl md:leading-relaxed">
          <p className="text-text">
            At KingsleyGate I run architecture and delivery for fullstack
            products. That covers the React frontends, the Node.js APIs and the
            deployment pipelines behind them.
          </p>
          <p className="text-text-muted">
            I learned by building things on my own and seeing what held up once
            real people used them. These days more of my time goes into backend
            systems and Go. My own projects are iPhone apps.
          </p>
        </div>
      </SectionReveal>
    </section>
  );
}
