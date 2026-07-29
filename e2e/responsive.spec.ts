import { expect, test } from "@playwright/test"

const sectionAnchors = [
  "home",
  "intro",
  "about",
  "experience",
  "consultancy",
  "testimonials",
  "portfolio",
  "blog",
  "contact",
]

test.use({
  hasTouch: true,
  viewport: { width: 320, height: 568 },
})

test("keeps every section within the narrow mobile viewport", async ({
  page,
}) => {
  await page.goto("/")

  for (const anchor of sectionAnchors) {
    if (anchor !== "home") {
      await page.evaluate((destinationAnchor) => {
        window.location.hash = `#${destinationAnchor}`
      }, anchor)
    }

    await expect(page.locator("body")).toHaveClass(
      new RegExp(`fp-viewing-${anchor}`),
    )

    const horizontalLayout = await page.evaluate(() => ({
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
    }))

    expect(
      horizontalLayout.bodyScrollWidth,
      `${anchor} body overflowed horizontally`,
    ).toBeLessThanOrEqual(horizontalLayout.bodyClientWidth)
    expect(
      horizontalLayout.documentScrollWidth,
      `${anchor} document overflowed horizontally`,
    ).toBeLessThanOrEqual(horizontalLayout.documentClientWidth)
  }
})
