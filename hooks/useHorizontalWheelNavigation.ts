import { useEffect, useRef, type RefObject } from "react"
import type { FullPageApi } from "@/types/MapacheFullPageProps"

const HORIZONTAL_WHEEL_MINIMUM_DELTA = 8
const HORIZONTAL_WHEEL_NAVIGATION_INTERVAL_MILLISECONDS = 600
const NESTED_SCROLL_SELECTOR = '.scrollable-content, [role="dialog"]'

export default function useHorizontalWheelNavigation(
  fullPageApiReference: RefObject<FullPageApi | null>,
) {
  const lastHorizontalNavigationTime = useRef(Number.NEGATIVE_INFINITY)

  useEffect(() => {
    const handleHorizontalWheel = (event: WheelEvent) => {
      const fullPageApi = fullPageApiReference.current
      const eventTarget = event.target
      const absoluteHorizontalDelta = Math.abs(event.deltaX)
      const absoluteVerticalDelta = Math.abs(event.deltaY)

      if (
        !fullPageApi ||
        event.defaultPrevented ||
        event.ctrlKey ||
        absoluteHorizontalDelta < HORIZONTAL_WHEEL_MINIMUM_DELTA ||
        absoluteHorizontalDelta <= absoluteVerticalDelta ||
        (eventTarget instanceof Element &&
          eventTarget.closest(NESTED_SCROLL_SELECTOR)) ||
        event.timeStamp - lastHorizontalNavigationTime.current <
          HORIZONTAL_WHEEL_NAVIGATION_INTERVAL_MILLISECONDS
      )
        return

      const activeSection = fullPageApi.getActiveSection().item
      const slideCount =
        activeSection.querySelectorAll(".fp-slide, .slide").length
      if (slideCount < 2) return

      lastHorizontalNavigationTime.current = event.timeStamp
      if (event.deltaX > 0) fullPageApi.moveSlideRight()
      else fullPageApi.moveSlideLeft()
    }

    window.addEventListener("wheel", handleHorizontalWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleHorizontalWheel)
  }, [fullPageApiReference])
}
