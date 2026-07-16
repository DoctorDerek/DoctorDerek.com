import { Dialog, Transition } from "@headlessui/react"
import {
  ArrowTopRightOnSquareIcon,
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
              <Dialog.Panel className="scrollable-content relative max-h-[85dvh] w-full max-w-2xl transform overflow-y-auto rounded-3xl border border-white/20 bg-[#171126]/95 p-6 text-white shadow-2xl backdrop-blur-xl transition-all sm:p-10">
                {project && (
                  <>
                    <button
                      type="button"
                      aria-label="Close project details"
                      className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-[#FFE366] focus-visible:outline-none"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <p className="mb-4 w-fit rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-sm font-semibold text-emerald-100">
                      Live production
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="restorabold pr-12 text-4xl leading-tight sm:text-5xl"
                    >
                      {project.projectTitle}
                    </Dialog.Title>
                    <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl">
                      {project.details}
                    </p>
                    <ul
                      aria-label={project.projectTitle + " technologies"}
                      className="mt-6 flex flex-wrap gap-2"
                    >
                      {project.tech.map((technology) => (
                        <li
                          key={technology}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={project.liveUrl}
                      aria-label={"View " + project.projectTitle + " live"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ease-spring-bouncy mt-8 inline-flex w-full items-center justify-center gap-3 rounded-tr-3xl bg-[#FFE366] px-6 py-4 text-lg font-bold text-[#311B4D] shadow-xl transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none active:scale-95 sm:w-fit"
                    >
                      View live project
                      <ArrowTopRightOnSquareIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
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
