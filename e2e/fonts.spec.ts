import { expect, test, type Page } from "@playwright/test"
import {
  RESTORA_CSS_VARIABLE,
  RESTORA_FONT_WEIGHTS,
  RESTORA_READY_CLASSES,
} from "@/constants/TYPOGRAPHY"

declare global {
  interface Window {
    __deferredIdleCallbackCount: number
    __releaseDeferredIdleCallbacks: () => void
  }
}

const collectLicensedFontAssetUrls = (page: Page) => {
  const licensedFontAssetUrls: string[] = []

  page.on("request", (request) => {
    if (
      request.resourceType() === "font" &&
      new URL(request.url()).pathname.endsWith(".otf")
    )
      licensedFontAssetUrls.push(request.url())
  })

  return licensedFontAssetUrls
}

const controlPostLoadIdleReadiness = (page: Page) =>
  page.addInitScript(() => {
    const idleCallbacks = new Map<number, IdleRequestCallback>()
    let nextIdleCallbackId = 1

    window.requestIdleCallback = (callback) => {
      const idleCallbackId = nextIdleCallbackId
      nextIdleCallbackId += 1
      idleCallbacks.set(idleCallbackId, callback)
      return idleCallbackId
    }
    window.cancelIdleCallback = (idleCallbackId) =>
      idleCallbacks.delete(idleCallbackId)

    Object.defineProperty(window, "__releaseDeferredIdleCallbacks", {
      configurable: true,
      value: () => {
        const scheduledIdleCallbacks = [...idleCallbacks.values()]
        idleCallbacks.clear()
        scheduledIdleCallbacks.forEach((callback) =>
          callback({
            didTimeout: false,
            timeRemaining: () => 50,
          }),
        )
      },
    })
    Object.defineProperty(window, "__deferredIdleCallbackCount", {
      configurable: true,
      get: () => idleCallbacks.size,
    })
  })

const getPrimaryHeadingFontFamily = (page: Page) =>
  page
    .getByRole("heading", { level: 1 })
    .evaluate((heading) => getComputedStyle(heading).fontFamily)

const hasRootClass = (page: Page, className: string) =>
  page.evaluate(
    (expectedClassName) =>
      document.documentElement.classList.contains(expectedClassName),
    className,
  )

const verifyDeferredRestoraLoading = async (
  page: Page,
  shouldVerifyNetworkRequests: boolean,
) => {
  const licensedFontAssetUrls = collectLicensedFontAssetUrls(page)
  await controlPostLoadIdleReadiness(page)

  await page.goto("/", { waitUntil: "networkidle" })

  expect(await getPrimaryHeadingFontFamily(page)).toContain("Roboto")
  expect(licensedFontAssetUrls).toEqual([])

  await expect
    .poll(() => page.evaluate(() => window.__deferredIdleCallbackCount))
    .toBeGreaterThan(0)

  await page.evaluate(() => window.__releaseDeferredIdleCallbacks())

  await expect
    .poll(() => hasRootClass(page, RESTORA_READY_CLASSES.display))
    .toBe(true)
  if (shouldVerifyNetworkRequests) expect(licensedFontAssetUrls).toHaveLength(1)
  await expect
    .poll(() => getPrimaryHeadingFontFamily(page))
    .toContain("restora")

  await page.locator("body").dispatchEvent("pointerdown")

  await expect
    .poll(() => hasRootClass(page, RESTORA_READY_CLASSES.text))
    .toBe(true)
  if (shouldVerifyNetworkRequests) expect(licensedFontAssetUrls).toHaveLength(3)
  expect(
    await page.evaluate(
      ({ cssVariable, fontWeights }) => {
        const restoraFontFamily = getComputedStyle(document.body)
          .getPropertyValue(cssVariable)
          .trim()

        return fontWeights.every((fontWeight) =>
          document.fonts.check(`${fontWeight} 1em ${restoraFontFamily}`),
        )
      },
      {
        cssVariable: RESTORA_CSS_VARIABLE,
        fontWeights: Object.values(RESTORA_FONT_WEIGHTS),
      },
    ),
  ).toBe(true)
  expect(
    await page
      .locator(".restoramedium")
      .first()
      .evaluate((element) => ({
        family: getComputedStyle(element).fontFamily.toLowerCase(),
        weight: getComputedStyle(element).fontWeight,
      })),
  ).toMatchObject({ family: expect.stringContaining("restora"), weight: "500" })
}

test.describe("deferred licensed typography", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`${viewport.name} loads each Restora face only at its readiness gate`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await verifyDeferredRestoraLoading(page, viewport.name === "mobile")
    })
  }
})
