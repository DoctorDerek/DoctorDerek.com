import Image from "next/image"
import IntroAnimation from "@/images/Intro-Animation.jpg"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"

export default function WorkExperienceSection() {

  return (
    <div className="relative flex h-screen flex-col items-center justify-center p-8">
      <Image
        src={IntroAnimation}
        alt="Work Experience Background"
        fill
        className="-z-10 object-cover"
        priority={false}
      />
      <h2 className="mb-12 text-7xl font-bold text-white drop-shadow-md">
        The Architect’s Evolution
      </h2>
      <div className="w-full max-w-4xl space-y-8">
        {ARCHITECT_EVOLUTION.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-tr-3xl border-t border-r border-b border-l-4 border-white/50 border-t-white/10 border-r-white/10 border-b-white/10 bg-white/10 p-6 text-white backdrop-blur-md md:flex-row md:items-center"
          >
            <span className="min-w-[200px] text-2xl font-bold text-white">
              {item.duration}
            </span>
            <span className="text-2xl text-white/90">
              {item.position} | {item.company}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
