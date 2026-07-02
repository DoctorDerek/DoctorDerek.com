import React from "react"

export type FullPageSection = {
  anchor: string
  index: number
  item: HTMLElement
  isFirst: boolean
  isLast: boolean
}

export type FullPageSlide = {
  anchor: string
  index: number
  item: HTMLElement
  isFirst: boolean
  isLast: boolean
}

export type FullPageApi = {
  getActiveSection: () => FullPageSection
  getActiveSlide: () => FullPageSlide
  getScrollY: () => number
  getScrollX: () => number
  moveSectionUp: () => void
  moveSectionDown: () => void
  moveTo: (section: string | number, slide?: number) => void
  silentMoveTo: (section: string | number, slide?: number) => void
  moveSlideRight: () => void
  moveSlideLeft: () => void
  setAutoScrolling: (value: boolean) => void
  setFitToSection: (value: boolean) => void
  fitToSection: () => void
  setLockAnchors: (value: boolean) => void
  setAllowScrolling: (value: boolean, directions?: string) => void
  setKeyboardScrolling: (value: boolean, directions?: string) => void
  setRecordHistory: (value: boolean) => void
  setScrollingSpeed: (milliseconds: number) => void
  destroy: (type?: string) => void
  reBuild: () => void
  setResponsive: (value: boolean) => void
}

export type FullPageDirection = "up" | "down" | "left" | "right" | "none"
export type FullPageTrigger =
  "wheel" | "keydown" | "menu" | "nav" | "slideArrow" | "verticalNav"

export type FullPageState = {
  initialized: boolean
  sectionCount: number
  slideCount: number
  destination: FullPageSection | null
  direction: FullPageDirection | null
  lastEvent: FullPageTrigger | null
}

export type MapacheFullPageProps = {
  children?: React.ReactNode
  pluginWrapper?: () => void
  render?: (comp: {
    state: FullPageState
    fullpageApi: FullPageApi
  }) => React.ReactElement
  anchors?: string[]

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
  scrollOverflowOptions?: Record<string, unknown>
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

  credits?: { enabled?: boolean; label?: string; position?: string }

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

  cards?: boolean | "slides" | "sections"
  cinematic?: boolean
  continuousHorizontal?: boolean
  dragAndMove?:
    boolean | "vertical" | "horizontal" | "fingersonly" | "mouseonly"
  dropEffect?: boolean
  effects?:
    | boolean
    | "cards"
    | "cinematic"
    | "continuousHorizontal"
    | "dragAndMove"
    | "dropEffect"
    | "fadingEffect"
    | "interlockedSlides"
    | "offsetSections"
    | "parallax"
    | "resetSliders"
    | "responsiveSlides"
    | "scrollHorizontally"
    | "scrollOverflowReset"
    | "waterEffect"
  fadingEffect?: boolean | "sections" | "slides"
  interlockedSlides?: boolean | number[]
  offsetSections?: boolean
  parallax?: boolean
  resetSliders?: boolean
  responsiveSlides?: boolean
  scrollHorizontally?: boolean
  scrollOverflowReset?: boolean | "sections" | "slides"
  waterEffect?: boolean

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

  onLeave?: (
    origin: FullPageSection,
    destination: FullPageSection,
    direction: FullPageDirection,
    trigger?: FullPageTrigger,
  ) => void
  afterLoad?: (
    origin: FullPageSection,
    destination: FullPageSection,
    direction: FullPageDirection,
    trigger?: FullPageTrigger,
  ) => void
  afterRender?: () => void
  afterResize?: (width: number, height: number) => void
  afterReBuild?: () => void
  afterResponsive?: (isResponsive: boolean) => void
  afterSlideLoad?: (
    section: FullPageSection,
    origin: FullPageSlide,
    destination: FullPageSlide,
    direction: FullPageDirection,
    trigger?: FullPageTrigger,
  ) => void
  onSlideLeave?: (
    section: FullPageSection,
    origin: FullPageSlide,
    destination: FullPageSlide,
    direction: FullPageDirection,
    trigger?: FullPageTrigger,
  ) => void
}
