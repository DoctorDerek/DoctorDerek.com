import { expect, test } from "@playwright/test"

test("honors the system reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const documentRoot = page.locator("html")
  const animatedBackground = page.locator(".animate-rainbow-vivid")

  await expect(documentRoot).not.toHaveAttribute("data-motion-preference")
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(animatedBackground).toHaveCSS("animation-name", "none")
})

test("keeps the full animation experience when motion is unrestricted", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")

  await expect(page.locator("html")).not.toHaveAttribute(
    "data-motion-preference",
  )
  await expect(page.locator(".animate-rainbow-vivid")).not.toHaveCSS(
    "animation-name",
    "none",
  )
})
