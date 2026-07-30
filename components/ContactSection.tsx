import Image from "next/image"
import { useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import FlipPreview from "@/components/ui/FlipPreview"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  CONTACT_COLLAGE_PORTRAITS,
  CONTACT_PORTRAIT,
} from "@/constants/PORTRAITS"
import { CONTACT_BULLETS, CONTACT_CTA } from "@/constants/SITE_CONTENT"
import classNames from "@/utils/classNames"

const CONTACT_PORTRAIT_SIZES = "(max-width: 767px) 43vw, 488px"

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
            <FlipPreview
              accessibleName="Flip portrait of Dr. Derek Austin"
              containerClassName="animate-float h-full w-full"
              containerStyle={{ animationDelay: "1s" }}
              className="w-full"
              isPressed={isFlipped}
              onActivate={() =>
                setIsFlipped((currentIsFlipped) => !currentIsFlipped)
              }
            >
              <div
                className="wrapper relative aspect-square w-full max-w-[488px]"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: shouldReduceMotion
                    ? "none"
                    : "transform 0.8s ease-out",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="front absolute inset-0 h-full w-full"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={CONTACT_PORTRAIT.src}
                    alt={CONTACT_PORTRAIT.alt}
                    sizes={CONTACT_PORTRAIT_SIZES}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: CONTACT_PORTRAIT.objectPosition,
                    }}
                  />
                </div>
                <div
                  className="back absolute inset-0 h-full w-full"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="contact-portrait-mosaic bg-site-surface-deep grid h-full w-full grid-cols-2 grid-rows-[3fr_2fr] gap-0.5 overflow-hidden"
                  >
                    {CONTACT_COLLAGE_PORTRAITS.map((portrait) => (
                      <div
                        key={portrait.sourceFilename}
                        className={classNames(
                          "relative min-h-0 min-w-0 overflow-hidden",
                          portrait.layoutClassName,
                        )}
                      >
                        <Image
                          src={portrait.src}
                          alt=""
                          fill
                          sizes={portrait.sizes}
                          className="object-cover"
                          style={{
                            objectPosition: portrait.objectPosition,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FlipPreview>
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
          </div>
        </div>
      </div>
    </div>
  )
}
