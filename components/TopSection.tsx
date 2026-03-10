import Logo from "@/components/ui/Logo"
import Navbar from "./Navbar"

/** Helper function to join Tailwind CSS classNames. Filters out falsy values */
const classNames = (...args: string[]) => args.filter(Boolean).join(" ")

/** The `<TopSection>` has the logo. */
export default function TopSection() {
  return (
    <div className="relative h-screen">
      <Navbar />
      {/* 93vh offsets the 7vh Navbar on mobile to prevent double scrolling */}
      <div className="flex h-[93vh] md:h-screen items-center justify-center">
        <Logo
          className="w-48 h-16 md:w-96 md:h-32"
        />
      </div>
    </div>
  )
}
