import { assign, setup } from "xstate"
import { createActorContext } from "@xstate/react"

export const BACKGROUND_COUNT = 5

export const globalMachine = setup({
  types: {
    context: {} as {
      bgIndex: number
      bgUseInverse: boolean
    },
    events: {} as { type: "TOGGLE_LOGO" } | { type: "CYCLE_BACKGROUND" },
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
  },
}).createMachine({
  id: "global",
  type: "parallel",
  context: {
    bgIndex: 0,
    bgUseInverse: false,
  },
  states: {
    logo: {
      initial: "alternative",
      states: {
        alternative: {
          on: {
            TOGGLE_LOGO: "cropped",
          },
        },
        cropped: {
          on: {
            TOGGLE_LOGO: "alternative",
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
