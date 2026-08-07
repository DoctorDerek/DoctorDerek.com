import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import BlogSection from "@/components/BlogSection"
import ClientShell from "@/components/ClientShell"
import ContactSection from "@/components/ContactSection"
import IntroSection from "@/components/IntroSection"
import Portfolio from "@/components/Portfolio"
import Testimonials from "@/components/Testimonials"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import type { SecondaryFullPageSectionContent } from "@/constants/FULLPAGE_SECTIONS"
import getMediumPosts from "@/utils/medium"

export const revalidate = 86400

export default async function Home() {
  const posts = await getMediumPosts()
  const sections = [
    { content: <IntroSection />, anchor: "intro" },
    { content: <AboutSection />, anchor: "about" },
    { content: <WorkExperienceSection />, anchor: "experience" },
    { content: <AiConsultancySection />, anchor: "consultancy" },
    { content: <Testimonials />, anchor: "testimonials" },
    { content: <Portfolio />, anchor: "portfolio" },
    { content: <BlogSection posts={posts} />, anchor: "blog" },
    { content: <ContactSection />, anchor: "contact" },
  ] satisfies readonly SecondaryFullPageSectionContent[]

  return <ClientShell sections={sections} />
}
