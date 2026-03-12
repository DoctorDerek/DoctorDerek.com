import React from "react"
import Image from "next/image"
import JohnDoe from "@/images/johndoe.png"
import { TESTIMONIALS, type Testimonial } from "@/constants/SITE_CONTENT"
import { useKeenSlider } from "keen-slider/react"

const Testimonials = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
  })

  return (
    <div className="h-screen">
      <div className="flex h-full flex-col">
        <div className="mx-auto mt-10 w-[95%] pt-2 md:mt-8 md:w-3/5 lg:mt-20 lg:w-[40%]">
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
                            className="object-fit h-20 w-20 lg:h-24 lg:w-24"
                          />
                        </div>
                        <div className="flex w-3/4 flex-col">
                          <h4 className="md:mt-auto md:pb-2">-{item.name}</h4>
                          <h4 className="md:mb-auto">{item.position}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ========= WHAT PEOPLE SAY ============ */}
        <div className="mt-auto rounded-tl-[5rem] bg-[#89CFFD]">
          <div className="mx-auto w-5/6 px-2 py-5 md:px-0 md:py-12 lg:py-16">
            <h3 className="text-right text-7xl lg:text-9xl">What People Say</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
