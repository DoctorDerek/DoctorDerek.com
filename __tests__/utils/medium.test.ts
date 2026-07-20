import { beforeEach, describe, expect, it, vi } from "vitest"
import getMediumPosts from "@/utils/medium"

const { parseURLMock } = vi.hoisted(() => ({
  parseURLMock: vi.fn(),
}))

vi.mock("rss-parser", () => ({
  default: class ParserMock {
    parseURL = parseURLMock
  },
}))

describe("getMediumPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("maps readable topics while decoding copy and rejecting tracking pixels", async () => {
    parseURLMock.mockResolvedValue({
      items: [
        {
          title:
            "&#x1F99D; &#129437; &quot;quoted&quot; &apos;apostrophe&apos; &amp; &lt;tag&gt; &rsquo;right &lsquo;left &rdquo;close &ldquo;open &mdash; &ndash; &hellip; &nbsp;space",
          link: "https://medium.com/article",
          pubDate: "2026-07-18",
          categories: ["web-development"],
          "content:encoded":
            '<p>Primary &amp; text</p><img src="https://cdn.example.com/article.jpg">',
        },
        {
          title: "Interface design",
          link: "https://medium.com/interface-design",
          pubDate: "2026-07-17",
          categories: ["ui"],
          content:
            '<p>Secondary text</p><img src="https://medium.com/stat?event=post.clientViewed"><img src="https://stat.medium.com/tracking.gif">',
        },
      ],
    })

    const posts = await getMediumPosts()

    expect(parseURLMock).toHaveBeenCalledWith(
      "https://medium.com/feed/@doctorderek",
    )
    expect(posts[0]).toMatchObject({
      link: "https://medium.com/article",
      pubDate: "2026-07-18",
      thumbnail: "https://cdn.example.com/article.jpg",
      description: "Primary & text...",
      topic: "Web Development",
    })
    expect(posts[0].title).toContain("🦝 🦝 ”quoted” ’apostrophe’")
    expect(posts[0].title).toContain("& <tag> ’right ‘left ”close “open — – …")
    expect(posts[1]).toMatchObject({
      thumbnail: "",
      description: "Secondary text...",
      topic: "UI",
    })
  })

  it("uses description and empty-feed fallbacks without inventing a topic", async () => {
    parseURLMock.mockResolvedValue({
      items: [
        {
          title: "AI systems",
          categories: ["AI-native"],
          description: "Fallback &hellip;",
        },
        {},
      ],
    })

    const posts = await getMediumPosts()

    expect(posts[0]).toMatchObject({
      link: "",
      pubDate: "",
      thumbnail: "",
      description: "Fallback …...",
      topic: "AI Native",
    })
    expect(posts[1]).toEqual({
      title: "",
      link: "",
      pubDate: "",
      thumbnail: "",
      description: "...",
      topic: "Article",
    })
  })
})
