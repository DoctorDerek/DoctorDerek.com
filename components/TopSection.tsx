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
      <div className="flex h-[93vh] items-center justify-center md:h-screen">
        <Logo className="h-16 w-48 md:h-32 md:w-96" />
      </div>
    </div>
  )
}
