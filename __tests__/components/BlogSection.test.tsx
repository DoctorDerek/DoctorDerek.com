import { render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { describe, expect, it, vi } from "vitest"
import BlogSection from "@/components/BlogSection"
import type { MediumPost } from "@/utils/medium"

vi.mock("next/image", () => ({
  default: ({
    fill: _fill,
    ...imageProps
  }: ComponentProps<"img"> & {
    fill?: boolean
  }) => createElement("img", imageProps),
}))

vi.mock("@/components/ui/CountUp", () => ({
  default: ({ to }: { to: number }) => <span>{to}</span>,
}))

const POSTS: MediumPost[] = [
  {
    title: "Deterministic product engineering",
    link: "https://medium.com/deterministic-product-engineering",
    pubDate: "2026-07-18T12:00:00",
    thumbnail: "https://cdn.example.com/deterministic-engineering.jpg",
    description: "Build reliable product systems without brittle guesswork.",
    topic: "Software Engineering",
  },
  {
    title: "Designing interfaces that feel right",
    link: "https://medium.com/interfaces-that-feel-right",
    pubDate: "2026-07-17T12:00:00",
    thumbnail: "",
    description: "Treat UI and UX quality as product functionality.",
    topic: "UI",
  },
]

describe("BlogSection", () => {
  it("renders RSS topics and only shows thumbnails supplied by the feed", () => {
    render(<BlogSection posts={POSTS} />)

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument()
    expect(screen.getByText("Software Engineering")).toBeInTheDocument()
    expect(screen.getByText("UI")).toBeInTheDocument()
    expect(
      screen.getByRole("img", {
        name: "Deterministic product engineering",
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("img", {
        name: "Designing interfaces that feel right",
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByText("Jul 18, 2026")).toBeInTheDocument()
    expect(screen.getByText("Jul 17, 2026")).toBeInTheDocument()
  })

  it("keeps every article card linked to its canonical Medium URL", () => {
    render(<BlogSection posts={POSTS} />)

    expect(
      screen.getByRole("link", {
        name: /Deterministic product engineering/,
      }),
    ).toHaveAttribute(
      "href",
      "https://medium.com/deterministic-product-engineering",
    )
    expect(
      screen.getByRole("link", {
        name: /Designing interfaces that feel right/,
      }),
    ).toHaveAttribute("href", "https://medium.com/interfaces-that-feel-right")
  })
})
