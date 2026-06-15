import React from "react"

export type MapacheFullPageProps = {
  children?: React.ReactNode
  pluginWrapper?: () => void
  render?: (comp: { state: any; fullpageApi: any }) => React.ReactElement
  anchors?: string[]

  // Standard fullPage.js options
  licenseKey?: string
  menu?: string
  lockAnchors?: boolean
  navigation?: boolean
  navigationPosition?: "left" | "right"
  navigationTooltips?: string[]
  showActiveTooltip?: boolean
  slidesNavigation?: boolean
  slidesNavPosition?: "bottom" | "top"
  css3?: boolean
  scrollingSpeed?: number
  autoScrolling?: boolean
  fitToSection?: boolean
  fitToSectionDelay?: number
  scrollBar?: boolean
  easing?: string
  easingcss3?: string
  loopBottom?: boolean
  loopTop?: boolean
  loopHorizontal?: boolean
  continuousVertical?: boolean
  normalScrollElements?: string
  scrollOverflow?: boolean
  scrollOverflowMacStyle?: boolean
  scrollOverflowOptions?: any
  touchSensitivity?: number
  normalScrollElementTouchThreshold?: number
  bigSectionsDestination?: "top" | "bottom" | null
  keyboardScrolling?: boolean
  animateAnchor?: boolean
  recordHistory?: boolean
  controlArrows?: boolean
  verticalCentered?: boolean
  sectionsColor?: string[]
  paddingTop?: string
  paddingBottom?: string
  fixedElements?: string
  responsiveWidth?: number
  responsiveHeight?: number

  // Credits option
  credits?: { enabled?: boolean; label?: string; position?: string }

  // Extension Keys
  cardsKey?: string
  cinematicKey?: string
  continuousHorizontalKey?: string
  dragAndMoveKey?: string
  dropEffectKey?: string
  effectsKey?: string
  fadingEffectKey?: string
  interlockedSlidesKey?: string
  offsetSectionsKey?: string
  parallaxKey?: string
  resetSlidersKey?: string
  responsiveSlidesKey?: string
  scrollHorizontallyKey?: string
  scrollOverflowResetKey?: string
  waterEffectKey?: string

  // Extension toggles
  cards?: boolean | "slides" | "sections"
  cinematic?: boolean
  continuousHorizontal?: boolean
  dragAndMove?:
    | boolean
    | "vertical"
    | "horizontal"
    | "fingersonly"
    | "mouseonly"
  dropEffect?: boolean
  effects?: boolean | string
  fadingEffect?: boolean | "sections" | "slides"
  interlockedSlides?: boolean | number[]
  offsetSections?: boolean
  parallax?: boolean
  resetSliders?: boolean
  responsiveSlides?: boolean
  scrollHorizontally?: boolean
  scrollOverflowReset?: boolean | "sections" | "slides"
  waterEffect?: boolean

  // Extension options
  cardsOptions?: {
    perspective?: number
    fadeContent?: boolean
    fadeBackground?: boolean
  }
  cinematicOptions?: {
    effect?: string
    animateContent?: boolean
    contentDistance?: number
    contentEasing?: string
    contentDirection?: "left" | "right" | "up" | "down"
  }
  dropEffectOptions?: { speed?: number; color?: string; zIndex?: number }
  effectsOptions?: {
    scale?: { past?: number; future?: number }
    offset?: { past?: number; future?: number }
  }
  parallaxOptions?: {
    type?: "reveal" | "cover"
    percentage?: number
    property?: "translate" | "background"
  }
  waterEffectOptions?: {
    animateContent?: boolean
    animateOnMouseMove?: boolean
  }

  // Callbacks
  onLeave?: (origin: any, destination: any, direction: string) => void
  afterLoad?: (origin: any, destination: any, direction: string) => void
  afterRender?: () => void
  afterResize?: (width: number, height: number) => void
  afterReBuild?: () => void
  afterResponsive?: (isResponsive: boolean) => void
  afterSlideLoad?: (
    section: any,
    origin: any,
    destination: any,
    direction: string,
  ) => void
  onSlideLeave?: (
    section: any,
    origin: any,
    destination: any,
    direction: string,
  ) => void
}
