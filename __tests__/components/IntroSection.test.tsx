import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import IntroSection from "@/components/IntroSection"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

vi.mock("@/components/ui/SocialLinks", () => ({
  default: () => <div data-testid="social-links-mock" />,
}))

describe("IntroSection", () => {
  it("renders the short bio with correct typography classes", () => {
    render(<IntroSection />)
    const bioText = screen.getByText(INTRO_BIO_SHORT)
    
    expect(bioText).toBeInTheDocument()
    expect(bioText).toHaveClass("restoramedium")
    expect(bioText).toHaveClass("text-white")
    expect(bioText).toHaveClass("text-3xl")
  })

  it("renders the social links component within the flex layout", () => {
    render(<IntroSection />)
    const socialLinks = screen.getByTestId("social-links-mock")
    
    expect(socialLinks).toBeInTheDocument()
  })
})
