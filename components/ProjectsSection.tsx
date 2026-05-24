import SectionReveal from '@/components/SectionReveal'

const projects = [
  {
    name: 'Nekomori',
    description: 'Anime schedule tracker and personal watchlist manager.',
    tags: ['TypeScript', 'React', 'Node'],
    github: 'https://github.com/yash-278/nekomori',
  },
  {
    name: 'Brew Index',
    description: 'A searchable frontend for the Homebrew package registry.',
    tags: ['React', 'TypeScript'],
    github: 'https://github.com/yash-278/brew-index',
  },
]

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-24 scroll-mt-14"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="projects-heading" className="text-2xl font-semibold text-text">
          Projects
        </h2>
        <div className="mt-2 mb-10 h-0.5 w-8 bg-accent" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <SectionReveal key={project.name} delay={index * 0.1}>
              <article className="rounded-2xl border border-border/60 bg-surface/60 p-6 backdrop-blur-md transition-colors duration-200 hover:border-border hover:bg-surface/80">
                <h3 className="text-2xl font-semibold text-text">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border/80 bg-bg px-2 py-1 font-mono text-sm text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} on GitHub`}
                    className="text-sm font-semibold text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    GitHub ↗
                  </a>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
