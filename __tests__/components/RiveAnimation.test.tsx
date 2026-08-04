import { act, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RiveAnimation from "@/components/RiveAnimation"
import { RIVE_ASSET_URLS } from "@/constants/RIVE_ASSETS"

const { riveConfiguration, runtimeLoaderSetWasmUrl } = vi.hoisted(() => ({
  riveConfiguration: {
    onLoadError: undefined as (() => void) | undefined,
    onRiveReady: undefined as (() => void) | undefined,
  },
  runtimeLoaderSetWasmUrl: vi.fn(),
}))

vi.mock("@rive-app/react-canvas-lite", () => ({
  Alignment: { Center: "center" },
  Fit: { Cover: "cover" },
  Layout: class MockLayout {},
  RuntimeLoader: { setWasmUrl: runtimeLoaderSetWasmUrl },
  useRive: (configuration: {
    onLoadError: () => void
    onRiveReady: () => void
  }) => {
    riveConfiguration.onLoadError = configuration.onLoadError
    riveConfiguration.onRiveReady = configuration.onRiveReady

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
    riveConfiguration.onRiveReady = undefined
  })

  it("layers the decorative animation between the background and content", () => {
    const onRiveReady = vi.fn()
    const { container } = render(<RiveAnimation onRiveReady={onRiveReady} />)

    expect(container.firstElementChild).toHaveClass("-z-10")
    expect(screen.getByLabelText("Rive animation")).toHaveClass(
      "pointer-events-none",
    )
    expect(runtimeLoaderSetWasmUrl).toHaveBeenCalledWith(
      RIVE_ASSET_URLS.runtime,
    )

    act(() => riveConfiguration.onRiveReady?.())
    expect(onRiveReady).toHaveBeenCalledOnce()
  })

  it("keeps the fallback animation beneath the site content", () => {
    const onRiveReady = vi.fn()
    const container = document.createElement("div")
    render(<RiveAnimation onRiveReady={onRiveReady} />, { container })

    act(() => riveConfiguration.onLoadError?.())

    expect(container.querySelector("iframe")).toHaveClass("-z-10")
    expect(onRiveReady).toHaveBeenCalledOnce()
  })
})
