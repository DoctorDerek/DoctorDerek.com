import { render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { describe, expect, it, vi } from "vitest"
import ContactSection from "@/components/ContactSection"

vi.mock("next/image", () => ({
  default: ({
    priority: _priority,
    quality: _quality,
    ...imageProps
  }: ComponentProps<"img"> & {
    priority?: boolean
    quality?: number
  }) => createElement("img", imageProps),
}))

describe("ContactSection", () => {
  it("safely centers the final section without hiding overflowing content", () => {
    render(<ContactSection />)

    const heading = screen.getByRole("heading", { name: "Contact" })
    const sectionContent = heading.closest("div.min-h-full")
    const contactComposition = heading.closest("div.my-auto")

    expect(sectionContent).not.toHaveClass("h-full")
    expect(sectionContent).not.toHaveClass("items-center")
    expect(contactComposition).toHaveClass("my-auto", "w-full")
    expect(screen.getByRole("link", { name: "Contact Me" })).toBeInTheDocument()
  })
})
