import { expect, test, type Page } from "@playwright/test"
import { PORTRAIT_CONTROL_ACCESSIBLE_NAMES } from "@/constants/INTERACTIONS"

const openSection = async (page: Page, anchor: "about" | "experience") => {
  await page.goto(`/#${anchor}`)
  await expect(page.locator("body")).toHaveClass(
    new RegExp(`fp-viewing-${anchor}`),
  )

  const section = page.locator(`.fp-section[data-anchor="${anchor}"]`)
  await expect(section).toHaveClass(/fp-completely/)

  return section
}

const getScrollGeometry = (section: ReturnType<Page["locator"]>) =>
  section.locator(".fp-overflow").evaluate((scrollContainer) => ({
    clientHeight: scrollContainer.clientHeight,
    scrollHeight: scrollContainer.scrollHeight,
  }))

test("keeps the About portrait and copy inside a zoom-equivalent desktop viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 960, height: 540 })
  const section = await openSection(page, "about")
  const portraitControl = page.getByRole("button", {
    name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.about,
  })
  const portraitLayout = portraitControl.locator("../..")

  await expect(portraitLayout).toHaveCSS("opacity", "1")

  const portraitBounds = await portraitControl.boundingBox()
  const scrollGeometry = await getScrollGeometry(section)

  expect(portraitBounds).not.toBeNull()
  expect(portraitBounds!.height).toBeLessThanOrEqual(540 * 0.54)
  expect(scrollGeometry.scrollHeight).toBeLessThanOrEqual(
    scrollGeometry.clientHeight + 1,
  )
})

test("keeps every desktop career milestone inside one non-scrolling timeline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 600 })
  const section = await openSection(page, "experience")
  const timeline = page.getByRole("list", { name: "Career timeline" })
  const milestoneBounds = await timeline.getByRole("listitem").evaluateAll(
    (milestones) =>
      milestones.map((milestone) => {
        const bounds = milestone.getBoundingClientRect()

        return {
          bottom: bounds.bottom,
          left: bounds.left,
          right: bounds.right,
          top: bounds.top,
        }
      }),
  )
  const scrollGeometry = await getScrollGeometry(section)

  await expect(timeline.getByRole("listitem")).toHaveCount(4)
  expect(scrollGeometry.scrollHeight).toBeLessThanOrEqual(
    scrollGeometry.clientHeight + 1,
  )

  for (const [index, milestone] of milestoneBounds.entries()) {
    expect(milestone.top).toBeGreaterThanOrEqual(0)
    expect(milestone.bottom).toBeLessThanOrEqual(600)

    const nextMilestone = milestoneBounds[index + 1]
    if (nextMilestone)
      expect(milestone.right).toBeLessThanOrEqual(nextMilestone.left + 1)
  }
})
