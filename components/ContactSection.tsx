import { useState } from "react"
import Image from "next/image"
import contactimage from "@/images/contactimage.png"
import DerekSpriteImg from "@/images/DerekSpriteImg.png"
import SectionHeading from "@/components/ui/SectionHeading"

export default function ContactSection() {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.location.href = [
      "mailto:",
      "derekraustin",
      "+doctorderek",
      "@",
      "gmail.com",
      "?subject=AI%20Evaluation%20Consultancy",
    ].join("")
  }

  return (
    <div className="h-full w-full">
      <div className="flex h-screen flex-col md:flex-row">
        <div className="mx-auto h-[45%] w-[85%] md:flex md:h-full md:w-1/2 md:flex-col md:pl-8 lg:w-[45%] lg:justify-start lg:pl-20">
          <div className="-translate-x-12 py-4 opacity-0 transition-all duration-700 ease-spring-soft md:mt-16 md:mb-2 lg:mb-0 lg:py-0 [.active_&]:translate-x-0 [.active_&]:opacity-100">
            <SectionHeading>
              <h2 className="text-7xl text-white drop-shadow-lg md:text-8xl lg:pt-8 lg:pb-14 lg:text-9xl">
                Contact
              </h2>
            </SectionHeading>
          </div>

          {/* Wrapper to isolate Tailwind entrance from JS-driven inline flip transform */}
          <div className="w-3/5 translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 ease-spring-bouncy md:h-1/2 md:w-full [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
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
                  {/*==== Front image ======  md:h-3/4 md:w-[85%]*/}
                  <div className="front h-full">
                    <Image
                      src={contactimage}
                      alt="Derek Austin"
                      className="object-cover md:relative"
                      quality={100}
                      priority
                    />
                  </div>
                  {/*===== Back image ======= */}
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

        <div className="mx-auto flex h-[55%] w-full translate-y-12 flex-col opacity-0 transition-all delay-300 duration-700 ease-spring-soft md:mt-0 md:h-full md:w-1/2 md:pl-8 lg:w-[55%] [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div className="mx-auto mt-8 w-4/5 md:mt-32 md:ml-0 md:h-1/6 md:w-11/12 lg:my-auto lg:mr-0 lg:ml-auto lg:w-11/12 lg:pt-16 lg:pl-14">
            <p className="rounded-xl bg-black/20 py-4 pr-2 pl-2 text-xl leading-8 text-white backdrop-blur-md md:pl-4 md:text-xl lg:pr-20 lg:text-2xl lg:leading-9">
              Discover the power of versatile frontend developing with Derek
              Austin. Get in touch to discuss your next development project, or
              to simply chat.
            </p>
            <button
              onClick={handleEmailClick}
              className="mt-8 rounded-tr-3xl bg-[#F38B57] px-12 py-6 text-2xl font-bold text-white transition-transform duration-300 ease-spring-bouncy hover:scale-105 active:scale-95"
            >
              Email Me for Consultancy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
