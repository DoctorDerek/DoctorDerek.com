import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { describe, expect, it } from "vitest"
import Portfolio from "@/components/Portfolio"
import { PORTFOLIO_PROJECTS } from "@/constants/SITE_CONTENT"

describe("Portfolio", () => {
  it("renders every verified production project with semantic controls", () => {
    render(<Portfolio />)

    expect(
      screen.getByRole("heading", { name: "Portfolio", level: 2 }),
    ).toBeInTheDocument()

    PORTFOLIO_PROJECTS.forEach((project) => {
      expect(
        screen.getByRole("heading", {
          name: project.projectTitle,
          level: 3,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(project.summary)).toBeInTheDocument()
      expect(
        screen.getByRole("button", {
          name: `Explore ${project.projectTitle}`,
        }),
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByRole("link", { name: /GitHub|source/i }),
    ).not.toBeInTheDocument()
  })

  it("opens and closes each project dialog with its verified live link", async () => {
    render(<Portfolio />)

    for (const project of PORTFOLIO_PROJECTS) {
      fireEvent.click(
        screen.getByRole("button", {
          name: `Explore ${project.projectTitle}`,
        }),
      )

      const dialog = await screen.findByRole("dialog", {
        name: project.projectTitle,
      })
      expect(within(dialog).getByText(project.details)).toBeInTheDocument()

      const liveProjectLink = within(dialog).getByRole("link", {
        name: `View ${project.projectTitle} live`,
      })
      expect(liveProjectLink).toHaveAttribute("href", project.liveUrl)
      expect(liveProjectLink).toHaveAttribute("target", "_blank")
      expect(liveProjectLink).toHaveAttribute("rel", "noopener noreferrer")

      fireEvent.click(
        within(dialog).getByRole("button", {
          name: "Close project details",
        }),
      )
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      })
    }
  })
})
