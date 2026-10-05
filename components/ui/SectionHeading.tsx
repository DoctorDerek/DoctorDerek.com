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
    <div className={cx("section-heading-entrance w-max", className)}>
      {children}
    </div>
  )
}
