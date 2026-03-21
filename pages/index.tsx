import Head from "next/head"
import React, { useState } from "react"
import ReactFullpage from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
  SHOW_DR_MAPACHE,
} from "@/constants/SITE_CONTENT"
import { MapacheFullPageProps } from "@/types/MapacheFullPageProps"
import classNames from "@/utils/classNames"

const pluginWrapper = () => {
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/cinematic/fullpage.cinematic.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/cards/fullpage.cards.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/continuousHorizontal/fullpage.continuousHorizontal.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/dragAndMove/fullpage.dragAndMove.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/offsetSections/fullpage.offsetSections.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/resetSliders/fullpage.resetSliders.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/responsiveSlides/fullpage.responsiveSlides.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/scrollHorizontally/fullpage.scrollHorizontally.min.js")
  require("@/reference/fullPage_js/fullPage_js_extensions_bundle/scrollOverflowReset/fullpage.scrollOverflowReset.min.js")
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
  const [cinematicEffect, setCinematicEffect] = useState("zoom")

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

  const handleLeave = (origin: any, destination: any, direction: string) => {
    // 1. The Mapachito Level Design (Section-by-Section Shader Mapping)
    const transitionMatrix: Record<string, string> = {
      "home": "zoom",
      "intro": "zoom",
      "about": "chromatic",
      "mapache": "pixelate",
      "experience": SHOW_DR_MAPACHE ? "shatter" : "pixelate", // Pixelate if jumping from About straight to Experience
      "consultancy": "shockwave",
      "testimonials": "doorway",
      "blog": "pageCurlLeft",
      "contact": "burn",
      "footer": "fade",
    }
    
    const nextEffect = transitionMatrix[destination.anchor] || "fade"
    setCinematicEffect(nextEffect)
  }

  return (
    <>
      <Head>
        <title>
          Dr. Derek Austin | Indie Game Dev, AI Context Engineer, Full-Stack SWE, & Content Creator
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RiveAnimation />

      <MapacheFullPage
        pluginWrapper={pluginWrapper}
        licenseKey={FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS}
        
        // Key Injections
        cardsKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        cinematicKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        continuousHorizontalKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        dragAndMoveKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        offsetSectionsKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        resetSlidersKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        responsiveSlidesKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        scrollHorizontallyKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        scrollOverflowResetKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}

        // Extension Toggles (Deploy Globally)
        dragAndMove={true}
        scrollHorizontally={true}
        offsetSections={true}
        scrollOverflow={true}
        scrollOverflowReset={true}
        responsiveSlides={true}
        continuousHorizontal={true}
        resetSliders={true}
        cards="slides"
        cinematic={true}

        // Extension Config
        responsiveWidth={768}
        cinematicOptions={{ effect: cinematicEffect }}
        normalScrollElements=".normal-scroll-content"
        credits={{ enabled: false }}
        anchors={sectionsContent.map((s) => s.anchor)}
        onLeave={handleLeave}
        
        render={() => (
          <ReactFullpage.Wrapper>
            {sectionsContent.map((section) => (
              <div 
                key={section.anchor} 
                className={classNames("section", section.anchor === "footer" ? "fp-auto-height" : "")}
              >
                {section.component}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
