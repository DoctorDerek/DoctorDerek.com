import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "@/app/layout"

const { localFontMock } = vi.hoisted(() => ({
  localFontMock: vi.fn(({ variable }: { variable: string }) => ({
    variable: variable.replace("--", ""),
  })),
}))

vi.mock("next/font/local", () => ({
  default: localFontMock,
}))

vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}))

describe("root metadata", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("publishes the canonical production identity", () => {
    expect(metadata.metadataBase?.toString()).toBe(
      "https://www.doctorderek.com/",
    )
    expect(metadata.alternates?.canonical).toBe("/")
    expect(metadata.description).toContain("six live Next.js products")
    expect(metadata.description).toContain("92–100% Codecov coverage")
  })

  it("keeps social identity synchronized with the canonical metadata", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "/",
      siteName: "DoctorDerek.com",
      title: metadata.title,
      description: metadata.description,
    })
    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    })
  })

  it.each([
    ["production", 1],
    ["preview", 0],
    ["development", 0],
    [undefined, 0],
  ] as const)(
    "renders the document and content with the correct analytics count for VERCEL_ENV=%s",
    (deploymentEnvironment, analyticsCount) => {
      vi.stubEnv("VERCEL_ENV", deploymentEnvironment)

      render(
        <RootLayout>
          <main>Portfolio content</main>
        </RootLayout>,
      )

      expect(document.documentElement).toHaveAttribute("lang", "en")
      expect(document.body).toHaveClass(
        "font-restora-display",
        "font-restora-text",
      )
      expect(screen.getByRole("main")).toHaveTextContent("Portfolio content")
      expect(screen.queryAllByTestId("vercel-analytics")).toHaveLength(
        analyticsCount,
      )
    },
  )

  it("keeps the ExtraBold display face deferred", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        display: "swap",
        preload: false,
        variable: "--font-restora-display",
        src: [
          expect.objectContaining({
            path: "../vendor/fonts/restoraextrabold-1-webfont.woff2",
            weight: "800",
          }),
        ],
      }),
    )
  })

  it("keeps Regular and Medium text faces deferred", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        display: "swap",
        preload: false,
        variable: "--font-restora-text",
        src: [
          expect.objectContaining({
            path: "../vendor/fonts/restora-1-webfont.woff2",
            weight: "400",
          }),
          expect.objectContaining({
            path: "../vendor/fonts/restoramedium-1-webfont.woff2",
            weight: "500",
          }),
        ],
      }),
    )
  })
})
