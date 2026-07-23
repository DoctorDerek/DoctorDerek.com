import { ReactNode } from "react"
import Tilt from "react-parallax-tilt"
import { useMotionPreference } from "@/components/MotionPreferenceProvider"
import classNames from "@/utils/classNames"

type SectionHeadingProps = {
  children: ReactNode
  className?: string
}

export default function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  const { shouldReduceMotion } = useMotionPreference()

  return (
    <div className={classNames("section-heading-entrance w-max", className)}>
      <Tilt
        className="w-max cursor-pointer"
        tiltEnable={!shouldReduceMotion}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1000}
      >
        {children}
      </Tilt>
    </div>
  )
}
