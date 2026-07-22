import { describe, expect, it } from "vitest"
import getFullPageMotionOptions from "@/utils/fullPageMotionOptions"

describe("getFullPageMotionOptions", () => {
  it("preserves the complete cinematic experience when motion is allowed", () => {
    expect(getFullPageMotionOptions(false)).toEqual({
      animateAnchor: true,
      cards: "slides",
      cinematic: true,
      scrollingSpeed: 700,
    })
  })

  it("uses instantaneous non-cinematic navigation when motion is reduced", () => {
    expect(getFullPageMotionOptions(true)).toEqual({
      animateAnchor: false,
      cards: false,
      cinematic: false,
      scrollingSpeed: 0,
    })
  })
})
