import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionPreferenceProvider, {
  useMotionPreference,
} from "@/components/MotionPreferenceProvider"

function MotionPreferenceHarness() {
  const { shouldReduceMotion } = useMotionPreference()

  return <output>{String(shouldReduceMotion)}</output>
}

const renderMotionPreference = () =>
  render(
    <MotionPreferenceProvider>
      <MotionPreferenceHarness />
    </MotionPreferenceProvider>,
  )

describe("MotionPreferenceProvider", () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it("exposes the system preference without loading an animation runtime", () => {
    const { unmount } = renderMotionPreference()

    expect(screen.getByText("false")).toBeInTheDocument()
    expect(document.documentElement.dataset.motionPreference).toBeUndefined()

    unmount()
    expect(document.documentElement.dataset.motionPreference).toBeUndefined()
  })

  it("uses a stable system snapshot during server rendering", () => {
    const serverMarkup = renderToString(
      <MotionPreferenceProvider>
        <MotionPreferenceHarness />
      </MotionPreferenceProvider>,
    )

    expect(serverMarkup).toContain("false")
  })

  it("reflects a system reduced-motion preference", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    renderMotionPreference()

    expect(screen.getByText("true")).toBeInTheDocument()
  })

  it("rejects consumers outside the canonical provider", () => {
    expect(() => render(<MotionPreferenceHarness />)).toThrow(
      "Motion preference must be used within its provider.",
    )
  })
})
