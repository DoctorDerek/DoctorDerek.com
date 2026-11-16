import Module from "node:module"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ClientShell from "@/components/ClientShell"
import type {
  FullPageApi,
  FullPageSection,
  MapacheFullPageProps,
} from "@/types/MapacheFullPageProps"

const fixture = vi.hoisted(() => ({
  props: null as MapacheFullPageProps | null,
  api: null as FullPageApi | null,
  toast: vi.fn(),
}))

vi.mock("@fullpage/react-fullpage", () => {
  const Fullpage = (props: MapacheFullPageProps) => {
    fixture.props = props
    return props.render!({
      fullpageApi: fixture.api!,
      state: {
        initialized: true,
        sectionCount: 3,
        slideCount: 0,
        destination: null,
        direction: null,
        lastEvent: null,
      },
    })
  }
  return {
    default: Object.assign(Fullpage, {
      Wrapper: ({ children }: { children: ReactNode }) => (
        <main>{children}</main>
      ),
    }),
  }
})

vi.mock("@/components/TopSection", () => ({
  default: ({
    onTypewriterStarted,
    shouldStartTypewriter,
  }: {
    onTypewriterStarted: () => void
    shouldStartTypewriter: boolean
  }) => (
    <button data-ready={shouldStartTypewriter} onClick={onTypewriterStarted}>
      Start intro animation
    </button>
  ),
}))

vi.mock("@/components/MotionAwareAmbience", () => ({
  default: ({
    shouldAnimateBackgroundColor,
    shouldStartRive,
  }: {
    shouldAnimateBackgroundColor: boolean
    shouldStartRive: boolean
  }) => (
    <output
      data-color={shouldAnimateBackgroundColor}
      data-rive={shouldStartRive}
    >
      Ambience readiness
    </output>
  ),
}))

vi.mock("@/components/EndOfSiteCelebration", () => ({
  default: ({
    isConfettiActive,
    onConfettiComplete,
  }: {
    isConfettiActive: boolean
    onConfettiComplete: () => void
  }) => (
    <button disabled={!isConfettiActive} onClick={onConfettiComplete}>
      Complete celebration
    </button>
  ),
}))

vi.mock("react-hot-toast", () => ({ toast: fixture.toast }))

function createSection(anchor: string, index: number): FullPageSection {
  return {
    anchor,
    index,
    item: document.createElement("section"),
    isFirst: index === 0,
    isLast: anchor === "contact",
  }
}

function createFullPageApi(section: FullPageSection): FullPageApi {
  return {
    getActiveSection: () => section,
    getActiveSlide: () => section,
    getScrollX: () => 0,
    getScrollY: () => 0,
    moveSectionUp: vi.fn(),
    moveSectionDown: vi.fn(),
    moveTo: vi.fn(),
    silentMoveTo: vi.fn(),
    moveSlideRight: vi.fn(),
    moveSlideLeft: vi.fn(),
    setAutoScrolling: vi.fn(),
    setFitToSection: vi.fn(),
    fitToSection: vi.fn(),
    setLockAnchors: vi.fn(),
    setAllowScrolling: vi.fn(),
    setKeyboardScrolling: vi.fn(),
    setRecordHistory: vi.fn(),
    setScrollingSpeed: vi.fn(),
    destroy: vi.fn(),
    reBuild: vi.fn(),
    setResponsive: vi.fn(),
  }
}

function renderShell() {
  return render(
    <ClientShell
      sections={[
        { anchor: "intro", content: <h2>Introduction content</h2> },
        { anchor: "contact", content: <h2>Contact content</h2> },
      ]}
    />,
  )
}

describe("client shell navigation integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(window.matchMedia).mockImplementation((media) => ({
      matches: false,
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    fixture.api = createFullPageApi(createSection("contact", 2))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("renders passed sections, next-section links and the existing deferred startup boundary", () => {
    renderShell()
    expect(fixture.props?.anchors).toEqual(["home", "intro", "contact"])
    expect(screen.getByRole("main").children).toHaveLength(3)
    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["#intro", "#contact"])
    expect(screen.getByRole("main").firstElementChild).toHaveClass(
      "fp-noscroll",
    )
    expect(screen.getByText("Ambience readiness")).toHaveAttribute(
      "data-rive",
      "false",
    )
    expect(screen.getByText("Ambience readiness")).toHaveAttribute(
      "data-color",
      "false",
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Start intro animation" }),
    )
    expect(screen.getByText("Ambience readiness")).toHaveAttribute(
      "data-rive",
      "false",
    )
  })

  it("selects destination effects and ends a contact visit when leaving", async () => {
    renderShell()
    const home = createSection("home", 0)
    const contact = createSection("contact", 2)
    act(() => fixture.props!.onLeave!(home, createSection("about", 1), "down"))
    expect(fixture.props?.cinematicOptions?.effect).toBe("chromatic")
    act(() =>
      fixture.props!.onLeave!(home, createSection("unknown", 1), "down"),
    )
    expect(fixture.props?.cinematicOptions?.effect).toBe("fade")
    act(() => fixture.props!.afterLoad!(home, contact, "down"))
    const complete = await screen.findByRole("button", {
      name: "Complete celebration",
    })
    fireEvent.wheel(screen.getByText("Contact content"), { deltaY: 120 })
    await waitFor(() => expect(complete).toBeEnabled())
    fireEvent.click(complete)
    expect(complete).toBeDisabled()
    fireEvent.wheel(screen.getByText("Contact content"), { deltaY: 120 })
    await waitFor(() => expect(complete).toBeEnabled())
    act(() => fixture.props!.onLeave!(contact, home, "up"))
    expect(complete).toBeDisabled()
    act(() => fixture.props!.afterLoad!(contact, home, "up"))
    fireEvent.wheel(window, { deltaY: 120 })
    expect(complete).toBeDisabled()
  })

  it("preserves reduced-motion navigation and contact feedback without confetti", async () => {
    vi.mocked(window.matchMedia).mockImplementation((media) => ({
      matches: true,
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    renderShell()
    const home = createSection("home", 0)
    const contact = createSection("contact", 2)
    expect(fixture.props?.cinematic).toBe(false)
    act(() => fixture.props!.onLeave!(home, contact, "down"))
    expect(fixture.props?.cinematicOptions?.effect).toBe("zoom")
    act(() => fixture.props!.afterLoad!(home, contact, "down"))
    const complete = await screen.findByRole("button", {
      name: "Complete celebration",
    })
    fireEvent.wheel(window, { deltaY: 120 })
    await waitFor(() => expect(fixture.toast).toHaveBeenCalled())
    expect(complete).toBeDisabled()
  })

  it("initializes only the approved fullPage extension boundary", () => {
    const requireExtension = vi.fn()
    const originalRequire = Module.prototype.require
    vi.spyOn(Module.prototype, "require").mockImplementation(function (
      this: Module,
      path: string,
    ) {
      if (path.startsWith("@/vendor/fullPage_js_extensions_bundle/")) {
        requireExtension(path)
        return {}
      }
      return originalRequire.call(this, path)
    })
    renderShell()
    fixture.props!.pluginWrapper!()
    expect(requireExtension.mock.calls.map(([path]) => path)).toEqual([
      "@/vendor/fullPage_js_extensions_bundle/cinematic/fullpage.cinematic.core.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/burn.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/chromatic.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/doorway.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/pageCurlLeft.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/pixelate.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/shatter.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/shockwave.min.js",
      "@/vendor/fullPage_js_extensions_bundle/cards/fullpage.cards.min.js",
      "@/vendor/fullPage_js_extensions_bundle/resetSliders/fullpage.resetSliders.min.js",
      "@/vendor/fullPage_js_extensions_bundle/scrollOverflowReset/fullpage.scrollOverflowReset.min.js",
    ])
  })
})
