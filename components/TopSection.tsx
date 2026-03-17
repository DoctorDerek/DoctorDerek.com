import Logo from "@/components/ui/Logo"
import Navbar from "./Navbar"

export default function TopSection() {
  return (
    <div className="relative h-dvh">
      <Navbar />
      {/* 93dvh offsets the 7dvh Navbar on mobile to prevent double scrolling */}
      <div className="flex h-[93dvh] items-center justify-center opacity-0 translate-y-12 scale-95 transition-all duration-700 ease-spring-bouncy [.active_&]:opacity-100 [.active_&]:translate-y-0 [.active_&]:scale-100 md:h-dvh">
        <Logo className="h-16 w-48 md:h-32 md:w-96" />
      </div>
    </div>
  )
}
