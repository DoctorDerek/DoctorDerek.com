import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Logo from "@/components/ui/Logo"

const send = vi.fn()

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({ shouldReduceMotion: false }),
}))

vi.mock("@/machines/globalMachine", () => ({
  GlobalStateContext: {
    useSelector: (selector: (state: { matches: () => boolean }) => boolean) =>
      selector({ matches: () => true }),
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
})
