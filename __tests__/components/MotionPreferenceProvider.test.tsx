import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionPreferenceProvider, {
  useMotionPreference,
  type MotionPreference,
} from "@/components/MotionPreferenceProvider"

const { reducedMotionConfiguration } = vi.hoisted(() => ({
  reducedMotionConfiguration: vi.fn(),
}))

vi.mock("motion/react", () => ({
  MotionConfig: ({
    children,
    reducedMotion,
  }: {
    children: React.ReactNode
    reducedMotion: string
  }) => {
    reducedMotionConfiguration(reducedMotion)
    return children
  },
}))

function MotionPreferenceHarness() {
  const { motionPreference, setMotionPreference, shouldReduceMotion } =
    useMotionPreference()

  return (
    <>
      <output>{`${motionPreference}:${shouldReduceMotion}`}</output>
      {(["system", "reduce", "full"] as MotionPreference[]).map(
        (preference) => (
          <button
            key={preference}
            type="button"
            onClick={() => setMotionPreference(preference)}
          >
            {preference}
          </button>
        ),
      )}
    </>
  )
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
    reducedMotionConfiguration.mockClear()
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

  it("uses the system preference by default", () => {
    const { unmount } = renderMotionPreference()

    expect(screen.getByText("system:false")).toBeInTheDocument()
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("user")
    expect(document.documentElement.dataset.motionPreference).toBe("system")

    unmount()
    expect(document.documentElement.dataset.motionPreference).toBeUndefined()
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

    expect(screen.getByText("system:true")).toBeInTheDocument()
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("user")
  })

  it("persists explicit reduced and full-motion overrides", () => {
    renderMotionPreference()

    fireEvent.click(screen.getByRole("button", { name: "reduce" }))
    expect(screen.getByText("reduce:true")).toBeInTheDocument()
    expect(window.localStorage.getItem("doctorderek-motion-preference")).toBe(
      "reduce",
    )
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("always")

    fireEvent.click(screen.getByRole("button", { name: "full" }))
    expect(screen.getByText("full:false")).toBeInTheDocument()
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("never")

    fireEvent.click(screen.getByRole("button", { name: "system" }))
    expect(screen.getByText("system:false")).toBeInTheDocument()
  })

  it("ignores an invalid stored preference", () => {
    window.localStorage.setItem("doctorderek-motion-preference", "unexpected")

    renderMotionPreference()

    expect(screen.getByText("system:false")).toBeInTheDocument()
  })

  it("rejects consumers outside the canonical provider", () => {
    expect(() => render(<MotionPreferenceHarness />)).toThrow(
      "Motion preference must be used within its provider.",
    )
  })
})
