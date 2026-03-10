import Image from "next/image"
import { useKeenSlider } from "keen-slider/react"
import { MediumPost } from "@/utils/medium"

export default function BlogSection({ posts }: { posts: MediumPost[] }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      spacing: 0,
    },
    breakpoints: {
      "(min-width: 1040px)": {
        slides: { perView: 3 },
      },
    },
  })

  return (
    <div className="h-screen">
      <div className="h-full md:flex md:pt-20 lg:pt-0">
        <div className="flex h-full flex-col text-white md:mx-auto md:w-1/2 lg:mx-0 lg:w-1/3">
          <div className="mx-auto w-4/5 pt-2 md:w-11/12 lg:mt-auto lg:w-4/5">
            <h2 className="text-7xl drop-shadow-md lg:text-9xl">Blog</h2>
            <p className="font-base rounded-xl bg-black/20 px-4 pt-6 pb-2 text-2xl leading-8 backdrop-blur-md">
              In addition to being a knowledgeable and experienced developer,
              Derek is an avid writer who has been contributing his thoughts to
              the industry since 2019.
            </p>
          </div>

          <div className="mx-auto mt-6 w-4/5 md:w-11/12 lg:mb-auto lg:w-4/5">
            <div className="w-[60%]">
              <a
                href="https://doctorderek.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-tr-2xl border border-white/30 bg-white/20 px-1 py-4 text-center text-lg font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                View All Posts
              </a>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold">
                Join 749+ email subscribers and 21,936+ followers.
              </h3>
              <a
                href="https://doctorderek.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-tr-md border border-white/20 bg-black/30 px-4 py-5 text-center font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/40"
              >
                Follow me on Medium to subscribe to my email newsletter
              </a>
            </div>
          </div>

          <div className="mx-auto mt-auto mb-8 w-4/5 text-white md:hidden">
            <div className="flex py-2">
              <p className="text-4xl">&darr;</p>
              <div className="mt-3">
                <p className="text-lg">6k followers on Medium</p>
              </div>

              {/* ========== Sign Up =========== */}
              <div className="rounded-tl-2xl py-6">
                <div className="">
                  {/* Line divider */}
                  <div className="mt-2 mb-7 w-4/5 border-t-2 border-[#cd7656]"></div>
                  <h3 className="pb-3 text-xl">
                    Join over 160 email subscribers
                  </h3>
                  <form className="flex">
                    <input
                      type="email"
                      name="email-address"
                      id="email-address"
                      autoComplete="email"
                      required
                      className="w-9/12 min-w-0 appearance-none border-0 bg-white px-3 py-5 text-base placeholder:text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                      placeholder="Your email address"
                    />
                    <div className="w-1/4">
                      <button
                        type="submit"
                        className="text-md flex w-full items-center justify-center rounded-tr-md border border-white/20 bg-black/30 py-5 font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/40"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ========== Read Posts with Arrow =========== */}
            <div className="hidden h-full md:block md:w-1/2 md:pl-4 lg:flex lg:w-2/3 lg:flex-col">
              <div className="mt-4 w-[95%] lg:mt-auto lg:mb-auto lg:w-4/5">
                <div className="lg:my-auto">
                  <div
                    ref={sliderRef}
                    className="keen-slider hover:cursor-grab"
                  >
                    {posts.map((post) => (
                      <div key={post.link} className="keen-slider__slide">
                        <div className="mt-20 h-full w-11/12">
                          <div className="relative w-11/12">
                            <p className="absolute -top-3 left-4 rounded-tr-xl border border-white/20 bg-black/40 py-1 pr-3 pl-3 text-2xl text-white backdrop-blur-md">
                              Medium
                            </p>
                            {post.thumbnail && (
                              <div className="relative h-[30vh] w-full overflow-hidden rounded-tl-xl">
                                <Image
                                  src={post.thumbnail}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <p className="absolute -bottom-4 w-11/12 rounded-tr-xl border border-white/20 bg-black/50 py-2 pr-3 pl-3 text-lg text-white backdrop-blur-md">
                              {post.title}
                            </p>
                          </div>
                          <div className="w-11/12 rounded-br-xl border-x border-b border-white/20 bg-white/10 pt-8 pb-4 pl-4 text-white backdrop-blur-md">
                            <p className="lg:text-xl">{post.description}</p>
                            <p className="mt-4 text-white/70">
                              {new Date(post.pubDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
