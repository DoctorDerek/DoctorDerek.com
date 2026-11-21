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

test("scrolls the Contact card with End after navigating from Home", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
  await page.getByRole("button", { name: "Open navigation" }).click()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact", exact: true })
    .click()
  await expect(page.locator("body")).toHaveClass(/fp-viewing-contact/)

  const card = page.getByRole("region", { name: "Contact", exact: true })
  await card.focus()
  await expect(card).toBeFocused()
  const remaining = () =>
    card.evaluate(
      (element) =>
        element.scrollHeight - element.clientHeight - element.scrollTop,
    )
  await expect.poll(remaining).toBeGreaterThan(1)
  await page.keyboard.press("End")
  await expect.poll(remaining).toBeLessThanOrEqual(1)
  await page.keyboard.press("Tab")
  await expect(page.getByRole("link", { name: "Email Me" })).toBeFocused()
})
