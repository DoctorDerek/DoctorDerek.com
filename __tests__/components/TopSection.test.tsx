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
      <p>{segments.at(-1)}</p>
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

  it("keeps semantic positioning visible before the Typewriter starts", () => {
    const { rerender } = render(
      <TopSection shouldStartTypewriter={false} />,
    )

    const primaryPositioning = screen.getByRole("heading", {
      level: 1,
      name: primaryIntroduction,
    })

    expect(primaryPositioning).toBeInTheDocument()
    expect(primaryPositioning.closest(".opacity-0")).toBeNull()
    expect(screen.getByText(supportingIntroduction)).toHaveClass("sr-only")
    expect(
      screen.queryByText(supportingIntroductionSegments.at(-1)!),
    ).not.toBeInTheDocument()

    rerender(<TopSection shouldStartTypewriter={true} />)
    expect(
      screen.getByText(supportingIntroductionSegments.at(-1)!).parentElement,
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("renders the complete supporting introduction statically when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<TopSection shouldStartTypewriter={false} />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: primaryIntroduction,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(supportingIntroduction)).not.toHaveClass("sr-only")
    expect(
      screen.queryByText(supportingIntroductionSegments.at(-1)!),
    ).not.toBeInTheDocument()
  })
})
