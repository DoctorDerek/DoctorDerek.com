import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("next/dynamic", () => ({
  default: (loadComponent: () => Promise<unknown>) => {
    void loadComponent()
    return ({ onRiveComplete }: { onRiveComplete: () => void }) => (
      <button onClick={onRiveComplete}>Rive animation</button>
    )
  },
}))

vi.mock("@/components/RiveAnimation", () => ({
  default: () => null,
}))

vi.mock("@/components/GlobalBackground", () => ({
  default: ({
    shouldRenderAmbientMotion,
  }: {
    shouldRenderAmbientMotion: boolean
  }) => (
    <p data-ambient-motion={shouldRenderAmbientMotion}>Global background</p>
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

  it("reveals ambient motion only after Rive completes", () => {
    render(<MotionAwareAmbience shouldStartRive={true} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Rive animation" }))
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "true",
    )
  })

  it("waits for deferred readiness while preserving the background and cursor", () => {
    render(<MotionAwareAmbience shouldStartRive={false} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })

  it("omits continuous visual ambience when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience shouldStartRive={true} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
