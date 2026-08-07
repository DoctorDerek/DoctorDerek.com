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
    onAmbientMotionReady,
    shouldAnimateBackgroundColor,
    shouldRenderAmbientMotion,
  }: {
    onAmbientMotionReady?: () => void
    shouldAnimateBackgroundColor: boolean
    shouldRenderAmbientMotion: boolean
  }) => (
    <>
      <p
        data-ambient-motion={shouldRenderAmbientMotion}
        data-color-motion={shouldAnimateBackgroundColor}
      >
        Global background
      </p>
      {shouldRenderAmbientMotion && (
        <button onClick={onAmbientMotionReady}>Particles ready</button>
      )}
    </>
  ),
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/components/ui/DeferredCustomCursor", () => ({
  default: ({ shouldLoad }: { shouldLoad: boolean }) =>
    shouldLoad ? <p>Custom cursor</p> : null,
}))

describe("MotionAwareAmbience", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("reveals ambient motion only after Rive completes", () => {
    render(
      <MotionAwareAmbience
        shouldAnimateBackgroundColor
        shouldStartRive={true}
      />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-color-motion",
      "true",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Rive animation" }))
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "true",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Particles ready" }))
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
  })

  it("waits for deferred readiness while preserving the background and cursor", () => {
    render(
      <MotionAwareAmbience
        shouldAnimateBackgroundColor
        shouldStartRive={false}
      />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })

  it("omits continuous visual ambience when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(
      <MotionAwareAmbience
        shouldAnimateBackgroundColor
        shouldStartRive={true}
      />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-color-motion",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
  })
})
