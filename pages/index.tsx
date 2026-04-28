import Head from "next/head"
import React, { useState } from "react"
import ReactFullpage from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_ACTIVATION_KEYS,
  SHOW_DR_MAPACHE,
} from "@/constants/SITE_CONTENT"
import { MapacheFullPageProps } from "@/types/MapacheFullPageProps"
import classNames from "@/utils/classNames"

const pluginWrapper = () => {
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/fullpage.cinematic.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cards/fullpage.cards.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/continuousHorizontal/fullpage.continuousHorizontal.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/dragAndMove/fullpage.dragAndMove.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/offsetSections/fullpage.offsetSections.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/resetSliders/fullpage.resetSliders.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/responsiveSlides/fullpage.responsiveSlides.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/scrollHorizontally/fullpage.scrollHorizontally.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/scrollOverflowReset/fullpage.scrollOverflowReset.min.js")
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
    const transitionMatrix: Record<string, string> = {
      "home": "zoom",
      "intro": "zoom",
      "about": "chromatic",
      "mapache": "pixelate",
      "experience": SHOW_DR_MAPACHE ? "shatter" : "pixelate",
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
        
        cardsKey={FULLPAGE_ACTIVATION_KEYS.cards}
        cinematicKey={FULLPAGE_ACTIVATION_KEYS.cinematic}
        continuousHorizontalKey={FULLPAGE_ACTIVATION_KEYS.continuousHorizontal}
        dragAndMoveKey={FULLPAGE_ACTIVATION_KEYS.dragAndMove}
        offsetSectionsKey={FULLPAGE_ACTIVATION_KEYS.offsetSections}
        resetSlidersKey={FULLPAGE_ACTIVATION_KEYS.resetSliders}
        responsiveSlidesKey={FULLPAGE_ACTIVATION_KEYS.responsiveSlides}
        scrollHorizontallyKey={FULLPAGE_ACTIVATION_KEYS.scrollHorizontally}
        scrollOverflowResetKey={FULLPAGE_ACTIVATION_KEYS.scrollOverflowReset}

        dragAndMove={true}
        scrollHorizontally={false}
        offsetSections={true}
        scrollOverflow={false}
        scrollOverflowReset={false}
        responsiveSlides={false}
        normalScrollElements=".scrollable-content"
        loopHorizontal={false}
        resetSliders={true}
        cards="slides"
        cinematic={true}

        cinematicOptions={{ effect: cinematicEffect }}
        credits={{ enabled: false }}
        anchors={sectionsContent.map((s) => s.anchor)}
        onLeave={handleLeave}
        
        render={() => (
          <ReactFullpage.Wrapper>
            {sectionsContent.map((section, index) => (
              <div 
                key={section.anchor} 
                className={classNames(
                  "section",
                  section.anchor === "footer" ? "fp-auto-height" : "",
                  section.anchor === "home" ? "fp-noscroll" : ""
                )}
              >
                {section.component}
                {index < sectionsContent.length - 1 && (
                  <a
                    href={`#${sectionsContent[index + 1].anchor}`}
                    className="sr-only focus:not-sr-only focus:absolute focus:bottom-8 focus:right-8 focus:z-[9999] rounded-lg bg-black/60 px-6 py-3 font-semibold text-white outline-none ring-2 ring-yellow-400 backdrop-blur-md transition-all ease-spring-bouncy hover:scale-105"
                  >
                    Skip to next section ↓
                  </a>
                )}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
