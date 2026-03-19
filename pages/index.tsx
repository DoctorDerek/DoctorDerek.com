import Head from "next/head"
import ReactFullpage from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
} from "@/constants/SITE_CONTENT"
import { MapacheFullPageProps } from "@/types/MapacheFullPageProps"

const pluginWrapper = () => {
  require("@/utils/fullpage.cinematic.min.js")
}

const MapacheFullPage =
  ReactFullpage as unknown as React.FC<MapacheFullPageProps>

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
  const sections = [
    <TopSection key="top" />,
    <IntroSection key="intro" />,
    <AboutSection key="about" />,
    <DrMapacheSection key="mapache" />,
    <WorkExperienceSection key="experience" />,
    <AiConsultancySection key="consultancy" />,
    <Testimonials key="testimonials" />,
    <BlogSection key="blog" posts={posts} />,
    <ContactSection key="contact" />,
    <Footer key="footer" />,
  ]

  return (
    <>
      <Head>
        <title>
          Dr. Derek Austin | Indie Game Dev, AI Context Engineer, Full-Stack
          SWE, & Content Creator
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RiveAnimation />

      <MapacheFullPage
        pluginWrapper={pluginWrapper}
        licenseKey={FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS}
        cinematic={true}
        cinematicKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        credits={{ enabled: false }}
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
            {sections.map((section) => (
              <div key={section.key} className="section">
                {section}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
