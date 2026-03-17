import { useState, useRef, useEffect } from "react"
import { ABOUT_BIO_LONG } from "@/constants/SITE_CONTENT"
import DerekAustin from "@/images/DerekAustin.png"
import DrDerekAustin from "@/images/DrDerekAustin.png"
import Image from "next/image"

export default function AboutSection() {
  const [flipCount, setFlipCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleMouseEnter = () => {
    setFlipCount((prev) => prev + 1)
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

  const photos = [DerekAustin, DrDerekAustin]

  const currentPhoto = photos[flipCount % 2]
  const nextPhoto = photos[(flipCount + 1) % 2]

  const frontSrc = flipCount % 2 === 0 ? currentPhoto : nextPhoto
  const backSrc = flipCount % 2 === 1 ? currentPhoto : nextPhoto

  return (
    <div className="h-screen w-full">
      <div className="mx-auto w-4/5 md:w-[90%] lg:w-3/4">
        <div className="-translate-x-12 py-4 text-white opacity-0 drop-shadow-md transition-all duration-700 ease-spring-soft md:relative md:py-8 lg:pt-14 lg:pb-10 [.active_&]:translate-x-0 [.active_&]:opacity-100">
          <h2 className="text-7xl md:text-8xl lg:text-9xl lg:font-semibold">
            About
          </h2>
        </div>
        <div className="relative h-[80vh] md:h-[70vh]">
          <div className="w-[65%] translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 ease-spring-bouncy md:w-1/2 lg:w-[45%] [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <div
              className="perspective animate-float"
              style={{ animationDelay: "0s", perspective: "1000px" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setFlipCount((c) => c + 1)}
            >
              <div
                className="relative w-full cursor-pointer"
                style={{
                  transform: `rotateY(${flipCount * 180}deg)`,
                  transition: "transform 0.8s ease-out",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={photos[0]}
                  alt=""
                  className="pointer-events-none max-h-[60vh] w-full object-cover object-top opacity-0 md:max-h-[70vh]"
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
            </div>
          </div>
          <div className="absolute -bottom-12 left-6 translate-y-12 rounded-tl-3xl border border-white/20 bg-black/40 px-6 py-5 opacity-0 backdrop-blur-xl transition-all delay-300 duration-700 ease-spring-soft md:right-0 md:-bottom-8 md:left-auto md:w-[55%] lg:right-36 lg:bottom-12 lg:left-auto lg:w-1/2 lg:px-10 lg:py-7 [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="fp-noscroll max-h-[30vh] overflow-y-auto pr-2 text-lg leading-7 text-white md:max-h-[35vh] lg:max-h-[40vh] lg:text-xl lg:leading-9">
                {ABOUT_BIO_LONG.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="rounded-2xl border border-[#F38B57]/20 bg-black/50 p-4 shadow-xl backdrop-blur-md">
                <p className="animate-pulse text-lg font-bold leading-tight text-[#F38B57] drop-shadow-md lg:text-xl">
                  But enough talk. Scroll down to play the WebGL game I built to
                  prove my stack. 👇🎮🦝
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
