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
    <div className="h-full w-full py-8 lg:overflow-hidden lg:py-20">
      <div className="normal-scroll-content flex h-full w-full flex-col items-center justify-start overflow-y-auto overscroll-contain px-4 pb-4 lg:flex-row lg:justify-center lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0">
        <div className="flex w-[95%] shrink-0 flex-col justify-center text-white md:w-4/5 lg:w-1/3 lg:pl-12 xl:pl-24">
          <div className="-translate-x-12 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-x-0 [.active_&]:opacity-100">
            <div className="flex flex-row items-end justify-between lg:flex-col lg:items-start lg:justify-start">
              <SectionHeading>
                <h2 className="text-5xl drop-shadow-md md:text-8xl lg:text-9xl">
                  Blog
                </h2>
              </SectionHeading>

              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 shadow-xl backdrop-blur-md md:p-6 lg:mt-8 lg:w-full lg:gap-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-bold text-white md:text-3xl lg:text-4xl">
                    <CountUp to={BLOG_METRICS.totalPosts} />
                  </p>
                  <p className="mt-1 text-[8px] font-bold tracking-wider text-white/80 uppercase md:text-xs">
                    Posts
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center border-x border-white/10 px-2 text-center">
                  <p className="text-lg font-bold whitespace-nowrap text-white md:text-3xl lg:text-4xl">
                    <CountUp to={BLOG_METRICS.totalWordsK} duration={2.5} />
                    k+
                  </p>
                  <p className="mt-1 text-[8px] font-bold tracking-wider text-white/80 uppercase md:text-xs">
                    Words
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-bold text-white md:text-3xl lg:text-4xl">
                    {BLOG_METRICS.yearStarted}
                  </p>
                  <p className="mt-1 text-[8px] font-bold tracking-wider text-white/80 uppercase md:text-xs">
                    Since
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-10">
              <h3 className="text-sm leading-snug font-bold text-white/90 md:text-xl lg:text-2xl">
                Tired of generic tech industry noise? Join{" "}
                <span className="text-white">
                  <CountUp to={BLOG_METRICS.emailSubscribers} />
                </span>{" "}
                insider subscribers and{" "}
                <span className="text-white">
                  <CountUp to={BLOG_METRICS.mediumFollowers} duration={2.5} />
                </span>{" "}
                followers reading my battle-tested systems analyses and brutal
                survival manuals.
              </h3>

              <div className="mt-4 grid w-full grid-cols-2 gap-2 lg:mt-6 lg:grid-cols-1 lg:gap-4 xl:grid-cols-2">
                <a
                  href="https://doctorderek.medium.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl bg-black/40 p-2 text-center text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-[1.02] hover:bg-black/60 active:scale-95 md:p-4 md:text-lg"
                >
                  <span className="sm:hidden">Subscribe on Medium</span>
                  <span className="hidden sm:inline">
                    Subscribe to my email newsletter by following me on Medium.
                  </span>
                </a>
                <a
                  href="https://doctorderek.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl border border-white/30 bg-white/20 p-2 text-center text-xs font-medium text-white backdrop-blur-md transition-all duration-300 ease-spring-bouncy hover:scale-105 hover:bg-white/30 active:scale-95 md:p-4 md:text-lg lg:rounded-tl-none lg:rounded-tr-2xl"
                >
                  <span className="sm:hidden">Read All My Posts</span>
                  <span className="hidden sm:inline">
                    Read All My Posts on Medium
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex w-[95%] shrink-0 flex-col justify-center lg:mt-0 lg:w-[60%] lg:px-8 xl:w-2/3">
          <div className="w-full">
            <div ref={sliderRef} className="keen-slider py-2 hover:cursor-grab">
              {posts.slice(0, 6).map((post, index) => (
                <div key={post.link} className="keen-slider__slide">
                  <div
                    className="h-full w-full translate-y-12 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100"
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mx-auto flex h-[32vh] min-h-[220px] w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-xl backdrop-blur-md transition-transform duration-300 ease-spring-bouncy hover:-translate-y-2 hover:scale-[1.02] md:h-[40vh] lg:h-[55vh]"
                    >
                      <div className="relative h-[45%] w-full shrink-0 border-b border-white/20 bg-[#1E1E1E]">
                        <p className="absolute top-2 left-3 z-10 rounded-tr-xl border border-white/20 bg-black/40 px-2 py-1 text-[10px] text-white backdrop-blur-md md:top-3 md:left-4 md:px-3 md:text-sm">
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
                      <div className="flex flex-1 flex-col p-3 lg:p-6">
                        <h4 className="mb-1 line-clamp-2 text-sm leading-tight font-bold text-white md:mb-2 md:text-lg lg:mb-3 lg:text-xl">
                          {post.title}
                        </h4>
                        <p className="mb-auto line-clamp-2 text-xs text-white/70 md:line-clamp-3 md:text-sm lg:text-base">
                          {post.description}
                        </p>
                        <p className="mt-2 text-[9px] font-bold tracking-wider text-white uppercase md:mt-4 md:text-xs lg:text-sm">
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
