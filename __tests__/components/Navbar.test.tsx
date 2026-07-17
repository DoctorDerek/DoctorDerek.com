import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Navbar from "@/components/Navbar"

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/ui/SocialLinks", () => ({
  default: () => null,
}))

describe("Navbar", () => {
  it("places testimonials before the portfolio in the hiring narrative", () => {
    render(<Navbar />)

    fireEvent.click(screen.getByRole("button"))
    const navigation = screen.getByRole("navigation")

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
