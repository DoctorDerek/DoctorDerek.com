import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AiConsultancySection from "@/components/AiConsultancySection"

describe("AiConsultancySection", () => {
  it("safely centers the hiring pitch without hiding overflowing content", () => {
    render(<AiConsultancySection />)

    const heading = screen.getByRole("heading", { name: "What I Do Best" })
    const sectionContent = heading.closest("div.min-h-full")
    const pitchCard = heading.closest("div.my-auto")

    expect(sectionContent).not.toHaveClass("h-full")
    expect(sectionContent).not.toHaveClass("justify-center")
    expect(pitchCard).toHaveClass("my-auto")
    expect(
      screen.getByRole("link", { name: "Inquire About Availability" }),
    ).toBeInTheDocument()
  })
})
