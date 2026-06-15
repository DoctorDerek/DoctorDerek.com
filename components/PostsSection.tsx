import React from "react"
import Image from "next/image"
import { MediumPost } from "@/utils/medium"

export default function PostsSection({ posts }: { posts: MediumPost[] }) {
  return (
    <>
      {posts.map((post) => (
        <div key={post.link} className="slide">
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
