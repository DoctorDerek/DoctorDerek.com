import Head from "next/head"
import React from "react"
import ReactFullpage from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
  SHOW_DR_MAPACHE,
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
  const sectionsContent = [
    { component: <TopSection key="top" />, anchor: "home" },
    { component: <IntroSection key="intro" />, anchor: "intro" },
    { component: <AboutSection key="about" />, anchor: "about" },
    SHOW_DR_MAPACHE && { component: <DrMapacheSection key="mapache" />, anchor: "mapache" },
    { component: <WorkExperienceSection key="experience" />, anchor: "experience" },
    { component: <AiConsultancySection key="consultancy" />, anchor: "consultancy" },
    { component: <Testimonials key="testimonials" />, anchor: "testimonials" },
    { component: <BlogSection key="blog" posts={posts} />, anchor: "blog" },
    { component: <ContactSection key="contact" />, anchor: "contact" },
    { component: <Footer key="footer" />, anchor: "footer" },
  ].filter(Boolean) as { component: React.ReactNode; anchor: string }[]

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
        anchors={sectionsContent.map((s) => s.anchor)}
        render={() => (
          <ReactFullpage.Wrapper>
            {sectionsContent.map((section) => (
              <div key={section.anchor} className="section">
                {section.component}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
