import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RiveAnimation from "@/components/RiveAnimation"
import { RIVE_ANIMATION_URL } from "@/constants/RIVE_ASSETS"

const { riveConfiguration } = vi.hoisted(() => ({
  riveConfiguration: {
    onLoadError: undefined as (() => void) | undefined,
    onLoop: undefined as (() => void) | undefined,
    onStop: undefined as (() => void) | undefined,
    src: undefined as string | undefined,
  },
}))

vi.mock("@rive-app/react-canvas-lite", () => ({
  Alignment: { Center: "center" },
  Fit: { Cover: "cover" },
  Layout: class MockLayout {},
  useRive: (configuration: {
    onLoadError: () => void
    onLoop: () => void
    onStop: () => void
    src: string
  }) => {
    riveConfiguration.onLoadError = configuration.onLoadError
    riveConfiguration.onLoop = configuration.onLoop
    riveConfiguration.onStop = configuration.onStop
    riveConfiguration.src = configuration.src

    return {
      RiveComponent: ({
        className,
      }: {
        className: string
        style: React.CSSProperties
      }) => <canvas aria-label="Rive animation" className={className} />,
    }
  },
}))

describe("RiveAnimation", () => {
  beforeEach(() => {
    riveConfiguration.onLoadError = undefined
    riveConfiguration.onLoop = undefined
    riveConfiguration.onStop = undefined
    riveConfiguration.src = undefined
  })

  it("layers the decorative animation between the background and content", () => {
    const onRiveComplete = vi.fn()
    const { container } = render(
      <RiveAnimation onRiveComplete={onRiveComplete} />,
    )

    expect(container.firstElementChild).toHaveClass("-z-10")
    expect(screen.getByLabelText("Rive animation")).toHaveClass(
      "pointer-events-none",
    )
    expect(riveConfiguration.src).toBe(RIVE_ANIMATION_URL)

    act(() => riveConfiguration.onLoop?.())
    act(() => riveConfiguration.onStop?.())
    expect(onRiveComplete).toHaveBeenCalledOnce()
  })

  it("keeps the fallback animation beneath the site content", () => {
    const onRiveComplete = vi.fn()
    const container = document.createElement("div")
    render(<RiveAnimation onRiveComplete={onRiveComplete} />, { container })

    act(() => riveConfiguration.onLoadError?.())

    expect(container.querySelector("iframe")).toHaveClass("-z-10")
    expect(onRiveComplete).toHaveBeenCalledOnce()
  })
})
