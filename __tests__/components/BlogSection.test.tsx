import { render, screen } from "@testing-library/react"
import { createElement, type ComponentProps } from "react"
import { describe, expect, it, vi } from "vitest"
import BlogSection from "@/components/BlogSection"
import { BLOG_METRICS } from "@/constants/SITE_CONTENT"
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

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({ shouldReduceMotion: false }),
}))

const POSTS: MediumPost[] = [
  {
    title: "Deterministic product engineering",
    link: "https://medium.com/deterministic-product-engineering",
    pubDate: "2026-07-18T12:00:00",
    thumbnail: "https://cdn.example.com/deterministic-engineering.jpg",
    description: "Build reliable product systems without brittle guesswork.",
    publication: "Career Programming",
    topics: [
      "Software Engineering",
      "TypeScript",
      "React",
      "UI",
      "Accessibility",
    ],
  },
  {
    title: "Designing interfaces that feel right",
    link: "https://medium.com/interfaces-that-feel-right",
    pubDate: "2026-07-17T12:00:00",
    thumbnail: "",
    description: "Treat UI and UX quality as product functionality.",
    topics: ["Product Design"],
  },
]

describe("BlogSection", () => {
  it("renders RSS publication and topic metadata without inventing thumbnails", () => {
    render(<BlogSection posts={POSTS} />)

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument()
    const publicationBadge = screen.getByText("Career Programming").closest("p")
    expect(publicationBadge).toHaveTextContent(
      "Published in Career Programming",
    )
    for (const topic of POSTS[0].topics) {
      expect(screen.getByText(topic)).toBeInTheDocument()
    }
    expect(screen.getByText(POSTS[1].topics[0])).toBeInTheDocument()
    expect(screen.getAllByText("Read on Medium →")).toHaveLength(POSTS.length)
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
    expect(
      screen.getByText(BLOG_METRICS.totalPosts.toString()),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      new RegExp(
        `Join\\s*${BLOG_METRICS.emailSubscribers}\\+ email subscribers and\\s*${BLOG_METRICS.mediumFollowers}\\+ Medium followers\\.`,
      ),
    )
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
