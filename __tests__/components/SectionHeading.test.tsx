import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import SectionHeading from "@/components/ui/SectionHeading"

describe("SectionHeading", () => {
  it("owns the shared entrance wrapper without a false interaction affordance", () => {
    render(
      <SectionHeading className="mb-8">
        <h2>Heading</h2>
      </SectionHeading>,
    )

    const heading = screen.getByRole("heading", { name: "Heading" })
    expect(heading.parentElement).toHaveClass(
      "section-heading-entrance",
      "w-max",
      "mb-8",
    )
    expect(heading.parentElement).not.toHaveClass("cursor-pointer")
  })

  it.each([undefined, ""])(
    "keeps only the base classes when className is %s",
    (className) => {
      render(
        <SectionHeading className={className}>
          <h2>Heading</h2>
        </SectionHeading>,
      )

      expect(
        screen.getByRole("heading", { name: "Heading" }).parentElement,
      ).toHaveAttribute("class", "section-heading-entrance w-max")
    },
  )
})
