import { expect, test } from "@playwright/test"

test("honors system and persisted user motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const documentRoot = page.locator("html")
  const animatedBackground = page.locator(".animate-rainbow-vivid")

  await expect(documentRoot).toHaveAttribute("data-motion-preference", "system")
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(animatedBackground).toHaveCSS("animation-name", "none")

  await page
    .getByRole("button", { name: "Open navigation and settings" })
    .click()
  const motionPreference = page.getByRole("combobox", { name: "Motion" })

  await expect(motionPreference).toHaveValue("system")
  await motionPreference.selectOption("full")

  await expect(documentRoot).toHaveAttribute("data-motion-preference", "full")
  await expect(page.locator("canvas")).not.toHaveCount(0)
  await expect(animatedBackground).not.toHaveCSS("animation-name", "none")

  await motionPreference.selectOption("reduce")

  await expect(documentRoot).toHaveAttribute("data-motion-preference", "reduce")
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(animatedBackground).toHaveCSS("animation-name", "none")

  await page.reload()
  await page
    .getByRole("button", { name: "Open navigation and settings" })
    .click()

  await expect(page.getByRole("combobox", { name: "Motion" })).toHaveValue(
    "reduce",
  )
  await expect(page.locator("canvas")).toHaveCount(0)
})
