import { useState } from "react"
import PortfolioProjectDialog from "@/components/PortfolioProjectDialog"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from "@/constants/SITE_CONTENT"

export default function Portfolio() {
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null)

  return (
    <>
      <div className="text-site-foreground pointer-events-none absolute top-6 left-6 z-10 drop-shadow-md md:top-12 md:left-12">
        <SectionHeading>
          <h2 className="ease-spring-soft text-5xl opacity-0 transition-all duration-700 md:text-8xl lg:text-9xl [.active_&]:opacity-100">
            Portfolio
          </h2>
        </SectionHeading>
      </div>

      {PORTFOLIO_PROJECTS.map((project, index) => (
        <div key={project.projectTitle} className="slide">
          <div className="flex h-full w-full items-center justify-center px-4 pt-24 pb-10 sm:px-6 md:px-8 md:pt-32">
            <article
              aria-labelledby={"portfolio-project-" + index}
              className="scrollable-content ease-spring-bouncy border-site-border bg-site-surface-emphasis text-site-foreground max-h-[68dvh] w-full max-w-4xl translate-y-12 scale-95 overflow-y-auto overscroll-contain rounded-3xl border p-5 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-700 sm:p-8 md:p-10 [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="border-site-status-border bg-site-status-surface text-site-status-foreground rounded-full border px-3 py-1 text-sm font-semibold">
                  Live production
                </p>
                <p
                  aria-hidden="true"
                  className="restorabold text-site-foreground-subtle text-3xl md:text-5xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>

              <div className="mt-5 md:mt-8">
                <p className="text-site-accent-text text-sm font-semibold tracking-[0.22em] uppercase">
                  Selected project
                </p>
                <h3
                  id={"portfolio-project-" + index}
                  className="restorabold mt-2 text-3xl leading-tight sm:text-4xl lg:text-6xl"
                >
                  {project.projectTitle}
                </h3>
                <p className="text-site-foreground-muted mt-4 max-w-3xl text-lg leading-7 sm:text-xl sm:leading-8 lg:text-2xl">
                  {project.summary}
                </p>
              </div>

              <ul
                aria-label={project.projectTitle + " technologies"}
                className="mt-6 flex flex-wrap gap-2"
              >
                {project.tech.map((technology) => (
                  <li
                    key={technology}
                    className="border-site-border bg-site-surface-soft text-site-foreground rounded-full border px-3 py-1.5 text-sm font-semibold backdrop-blur-md sm:px-4 sm:py-2"
                  >
                    {technology}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                aria-label={"Explore " + project.projectTitle}
                onClick={() => setSelectedProject(project)}
                className="ease-spring-bouncy site-focus-contrast mt-7 inline-flex w-full items-center justify-center gap-3 rounded-tr-3xl bg-[#F38B57] px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-[#ff9c6a] focus-visible:ring-4 focus-visible:outline-none active:scale-95 sm:w-fit"
              >
                Explore project
                <span aria-hidden="true">→</span>
              </button>
            </article>
          </div>
        </div>
      ))}

      <PortfolioProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}
