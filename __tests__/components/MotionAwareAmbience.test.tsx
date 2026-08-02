import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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
  default: ({
    onParticleFirstFrameRendered,
    shouldRenderParticles,
  }: {
    onParticleFirstFrameRendered: () => void
    shouldRenderParticles: boolean
  }) => (
    <>
      <p data-particles-ready={shouldRenderParticles}>Global background</p>
      {shouldRenderParticles && (
        <button onClick={onParticleFirstFrameRendered}>
          Render particle frame
        </button>
      )}
    </>
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

  it("loads Rive only after particles render and the browser becomes idle again", () => {
    const { unmount } = render(
      <MotionAwareAmbience shouldRenderDeferredMotion={true} />,
    )

    expect(screen.getByText("Global background")).toHaveAttribute(
      "data-particles-ready",
      "true",
    )
    expect(screen.getByText("Custom cursor")).toBeInTheDocument()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole("button", { name: "Render particle frame" }),
    )
    expect(window.requestIdleCallback).toHaveBeenCalledOnce()
    expect(screen.queryByText("Rive animation")).not.toBeInTheDocument()

    act(() =>
      idleCallback?.({
        didTimeout: false,
        timeRemaining: () => 50,
      }),
    )
    expect(screen.getByText("Rive animation")).toBeInTheDocument()

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
