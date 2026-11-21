"use client"

import cx from "classix"
import Image from "next/image"
import { useState, type SyntheticEvent } from "react"
import FlipPreview from "@/components/ui/FlipPreview"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"
import SectionHeading from "@/components/ui/SectionHeading"
import SpringRotation from "@/components/ui/SpringRotation"
import {
  FLIP_ACTIVATION_ROTATION_DEGREES,
  PORTRAIT_CONTROL_ACCESSIBLE_NAMES,
} from "@/constants/INTERACTIONS"
import {
  CONTACT_COLLAGE_PORTRAITS,
  CONTACT_PORTRAIT,
  PORTRAIT_IMAGE_SIZES,
} from "@/constants/PORTRAITS"
import { CONTACT_BULLETS, CONTACT_CTA } from "@/constants/SITE_CONTENT"

function keepContactScroll(event: SyntheticEvent<HTMLDivElement>) {
  if (event.currentTarget.scrollHeight > event.currentTarget.clientHeight)
    event.stopPropagation()
}

export default function ContactSection() {
  const [flipCount, setFlipCount] = useState(0)
  const isFlipped = flipCount % 2 === 1

  return (
    <div className="contact-fit:h-dvh contact-fit:min-h-0 contact-fit:pt-[max(--spacing(7),env(safe-area-inset-top))] contact-fit:pb-[max(--spacing(6),env(safe-area-inset-bottom))] flex min-h-full w-full py-10 md:py-20">
      <div className="contact-fit:h-full contact-fit:min-h-0 contact-fit:justify-center contact-fit:gap-4 my-auto flex w-full flex-col md:flex-row md:items-stretch">
        <div className="contact-fit:flex contact-fit:w-[90%] contact-fit:shrink-0 contact-fit:items-center contact-fit:justify-between contact-fit:gap-4 mx-auto w-[85%] md:flex md:w-1/2 md:flex-col md:pl-8 lg:w-[45%] lg:justify-start lg:pl-20">
          <div className="py-2 md:mt-16 md:mb-2 lg:mb-0 lg:py-0">
            <SectionHeading>
              <h2
                id="contact-title"
                className="text-site-foreground contact-fit:text-[clamp(2.25rem,11vw,5rem)] text-6xl drop-shadow-lg md:text-8xl lg:pt-8 lg:pb-14 lg:text-9xl"
              >
                Contact
              </h2>
            </SectionHeading>
          </div>

          <div className="ease-spring-bouncy contact-fit:mx-0 contact-fit:w-[min(21vw,14dvh,7rem)] mx-auto w-1/2 translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 md:mx-0 md:h-1/2 md:w-full [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <FlipPreview
              accessibleName={PORTRAIT_CONTROL_ACCESSIBLE_NAMES.contact}
              containerClassName="animate-float h-full w-full [animation-delay:1s]"
              className="w-full"
              isPressed={isFlipped}
              onActivate={() =>
                setFlipCount((currentFlipCount) => currentFlipCount + 1)
              }
            >
              <SpringRotation
                className="wrapper relative aspect-square w-full max-w-[488px]"
                rotationDegrees={flipCount * FLIP_ACTIVATION_ROTATION_DEGREES}
              >
                <div className="front absolute inset-0 h-full w-full backface-hidden">
                  <Image
                    src={CONTACT_PORTRAIT.src}
                    alt={CONTACT_PORTRAIT.alt}
                    sizes={PORTRAIT_IMAGE_SIZES.contactFull}
                    className={cx(
                      "h-full w-full object-cover",
                      CONTACT_PORTRAIT.positionClassName,
                    )}
                  />
                </div>
                <div className="back absolute inset-0 h-full w-full transform-[rotateY(180deg)] backface-hidden">
                  <div
                    aria-hidden="true"
                    className="contact-portrait-mosaic bg-site-surface-deep grid h-full w-full grid-cols-2 grid-rows-[3fr_2fr] gap-0.5 overflow-hidden"
                  >
                    {CONTACT_COLLAGE_PORTRAITS.map((portrait) => (
                      <div
                        key={portrait.sourceFilename}
                        className={cx(
                          "relative min-h-0 min-w-0 overflow-hidden",
                          portrait.layoutClassName,
                        )}
                      >
                        <Image
                          src={portrait.src}
                          alt=""
                          fill
                          sizes={portrait.sizes}
                          className={cx(
                            "object-cover",
                            portrait.positionClassName,
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </SpringRotation>
            </FlipPreview>
          </div>
        </div>

        <div className="ease-spring-soft contact-fit:mt-0 contact-fit:min-h-0 mx-auto mt-4 flex w-full translate-y-12 flex-col opacity-0 transition-all delay-300 duration-700 md:mt-0 md:w-1/2 md:pl-8 lg:w-[55%] [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div className="contact-fit:mt-0 contact-fit:flex contact-fit:min-h-0 contact-fit:flex-col contact-fit:gap-4 mx-auto mt-4 w-[90%] md:ml-0 md:w-11/12 lg:mr-0 lg:ml-auto lg:w-11/12 lg:pl-14">
            <div
              role="region"
              aria-labelledby="contact-title"
              tabIndex={0}
              onWheel={keepContactScroll}
              onTouchMove={keepContactScroll}
              onKeyDown={(event) => {
                if (
                  !event.altKey &&
                  !event.ctrlKey &&
                  !event.metaKey &&
                  [
                    "ArrowUp",
                    "ArrowDown",
                    "PageUp",
                    "PageDown",
                    "Home",
                    "End",
                    " ",
                  ].includes(event.key)
                )
                  keepContactScroll(event)
              }}
              className="border-site-border-faint bg-site-surface text-site-foreground contact-fit:min-h-0 contact-fit:space-y-2 contact-fit:overflow-y-auto contact-fit:overscroll-contain contact-fit:p-4 contact-fit:text-base contact-fit:leading-normal space-y-4 rounded-xl border px-5 py-6 text-lg leading-7 shadow-xl backdrop-blur-md md:px-8 md:text-xl lg:pr-12 lg:text-2xl lg:leading-9"
            >
              {CONTACT_BULLETS.map((bullet) => (
                <p key={bullet} className="flex">
                  <span className="mr-3 text-[#F38B57]">★</span>
                  <span>{bullet}</span>
                </p>
              ))}
            </div>
            <GlobalEmailCTA className="ease-spring-bouncy contact-fit:mt-0 contact-fit:shrink-0 contact-fit:py-3 mt-8 inline-block w-full rounded-tr-3xl bg-[#F38B57] px-8 py-5 text-center text-xl font-bold text-white shadow-xl transition-all duration-300 [--site-focus:var(--site-focus-contrast)] hover:scale-[1.02] hover:bg-[#ff9c6a] active:scale-95 md:w-max md:px-12 md:py-6 md:text-2xl">
              {CONTACT_CTA}
            </GlobalEmailCTA>
          </div>
        </div>
      </div>
    </div>
  )
}
