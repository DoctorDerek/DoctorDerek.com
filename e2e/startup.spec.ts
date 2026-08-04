import { expect, test } from "@playwright/test"
import { RIVE_ASSET_URLS } from "@/constants/RIVE_ASSETS"
import {
  installDeferredIdleCallbackController,
  releaseDeferredIdleCallbacks,
  waitForDeferredIdleCallback,
} from "@/e2e/helpers/deferredIdleCallbacks"

test("loads Rive before deferred particles", async ({ page }) => {
  const wasmAssetUrls: string[] = []
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.endsWith(".wasm"))
      wasmAssetUrls.push(request.url())
  })

  await page.emulateMedia({ reducedMotion: "no-preference" })
  await installDeferredIdleCallbackController(page)
  await page.goto("/")

  const ambientCanvases = page.locator("canvas")

  await expect(ambientCanvases).toHaveCount(0)
  await waitForDeferredIdleCallback(page)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(0)

  await waitForDeferredIdleCallback(page)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(1)
  await expect(page.locator("canvas.absolute")).toHaveCount(0)
  expect(wasmAssetUrls).toEqual([
    new URL(RIVE_ASSET_URLS.runtime, page.url()).href,
  ])

  await waitForDeferredIdleCallback(page)
  await expect(ambientCanvases).toHaveCount(1)
  await releaseDeferredIdleCallbacks(page)
  await expect(ambientCanvases).toHaveCount(2)
  await expect(page.locator("canvas.absolute")).toHaveCount(1)
})
