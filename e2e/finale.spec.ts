import { expect, test, type Page } from "@playwright/test"

const CONTACT_COMPLETION_TOAST = "That’s it! Confetti time!"

async function openContact(page: Page) {
  await page.goto("/")
  await page.getByRole("button", { name: "Open navigation" }).click()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact" })
    .click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.fp-section[data-anchor="contact"]')).toHaveClass(
    /fp-completely/,
  )
}

async function reachContactScrollEnd(page: Page) {
  await page
    .locator('.fp-section[data-anchor="contact"] .fp-overflow')
    .evaluateAll((scrollContainers) => {
      for (const scrollContainer of scrollContainers)
        scrollContainer.scrollTop = scrollContainer.scrollHeight
    })
}

const completionStatus = (page: Page) =>
  page.getByRole("status").filter({ hasText: CONTACT_COMPLETION_TOAST })

test("rewards a deliberate attempt past Contact and cancels confetti on departure", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await openContact(page)

  await expect(completionStatus(page)).toHaveCount(0)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)

  await reachContactScrollEnd(page)
  await page.mouse.wheel(0, 500)

  await expect(completionStatus(page)).toHaveCount(1)
  await expect(completionStatus(page)).toContainText(CONTACT_COMPLETION_TOAST)
  await expect(page.locator(".end-of-site-confetti")).toBeVisible()

  await page.mouse.wheel(0, 500)
  await expect(completionStatus(page)).toHaveCount(1)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(1)

  await page.getByRole("button", { name: "Open navigation" }).click()
  await page.getByRole("navigation").getByRole("link", { name: "About" }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)
})

test("announces the Contact boundary without confetti for reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openContact(page)
  await reachContactScrollEnd(page)

  await page.keyboard.press("PageDown")

  await expect(completionStatus(page)).toHaveCount(1)
  await expect(completionStatus(page)).toContainText(CONTACT_COMPLETION_TOAST)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)
})
