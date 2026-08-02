import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

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
  let idleCallback: IdleRequestCallback | undefined

  beforeEach(() => {
    idleCallback = undefined
    reducedMotionPreference.value = false
    vi.stubGlobal(
      "requestIdleCallback",
      vi.fn((callback: IdleRequestCallback) => {
        idleCallback = callback
        return 17
      }),
    )
    vi.stubGlobal("cancelIdleCallback", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads particles after Rive initialises and the browser becomes idle again", () => {
    const { unmount } = render(
      <MotionAwareAmbience shouldRenderDeferredMotion={true} />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.getByText("Rive animation")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Rive animation" }))
    expect(window.requestIdleCallback).toHaveBeenCalledOnce()
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "false",
    )

    act(() =>
      idleCallback?.({
        didTimeout: false,
        timeRemaining: () => 50,
      }),
    )
    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "true",
    )

    unmount()
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(17)
  })

  it("waits for deferred readiness while preserving the background and cursor", () => {
    render(<MotionAwareAmbience shouldRenderDeferredMotion={false} />)

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
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
      "data-particles-ready",
      "false",
    )
    expect(screen.queryByText("Custom cursor")).not.toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()
    expect(window.requestIdleCallback).not.toHaveBeenCalled()
  })
})
