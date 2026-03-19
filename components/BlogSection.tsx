import Image from "next/image"
import { useKeenSlider } from "keen-slider/react"
import { MediumPost } from "@/utils/medium"
import SectionHeading from "@/components/ui/SectionHeading"
import CountUp from "@/components/ui/CountUp"
import { BLOG_METRICS } from "@/constants/SITE_CONTENT"

export default function BlogSection({ posts }: { posts: MediumPost[] }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 2, spacing: 24 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
  })

  return (
    <div className="min-h-dvh w-full py-20 lg:overflow-hidden">
      <div className="flex min-h-dvh w-full flex-col items-center justify-center px-4 pb-12 lg:flex-row lg:px-0 lg:pt-0 lg:pb-0">
        <div className="flex w-[95%] shrink-0 flex-col justify-center text-white md:w-4/5 lg:w-1/3 lg:pl-12 xl:pl-24">
          <div className="-translate-x-12 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-x-0 [.active_&]:opacity-100">
            <SectionHeading>
              <h2 className="text-6xl drop-shadow-md md:text-8xl lg:text-9xl">
                Blog
              </h2>
            </SectionHeading>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 shadow-xl backdrop-blur-md md:p-6 lg:mt-8 lg:gap-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold text-[#F38B57] md:text-3xl lg:text-4xl">
                  <CountUp to={BLOG_METRICS.totalPosts} />
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider uppercase opacity-80 md:text-xs">
                  Posts
                </p>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-white/10 px-2 text-center">
                <p className="text-2xl font-bold whitespace-nowrap text-[#F38B57] md:text-3xl lg:text-4xl">
                  <CountUp to={BLOG_METRICS.totalWordsK} duration={2.5} />
                  k+
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider uppercase opacity-80 md:text-xs">
                  Words
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold text-[#89CFFD] md:text-3xl lg:text-4xl">
                  {BLOG_METRICS.yearStarted}
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider uppercase opacity-80 md:text-xs">
                  Since
                </p>
              </div>
            </div>

            <div className="mt-8 lg:mt-10">
              <h3 className="text-xl leading-snug font-bold text-white/90 md:text-2xl">
                Tired of generic tech industry noise? Join{" "}
                <span className="text-[#F38B57]">
                  <CountUp to={BLOG_METRICS.emailSubscribers} />
                </span>{" "}
                insider subscribers and{" "}
                <span className="text-[#F38B57]">
                  <CountUp to={BLOG_METRICS.mediumFollowers} duration={2.5} />
                </span>{" "}
                followers reading my battle-tested systems analyses and brutal
                survival manuals.
              </h3>
              <a
                href="https://doctorderek.medium.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full rounded-xl bg-black/40 px-6 py-4 text-center text-base font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-[1.02] hover:bg-black/60 active:scale-95 md:text-lg"
              >
                Subscribe to my email newsletter by following me on Medium.
              </a>
              <div className="mt-4 w-2/3 md:w-1/2">
                <a
                  href="https://doctorderek.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-tr-2xl border border-white/30 bg-white/20 px-1 py-4 text-center text-base font-medium text-white backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-105 hover:bg-white/30 active:scale-95 md:text-lg"
                >
                  Read All My Posts on Medium
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex w-[95%] shrink-0 flex-col justify-center lg:mt-0 lg:w-[60%] lg:px-8 xl:w-2/3">
          <div className="w-full">
            <div ref={sliderRef} className="keen-slider py-4 hover:cursor-grab">
              {posts.map((post, index) => (
                <div key={post.link} className="keen-slider__slide">
                  <div
                    className="h-full w-full translate-y-12 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100"
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mx-auto flex h-[45vh] w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-xl backdrop-blur-md transition-transform duration-300 ease-spring-bouncy hover:-translate-y-2 hover:scale-[1.02] md:h-[40vh] lg:h-[55vh]"
                    >
                      <div className="relative h-[45%] w-full shrink-0 border-b border-white/20 bg-[#1E1E1E]">
                        <p className="absolute top-3 left-4 z-10 rounded-tr-xl border border-white/20 bg-black/40 px-3 py-1 text-sm text-white backdrop-blur-md">
                          Medium
                        </p>
                        {post.thumbnail && (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-90 transition-opacity duration-500 group-hover:scale-105 group-hover:opacity-100"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4 lg:p-6">
                        <h4 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-white lg:mb-3 lg:text-xl">
                          {post.title}
                        </h4>
                        <p className="mb-auto line-clamp-3 text-sm text-white/70 lg:text-base">
                          {post.description}
                        </p>
                        <p className="mt-4 text-xs font-bold tracking-wider text-[#F38B57] uppercase lg:text-sm">
                          {new Date(post.pubDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
