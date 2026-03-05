import ReactFullpage from "@fullpage/react-fullpage"
import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import Portfolio from "@/components/Portfolio"
import Testimonials from "@/components/Testimonials"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
import TopSection from "@/components/TopSection"
import Footer from "@/components/Footer"
import { MediumPost } from "@/utils/medium"

export default function MedLrgDevices({ posts }: { posts: MediumPost[] }) {
  return (
    <ReactFullpage
      credits={{ enabled: false }}
      navigation
      render={() => {
        return (
          <ReactFullpage.Wrapper>
            <div className="section h-screen bg-[#FFE366]">
              <TopSection />
            </div>

            <div className="section intro flex h-screen flex-col bg-[#FFE366] md:flex-row">
              <IntroSection />
            </div>

            <div className="section flex h-screen flex-col bg-[#b9e3ff] md:flex-row">
              <AboutSection />
            </div>

            <div className="section bg-[#b9e3ff]">
              <AiConsultancySection />
            </div>

            <div className="section bg-[#FFE366]">
              <WorkExperienceSection />
            </div>

            <div className="section bg-[#FB70AA]">
              <Portfolio />
            </div>

            <div className="section bg-[#FB70AA]">
              <Testimonials />
            </div>

            <div className="section bg-[#F38B57]">
              <BlogSection posts={posts} />
            </div>

            <div className="section">
              <ContactSection />
            </div>

            <div className="section fp-auto-height">
              <Footer />
            </div>
          </ReactFullpage.Wrapper>
        )
      }}
    />
  )
}
