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
  it("renders the audited project order with semantic controls and no phase copy", () => {
    render(<Portfolio />)

    expect(
      screen.getByRole("heading", { name: "Portfolio", level: 2 }),
    ).toBeInTheDocument()

    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "What Are Your Values, Mapache?",
      "CRM",
      "Calendar",
      "Weather",
      "Pokédex",
      "DoctorDerek.com",
    ])
    expect(PORTFOLIO_PROJECTS[0]?.tech).toEqual(
      expect.arrayContaining(["Expo", "React Native"]),
    )
    expect(JSON.stringify(PORTFOLIO_PROJECTS)).not.toMatch(/\bphase\b/i)

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
  })

  it("opens and closes each project dialog with verified live and source links", async () => {
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
      expect(liveProjectLink).toHaveTextContent("View live project")

      const sourceProjectLink = within(dialog).getByRole("link", {
        name: `View ${project.projectTitle} source`,
      })
      expect(sourceProjectLink).toHaveAttribute("href", project.sourceUrl)
      expect(sourceProjectLink).toHaveAttribute("target", "_blank")
      expect(sourceProjectLink).toHaveAttribute("rel", "noopener noreferrer")
      expect(sourceProjectLink).toHaveTextContent("View source")

      fireEvent.click(
        within(dialog).getByRole("button", {
          name: "Close project details",
        }),
      )
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      })
    }

    fireEvent.click(
      screen.getByRole("button", {
        name: `Explore ${PORTFOLIO_PROJECTS[0].projectTitle}`,
      }),
    )
    await screen.findByRole("dialog", {
      name: PORTFOLIO_PROJECTS[0].projectTitle,
    })
    fireEvent.keyDown(document, { key: "Escape" })
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })
})
