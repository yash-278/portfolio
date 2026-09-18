// Server Component — no 'use client'
import SectionReveal from "@/components/SectionReveal";

const stack = ["TypeScript", "React", "Node.js", "Go", "PostgreSQL", "Docker"];

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20">
      <SectionReveal>
        <h2 id="about-heading" className="font-semibold text-text-muted">
          About
        </h2>
        <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed md:text-xl md:leading-relaxed">
          <p className="text-text">
            I&apos;m a Technical Lead at KingsleyGate, where I&apos;ve run
            architecture and delivery for fullstack products since 2022: React
            frontends, Node.js APIs, and the deployment pipelines behind them.
          </p>
          <p className="text-text-muted">
            I got here by building things on my own and finding out what holds
            up once software has real users. Lately more of my time goes into
            backend systems and Go, where performance and correctness matter
            most.
          </p>
        </div>
        <ul aria-label="Main stack" className="mt-8 flex flex-wrap gap-2">
          {stack.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border px-3.5 py-1.5 text-[0.925rem] text-text"
            >
              {skill}
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  );
}
