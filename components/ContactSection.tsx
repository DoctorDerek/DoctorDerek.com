import Image from "next/image"
import { useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  CONTACT_BULLETS,
  CONTACT_COMPLETION,
  CONTACT_CTA,
} from "@/constants/SITE_CONTENT"
import contactimage from "@/images/contactimage.png"
import DerekSpriteImg from "@/images/DerekSpriteImg.png"

export default function ContactSection() {
  const { shouldReduceMotion } = useMotionPreference()
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="flex min-h-full w-full py-10 md:py-20">
      <div className="my-auto flex w-full flex-col md:flex-row md:items-stretch">
        <div className="mx-auto w-[85%] md:flex md:w-1/2 md:flex-col md:pl-8 lg:w-[45%] lg:justify-start lg:pl-20">
          <div className="py-2 md:mt-16 md:mb-2 lg:mb-0 lg:py-0">
            <SectionHeading>
              <h2 className="text-site-foreground text-6xl drop-shadow-lg md:text-8xl lg:pt-8 lg:pb-14 lg:text-9xl">
                Contact
              </h2>
            </SectionHeading>
          </div>

          <div className="ease-spring-bouncy mx-auto w-1/2 translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 md:mx-0 md:h-1/2 md:w-full [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <div
              className="perspective animate-float h-full w-full"
              style={{ animationDelay: "1s" }}
            >
              <button
                type="button"
                aria-label="Flip portrait of Dr. Derek Austin"
                aria-pressed={isFlipped}
                className="ease-spring-bouncy focus-visible:ring-site-focus focus-visible:ring-offset-site-surface-strong block w-full cursor-pointer rounded-xl bg-transparent p-0 text-left transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none active:scale-95"
                onClick={() =>
                  setIsFlipped((currentIsFlipped) => !currentIsFlipped)
                }
              >
                <div
                  className="wrapper md:relative lg:inline-flex"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: shouldReduceMotion
                      ? "none"
                      : "transform 0.8s ease-out",
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
              </button>
            </div>
          </div>
        </div>

        <div className="ease-spring-soft mx-auto mt-4 flex w-full translate-y-12 flex-col opacity-0 transition-all delay-300 duration-700 md:mt-0 md:w-1/2 md:pl-8 lg:w-[55%] [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div className="mx-auto mt-4 w-[90%] md:ml-0 md:w-11/12 lg:mr-0 lg:ml-auto lg:w-11/12 lg:pl-14">
            <div className="border-site-border-faint bg-site-surface text-site-foreground space-y-4 rounded-xl border px-5 py-6 text-lg leading-7 shadow-xl backdrop-blur-md md:px-8 md:text-xl lg:pr-12 lg:text-2xl lg:leading-9">
              {CONTACT_BULLETS.map((bullet) => (
                <p key={bullet} className="flex">
                  <span className="mr-3 text-[#F38B57]">★</span>
                  <span>{bullet}</span>
                </p>
              ))}
            </div>
            <GlobalEmailCTA className="ease-spring-bouncy site-focus-contrast mt-8 inline-block w-full rounded-tr-3xl bg-[#F38B57] px-8 py-5 text-center text-xl font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#ff9c6a] active:scale-95 md:w-max md:px-12 md:py-6 md:text-2xl">
              {CONTACT_CTA}
            </GlobalEmailCTA>
            <footer
              aria-label="End of DoctorDerek.com"
              className="border-site-border text-site-foreground mt-8 flex flex-col gap-3 border-t pt-6 text-center md:items-start md:text-left"
            >
              <p className="text-sm font-bold tracking-wide text-balance md:text-base">
                {CONTACT_COMPLETION.message}
              </p>
              <a
                href="#home"
                className="text-site-accent-text decoration-site-accent-text/60 hover:text-site-foreground focus-visible:ring-site-focus focus-visible:ring-offset-site-surface-strong w-fit rounded-lg text-sm font-semibold underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none md:text-base"
              >
                {CONTACT_COMPLETION.returnLabel}
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
