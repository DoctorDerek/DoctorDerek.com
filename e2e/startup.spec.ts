import { expect, test } from "@playwright/test"
import {
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"
import {
  completeBrowserIdleCallback,
  completePostLoadBoundary,
  installPostLoadExperienceController,
  waitForBrowserIdleCallback,
  waitForPostLoadBoundary,
} from "@/e2e/helpers/postLoadExperience"

test("loads Typewriter, Rive, and ambient layers in order", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await installPostLoadExperienceController(page)
  await page.goto("/")

  const ambientCanvases = page.locator("canvas")
  const ambientBackground = page.locator("[data-ambient-motion]")
  const backgroundPattern = ambientBackground.locator("img")
  const typewriter = page.locator(".Typewriter")

  await expect(ambientCanvases).toHaveCount(0)
  await expect(typewriter).toHaveCount(1)
  await expect(backgroundPattern).toHaveCount(1)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )
  await expect(ambientBackground).toHaveClass(/animate-rainbow-vivid/)
  await waitForPostLoadBoundary(page, DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS)
  await waitForPostLoadBoundary(page, RIVE_START_DELAY_MILLISECONDS)

  await page.evaluate(() => {
    window.dispatchEvent(new PointerEvent("pointermove"))
    window.dispatchEvent(new WheelEvent("wheel"))
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }))
  })

  await expect(typewriter).toHaveCount(1)
  await expect(ambientCanvases).toHaveCount(0)
  await expect(backgroundPattern).toHaveCount(1)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )

  await completePostLoadBoundary(page, DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS)
  await expect(ambientCanvases).toHaveCount(0)

  await completePostLoadBoundary(page, RIVE_START_DELAY_MILLISECONDS)
  await waitForBrowserIdleCallback(page)
  await expect(ambientCanvases).toHaveCount(0)

  await completeBrowserIdleCallback(page)
  await expect(ambientCanvases).toHaveCount(1)
  await expect(page.locator("canvas.absolute")).toHaveCount(0)
  await expect(backgroundPattern).toHaveCount(1)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )

  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "true",
    { timeout: 15_000 },
  )
  await expect(ambientCanvases).toHaveCount(2)
  await expect(page.locator("canvas.absolute")).toHaveCount(1)
  await expect(backgroundPattern).toHaveCount(1)
  await expect(ambientBackground).toHaveClass(/animate-rainbow-vivid/)
})
