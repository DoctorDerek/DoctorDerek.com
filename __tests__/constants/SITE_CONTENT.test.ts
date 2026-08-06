import { describe, expect, it } from "vitest"
import { CONTACT_COMPLETION } from "@/constants/CONTACT_COMPLETION"
import * as SITE_CONTENT from "@/constants/SITE_CONTENT"

const PRIVATE_LOGISTICS_LANGUAGE =
  /\b(?:Mexico|Mexican|Puebla|EOR|1099|visa)\b|permanent resident|Employer of Record|\bW-9\b|Pacific Time|sole proprietor|invoice in USD/i

const PORTFOLIO_NARRATIVE = SITE_CONTENT.PORTFOLIO_PROJECTS.flatMap(
  ({ summary, details }) => [summary, details],
).join(" ")

describe("site copy quality gates", () => {
  it("uses the requested end-of-site copy and CTA wording", () => {
    expect(CONTACT_COMPLETION.toastMessage).toBe(
      "You’ve reached the end of DoctorDerek.com. Let’s build something great.",
    )
    expect(SITE_CONTENT.CONTACT_CTA).toBe("Contact Me")
  })

  it("keeps the flagship bio on-point and concise", () => {
    expect(SITE_CONTENT.INTRO_BIO_SHORT).toContain(
      "AI-Native Senior Full-Stack TypeScript Engineer",
    )
    expect(SITE_CONTENT.INTRO_BIO_SHORT).toContain(
      "Next.js + React Native + Expo",
    )
  })

  it("keeps the hiring target focused and excludes private logistics", () => {
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.body).toContain(
      "startup founders and small teams",
    )
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.body).toContain(
      "AI-native engineering",
    )
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.body).not.toContain("10×")
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.body).not.toContain(
      "deterministic",
    )
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.subtext).toContain(
      "long-term, full-time remote role",
    )
    expect(SITE_CONTENT.AI_CONSULTANCY_PITCH.subtext).toContain(
      "full-stack SWE and code owner",
    )
    expect(JSON.stringify(SITE_CONTENT)).not.toMatch(PRIVATE_LOGISTICS_LANGUAGE)
  })

  it("locks key proof-point metrics", () => {
    expect(SITE_CONTENT.BLOG_METRICS.totalPosts).toBe(589)
    expect(SITE_CONTENT.BLOG_METRICS.emailSubscribers).toBeGreaterThan(700)
  })

  it("keeps portfolio narrative aligned to the job-hunt framing", () => {
    const firstProject = SITE_CONTENT.PORTFOLIO_PROJECTS[0]
    const doctorDerekProject = SITE_CONTENT.PORTFOLIO_PROJECTS.at(-1)

    expect(firstProject.projectTitle).toBe("What Are Your Values, Mapache?")
    expect(firstProject.summary).toMatch(/values game/i)
    expect(firstProject.details).toContain("Expo mobile support")
    expect(firstProject.liveUrl).toBe(
      "https://www.whatareyourvaluesmapache.com/",
    )

    expect(doctorDerekProject?.projectTitle).toBe("DoctorDerek.com")
    expect(doctorDerekProject?.summary).toContain(
      "cinematic, accessibility-minded experience",
    )

    const pokedexProject = SITE_CONTENT.PORTFOLIO_PROJECTS.find(
      (project) => project.projectTitle === "Pokédex",
    )
    expect(pokedexProject?.tech).toContain("TanStack Query")
    expect(pokedexProject?.tech).not.toContain("React Query")
  })

  it("rejects stale portfolio status language", () => {
    expect(PORTFOLIO_NARRATIVE).not.toMatch(/\bphase\b/i)
    expect(PORTFOLIO_NARRATIVE).not.toMatch(/App Store|Play Store/)
  })

  it("keeps contact copy concise and evidence-driven", () => {
    expect(SITE_CONTENT.CONTACT_BULLETS).toHaveLength(4)
    expect(SITE_CONTENT.CONTACT_BULLETS[1]).toContain(
      "full-stack TypeScript products",
    )
    expect(SITE_CONTENT.CONTACT_BULLETS[1]).toContain(
      "Next.js, React Native, and Expo",
    )
    expect(SITE_CONTENT.CONTACT_BULLETS[1]).toContain("EAS Build/Submit")
    expect(SITE_CONTENT.CONTACT_BULLETS[2]).toContain("code owner")
    expect(SITE_CONTENT.CONTACT_BULLETS[3]).toContain("under 3 months")
    expect(SITE_CONTENT.CONTACT_BULLETS.join(" ")).not.toContain(
      "underperforming",
    )
  })

  it("distinguishes current self-employment from full-time product engineering", () => {
    const [selfEmployedStage, fullTimeStage] =
      SITE_CONTENT.ARCHITECT_EVOLUTION

    expect(selfEmployedStage.company).toContain("· Self-Employed |")
    expect(fullTimeStage.company).toContain("· Full-Time Product Engineering |")

    for (const { company } of [selfEmployedStage, fullTimeStage]) {
      const [, technologyStack] = company.split(" | ")

      expect(technologyStack).toContain("Node")
      expect(technologyStack).toContain("React Native + Expo")
    }
  })

  it("keeps testimonials in the approved evidence-first order", () => {
    expect(SITE_CONTENT.TESTIMONIALS.map(({ id }) => id)).toEqual([
      3, 2, 1, 6, 4, 5, 7,
    ])
    expect(SITE_CONTENT.TESTIMONIALS[0]?.name).toBe("Tori Bonagura")
  })
})
