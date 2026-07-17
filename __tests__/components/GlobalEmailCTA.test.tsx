import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"

describe("GlobalEmailCTA", () => {
  it("renders the canonical email address without custom content", () => {
    render(<GlobalEmailCTA />)

    expect(
      screen.getByRole("link", {
        name: "derekraustin+doctorderek@gmail.com",
      }),
    ).toBeInTheDocument()
  })
})
