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
    expect(metadata.description).toContain("six live Next.js projects")
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

  it("prevents late licensed-font swaps from delaying primary content", () => {
    expect(localFontMock).toHaveBeenCalledWith(
      expect.objectContaining({
        display: "optional",
        preload: true,
        variable: "--font-restora",
      }),
    )
  })
})
