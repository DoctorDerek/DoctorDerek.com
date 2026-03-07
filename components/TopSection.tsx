import Logo from "@/components/ui/Logo"
import Navbar from "./Navbar"
import ReactParallaxTilt from "react-parallax-tilt"

/** Helper function to join Tailwind CSS classNames. Filters out falsy values */
const classNames = (...args: string[]) => args.filter(Boolean).join(" ")

/** The `<TopSection>` has the logo with a parallax effect. */
export default function TopSection() {
  return (
    <div className="relative h-screen">
      <Navbar />
      <div className="flex h-screen items-center justify-center">
        <ReactParallaxTilt
          tiltMaxAngleX={37}
          tiltMaxAngleY={37}
          perspective={1000}
          glareMaxOpacity={0}
          // These classes are for a larger "hit box" for the parallax effect:
          className="flex h-[60vh] w-[60vw] items-center justify-center"
        >
          <Logo
            variant="alternative"
            className={classNames("object-fill")}
          />
        </ReactParallaxTilt>
      </div>
    </div>
  )
}
