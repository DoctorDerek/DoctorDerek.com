import { expect, test, type Locator, type Page } from "@playwright/test"

type FullPageWindow = Window & {
  fullpage_api: {
    getFullpageData: () => {
      internals: { getState: () => { canScroll: boolean } }
    }
  }
}

async function advanceProject(page: Page) {
  await page.locator('.fp-section[data-anchor="portfolio"] .fp-next').click()
  await page.waitForFunction(
    () =>
      (window as unknown as FullPageWindow).fullpage_api
        .getFullpageData()
        .internals.getState().canScroll,
  )
}

async function openPortfolio(page: Page) {
  await page.goto("/#portfolio")
  await expect(page.locator("body")).toHaveClass(/fp-viewing-portfolio/)
  await expect(page.locator("html")).toHaveClass(/restora-display-ready/)
  await expect(page.locator("html")).toHaveClass(/restora-text-ready/)
}

async function tabToControl(page: Page, control: Locator, key = "Tab") {
  for (let step = 0; step < 5; step++) {
    await page.keyboard.press(key)
    if (await control.evaluate((element) => element === document.activeElement))
      break
    expect(
      await page
        .getByRole("dialog")
        .evaluate((element) => element.contains(document.activeElement)),
    ).toBe(true)
  }
  await expect(control).toBeFocused()
}

for (const viewport of [
  {
    name: "desktop",
    width: 1280,
    height: 720,
    requiresScrolling: false,
    textScale: 1,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
    requiresScrolling: false,
    textScale: 1,
  },
  {
    name: "short mobile",
    width: 320,
    height: 568,
    requiresScrolling: true,
    textScale: 1,
  },
  {
    name: "enlarged text",
    width: 640,
    height: 480,
    requiresScrolling: true,
    textScale: 2,
  },
  {
    name: "narrow enlarged text",
    width: 320,
    height: 844,
    requiresScrolling: true,
    textScale: 2,
  },
  {
    name: "mobile enlarged text",
    width: 390,
    height: 844,
    requiresScrolling: true,
    textScale: 2,
  },
]) {
  test.describe(viewport.name, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      contextOptions: { reducedMotion: "reduce" },
    })

    test("keeps every project readable and clear of slide controls", async ({
      page,
    }) => {
      await openPortfolio(page)
      await page.evaluate((scale) => {
        document.documentElement.style.fontSize = `${scale * 100}%`
      }, viewport.textScale)

      const section = page.locator('.fp-section[data-anchor="portfolio"]')
      const titles = await section.locator("article h3").allTextContents()

      for (const [index, title] of titles.entries()) {
        if (index > 0) await advanceProject(page)

        const card = section.locator(".fp-slide.active article")
        await expect(card.getByRole("heading")).toHaveText(title)
        await expect(card).toBeInViewport({ ratio: 1 })
        await expect(
          card.getByText("Live on web", { exact: true }),
        ).toBeVisible()

        const layout = await card.evaluate((element) => {
          const cardBounds = element.getBoundingClientRect()
          const headingBounds = element
            .closest(".fp-section")!
            .querySelector("h2")!
            .getBoundingClientRect()
          const controls = Array.from(
            element
              .closest(".fp-section")!
              .querySelectorAll(".fp-controlArrow"),
          )
            .filter((control) => getComputedStyle(control).display !== "none")
            .map((control) => control.getBoundingClientRect())

          return {
            cardTop: cardBounds.top,
            headingBottom: headingBounds.bottom,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            clientHeight: element.clientHeight,
            scrollHeight: element.scrollHeight,
            overlapsControl: controls.some(
              (control) =>
                control.left < cardBounds.right &&
                control.right > cardBounds.left &&
                control.top < cardBounds.bottom &&
                control.bottom > cardBounds.top,
            ),
          }
        })

        expect(layout.cardTop).toBeGreaterThanOrEqual(layout.headingBottom)
        expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth)
        expect(layout.overlapsControl).toBe(false)

        const explore = card.getByRole("button", { name: `Explore ${title}` })
        if (viewport.requiresScrolling) {
          await explore.scrollIntoViewIfNeeded()
          await explore.focus()
        } else {
          expect(layout.scrollHeight).toBeLessThanOrEqual(
            layout.clientHeight + 1,
          )
        }
        await expect(explore).toBeInViewport({ ratio: 1 })
        await expect(page.locator("body")).toHaveClass(/fp-viewing-portfolio/)
      }
    })
  })
}

for (const width of [320, 390]) {
  test(`keeps project status, close and links separate at ${width}px with enlarged text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openPortfolio(page)
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = "200%"
      await document.fonts.ready
    })
    const explore = page
      .locator('.fp-section[data-anchor="portfolio"] .fp-slide.active')
      .getByRole("button", { name: "Explore Mapachess", exact: true })
    await explore.click()
    const dialog = page.getByRole("dialog", { name: "Mapachess", exact: true })
    const panel = dialog.locator(".scrollable-content")
    await expect(panel).toBeVisible()
    await expect(dialog).not.toHaveAttribute("data-transition")
    const geometry = await panel.evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      const badge = element.querySelector("p")!.getBoundingClientRect()
      const close = element.querySelector("button")!.getBoundingClientRect()
      return {
        left: bounds.left,
        right: bounds.right,
        client: element.clientWidth,
        scroll: element.scrollWidth,
        overlap:
          badge.left < close.right &&
          badge.right > close.left &&
          badge.top < close.bottom &&
          badge.bottom > close.top,
      }
    })
    expect(geometry.left).toBeGreaterThanOrEqual(0)
    expect(geometry.right).toBeLessThanOrEqual(width)
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.client)
    expect(geometry.overlap).toBe(false)
    for (const label of ["View Mapachess live", "View Mapachess source"]) {
      const link = dialog.getByRole("link", { name: label, exact: true })
      await link.focus()
      await expect(link).toBeFocused()
      await expect(link).toBeVisible()
      const bounds = await link.evaluate((element) => {
        const linkBounds = element.getBoundingClientRect()
        const panel = element.closest<HTMLElement>(".scrollable-content")!
        const panelBounds = panel.getBoundingClientRect()
        return {
          left: Math.round(linkBounds.left),
          right: Math.round(linkBounds.right),
          top: Math.round(linkBounds.top),
          bottom: Math.round(linkBounds.bottom),
          visibleLeft: Math.round(
            Math.max(0, panelBounds.left + panel.clientLeft),
          ),
          visibleRight: Math.round(
            Math.min(
              innerWidth,
              panelBounds.left + panel.clientLeft + panel.clientWidth,
            ),
          ),
          visibleTop: Math.round(
            Math.max(0, panelBounds.top + panel.clientTop),
          ),
          visibleBottom: Math.round(
            Math.min(
              innerHeight,
              panelBounds.top + panel.clientTop + panel.clientHeight,
            ),
          ),
        }
      })
      expect(bounds.left).toBeGreaterThanOrEqual(bounds.visibleLeft)
      expect(bounds.right).toBeLessThanOrEqual(bounds.visibleRight)
      expect(bounds.top).toBeGreaterThanOrEqual(bounds.visibleTop)
      expect(bounds.bottom).toBeLessThanOrEqual(bounds.visibleBottom)
    }
    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeAttached()
    await expect(explore).toBeFocused()
  })
}

test("keeps expanded details and links reachable with enlarged text and keyboard focus", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 640, height: 480 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openPortfolio(page)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%"
  })

  const section = page.locator('.fp-section[data-anchor="portfolio"]')
  await advanceProject(page)
  await advanceProject(page)
  const explore = section.locator(".fp-slide.active").getByRole("button", {
    name: "Explore What Are Your Values, Mapache?",
  })
  await explore.focus()
  await expect(explore).toBeInViewport({ ratio: 1 })
  await page.keyboard.press("Enter")

  const dialog = page.getByRole("dialog", {
    name: "What Are Your Values, Mapache?",
  })
  await expect(dialog.getByRole("heading")).toBeVisible()
  await expect(dialog).not.toHaveAttribute("data-transition")
  const close = dialog.getByRole("button", { name: "Close project details" })
  await expect(dialog).toBeFocused()
  await tabToControl(page, close)
  await expect(close).toBeInViewport({ ratio: 1 })

  const live = dialog.getByRole("link", {
    name: "View What Are Your Values, Mapache? live",
  })
  await tabToControl(page, live)
  await expect(live).toBeInViewport({ ratio: 1 })
  await expect(live).toHaveAttribute(
    "href",
    "https://www.whatareyourvaluesmapache.com/",
  )

  const source = dialog.getByRole("link", {
    name: "View What Are Your Values, Mapache? source",
  })
  if (browserName === "webkit" && process.platform === "win32") {
    await tabToControl(page, close, "Shift+Tab")
    await tabToControl(page, source, "Shift+Tab")
  } else {
    await tabToControl(page, source)
  }
  await expect(source).toBeInViewport({ ratio: 1 })
  await expect(source).toHaveAttribute(
    "href",
    "https://github.com/DoctorDerek/what-are-your-values-mapache",
  )

  await tabToControl(page, close)
  await expect(close).toBeInViewport({ ratio: 1 })
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeAttached()
  await expect(explore).toBeFocused()
})
