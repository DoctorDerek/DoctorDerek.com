import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import Navbar from "@/components/Navbar"
import { SOCIAL_LINKS } from "@/constants/SITE_CONTENT"

vi.mock("@/components/ui/Logo", () => ({
  default: () => null,
}))

vi.mock("@/components/SiteSettings", () => ({
  default: () => null,
}))

describe("Navbar", () => {
  it("places testimonials before the portfolio in the hiring narrative", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation",
    })
    expect(navigationButton).toHaveAttribute("aria-expanded", "false")

    fireEvent.click(navigationButton)
    const navigation = screen.getByRole("navigation")

    expect(
      screen.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true")
    expect(navigation).toHaveAttribute("id", "site-navigation")
    expect(navigation).not.toHaveAttribute("inert")
    expect(
      within(within(navigation).getByRole("list"))
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
      name: "Open navigation",
    })

    fireEvent.click(navigationButton)
    const navigation = screen.getByRole("navigation")
    expect(navigation).not.toHaveAttribute("inert")

    fireEvent.keyDown(window, { key: "Escape" })
    expect(navigation).toHaveAttribute("inert")
  })

  it("moves focus to the first navigation link when opened", () => {
    const requestAnimationFrame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback(0)
        return 1
      })

    render(<Navbar />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open navigation",
      }),
    )

    expect(screen.getByRole("link", { name: "About" })).toHaveFocus()
    requestAnimationFrame.mockRestore()
  })

  it("ignores keyboard and inside-surface dismissal events", () => {
    render(<Navbar />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open navigation",
      }),
    )

    const navigation = screen.getByRole("navigation")

    fireEvent.keyDown(window, { key: "Enter" })
    fireEvent.pointerDown(navigation)

    expect(navigation).not.toHaveAttribute("inert")
  })

  it("closes when the overlay background is clicked", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation",
    })
    fireEvent.click(navigationButton)

    const navigation = screen.getByRole("navigation")
    const backdrop = screen.getByTestId("site-navigation-backdrop")

    expect(navigation).not.toHaveAttribute("inert")

    fireEvent.pointerDown(backdrop)
    expect(navigation).toHaveAttribute("inert")
  })

  it("closes when the overlay background receives a click", () => {
    render(<Navbar />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Open navigation",
      }),
    )

    const navigation = screen.getByRole("navigation")
    fireEvent.click(screen.getByTestId("site-navigation-backdrop"))

    expect(navigation).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when closed with Escape", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation",
    })

    fireEvent.click(navigationButton)
    fireEvent.keyDown(window, { key: "Escape" })

    expect(navigationButton).toHaveFocus()
    expect(screen.getByRole("navigation")).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when closed by overlay touch", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation",
    })
    fireEvent.click(navigationButton)

    const backdrop = screen.getByTestId("site-navigation-backdrop")
    fireEvent.pointerDown(backdrop)

    expect(navigationButton).toHaveFocus()
    expect(screen.getByRole("navigation")).toHaveAttribute("inert")
  })

  it("returns focus to the navigation toggle when a menu link closes the panel", () => {
    render(<Navbar />)

    const navigationButton = screen.getByRole("button", {
      name: "Open navigation",
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
        name: "Open navigation",
      }),
    )

    const overlay = screen.getByTestId("site-navigation-overlay")
    const navigation = screen.getByRole("navigation")
    const scrollRegion = within(navigation).getByRole("list").parentElement

    expect(overlay.className).toContain("h-[calc(100svh-7dvh)]")
    expect(navigation.className).not.toContain("max-h-[calc(100dvh-7dvh)]")
    expect(navigation.className).toContain("overflow-hidden")
    expect(scrollRegion).toHaveClass("touch-pan-y")
  })

  it("presents mobile-menu social links as one accessible icon row", () => {
    render(<Navbar />)

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }))

    const socialLinks = screen.getByRole("group", { name: "Social links" })
    const socialLinkRow = socialLinks.firstElementChild

    expect(socialLinkRow).toHaveClass(
      "flex",
      "w-full",
      "items-center",
      "justify-between",
    )
    expect(
      within(socialLinks)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(SOCIAL_LINKS.map(({ label }) => label))

    for (const { label } of SOCIAL_LINKS)
      expect(within(socialLinks).getByText(label)).toHaveClass("sr-only")
  })
})
