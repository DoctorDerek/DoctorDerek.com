import { act, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CustomCursor from "@/components/ui/CustomCursor"

const { cursorMediaQuery, motionValues } = vi.hoisted(() => ({
  cursorMediaQuery: {
    listeners: new Set<() => void>(),
    matches: false,
  },
  motionValues: {
    callCount: 0,
    x: { set: vi.fn() },
    y: { set: vi.fn() },
  },
}))

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      className,
      style,
    }: {
      className: string
      style: { opacity: number }
    }) => (
      <div
        className={className}
        data-opacity={style.opacity}
        data-testid="custom-cursor"
      />
    ),
  },
  useMotionValue: () => {
    const motionValue =
      motionValues.callCount % 2 === 0 ? motionValues.x : motionValues.y
    motionValues.callCount += 1
    return motionValue
  },
  useSpring: (motionValue: unknown) => motionValue,
}))

describe("CustomCursor", () => {
  beforeEach(() => {
    cursorMediaQuery.listeners.clear()
    cursorMediaQuery.matches = false
    motionValues.callCount = 0
    vi.clearAllMocks()
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: cursorMediaQuery.matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (
        _event: string,
        listener: EventListenerOrEventListenerObject,
      ) => cursorMediaQuery.listeners.add(listener as () => void),
      removeEventListener: (
        _event: string,
        listener: EventListenerOrEventListenerObject,
      ) => cursorMediaQuery.listeners.delete(listener as () => void),
      dispatchEvent: vi.fn(),
    }))
  })

  it("renders no custom cursor markup on the server", () => {
    expect(renderToString(<CustomCursor />)).toBe("")
  })

  it("does not mount desktop cursor behavior on touch-first layouts", () => {
    render(<CustomCursor />)

    expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument()
    fireEvent.mouseMove(window, { clientX: 50, clientY: 60 })
    expect(motionValues.x.set).not.toHaveBeenCalled()
    expect(motionValues.y.set).not.toHaveBeenCalled()
  })

  it("tracks pointer movement only after the desktop cursor query matches", () => {
    render(<CustomCursor />)

    act(() => {
      cursorMediaQuery.matches = true
      for (const listener of cursorMediaQuery.listeners) listener()
    })

    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0",
    )
    fireEvent.mouseMove(window, { clientX: 50, clientY: 60 })
    expect(motionValues.x.set).toHaveBeenCalledWith(34)
    expect(motionValues.y.set).toHaveBeenCalledWith(44)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0.8",
    )
    fireEvent.mouseLeave(document)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0",
    )
    fireEvent.mouseEnter(document)
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute(
      "data-opacity",
      "0.8",
    )
  })
})
