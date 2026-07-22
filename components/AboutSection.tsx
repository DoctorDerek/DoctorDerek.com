import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import SectionHeading from "@/components/ui/SectionHeading"
import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"
import DerekAustin from "@/images/DerekAustin.png"
import DerekAustin2 from "@/images/DerekAustin2.jpg"
import DerekAustin3 from "@/images/DerekAustin3.jpg"

export default function AboutSection() {
  const { shouldReduceMotion } = useMotionPreference()
  const [flipCount, setFlipCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleMouseEnter = () => {
    if (shouldReduceMotion) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setFlipCount((prev) => prev + 1)
    }, 1500)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (shouldReduceMotion && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [shouldReduceMotion])

  const photos = [DerekAustin, DerekAustin2, DerekAustin3]

  const currentPhoto = photos[flipCount % 3]
  const nextPhoto = photos[(flipCount + 1) % 3]

  const frontSrc = flipCount % 2 === 0 ? currentPhoto : nextPhoto
  const backSrc = flipCount % 2 === 1 ? currentPhoto : nextPhoto

  return (
    <div className="h-full w-full pt-2 pb-10 md:pt-3 md:pb-16">
      <div className="mx-auto w-4/5 md:w-[90%] lg:w-[90%]">
        <div className="ease-spring-soft text-site-foreground -translate-x-12 py-2 opacity-0 drop-shadow-md transition-all duration-700 md:relative md:pt-2 md:pb-8 lg:pt-3 lg:pb-10 [.active_&]:translate-x-0 [.active_&]:opacity-100">
          <SectionHeading>
            <h2 className="text-5xl font-semibold min-[375px]:text-6xl md:text-8xl lg:text-9xl">
              About
            </h2>
          </SectionHeading>
        </div>
        <div className="relative pb-10 md:h-[60vh]">
          <div className="ease-spring-bouncy w-[65%] translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 md:w-1/2 lg:w-[45%] [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <button
              type="button"
              aria-label="Show next portrait of Dr. Derek Austin"
              className="perspective animate-float block w-full text-left"
              style={{ animationDelay: "0s", perspective: "1000px" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setFlipCount((c) => c + 1)}
            >
              <div
                className="relative w-full cursor-pointer"
                style={{
                  transform: `rotateY(${flipCount * 180}deg)`,
                  transition: shouldReduceMotion
                    ? "none"
                    : "transform 0.8s ease-out",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={photos[0]}
                  alt=""
                  className="pointer-events-none max-h-[40vh] w-full object-cover object-top opacity-0 md:max-h-[70vh]"
                  priority
                  aria-hidden="true"
                />

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
                    sizes="(max-width: 768px) 65vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-cover object-top"
                    quality={100}
                    priority
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
                    sizes="(max-width: 768px) 65vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-cover object-top"
                    quality={100}
                    priority
                  />
                </div>
              </div>
            </button>
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
