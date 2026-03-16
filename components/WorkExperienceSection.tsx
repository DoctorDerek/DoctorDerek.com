import React from "react"
import Image from "next/image"
import CodeIcon from "@/images/codeIcon.svg"
import IntroAnimation from "@/images/Intro-Animation.jpg"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import EmailIcon from "./EmailIcon"
import GithubIcon from "./GithubIcon"
import MediumIcon from "./MediumIcon"
import BookLinkIcon from "./BookLinkIcon"
import WorkExpSlider from "./WorkExpSlider"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"

export default function WorkExperienceSection() {
  const [sliderRef] = useKeenSlider({ loop: true })

  // Slice the evolution array into slides for mobile
  // Mobile slide 1 gets exactly 3 items, slide 2 gets the remaining 2 items.
  const firstSlide = ARCHITECT_EVOLUTION.slice(0, 1)
  const secondSlide = ARCHITECT_EVOLUTION.slice(1, 3)
  const thirdSlide = ARCHITECT_EVOLUTION.slice(3, 5)

  /** Arrays combined for desktop grid mapping */
  const combinedLists = [...ARCHITECT_EVOLUTION]

  /** Hardcode 3 to ensure exactly 3 items are on the left side of the grid bend */
  const getHalfNum = 3

  // Inject 4 placeholders into the grid array logic so the CSS maps flawlessly across columns
  combinedLists.splice(
    getHalfNum,
    0,
    {
      duration: " ",
      company: "placeholder 1",
    },
    {
      duration: " ",
      company: "placeholder 2",
    },
    {
      duration: " ",
      company: "placeholder 3",
    },
    {
      duration: " ",
      company: "placeholder 4",
    },
  )

  return (
    <div className="relative flex h-screen flex-col items-center justify-center pt-16">
      <Image
        src={IntroAnimation}
        alt="Work Experience Background"
        fill
        className="-z-10 object-cover opacity-30 mix-blend-overlay"
        priority={false}
      />

      {/* HEADER */}
      <div className="rounded-bl-[3rem] bg-black/60 px-2 py-6 backdrop-blur-md lg:ml-auto lg:h-[30%] lg:w-[50%]">
        <div className="mx-auto w-[90%]">
          <h2 className="text-right text-6xl font-bold text-white drop-shadow-md md:text-8xl lg:text-8xl">
            Timeline of
          </h2>
          <h2 className="text-right text-7xl font-bold text-white drop-shadow-md md:text-8xl lg:text-9xl">
            Mastery
          </h2>
        </div>
      </div>

      {/* ========= Slider (Mobile & Tablet) ======= */}
      <div className="mt-6 ml-auto h-[42vh] w-[95%] lg:hidden">
        <div ref={sliderRef} className="keen-slider hover:cursor-grab">
          {/* ========= First Slide ============ */}
          <div className="keen-slider__slide">
            <div>
              <div className="pl-3">
                <ul className="mt-2 pl-1">
                  <WorkExpSlider arry={firstSlide} />
                </ul>
              </div>
            </div>
          </div>
          {/* ========= Second Slide ============ */}
          <div className="keen-slider__slide">
            <div>
              <div className="pl-4">
                <ul className="mt-7 pl-1">
                  <WorkExpSlider arry={secondSlide} />
                </ul>
              </div>
            </div>
          </div>
          {/* ========= Third Slide ============ */}
          <div className="keen-slider__slide">
            <div>
              <div className="pl-4">
                <ul className="mt-7 pl-1">
                  <WorkExpSlider arry={thirdSlide} />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========= Displays work experince grid on large devices ======= */}
      <div className="mx-auto mt-12 hidden lg:block lg:h-[65%] lg:w-11/12">
        <div className="flex h-[30vh] w-full flex-col md:h-[30vh] lg:relative lg:h-full">
          <ul className="work-exp-grid hidden h-full w-1/2 lg:absolute lg:-top-[30%] lg:left-1/4 lg:grid">
            {combinedLists.map((item, index) => {
              /* Ternary operators adds CSS borders for dynamic connector pipe */
              return (
                <li
                  className={`pl-4 ${
                    index === getHalfNum - 1 ||
                    index === getHalfNum - 2 ||
                    index === getHalfNum - 3
                      ? "mr-8 border-r-4 border-white/40"
                      : ""
                  } ${index === getHalfNum - 1 && "rounded-b-3xl border-b-4 border-white/40"} ${
                    index < getHalfNum || index > getHalfNum + 3
                      ? "border-l-4 border-[#F38B57]"
                      : ""
                  } ${index === combinedLists.length - 1 && "border-l-0"} ${index === 2 && "relative"} `}
                  key={`${item.duration} ${index}`}
                >
                  <div className="relative flex flex-col text-white">
                    {/* Hides code icon if item.company string contains placeholder */}
                    {!item.company.includes("placeholder") && (
                      <CodeIcon className="absolute top-0 -left-9 h-8 w-8" />
                    )}
                    <p className="restorabold text-2xl font-bold">
                      {item.duration}
                    </p>
                    <p
                      className={`${
                        item.company.includes("placeholder") ? "invisible" : ""
                      } restorabold max-w-sm py-2 text-xl font-medium`}
                    >
                      {item.company}
                    </p>
                  </div>
                  {/* Horizontal connecting line for the 3rd item in work experience */}
                  {index === 2 && (
                    <div className="absolute top-0 -right-8 w-8 border-t-2 border-b-2 border-[#F38B57]"></div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Icons with links */}
          <div className="mt-auto mb-2 ml-6 flex w-[65%] justify-between gap-y-4 md:ml-12 md:w-[50%] lg:mb-28 lg:ml-32 lg:grid lg:w-1/5 lg:grid-cols-2 lg:grid-rows-3 lg:gap-x-6">
            <a
              className="font-bold text-white md:flex lg:text-xl"
              href="mailto:derekraustin@gmail.com"
            >
              <EmailIcon fill="#F38B57" />
              <span className="ml-2 hidden pt-1 lg:block">Email</span>
            </a>
            <a
              href="https://github.com/DoctorDerek"
              className="text-lg font-bold text-white md:flex lg:text-xl"
              target="_blank"
            >
              <GithubIcon fill="#F38B57" />
              <span className="ml-1 hidden pt-1 lg:block">Github</span>
            </a>
            <a
              href="https://doctorderek.medium.com/"
              className="text-lg font-bold text-white md:flex lg:text-xl"
              target="_blank"
            >
              <MediumIcon fill="#F38B57" />
              <span className="ml-1 hidden pt-1 lg:block">Medium</span>
            </a>
            <a
              className="font-bold text-white md:flex lg:text-xl"
              href="https://www.amazon.com/dp/B0BRJDLJ43"
              target="_blank"
            >
              <BookLinkIcon fill="#F38B57" />
              <span className="ml-1 hidden pt-1 lg:block">Book</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
