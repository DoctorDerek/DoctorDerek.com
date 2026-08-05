import { expect, test, type Page } from "@playwright/test"
import { CONTACT_COMPLETION } from "@/constants/CONTACT_COMPLETION"

async function openContact(page: Page) {
  await page.goto("/")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)
  await page.getByRole("button", { name: "Open navigation" }).click()
  const contactLink = page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact" })
  await contactLink.scrollIntoViewIfNeeded()
  await contactLink.click()
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
  page.getByRole("status").filter({ hasText: CONTACT_COMPLETION.toastMessage })

test("rewards a deliberate attempt past Contact and cancels confetti on departure", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await openContact(page)

  await expect(completionStatus(page)).toHaveCount(0)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)

  await reachContactScrollEnd(page)
  await expect
    .poll(async () => {
      await page.mouse.wheel(0, 500)
      return completionStatus(page).count()
    })
    .toBe(1)
  await expect(completionStatus(page)).toContainText(
    CONTACT_COMPLETION.toastMessage,
  )
  await expect(page.locator(".end-of-site-confetti")).toBeVisible()

  await page.mouse.wheel(0, 500)
  await expect(completionStatus(page)).toHaveCount(1)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(1)

  await page.evaluate(() => {
    window.location.hash = "#blog"
  })
  await expect(page).toHaveURL(/#blog$/)
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
  await expect(completionStatus(page)).toContainText(
    CONTACT_COMPLETION.toastMessage,
  )
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)
})
