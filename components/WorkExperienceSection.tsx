import Image from "next/image"
import CodeIcon from "@/images/codeIcon.svg"
import IntroAnimation from "@/images/Intro-Animation.jpg"
import SocialLinks from "./ui/SocialLinks"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"
import classNames from "@/utils/classNames"
import SectionHeading from "@/components/ui/SectionHeading"
import CountUp from "@/components/ui/CountUp"

export default function WorkExperienceSection() {
  const combinedLists = [...ARCHITECT_EVOLUTION]

  const getHalfNum = 3

  combinedLists.splice(
    getHalfNum,
    0,
    ...Array(7).fill({ duration: " ", company: "placeholder" }),
  )

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center py-20 pb-24">
      <Image
        src={IntroAnimation}
        alt="Work Experience Background"
        fill
        className="-z-10 object-cover opacity-30 mix-blend-overlay"
        priority={false}
      />

      <div className="translate-x-12 rounded-bl-[3rem] bg-black/60 px-2 py-6 opacity-0 backdrop-blur-md transition-all duration-700 ease-spring-soft lg:ml-auto lg:h-[30%] lg:w-[50%] [.active_&]:translate-x-0 [.active_&]:opacity-100">
        <div className="mx-auto flex w-[90%] flex-col items-end">
          <SectionHeading>
            <h2 className="text-right text-3xl font-bold tracking-tight whitespace-nowrap text-white drop-shadow-md min-[375px]:text-4xl sm:text-5xl md:text-8xl lg:text-8xl">
              <CountUp to={20} />+ Years of
            </h2>
            <h2 className="text-right text-3xl font-bold tracking-tight whitespace-nowrap text-white drop-shadow-md min-[375px]:text-4xl sm:text-5xl md:text-8xl lg:text-9xl">
              Full-Stack SWE
            </h2>
          </SectionHeading>
        </div>
      </div>

      <div className="mx-auto mt-6 w-[95%] translate-y-12 opacity-0 transition-all delay-200 duration-700 ease-spring-soft lg:hidden [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <ul className="mt-2 flex flex-col gap-y-6 pr-2 pl-4">
          {ARCHITECT_EVOLUTION.map((item, index) => (
            <li
              key={item.company}
              className={classNames(
                "relative translate-x-8 border-l-4 border-[#F38B57] pb-8 pl-6 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-x-0 [.active_&]:opacity-100",
                index === ARCHITECT_EVOLUTION.length - 1
                  ? "rounded-bl-xl border-b-4 pb-4"
                  : "",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className="absolute top-0 -left-[18px] h-8 w-8 animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CodeIcon className="h-full w-full" />
              </div>
              <div className="">
                <p className="text-xl font-bold text-white/80">
                  {item.duration}
                </p>
              </div>
              <div className="py-1">
                <p className="restorabold text-xl font-bold text-white">
                  {item.company.includes("20M+") ? (
                    <>
                      {item.company.split("20M+")[0]}
                      <CountUp to={20} />
                      M+{item.company.split("20M+")[1]}
                    </>
                  ) : (
                    item.company
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-12 hidden translate-y-12 opacity-0 transition-all delay-200 duration-700 ease-spring-soft lg:block lg:h-[65%] lg:w-11/12 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="flex h-[30vh] w-full flex-col md:h-[30vh] lg:relative lg:h-full">
          <ul className="work-exp-grid hidden h-full w-1/2 lg:absolute lg:-top-[30%] lg:left-1/4 lg:grid">
            {combinedLists.map((item, index) => {
              const isPlaceholder = item.company.includes("placeholder")
              const isLeftReal = index < getHalfNum
              const isRightPipe = index >= getHalfNum + 6

              if (isPlaceholder && !isRightPipe) {
                return (
                  <li
                    key={`placeholder-${index}`}
                    className="invisible h-full"
                  />
                )
              }

              return (
                <li
                  className={classNames(
                    "translate-y-12 pl-4 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100",
                    isLeftReal && "mr-8 border-r-4 border-white/40",
                    index === getHalfNum - 1 &&
                      "rounded-br-3xl border-b-4 border-white/40",
                    (isLeftReal || isRightPipe) &&
                      "border-l-4 border-[#F38B57]",
                    index === combinedLists.length - 1 &&
                      "rounded-bl-3xl border-b-4 border-l-0 pb-4",
                    index === 2 && "relative",
                    isPlaceholder &&
                      isRightPipe &&
                      "invisible mr-8 border-l-4 border-[#F38B57]",
                  )}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  key={`${item.duration} ${index}`}
                >
                  {!isPlaceholder && (
                    <div className="relative flex flex-col text-white">
                      <div
                        className="absolute top-0 -left-9 h-8 w-8 animate-float"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <CodeIcon className="h-full w-full" />
                      </div>
                      <p className="restorabold text-2xl font-bold">
                        {item.duration}
                      </p>
                      <p className="restorabold max-w-sm py-2 text-xl font-medium">
                        {item.company.includes("20M+") ? (
                          <>
                            {item.company.split("20M+")[0]}
                            <CountUp to={20} />
                            M+{item.company.split("20M+")[1]}
                          </>
                        ) : (
                          item.company
                        )}
                      </p>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-0 -right-8 w-8 border-t-2 border-b-2 border-[#F38B57]"></div>
                  )}
                </li>
              )
            })}
          </ul>

          <SocialLinks
            containerClasses="mt-auto mb-2 ml-6 flex w-[65%] translate-y-12 justify-between gap-y-4 opacity-0 transition-all delay-[600ms] duration-700 ease-spring-soft md:ml-12 md:w-[50%] lg:mb-28 lg:ml-32 lg:grid lg:w-1/5 lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-6 [.active_&]:translate-y-0 [.active_&]:opacity-100"
            linkClasses="flex font-bold text-white transition-transform duration-300 ease-spring-bouncy hover:scale-110 active:scale-95 lg:text-xl"
            labelClasses="ml-1 hidden pt-1 lg:block"
            showLabels={true}
          />
        </div>
      </div>
    </div>
  )
}
