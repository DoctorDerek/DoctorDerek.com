import type { MapacheFullPageProps } from "@/types/MapacheFullPageProps"

const FULL_PAGE_SCROLLING_SPEED_MILLISECONDS = 700
const REDUCED_MOTION_SCROLLING_SPEED_MILLISECONDS = 0

export default function getFullPageMotionOptions(
  shouldReduceMotion: boolean,
): Pick<
  MapacheFullPageProps,
  "animateAnchor" | "cards" | "cinematic" | "scrollingSpeed"
> {
  return {
    animateAnchor: !shouldReduceMotion,
    cards: shouldReduceMotion ? false : "slides",
    cinematic: !shouldReduceMotion,
    scrollingSpeed: shouldReduceMotion
      ? REDUCED_MOTION_SCROLLING_SPEED_MILLISECONDS
      : FULL_PAGE_SCROLLING_SPEED_MILLISECONDS,
  }
}
