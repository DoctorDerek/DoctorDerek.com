import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import RootLayout, { metadata } from "@/app/layout"

const { localFontMock } = vi.hoisted(() => ({
  localFontMock: vi.fn(() => ({ variable: "font-restora" })),
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
    expect(document.body).toHaveClass("font-restora")
    expect(screen.getByRole("main")).toHaveTextContent("Portfolio content")
  })

  it("keeps licensed fonts out of the mobile preload path", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        display: "swap",
        preload: false,
        variable: "--font-restora",
      }),
    )
  })

  it("registers the three licensed Restora faces without preloading them", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        src: [
          expect.objectContaining({ weight: "400" }),
          expect.objectContaining({ weight: "500" }),
          expect.objectContaining({ weight: "800" }),
        ],
      }),
    )
  })
})
