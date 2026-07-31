import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RiveAnimation from "@/components/RiveAnimation"

const { riveConfiguration } = vi.hoisted(() => ({
  riveConfiguration: {
    onLoadError: undefined as (() => void) | undefined,
  },
}))

vi.mock("@rive-app/react-canvas-lite", () => ({
  Alignment: { Center: "center" },
  Fit: { Cover: "cover" },
  Layout: class MockLayout {},
  useRive: (configuration: { onLoadError: () => void }) => {
    riveConfiguration.onLoadError = configuration.onLoadError

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
  })

  it("layers the decorative animation between the background and content", () => {
    const { container } = render(<RiveAnimation />)

    expect(container.firstElementChild).toHaveClass("-z-10")
    expect(screen.getByLabelText("Rive animation")).toHaveClass(
      "pointer-events-none",
    )
  })

  it("keeps the fallback animation beneath the site content", () => {
    const container = document.createElement("div")
    render(<RiveAnimation />, { container })

    act(() => riveConfiguration.onLoadError?.())

    expect(container.querySelector("iframe")).toHaveClass("-z-10")
  })
})
