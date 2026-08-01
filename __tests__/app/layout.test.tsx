import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "@/app/layout"

const { localFontMock } = vi.hoisted(() => ({
  localFontMock: vi.fn(({ variable }: { variable: string }) => ({
    variable: variable.replace("--", ""),
  })),
}))

vi.mock("next/font/local", () => ({
  default: localFontMock,
}))

describe("root metadata", () => {
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

  it("renders the English document and theme-provider boundary", () => {
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
  })

  it("preloads only the ExtraBold hero display font", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        display: "swap",
        preload: true,
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
