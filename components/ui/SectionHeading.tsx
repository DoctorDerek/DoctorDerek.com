"use client"

import { ReactNode } from "react"
import classNames from "@/utils/classNames"

type SectionHeadingProps = {
  children: ReactNode
  className?: string
}

export default function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div className={classNames("section-heading-entrance w-max", className)}>
      {children}
    </div>
  )
}
