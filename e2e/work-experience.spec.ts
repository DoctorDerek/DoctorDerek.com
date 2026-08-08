import { expect, test, type Page } from "@playwright/test"

const CAREER_ERA_COUNT = 4

const openWorkExperience = async (page: Page) => {
  await page.goto("/#experience")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-experience/)
}

for (const viewport of [
  { name: "standard desktop", width: 1440, height: 800 },
  { name: "compact desktop", width: 1280, height: 720 },
]) {
  test(`${viewport.name} shows the complete serpentine timeline without inner scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await openWorkExperience(page)

    const section = page.locator('.fp-section[data-anchor="experience"]')
    const timeline = page.getByRole("list", {
      name: "Desktop career timeline",
    })
    await expect(timeline).toBeVisible()
    await expect(timeline.locator(":scope > li")).toHaveCount(CAREER_ERA_COUNT)

    const layout = await section.evaluate((sectionElement) => {
      const overflowElement =
        sectionElement.querySelector<HTMLElement>(".fp-overflow")

      return {
        clientHeight:
          overflowElement?.clientHeight ?? sectionElement.clientHeight,
        scrollHeight:
          overflowElement?.scrollHeight ?? sectionElement.scrollHeight,
        sectionClientWidth: sectionElement.clientWidth,
        sectionScrollWidth: sectionElement.scrollWidth,
      }
    })

    expect(layout.scrollHeight).toBeLessThanOrEqual(layout.clientHeight + 1)
    expect(layout.sectionScrollWidth).toBeLessThanOrEqual(
      layout.sectionClientWidth,
    )
  })
}

test.describe("mobile career pagination", () => {
  test.use({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  test("supports arrows, direct selection, and horizontal swipe", async ({
    page,
  }) => {
    await openWorkExperience(page)

    const carousel = page.getByRole("region", { name: "Career timeline" })
    const track = carousel.getByRole("list", { name: "Career eras" })
    const careerEraControls = carousel
      .getByRole("group", { name: "Choose career era" })
      .getByRole("button")
    const previousButton = carousel.getByRole("button", {
      name: "Show previous career era",
    })
    const nextButton = carousel.getByRole("button", {
      name: "Show next career era",
    })
    await expect(carousel).toBeVisible()
    await expect(previousButton).toBeDisabled()
    await expect(nextButton).toBeEnabled()

    await nextButton.tap()
    await expect(track).toHaveCSS("transform", /matrix\(1, 0, 0, 1, -/)
    await expect(
      carousel.getByText(new RegExp(`Career era 2 of ${CAREER_ERA_COUNT}:`)),
    ).toBeAttached()
    await expect(careerEraControls.nth(1)).toHaveAttribute(
      "aria-current",
      "step",
    )

    await careerEraControls.last().tap()
    await expect(nextButton).toBeDisabled()

    await careerEraControls.first().tap()

    const bounds = await track.boundingBox()
    expect(bounds).not.toBeNull()
    const touchStart = [
      {
        identifier: 0,
        clientX: bounds!.x + bounds!.width * 0.8,
        clientY: bounds!.y + bounds!.height / 2,
      },
    ]
    const touchEnd = [
      {
        identifier: 0,
        clientX: bounds!.x + bounds!.width * 0.2,
        clientY: bounds!.y + bounds!.height / 2,
      },
    ]
    await track.dispatchEvent("touchstart", {
      changedTouches: touchStart,
      targetTouches: touchStart,
      touches: touchStart,
    })
    await track.dispatchEvent("touchend", {
      changedTouches: touchEnd,
      targetTouches: [],
      touches: [],
    })

    await expect(careerEraControls.nth(1)).toHaveAttribute(
      "aria-current",
      "step",
    )
  })

  test("removes timeline motion when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openWorkExperience(page)

    const carousel = page.getByRole("region", { name: "Career timeline" })
    const track = carousel.getByRole("list", { name: "Career eras" })
    const codeIcon = carousel.locator(".animate-float").first()

    await expect(track).toHaveCSS("transition-duration", "0s")
    await expect(codeIcon).toHaveCSS("animation-name", "none")
  })
})
