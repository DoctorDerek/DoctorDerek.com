import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import ParticleCanvas from "@/components/ParticleCanvas"

describe("ParticleCanvas", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("introduces deferred particles from below the viewport", () => {
    const arc = vi.fn()
    const cancelAnimationFrame = vi.fn()
    const context = {
      arc,
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      fillStyle: "",
    }

    vi.spyOn(Math, "random").mockReturnValue(0.5)
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    )
    vi.stubGlobal("innerWidth", 320)
    vi.stubGlobal("innerHeight", 568)
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 7),
    )
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)

    const { container, unmount } = render(<ParticleCanvas />)

    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveAttribute("width", "320")
    expect(canvas).toHaveAttribute("height", "568")
    expect(arc).toHaveBeenCalled()
    for (const [, particleY] of arc.mock.calls)
      expect(particleY).toBeGreaterThan(568)

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledWith(7)
  })
})
