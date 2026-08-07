import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import WorkExperienceSection from "@/components/WorkExperienceSection"

vi.mock("@/components/ui/CountUp", () => ({
  default: ({ to }: { to: number }) => <span>{to}</span>,
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({ shouldReduceMotion: false }),
}))

vi.mock("@/constants/SITE_CONTENT", () => ({
  ARCHITECT_EVOLUTION: [
    { duration: "2024–Present", company: "Serving 20M+ users" },
    { duration: "2019–2024", company: "Senior product engineering" },
    { duration: "2009–2019", company: "Full-stack web development" },
    { duration: "2004–2009", company: "Software engineering" },
  ],
}))

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

  it("renders each real milestone once without placeholder grid entries", () => {
    render(<WorkExperienceSection />)

    expect(screen.getByRole("list", { name: "Career timeline" })).toBeVisible()
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    expect(screen.getByText("20")).toBeVisible()
    expect(screen.getByText("Senior product engineering")).toBeVisible()
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument()
  })
})
