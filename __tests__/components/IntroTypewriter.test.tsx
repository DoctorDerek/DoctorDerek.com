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

const supportingIntroductionSegments = INTRO_BIO_SHORT.split(" · ").slice(1)

describe("IntroTypewriter", () => {
  beforeEach(() => {
    typewriterOptions.current = undefined
    vi.clearAllMocks()
  })

  it("cycles through every supporting positioning segment", () => {
    render(<IntroTypewriter segments={supportingIntroductionSegments} />)

    expect(
      screen.getByText("Animated supporting introduction"),
    ).toBeInTheDocument()
    for (const introductionSegment of supportingIntroductionSegments)
      expect(typewriter.typeString).toHaveBeenCalledWith(introductionSegment)
    expect(typewriter.pauseFor).toHaveBeenCalledTimes(
      supportingIntroductionSegments.length,
    )
    expect(typewriter.pauseFor).toHaveBeenCalledWith(2000)
    expect(typewriter.deleteAll).toHaveBeenCalledTimes(
      supportingIntroductionSegments.length,
    )
    expect(typewriter.start).toHaveBeenCalledOnce()
    expect(typewriterOptions.current).toEqual({
      delay: 25,
      loop: true,
      deleteSpeed: 10,
    })
  })
})
