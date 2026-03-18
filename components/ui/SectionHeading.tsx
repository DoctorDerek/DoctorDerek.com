import { ReactNode } from "react"
import Tilt from "react-parallax-tilt"
import classNames from "@/utils/classNames"

type SectionHeadingProps = {
  children: ReactNode
  className?: string
}

export default function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <Tilt
      className={classNames("w-max cursor-pointer", className)}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      scale={1.02}
      transitionSpeed={1000}
    >
      {children}
    </Tilt>
  )
}
