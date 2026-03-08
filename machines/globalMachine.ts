import { setup } from "xstate"
import { createActorContext } from "@xstate/react"

export const globalMachine = setup({
  types: {
    context: {} as Record<string, never>,
    events: {} as { type: "TOGGLE_LOGO" },
  },
}).createMachine({
  id: "global",
  initial: "alternative",
  context: {},
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
})

export const GlobalStateContext = createActorContext(globalMachine)
