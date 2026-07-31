import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { deferredClientFeature, reducedMotionPreference } = vi.hoisted(() => ({
  deferredClientFeature: { isReady: true },
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

vi.mock("@/hooks/useDeferredClientFeature", () => ({
  default: () => deferredClientFeature.isReady,
}))

describe("MotionAwareAmbience", () => {
  beforeEach(() => {
    deferredClientFeature.isReady = true
    reducedMotionPreference.value = false
  })

  it("loads the complete ambient experience after user intent", () => {
    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "true",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()

    fireEvent.pointerMove(window)

    expect(screen.getByText("Rive animation")).toBeInTheDocument()
  })

  it("waits for critical readiness after capturing early user intent", () => {
    deferredClientFeature.isReady = false

    const { rerender } = render(<MotionAwareAmbience />)
    fireEvent.pointerDown(window)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()

    deferredClientFeature.isReady = true
    rerender(<MotionAwareAmbience />)

    expect(screen.getByText("Rive animation")).toBeInTheDocument()
  })

  it("omits continuous visual ambience when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience />)
    fireEvent.keyDown(window, { key: "Tab" })

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
