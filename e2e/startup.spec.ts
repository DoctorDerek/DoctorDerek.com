import { expect, test } from "@playwright/test"
import {
  completePostLoadQuietPeriod,
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

  await expect(ambientCanvases).toHaveCount(0)
  await waitForPostLoadQuietPeriod(page)
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
})
