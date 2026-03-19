import Head from "next/head"
import ReactFullpage from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
} from "@/constants/SITE_CONTENT"

const pluginWrapper = () => {
  require("@/utils/fullpage.cinematic.min.js")
}
import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import DrMapacheSection from "@/components/DrMapacheSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import Testimonials from "@/components/Testimonials"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
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
          Dr. Derek Austin | Indie Game Dev, AI Context Engineer, Full-STack
          SWE, & Content Creator
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RiveAnimation />

      <ReactFullpage
        pluginWrapper={pluginWrapper}
        licenseKey={FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS}
        {...({
          cinematic: true,
          cinematicKey: FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
        } as any)}
        anchors={[
          "home",
          "intro",
          "about",
          "mapache",
          "experience",
          "consultancy",
          "testimonials",
          "blog",
          "contact",
          "footer",
        ]}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="section">
              <TopSection />
            </div>
            <div className="section">
              <IntroSection />
            </div>
            <div className="section">
              <AboutSection />
            </div>
            <div className="section">
              <DrMapacheSection />
            </div>
            <div className="section">
              <WorkExperienceSection />
            </div>
            <div className="section">
              <AiConsultancySection />
            </div>
            <div className="section">
              <Testimonials />
            </div>
            <div className="section">
              <BlogSection posts={posts} />
            </div>
            <div className="section">
              <ContactSection />
            </div>
            <div className="section">
              <Footer />
            </div>
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
