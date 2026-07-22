import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MotionSettings from "@/components/MotionSettings"

const { motionPreferenceState, setMotionPreference } = vi.hoisted(() => ({
  motionPreferenceState: { value: "system" },
  setMotionPreference: vi.fn(),
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: motionPreferenceState.value,
    setMotionPreference,
    shouldReduceMotion: motionPreferenceState.value === "reduce",
  }),
}))

describe("MotionSettings", () => {
  beforeEach(() => {
    motionPreferenceState.value = "system"
    setMotionPreference.mockClear()
  })

  it("offers a labeled three-state motion preference", () => {
    render(<MotionSettings />)

    const motionPreference = screen.getByRole("combobox", { name: "Motion" })

    expect(motionPreference).toHaveValue("system")
    expect(screen.getByText("Use device setting")).toBeInTheDocument()
    expect(screen.getByText("Reduce motion")).toBeInTheDocument()
    expect(screen.getByText("Allow full motion")).toBeInTheDocument()
    expect(
      screen.getByText("Follows your device’s reduced-motion setting."),
    ).toHaveAttribute("id", "motion-preference-description")

    fireEvent.change(motionPreference, { target: { value: "reduce" } })
    expect(setMotionPreference).toHaveBeenCalledWith("reduce")
  })

  it("truthfully describes explicit reduced and full-motion modes", () => {
    motionPreferenceState.value = "reduce"
    const { rerender } = render(<MotionSettings />)

    expect(
      screen.getByText(
        "Pauses decorative motion and uses instant transitions.",
      ),
    ).toBeInTheDocument()

    motionPreferenceState.value = "full"
    rerender(<MotionSettings />)

    expect(
      screen.getByText("Allows the site’s complete animation experience."),
    ).toBeInTheDocument()
  })
})
