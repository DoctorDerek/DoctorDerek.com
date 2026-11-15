import type { ComponentProps, ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"
import Home, { revalidate } from "@/app/page"
import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import BlogSection from "@/components/BlogSection"
import ClientShell from "@/components/ClientShell"
import ContactSection from "@/components/ContactSection"
import IntroSection from "@/components/IntroSection"
import Portfolio from "@/components/Portfolio"
import Testimonials from "@/components/Testimonials"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import getMediumPosts, { type MediumPost } from "@/utils/medium"

vi.mock("@/utils/medium", () => ({ default: vi.fn() }))

describe("public page composition", () => {
  it("passes the fetched articles and approved section order to the real client shell", async () => {
    const posts: MediumPost[] = [
      {
        title: "Engineering decisions",
        link: "https://doctorderek.medium.com/engineering-decisions",
        pubDate: "2026-11-15",
        thumbnail: "",
        description: "How I review software.",
        topics: ["TypeScript"],
      },
    ]
    vi.mocked(getMediumPosts).mockResolvedValueOnce(posts)
    const page: ReactElement<ComponentProps<typeof ClientShell>> = await Home()
    expect(page.type).toBe(ClientShell)
    expect(revalidate).toBe(86400)
    expect(page.props.sections.map((section) => section.anchor)).toEqual([
      "intro",
      "about",
      "experience",
      "consultancy",
      "testimonials",
      "portfolio",
      "blog",
      "contact",
    ])
    expect(
      page.props.sections.map(
        (section) => (section.content as ReactElement).type,
      ),
    ).toEqual([
      IntroSection,
      AboutSection,
      WorkExperienceSection,
      AiConsultancySection,
      Testimonials,
      Portfolio,
      BlogSection,
      ContactSection,
    ])
    const blog = page.props.sections[6].content as ReactElement<
      ComponentProps<typeof BlogSection>
    >
    expect(blog.props.posts).toBe(posts)
    expect(getMediumPosts).toHaveBeenCalledOnce()
  })
})
