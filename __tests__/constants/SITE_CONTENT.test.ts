import { describe, expect, it } from "vitest"
import {
  AI_CONSULTANCY_PITCH,
  BLOG_METRICS,
  CONTACT_BULLETS,
  CONTACT_COMPLETION,
  CONTACT_CTA,
  INTRO_BIO_SHORT,
  PORTFOLIO_PROJECTS,
} from "@/constants/SITE_CONTENT"

describe("site copy quality gates", () => {
  it("uses the requested end-of-site copy and CTA wording", () => {
    expect(CONTACT_COMPLETION.message).toBe(
      "You’ve reached the end of DoctorDerek.com. Let’s build something great.",
    )
    expect(CONTACT_COMPLETION.toastMessage).toBe("That’s it! Confetti time!")
    expect(CONTACT_COMPLETION.returnLabel).toBe("Back to the beginning ↑")
    expect(CONTACT_CTA).toBe("Contact Me")
  })

  it("keeps the flagship bio on-point and concise", () => {
    expect(INTRO_BIO_SHORT).toContain(
      "AI-Native Senior Full-Stack TypeScript Engineer",
    )
    expect(INTRO_BIO_SHORT).toContain("Next.js + React Native + Expo")
  })

  it("locks logistics-first consultancy positioning", () => {
    expect(AI_CONSULTANCY_PITCH.body).toContain("10× AI-native velocity")
    expect(AI_CONSULTANCY_PITCH.subtext).toContain("Employer of Record")
    expect(AI_CONSULTANCY_PITCH.subtext).toContain("1099")
    expect(AI_CONSULTANCY_PITCH.subtext).toContain("US Pacific")
  })

  it("locks key proof-point metrics", () => {
    expect(BLOG_METRICS.totalPosts).toBe(586)
    expect(BLOG_METRICS.emailSubscribers).toBeGreaterThan(700)
  })

  it("keeps portfolio narrative aligned to the job-hunt framing", () => {
    const firstProject = PORTFOLIO_PROJECTS[0]
    const doctorDerekProject = PORTFOLIO_PROJECTS[PORTFOLIO_PROJECTS.length - 1]

    expect(firstProject.projectTitle).toBe("What Are Your Values, Mapache?")
    expect(firstProject.summary).toMatch(/values game/i)
    expect(firstProject.details).toContain("Expo mobile support")

    expect(doctorDerekProject?.projectTitle).toBe("DoctorDerek.com")
    expect(doctorDerekProject?.summary).toContain(
      "cinematic, accessibility-minded experience",
    )

    const anyPhase = PORTFOLIO_PROJECTS.some(
      (project) =>
        project.summary.toLowerCase().includes("phase") ||
        project.details.toLowerCase().includes("phase"),
    )
    expect(anyPhase).toBe(false)

    const anyStoreClaims = PORTFOLIO_PROJECTS.some(
      (project) =>
        project.summary.includes("App Store") ||
        project.summary.includes("Play Store") ||
        project.details.includes("App Store") ||
        project.details.includes("Play Store"),
    )
    expect(anyStoreClaims).toBe(false)
  })

  it("guards against stale app-store claims in the values project narrative", () => {
    const mapache = PORTFOLIO_PROJECTS.find(
      (project) => project.projectTitle === "What Are Your Values, Mapache?",
    )

    expect(mapache?.details).toBeTruthy()
    expect(mapache!.details).not.toContain("App Store")
    expect(mapache!.details).not.toContain("Play Store")
  })

  it("keeps contact copy concise and evidence-driven", () => {
    expect(CONTACT_BULLETS).toHaveLength(4)
    expect(CONTACT_BULLETS[2]).toContain("code owner")
    expect(CONTACT_BULLETS[3]).toContain("under 3 months")
    expect(CONTACT_BULLETS.join(" ")).not.toContain("underperforming")
  })
})
