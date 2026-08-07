import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import SocialLinks from "@/components/ui/SocialLinks"
import { SOCIAL_LINKS } from "@/constants/SITE_CONTENT"

describe("SocialLinks", () => {
  it("names every icon-only link and hides its decorative icon", () => {
    const { container } = render(<SocialLinks />)

    for (const socialLink of SOCIAL_LINKS)
      expect(
        screen.getByRole("link", { name: socialLink.label }),
      ).toBeInTheDocument()

    expect(screen.getAllByRole("link")).toHaveLength(SOCIAL_LINKS.length)
    for (const icon of container.querySelectorAll("svg")) {
      expect(icon).toHaveAttribute("aria-hidden", "true")
      expect(icon).toHaveAttribute("focusable", "false")
    }
  })
})
