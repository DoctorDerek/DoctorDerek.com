"use client"

import ReactFullpage from "@fullpage/react-fullpage"
import dynamic from "next/dynamic"
import { useCallback, useRef, useState } from "react"
import MotionAwareAmbience from "@/components/MotionAwareAmbience"
import MotionPreferenceProvider, {
  useMotionPreference,
} from "@/components/MotionPreferenceProvider"
import TopSection from "@/components/TopSection"
import type {
  FullPageSectionContent,
  SecondaryFullPageSectionContent,
} from "@/constants/FULLPAGE_SECTIONS"
import {
  FULLPAGE_ACTIVATION_KEYS,
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
} from "@/constants/SITE_CONTENT"
import useDeferredRestoraFonts from "@/hooks/useDeferredRestoraFonts"
import useEndOfSiteCelebration from "@/hooks/useEndOfSiteCelebration"
import useHorizontalWheelNavigation from "@/hooks/useHorizontalWheelNavigation"
import usePostLoadExperienceSchedule from "@/hooks/usePostLoadExperienceSchedule"
import { GlobalStateContext } from "@/machines/globalMachine"
import {
  FullPageApi,
  FullPageSection,
  MapacheFullPageProps,
} from "@/types/MapacheFullPageProps"
import classNames from "@/utils/classNames"
import getFullPageMotionOptions from "@/utils/fullPageMotionOptions"

const EndOfSiteCelebration = dynamic(
  () => import("@/components/EndOfSiteCelebration"),
  { ssr: false },
)

/**
 * ONE-TIME EXCEPTION TO THE NO CODE COMMENTS RULE:
 * Disabled fullPage extensions must not be imported or passed at runtime. This
 * copy-ready reference intentionally stays beside pluginWrapper so a licensed
 * extension can be restored without reconstructing its wiring from Git history.
 *
 * To restore Drag And Move for some or all supported interactions:
 * 1. Verify the React wrapper and bundled fullPage core versions are compatible.
 * 2. Restore the activation-key property documented beside
 *    FULLPAGE_ACTIVATION_KEYS in constants/SITE_CONTENT.ts.
 * 3. Add this line to pluginWrapper:
 *    require("@/vendor/fullPage_js_extensions_bundle/dragAndMove/fullpage.dragAndMove.min.js")
 * 4. Add both props to MapacheFullPage:
 *    dragAndMoveKey={FULLPAGE_ACTIVATION_KEYS.dragAndMove}
 *    dragAndMove={true}
 *    Replace true with "vertical", "horizontal", "fingersonly", or "mouseonly"
 *    when only that interaction should be enabled.
 * 5. Restore all three pieces together, then run formatting, linting, coverage,
 *    the production build, cross-browser Playwright, and production Lighthouse.
 */
const pluginWrapper = () => {
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/fullpage.cinematic.core.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/burn.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/chromatic.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/doorway.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/pageCurlLeft.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/pixelate.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/shatter.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cinematic/effects/shockwave.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/cards/fullpage.cards.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/resetSliders/fullpage.resetSliders.min.js")
  require("@/vendor/fullPage_js_extensions_bundle/scrollOverflowReset/fullpage.scrollOverflowReset.min.js")
}

const MapacheFullPage =
  ReactFullpage as unknown as React.FC<MapacheFullPageProps>

function PortfolioExperience({
  sections,
}: {
  sections: readonly SecondaryFullPageSectionContent[]
}) {
  const { shouldReduceMotion } = useMotionPreference()
  const [cinematicEffect, setCinematicEffect] = useState("zoom")
  const [hasTypewriterStarted, setHasTypewriterStarted] = useState(false)
  const fullPageApiReference = useRef<FullPageApi | null>(null)
  const fullPageMotionOptions = getFullPageMotionOptions(shouldReduceMotion)
  const {
    shouldAnimateBackgroundColor,
    shouldLoadDeferredTypography,
    shouldStartRive,
  } = usePostLoadExperienceSchedule(hasTypewriterStarted)
  const handleTypewriterStarted = useCallback(
    () => setHasTypewriterStarted(true),
    [],
  )
  useDeferredRestoraFonts(shouldLoadDeferredTypography)
  useHorizontalWheelNavigation(fullPageApiReference)
  const {
    beginContactVisit,
    completeConfetti,
    endContactVisit,
    isConfettiActive,
    shouldRenderCelebrationRuntime,
  } = useEndOfSiteCelebration(fullPageApiReference, shouldReduceMotion)

  const sectionsContent = [
    {
      content: (
        <TopSection
          key="top"
          onTypewriterStarted={handleTypewriterStarted}
          shouldStartTypewriter={shouldLoadDeferredTypography}
        />
      ),
      anchor: "home",
    },
    ...sections,
  ] satisfies readonly FullPageSectionContent[]

  const handleLeave = (
    origin: FullPageSection,
    destination: FullPageSection,
  ) => {
    if (origin.anchor === "contact") endContactVisit()
    if (shouldReduceMotion) return

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

  const handleAfterLoad = (
    _origin: FullPageSection,
    destination: FullPageSection,
  ) => {
    if (destination.anchor === "contact") beginContactVisit()
    else endContactVisit()
  }

  return (
    <GlobalStateContext.Provider>
      <MotionAwareAmbience
        shouldAnimateBackgroundColor={shouldAnimateBackgroundColor}
        shouldStartRive={shouldStartRive}
      />
      {shouldRenderCelebrationRuntime && (
        <EndOfSiteCelebration
          isConfettiActive={isConfettiActive}
          onConfettiComplete={completeConfetti}
        />
      )}

      <MapacheFullPage
        {...fullPageMotionOptions}
        pluginWrapper={pluginWrapper}
        licenseKey={FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS}
        cardsKey={FULLPAGE_ACTIVATION_KEYS.cards}
        cinematicKey={FULLPAGE_ACTIVATION_KEYS.cinematic}
        resetSlidersKey={FULLPAGE_ACTIVATION_KEYS.resetSliders}
        scrollOverflowResetKey={FULLPAGE_ACTIVATION_KEYS.scrollOverflowReset}
        scrollOverflow={true}
        scrollOverflowReset={true}
        normalScrollElements=".scrollable-content, .flip-preview-control"
        loopHorizontal={false}
        resetSliders={true}
        cinematicOptions={{ effect: cinematicEffect }}
        credits={{ enabled: false }}
        anchors={sectionsContent.map((s) => s.anchor)}
        onLeave={handleLeave}
        afterLoad={handleAfterLoad}
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
                  {section.content}
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

export default function ClientShell({
  sections,
}: {
  sections: readonly SecondaryFullPageSectionContent[]
}) {
  return (
    <MotionPreferenceProvider>
      <PortfolioExperience sections={sections} />
    </MotionPreferenceProvider>
  )
}
