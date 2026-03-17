import Head from "next/head"
import ReactFullpage from "@fullpage/react-fullpage"
import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import DrMapacheSection from "@/components/DrMapacheSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import Testimonials from "@/components/Testimonials"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
import PostsSection from "@/components/PostsSection"
import TopSection from "@/components/TopSection"
import Footer from "@/components/Footer"
import getMediumPosts, { MediumPost } from "@/utils/medium"
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

export default function Home({ posts }: { posts: MediumPost[] }) {
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

      <ReactFullpage
        credits={{ enabled: false }}
        navigation
        normalScrollElements=".fp-noscroll"
        render={() => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section h-dvh">
                <TopSection />
              </div>

              <div className="section flex h-dvh flex-col md:flex-row">
                <IntroSection />
              </div>

              <div className="section flex h-dvh flex-col md:flex-row">
                <AboutSection />
              </div>

              <div className="section">
                <DrMapacheSection />
              </div>

              <div className="section">
                <WorkExperienceSection />
              </div>

              <div className="section max-lg:flex max-lg:h-dvh max-lg:flex-col">
                <AiConsultancySection />
              </div>

              {/*========= TESIMONIALS SECTION ========= */}
              <div className="section">
                <Testimonials />
              </div>

              <div className="section">
                <BlogSection posts={posts} />
              </div>

              <div className="section lg:hidden">
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
    </>
  )
}
