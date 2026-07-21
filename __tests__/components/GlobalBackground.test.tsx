import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import GlobalBackground from "@/components/GlobalBackground"

const { backgroundState, reducedMotionPreference } = vi.hoisted(() => ({
  backgroundState: { bgIndex: 2, bgUseInverse: false },
  reducedMotionPreference: { value: false },
}))

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({
      children,
      transition,
    }: {
      children: React.ReactNode
      transition: { duration: number }
    }) => <div data-transition-duration={transition.duration}>{children}</div>,
  },
}))

vi.mock("@/images/Background.svg", () => ({
  default: () => <svg aria-label="Background zero" />,
}))
vi.mock("@/images/Background-1.svg", () => ({
  default: () => <svg aria-label="Background one" />,
}))
vi.mock("@/images/Background-2.svg", () => ({
  default: () => <svg aria-label="Background two" />,
}))
vi.mock("@/images/Background-3.svg", () => ({
  default: () => <svg aria-label="Background three" />,
}))
vi.mock("@/images/Background-4.svg", () => ({
  default: () => <svg aria-label="Background four" />,
}))
vi.mock("@/images/Background-5.svg", () => ({
  default: () => <svg aria-label="Background five" />,
}))
vi.mock("@/images/Background-6.svg", () => ({
  default: () => <svg aria-label="Background six" />,
}))

vi.mock("@/machines/globalMachine", () => ({
  GlobalStateContext: {
    useSelector: (
      selector: (state: {
        context: { bgIndex: number; bgUseInverse: boolean }
      }) => number | boolean,
    ) => selector({ context: backgroundState }),
  },
}))

vi.mock("@/components/MotionPreferenceProvider", () => ({
  useMotionPreference: () => ({
    motionPreference: reducedMotionPreference.value ? "reduce" : "full",
    setMotionPreference: vi.fn(),
    shouldReduceMotion: reducedMotionPreference.value,
  }),
}))

vi.mock("@/components/ParticleCanvas", () => ({
  default: () => <canvas aria-label="Particle field" />,
}))

describe("GlobalBackground", () => {
  beforeEach(() => {
    backgroundState.bgIndex = 2
    backgroundState.bgUseInverse = false
    reducedMotionPreference.value = false
  })

  it("renders animated ambient layers when motion is allowed", () => {
    const { container } = render(<GlobalBackground />)

    expect(screen.getByLabelText("Particle field")).toBeInTheDocument()
    expect(
      container.querySelector('[data-transition-duration="20"]'),
    ).toBeInTheDocument()
  })

  it("uses one static background without continuous Canvas work", () => {
    reducedMotionPreference.value = true
    backgroundState.bgUseInverse = true
    const { container } = render(<GlobalBackground />)

    expect(screen.queryByLabelText("Particle field")).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-transition-duration="0"]'),
    ).toBeInTheDocument()
  })
})
