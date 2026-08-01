import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Logo from "@/components/ui/Logo"
import { LOGO_CONTROL_ACCESSIBLE_NAMES } from "@/constants/INTERACTIONS"
import { GlobalStateContext } from "@/machines/globalMachine"

const { motionPreference } = vi.hoisted(() => ({
  motionPreference: { shouldReduceMotion: false },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: motionPreference.shouldReduceMotion,
  }),
}))

vi.mock("@/images/Logo-Default-Landscape.svg", () => ({
  default: () => <svg aria-label="Default logo" />,
}))

vi.mock("@/images/Logo-Secondary-Portrait.svg", () => ({
  default: () => <svg aria-label="Secondary logo" />,
}))

describe("Logo", () => {
  beforeEach(() => {
    motionPreference.shouldReduceMotion = false
  })

  const renderLogo = () =>
    render(
      <GlobalStateContext.Provider>
        <Logo />
      </GlobalStateContext.Provider>,
    )

  it("marks the theme-aware logo surface and rotates forward on every activation", () => {
    renderLogo()

    const logoControl = screen.getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
    })
    const logoSurface = screen
      .getByLabelText("Default logo")
      .closest(".site-logo")
    const wrapper = screen.getByLabelText("Default logo").closest(".wrapper")

    expect(logoSurface).toHaveClass("site-logo")
    expect(screen.getByLabelText("Secondary logo")).toBeInTheDocument()
    expect(logoControl).toHaveAttribute("aria-pressed", "false")
    expect(wrapper).toHaveStyle({ transform: "rotateY(0deg)" })

    fireEvent.click(logoControl)

    const alternateLogoControl = screen.getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showPrimary,
    })
    expect(alternateLogoControl).toHaveAttribute("aria-pressed", "true")
    expect(wrapper).toHaveStyle({ transform: "rotateY(180deg)" })

    fireEvent.click(alternateLogoControl)

    expect(
      screen.getByRole("button", {
        name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
      }),
    ).toHaveAttribute("aria-pressed", "false")
    expect(wrapper).toHaveStyle({ transform: "rotateY(360deg)" })
  })

  it("renders the alternate logo without a transition when motion is reduced", () => {
    motionPreference.shouldReduceMotion = true

    renderLogo()

    const logoControl = screen.getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
    })

    const wrapper = screen.getByLabelText("Default logo").closest(".wrapper")

    expect(wrapper).not.toBeNull()
    expect(wrapper).toHaveStyle({
      transform: "rotateY(0deg)",
      transition: "none",
    })

    fireEvent.click(logoControl)

    expect(wrapper).toHaveStyle({
      transform: "rotateY(180deg)",
      transition: "none",
    })
  })
})
