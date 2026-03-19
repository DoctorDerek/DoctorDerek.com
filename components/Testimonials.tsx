import React from "react"
import Image from "next/image"
import JohnDoe from "@/images/johndoe.png"
import { TESTIMONIALS, type Testimonial } from "@/constants/SITE_CONTENT"
import { useKeenSlider } from "keen-slider/react"
import SectionHeading from "@/components/ui/SectionHeading"

const Testimonials = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
  })

  return (
    <div className="min-h-dvh py-20">
      <div className="flex h-full flex-col">
        {/* ========= MOBILE/TABLET SLIDER ======= */}
        <div className="mx-auto mt-10 w-[95%] translate-y-12 pt-2 opacity-0 transition-all delay-100 duration-700 ease-spring-soft md:mt-8 md:w-3/5 lg:hidden [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div ref={sliderRef} className="keen-slider hover:cursor-grab">
            {/* ======= PROJECT SLIDE ======= */}
            {TESTIMONIALS.map((item: Testimonial) => {
              return (
                <div
                  key={item.name}
                  className="keen-slider__slide grid transform-gpu grid-cols-1 px-4 md:space-x-0.5 xl:space-x-1"
                >
                  <div className="text-white">
                    <p className="leading-7 md:text-lg md:leading-8 lg:text-xl">
                      {item.comment}
                    </p>
                    <div className="mt-8 lg:mt-12">
                      <div className="flex">
                        <div className="mr-4">
                          <Image
                            src={JohnDoe}
                            alt="John Doe"
                            className="h-20 w-20 rounded-full object-cover lg:h-24 lg:w-24"
                          />
                        </div>
                        <div className="flex w-3/4 flex-col">
                          <h4 className="font-bold md:mt-auto md:pb-2">
                            -{item.name}
                          </h4>
                          <h4 className="md:mb-auto">{item.title}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ========= DESKTOP MASONRY GRID ======= */}
        <div className="mx-auto mt-10 hidden w-[95%] translate-y-12 pt-2 opacity-0 transition-all delay-100 duration-700 ease-spring-soft lg:block lg:w-[90%] xl:w-[80%] [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <div className="h-[65vh] w-full overflow-y-auto pr-4 pb-16">
            <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
              {TESTIMONIALS.map((item: Testimonial) => (
                <div
                  key={item.name}
                  className="mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-black/20 p-6 text-white backdrop-blur-md"
                >
                  <p className="leading-7 lg:text-lg">{item.comment}</p>
                  <div className="mt-8 flex items-center">
                    <div className="mr-4 shrink-0">
                      <Image
                        src={JohnDoe}
                        alt="John Doe"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold">-{item.name}</h4>
                      <h4 className="text-sm opacity-80">{item.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========= WHAT PEOPLE SAY ============ */}
        <div className="mt-auto translate-x-12 rounded-tl-[5rem] bg-[#89CFFD]/30 opacity-0 backdrop-blur-md transition-all delay-300 duration-700 ease-spring-soft [.active_&]:translate-x-0 [.active_&]:opacity-100">
          <div className="mx-auto flex w-5/6 justify-end px-2 py-5 md:px-0 md:py-12 lg:py-16">
            <SectionHeading>
              <h3 className="text-right text-7xl text-white drop-shadow-md lg:text-9xl">
                What People Say
              </h3>
            </SectionHeading>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
