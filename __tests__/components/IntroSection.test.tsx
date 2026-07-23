import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import IntroSection from "@/components/IntroSection"
import { INTRO_BIO_SHORT, SOCIAL_LINKS } from "@/constants/SITE_CONTENT"

describe("IntroSection", () => {
  it("renders the short bio with correct typography classes", () => {
    render(<IntroSection />)
    const bioText = screen.getByText(INTRO_BIO_SHORT)

    expect(bioText).toBeInTheDocument()
    expect(bioText).toHaveClass("restoramedium")
    expect(bioText).toHaveClass("text-site-foreground")
    expect(bioText).toHaveClass("text-3xl")
  })

  it("renders all social links with correct real UI text", () => {
    render(<IntroSection />)

    SOCIAL_LINKS.forEach((link) => {
      const linkElement = screen.getByText(link.label)
      expect(linkElement).toBeInTheDocument()
    })
  })
})
