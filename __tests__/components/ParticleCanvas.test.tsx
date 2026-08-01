import { fireEvent, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import ParticleCanvas from "@/components/ParticleCanvas"

const createCanvasContext = () => ({
  arc: vi.fn(),
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
})

const installCanvasRuntime = ({
  height,
  randomValue,
  width,
}: {
  height: number
  randomValue: number
  width: number
}) => {
  const context = createCanvasContext()
  const cancelAnimationFrame = vi.fn()
  let animationFrameCallback: FrameRequestCallback | undefined
  let animationFrameId = 0

  vi.spyOn(Math, "random").mockReturnValue(randomValue)
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  )
  vi.stubGlobal("innerWidth", width)
  vi.stubGlobal("innerHeight", height)
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      animationFrameCallback = callback
      animationFrameId += 1
      return animationFrameId
    }),
  )
  vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame)

  return {
    cancelAnimationFrame,
    context,
    runNextAnimationFrame: () => animationFrameCallback?.(0),
  }
}

describe("ParticleCanvas", () => {
  const onFirstFrameRendered = vi.fn()

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    onFirstFrameRendered.mockClear()
  })

  it("introduces deferred particles from below the viewport", () => {
    const { cancelAnimationFrame, context } = installCanvasRuntime({
      height: 568,
      randomValue: 0.5,
      width: 320,
    })

    const { container, unmount } = render(
      <ParticleCanvas onFirstFrameRendered={onFirstFrameRendered} />,
    )

    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveAttribute("width", "320")
    expect(canvas).toHaveAttribute("height", "568")
    expect(context.arc).toHaveBeenCalled()
    expect(onFirstFrameRendered).toHaveBeenCalledOnce()
    for (const [, particleY] of context.arc.mock.calls)
      expect(particleY).toBeGreaterThan(568)

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
  })

  it("repels, releases, recycles, and resizes particles through real events", () => {
    const { cancelAnimationFrame, context, runNextAnimationFrame } =
      installCanvasRuntime({
        height: 100,
        randomValue: 0.5,
        width: 150,
      })
    const random = vi.mocked(Math.random)
    const { container, unmount } = render(
      <ParticleCanvas onFirstFrameRendered={onFirstFrameRendered} />,
    )
    const canvas = container.querySelector("canvas")
    const initialRandomCallCount = random.mock.calls.length

    fireEvent.mouseMove(window, { clientX: 75, clientY: 112.5 })
    runNextAnimationFrame()
    fireEvent.mouseMove(window, { clientX: 76, clientY: 112 })
    runNextAnimationFrame()
    const repelledRadius = context.arc.mock.lastCall?.[2]
    expect(repelledRadius).toBeGreaterThan(3)

    fireEvent.mouseMove(window, { clientX: 1000, clientY: 1000 })
    runNextAnimationFrame()
    expect(context.arc.mock.lastCall?.[2]).toBeLessThan(repelledRadius ?? 0)

    fireEvent.mouseLeave(document)
    for (let frameIndex = 0; frameIndex < 130; frameIndex += 1)
      runNextAnimationFrame()
    expect(random.mock.calls.length).toBeGreaterThan(initialRandomCallCount)

    vi.stubGlobal("innerWidth", 300)
    vi.stubGlobal("innerHeight", 200)
    fireEvent(window, new Event("resize"))
    expect(canvas).toHaveAttribute("width", "300")
    expect(canvas).toHaveAttribute("height", "200")

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
  })

  it("renders the vivid particle variant", () => {
    const { context } = installCanvasRuntime({
      height: 100,
      randomValue: 0.1,
      width: 150,
    })

    render(<ParticleCanvas onFirstFrameRendered={onFirstFrameRendered} />)

    expect(context.fillStyle).toBe("rgba(0, 139, 139, 0.6)")
  })

  it("leaves unsupported canvases dormant", () => {
    const requestAnimationFrame = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame)

    render(<ParticleCanvas onFirstFrameRendered={onFirstFrameRendered} />)

    expect(requestAnimationFrame).not.toHaveBeenCalled()
    expect(onFirstFrameRendered).not.toHaveBeenCalled()
  })
})
