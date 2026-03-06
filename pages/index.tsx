import Head from "next/head"
import ReactFullpage from "@fullpage/react-fullpage"
import { useEffect, useState } from "react"
import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import Testimonials from "@/components/Testimonials"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
import PostsSection from "@/components/PostsSection"
import TopSection from "@/components/TopSection"
import Footer from "@/components/Footer"
import MedLrgDevices from "@/components/MedLrgDevices"
import getMediumPosts, { MediumPost } from "@/utils/medium"
import SectionContainer from "@/components/SectionContainer"
import dynamic from "next/dynamic"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export async function getStaticProps() {
  const posts = await getMediumPosts()
  return {
    props: {
      posts,
    },
    revalidate: 86400,
  }
}

function DisplaySections({
  posts,
}: {
  posts: MediumPost[]
}) {
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

            <div className="section flex h-screen flex-col bg-[#b9e3ff]">
              <AiConsultancySection />
            </div>

            <div className="section bg-[#FFE366]">
              <WorkExperienceSection />
            </div>

            {/*========= TESIMONIALS SECTION ========= */}
            <div className="section bg-[#FB70AA]">
              <Testimonials />
            </div>

            <div className="section bg-[#F38B57]">
              <BlogSection posts={posts} />
            </div>

            <div className="section bg-[#F38B57]">
              <PostsSection posts={posts} />
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

function useWindowWidth() {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!width) setWidth(window.innerWidth)
      const handleResize = () => setWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [width])
  return { width }
}

export default function Home({ posts }: { posts: MediumPost[] }) {
  const { width } = useWindowWidth()
  return (
    <>
      <Head>
        <title>
          Dr. Derek Austin - Senior Frontend Developer & React Software Engineer
          - @DoctorDerek
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RiveAnimation />

      {width > 0 && width < 1024 && (
        <DisplaySections
          posts={posts}
        />
      )}
      {width >= 1024 && <MedLrgDevices posts={posts} />}
    </>
  )
}
