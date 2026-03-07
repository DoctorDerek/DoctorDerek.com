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
                      <p className="absolute -top-3 left-4 rounded-tr-xl bg-black/40 backdrop-blur-md border border-white/20 py-1 pl-3 pr-3 text-2xl text-white">
                        Medium
                      </p>
                      {post.thumbnail && (
                        <div className="relative h-[40vh] w-full rounded-tl-xl overflow-hidden">
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="absolute -bottom-4 w-11/12 rounded-tr-xl bg-black/50 backdrop-blur-md border border-white/20 py-2 pl-3 pr-3 text-lg text-white">
                        {post.title}
                      </p>
                    </div>
                    <div className="w-11/12 bg-white/10 backdrop-blur-md border-x border-b border-white/20 pb-4 pl-4 pt-8 text-white rounded-br-xl">
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
