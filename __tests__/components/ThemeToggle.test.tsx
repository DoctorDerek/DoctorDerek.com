import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ThemeToggle from "@/components/ui/ThemeToggle"

describe("ThemeToggle", () => {
  it("announces and requests the opposite of the current light theme", () => {
    const onToggle = vi.fn()

    render(<ThemeToggle isDarkTheme={false} onToggle={onToggle} />)

    const themeToggle = screen.getByRole("button", {
      name: "Switch to dark theme",
    })
    expect(themeToggle).toHaveClass("theme-toggle--light")

    fireEvent.click(themeToggle)

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it("announces the light destination for the current dark theme", () => {
    render(<ThemeToggle isDarkTheme onToggle={vi.fn()} />)

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toHaveClass("theme-toggle--dark")
  })
})
