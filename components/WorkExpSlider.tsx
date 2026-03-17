import React from "react"
import CodeIcon from "@/images/codeIcon.svg"

export default function WorkExpSlider({
  arry,
  startIndex = 0,
}: {
  arry: {
    duration: string
    company: string
  }[]
  startIndex?: number
}) {
  return arry.map((item, index: number) => {
    return (
      <li
        key={item.company}
        className={`relative translate-x-8 border-l-4 border-[#F38B57] pb-4 pl-4 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-x-0 [.active_&]:opacity-100 ${
          index === arry.length - 1 ? "rounded-bl-xl border-b-4" : ""
        }`}
        style={{ transitionDelay: `${(startIndex + index) * 150}ms` }}
      >
        <CodeIcon className="absolute top-0 -left-[14px] h-7 w-7" />
        <div className="">
          <p className="font-bold text-white/80">{item.duration}</p>
        </div>
        <div className="py-1">
          <p className="restorabold text-lg font-bold text-white">
            {item.company}
          </p>
        </div>
      </li>
    )
  })
}
