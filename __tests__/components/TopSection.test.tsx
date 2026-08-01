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

const introductionSegments = INTRO_BIO_SHORT.split(" · ")

describe("TopSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("keeps the complete introduction semantic while enhanced motion runs", () => {
    render(<TopSection shouldRenderDeferredMotion={true} />)

    const completeIntroduction = screen.getByRole("heading", {
      level: 1,
      name: INTRO_BIO_SHORT,
    })

    expect(completeIntroduction).toBeInTheDocument()
    expect(completeIntroduction.closest(".opacity-0")).toBeNull()
    expect(screen.getByText(introductionSegments.at(-1)!)).toBeInTheDocument()
    expect(completeIntroduction.nextElementSibling).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  it("keeps the first positioning segment visible while motion is deferred", () => {
    render(<TopSection shouldRenderDeferredMotion={false} />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INTRO_BIO_SHORT,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(introductionSegments[0])).toBeInTheDocument()
    expect(
      screen.queryByText(introductionSegments.at(-1)!),
    ).not.toBeInTheDocument()
  })

  it("renders all positioning statically when motion is reduced", () => {
    reducedMotionPreference.value = true

    render(<TopSection shouldRenderDeferredMotion={true} />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: INTRO_BIO_SHORT,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(INTRO_BIO_SHORT)).toHaveLength(2)
    expect(
      screen.queryByText(introductionSegments.at(-1)!),
    ).not.toBeInTheDocument()
  })
})
