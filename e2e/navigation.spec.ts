import { expect, test } from "@playwright/test"

test("keeps the closed drawer off the pointer path and the open drawer interactive", async ({
  page,
}) => {
  await page.goto("/")

  const navigationButton = page.getByRole("button", {
    name: "Open navigation and settings",
  })
  const navigation = page.getByRole("navigation")

  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-preference",
    "system",
  )
  await expect(navigation).toHaveAttribute("inert")
  expect(
    await page.evaluate(() =>
      document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        ?.closest("#site-navigation"),
    ),
  ).toBeNull()

  await navigationButton.click()
  await expect(navigation).not.toHaveAttribute("inert")

  await navigation.getByRole("link", { name: "About" }).click()

  await expect(page).toHaveURL(/#about$/)
  await expect(navigation).toHaveAttribute("inert")
})
