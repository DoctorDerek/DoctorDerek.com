import { expect, test } from "@playwright/test"

test.use({
  hasTouch: true,
  viewport: { width: 390, height: 844 },
})

test("touch users can dismiss and navigate the open overlay", async ({
  page,
}) => {
  await page.goto("/")
  await page.addStyleTag({
    content: "vercel-live-feedback { pointer-events: none !important; }",
  })

  const navigationButton = page.getByRole("button", {
    name: "Open navigation",
  })
  const navigation = page.getByRole("navigation")

  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
  await navigationButton.tap()
  await expect(navigation).not.toHaveAttribute("inert")
  const themeToggle = navigation.getByRole("button", {
    name: "Switch to light theme",
  })
  await expect(themeToggle).toBeVisible()
  await themeToggle.scrollIntoViewIfNeeded()

  const backdrop = page.getByTestId("site-navigation-backdrop")
  const backdropBounds = await backdrop.boundingBox()
  expect(backdropBounds).not.toBeNull()
  const navigationBounds = await navigation.boundingBox()
  expect(navigationBounds).not.toBeNull()

  const backdropRight = backdropBounds!.x + backdropBounds!.width
  const navigationRight = navigationBounds!.x + navigationBounds!.width
  const backdropOnlyWidth = backdropRight - navigationRight
  expect(backdropOnlyWidth).toBeGreaterThan(0)

  const backdropTapPosition = {
    x: navigationRight + backdropOnlyWidth / 2 - backdropBounds!.x,
    y: backdropBounds!.height / 2,
  }
  await backdrop.tap({
    position: backdropTapPosition,
  })
  await expect(navigation).toHaveAttribute("inert")

  await navigationButton.tap()
  await expect(navigation).not.toHaveAttribute("inert")
  const aboutLink = navigation.getByRole("link", { name: "About" })
  await expect(aboutLink).toBeVisible()
  await aboutLink.click()

  await expect(page).toHaveURL(/#about$/)
  await expect(navigation).toHaveAttribute("inert")
})
