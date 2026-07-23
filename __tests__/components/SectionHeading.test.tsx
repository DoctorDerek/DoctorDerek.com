import { render, screen } from "@testing-library/react"
import { type ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import SectionHeading from "@/components/ui/SectionHeading"

const { motionPreferenceState } = vi.hoisted(() => ({
  motionPreferenceState: { shouldReduceMotion: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => motionPreferenceState,
}))

vi.mock("react-parallax-tilt", () => ({
  default: ({
    children,
    tiltEnable,
  }: {
    children: ReactNode
    tiltEnable: boolean
  }) => <div data-tilt-enabled={tiltEnable}>{children}</div>,
}))

describe("SectionHeading", () => {
  beforeEach(() => {
    motionPreferenceState.shouldReduceMotion = false
  })

  it("owns the shared entrance wrapper and enables tilt for full motion", () => {
    render(
      <SectionHeading className="mb-8">
        <h2>Heading</h2>
      </SectionHeading>,
    )

    const heading = screen.getByRole("heading", { name: "Heading" })
    expect(heading.parentElement).toHaveAttribute("data-tilt-enabled", "true")
    expect(heading.parentElement?.parentElement).toHaveClass(
      "section-heading-entrance",
      "mb-8",
    )
  })

  it("disables tilt when reduced motion is active", () => {
    motionPreferenceState.shouldReduceMotion = true

    render(
      <SectionHeading>
        <h2>Static heading</h2>
      </SectionHeading>,
    )

    expect(
      screen.getByRole("heading", { name: "Static heading" }).parentElement,
    ).toHaveAttribute("data-tilt-enabled", "false")
  })
})
