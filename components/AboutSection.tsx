"use client"

import Image from "next/image"
import { useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import FlipPreview from "@/components/ui/FlipPreview"
import SectionHeading from "@/components/ui/SectionHeading"
import {
  FLIP_ACTIVATION_ROTATION_DEGREES,
  PORTRAIT_CONTROL_ACCESSIBLE_NAMES,
} from "@/constants/INTERACTIONS"
import { ABOUT_PORTRAITS, PORTRAIT_IMAGE_SIZES } from "@/constants/PORTRAITS"
import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"

export default function AboutSection() {
  const { shouldReduceMotion } = useMotionPreference()
  const [flipCount, setFlipCount] = useState(0)

  const currentPortrait = ABOUT_PORTRAITS[flipCount % ABOUT_PORTRAITS.length]
  const nextPortrait = ABOUT_PORTRAITS[(flipCount + 1) % ABOUT_PORTRAITS.length]

  const frontPortrait = flipCount % 2 === 0 ? currentPortrait : nextPortrait
  const backPortrait = flipCount % 2 === 1 ? currentPortrait : nextPortrait

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
          <div
            data-about-portrait-layout
            className="w-[65%] max-w-[22rem] md:w-1/2 lg:w-[45%]"
          >
            <FlipPreview
              accessibleName={PORTRAIT_CONTROL_ACCESSIBLE_NAMES.about}
              containerClassName="block w-full text-left"
              className="w-full"
              onActivate={() =>
                setFlipCount((currentFlipCount) => currentFlipCount + 1)
              }
            >
              <div
                className="relative aspect-square w-full cursor-pointer"
                style={{
                  transform: `rotateY(${flipCount * FLIP_ACTIVATION_ROTATION_DEGREES}deg)`,
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
                    src={frontPortrait.src}
                    alt={frontPortrait.alt}
                    fill
                    sizes={PORTRAIT_IMAGE_SIZES.about}
                    className="object-cover"
                    style={{ objectPosition: frontPortrait.objectPosition }}
                  />
                </div>

                <div
                  className="absolute inset-0 overflow-hidden rounded-tr-[6rem] md:rounded-tr-[4.5rem]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: `rotateY(${FLIP_ACTIVATION_ROTATION_DEGREES}deg)`,
                  }}
                >
                  <Image
                    src={backPortrait.src}
                    alt={backPortrait.alt}
                    fill
                    sizes={PORTRAIT_IMAGE_SIZES.about}
                    className="object-cover"
                    style={{ objectPosition: backPortrait.objectPosition }}
                  />
                </div>
              </div>
            </FlipPreview>
          </div>
          <div className="ease-spring-soft border-site-border bg-site-surface relative mt-4 translate-y-12 rounded-tl-3xl border px-6 py-5 opacity-0 backdrop-blur-xl transition-all delay-300 duration-700 md:absolute md:right-0 md:-bottom-8 md:left-auto md:mt-8 md:w-[65%] lg:right-36 lg:bottom-12 lg:left-auto lg:w-[60%] lg:px-10 lg:py-7 [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="scrollable-content text-site-foreground max-h-[36dvh] overflow-y-auto overscroll-contain pr-2 text-lg leading-7 md:max-h-[45vh] lg:text-xl lg:leading-9">
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
