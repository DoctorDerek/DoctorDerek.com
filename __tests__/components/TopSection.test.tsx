import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import TopSection from "@/components/TopSection"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

const { reducedMotionPreference, typewriter } = vi.hoisted(() => {
  const typewriterMethods = {
    deleteAll: vi.fn(),
    pauseFor: vi.fn(),
    start: vi.fn(),
    typeString: vi.fn(),
  }
  typewriterMethods.deleteAll.mockReturnValue(typewriterMethods)
  typewriterMethods.pauseFor.mockReturnValue(typewriterMethods)
  typewriterMethods.start.mockReturnValue(typewriterMethods)
  typewriterMethods.typeString.mockReturnValue(typewriterMethods)

  return {
    reducedMotionPreference: { value: false },
    typewriter: typewriterMethods,
  }
})

vi.mock("typewriter-effect", () => ({
  default: ({ onInit }: { onInit: (instance: typeof typewriter) => void }) => {
    onInit(typewriter)
    return <p>Animated introduction</p>
  },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: reducedMotionPreference.value ? "reduce" : "full",
    setMotionPreference: vi.fn(),
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/Navbar", () => ({
  default: () => null,
}))

describe("TopSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
    vi.clearAllMocks()
  })

  it("runs the complete introduction sequence when motion is allowed", () => {
    render(<TopSection />)

    expect(screen.getByText("Animated introduction")).toBeInTheDocument()
    for (const introductionSegment of INTRO_BIO_SHORT.split(" · ")) {
      expect(typewriter.typeString).toHaveBeenCalledWith(introductionSegment)
    }
    expect(typewriter.pauseFor).toHaveBeenCalledWith(2000)
    expect(typewriter.deleteAll).toHaveBeenCalled()
    expect(typewriter.start).toHaveBeenCalledOnce()
  })

  it("renders the complete introduction statically when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<TopSection />)

    expect(screen.getByText(INTRO_BIO_SHORT)).toBeInTheDocument()
    expect(screen.queryByText("Animated introduction")).not.toBeInTheDocument()
    expect(typewriter.start).not.toHaveBeenCalled()
  })
})
