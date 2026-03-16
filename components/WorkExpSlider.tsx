import React from "react"
import CodeIcon from "@/images/codeIcon.svg"

export default function WorkExpSlider({
  arry,
}: {
  /**
   * arry: array nested in workExperienceList object
   */
  arry: {
    /**
     * duration: string value of the timespan in a position and used as React keys
     */
    duration: string
    /**
     * company: string value of name of the company
     */
    company: string
  }[]
}) {
  return arry.map(
    (
      item,
      /**
       * index: number value used to determine whether to add css styles
       */
      index: number,
    ) => {
      return (
        <li
          key={item.company}
          className={`relative border-l-4 border-[#F38B57] pb-4 pl-4 ${
            index === arry.length - 1 ? "rounded-bl-xl border-b-4" : ""
          }`}
        >
          {/* Code icon */}
          <CodeIcon className="absolute top-0 -left-[14px] h-7 w-7" />
          <div className="">
            <p className="text-white/80 font-bold">{item.duration}</p>
          </div>
          <div className="py-1">
            <p className="restorabold text-lg text-white font-bold">{item.company}</p>
          </div>
        </li>
      )
    },
  )
}
