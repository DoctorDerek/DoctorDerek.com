import CountUp from "@/components/ui/CountUp"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"
import CodeIcon from "@/images/codeIcon.svg"
import classNames from "@/utils/classNames"

type MilestoneDescriptionProps = {
  company: string
}

function MilestoneDescription({ company }: MilestoneDescriptionProps) {
  const [beforeCount, afterCount] = company.split("20M+")

  if (afterCount === undefined) return company

  return (
    <>
      {beforeCount}
      <CountUp to={20} />
      M+{afterCount}
    </>
  )
}

export default function WorkExperienceSection() {
  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-start py-20 pb-24 lg:h-full lg:justify-center lg:py-4">
      <div className="bg-site-surface-deep rounded-bl-[3rem] px-6 py-6 backdrop-blur-md lg:ml-auto lg:w-fit lg:py-4 lg:pr-8 lg:pl-16 xl:py-6 xl:pb-8">
        <div className="flex flex-col items-end">
          <h2 className="text-site-foreground text-right text-3xl font-bold tracking-tight whitespace-nowrap drop-shadow-md min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl">
            Full-Stack SWE
            <br />
            since 2004
          </h2>
        </div>
      </div>

      <div className="lg:border-site-border lg:bg-site-surface mx-auto mt-6 w-[95%] lg:mt-8 lg:w-[94%] lg:rounded-3xl lg:border lg:px-6 lg:py-7 lg:backdrop-blur-xl xl:px-8 xl:py-9">
        <ol
          aria-label="Career timeline"
          className="border-brand-coral flex flex-col lg:grid lg:grid-cols-4 lg:border-t-4"
        >
          {ARCHITECT_EVOLUTION.map((item, index) => (
            <li
              key={item.duration}
              className={classNames(
                "border-brand-coral relative border-l-4 pb-8 pl-6 lg:min-w-0 lg:pt-8 lg:pr-5 lg:pb-0 lg:pl-5",
                index === ARCHITECT_EVOLUTION.length - 1
                  ? "rounded-bl-xl border-b-4 pb-4 lg:rounded-none lg:border-b-0 lg:pb-0"
                  : "",
              )}
            >
              <div
                className="animate-float absolute top-0 -left-[18px] h-8 w-8 lg:-top-[18px]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CodeIcon className="h-full w-full" />
              </div>
              <p className="restorabold text-site-foreground-faint text-xl font-bold lg:text-xl">
                {item.duration}
              </p>
              <p className="restorabold text-site-foreground py-1 text-xl font-bold lg:py-2 lg:text-base lg:leading-6 lg:font-medium xl:text-lg xl:leading-7 2xl:text-xl">
                <MilestoneDescription company={item.company} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
