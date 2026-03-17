import React from "react"
import Image from "next/image"
import classNames from "@/utils/classNames"
import codeIcon from "images/codeIcon.svg"

export default function WorkExpGrid({ ...clonedList }) {
  const getHalfNum = Math.floor(clonedList.length / 2)

  return clonedList.map(
    (
      item: {
        duration: string
        position: string
        company: string
      },
      index: number,
    ) => {
      return (
        <li
          className={classNames(
            "translate-y-12 pl-4 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100",
            (index === getHalfNum - 1 ||
              index === getHalfNum - 2 ||
              index === getHalfNum - 3) &&
              "mr-8 border-r-4",
            index === getHalfNum - 1 && "rounded-b-3xl border-b-4",
            (index < getHalfNum || index > getHalfNum + 3) &&
              "border-l-4 border-[#F38B57]",
            index === clonedList.length - 1 && "border-l-0",
            index === 2 && "relative",
          )}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
          key={`${item.duration} ${index}`}
        >
          <div className="relative flex flex-col">
            {!item.company.includes("placeholder") && (
              <Image
                src={codeIcon}
                className="absolute top-0 -left-8 h-6 w-6 bg-[#FFE366]"
                alt="code icon"
              />
            )}
            <p className="restorabold text-xl">{item.duration}</p>
            <p className="restorabold py-2 text-xl">{item.position}</p>
            <p
              className={classNames(
                item.company.includes("placeholder") ? "invisible" : "",
                "restorabold pb-2 text-lg",
              )}
            >
              {item.company}
            </p>
          </div>
          {index === 2 && (
            <div className="absolute top-0 -right-8 w-8 border-t-2 border-b-2 border-[#F38B57]"></div>
          )}
        </li>
      )
    },
  )
}
