import { expect, test } from "@playwright/test"

test.use({
  hasTouch: true,
  viewport: { width: 390, height: 844 },
})

test("touch users can dismiss and navigate the open overlay", async ({
  page,
}) => {
  await page.goto("/")

  const navigationButton = page.getByRole("button", {
    name: "Open navigation",
  })
  const navigation = page.getByRole("navigation")

  await navigationButton.tap()
  await expect(navigation).not.toHaveAttribute("inert")
  await expect(
    navigation.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible()

  const backdrop = page.getByTestId("site-navigation-backdrop")
  const backdropBox = await backdrop.boundingBox()
  expect(backdropBox).not.toBeNull()

  await page.touchscreen.tap(
    backdropBox!.x + backdropBox!.width - 4,
    backdropBox!.y + backdropBox!.height / 2,
  )
  await expect(navigation).toHaveAttribute("inert")

  await navigationButton.tap()
  await navigation.getByRole("link", { name: "About" }).tap()

  await expect(page).toHaveURL(/#about$/)
  await expect(navigation).toHaveAttribute("inert")
})
