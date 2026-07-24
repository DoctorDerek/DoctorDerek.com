import { expect, test } from "@playwright/test"

test("keeps the closed drawer off the pointer path and the open drawer interactive", async ({
  page,
}) => {
  await page.goto("/")

  const navigationButton = page.getByRole("button", {
    name: "Open navigation",
  })
  const navigation = page.getByRole("navigation")

  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
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
  const themeToggle = navigation.getByRole("button", {
    name: "Switch to light theme",
  })
  await expect(themeToggle).toBeVisible()
  await themeToggle.scrollIntoViewIfNeeded()
  await expect(navigation.getByText("Settings", { exact: true })).toHaveCount(0)
  await expect(navigation.getByText("Motion", { exact: true })).toHaveCount(0)

  await navigation.getByRole("link", { name: "About" }).click()

  await expect(page).toHaveURL(/#about$/)
  await expect(navigation).toHaveAttribute("inert")
})
