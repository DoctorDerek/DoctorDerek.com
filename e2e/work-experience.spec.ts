import { expect, test, type Page } from "@playwright/test"
import {
  CAREER_RAIL_PATHS,
  CAREER_RAIL_STROKE_WIDTH,
} from "@/constants/CAREER_TIMELINE"
import {
  CODE_MARKER_ACTIVATION_ROTATION_DEGREES,
  SPRING_ROTATION_PRELOAD_DEGREES,
} from "@/constants/INTERACTIONS"

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

test("short desktop preserves the chronological columns and Figma rail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 600 })
  await openWorkExperience(page)

  const timeline = page.getByRole("list", {
    name: "Desktop career timeline",
  })
  const geometry = await timeline.evaluate((timelineElement) => {
    const careerEras = Array.from(
      timelineElement.querySelectorAll<HTMLElement>(":scope > li"),
    )
    const railPath = timelineElement.parentElement?.querySelector(
      '[data-career-rail="desktop"] path',
    )

    return {
      durationBounds: careerEras.map((careerEra) => {
        const bounds = careerEra
          .querySelector("p:first-of-type")!
          .getBoundingClientRect()
        return { left: bounds.left, top: bounds.top }
      }),
      markerCenters: careerEras.map((careerEra) => {
        const bounds = careerEra
          .querySelector(".flip-preview-control")!
          .getBoundingClientRect()
        return {
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
        }
      }),
      railPath: railPath?.getAttribute("d"),
      railStrokeWidth: railPath?.getAttribute("stroke-width"),
    }
  })

  const [currentEra, priorEra, olderEra, earliestEra] = geometry.durationBounds
  expect(geometry.railPath).toBe(CAREER_RAIL_PATHS.desktop)
  expect(geometry.railStrokeWidth).toBe(String(CAREER_RAIL_STROKE_WIDTH))
  expect(Math.abs(currentEra!.left - priorEra!.left)).toBeLessThan(2)
  expect(Math.abs(olderEra!.left - earliestEra!.left)).toBeLessThan(2)
  expect(olderEra!.left).toBeGreaterThan(currentEra!.left + 200)
  expect(priorEra!.top).toBeGreaterThan(currentEra!.top + 80)
  expect(olderEra!.top).toBeGreaterThan(currentEra!.top + 40)
  expect(earliestEra!.top).toBeGreaterThan(olderEra!.top + 80)

  const [currentMarker, priorMarker, olderMarker, earliestMarker] =
    geometry.markerCenters
  expect(Math.abs(currentMarker!.x - priorMarker!.x)).toBeLessThan(2)
  expect(Math.abs(olderMarker!.x - earliestMarker!.x)).toBeLessThan(2)
  expect(olderMarker!.x).toBeGreaterThan(currentMarker!.x + 200)
})

test("desktop code markers focus opposite their repeated forward spin", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await openWorkExperience(page)

  const markerControl = page
    .getByRole("list", { name: "Desktop career timeline" })
    .locator(".flip-preview-control")
    .first()
  const previewLayer = markerControl.locator(".flip-preview-visual")
  const rotationLayer = previewLayer.locator(":scope > .ease-spring-rotation")
  const markerBounds = await markerControl.boundingBox()

  expect(markerBounds).not.toBeNull()
  expect(markerBounds!.height).toBeGreaterThanOrEqual(44)
  expect(markerBounds!.width).toBeGreaterThanOrEqual(44)

  await markerControl.focus()
  await expect(previewLayer).toHaveAttribute(
    "style",
    new RegExp(`rotateY\\(${SPRING_ROTATION_PRELOAD_DEGREES}deg\\)`),
  )

  await markerControl.press("Enter")
  await expect(rotationLayer).toHaveAttribute(
    "style",
    new RegExp(`rotateY\\(${CODE_MARKER_ACTIVATION_ROTATION_DEGREES}deg\\)`),
  )

  await markerControl.press("Enter")
  await expect(rotationLayer).toHaveAttribute(
    "style",
    new RegExp(
      `rotateY\\(${CODE_MARKER_ACTIVATION_ROTATION_DEGREES * 2}deg\\)`,
    ),
  )
})

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
    await expect(
      carousel.locator('[data-career-rail="mobile"] path'),
    ).toHaveAttribute("d", CAREER_RAIL_PATHS.mobile)
    await expect(previousButton).toBeDisabled()
    await expect(nextButton).toBeEnabled()
    const markerControls = carousel.locator(".flip-preview-control")
    const firstMarkerControl = markerControls.first()
    const firstMarkerAccessibleName =
      await firstMarkerControl.getAttribute("aria-label")
    expect(firstMarkerAccessibleName).toBeTruthy()
    await expect(firstMarkerControl).toBeVisible()
    await expect(markerControls).toHaveCount(1)
    const careerEraControlSizes = await careerEraControls.evaluateAll(
      (controls) =>
        controls.map((control) => {
          const bounds = control.getBoundingClientRect()
          return { height: bounds.height, width: bounds.width }
        }),
    )
    for (const controlSize of careerEraControlSizes) {
      expect(controlSize.height).toBeGreaterThanOrEqual(24)
      expect(controlSize.width).toBeGreaterThanOrEqual(24)
    }

    const horizontalOverflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(horizontalOverflow.scrollWidth).toBeLessThanOrEqual(
      horizontalOverflow.clientWidth,
    )

    await nextButton.tap()
    await expect(track).toHaveCSS("transform", /matrix\(1, 0, 0, 1, -/)
    await expect(
      carousel.getByText(new RegExp(`Career era 2 of ${CAREER_ERA_COUNT}:`)),
    ).toBeAttached()
    await expect(careerEraControls.nth(1)).toHaveAttribute(
      "aria-current",
      "step",
    )
    await expect(markerControls).toHaveCount(1)
    await expect(markerControls.first()).not.toHaveAttribute(
      "aria-label",
      firstMarkerAccessibleName!,
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
    await expect(carousel.locator(".flip-preview-control")).toHaveCount(0)
  })
})
