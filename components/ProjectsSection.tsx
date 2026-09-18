import ProjectPreview, { type PreviewName } from '@/components/ProjectPreview'
import SectionReveal from '@/components/SectionReveal'

interface Project {
  name: string
  description: string
  tags: string[]
  preview: PreviewName
  github?: `https://${string}`
}

const projects: Project[] = [
  {
    name: 'Nekomori',
    description:
      'Anime schedule tracker and watchlist manager. It follows airing shows, keeps your list in sync with external anime APIs, and stays inside their rate limits while doing it.',
    tags: ['TypeScript', 'React', 'Node.js'],
    preview: 'nekomori',
    github: 'https://github.com/yash-278/nekomori',
  },
  {
    name: 'Brew Index',
    description:
      'A fast, searchable frontend for the Homebrew package registry. Browse and compare macOS packages without opening a terminal.',
    tags: ['React', 'TypeScript'],
    preview: 'brew-index',
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl space-y-6 px-6">
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>
        {projects.map((project) => (
          <SectionReveal key={project.name}>
            <article className="grid overflow-hidden rounded-[20px] bg-surface md:min-h-[30rem] md:grid-cols-[5fr_7fr]">
              <div className="flex flex-col p-7 md:p-14">
                <h3 className="text-4xl font-semibold leading-none tracking-tight text-text md:text-5xl">
                  {project.name}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-text-muted">{project.description}</p>
                <p className="mt-auto pt-8 text-[0.95rem] text-text">
                  <span className="block text-text-muted">Built with</span>
                  {project.tags.join(', ')}
                </p>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 self-start rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
              <div className="relative h-80 overflow-hidden bg-surface-raised md:h-auto" aria-hidden="true">
                <div className="absolute left-[8%] top-[12%] w-[150%] md:w-[110%]">
                  <ProjectPreview name={project.preview} />
                </div>
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}
