import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

const FIRST_IDLE_CALLBACK_ID = 17
const SECOND_IDLE_CALLBACK_ID = 18

vi.mock("next/dynamic", () => ({
  default: (loadComponent: () => Promise<unknown>) => {
    void loadComponent()
    return ({ onRiveReady }: { onRiveReady: () => void }) => (
      <button onClick={onRiveReady}>Rive animation</button>
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
  let idleCallbacks: IdleRequestCallback[]
  let nextIdleCallbackId: number

  beforeEach(() => {
    idleCallbacks = []
    nextIdleCallbackId = FIRST_IDLE_CALLBACK_ID
    reducedMotionPreference.value = false
    vi.stubGlobal(
      "requestIdleCallback",
      vi.fn((callback: IdleRequestCallback) => {
        idleCallbacks.push(callback)
        const idleCallbackId = nextIdleCallbackId
        nextIdleCallbackId += 1
        return idleCallbackId
      }),
    )
    vi.stubGlobal("cancelIdleCallback", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads Rive and particles in separate idle phases", () => {
    const { unmount } = render(
      <MotionAwareAmbience shouldRenderDeferredMotion={true} />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()

    act(() =>
      idleCallbacks.shift()?.({
        didTimeout: false,
        timeRemaining: () => 50,
      }),
    )
    expect(screen.getByText("Rive animation")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Rive animation" }))
    expect(window.requestIdleCallback).toHaveBeenCalledTimes(2)
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )

    act(() =>
      idleCallbacks.shift()?.({
        didTimeout: false,
        timeRemaining: () => 50,
      }),
    )
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "true",
    )

    unmount()
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(
      FIRST_IDLE_CALLBACK_ID,
    )
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(
      SECOND_IDLE_CALLBACK_ID,
    )
  })

  it("waits for deferred readiness while preserving the background and cursor", () => {
    render(<MotionAwareAmbience shouldRenderDeferredMotion={false} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
    expect(window.requestIdleCallback).not.toHaveBeenCalled()
  })

  it("omits continuous visual ambience when motion is reduced", () => {
    reducedMotionPreference.value = true
    render(<MotionAwareAmbience shouldRenderDeferredMotion={true} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-ambient-motion",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
    expect(window.requestIdleCallback).not.toHaveBeenCalled()
  })
})
