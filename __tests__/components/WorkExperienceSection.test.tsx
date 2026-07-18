import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import WorkExperienceSection from "@/components/WorkExperienceSection"

describe("WorkExperienceSection", () => {
  it("top-anchors the mobile timeline while preserving desktop centering", () => {
    render(<WorkExperienceSection />)

    const heading = screen.getByRole("heading", {
      name: "Full-Stack SWE since 2004",
    })
    const sectionContent = heading.closest("div.min-h-full")

    expect(sectionContent).toHaveClass("justify-start")
    expect(sectionContent).toHaveClass("lg:h-full")
    expect(sectionContent).toHaveClass("lg:justify-center")
    expect(sectionContent).not.toHaveClass("h-full")
  })
})
