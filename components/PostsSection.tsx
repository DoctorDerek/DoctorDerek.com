import Image from "next/image"
import { useKeenSlider } from "keen-slider/react"
import { MediumPost } from "@/utils/medium"

export default function PostsSection({ posts }: { posts: MediumPost[] }) {
  const [sliderRef] = useKeenSlider({
    loop: true,
  })

  return (
    <div className="h-screen">
      <div className="flex h-full flex-col">
        <div className="mx-auto h-4/5 w-[95%]">
          <div ref={sliderRef} className="keen-slider hover:cursor-grab">
            {posts.map((post) => (
              <div key={post.link} className="keen-slider__slide">
                <div className="ml-2">
                  <div className="mt-20 h-full w-11/12">
                    <div className="relative w-11/12">
                      <p className="absolute -top-3 left-4 rounded-tr-xl border border-white/20 bg-black/40 py-1 pr-3 pl-3 text-2xl text-white backdrop-blur-md">
                        Medium
                      </p>
                      {post.thumbnail && (
                        <div className="relative h-[40vh] w-full overflow-hidden rounded-tl-xl">
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
                      <p className="text-xl">{post.description}</p>
                      <p className="mt-4 text-white/70">
                        {new Date(post.pubDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
