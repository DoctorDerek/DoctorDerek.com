import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("next/dynamic", () => ({
  default: (loadComponent: () => Promise<unknown>) => {
    void loadComponent()
    return () => <p>Rive animation</p>
  },
}))

vi.mock("@/components/RiveAnimation", () => ({
  default: () => null,
}))

vi.mock("@/components/GlobalBackground", () => ({
  default: ({ shouldRenderParticles }: { shouldRenderParticles: boolean }) => (
    <p data-particles-ready={shouldRenderParticles}>Global background</p>
  ),
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
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

  it("renders the complete ambient experience when enhancements are ready", () => {
    render(<MotionAwareAmbience shouldRenderDeferredMotion={true} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "true",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()
  })

  it("waits for deferred readiness while preserving the background and cursor", () => {
    render(<MotionAwareAmbience shouldRenderDeferredMotion={false} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })

  it("omits continuous visual ambience when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience shouldRenderDeferredMotion={true} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
