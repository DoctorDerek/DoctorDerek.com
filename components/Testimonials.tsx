import Image from "next/image"
import JohnDoe from "@/images/johndoe.png"
import { TESTIMONIALS, type Testimonial } from "@/constants/SITE_CONTENT"
import SectionHeading from "@/components/ui/SectionHeading"

const Testimonials = () => {
  return (
    <>
      <div className="pointer-events-none absolute top-10 right-10 z-10 w-full md:right-20 lg:top-16">
        <div className="flex justify-end opacity-0 transition-all delay-300 duration-700 ease-spring-soft [.active_&]:opacity-100">
          <SectionHeading>
            <h3 className="rounded-tl-3xl rounded-br-3xl bg-[#89CFFD]/30 px-8 py-4 text-right text-5xl text-white drop-shadow-md backdrop-blur-md md:text-7xl lg:text-9xl">
              What People Say
            </h3>
          </SectionHeading>
        </div>
      </div>

      {TESTIMONIALS.map((item: Testimonial) => (
        <div key={item.name} className="slide">
          <div className="flex h-full w-full items-center justify-center p-4 py-20 md:p-8">
            <div className="mx-auto mt-16 w-full max-w-4xl scale-95 rounded-2xl border border-white/10 bg-black/40 p-6 text-white opacity-0 shadow-2xl backdrop-blur-md transition-all duration-700 ease-spring-soft md:mt-24 md:p-12 [.active_&]:scale-100 [.active_&]:opacity-100">
              <div className="mb-8 flex items-center">
                <div className="mr-6 shrink-0">
                  <Image
                    src={item.image || JohnDoe}
                    alt={item.name}
                    placeholder="blur"
                    width={96}
                    height={96}
                    className="h-16 w-16 rounded-full object-cover shadow-lg md:h-24 md:w-24"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-bold md:text-2xl">{item.name}</h4>
                  <h4 className="text-sm opacity-80 md:text-base">
                    {item.title}
                  </h4>
                </div>
              </div>
              <div className="scrollable-content max-h-[40vh] space-y-4 overflow-y-auto overscroll-contain pr-2 text-sm leading-relaxed md:text-lg md:leading-8 lg:text-xl lg:leading-9">
                {item.comment.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Testimonials
