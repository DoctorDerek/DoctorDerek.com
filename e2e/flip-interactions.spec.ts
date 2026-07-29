import { expect, test, type Page } from "@playwright/test"

async function openSectionWithTouch(page: Page, name: string, anchor: string) {
  await page.getByRole("button", { name: "Open navigation" }).tap()
  const navigation = page.getByRole("navigation")
  const sectionLink = navigation.getByRole("link", { name })
  await sectionLink.scrollIntoViewIfNeeded()
  await sectionLink.tap()
  await expect(page).toHaveURL(new RegExp(`#${anchor}$`))
}

function trackPageErrors(page: Page) {
  const pageErrors: string[] = []
  page.on("pageerror", (error) => pageErrors.push(error.message))
  return pageErrors
}

test("previews the logo and activates it through pointer and keyboard input", async ({
  page,
}) => {
  const pageErrors = trackPageErrors(page)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  expect(pageErrors).toEqual([])

  const primaryLogoControl = page
    .getByRole("button", {
      name: "Show alternate DoctorDerek.com logo",
    })
    .first()
  const restingTransform = await primaryLogoControl.evaluate(
    (control) => getComputedStyle(control).transform,
  )

  await primaryLogoControl.hover()
  expect(pageErrors).toEqual([])
  await expect
    .poll(() =>
      primaryLogoControl.evaluate(
        (control) => getComputedStyle(control).transform,
      ),
    )
    .not.toBe(restingTransform)

  await primaryLogoControl.click()
  expect(pageErrors).toEqual([])

  const alternateLogoControl = page
    .getByRole("button", {
      name: "Show primary DoctorDerek.com logo",
    })
    .first()
  await expect(alternateLogoControl).toHaveAttribute("aria-pressed", "true")

  await alternateLogoControl.press("Enter")

  await expect(
    page
      .getByRole("button", {
        name: "Show alternate DoctorDerek.com logo",
      })
      .first(),
  ).toHaveAttribute("aria-pressed", "false")
  expect(pageErrors).toEqual([])
})

test("keeps the flip preview static under reduced motion", async ({ page }) => {
  const pageErrors = trackPageErrors(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  expect(pageErrors).toEqual([])

  const logoControl = page
    .getByRole("button", {
      name: "Show alternate DoctorDerek.com logo",
    })
    .first()
  const restingTransform = await logoControl.evaluate(
    (control) => getComputedStyle(control).transform,
  )

  await logoControl.focus()
  expect(pageErrors).toEqual([])

  await expect
    .poll(() =>
      logoControl.evaluate((control) => getComputedStyle(control).transform),
    )
    .toBe(restingTransform)
  await expect(logoControl).toHaveCSS("transition-duration", "0s")

  await logoControl.press("Enter")
  expect(pageErrors).toEqual([])
  await expect(
    page
      .getByRole("button", {
        name: "Show primary DoctorDerek.com logo",
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
      name: "Show next portrait of Dr. Derek Austin",
    })
    await aboutPortraitControl.tap()
    await expect
      .poll(() =>
        aboutPortraitControl.evaluate(
          (control) =>
            (control.firstElementChild as HTMLElement | null)?.style.transform,
        ),
      )
      .toBe("rotateY(180deg)")

    await page.goto("/#contact")
    await expect(page.locator("body")).toHaveClass(/fp-viewing-contact/)

    const contactPortraitControl = page.getByRole("button", {
      name: "Flip portrait of Dr. Derek Austin",
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
    await expect(
      contactPortraitControl.getByAltText("Derek Austin Sprite"),
    ).toBeVisible()
    expect(pageErrors).toEqual([])
  })
})
