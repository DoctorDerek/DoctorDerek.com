import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { toast } from "react-hot-toast"
import { CONTACT_COMPLETION } from "@/constants/SITE_CONTENT"
import type { FullPageApi } from "@/types/MapacheFullPageProps"

const CONTACT_ANCHOR = "contact"
const END_OF_SITE_TOAST_ID = "end-of-doctorderek"
const SCROLL_END_TOLERANCE_PIXELS = 2
const TOUCH_INTENT_MINIMUM_DISTANCE_PIXELS = 24
const DOWNWARD_KEYS = new Set(["ArrowDown", "PageDown"])
const SCROLL_CONTAINER_SELECTOR = ".scrollable-content, .fp-overflow"

const isAtScrollEnd = (scrollContainer: HTMLElement) =>
  scrollContainer.scrollHeight -
    scrollContainer.scrollTop -
    scrollContainer.clientHeight <=
  SCROLL_END_TOLERANCE_PIXELS

const hasReachedContactEnd = (
  activeSection: HTMLElement,
  eventTarget: EventTarget | null,
) => {
  const eventScrollContainer =
    eventTarget instanceof Element
      ? eventTarget.closest<HTMLElement>(SCROLL_CONTAINER_SELECTOR)
      : null
  const activeSectionScrollContainer =
    activeSection.querySelector<HTMLElement>(".fp-overflow")
  const scrollContainers = [
    eventScrollContainer && activeSection.contains(eventScrollContainer)
      ? eventScrollContainer
      : null,
    activeSectionScrollContainer,
  ].filter(
    (
      scrollContainer,
      index,
      allScrollContainers,
    ): scrollContainer is HTMLElement =>
      scrollContainer !== null &&
      allScrollContainers.indexOf(scrollContainer) === index,
  )

  return scrollContainers.every(isAtScrollEnd)
}

export default function useEndOfSiteCelebration(
  fullPageApiReference: RefObject<FullPageApi | null>,
  shouldReduceMotion: boolean,
) {
  const contactVisitIsActive = useRef(false)
  const hasCelebratedThisVisit = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const [isConfettiActive, setIsConfettiActive] = useState(false)

  const beginContactVisit = useCallback(() => {
    contactVisitIsActive.current = true
    hasCelebratedThisVisit.current = false
    setIsConfettiActive(false)
  }, [])

  const endContactVisit = useCallback(() => {
    contactVisitIsActive.current = false
    setIsConfettiActive(false)
  }, [])

  const completeConfetti = useCallback(() => setIsConfettiActive(false), [])

  useEffect(() => {
    const celebrateContactEnd = (eventTarget: EventTarget | null) => {
      const activeSection = fullPageApiReference.current?.getActiveSection()

      if (
        !contactVisitIsActive.current ||
        hasCelebratedThisVisit.current ||
        activeSection?.anchor !== CONTACT_ANCHOR ||
        !hasReachedContactEnd(activeSection.item, eventTarget)
      )
        return

      hasCelebratedThisVisit.current = true
      setIsConfettiActive(!shouldReduceMotion)
      toast(CONTACT_COMPLETION.message, {
        id: END_OF_SITE_TOAST_ID,
        ariaProps: { role: "status", "aria-live": "polite" },
      })
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) celebrateContactEnd(event.target)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const eventTarget = event.target
      const isFormControl =
        eventTarget instanceof HTMLElement &&
        (eventTarget.matches("input, select, textarea") ||
          eventTarget.isContentEditable)

      if (
        !event.defaultPrevented &&
        !isFormControl &&
        DOWNWARD_KEYS.has(event.key)
      )
        celebrateContactEnd(eventTarget)
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches.item(0)?.clientY ?? null
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches.item(0)?.clientY
      const initialTouchY = touchStartY.current
      touchStartY.current = null

      if (
        initialTouchY !== null &&
        touchEndY !== undefined &&
        initialTouchY - touchEndY >= TOUCH_INTENT_MINIMUM_DISTANCE_PIXELS
      )
        celebrateContactEnd(event.target)
    }

    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: true,
    })
    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    })
    window.addEventListener("touchend", handleTouchEnd, {
      capture: true,
      passive: true,
    })

    return () => {
      window.removeEventListener("wheel", handleWheel, true)
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("touchstart", handleTouchStart, true)
      window.removeEventListener("touchend", handleTouchEnd, true)
    }
  }, [fullPageApiReference, shouldReduceMotion])

  return {
    beginContactVisit,
    completeConfetti,
    endContactVisit,
    isConfettiActive: isConfettiActive && !shouldReduceMotion,
  }
}
