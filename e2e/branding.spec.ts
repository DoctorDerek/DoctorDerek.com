import { expect, test } from "@playwright/test"
import {
  completePostLoadQuietPeriod,
  installPostLoadQuietPeriodController,
  waitForPostLoadQuietPeriod,
} from "@/e2e/helpers/postLoadQuietPeriod"

test("publishes the professional icon and dark application manifest", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await installPostLoadQuietPeriodController(page)
  await page.goto("/")

  const activeBackground = page.locator(".mix-blend-overlay img").first()
  await expect(activeBackground).toHaveCount(0)
  await waitForPostLoadQuietPeriod(page)
  await completePostLoadQuietPeriod(page)
  await expect(activeBackground).toHaveAttribute(
    "src",
    /^\/_next\/static\/media\/Background(?:-\d)?\.[a-f0-9]+\.svg$/,
    { timeout: 15_000 },
  )
  const activeBackgroundUrl = await activeBackground.getAttribute("src")
  expect(activeBackgroundUrl).not.toBeNull()
  const activeBackgroundResponse = await request.get(activeBackgroundUrl!)
  expect(activeBackgroundResponse.ok()).toBe(true)
  expect(activeBackgroundResponse.headers()["content-type"]).toContain(
    "image/svg+xml",
  )

  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/site.webmanifest",
  )

  const iconReferences = await page
    .locator('link[rel="icon"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")))

  expect(iconReferences).toEqual(
    expect.arrayContaining([
      "/favicon.ico",
      "/favicon-16x16.png",
      "/favicon-32x32.png",
    ]),
  )
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  )

  const manifestResponse = await request.get("/site.webmanifest")
  expect(manifestResponse.ok()).toBe(true)
  const manifest: unknown = await manifestResponse.json()
  expect(manifest).toMatchObject({
    name: "DoctorDerek.com",
    short_name: "DoctorDerek",
    start_url: "/",
    scope: "/",
    theme_color: "#171126",
    background_color: "#171126",
    display: "standalone",
  })

  const faviconResponse = await request.get("/favicon.ico")
  expect(faviconResponse.ok()).toBe(true)
  expect(faviconResponse.headers()["content-type"]).toMatch(
    /^image\/(vnd\.microsoft\.icon|x-icon)/,
  )

  const applicationIconResponse = await request.get(
    "/android-chrome-512x512.png",
  )
  expect(applicationIconResponse.ok()).toBe(true)
  expect(applicationIconResponse.headers()["content-type"]).toBe("image/png")
})
