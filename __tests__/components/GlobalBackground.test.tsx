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
    img: ({ src }: { src: string }) => <span data-image-source={src} />,
  },
}))

vi.mock("@/images/Background.svg?url", () => ({
  default: { src: "/background-zero.svg" },
}))
vi.mock("@/images/Background-1.svg?url", () => ({
  default: { src: "/background-one.svg" },
}))
vi.mock("@/images/Background-2.svg?url", () => ({
  default: { src: "/background-two.svg" },
}))
vi.mock("@/images/Background-3.svg?url", () => ({
  default: { src: "/background-three.svg" },
}))
vi.mock("@/images/Background-4.svg?url", () => ({
  default: { src: "/background-four.svg" },
}))
vi.mock("@/images/Background-5.svg?url", () => ({
  default: { src: "/background-five.svg" },
}))
vi.mock("@/images/Background-6.svg?url", () => ({
  default: { src: "/background-six.svg" },
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

  it("renders animated ambient layers when motion is allowed", async () => {
    const { container } = render(<GlobalBackground shouldRenderAmbientMotion />)

    const particleField = await screen.findByLabelText("Particle field")
    expect(particleField).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute("data-ambient-motion", "true")
    expect(container.firstChild).toHaveClass("animate-rainbow-vivid")
    expect(
      container.querySelector('[data-transition-duration="20"]'),
    ).toBeInTheDocument()
    expect(container.querySelector("[data-image-source]")).toHaveAttribute(
      "data-image-source",
      "/background-three.svg",
    )
  })

  it("keeps the static pattern on the theme color when motion is reduced", () => {
    reducedMotionPreference.value = true
    backgroundState.bgUseInverse = true
    const { container } = render(<GlobalBackground shouldRenderAmbientMotion />)

    expect(screen.queryByLabelText("Particle field")).not.toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute("data-ambient-motion", "false")
    expect(container.firstChild).not.toHaveClass("animate-rainbow-vivid")
    expect(
      container.querySelector('[data-transition-duration="0"]'),
    ).toBeInTheDocument()
    expect(container.querySelector("[data-image-source]")).toHaveAttribute(
      "data-image-source",
      "/background-zero.svg",
    )
  })

  it("renders the active inverse background when motion is allowed", () => {
    backgroundState.bgIndex = 0
    backgroundState.bgUseInverse = true

    const { container } = render(<GlobalBackground shouldRenderAmbientMotion />)

    expect(container.querySelector("[data-image-source]")).toHaveAttribute(
      "data-image-source",
      "/background-one.svg",
    )
  })

  it("starts color motion with a static pattern while particles stay dormant", () => {
    const { container } = render(
      <GlobalBackground shouldRenderAmbientMotion={false} />,
    )

    expect(screen.queryByLabelText("Particle field")).not.toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute("data-ambient-motion", "false")
    expect(container.firstChild).toHaveClass("animate-rainbow-vivid")
    expect(
      container.querySelector('[data-transition-duration="0"]'),
    ).toBeInTheDocument()
    expect(container.querySelector("[data-image-source]")).toHaveAttribute(
      "data-image-source",
      "/background-zero.svg",
    )
  })
})
