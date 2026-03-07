import ReactFullpage from "@fullpage/react-fullpage"
import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
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
            <div className="section h-screen">
              <TopSection />
            </div>

            <div className="section intro flex h-screen flex-col md:flex-row">
              <IntroSection />
            </div>

            <div className="section flex h-screen flex-col md:flex-row">
              <AboutSection />
            </div>

            <div className="section">
              <AiConsultancySection />
            </div>

            <div className="section">
              <WorkExperienceSection />
            </div>

            {/*========= TESIMONIALS SECTION ========= */}
            <div className="section">
              <Testimonials />
            </div>

            <div className="section">
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
