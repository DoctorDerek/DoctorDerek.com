import { createActorContext } from "@xstate/react"
import { assign, setup } from "xstate"

export const BACKGROUND_COUNT = 5

export const globalMachine = setup({
  types: {
    context: {} as {
      bgIndex: number
      bgUseInverse: boolean
      logoFlipCount: number
    },
    events: {} as
      | { type: "TOGGLE_LOGO" }
      | { type: "CYCLE_BACKGROUND" }
      | { type: "XSTATE_DIFF_CALIBRATION_PROBE" },
  },
  guards: {
    calibrationProbeEnabled: () => false,
  },
  actions: {
    cycleBackground: assign(({ context }) => {
      const nextIndex = (context.bgIndex + 1) % BACKGROUND_COUNT
      const useInverse = Math.random() > 0.5
      return {
        bgIndex: nextIndex,
        bgUseInverse: useInverse,
      }
    }),
    incrementLogoFlipCount: assign({
      logoFlipCount: ({ context }) => context.logoFlipCount + 1,
    }),
  },
}).createMachine({
  id: "global",
  type: "parallel",
  context: {
    bgIndex: 0,
    bgUseInverse: false,
    logoFlipCount: 0,
  },
  states: {
    logo: {
      initial: "alternative",
      states: {
        alternative: {
          on: {
            TOGGLE_LOGO: {
              actions: "incrementLogoFlipCount",
              target: "cropped",
            },
            XSTATE_DIFF_CALIBRATION_PROBE: {
              guard: "calibrationProbeEnabled",
              target: "calibrationProbeComplete",
            },
          },
        },
        calibrationProbeComplete: {
          type: "final",
        },
        cropped: {
          on: {
            TOGGLE_LOGO: {
              actions: "incrementLogoFlipCount",
              target: "alternative",
            },
          },
        },
      },
    },
    background: {
      initial: "active",
      states: {
        active: {
          after: {
            21000: {
              actions: "cycleBackground",
              target: "active",
            },
          },
          on: {
            CYCLE_BACKGROUND: {
              actions: "cycleBackground",
              target: "active",
            },
          },
        },
      },
    },
  },
})

export const GlobalStateContext = createActorContext(globalMachine)
