import { expect, test } from "@playwright/test"

test("honors the system reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const documentRoot = page.locator("html")
  const ambientBackground = page.locator("[data-ambient-motion]")

  await expect(documentRoot).not.toHaveAttribute("data-motion-preference")
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(0, 139, 139)",
  )
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )
  await expect(ambientBackground).not.toHaveClass(/animate-rainbow-vivid/)
})

test("starts color motion while keeping deferred ambience dormant", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  await expect(page.locator("html")).not.toHaveAttribute(
    "data-motion-preference",
  )
  await expect(page.locator("[data-ambient-motion]")).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )
  await expect(page.locator(".animate-rainbow-vivid")).toHaveCount(1)
})
