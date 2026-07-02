import { useState } from "react"
import Modal from "./Modal"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from "@/constants/SITE_CONTENT"

/**
 * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
 * This component is intentionally unused at this time.
 */
export default function Portfolio() {
  const [portfolioWork, setPortfolioWork] = useState<
    (PortfolioProject & { isClicked: boolean })[]
  >(PORTFOLIO_PROJECTS.map((p) => ({ ...p, isClicked: false })))
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleModal = (projectName: string) => {
    setShowModal(true)
    const selectProject = portfolioWork.map((item) => {
      if (item.projectTitle === projectName) return { ...item, isClicked: true }
      return { ...item, isClicked: false }
    })
    setPortfolioWork(selectProject)
  }

  return (
    <>
      <div className="pointer-events-none absolute top-10 left-0 z-10 flex w-full justify-center text-center text-white drop-shadow-md">
        <SectionHeading>
          <h2 className="text-7xl lg:text-9xl">Portfolio</h2>
        </SectionHeading>
      </div>

      {portfolioWork.map((item) => (
        <div key={item.projectTitle} className="slide">
          <div className="flex h-full w-full items-center justify-center p-8">
            <div
              onClick={() => handleModal(item.projectTitle)}
              className="flex h-full max-h-[60vh] w-full max-w-4xl scale-95 cursor-pointer flex-col justify-around rounded-3xl border border-white/20 bg-white/10 p-8 text-white opacity-0 backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-[1.02] hover:bg-white/20 md:p-16 [.active_&]:scale-100 [.active_&]:opacity-100"
            >
              <div className="mx-auto mb-8 h-[25vh] w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"></div>
              <h3 className="restorabold mb-4 text-3xl lg:text-5xl">
                {item.projectTitle}
              </h3>
              <p className="mb-6 text-xl lg:text-2xl">{item.details}</p>
              <div className="flex flex-wrap gap-2">
                {item.tech.map((str: string, index: number) => (
                  <p
                    key={`${item.projectTitle + str + index}`}
                    className="rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-lg text-white backdrop-blur-md"
                  >
                    {str}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <Modal
        portfolioWork={portfolioWork}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
}
