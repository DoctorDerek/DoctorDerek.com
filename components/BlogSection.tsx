import CountUp from "@/components/ui/CountUp"
import SectionHeading from "@/components/ui/SectionHeading"
import { BLOG_METRICS } from "@/constants/SITE_CONTENT"
import { MediumPost } from "@/utils/medium"
import Image from "next/image"

export default function BlogSection({ posts }: { posts: MediumPost[] }) {
  return (
    <>
      <div className="pointer-events-none absolute top-10 left-10 z-10 md:top-20 md:left-20">
        <SectionHeading>
          <h2 className="text-5xl text-white opacity-0 drop-shadow-md transition-all duration-700 ease-spring-soft md:text-8xl lg:text-9xl [.active_&]:opacity-100">
            Blog
          </h2>
        </SectionHeading>
      </div>

      <div className="slide">
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="mx-auto mt-16 w-full max-w-4xl translate-y-12 rounded-2xl border border-white/10 bg-black/40 p-6 text-white opacity-0 shadow-2xl backdrop-blur-md transition-all duration-700 ease-spring-soft md:mt-24 md:p-12 [.active_&]:translate-y-0 [.active_&]:opacity-100">
            <div className="mb-8 grid grid-cols-3 gap-2 md:gap-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-bold tabular-nums md:text-5xl">
                  <CountUp to={BLOG_METRICS.totalPosts} />
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider text-white/80 uppercase md:text-sm">
                  Posts
                </p>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-white/10 px-2 text-center">
                <p className="text-3xl font-bold whitespace-nowrap tabular-nums md:text-5xl">
                  <CountUp to={BLOG_METRICS.totalWordsK} duration={2.5} />
                  k+
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider text-white/80 uppercase md:text-sm">
                  Words
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-bold md:text-5xl">
                  {BLOG_METRICS.yearStarted}
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-wider text-white/80 uppercase md:text-sm">
                  Since
                </p>
              </div>
            </div>
            <h3 className="mb-8 text-center text-lg leading-snug font-bold text-white/90 md:text-2xl">
              Tired of generic tech industry noise? Join{" "}
              <span className="text-[#F38B57] tabular-nums">
                <CountUp to={BLOG_METRICS.emailSubscribers} />
              </span>{" "}
              insider subscribers and{" "}
              <span className="text-[#008EC1] tabular-nums">
                <CountUp to={BLOG_METRICS.mediumFollowers} duration={2.5} />
              </span>{" "}
              followers reading my battle-tested systems analyses and survival
              manuals for your SWE career.
            </h3>
            <div className="flex flex-col justify-center gap-4 md:flex-row">
              <a
                href="https://doctorderek.medium.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl bg-black/60 p-4 text-center text-sm font-bold text-white shadow-lg backdrop-blur-md transition-transform hover:scale-[1.02] active:scale-95 md:text-lg"
              >
                Subscribe on Medium
              </a>
              <a
                href="https://doctorderek.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl border border-white/30 bg-white/20 p-4 text-center text-sm font-medium text-white backdrop-blur-md transition-transform hover:scale-105 hover:bg-white/30 active:scale-95 md:text-lg"
              >
                Read All Posts
              </a>
            </div>
          </div>
        </div>
      </div>

      {posts.map((post) => (
        <div className="slide" key={post.link}>
          <div className="flex h-full w-full items-center justify-center p-4">
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto flex h-[65vh] w-full max-w-2xl scale-95 flex-col overflow-hidden rounded-2xl border border-white/20 bg-black/40 opacity-0 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-spring-bouncy hover:-translate-y-2 hover:scale-[1.02] [.active_&]:scale-100 [.active_&]:opacity-100"
            >
              <div className="relative h-1/2 w-full shrink-0 border-b border-white/20 bg-[#1E1E1E]">
                <p className="absolute top-3 left-4 z-10 rounded-tr-xl border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  Medium
                </p>
                {post.thumbnail && (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-90 transition-opacity duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h4 className="mb-3 line-clamp-3 text-xl leading-tight font-bold text-white md:text-2xl lg:text-3xl">
                  {post.title}
                </h4>
                <p className="mb-auto line-clamp-4 text-sm text-white/80 md:text-base lg:text-lg">
                  {post.description}
                </p>
                <p className="mt-4 text-xs font-bold tracking-wider text-white uppercase opacity-70 lg:text-sm">
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
    </>
  )
}
