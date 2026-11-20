"use client"

import cx from "classix"
import { ReactNode } from "react"

type SectionHeadingProps = {
  children: ReactNode
  className?: string
}

export default function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-heading-entrance=""
      className={cx(
        "w-max origin-center transform-[perspective(62.5rem)_translate3d(5rem,0,-10rem)_rotateX(-70deg)_rotateY(35deg)_scale(0)] opacity-0 [transition:transform_900ms_cubic-bezier(0.51,0.92,0.24,1.15),opacity_450ms_ease-out] in-[.active]:transform-[perspective(62.5rem)_translate3d(0,0,0)_rotateX(0)_rotateY(0)_scale(1)] in-[.active]:opacity-100 motion-reduce:transform-none! motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  )
}
