import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"

const renderCareerTimeline = () => {
  render(<WorkExperienceSection />)

  const carousel = screen.getByRole("region", { name: "Career timeline" })
  const track = within(carousel).getByRole("list", { name: "Career eras" })

  return { carousel, track }
}

describe("WorkExperienceSection", () => {
  it("renders the canonical career eras in semantic mobile and desktop timelines", () => {
    const { carousel } = renderCareerTimeline()

    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Full-Stack SWE since 2004",
    )
    expect(
      screen.getByRole("list", { name: "Desktop career timeline" }).children,
    ).toHaveLength(ARCHITECT_EVOLUTION.length)
    expect(
      within(carousel).getByRole("group", {
        name: `1 of ${ARCHITECT_EVOLUTION.length}`,
      }),
    ).toBeVisible()

    for (const { company, duration } of ARCHITECT_EVOLUTION) {
      expect(screen.getAllByText(duration)).toHaveLength(2)
      expect(screen.getAllByText(company)).toHaveLength(2)
    }

    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })

  it("navigates career eras with arrows and direct-selection controls", () => {
    const { carousel, track } = renderCareerTimeline()
    const previousButton = within(carousel).getByRole("button", {
      name: "Show previous career era",
    })
    const nextButton = within(carousel).getByRole("button", {
      name: "Show next career era",
    })

    expect(previousButton).toBeDisabled()
    expect(nextButton).toBeEnabled()
    expect(track).toHaveStyle({ transform: "translateX(-0%)" })

    fireEvent.click(nextButton)

    expect(previousButton).toBeEnabled()
    expect(track).toHaveStyle({ transform: "translateX(-100%)" })
    expect(
      within(carousel).getByRole("button", {
        name: `Show ${ARCHITECT_EVOLUTION[1]?.duration}`,
      }),
    ).toHaveAttribute("aria-current", "step")

    fireEvent.click(
      within(carousel).getByRole("button", {
        name: `Show ${ARCHITECT_EVOLUTION.at(-1)?.duration}`,
      }),
    )

    expect(track).toHaveStyle({
      transform: `translateX(-${(ARCHITECT_EVOLUTION.length - 1) * 100}%)`,
    })
    expect(nextButton).toBeDisabled()

    fireEvent.click(previousButton)

    expect(track).toHaveStyle({
      transform: `translateX(-${(ARCHITECT_EVOLUTION.length - 2) * 100}%)`,
    })
  })

  it("changes eras only for deliberate horizontal touch gestures", () => {
    const { track } = renderCareerTimeline()
    const touchSurface = track.parentElement as HTMLDivElement

    fireEvent.touchStart(touchSurface, { changedTouches: [] })
    fireEvent.touchEnd(touchSurface, {
      changedTouches: [{ clientX: 180, clientY: 100 }],
    })
    fireEvent.touchStart(touchSurface, {
      changedTouches: [{ clientX: 280, clientY: 100 }],
    })
    fireEvent.touchEnd(touchSurface, { changedTouches: [] })
    fireEvent.touchStart(touchSurface, {
      changedTouches: [{ clientX: 280, clientY: 100 }],
    })
    fireEvent.touchEnd(touchSurface, {
      changedTouches: [{ clientX: 260, clientY: 100 }],
    })
    fireEvent.touchStart(touchSurface, {
      changedTouches: [{ clientX: 280, clientY: 100 }],
    })
    fireEvent.touchEnd(touchSurface, {
      changedTouches: [{ clientX: 220, clientY: 220 }],
    })

    expect(track).toHaveStyle({ transform: "translateX(-0%)" })

    fireEvent.touchStart(touchSurface, {
      changedTouches: [{ clientX: 280, clientY: 100 }],
    })
    fireEvent.touchEnd(touchSurface, {
      changedTouches: [{ clientX: 180, clientY: 100 }],
    })

    expect(track).toHaveStyle({ transform: "translateX(-100%)" })

    fireEvent.touchStart(touchSurface, {
      changedTouches: [{ clientX: 180, clientY: 100 }],
    })
    fireEvent.touchEnd(touchSurface, {
      changedTouches: [{ clientX: 280, clientY: 100 }],
    })

    expect(track).toHaveStyle({ transform: "translateX(-0%)" })
  })
})
