import Image from "next/image"
import SectionHeading from "@/components/ui/SectionHeading"
import { TESTIMONIALS, type Testimonial } from "@/constants/SITE_CONTENT"
import JohnDoe from "@/images/johndoe.png"

const Testimonials = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 top-3 z-10 xl:inset-x-auto xl:top-16 xl:right-20 xl:w-full">
        <div className="flex justify-end">
          <SectionHeading className="max-w-full">
            <h3 className="text-site-foreground rounded-tl-3xl rounded-br-3xl bg-[#89CFFD]/30 px-3 py-1 text-right text-2xl leading-none drop-shadow-md backdrop-blur-md xl:px-8 xl:py-4 xl:text-9xl">
              What People Say
            </h3>
          </SectionHeading>
        </div>
      </div>

      {TESTIMONIALS.map((item: Testimonial) => (
        <div key={item.name} className="slide">
          <div className="flex h-full w-full items-center justify-center px-4 py-5 xl:p-8">
            <div className="ease-spring-soft border-site-border-faint bg-site-surface text-site-foreground mx-auto mt-10 w-full max-w-4xl min-w-0 scale-95 rounded-2xl border p-6 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-700 xl:mt-24 xl:p-12 [.active_&]:scale-100 [.active_&]:opacity-100">
              <div className="mb-4 flex flex-wrap items-center xl:mb-8">
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
                <div className="flex min-w-0 flex-col wrap-break-word">
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
