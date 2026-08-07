import type { ReactNode } from "react"

export const FULLPAGE_SECTION_ANCHORS = [
  "home",
  "intro",
  "about",
  "experience",
  "consultancy",
  "testimonials",
  "portfolio",
  "blog",
  "contact",
] as const

export type FullPageSectionAnchor = (typeof FULLPAGE_SECTION_ANCHORS)[number]

export type FullPageSectionContent = {
  anchor: FullPageSectionAnchor
  content: ReactNode
}

export type SecondaryFullPageSectionContent = FullPageSectionContent & {
  anchor: Exclude<FullPageSectionAnchor, "home">
}
