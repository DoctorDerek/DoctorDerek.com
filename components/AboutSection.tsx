import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"
import DerekAustin from "@/images/DerekAustin.png"
import Image from "next/image"

export default function AboutSection() {
  return (
    <div className="h-screen w-full">
      <div className="mx-auto w-4/5 md:w-[90%] lg:w-3/4">
        <div className="-translate-x-12 py-4 text-white opacity-0 drop-shadow-md transition-all duration-700 ease-spring-soft md:relative md:py-8 lg:pt-14 lg:pb-10 [.active_&]:translate-x-0 [.active_&]:opacity-100">
          <h2 className="text-7xl md:text-8xl lg:text-9xl lg:font-semibold">
            About
          </h2>
        </div>
        <div className="relative h-[80vh] overflow-y-auto md:h-[70vh]">
          {/* ======= DR DEREK AUSTIN IMAGE ========= */}
          <div className="w-[65%] translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 ease-spring-bouncy md:w-1/2 lg:w-[45%] [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <div
              className="animate-float overflow-hidden rounded-tr-[6rem] md:rounded-tr-[4.5rem]"
              style={{ animationDelay: "0s" }}
            >
              <Image
                src={DerekAustin}
                alt="Dr Derek Austin"
                className="w-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-12 left-6 translate-y-12 rounded-tl-3xl border border-white/20 bg-black/40 px-6 py-5 opacity-0 backdrop-blur-xl transition-all delay-300 duration-700 ease-spring-soft md:right-0 md:-bottom-8 md:left-auto md:w-[55%] lg:right-36 lg:bottom-12 lg:left-auto lg:w-1/2 lg:px-10 lg:py-7 [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="max-h-[40vh] overflow-y-auto pr-2 text-lg leading-7 text-white lg:text-xl lg:leading-9">
              {ABOUT_BIO_LONG.map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
              <p className="mt-8 animate-pulse text-xl font-bold text-[#F38B57]">
                But enough talk. Scroll down to play the WebGL game I built to
                prove my stack. 👇🎮🦝
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
