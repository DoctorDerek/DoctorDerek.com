import { afterEach, describe, expect, it, vi } from "vitest"
import { createActor } from "xstate"
import { BACKGROUND_COUNT, globalMachine } from "@/machines/globalMachine"

describe("globalMachine", () => {
  afterEach(() => vi.restoreAllMocks())

  it("cycles backgrounds deterministically and counts every logo flip", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75)
    const actor = createActor(globalMachine).start()

    expect(actor.getSnapshot().context).toEqual({
      bgIndex: 0,
      bgUseInverse: false,
      logoFlipCount: 0,
    })

    actor.send({ type: "CYCLE_BACKGROUND" })
    expect(actor.getSnapshot().context).toMatchObject({
      bgIndex: 1,
      bgUseInverse: true,
    })

    for (let cycleIndex = 1; cycleIndex < BACKGROUND_COUNT; cycleIndex += 1)
      actor.send({ type: "CYCLE_BACKGROUND" })
    expect(actor.getSnapshot().context.bgIndex).toBe(0)

    actor.send({ type: "TOGGLE_LOGO" })
    actor.send({ type: "TOGGLE_LOGO" })
    expect(actor.getSnapshot().context.logoFlipCount).toBe(2)

    actor.stop()
  })

  it("keeps the diff calibration topology unreachable at runtime", () => {
    const actor = createActor(globalMachine).start()
    const initialSnapshot = actor.getSnapshot()

    actor.send({ type: "XSTATE_DIFF_CALIBRATION_PROBE" })

    expect(actor.getSnapshot().value).toEqual(initialSnapshot.value)
    expect(actor.getSnapshot().context).toEqual(initialSnapshot.context)

    actor.stop()
  })
})
