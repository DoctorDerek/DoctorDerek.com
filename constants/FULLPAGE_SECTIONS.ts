import type { ReactNode } from "react"

export type FullPageSectionAnchor =
  | "home"
  | "intro"
  | "about"
  | "experience"
  | "consultancy"
  | "testimonials"
  | "portfolio"
  | "blog"
  | "contact"

export type FullPageSectionContent = {
  anchor: FullPageSectionAnchor
  content: ReactNode
}

export type SecondaryFullPageSectionContent = FullPageSectionContent & {
  anchor: Exclude<FullPageSectionAnchor, "home">
}
