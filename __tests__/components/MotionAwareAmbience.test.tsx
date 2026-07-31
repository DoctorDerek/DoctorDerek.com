import { render, screen } from "@testing-library/react"
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
  default: () => <p>Global background</p>,
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

  it("renders the complete ambient experience when motion is allowed", () => {
    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toBeInTheDocument()
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()
  })

  it("defers Rive while preserving the immediate background and cursor", () => {
    deferredClientFeature.isReady = false

    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toBeInTheDocument()
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })

  it("omits continuous cursor and Rive work when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience />)

    expect(screen.getByText("Global background")).toBeInTheDocument()
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
