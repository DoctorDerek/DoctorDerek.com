import { expect, test, type Page } from "@playwright/test"

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

test.describe("mobile typography", () => {
  test.use({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  test("keeps licensed fonts out of mobile startup", async ({ page }) => {
    const licensedFontAssetUrls = collectLicensedFontAssetUrls(page)

    await page.goto("/", { waitUntil: "networkidle" })

    const primaryHeadingFontFamily = await page
      .getByRole("heading", {
        level: 1,
        name: "AI-Native Senior Full-Stack TypeScript Engineer",
      })
      .evaluate((heading) => getComputedStyle(heading).fontFamily)

    expect(primaryHeadingFontFamily).toContain("Roboto")
    expect(licensedFontAssetUrls).toEqual([])
  })
})

test("preserves licensed display typography on desktop", async ({ page }) => {
  const licensedFontAssetUrls = collectLicensedFontAssetUrls(page)

  await page.goto("/", { waitUntil: "networkidle" })

  const primaryHeadingFontFamily = await page
    .getByRole("heading", {
      level: 1,
      name: "AI-Native Senior Full-Stack TypeScript Engineer",
    })
    .evaluate((heading) => getComputedStyle(heading).fontFamily)

  expect(primaryHeadingFontFamily.toLowerCase()).toContain("restora")
  expect(licensedFontAssetUrls).not.toHaveLength(0)
})
