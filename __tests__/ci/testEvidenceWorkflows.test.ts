import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import { describe, expect, it } from "vitest"

const workflowPaths = {
  vitest: ".github/workflows/eslint-vitest-xstate.yml",
  playwright: ".github/workflows/playwright.yml",
}

const readStep = (runner: keyof typeof workflowPaths, name: string) => {
  const workflow = fs
    .readFileSync(workflowPaths[runner], "utf8")
    .replaceAll("\r\n", "\n")
  const step = workflow
    .split(`      - name: ${name}\n`)[1]
    ?.split("\n      - name:")[0]
  if (!step) throw new Error(`Missing workflow step: ${name}`)
  return step
}

interface EvidenceManifest {
  commit: string
  runnerExitCode: string
  status: string
  missingReports: string[]
  missingContributors: string[]
  incompleteContributors?: string[]
  incompleteTests?: string[]
  validCoverage?: boolean
  browserCodeCoverage?: string
}

const inspectEvidence = async (
  runner: keyof typeof workflowPaths,
  files: Map<string, string>,
  exitCode = "0",
  deploymentCommit = "tested-commit",
) => {
  const step = readStep(
    runner,
    `Inspect ${runner === "vitest" ? "Vitest" : "Playwright"} Evidence`,
  )
  const script = step
    .split("          script: |\n")[1]!
    .split("\n")
    .map((line) => line.replace(/^            /, ""))
    .join("\n")
  const outputs = new Map<string, string>()
  const warnings: string[] = []
  const summary = {
    addHeading: () => summary,
    addCodeBlock: () => summary,
    write: async () => undefined,
  }
  const readFileSync = (file: string) => {
    const content = files.get(file)
    if (content === undefined) throw new Error(`Missing test fixture: ${file}`)
    return content
  }
  await vm.runInNewContext(`(async () => {${script}})()`, {
    require: (module: string) => {
      if (module === "node:path") return path.posix
      if (module === "node:child_process")
        return {
          execFileSync: (_command: string, args: string[]) =>
            args[0] === "rev-parse"
              ? "tested-commit"
              : "__tests__/sample.test.ts\0src/sample.ts\0",
        }
      if (module === "node:fs")
        return {
          mkdirSync: () => undefined,
          existsSync: (file: string) => files.has(file),
          statSync: (file: string) => ({ size: readFileSync(file).length }),
          readFileSync,
          writeFileSync: (file: string, content: string) =>
            files.set(file, content),
        }
      throw new Error(`Unexpected module: ${module}`)
    },
    process: {
      cwd: () => "/repo",
      env: {
        RUNNER_TEMP: "/temp",
        VITEST_EXIT_CODE: exitCode,
        PLAYWRIGHT_EXIT_CODE: exitCode,
      },
    },
    context: { payload: { deployment: { sha: deploymentCommit } } },
    core: {
      setOutput: (name: string, value: string) => outputs.set(name, value),
      exportVariable: (name: string, value: string) => outputs.set(name, value),
      warning: (message: string) => warnings.push(message),
      summary,
    },
  })
  const manifest: EvidenceManifest = JSON.parse(
    files.get(outputs.get("manifest")!)!,
  )
  return { manifest, outputs, warnings }
}

const vitestFiles = (status = "passed") =>
  new Map([
    [
      "test-results/vitest.json",
      JSON.stringify({
        testResults: [
          {
            name: "/repo/__tests__/sample.test.ts",
            assertionResults: [{ status }],
          },
        ],
      }),
    ],
    ["coverage/lcov.info", "TN:\nSF:src/sample.ts\nDA:1,1\nend_of_record\n"],
    ["coverage/coverage-final.json", "{}"],
    ["coverage/index.html", "<html>coverage</html>"],
    ["src/sample.ts", "export const sample = 1\n"],
  ])

const playwrightFiles = (
  status = "passed",
  projects = ["chromium", "firefox", "webkit"],
) =>
  new Map([
    ["playwright-report/index.html", "<html>test results</html>"],
    [
      "test-results/playwright.json",
      JSON.stringify({
        config: {
          projects: ["chromium", "firefox", "webkit"].map((name) => ({ name })),
        },
        errors: [],
        suites: [
          {
            suites: [
              {
                specs: [
                  {
                    title: "critical flow",
                    tests: projects.map((projectName) => ({
                      projectName,
                      results: [{ status }],
                    })),
                  },
                ],
              },
            ],
          },
        ],
      }),
    ],
  ])

describe("failure-safe Vitest evidence", () => {
  it("accepts tracked assets with zero executable lines alongside real source coverage", async () => {
    const files = vitestFiles()
    files.set(
      "coverage/lcov.info",
      "TN:\nSF:src/sample.ts\nDA:1,1\nend_of_record\nTN:\nSF:src/sample.ts\nLF:0\nend_of_record\n",
    )
    expect(
      (await inspectEvidence("vitest", files)).outputs.get("complete"),
    ).toBe("true")
  })
  it.each(["passed", "failed"])(
    "preserves complete evidence for %s assertions without replacing the exit code",
    async (status) => {
      const exitCode = status === "failed" ? "1" : "0"
      const { manifest, outputs } = await inspectEvidence(
        "vitest",
        vitestFiles(status),
        exitCode,
      )
      expect(manifest).toMatchObject({
        status: "complete",
        commit: "tested-commit",
        runnerExitCode: exitCode,
        validCoverage: true,
      })
      expect(outputs.get("complete")).toBe("true")
    },
  )

  it.each([
    "coverage/lcov.info",
    "coverage/coverage-final.json",
    "coverage/index.html",
    "test-results/vitest.json",
  ])("does not call missing %s complete coverage", async (missing) => {
    const files = vitestFiles()
    files.delete(missing)
    const { manifest, outputs, warnings } = await inspectEvidence(
      "vitest",
      files,
    )
    expect(manifest.status).toBe("unavailable-or-partial")
    expect(manifest.missingReports).toContain(missing)
    expect(outputs.get("complete")).toBe("false")
    expect(warnings).toHaveLength(1)
  })

  it("identifies unexecuted contributors rather than comparing partial coverage", async () => {
    const files = vitestFiles()
    files.set("test-results/vitest.json", JSON.stringify({ testResults: [] }))
    const { manifest } = await inspectEvidence("vitest", files, "1")
    expect(manifest.missingContributors).toEqual(["__tests__/sample.test.ts"])
    expect(manifest.status).toBe("unavailable-or-partial")
  })

  it("identifies skipped assertions as incomplete evidence", async () => {
    const { manifest } = await inspectEvidence("vitest", vitestFiles("pending"))
    expect(manifest.incompleteContributors).toEqual([
      "__tests__/sample.test.ts",
    ])
    expect(manifest.status).toBe("unavailable-or-partial")
  })

  it.each([
    "TN:\nSF:../private.ts\nDA:1,1\nend_of_record",
    "TN:\nSF:src/sample.ts\nDA:99,1\nend_of_record",
    "TN:\nSF:src/sample.ts\nDA:1,1",
  ])(
    "rejects invalid source mappings or unfinished LCOV records",
    async (lcov) => {
      const files = vitestFiles()
      files.set("coverage/lcov.info", lcov)
      expect(
        (await inspectEvidence("vitest", files)).outputs.get("complete"),
      ).toBe("false")
    },
  )

  it("handles malformed reports as unavailable, not zero coverage", async () => {
    const files = vitestFiles()
    files.set("test-results/vitest.json", "not JSON")
    expect((await inspectEvidence("vitest", files)).manifest.status).toBe(
      "unavailable-or-partial",
    )
  })
})

describe("failure-safe Playwright evidence", () => {
  it("does not call evidence from a different deployment commit complete", async () => {
    const { manifest } = await inspectEvidence(
      "playwright",
      playwrightFiles(),
      "0",
      "other-commit",
    )
    expect(manifest.status).toBe("unavailable-or-partial")
  })

  it("does not call an empty browser suite complete", async () => {
    const { manifest } = await inspectEvidence(
      "playwright",
      playwrightFiles("passed", []),
    )
    expect(manifest.status).toBe("unavailable-or-partial")
    expect(manifest.missingContributors).toHaveLength(3)
  })
  it.each(["passed", "failed"])(
    "retains %s browser results without claiming code coverage",
    async (status) => {
      const exitCode = status === "failed" ? "1" : "0"
      const { manifest } = await inspectEvidence(
        "playwright",
        playwrightFiles(status),
        exitCode,
      )
      expect(manifest).toMatchObject({
        status: "complete",
        runnerExitCode: exitCode,
        missingContributors: [],
      })
      expect(manifest.browserCodeCoverage).toContain("Not instrumented")
    },
  )

  it("names a missing browser contributor", async () => {
    const { manifest } = await inspectEvidence(
      "playwright",
      playwrightFiles("passed", ["chromium", "webkit"]),
    )
    expect(manifest.missingContributors).toEqual(["firefox"])
    expect(manifest.status).toBe("unavailable-or-partial")
  })

  it.each(["interrupted", "skipped"])(
    "does not treat %s tests as complete evidence",
    async (status) => {
      const { manifest } = await inspectEvidence(
        "playwright",
        playwrightFiles(status),
        "1",
      )
      expect(manifest.incompleteTests).toHaveLength(3)
      expect(manifest.status).toBe("unavailable-or-partial")
    },
  )

  it("preserves an HTML report while identifying missing machine-readable results", async () => {
    const files = playwrightFiles()
    files.delete("test-results/playwright.json")
    const { manifest } = await inspectEvidence("playwright", files, "1")
    expect(manifest.missingReports).toEqual(["test-results/playwright.json"])
    expect(manifest.status).toBe("unavailable-or-partial")
    expect(files.has("playwright-report/index.html")).toBe(true)
  })
})

describe("workflow failure enforcement", () => {
  it.each(["vitest", "playwright"] as const)(
    "reports %s evidence as partial when the runner exit status is unavailable",
    async (runner) => {
      const files = runner === "vitest" ? vitestFiles() : playwrightFiles()
      expect(
        (await inspectEvidence(runner, files, "unavailable")).manifest.status,
      ).toBe("unavailable-or-partial")
    },
  )
  it.each(["vitest", "playwright"] as const)(
    "keeps %s runner failure authoritative after tee",
    (runner) => {
      const name =
        runner === "vitest"
          ? "Run Vitest and Capture Summary"
          : "Run Playwright Tests and Capture Summary"
      const step = readStep(runner, name)
      const variable = `${runner.toUpperCase()}_EXIT_CODE`
      expect(step).toContain(`${variable}=\${PIPESTATUS[0]}`)
      expect(step).toContain(`exit "$${variable}"`)
      expect(step).not.toContain("continue-on-error")
      expect(
        readStep(
          runner,
          runner === "vitest"
            ? "Enforce Test and Tooling Results"
            : "Enforce Playwright Result",
        ),
      ).toContain("!cancelled()")
    },
  )

  it("attempts failure-time uploads with bounded cancellation and existing retention", () => {
    for (const [runner, name] of [
      ["vitest", "Upload Vitest Evidence"],
      ["playwright", "Upload Playwright Report"],
    ] as const) {
      const step = readStep(runner, name)
      expect(step).toContain("!cancelled()")
      expect(step).toContain("retention-days: 14")
      expect(step).toContain("if-no-files-found: error")
    }
    expect(readStep("playwright", "Upload Playwright Report")).toContain(
      "test-results/",
    )
    expect(readStep("vitest", "Upload coverage to Codecov")).toContain(
      "steps.vitest-evidence.outputs.complete == 'true'",
    )
  })
})
