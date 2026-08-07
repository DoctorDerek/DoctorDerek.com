import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionPreferenceProvider, {
  useMotionPreference,
} from "@/components/MotionPreferenceProvider"

const { domAnimationFeaturesLoaded, reducedMotionConfiguration } = vi.hoisted(
  () => ({
    domAnimationFeaturesLoaded: vi.fn(),
    reducedMotionConfiguration: vi.fn(),
  }),
)

vi.mock("@/utils/domAnimationFeatures", () => ({
  default: "dom-animation-features",
}))

vi.mock("motion/react", () => ({
  LazyMotion: ({
    children,
    features,
    strict,
  }: {
    children: React.ReactNode
    features: () => Promise<unknown>
    strict: boolean
  }) => {
    void features().then(domAnimationFeaturesLoaded)
    return <div data-motion-strict={strict}>{children}</div>
  },
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
    domAnimationFeaturesLoaded.mockClear()
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

  it("uses lazy strict animation features and the system preference", async () => {
    const { unmount } = renderMotionPreference()

    expect(screen.getByText("false")).toBeInTheDocument()
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("user")
    await vi.waitFor(() =>
      expect(domAnimationFeaturesLoaded).toHaveBeenLastCalledWith(
        "dom-animation-features",
      ),
    )
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
    expect(reducedMotionConfiguration).toHaveBeenLastCalledWith("user")
  })

  it("rejects consumers outside the canonical provider", () => {
    expect(() => render(<MotionPreferenceHarness />)).toThrow(
      "Motion preference must be used within its provider.",
    )
  })
})
