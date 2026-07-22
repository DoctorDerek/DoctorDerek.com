import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Navbar from "@/components/Navbar"

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/MotionSettings", () => ({
  default: () => <p>Motion settings</p>,
}))

vi.mock("@/components/ui/SocialLinks", () => ({
  default: () => null,
}))

describe("Navbar", () => {
  it("places testimonials before the portfolio in the hiring narrative", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })
    expect(navigationButton).toHaveAttribute("aria-expanded", "false")

    fireEvent.click(navigationButton)
    const navigation = screen.getByRole("navigation")

    expect(
      screen.getByRole("button", { name: "Close navigation and settings" }),
    ).toHaveAttribute("aria-expanded", "true")
    expect(navigation).toHaveAttribute("id", "site-navigation")
    expect(navigation).not.toHaveAttribute("inert")
    expect(within(navigation).getByText("Motion settings")).toBeInTheDocument()

    expect(
      within(navigation)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual([
      "About",
      "Experience",
      "Testimonials",
      "Portfolio",
      "Blog",
      "Contact",
    ])

    fireEvent.click(within(navigation).getByRole("link", { name: "About" }))
    expect(navigation).toHaveAttribute("inert")
  })
})
