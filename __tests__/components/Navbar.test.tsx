import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Navbar from "@/components/Navbar"

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/SiteSettings", () => ({
  default: () => <p>Site settings</p>,
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
    expect(within(navigation).getByText("Site settings")).toBeInTheDocument()

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

  it("closes with Escape when open", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })

    fireEvent.click(navigationButton)
    const navigation = screen.getByRole("navigation")
    expect(navigation).not.toHaveAttribute("inert")

    fireEvent.keyDown(window, { key: "Escape" })
    expect(navigation).toHaveAttribute("inert")
  })

  it("closes when the overlay background is clicked", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })
    fireEvent.click(navigationButton)

    const navigation = screen.getByRole("navigation")
    const overlay = screen.getByTestId("site-navigation-overlay")

    expect(navigation).not.toHaveAttribute("inert")

    fireEvent.mouseDown(overlay)
    expect(navigation).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when closed with Escape", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })

    fireEvent.click(navigationButton)
    fireEvent.keyDown(window, { key: "Escape" })

    expect(navigationButton).toHaveFocus()
    expect(screen.getByRole("navigation")).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when closed by overlay touch", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })
    fireEvent.click(navigationButton)

    const overlay = screen.getByTestId("site-navigation-overlay")
    fireEvent.touchStart(overlay)

    expect(navigationButton).toHaveFocus()
    expect(screen.getByRole("navigation")).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when a menu link closes the panel", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation and settings",
    })
    fireEvent.click(navigationButton)
    const aboutLink = screen.getByRole("link", { name: "About" })

    fireEvent.click(aboutLink)

    expect(navigationButton).toHaveFocus()
    expect(screen.getByRole("navigation")).toHaveAttribute("inert")
  })

  it("uses dynamic viewport sizing and overflow containment for the open menu", () => {
    render(<Navbar />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open navigation and settings",
      }),
    )

    const overlay = screen.getByTestId("site-navigation-overlay")
    const navigation = screen.getByRole("navigation")

    expect(overlay.className).toContain("h-[calc(100svh-7dvh)]")
    expect(navigation.className).not.toContain("max-h-[calc(100dvh-7dvh)]")
    expect(navigation.className).toContain("overflow-hidden")
  })
})
