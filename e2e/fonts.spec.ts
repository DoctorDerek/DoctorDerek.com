import { expect, test, type Page } from "@playwright/test"
import {
  RESTORA_CSS_VARIABLE,
  RESTORA_FONT_WEIGHTS,
  RESTORA_READY_CLASSES,
} from "@/constants/TYPOGRAPHY"
import {
  installDeferredIdleCallbackController,
  releaseDeferredIdleCallbacks,
  waitForDeferredIdleCallback,
} from "@/e2e/helpers/deferredIdleCallbacks"

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
  await installDeferredIdleCallbackController(page)

  await page.goto("/", { waitUntil: "networkidle" })

  expect(await getPrimaryHeadingFontFamily(page)).toContain("Roboto")
  expect(licensedFontAssetUrls).toEqual([])

  await waitForDeferredIdleCallback(page)
  await releaseDeferredIdleCallbacks(page)

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
        const primaryRestoraFontFamily = getComputedStyle(document.body)
          .getPropertyValue(cssVariable)
          .split(",", 1)[0]
          .trim()

        return fontWeights.every((fontWeight) =>
          document.fonts.check(`${fontWeight} 1em ${primaryRestoraFontFamily}`),
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
