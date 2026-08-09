import { describe, expect, it } from "vitest"
import { extractMachineTopologies } from "@/scripts/xstate-diff/extractMachineTopologies"
import {
  XSTATE_DIFF_LIMITS,
  XStateAnalysisLimitError,
} from "@/scripts/xstate-diff/xstateDiffModel"

const extractFixture = (sourceText: string) =>
  extractMachineTopologies([
    { filePath: "machines/checkoutMachine.ts", sourceText },
  ])

describe("extractMachineTopologies", () => {
  it("extracts compound, parallel, final, guarded, delayed, automatic, and actor transitions", () => {
    const { machines, diagnostics } = extractFixture(`
      import { setup } from "xstate"

      export const checkoutMachine = setup({}).createMachine({
        id: "checkout",
        type: "parallel",
        states: {
          flow: {
            initial: "idle",
            states: {
              idle: {
                on: {
                  START: [
                    { guard: "canStart", target: "running" },
                    { target: "#checkout.failure" },
                  ],
                  RESUME: "#activeWork.done",
                },
              },
              running: {
                id: "activeWork",
                initial: "waiting",
                states: {
                  waiting: { after: { 500: "done" } },
                  done: { type: "final" },
                },
                always: ".done",
                onDone: "#checkout.failure",
                onError: "idle",
                invoke: {
                  src: "persistOrder",
                  onDone: "#checkout.failure",
                  onError: "idle",
                },
              },
            },
          },
          failure: { type: "final" },
        },
      })
    `)

    expect(diagnostics).toEqual([])
    expect(machines).toHaveLength(1)

    const [machine] = machines
    expect(machine).toMatchObject({
      id: "checkout",
      variableName: "checkoutMachine",
      key: "machines/checkoutMachine.ts#checkout",
    })
    expect(machine.nodes).toHaveLength(7)
    expect(machine.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "checkout", type: "parallel" }),
        expect.objectContaining({
          id: "checkout.flow",
          type: "compound",
          initialChildId: "checkout.flow.idle",
        }),
        expect.objectContaining({
          id: "checkout.flow.running",
          explicitId: "activeWork",
          initialChildId: "checkout.flow.running.waiting",
        }),
        expect.objectContaining({
          id: "checkout.flow.running.done",
          type: "final",
        }),
      ]),
    )
    expect(machine.transitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: "checkout.flow.idle",
          event: "START",
          targetId: "checkout.flow.running",
          guard: "canStart",
          priority: 0,
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.idle",
          event: "START",
          targetId: "checkout.failure",
          priority: 1,
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.idle",
          event: "RESUME",
          targetId: "checkout.flow.running.done",
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.running",
          kind: "always",
          targetId: "checkout.flow.running.done",
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.running.waiting",
          kind: "after",
          event: "500",
          targetId: "checkout.flow.running.done",
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.running",
          kind: "onDone",
          event: "invoke[0].onDone",
          targetId: "checkout.failure",
        }),
        expect.objectContaining({
          sourceId: "checkout.flow.running",
          kind: "onError",
          event: "invoke[0].onError",
          targetId: "checkout.flow.idle",
        }),
      ]),
    )
  })

  it("extracts multiple createMachine calls without executing malicious top-level code", () => {
    delete (globalThis as typeof globalThis & { xstateDiffExecuted?: boolean })
      .xstateDiffExecuted

    const sourceText = `
      globalThis.xstateDiffExecuted = true
      const firstMachine = createMachine({ id: "first", states: { ready: {} } })
      const secondMachine = createMachine({
        id: "second",
        states: {
          waiting: { on: { PING: { actions: "trackPing" } } },
        },
      })
    `
    const firstResult = extractMachineTopologies([
      { filePath: "machines\\twoMachines.ts", sourceText },
      {
        filePath: "machines/zMachine.ts",
        sourceText: `const zMachine = createMachine({ id: "z", states: {} })`,
      },
    ])
    const secondResult = extractMachineTopologies([
      {
        filePath: "machines/zMachine.ts",
        sourceText: `const zMachine = createMachine({ id: "z", states: {} })`,
      },
      { filePath: "machines/twoMachines.ts", sourceText },
    ])

    expect(
      (globalThis as typeof globalThis & { xstateDiffExecuted?: boolean })
        .xstateDiffExecuted,
    ).toBeUndefined()
    expect(firstResult).toEqual(secondResult)
    expect(firstResult.machines.map((machine) => machine.id)).toEqual([
      "first",
      "second",
      "z",
    ])
    expect(firstResult.machines[1]?.transitions[0]).toMatchObject({
      sourceId: "second.waiting",
      targetId: null,
      event: "PING",
    })
  })

  it("reports unsupported dynamic topology and unresolved targets without guessing", () => {
    const { machines, diagnostics } = extractFixture(`
      const dynamicMachine = createMachine(buildConfiguration())
      const analyzableMachine = createMachine({
        id: "analyzable",
        states: {
          ...dynamicStates,
          ready: {
            on: {
              [dynamicEvent]: { target: getTarget(), guard: () => true },
              STATIC: { target: "missing", guard: () => true },
            },
          },
          [dynamicState]: {},
        },
      })
    `)

    expect(machines.map((machine) => machine.id)).toEqual(["analyzable"])
    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(
      expect.arrayContaining([
        "unsupported-machine-configuration",
        "unsupported-state-property",
        "unsupported-state-configuration",
        "unsupported-transition-event",
        "unsupported-inline-guard",
        "unresolved-transition-target",
      ]),
    )
    expect(
      machines[0]?.transitions.find(
        (transition) => transition.event === "STATIC",
      ),
    ).toMatchObject({
      targetId: null,
      unresolvedTarget: "missing",
      guard: "<inline guard>",
    })
  })

  it("preserves transition target order for orthogonal targets", () => {
    const { machines } = extractFixture(`
      const machine = createMachine({
        id: "parallelTarget",
        type: "parallel",
        on: { RESET: { target: ["left", "right"] } },
        states: { left: {}, right: {} },
      })
    `)

    expect(machines[0]?.transitions).toEqual([
      expect.objectContaining({
        event: "RESET",
        targetId: "parallelTarget.left",
        targetIndex: 0,
      }),
      expect.objectContaining({
        event: "RESET",
        targetId: "parallelTarget.right",
        targetIndex: 1,
      }),
    ])
  })

  it("rejects source collections and graphs beyond explicit analysis limits", () => {
    expect(() =>
      extractMachineTopologies(
        Array.from(
          { length: XSTATE_DIFF_LIMITS.maximumFiles + 1 },
          (_, fileIndex) => ({
            filePath: `machine-${fileIndex}.ts`,
            sourceText: "",
          }),
        ),
      ),
    ).toThrow(XStateAnalysisLimitError)

    const oversizedStates = Array.from(
      { length: XSTATE_DIFF_LIMITS.maximumNodesPerMachine + 1 },
      (_, stateIndex) => `state${stateIndex}: {}`,
    ).join(",")

    expect(() =>
      extractFixture(
        `const machine = createMachine({ id: "large", states: { ${oversizedStates} } })`,
      ),
    ).toThrow("exceeds 1000 states")
  })
})
