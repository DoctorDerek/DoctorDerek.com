"use client"

import ReactFullpage from "@fullpage/react-fullpage"
import { useRef, useState } from "react"
import AboutSection from "@/components/AboutSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
import IntroSection from "@/components/IntroSection"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"
import MotionPreferenceProvider, {
  useMotionPreference,
} from "@/components/MotionPreferenceProvider"
import Portfolio from "@/components/Portfolio"
import Testimonials from "@/components/Testimonials"
import TopSection from "@/components/TopSection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import {
  FULLPAGE_ACTIVATION_KEYS,
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
} from "@/constants/SITE_CONTENT"
import useHorizontalWheelNavigation from "@/hooks/useHorizontalWheelNavigation"
import { GlobalStateContext } from "@/machines/globalMachine"
import {
  FullPageApi,
  FullPageSection,
  MapacheFullPageProps,
} from "@/types/MapacheFullPageProps"
import classNames from "@/utils/classNames"
import getFullPageMotionOptions from "@/utils/fullPageMotionOptions"
import type { MediumPost } from "@/utils/medium"

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

function PortfolioExperience({ posts }: { posts: MediumPost[] }) {
  const { shouldReduceMotion } = useMotionPreference()
  const [cinematicEffect, setCinematicEffect] = useState("zoom")
  const fullPageApiReference = useRef<FullPageApi | null>(null)
  const fullPageMotionOptions = getFullPageMotionOptions(shouldReduceMotion)
  useHorizontalWheelNavigation(fullPageApiReference)

  const sectionsContent = [
    { component: <TopSection key="top" />, anchor: "home" },
    { component: <IntroSection key="intro" />, anchor: "intro" },
    { component: <AboutSection key="about" />, anchor: "about" },
    {
      component: <WorkExperienceSection key="experience" />,
      anchor: "experience",
    },
    {
      component: <AiConsultancySection key="consultancy" />,
      anchor: "consultancy",
    },
    { component: <Testimonials key="testimonials" />, anchor: "testimonials" },
    { component: <Portfolio key="portfolio" />, anchor: "portfolio" },
    { component: <BlogSection key="blog" posts={posts} />, anchor: "blog" },
    { component: <ContactSection key="contact" />, anchor: "contact" },
  ]

  const handleLeave = (
    _origin: FullPageSection,
    destination: FullPageSection,
  ) => {
    const transitionMatrix: Record<string, string> = {
      home: "zoom",
      intro: "zoom",
      about: "chromatic",
      experience: "pixelate",
      consultancy: "shockwave",
      portfolio: "shatter",
      testimonials: "doorway",
      blog: "pageCurlLeft",
      contact: "burn",
    }

    const nextEffect = transitionMatrix[destination.anchor] || "fade"
    setCinematicEffect(nextEffect)
  }

  return (
    <GlobalStateContext.Provider>
      <MotionAwareAmbience />

      <MapacheFullPage
        {...fullPageMotionOptions}
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
        scrollOverflow={true}
        scrollOverflowReset={true}
        responsiveSlides={false}
        normalScrollElements=".scrollable-content"
        loopHorizontal={false}
        resetSliders={true}
        cinematicOptions={{ effect: cinematicEffect }}
        credits={{ enabled: false }}
        anchors={sectionsContent.map((s) => s.anchor)}
        onLeave={shouldReduceMotion ? undefined : handleLeave}
        render={({ fullpageApi }) => {
          fullPageApiReference.current = fullpageApi
          return (
            <ReactFullpage.Wrapper>
              {sectionsContent.map((section, index) => (
                <div
                  key={section.anchor}
                  className={classNames(
                    "section",
                    section.anchor === "home" ? "fp-noscroll" : "",
                  )}
                >
                  {section.component}
                  {index < sectionsContent.length - 1 && (
                    <a
                      href={`#${sectionsContent[index + 1].anchor}`}
                      className="ease-spring-bouncy bg-site-surface-deep text-site-foreground ring-site-focus sr-only rounded-lg px-6 py-3 font-semibold ring-2 backdrop-blur-md transition-all outline-none hover:scale-105 focus:not-sr-only focus:absolute focus:right-8 focus:bottom-8 focus:z-[9999]"
                    >
                      Skip to next section ↓
                    </a>
                  )}
                </div>
              ))}
            </ReactFullpage.Wrapper>
          )
        }}
      />
    </GlobalStateContext.Provider>
  )
}

export default function ClientShell({ posts }: { posts: MediumPost[] }) {
  return (
    <MotionPreferenceProvider>
      <PortfolioExperience posts={posts} />
    </MotionPreferenceProvider>
  )
}
