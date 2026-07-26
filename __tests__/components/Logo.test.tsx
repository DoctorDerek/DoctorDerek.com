import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import Logo from "@/components/ui/Logo"

const { logoState, send } = vi.hoisted(() => ({
  logoState: { isAlternative: true, shouldReduceMotion: false },
  send: vi.fn(),
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    shouldReduceMotion: logoState.shouldReduceMotion,
  }),
}))

vi.mock("@/machines/globalMachine", () => ({
  GlobalStateContext: {
    useSelector: (selector: (state: { matches: () => boolean }) => boolean) =>
      selector({ matches: () => logoState.isAlternative }),
    useActorRef: () => ({ send }),
  },
}))

vi.mock("@/images/Logo-Default-Landscape.svg", () => ({
  default: () => <svg aria-label="Default logo" />,
}))

vi.mock("@/images/Logo-Secondary-Portrait.svg", () => ({
  default: () => <svg aria-label="Secondary logo" />,
}))

describe("Logo", () => {
  beforeEach(() => {
    logoState.isAlternative = true
    logoState.shouldReduceMotion = false
    send.mockClear()
  })

  it("marks the theme-aware logo surface and toggles its artwork", () => {
    render(<Logo />)

    const logoSurface = screen
      .getByLabelText("Default logo")
      .closest(".site-logo")

    expect(logoSurface).toHaveClass("site-logo")
    expect(screen.getByLabelText("Secondary logo")).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText("Default logo"))

    expect(send).toHaveBeenCalledWith({ type: "TOGGLE_LOGO" })
  })

  it("renders the alternate logo without a transition when motion is reduced", () => {
    logoState.isAlternative = false
    logoState.shouldReduceMotion = true

    render(<Logo />)

    const wrapper = screen.getByLabelText("Default logo").closest(".wrapper")

    expect(wrapper).not.toBeNull()
    expect(wrapper).toHaveStyle({
      transform: "rotateY(180deg)",
      transition: "none",
    })
  })
})
