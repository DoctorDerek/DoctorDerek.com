import { expect, test } from "@playwright/test"

test("animates the shared 3D entrance when motion is unrestricted", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-home/)

  const documentRoot = page.locator("html")
  const headingEntrance = page.locator(".section-heading-entrance").filter({
    has: page.locator("h2").filter({ hasText: /^About$/ }),
  })

  await expect(documentRoot).not.toHaveAttribute("data-motion-preference")
  await expect(headingEntrance).toHaveCSS("opacity", "0")
  await expect(headingEntrance).not.toHaveCSS("transform", "none")
  await expect(headingEntrance).not.toHaveCSS("transition-duration", "0s")
  const initialTransform = await headingEntrance.evaluate(
    (element) => getComputedStyle(element).transform,
  )

  await page.getByRole("button", { name: "Open navigation" }).click()
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About" })
    .click()

  await expect(page).toHaveURL(/#about$/)
  await expect(headingEntrance).toHaveCSS("opacity", "1")
  await expect
    .poll(() =>
      headingEntrance.evaluate(
        (element) => getComputedStyle(element).transform,
      ),
    )
    .not.toBe(initialTransform)
})

test("renders inactive headings statically for system reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  const headingEntrance = page.locator(".section-heading-entrance").filter({
    has: page.locator("h2").filter({ hasText: /^About$/ }),
  })

  await expect(page.locator("html")).not.toHaveAttribute(
    "data-motion-preference",
  )
  await expect(headingEntrance).toHaveCSS("opacity", "1")
  await expect(headingEntrance).toHaveCSS("transform", "none")
  await expect(headingEntrance).toHaveCSS("transition-duration", "0s")
})
