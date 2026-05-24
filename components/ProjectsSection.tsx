import SectionReveal from '@/components/SectionReveal'

const projects = [
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
    github: 'https://github.com/yash-278/brew-index',
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
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Projects
          </p>
          <h2
            id="projects-heading"
            className="mt-2 text-3xl font-semibold text-text"
          >
            Things I&apos;ve built
          </h2>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <SectionReveal key={project.name} delay={index * 0.1}>
              <article className="group flex h-full flex-col rounded-2xl border border-border/60 bg-bg p-6 transition-all duration-200 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-text group-hover:text-accent transition-colors duration-150">
                    {project.name}
                  </h3>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} on GitHub`}
                    className="shrink-0 text-text-muted transition-colors duration-150 hover:text-accent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={18}
                      height={18}
                      aria-hidden="true"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-xs text-accent"
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
