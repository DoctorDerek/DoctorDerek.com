import Image from "next/image"
import { useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import FlipPreview from "@/components/ui/FlipPreview"
import SectionHeading from "@/components/ui/SectionHeading"
import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"
import professionalPortrait from "@/images/derek-austin-professional-portrait.webp"
import standingPortrait from "@/images/derek-austin-standing-portrait.webp"
import thoughtfulPortrait from "@/images/derek-austin-thoughtful-portrait.webp"

const ABOUT_PORTRAIT_SIZES =
  "(max-width: 767px) 52vw, (max-width: 1023px) 45vw, 40.5vw"

export default function AboutSection() {
  const { shouldReduceMotion } = useMotionPreference()
  const [flipCount, setFlipCount] = useState(0)

  const photos = [professionalPortrait, thoughtfulPortrait, standingPortrait]

  const currentPhoto = photos[flipCount % 3]
  const nextPhoto = photos[(flipCount + 1) % 3]

  const frontSrc = flipCount % 2 === 0 ? currentPhoto : nextPhoto
  const backSrc = flipCount % 2 === 1 ? currentPhoto : nextPhoto

  return (
    <div className="h-full w-full pt-2 pb-10 md:pt-3 md:pb-16">
      <div className="mx-auto w-4/5 md:w-[90%] lg:w-[90%]">
        <div className="text-site-foreground py-2 drop-shadow-md md:relative md:pt-2 md:pb-8 lg:pt-3 lg:pb-10">
          <SectionHeading>
            <h2 className="text-5xl font-semibold min-[375px]:text-6xl md:text-8xl lg:text-9xl">
              About
            </h2>
          </SectionHeading>
        </div>
        <div className="relative pb-10 md:h-[60vh]">
          <div className="ease-spring-bouncy w-[65%] translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 md:w-1/2 lg:w-[45%] [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <FlipPreview
              accessibleName="Show next portrait of Dr. Derek Austin"
              containerClassName="animate-float block w-full text-left"
              containerStyle={{ animationDelay: "0s" }}
              className="w-full"
              onActivate={() =>
                setFlipCount((currentFlipCount) => currentFlipCount + 1)
              }
            >
              <div
                className="relative aspect-square w-full cursor-pointer"
                style={{
                  transform: `rotateY(${flipCount * 180}deg)`,
                  transition: shouldReduceMotion
                    ? "none"
                    : "transform 0.8s ease-out",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-tr-[6rem] md:rounded-tr-[4.5rem]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={frontSrc}
                    alt="Dr Derek Austin"
                    fill
                    sizes={ABOUT_PORTRAIT_SIZES}
                    className="object-cover object-top"
                  />
                </div>

                <div
                  className="absolute inset-0 overflow-hidden rounded-tr-[6rem] md:rounded-tr-[4.5rem]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <Image
                    src={backSrc}
                    alt="Dr Derek Austin Alternative"
                    fill
                    sizes={ABOUT_PORTRAIT_SIZES}
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </FlipPreview>
          </div>
          <div className="ease-spring-soft border-site-border bg-site-surface relative mt-8 translate-y-12 rounded-tl-3xl border px-6 py-5 opacity-0 backdrop-blur-xl transition-all delay-300 duration-700 md:absolute md:right-0 md:-bottom-8 md:left-auto md:w-[65%] lg:right-36 lg:bottom-12 lg:left-auto lg:w-[60%] lg:px-10 lg:py-7 [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="scrollable-content text-site-foreground max-h-[45vh] overflow-y-auto overscroll-contain pr-2 text-lg leading-7 lg:text-xl lg:leading-9">
                {ABOUT_BIO_LONG.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
