import CountUp from "@/components/ui/CountUp"
import SectionHeading from "@/components/ui/SectionHeading"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"
import CodeIcon from "@/images/codeIcon.svg"
import classNames from "@/utils/classNames"

export default function WorkExperienceSection() {
  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-start py-12 pb-16 lg:h-full lg:justify-center lg:py-8">
      <div className="bg-site-surface-deep rounded-bl-[3rem] px-6 py-6 backdrop-blur-md lg:ml-auto lg:w-fit lg:pr-8 lg:pb-8 lg:pl-16">
        <div className="flex flex-col items-end">
          <SectionHeading>
            <h2 className="text-site-foreground text-right text-3xl font-bold tracking-tight whitespace-nowrap drop-shadow-md min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
              Full-Stack SWE
              <br />
              since 2004
            </h2>
          </SectionHeading>
        </div>
      </div>

      <div className="ease-spring-soft mx-auto mt-6 w-[95%] translate-y-12 opacity-0 transition-all delay-200 duration-700 lg:hidden [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <ul className="mt-2 flex flex-col gap-y-6 pr-2 pb-8 pl-4">
          {ARCHITECT_EVOLUTION.map((item, index) => (
            <li
              key={item.company}
              className={classNames(
                "ease-spring-soft relative translate-x-8 border-l-4 border-[#F38B57] pb-8 pl-6 opacity-0 transition-all duration-700 [.active_&]:translate-x-0 [.active_&]:opacity-100",
                index === ARCHITECT_EVOLUTION.length - 1
                  ? "rounded-bl-xl border-b-4 pb-4"
                  : "",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className="animate-float absolute top-0 -left-[18px] h-8 w-8"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CodeIcon className="h-full w-full" />
              </div>
              <div className="">
                <p className="text-site-foreground-faint text-xl font-bold">
                  {item.duration}
                </p>
              </div>
              <div className="py-1">
                <p className="restorabold text-site-foreground text-xl font-bold">
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

      <div className="ease-spring-soft mx-auto mt-7 hidden translate-y-12 opacity-0 transition-all delay-200 duration-700 lg:block lg:h-[min(28rem,52vh)] lg:w-[min(74rem,92vw)] [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="relative h-full w-full">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 2 5 H 98 V 55 H 2"
              fill="none"
              stroke="#F38B57"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ul className="grid h-full grid-cols-2 grid-rows-2 gap-x-16">
            {ARCHITECT_EVOLUTION.map((item, index) => (
              <li
                className={classNames(
                  "ease-spring-soft relative translate-y-12 px-4 pt-10 opacity-0 transition-all duration-700 [.active_&]:translate-y-0 [.active_&]:opacity-100",
                  index === 0 && "col-start-1 row-start-1",
                  index === 1 && "col-start-2 row-start-1",
                  index === 2 && "col-start-2 row-start-2",
                  index === 3 && "col-start-1 row-start-2",
                )}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
                key={item.duration}
              >
                <div
                  className="animate-float absolute top-[calc(10%-1rem)] left-0 h-8 w-8"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CodeIcon className="h-full w-full" />
                </div>
                <div className="text-site-foreground flex flex-col">
                  <p className="restorabold text-2xl font-bold">
                    {item.duration}
                  </p>
                  <p className="restorabold max-w-xl py-2 text-lg font-medium xl:text-xl">
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
      </div>
    </div>
  )
}
