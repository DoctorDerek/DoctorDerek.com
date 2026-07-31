import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import TopSection from "@/components/TopSection"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

const { deferredClientFeature, reducedMotionPreference } = vi.hoisted(() => ({
  deferredClientFeature: { isReady: true },
  reducedMotionPreference: { value: false },
}))

vi.mock("next/dynamic", () => ({
  default: (loadComponent: () => Promise<unknown>) => {
    void loadComponent()

    return ({ segments }: { segments: readonly string[] }) => (
      <p data-testid="intro-typewriter">{segments.join(" · ")}</p>
    )
  },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/Navbar", () => ({
  default: () => null,
}))

vi.mock("@/hooks/useDeferredClientFeature", () => ({
  default: () => deferredClientFeature.isReady,
}))

const [primaryIntroduction, ...supportingIntroductionSegments] =
  INTRO_BIO_SHORT.split(" · ")
const supportingIntroduction = supportingIntroductionSegments.join(" · ")

describe("TopSection", () => {
  beforeEach(() => {
    deferredClientFeature.isReady = true
    reducedMotionPreference.value = false
  })

  it("renders the primary specialist positioning before enhanced motion", () => {
    render(<TopSection />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: primaryIntroduction,
      }),
    ).toBeInTheDocument()
    expect(screen.getByTestId("intro-typewriter")).toHaveTextContent(
      supportingIntroduction,
    )
    expect(
      screen.getByTestId("intro-typewriter").parentElement,
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("keeps supporting positioning visible while Typewriter is deferred", () => {
    deferredClientFeature.isReady = false

    render(<TopSection />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: primaryIntroduction,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(supportingIntroductionSegments[0]),
    ).toBeInTheDocument()
    expect(screen.queryByTestId("intro-typewriter")).not.toBeInTheDocument()
  })

  it("renders all positioning statically when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<TopSection />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: primaryIntroduction,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(supportingIntroduction)).toBeInTheDocument()
    expect(screen.queryByTestId("intro-typewriter")).not.toBeInTheDocument()
  })
})
