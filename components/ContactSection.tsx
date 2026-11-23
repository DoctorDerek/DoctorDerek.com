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
    <div className="flex h-dvh w-full pt-[max(--spacing(7),env(safe-area-inset-top))] pb-[max(--spacing(6),env(safe-area-inset-bottom))] xl:py-8">
      <div className="my-auto flex h-full min-h-0 w-full flex-col justify-center gap-4 xl:flex-row xl:items-center xl:gap-0">
        <div className="mx-auto flex w-[90%] shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 xl:w-[45%] xl:flex-col xl:flex-nowrap xl:items-stretch xl:justify-start xl:gap-0 xl:pl-20">
          <div className="py-2 xl:mt-16 xl:py-0">
            <SectionHeading>
              <h2
                id="contact-title"
                className="text-site-foreground text-4xl drop-shadow-lg xl:pt-8 xl:pb-14 xl:text-9xl"
              >
                Contact
              </h2>
            </SectionHeading>
          </div>

          <div className="ease-spring-bouncy w-1/4 max-w-28 shrink-0 translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 xl:h-1/2 xl:w-full xl:max-w-none [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
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

        <div className="ease-spring-soft mx-auto flex min-h-0 w-full translate-y-12 flex-col opacity-0 transition-all delay-300 duration-700 xl:max-h-full xl:w-[55%] xl:pl-8 [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div className="mx-auto flex min-h-0 w-[90%] flex-col gap-4 xl:mr-0 xl:ml-auto xl:w-11/12 xl:gap-8 xl:pl-14">
            <div
              role="region"
              aria-labelledby="contact-title"
              tabIndex={0}
              onWheel={keepContactScroll}
              onTouchMove={keepContactScroll}
              onKeyDownCapture={(event) => {
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
              className="border-site-border-faint bg-site-surface text-site-foreground min-h-0 space-y-2 overflow-y-auto overscroll-contain rounded-xl border p-4 text-base leading-normal shadow-xl backdrop-blur-md xl:space-y-4 xl:py-6 xl:pr-12 xl:pl-8 xl:text-2xl xl:leading-9"
            >
              {CONTACT_BULLETS.map((bullet) => (
                <p key={bullet} className="flex">
                  <span className="mr-3 text-[#F38B57]">★</span>
                  <span>{bullet}</span>
                </p>
              ))}
            </div>
            <GlobalEmailCTA className="ease-spring-bouncy inline-block w-full shrink-0 rounded-tr-3xl bg-[#F38B57] px-4 py-3 text-center text-xl font-bold text-white shadow-xl transition-all duration-300 [--site-focus:var(--site-focus-contrast)] hover:scale-[1.02] hover:bg-[#ff9c6a] active:scale-95 xl:w-max xl:self-start xl:px-12 xl:py-6 xl:text-2xl">
              {CONTACT_CTA}
            </GlobalEmailCTA>
          </div>
        </div>
      </div>
    </div>
  )
}
