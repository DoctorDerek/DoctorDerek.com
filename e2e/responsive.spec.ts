import { expect, test } from "@playwright/test"

const sectionAnchors = [
  "home",
  "intro",
  "about",
  "experience",
  "consultancy",
  "testimonials",
  "portfolio",
  "blog",
  "contact",
]

test.use({
  hasTouch: true,
  viewport: { width: 320, height: 568 },
})

test("keeps every section within the narrow mobile viewport", async ({
  page,
}) => {
  await page.goto("/")

  for (const anchor of sectionAnchors) {
    if (anchor !== "home") {
      await page.evaluate((destinationAnchor) => {
        window.location.hash = `#${destinationAnchor}`
      }, anchor)
    }

    await expect(page.locator("body")).toHaveClass(
      new RegExp(`fp-viewing-${anchor}`),
    )

    const horizontalLayout = await page.evaluate(() => ({
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
    }))

    expect(
      horizontalLayout.bodyScrollWidth,
      `${anchor} body overflowed horizontally`,
    ).toBeLessThanOrEqual(horizontalLayout.bodyClientWidth)
    expect(
      horizontalLayout.documentScrollWidth,
      `${anchor} document overflowed horizontally`,
    ).toBeLessThanOrEqual(horizontalLayout.documentClientWidth)
  }
})

test("keeps Contact's email action in view while keyboard users read the complete card", async ({
  page,
}) => {
  await page.goto("/#contact")
  const contact = page.locator('.fp-section[data-anchor="contact"]')
  const card = contact.getByRole("region", { name: "Contact" })
  const email = contact.getByRole("link", { name: /email me/i })
  await expect(email).toBeInViewport({ ratio: 1 })
  await card.focus()
  await page.keyboard.press("End")
  await expect
    .poll(() =>
      card.evaluate((e) => e.scrollHeight - e.scrollTop - e.clientHeight),
    )
    .toBeLessThanOrEqual(1)
  await expect(contact).toHaveClass(/active/)
  await expect(contact.locator(".fp-overflow")).toHaveJSProperty("scrollTop", 0)
  await page.keyboard.press("Tab")
  await expect(email).toBeFocused()
})

test("short slides fit outside their intentional text scrollers", async ({
  page,
}) => {
  await page.goto("/")
  for (const section of [
    "intro",
    "experience",
    "consultancy",
    "testimonials",
  ]) {
    await page.evaluate((anchor) => {
      location.hash = "#" + anchor
    }, section)
    const active = page.locator(
      '.fp-section.active[data-anchor="' + section + '"]',
    )
    await expect(active).toBeVisible()
    const panels = active.locator(".fp-overflow")
    expect(await panels.count()).toBeGreaterThan(0)
    for (const item of await panels.all()) {
      await expect
        .poll(() => item.evaluate((e) => e.scrollHeight - e.clientHeight))
        .toBeLessThanOrEqual(1)
    }
  }
})

test("keeps short-screen Blog cards clear of slide controls", async ({
  page,
}) => {
  await page.goto("/#blog")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-blog/)

  const blogSection = page.locator('.fp-section[data-anchor="blog"]')
  const nextSlideControl = blogSection.locator(".fp-next")
  await expect(nextSlideControl).toBeVisible()
  await nextSlideControl.click()

  const activeArticleCard = blogSection.locator(
    '.fp-slide.active a[target="_blank"]',
  )
  const articleTitle = activeArticleCard.getByRole("heading", { level: 4 })
  const articleFooter = activeArticleCard.getByText("Read on Medium →")
  await expect(activeArticleCard).toBeVisible()
  await expect(articleTitle).toBeVisible()
  await expect(articleFooter).toBeVisible()

  const layout = await activeArticleCard.evaluate((articleCard) => {
    const articleCardBounds = articleCard.getBoundingClientRect()
    const articleTitleBounds = articleCard
      .querySelector("h4")!
      .getBoundingClientRect()
    const articleFooterBounds = Array.from(articleCard.querySelectorAll("p"))
      .find((paragraph) => paragraph.textContent === "Read on Medium →")!
      .getBoundingClientRect()
    const slideControlBottom = Math.max(
      ...Array.from(
        articleCard
          .closest(".fp-section")!
          .querySelectorAll(".fp-controlArrow"),
      ).map((slideControl) => slideControl.getBoundingClientRect().bottom),
    )

    return {
      articleCardBottom: articleCardBounds.bottom,
      articleCardClientHeight: articleCard.clientHeight,
      articleCardScrollHeight: articleCard.scrollHeight,
      articleFooterBottom: articleFooterBounds.bottom,
      articleTitleTop: articleTitleBounds.top,
      slideControlBottom,
    }
  })

  expect(layout.articleCardScrollHeight).toBeLessThanOrEqual(
    layout.articleCardClientHeight + 1,
  )
  expect(layout.articleTitleTop).toBeGreaterThanOrEqual(
    layout.slideControlBottom,
  )
  expect(layout.articleFooterBottom).toBeLessThanOrEqual(
    layout.articleCardBottom,
  )
})
