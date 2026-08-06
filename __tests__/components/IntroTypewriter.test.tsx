import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import IntroTypewriter from "@/components/IntroTypewriter"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

const { typewriter, typewriterOptions } = vi.hoisted(() => {
  const typewriterMethods = {
    deleteAll: vi.fn(),
    pauseFor: vi.fn(),
    start: vi.fn(),
    typeString: vi.fn(),
  }
  typewriterMethods.deleteAll.mockReturnValue(typewriterMethods)
  typewriterMethods.pauseFor.mockReturnValue(typewriterMethods)
  typewriterMethods.start.mockReturnValue(typewriterMethods)
  typewriterMethods.typeString.mockReturnValue(typewriterMethods)

  return {
    typewriter: typewriterMethods,
    typewriterOptions: {
      current: undefined as
        { delay: number; deleteSpeed: number; loop: boolean } | undefined,
    },
  }
})

vi.mock("typewriter-effect", () => ({
  default: ({
    onInit,
    options,
  }: {
    onInit: (instance: typeof typewriter) => void
    options: { delay: number; deleteSpeed: number; loop: boolean }
  }) => {
    typewriterOptions.current = options
    onInit(typewriter)
    return <p>Animated supporting introduction</p>
  },
}))

const introductionSegments = INTRO_BIO_SHORT.split(" · ")

describe("IntroTypewriter", () => {
  beforeEach(() => {
    typewriterOptions.current = undefined
    vi.clearAllMocks()
  })

  it("cycles through every positioning segment", () => {
    const onStarted = vi.fn()
    render(
      <IntroTypewriter onStarted={onStarted} segments={introductionSegments} />,
    )

    expect(
      screen.getByText("Animated supporting introduction"),
    ).toBeInTheDocument()
    for (const introductionSegment of introductionSegments)
      expect(typewriter.typeString).toHaveBeenCalledWith(introductionSegment)
    expect(typewriter.pauseFor).toHaveBeenCalledTimes(
      introductionSegments.length,
    )
    expect(typewriter.pauseFor).toHaveBeenCalledWith(2000)
    expect(typewriter.deleteAll).toHaveBeenCalledTimes(
      introductionSegments.length,
    )
    expect(onStarted).toHaveBeenCalledOnce()
    expect(typewriter.start).toHaveBeenCalledOnce()
    expect(typewriterOptions.current).toEqual({
      delay: 25,
      loop: true,
      deleteSpeed: 10,
    })
  })
})
