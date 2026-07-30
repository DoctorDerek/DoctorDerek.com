import { describe, expect, it } from "vitest"
import { metadata } from "@/app/layout"

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
})
