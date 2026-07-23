import { expect, test, type Page } from "@playwright/test"

const CONTACT_COMPLETION_MESSAGE =
  "You’ve reached the end of DoctorDerek.com. Let’s build something great."

async function openContact(page: Page) {
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-preference",
    /system|full|reduce/,
  )
  await page
    .getByRole("button", { name: "Open navigation and settings" })
    .click()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact" })
    .click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.fp-section[data-anchor="contact"]')).toHaveClass(
    /fp-completely/,
  )
  await expect(
    page.getByRole("contentinfo", { name: "End of DoctorDerek.com" }),
  ).toBeVisible()
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
  page.getByRole("status").filter({ hasText: CONTACT_COMPLETION_MESSAGE })

test("rewards a deliberate attempt past Contact and cancels confetti on departure", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.addInitScript(() => {
    localStorage.setItem("doctorderek-motion-preference", "full")
  })
  await openContact(page)

  await expect(completionStatus(page)).toHaveCount(0)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)

  await reachContactScrollEnd(page)
  await page.mouse.wheel(0, 500)

  await expect(completionStatus(page)).toHaveCount(1)
  await expect(completionStatus(page)).toContainText(CONTACT_COMPLETION_MESSAGE)
  await expect(page.locator(".end-of-site-confetti")).toBeVisible()

  await page.mouse.wheel(0, 500)
  await expect(completionStatus(page)).toHaveCount(1)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(1)

  await page.getByRole("link", { name: "Back to the beginning ↑" }).click()
  await expect(page).toHaveURL(/#home$/)
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
  await expect(completionStatus(page)).toContainText(CONTACT_COMPLETION_MESSAGE)
  await expect(page.locator(".end-of-site-confetti")).toHaveCount(0)
})
