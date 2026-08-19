"use client"

import { useRef, useState, type TouchEvent } from "react"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"
import CodeIcon from "@/images/codeIcon.svg"
import classNames from "@/utils/classNames"

const MINIMUM_HORIZONTAL_SWIPE_DISTANCE = 48

type TouchOrigin = {
  x: number
  y: number
}

export default function WorkExperienceSection() {
  const [activeCareerEraIndex, setActiveCareerEraIndex] = useState(0)
  const touchOriginReference = useRef<TouchOrigin | null>(null)
  const finalCareerEraIndex = ARCHITECT_EVOLUTION.length - 1

  const showCareerEra = (careerEraIndex: number) =>
    setActiveCareerEraIndex(
      Math.max(0, Math.min(careerEraIndex, finalCareerEraIndex)),
    )

  const handleCareerTimelineTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    const touch = event.changedTouches[0]
    if (!touch) return

    touchOriginReference.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  const handleCareerTimelineTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchOrigin = touchOriginReference.current
    const touch = event.changedTouches[0]
    touchOriginReference.current = null
    if (!touchOrigin || !touch) return

    const horizontalDistance = touchOrigin.x - touch.clientX
    const verticalDistance = Math.abs(touchOrigin.y - touch.clientY)
    if (
      Math.abs(horizontalDistance) < MINIMUM_HORIZONTAL_SWIPE_DISTANCE ||
      Math.abs(horizontalDistance) <= verticalDistance
    )
      return

    showCareerEra(activeCareerEraIndex + (horizontalDistance > 0 ? 1 : -1))
  }

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-start py-12 pb-16 lg:h-full lg:justify-center lg:py-8">
      <div className="bg-site-surface-deep rounded-bl-[3rem] px-6 py-6 backdrop-blur-md lg:ml-auto lg:w-fit lg:pr-8 lg:pb-8 lg:pl-16">
        <div className="flex flex-col items-end">
          <div className="w-max">
            <h2 className="text-site-foreground text-right text-3xl font-bold tracking-tight whitespace-nowrap drop-shadow-md min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
              Full-Stack SWE
              <br />
              since 2004
            </h2>
          </div>
        </div>
      </div>

      <div
        aria-label="Career timeline"
        aria-roledescription="carousel"
        className="mx-auto mt-6 w-[92%] max-w-xl lg:hidden"
        role="region"
      >
        <p aria-live="polite" className="sr-only">
          Career era {activeCareerEraIndex + 1} of {ARCHITECT_EVOLUTION.length}:{" "}
          {ARCHITECT_EVOLUTION[activeCareerEraIndex]?.duration}
        </p>

        <div
          className="relative [touch-action:pan-y] overflow-hidden"
          onTouchEnd={handleCareerTimelineTouchEnd}
          onTouchStart={handleCareerTimelineTouchStart}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            data-career-rail="mobile"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 9 0 V 78 Q 9 83 14 83 H 100"
              fill="none"
              stroke="#F38B57"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol
            aria-label="Career eras"
            className="relative flex transition-transform duration-500 ease-out"
            id="work-experience-mobile-track"
            style={{ transform: `translateX(-${activeCareerEraIndex * 100}%)` }}
          >
            {ARCHITECT_EVOLUTION.map((item, index) => (
              <li
                aria-hidden={activeCareerEraIndex !== index}
                aria-label={`${index + 1} of ${ARCHITECT_EVOLUTION.length}`}
                aria-roledescription="slide"
                className="relative min-h-60 w-full shrink-0 px-8 pt-12"
                key={item.duration}
                role="group"
              >
                <div
                  className="animate-float absolute top-0 left-[calc(9%-1rem)] h-8 w-8"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CodeIcon className="h-full w-full" />
                </div>
                <p className="text-site-foreground-faint text-xl font-bold">
                  {item.duration}
                </p>
                <p className="restorabold text-site-foreground py-2 text-xl font-bold">
                  {item.company}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-3 flex items-center justify-center gap-5">
          <button
            aria-controls="work-experience-mobile-track"
            aria-label="Show previous career era"
            className="bg-site-surface-deep text-site-foreground ring-site-focus flex h-11 w-11 items-center justify-center rounded-full ring-offset-2 transition-transform hover:scale-105 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={activeCareerEraIndex === 0}
            onClick={() => showCareerEra(activeCareerEraIndex - 1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>

          <div
            aria-label="Choose career era"
            className="flex gap-3"
            role="group"
          >
            {ARCHITECT_EVOLUTION.map((item, index) => (
              <button
                aria-controls="work-experience-mobile-track"
                aria-current={
                  activeCareerEraIndex === index ? "step" : undefined
                }
                aria-label={`Show ${item.duration}`}
                className="group ring-site-focus flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 focus-visible:ring-2"
                key={item.duration}
                onClick={() => showCareerEra(index)}
                type="button"
              >
                <span
                  className={classNames(
                    "h-3 rounded-full transition-all",
                    activeCareerEraIndex === index
                      ? "w-7 bg-[#F38B57]"
                      : "bg-site-foreground-faint group-hover:bg-site-foreground-muted w-3",
                  )}
                />
              </button>
            ))}
          </div>

          <button
            aria-controls="work-experience-mobile-track"
            aria-label="Show next career era"
            className="bg-site-surface-deep text-site-foreground ring-site-focus flex h-11 w-11 items-center justify-center rounded-full ring-offset-2 transition-transform hover:scale-105 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={activeCareerEraIndex === finalCareerEraIndex}
            onClick={() => showCareerEra(activeCareerEraIndex + 1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m9 18 6-6-6-6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-7 hidden lg:block lg:h-[clamp(23rem,52vh,28rem)] lg:w-[min(74rem,92vw)]">
        <div className="relative h-full w-full">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            data-career-rail="desktop"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 2 5 V 92 Q 2 96 6 96 H 44 Q 48 96 48 92 V 29 Q 48 25 52 25 V 95"
              fill="none"
              stroke="#F38B57"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol
            aria-label="Desktop career timeline"
            className="grid h-full grid-cols-2 grid-rows-2"
          >
            {ARCHITECT_EVOLUTION.map((item, index) => (
              <li
                className={classNames(
                  "relative px-4",
                  index === 0 && "pt-10",
                  (index === 1 || index === 3) && "pt-16",
                  index === 2 && "pt-[calc(50%+1.25rem)]",
                  index === 0 && "col-start-1 row-start-1",
                  index === 1 && "col-start-1 row-start-2",
                  index === 2 && "col-start-2 row-start-1",
                  index === 3 && "col-start-2 row-start-2",
                )}
                key={item.duration}
              >
                <div
                  className={classNames(
                    "animate-float absolute left-0 h-8 w-8",
                    index === 0 && "top-[calc(10%-1rem)]",
                    (index === 1 || index === 3) && "top-[calc(20%-1rem)]",
                    index === 2 && "top-[calc(50%-1rem)]",
                  )}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CodeIcon className="h-full w-full" />
                </div>
                <div className="text-site-foreground flex flex-col">
                  <p className="restorabold text-2xl font-bold">
                    {item.duration}
                  </p>
                  <p className="restorabold max-w-xl py-2 text-lg font-medium xl:text-xl">
                    {item.company}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
