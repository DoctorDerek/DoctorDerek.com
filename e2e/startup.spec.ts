import { expect, test } from "@playwright/test"
import {
  completePostLoadQuietPeriod,
  expectNoDeferredIdleCallbacks,
  installDeferredIdleCallbackController,
  releaseDeferredIdleCallbacks,
  waitForDeferredIdleCallback,
  waitForPostLoadQuietPeriod,
} from "@/e2e/helpers/deferredIdleCallbacks"

test("loads Rive before deferred particles", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await installDeferredIdleCallbackController(page)
  await page.goto("/")

  const ambientCanvases = page.locator("canvas")
  const ambientBackground = page.locator("[data-ambient-motion]")
  const typewriter = page.locator(".Typewriter")

  await expect(ambientCanvases).toHaveCount(0)
  await expect(typewriter).toHaveCount(0)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )
  await expect(ambientBackground).toHaveClass(/animate-rainbow-vivid/)
  await waitForPostLoadQuietPeriod(page)
  await expectNoDeferredIdleCallbacks(page)

  await page.evaluate(() => {
    window.dispatchEvent(new PointerEvent("pointermove"))
    window.dispatchEvent(new WheelEvent("wheel"))
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }))
  })

  await expectNoDeferredIdleCallbacks(page)
  await expect(typewriter).toHaveCount(0)
  await expect(ambientCanvases).toHaveCount(0)
  await expect(ambientBackground).toHaveAttribute(
    "data-ambient-motion",
    "false",
  )

  await completePostLoadQuietPeriod(page)
  await waitForDeferredIdleCallback(page)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(0)

  await waitForDeferredIdleCallback(page)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(1)
  await expect(page.locator("canvas.absolute")).toHaveCount(0)

  await waitForDeferredIdleCallback(page)
  await expect(ambientCanvases).toHaveCount(1)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(2)
  await expect(page.locator("canvas.absolute")).toHaveCount(1)
  await expect(ambientBackground).toHaveAttribute("data-ambient-motion", "true")
  await expect(ambientBackground).toHaveClass(/animate-rainbow-vivid/)
})
