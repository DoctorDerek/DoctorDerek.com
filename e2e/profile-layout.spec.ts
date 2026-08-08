import { expect, test, type Page } from "@playwright/test"
import { PORTRAIT_CONTROL_ACCESSIBLE_NAMES } from "@/constants/INTERACTIONS"

const openSection = async (page: Page, anchor: "about") => {
  await page.goto(`/#${anchor}`)
  await expect(page.locator("body")).toHaveClass(
    new RegExp(`fp-viewing-${anchor}`),
  )

  const section = page.locator(`.fp-section[data-anchor="${anchor}"]`)
  await expect(section).toHaveClass(/fp-completely/)

  return section
}

test("allows browser zoom to enlarge the About portrait", async ({ page }) => {
  const zoomFactor = 1.5
  const desktopViewport = { width: 1280, height: 720 }
  const zoomedViewport = {
    width: Math.floor(desktopViewport.width / zoomFactor),
    height: Math.floor(desktopViewport.height / zoomFactor),
  }

  await page.setViewportSize(desktopViewport)
  await openSection(page, "about")
  const portraitControl = page.getByRole("button", {
    name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.about,
  })
  const desktopPortraitBounds = await portraitControl.boundingBox()

  await page.setViewportSize(zoomedViewport)
  await openSection(page, "about")
  const zoomedPortraitBounds = await portraitControl.boundingBox()

  expect(desktopPortraitBounds).not.toBeNull()
  expect(zoomedPortraitBounds).not.toBeNull()
  expect(zoomedPortraitBounds!.width * zoomFactor).toBeGreaterThan(
    desktopPortraitBounds!.width * 1.25,
  )
})
