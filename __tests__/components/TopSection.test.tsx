import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import TopSection from "@/components/TopSection"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

const { reducedMotionPreference } = vi.hoisted(() => ({
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

const [primaryIntroduction, ...supportingIntroductionSegments] =
  INTRO_BIO_SHORT.split(" · ")
const supportingIntroduction = supportingIntroductionSegments.join(" · ")

describe("TopSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("renders the primary specialist positioning before enhanced motion", () => {
    render(<TopSection shouldRenderDeferredMotion={true} />)

    const primaryPositioning = screen.getByRole("heading", {
      level: 1,
      name: primaryIntroduction,
    })

    expect(primaryPositioning).toBeInTheDocument()
    expect(primaryPositioning.closest(".opacity-0")).toBeNull()
    expect(screen.getByTestId("intro-typewriter")).toHaveTextContent(
      supportingIntroduction,
    )
    expect(
      screen.getByTestId("intro-typewriter").parentElement,
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("keeps supporting positioning visible while Typewriter is deferred", () => {
    render(<TopSection shouldRenderDeferredMotion={false} />)

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

    render(<TopSection shouldRenderDeferredMotion={true} />)

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
