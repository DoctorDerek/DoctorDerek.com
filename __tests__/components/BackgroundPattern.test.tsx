import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import BackgroundPattern from "@/components/BackgroundPattern"

describe("BackgroundPattern", () => {
  it("renders the initial pattern without an entrance transition", () => {
    render(<BackgroundPattern source="/background-one.svg" />)

    const pattern = screen.getByRole("presentation", { hidden: true })
    expect(pattern).toHaveAttribute("src", "/background-one.svg")
    expect(pattern).toHaveAttribute("draggable", "false")
    expect(pattern).toHaveClass("background-pattern-layer-active")
    expect(pattern).not.toHaveClass("background-pattern-layer-entering")
    expect(pattern).toHaveStyle({ transitionDuration: "20s" })
  })

  it("crossfades between only the outgoing and incoming patterns", async () => {
    const { rerender } = render(
      <BackgroundPattern source="/background-one.svg" />,
    )

    rerender(<BackgroundPattern source="/background-two.svg" />)

    await waitFor(() =>
      expect(
        screen.getAllByRole("presentation", { hidden: true }),
      ).toHaveLength(2),
    )

    const [outgoingPattern, incomingPattern] = screen.getAllByRole(
      "presentation",
      { hidden: true },
    )
    expect(outgoingPattern).not.toHaveClass("background-pattern-layer-active")
    expect(incomingPattern).toHaveClass(
      "background-pattern-layer-active",
      "background-pattern-layer-entering",
    )

    fireEvent.transitionEnd(incomingPattern)

    expect(screen.getAllByRole("presentation", { hidden: true })).toHaveLength(
      1,
    )
    expect(screen.getByRole("presentation", { hidden: true })).toHaveAttribute(
      "src",
      "/background-two.svg",
    )
  })

  it("does not duplicate an unchanged pattern", () => {
    const { rerender } = render(
      <BackgroundPattern source="/background-one.svg" />,
    )

    rerender(<BackgroundPattern source="/background-one.svg" />)

    expect(screen.getAllByRole("presentation", { hidden: true })).toHaveLength(
      1,
    )
  })
})
