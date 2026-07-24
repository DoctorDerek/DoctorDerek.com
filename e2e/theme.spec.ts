import { expect, test, type Page } from "@playwright/test"

async function openSettings(page: Page) {
  await page.getByRole("button", { name: "Open navigation" }).click()
}

test("defaults to dark and persists an explicit light choice", async ({
  page,
}) => {
  const hydrationFailures: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration/i.test(message.text())) {
      hydrationFailures.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    if (/hydration/i.test(error.message)) hydrationFailures.push(error.message)
  })

  await page.emulateMedia({ colorScheme: "light" })
  await page.goto("/")
  await openSettings(page)

  const documentRoot = page.locator("html")
  const themeToggle = page.getByRole("button", {
    name: "Switch to light theme",
  })

  await expect(documentRoot).toHaveClass(/dark/)
  await expect(themeToggle).toHaveClass(/theme-toggle--dark/)
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull()

  await themeToggle.click()

  await expect(documentRoot).toHaveClass(/light/)
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toHaveClass(/theme-toggle--light/)
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light")

  await page.reload()
  await openSettings(page)

  await expect(documentRoot).toHaveClass(/light/)
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toHaveClass(/theme-toggle--light/)
  expect(hydrationFailures).toEqual([])
})

test("ignores a dark system theme and keeps the dark default", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")
  await openSettings(page)

  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toHaveClass(
    /theme-toggle--dark/,
  )
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull()
})

test("keeps the theme control static when system motion is reduced", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" })
  await page.goto("/")
  await openSettings(page)

  await expect(page.locator(".theme-toggle-artwork .sun")).toHaveCSS(
    "transition-duration",
    "0s",
  )
  await page.getByRole("button", { name: "Switch to light theme" }).click()
  await expect(page.locator("html")).toHaveClass(/light/)
})
