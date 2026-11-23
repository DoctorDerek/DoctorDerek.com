"use client"

import { useState } from "react"
import PortfolioProjectDialog from "@/components/PortfolioProjectDialog"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  PORTFOLIO_AVAILABILITY_LABEL,
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
          <h2 className="text-4xl md:text-6xl lg:text-7xl">Portfolio</h2>
        </SectionHeading>
      </div>

      {PORTFOLIO_PROJECTS.map((project, index) => (
        <div key={project.projectTitle} className="slide">
          <div className="flex h-dvh w-full items-center justify-center px-4 pt-18 pb-24 sm:px-6 md:px-16 md:pt-[min(9rem,25dvh)] md:pb-10">
            <article
              aria-labelledby={"portfolio-project-" + index}
              className="scrollable-content ease-spring-bouncy border-site-border bg-site-surface-emphasis text-site-foreground max-h-full w-full max-w-4xl translate-y-12 scale-95 overflow-y-auto overscroll-contain rounded-3xl border p-4 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-700 sm:p-6 md:p-8 [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="border-site-status-border bg-site-status-surface text-site-status-foreground rounded-full border px-2.5 py-1 text-xs font-semibold xl:px-3 xl:text-sm">
                  {PORTFOLIO_AVAILABILITY_LABEL}
                </p>
                <p
                  aria-hidden="true"
                  className="restorabold text-site-foreground-subtle text-2xl md:text-3xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>

              <div className="mt-2 xl:mt-3">
                <h3
                  id={"portfolio-project-" + index}
                  className="restorabold text-3xl leading-tight break-words sm:text-4xl lg:text-5xl"
                >
                  {project.projectTitle}
                </h3>
                <p className="text-site-foreground-muted mt-2 max-w-3xl text-lg leading-7 sm:text-xl sm:leading-8 xl:mt-3">
                  {project.summary}
                </p>
              </div>

              <ul
                aria-label={project.projectTitle + " technologies"}
                className="mt-3 flex flex-wrap gap-1.5 xl:mt-4 xl:gap-2"
              >
                {project.tech.map((technology) => (
                  <li
                    key={technology}
                    className="border-site-border bg-site-surface-soft text-site-foreground rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md xl:px-3 xl:py-1.5 xl:text-sm"
                  >
                    {technology}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                aria-label={"Explore " + project.projectTitle}
                onClick={() => {
                  setSelectedProject(project)
                }}
                className="ease-spring-bouncy mt-3 inline-flex w-full items-center justify-center gap-3 rounded-tr-3xl bg-[#F38B57] px-6 py-3 text-lg font-bold text-[#311B4D] shadow-xl transition-all [--site-focus:var(--site-focus-contrast)] hover:scale-[1.02] hover:bg-[#ff9c6a] focus-visible:ring-4 focus-visible:outline-none active:scale-95 sm:w-fit xl:mt-5"
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
