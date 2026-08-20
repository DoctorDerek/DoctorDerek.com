import { fireEvent, render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import {
  CAREER_RAIL_PATHS,
  CAREER_RAIL_STROKE_WIDTH,
} from "@/constants/CAREER_TIMELINE"
import { getCareerCodeMarkerAccessibleName } from "@/constants/INTERACTIONS"
import { ARCHITECT_EVOLUTION } from "@/constants/SITE_CONTENT"

const { reducedMotionPreference } = vi.hoisted(() => ({
  reducedMotionPreference: { value: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

const renderCareerTimeline = () => {
  render(<WorkExperienceSection />)

  const carousel = screen.getByRole("region", { name: "Career timeline" })
  const track = within(carousel).getByRole("list", { name: "Career eras" })

  return { carousel, track }
}

describe("WorkExperienceSection", () => {
  beforeEach(() => {
    reducedMotionPreference.value = false
  })

  it("renders the canonical career eras in semantic mobile and desktop timelines", () => {
    const { carousel } = renderCareerTimeline()

    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Full-Stack SWE Since 2004",
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

  it("renders the approved rounded rail topology and chronological desktop columns", () => {
    renderCareerTimeline()

    for (const [viewport, pathDefinition] of Object.entries(
      CAREER_RAIL_PATHS,
    )) {
      const rail = document.querySelector(`[data-career-rail="${viewport}"]`)
      const path = rail?.querySelector("path")

      expect(path).toHaveAttribute("d", pathDefinition)
      expect(path).toHaveAttribute(
        "stroke-width",
        String(CAREER_RAIL_STROKE_WIDTH),
      )
      expect(path).toHaveAttribute("stroke-linecap", "round")
      expect(path).toHaveAttribute("stroke-linejoin", "round")
    }

    const desktopCareerEras = Array.from(
      screen.getByRole("list", { name: "Desktop career timeline" }).children,
    )

    for (const careerEra of desktopCareerEras) {
      expect(careerEra).toHaveClass("pl-14", "pr-10")
    }

    expect(desktopCareerEras[0]).toHaveClass("col-start-1", "row-start-1")
    expect(desktopCareerEras[1]).toHaveClass("col-start-1", "row-start-2")
    expect(desktopCareerEras[2]).toHaveClass("col-start-2", "row-start-1")
    expect(desktopCareerEras[3]).toHaveClass("col-start-2", "row-start-2")

    const mobileCareerTrack = screen.getByRole("list", {
      name: "Career eras",
    })
    expect(mobileCareerTrack.parentElement).toHaveClass(
      "overflow-hidden",
      "pt-5",
    )
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

  it("exposes a code-marker control only for the active mobile era", () => {
    const { carousel } = renderCareerTimeline()
    const firstCareerEra = ARCHITECT_EVOLUTION[0]!
    const secondCareerEra = ARCHITECT_EVOLUTION[1]!

    expect(
      within(carousel).getByRole("button", {
        name: getCareerCodeMarkerAccessibleName(firstCareerEra.duration),
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).queryByRole("button", {
        name: getCareerCodeMarkerAccessibleName(secondCareerEra.duration),
      }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      within(carousel).getByRole("button", {
        name: "Show next career era",
      }),
    )

    expect(
      within(carousel).queryByRole("button", {
        name: getCareerCodeMarkerAccessibleName(firstCareerEra.duration),
      }),
    ).not.toBeInTheDocument()
    expect(
      within(carousel).getByRole("button", {
        name: getCareerCodeMarkerAccessibleName(secondCareerEra.duration),
      }),
    ).toBeInTheDocument()
  })

  it("keeps every code marker decorative under reduced motion", () => {
    reducedMotionPreference.value = true
    renderCareerTimeline()

    for (const { duration } of ARCHITECT_EVOLUTION) {
      expect(
        screen.queryByRole("button", {
          name: getCareerCodeMarkerAccessibleName(duration),
        }),
      ).not.toBeInTheDocument()
    }
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
