import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import SiteSettings from "@/components/SiteSettings"
import SiteThemeProvider from "@/components/SiteThemeProvider"

describe("site settings theme integration", () => {
  afterEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove("dark", "light")
  })

  it.each(["dark", "light"] as const)(
    "loads the actual toggle and changes a persisted %s preference in both directions",
    async (theme) => {
      window.localStorage.setItem("theme", theme)
      render(
        <SiteThemeProvider>
          <SiteSettings />
        </SiteThemeProvider>,
      )
      const nextTheme = theme === "dark" ? "light" : "dark"
      fireEvent.click(
        await screen.findByRole("button", {
          name: `Switch to ${nextTheme} theme`,
        }),
      )
      expect(document.documentElement).toHaveClass(nextTheme)
      expect(window.localStorage.getItem("theme")).toBe(nextTheme)
      fireEvent.click(
        screen.getByRole("button", { name: `Switch to ${theme} theme` }),
      )
      expect(document.documentElement).toHaveClass(theme)
      expect(window.localStorage.getItem("theme")).toBe(theme)
    },
  )
})
