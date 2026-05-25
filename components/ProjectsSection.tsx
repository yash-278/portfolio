import SectionReveal from '@/components/SectionReveal'

interface Project {
  name: string
  description: string
  tags: string[]
  github?: string
}

const projects: Project[] = [
  {
    name: 'Nekomori',
    description:
      'Anime schedule tracker and personal watchlist manager. Track airing shows, manage your list, and never miss a new episode.',
    tags: ['TypeScript', 'React', 'Node.js'],
    github: 'https://github.com/yash-278/nekomori',
  },
  {
    name: 'Brew Index',
    description:
      'A fast, searchable frontend for the Homebrew package registry. Find and explore macOS packages without touching the terminal.',
    tags: ['React', 'TypeScript'],
  },
]

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-24 scroll-mt-14 bg-surface/40"
    >
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Projects</p>
          <h2 id="projects-heading" className="mt-2 text-3xl font-semibold text-text">
            Things I&apos;ve built
          </h2>
        </SectionReveal>

        <div className="mt-10 space-y-10">
          {projects.map((project, index) => (
            <SectionReveal key={project.name} delay={index * 0.1}>
              <article className="group">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold text-text transition-colors duration-150 group-hover:text-accent">
                    {project.name}
                  </h3>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.name} on GitHub`}
                      className="shrink-0 font-mono text-xs text-text-muted transition-colors duration-150 hover:text-accent"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
