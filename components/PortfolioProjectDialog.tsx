import { Dialog, Transition } from "@headlessui/react"
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Fragment } from "react"
import type { PortfolioProject } from "@/constants/SITE_CONTENT"

export default function PortfolioProjectDialog({
  project,
  onClose,
}: {
  project: PortfolioProject | null
  onClose: () => void
}) {
  return (
    <Transition.Root show={project !== null} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[10000] w-screen overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="scrollable-content border-site-border bg-site-surface-strong text-site-foreground relative max-h-[85dvh] w-full max-w-2xl transform overflow-y-auto rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all sm:p-10">
                {project && (
                  <>
                    <button
                      type="button"
                      aria-label="Close project details"
                      className="border-site-border bg-site-surface-soft text-site-foreground hover:bg-site-surface-hover focus-visible:ring-site-focus absolute top-4 right-4 rounded-full border p-2 transition-colors focus-visible:ring-4 focus-visible:outline-none"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <p className="border-site-status-border bg-site-status-surface text-site-status-foreground mb-4 w-fit rounded-full border px-3 py-1 text-sm font-semibold">
                      Live production
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="restorabold pr-12 text-4xl leading-tight sm:text-5xl"
                    >
                      {project.projectTitle}
                    </Dialog.Title>
                    <p className="text-site-foreground-muted mt-6 text-lg leading-8 sm:text-xl">
                      {project.details}
                    </p>
                    <ul
                      aria-label={project.projectTitle + " technologies"}
                      className="mt-6 flex flex-wrap gap-2"
                    >
                      {project.tech.map((technology) => (
                        <li
                          key={technology}
                          className="border-site-border bg-site-surface-soft text-site-foreground rounded-full border px-3 py-1.5 text-sm font-semibold"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={project.liveUrl}
                        aria-label={"View " + project.projectTitle + " live"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ease-spring-bouncy inline-flex w-full items-center justify-center gap-3 rounded-tr-3xl bg-[#FFE366] px-6 py-4 text-lg font-bold text-[#311B4D] shadow-xl transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none active:scale-95 sm:w-fit"
                      >
                        View live project
                        <ArrowTopRightOnSquareIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </a>
                      <a
                        href={project.sourceUrl}
                        aria-label={"View " + project.projectTitle + " source"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ease-spring-bouncy border-site-border-strong bg-site-surface-soft text-site-foreground hover:bg-site-surface-hover focus-visible:ring-site-focus inline-flex w-full items-center justify-center gap-3 rounded-tr-3xl border px-6 py-4 text-lg font-bold shadow-xl transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:outline-none active:scale-95 sm:w-fit"
                      >
                        View source
                        <CodeBracketIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
