import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("next/dynamic", () => ({
  default: () => () => <p>Rive animation</p>,
}))

vi.mock("@/components/GlobalBackground", () => ({
  default: () => <p>Global background</p>,
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: reducedMotionPreference.value ? "reduce" : "full",
    setMotionPreference: vi.fn(),
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/components/ui/CustomCursor", () => ({
  default: () => <p>Custom cursor</p>,
}))

describe("MotionAwareAmbience", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("renders the complete ambient experience when motion is allowed", () => {
    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toBeInTheDocument()
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()
  })

  it("omits continuous cursor and Rive work when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toBeInTheDocument()
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
