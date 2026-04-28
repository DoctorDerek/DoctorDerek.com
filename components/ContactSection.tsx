import { useState } from "react"
import Image from "next/image"
import contactimage from "@/images/contactimage.png"
import DerekSpriteImg from "@/images/DerekSpriteImg.png"
import SectionHeading from "@/components/ui/SectionHeading"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"
import { CONTACT_BULLETS, CONTACT_CTA } from "@/constants/SITE_CONTENT"

export default function ContactSection() {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="slide">
      <div className="h-full w-full py-10 md:py-20">
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="mx-auto w-[85%] md:flex md:w-1/2 md:flex-col md:pl-8 lg:w-[45%] lg:justify-start lg:pl-20">
            <div className="-translate-x-12 py-2 opacity-0 transition-all duration-700 ease-spring-soft md:mt-16 md:mb-2 lg:mb-0 lg:py-0 [.active_&]:translate-x-0 [.active_&]:opacity-100">
              <SectionHeading>
                <h2 className="text-6xl text-white drop-shadow-lg md:text-8xl lg:pt-8 lg:pb-14 lg:text-9xl">
                  Contact
                </h2>
              </SectionHeading>
            </div>
  
            <div className="w-1/2 mx-auto md:mx-0 translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 ease-spring-bouncy md:h-1/2 md:w-full [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
              <div
                className="perspective h-full w-full animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div
                  className="cursor-pointer transition-transform duration-300 ease-spring-bouncy hover:scale-105 active:scale-95"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div
                    className="wrapper md:relative lg:inline-flex"
                    style={{
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.8s ease-out",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="front h-full">
                      <Image
                        src={contactimage}
                        alt="Derek Austin"
                        className="object-cover md:relative"
                        quality={100}
                        priority
                      />
                    </div>
                    <div className="back hidden h-full md:absolute md:top-0 md:right-0 md:bottom-0 md:left-0 md:block">
                      <Image
                        src={DerekSpriteImg}
                        alt="Derek Austin Sprite"
                        className="object-cover md:relative"
                        quality={100}
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mx-auto mt-4 flex w-full translate-y-12 flex-col opacity-0 transition-all delay-300 duration-700 ease-spring-soft md:mt-0 md:w-1/2 md:pl-8 lg:w-[55%] [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="mx-auto mt-4 w-[90%] md:mt-32 md:ml-0 md:h-1/6 md:w-11/12 lg:my-auto lg:mr-0 lg:ml-auto lg:w-11/12 lg:pt-16 lg:pl-14">
              <div className="scrollable-content space-y-4 rounded-xl border border-white/10 bg-black/40 px-5 py-6 text-lg leading-7 text-white shadow-xl backdrop-blur-md md:px-8 md:text-xl lg:pr-12 lg:text-2xl lg:leading-9 max-h-[30vh] overflow-y-auto overscroll-contain md:max-h-[50vh]">
                {CONTACT_BULLETS.map((bullet) => (
                  <p key={bullet} className="flex">
                    <span className="mr-3 text-[#F38B57]">★</span>
                    <span>{bullet}</span>
                  </p>
                ))}
              </div>
              <GlobalEmailCTA className="mt-8 inline-block w-full rounded-tr-3xl bg-[#F38B57] px-8 py-5 text-center text-xl font-bold text-white shadow-xl transition-all duration-300 ease-spring-bouncy hover:scale-[1.02] hover:bg-[#ff9c6a] active:scale-95 md:w-max md:px-12 md:py-6 md:text-2xl">
                {CONTACT_CTA}
              </GlobalEmailCTA>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}