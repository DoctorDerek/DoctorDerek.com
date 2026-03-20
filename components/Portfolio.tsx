import React, { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import Modal from "./Modal"
import SectionHeading from "@/components/ui/SectionHeading"

const projects = [
  {
    projectTitle: "Project Title Lorem Ipsum Dolor Sit Amet",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
  {
    projectTitle: "2nd item",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
  {
    projectTitle: "3rd item",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
  {
    projectTitle: "4th item",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
  {
    projectTitle: "5th item",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
  {
    projectTitle: "6th item",
    details:
      "Duis aute irure dolor in reprehenderit in volputate velit esse cillum dolore eu fugasdiate nulla pariateur. Excepteur sint occaecat cupidtat non proident, sunt in culpa qui offcia deserunt.",
    tech: ["Lorem", "Ipsum", "Dolor", "Amet"],
    isClicked: false,
  },
]

export default function Portfolio() {
  const [portfolioWork, setPortfolioWork] = useState<
    {
      projectTitle: string
      details: string
      tech: string[]
      isClicked: boolean
    }[]
  >(projects)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [sliderRef] = useKeenSlider({
    loop: true,
  })

  const handleModal = (projectName: string) => {
    setShowModal(true)
    const selectProject = portfolioWork.map((item) => {
      if (item.projectTitle === projectName) return { ...item, isClicked: true }
      return { ...item, isClicked: false }
    })
    setPortfolioWork(selectProject)
  }

  return (
    <div className="h-full">
      <div className="-translate-y-12 py-4 opacity-0 transition-all duration-700 ease-spring-soft md:h-[15vh] [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="mx-auto flex w-4/5 justify-center text-center text-white drop-shadow-md">
          <SectionHeading>
            <h2 className="text-7xl lg:text-9xl">Portfolio</h2>
          </SectionHeading>
        </div>
      </div>
      {/* ========= Slider, displays only on small devices ======= */}
      <div className="translate-y-12 opacity-0 transition-all delay-100 duration-700 ease-spring-soft md:hidden [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div ref={sliderRef} className="keen-slider hover:cursor-grab">
          {portfolioWork.map((item) => {
            return (
              <div
                key={item.projectTitle}
                className="keen-slider__slide mx-auto grid transform-gpu grid-cols-1 space-x-0.5 sm:space-x-1"
              >
                <div className="mx-auto transition-transform duration-300 ease-spring-bouncy hover:scale-[1.02] hover:cursor-pointer">
                  <div>
                    {/* white space used as a placeholder for project image */}
                    <div className="mx-auto mb-1 h-[30vh] w-11/12 rounded-tr-3xl border border-white/20 bg-white/10 backdrop-blur-md"></div>
                    <div className="mx-auto w-11/12 rounded-br-3xl border-x border-b border-white/20 bg-black/40 pt-2 pr-3 pb-4 pl-3 text-white backdrop-blur-md">
                      <h3 className="mb-2 text-3xl">{item.projectTitle}</h3>
                      <p className="text-xl">{item.details}</p>
                      <div className="mt-3 flex gap-x-2">
                        {item.tech.map((paragraph: string, index: number) => (
                          <p
                            key={`${paragraph}${item.projectTitle}`}
                            className="mb-2 rounded-tr-xl border border-white/30 bg-white/20 py-1 pr-2 pl-2 text-xl text-white backdrop-blur-md"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Displays portfolio work on medium and large devices */}
      <div className="hidden gap-y-1 md:mx-auto md:flex md:h-[85vh] md:w-full md:flex-col">
        {portfolioWork.map((item, index) => {
          return (
            <div
              key={`portfolio-work-wrapper-${item.projectTitle}`}
              className="w-full translate-y-12 opacity-0 transition-all duration-700 ease-spring-soft md:flex md:h-1/6 md:shrink [.active_&]:translate-y-0 [.active_&]:opacity-100"
              style={{ transitionDelay: `${index * 100 + 100}ms` }}
            >
              <div
                onClick={() => handleModal(item.projectTitle)}
                className="flex h-full w-full items-center justify-around rounded-tr-3xl border border-white/20 bg-white/10 px-2 text-white backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-[1.02] hover:cursor-pointer hover:bg-white/20"
              >
                <div className="md:w-[15%]">
                  <h3 className="restorabold text-lg lg:text-2xl">
                    {item.projectTitle}
                  </h3>
                </div>
                <div className="md:w-[45%] lg:w-1/3">
                  <p className="lg:text-lg">{item.details}</p>
                </div>
                <div className="flex-end flex flex-wrap md:w-1/4 md:gap-x-1.5 lg:justify-center">
                  {item.tech.map((str: string, index: number) => {
                    return (
                      <p
                        key={`${item.projectTitle + str + index}`}
                        className="mb-2 rounded-tr-xl border border-white/30 bg-white/20 py-1 pr-2 pl-2 text-white backdrop-blur-md lg:mb-0 lg:text-lg"
                      >
                        {str}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Modal
        portfolioWork={portfolioWork}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  )
}
