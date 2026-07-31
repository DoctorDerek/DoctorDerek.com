import { expect, test, type Page } from "@playwright/test"

const collectFontAssetUrls = (page: Page) => {
  const fontAssetUrls: string[] = []

  page.on("request", (request) => {
    if (request.resourceType() === "font") fontAssetUrls.push(request.url())
  })

  return fontAssetUrls
}

test.describe("mobile typography", () => {
  test.use({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  test("keeps licensed fonts out of mobile startup", async ({ page }) => {
    const fontAssetUrls = collectFontAssetUrls(page)

    await page.goto("/", { waitUntil: "networkidle" })

    const primaryHeadingFontFamily = await page
      .getByRole("heading", {
        level: 1,
        name: "AI-Native Senior Full-Stack TypeScript Engineer",
      })
      .evaluate((heading) => getComputedStyle(heading).fontFamily)

    expect(primaryHeadingFontFamily).toContain("Roboto")
    expect(fontAssetUrls).toEqual([])
  })
})

test("preserves licensed display typography on desktop", async ({ page }) => {
  const fontAssetUrls = collectFontAssetUrls(page)

  await page.goto("/", { waitUntil: "networkidle" })

  const primaryHeadingFontFamily = await page
    .getByRole("heading", {
      level: 1,
      name: "AI-Native Senior Full-Stack TypeScript Engineer",
    })
    .evaluate((heading) => getComputedStyle(heading).fontFamily)

  expect(primaryHeadingFontFamily.toLowerCase()).toContain("restora")
  expect(
    fontAssetUrls.some((fontAssetUrl) => fontAssetUrl.endsWith(".otf")),
  ).toBe(true)
})
