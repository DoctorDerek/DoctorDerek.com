import { expect, test, type Page } from "@playwright/test"
import {
  LOGO_CONTROL_ACCESSIBLE_NAMES,
  PORTRAIT_CONTROL_ACCESSIBLE_NAMES,
} from "@/constants/INTERACTIONS"

const VERCEL_TOOLBAR_STORAGE_ERROR =
  "TypeError: undefined is not an object (evaluating 'navigator.storage.persisted')"
const VERCEL_TOOLBAR_SOURCE =
  "https://vercel.live/_next-live/feedback/feedback.html"

async function openSectionWithTouch(page: Page, name: string, anchor: string) {
  await page.getByRole("button", { name: "Open navigation" }).tap()
  const navigation = page.getByRole("navigation")
  const sectionLink = navigation.getByRole("link", { name })
  await sectionLink.scrollIntoViewIfNeeded()
  await sectionLink.tap()
  await expect(page).toHaveURL(new RegExp(`#${anchor}$`))
}

const isVercelToolbarWebKitStorageError = (error: Error) =>
  error.message === VERCEL_TOOLBAR_STORAGE_ERROR &&
  error.stack?.includes(VERCEL_TOOLBAR_SOURCE) === true

function trackPageErrors(page: Page) {
  const pageErrors: string[] = []
  page.on("pageerror", (error) => {
    if (!isVercelToolbarWebKitStorageError(error))
      pageErrors.push(error.message)
  })
  return pageErrors
}

test("previews the logo and activates it through pointer and keyboard input", async ({
  page,
}) => {
  const pageErrors = trackPageErrors(page)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
  expect(pageErrors).toEqual([])

  const primaryLogoControl = page
    .getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
    })
    .first()
  const primaryLogoPreview = primaryLogoControl.locator(".flip-preview-visual")
  const restingTransform = await primaryLogoPreview.evaluate(
    (preview) => getComputedStyle(preview).transform,
  )

  await primaryLogoControl.hover()
  expect(pageErrors).toEqual([])
  await expect
    .poll(() =>
      primaryLogoPreview.evaluate(
        (preview) => getComputedStyle(preview).transform,
      ),
    )
    .not.toBe(restingTransform)

  await primaryLogoControl.click()
  expect(pageErrors).toEqual([])
  const alternateLogoControl = page
    .getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showPrimary,
    })
    .first()
  await expect(alternateLogoControl).toHaveAttribute("aria-pressed", "true")
  await expect
    .poll(() =>
      alternateLogoControl
        .locator(".wrapper")
        .evaluate((card) => (card as HTMLElement).style.transform),
    )
    .toBe("rotateY(180deg)")

  await alternateLogoControl.press("Enter")

  const restoredLogoControl = page
    .getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
    })
    .first()
  await expect(restoredLogoControl).toHaveAttribute("aria-pressed", "false")
  await expect
    .poll(() =>
      restoredLogoControl
        .locator(".wrapper")
        .evaluate((card) => (card as HTMLElement).style.transform),
    )
    .toBe("rotateY(360deg)")
  expect(pageErrors).toEqual([])
})

test("keeps the flip preview static under reduced motion", async ({ page }) => {
  const pageErrors = trackPageErrors(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
  expect(pageErrors).toEqual([])

  const logoControl = page
    .getByRole("button", {
      name: LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative,
    })
    .first()
  const logoPreview = logoControl.locator(".flip-preview-visual")
  const restingTransform = await logoPreview.evaluate(
    (preview) => getComputedStyle(preview).transform,
  )

  await logoControl.focus()
  expect(pageErrors).toEqual([])

  await expect
    .poll(() =>
      logoPreview.evaluate((preview) => getComputedStyle(preview).transform),
    )
    .toBe(restingTransform)
  await expect(logoPreview).toHaveCSS("transition-duration", "0s")

  await logoControl.press("Enter")
  expect(pageErrors).toEqual([])
  await expect(
    page
      .getByRole("button", {
        name: LOGO_CONTROL_ACCESSIBLE_NAMES.showPrimary,
      })
      .first(),
  ).toHaveAttribute("aria-pressed", "true")
  expect(pageErrors).toEqual([])
})

test.describe("touch portrait controls", () => {
  test.use({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  test("flips the About and Contact portraits without hover", async ({
    page,
  }) => {
    const pageErrors = trackPageErrors(page)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await openSectionWithTouch(page, "About", "about")

    const aboutPortraitControl = page.getByRole("button", {
      name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.about,
    })
    const aboutPortraitCard = aboutPortraitControl.locator(
      ".flip-preview-visual > div",
    )
    await aboutPortraitControl.tap()
    await expect
      .poll(() =>
        aboutPortraitCard.evaluate(
          (portraitCard) => (portraitCard as HTMLElement).style.transform,
        ),
      )
      .toBe("rotateY(180deg)")

    await page.goto("/#contact")
    await expect(page.locator("body")).toHaveClass(/fp-viewing-contact/)

    const contactPortraitControl = page.getByRole("button", {
      name: PORTRAIT_CONTROL_ACCESSIBLE_NAMES.contact,
    })
    await contactPortraitControl.tap()

    await expect(contactPortraitControl).toHaveAttribute("aria-pressed", "true")
    await expect
      .poll(() =>
        contactPortraitControl
          .locator(".wrapper")
          .evaluate((card) => (card as HTMLElement).style.transform),
      )
      .toBe("rotateY(180deg)")
    const contactPortraitMosaic = contactPortraitControl.locator(
      ".contact-portrait-mosaic",
    )
    await expect(contactPortraitMosaic).toBeVisible()
    await expect(contactPortraitMosaic.locator("img")).toHaveCount(3)

    await contactPortraitControl.tap()
    await expect(contactPortraitControl).toHaveAttribute(
      "aria-pressed",
      "false",
    )
    await expect
      .poll(() =>
        contactPortraitControl
          .locator(".wrapper")
          .evaluate((card) => (card as HTMLElement).style.transform),
      )
      .toBe("rotateY(360deg)")
    expect(pageErrors).toEqual([])
  })
})
